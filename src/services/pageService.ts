import {
  initFirebase,
  firestoreDb,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  collection,
  writeBatch,
  onSnapshot,
} from '../lib/firebase';
import { WebsitePage } from '../types';
import { INITIAL_WEBSITE_TEMPLATES } from '../data/initialTemplates';
import { getActiveWorkspaceId } from './workspaceService';
import {
  isFirestoreQuotaExceeded,
  markFirestoreQuotaExceeded,
  resetFirestoreQuotaStatus,
  handleFirestoreError,
  isQuotaError,
} from '../lib/firestoreQuota';
import { recordFirestoreOperation } from './firebaseUsageService';

export {
  isFirestoreQuotaExceeded,
  markFirestoreQuotaExceeded,
  resetFirestoreQuotaStatus,
  handleFirestoreError,
  isQuotaError,
};

const inMemoryPagesCache: Record<string, WebsitePage[]> = {};
const lastSavedPageHashes: Record<string, string> = {};

export function computePageContentHash(page: WebsitePage): string {
  return JSON.stringify({
    id: page.id,
    title: page.title || '',
    fileName: page.fileName || '',
    sections: page.sections || [],
    globalStyles: page.globalStyles || {},
    siteSettings: page.siteSettings || {},
  });
}

export interface PagesSyncStatus {
  fromCache: boolean;
  hasPendingWrites: boolean;
  pageCount: number;
}

export function getLocalPagesKey(userId?: string, workspaceId?: string): string {
  const wsId = workspaceId || getActiveWorkspaceId();
  const base = userId ? userId : 'anon';
  if (!wsId || wsId === 'workspace-default') {
    return `local_pages_${base}`;
  }
  return `local_pages_${base}_${wsId}`;
}

export function getLocalPagesCache(userId?: string, workspaceId?: string): WebsitePage[] | null {
  const wsId = workspaceId || getActiveWorkspaceId();
  const key = `${userId || 'anon'}_${wsId}`;
  const cached = inMemoryPagesCache[key];
  if (cached && Array.isArray(cached)) {
    return cached;
  }
  if (typeof window !== 'undefined') {
    try {
      const localKey = getLocalPagesKey(userId, wsId);
      const raw =
        localStorage.getItem(localKey) ||
        localStorage.getItem(`myoffice_${localKey}`) ||
        (wsId === 'workspace-default' ? localStorage.getItem(`myoffice_local_pages_${userId || 'anon'}`) : null);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          inMemoryPagesCache[key] = parsed;
          return parsed;
        }
      }
    } catch {}
  }
  if (wsId && wsId !== 'workspace-default') {
    return [];
  }
  return null;
}

export function setLocalPagesCache(pages: WebsitePage[], userId?: string, workspaceId?: string): void {
  const wsId = workspaceId || getActiveWorkspaceId();
  const key = `${userId || 'anon'}_${wsId}`;
  inMemoryPagesCache[key] = pages;
}

function sanitizePageForFirestore(page: WebsitePage, userId: string): Record<string, any> {
  const payload = {
    id: page.id,
    ownerId: userId,
    title: page.title || 'Untitled Page',
    fileName: page.fileName || 'index.html',
    sections: page.sections || [],
    globalStyles: page.globalStyles || {},
    siteSettings: page.siteSettings || {},
    createdAt: (page as any).createdAt || new Date().toISOString(),
    updatedAt: (page as any).updatedAt || new Date().toISOString(),
  };
  
  return JSON.parse(JSON.stringify(payload));
}

