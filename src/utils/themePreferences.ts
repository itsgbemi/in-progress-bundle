import {
  INTERFACE_FONTS,
  findFontByIdOrName,
  type InterfaceFontOption,
} from '../data/fonts';
import {
  INTERFACE_PALETTES,
  COLOR_FAMILIES,
  type InterfacePalettePreset,
  type InterfacePaletteShades,
} from '../data/interfacePalettes';
import {
  getActiveWorkspaceId,
  getStoredWorkspaces,
} from '../services/workspaceService';

export { INTERFACE_FONTS, INTERFACE_PALETTES, COLOR_FAMILIES };
export type { InterfaceFontOption, InterfacePalettePreset, InterfacePaletteShades };

export function getPaletteStorageKey(workspaceId?: string): string {
  const wsId = workspaceId || getActiveWorkspaceId();
  if (!wsId || wsId === 'workspace-default') return 'workspace_palette';
  return `workspace_palette_${wsId}`;
}

export function getFontStorageKey(workspaceId?: string): string {
  const wsId = workspaceId || getActiveWorkspaceId();
  if (!wsId || wsId === 'workspace-default') return 'workspace_font';
  return `workspace_font_${wsId}`;
}

export function getFontModeStorageKey(workspaceId?: string): string {
  const wsId = workspaceId || getActiveWorkspaceId();
  if (!wsId || wsId === 'workspace-default') return 'workspace_font_mode';
  return `workspace_font_mode_${wsId}`;
}

export function getHeadingFontStorageKey(workspaceId?: string): string {
  const wsId = workspaceId || getActiveWorkspaceId();
  if (!wsId || wsId === 'workspace-default') return 'workspace_heading_font';
  return `workspace_heading_font_${wsId}`;
}

export function getHeadingTrackingStorageKey(workspaceId?: string): string {
  const wsId = workspaceId || getActiveWorkspaceId();
  if (!wsId || wsId === 'workspace-default') return 'workspace_heading_tracking';
  return `workspace_heading_tracking_${wsId}`;
}

export function getBodyTrackingStorageKey(workspaceId?: string): string {
  const wsId = workspaceId || getActiveWorkspaceId();
  if (!wsId || wsId === 'workspace-default') return 'workspace_body_tracking';
  return `workspace_body_tracking_${wsId}`;
}

export function getSurfaceModeStorageKey(workspaceId?: string): string {
  const wsId = workspaceId || getActiveWorkspaceId();
  if (!wsId || wsId === 'workspace-default') return 'workspace_surface_mode';
  return `workspace_surface_mode_${wsId}`;
}

export function getSavedAppFont(workspaceId?: string): string {
  if (typeof window === 'undefined') return 'system';
  const key = getFontStorageKey(workspaceId);
  return (
    localStorage.getItem(key) ||
    localStorage.getItem('workspace_font') ||
    localStorage.getItem('myoffice_app_font') ||
    localStorage.getItem('superreach_app_font') ||
    'system'
  );
}

export function getSavedFontMode(workspaceId?: string): 'same_font' | 'separate_heading' {
  if (typeof window === 'undefined') return 'same_font';
  const key = getFontModeStorageKey(workspaceId);
  return (
    (localStorage.getItem(key) as 'same_font' | 'separate_heading') ||
    (localStorage.getItem('workspace_font_mode') as 'same_font' | 'separate_heading') ||
    (localStorage.getItem('myoffice_font_mode') as 'same_font' | 'separate_heading') ||
    (localStorage.getItem('superreach_font_mode') as 'same_font' | 'separate_heading') ||
    'same_font'
  );
}

export function getSavedHeadingFont(workspaceId?: string): string {
  if (typeof window === 'undefined') return 'system';
  const key = getHeadingFontStorageKey(workspaceId);
  return (
    localStorage.getItem(key) ||
    localStorage.getItem('workspace_heading_font') ||
    localStorage.getItem('myoffice_heading_font') ||
    localStorage.getItem('superreach_heading_font') ||
    getSavedAppFont(workspaceId)
  );
}

export function getSavedAppPalette(workspaceId?: string): string {
  if (typeof window === 'undefined') return 'indigo';
  const key = getPaletteStorageKey(workspaceId);
  return (
    localStorage.getItem(key) ||
    localStorage.getItem('workspace_palette') ||
    localStorage.getItem('myoffice_app_palette') ||
    localStorage.getItem('superreach_app_palette') ||
    'indigo'
  );
}

export function getSavedHeadingTracking(workspaceId?: string): string {
  if (typeof window === 'undefined') return '0em';
  const key = getHeadingTrackingStorageKey(workspaceId);
  return (
    localStorage.getItem(key) ||
    localStorage.getItem('workspace_heading_tracking') ||
    localStorage.getItem('myoffice_heading_tracking') ||
    localStorage.getItem('superreach_heading_tracking') ||
    '0em'
  );
}

