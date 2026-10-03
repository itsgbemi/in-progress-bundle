import React, { useState, useRef } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { uploadMediaToFirebase, wipeUserDataFromFirebase } from '../../../../services/storageService';
import { AvatarPickerModal } from './AvatarPickerModal';
import { Input } from '../../../common';
import {
  User,
  Mail,
  Camera,
  Check,
  Lock,
  ShieldCheck,
  PowerOff,
  Loader2,
  Trash2,
  AlertTriangle,
  X,
  Sliders
} from 'lucide-react';

interface ProfileSettingsSubViewProps {
  uiTheme: 'dark' | 'light';
}

export const ProfileSettingsSubView: React.FC<ProfileSettingsSubViewProps> = ({ uiTheme }) => {
  const { user, updateUserDisplayName, resetPassword, logout } = useAuth();
  const isLight = uiTheme === 'light';

  const [firstName, setFirstName] = useState(() => {
    const stored = localStorage.getItem('user_firstname') || localStorage.getItem('myoffice_user_firstname');
    if (stored) return stored;
    const nameParts = (user?.displayName || '').split(' ');
    return nameParts[0] || '';
  });

  const [lastName, setLastName] = useState(() => {
    const stored = localStorage.getItem('user_lastname') || localStorage.getItem('myoffice_user_lastname');
    if (stored) return stored;
    const nameParts = (user?.displayName || '').split(' ');
    return nameParts.slice(1).join(' ') || '';
  });

  const [nickname, setNickname] = useState(() => {
    return localStorage.getItem('user_nickname') || localStorage.getItem('myoffice_user_nickname') || '';
  });

  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [isWipeModalOpen, setIsWipeModalOpen] = useState(false);
  const [isWiping, setIsWiping] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [initialAdjustSource, setInitialAdjustSource] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const fullDisplayName = `${firstName.trim()} ${lastName.trim()}`.trim() || nickname.trim() || 'User';
      localStorage.setItem('user_firstname', firstName.trim());
      localStorage.setItem('user_lastname', lastName.trim());
      localStorage.setItem('user_nickname', nickname.trim());

      await updateUserDisplayName(fullDisplayName, photoURL, firstName.trim(), lastName.trim(), nickname.trim());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Update profile error:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSelectAvatarUrl = async (url: string) => {
    setPhotoURL(url);
    try {
      const fullDisplayName = `${firstName.trim()} ${lastName.trim()}`.trim() || nickname.trim() || user?.displayName || 'User';
      await updateUserDisplayName(fullDisplayName, url, firstName.trim(), lastName.trim(), nickname.trim());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Avatar update error:', err);
    }
  };

  const handleAvatarFileUpload = async (file: File) => {
    setIsUploadingPhoto(true);
    try {
      const uploaded = await uploadMediaToFirebase(file, 'avatars');
      await handleSelectAvatarUrl(uploaded.url);
    } catch (err) {
      console.error('Avatar upload error:', err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveAdjustedAvatar = async (blob: Blob, dataUrl: string) => {
    setIsUploadingPhoto(true);
    try {
      let finalUrl = dataUrl;
      if (dataUrl && (dataUrl.startsWith('http://') || dataUrl.startsWith('https://')) && (!blob || blob.size === 0)) {
        await handleSelectAvatarUrl(dataUrl);
        return;
      }

      if (blob && blob.size > 0 && !dataUrl.startsWith('http')) {
        const file = new File([blob], `avatar_${Date.now()}.jpg`, { type: 'image/jpeg' });
        try {
          const uploaded = await uploadMediaToFirebase(file, 'avatars');
          if (uploaded?.url) {
            finalUrl = uploaded.url;
          }
        } catch (uploadErr) {
          console.warn('Upload to cloud storage failed, using adjusted data URL:', uploadErr);
        }
      }
      await handleSelectAvatarUrl(finalUrl);
    } catch (err) {
      console.error('Save adjusted avatar error:', err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSendPasswordReset = async () => {
    if (!user?.email) return;
    try {
      await resetPassword(user.email);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 4000);
    } catch (err) {
      console.error('Password reset error:', err);
    }
  };

  const handleWipeData = async () => {
    setIsWiping(true);
    try {

      try {
        if (user) {
          await updateUserDisplayName(user.displayName || 'Creator', '');
        }
      } catch (authErr) {
        console.warn('Failed to clear Auth profile picture during wipe:', authErr);
      }

      if (user?.uid) {
        await wipeUserDataFromFirebase(user.uid);
      }
    } catch (err) {
      console.error('Failed to wipe user data from Firebase:', err);
    } finally {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (
            key &&
            (key.startsWith('myoffice_') ||
              key.startsWith('app_') ||
              key.includes('page') ||
              key.includes('media'))
          ) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
        localStorage.clear();
      } catch (e) {
        console.warn('Error clearing localStorage:', e);
      }
      setIsWipeModalOpen(false);
      setIsWiping(false);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Account
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div
          className={`md:col-span-8 p-5 sm:p-6 rounded-xl border space-y-5 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3.5 border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
              Profile
            </h3>
            {saveSuccess && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>

            <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-xs">
                {photoURL ? (
                  <img src={photoURL} alt={user?.displayName || 'User Profile'} className="w-full h-full object-cover" />
                ) : (
                  <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=hero" alt="Default Avatar" className="w-full h-full object-cover" />
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                disabled={isUploadingPhoto}
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer transition-transform shadow-xs"
                title="Change Avatar"
              >
                {isUploadingPhoto ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Camera className="w-3 h-3" />
                )}
              </button>
            </div>

            <div className="space-y-0.5">
              <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                {user?.displayName || 'User Profile'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {user?.email || 'No email attached'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name..."
                icon={<User className="w-4 h-4" />}
                variant="pill"
                isLight={isLight}
              />

              <Input
                label="Last Name"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name..."
                icon={<User className="w-4 h-4" />}
                variant="pill"
                isLight={isLight}
              />
            </div>

            <Input
              label="Nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Preferred nickname..."
              icon={<User className="w-4 h-4" />}
              variant="pill"
              isLight={isLight}
            />

            <Input
              label="Email Address"
              type="email"
              value={user?.email || ''}
              readOnly
              disabled
              placeholder="email@domain.com"
              icon={<Mail className="w-4 h-4" />}
              variant="pill"
              isLight={isLight}
            />

            <div className="pt-2">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-4 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {saveSuccess ? (
                  <Check className="w-3.5 h-3.5" />
                ) : isUpdating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>{saveSuccess ? 'Saved' : isUpdating ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
              <span>Password & Security</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Click below to receive an email with instructions to safely change or update your password.
            </p>
            <button
              type="button"
              onClick={handleSendPasswordReset}
              className={`px-3.5 py-2 rounded-full border text-xs font-medium transition-colors cursor-pointer ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
            >
              {resetSent ? 'Reset Email Dispatched!' : 'Send Password Reset Email'}
            </button>
          </div>
        </div>

        <div className="md:col-span-4 space-y-4">

          <div
            className={`p-5 rounded-xl border space-y-3 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
              Session Control
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Sign out of your active browser session on this device.
            </p>
            <button
              type="button"
              onClick={logout}
              className="w-full py-2.5 px-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <PowerOff className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>

          <div
            className={`p-5 rounded-xl border space-y-3 ${
              isLight ? 'bg-rose-50/40 border-rose-200' : 'bg-rose-950/20 border-rose-900/40'
            }`}
          >
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <Trash2 className="w-3.5 h-3.5" />
              <h3 className="font-semibold text-xs">Danger Zone</h3>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Permanently wipe all pages, uploaded media, saved branding configurations, and cloud workspace data.
            </p>
            <button
              type="button"
              onClick={() => setIsWipeModalOpen(true)}
              className="w-full py-2.5 px-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Wipe Data</span>
            </button>
          </div>
        </div>
      </div>

      {isWipeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div
            className={`w-full max-w-md p-6 rounded-3xl border shadow-xl space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-semibold text-sm">Wipe All Workspace Data?</h3>
              </div>
              <button
                type="button"
                disabled={isWiping}
                onClick={() => setIsWipeModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This action will permanently delete all draft pages, uploaded media, saved branding configurations, and cloud data for your account. This cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isWiping}
                onClick={() => setIsWipeModalOpen(false)}
                className={`px-4 py-2 rounded-full border text-xs font-medium cursor-pointer disabled:opacity-50 ${
                  isLight ? 'border-slate-200 text-slate-700' : 'border-slate-700 text-slate-300'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isWiping}
                onClick={handleWipeData}
                className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isWiping ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Wiping Data...</span>
                  </>
                ) : (
                  <span>Confirm Wipe</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <AvatarPickerModal
        isOpen={isAvatarModalOpen}
        onClose={() => {
          setIsAvatarModalOpen(false);
          setInitialAdjustSource(null);
        }}
        onSelect={handleSelectAvatarUrl}
        uiTheme={uiTheme}
        isUploading={isUploadingPhoto}
        onFileUpload={handleAvatarFileUpload}
        onSaveAdjusted={handleSaveAdjustedAvatar}
        initialAdjustSource={initialAdjustSource}
      />
    </div>
  );
};
