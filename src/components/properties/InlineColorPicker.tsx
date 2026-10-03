import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import {
  hexToRgb,
  rgbToHex,
  rgbaToHex,
  parseColorWithAlpha,
  rgbToHsl,
  hslToRgb,
  rgbToHsv,
  hsvToRgb,
} from './PropertiesCommon';

export interface InlineColorPickerProps {
  color: string;
  onChange: (hex: string) => void;
  isLight?: boolean;
  canvasHeight?: string;
  showAlpha?: boolean;
}

export const InlineColorPicker: React.FC<InlineColorPickerProps> = ({
  color,
  onChange,
  isLight = false,
  canvasHeight = 'h-20',
  showAlpha = true,
}) => {
  const parsed = parseColorWithAlpha(color);
  const rgb = { r: parsed.r, g: parsed.g, b: parsed.b };
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const initialHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

  const [hue, setHue] = useState<number>(initialHsv.h);
  const [sat, setSat] = useState<number>(initialHsv.s);
  const [val, setVal] = useState<number>(initialHsv.v);
  const [alpha, setAlpha] = useState<number>(parsed.a);
  const [formatMode, setFormatMode] = useState<'RGB' | 'HEX' | 'HSL'>('RGB');

  const canvasRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const hiddenColorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const p = parseColorWithAlpha(color);
    const hsv = rgbToHsv(p.r, p.g, p.b);
    if (hsv.s > 0 && hsv.v > 0) {
      setHue(hsv.h);
    }
    setSat(hsv.s);
    setVal(hsv.v);
    setAlpha(p.a);
  }, [color]);

  const commitColor = (newHue: number, newSat: number, newVal: number, newAlpha: number) => {
    const newRgb = hsvToRgb(newHue, newSat, newVal);
    const outputHex = rgbaToHex(newRgb.r, newRgb.g, newRgb.b, newAlpha);
    onChange(outputHex);
  };

  const updateColorFromPointer = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
    const newSat = Math.round((x / rect.width) * 100);
    const newVal = Math.round((1 - y / rect.height) * 100);
    setSat(newSat);
    setVal(newVal);
    commitColor(hue, newSat, newVal, alpha);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateColorFromPointer(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    updateColorFromPointer(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          const p = parseColorWithAlpha(result.sRGBHex);
          const out = rgbaToHex(p.r, p.g, p.b, alpha);
          onChange(out);
        }
      } catch (e) {
      }
    } else {
      hiddenColorInputRef.current?.click();
    }
  };

  const handleHueChange = (newHue: number) => {
    setHue(newHue);
    commitColor(newHue, sat, val, alpha);
  };

  const handleAlphaChange = (newAlpha: number) => {
    const clamped = Math.max(0, Math.min(100, newAlpha));
    setAlpha(clamped);
    commitColor(hue, sat, val, clamped);
  };

  const handleRgbInputChange = (key: 'r' | 'g' | 'b', valStr: string) => {
    const parsedVal = parseInt(valStr, 10);
    const newRgb = { ...rgb, [key]: isNaN(parsedVal) ? 0 : Math.max(0, Math.min(255, parsedVal)) };
    const newHex = rgbaToHex(newRgb.r, newRgb.g, newRgb.b, alpha);
    onChange(newHex);
  };

  const handleHslInputChange = (key: 'h' | 's' | 'l', valStr: string) => {
    const parsedVal = parseInt(valStr, 10);
    const num = isNaN(parsedVal) ? 0 : parsedVal;
    let newH = hsl.h;
    let newS = hsl.s;
    let newL = hsl.l;

    if (key === 'h') newH = Math.max(0, Math.min(360, num));
    if (key === 's') newS = Math.max(0, Math.min(100, num));
    if (key === 'l') newL = Math.max(0, Math.min(100, num));

    const newRgb = hslToRgb(newH, newS, newL);
    const newHex = rgbaToHex(newRgb.r, newRgb.g, newRgb.b, alpha);
    onChange(newHex);
  };

  const handleHexInputChange = (valStr: string) => {
    let raw = valStr.trim();
    if (!raw.startsWith('#')) raw = '#' + raw;
    const p = parseColorWithAlpha(raw);
    onChange(p.hexFull);
  };

  const toggleFormatMode = () => {
    if (formatMode === 'RGB') setFormatMode('HEX');
    else if (formatMode === 'HEX') setFormatMode('HSL');
    else setFormatMode('RGB');
  };

  const opaqueHex = rgbToHex(rgb.r, rgb.g, rgb.b);
  const currentFormattedHex = rgbaToHex(rgb.r, rgb.g, rgb.b, alpha);

  return (
    <div className="space-y-2.5 pt-0.5">
      <div
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`w-full ${canvasHeight} rounded-xl relative cursor-crosshair overflow-hidden border border-slate-300 dark:border-slate-800 select-none touch-none shadow-xs`}
        style={{
          backgroundColor: `hsl(${hue}, 100%, 50%)`,
          backgroundImage: `
            linear-gradient(to top, #000 0%, transparent 100%),
            linear-gradient(to right, #fff 0%, transparent 100%)
          `,
        }}
      >
        <div
          className="w-4 h-4 rounded-full border border-slate-400/80 dark:border-slate-500/80 ring-2 ring-white shadow-xs absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: `${sat}%`,
            top: `${100 - val}%`,
            backgroundColor: opaqueHex,
          }}
        />
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleEyeDropper}
            className={`w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
              isLight
                ? 'hover:bg-slate-200 text-slate-800'
                : 'hover:bg-slate-800 text-slate-200'
            }`}
            title="Pick color"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m2 22 1-1h3l9-9" />
              <path d="M3 21v-3l9-9" />
              <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9" />
              <path d="m13 8 3 3" />
            </svg>
          </button>
          <input
            ref={hiddenColorInputRef}
            type="color"
            value={opaqueHex}
            onChange={(e) => {
              const p = parseColorWithAlpha(e.target.value);
              const out = rgbaToHex(p.r, p.g, p.b, alpha);
              onChange(out);
            }}
            className="absolute inset-0 opacity-0 pointer-events-none w-0 h-0"
          />

          <div
            className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700 shadow-xs shrink-0 overflow-hidden relative"
            style={{
              backgroundImage: `linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)`,
              backgroundSize: `6px 6px`,
              backgroundPosition: `0 0, 0 3px, 3px -3px, -3px 0px`,
            }}
            title={`Color: ${currentFormattedHex} (${alpha}% opacity)`}
          >
            <div
              className="w-full h-full"
              style={{ backgroundColor: currentFormattedHex }}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-1.5 justify-center">
          <input
            type="range"
            min={0}
            max={360}
            value={hue}
            onChange={(e) => handleHueChange(parseInt(e.target.value, 10))}
            className="w-full hue-slider cursor-pointer"
            style={{
              background: `linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)`,
            }}
            title="Hue"
          />

          {showAlpha && (
            <div
              className="relative w-full rounded-[4px] overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)`,
                backgroundSize: `6px 6px`,
                backgroundPosition: `0 0, 0 3px, 3px -3px, -3px 0px`,
              }}
            >
              <input
                type="range"
                min={0}
                max={100}
                value={alpha}
                onChange={(e) => handleAlphaChange(parseInt(e.target.value, 10))}
                className="w-full alpha-slider cursor-pointer relative z-10"
                style={{
                  background: `linear-gradient(to right, transparent, ${opaqueHex})`,
                }}
                title={`Transparency: ${alpha}%`}
              />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1 pt-0.5">
        <div>
          {formatMode === 'RGB' && (
            <div className="grid grid-cols-4 gap-1.5">
              <input
                type="text"
                value={rgb.r}
                onChange={(e) => handleRgbInputChange('r', e.target.value)}
                className={`w-full h-7 text-center font-medium text-xs rounded-lg border bg-transparent focus:outline-none focus:border-indigo-500 transition-colors shadow-2xs ${
                  isLight
                    ? 'border-slate-300 hover:border-slate-400 text-slate-900'
                    : 'border-slate-600 hover:border-slate-500 text-slate-100'
                }`}
              />
              <input
                type="text"
                value={rgb.g}
                onChange={(e) => handleRgbInputChange('g', e.target.value)}
                className={`w-full h-7 text-center font-medium text-xs rounded-lg border bg-transparent focus:outline-none focus:border-indigo-500 transition-colors shadow-2xs ${
                  isLight
                    ? 'border-slate-300 hover:border-slate-400 text-slate-900'
                    : 'border-slate-600 hover:border-slate-500 text-slate-100'
                }`}
              />
              <input
                type="text"
                value={rgb.b}
                onChange={(e) => handleRgbInputChange('b', e.target.value)}
                className={`w-full h-7 text-center font-medium text-xs rounded-lg border bg-transparent focus:outline-none focus:border-indigo-500 transition-colors shadow-2xs ${
                  isLight
                    ? 'border-slate-300 hover:border-slate-400 text-slate-900'
                    : 'border-slate-600 hover:border-slate-500 text-slate-100'
                }`}
              />
              <input
                type="text"
                value={`${alpha}%`}
                onChange={(e) => {
                  const num = parseInt(e.target.value.replace('%', ''), 10);
                  handleAlphaChange(isNaN(num) ? 100 : num);
                }}
                className={`w-full h-7 text-center font-medium text-xs rounded-lg border bg-transparent focus:outline-none focus:border-indigo-500 transition-colors shadow-2xs ${
                  isLight
                    ? 'border-slate-300 hover:border-slate-400 text-slate-900'
                    : 'border-slate-600 hover:border-slate-500 text-slate-100'
                }`}
              />
            </div>
          )}

          {formatMode === 'HEX' && (
            <div className="grid grid-cols-4 gap-1.5">
              <input
                type="text"
                value={currentFormattedHex.toUpperCase()}
                onChange={(e) => handleHexInputChange(e.target.value)}
                className={`col-span-3 w-full h-7 text-center font-mono font-medium text-xs rounded-lg border bg-transparent focus:outline-none focus:border-indigo-500 transition-colors shadow-2xs ${
                  isLight
                    ? 'border-slate-300 hover:border-slate-400 text-slate-900'
                    : 'border-slate-600 hover:border-slate-500 text-slate-100'
                }`}
              />
              <input
                type="text"
                value={`${alpha}%`}
                onChange={(e) => {
                  const num = parseInt(e.target.value.replace('%', ''), 10);
                  handleAlphaChange(isNaN(num) ? 100 : num);
                }}
                className={`col-span-1 w-full h-7 text-center font-medium text-xs rounded-lg border bg-transparent focus:outline-none focus:border-indigo-500 transition-colors shadow-2xs ${
                  isLight
                    ? 'border-slate-300 hover:border-slate-400 text-slate-900'
                    : 'border-slate-600 hover:border-slate-500 text-slate-100'
                }`}
              />
            </div>
          )}

          {formatMode === 'HSL' && (
            <div className="grid grid-cols-4 gap-1.5">
              <input
                type="text"
                value={hsl.h}
                onChange={(e) => handleHslInputChange('h', e.target.value)}
                className={`w-full h-7 text-center font-medium text-xs rounded-lg border bg-transparent focus:outline-none focus:border-indigo-500 transition-colors shadow-2xs ${
                  isLight
                    ? 'border-slate-300 hover:border-slate-400 text-slate-900'
                    : 'border-slate-600 hover:border-slate-500 text-slate-100'
                }`}
              />
              <input
                type="text"
                value={hsl.s}
                onChange={(e) => handleHslInputChange('s', e.target.value)}
                className={`w-full h-7 text-center font-medium text-xs rounded-lg border bg-transparent focus:outline-none focus:border-indigo-500 transition-colors shadow-2xs ${
                  isLight
                    ? 'border-slate-300 hover:border-slate-400 text-slate-900'
                    : 'border-slate-600 hover:border-slate-500 text-slate-100'
                }`}
              />
              <input
                type="text"
                value={hsl.l}
                onChange={(e) => handleHslInputChange('l', e.target.value)}
                className={`w-full h-7 text-center font-medium text-xs rounded-lg border bg-transparent focus:outline-none focus:border-indigo-500 transition-colors shadow-2xs ${
                  isLight
                    ? 'border-slate-300 hover:border-slate-400 text-slate-900'
                    : 'border-slate-600 hover:border-slate-500 text-slate-100'
                }`}
              />
              <input
                type="text"
                value={`${alpha}%`}
                onChange={(e) => {
                  const num = parseInt(e.target.value.replace('%', ''), 10);
                  handleAlphaChange(isNaN(num) ? 100 : num);
                }}
                className={`w-full h-7 text-center font-medium text-xs rounded-lg border bg-transparent focus:outline-none focus:border-indigo-500 transition-colors shadow-2xs ${
                  isLight
                    ? 'border-slate-300 hover:border-slate-400 text-slate-900'
                    : 'border-slate-600 hover:border-slate-500 text-slate-100'
                }`}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-1">
          <div className="flex-1 grid grid-cols-4 gap-1.5 text-center text-xs font-semibold text-slate-800 dark:text-slate-100">
            {formatMode === 'RGB' && (
              <>
                <span>R</span>
                <span>G</span>
                <span>B</span>
                <span>A</span>
              </>
            )}
            {formatMode === 'HEX' && (
              <>
                <span className="col-span-3">HEX</span>
                <span className="col-span-1">A</span>
              </>
            )}
            {formatMode === 'HSL' && (
              <>
                <span>H</span>
                <span>S</span>
                <span>L</span>
                <span>A</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={toggleFormatMode}
            className="p-0.5 bg-transparent border-0 text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400 cursor-pointer transition-colors shrink-0 ml-2"
            title={`Format: ${formatMode}. Click to switch.`}
          >
            <div className="flex flex-col items-center justify-center -space-y-0.5">
              <ChevronUp className="w-3 h-3" />
              <ChevronDown className="w-3 h-3" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export const NoneNoDecorationIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 shrink-0' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 3L21 21M7.71158 7.75466C6.72554 8.97901 5.86195 10.2027 5.50883 11.1C5.18069 11.9338 5 12.8452 5 13.8C5 17.7764 8.13401 21 12 21C14.4134 21 16.5415 19.7438 17.8 17.8324M10.38 4.69409C11.3129 3.68822 12 3 12 3C12 3 17.4527 8.46135 18.4912 11.1C18.7584 11.779 18.9278 12.5095 18.9815 13.273"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface StepperControlProps {
  label?: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  isLight?: boolean;
}

export const StepperControl: React.FC<StepperControlProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 1000,
  step = 1,
  unit = 'px',
  isLight = false,
}) => {
  return (
    <div className="space-y-1">
      {label && <label className={`text-xs font-semibold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{label}</label>}
      <div className={`flex items-center rounded-lg border overflow-hidden transition-colors shadow-2xs ${
        isLight ? 'border-slate-300 bg-white' : 'border-slate-600 bg-slate-900'
      }`}>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - step))}
          className={`px-2.5 py-1.5 transition-colors cursor-pointer text-xs font-bold shrink-0 ${
            isLight
              ? 'hover:bg-slate-100 text-slate-600 active:bg-slate-200'
              : 'hover:bg-slate-800 text-slate-300 active:bg-slate-700'
          }`}
          title="Decrease"
        >
          -
        </button>
        <div className="flex-1 min-w-0 flex items-center justify-center px-1">
          <input
            type="number"
            value={value}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              onChange(isNaN(val) ? 0 : Math.min(max, Math.max(min, val)));
            }}
            className={`w-full text-center bg-transparent text-xs font-semibold focus:outline-none ${
              isLight ? 'text-slate-800' : 'text-slate-100'
            }`}
          />
          {unit && <span className={`text-[10px] font-mono select-none mr-1 shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{unit}</span>}
        </div>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + step))}
          className={`px-2.5 py-1.5 transition-colors cursor-pointer text-xs font-bold shrink-0 ${
            isLight
              ? 'hover:bg-slate-100 text-slate-600 active:bg-slate-200'
              : 'hover:bg-slate-800 text-slate-300 active:bg-slate-700'
          }`}
          title="Increase"
        >
          +
        </button>
      </div>
    </div>
  );
};

export const WEIGHT_LABELS: Record<number, string> = {
  100: 'Thin (100)',
  200: 'Extra Light (200)',
  300: 'Light (300)',
  400: 'Regular (400)',
  500: 'Medium (500)',
  600: 'Semi Bold (600)',
  700: 'Bold (700)',
  800: 'Extra Bold (800)',
  900: 'Black (900)',
};

export interface GradientPreset {
  name: string;
  gradient?: string;
  from: string;
  to: string;
}

export const TEXT_GRADIENT_PRESETS: GradientPreset[] = [

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
