import React, { useState, useEffect } from 'react';
import { Check, RotateCcw, Plus } from 'lucide-react';
import { InlineColorPicker, NoneNoDecorationIcon } from '../properties/InlineColorPicker';
import { SliderWithInput } from '../properties/SliderWithInput';

export type DecorationType = 'underline' | 'overline' | 'strikethrough';

export interface TextDecorationConfig {
  active: boolean;
  style: 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy';
  thickness: number | 'auto';
  color: string;
  offset: number;
}

interface TextDecorationPopoverProps {
  type: DecorationType;
  active: boolean;
  currentStyle?: string;
  currentThickness?: number | string;
  currentColor?: string;
  currentOffset?: number | string;
  onApplyDecoration: (config: TextDecorationConfig) => void;
  isLight?: boolean;
}

const LINE_STYLES: Array<{
  id: 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy';
  label: string;
  renderPreview: (type: DecorationType, color: string) => React.ReactNode;
}> = [
  {
    id: 'solid',
    label: 'Solid',
    renderPreview: (type, c) => (
      <span
        className="text-lg font-serif font-bold relative flex items-center justify-center select-none w-full h-full leading-none"
        style={{
          textDecorationLine: type === 'underline' ? 'underline' : type === 'overline' ? 'overline' : 'line-through',
          textDecorationStyle: 'solid',
          textDecorationColor: c,
          textDecorationThickness: '2.5px',
          textUnderlineOffset: '2px',
        }}
      >
        {type === 'underline' ? 'u' : type === 'overline' ? 'o' : 's'}
      </span>
    ),
  },
  {
    id: 'double',
    label: 'Double',
    renderPreview: (type, c) => (
      <span
        className="text-lg font-serif font-bold relative flex items-center justify-center select-none w-full h-full leading-none"
        style={{
          textDecorationLine: type === 'underline' ? 'underline' : type === 'overline' ? 'overline' : 'line-through',
          textDecorationStyle: 'double',
          textDecorationColor: c,
          textDecorationThickness: '3px',
          textUnderlineOffset: '2px',
        }}
      >
        {type === 'underline' ? 'u' : type === 'overline' ? 'o' : 's'}
      </span>
    ),
  },
  {
    id: 'dotted',
    label: 'Dotted',
    renderPreview: (type, c) => (
      <span
        className="text-lg font-serif font-bold relative flex items-center justify-center select-none w-full h-full leading-none"
        style={{
          textDecorationLine: type === 'underline' ? 'underline' : type === 'overline' ? 'overline' : 'line-through',
          textDecorationStyle: 'dotted',
          textDecorationColor: c,
          textDecorationThickness: '3px',
          textUnderlineOffset: '2px',
        }}
      >
        {type === 'underline' ? 'u' : type === 'overline' ? 'o' : 's'}
      </span>
    ),
  },
  {
    id: 'dashed',
    label: 'Dashed',
    renderPreview: (type, c) => (
      <span
        className="text-lg font-serif font-bold relative flex items-center justify-center select-none w-full h-full leading-none"
        style={{
          textDecorationLine: type === 'underline' ? 'underline' : type === 'overline' ? 'overline' : 'line-through',
          textDecorationStyle: 'dashed',
          textDecorationColor: c,
          textDecorationThickness: '2.5px',
          textUnderlineOffset: '2px',
        }}
      >
        {type === 'underline' ? 'u' : type === 'overline' ? 'o' : 's'}
      </span>
    ),
  },
  {
    id: 'wavy',
    label: 'Wavy',
    renderPreview: (type, c) => (
      <span
        className="text-lg font-serif font-bold relative flex items-center justify-center select-none w-full h-full leading-none"
        style={{
          textDecorationLine: type === 'underline' ? 'underline' : type === 'overline' ? 'overline' : 'line-through',
          textDecorationStyle: 'wavy',
          textDecorationColor: c,
          textDecorationThickness: '2px',
          textUnderlineOffset: '2px',
        }}
      >
        {type === 'underline' ? 'u' : type === 'overline' ? 'o' : 's'}
      </span>
    ),
  },
];

const DECORATION_COLOR_PRESETS = [

  '#000000', '#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0', '#f8fafc', '#ffffff',

  '#dc2626', '#ef4444', '#f43f5e', '#ec4899',

  '#ea580c', '#f97316', '#f59e0b', '#eab308',

  '#16a34a', '#22c55e', '#10b981', '#14b8a6',

  '#06b6d4', '#0ea5e9', '#3b82f6', '#2563eb',

  '#6366f1', '#4f46e5', '#8b5cf6', '#a855f7',
];

