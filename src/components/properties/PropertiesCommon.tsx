import React from 'react';
import { SelectedElementContext, WebsiteElement, WebsiteSection, WebsitePage, ViewportMode } from '../../types';
export { SideSpacingControl, SideNumericInput } from '../common/SideSpacingControl';
export type { SpacingMode, SpacingValues, SideSpacingControlProps } from '../common/SideSpacingControl';

export interface SubHeaderState {
  tabName: string;
  onBack: () => void;
}

export interface ElementInspectorProps {
  selectedContext: SelectedElementContext;
  onUpdateElement: (updatedElement: WebsiteElement) => void;
  onSelectContext?: (context: SelectedElementContext | null) => void;
  onDeleteElement?: (elementId: string) => void;
  onMoveElementUp?: (elementId: string) => void;
  onMoveElementDown?: (elementId: string) => void;
  onDuplicateElement?: (elementId: string) => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  page?: WebsitePage;
  selectedSection?: WebsiteSection | null;
  onUpdateSection?: (updatedSection: WebsiteSection) => void;
  uiTheme?: 'dark' | 'light';
  viewportMode?: ViewportMode;
  onSubHeaderChange?: (state: SubHeaderState | null) => void;
}

export interface SectionPropertiesProps {
  selectedSection: WebsiteSection;
  onUpdateSection?: (updatedSection: WebsiteSection) => void;
  onDeleteSection?: (sectionId: string) => void;
  onUpdateElement?: (updatedElement: WebsiteElement) => void;
  onSelectContext?: (context: SelectedElementContext | null) => void;
  uiTheme?: 'dark' | 'light';
  viewportMode?: ViewportMode;
}

export type PageSettingsTab = 'all' | 'details' | 'layout' | 'spacing' | 'background' | 'typography' | 'colors' | 'primary-color' | 'text-color' | 'scrollbar';

export interface PagePropertiesProps {
  page?: WebsitePage;
  onUpdatePageStyles?: (styles: WebsitePage['globalStyles'], title?: string, fileName?: string) => void;
  onUpdateSection?: (updatedSection: WebsiteSection) => void;
  onOpenSiteSettings?: () => void;
  uiTheme?: 'dark' | 'light';
  activeTab?: PageSettingsTab;
  onSelectTab?: (tab: PageSettingsTab) => void;
}

export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  let c = (hex || '#fef08a').replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  if (c.length === 8) c = c.slice(0, 6);
  const num = parseInt(c, 16) || 0;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
};

export const rgbaToHex = (r: number, g: number, b: number, a: number = 100): string => {
  const hexRgb = [r, g, b].map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
  const clampedAlpha = Math.max(0, Math.min(100, Math.round(a)));
  if (clampedAlpha >= 100) {
    return '#' + hexRgb;
  }
  const hexAlpha = Math.max(0, Math.min(255, Math.round((clampedAlpha / 100) * 255)))
    .toString(16)
    .padStart(2, '0');
  return '#' + hexRgb + hexAlpha;
};