export async function savePageToFirestore(page: WebsitePage, userId: string, workspaceId?: string): Promise<boolean> {
  if (!page) return false;

  const wsId = workspaceId || getActiveWorkspaceId();
  const localKey = getLocalPagesKey(userId, wsId);
  try {
    const raw = localStorage.getItem(localKey);
    let currentLocal: WebsitePage[] = raw ? JSON.parse(raw) : [];
    const idx = currentLocal.findIndex((p) => p.id === page.id);
    if (idx >= 0) {
      currentLocal[idx] = page;
    } else {
      currentLocal = [page, ...currentLocal];
    }
    localStorage.setItem(localKey, JSON.stringify(currentLocal));
    setLocalPagesCache(currentLocal, userId, wsId);
  } catch (e) {
    console.warn('Failed to save page to local cache:', e);
  }

  if (!userId) return true;

  if (isFirestoreQuotaExceeded()) {
    return true; 
  }

  try {
    const { db, isConfigured } = initFirebase();
    const currentDb = db || firestoreDb;

    if (!isConfigured || !currentDb) {
      return true;
    }

    const currentHash = computePageContentHash(page);
    if (lastSavedPageHashes[`${wsId}_${page.id}`] === currentHash) {
      return true; 
    }

    const pageDocRef = (!wsId || wsId === 'workspace-default')
      ? doc(currentDb, 'users', userId, 'pages', page.id)
      : doc(currentDb, 'users', userId, 'workspaces', wsId, 'pages', page.id);

    const cleanedPageData = sanitizePageForFirestore(page, userId);

    await setDoc(pageDocRef, cleanedPageData, { merge: true });
    recordFirestoreOperation('write', 1, new Blob([JSON.stringify(cleanedPageData)]).size);
    lastSavedPageHashes[`${wsId}_${page.id}`] = currentHash;

    return true;
  } catch (err: any) {
    if (
      err?.code === 'resource-exhausted' ||
      err?.message?.includes('Quota limit exceeded') ||
      err?.message?.includes('quota')
    ) {
      markFirestoreQuotaExceeded();
      console.warn('Firestore daily write quota reached; safely operating in local storage mode.');
      return true;
    }
    console.warn(`Failed to save page ${page.id} to Firestore:`, err);
    throw err;
  }
}

export async function saveAllPagesToFirestore(pages: WebsitePage[], userId: string, force = false, workspaceId?: string): Promise<void> {
  if (!pages || pages.length === 0) return;

  const wsId = workspaceId || getActiveWorkspaceId();
  const localKey = getLocalPagesKey(userId, wsId);
  try {
    localStorage.setItem(localKey, JSON.stringify(pages));
    setLocalPagesCache(pages, userId, wsId);
  } catch (e) {
    console.warn('Failed to save all pages to local cache:', e);
  }

  if (!userId) return;

  if (isFirestoreQuotaExceeded() && !force) {
    return;
  }

  try {
    const { db, isConfigured } = initFirebase();
    const currentDb = db || firestoreDb;

    if (!isConfigured || !currentDb) {
      return;
    }

    const pagesToSave: WebsitePage[] = [];
    for (const page of pages) {
      const hash = computePageContentHash(page);
      if (force || lastSavedPageHashes[`${wsId}_${page.id}`] !== hash) {
        pagesToSave.push(page);
      }
    }

    const pagesCollectionRef = (!wsId || wsId === 'workspace-default')
      ? collection(currentDb, 'users', userId, 'pages')
      : collection(currentDb, 'users', userId, 'workspaces', wsId, 'pages');

    let existingDocIds: string[] = [];
    try {
      const snapshot = await getDocs(pagesCollectionRef);
      existingDocIds = snapshot.docs.map((d) => d.id);
    } catch (e: any) {
      if (e?.code === 'resource-exhausted' || e?.message?.includes('Quota limit exceeded')) {
        markFirestoreQuotaExceeded();
        return;
      }
    }

    const activeIds = new Set(pages.map((p) => p.id));
    const deletedIds = existingDocIds.filter((id) => !activeIds.has(id));

    if (pagesToSave.length === 0 && deletedIds.length === 0) {
      return;
    }

    const batch = writeBatch(currentDb);

    for (const page of pagesToSave) {
      const pageDocRef = (!wsId || wsId === 'workspace-default')
        ? doc(currentDb, 'users', userId, 'pages', page.id)
        : doc(currentDb, 'users', userId, 'workspaces', wsId, 'pages', page.id);
      const cleaned = sanitizePageForFirestore(page, userId);
      batch.set(pageDocRef, cleaned, { merge: true });
    }

    for (const delId of deletedIds) {
      const delDocRef = (!wsId || wsId === 'workspace-default')
        ? doc(currentDb, 'users', userId, 'pages', delId)
        : doc(currentDb, 'users', userId, 'workspaces', wsId, 'pages', delId);
      batch.delete(delDocRef);
    }

    const targetDocRef = (!wsId || wsId === 'workspace-default')
      ? doc(currentDb, 'users', userId)
      : doc(currentDb, 'users', userId, 'workspaces', wsId);

    batch.set(targetDocRef, { 
      pageCount: pages.length,
      updatedAt: new Date().toISOString() 
    }, { merge: true });

    await batch.commit();
    if (pagesToSave.length > 0) {
      recordFirestoreOperation('write', pagesToSave.length);
    }
    if (deletedIds.length > 0) {
      recordFirestoreOperation('delete', deletedIds.length);
    }

    for (const page of pagesToSave) {
      lastSavedPageHashes[`${wsId}_${page.id}`] = computePageContentHash(page);
    }
    for (const delId of deletedIds) {
      delete lastSavedPageHashes[`${wsId}_${delId}`];
    }
  } catch (err: any) {
    if (
      err?.code === 'resource-exhausted' ||
      err?.message?.includes('Quota limit exceeded') ||
      err?.message?.includes('quota')
    ) {
      markFirestoreQuotaExceeded();
      console.warn('Firestore daily write quota reached (20,000 writes/day free tier). All changes safely retained locally.');
      return;
    }
    console.warn('Failed atomic batch save of pages to Firestore:', err);
    throw err;
  }
}

