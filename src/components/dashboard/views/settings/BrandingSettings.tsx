import React, { useState, useEffect } from 'react';
import {
  AppBrandingConfig,
  HamburgerIconStyle,
  SidebarLayoutMode,
  DEFAULT_MENU_ITEMS,
  getSavedBrandingConfig,
  applyBrandingConfig,
  AuthCustomizationConfig,
  getSavedAuthCustomization,
  saveAuthCustomization
} from '../../../../utils/themePreferences';
import { useAuth } from '../../../../context/AuthContext';
import { saveUserPreferences } from '../../../../services/userPreferencesService';
import { HamburgerLinesIcon } from '../../../common/HamburgerLinesIcon';
import { ImageInputWithMediaPicker, CheckCircle } from '../../../common';
import {
  Check,
  Sparkles,
  Globe,
  Image as ImageIcon,
  LayoutList,
  LayoutGrid,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  RotateCcw,
  Menu,
  Inbox,
  TrendingUp,
  ShoppingBag,
  LayoutDashboard
} from 'lucide-react';

const MENU_ITEMS_METADATA: Record<string, { label: string; desc: string; icon: React.ElementType; isLocked?: boolean }> = {
  'get-started': { label: 'Get Started', desc: 'Onboarding setup wizard & checklists', icon: Sparkles },
  'overview': { label: 'Overview', desc: 'Performance metrics, workspace health & quick stats', icon: LayoutDashboard },
  'brand': { label: 'Brand', desc: 'Typography, color palettes & identity assets', icon: ShoppingBag },
  'websites': { label: 'Website', desc: 'Manage landing pages, themes & custom domains', icon: Globe },
  'inbox': { label: 'Inbox', desc: 'Form submissions and leads management', icon: Inbox },
  'media': { label: 'Media', desc: 'Uploaded image assets and storage files', icon: ImageIcon },
  'usage': { label: 'Usage', desc: 'Resource quotas, bandwidth and API activity', icon: TrendingUp },
};

interface BrandingSettingsProps {
  uiTheme: 'dark' | 'light';
}

interface SidebarMenuMockupProps {
  layout: 'standard' | 'stacked';
  isSelected: boolean;
  isLight: boolean;
}