export function getSavedBodyTracking(workspaceId?: string): string {
  if (typeof window === 'undefined') return '0.015em';
  const key = getBodyTrackingStorageKey(workspaceId);
  return (
    localStorage.getItem(key) ||
    localStorage.getItem('workspace_body_tracking') ||
    localStorage.getItem('myoffice_body_tracking') ||
    localStorage.getItem('superreach_body_tracking') ||
    '0.015em'
  );
}

export interface TrackingOption {
  id: string;
  label: string;
  value: string;
  description: string;
}

export const HEADING_TRACKING_OPTIONS: TrackingOption[] = [
  { id: 'tight', label: 'Tight', value: '-0.02em', description: '-0.02em modern display' },
  { id: 'normal', label: 'Normal', value: '0em', description: '0em standard spacing' },
  { id: 'wide', label: 'Wide', value: '0.02em', description: '+0.02em airy caps/titles' },
];

export const BODY_TRACKING_OPTIONS: TrackingOption[] = [
  { id: 'tight', label: 'Tight', value: '-0.015em', description: '-0.015em compact UI' },
  { id: 'normal', label: 'Normal', value: '0em', description: '0em natural reading' },
  { id: 'wide', label: 'Wide', value: '0.015em', description: '+0.015em high legibility' },
];

export function applyAppLetterSpacing(headingTracking?: string, bodyTracking?: string, workspaceId?: string) {
  if (typeof window === 'undefined') return;
  const wsId = workspaceId || getActiveWorkspaceId();
  const headingVal = headingTracking ?? getSavedHeadingTracking(wsId);
  const bodyVal = bodyTracking ?? getSavedBodyTracking(wsId);

  const root = document.documentElement;
  root.style.setProperty('--interface-heading-tracking', headingVal);
  root.style.setProperty('--interface-body-tracking', bodyVal);

  let trackingStyleTag = document.getElementById('dynamic-tracking-style') as HTMLStyleElement | null;
  if (!trackingStyleTag) {
    trackingStyleTag = document.createElement('style');
    trackingStyleTag.id = 'dynamic-tracking-style';
    document.head.appendChild(trackingStyleTag);
  }

  trackingStyleTag.textContent = `
    :root {
      --interface-heading-tracking: ${headingVal};
      --interface-body-tracking: ${bodyVal};
    }
    h1, h2, h3, h4, h5, h6, [data-heading], .interface-heading {
      letter-spacing: var(--interface-heading-tracking) !important;
    }
    p, span, div, label, input, select, textarea, button, a {
      letter-spacing: var(--interface-body-tracking);
    }
  `;

  if (headingTracking !== undefined) {
    localStorage.setItem(getHeadingTrackingStorageKey(wsId), headingTracking);
  }
  if (bodyTracking !== undefined) {
    localStorage.setItem(getBodyTrackingStorageKey(wsId), bodyTracking);
  }
}

export function applyAppInterfaceFont(
  bodyFontId: string,
  headingFontId?: string,
  fontMode?: 'same_font' | 'separate_heading',
  workspaceId?: string
) {
  if (typeof window === 'undefined') return;
  const wsId = workspaceId || getActiveWorkspaceId();
  const mode = fontMode ?? getSavedFontMode(wsId);
  const bodyFont = findFontByIdOrName(bodyFontId) || INTERFACE_FONTS.find((f) => f.id === bodyFontId) || INTERFACE_FONTS[0];
  const targetHeadingId = headingFontId ?? getSavedHeadingFont(wsId);
  const headingFont = findFontByIdOrName(targetHeadingId) || INTERFACE_FONTS.find((f) => f.id === targetHeadingId) || bodyFont;

  const effectiveHeadingFamily = mode === 'separate_heading' ? headingFont.family : bodyFont.family;

  const root = document.documentElement;
  root.style.setProperty('--font-sans', bodyFont.family);
  root.style.setProperty('--font-heading', effectiveHeadingFamily);
  root.style.fontFamily = bodyFont.family;
  document.body.style.fontFamily = bodyFont.family;
  const rootEl = document.getElementById('root');
  if (rootEl) {
    rootEl.style.fontFamily = bodyFont.family;
  }

  let fontStyleTag = document.getElementById('dynamic-font-style') as HTMLStyleElement | null;
  if (!fontStyleTag) {
    fontStyleTag = document.createElement('style');
    fontStyleTag.id = 'dynamic-font-style';
    document.head.appendChild(fontStyleTag);
  }

  fontStyleTag.textContent = `
    :root {
      --font-sans: ${bodyFont.family};
      --font-heading: ${effectiveHeadingFamily};
    }

    html, body, #root {
      font-family: var(--font-sans) !important;
    }

    #dashboard-navbar,
    #dashboard-sidebar,
    #dashboard-viewport header,
    #dashboard-viewport aside,
    .modal,
    .popover-content,
    .properties-panel,
    [role="dialog"],
    [role="menu"] {
       font-family: var(--font-sans);
    }

    button, input, select, textarea, label, a {
      font-family: var(--font-sans);
    }

    .interface-heading, [data-heading] {
      font-family: var(--font-heading) !important;
    }

    [data-canvas-container],
    [data-canvas-container] *,
    .canvas-render-container,
    .canvas-render-container *,
    .canvas-frame,
    .canvas-frame * {
      font-family: inherit;
    }

    .canvas-frame :not([style*="font-family"]),
    .canvas-render-container :not([style*="font-family"]) {
      font-family: inherit !important;
    }
  `;

  localStorage.setItem(getFontStorageKey(wsId), bodyFont.id);
  localStorage.setItem('workspace_font', bodyFont.id);
  localStorage.setItem('myoffice_app_font', bodyFont.id);

  const headingKey = getHeadingFontStorageKey(wsId);
  localStorage.setItem(headingKey, headingFont.id);
  localStorage.setItem('workspace_heading_font', headingFont.id);
  localStorage.setItem('myoffice_heading_font', headingFont.id);

  const modeKey = getFontModeStorageKey(wsId);
  localStorage.setItem(modeKey, mode);
  localStorage.setItem('workspace_font_mode', mode);
  localStorage.setItem('myoffice_font_mode', mode);

  window.dispatchEvent(
    new CustomEvent('app_font_changed', {
      detail: { bodyFontId: bodyFont.id, headingFontId: headingFont.id, fontMode: mode, workspaceId: wsId },
    })
  );
}

