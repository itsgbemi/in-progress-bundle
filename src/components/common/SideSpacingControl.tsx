import React, { useState, useEffect } from 'react';
import { SliderWithInput } from './SliderWithInput';

export type SpacingMode = 'uniform' | 'pairs' | 'sides';

export interface SpacingValues {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface SideSpacingControlProps {
  label: string;
  values: SpacingValues;
  onChange: (values: SpacingValues) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  isLight?: boolean;
  labelClass?: string;
  mode?: SpacingMode;
  onModeChange?: (mode: SpacingMode) => void;
  sidesTabLabel?: string;
  pairsLabels?: { pair1: string; pair2: string };
  sidesLabels?: { top: string; bottom: string; left: string; right: string };
  className?: string;
}

export const SideNumericInput: React.FC<{
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  isLight?: boolean;
}> = ({ label, value, onChange, min = 0, max = 200, step = 1, unit = 'px', isLight = false }) => {
  const [textVal, setTextVal] = useState<string>(String(value));

  useEffect(() => {
    setTextVal(String(value));
  }, [value]);

  const commitValue = (raw: string) => {
    let num = parseInt(raw, 10);
    if (isNaN(num)) num = value;
    const clamped = Math.max(min, Math.min(max, num));
    setTextVal(String(clamped));
    onChange(clamped);
  };

  return (
    <div className="flex items-center justify-between gap-1.5 py-0.5 min-w-0">
      <span
        className={`text-[11px] font-medium truncate shrink ${
          isLight ? 'text-slate-600' : 'text-slate-400'
        }`}
        title={label}
      >
        {label}
      </span>
      <div className="flex items-center gap-1 shrink-0">
        <input
          type="number"
          value={textVal}
          onChange={(e) => setTextVal(e.target.value)}
          onBlur={() => commitValue(textVal)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              commitValue(textVal);
              e.currentTarget.blur();
            }
          }}
          step={step}
          className={`w-14 px-1 py-1.5 text-center text-[11px] font-mono rounded border outline-none transition-all shadow-2xs ${
            isLight
              ? 'bg-white border-slate-300 hover:border-slate-400 text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
              : 'bg-slate-900 border-slate-600 hover:border-slate-500 text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
          }`}
        />
      </div>
    </div>
  );
};

export const SideSpacingControl: React.FC<SideSpacingControlProps> = ({
  label,
  values,
  onChange,
  min = 0,
  max = 120,
  step = 1,
  unit = 'px',
  isLight = false,
  labelClass,
  mode: controlledMode,
  onModeChange,
  sidesTabLabel = 'Per Side',
  pairsLabels = { pair1: 'Top & Bottom', pair2: 'Left & Right' },
  sidesLabels = { top: 'Top', bottom: 'Bottom', left: 'Left', right: 'Right' },
  className = '',
}) => {
  const [internalMode, setInternalMode] = useState<SpacingMode>(() => {
    if (
      values.top !== values.bottom ||
      values.left !== values.right ||
      values.top !== values.left
    ) {
      if (values.top === values.bottom && values.left === values.right) {
        return 'pairs';
      }
      return 'sides';
    }
    return 'uniform';
  });

  const currentMode = controlledMode !== undefined ? controlledMode : internalMode;

  const handleModeSwitch = (newMode: SpacingMode) => {
    if (onModeChange) {
      onModeChange(newMode);
    } else {
      setInternalMode(newMode);
    }
  };

  const resolvedLabelClass =
    labelClass || (isLight ? 'text-xs font-semibold text-slate-700' : 'text-xs font-semibold text-slate-300');

  return (
    <div className={`space-y-3.5 ${className}`}>
      <div className="space-y-3 mb-3">
        <label className={resolvedLabelClass}>{label}</label>
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => handleModeSwitch('uniform')}
            className={`pb-1 text-xs font-medium truncate transition-all cursor-pointer bg-transparent border-b-2 -mb-px ${
              currentMode === 'uniform'
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
            onClick={() => handleModeSwitch('pairs')}
            className={`pb-1 text-xs font-medium truncate transition-all cursor-pointer bg-transparent border-b-2 -mb-px ${
              currentMode === 'pairs'
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
            onClick={() => handleModeSwitch('sides')}
            className={`pb-1 text-xs font-medium truncate transition-all cursor-pointer bg-transparent border-b-2 -mb-px ${
              currentMode === 'sides'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : isLight
                ? 'border-transparent text-slate-500 hover:text-slate-800'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {sidesTabLabel}
          </button>
        </div>
      </div>

      {currentMode === 'uniform' ? (
        <SliderWithInput
          value={values.top}
          onChange={(val) => {
            onChange({ top: val, bottom: val, left: val, right: val });
          }}
          min={min}
          max={max}
          step={step}
          unit={unit}
          isLight={isLight}
          labelClass={resolvedLabelClass}
          hideValueBadge
        />
      ) : currentMode === 'pairs' ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          <SideNumericInput
            label={pairsLabels.pair1}
            value={values.top}
            onChange={(val) => {
              onChange({ ...values, top: val, bottom: val });
            }}
            min={min}
            max={max}
            step={step}
            unit={unit}
            isLight={isLight}
          />
          <SideNumericInput
            label={pairsLabels.pair2}
            value={values.left}
            onChange={(val) => {
              onChange({ ...values, left: val, right: val });
            }}
            min={min}
            max={max}
            step={step}
            unit={unit}
            isLight={isLight}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          <SideNumericInput
            label={sidesLabels.top}
            value={values.top}
            onChange={(val) => onChange({ ...values, top: val })}
            min={min}
            max={max}
            step={step}
            unit={unit}
            isLight={isLight}
          />
          <SideNumericInput
            label={sidesLabels.bottom}
            value={values.bottom}
            onChange={(val) => onChange({ ...values, bottom: val })}
            min={min}
            max={max}
            step={step}
            unit={unit}
            isLight={isLight}
          />
          <SideNumericInput
            label={sidesLabels.left}
            value={values.left}
            onChange={(val) => onChange({ ...values, left: val })}
            min={min}
            max={max}
            step={step}
            unit={unit}
            isLight={isLight}
          />
          <SideNumericInput
            label={sidesLabels.right}
            value={values.right}
            onChange={(val) => onChange({ ...values, right: val })}
            min={min}
            max={max}
            step={step}
            unit={unit}
            isLight={isLight}
          />
        </div>
      )}
    </div>
  );
};
