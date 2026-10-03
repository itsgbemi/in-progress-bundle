import React, { useState, useEffect } from 'react';
import { Plus, Minus, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { InlineColorPicker, TEXT_GRADIENT_PRESETS } from '../properties/InlineColorPicker';
import { SliderWithInput } from '../properties/SliderWithInput';

interface TextColorPopoverProps {
  color?: string;
  isGradient?: boolean;
  textGradient?: string;
  opacity?: number;
  onApplySolidColor: (hex: string, opacity?: number) => void;
  onApplyGradient: (stops: string[], angle: number, opacity?: number) => void;
  isLight?: boolean;
}

const SOLID_PRESETS = [

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

export const TextColorPopover: React.FC<TextColorPopoverProps> = ({
  color = '#0f172a',
  isGradient = false,
  textGradient,
  opacity = 100,
  onApplySolidColor,
  onApplyGradient,
  isLight = false,
}) => {
  const [textColorMode, setTextColorMode] = useState<'solid' | 'gradient'>(
    isGradient ? 'gradient' : 'solid'
  );
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [showGradientSettings, setShowGradientSettings] = useState<boolean>(false);
  const [showAllSolidPresets, setShowAllSolidPresets] = useState<boolean>(false);
  const [showAllGradientPresets, setShowAllGradientPresets] = useState<boolean>(false);
  const PRESET_LIMIT = 14;

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
      stops: ['#4f46e5', '#06b6d4'],
      angle: 135,
    };
  };

  const initialGrad = parseGradientStops(textGradient);
  const [gradientStops, setGradientStops] = useState<string[]>(initialGrad.stops);
  const [textGradientAngle, setTextGradientAngle] = useState<number>(initialGrad.angle);
  const [activeStopIndex, setActiveStopIndex] = useState<number>(0);
  const [textColorOpacity, setTextColorOpacity] = useState<number>(opacity);

  useEffect(() => {
    if (isGradient && textGradient) {
      const parsed = parseGradientStops(textGradient);
      setGradientStops(parsed.stops);
      setTextGradientAngle(parsed.angle);
      if (activeStopIndex >= parsed.stops.length) {
        setActiveStopIndex(0);
      }
    }
  }, [textGradient, isGradient]);

  const handleUpdateGradientStops = (
    newStops: string[],
    newAngle: number = textGradientAngle,
    newOpacity: number = textColorOpacity
  ) => {
    setGradientStops(newStops);
    setTextGradientAngle(newAngle);
    setTextColorOpacity(newOpacity);
    onApplyGradient(newStops, newAngle, newOpacity);
  };

  const labelClass = `text-[10px] font-bold block uppercase tracking-wider mb-1 ${
    isLight ? 'text-slate-600' : 'text-slate-400'
  }`;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 bg-transparent mb-2">
        <button
          type="button"
          onClick={() => {
            setTextColorMode('solid');
            onApplySolidColor(color || '#0f172a', textColorOpacity);
          }}
          className={`pb-2 text-center font-semibold text-xs transition-all cursor-pointer bg-transparent border-b-2 -mb-px ${
            textColorMode === 'solid'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
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
            setTextColorMode('gradient');
            handleUpdateGradientStops(gradientStops, textGradientAngle);
          }}
          className={`pb-2 text-center font-semibold text-xs transition-all cursor-pointer bg-transparent border-b-2 -mb-px ${
            textColorMode === 'gradient'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
              : isLight
              ? 'border-transparent text-slate-500 hover:text-slate-800'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Gradient
        </button>
      </div>

      {textColorMode === 'solid' ? (
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
              {(showAllSolidPresets ? SOLID_PRESETS : SOLID_PRESETS.slice(0, PRESET_LIMIT)).map((preset) => {
                const isSelected = !isGradient && color.toLowerCase() === preset.toLowerCase();
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => onApplySolidColor(preset, textColorOpacity)}
                    className="w-6 h-6 rounded-full border border-slate-700/60 shadow-xs cursor-pointer hover:scale-110 transition-transform relative flex items-center justify-center shrink-0"
                    style={{ backgroundColor: preset }}
                    title={preset}
                  >
                    {isSelected && (
                      <Check
                        className={`w-3.5 h-3.5 mx-auto ${
                          preset === '#ffffff' ||
                          preset === '#f8fafc' ||
                          preset === '#f1f5f9' ||
                          preset === '#e2e8f0'
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
                color={color || '#0f172a'}
                onChange={(hex) => onApplySolidColor(hex)}
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
              {(showAllGradientPresets ? TEXT_GRADIENT_PRESETS : TEXT_GRADIENT_PRESETS.slice(0, PRESET_LIMIT)).map((p) => {
                const angle = textGradientAngle || 135;
                const isSelected =
                  isGradient &&
                  gradientStops.length === 2 &&
                  gradientStops[0]?.toLowerCase() === p.from.toLowerCase() &&
                  gradientStops[1]?.toLowerCase() === p.to.toLowerCase();
                const grad = `linear-gradient(${angle}deg, ${p.from}, ${p.to})`;
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      const next = [p.from, p.to];
                      setActiveStopIndex(0);
                      handleUpdateGradientStops(next, angle);
                    }}
                    title={p.name}
                    className="w-6 h-6 rounded-full border border-slate-700/60 shadow-xs cursor-pointer hover:scale-110 transition-transform relative flex items-center justify-center shrink-0"
                    style={{ background: grad }}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
              {TEXT_GRADIENT_PRESETS.length > PRESET_LIMIT && (
                <button
                  type="button"
                  onClick={() => setShowAllGradientPresets((prev) => !prev)}
                  className="px-1.5 py-0.5 h-6 text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 shrink-0 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 bg-transparent border-0 hover:underline"
                  title={showAllGradientPresets ? 'Show fewer presets' : 'Show all presets'}
                >
                  <span>{showAllGradientPresets ? 'Show Less' : `+${TEXT_GRADIENT_PRESETS.length - PRESET_LIMIT} More`}</span>
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
                  color={gradientStops[activeStopIndex] || '#4f46e5'}
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
                  value={textGradientAngle}
                  onChange={(val) => {
                    setTextGradientAngle(val);
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
                        setTextGradientAngle(deg);
                        handleUpdateGradientStops(gradientStops, deg);
                      }}
                      className={`flex-1 py-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer text-center ${
                        textGradientAngle === deg
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
  );
};