export type SurfaceBackgroundMode = 'layered';

export function getSavedSurfaceMode(workspaceId?: string): SurfaceBackgroundMode {
  if (typeof window === 'undefined') return 'layered';
  const key = getSurfaceModeStorageKey(workspaceId);
  return 'layered';
}

export function saveSurfaceMode(mode: SurfaceBackgroundMode, workspaceId?: string) {
  if (typeof window === 'undefined') return;
  const wsId = workspaceId || getActiveWorkspaceId();
  localStorage.setItem(getSurfaceModeStorageKey(wsId), 'layered');
  applyAppInterfacePalette(getSavedAppPalette(wsId), 'layered', wsId);
  window.dispatchEvent(new Event('surface_mode_updated'));
}

export function applyAppInterfacePalette(paletteId: string, customSurfaceMode?: SurfaceBackgroundMode, workspaceId?: string) {
  if (typeof window === 'undefined') return;
  const wsId = workspaceId || getActiveWorkspaceId();
  const found = INTERFACE_PALETTES.find((p) => p.id === paletteId) || INTERFACE_PALETTES[0];
  const root = document.documentElement;
  const surfaceMode = 'layered';
  const isUnified = false;

  root.style.setProperty('--brand-primary', found.primary);
  root.style.setProperty('--brand-primary-rgb', hexToRgb(found.primary));
  root.style.setProperty('--brand-primary-hover', found.primaryHover);
  root.style.setProperty('--brand-accent', found.accent);
  root.style.setProperty('--brand-accent-rgb', hexToRgb(found.accent));
  root.style.setProperty('--brand-grad-start', found.gradStart);
  root.style.setProperty('--brand-grad-end', found.gradEnd);
  root.style.setProperty('--brand-dark-grad-start', found.darkGradStart);
  root.style.setProperty('--brand-dark-grad-end', found.darkGradEnd);

  Object.entries(found.brandShades).forEach(([shade, hex]) => {
    root.style.setProperty(`--color-indigo-${shade}`, hex);
  });
  Object.entries(found.accentShades).forEach(([shade, hex]) => {
    root.style.setProperty(`--color-violet-${shade}`, hex);
  });

  root.style.setProperty('--app-light-bg', found.lightNeutrals.bg);
  root.style.setProperty('--app-light-panel', found.lightNeutrals.panel);
  root.style.setProperty('--app-light-panel-hover', found.lightNeutrals.panelHover);
  root.style.setProperty('--app-light-border', found.lightNeutrals.border);
  root.style.setProperty('--app-light-border-subtle', found.lightNeutrals.borderSubtle);
  root.style.setProperty('--app-light-text', found.lightNeutrals.text);
  root.style.setProperty('--app-light-text-muted', found.lightNeutrals.textMuted);
  root.style.setProperty('--app-light-badge-bg', found.lightNeutrals.badgeBg);
  root.style.setProperty('--app-light-badge-text', found.lightNeutrals.badgeText);
  root.style.setProperty('--app-light-badge-border', found.lightNeutrals.badgeBorder);

  root.style.setProperty('--app-dark-bg', found.darkNeutrals.bg);
  root.style.setProperty('--app-dark-panel', found.darkNeutrals.panel);
  root.style.setProperty('--app-dark-panel-hover', found.darkNeutrals.panelHover);
  root.style.setProperty('--app-dark-border', found.darkNeutrals.border);
  root.style.setProperty('--app-dark-border-subtle', found.darkNeutrals.borderSubtle);
  root.style.setProperty('--app-dark-text', found.darkNeutrals.text);
  root.style.setProperty('--app-dark-text-muted', found.darkNeutrals.textMuted);
  root.style.setProperty('--app-dark-badge-bg', found.darkNeutrals.badgeBg);
  root.style.setProperty('--app-dark-badge-text', found.darkNeutrals.badgeText);
  root.style.setProperty('--app-dark-badge-border', found.darkNeutrals.badgeBorder);

  const isDark = root.classList.contains('dark') || document.body.classList.contains('dark');
  const tokens = isDark ? found.darkNeutrals : found.lightNeutrals;

  root.style.setProperty('--app-bg', tokens.bg);
  root.style.setProperty('--app-panel', tokens.panel);
  root.style.setProperty('--app-panel-hover', tokens.panelHover);
  root.style.setProperty('--app-border', tokens.border);
  root.style.setProperty('--app-border-subtle', tokens.borderSubtle);
  root.style.setProperty('--app-text', tokens.text);
  root.style.setProperty('--app-text-muted', tokens.textMuted);
  root.style.setProperty('--badge-bg', tokens.badgeBg);
  root.style.setProperty('--badge-text', tokens.badgeText);
  root.style.setProperty('--badge-border', tokens.badgeBorder);

  let styleTag = document.getElementById('dynamic-theme-style') as HTMLStyleElement | null;
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'dynamic-theme-style';
    document.head.appendChild(styleTag);
  }

  styleTag.textContent = `
    :root {
      --brand-primary: ${found.primary};
      --brand-primary-rgb: ${hexToRgb(found.primary)};
      --brand-primary-hover: ${found.primaryHover};
      --brand-accent: ${found.accent};
      --brand-accent-rgb: ${hexToRgb(found.accent)};
      --brand-grad-start: ${found.gradStart};
      --brand-grad-end: ${found.gradEnd};
      --brand-dark-grad-start: ${found.darkGradStart};
      --brand-dark-grad-end: ${found.darkGradEnd};

      --app-bg: ${found.lightNeutrals.bg};
      --app-panel: ${found.lightNeutrals.panel};
      --app-panel-hover: ${found.lightNeutrals.panelHover};
      --app-border: ${found.lightNeutrals.border};
      --app-border-subtle: ${found.lightNeutrals.borderSubtle};
      --app-text: ${found.lightNeutrals.text};
      --app-text-muted: ${found.lightNeutrals.textMuted};
      --badge-bg: ${found.lightNeutrals.badgeBg};
      --badge-text: ${found.lightNeutrals.badgeText};
      --badge-border: ${found.lightNeutrals.badgeBorder};

      --color-indigo-50: ${found.brandShades[50]};
      --color-indigo-100: ${found.brandShades[100]};
      --color-indigo-200: ${found.brandShades[200]};
      --color-indigo-300: ${found.brandShades[300]};
      --color-indigo-400: ${found.brandShades[400]};
      --color-indigo-500: ${found.brandShades[500]};
      --color-indigo-600: ${found.brandShades[600]};
      --color-indigo-700: ${found.brandShades[700]};
      --color-indigo-800: ${found.brandShades[800]};
      --color-indigo-900: ${found.brandShades[900]};
      --color-indigo-950: ${found.brandShades[950]};

      --color-violet-500: ${found.accentShades[500]};
      --color-violet-600: ${found.accentShades[600]};
      --color-violet-700: ${found.accentShades[700]};
      --color-violet-800: ${found.accentShades[800]};
      --color-violet-900: ${found.accentShades[900]};
      --color-violet-950: ${found.accentShades[950]};
    }

    .dark, [data-theme="dark"] {
      --app-bg: ${found.darkNeutrals.bg};
      --app-panel: ${found.darkNeutrals.panel};
      --app-panel-hover: ${found.darkNeutrals.panelHover};
      --app-border: ${found.darkNeutrals.border};
      --app-border-subtle: ${found.darkNeutrals.borderSubtle};
      --app-text: ${found.darkNeutrals.text};
      --app-text-muted: ${found.darkNeutrals.textMuted};
      --badge-bg: ${found.darkNeutrals.badgeBg};
      --badge-text: ${found.darkNeutrals.badgeText};
      --badge-border: ${found.darkNeutrals.badgeBorder};
    }

    .bg-indigo-600, .bg-indigo-600\\/80 { background-color: ${found.primary} !important; }
    .hover\\:bg-indigo-500:hover, .hover\\:bg-indigo-600:hover { background-color: ${found.primaryHover} !important; }
    .bg-indigo-50 { background-color: ${found.brandShades[50]} !important; }
    .bg-indigo-500\\/10 { background-color: ${found.lightNeutrals.badgeBg} !important; }
    .bg-indigo-500\\/20, .hover\\:bg-indigo-500\\/20:hover { background-color: rgba(${hexToRgb(found.primary)}, 0.2) !important; }
    .bg-indigo-600\\/15, .bg-indigo-600\\/20 { background-color: rgba(${hexToRgb(found.primary)}, 0.15) !important; }
    .bg-indigo-950\\/30, .bg-indigo-950\\/40 { background-color: rgba(${hexToRgb(found.primary)}, 0.18) !important; }

    .text-indigo-600, .text-indigo-500 { color: ${found.primary} !important; }
    .text-indigo-400 { color: ${found.accent} !important; }
    .text-indigo-300 { color: ${found.brandShades[300]} !important; }
    .text-indigo-200 { color: ${found.brandShades[200]} !important; }
    .text-indigo-100, .text-indigo-100\\/90 { color: ${found.brandShades[100]} !important; }
    .hover\\:text-indigo-600:hover, .group-hover\\:text-indigo-600:hover, .hover\\:text-indigo-400:hover, .group-hover\\:text-indigo-400:hover {
      color: ${found.primary} !important;
    }

    .border-indigo-500, .border-indigo-600 { border-color: ${found.primary} !important; }
    .border-indigo-500\\/20, .border-indigo-500\\/30 { border-color: rgba(${hexToRgb(found.primary)}, 0.3) !important; }
    .border-indigo-400\\/30 { border-color: rgba(${hexToRgb(found.accent)}, 0.3) !important; }
    .ring-indigo-500, .focus\\:border-indigo-500:focus, .focus\\:ring-indigo-500:focus,
    .focus\\:border-\\[var\\(--brand-primary\\)\\]:focus, .focus\\:ring-\\[var\\(--brand-primary\\)\\]\\/20:focus {
      border-color: ${found.primary} !important;
      --tw-ring-color: rgba(${hexToRgb(found.primary)}, 0.2) !important;
    }

    input:focus, select:focus, textarea:focus, [contenteditable="true"]:focus {
      border-color: var(--brand-primary) !important;
      outline: none !important;
      box-shadow: 0 0 0 1px var(--brand-primary), 0 0 0 3.5px rgba(${hexToRgb(found.primary)}, 0.18) !important;
    }

    select {
      accent-color: ${found.primary} !important;
    }
    select option, option {
      background-color: ${found.lightNeutrals.panel} !important;
      color: ${found.lightNeutrals.text} !important;
    }
    .dark select option, .dark option, [data-theme="dark"] select option, [data-theme="dark"] option {
      background-color: ${found.darkNeutrals.panel} !important;
      color: ${found.darkNeutrals.text} !important;
    }
    .dark select option:checked, .dark option:checked {
      background-color: ${found.primary} !important;
      color: #ffffff !important;
    }

    input[type="radio"], input[type="checkbox"], input[type="range"] {
      accent-color: ${found.primary} !important;
    }
    input[type="radio"]:focus, input[type="radio"]:focus-visible, input[type="checkbox"]:focus, input[type="checkbox"]:focus-visible {
      outline: none !important;
      box-shadow: 0 0 0 2px ${found.lightNeutrals.bg}, 0 0 0 4px ${found.primary}, 0 0 14px rgba(${hexToRgb(found.primary)}, 0.35) !important;
    }
    .dark input[type="radio"], .dark input[type="checkbox"] {
      accent-color: ${found.accent} !important;
    }
    .dark input[type="radio"]:focus, .dark input[type="radio"]:focus-visible, .dark input[type="checkbox"]:focus, .dark input[type="checkbox"]:focus-visible {
      outline: none !important;
      box-shadow: 0 0 0 2px ${found.darkNeutrals.bg}, 0 0 0 4px ${found.accent}, 0 0 14px rgba(${hexToRgb(found.accent)}, 0.45) !important;
    }
    input[type="range"]::-webkit-slider-thumb {
      background-color: ${found.primary} !important;
    }
    input[type="range"]::-moz-range-thumb {
      background-color: ${found.primary} !important;
    }
    .accent-indigo-500, .accent-indigo-600 {
      accent-color: ${found.primary} !important;
    }

    .from-indigo-600 {
      --tw-gradient-from: ${found.gradStart} var(--tw-gradient-from-position) !important;
      --tw-gradient-to: ${found.gradEnd} var(--tw-gradient-to-position) !important;
      --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important;
    }
    .to-violet-600, .to-violet-500 {
      --tw-gradient-to: ${found.gradEnd} var(--tw-gradient-to-position) !important;
    }

    body {
      background-color: var(--app-panel) !important;
      color: var(--app-text) !important;
    }

    html:not(.dark) #dashboard-viewport,
    [data-theme="light"] #dashboard-viewport {
      background-color: ${found.lightNeutrals.bg} !important;
    }
    html:not(.dark) #dashboard-main,
    [data-theme="light"] #dashboard-main {
      background-color: ${found.lightNeutrals.panel} !important;
    }
    html:not(.dark) .bg-white, [data-theme="light"] .bg-white {
      background-color: ${found.lightNeutrals.panel} !important;
    }
    html:not(.dark) .bg-slate-50, [data-theme="light"] .bg-slate-50 {
      background-color: ${found.lightNeutrals.panelHover} !important;
    }
    html:not(.dark) .border-slate-200, [data-theme="light"] .border-slate-200 {
      border-color: ${found.lightNeutrals.border} !important;
    }

    html.dark #dashboard-viewport,
    [data-theme="dark"] #dashboard-viewport {
      background-color: ${found.darkNeutrals.bg} !important;
    }
    html.dark #dashboard-main,
    [data-theme="dark"] #dashboard-main {
      background-color: ${found.darkNeutrals.panel} !important;
    }
    html.dark .bg-slate-900, [data-theme="dark"] .bg-slate-900 {
      background-color: ${found.darkNeutrals.panel} !important;
    }
    html.dark .bg-slate-950, [data-theme="dark"] .bg-slate-950 {
      background-color: ${found.darkNeutrals.bg} !important;
    }
    html.dark .bg-slate-800, [data-theme="dark"] .bg-slate-800 {
      background-color: ${found.darkNeutrals.panelHover} !important;
    }
    html.dark .border-slate-800, [data-theme="dark"] .border-slate-800 {
      border-color: ${found.darkNeutrals.border} !important;
    }
    html.dark .border-slate-700, [data-theme="dark"] .border-slate-700 {
      border-color: ${found.darkNeutrals.borderSubtle} !important;
    }
  `;

  localStorage.setItem(getPaletteStorageKey(wsId), paletteId);
  window.dispatchEvent(new CustomEvent('interface_palette_changed', { detail: { paletteId, workspaceId: wsId } }));
}