export const parseColorWithAlpha = (
  colorStr: string
): { r: number; g: number; b: number; a: number; hexOpaque: string; hexFull: string } => {
  let str = (colorStr || '#0f172a').trim();
  if (str === 'transparent') {
    return { r: 0, g: 0, b: 0, a: 0, hexOpaque: '#000000', hexFull: '#00000000' };
  }
  if (str.startsWith('rgba')) {
    const m = str.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);
    if (m) {
      const r = Math.max(0, Math.min(255, Math.round(parseFloat(m[1]))));
      const g = Math.max(0, Math.min(255, Math.round(parseFloat(m[2]))));
      const b = Math.max(0, Math.min(255, Math.round(parseFloat(m[3]))));
      const a = m[4] !== undefined
        ? Math.max(0, Math.min(100, Math.round(parseFloat(m[4]) <= 1 ? parseFloat(m[4]) * 100 : parseFloat(m[4]))))
        : 100;
      return {
        r,
        g,
        b,
        a,
        hexOpaque: rgbToHex(r, g, b),
        hexFull: rgbaToHex(r, g, b, a),
      };
    }
  }
  if (str.startsWith('rgb')) {
    const m = str.match(/rgb\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/);
    if (m) {
      const r = Math.max(0, Math.min(255, Math.round(parseFloat(m[1]))));
      const g = Math.max(0, Math.min(255, Math.round(parseFloat(m[2]))));
      const b = Math.max(0, Math.min(255, Math.round(parseFloat(m[3]))));
      const hex = rgbToHex(r, g, b);
      return { r, g, b, a: 100, hexOpaque: hex, hexFull: hex };
    }
  }
  if (str.startsWith('#')) {
    let c = str.slice(1);
    if (c.length === 3) {
      const full = c.split('').map((x) => x + x).join('');
      const num = parseInt(full, 16) || 0;
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      const hex = '#' + full;
      return { r, g, b, a: 100, hexOpaque: hex, hexFull: hex };
    } else if (c.length === 4) {
      const r = parseInt(c[0] + c[0], 16) || 0;
      const g = parseInt(c[1] + c[1], 16) || 0;
      const b = parseInt(c[2] + c[2], 16) || 0;
      const a = Math.round((parseInt(c[3] + c[3], 16) / 255) * 100);
      return {
        r,
        g,
        b,
        a,
        hexOpaque: rgbToHex(r, g, b),
        hexFull: rgbaToHex(r, g, b, a),
      };
    } else if (c.length === 6) {
      const num = parseInt(c, 16) || 0;
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      const hex = '#' + c;
      return { r, g, b, a: 100, hexOpaque: hex, hexFull: hex };
    } else if (c.length === 8) {
      const r = parseInt(c.slice(0, 2), 16) || 0;
      const g = parseInt(c.slice(2, 4), 16) || 0;
      const b = parseInt(c.slice(4, 6), 16) || 0;
      const a = Math.round((parseInt(c.slice(6, 8), 16) / 255) * 100);
      return {
        r,
        g,
        b,
        a,
        hexOpaque: rgbToHex(r, g, b),
        hexFull: '#' + c,
      };
    }
  }
  return { r: 15, g: 23, b: 42, a: 100, hexOpaque: '#0f172a', hexFull: '#0f172a' };
};

export const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = Math.round(h * 60);
  }

  return { h: Math.round(h < 0 ? h + 360 : h), s: Math.round(s * 100), l: Math.round(l * 100) };
};

export const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return { r: Math.round(255 * f(0)), g: Math.round(255 * f(8)), b: Math.round(255 * f(4)) };
};

export const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = Math.round(h * 60);
  }

  return {
    h: Math.round(h < 0 ? h + 360 : h),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
};

export const hsvToRgb = (h: number, s: number, v: number): { r: number; g: number; b: number } => {
  h = (h % 360 + 360) % 360;
  const sNorm = Math.max(0, Math.min(100, s)) / 100;
  const vNorm = Math.max(0, Math.min(100, v)) / 100;

  const c = vNorm * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = vNorm - c;

  let r1 = 0, g1 = 0, b1 = 0;
  if (h >= 0 && h < 60) {
    r1 = c; g1 = x; b1 = 0;
  } else if (h >= 60 && h < 120) {
    r1 = x; g1 = c; b1 = 0;
  } else if (h >= 120 && h < 180) {
    r1 = 0; g1 = c; b1 = x;
  } else if (h >= 180 && h < 240) {
    r1 = 0; g1 = x; b1 = c;
  } else if (h >= 240 && h < 300) {
    r1 = x; g1 = 0; b1 = c;
  } else {
    r1 = c; g1 = 0; b1 = x;
  }

  return {
    r: Math.max(0, Math.min(255, Math.round((r1 + m) * 255))),
    g: Math.max(0, Math.min(255, Math.round((g1 + m) * 255))),
    b: Math.max(0, Math.min(255, Math.round((b1 + m) * 255))),
  };
};

export const getInspectorStyles = (isLight: boolean) => ({
  inputClass: isLight
    ? 'w-full px-3.5 py-2.5 text-xs sm:text-[13px] font-normal bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-sm'
    : 'w-full px-3.5 py-2.5 text-xs sm:text-[13px] font-normal bg-slate-950 border border-slate-700/90 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-sm',
  selectClass: isLight
    ? 'w-full px-3.5 py-2.5 text-xs sm:text-[13px] font-normal bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-sm'
    : 'w-full px-3.5 py-2.5 text-xs sm:text-[13px] font-normal bg-slate-950 border border-slate-700/90 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-sm',
  labelClass: isLight
    ? 'block text-xs font-medium text-slate-700 mb-1.5 tracking-normal'
    : 'block text-xs font-medium text-slate-300 mb-1.5 tracking-normal',
  boxGroupClass: isLight
    ? 'p-1.5 bg-slate-100 border border-slate-300 rounded-xl'
    : 'p-1.5 bg-slate-950 border border-slate-800 rounded-xl',
});

