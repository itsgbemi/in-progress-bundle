import { initFirebase, doc, getDoc, setDoc, firebaseAuth } from '../lib/firebase';
import { isFirestoreQuotaExceeded, handleFirestoreError } from '../lib/firestoreQuota';
import { getActiveWorkspaceId, getStoredWorkspaces } from './workspaceService';

export interface ContactEmailEntry {
  id: string;
  label: string;
  email: string;
  isPrimary?: boolean;
}

export interface ContactPhoneEntry {
  id: string;
  label: string;
  phone: string;
  isPrimary?: boolean;
}

export interface CustomLinkEntry {
  id: string;
  label: string;
  url: string;
  platform?: string;
}

export interface BrandInfo {
  
  name: string;
  tagline: string;
  description: string;
  industry: string;
  foundedYear: string;
  logoUrl: string;
  logoDarkUrl: string;
  faviconUrl: string;
  faviconDarkUrl?: string;
  appleTouchIcon?: string;
  themeColor: string;

  email: string;
  phone: string;
  address: string;
  website: string;

  emails?: ContactEmailEntry[];
  phones?: ContactPhoneEntry[];
  customLinks?: CustomLinkEntry[];

  twitter: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  youtube: string;
  github: string;
  discord: string;
  tiktok: string;

  updatedAt: string;
}

const DEFAULT_STORAGE_KEY = 'brand_info_v1';

export function getBrandInfoStorageKey(workspaceId?: string): string {
  const wsId = workspaceId || getActiveWorkspaceId();
  if (!wsId || wsId === 'workspace-default') {
    return DEFAULT_STORAGE_KEY;
  }
  return `brand_info_v1_${wsId}`;
}

export const DEFAULT_BRAND_INFO: BrandInfo = {
  name: '',
  tagline: '',
  description: '',
  industry: '',
  foundedYear: '',
  logoUrl: '',
  logoDarkUrl: '',
  faviconUrl: '',
  faviconDarkUrl: '',
  appleTouchIcon: '',
  themeColor: '#4f46e5',

  email: '',
  phone: '',
  address: '',
  website: '',

  emails: [],
  phones: [],
  customLinks: [],

  twitter: '',
  linkedin: '',
  facebook: '',
  instagram: '',
  youtube: '',
  github: '',
  discord: '',
  tiktok: '',

  updatedAt: new Date().toISOString(),
};

const inMemoryBrandInfoCache: Record<string, BrandInfo> = {};

export interface BrandCompletionCheck {
  isCompleted: boolean;
  hasName: boolean;
  hasLogo: boolean;
  hasTaglineOrDescription: boolean;
  hasContactOrWeb: boolean;
  brandName: string;
  completedFieldsCount: number;
  totalRelevantFields: number;
  missingFields: string[];
}

export function checkBrandInfoCompleted(info?: BrandInfo): BrandCompletionCheck {
  const current = info || getBrandInfo();
  const name = current.name ? current.name.trim() : '';
  const logoUrl = current.logoUrl ? current.logoUrl.trim() : '';
  const tagline = current.tagline ? current.tagline.trim() : '';
  const description = current.description ? current.description.trim() : '';
  const email = current.email ? current.email.trim() : '';
  const website = current.website ? current.website.trim() : '';
  const industry = current.industry ? current.industry.trim() : '';

  const hasName = name.length > 0;
  const hasLogo = logoUrl.length > 0;
  const hasTaglineOrDescription = tagline.length > 0 || description.length > 0;
  const hasContactOrWeb = email.length > 0 || website.length > 0;

  const missingFields: string[] = [];
  if (!hasName) missingFields.push('Brand Name');
  if (!hasLogo) missingFields.push('Logo URL');
  if (!hasTaglineOrDescription) missingFields.push('Tagline / Mission');

  let completedFieldsCount = 0;
  if (hasName) completedFieldsCount++;
  if (hasLogo) completedFieldsCount++;
  if (hasTaglineOrDescription) completedFieldsCount++;
  if (hasContactOrWeb) completedFieldsCount++;
  if (industry.length > 0) completedFieldsCount++;

  const isCompleted = hasName && (hasLogo || completedFieldsCount >= 2);

  return {
    isCompleted,
    hasName,
    hasLogo,
    hasTaglineOrDescription,
    hasContactOrWeb,
    brandName: name,
    completedFieldsCount,
    totalRelevantFields: 3,
    missingFields,
  };
}