function hexToRgb(hex: string): string {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return `${r}, ${g}, ${b}`;
  }
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  return `${r}, ${g}, ${b}`;
}

export type LogoDisplayType = 'text_only' | 'image_only';
export type LogoIconSource = 'url' | 'svg';
export type HamburgerIconStyle = 'descending' | 'standard' | 'ascending' | 'middle_short' | 'staggered_right' | 'staggered_left';
export type SidebarLayoutMode = 'standard' | 'stacked';

export interface NavMenuItemConfig {
  id: string;
  visible: boolean;
}

export const DEFAULT_MENU_ITEMS: NavMenuItemConfig[] = [
  { id: 'get-started', visible: true },
  { id: 'overview', visible: true },
  { id: 'brand', visible: true },
  { id: 'websites', visible: true },
  { id: 'inbox', visible: true },
  { id: 'media', visible: true },
    ];

export interface AppBrandingConfig {
  logoDisplayType: LogoDisplayType;
  logoName: string;
  logoIconSource?: LogoIconSource;
  logoIconName: string;
  logoIconUrl: string;
  logoIconSvg?: string;
  logoImageUrl: string;
  logoImageUrlLight?: string;
  logoImageUrlDark?: string;
  logoSvg?: string;
  separateIconAndText: boolean;
  faviconUrl: string;
  hamburgerIconStyle?: HamburgerIconStyle;
  sidebarLayout?: SidebarLayoutMode;
  menuItems?: NavMenuItemConfig[];
}

