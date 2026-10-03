import React, { useState, useEffect } from 'react';
import { Plus, Minus, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { NoneNoDecorationIcon, InlineColorPicker } from '../properties/InlineColorPicker';
import { SliderWithInput } from '../properties/SliderWithInput';
import { SideSpacingControl } from '../common/SideSpacingControl';

interface HighlightPopoverProps {
  currentHighlightColor?: string;
  onApplyHighlight: (config: {
    color?: string;
    isGradient?: boolean;
    gradFrom?: string;
    gradTo?: string;
    gradAngle?: number;
    radiusTop?: number;
    radiusRight?: number;
    radiusBottom?: number;
    radiusLeft?: number;
    paddingTop?: number;
    paddingRight?: number;
    paddingBottom?: number;
    paddingLeft?: number;
  } | null) => void;
  isLight?: boolean;
}

const SOLID_PRESETS = [

  '#fef08a', '#fde047', '#facc15',
  '#fef3c7', '#fed7aa', '#fdba74', '#fb923c',
  '#fee2e2', '#fecdd3', '#fda4af', '#fb7185',
  '#dcfce7', '#bbf7d0', '#86efac', '#4ade80',
  '#ccfbf1', '#99f6e4', '#5eead4', '#2dd4bf',
  '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8',
  '#ede9fe', '#ddd6fe', '#c4b5fd', '#a78bfa',

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

const GRADIENT_PRESETS = [

  { name: 'Sunlight Glow', from: '#fef08a', to: '#fed7aa' },
  { name: 'Neon Highlighter', from: '#fef08a', to: '#86efac' },
  { name: 'Sunset Radiant', from: '#f97316', to: '#ec4899' },
  { name: 'Pastel Lilac', from: '#fbcfe8', to: '#c7d2fe' },
  { name: 'Emerald Wave', from: '#059669', to: '#10b981' },
  { name: 'Deep Ocean', from: '#0c4a6e', to: '#38bdf8' },
  { name: 'Indigo Cyan', from: '#4f46e5', to: '#06b6d4' },
  { name: 'Royal Amethyst', from: '#581c87', to: '#c084fc' },
  { name: 'Twilight Horizon', from: '#0f172a', to: '#312e81' },

  { name: 'Lemon Lime', from: '#fde047', to: '#a3e635' },
  { name: 'Electric Canary', from: '#fef08a', to: '#facc15' },
  { name: 'Golden Peach', from: '#fde68a', to: '#fb923c' },
  { name: 'Blush Sorbet', from: '#fda4af', to: '#fb7185' },
  { name: 'Cotton Candy', from: '#f472b6', to: '#c084fc' },
  { name: 'Sky Breeze', from: '#bae6fd', to: '#38bdf8' },
  { name: 'Mint Sherbet', from: '#a7f3d0', to: '#34d399' },
  { name: 'Lavender Mist', from: '#ddd6fe', to: '#c4b5fd' },
  { name: 'Solar Flame', from: '#f59e0b', to: '#ef4444' },
  { name: 'Crimson Ember', from: '#991b1b', to: '#ef4444' },
  { name: 'Rose Gold', from: '#f43f5e', to: '#fb7185' },
  { name: 'Flamingo Pink', from: '#ec4899', to: '#f43f5e' },
  { name: 'Warm Amber', from: '#d97706', to: '#fbbf24' },
  { name: 'Lime Zest', from: '#65a30d', to: '#a3e635' },
  { name: 'Tropical Lagoon', from: '#059669', to: '#06b6d4' },
  { name: 'Aurora Borealis', from: '#047857', to: '#0284c7' },
  { name: 'Aqua Marine', from: '#0891b2', to: '#22d3ee' },
  { name: 'Nordic Teal', from: '#0d9488', to: '#38bdf8' },
  { name: 'Ocean Cyan', from: '#0284c7', to: '#06b6d4' },
  { name: 'Electric Violet', from: '#8b5cf6', to: '#ec4899' },
  { name: 'Cosmic Magenta', from: '#a21caf', to: '#e879f9' },
  { name: 'Midnight Slate', from: '#0f172a', to: '#1e293b' },
];

export const HighlightPopover: React.FC<HighlightPopoverProps> = ({
  currentHighlightColor,
  onApplyHighlight,
  isLight = false,
}) => {
  const isNone = !currentHighlightColor || currentHighlightColor === 'transparent';
  const isGrad = currentHighlightColor?.includes('gradient') || false;

  const [highlightMode, setHighlightMode] = useState<'solid' | 'gradient'>(
    isGrad ? 'gradient' : 'solid'
  );

  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [showGradientSettings, setShowGradientSettings] = useState<boolean>(false);
  const [showAllSolidPresets, setShowAllSolidPresets] = useState<boolean>(false);
  const [showAllGradientPresets, setShowAllGradientPresets] = useState<boolean>(false);
  const PRESET_LIMIT = 14;

  const [highlightCustomColor, setHighlightCustomColor] = useState<string>(
    !isNone && !isGrad ? currentHighlightColor! : '#fef08a'
  );

  const parseGradientStops = (
    gradStr?: string
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
      stops: ['#fef08a', '#fed7aa'],
      angle: 135,
    };
  };

  const initialGrad = parseGradientStops(currentHighlightColor);
  const [gradientStops, setGradientStops] = useState<string[]>(initialGrad.stops);
  const [highlightGradAngle, setHighlightGradAngle] = useState<number>(initialGrad.angle);
  const [activeStopIndex, setActiveStopIndex] = useState<number>(0);

  useEffect(() => {
    if (isGrad && currentHighlightColor) {
      const parsed = parseGradientStops(currentHighlightColor);
      setGradientStops(parsed.stops);
      setHighlightGradAngle(parsed.angle);
      if (activeStopIndex >= parsed.stops.length) {
        setActiveStopIndex(0);
      }
    }
  }, [currentHighlightColor, isGrad]);

  const [highlightRadiusMode, setHighlightRadiusMode] = useState<'uniform' | 'pairs' | 'sides'>('uniform');
  const [highlightRadiusTop, setHighlightRadiusTop] = useState<number>(4);
  const [highlightRadiusRight, setHighlightRadiusRight] = useState<number>(4);
  const [highlightRadiusBottom, setHighlightRadiusBottom] = useState<number>(4);
  const [highlightRadiusLeft, setHighlightRadiusLeft] = useState<number>(4);

  const [highlightPaddingMode, setHighlightPaddingMode] = useState<'uniform' | 'pairs' | 'sides'>('uniform');
  const [highlightPaddingTop, setHighlightPaddingTop] = useState<number>(2);
  const [highlightPaddingRight, setHighlightPaddingRight] = useState<number>(6);
  const [highlightPaddingBottom, setHighlightPaddingBottom] = useState<number>(2);
  const [highlightPaddingLeft, setHighlightPaddingLeft] = useState<number>(6);

  const labelClass = `text-[10px] font-bold block uppercase tracking-wider mb-1 ${
    isLight ? 'text-slate-600' : 'text-slate-400'
  }`;

  const applyChanges = (override?: Partial<{
    color: string;
    isGradient: boolean;
    stops: string[];
    gradFrom: string;
    gradTo: string;
    gradAngle: number;
    radiusTop: number;
    radiusRight: number;
    radiusBottom: number;
    radiusLeft: number;
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    paddingLeft: number;
  }>) => {
    const isG = override?.isGradient !== undefined ? override.isGradient : highlightMode === 'gradient';
    const c = override?.color || highlightCustomColor;
    const stops = override?.stops || gradientStops;
    const gAngle = override?.gradAngle !== undefined ? override.gradAngle : highlightGradAngle;
    const gradStr = `linear-gradient(${gAngle}deg, ${stops.join(', ')})`;

    const rTop = override?.radiusTop !== undefined ? override.radiusTop : highlightRadiusTop;
    const rRight = override?.radiusRight !== undefined ? override.radiusRight : highlightRadiusRight;
    const rBottom = override?.radiusBottom !== undefined ? override.radiusBottom : highlightRadiusBottom;
    const rLeft = override?.radiusLeft !== undefined ? override.radiusLeft : highlightRadiusLeft;

    const pTop = override?.paddingTop !== undefined ? override.paddingTop : highlightPaddingTop;
    const pRight = override?.paddingRight !== undefined ? override.paddingRight : highlightPaddingRight;
    const pBottom = override?.paddingBottom !== undefined ? override.paddingBottom : highlightPaddingBottom;
    const pLeft = override?.paddingLeft !== undefined ? override.paddingLeft : highlightPaddingLeft;

    onApplyHighlight({
      color: isG ? gradStr : c,
      isGradient: isG,
      gradFrom: stops[0],
      gradTo: stops[stops.length - 1],
      gradAngle: gAngle,
      radiusTop: rTop,
      radiusRight: rRight,
      radiusBottom: rBottom,
      radiusLeft: rLeft,
      paddingTop: pTop,
      paddingRight: pRight,
      paddingBottom: pBottom,
      paddingLeft: pLeft,
    });
  };

  const handleUpdateGradientStops = (
    newStops: string[],
    newAngle: number = highlightGradAngle
  ) => {
    setGradientStops(newStops);
    setHighlightGradAngle(newAngle);
    applyChanges({ isGradient: true, stops: newStops, gradAngle: newAngle });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => onApplyHighlight(null)}
          className={`w-full py-2 px-3 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isNone
              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500 shadow-xs'
              : isLight
              ? 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-400'
          }`}
        >
          <NoneNoDecorationIcon className="w-4 h-4 shrink-0" />
          <span>None</span>
        </button>

        <div className="grid grid-cols-2 bg-transparent">
          <button
            type="button"
            onClick={() => {
              setHighlightMode('solid');
              applyChanges({ isGradient: false });
            }}
            className={`pb-2 text-center font-semibold text-xs transition-all cursor-pointer bg-transparent border-b-2 -mb-px ${
              !isNone && highlightMode === 'solid'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : highlightMode === 'solid' && isNone
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
              setHighlightMode('gradient');
              const defaultPreset = GRADIENT_PRESETS[0];
              const currentStops = isGrad && gradientStops.length >= 2 ? gradientStops : [defaultPreset.from, defaultPreset.to];
              handleUpdateGradientStops(currentStops, highlightGradAngle);
            }}
            className={`pb-2 text-center font-semibold text-xs transition-all cursor-pointer bg-transparent border-b-2 -mb-px ${
              !isNone && highlightMode === 'gradient'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : highlightMode === 'gradient' && isNone
                ? 'border-indigo-400/50 text-indigo-500/80 font-medium'
                : isLight
                ? 'border-transparent text-slate-500 hover:text-slate-800'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Gradient
          </button>
        </div>

        {highlightMode === 'solid' ? (
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
                {(showAllSolidPresets ? SOLID_PRESETS : SOLID_PRESETS.slice(0, PRESET_LIMIT)).map((hex) => {
                  const isCur = !isNone && !isGrad && highlightCustomColor.toLowerCase() === hex.toLowerCase();
                  return (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => {
                        setHighlightCustomColor(hex);
                        applyChanges({ color: hex, isGradient: false });
                      }}
                      className="w-6 h-6 rounded-full border border-slate-700/60 shadow-xs cursor-pointer hover:scale-110 transition-transform relative flex items-center justify-center shrink-0"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    >
                      {isCur && (
                        <Check
                          className={`w-3.5 h-3.5 mx-auto ${
                            hex === '#ffffff' ||
                            hex === '#f8fafc' ||
                            hex === '#f1f5f9' ||
                            hex === '#e2e8f0' ||
                            hex === '#fef08a' ||
                            hex === '#fde047' ||
                            hex === '#fed7aa' ||
                            hex === '#fecdd3' ||
                            hex === '#bbf7d0' ||
                            hex === '#bae6fd' ||
                            hex === '#ddd6fe'
                              ? 'text-slate-900'
                              : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
                {SOLID_PRESETS.length > PRESET_LIMIT && (
                  <button
                    type="button"
                    onClick={() => setShowAllSolidPresets((prev) => !prev)}
                    className="px-1.5 py-0.5 h-6 text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 shrink-0 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 bg-transparent border-0 hover:underline"
                    title={showAllSolidPresets ? 'Show fewer presets' : 'Show all presets'}
                  >
                    <span>{showAllSolidPresets ? 'Show Less' : `+${SOLID_PRESETS.length - PRESET_LIMIT} More`}</span>
                    {showAllSolidPresets ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>

            {showColorPicker && (
              <div className="pt-1">
                <InlineColorPicker
                  color={highlightCustomColor}
                  onChange={(hex) => {
                    setHighlightCustomColor(hex);
                    applyChanges({ color: hex, isGradient: false });
                  }}
                  isLight={isLight}
                  canvasHeight="h-32"
                />
              </div>
            )}
          </div>
        ) : (
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
                {(showAllGradientPresets ? GRADIENT_PRESETS : GRADIENT_PRESETS.slice(0, PRESET_LIMIT)).map((p) => {
                  const angle = highlightGradAngle || 135;
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
                        handleUpdateGradientStops(newStops, angle);
                      }}
                      className="w-6 h-6 rounded-full border border-slate-700/60 shadow-xs cursor-pointer hover:scale-110 transition-transform relative flex items-center justify-center shrink-0"
                      style={{ background: grad }}
                      title={p.name}
                    >
                      {isCur && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}
                {GRADIENT_PRESETS.length > PRESET_LIMIT && (
                  <button
                    type="button"
                    onClick={() => setShowAllGradientPresets((prev) => !prev)}
                    className="px-1.5 py-0.5 h-6 text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 shrink-0 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 bg-transparent border-0 hover:underline"
                    title={showAllGradientPresets ? 'Show fewer presets' : 'Show all presets'}
                  >
                    <span>{showAllGradientPresets ? 'Show Less' : `+${GRADIENT_PRESETS.length - PRESET_LIMIT} More`}</span>
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
                                handleUpdateGradientStops(next);
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
                                handleUpdateGradientStops(next);
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
                                handleUpdateGradientStops(next);
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
                                  handleUpdateGradientStops(next);
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
                        '#fef08a',
                        '#fed7aa',
                        '#86efac',
                        '#7dd3fc',
                        '#f472b6',
                        '#c084fc',
                        '#fb923c',
                      ];
                      const nextColor =
                        fallbackPalette.find((c) => !gradientStops.includes(c)) ||
                        '#fde047';
                      const next = [...gradientStops, nextColor];
                      const newIdx = next.length - 1;
                      setActiveStopIndex(newIdx);
                      handleUpdateGradientStops(next);
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
                    color={gradientStops[activeStopIndex] || '#fef08a'}
                    onChange={(hex) => {
                      const next = [...gradientStops];
                      next[activeStopIndex] = hex;
                      handleUpdateGradientStops(next);
                    }}
                    isLight={isLight}
                    canvasHeight="h-28"
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <SliderWithInput
                    label="Gradient Angle"
                    value={highlightGradAngle}
                    onChange={(val) => {
                      setHighlightGradAngle(val);
                      handleUpdateGradientStops(gradientStops, val);
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
                          setHighlightGradAngle(deg);
                          handleUpdateGradientStops(gradientStops, deg);
                        }}
                        className={`flex-1 py-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer text-center ${
                          highlightGradAngle === deg
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
      </div>

      <div className="pt-4 mt-3.5 space-y-4">
        <SideSpacingControl
          label="Padding"
          values={{
            top: highlightPaddingTop,
            bottom: highlightPaddingBottom,
            left: highlightPaddingLeft,
            right: highlightPaddingRight,
          }}
          onChange={(vals) => {
            setHighlightPaddingTop(vals.top);
            setHighlightPaddingBottom(vals.bottom);
            setHighlightPaddingLeft(vals.left);
            setHighlightPaddingRight(vals.right);
            applyChanges({
              paddingTop: vals.top,
              paddingBottom: vals.bottom,
              paddingLeft: vals.left,
              paddingRight: vals.right,
            });
          }}
          mode={highlightPaddingMode}
          onModeChange={setHighlightPaddingMode}
          min={0}
          max={60}
          step={1}
          unit="px"
          isLight={isLight}
          labelClass={`text-xs font-semibold block ${isLight ? 'text-slate-700' : 'text-slate-200'}`}
        />

        <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/80">
          <SideSpacingControl
            label="Border-radius"
            values={{
              top: highlightRadiusTop,
              bottom: highlightRadiusBottom,
              left: highlightRadiusLeft,
              right: highlightRadiusRight,
            }}
            onChange={(vals) => {
              setHighlightRadiusTop(vals.top);
              setHighlightRadiusBottom(vals.bottom);
              setHighlightRadiusLeft(vals.left);
              setHighlightRadiusRight(vals.right);
              applyChanges({
                radiusTop: vals.top,
                radiusBottom: vals.bottom,
                radiusLeft: vals.left,
                radiusRight: vals.right,
              });
            }}
            mode={highlightRadiusMode}
            onModeChange={setHighlightRadiusMode}
            sidesTabLabel="Per Corner"
            pairsLabels={{ pair1: 'Top', pair2: 'Bottom' }}
            sidesLabels={{
              top: 'Top Left',
              bottom: 'Bottom Right',
              left: 'Bottom Left',
              right: 'Top Right',
            }}
            min={0}
            max={60}
            step={1}
            unit="px"
            isLight={isLight}
            labelClass={`text-xs font-semibold block ${isLight ? 'text-slate-700' : 'text-slate-200'}`}
          />
        </div>
      </div>
    </div>
  );
};