export const TextDecorationPopover: React.FC<TextDecorationPopoverProps> = ({
  type,
  active,
  currentStyle = 'solid',
  currentThickness = 'auto',
  currentColor = '',
  currentOffset = 0,
  onApplyDecoration,
  isLight = false,
}) => {
  const [isActive, setIsActive] = useState<boolean>(active);
  const [activeTab, setActiveTab] = useState<'style' | 'color'>('style');
  const [lineStyle, setLineStyle] = useState<'solid' | 'double' | 'dotted' | 'dashed' | 'wavy'>(
    (currentStyle as any) || 'solid'
  );
  const [thickness, setThickness] = useState<number | 'auto'>(
    currentThickness === 'auto' || currentThickness === undefined
      ? 'auto'
      : typeof currentThickness === 'number'
      ? currentThickness
      : parseInt(String(currentThickness), 10) || 1
  );
  const [lineColor, setLineColor] = useState<string>(currentColor || '');
  const [offset, setOffset] = useState<number>(
    typeof currentOffset === 'number' ? currentOffset : parseInt(String(currentOffset), 10) || 0
  );
  const [showCustomColorPicker, setShowCustomColorPicker] = useState<boolean>(false);

  useEffect(() => {
    setIsActive(active);
  }, [active]);

  useEffect(() => {
    if (currentStyle) setLineStyle(currentStyle as any);
  }, [currentStyle]);

  useEffect(() => {
    if (currentThickness !== undefined) {
      setThickness(
        currentThickness === 'auto'
          ? 'auto'
          : typeof currentThickness === 'number'
          ? currentThickness
          : parseInt(String(currentThickness), 10) || 1
      );
    }
  }, [currentThickness]);

  useEffect(() => {
    setLineColor(currentColor || '');
  }, [currentColor]);

  useEffect(() => {
    if (currentOffset !== undefined) {
      setOffset(typeof currentOffset === 'number' ? currentOffset : parseInt(String(currentOffset), 10) || 0);
    }
  }, [currentOffset]);

  const notifyChange = (
    nextActive: boolean,
    nextStyle: 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy',
    nextThickness: number | 'auto',
    nextColor: string,
    nextOffset: number
  ) => {
    onApplyDecoration({
      active: nextActive,
      style: nextStyle,
      thickness: nextThickness,
      color: nextColor,
      offset: nextOffset,
    });
  };

  const handleToggleActive = () => {
    const next = !isActive;
    setIsActive(next);
    notifyChange(next, lineStyle, thickness, lineColor, offset);
  };

  const handleStyleSelect = (st: 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy') => {
    if (isActive && lineStyle === st) {
      setIsActive(false);
      notifyChange(false, st, thickness, lineColor, offset);
    } else {
      setLineStyle(st);
      if (!isActive) setIsActive(true);
      notifyChange(true, st, thickness, lineColor, offset);
    }
  };

  const handleThicknessChange = (val: number | 'auto') => {
    setThickness(val);
    if (!isActive) setIsActive(true);
    notifyChange(true, lineStyle, val, lineColor, offset);
  };

  const handleColorChange = (hex: string) => {
    setLineColor(hex);
    if (!isActive) setIsActive(true);
    notifyChange(true, lineStyle, thickness, hex, offset);
  };

  const handleOffsetChange = (val: number) => {
    setOffset(val);
    if (!isActive) setIsActive(true);
    notifyChange(true, lineStyle, thickness, lineColor, val);
  };

  const titleName =
    type === 'underline' ? 'Underline' : type === 'overline' ? 'Overline' : 'Strikethrough';

  const previewColor = lineColor || (isLight ? '#0f172a' : '#ffffff');

  return (
    <div className="space-y-3.5 max-h-[420px] overflow-y-auto no-scrollbar pr-0.5 w-full text-xs">
      <button
        type="button"
        onClick={() => {
          setIsActive(false);
          notifyChange(false, lineStyle, thickness, lineColor, offset);
        }}
        className={`w-full py-2 px-3 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
          !isActive
            ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500 shadow-xs ring-1 ring-indigo-500/30 font-bold'
            : isLight
            ? 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-400'
        }`}
        title="None"
      >
        <NoneNoDecorationIcon className="w-4 h-4 shrink-0" />
        <span>None</span>
      </button>

      <div className="grid grid-cols-2 border-b border-slate-200 dark:border-slate-800 bg-transparent">
        <button
          type="button"
          onClick={() => setActiveTab('style')}
          className={`pb-2 text-center font-semibold text-xs transition-all cursor-pointer bg-transparent border-b-2 -mb-px flex items-center justify-center gap-1.5 ${
            activeTab === 'style'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
              : isLight
              ? 'border-transparent text-slate-500 hover:text-slate-800'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Style</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('color')}
          className={`pb-2 text-center font-semibold text-xs transition-all cursor-pointer bg-transparent border-b-2 -mb-px flex items-center justify-center gap-1.5 ${
            activeTab === 'color'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
              : isLight
              ? 'border-transparent text-slate-500 hover:text-slate-800'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Color</span>
          {lineColor && (
            <span
              className="w-2.5 h-2.5 rounded-full border border-black/20 dark:border-white/20 shrink-0"
              style={{ backgroundColor: lineColor }}
            />
          )}
        </button>
      </div>

      {activeTab === 'style' && (
        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-5 gap-1.5 w-full justify-items-center">
            {LINE_STYLES.map((st) => {
              const isSelected = isActive && lineStyle === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  title={st.label}
                  onClick={() => handleStyleSelect(st.id)}
                  className={`h-10 w-full max-w-[42px] rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500 shadow-xs ring-1 ring-indigo-500/30'
                      : isLight
                      ? 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-300'
                  }`}
                >
                  {st.renderPreview(type, isSelected ? '#6366f1' : previewColor)}
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={`font-semibold text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Thickness
              </label>
            </div>

            <SliderWithInput
              value={thickness === 'auto' ? 1 : thickness}
              onChange={(val) => handleThicknessChange(val)}
              min={1}
              max={16}
              step={1}
              unit="px"
              hideValueBadge={true}
              hideUnitText={true}
              isLight={isLight}
            />
          </div>

          {type !== 'strikethrough' && (
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className={`font-semibold text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Offset
                </label>
              </div>

              <SliderWithInput
                value={offset}
                onChange={handleOffsetChange}
                min={0}
                max={6}
                step={1}
                unit="px"
                hideValueBadge={true}
                hideUnitText={true}
                isLight={isLight}
              />
            </div>
          )}
        </div>
      )}

      {activeTab === 'color' && (
        <div className="space-y-3 pt-1">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={`font-semibold text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Presets
              </label>
              {lineColor && (
                <button
                  type="button"
                  onClick={() => handleColorChange('')}
                  className="text-[10px] text-indigo-500 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  Reset
                </button>
              )}
            </div>

            <div className="grid grid-cols-8 gap-1.5 pt-0.5 justify-items-center">
              <button
                type="button"
                onClick={() => {
                  setShowCustomColorPicker((prev) => !prev);
                }}
                className={`w-6 h-6 rounded-full border shadow-xs cursor-pointer hover:scale-110 transition-transform relative flex items-center justify-center shrink-0 ${
                  showCustomColorPicker
                    ? 'border-indigo-600 bg-indigo-500/15 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-400/20 dark:text-indigo-400 ring-1 ring-indigo-500/30 font-bold'
                    : isLight
                    ? 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900'
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600 hover:text-white'
                }`}
                title={showCustomColorPicker ? 'Hide Custom Picker' : 'Show Custom Color Picker'}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              {DECORATION_COLOR_PRESETS.map((hex) => {
                const isSel = (lineColor || previewColor).toLowerCase() === hex.toLowerCase();
                return (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => handleColorChange(hex)}
                    className="w-6 h-6 rounded-full border border-slate-700/60 shadow-xs cursor-pointer hover:scale-110 transition-transform relative flex items-center justify-center shrink-0"
                    style={{ backgroundColor: hex }}
                    title={hex}
                  >
                    {isSel && (
                      <Check
                        className={`w-3.5 h-3.5 mx-auto ${
                          hex === '#ffffff' || hex === '#f8fafc' || hex === '#f1f5f9' || hex === '#cbd5e1' || hex === '#e2e8f0'
                            ? 'text-slate-900'
                            : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {showCustomColorPicker && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <InlineColorPicker
                color={lineColor || (isLight ? '#0f172a' : '#ffffff')}
                onChange={handleColorChange}
                isLight={isLight}
                canvasHeight="h-20"
                showAlpha={true}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
