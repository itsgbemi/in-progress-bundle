import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  initFirebase,
  getSavedFirebaseConfig,
  saveFirebaseConfig,
  isFirebaseConfigValid,
  FirebaseConfig,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fbSignOut,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
  onAuthStateChanged,
  googleAuthProvider,
  doc,
  getDoc,
} from '../lib/firebase';
import { saveUserProfileToFirestore } from '../services/storageService';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified?: boolean;
}

export type AuthMode = 'login' | 'forgot_password';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  firebaseConfig: FirebaseConfig;
  error: string | null;
  clearError: () => void;
  login: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserDisplayName: (name: string, photoURL?: string, firstName?: string, lastName?: string, nickname?: string) => Promise<void>;
  saveConfigAndReload: (config: FirebaseConfig) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig>(getSavedFirebaseConfig());
  const [isFirebaseConfigured, setIsFirebaseConfigured] = useState<boolean>(isFirebaseConfigValid(firebaseConfig));
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    try {
      localStorage.removeItem('demo_user');
      localStorage.removeItem('myoffice_demo_user');
    } catch {}

    let unsubscribe: (() => void) | undefined;

    const setupAuth = () => {
      const { auth, isConfigured } = initFirebase(firebaseConfig);
      setIsFirebaseConfigured(isConfigured);

      if (isConfigured && auth) {
        unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
          if (fbUser) {
            let userPhoto = fbUser.photoURL || null;
            let userName = fbUser.displayName || fbUser.email?.split('@')[0] || 'User';
              try {
                const { db } = initFirebase(firebaseConfig);
                if (db) {
                  const profileSnap = await getDoc(doc(db, 'users', fbUser.uid, 'profile', 'info'));
                  if (profileSnap.exists()) {
                    const data = profileSnap.data();
                    if (data.photoURL) userPhoto = data.photoURL;
                    if (data.displayName) userName = data.displayName;
                    if (data.firstName) {
                      localStorage.setItem('user_firstname', data.firstName);
                    }
                    if (data.lastName) {
                      localStorage.setItem('user_lastname', data.lastName);
                    }
                    if (data.nickname) {
                      localStorage.setItem('user_nickname', data.nickname);
                    }
                  }
                }
              } catch (e) {
              console.warn('Could not load user profile from Firestore:', e);
            }
            setUser({
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: userName,
              photoURL: userPhoto,
              emailVerified: fbUser.emailVerified,
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    };

    setupAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [firebaseConfig]);

  const clearError = () => setError(null);

  const formatFirebaseError = (err: any): string => {
    if (!err) return 'An unexpected error occurred. Please try again or contact support.';
    const code = err.code || '';
    const message = typeof err.message === 'string' ? err.message : '';

    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
      return 'Invalid email or password. Please verify your credentials.';
    }
    if (code === 'auth/email-already-in-use') {
      return 'An account with this email address already exists. Please log in.';
    }
    if (code === 'auth/weak-password') {
      return 'The password is too weak. Please use at least 6 characters.';
    }
    if (code === 'auth/invalid-email') {
      return 'Please enter a valid email address.';
    }
    if (code === 'auth/popup-closed-by-user') {
      return 'The sign-in window was closed before completing. Please try again.';
    }
    if (code === 'auth/cancelled-popup-request') {
      return 'Sign-in request was cancelled.';
    }
    if (code === 'auth/network-request-failed') {
      return 'Network connection error. Please check your connection and try again.';
    }
    if (code === 'auth/too-many-requests') {
      return 'Access temporarily paused due to multiple attempts. Please try again later or contact support.';
    }
    if (code === 'auth/popup-blocked') {
      return 'The sign-in window was blocked by your browser. Please allow popups and try again.';
    }
    if (
      message.toLowerCase().includes('firebase') ||
      message.toLowerCase().includes('api key') ||
      message.toLowerCase().includes('project id') ||
      message.toLowerCase().includes('config')
    ) {
      return 'Authentication service is currently unavailable. Please try again later or contact support.';
    }
    return message || 'Unable to complete your request. Please try again or contact support.';
  };

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const { auth, isConfigured } = initFirebase(firebaseConfig);
      if (!isConfigured || !auth) {
        throw new Error('Authentication service is currently unavailable. Please try again later or contact support.');
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      setUser({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
        photoURL: fbUser.photoURL || null,
        emailVerified: fbUser.emailVerified,
      });
    } catch (err: any) {
      const formatted = formatFirebaseError(err);
      setError(formatted);
      throw new Error(formatted);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const { auth, isConfigured } = initFirebase(firebaseConfig);
      if (!isConfigured || !auth) {
        throw new Error('Account registration service is currently unavailable. Please try again later or contact support.');
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      if (name && fbUser) {
        await updateProfile(fbUser, { displayName: name });
      }
      setUser({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: name || fbUser.email?.split('@')[0] || 'User',
        photoURL: fbUser.photoURL || null,
        emailVerified: fbUser.emailVerified,
      });
    } catch (err: any) {
      const formatted = formatFirebaseError(err);
      setError(formatted);
      throw new Error(formatted);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const { auth, isConfigured } = initFirebase(firebaseConfig);
      if (!isConfigured || !auth) {
        throw new Error('Google sign-in is currently unavailable. Please try again later or contact support.');
      }
      const result = await signInWithPopup(auth, googleAuthProvider);
      const fbUser = result.user;
      setUser({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || 'Google User',
        photoURL: fbUser.photoURL || null,
        emailVerified: fbUser.emailVerified,
      });
    } catch (err: any) {
      const formatted = formatFirebaseError(err);
      setError(formatted);
      throw new Error(formatted);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    setLoading(true);
    try {
      const { auth, isConfigured } = initFirebase(firebaseConfig);
      if (!isConfigured || !auth) {
        throw new Error('Password reset service is currently unavailable. Please try again later or contact support.');
      }
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      const formatted = formatFirebaseError(err);
      setError(formatted);
      throw new Error(formatted);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { auth } = initFirebase(firebaseConfig);
      if (auth) {
        await fbSignOut(auth);
      }
      try {
        localStorage.removeItem('user_firstname');
        localStorage.removeItem('user_lastname');
        localStorage.removeItem('user_nickname');
        localStorage.removeItem('myoffice_user_firstname');
        localStorage.removeItem('myoffice_user_lastname');
        localStorage.removeItem('myoffice_user_nickname');
      } catch {}
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserDisplayName = async (name: string, photoURL?: string, firstName?: string, lastName?: string, nickname?: string) => {
    if (!user) return;
    try {
      const { auth } = initFirebase(firebaseConfig);
      if (auth && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name,
          ...(photoURL !== undefined ? { photoURL: photoURL || '' } : {}),
        });
      }
      const updated: AppUser = {
        ...user,
        displayName: name,
        ...(photoURL !== undefined ? { photoURL: photoURL || '' } : {}),
      };
      setUser(updated);
      await saveUserProfileToFirestore({
        uid: user.uid,
        email: user.email,
        displayName: updated.displayName,
        photoURL: updated.photoURL,
        firstName,
        lastName,
        nickname,
      });
    } catch (err: any) {
      const formatted = formatFirebaseError(err);
      setError(formatted);
      throw new Error(formatted);
    }
  };

  const saveConfigAndReload = (config: FirebaseConfig): boolean => {
    saveFirebaseConfig(config);
    setFirebaseConfig(config);
    const valid = isFirebaseConfigValid(config);
    setIsFirebaseConfigured(valid);
    return valid;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseConfigured,
        firebaseConfig,
        error,
        clearError,
        login,
        signUp,
        loginWithGoogle,
        resetPassword,
        logout,
        updateUserDisplayName,
        saveConfigAndReload,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
