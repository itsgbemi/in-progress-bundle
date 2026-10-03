import React, { useState, useEffect } from 'react';
import { Check, Save, Plus, Trash2, Mail, Phone, Globe, Link as LinkIcon } from 'lucide-react';
import {
  BrandInfo,
  getBrandInfo,
  saveBrandInfo,
  loadBrandInfoFromFirestore,
} from '../../../services/brandInfoService';
import { useAuth } from '../../../context/AuthContext';
import { BrandSubTab } from '../BrandSubNavBox';
import { Input, ImageInputWithMediaPicker } from '../../common';

interface BrandViewProps {
  uiTheme: 'dark' | 'light';
  activeSubTab?: BrandSubTab;
}

const SUBTAB_CONFIG: Record<string, { title: string; description: string }> = {
  identity: {
    title: 'Identity',
    description: 'Core company name, tagline, industry, and founding year.',
  },
  assets: {
    title: 'Assets',
    description: 'Logos, dark mode variations, and favicon icons.',
  },
  contact: {
    title: 'Contact',
    description: 'Support email, telephone, physical address, and official website.',
  },
  links: {
    title: 'Links',
    description: 'Manage website, social media profiles, and custom online links.',
  },
  social: {
    title: 'Links',
    description: 'Manage website, social media profiles, and custom online links.',
  },
};