export const DEFAULT_BRAND_SVG = `<svg viewBox="0 0 195.645 195.645" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full"><g><path style="fill:currentColor;" d="M102.123,90.756c0,6.313-5.136,11.449-11.442,11.449c-6.313,0-11.445-5.136-11.445-11.449 c0-6.306,5.132-11.438,11.445-11.438C96.987,79.318,102.123,84.45,102.123,90.756z M108.142,88.945v3.615h72.812v-3.615H108.142z M99.406,105.88l48.4,48.393l2.552-2.548l-48.4-48.397L99.406,105.88z M88.87,195.645h3.622v-87.438H88.87V195.645z M74.182,88.945 H14.691v3.615h59.491V88.945z M92.492,0H88.87v74.905h3.622V0z M79.683,84.364l2.154-2.906L36.204,47.559l-0.676-0.505 l-2.158,2.906L79,83.867L79.683,84.364z M150.469,31.122l-2.62-2.502L99.288,79.454l2.62,2.502L150.469,31.122z M37.088,151.897 l2.731,2.373l42.141-48.536l-2.734-2.369L37.088,151.897z M110.264,102.86l55.569,15.557l0.973-3.482l-55.572-15.557 L110.264,102.86z M43.021,107.655l1.249,3.396l30.474-11.191l-1.249-3.396L43.021,107.655z M108.779,84.4l49.768-17.257 l-1.188-3.418l-49.76,17.257L108.779,84.4z M83.931,75.585l3.285-1.521L59.248,13.571l-0.354-0.769l-3.285,1.521L83.58,74.819 L83.931,75.585z"></path></g></svg>`;

