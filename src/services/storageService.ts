import {
  initFirebase,
  ref,
  deleteObject,
  firestoreDb,
  firebaseAuth,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  collection,
  query,
  orderBy
} from '../lib/firebase';
import { isFirestoreQuotaExceeded, markFirestoreQuotaExceeded, handleFirestoreError } from '../lib/firestoreQuota';

export interface StoredMediaFile {
  id: string;
  name: string;
  url: string;
  storagePath: string;
  size: number;
  type: string;
  createdAt: string;
  isFirebaseStored: boolean;
  publicId?: string;
  storageProvider?: 'cloudinary' | 'firebase' | 'local';
  format?: string;
  width?: number;
  height?: number;
  firestoreDocId?: string;
}

export interface MediaStorageStatus {
  configured: boolean;
  provider: string;
  cloudName?: string;
  apiKeyMasked?: string;
  ping: string;
  message?: string;
  usage?: {
    plan?: string;
    lastUpdated?: string;
    credits?: {
      used: number | null;
      limit: number;
      usedPercent: number | null;
    };
    storage?: {
      usedBytes: number | null;
      creditsUsed: number | null;
    };
    bandwidth?: {
      usedBytes: number | null;
      creditsUsed: number | null;
    };
    transformations?: {
      count: number | null;
      creditsUsed: number | null;
    };
    objects?: {
      count: number | null;
    };
    creditsUsed?: number | null;
    creditsLimit?: number | null;
    creditsPercent?: number | null;
    storageBytes?: number | null;
    bandwidthBytes?: number | null;
    transformationsCount?: number | null;
  } | null;
}

const CACHE_KEY = 'cached_media_files';

function getInitialCachedMediaFiles(): StoredMediaFile[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY) || localStorage.getItem('myoffice_cached_media_files');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
  }
  return [];
}

let inMemoryMediaCache: StoredMediaFile[] = getInitialCachedMediaFiles();

export function getCachedMediaFiles(): StoredMediaFile[] {
  if (inMemoryMediaCache.length === 0) {
    inMemoryMediaCache = getInitialCachedMediaFiles();
  }
  return inMemoryMediaCache.filter((f) => !f.id.startsWith('sample-'));
}

export const loadMediaFilesFromStorage = getCachedMediaFiles;

export function saveCachedMediaFiles(files: StoredMediaFile[]): void {
  inMemoryMediaCache = files;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(files.slice(0, 1000)));
  } catch {
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('media_files_updated', { detail: files }));
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export async function checkMediaStorageStatus(): Promise<MediaStorageStatus> {
  try {
    const res = await fetch('/api/cloudinary/status');
    if (res.ok) {
      const data = await res.json();
      return {
        configured: data.configured,
        provider: data.configured ? 'cloudinary' : 'local',
        cloudName: data.cloudName,
        apiKeyMasked: data.apiKeyMasked,
        ping: data.ping,
        message: data.message,
        usage: data.usage || null,
      };
    }
  } catch (e) {
    console.warn('Failed to check media status:', e);
  }
  return {
    configured: false,
    provider: 'local',
    ping: 'offline',
    message: 'Could not connect to media backend API.',
  };
}

export const checkCloudinaryStatus = checkMediaStorageStatus;