const SidebarMenuMockup: React.FC<SidebarMenuMockupProps> = ({ layout, isSelected, isLight }) => {
  return (
    <div
      className={`w-full h-24 rounded-lg border overflow-hidden flex transition-all ${
        isSelected
          ? 'border-indigo-500/50 shadow-xs'
          : isLight
          ? 'border-slate-200 bg-slate-100/70'
          : 'border-slate-800 bg-slate-950/70'
      }`}
    >
      <div
        className={`w-5/12 h-full border-r p-2 flex flex-col justify-between ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
            <div className={`w-2.5 h-2.5 rounded-sm shrink-0 ${isSelected ? 'bg-indigo-600' : 'bg-slate-400'}`} />
            <div className="h-1.5 w-10 rounded-sm bg-slate-300 dark:bg-slate-700" />
          </div>

          {layout === 'standard' ? (
            <div className="space-y-1">
              <div className={`h-4 rounded-sm px-1.5 flex items-center gap-1.5 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>
                <div className={`w-1.5 h-1.5 rounded-xs shrink-0 ${isSelected ? 'bg-white' : 'bg-indigo-500'}`} />
                <div className={`h-1 w-7 rounded-xs ${isSelected ? 'bg-white/90' : 'bg-slate-400 dark:bg-slate-600'}`} />
              </div>
              <div className="h-4 rounded-sm px-1.5 flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/40">
                <div className="w-1.5 h-1.5 rounded-xs bg-slate-400 shrink-0" />
                <div className="h-1 w-8 rounded-xs bg-slate-300 dark:bg-slate-700" />
              </div>
              <div className="h-4 rounded-sm px-1.5 flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/40">
                <div className="w-1.5 h-1.5 rounded-xs bg-slate-400 shrink-0" />
                <div className="h-1 w-6 rounded-xs bg-slate-300 dark:bg-slate-700" />
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className={`h-5.5 rounded-sm p-0.5 flex flex-col items-center justify-center gap-0.5 ${isSelected ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`}>
                <div className={`w-1.5 h-1.5 rounded-xs ${isSelected ? 'bg-white' : 'bg-indigo-500'}`} />
                <div className={`h-0.5 w-6 rounded-xs ${isSelected ? 'bg-white/90' : 'bg-slate-400 dark:bg-slate-600'}`} />
              </div>
              <div className="h-5.5 rounded-sm p-0.5 flex flex-col items-center justify-center gap-0.5 bg-slate-100/80 dark:bg-slate-800/40">
                <div className="w-1.5 h-1.5 rounded-xs bg-slate-400" />
                <div className="h-0.5 w-5 rounded-xs bg-slate-300 dark:bg-slate-700" />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="w-2 h-2 rounded-xs bg-slate-300 dark:bg-slate-700" />
          <div className="h-1 w-6 rounded-xs bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      <div className={`flex-1 p-2 space-y-1.5 ${isLight ? 'bg-slate-50' : 'bg-slate-950'}`}>
        <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="h-1.5 w-12 rounded-sm bg-slate-300 dark:bg-slate-700" />
          <div className="h-1.5 w-4 rounded-xs bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="h-5 rounded-sm bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-1">
            <div className="h-1 w-5 rounded-xs bg-slate-200 dark:bg-slate-700 mb-0.5" />
            <div className="h-1.5 w-7 rounded-xs bg-indigo-500/40" />
          </div>
          <div className="h-5 rounded-sm bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-1">
            <div className="h-1 w-5 rounded-xs bg-slate-200 dark:bg-slate-700 mb-0.5" />
            <div className="h-1.5 w-7 rounded-xs bg-slate-300 dark:bg-slate-700" />
          </div>
        </div>
        <div className="h-4 rounded-sm bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60" />
      </div>
    </div>
  );
};

interface WelcomeScreenLayoutMockupProps {
  mode: 'two_column' | 'centered';
  isSelected: boolean;
  isLight: boolean;
  imageUrl?: string;
  darkOverlay?: boolean;
  overlayOpacity?: number;
}

const WelcomeScreenLayoutMockup: React.FC<WelcomeScreenLayoutMockupProps> = ({
  mode,
  isSelected,
  isLight,
  imageUrl,
  darkOverlay,
  overlayOpacity = 50,
}) => {
  const bgImg = imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80';

  return (
    <div
      className={`w-full h-28 rounded-lg border overflow-hidden transition-all ${
        isSelected
          ? 'border-indigo-500/60 shadow-xs ring-1 ring-indigo-500/20'
          : isLight
          ? 'border-slate-200 bg-slate-100/70'
          : 'border-slate-800 bg-slate-950/70'
      }`}
    >
      {mode === 'two_column' ? (
        <div className="w-full h-full flex">
          <div className="w-1/2 h-full relative overflow-hidden bg-slate-800 flex items-center justify-center">
            <img
              src={bgImg}
              alt="Preview visual"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            {darkOverlay && (
              <div
                className="absolute inset-0 bg-black"
                style={{ opacity: overlayOpacity / 100 }}
              />
            )}
          </div>

          <div
            className={`w-1/2 h-full p-2.5 flex flex-col justify-center items-center ${
              isLight ? 'bg-white' : 'bg-slate-900'
            }`}
          >
            <div className="w-full max-w-[96px] space-y-1.5">
              <div className="w-2.5 h-2.5 rounded-xs bg-indigo-600 mx-auto mb-0.5" />
              <div className="h-1.5 w-12 rounded-sm bg-slate-800 dark:bg-slate-200 mx-auto mb-1" />
              <div className="h-2 rounded-sm bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 w-full" />
              <div className="h-2 rounded-sm bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 w-full" />
              <div className="h-2.5 rounded-sm bg-indigo-600 w-full mt-0.5" />
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center p-2 relative ${
            isLight ? 'bg-slate-100/90' : 'bg-slate-950'
          }`}
        >
          <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-indigo-500/10 blur-md pointer-events-none" />
          <div className="absolute -bottom-3 -left-3 w-16 h-16 rounded-full bg-purple-500/10 blur-md pointer-events-none" />

          <div
            className={`w-32 p-2 rounded-lg border shadow-sm space-y-1.5 z-10 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <div className="w-2.5 h-2.5 rounded-xs bg-indigo-600" />
              <div className="h-1.5 w-10 rounded-sm bg-slate-700 dark:bg-slate-300" />
            </div>
            <div className="h-2 rounded-sm bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 w-full" />
            <div className="h-2 rounded-sm bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 w-full" />
            <div className="h-2.5 rounded-sm bg-indigo-600 w-full mt-0.5" />
          </div>
        </div>
      )}
    </div>
  );
};

export const BrandingSettings: React.FC<BrandingSettingsProps> = ({ uiTheme }) => {
  const isLight = uiTheme === 'light';
  const { user } = useAuth();

  const [branding, setBranding] = useState<AppBrandingConfig>(() => getSavedBrandingConfig());
  const [authConfig, setAuthConfig] = useState<AuthCustomizationConfig>(() => getSavedAuthCustomization());
  const [brandingSavedSuccess, setBrandingSavedSuccess] = useState(false);

  useEffect(() => {
    setBranding(getSavedBrandingConfig());
    setAuthConfig(getSavedAuthCustomization());
  }, []);

  const handleUpdateBranding = (partial: Partial<AppBrandingConfig>) => {
    const updated = applyBrandingConfig(partial);
    setBranding(updated);
    window.dispatchEvent(new Event('branding_updated'));
    setBrandingSavedSuccess(true);
    setTimeout(() => setBrandingSavedSuccess(false), 2000);
    if (user?.uid) {
      saveUserPreferences(user.uid, { branding: updated }).catch(() => {});
    }
  };

  const handleUpdateAuth = (partial: Partial<AuthCustomizationConfig>) => {
    const updated = saveAuthCustomization(partial);
    setAuthConfig(updated);
    setBrandingSavedSuccess(true);
    setTimeout(() => setBrandingSavedSuccess(false), 2000);
    if (user?.uid) {
      saveUserPreferences(user.uid, { authCustomization: updated }).catch(() => {});
    }
  };

  const currentMenuItems = branding.menuItems || DEFAULT_MENU_ITEMS;

  const handleMoveMenuItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentMenuItems.length) return;
    const newItems = [...currentMenuItems];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    handleUpdateBranding({ menuItems: newItems });
  };

  const handleToggleMenuItemVisibility = (id: string) => {
    const meta = MENU_ITEMS_METADATA[id];
    if (meta?.isLocked) return;
    const newItems = currentMenuItems.map((item) =>
      item.id === id ? { ...item, visible: item.visible === false ? true : false } : item
    );
    handleUpdateBranding({ menuItems: newItems });
  };

  const handleResetMenuItems = () => {
    handleUpdateBranding({ menuItems: DEFAULT_MENU_ITEMS });
  };

  const handleShowAllMenuItems = () => {
    const newItems = currentMenuItems.map((item) => ({ ...item, visible: true }));
    handleUpdateBranding({ menuItems: newItems });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Workspace Settings
          </h2>
        </div>
        {brandingSavedSuccess && (
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Workspace Saved
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div
          className={`p-5 sm:p-6 rounded-xl border space-y-4 lg:col-span-2 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                Welcome Screen
              </h3>

            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  id: 'two_column',
                  label: 'Split Screen',
                },
                {
                  id: 'centered',
                  label: 'Minimalist',
                },
              ].map((mode) => {
                  const isSelected = authConfig.layoutMode === mode.id;
                  const previewImg = authConfig.mediaType === 'single'
                    ? authConfig.singleImageUrl
                    : (authConfig.slideshowImages?.[0] || authConfig.singleImageUrl);

                  return (
                    <div
                      key={mode.id}
                      onClick={() => handleUpdateAuth({ layoutMode: mode.id as any })}
                      className="flex flex-col gap-2.5 cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="pointer-events-none shrink-0">
                          <CheckCircle
                            checked={isSelected}
                            size="sm"
                            isLight={isLight}
                          />
                        </div>
                        <div className={`text-xs font-semibold ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-slate-100'}`}>
                          {mode.label}
                        </div>
                      </div>

                      <WelcomeScreenLayoutMockup
                        mode={mode.id as 'two_column' | 'centered'}
                        isSelected={isSelected}
                        isLight={isLight}
                        imageUrl={previewImg}
                        darkOverlay={authConfig.darkOverlay}
                        overlayOpacity={authConfig.overlayOpacity}
                      />
                    </div>
                  );
                })}
              </div>

            {authConfig.layoutMode === 'two_column' && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                  Background Media Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'single', label: 'Single Image' },
                    { id: 'slideshow', label: 'Slideshow' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleUpdateAuth({ mediaType: m.id as any })}
                      className={`p-3 rounded-lg border text-center transition-colors cursor-pointer ${
                        authConfig.mediaType === m.id
                          ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : isLight
                          ? 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                          : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-750'
                      }`}
                    >
                      <div className="text-xs font-semibold">{m.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {authConfig.layoutMode === 'two_column' && (
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              {authConfig.mediaType === 'single' ? (
                <div className="space-y-1.5">
                  <ImageInputWithMediaPicker
                    label="Single Background Image URL"
                    value={authConfig.singleImageUrl}
                    onChange={(val) => handleUpdateAuth({ singleImageUrl: val })}
                    placeholder="https://images.unsplash.com/... or select from media"
                    variant="pill"
                    isLight={isLight}
                    modalTitle="Choose Welcome Screen Image"
                    hint="Large cover visual displayed on split-screen sign in / sign up pages."
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                      Slideshow Image URLs (Comma separated)
                    </label>
                  </div>
                  <textarea
                    rows={3}
                    value={authConfig.slideshowImages.join(',\n')}
                    onChange={(e) => {
                      const urls = e.target.value.split(/[\n,]+/).map((u) => u.trim()).filter(Boolean);
                      handleUpdateAuth({ slideshowImages: urls });
                    }}
                    placeholder="https://image1.jpg, https://image2.jpg"
                    className={`w-full px-3.5 py-3 rounded-2xl border text-xs outline-none transition-all ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-slate-900'
                        : 'bg-slate-800 border-slate-700 focus:bg-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-slate-100'
                    }`}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Interval between slides (seconds)</span>
                    <input
                      type="number"
                      min={2}
                      max={30}
                      value={authConfig.slideshowIntervalSeconds || 5}
                      onChange={(e) => handleUpdateAuth({ slideshowIntervalSeconds: parseInt(e.target.value) || 5 })}
                      className={`w-24 px-3 py-2 rounded-full border text-xs outline-none transition-all text-center ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-slate-900'
                          : 'bg-slate-800 border-slate-700 focus:bg-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-slate-100'
                      }`}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <CheckCircle
                  checked={!!authConfig.darkOverlay}
                  onChange={(checked) => handleUpdateAuth({ darkOverlay: checked })}
                  size="sm"
                  isLight={isLight}
                  label="Apply Dark Overlay over Background Image"
                  labelClassName="font-medium text-slate-700 dark:text-slate-300"
                />

                {authConfig.darkOverlay && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">Opacity: {authConfig.overlayOpacity ?? 50}%</span>
                    <input
                      type="range"
                      min={10}
                      max={90}
                      value={authConfig.overlayOpacity ?? 50}
                      onChange={(e) => handleUpdateAuth({ overlayOpacity: parseInt(e.target.value) })}
                      className="w-32 accent-indigo-600 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div
          className={`p-5 sm:p-6 rounded-xl border space-y-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                Sidebar Layout
              </h3>

            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                id: 'standard',
                label: 'Standard',
              },
              {
                id: 'stacked',
                label: 'Stacked',
              },
            ].map((opt) => {
              const isSelected = (branding.sidebarLayout || 'standard') === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() =>
                    handleUpdateBranding({ sidebarLayout: opt.id as SidebarLayoutMode })
                  }
                  className="flex flex-col gap-2.5 cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <div className="pointer-events-none shrink-0">
                      <CheckCircle
                        checked={isSelected}
                        size="sm"
                        isLight={isLight}
                      />
                    </div>
                    <div className={`text-xs font-semibold ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-slate-100'}`}>
                      {opt.label}
                    </div>
                  </div>

                  <SidebarMenuMockup
                    layout={opt.id as 'standard' | 'stacked'}
                    isSelected={isSelected}
                    isLight={isLight}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={`p-5 sm:p-6 rounded-xl border space-y-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
              Mobile Hamburger Style
            </h3>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { id: 'descending', label: 'Descending' },
              { id: 'standard', label: 'Classic' },
              { id: 'ascending', label: 'Ascending' },
              { id: 'middle_short', label: 'Middle' },
              { id: 'staggered_right', label: 'Right' },
              { id: 'staggered_left', label: 'Left' },
            ].map((styleOpt) => {
              const isSelected =
                (branding.hamburgerIconStyle || 'descending') === styleOpt.id;
              return (
                <button
                  key={styleOpt.id}
                  type="button"
                  onClick={() =>
                    handleUpdateBranding({
                      hamburgerIconStyle: styleOpt.id as HamburgerIconStyle,
                    })
                  }
                  className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer text-center ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 text-indigo-600 font-semibold'
                      : isLight
                      ? 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  <HamburgerLinesIcon
                    style={styleOpt.id as HamburgerIconStyle}
                    className="w-4 h-4"
                  />
                  <span className="text-[10px] truncate w-full">{styleOpt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          className={`p-5 sm:p-6 rounded-xl border space-y-4 lg:col-span-2 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                Customize Navigation Menu
              </h3>

            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleShowAllMenuItems}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isLight
                    ? 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Show all hidden pages in navigation"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Show All</span>
              </button>

              <button
                type="button"
                onClick={handleResetMenuItems}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isLight
                    ? 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Reset navigation menu order and visibility to default"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {currentMenuItems.map((item, index) => {
              const meta = MENU_ITEMS_METADATA[item.id] || {
                label: item.id,
                desc: 'Workspace page',
                icon: Menu,
              };
              const Icon = meta.icon;
              const isVisible = item.visible !== false;
              const isFirst = index === 0;
              const isLast = index === currentMenuItems.length - 1;

              return (
                <div
                  key={item.id}
                  className={`p-3 sm:p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    isVisible
                      ? isLight
                        ? 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-50'
                        : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800/90'
                      : isLight
                      ? 'bg-slate-100/40 border-slate-200/40 opacity-60 hover:opacity-80'
                      : 'bg-slate-850/40 border-slate-800/40 opacity-50 hover:opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveMenuItem(index, 'up')}
                        disabled={isFirst}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isFirst
                            ? 'opacity-30 cursor-not-allowed border-transparent text-slate-400'
                            : isLight
                            ? 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                        title={isFirst ? 'First item' : 'Move up'}
                        aria-label={`Move ${meta.label} up`}
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveMenuItem(index, 'down')}
                        disabled={isLast}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isLast
                            ? 'opacity-30 cursor-not-allowed border-transparent text-slate-400'
                            : isLight
                            ? 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                        title={isLast ? 'Last item' : 'Move down'}
                        aria-label={`Move ${meta.label} down`}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 w-5 shrink-0 text-center">
                      #{index + 1}
                    </span>

                    <div
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
                        isVisible
                          ? isLight
                            ? 'bg-white border-slate-200 text-indigo-600 shadow-2xs'
                            : 'bg-slate-800 border-slate-700 text-indigo-400'
                          : isLight
                          ? 'bg-slate-200/50 border-slate-300/50 text-slate-400'
                          : 'bg-slate-800/40 border-slate-700/40 text-slate-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold truncate ${
                            isVisible
                              ? 'text-slate-900 dark:text-white'
                              : 'text-slate-500 dark:text-slate-400 line-through'
                          }`}
                        >
                          {meta.label}
                        </span>

                        {meta.isLocked && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            Required
                          </span>
                        )}
                      </div>

                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span
                      className={`hidden xs:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        isVisible
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20'
                      }`}
                    >
                      {isVisible ? 'Visible' : 'Hidden'}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleMenuItemVisibility(item.id)}
                      disabled={meta.isLocked}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                        meta.isLocked
                          ? 'opacity-40 cursor-not-allowed border-transparent text-slate-400'
                          : isVisible
                          ? isLight
                            ? 'bg-white border-slate-200 text-slate-700 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50/50'
                            : 'bg-slate-800 border-slate-700 text-slate-200 hover:border-amber-500/40 hover:text-amber-400 hover:bg-amber-950/20'
                          : isLight
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'
                          : 'bg-indigo-950/50 border-indigo-800 text-indigo-300 hover:bg-indigo-900/60'
                      }`}
                      title={
                        meta.isLocked
                          ? 'This page is required and cannot be hidden'
                          : isVisible
                          ? `Hide ${meta.label} from navigation`
                          : `Show ${meta.label} in navigation`
                      }
                    >
                      {isVisible ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Hide</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Show</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