export function getBrandInfo(forceReload = false, workspaceId?: string): BrandInfo {
  const wsId = workspaceId || getActiveWorkspaceId();
  if (inMemoryBrandInfoCache[wsId] && !forceReload) {
    return inMemoryBrandInfoCache[wsId];
  }
  if (typeof window !== 'undefined') {
    try {
      const storageKey = getBrandInfoStorageKey(wsId);
      const raw =
        localStorage.getItem(storageKey) ||
        localStorage.getItem(`myoffice_brand_info_v1_${wsId}`) ||
        (wsId === 'workspace-default' ? localStorage.getItem('myoffice_brand_info_v1') : null);
      if (raw) {
        const parsed = JSON.parse(raw);
        const resolved = { ...DEFAULT_BRAND_INFO, ...parsed };
        inMemoryBrandInfoCache[wsId] = resolved;
        return resolved;
      }

      if (wsId && wsId !== 'workspace-default') {
        const workspaces = getStoredWorkspaces();
        const targetWs = workspaces.find((w) => w.id === wsId);
        const freshBrand: BrandInfo = {
          ...DEFAULT_BRAND_INFO,
          name: targetWs?.name || 'New Brand',
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(storageKey, JSON.stringify(freshBrand));
        inMemoryBrandInfoCache[wsId] = freshBrand;
        return freshBrand;
      }
    } catch (e) {
      console.warn('Failed to parse brand info from localStorage:', e);
    }
  }

  const fallback = { ...DEFAULT_BRAND_INFO };
  inMemoryBrandInfoCache[wsId] = fallback;
  return fallback;
}

export function saveBrandInfo(info: BrandInfo, userId?: string, workspaceId?: string): void {
  const wsId = workspaceId || getActiveWorkspaceId();
  const updated = { ...info, updatedAt: new Date().toISOString() };
  inMemoryBrandInfoCache[wsId] = updated;

  if (typeof window !== 'undefined') {
    const storageKey = getBrandInfoStorageKey(wsId);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    
    if (updated.faviconUrl) {
      let linkTag = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
      if (!linkTag) {
        linkTag = document.createElement('link');
        linkTag.rel = 'shortcut icon';
        document.head.appendChild(linkTag);
      }
      linkTag.href = updated.faviconUrl;
    }

    window.dispatchEvent(new CustomEvent('brand_info_updated', { detail: { info: updated, workspaceId: wsId } }));
  }

  const targetUid = userId || firebaseAuth?.currentUser?.uid;
  if (targetUid) {
    saveBrandInfoToFirestore(targetUid, updated, wsId).catch((err) => {
      console.warn('Failed to save brand info to Firestore:', err);
    });
  }
}

export async function saveBrandInfoToFirestore(userId: string, info: BrandInfo, workspaceId?: string): Promise<void> {
  if (isFirestoreQuotaExceeded()) return;
  const { db, auth, isConfigured } = initFirebase();
  if (!db || !isConfigured || !userId) return;
  if (auth?.currentUser && auth.currentUser.uid !== userId) return;
  try {
    const wsId = workspaceId || getActiveWorkspaceId();
    const docRef = (!wsId || wsId === 'workspace-default')
      ? doc(db, 'users', userId, 'config', 'brand_info')
      : doc(db, 'users', userId, 'workspaces', wsId, 'config', 'brand_info');

    await setDoc(docRef, JSON.parse(JSON.stringify(info)), { merge: true });
  } catch (err) {
    handleFirestoreError(err, 'Saving brand info');
  }
}

export async function loadBrandInfoFromFirestore(userId: string, workspaceId?: string): Promise<BrandInfo | null> {
  if (isFirestoreQuotaExceeded()) return null;
  const { db, auth, isConfigured } = initFirebase();
  if (!db || !isConfigured || !userId) return null;
  if (auth?.currentUser && auth.currentUser.uid !== userId) return null;
  try {
    const wsId = workspaceId || getActiveWorkspaceId();
    const docRef = (!wsId || wsId === 'workspace-default')
      ? doc(db, 'users', userId, 'config', 'brand_info')
      : doc(db, 'users', userId, 'workspaces', wsId, 'config', 'brand_info');

    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as BrandInfo;
      const merged = { ...DEFAULT_BRAND_INFO, ...data };
      inMemoryBrandInfoCache[wsId] = merged;
      if (typeof window !== 'undefined') {
        localStorage.setItem(getBrandInfoStorageKey(wsId), JSON.stringify(merged));
        window.dispatchEvent(new CustomEvent('brand_info_updated', { detail: { info: merged, workspaceId: wsId } }));
      }
      return merged;
    }
  } catch (err) {
    handleFirestoreError(err, 'Loading brand info');
  }
  return null;
}

if (typeof window !== 'undefined') {
  window.addEventListener('active_workspace_changed', (e: Event) => {
    const customEvent = e as CustomEvent<{ workspaceId: string }>;
    const wsId = customEvent.detail?.workspaceId || getActiveWorkspaceId();
    const info = getBrandInfo(true, wsId);
    window.dispatchEvent(new CustomEvent('brand_info_updated', { detail: { info, workspaceId: wsId } }));
  });
}
