import { initFirebase, doc, getDoc, setDoc, onSnapshot, firebaseAuth } from '../lib/firebase';
import { isFirestoreQuotaExceeded, handleFirestoreError } from '../lib/firestoreQuota';
import {
  getSavedAppFont,
  getSavedHeadingFont,
  getSavedFontMode,
  getSavedAppPalette,
  getSavedHeadingTracking,
  getSavedBodyTracking,
  getSavedSurfaceMode,
  getSavedBrandingConfig,
  getSavedAuthCustomization,
  applyAppInterfaceFont,
  applyAppInterfacePalette,
  applyAppLetterSpacing,
  applyBrandingConfig,
  saveSurfaceMode,
  saveAuthCustomization,
  AppBrandingConfig,
  AuthCustomizationConfig,
  SurfaceBackgroundMode,
} from '../utils/themePreferences';
import {
  getSavedThemeConfig,
  saveThemeConfig,
  ThemeScheduleConfig,
} from '../utils/themeSchedule';

export interface UserDashboardPreferences {
  
  themeMode?: 'dark' | 'light';
  themeSchedule?: ThemeScheduleConfig;
  appFont?: string;
  headingFont?: string;
  fontMode?: 'same_font' | 'separate_heading';
  appPalette?: string;
  surfaceMode?: SurfaceBackgroundMode;
  headingTracking?: string;
  bodyTracking?: string;
  branding?: Partial<AppBrandingConfig>;
  authCustomization?: Partial<AuthCustomizationConfig>;

  defaultDashboardTab?: string;
  lastDashboardTab?: string;
  lastWebsiteSubTab?: string;

  webpagesViewMode?: 'grid' | 'list';
  webpagesStatusFilter?: 'all' | 'published' | 'draft' | 'scheduled' | 'archived';
  webpagesFolderFilter?: string;
  webpagesCustomFolders?: string[];

  mediaViewMode?: 'grid' | 'list';

  updatedAt?: string;
}

const STORAGE_KEY_PREFERENCES = 'user_dashboard_preferences';

export function getLocalDashboardPreferences(): UserDashboardPreferences {
  if (typeof window === 'undefined') {
    return {};
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFERENCES) || localStorage.getItem('myoffice_user_dashboard_preferences');
    const parsed: Partial<UserDashboardPreferences> = raw ? JSON.parse(raw) : {};

    return {
      themeSchedule: getSavedThemeConfig(),
      appFont: getSavedAppFont(),
      headingFont: getSavedHeadingFont(),
      fontMode: getSavedFontMode(),
      appPalette: getSavedAppPalette(),
      surfaceMode: getSavedSurfaceMode(),
      headingTracking: getSavedHeadingTracking(),
      bodyTracking: getSavedBodyTracking(),
      branding: getSavedBrandingConfig(),
      authCustomization: getSavedAuthCustomization(),
      webpagesViewMode:
        (localStorage.getItem('webpages_view_mode') as 'grid' | 'list') ||
        (localStorage.getItem('myoffice_webpages_view_mode') as 'grid' | 'list') ||
        'grid',
      webpagesStatusFilter:
        (localStorage.getItem('webpages_status_filter') as any) ||
        (localStorage.getItem('myoffice_webpages_status_filter') as any) ||
        'all',
      webpagesFolderFilter:
        localStorage.getItem('webpages_folder_filter') ||
        localStorage.getItem('myoffice_webpages_folder_filter') ||
        'all',
      webpagesCustomFolders: (() => {
        try {
          const raw = localStorage.getItem('webpages_custom_folders');
          return raw ? JSON.parse(raw) : [];
        } catch {
          return [];
        }
      })(),
      mediaViewMode:
        (localStorage.getItem('media_view_mode') as 'grid' | 'list') ||
        (localStorage.getItem('myoffice_media_view_mode') as 'grid' | 'list') ||
        'grid',
      ...parsed,
    };
  } catch (e) {
    console.warn('Failed to parse local preferences:', e);
    return {};
  }
}