export function subscribeToUserPages(
  userId: string,
  onUpdate: (pages: WebsitePage[], status: PagesSyncStatus) => void,
  onError?: (err: Error) => void,
  workspaceId?: string
): () => void {
  const wsId = workspaceId || getActiveWorkspaceId();
  if (!userId) {
    const fallback = getLocalPagesCache(undefined, wsId) ?? (wsId && wsId !== 'workspace-default' ? [] : INITIAL_WEBSITE_TEMPLATES);
    onUpdate(fallback, { fromCache: true, hasPendingWrites: false, pageCount: fallback.length });
    return () => {};
  }

  const { db, auth, isConfigured } = initFirebase();
  const currentDb = db || firestoreDb;

  if (!isConfigured || !currentDb) {
    const fallback = getLocalPagesCache(userId, wsId) ?? (wsId && wsId !== 'workspace-default' ? [] : INITIAL_WEBSITE_TEMPLATES);
    onUpdate(fallback, { fromCache: true, hasPendingWrites: false, pageCount: fallback.length });
    return () => {};
  }

  if (auth && !auth.currentUser) {
    const fallback = getLocalPagesCache(userId, wsId) ?? (wsId && wsId !== 'workspace-default' ? [] : INITIAL_WEBSITE_TEMPLATES);
    onUpdate(fallback, { fromCache: true, hasPendingWrites: false, pageCount: fallback.length });
    return () => {};
  }

  const pagesCollectionRef = (!wsId || wsId === 'workspace-default')
    ? collection(currentDb, 'users', userId, 'pages')
    : collection(currentDb, 'users', userId, 'workspaces', wsId, 'pages');

  const unsubscribe = onSnapshot(
    pagesCollectionRef,
    { includeMetadataChanges: true },
    (snapshot) => {
      const isFromCache = snapshot.metadata.fromCache;
      const hasPendingWrites = snapshot.metadata.hasPendingWrites;

      if (snapshot.empty) {
        setLocalPagesCache([], userId, wsId);
        try {
          localStorage.setItem(getLocalPagesKey(userId, wsId), JSON.stringify([]));
        } catch {}
        onUpdate([], { fromCache: isFromCache, hasPendingWrites, pageCount: 0 });
        return;
      }

      const loadedPages: WebsitePage[] = [];
      const legacyDeletions: Promise<void>[] = [];

      snapshot.forEach((docSnap) => {
        if (docSnap.id === 'site-monochrome-olive') {
          if (!isFirestoreQuotaExceeded()) {
            legacyDeletions.push(deleteDoc(doc(currentDb, 'users', userId, 'pages', 'site-monochrome-olive')).catch(() => {}));
          }
          return;
        }
        const data = docSnap.data() as WebsitePage;
        if (data && data.id && data.title && data.id !== 'site-monochrome-olive') {
          loadedPages.push({
            id: data.id,
            title: data.title,
            fileName: data.fileName || 'index.html',
            sections: data.sections || [],
            globalStyles: data.globalStyles || {},
            siteSettings: data.siteSettings || {},
            ...(data as any).createdAt ? { createdAt: (data as any).createdAt } : {},
            ...(data as any).updatedAt ? { updatedAt: (data as any).updatedAt } : {},
          } as WebsitePage);
        }
      });

      if (legacyDeletions.length > 0) {
        Promise.all(legacyDeletions).catch((e) => console.warn('Failed to cleanup legacy default page:', e));
      }

      if (loadedPages.length === 0) {
        setLocalPagesCache([], userId, wsId);
        try {
          localStorage.setItem(getLocalPagesKey(userId, wsId), JSON.stringify([]));
        } catch {}
        onUpdate([], { fromCache: isFromCache, hasPendingWrites, pageCount: 0 });
        return;
      }

      if (loadedPages.length > 0) {
        
        loadedPages.sort((a, b) => {
          if (a.fileName === 'index.html' && b.fileName !== 'index.html') return -1;
          if (b.fileName === 'index.html' && a.fileName !== 'index.html') return 1;
          const timeA = (a as any).createdAt ? new Date((a as any).createdAt).getTime() : 0;
          const timeB = (b as any).createdAt ? new Date((b as any).createdAt).getTime() : 0;
          return timeA - timeB;
        });

        setLocalPagesCache(loadedPages, userId, wsId);
        try {
          localStorage.setItem(getLocalPagesKey(userId, wsId), JSON.stringify(loadedPages));
        } catch {}

        onUpdate(loadedPages, { fromCache: isFromCache, hasPendingWrites, pageCount: loadedPages.length });
      }
    },
    (error: any) => {
      if (
        error?.code === 'resource-exhausted' ||
        error?.message?.includes('Quota limit exceeded') ||
        error?.message?.includes('quota')
      ) {
        markFirestoreQuotaExceeded();
        console.warn('Firestore subscription quota limit reached; continuing in local storage mode.');
      } else if (
        error?.code === 'permission-denied' ||
        error?.message?.includes('Missing or insufficient permissions')
      ) {
        console.warn('Firestore real-time subscription permission notice; operating with local cache for workspace:', wsId);
        const fallback = getLocalPagesCache(userId, wsId) ?? (wsId && wsId !== 'workspace-default' ? [] : INITIAL_WEBSITE_TEMPLATES);
        onUpdate(fallback, { fromCache: true, hasPendingWrites: false, pageCount: fallback.length });
      } else {
        console.warn('Firestore onSnapshot error on pages collection:', error);
      }
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}

export async function loadPagesFromFirestore(userId: string, workspaceId?: string): Promise<WebsitePage[]> {
  const wsId = workspaceId || getActiveWorkspaceId();
  const localKey = getLocalPagesKey(userId, wsId);
  let localPages: WebsitePage[] = [];
  try {
    const raw = localStorage.getItem(localKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        localPages = parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to read local pages cache:', e);
  }

  if (!userId || isFirestoreQuotaExceeded()) {
    return localPages;
  }

  try {
    const { db, isConfigured } = initFirebase();
    const currentDb = db || firestoreDb;

    if (!isConfigured || !currentDb) {
      return localPages;
    }

    const pagesCollectionRef = (!wsId || wsId === 'workspace-default')
      ? collection(currentDb, 'users', userId, 'pages')
      : collection(currentDb, 'users', userId, 'workspaces', wsId, 'pages');

    const snapshot = await getDocs(pagesCollectionRef);

    if (snapshot.empty) {
      return localPages;
    }

    const loadedPages: WebsitePage[] = [];
    snapshot.forEach((docSnap) => {
      if (docSnap.id === 'site-monochrome-olive') {
        return;
      }
      const data = docSnap.data() as WebsitePage;
      if (data && data.id && data.title && data.id !== 'site-monochrome-olive') {
        loadedPages.push({
          id: data.id,
          title: data.title,
          fileName: data.fileName || 'index.html',
          sections: data.sections || [],
          globalStyles: data.globalStyles || {},
          siteSettings: data.siteSettings || {},
          ...(data as any).createdAt ? { createdAt: (data as any).createdAt } : {},
          ...(data as any).updatedAt ? { updatedAt: (data as any).updatedAt } : {},
        } as WebsitePage);
      }
    });

    if (loadedPages.length > 0) {
      loadedPages.sort((a, b) => {
        if (a.fileName === 'index.html' && b.fileName !== 'index.html') return -1;
        if (b.fileName === 'index.html' && a.fileName !== 'index.html') return 1;
        const timeA = (a as any).createdAt ? new Date((a as any).createdAt).getTime() : 0;
        const timeB = (b as any).createdAt ? new Date((b as any).createdAt).getTime() : 0;
        return timeA - timeB;
      });

      setLocalPagesCache(loadedPages, userId, wsId);
      try {
        localStorage.setItem(localKey, JSON.stringify(loadedPages));
      } catch {}
      return loadedPages;
    }
  } catch (err) {
    console.warn('Could not load pages from Firestore, falling back to local cache:', err);
  }

  return localPages;
}

export async function deletePageFromFirestore(pageId: string, userId?: string, workspaceId?: string): Promise<void> {
  if (!pageId) return;

  const wsId = workspaceId || getActiveWorkspaceId();
  const keysToClean = [
    getLocalPagesKey(userId, wsId),
    getLocalPagesKey(undefined, wsId),
  ];

  for (const key of keysToClean) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const list: WebsitePage[] = JSON.parse(raw);
        if (Array.isArray(list)) {
          const filtered = list.filter((p) => p.id !== pageId);
          localStorage.setItem(key, JSON.stringify(filtered));
        }
      }
    } catch (e) {
      console.warn(`Failed to clean deleted page ${pageId} from localStorage ${key}:`, e);
    }
  }

  const userKey = `${userId || 'anon'}_${wsId}`;
  if (inMemoryPagesCache[userKey]) {
    inMemoryPagesCache[userKey] = inMemoryPagesCache[userKey].filter((p) => p.id !== pageId);
  }

  if (userId && !isFirestoreQuotaExceeded()) {
    try {
      const { db, isConfigured } = initFirebase();
      const currentDb = db || firestoreDb;

      if (isConfigured && currentDb) {
        const pageDocRef = (!wsId || wsId === 'workspace-default')
          ? doc(currentDb, 'users', userId, 'pages', pageId)
          : doc(currentDb, 'users', userId, 'workspaces', wsId, 'pages', pageId);

        await deleteDoc(pageDocRef);
        recordFirestoreOperation('delete', 1);
      }
    } catch (err: any) {
      if (err?.code === 'resource-exhausted' || err?.message?.includes('Quota limit exceeded')) {
        markFirestoreQuotaExceeded();
        return;
      }
      console.warn(`Could not delete page ${pageId} from Firestore:`, err);
    }
  }
}