export const BrandView: React.FC<BrandViewProps> = ({
  uiTheme,
  activeSubTab = 'identity',
}) => {
  const { user } = useAuth();
  const isLight = uiTheme === 'light';

  const [brandInfo, setBrandInfo] = useState<BrandInfo>(() => getBrandInfo(true));
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentConfig = SUBTAB_CONFIG[activeSubTab] || SUBTAB_CONFIG.identity;

  useEffect(() => {
    if (user?.uid) {
      loadBrandInfoFromFirestore(user.uid).then((data) => {
        if (data) setBrandInfo(data);
      });
    }
  }, [user?.uid]);

  useEffect(() => {
    const handleSync = () => {
      setBrandInfo(getBrandInfo(true));
    };
    window.addEventListener('brand_info_updated', handleSync);
    window.addEventListener('active_workspace_changed', handleSync);
    return () => {
      window.removeEventListener('brand_info_updated', handleSync);
      window.removeEventListener('active_workspace_changed', handleSync);
    };
  }, []);

  const handleChange = (field: keyof BrandInfo, value: string) => {
    setBrandInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const emailsList = brandInfo.emails && brandInfo.emails.length > 0
    ? brandInfo.emails
    : [{ id: 'primary-brand-email', label: 'Support Email', email: brandInfo.email || '' }];

  const phonesList = brandInfo.phones && brandInfo.phones.length > 0
    ? brandInfo.phones
    : [{ id: 'primary-brand-phone', label: 'Phone Number', phone: brandInfo.phone || '' }];

  const customLinksList = brandInfo.customLinks || [];

  const handleAddBrandEmail = () => {
    const updated = [...emailsList, { id: `email_${Date.now()}`, label: 'Billing Email', email: '' }];
    setBrandInfo((prev) => ({
      ...prev,
      emails: updated,
      email: updated[0]?.email || prev.email,
    }));
  };

  const handleUpdateBrandEmail = (id: string, field: 'label' | 'email', value: string) => {
    const updated = emailsList.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    setBrandInfo((prev) => ({
      ...prev,
      emails: updated,
      email: updated[0]?.email || prev.email,
    }));
  };

  const handleRemoveBrandEmail = (id: string) => {
    const updated = emailsList.filter((item) => item.id !== id);
    setBrandInfo((prev) => ({
      ...prev,
      emails: updated,
      email: updated[0]?.email || prev.email,
    }));
  };

  const handleAddBrandPhone = () => {
    const updated = [...phonesList, { id: `phone_${Date.now()}`, label: 'Support Line', phone: '' }];
    setBrandInfo((prev) => ({
      ...prev,
      phones: updated,
      phone: updated[0]?.phone || prev.phone,
    }));
  };

  const handleUpdateBrandPhone = (id: string, field: 'label' | 'phone', value: string) => {
    const updated = phonesList.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    setBrandInfo((prev) => ({
      ...prev,
      phones: updated,
      phone: updated[0]?.phone || prev.phone,
    }));
  };

  const handleRemoveBrandPhone = (id: string) => {
    const updated = phonesList.filter((item) => item.id !== id);
    setBrandInfo((prev) => ({
      ...prev,
      phones: updated,
      phone: updated[0]?.phone || prev.phone,
    }));
  };

  const handleAddCustomLink = () => {
    const updated = [...customLinksList, { id: `link_${Date.now()}`, label: 'New Link', url: '', platform: 'Website' }];
    setBrandInfo((prev) => ({
      ...prev,
      customLinks: updated,
    }));
  };

  const handleUpdateCustomLink = (id: string, field: 'label' | 'url' | 'platform', value: string) => {
    const updated = customLinksList.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    setBrandInfo((prev) => ({
      ...prev,
      customLinks: updated,
    }));
  };

  const handleRemoveCustomLink = (id: string) => {
    const updated = customLinksList.filter((item) => item.id !== id);
    setBrandInfo((prev) => ({
      ...prev,
      customLinks: updated,
    }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveBrandInfo(brandInfo, user?.uid);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {currentConfig.title}
          </h2>

        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">
              <Check className="w-3.5 h-3.5" />
              <span>Saved Successfully</span>
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {activeSubTab === 'identity' && (
          <div
            className={`p-5 sm:p-6 rounded-2xl border space-y-5 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                Identity
              </h3>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Brand Name"
                type="text"
                value={brandInfo.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Acme Studio"
                variant="pill"
                isLight={isLight}
              />

              <Input
                label="Tagline"
                type="text"
                value={brandInfo.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="e.g. Design without limits"
                variant="pill"
                isLight={isLight}
              />

              <Input
                label="Industry / Category"
                type="text"
                value={brandInfo.industry}
                onChange={(e) => handleChange('industry', e.target.value)}
                placeholder="e.g. Technology, Agency, Retail"
                variant="pill"
                isLight={isLight}
              />

              <Input
                label="Founded Year"
                type="text"
                value={brandInfo.foundedYear}
                onChange={(e) => handleChange('foundedYear', e.target.value)}
                placeholder="e.g. 2024"
                variant="pill"
                isLight={isLight}
              />
            </div>
          </div>
        )}

        {activeSubTab === 'assets' && (
          <div className="space-y-6">
            <div
              className={`p-5 sm:p-6 rounded-2xl border space-y-5 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="border-b pb-3 border-slate-100 dark:border-slate-800">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  Logo
                </h3>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <ImageInputWithMediaPicker
                    label="Main"
                    value={brandInfo.logoUrl}
                    onChange={(val) => handleChange('logoUrl', val)}
                    placeholder="https://.../logo.png or select from media"
                    variant="pill"
                    isLight={isLight}
                    modalTitle="Select Brand Primary Logo"
                    hint="Main logo displayed on standard/light header bars and brand collateral."
                  />
                </div>

                <div>
                  <ImageInputWithMediaPicker
                    label="Dark Mode"
                    value={brandInfo.logoDarkUrl}
                    onChange={(val) => handleChange('logoDarkUrl', val)}
                    placeholder="https://.../logo-white.png or select from media"
                    variant="pill"
                    isLight={isLight}
                    modalTitle="Select Dark Mode Logo"
                    hint="Light-colored logo variant displayed on dark theme backgrounds."
                  />
                </div>
              </div>
            </div>

            <div
              className={`p-5 sm:p-6 rounded-2xl border space-y-5 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="border-b pb-3 border-slate-100 dark:border-slate-800">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  Favicon
                </h3>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <ImageInputWithMediaPicker
                    label="Main"
                    value={brandInfo.faviconUrl}
                    onChange={(val) => handleChange('faviconUrl', val)}
                    placeholder="https://.../favicon.png or select from media"
                    variant="pill"
                    isLight={isLight}
                    modalTitle="Select Standard Favicon"
                    hint="Standard icon for browser tabs (.png, .ico, .svg — 32x32px or 64x64px)."
                  />
                </div>

                <div>
                  <ImageInputWithMediaPicker
                    label="Dark Mode"
                    value={brandInfo.faviconDarkUrl || ''}
                    onChange={(val) => handleChange('faviconDarkUrl', val)}
                    placeholder="https://.../favicon-dark.png or select from media"
                    variant="pill"
                    isLight={isLight}
                    modalTitle="Select Dark Mode Favicon"
                    hint="Contrast-optimized favicon for dark browser themes."
                  />
                </div>

                <div className="sm:col-span-2 max-w-md">
                  <ImageInputWithMediaPicker
                    label="Apple Touch Icon"
                    value={brandInfo.appleTouchIcon || ''}
                    onChange={(val) => handleChange('appleTouchIcon', val)}
                    placeholder="https://.../apple-touch-icon.png or select from media"
                    variant="pill"
                    isLight={isLight}
                    modalTitle="Select Apple Touch Icon"
                    hint="High-resolution icon for iOS Home Screen shortcuts and Safari bookmarks (180x180px PNG)."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'contact' && (
          <div className="space-y-5">
            <div
              className={`p-5 sm:p-6 rounded-2xl border space-y-4 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    Email Addresses
                  </h3>

                </div>
                <button
                  type="button"
                  onClick={handleAddBrandEmail}
                  className={`px-3.5 py-2 rounded-xl border font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                      : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add More</span>
                </button>
              </div>

              <div className="space-y-2.5 max-w-xl">
                {emailsList.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Input
                      type="email"
                      value={item.email}
                      onChange={(e) => handleUpdateBrandEmail(item.id, 'email', e.target.value)}
                      placeholder="contact@yourbrand.com"
                      variant="pill"
                      isLight={isLight}
                      containerClassName="flex-1"
                    />
                    {emailsList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveBrandEmail(item.id)}
                        className="p-2.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer shrink-0"
                        title="Remove email address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`p-5 sm:p-6 rounded-2xl border space-y-4 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    Phone Numbers
                  </h3>

                </div>
                <button
                  type="button"
                  onClick={handleAddBrandPhone}
                  className={`px-3.5 py-2 rounded-xl border font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                      : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add More</span>
                </button>
              </div>

              <div className="space-y-2.5 max-w-xl">
                {phonesList.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Input
                      type="tel"
                      value={item.phone}
                      onChange={(e) => handleUpdateBrandPhone(item.id, 'phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      variant="pill"
                      isLight={isLight}
                      containerClassName="flex-1"
                    />
                    {phonesList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveBrandPhone(item.id)}
                        className="p-2.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer shrink-0"
                        title="Remove phone number"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`p-5 sm:p-6 rounded-2xl border space-y-4 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="border-b pb-3 border-slate-100 dark:border-slate-800">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  Location & Primary Website
                </h3>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Website URL"
                  type="url"
                  value={brandInfo.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://yourbrand.com"
                  variant="pill"
                  isLight={isLight}
                />

                <Input
                  label="Headquarters Address"
                  type="text"
                  value={brandInfo.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="100 Market St, San Francisco, CA"
                  variant="pill"
                  isLight={isLight}
                />
              </div>
            </div>
          </div>
        )}

        {(activeSubTab === 'links' || activeSubTab === 'social') && (
          <div className="space-y-5">
            <div
              className={`p-5 sm:p-6 rounded-2xl border space-y-5 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="border-b pb-3 border-slate-100 dark:border-slate-800">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  Social Channels
                </h3>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Twitter / X URL"
                  type="url"
                  value={brandInfo.twitter}
                  onChange={(e) => handleChange('twitter', e.target.value)}
                  placeholder="https://x.com/yourbrand"
                  variant="pill"
                  isLight={isLight}
                />

                <Input
                  label="LinkedIn URL"
                  type="url"
                  value={brandInfo.linkedin}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/company/yourbrand"
                  variant="pill"
                  isLight={isLight}
                />

                <Input
                  label="GitHub URL"
                  type="url"
                  value={brandInfo.github}
                  onChange={(e) => handleChange('github', e.target.value)}
                  placeholder="https://github.com/yourbrand"
                  variant="pill"
                  isLight={isLight}
                />

                <Input
                  label="Instagram URL"
                  type="url"
                  value={brandInfo.instagram}
                  onChange={(e) => handleChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/yourbrand"
                  variant="pill"
                  isLight={isLight}
                />

                <Input
                  label="YouTube URL"
                  type="url"
                  value={brandInfo.youtube}
                  onChange={(e) => handleChange('youtube', e.target.value)}
                  placeholder="https://youtube.com/@yourbrand"
                  variant="pill"
                  isLight={isLight}
                />

                <Input
                  label="Facebook URL"
                  type="url"
                  value={brandInfo.facebook}
                  onChange={(e) => handleChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/yourbrand"
                  variant="pill"
                  isLight={isLight}
                />

                <Input
                  label="Discord URL"
                  type="url"
                  value={brandInfo.discord}
                  onChange={(e) => handleChange('discord', e.target.value)}
                  placeholder="https://discord.gg/yourbrand"
                  variant="pill"
                  isLight={isLight}
                />

                <Input
                  label="TikTok URL"
                  type="url"
                  value={brandInfo.tiktok}
                  onChange={(e) => handleChange('tiktok', e.target.value)}
                  placeholder="https://tiktok.com/@yourbrand"
                  variant="pill"
                  isLight={isLight}
                />
              </div>
            </div>

            <div
              className={`p-5 sm:p-6 rounded-2xl border space-y-4 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    Additional Links
                  </h3>

                </div>
                <button
                  type="button"
                  onClick={handleAddCustomLink}
                  className={`px-3.5 py-2 rounded-xl border font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                      : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add More</span>
                </button>
              </div>

              {customLinksList.length > 0 ? (
                <div className="space-y-2.5 max-w-xl">
                  {customLinksList.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <Input
                        type="url"
                        value={item.url}
                        onChange={(e) => handleUpdateCustomLink(item.id, 'url', e.target.value)}
                        placeholder="https://..."
                        icon={<LinkIcon className="w-3.5 h-3.5" />}
                        variant="pill"
                        isLight={isLight}
                        containerClassName="flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomLink(item.id)}
                        className="p-2.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer shrink-0"
                        title="Remove link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  No additional links added yet. Click &quot;Add More&quot; above to add extra links.
                </p>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