import { SliderWithInput } from './SliderWithInput';

interface TypographyControlsProps {
  styles: any;
  onUpdateStyle: (key: string, value: any) => void;
  uiTheme?: 'dark' | 'light';
}

export const TypographyControls: React.FC<TypographyControlsProps> = ({
  styles,
  onUpdateStyle,
  uiTheme = 'dark',
}) => {
  const isLight = uiTheme === 'light';
  const { labelClass, boxGroupClass } = getInspectorStyles(isLight);

  const letterSpacing = styles?.letterSpacing !== undefined ? styles.letterSpacing : 0;
  const lineHeight = styles?.lineHeight !== undefined ? styles.lineHeight : 1.5;
  const spaceBefore =
    styles?.spaceBefore !== undefined
      ? styles.spaceBefore
      : styles?.marginTop !== undefined
      ? styles.marginTop
      : 0;
  const spaceAfter =
    styles?.spaceAfter !== undefined
      ? styles.spaceAfter
      : styles?.marginBottom !== undefined
      ? styles.marginBottom
      : 0;

  return (
    <div className="space-y-3 pt-2 border-t border-slate-700/40">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className={labelClass}>Letter Spacing (Tracking)</label>
          <span className="text-[10px] font-mono text-indigo-400">{letterSpacing}em</span>
        </div>
        <div className={`grid grid-cols-3 gap-1 mb-2 ${boxGroupClass}`}>
          {[
            { label: 'Tight', val: -0.05 },
            { label: 'Normal', val: 0 },
            { label: 'Wide', val: 0.1 },
          ].map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => onUpdateStyle('letterSpacing', p.val)}
              className={`py-1 text-[10px] rounded font-medium transition-all ${
                letterSpacing === p.val
                  ? 'bg-indigo-600 text-white font-semibold'
                  : isLight
                  ? 'text-slate-600 hover:bg-slate-200'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <SliderWithInput
          value={letterSpacing}
          onChange={(val) => onUpdateStyle('letterSpacing', val)}
          min={-0.08}
          max={0.5}
          step={0.01}
          unit="em"
          precision={2}
          allowNegative={true}
          hardMax={10}
          isLight={isLight}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className={labelClass}>Line Height (Leading)</label>
          <span className="text-[10px] font-mono text-indigo-400">{lineHeight}</span>
        </div>
        <div className={`grid grid-cols-3 gap-1 mb-2 ${boxGroupClass}`}>
          {[
            { label: 'Tight', val: 1.2 },
            { label: 'Normal', val: 1.5 },
            { label: 'Loose', val: 2.0 },
          ].map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => onUpdateStyle('lineHeight', p.val)}
              className={`py-1 text-[10px] rounded font-medium transition-all ${
                lineHeight === p.val
                  ? 'bg-indigo-600 text-white font-semibold'
                  : isLight
                  ? 'text-slate-600 hover:bg-slate-200'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <SliderWithInput
          value={lineHeight}
          onChange={(val) => onUpdateStyle('lineHeight', val)}
          min={0.8}
          max={3.0}
          step={0.05}
          unit=""
          precision={2}
          allowNegative={false}
          hardMax={10}
          isLight={isLight}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <div>
          <SliderWithInput
            label="Space Before"
            value={spaceBefore}
            onChange={(val) => {
              onUpdateStyle('spaceBefore', val);
              onUpdateStyle('marginTop', val);
            }}
            min={0}
            max={64}
            step={1}
            unit="px"
            allowNegative={false}
            hardMax={1000}
            isLight={isLight}
            labelClass={labelClass}
          />
        </div>
        <div>
          <SliderWithInput
            label="Space After"
            value={spaceAfter}
            onChange={(val) => {
              onUpdateStyle('spaceAfter', val);
              onUpdateStyle('marginBottom', val);
            }}
            min={0}
            max={64}
            step={1}
            unit="px"
            allowNegative={false}
            hardMax={1000}
            isLight={isLight}
            labelClass={labelClass}
          />
        </div>
      </div>
    </div>
  );
};