export function applyPreferencesLocally(prefs: UserDashboardPreferences) {
  if (typeof window === 'undefined') return;

  try {
    
    if (prefs.themeSchedule) {
      saveThemeConfig(prefs.themeSchedule);
    }

    if (prefs.appFont || prefs.headingFont || prefs.fontMode) {
      applyAppInterfaceFont(
        prefs.appFont || getSavedAppFont(),
        prefs.headingFont || getSavedHeadingFont(),
        prefs.fontMode || getSavedFontMode()
      );
    }

    if (prefs.surfaceMode) {
      saveSurfaceMode(prefs.surfaceMode);
    }
    if (prefs.appPalette) {
      applyAppInterfacePalette(prefs.appPalette, prefs.surfaceMode);
    }

    if (prefs.headingTracking || prefs.bodyTracking) {
      applyAppLetterSpacing(prefs.headingTracking, prefs.bodyTracking);
    }

    if (prefs.branding) {
      applyBrandingConfig(prefs.branding);
    }

    if (prefs.authCustomization) {
      saveAuthCustomization(prefs.authCustomization);
    }

    if (prefs.webpagesViewMode) {
      localStorage.setItem('webpages_view_mode', prefs.webpagesViewMode);
    }
    if (prefs.webpagesStatusFilter) {
      localStorage.setItem('webpages_status_filter', prefs.webpagesStatusFilter);
    }
    if (prefs.webpagesFolderFilter) {
      localStorage.setItem('webpages_folder_filter', prefs.webpagesFolderFilter);
    }
    if (prefs.webpagesCustomFolders) {
      localStorage.setItem('webpages_custom_folders', JSON.stringify(prefs.webpagesCustomFolders));
    }
    if (prefs.mediaViewMode) {
      localStorage.setItem('media_view_mode', prefs.mediaViewMode);
    }
    if (prefs.lastDashboardTab) {
      localStorage.setItem('dashboard_tab', prefs.lastDashboardTab);
    }
    if (prefs.defaultDashboardTab) {
      localStorage.setItem('default_dashboard_tab', prefs.defaultDashboardTab);
    }

    localStorage.setItem(STORAGE_KEY_PREFERENCES, JSON.stringify(prefs));

    window.dispatchEvent(new CustomEvent('user_preferences_updated', { detail: prefs }));
  } catch (err) {
    console.warn('Error applying user preferences locally:', err);
  }
}

export async function saveUserPreferences(
  userId: string | undefined,
  updates: Partial<UserDashboardPreferences>
): Promise<void> {
  const current = getLocalDashboardPreferences();
  const merged: UserDashboardPreferences = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  applyPreferencesLocally(merged);

  const targetUid = userId || firebaseAuth?.currentUser?.uid;
  if (!targetUid) {
    return;
  }

  if (isFirestoreQuotaExceeded()) {
    return;
  }

  const { db, auth, isConfigured } = initFirebase();
  if (!db || !isConfigured) return;
  if (auth?.currentUser && auth.currentUser.uid !== targetUid) return;

  try {
    const prefsDocRef = doc(db, 'users', targetUid, 'config', 'preferences');
    await setDoc(prefsDocRef, JSON.parse(JSON.stringify(merged)), { merge: true });
  } catch (err) {
    handleFirestoreError(err, 'Saving user preferences');
  }
}

export async function loadUserPreferencesFromFirestore(
  userId: string
): Promise<UserDashboardPreferences | null> {
  if (!userId || isFirestoreQuotaExceeded()) {
    return getLocalDashboardPreferences();
  }

  const { db, auth, isConfigured } = initFirebase();
  if (!db || !isConfigured) return null;
  if (auth?.currentUser && auth.currentUser.uid !== userId) return null;

  try {
    const prefsDocRef = doc(db, 'users', userId, 'config', 'preferences');
    const snap = await getDoc(prefsDocRef);
    if (snap.exists()) {
      const data = snap.data() as UserDashboardPreferences;
      applyPreferencesLocally(data);
      return data;
    }
  } catch (err) {
    handleFirestoreError(err, 'Loading user preferences');
  }

  return getLocalDashboardPreferences();
}

export function subscribeToUserPreferences(
  userId: string,
  onUpdate: (prefs: UserDashboardPreferences) => void
): () => void {
  if (!userId || isFirestoreQuotaExceeded()) {
    return () => {};
  }

  const { db, auth, isConfigured } = initFirebase();
  if (!db || !isConfigured) return () => {};
  if (auth?.currentUser && auth.currentUser.uid !== userId) return () => {};

  try {
    const prefsDocRef = doc(db, 'users', userId, 'config', 'preferences');
    const unsubscribe = onSnapshot(
      prefsDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as UserDashboardPreferences;
          applyPreferencesLocally(data);
          onUpdate(data);
        }
      },
      (err) => {
        handleFirestoreError(err, 'Subscribing to user preferences');
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Failed to subscribe to user preferences:', err);
    return () => {};
  }
}
