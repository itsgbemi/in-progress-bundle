import React, { useState, useEffect } from 'react';

export interface SliderWithInputProps {
  label?: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  allowNegative?: boolean;
  hardMax?: number;
  displayMultiplier?: number;
  precision?: number;
  isLight?: boolean;
  labelClass?: string;
  badgeText?: string;
  className?: string;
  hideValueBadge?: boolean;
  hideUnitText?: boolean;
}

export function sanitizeInspectorValue(
  rawInput: string | number,
  allowNegative = false,
  hardMax = 1000,
  fallback = 0,
  precision?: number
): number {
  let num = typeof rawInput === 'number' ? rawInput : parseFloat(String(rawInput));
  if (isNaN(num)) {
    return fallback;
  }

  if (!allowNegative && num < 0) {
    num = Math.abs(num);
  }

  if (num > hardMax) {
    num = hardMax;
  }

  if (precision !== undefined) {
    num = parseFloat(num.toFixed(precision));
  }

  return num;
}

export const SliderWithInput: React.FC<SliderWithInputProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = 'px',
  allowNegative = false,
  hardMax = 1000,
  precision,
  isLight = false,
  labelClass,
  badgeText,
  className = '',
  hideValueBadge = false,
  hideUnitText = false,
}) => {
  const resolvedLabelClass =
    labelClass || (isLight ? 'text-xs font-semibold text-slate-700' : 'text-xs font-semibold text-slate-300');
  const [textVal, setTextVal] = useState<string>(() => {
    return precision !== undefined ? value.toFixed(precision) : String(value);
  });

  useEffect(() => {
    const formatted = precision !== undefined ? value.toFixed(precision) : String(value);
    setTextVal(formatted);
  }, [value, precision]);

  const commitValue = (valStr: string) => {
    const sanitized = sanitizeInspectorValue(valStr, allowNegative, hardMax, value, precision);
    const clamped = Math.max(min, Math.min(max, sanitized));
    const displayStr = precision !== undefined ? clamped.toFixed(precision) : String(clamped);
    setTextVal(displayStr);
    onChange(clamped);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value);
    const sanitized = sanitizeInspectorValue(raw, allowNegative, hardMax, value, precision);
    const clamped = Math.max(min, Math.min(max, sanitized));
    const displayStr = precision !== undefined ? clamped.toFixed(precision) : String(clamped);
    setTextVal(displayStr);
    onChange(clamped);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextVal(e.target.value);
  };

  const handleInputBlur = () => {
    commitValue(textVal);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commitValue(textVal);
      e.currentTarget.blur();
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className={resolvedLabelClass}>{label}</label>
          {!hideValueBadge && (
            badgeText ? (
              <span className="text-[10px] font-mono text-indigo-400 font-semibold">{badgeText}</span>
            ) : (
              <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                {precision !== undefined ? value.toFixed(precision) : value}
              </span>
            )
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-4.5 w-full">
        <input
          type="range"
          min={min}
          max={Math.min(max, hardMax)}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="flex-1 min-w-0 accent-indigo-500 cursor-pointer"
        />

        <div className="flex items-center gap-1 shrink-0">
          <input
            type="number"
            value={textVal}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            step={step}
            className={`w-14 px-1 py-1.5 text-center text-[11px] font-mono rounded border outline-none transition-all shadow-2xs ${
              isLight
                ? 'bg-white border-slate-300 hover:border-slate-400 text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
                : 'bg-slate-900 border-slate-600 hover:border-slate-500 text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