export async function saveMediaUrlToFirestore(mediaFile: StoredMediaFile): Promise<void> {
  if (isFirestoreQuotaExceeded()) {
    return;
  }
  try {
    const { db, auth, isConfigured } = initFirebase();
    const currentDb = db || firestoreDb;
    const currentAuth = auth || firebaseAuth;

    if (!isConfigured || !currentDb) {
      return;
    }

    const userId = currentAuth?.currentUser?.uid || 'anonymous_user';
    const mediaDocRef = doc(currentDb, 'users', userId, 'media', mediaFile.id);

    await setDoc(mediaDocRef, {
      id: mediaFile.id,
      ownerId: userId,
      name: mediaFile.name,
      url: mediaFile.url,
      storagePath: mediaFile.storagePath || '',
      publicId: mediaFile.publicId || '',
      storageProvider: mediaFile.storageProvider || 'local',
      size: mediaFile.size || 0,
      type: mediaFile.type || 'image/jpeg',
      format: mediaFile.format || '',
      width: mediaFile.width || 0,
      height: mediaFile.height || 0,
      createdAt: mediaFile.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err: any) {
    if (err?.code === 'resource-exhausted' || err?.message?.includes('Quota limit exceeded')) {
      markFirestoreQuotaExceeded();
      return;
    }
    console.warn('Failed to save media URL document to Firebase Firestore:', err);
  }
}

export async function fetchMediaUrlsFromFirestore(): Promise<StoredMediaFile[]> {
  if (isFirestoreQuotaExceeded()) return [];
  try {
    const { db, auth, isConfigured } = initFirebase();
    const currentDb = db || firestoreDb;
    const currentAuth = auth || firebaseAuth;

    if (!isConfigured || !currentDb) {
      return [];
    }

    const userId = currentAuth?.currentUser?.uid || 'anonymous_user';
    const mediaCollectionRef = collection(currentDb, 'users', userId, 'media');
    const q = query(mediaCollectionRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const files: StoredMediaFile[] = [];
    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      files.push({
        id: data.id || docSnapshot.id,
        name: data.name || 'Media Asset',
        url: data.url,
        storagePath: data.storagePath || '',
        publicId: data.publicId,
        size: data.size || 0,
        type: data.type || 'image/jpeg',
        format: data.format,
        width: data.width,
        height: data.height,
        createdAt: data.createdAt || new Date().toISOString(),
        isFirebaseStored: data.storageProvider === 'firebase',
        storageProvider: (data.storageProvider as any) || 'local',
        firestoreDocId: docSnapshot.id,
      });
    });

    return files;
  } catch (err) {
    handleFirestoreError(err, 'Fetching media list');
    return [];
  }
}

export async function syncMediaResources(): Promise<StoredMediaFile[]> {
  try {
    const res = await fetch('/api/media/resources');
    let serverAssets: StoredMediaFile[] = [];
    if (res.ok) {
      const data = await res.json();
      serverAssets = data.assets || [];
    }

    const firestoreAssets = await fetchMediaUrlsFromFirestore();
    const cleanFirestoreAssets = firestoreAssets.filter(f => !f.id.startsWith('sample-'));

    const mergedList: StoredMediaFile[] = [...serverAssets];

    cleanFirestoreAssets.forEach(fa => {
      const existsInServer = serverAssets.some(sa => sa.id === fa.id || sa.url === fa.url || (sa.publicId && sa.publicId === fa.publicId));
      if (!existsInServer) {
        mergedList.push(fa);
      }
    });

    const nonSampleAssets = mergedList.filter(f => !f.id.startsWith('sample-'));

    if (nonSampleAssets.length > 0) {
      saveCachedMediaFiles(nonSampleAssets);
      return nonSampleAssets;
    } else if (mergedList.length > 0) {
      saveCachedMediaFiles(mergedList);
      return mergedList;
    }

    return getCachedMediaFiles();
  } catch (err) {
    console.warn('Media synchronization notice:', err);

    const firestoreAssets = await fetchMediaUrlsFromFirestore();
    const cleanFirestore = firestoreAssets.filter(f => !f.id.startsWith('sample-'));
    if (cleanFirestore.length > 0) {
      saveCachedMediaFiles(cleanFirestore);
      return cleanFirestore;
    }
    return getCachedMediaFiles();
  }
}

export const syncCloudinaryResources = syncMediaResources;

export async function uploadMediaFile(
  file: File,
  folder = 'website_assets',
  onProgress?: (progressPercent: number) => void
): Promise<StoredMediaFile> {
  const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

  if (onProgress) onProgress(15);

  try {

    try {
      const signRes = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder }),
      });

      if (signRes.ok) {
        const { signature, api_key, timestamp, cloud_name } = await signRes.json();
        if (signature && api_key && cloud_name) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('api_key', api_key);
          formData.append('timestamp', timestamp.toString());
          formData.append('signature', signature);
          formData.append('folder', folder);

          const uploadRes = await new Promise<any>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`);

            xhr.upload.onprogress = (e) => {
              if (onProgress && e.lengthComputable) {
                onProgress(Math.round((e.loaded / e.total) * 75) + 15);
              }
            };

            xhr.onload = () => {
              if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
              } else {
                reject(new Error(`Cloudinary upload failed: ${xhr.status} ${xhr.responseText}`));
              }
            };

            xhr.onerror = () => reject(new Error('Cloudinary network error'));
            xhr.send(formData);
          });

          const newFile: StoredMediaFile = {
            id: uploadRes.public_id || fileId,
            name: file.name,
            url: uploadRes.secure_url || uploadRes.url,
            storagePath: uploadRes.public_id,
            publicId: uploadRes.public_id,
            size: uploadRes.bytes || file.size,
            type: `${uploadRes.resource_type || 'image'}/${uploadRes.format || 'unknown'}`,
            format: uploadRes.format,
            width: uploadRes.width,
            height: uploadRes.height,
            createdAt: uploadRes.created_at || new Date().toISOString(),
            isFirebaseStored: false,
            storageProvider: 'cloudinary',
          };

          if (onProgress) onProgress(95);
          await saveMediaUrlToFirestore(newFile);
          if (onProgress) onProgress(100);

          const existing = getCachedMediaFiles().filter(f => !f.id.startsWith('sample-'));
          saveCachedMediaFiles([newFile, ...existing]);
          return newFile;
        }
      }
    } catch (cloudinaryErr) {
      console.warn('Direct Cloudinary upload not available, proceeding to server storage:', cloudinaryErr);
    }

    if (onProgress) onProgress(40);
    const dataUrl = await fileToDataUrl(file);

    if (onProgress) onProgress(65);
    const response = await fetch('/api/media/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file: dataUrl,
        filename: cleanName,
        folder,
      }),
    });

    if (onProgress) onProgress(85);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to upload media file.');
    }

    const data = await response.json();
    const asset = data.asset;

    const newFile: StoredMediaFile = {
      id: asset.id || fileId,
      name: file.name,
      url: asset.url,
      storagePath: asset.storagePath || asset.publicId,
      publicId: asset.publicId,
      size: asset.size || file.size,
      type: asset.type || file.type || 'image/jpeg',
      format: asset.format,
      width: asset.width,
      height: asset.height,
      createdAt: asset.createdAt || new Date().toISOString(),
      isFirebaseStored: asset.isFirebaseStored || false,
      storageProvider: asset.storageProvider || 'local',
    };

    if (onProgress) onProgress(95);
    await saveMediaUrlToFirestore(newFile);
    if (onProgress) onProgress(100);

    const existing = getCachedMediaFiles().filter(f => !f.id.startsWith('sample-'));
    saveCachedMediaFiles([newFile, ...existing]);

    return newFile;
  } catch (uploadError: any) {
    console.error('Media upload error:', uploadError);
    throw uploadError;
  }
}

export const uploadMediaToCloudinary = uploadMediaFile;

export async function deleteMediaFile(file: StoredMediaFile): Promise<void> {

  try {
    await fetch('/api/media/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        publicId: file.publicId || file.storagePath,
        storagePath: file.storagePath,
      }),
    });
  } catch (err) {
    console.warn('Could not delete asset from server storage:', err);
  }

  if (file.isFirebaseStored && file.storagePath) {
    try {
      const { storage, isConfigured } = initFirebase();
      if (isConfigured && storage) {
        const storageRef = ref(storage, file.storagePath);
        await deleteObject(storageRef);
      }
    } catch (err) {
      console.warn('Could not delete from Firebase Storage:', err);
    }
  }

  try {
    const { db, auth, isConfigured } = initFirebase();
    const currentDb = db || firestoreDb;
    const currentAuth = auth || firebaseAuth;

    if (isConfigured && currentDb) {
      const userId = currentAuth?.currentUser?.uid || 'anonymous_user';
      const docId = file.firestoreDocId || file.id;
      const mediaDocRef = doc(currentDb, 'users', userId, 'media', docId);
      await deleteDoc(mediaDocRef);
    }
  } catch (err) {
    console.warn('Could not delete media document from Firestore:', err);
  }

  const existing = getCachedMediaFiles();
  const filtered = existing.filter((f) => f.id !== file.id && f.publicId !== file.publicId);
  saveCachedMediaFiles(filtered);
}

export async function saveUserProfileToFirestore(userProfile: { uid: string; email?: string | null; displayName?: string | null; photoURL?: string | null; firstName?: string; lastName?: string; nickname?: string }): Promise<void> {
  if (isFirestoreQuotaExceeded()) return;
  try {
    const { db, isConfigured } = initFirebase();
    const currentDb = db || firestoreDb;
    if (!isConfigured || !currentDb || !userProfile.uid) {
      return;
    }
    const userDocRef = doc(currentDb, 'users', userProfile.uid, 'profile', 'info');
    await setDoc(userDocRef, {
      uid: userProfile.uid,
      email: userProfile.email || '',
      displayName: userProfile.displayName || '',
      photoURL: userProfile.photoURL || '',
      ...(userProfile.firstName !== undefined ? { firstName: userProfile.firstName } : {}),
      ...(userProfile.lastName !== undefined ? { lastName: userProfile.lastName } : {}),
      ...(userProfile.nickname !== undefined ? { nickname: userProfile.nickname } : {}),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err: any) {
    if (err?.code === 'resource-exhausted' || err?.message?.includes('Quota limit exceeded')) {
      markFirestoreQuotaExceeded();
      return;
    }
    console.warn('Failed to save user profile to Firestore:', err);
  }
}

export async function wipeUserDataFromFirebase(userId: string): Promise<void> {
  if (!userId) return;

  const timeoutPromise = new Promise<void>((resolve) => setTimeout(resolve, 6000));

  const doWipe = async () => {
    try {
      const { db, isConfigured } = initFirebase();
      const currentDb = db || firestoreDb;
      if (isConfigured && currentDb) {
        const subcollections = ['pages', 'media', 'profile', 'config', 'revisions', 'comments', 'audit'];

        await Promise.allSettled(
          subcollections.map(async (sub) => {
            try {
              const colRef = collection(currentDb, 'users', userId, sub);
              const snapshot = await getDocs(colRef);
              const deleteOps = snapshot.docs.map((docSnap) =>
                deleteDoc(doc(currentDb, 'users', userId, sub, docSnap.id))
              );
              await Promise.allSettled(deleteOps);
            } catch (err) {
              console.warn(`Error clearing Firestore collection ${sub} for user ${userId}:`, err);
            }
          })
        );

        try {
          await deleteDoc(doc(currentDb, 'users', userId));
        } catch (e) {
          console.warn('Error deleting main user document from Firestore:', e);
        }
      }
    } catch (err) {
      console.error('Failed to wipe user data from Firebase:', err);
    }
  };

  await Promise.race([doWipe(), timeoutPromise]);
}

export const uploadMediaToFirebase = uploadMediaToCloudinary;
export const deleteMediaFromFirebase = deleteMediaFile;