export const DEFAULT_BRANDING_CONFIG: AppBrandingConfig = {
  logoDisplayType: 'text_only',
  logoName: '',
  logoIconSource: 'url',
  logoIconName: 'Zap',
  logoIconUrl: '',
  logoIconSvg: '',
  logoImageUrl: '',
  logoImageUrlLight: '',
  logoImageUrlDark: '',
  logoSvg: '',
  separateIconAndText: true,
  faviconUrl: '',
  hamburgerIconStyle: 'descending',
  sidebarLayout: 'standard',
  menuItems: DEFAULT_MENU_ITEMS,
};

export function getBrandingStorageKey(workspaceId?: string): string {
  const wsId = workspaceId || getActiveWorkspaceId();
  if (!wsId || wsId === 'workspace-default') {
    return 'app_branding';
  }
  return `app_branding_${wsId}`;
}

export function getSavedBrandingConfig(workspaceId?: string): AppBrandingConfig {
  if (typeof window === 'undefined') return DEFAULT_BRANDING_CONFIG;
  const wsId = workspaceId || getActiveWorkspaceId();
  const storageKey = getBrandingStorageKey(wsId);
  try {
    const raw =
      localStorage.getItem(storageKey) ||
      localStorage.getItem(`myoffice_app_branding_${wsId}`) ||
      localStorage.getItem('myoffice_app_branding');
    if (!raw) {
      if (wsId && wsId !== 'workspace-default') {
        const workspaces = getStoredWorkspaces();
        const targetWs = workspaces.find((w) => w.id === wsId);
        return {
          ...DEFAULT_BRANDING_CONFIG,
          logoName: targetWs?.name || '',
        };
      }
      return DEFAULT_BRANDING_CONFIG;
    }
    const parsed = JSON.parse(raw);
    if (parsed.logoName === 'My Workspace' || parsed.logoName?.startsWith('Fir')) {
      parsed.logoName = '';
    }
    if (parsed.logoIconUrl?.includes('sfrwg8d4echh6aspgiyu')) {
      parsed.logoIconUrl = '';
    }
    if (parsed.faviconUrl?.includes('sfrwg8d4echh6aspgiyu') || parsed.faviconUrl === 'https://cdn-icons-png.flaticon.com/512/5968/5968292.png') {
      parsed.faviconUrl = '';
    }
    if (parsed.logoIconSource === 'preset') {
      parsed.logoIconSource = parsed.logoIconSvg ? 'svg' : 'url';
    }
    if (
      (parsed as any).logoDisplayType === 'icon_only' ||
      (parsed as any).logoDisplayType === 'svg_only' ||
      (parsed as any).logoDisplayType === 'icon_text'
    ) {
      parsed.logoDisplayType = 'text_only';
    }
    if (parsed.logoImageUrl && !parsed.logoImageUrlLight) {
      parsed.logoImageUrlLight = parsed.logoImageUrl;
    }
    if (parsed.menuItems && Array.isArray(parsed.menuItems)) {
      const existingIds = new Set(parsed.menuItems.map((m: any) => m.id));
      const missing = DEFAULT_MENU_ITEMS.filter((d) => !existingIds.has(d.id));
      parsed.menuItems = [...parsed.menuItems, ...missing];
      const websiteIdx = parsed.menuItems.findIndex((m: any) => m.id === 'websites');
      const brandIdx = parsed.menuItems.findIndex((m: any) => m.id === 'brand');
      if (websiteIdx !== -1 && brandIdx !== -1 && brandIdx > websiteIdx) {
        const [brandItem] = parsed.menuItems.splice(brandIdx, 1);
        parsed.menuItems.splice(websiteIdx, 0, brandItem);
      }
    } else {
      parsed.menuItems = DEFAULT_MENU_ITEMS;
    }
    return {
      ...DEFAULT_BRANDING_CONFIG,
      ...parsed,
    };
  } catch {
    return DEFAULT_BRANDING_CONFIG;
  }
}

