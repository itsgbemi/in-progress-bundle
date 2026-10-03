import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getStorage,
  FirebaseStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadTaskSnapshot
} from 'firebase/storage';
import {
  initializeFirestore,
  getFirestore,
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  writeBatch,
  runTransaction,
  serverTimestamp,
  persistentLocalCache,
  persistentMultipleTabManager,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  setLogLevel
} from 'firebase/firestore';

try {
  setLogLevel('silent');
} catch (_) {}

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  firestoreDatabaseId?: string;
}

const STORAGE_KEY_CUSTOM_CONFIG = 'firebase_custom_config';

export function getSavedFirebaseConfig(): FirebaseConfig {

  const metaEnv = (import.meta as any).env || {};
  const envApiKey = metaEnv.VITE_FIREBASE_API_KEY;
  const envProjectId = metaEnv.VITE_FIREBASE_PROJECT_ID;
  if (envApiKey && envProjectId) {
    return {
      apiKey: envApiKey,
      authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || `${envProjectId}.firebaseapp.com`,
      projectId: envProjectId,
      storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || `${envProjectId}.appspot.com`,
      messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: metaEnv.VITE_FIREBASE_APP_ID || '',
    };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_CONFIG) || localStorage.getItem('myoffice_firebase_custom_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse saved firebase config from localStorage:', e);
  }

  return {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    firestoreDatabaseId: '',
  };
}

export function saveFirebaseConfig(config: FirebaseConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save firebase config to localStorage:', e);
  }
}

export function clearCustomFirebaseConfig(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_CUSTOM_CONFIG);
  } catch (e) {
    console.error('Failed to clear custom firebase config from localStorage:', e);
  }
}

export function isFirebaseConfigValid(config: FirebaseConfig): boolean {
  return Boolean(
    config.apiKey &&
    config.apiKey.length > 5 &&
    config.projectId &&
    config.projectId.length > 2
  );
}

let currentApp: FirebaseApp | null = null;
let currentAuth: Auth | null = null;
let currentStorage: FirebaseStorage | null = null;
let currentDb: Firestore | null = null;

export function initFirebase(customConfig?: FirebaseConfig): {
  app: FirebaseApp | null;
  auth: Auth | null;
  storage: FirebaseStorage | null;
  db: Firestore | null;
  isConfigured: boolean;
} {
  const config = customConfig || getSavedFirebaseConfig();
  const valid = isFirebaseConfigValid(config);

  if (!valid) {
    return {
      app: null,
      auth: null,
      storage: null,
      db: null,
      isConfigured: false,
    };
  }

  try {
    if (getApps().length === 0) {
      currentApp = initializeApp(config);
    } else {
      currentApp = getApp();
    }

    currentAuth = getAuth(currentApp);
    currentStorage = getStorage(currentApp);

    if (!currentDb) {
      try {
        const dbId = (config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)')
          ? config.firestoreDatabaseId
          : undefined;

        currentDb = initializeFirestore(currentApp, {
          localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager(),
          }),
        }, dbId);
      } catch (cacheInitErr) {

        try {
          if (config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)') {
            currentDb = getFirestore(currentApp, config.firestoreDatabaseId);
          } else {
            currentDb = getFirestore(currentApp);
          }
        } catch (dbErr) {
          console.warn('Fallback to standard getFirestore:', dbErr);
          currentDb = getFirestore(currentApp);
        }
      }
    }

    return {
      app: currentApp,
      auth: currentAuth,
      storage: currentStorage,
      db: currentDb,
      isConfigured: true,
    };
  } catch (err) {
    console.error('Error initializing Firebase:', err);
    return {
      app: null,
      auth: null,
      storage: null,
      db: null,
      isConfigured: false,
    };
  }
}

const initialInit = initFirebase();
export const firebaseApp = initialInit.app;
export const firebaseAuth = initialInit.auth;
export const firebaseStorage = initialInit.storage;
export const firestoreDb = initialInit.db;
export const googleAuthProvider = new GoogleAuthProvider();

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fbSignOut,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
  onAuthStateChanged,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  writeBatch,
  runTransaction,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
};
export type { FirebaseUser, UploadTaskSnapshot };
