import React, { useState, useEffect } from 'react';
import { Input, Card, PillOptions } from '../../../common';
import {
  Sun,
  Moon,
  Sparkles,
  Clock,
  Palette,
  Type,
  SlidersHorizontal,
  MoveHorizontal,
  RotateCcw,
  ChevronRight,
  Check,
  Heading,
  AlignLeft,
  Layers
} from 'lucide-react';
import {
  INTERFACE_FONTS,
  INTERFACE_PALETTES,
  COLOR_FAMILIES,
  HEADING_TRACKING_OPTIONS,
  BODY_TRACKING_OPTIONS,
  getSavedAppFont,
  getSavedHeadingFont,
  getSavedFontMode,
  getSavedAppPalette,
  getSavedHeadingTracking,
  getSavedBodyTracking,
  getSavedSurfaceMode,
  saveSurfaceMode,
  SurfaceBackgroundMode,
  applyAppInterfaceFont,
  applyAppInterfacePalette,
  applyAppLetterSpacing
} from '../../../../utils/themePreferences';
import {
  getSavedThemeConfig,
  saveThemeConfig,
  calculateActiveTheme,
  ThemeScheduleConfig,
  ThemeMode
} from '../../../../utils/themeSchedule';
import { findFontByIdOrName } from '../../../../data/fonts';
import { FontModal } from '../../FontModal';
import { useAuth } from '../../../../context/AuthContext';
import { saveUserPreferences } from '../../../../services/userPreferencesService';

function getHexHueAndSat(hex: string): { h: number; s: number; l: number } {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s, l };
}

function getPaletteToneGroup(pal: any): number {
  const nameLower = (pal.name + ' ' + pal.id + ' ' + (pal.category || '')).toLowerCase();

  if (
    nameLower.includes('slate') ||
    nameLower.includes('zinc') ||
    nameLower.includes('linen') ||
    nameLower.includes('monochrome') ||
    nameLower.includes('neutral') ||
    nameLower.includes('oatmeal') ||
    nameLower.includes('obsidian')
  ) {
    return 0;
  }

  const { h, s, l } = getHexHueAndSat(pal.primary);

  if (s < 0.18 || l < 0.15 || l > 0.92) {
    return 0;
  }

  if (h >= 80 && h <= 280) {
    return 1;
  }

  return 2;
}

const SORTED_INTERFACE_PALETTES = [...INTERFACE_PALETTES].sort((a, b) => {
  const groupA = getPaletteToneGroup(a);
  const groupB = getPaletteToneGroup(b);
  if (groupA !== groupB) return groupA - groupB;
  const hueA = getHexHueAndSat(a.primary).h;
  const hueB = getHexHueAndSat(b.primary).h;
  return hueA - hueB;
});

const getDescriptivePaletteName = (pal: { id: string; name: string }) => {
  const overrides: Record<string, string> = {
    amethyst: 'Amethyst Royal Purple',
    cherry: 'Cherry Crimson Red',
    royal_bronze: 'Royal Amber Bronze',
    midnight_slate: 'Midnight Slate Gray',
    zinc: 'Modern Zinc Silver',
    charcoal: 'Obsidian Charcoal Gray',
    ultramarine: 'Ultramarine Blue & Cyan',
    emerald_jade: 'Emerald Jade Green',
    monochrome_stark: 'Stark Monochrome Black & White',
  };
  return overrides[pal.id] || pal.name;
};

interface AppearanceSettingsProps {
  uiTheme: 'dark' | 'light';
  onToggleUiTheme: () => void;
  onSetUiTheme?: (theme: 'dark' | 'light') => void;
}

