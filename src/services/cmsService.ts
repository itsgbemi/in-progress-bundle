import { CMSCollection, CMSItem } from '../types';
import { initFirebase, collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy } from '../lib/firebase';
import { isFirestoreQuotaExceeded, handleFirestoreError } from '../lib/firestoreQuota';
import { getActiveWorkspaceId } from './workspaceService';

function getCmsCollectionsRef(db: any, userId: string, workspaceId?: string) {
  const wsId = workspaceId || getActiveWorkspaceId();
  if (!wsId || wsId === 'workspace-default') {
    return collection(db, 'users', userId, 'cms_collections');
  }
  return collection(db, 'users', userId, 'workspaces', wsId, 'cms_collections');
}

function getCmsCollectionDocRef(db: any, userId: string, collectionId: string, workspaceId?: string) {
  const wsId = workspaceId || getActiveWorkspaceId();
  if (!wsId || wsId === 'workspace-default') {
    return doc(db, 'users', userId, 'cms_collections', collectionId);
  }
  return doc(db, 'users', userId, 'workspaces', wsId, 'cms_collections', collectionId);
}

function getCmsItemsRef(db: any, userId: string, workspaceId?: string) {
  const wsId = workspaceId || getActiveWorkspaceId();
  if (!wsId || wsId === 'workspace-default') {
    return collection(db, 'users', userId, 'cms_items');
  }
  return collection(db, 'users', userId, 'workspaces', wsId, 'cms_items');
}

function getCmsItemDocRef(db: any, userId: string, itemId: string, workspaceId?: string) {
  const wsId = workspaceId || getActiveWorkspaceId();
  if (!wsId || wsId === 'workspace-default') {
    return doc(db, 'users', userId, 'cms_items', itemId);
  }
  return doc(db, 'users', userId, 'workspaces', wsId, 'cms_items', itemId);
}

export function subscribeToCMSCollections(
  userId: string,
  onUpdate: (collections: CMSCollection[]) => void,
  workspaceId?: string
): () => void {
  const { db, isConfigured } = initFirebase();
  if (!db || !isConfigured || !userId || isFirestoreQuotaExceeded()) {
    onUpdate([]);
    return () => {};
  }

  try {
    const colRef = getCmsCollectionsRef(db, userId, workspaceId);
    const q = query(colRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const list: CMSCollection[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as CMSCollection;
          if (data && docSnap.id) {
            list.push({ ...data, id: docSnap.id });
          }
        });
        onUpdate(list);
      },
      (err) => {
        handleFirestoreError(err, 'CMS collections subscription');
        onUpdate([]);
      }
    );
  } catch (err) {
    handleFirestoreError(err, 'Subscribing to CMS collections');
    onUpdate([]);
    return () => {};
  }
}

export async function saveCMSCollection(
  userId: string,
  cmsCollection: CMSCollection,
  workspaceId?: string
): Promise<void> {
  if (isFirestoreQuotaExceeded()) return;
  const { db, isConfigured } = initFirebase();
  if (!db || !isConfigured || !userId) return;

  try {
    const docRef = getCmsCollectionDocRef(db, userId, cmsCollection.id, workspaceId);
    await setDoc(docRef, JSON.parse(JSON.stringify(cmsCollection)), { merge: true });
  } catch (err) {
    handleFirestoreError(err, 'Saving CMS collection');
  }
}

export async function deleteCMSCollection(
  userId: string,
  collectionId: string,
  workspaceId?: string
): Promise<void> {
  if (isFirestoreQuotaExceeded()) return;
  const { db, isConfigured } = initFirebase();
  if (!db || !isConfigured || !userId) return;

  try {
    const docRef = getCmsCollectionDocRef(db, userId, collectionId, workspaceId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, 'Deleting CMS collection');
  }
}

export function subscribeToCMSItems(
  userId: string,
  collectionId: string,
  onUpdate: (items: CMSItem[]) => void,
  workspaceId?: string
): () => void {
  const { db, isConfigured } = initFirebase();
  if (!db || !isConfigured || !userId || !collectionId || isFirestoreQuotaExceeded()) {
    onUpdate([]);
    return () => {};
  }

  try {
    const itemsRef = getCmsItemsRef(db, userId, workspaceId);
    const q = query(itemsRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const list: CMSItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as CMSItem;
          if (data && data.collectionId === collectionId) {
            list.push({ ...data, id: docSnap.id });
          }
        });
        onUpdate(list);
      },
      (err) => {
        handleFirestoreError(err, 'CMS items subscription');
        onUpdate([]);
      }
    );
  } catch (err) {
    handleFirestoreError(err, 'Subscribing to CMS items');
    onUpdate([]);
    return () => {};
  }
}

export async function saveCMSItem(userId: string, item: CMSItem, workspaceId?: string): Promise<void> {
  if (isFirestoreQuotaExceeded()) return;
  const { db, isConfigured } = initFirebase();
  if (!db || !isConfigured || !userId) return;

  try {
    const docRef = getCmsItemDocRef(db, userId, item.id, workspaceId);
    await setDoc(docRef, JSON.parse(JSON.stringify(item)), { merge: true });
  } catch (err) {
    handleFirestoreError(err, 'Saving CMS item');
  }
}

export async function deleteCMSItem(userId: string, itemId: string, workspaceId?: string): Promise<void> {
  if (isFirestoreQuotaExceeded()) return;
  const { db, isConfigured } = initFirebase();
  if (!db || !isConfigured || !userId) return;

  try {
    const docRef = getCmsItemDocRef(db, userId, itemId, workspaceId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, 'Deleting CMS item');
  }
}
