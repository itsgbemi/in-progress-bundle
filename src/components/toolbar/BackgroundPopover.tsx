import React, { useState, useEffect } from 'react';
import { Check, Minus, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { InlineColorPicker, NoneNoDecorationIcon } from '../properties/InlineColorPicker';
import { SliderWithInput } from '../properties/SliderWithInput';
import { ImageInputWithMediaPicker } from '../common';
import { PRESET_IMAGES } from '../../data/presetSamples';
import { ElementStyles } from '../../types';

interface BackgroundPopoverProps {
  styles: ElementStyles;
  onUpdateStyle: (key: keyof ElementStyles | string, value: any) => void;
  onUpdateStyles?: (updates: Record<string, any>) => void;
  isLight?: boolean;
  allowImage?: boolean;
  hideNone?: boolean;
  hideSpacingAndRadius?: boolean;
}

const SmallInputBox: React.FC<{
  label: string;
  value: number;
  onChange: (val: number) => void;
  isLight?: boolean;
}> = ({ label, value, onChange, isLight = false }) => (
  <div className="flex items-center justify-between gap-1.5 py-0.5 min-w-0">
    <span className={`text-[11px] font-medium truncate shrink ${isLight ? 'text-slate-600' : 'text-slate-400'}`} title={label}>
      {label}
    </span>
    <input
      type="number"
      value={value}
      onChange={(e) => {
        const val = parseInt(e.target.value, 10);
        onChange(isNaN(val) ? 0 : Math.min(100, Math.max(0, val)));
      }}
      className={`w-11 px-1 py-1.5 text-center text-xs font-semibold rounded border outline-none transition-colors shadow-2xs ${
        isLight
          ? 'border-slate-300 hover:border-slate-400 text-slate-800 focus:border-indigo-500 bg-white'
          : 'border-slate-600 hover:border-slate-500 text-slate-100 focus:border-indigo-400 bg-slate-900'
      }`}
    />
  </div>
);

const BG_SOLID_PRESETS = [

  '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8',
  '#64748b', '#475569', '#334155', '#1e293b', '#0f172a', '#000000',

  '#dc2626', '#ef4444',
  '#be123c', '#f43f5e',
  '#ea580c', '#f97316',
  '#d97706', '#f59e0b',
  '#ca8a04', '#eab308',
  '#65a30d', '#84cc16',
  '#16a34a', '#22c55e',
  '#059669', '#10b981',
  '#0d9488', '#14b8a6',
  '#0891b2', '#06b6d4',
  '#0284c7', '#0ea5e9',
  '#2563eb', '#3b82f6',
  '#4338ca', '#4f46e5', '#6366f1',
  '#7c3aed', '#8b5cf6',
  '#9333ea', '#a855f7',
  '#c026d3', '#d946ef',
  '#db2777', '#ec4899',
];

const BG_GRADIENT_PRESETS = [

  { name: 'Crimson Glow', from: '#991b1b', to: '#ef4444' },
  { name: 'Solar Flare', from: '#f59e0b', to: '#ef4444' },
  { name: 'Sunset Horizon', from: '#e11d48', to: '#f59e0b' },

  { name: 'Rose Gold', from: '#f43f5e', to: '#fb7185' },
  { name: 'Flamingo Pink', from: '#ec4899', to: '#f43f5e' },
  { name: 'Cherry Blossom', from: '#fda4af', to: '#fb7185' },

  { name: 'Peachy Sunrise', from: '#fb923c', to: '#f43f5e' },
  { name: 'Golden Sun', from: '#ea580c', to: '#facc15' },

  { name: 'Warm Amber', from: '#b45309', to: '#f59e0b' },
  { name: 'Cyber Amber', from: '#d97706', to: '#fbbf24' },

  { name: 'Lime Zest', from: '#65a30d', to: '#a3e635' },
  { name: 'Mint Fresh', from: '#10b981', to: '#6ee7b7' },
  { name: 'Emerald Forest', from: '#059669', to: '#10b981' },
  { name: 'Aurora Borealis', from: '#047857', to: '#0284c7' },

  { name: 'Tropical Lagoon', from: '#059669', to: '#06b6d4' },
  { name: 'Nordic Teal', from: '#0d9488', to: '#38bdf8' },
  { name: 'Aqua Marine', from: '#0891b2', to: '#22d3ee' },
  { name: 'Ocean Cyan', from: '#0284c7', to: '#06b6d4' },

  { name: 'Sky Blue', from: '#2563eb', to: '#60a5fa' },

  { name: 'Indigo Dream', from: '#4f46e5', to: '#7c3aed' },
  { name: 'Deep Nebula', from: '#312e81', to: '#581c87' },
  { name: 'Royal Purple', from: '#7c3aed', to: '#c026d3' },
  { name: 'Electric Violet', from: '#8b5cf6', to: '#ec4899' },
  { name: 'Cosmic Magenta', from: '#a21caf', to: '#e879f9' },
  { name: 'Cotton Candy', from: '#f472b6', to: '#c084fc' },
  { name: 'Lavender Mist', from: '#c4b5fd', to: '#e9d5ff' },

  { name: 'Silver Steel', from: '#475569', to: '#94a3b8' },
  { name: 'Midnight Slate', from: '#0f172a', to: '#1e293b' },
  { name: 'Abyss Blue', from: '#0f172a', to: '#1e3a8a' },
  { name: 'Dark Velvet', from: '#18181b', to: '#27272a' },
  { name: 'Deep Space', from: '#020617', to: '#0f172a' },
];

export const BackgroundPopover: React.FC<BackgroundPopoverProps> = ({
  styles: s,
  onUpdateStyle: updateStyle,
  onUpdateStyles,
  isLight = false,
  allowImage = false,
  hideNone = false,
  hideSpacingAndRadius = false,
}) => {
  const isNone =
    s.backgroundType === 'transparent' ||
    s.backgroundColor === 'transparent' ||
    (!s.backgroundColor && !s.backgroundImage && !s.backgroundGradient);
  const isGrad =
    s.backgroundType === 'gradient' ||
    !!s.backgroundGradient ||
    (!!s.backgroundImage && s.backgroundImage.includes('gradient'));
  const isImg =
    s.backgroundType === 'image' ||
    (!!s.backgroundImage && !s.backgroundImage.includes('gradient'));

  const [activeTab, setActiveTab] = useState<'solid' | 'gradient' | 'image'>(
    allowImage && isImg ? 'image' : isGrad ? 'gradient' : 'solid'
  );

  const [paddingMode, setPaddingMode] = useState<'uniform' | 'pairs' | 'sides'>('uniform');
  const [radiusMode, setRadiusMode] = useState<'uniform' | 'pairs' | 'sides'>('uniform');
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [showOverlayColorPicker, setShowOverlayColorPicker] = useState<boolean>(false);
  const [showGradientSettings, setShowGradientSettings] = useState<boolean>(false);
  const [showAllSolidPresets, setShowAllSolidPresets] = useState<boolean>(false);
  const [showAllGradientPresets, setShowAllGradientPresets] = useState<boolean>(false);
  const PRESET_LIMIT = 14;

  const parseGradientStops = (
    gradStr?: string,
    from?: string,
    to?: string
  ): { stops: string[]; angle: number } => {
    if (gradStr) {
      const angleMatch = gradStr.match(/(\d+)deg/);
      const angle = angleMatch ? parseInt(angleMatch[1], 10) : 135;
      const colors = gradStr.match(/(#[a-fA-F0-9]{3,8}|rgba?\([^)]+\))/g);
      if (colors && colors.length >= 2) {
        return { stops: colors, angle };
      }
    }
    return {
      stops: [from || '#991b1b', to || '#ef4444'],
      angle: s.gradientAngle || 135,
    };
  };

  const initialGrad = parseGradientStops(
    s.backgroundGradient || s.backgroundImage,
    s.gradientFrom,
    s.gradientTo
  );

  const [gradientStops, setGradientStops] = useState<string[]>(initialGrad.stops);
  const [gradientAngle, setGradientAngle] = useState<number>(initialGrad.angle);
  const [activeStopIndex, setActiveStopIndex] = useState<number>(0);

  useEffect(() => {
    if (isGrad && (s.backgroundGradient || s.backgroundImage)) {
      const parsed = parseGradientStops(
        s.backgroundGradient || s.backgroundImage,
        s.gradientFrom,
        s.gradientTo
      );
      setGradientStops(parsed.stops);
      setGradientAngle(parsed.angle);
      if (activeStopIndex >= parsed.stops.length) {
        setActiveStopIndex(0);
      }
    }
  }, [s.backgroundGradient, s.backgroundImage, s.gradientFrom, s.gradientTo, s.gradientAngle]);

  const applyStyles = (updates: Record<string, any>) => {
    if (onUpdateStyles) {
      onUpdateStyles(updates);
    } else {
      Object.entries(updates).forEach(([k, v]) => updateStyle(k, v));
    }
  };

  const handleUpdateGradient = (
    newStops: string[],
    newAngle: number = gradientAngle
  ) => {
    setGradientStops(newStops);
    setGradientAngle(newAngle);
    const grad = `linear-gradient(${newAngle}deg, ${newStops.join(', ')})`;
    applyStyles({
      backgroundType: 'gradient',
      backgroundGradient: grad,
      backgroundImage: grad,
      gradientFrom: newStops[0],
      gradientTo: newStops[newStops.length - 1],
      gradientAngle: newAngle,
      backgroundColor: undefined,
    });
  };

  const labelClass = `text-[10px] font-bold block uppercase tracking-wider mb-1 ${
    isLight ? 'text-slate-600' : 'text-slate-400'
  }`;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {!hideNone && (
          <button
            type="button"
            onClick={() => {
              applyStyles({
                backgroundType: 'transparent',
                backgroundColor: 'transparent',
                backgroundImage: undefined,
                backgroundGradient: undefined,
              });
            }}
            className={`w-full py-2 px-3 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isNone
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500 shadow-xs'
                : isLight
                ? 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-400'
            }`}
            title="None"
          >
            <NoneNoDecorationIcon className="w-4 h-4 shrink-0" />
            <span>None</span>
          </button>
        )}

        <div className={`grid ${allowImage ? 'grid-cols-3' : 'grid-cols-2'} bg-transparent`}>
          <button
            type="button"
            onClick={() => {
              setActiveTab('solid');
              if (isNone || isGrad || isImg) {
                applyStyles({
                  backgroundType: 'solid',
                  backgroundColor: s.backgroundColor && s.backgroundColor !== 'transparent' ? s.backgroundColor : '#ffffff',
                  backgroundImage: undefined,
                  backgroundGradient: undefined,
                });
              }
            }}
            className={`pb-2 text-center font-semibold text-xs transition-all cursor-pointer bg-transparent border-b-2 -mb-px ${
              !isNone && activeTab === 'solid'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : activeTab === 'solid' && isNone
                ? 'border-indigo-400/50 text-indigo-500/80 font-medium'
                : isLight
                ? 'border-transparent text-slate-500 hover:text-slate-800'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Solid
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('gradient');
              const defaultPreset = BG_GRADIENT_PRESETS[0];
              const from = isGrad && s.gradientFrom ? s.gradientFrom : defaultPreset.from;
              const to = isGrad && s.gradientTo ? s.gradientTo : defaultPreset.to;
              const angle = isGrad && s.gradientAngle ? s.gradientAngle : 135;
              const currentStops = isGrad && gradientStops.length >= 2 ? gradientStops : [from, to];
              handleUpdateGradient(currentStops, angle);
            }}
            className={`pb-2 text-center font-semibold text-xs transition-all cursor-pointer bg-transparent border-b-2 -mb-px ${
              !isNone && activeTab === 'gradient'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : activeTab === 'gradient' && isNone
                ? 'border-indigo-400/50 text-indigo-500/80 font-medium'
                : isLight
                ? 'border-transparent text-slate-500 hover:text-slate-800'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Gradient
          </button>
          {allowImage && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('image');
                applyStyles({
                  backgroundType: 'image',
                  backgroundImage: s.backgroundImage && !s.backgroundImage.includes('gradient') ? s.backgroundImage : PRESET_IMAGES[0].url,
                  backgroundGradient: undefined,
                  backgroundColor: undefined,
                  backgroundOverlay: s.backgroundOverlay || 'none',
                  backgroundSize: s.backgroundSize || 'cover',
                  backgroundPosition: s.backgroundPosition || 'center',
                  backgroundRepeat: s.backgroundRepeat || 'no-repeat',
                });
              }}
              className={`pb-2 text-center font-semibold text-xs transition-all cursor-pointer bg-transparent border-b-2 -mb-px ${
                !isNone && activeTab === 'image'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                  : activeTab === 'image' && isNone
                  ? 'border-indigo-400/50 text-indigo-500/80 font-medium'
                  : isLight
                  ? 'border-transparent text-slate-500 hover:text-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Image
            </button>
          )}
        </div>

        {activeTab === 'solid' && (
          <div className="space-y-3 pt-1">
            <div>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => setShowColorPicker((prev) => !prev)}
                  className={`w-6 h-6 rounded-full border shadow-xs cursor-pointer hover:scale-110 transition-transform relative flex items-center justify-center shrink-0 ${
                    showColorPicker
                      ? 'border-indigo-600 bg-indigo-500/15 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-400/20 dark:text-indigo-400 ring-1 ring-indigo-500/30 font-bold'
                      : isLight
                      ? 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900'
                      : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600 hover:text-white'
                  }`}
                  title={showColorPicker ? 'Hide color selector' : 'Custom color selector'}
                  aria-label="Custom color selector"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                {(showAllSolidPresets ? BG_SOLID_PRESETS : BG_SOLID_PRESETS.slice(0, PRESET_LIMIT)).map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => {
                      applyStyles({
                        backgroundType: 'solid',
                        backgroundColor: hex,
                        backgroundImage: undefined,
                        backgroundGradient: undefined,
                      });
                    }}
                    className="w-6 h-6 rounded-full border border-slate-700/60 shadow-xs cursor-pointer hover:scale-110 transition-transform relative flex items-center justify-center shrink-0"
                    style={{ backgroundColor: hex }}
                    title={hex}
                  >
                    {!isNone && s.backgroundColor?.toLowerCase() === hex.toLowerCase() && (
                      <Check className={`w-3.5 h-3.5 mx-auto ${hex === '#ffffff' || hex === '#f8fafc' || hex === '#f1f5f9' || hex === '#e2e8f0' ? 'text-slate-900' : 'text-white'}`} />
                    )}
                  </button>
                ))}
                {BG_SOLID_PRESETS.length > PRESET_LIMIT && (
                  <button
                    type="button"
                    onClick={() => setShowAllSolidPresets((prev) => !prev)}
                    className="px-1.5 py-0.5 h-6 text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 shrink-0 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 bg-transparent border-0 hover:underline"
                    title={showAllSolidPresets ? 'Show fewer presets' : 'Show all presets'}
                  >
                    <span>{showAllSolidPresets ? 'Show Less' : `+${BG_SOLID_PRESETS.length - PRESET_LIMIT} More`}</span>
                    {showAllSolidPresets ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>

            {showColorPicker && (
              <div className="pt-1">
                <InlineColorPicker
                  color={s.backgroundColor && s.backgroundColor !== 'transparent' ? s.backgroundColor : '#ffffff'}
                  onChange={(hex) => {
                    applyStyles({
                      backgroundType: 'solid',
                      backgroundColor: hex,
                      backgroundImage: undefined,
                      backgroundGradient: undefined,
                    });
                  }}
                  isLight={isLight}
                  canvasHeight="h-36"
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'gradient' && (
          <div className="space-y-3 pt-1">
            <div>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => setShowGradientSettings((prev) => !prev)}
                  className={`w-6 h-6 rounded-full border shadow-xs cursor-pointer hover:scale-110 transition-transform relative flex items-center justify-center shrink-0 ${
                    showGradientSettings
                      ? 'border-indigo-600 bg-indigo-500/15 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-400/20 dark:text-indigo-400 ring-1 ring-indigo-500/30 font-bold'
                      : isLight
                      ? 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900'
                      : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600 hover:text-white'
                  }`}
                  title={showGradientSettings ? 'Hide custom gradient' : 'Custom gradient settings'}
                  aria-label="Custom gradient settings"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                {(showAllGradientPresets ? BG_GRADIENT_PRESETS : BG_GRADIENT_PRESETS.slice(0, PRESET_LIMIT)).map((p) => {
                  const angle = gradientAngle || 135;
                  const isCur =
                    !isNone &&
                    isGrad &&
                    gradientStops.length === 2 &&
                    gradientStops[0].toLowerCase() === p.from.toLowerCase() &&
                    gradientStops[1].toLowerCase() === p.to.toLowerCase();
                  const grad = `linear-gradient(${angle}deg, ${p.from}, ${p.to})`;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        const newStops = [p.from, p.to];
                        setActiveStopIndex(0);
                        handleUpdateGradient(newStops, angle);
                      }}
                      className="w-6 h-6 rounded-full border border-slate-700/60 shadow-xs cursor-pointer hover:scale-110 transition-transform relative flex items-center justify-center shrink-0"
                      style={{ background: grad }}
                      title={p.name}
                    >
                      {isCur && (
                        <Check className="w-3.5 h-3.5 text-white" />
                      )}
                    </button>
                  );
                })}
                {BG_GRADIENT_PRESETS.length > PRESET_LIMIT && (
                  <button
                    type="button"
                    onClick={() => setShowAllGradientPresets((prev) => !prev)}
                    className="px-1.5 py-0.5 h-6 text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 shrink-0 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 bg-transparent border-0 hover:underline"
                    title={showAllGradientPresets ? 'Show fewer presets' : 'Show all presets'}
                  >
                    <span>{showAllGradientPresets ? 'Show Less' : `+${BG_GRADIENT_PRESETS.length - PRESET_LIMIT} More`}</span>
                    {showAllGradientPresets ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>

            {showGradientSettings && (
              <div className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar pr-0.5">
                    {gradientStops.map((colorVal, index) => {
                      const isActive = activeStopIndex === index;
                      return (
                        <div
                          key={index}
                          onClick={() => setActiveStopIndex(index)}
                          className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                            isActive
                              ? isLight
                                ? 'bg-indigo-50/80 shadow-xs'
                                : 'bg-indigo-950/50 shadow-xs'
                              : isLight
                              ? 'bg-slate-50/80 hover:bg-slate-100'
                              : 'bg-slate-900/40 hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="w-6 h-6 rounded-full shrink-0 shadow-xs relative overflow-hidden"
                              style={{
                                backgroundImage:
                                  'linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)',
                                backgroundSize: '6px 6px',
                                backgroundPosition: '0 0, 0 3px, 3px -3px, -3px 0px',
                              }}
                            >
                              <span
                                className="absolute inset-0"
                                style={{ backgroundColor: colorVal }}
                              />
                            </span>

                            <input
                              type="text"
                              value={colorVal}
                              onClick={(e) => e.stopPropagation()}
                              onFocus={() => setActiveStopIndex(index)}
                              onChange={(e) => {
                                const val = e.target.value;
                                const next = [...gradientStops];
                                next[index] = val;
                                handleUpdateGradient(next);
                              }}
                              className={`w-20 px-2 py-1 rounded-lg border font-mono text-xs text-center outline-none transition-colors shadow-2xs ${
                                isLight
                                  ? 'bg-slate-50 border-slate-300 hover:border-slate-400 text-slate-800 focus:border-indigo-500'
                                  : 'bg-slate-800 border-slate-600 hover:border-slate-500 text-slate-100 focus:border-indigo-400'
                              }`}
                            />
                          </div>

                          <div
                            className="flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => {
                                if (index === 0) return;
                                const next = [...gradientStops];
                                const temp = next[index - 1];
                                next[index - 1] = next[index];
                                next[index] = temp;
                                setActiveStopIndex(index - 1);
                                handleUpdateGradient(next);
                              }}
                              className={`p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
                                index === 0
                                  ? 'opacity-20 cursor-not-allowed'
                                  : 'cursor-pointer text-slate-500 dark:text-slate-400'
                              }`}
                              title="Move stop up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={index === gradientStops.length - 1}
                              onClick={() => {
                                if (index === gradientStops.length - 1) return;
                                const next = [...gradientStops];
                                const temp = next[index + 1];
                                next[index + 1] = next[index];
                                next[index] = temp;
                                setActiveStopIndex(index + 1);
                                handleUpdateGradient(next);
                              }}
                              className={`p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
                                index === gradientStops.length - 1
                                  ? 'opacity-20 cursor-not-allowed'
                                  : 'cursor-pointer text-slate-500 dark:text-slate-400'
                              }`}
                              title="Move stop down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            {gradientStops.length > 2 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const next = gradientStops.filter((_, i) => i !== index);
                                  const newActive = Math.min(
                                    activeStopIndex,
                                    next.length - 1
                                  );
                                  setActiveStopIndex(newActive);
                                  handleUpdateGradient(next);
                                }}
                                className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                title="Remove this color stop"
                              >
                                <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const fallbackPalette = [
                        '#ef4444',
                        '#f97316',
                        '#f59e0b',
                        '#10b981',
                        '#06b6d4',
                        '#3b82f6',
                        '#8b5cf6',
                        '#ec4899',
                      ];
                      const nextColor =
                        fallbackPalette.find((c) => !gradientStops.includes(c)) ||
                        '#6366f1';
                      const next = [...gradientStops, nextColor];
                      const newIdx = next.length - 1;
                      setActiveStopIndex(newIdx);
                      handleUpdateGradient(next);
                    }}
                    className={`w-full py-2 px-3 rounded-xl border border-dashed font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isLight
                        ? 'border-indigo-300 text-indigo-600 hover:bg-indigo-50/70 hover:border-indigo-400'
                        : 'border-indigo-500/40 text-indigo-400 hover:bg-indigo-950/40 hover:border-indigo-400'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Color Stop</span>
                  </button>
                </div>

                <div className="pt-1">
                  <InlineColorPicker
                    color={gradientStops[activeStopIndex] || '#4f46e5'}
                    onChange={(hex) => {
                      const next = [...gradientStops];
                      next[activeStopIndex] = hex;
                      handleUpdateGradient(next);
                    }}
                    isLight={isLight}
                    canvasHeight="h-28"
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <SliderWithInput
                    label="Gradient Angle"
                    value={gradientAngle}
                    onChange={(val) => {
                      handleUpdateGradient(gradientStops, val);
                    }}
                    min={0}
                    max={360}
                    step={1}
                    unit="°"
                    hideValueBadge={true}
                    hideUnitText={true}
                    allowNegative={false}
                    hardMax={1000}
                    isLight={isLight}
                    labelClass={labelClass}
                  />

                  <div className="flex items-center gap-1">
                    {[45, 90, 135, 180, 270].map((deg) => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() => {
                          handleUpdateGradient(gradientStops, deg);
                        }}
                        className={`flex-1 py-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer text-center ${
                          gradientAngle === deg
                            ? isLight
                              ? 'bg-indigo-50 border-indigo-400 text-indigo-700'
                              : 'bg-indigo-950/60 border-indigo-500 text-indigo-300'
                            : isLight
                            ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                            : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-400'
                        }`}
                      >
                        {deg}°
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'image' && (
          <div className="space-y-3 pt-1">
            <ImageInputWithMediaPicker
              value={s.backgroundImage && !s.backgroundImage.includes('gradient') ? s.backgroundImage : ''}
              onChange={(val) =>
                applyStyles({
                  backgroundType: 'image',
                  backgroundImage: val,
                  backgroundGradient: undefined,
                  backgroundColor: undefined,
                  backgroundOverlay: s.backgroundOverlay || 'none',
                })
              }
              showClearButton={false}
              placeholder="https://images.unsplash.com/photo-... or select from media"
              isLight={isLight}
              variant="default"
              modalTitle="Select Background Image"
            />

            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  Overlay
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const isCurrentlyOn = s.backgroundOverlay && s.backgroundOverlay !== 'none';
                    if (isCurrentlyOn) {
                      applyStyles({
                        backgroundType: 'image',
                        backgroundOverlay: 'none',
                      });
                    } else {
                      applyStyles({
                        backgroundType: 'image',
                        backgroundOverlay: 'dark',
                      });
                    }
                  }}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    s.backgroundOverlay && s.backgroundOverlay !== 'none'
                      ? 'bg-indigo-600'
                      : isLight
                      ? 'bg-slate-300'
                      : 'bg-slate-700'
                  }`}
                  role="switch"
                  aria-checked={Boolean(s.backgroundOverlay && s.backgroundOverlay !== 'none')}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      s.backgroundOverlay && s.backgroundOverlay !== 'none' ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {s.backgroundOverlay && s.backgroundOverlay !== 'none' && (() => {
                const currentOverlayOpacity = typeof s.overlayOpacity === 'number' ? s.overlayOpacity : 50;
                const currentOverlayColor =
                  s.overlayColor ||
                  (s.backgroundOverlay === 'light'
                    ? '#ffffff'
                    : s.backgroundOverlay === 'gradient'
                    ? '#4f46e5'
                    : '#0f172a');

                const handleUpdateCustomOverlay = (color: string, opacity: number) => {
                  let cleanHex = color.replace('#', '');
                  if (cleanHex.length === 3) {
                    cleanHex = cleanHex.split('').map((c) => c + c).join('');
                  }
                  const num = parseInt(cleanHex, 16);
                  const r = isNaN(num) ? 15 : (num >> 16) & 255;
                  const g = isNaN(num) ? 23 : (num >> 8) & 255;
                  const b = isNaN(num) ? 42 : num & 255;
                  const alpha = Math.min(1, Math.max(0, opacity / 100));
                  const topAlpha = Math.max(0, Math.round(alpha * 0.75 * 100) / 100);
                  const gradStr = `linear-gradient(to bottom, rgba(${r}, ${g}, ${b}, ${topAlpha}), rgba(${r}, ${g}, ${b}, ${alpha}))`;

                  applyStyles({
                    backgroundType: 'image',
                    backgroundOverlay: gradStr,
                    overlayColor: color,
                    overlayOpacity: opacity,
                  });
                };

                return (
                  <div className="space-y-3 pt-1">
                    
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { label: 'Dark', key: 'dark', color: '#0f172a', opacity: 55 },
                        { label: 'Soft', key: 'light', color: '#ffffff', opacity: 50 },
                        { label: 'Gradient', key: 'gradient', color: '#4f46e5', opacity: 50 },
                      ].map((opt) => {
                        const isActive =
                          s.backgroundOverlay === opt.key ||
                          (opt.key === 'dark' && (!s.backgroundOverlay || s.backgroundOverlay === 'none'));
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() =>
                              applyStyles({
                                backgroundType: 'image',
                                backgroundOverlay: opt.key,
                                overlayColor: opt.color,
                                overlayOpacity: opt.opacity,
                              })
                            }
                            className={`py-1.5 px-1.5 rounded-[50px] text-[11px] font-medium border transition-all text-center cursor-pointer ${
                              isActive
                                ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-xs'
                                : isLight
                                ? 'bg-transparent border-slate-300 hover:bg-slate-100 text-slate-700'
                                : 'bg-transparent border-slate-700 hover:bg-slate-800 text-slate-300'
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="space-y-1 pt-0.5">
                      <SliderWithInput
                        label="Overlay Opacity"
                        value={currentOverlayOpacity}
                        onChange={(val) => handleUpdateCustomOverlay(currentOverlayColor, val)}
                        min={0}
                        max={100}
                        step={1}
                        unit="%"
                        hideValueBadge={true}
                        hideUnitText={true}
                        isLight={isLight}
                        labelClass={labelClass}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelClass}>Overlay Color</label>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => setShowOverlayColorPicker((prev) => !prev)}
                          className={`w-6 h-6 rounded-full border shadow-xs cursor-pointer hover:scale-110 transition-transform relative flex items-center justify-center shrink-0 ${
                            showOverlayColorPicker
                              ? 'border-indigo-600 bg-indigo-500/15 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-400/20 dark:text-indigo-400 ring-1 ring-indigo-500/30 font-bold'
                              : isLight
                              ? 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900'
                              : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600 hover:text-white'
                          }`}
                          title={showOverlayColorPicker ? 'Hide color picker' : 'Custom overlay color'}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        {[
                          '#000000',
                          '#0f172a',
                          '#1e293b',
                          '#ffffff',
                          '#4f46e5',
                          '#312e81',
                          '#047857',
                          '#991b1b',
                          '#0284c7',
                          '#7c3aed',
                        ].map((hex) => {
                          const isCur = currentOverlayColor.toLowerCase() === hex.toLowerCase();
                          return (
                            <button
                              key={hex}
                              type="button"
                              onClick={() => handleUpdateCustomOverlay(hex, currentOverlayOpacity)}
                              className="w-6 h-6 rounded-full border border-slate-700/60 shadow-xs cursor-pointer hover:scale-110 transition-transform relative flex items-center justify-center shrink-0"
                              style={{ backgroundColor: hex }}
                              title={hex}
                            >
                              {isCur && (
                                <Check
                                  className={`w-3.5 h-3.5 mx-auto ${
                                    hex === '#ffffff' ? 'text-slate-900' : 'text-white'
                                  }`}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {showOverlayColorPicker && (
                        <div className="pt-1">
                          <InlineColorPicker
                            color={currentOverlayColor}
                            onChange={(hex) => handleUpdateCustomOverlay(hex, currentOverlayOpacity)}
                            isLight={isLight}
                            canvasHeight="h-28"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {!hideSpacingAndRadius && (
        <>
          <div className="space-y-2.5 pt-4 mt-3.5">
        <div className="space-y-2.5 mb-2.5">
          <span className={`text-[11px] font-bold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Padding
          </span>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setPaddingMode('uniform')}
              className={`pb-1 text-xs font-medium truncate transition-all cursor-pointer bg-transparent border-b-2 -mb-px ${
                paddingMode === 'uniform'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : isLight
                  ? 'border-transparent text-slate-500 hover:text-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Uniform
            </button>
            <button
              type="button"
              onClick={() => setPaddingMode('pairs')}
              className={`pb-1 text-xs font-medium truncate transition-all cursor-pointer bg-transparent border-b-2 -mb-px ${
                paddingMode === 'pairs'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : isLight
                  ? 'border-transparent text-slate-500 hover:text-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Pairs
            </button>
            <button
              type="button"
              onClick={() => setPaddingMode('sides')}
              className={`pb-1 text-xs font-medium truncate transition-all cursor-pointer bg-transparent border-b-2 -mb-px ${
                paddingMode === 'sides'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : isLight
                  ? 'border-transparent text-slate-500 hover:text-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Per Side
            </button>
          </div>
        </div>

        {paddingMode === 'uniform' ? (
          <SliderWithInput
            value={s.padding !== undefined ? s.padding : (s.paddingY ?? 0)}
            onChange={(val) => {
              applyStyles({
                padding: val,
                paddingY: val,
                paddingX: val,
                paddingTop: val,
                paddingBottom: val,
                paddingLeft: val,
                paddingRight: val,
              });
            }}
            min={0}
            max={60}
            step={1}
            unit=""
            isLight={isLight}
            labelClass={labelClass}
          />
        ) : paddingMode === 'pairs' ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            <SmallInputBox
              label="Top & Bottom"
              value={s.paddingTop ?? s.paddingY ?? s.padding ?? 0}
              onChange={(val) => {
                applyStyles({
                  paddingY: val,
                  paddingTop: val,
                  paddingBottom: val,
                });
              }}
              isLight={isLight}
            />
            <SmallInputBox
              label="Left & Right"
              value={s.paddingLeft ?? s.paddingX ?? s.padding ?? 0}
              onChange={(val) => {
                applyStyles({
                  paddingX: val,
                  paddingLeft: val,
                  paddingRight: val,
                });
              }}
              isLight={isLight}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            <SmallInputBox
              label="Top"
              value={s.paddingTop ?? s.paddingY ?? s.padding ?? 0}
              onChange={(val) => updateStyle('paddingTop', val)}
              isLight={isLight}
            />
            <SmallInputBox
              label="Bottom"
              value={s.paddingBottom ?? s.paddingY ?? s.padding ?? 0}
              onChange={(val) => updateStyle('paddingBottom', val)}
              isLight={isLight}
            />
            <SmallInputBox
              label="Left"
              value={s.paddingLeft ?? s.paddingX ?? s.padding ?? 0}
              onChange={(val) => updateStyle('paddingLeft', val)}
              isLight={isLight}
            />
            <SmallInputBox
              label="Right"
              value={s.paddingRight ?? s.paddingX ?? s.padding ?? 0}
              onChange={(val) => updateStyle('paddingRight', val)}
              isLight={isLight}
            />
          </div>
        )}
      </div>

      <div className="space-y-2.5 pt-4 mt-3.5">
        <div className="space-y-2.5 mb-2.5">
          <span className={`text-[11px] font-bold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Border-Radius
          </span>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setRadiusMode('uniform')}
              className={`pb-1 text-xs font-medium truncate transition-all cursor-pointer bg-transparent border-b-2 -mb-px ${
                radiusMode === 'uniform'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : isLight
                  ? 'border-transparent text-slate-500 hover:text-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Uniform
            </button>
            <button
              type="button"
              onClick={() => setRadiusMode('pairs')}
              className={`pb-1 text-xs font-medium truncate transition-all cursor-pointer bg-transparent border-b-2 -mb-px ${
                radiusMode === 'pairs'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : isLight
                  ? 'border-transparent text-slate-500 hover:text-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Pairs
            </button>
            <button
              type="button"
              onClick={() => setRadiusMode('sides')}
              className={`pb-1 text-xs font-medium truncate transition-all cursor-pointer bg-transparent border-b-2 -mb-px ${
                radiusMode === 'sides'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : isLight
                  ? 'border-transparent text-slate-500 hover:text-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Per Corner
            </button>
          </div>
        </div>

        {radiusMode === 'uniform' ? (
          <SliderWithInput
            value={s.borderRadius !== undefined ? s.borderRadius : 0}
            onChange={(val) => {
              applyStyles({
                borderRadius: val,
                borderTopLeftRadius: undefined,
                borderTopRightRadius: undefined,
                borderBottomLeftRadius: undefined,
                borderBottomRightRadius: undefined,
              });
            }}
            min={0}
            max={60}
            step={1}
            unit=""
            isLight={isLight}
            labelClass={labelClass}
          />
        ) : radiusMode === 'pairs' ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            <SmallInputBox
              label="Top"
              value={s.borderTopLeftRadius ?? s.borderRadius ?? 0}
              onChange={(val) => {
                applyStyles({
                  borderTopLeftRadius: val,
                  borderTopRightRadius: val,
                });
              }}
              isLight={isLight}
            />
            <SmallInputBox
              label="Bottom"
              value={s.borderBottomLeftRadius ?? s.borderRadius ?? 0}
              onChange={(val) => {
                applyStyles({
                  borderBottomLeftRadius: val,
                  borderBottomRightRadius: val,
                });
              }}
              isLight={isLight}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            <SmallInputBox
              label="Top-Left"
              value={s.borderTopLeftRadius ?? s.borderRadius ?? 0}
              onChange={(val) => updateStyle('borderTopLeftRadius', val)}
              isLight={isLight}
            />
            <SmallInputBox
              label="Top-Right"
              value={s.borderTopRightRadius ?? s.borderRadius ?? 0}
              onChange={(val) => updateStyle('borderTopRightRadius', val)}
              isLight={isLight}
            />
            <SmallInputBox
              label="Bottom-Left"
              value={s.borderBottomLeftRadius ?? s.borderRadius ?? 0}
              onChange={(val) => updateStyle('borderBottomLeftRadius', val)}
              isLight={isLight}
            />
            <SmallInputBox
              label="Bottom-Right"
              value={s.borderBottomRightRadius ?? s.borderRadius ?? 0}
              onChange={(val) => updateStyle('borderBottomRightRadius', val)}
              isLight={isLight}
            />
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
};