export function applyBrandingConfig(config: Partial<AppBrandingConfig>, workspaceId?: string): AppBrandingConfig {
  const wsId = workspaceId || getActiveWorkspaceId();
  const current = getSavedBrandingConfig(wsId);
  const updated = { ...current, ...config };

  if (typeof window !== 'undefined') {
    const storageKey = getBrandingStorageKey(wsId);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    if (updated.faviconUrl) {
      let linkTag = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
      if (!linkTag) {
        linkTag = document.createElement('link');
        linkTag.rel = 'shortcut icon';
        document.head.appendChild(linkTag);
      }
      linkTag.href = updated.faviconUrl;
    }
  }
  return updated;
}

export function loadAndApplyWorkspaceTheme(workspaceId?: string) {
  if (typeof window === 'undefined') return;
  const wsId = workspaceId || getActiveWorkspaceId();
  const font = getSavedAppFont(wsId);
  const headingFont = getSavedHeadingFont(wsId);
  const fontMode = getSavedFontMode(wsId);
  const palette = getSavedAppPalette(wsId);
  const surfaceMode = getSavedSurfaceMode(wsId);
  const headingTracking = getSavedHeadingTracking(wsId);
  const bodyTracking = getSavedBodyTracking(wsId);

  applyAppInterfaceFont(font, headingFont, fontMode, wsId);
  applyAppInterfacePalette(palette, surfaceMode, wsId);
  applyAppLetterSpacing(headingTracking, bodyTracking, wsId);
  applyBrandingConfig({}, wsId);
}