export const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  uiTheme,
  onToggleUiTheme,
  onSetUiTheme,
}) => {
  const { user } = useAuth();
  const userId = user?.uid || '';
  const isLight = uiTheme === 'light';

  const [currentFont, setCurrentFont] = useState<string>(() => getSavedAppFont());
  const [headingFont, setHeadingFont] = useState<string>(() => getSavedHeadingFont());
  const [fontMode, setFontMode] = useState<'same_font' | 'separate_heading'>(() => getSavedFontMode());
  const [modalTarget, setModalTarget] = useState<'body' | 'heading'>('body');

  const [currentPalette, setCurrentPalette] = useState<string>(() => getSavedAppPalette());
  const [paletteCategoryFilter, setPaletteCategoryFilter] = useState<string>('All');
  const [headingTracking, setHeadingTracking] = useState<string>(() => getSavedHeadingTracking());
  const [bodyTracking, setBodyTracking] = useState<string>(() => getSavedBodyTracking());
  const [spacingMode, setSpacingMode] = useState<'same_spacing' | 'separate_spacing'>(() =>
    getSavedHeadingTracking() === getSavedBodyTracking() ? 'same_spacing' : 'separate_spacing'
  );
  const [isFontModalOpen, setIsFontModalOpen] = useState(false);
  const [themeScheduleConfig, setThemeScheduleConfig] = useState<ThemeScheduleConfig>(() => getSavedThemeConfig());
  const [showAllPalettes, setShowAllPalettes] = useState(false);

  useEffect(() => {
    const refreshState = () => {
      setCurrentFont(getSavedAppFont());
      setHeadingFont(getSavedHeadingFont());
      setFontMode(getSavedFontMode());
      setCurrentPalette(getSavedAppPalette());
      setHeadingTracking(getSavedHeadingTracking());
      setBodyTracking(getSavedBodyTracking());
    };

    refreshState();
    window.addEventListener('active_workspace_changed', refreshState);
    window.addEventListener('app_font_changed', refreshState);
    window.addEventListener('user_preferences_updated', refreshState);
    return () => {
      window.removeEventListener('active_workspace_changed', refreshState);
      window.removeEventListener('app_font_changed', refreshState);
      window.removeEventListener('user_preferences_updated', refreshState);
    };
  }, []);

  const handleUpdateThemeSchedule = (updates: Partial<ThemeScheduleConfig>) => {
    const updated = saveThemeConfig(updates);
    setThemeScheduleConfig(updated);
    const nextActive = calculateActiveTheme(updated);
    saveUserPreferences(userId, { themeSchedule: updated, themeMode: nextActive }).catch(() => {});
    if (onSetUiTheme) {
      onSetUiTheme(nextActive);
    } else if (nextActive !== uiTheme) {
      onToggleUiTheme();
    }
  };

  const handleFontModeChange = (mode: 'same_font' | 'separate_heading') => {
    setFontMode(mode);
    applyAppInterfaceFont(currentFont, headingFont, mode);
    saveUserPreferences(userId, { fontMode: mode }).catch(() => {});
  };

  const handleOpenFontModal = (target: 'body' | 'heading') => {
    setModalTarget(target);
    setIsFontModalOpen(true);
  };

  const handleSelectPalette = (paletteId: string) => {
    setCurrentPalette(paletteId);
    applyAppInterfacePalette(paletteId);
    saveUserPreferences(userId, { appPalette: paletteId }).catch(() => {});
  };

  const handleHeadingTrackingChange = (val: string) => {
    setHeadingTracking(val);
    applyAppLetterSpacing(val, bodyTracking);
    saveUserPreferences(userId, { headingTracking: val }).catch(() => {});
  };

  const handleBodyTrackingChange = (val: string) => {
    setBodyTracking(val);
    applyAppLetterSpacing(headingTracking, val);
    saveUserPreferences(userId, { bodyTracking: val }).catch(() => {});
  };

  const handleSpacingModeChange = (mode: 'same_spacing' | 'separate_spacing') => {
    setSpacingMode(mode);
    if (mode === 'same_spacing') {
      handleUniformTrackingChange(headingTracking);
    }
  };

  const handleUniformTrackingChange = (val: string) => {
    setHeadingTracking(val);
    setBodyTracking(val);
    applyAppLetterSpacing(val, val);
    saveUserPreferences(userId, { headingTracking: val, bodyTracking: val }).catch(() => {});
  };

  const handleResetLetterSpacing = () => {
    if (spacingMode === 'same_spacing') {
      handleUniformTrackingChange('0.015em');
    } else {
      setHeadingTracking('0em');
      setBodyTracking('0.015em');
      applyAppLetterSpacing('0em', '0.015em');
      saveUserPreferences(userId, { headingTracking: '0em', bodyTracking: '0.015em' }).catch(() => {});
    }
  };

  const activeBodyFontObj = findFontByIdOrName(currentFont) || INTERFACE_FONTS[0];
  const activeHeadingFontObj = findFontByIdOrName(headingFont) || activeBodyFontObj;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Appearance & Typography
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div
          className={`p-5 sm:p-6 rounded-xl border space-y-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
              Theme
            </h3>
          </div>

          <div className="space-y-1.5">
            <PillOptions
              options={[
                { id: 'manual', label: 'Manual' },
                { id: 'system', label: 'System' },
                { id: 'local_time', label: 'Local' },
                { id: 'scheduled', label: 'Schedule' },
              ]}
              value={themeScheduleConfig.mode}
              onChange={(mode) => handleUpdateThemeSchedule({ mode: mode as any, manualTheme: themeScheduleConfig.manualTheme || uiTheme })}
              isLight={isLight}
              scrollable
            />
          </div>

          {themeScheduleConfig.mode === 'manual' && (
            <div className="flex flex-row items-center gap-6 pt-1">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="radio"
                  name="manualTheme"
                  checked={isLight}
                  onChange={() => handleUpdateThemeSchedule({ mode: 'manual', manualTheme: 'light' })}
                  className="w-4 h-4 accent-indigo-600 dark:accent-indigo-500 text-indigo-600 border-slate-300 dark:border-slate-700 focus:ring-indigo-500 bg-transparent cursor-pointer"
                />
                <span>Light</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="radio"
                  name="manualTheme"
                  checked={!isLight}
                  onChange={() => handleUpdateThemeSchedule({ mode: 'manual', manualTheme: 'dark' })}
                  className="w-4 h-4 accent-indigo-600 dark:accent-indigo-500 text-indigo-600 border-slate-300 dark:border-slate-700 focus:ring-indigo-500 bg-transparent cursor-pointer"
                />
                <span>Dark</span>
              </label>
            </div>
          )}

          {themeScheduleConfig.mode === 'system' && (
            <div className="text-xs space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  System Preferences
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'Dark Active' : 'Light Active'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Syncs with your operating system or browser theme settings.
              </p>
            </div>
          )}

          {themeScheduleConfig.mode === 'local_time' && (
            <div className="text-xs space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Auto Switch
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {new Date().getHours() >= 18 || new Date().getHours() < 6
                    ? 'Dark Active'
                    : 'Light Active'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Light (06:00 - 18:00) & Dark (18:00 - 06:00).
              </p>
            </div>
          )}

          {themeScheduleConfig.mode === 'scheduled' && (
            <div className="text-xs space-y-2.5 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Light Start"
                  type="time"
                  value={themeScheduleConfig.lightStartTime}
                  onChange={(e) => handleUpdateThemeSchedule({ lightStartTime: e.target.value })}
                  variant="rounded"
                  inputSize="sm"
                  isLight={isLight}
                  className="font-mono"
                />
                <Input
                  label="Dark Start"
                  type="time"
                  value={themeScheduleConfig.darkStartTime}
                  onChange={(e) => handleUpdateThemeSchedule({ darkStartTime: e.target.value })}
                  variant="rounded"
                  inputSize="sm"
                  isLight={isLight}
                  className="font-mono"
                />
              </div>
            </div>
          )}
        </div>

        <div
          className={`p-5 sm:p-6 rounded-xl border space-y-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
            <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
              Palette
            </h3>
            {(() => {
              const pal = INTERFACE_PALETTES.find((p) => p.id === currentPalette) || INTERFACE_PALETTES[0];
              return (
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center -space-x-1">
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-2xs shrink-0"
                      style={{ backgroundColor: pal.primary }}
                      title={`Primary: ${pal.primary}`}
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-2xs shrink-0"
                      style={{ backgroundColor: pal.accent }}
                      title={`Accent: ${pal.accent}`}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {getDescriptivePaletteName(pal)}
                  </span>
                </div>
              );
            })()}
          </div>

          <div className="flex flex-wrap gap-2.5 items-center pt-1">
            {(() => {
              const defaultLimit = 16;
              const displayedPalettes = showAllPalettes
                ? SORTED_INTERFACE_PALETTES
                : SORTED_INTERFACE_PALETTES.slice(0, defaultLimit);

              const currentPaletteObj = SORTED_INTERFACE_PALETTES.find(p => p.id === currentPalette);
              const isCurrentPaletteVisible = displayedPalettes.some(p => p.id === currentPalette);
              const finalPalettesToRender = (!showAllPalettes && currentPaletteObj && !isCurrentPaletteVisible)
                ? [...displayedPalettes, currentPaletteObj]
                : displayedPalettes;

              return finalPalettesToRender.map((pal) => {
                const isSelected = currentPalette === pal.id;
                const descName = getDescriptivePaletteName(pal);
                return (
                  <button
                    key={pal.id}
                    type="button"
                    onClick={() => handleSelectPalette(pal.id)}
                    className={`w-8 h-8 min-w-[32px] min-h-[32px] aspect-square rounded-full relative flex items-center justify-center cursor-pointer transition-transform duration-150 shrink-0 p-0 outline-none ${
                      isSelected
                        ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-slate-900 scale-110 shadow-xs'
                        : 'hover:scale-105'
                    }`}
                    title={`${descName}\nPrimary: ${pal.primary}\nAccent: ${pal.accent}`}
                  >
                    <svg
                      viewBox="0 0 32 32"
                      className="w-full h-full aspect-square rounded-full overflow-hidden block pointer-events-none"
                    >
                      <path d="M 16 0 A 16 16 0 0 0 16 32 Z" fill={pal.primary} />
                      <path d="M 16 0 A 16 16 0 0 1 16 32 Z" fill={pal.accent || pal.primary} />
                    </svg>

                    {isSelected && (
                      <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/35 pointer-events-none">
                        <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                      </div>
                    )}
                    <span className="sr-only">{descName}</span>
                  </button>
                );
              });
            })()}
          </div>

          {SORTED_INTERFACE_PALETTES.length > 16 && (
            <div className="flex justify-start pt-1">
              <button
                type="button"
                onClick={() => setShowAllPalettes(!showAllPalettes)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:underline cursor-pointer flex items-center gap-1 bg-transparent border-0"
              >
                {showAllPalettes ? 'Show less' : `Show more (+${SORTED_INTERFACE_PALETTES.length - 16} palettes)`}
              </button>
            </div>
          )}
        </div>

        <div
          className={`p-5 sm:p-6 rounded-xl border space-y-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
            <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
              Typography
            </h3>
            <div className="shrink-0">
              <PillOptions
                options={[
                  { id: 'same_font', label: 'Uniform' },
                  { id: 'separate_heading', label: 'Custom' },
                ]}
                value={fontMode}
                onChange={(mode) => handleFontModeChange(mode as any)}
                isLight={isLight}
                scrollable
              />
            </div>
          </div>

          {fontMode === 'same_font' ? (
            <div className="flex items-center justify-between text-xs py-1">
              <span
                className="font-semibold text-slate-800 dark:text-slate-200"
                style={{ fontFamily: activeBodyFontObj.family }}
              >
                {activeBodyFontObj.name}
              </span>
              <button
                type="button"
                onClick={() => handleOpenFontModal('body')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-semibold cursor-pointer border-b border-dotted border-indigo-600 dark:border-indigo-400 pb-0.5"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="space-y-4 py-1">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold block">
                  Heading
                </span>
                <div className="flex items-center justify-between text-xs">
                  <span
                    className="font-semibold text-slate-800 dark:text-slate-200"
                    style={{ fontFamily: activeHeadingFontObj.family }}
                  >
                    {activeHeadingFontObj.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenFontModal('heading')}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-semibold cursor-pointer border-b border-dotted border-indigo-600 dark:border-indigo-400 pb-0.5"
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold block">
                  Body
                </span>
                <div className="flex items-center justify-between text-xs">
                  <span
                    className="font-semibold text-slate-800 dark:text-slate-200"
                    style={{ fontFamily: activeBodyFontObj.family }}
                  >
                    {activeBodyFontObj.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenFontModal('body')}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-semibold cursor-pointer border-b border-dotted border-indigo-600 dark:border-indigo-400 pb-0.5"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className={`p-5 sm:p-6 rounded-xl border space-y-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                Spacing
              </h3>
              <button
                type="button"
                onClick={handleResetLetterSpacing}
                className="text-xs font-medium text-slate-400 hover:text-indigo-500 hover:border-indigo-500 flex items-center cursor-pointer transition-colors border-b border-dotted border-slate-400 pb-0.5"
              >
                <span>Reset</span>
              </button>
            </div>
            <div className="shrink-0">
              <PillOptions
                options={[
                  { id: 'same_spacing', label: 'Uniform' },
                  { id: 'separate_spacing', label: 'Custom' },
                ]}
                value={spacingMode}
                onChange={(mode) => handleSpacingModeChange(mode as any)}
                isLight={isLight}
                scrollable
              />
            </div>
          </div>

          {spacingMode === 'same_spacing' ? (
            <div className="space-y-2 py-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Letter Spacing
                </span>
                <input
                  type="number"
                  step="0.005"
                  min="-0.1"
                  max="0.2"
                  value={headingTracking.replace('em', '')}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === '') {
                      handleUniformTrackingChange('0em');
                      return;
                    }
                    const val = parseFloat(raw);
                    if (!isNaN(val)) {
                      const clamped = Math.max(-0.1, Math.min(0.2, val));
                      handleUniformTrackingChange(clamped + 'em');
                    }
                  }}
                  onBlur={() => {
                    const val = parseFloat(headingTracking);
                    if (isNaN(val) || val < -0.1 || val > 0.2) {
                      handleUniformTrackingChange('0em');
                    }
                  }}
                  className={`w-14 px-1.5 py-1 text-xs font-mono font-semibold rounded-md border text-right focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-transparent ${
                    isLight
                      ? 'border-slate-300 text-slate-700'
                      : 'border-slate-600 text-slate-300'
                  }`}
                />
              </div>
              <PillOptions
                options={HEADING_TRACKING_OPTIONS.map((opt) => ({ id: opt.value, label: opt.label }))}
                value={headingTracking}
                onChange={handleUniformTrackingChange}
                isLight={isLight}
                scrollable
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-1">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Heading
                  </span>
                  <input
                    type="number"
                    step="0.005"
                    min="-0.1"
                    max="0.2"
                    value={headingTracking.replace('em', '')}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === '') {
                        handleHeadingTrackingChange('0em');
                        return;
                      }
                      const val = parseFloat(raw);
                      if (!isNaN(val)) {
                        const clamped = Math.max(-0.1, Math.min(0.2, val));
                        handleHeadingTrackingChange(clamped + 'em');
                      }
                    }}
                    onBlur={() => {
                      const val = parseFloat(headingTracking);
                      if (isNaN(val) || val < -0.1 || val > 0.2) {
                        handleHeadingTrackingChange('0em');
                      }
                    }}
                    className={`w-14 px-1.5 py-1 text-xs font-mono font-semibold rounded-md border text-right focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-transparent ${
                      isLight
                        ? 'border-slate-300 text-slate-700'
                        : 'border-slate-600 text-slate-300'
                    }`}
                  />
                </div>
                <PillOptions
                  options={HEADING_TRACKING_OPTIONS.map((opt) => ({ id: opt.value, label: opt.label }))}
                  value={headingTracking}
                  onChange={handleHeadingTrackingChange}
                  isLight={isLight}
                  scrollable
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Body
                  </span>
                  <input
                    type="number"
                    step="0.005"
                    min="-0.1"
                    max="0.2"
                    value={bodyTracking.replace('em', '')}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === '') {
                        handleBodyTrackingChange('0.015em');
                        return;
                      }
                      const val = parseFloat(raw);
                      if (!isNaN(val)) {
                        const clamped = Math.max(-0.1, Math.min(0.2, val));
                        handleBodyTrackingChange(clamped + 'em');
                      }
                    }}
                    onBlur={() => {
                      const val = parseFloat(bodyTracking);
                      if (isNaN(val) || val < -0.1 || val > 0.2) {
                        handleBodyTrackingChange('0.015em');
                      }
                    }}
                    className={`w-14 px-1.5 py-1 text-xs font-mono font-semibold rounded-md border text-right focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-transparent ${
                      isLight
                        ? 'border-slate-300 text-slate-700'
                        : 'border-slate-600 text-slate-300'
                    }`}
                  />
                </div>
                <PillOptions
                  options={BODY_TRACKING_OPTIONS.map((opt) => ({ id: opt.value, label: opt.label }))}
                  value={bodyTracking}
                  onChange={handleBodyTrackingChange}
                  isLight={isLight}
                  scrollable
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {isFontModalOpen && (
        <FontModal
          isOpen={isFontModalOpen}
          onClose={() => setIsFontModalOpen(false)}
          title={
            modalTarget === 'heading'
              ? 'Heading Typography'
              : fontMode === 'same_font'
              ? 'Interface Typography'
              : 'Body Typography'
          }
          currentFontId={modalTarget === 'heading' ? headingFont : currentFont}
          onSelectFont={(fontId) => {
            if (modalTarget === 'heading') {
              setHeadingFont(fontId);
              applyAppInterfaceFont(currentFont, fontId, fontMode);
              saveUserPreferences(userId, { headingFont: fontId, appFont: currentFont, fontMode }).catch(() => {});
            } else {
              setCurrentFont(fontId);
              applyAppInterfaceFont(fontId, headingFont, fontMode);
              saveUserPreferences(userId, { appFont: fontId, headingFont, fontMode }).catch(() => {});
            }
          }}
          uiTheme={uiTheme}
        />
      )}
    </div>
  );
};