let isWorkspaceListenerAttached = false;

export function initAppInterfacePreferences() {
  if (typeof window === 'undefined') return;
  loadAndApplyWorkspaceTheme();

  if (!isWorkspaceListenerAttached) {
    isWorkspaceListenerAttached = true;
    window.addEventListener('active_workspace_changed', (e: Event) => {
      const customEvent = e as CustomEvent<{ workspaceId: string }>;
      const nextWsId = customEvent.detail?.workspaceId || getActiveWorkspaceId();
      loadAndApplyWorkspaceTheme(nextWsId);
    });
  }
}

export type AuthLayoutMode = 'centered' | 'two_column';
export type AuthMediaType = 'single' | 'slideshow';

export interface AuthCustomizationConfig {
  layoutMode: AuthLayoutMode;
  mediaType: AuthMediaType;
  singleImageUrl: string;
  slideshowImages: string[];
  darkOverlay: boolean;
  overlayOpacity: number;
  slideshowIntervalSeconds: number;
}

export const DEFAULT_AUTH_CUSTOMIZATION: AuthCustomizationConfig = {
  layoutMode: 'centered',
  mediaType: 'single',
  singleImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  slideshowImages: [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  ],
  darkOverlay: true,
  overlayOpacity: 50,
  slideshowIntervalSeconds: 5,
};

export function getAuthCustomizationStorageKey(workspaceId?: string): string {
  const wsId = workspaceId || getActiveWorkspaceId();
  if (!wsId || wsId === 'workspace-default') return 'auth_customization';
  return `auth_customization_${wsId}`;
}

export function getSavedAuthCustomization(workspaceId?: string): AuthCustomizationConfig {
  if (typeof window === 'undefined') return DEFAULT_AUTH_CUSTOMIZATION;
  const wsId = workspaceId || getActiveWorkspaceId();
  const key = getAuthCustomizationStorageKey(wsId);
  try {
    const raw =
      localStorage.getItem(key) ||
      localStorage.getItem('auth_customization') ||
      localStorage.getItem('myoffice_auth_customization');
    if (!raw) return DEFAULT_AUTH_CUSTOMIZATION;
    const parsed = JSON.parse(raw);
    if (!parsed.singleImageUrl || parsed.singleImageUrl.includes('jgv8fggrk4lacaroz0tm') || parsed.singleImageUrl.includes('sfrwg8d4echh6aspgiyu')) {
      parsed.singleImageUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
      parsed.mediaType = 'single';
    }
    return { ...DEFAULT_AUTH_CUSTOMIZATION, ...parsed };
  } catch {
    return DEFAULT_AUTH_CUSTOMIZATION;
  }
}

export function saveAuthCustomization(config: Partial<AuthCustomizationConfig>, workspaceId?: string): AuthCustomizationConfig {
  const wsId = workspaceId || getActiveWorkspaceId();
  const current = getSavedAuthCustomization(wsId);
  const updated = { ...current, ...config };
  if (typeof window !== 'undefined') {
    localStorage.setItem(getAuthCustomizationStorageKey(wsId), JSON.stringify(updated));
    window.dispatchEvent(new Event('auth_customization_updated'));
  }
  return updated;
}

const THEME_STORAGE_KEYS = new Set([
  'workspace_palette',
  'workspace_font',
  'workspace_heading_font',
  'workspace_font_mode',
  'workspace_heading_tracking',
  'workspace_body_tracking',
  'workspace_surface_mode',
  'app_branding',
  'theme_mode',
  'ui_theme',
  'theme_schedule_light',
  'theme_schedule_dark',
  'theme_schedule_mode',
  'theme_manual_choice',
  'theme_light_start_time',
  'theme_dark_start_time',
  'site_theme',
  'auth_customization',
  'myoffice_app_palette',
  'myoffice_app_font',
  'myoffice_heading_font',
  'myoffice_font_mode',
  'myoffice_heading_tracking',
  'myoffice_body_tracking',
  'myoffice_surface_mode',
  'myoffice_auth_customization',
  'user_dashboard_preferences',
  'myoffice_user_dashboard_preferences',
  'dashboard_tab',
  'welcome_screen_preference',
  'welcome_screen_layout',
  'welcome_screen_dismissed',
  'checklist_completed_v1',
  'webpages_view_mode',
  'webpages_status_filter',
  'webpages_folder_filter',
  'webpages_custom_folders',
  'media_view_mode',
]);

export function clearNonThemeLocalStorage(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        !THEME_STORAGE_KEYS.has(key) &&
        !key.startsWith('workspace_') &&
        !key.startsWith('app_branding') &&
        !key.startsWith('auth_customization') &&
        !key.startsWith('myoffice_') &&
        !key.startsWith('user_') &&
        !key.startsWith('welcome_') &&
        !key.startsWith('checklist_') &&
        !key.startsWith('dashboard_')
      ) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    return keysToRemove.length;
  } catch (e) {
    console.warn('Failed to clear non-theme localStorage:', e);
    return 0;
  }
}
