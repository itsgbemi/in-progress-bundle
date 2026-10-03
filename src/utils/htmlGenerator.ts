import { WebsiteElement, WebsitePage, WebsiteSection, TableCellItem, TableHeaderItem } from '../types';
import { ALL_FONTS } from '../data/fonts';
import { generateFullJsonSchema } from '../components/SchemaFormFields';
import { getBrandInfo } from '../services/brandInfoService';
import { getWebsiteConfig, PaletteConfig, getEffectiveDomainUrl } from '../services/websiteConfigService';

export const getHamburgerSvg = (
  style?: string,
  size = 20,
  thickness: number = 2,
  gap: number = 5
) => {
  const strokeW = typeof thickness === 'number' ? thickness : 2;
  const g = typeof gap === 'number' ? Math.min(10, Math.max(2, gap)) : 5;
  const topY3 = Math.max(4, 12 - g);
  const midY3 = 12;
  const botY3 = Math.min(20, 12 + g);

  const topY2 = Math.max(4, 12 - Math.max(3, Math.round(g * 0.9)));
  const botY2 = Math.min(20, 12 + Math.max(3, Math.round(g * 0.9)));

  switch (style) {
    case 'three-asc-left':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round"><line x1="4" y1="${topY3}" x2="11" y2="${topY3}"/><line x1="4" y1="${midY3}" x2="16" y2="${midY3}"/><line x1="4" y1="${botY3}" x2="20" y2="${botY3}"/></svg>`;
    case 'three-asc-center':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round"><line x1="8.5" y1="${topY3}" x2="15.5" y2="${topY3}"/><line x1="6" y1="${midY3}" x2="18" y2="${midY3}"/><line x1="4" y1="${botY3}" x2="20" y2="${botY3}"/></svg>`;
    case 'three-asc-right':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round"><line x1="13" y1="${topY3}" x2="20" y2="${topY3}"/><line x1="8" y1="${midY3}" x2="20" y2="${midY3}"/><line x1="4" y1="${botY3}" x2="20" y2="${botY3}"/></svg>`;
    case 'three-desc-left':
    case 'staggered':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round"><line x1="4" y1="${topY3}" x2="20" y2="${topY3}"/><line x1="4" y1="${midY3}" x2="16" y2="${midY3}"/><line x1="4" y1="${botY3}" x2="11" y2="${botY3}"/></svg>`;
    case 'three-desc-center':
    case 'staggered-center':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round"><line x1="4" y1="${topY3}" x2="20" y2="${topY3}"/><line x1="6" y1="${midY3}" x2="18" y2="${midY3}"/><line x1="8.5" y1="${botY3}" x2="15.5" y2="${botY3}"/></svg>`;
    case 'three-desc-right':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round"><line x1="4" y1="${topY3}" x2="20" y2="${topY3}"/><line x1="8" y1="${midY3}" x2="20" y2="${midY3}"/><line x1="13" y1="${botY3}" x2="20" y2="${botY3}"/></svg>`;

    case 'two-equal':
    case 'minimal':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round"><line x1="4" y1="${topY2}" x2="20" y2="${topY2}"/><line x1="4" y1="${botY2}" x2="20" y2="${botY2}"/></svg>`;
    case 'two-asc-left':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round"><line x1="4" y1="${topY2}" x2="12" y2="${topY2}"/><line x1="4" y1="${botY2}" x2="20" y2="${botY2}"/></svg>`;
    case 'two-asc-center':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round"><line x1="8" y1="${topY2}" x2="16" y2="${topY2}"/><line x1="4" y1="${botY2}" x2="20" y2="${botY2}"/></svg>`;
    case 'two-asc-right':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round"><line x1="12" y1="${topY2}" x2="20" y2="${topY2}"/><line x1="4" y1="${botY2}" x2="20" y2="${botY2}"/></svg>`;
    case 'two-desc-left':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round"><line x1="4" y1="${topY2}" x2="20" y2="${topY2}"/><line x1="4" y1="${botY2}" x2="12" y2="${botY2}"/></svg>`;
    case 'two-desc-center':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round"><line x1="4" y1="${topY2}" x2="20" y2="${topY2}"/><line x1="8" y1="${botY2}" x2="16" y2="${botY2}"/></svg>`;
    case 'two-desc-right':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round"><line x1="4" y1="${topY2}" x2="20" y2="${topY2}"/><line x1="12" y1="${botY2}" x2="20" y2="${botY2}"/></svg>`;

    case 'dots': {
      const dotR = Math.max(1.8, Math.min(3.2, strokeW * 0.9));
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="${topY3}" r="${dotR}"/><circle cx="12" cy="12" r="${dotR}"/><circle cx="12" cy="${botY3}" r="${dotR}"/></svg>`;
    }
    case 'grid':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor"><circle cx="6" cy="6" r="1.7"/><circle cx="12" cy="6" r="1.7"/><circle cx="18" cy="6" r="1.7"/><circle cx="6" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="18" cy="12" r="1.7"/><circle cx="6" cy="18" r="1.7"/><circle cx="12" cy="18" r="1.7"/><circle cx="18" cy="18" r="1.7"/></svg>`;
    case 'plus':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
    case 'arrow':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><polyline points="13 5 20 12 13 19"/></svg>`;
    case 'diamond':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round"><polygon points="12,3 21,12 12,21 3,12"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`;
    case 'sidebar':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></svg>`;

    case 'three-equal':
    case 'thick':
    case 'standard':
    default:
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round"><line x1="4" y1="${topY3}" x2="20" y2="${topY3}"/><line x1="4" y1="${midY3}" x2="20" y2="${midY3}"/><line x1="4" y1="${botY3}" x2="20" y2="${botY3}"/></svg>`;
  }
};

export const getCloseSvg = (style?: string, size = 20, thickness = 2) => {
  switch (style) {
    case 'circle':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${thickness}" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>`;
    case 'minimal':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${Math.max(1, thickness * 0.75)}" stroke-linecap="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>`;
    case 'bold':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${Math.max(3, thickness * 1.5)}" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>`;
    case 'arrow':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${thickness}" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`;
    case 'chevron':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${thickness}" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
    case 'sidebar':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${thickness}" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></svg>`;
    case 'square':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${thickness}" stroke-linecap="round"><rect x="4" y="4" width="16" height="16" rx="3"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>`;
    case 'standard':
    default:
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${thickness}" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>`;
  }
};

export function cleanRedundantNestedSpansFromHtml(html: string): string {
  if (!html || typeof document === 'undefined') return html;

  if (/<!doctype\s+html|<html[\s>]/i.test(html)) {
    return html;
  }
  try {
    const div = document.createElement('div');
    div.innerHTML = html;

    let changed = true;
    let iterations = 0;
    while (changed && iterations < 10) {
      changed = false;
      iterations++;
      const spans = Array.from(div.querySelectorAll('span'));
      for (const span of spans) {
        if (!span.parentNode) continue;

        span.removeAttribute('data-dec-type');
        span.removeAttribute('data-editable-id');

        const style = span.getAttribute('style')?.trim();
        const className = span.getAttribute('class')?.trim();

        if (!style && !className) {
          while (span.firstChild) {
            span.parentNode.insertBefore(span.firstChild, span);
          }
          span.parentNode.removeChild(span);
          changed = true;
          continue;
        }

        if (span.childNodes.length === 1) {
          const child = span.firstChild;
          if (child && child.nodeType === Node.ELEMENT_NODE && (child as HTMLElement).tagName === 'SPAN') {
            const childSpan = child as HTMLElement;

            for (let i = 0; i < childSpan.style.length; i++) {
              const prop = childSpan.style[i];
              const val = childSpan.style.getPropertyValue(prop);
              const prio = childSpan.style.getPropertyPriority(prop);
              if (val) {
                span.style.setProperty(prop, val, prio);
              }
            }
            if (childSpan.className && !span.className) {
              span.className = childSpan.className;
            } else if (childSpan.className && span.className) {
              span.className = `${span.className} ${childSpan.className}`;
            }
            while (childSpan.firstChild) {
              span.insertBefore(childSpan.firstChild, childSpan);
            }
            span.removeChild(childSpan);
            changed = true;
          }
        }
      }
    }

    return div.innerHTML;
  } catch {
    return html;
  }
}

export function cleanExportedFontFamilyQuotes(html: string): string {
  if (!html) return '';
  const converted = html
    .replace(/\bmark\s*\{[^}]*\}\s*/gi, '')
    .replace(/<u\b[^>]*>(.*?)<\/u>/gi, '<span style="text-decoration-line: underline;">$1</span>')
    .replace(/<s\b[^>]*>(.*?)<\/s>/gi, '<span style="text-decoration-line: line-through;">$1</span>')
    .replace(/<strike\b[^>]*>(.*?)<\/strike>/gi, '<span style="text-decoration-line: line-through;">$1</span>')
    .replace(/<del\b[^>]*>(.*?)<\/del>/gi, '<span style="text-decoration-line: line-through;">$1</span>');

  const cleanedFonts = converted
    .replace(/font-family:\s*&quot;([^&"]+?)&quot;/gi, "font-family: '$1'")
    .replace(/font-family:\s*\\"([^\\"]+?)\\"/gi, "font-family: '$1'")
    .replace(/font-family:\s*"([^"]+?)"/gi, "font-family: '$1'")
    .replace(/font-family:\s*&apos;([^&]+?)&apos;/gi, "font-family: '$1'")
    .replace(/font-family:\s*([^;"]+?)(;?)/gi, (_match, fontVal, semi) => {
      const cleaned = fontVal
        .replace(/&quot;/g, "'")
        .replace(/\\"/g, "'")
        .replace(/"/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/''+/g, "'");
      return `font-family: ${cleaned}${semi}`;
    });

  if (/<!doctype\s+html|<html[\s>]/i.test(cleanedFonts)) {
    return cleanedFonts;
  }

  return cleanRedundantNestedSpansFromHtml(cleanedFonts);
}

export function getExportedIconHtml(iconName: string | undefined, iconSize = 24, extraStyle = ''): string {
  if (!iconName) return '';
  const trimmed = iconName.trim();

  if (trimmed.toLowerCase().includes('<svg')) {
    let svgStr = trimmed;
    svgStr = svgStr.replace(/fill="(#000000|#000|black)"/gi, 'fill="currentColor"');
    svgStr = svgStr.replace(/stroke="(#000000|#000|black)"/gi, 'stroke="currentColor"');
    if (!/width=/i.test(svgStr)) {
      svgStr = svgStr.replace(/<svg/i, `<svg width="${iconSize}" height="${iconSize}"`);
    }
    return `<span class="icon-svg" style="display: inline-flex; align-items: center; justify-content: center; width: ${iconSize}px; height: ${iconSize}px; color: inherit; ${extraStyle}">${svgStr}</span>`;
  }

  if (trimmed.startsWith('emoji:')) {
    return `<span style="font-size: ${iconSize}px; ${extraStyle}">${trimmed.replace(/^emoji:/, '')}</span>`;
  }
  if (trimmed.startsWith('unicode:')) {
    return `<span style="font-size: ${iconSize}px; ${extraStyle}">${trimmed.replace(/^unicode:/, '')}</span>`;
  }
  if (trimmed.length <= 6 && !/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return `<span style="font-size: ${iconSize}px; ${extraStyle}">${trimmed}</span>`;
  }

  const isFaPrefix = trimmed.startsWith('fa-') || trimmed.startsWith('fa:') || trimmed.startsWith('fa-brands ') || trimmed.startsWith('fa-solid ');
  let clean = trimmed.replace(/^fa:/, 'fa-').replace(/^fa-brands\s+/, '').replace(/^fa-solid\s+/, '');

  const isBrand = /fa-?(github|twitter|x-twitter|facebook|instagram|linkedin|youtube|google|discord|tiktok|spotify|apple)/.test(clean) || trimmed.includes('fa-brands');

  const colorInherit = extraStyle.includes('color:') ? '' : 'color: inherit;';

  if (isFaPrefix || clean.startsWith('fa-')) {
    const prefix = isBrand ? 'fa-brands' : 'fa-solid';
    const faClass = clean.startsWith('fa-') ? clean : `fa-${clean}`;
    return `<i class="${prefix} ${faClass}" style="font-size: ${iconSize}px; ${colorInherit} ${extraStyle}"></i>`;
  }

  const knownFaBrandMap: Record<string, string> = {
    github: 'fa-brands fa-github',
    twitter: 'fa-brands fa-twitter',
    facebook: 'fa-brands fa-facebook',
    instagram: 'fa-brands fa-instagram',
    linkedin: 'fa-brands fa-linkedin',
    youtube: 'fa-brands fa-youtube',
    discord: 'fa-brands fa-discord',
    spotify: 'fa-brands fa-spotify',
    tiktok: 'fa-brands fa-tiktok',
    google: 'fa-brands fa-google',
    apple: 'fa-brands fa-apple',
  };

  const knownFaSolidMap: Record<string, string> = {
    star: 'fa-solid fa-star',
    heart: 'fa-solid fa-heart',
    flame: 'fa-solid fa-fire',
    fire: 'fa-solid fa-fire',
    bolt: 'fa-solid fa-bolt',
    zap: 'fa-solid fa-bolt',
    rocket: 'fa-solid fa-rocket',
    sparkles: 'fa-solid fa-wand-magic-sparkles',
    mail: 'fa-solid fa-envelope',
    email: 'fa-solid fa-envelope',
    phone: 'fa-solid fa-phone',
    check: 'fa-solid fa-check',
    'arrow-right': 'fa-solid fa-arrow-right',
    arrow: 'fa-solid fa-arrow-right',
    globe: 'fa-solid fa-globe',
    user: 'fa-solid fa-user',
    lock: 'fa-solid fa-lock',
    search: 'fa-solid fa-magnifying-glass',
    shield: 'fa-solid fa-shield-halved',
    'shield-check': 'fa-solid fa-shield-halved',
  };

  const lower = clean.toLowerCase();
  if (knownFaBrandMap[lower]) {
    return `<i class="${knownFaBrandMap[lower]}" style="font-size: ${iconSize}px; ${colorInherit} ${extraStyle}"></i>`;
  }
  if (knownFaSolidMap[lower]) {
    return `<i class="${knownFaSolidMap[lower]}" style="font-size: ${iconSize}px; ${colorInherit} ${extraStyle}"></i>`;
  }

  return `<i class="fa-solid fa-${lower}" style="font-size: ${iconSize}px; ${colorInherit} ${extraStyle}"></i>`;
}

function styleObjectToCss(element: WebsiteElement): string {
  const s = element.styles || {};
  const cssParts: string[] = [];

  if (s.typeface) {
    cssParts.push(`font-family: '${s.typeface}', sans-serif`);
  }
  if (s.fontWeight) {
    cssParts.push(`font-weight: ${s.fontWeight}`);
  }
  if (s.fontSize) {
    let pxVal: string;
    if (typeof s.fontSize === 'number') {
      pxVal = s.fontSize <= 5 ? `${Math.round(s.fontSize * 16)}px` : `${s.fontSize}px`;
    } else if (typeof s.fontSize === 'string') {
      if (s.fontSize.endsWith('rem')) {
        pxVal = `${Math.round((parseFloat(s.fontSize) || 1) * 16)}px`;
      } else if (s.fontSize.endsWith('px')) {
        pxVal = s.fontSize;
      } else if (!isNaN(Number(s.fontSize))) {
        const num = Number(s.fontSize);
        pxVal = num <= 5 ? `${Math.round(num * 16)}px` : `${num}px`;
      } else {
        pxVal = s.fontSize;
      }
    } else {
      pxVal = `${s.fontSize}px`;
    }
    cssParts.push(`font-size: ${pxVal}`);
  }
  if (s.textColor) {
    const alpha = (s.textColorOpacity !== undefined ? s.textColorOpacity : 100) / 100;
    if (alpha < 1 && s.textColor.startsWith('#')) {
      let hex = s.textColor.slice(1);
      if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
      if (hex.length >= 6) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        cssParts.push(`color: rgba(${r}, ${g}, ${b}, ${alpha})`);
      } else {
        cssParts.push(`color: ${s.textColor}`);
      }
    } else {
      cssParts.push(`color: ${s.textColor}`);
    }
  }
  const decLine = s.textDecorationLine || (s.textDecoration && s.textDecoration !== 'none' ? s.textDecoration : undefined);
  if (decLine) {
    cssParts.push(`text-decoration-line: ${decLine}`);
  }
  const effectiveDecStyle = s.underlineStyle || s.overlineStyle || s.strikethroughStyle || s.textDecorationStyle;
  if (effectiveDecStyle) {
    cssParts.push(`text-decoration-style: ${effectiveDecStyle}`);
  }
  const effectiveThickness = s.underlineThickness ?? s.overlineThickness ?? s.strikethroughThickness ?? s.textDecorationThickness;
  if (effectiveThickness !== undefined) {
    cssParts.push(`text-decoration-thickness: ${typeof effectiveThickness === 'number' ? `${effectiveThickness}px` : effectiveThickness}`);
  }
  const effectiveDecColor = s.underlineColor || s.overlineColor || s.strikethroughColor || s.textDecorationColor;
  if (effectiveDecColor) {
    cssParts.push(`text-decoration-color: ${effectiveDecColor}`);
  }
  const effectiveOffset = s.underlineOffset ?? s.overlineOffset ?? s.textUnderlineOffset;
  if (effectiveOffset !== undefined) {
    cssParts.push(`text-underline-offset: ${typeof effectiveOffset === 'number' ? `${effectiveOffset}px` : effectiveOffset}`);
  }
  const effectiveSkipInk = s.underlineSkipInk || s.overlineSkipInk || s.strikethroughSkipInk || s.textDecorationSkipInk;
  if (effectiveSkipInk) {
    cssParts.push(`text-decoration-skip-ink: ${effectiveSkipInk}`);
  }
  const bgType = s.backgroundType || (
    s.backgroundImage && !s.backgroundImage.includes('gradient')
      ? 'image'
      : s.backgroundGradient || (s.backgroundImage && s.backgroundImage.includes('gradient'))
      ? 'gradient'
      : s.backgroundColor && s.backgroundColor !== 'transparent'
      ? 'solid'
      : undefined
  );

  if (bgType === 'image' && s.backgroundImage && !s.backgroundImage.includes('gradient')) {
    let overlayGrad: string | undefined = undefined;
    const overlay = s.backgroundOverlay;

    if (overlay === 'dark') {
      overlayGrad = 'linear-gradient(to bottom, rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.65))';
    } else if (overlay === 'light') {
      overlayGrad = 'linear-gradient(to bottom, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.65))';
    } else if (overlay === 'gradient') {
      overlayGrad = 'linear-gradient(135deg, rgba(79, 70, 229, 0.45) 0%, rgba(6, 182, 212, 0.45) 100%)';
    } else if (overlay && overlay !== 'none') {
      overlayGrad = overlay;
    }

    const bgVal = overlayGrad ? `${overlayGrad}, url('${s.backgroundImage}')` : `url('${s.backgroundImage}')`;
    cssParts.push(`background-image: ${bgVal}`);
    cssParts.push(`background-size: ${s.backgroundSize || 'cover'}`);
    cssParts.push(`background-position: ${s.backgroundPosition || 'center'}`);
    cssParts.push(`background-repeat: ${s.backgroundRepeat || 'no-repeat'}`);
  } else if (bgType === 'gradient' || (s.backgroundGradient && !s.backgroundType)) {
    const grad = s.backgroundGradient || `linear-gradient(${s.gradientAngle || 135}deg, ${s.gradientFrom || '#4f46e5'} 0%, ${s.gradientTo || '#06b6d4'} 100%)`;
    cssParts.push(`background-image: ${grad}`);
  } else if (s.backgroundType === 'solid' && s.backgroundColor) {
    cssParts.push(`background-color: ${s.backgroundColor}`);
  } else if (s.backgroundType === 'transparent') {
    cssParts.push(`background-color: transparent`);
  } else if (s.backgroundColor) {
    cssParts.push(`background-color: ${s.backgroundColor}`);
  }
  if (s.borderColor) {
    cssParts.push(`border-color: ${s.borderColor}`);
  }
  if (s.borderWidth !== undefined) {
    cssParts.push(`border-width: ${s.borderWidth}px`);
    cssParts.push(`border-style: ${s.borderStyle || 'solid'}`);
  } else if (s.borderStyle && s.borderStyle !== 'none') {
    cssParts.push(`border-style: ${s.borderStyle}`);
  }
  if (s.borderRadius !== undefined) {
    cssParts.push(`border-radius: ${s.borderRadius}px`);
  }
  if (s.boxShadow) {
    cssParts.push(`box-shadow: ${s.boxShadow}`);
  } else if (s.customGlow) {
    cssParts.push(`box-shadow: ${s.customGlow}`);
  }
  if (s.gradientText || s.textGradient) {
    const grad =
      s.textGradient ||
      `linear-gradient(${s.gradientAngle || 135}deg, ${s.gradientFrom || '#4f46e5'} 0%, ${s.gradientTo || '#06b6d4'} 100%)`;
    cssParts.push(`background-image: ${grad}`);
    cssParts.push(`-webkit-background-clip: text`);
    cssParts.push(`background-clip: text`);
    cssParts.push(`-webkit-text-fill-color: transparent`);
    cssParts.push(`color: transparent`);
    cssParts.push(`display: inline-block`);
  }
  if (s.textAlign) {
    cssParts.push(`text-align: ${s.textAlign}`);
  }
  if (s.alignItems) {
    const val = s.alignItems === 'top' || s.alignItems === 'flex-start' ? 'flex-start' : s.alignItems === 'bottom' || s.alignItems === 'flex-end' ? 'flex-end' : s.alignItems;
    cssParts.push(`align-items: ${val}`);
  }
  if (s.alignSelf) {
    const val = s.alignSelf === 'top' || s.alignSelf === 'flex-start' ? 'flex-start' : s.alignSelf === 'bottom' || s.alignSelf === 'flex-end' ? 'flex-end' : s.alignSelf;
    cssParts.push(`align-self: ${val}`);
  }
  if (s.justifyContent) {
    cssParts.push(`justify-content: ${s.justifyContent}`);
  }
  if (s.verticalAlign) {
    cssParts.push(`vertical-align: ${s.verticalAlign}`);
  }
  if (s.paddingY !== undefined || s.paddingX !== undefined || s.paddingTop !== undefined || s.paddingBottom !== undefined || s.paddingLeft !== undefined || s.paddingRight !== undefined || s.padding !== undefined) {
    if (s.padding !== undefined) {
      cssParts.push(`padding: ${typeof s.padding === 'number' ? `${s.padding}px` : s.padding}`);
    } else {
      const pt = s.paddingTop ?? s.paddingY ?? 0;
      const pb = s.paddingBottom ?? s.paddingY ?? 0;
      const pl = s.paddingLeft ?? s.paddingX ?? 0;
      const pr = s.paddingRight ?? s.paddingX ?? 0;
      cssParts.push(`padding: ${pt}px ${pr}px ${pb}px ${pl}px`);
    }
  }
  if (s.marginY !== undefined || s.marginX !== undefined || s.marginTop !== undefined || s.marginBottom !== undefined || s.marginLeft !== undefined || s.marginRight !== undefined || s.margin !== undefined) {
    if (s.margin !== undefined) {
      cssParts.push(`margin: ${typeof s.margin === 'number' ? `${s.margin}px` : s.margin}`);
    } else {
      const mt = s.marginTop ?? s.marginY ?? 0;
      const mb = s.marginBottom ?? s.marginY ?? 0;
      const ml = s.marginLeft ?? s.marginX ?? 0;
      const mr = s.marginRight ?? s.marginX ?? 0;
      cssParts.push(`margin: ${mt}px ${mr}px ${mb}px ${ml}px`);
    }
  }
  if (s.letterSpacing !== undefined && s.letterSpacing !== 0) {
    cssParts.push(`letter-spacing: ${s.letterSpacing}em`);
  }
  if (s.wordSpacing !== undefined && s.wordSpacing !== 0) {
    cssParts.push(`word-spacing: ${s.wordSpacing}px`);
  }
  if (s.lineHeight !== undefined) {
    cssParts.push(`line-height: ${s.lineHeight}`);
  }
  if (s.width) {
    cssParts.push(`width: ${typeof s.width === 'number' ? `${s.width}px` : s.width}`);
  }
  if (s.display) {
    cssParts.push(`display: ${s.display}`);
  }
  if (s.float && s.float !== 'none') {
    cssParts.push(`float: ${s.float}`);
  }
  if (s.shapeOutside && s.shapeOutside !== 'none') {
    cssParts.push(`shape-outside: ${s.shapeOutside}`);
  }
  if (s.gap !== undefined) {
    cssParts.push(`gap: ${s.gap}px`);
  }
  if (s.height) {
    const hVal = typeof s.height === 'number' ? `${s.height}px` : s.height;
    cssParts.push(`height: ${hVal}`);
    if (typeof hVal === 'string' && hVal.endsWith('%')) {
      const pct = parseFloat(hVal);
      cssParts.push(`max-height: ${pct * 6}px`);
    }
  }
  if (s.aspectRatio && s.aspectRatio !== 'auto') {
    cssParts.push(`aspect-ratio: ${s.aspectRatio}`);
  }
  if (s.objectPosition && s.objectPosition !== 'center center') {
    cssParts.push(`object-position: ${s.objectPosition}`);
  }

  const rotation = s.rotation || 0;
  const flipH = s.flipHorizontal ? -1 : 1;
  const flipV = s.flipVertical ? -1 : 1;
  const cropZoom = s.cropZoom || 100;
  const cropPanX = s.cropPanX || 0;
  const cropPanY = s.cropPanY || 0;

  const transformParts = [
    rotation !== 0 ? `rotate(${rotation}deg)` : '',
    flipH !== 1 ? `scaleX(${flipH})` : '',
    flipV !== 1 ? `scaleY(${flipV})` : '',
    (cropZoom !== 100 || cropPanX !== 0 || cropPanY !== 0) ? `scale(${cropZoom / 100}) translate(${cropPanX}px, ${cropPanY}px)` : '',
  ].filter(Boolean).join(' ');

  if (transformParts) {
    cssParts.push(`transform: ${transformParts}`);
    cssParts.push(`transform-origin: center center`);
  }

  return cssParts.join('; ');
}

function renderElementToHtml(element: WebsiteElement, indent = '      ', shouldGroupForm = true, isLight = false): string {
  if (element.hidden) return '';
  const s = element.styles || {};
  const isHideMobile = Boolean(element.hideOnMobile || s.hideOnMobile);
  const isHideTablet = Boolean(element.hideOnTablet || s.hideOnTablet);
  const isHideDesktop = Boolean(element.hideOnDesktop || s.hideOnDesktop);
  const respClasses = [
    isHideMobile ? 'hide-on-mobile' : '',
    isHideTablet ? 'hide-on-tablet' : '',
    isHideDesktop ? 'hide-on-desktop' : '',
  ].filter(Boolean).join(' ');

  const content = renderElementInnerHtml(element, indent, shouldGroupForm, isLight);
  if (!content) return '';
  if (respClasses) {
    return `${indent}<div class="${respClasses}" style="display: contents;">\n${content}\n${indent}</div>`;
  }
  return content;
}

function renderElementInnerHtml(element: WebsiteElement, indent = '      ', shouldGroupForm = true, isLight = false): string {
  const s = element.styles || {};
  const inlineCss = styleObjectToCss(element);
  const styleAttr = inlineCss ? ` style="${inlineCss}"` : '';

  switch (element.type) {
    case 'logo': {
      if (element.logoType === 'image') {
        const altAttr = element.alt ? ` alt="${element.alt}"` : '';
        const titleAttr = element.title ? ` title="${element.title}"` : '';
        const imgStyles = `height: 40px; width: auto; max-height: 100%; display: block; ${inlineCss}`;
        return `${indent}<a href="#" style="display: inline-block; text-decoration: none; color: inherit;"${titleAttr}>\n${indent}  <img src="${element.src || ''}"${altAttr}${titleAttr} style="${imgStyles}" />\n${indent}</a>`;
      } else {
        const titleAttr = element.title ? ` title="${element.title}"` : '';
        const textStyles = `font-size: 20px; font-weight: bold; letter-spacing: -0.5px; text-decoration: none; color: inherit; display: inline-block; ${inlineCss}`;
        return `${indent}<a href="#" style="${textStyles}"${titleAttr}>${element.content || 'BRAND'}</a>`;
      }
    }

    case 'heading': {
      const tag = element.tag || 'h2';
      const rawText = element.content || element.text || (element as any).title || (element as any).heading || (element as any).label || '';
      let content = cleanRedundantNestedSpansFromHtml(rawText);
      if ((tag === 'ul' || tag === 'ol') && !content.includes('<li>')) {
        const rawLines = content.replace(/<[^>]*>/g, '').split('\n').filter(Boolean);
        if (rawLines.length > 0) {
          content = rawLines.map((line) => `<li style="margin-bottom: 6px; line-height: 1.6;">${line.trim()}</li>`).join('\n' + indent + '  ');
          const listType = tag === 'ul' ? 'disc' : 'decimal';
          return `${indent}<${tag} style="list-style-type: ${listType}; padding-left: 24px; margin: 12px 0; ${inlineCss}">\n${indent}  ${content}\n${indent}</${tag}>`;
        }
      }
      return `${indent}<${tag}${styleAttr}>${content}</${tag}>`;
    }

    case 'text': {
      const tag = element.tag || 'p';
      const rawText = element.content || element.text || (element as any).description || (element as any).paragraph || (element as any).bodyText || (element as any).body || (element as any).subtitle || (element as any).value || (element as any).label || '';
      let content = cleanRedundantNestedSpansFromHtml(rawText);
      if ((tag === 'ul' || tag === 'ol') && !content.includes('<li>')) {
        const rawLines = content.replace(/<[^>]*>/g, '').split('\n').filter(Boolean);
        if (rawLines.length > 0) {
          content = rawLines.map((line) => `<li style="margin-bottom: 6px; line-height: 1.6;">${line.trim()}</li>`).join('\n' + indent + '  ');
          const listType = tag === 'ul' ? 'disc' : 'decimal';
          return `${indent}<${tag} style="list-style-type: ${listType}; padding-left: 24px; margin: 12px 0; ${inlineCss}">\n${indent}  ${content}\n${indent}</${tag}>`;
        }
      }
      if (tag === 'ul' || tag === 'ol') {
        const listType = tag === 'ul' ? 'disc' : 'decimal';
        return `${indent}<${tag} style="list-style-type: ${listType}; padding-left: 24px; margin: 12px 0; ${inlineCss}">\n${indent}  ${content}\n${indent}</${tag}>`;
      }
      return `${indent}<${tag}${styleAttr}>${content}</${tag}>`;
    }

    case 'list': {
      const isOrdered = element.listMarkerStyle === 'numbers' || element.listMarkerStyle === 'alpha' || element.listMarkerStyle === 'roman' || element.tag === 'ol';
      const markerType = element.listMarkerStyle || (element.tag === 'ol' ? 'numbers' : 'bullet');
      const iconColor = element.listIconColor || s.color || (isLight ? '#4f46e5' : '#818cf8');
      const gapVal = element.listSpacing !== undefined ? element.listSpacing : (s.gap !== undefined ? s.gap : 10);
      const items = element.listItems || ['First list item', 'Second list item', 'Third list item'];

      if (isOrdered) {
        const listStyleType = markerType === 'alpha' ? 'lower-alpha' : markerType === 'roman' ? 'lower-roman' : 'decimal';
        const itemsHtml = items
          .map((item) => `${indent}  <li style="margin-bottom: 6px; line-height: 1.6; color: inherit;">${item}</li>`)
          .join('\n');
        return `${indent}<ol style="list-style-type: ${listStyleType}; padding-left: 24px; margin: 12px 0; color: inherit; ${inlineCss}">\n${itemsHtml}\n${indent}</ol>`;
      }

      const markerMap: Record<string, string> = {
        bullet: '•',
        circle: '○',
        square: '■',
        checklist: '✓',
        'checklist-empty': '☐',
        arrow: '→',
        star: '★',
        plus: '+',
        dash: '—',
      };
      const symbol = markerMap[markerType] || '•';

      const itemsHtml = items
        .map((item, idx) => {
          const isChecked = element.listCheckedState?.[idx] ?? (markerType === 'checklist');
          let markerElement = `<span style="color: ${iconColor}; font-weight: bold; flex-shrink: 0; min-width: 16px; text-align: center;">${symbol}</span>`;
          if (markerType === 'checklist' || markerType === 'checklist-empty') {
            markerElement = isChecked
              ? `<span style="display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; border-radius: 4px; background-color: #4f46e5; color: #ffffff; font-size: 11px; font-weight: bold; flex-shrink: 0;">✓</span>`
              : `<span style="display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; border-radius: 4px; border: 1px solid ${isLight ? '#94a3b8' : '#64748b'}; background-color: ${isLight ? '#ffffff' : '#1e293b'}; flex-shrink: 0;"></span>`;
          }
          return `${indent}  <li style="display: flex; align-items: center; gap: 10px; line-height: 1.6; color: inherit;">${markerElement} <span>${item}</span></li>`;
        })
        .join('\n');
      return `${indent}<ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: ${gapVal}px; color: inherit; ${inlineCss}">\n${itemsHtml}\n${indent}</ul>`;
    }

    case 'accordion': {
      const items = element.accordionItems || [
        { title: 'Question 1', content: 'Detailed answer or guidelines for the first question.' },
        { title: 'Question 2', content: 'Detailed answer or guidelines for the second question.' }
      ];
      const iconStyle = element.accordionIconStyle || 'chevron';
      const itemBg = element.accordionItemBg || (isLight ? '#ffffff' : '#1e293b');
      const itemBorderColor = element.accordionItemBorderColor || (isLight ? '#e2e8f0' : '#334155');
      const borderRadius = s.borderRadius !== undefined ? s.borderRadius : 12;
      const gapVal = s.gap !== undefined ? s.gap : 10;

      const accHtml = items
        .map((item, idx) => {
          const openAttr = item.isOpen ? ' open' : '';
          const tStyles = item.titleStyles || {};
          const cStyles = item.contentStyles || {};
          const titleStyleParts: string[] = [];
          if (tStyles.typeface) titleStyleParts.push(`font-family: '${tStyles.typeface}', sans-serif`);
          if (tStyles.fontWeight) titleStyleParts.push(`font-weight: ${tStyles.fontWeight}`);
          if (tStyles.fontSize) titleStyleParts.push(`font-size: ${typeof tStyles.fontSize === 'number' ? `${tStyles.fontSize}px` : tStyles.fontSize}`);
          if (tStyles.textColor || tStyles.color) titleStyleParts.push(`color: ${tStyles.textColor || tStyles.color}`);
          const titleStyleAttr = titleStyleParts.length ? ` style="${titleStyleParts.join('; ')}"` : '';

          const contentStyleParts: string[] = [];
          if (cStyles.typeface) contentStyleParts.push(`font-family: '${cStyles.typeface}', sans-serif`);
          if (cStyles.fontWeight) contentStyleParts.push(`font-weight: ${cStyles.fontWeight}`);
          if (cStyles.fontSize) contentStyleParts.push(`font-size: ${typeof cStyles.fontSize === 'number' ? `${cStyles.fontSize}px` : cStyles.fontSize}`);
          if (cStyles.textColor || cStyles.color) contentStyleParts.push(`color: ${cStyles.textColor || cStyles.color}`);
          const contentStyleAttr = contentStyleParts.length ? ` style="${contentStyleParts.join('; ')}"` : '';

          const iconMarkup = (iconStyle as string) === 'plus' || iconStyle === 'plus-minus'
            ? `<span style="font-size: 16px; font-weight: bold; line-height: 1;">+</span>`
            : iconStyle === 'arrow'
            ? `<span style="font-size: 14px; line-height: 1;">→</span>`
            : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s;"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

          const itemColor = isLight ? '#0f172a' : '#f8fafc';

          return `${indent}  <details style="border: 1px solid ${itemBorderColor}; border-radius: ${borderRadius}px; background-color: ${itemBg}; color: ${itemColor}; overflow: hidden; margin-bottom: 0px; transition: all 0.2s ease;"${openAttr}>\n${indent}    <summary style="padding: 16px 20px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: space-between; user-select: none;"><span${titleStyleAttr}>${item.title || `Item ${idx + 1}`}</span> ${iconMarkup}</summary>\n${indent}    <div style="padding: 0 20px 20px 20px; border-top: 1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255, 255, 255, 0.06)'}; font-size: 15px; line-height: 1.6; opacity: 0.9;"${contentStyleAttr}>\n${indent}      <p style="margin: 0; margin-top: 12px;">${item.content || ''}</p>\n${indent}    </div>\n${indent}  </details>`;
        })
        .join('\n');
      return `${indent}<div style="display: flex; flex-direction: column; gap: ${gapVal}px; width: 100%; ${inlineCss}">\n${accHtml}\n${indent}</div>`;
    }

    case 'badge': {
      const defaultBadgeBg = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.1)';
      const defaultBadgeColor = isLight ? '#0f172a' : '#f8fafc';
      const badgeStyles = [
        'display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 14px; font-weight: 500;',
        `background-color: ${s.backgroundColor || defaultBadgeBg};`,
        `color: ${s.textColor || s.color || defaultBadgeColor};`,
        inlineCss
      ].filter(Boolean).join(' ');
      return `${indent}<span style="${badgeStyles}">${element.content || ''}</span>`;
    }

    case 'button': {
      const isDarkModeToggle = element.buttonActionType === 'toggle-dark-mode' || element.buttonActionType === 'dark-mode';
      const href = isDarkModeToggle ? 'javascript:void(0)' : (element.href || '#');
      const targetAttr = (!isDarkModeToggle && element.target) ? ` target="${element.target}"` : '';
      const relAttr = (!isDarkModeToggle && element.target === '_blank') ? ' rel="noopener noreferrer"' : '';
      const actionAttr = isDarkModeToggle ? ' onclick="if(window.toggleSiteTheme){window.toggleSiteTheme();}else{var isDark=document.documentElement.classList.toggle(\'dark\');document.documentElement.setAttribute(\'data-theme\', isDark?\'dark\':\'light\');}" data-action="toggle-dark-mode"' : '';
      const dMode = element.buttonDisplayMode || 'icon-text';
      const showIcon = dMode === 'icon' || dMode === 'icon-text';
      const showText = dMode === 'text' || dMode === 'icon-text';
      const isIconLeft = (element.buttonIconPosition || element.iconPosition) !== 'right';
      const iconName = element.buttonIcon || element.icon || (isDarkModeToggle ? 'moon' : 'arrow-right');

      let iconHtml = '';
      if (showIcon && iconName) {
        const spacingStyle = isIconLeft && showText ? 'margin-right: 8px;' : !isIconLeft && showText ? 'margin-left: 8px;' : '';
        const svgStr = getExportedIconHtml(iconName, 16, spacingStyle);
        iconHtml = `<span style="display: inline-flex; align-items: center; justify-content: center;">${svgStr}</span>`;
      }

      const textHtml = showText ? `<span>${element.content || (isDarkModeToggle ? 'Toggle Theme' : 'Click Me')}</span>` : '';
      const contentHtml = isIconLeft ? `${iconHtml}${textHtml}` : `${textHtml}${iconHtml}`;

      const btnStyles = [
        'display: inline-flex; align-items: center; justify-content: center; padding: 10px 20px; border-radius: 8px; font-weight: 600; background-color: #4f46e5; color: #ffffff; text-decoration: none; border: none; cursor: pointer; transition: all 0.2s ease;',
        inlineCss
      ].filter(Boolean).join(' ');
      return `${indent}<a href="${href}"${targetAttr}${relAttr}${actionAttr} style="${btnStyles}">${contentHtml}</a>`;
    }

    case 'nav-container':
    case 'nav-links': {
      const childrenList: WebsiteElement[] =
        element.children && element.children.length > 0
          ? element.children
          : (element.links && element.links.length > 0
              ? element.links.map((l, idx) => ({
                  id: l.id || `link_${idx}`,
                  type: 'nav-link' as const,
                  label: l.label,
                  content: l.label,
                  href: l.href,
                  target: l.target,
                }))
              : (element.content || 'Home,About,Services,Contact')
                  .split(',')
                  .map((item, idx) => {
                    const trimmed = item.trim();
                    return {
                      id: `link_${idx}`,
                      type: 'nav-link' as const,
                      label: trimmed,
                      content: trimmed,
                      href: `#${trimmed.toLowerCase().replace(/\s+/g, '-')}`,
                    };
                  })
                  .filter((l) => l.content)
            );

      const gapVal = s.gap !== undefined ? s.gap : 24;
      const navContainerStyles = [
        'display: flex',
        `flex-direction: ${s.flexDirection || 'row'}`,
        `justify-content: ${s.justifyContent || 'flex-start'}`,
        'align-items: center',
        'flex-wrap: wrap',
        `gap: ${gapVal}px`,
        inlineCss,
      ].filter(Boolean).join('; ');

      const linksHtml = childrenList
        .map((child) => {
          const href = child.href || `#${(child.content || child.label || 'link').toLowerCase().replace(/\s+/g, '-')}`;
          const target = child.target ? ` target="${child.target}"` : '';
          const childStyle = styleObjectToCss(child);
          const linkStyles = [
            'font-weight: 600',
            'text-decoration: none',
            'color: inherit',
            'transition: opacity 0.2s ease',
            childStyle,
          ].filter(Boolean).join('; ');

          return `${indent}  <a href="${href}"${target} style="${linkStyles}">${child.content || child.label}</a>`;
        })
        .join('\n');

      return `${indent}<nav style="${navContainerStyles}" aria-label="${element.label || 'Navigation'}">\n${linksHtml}\n${indent}</nav>`;
    }

    case 'nav-link': {
      const href = element.href || '#';
      const label = element.content || element.label || 'Link';
      const linkStyles = ['font-weight: 500; opacity: 0.9; text-decoration: none; color: inherit;', inlineCss].filter(Boolean).join(' ');
      const subItems = (element.submenu && element.submenu.length > 0)
        ? element.submenu
        : (element.sublinks && element.sublinks.length > 0)
        ? element.sublinks
        : [];
      if (subItems.length > 0) {
        const subItemsHtml = subItems
          .map((sub: any) => `      <a href="${sub.href || '#'}" style="padding: 8px 12px; color: ${isLight ? '#334155' : '#cbd5e1'}; font-size: 14px; font-weight: 500; text-decoration: none; border-radius: 8px; display: block; transition: background 0.15s ease;">${sub.label || sub.title || 'Sub-item'}</a>`)
          .join('\n');
        return `${indent}<div class="nav-item-dropdown">
${indent}  <a href="${href}" style="${linkStyles}">${label} <span class="dropdown-arrow" style="font-size: 12px; margin-left: 4px; opacity: 0.7;">▾</span></a>
${indent}  <div class="dropdown-menu">
${subItemsHtml}
${indent}  </div>
${indent}</div>`;
      }
      return `${indent}<a href="${href}" style="${linkStyles}">${label}</a>`;
    }

    case 'image': {
      const altAttr = element.alt ? ` alt="${element.alt}"` : '';
      const titleAttr = element.title ? ` title="${element.title}"` : '';
      const widthVal = s.width ? (typeof s.width === 'number' ? `${s.width}px` : s.width) : '100%';
      const heightVal = s.height ? (typeof s.height === 'number' ? `${s.height}px` : s.height) : undefined;
      const objectFit = s.objectFit || (heightVal ? 'cover' : undefined);

      const baseImageCssParts: string[] = [
        `width: ${widthVal}`,
        'max-width: 100%',
        heightVal && heightVal !== 'auto' ? `height: ${heightVal}` : 'height: auto',
        objectFit ? `object-fit: ${objectFit}` : '',
        'display: block',
      ].filter(Boolean);

      const imgStyle = [baseImageCssParts.join('; '), inlineCss].filter(Boolean).join('; ');

      const childrenHtml = element.children && element.children.length > 0
        ? element.children.map(child => renderElementToHtml(child, indent + '  ', shouldGroupForm, isLight)).join('\n')
        : '';

      let imgNode = `<img src="${element.src || ''}"${altAttr}${titleAttr} style="${imgStyle}" />`;
      if (element.linkAction === 'url' && element.href) {
        imgNode = `<a href="${element.href}" target="${element.target || '_self'}"${element.target === '_blank' ? ' rel="noopener noreferrer"' : ''} style="display: block; text-decoration: none; max-width: 100%;">\n${indent}  ${imgNode}\n${indent}</a>`;
      }

      if (childrenHtml) {
        return `${indent}<span style="display: contents;">\n${childrenHtml}\n${indent}  ${imgNode}\n${indent}</span>`;
      }
      return `${indent}${imgNode}`;
    }

    case 'video': {
      const url = element.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
      const isEmbed = url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');

      if (isEmbed) {
        const wrapStyles = ['position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); width: 100%;', inlineCss].filter(Boolean).join(' ');
        return `${indent}<div style="${wrapStyles}">\n${indent}  <iframe src="${url}" title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"></iframe>\n${indent}</div>`;
      } else {
        const posterAttr = element.poster ? ` poster="${element.poster}"` : '';
        const videoStyles = ['width: 100%; height: auto; display: block; border-radius: 12px;', inlineCss].filter(Boolean).join(' ');
        return `${indent}<video src="${url}"${posterAttr} controls style="${videoStyles}"></video>`;
      }
    }

    case 'table': {
      const tableData = element.tableData || {
        headers: ['Feature', 'Starter', 'Pro', 'Enterprise'],
        rows: [
          ['Core Feature', { isCheck: true }, { isCheck: true }, { isCheck: true }],
          ['Priority Support', { isCross: true }, { isCross: true }, { badge: 'VIP' }],
        ],
      };

      const elAny = element as any;
      const includeHeader = tableData.includeHeader !== false && elAny.tableIncludeHeader !== false;
      const headerBg = tableData.headerBg || elAny.tableHeaderBg || (isLight ? '#f1f5f9' : '#0f172a');
      const headerTextColor = tableData.headerTextColor || elAny.tableHeaderTextColor || (isLight ? '#0f172a' : '#f8fafc');
      const zebraStripes = Boolean(tableData.zebraStripes ?? elAny.tableZebraStripes);
      const zebraBg = elAny.tableZebraBg || (isLight ? '#f8fafc' : '#1e293b');
      const borderColor = element.styles?.borderColor || elAny.tableBorderColor || (isLight ? '#e2e8f0' : '#334155');
      const tableTextColor = element.styles?.textColor || elAny.tableTextColor || (isLight ? '#1e293b' : '#f1f5f9');
      const rawPadding = tableData.cellPadding ?? elAny.tableCellPadding;
      const cellPadding = rawPadding === 'compact' ? '8px 12px' : rawPadding === 'relaxed' ? '16px 20px' : typeof rawPadding === 'number' ? `${rawPadding}px` : '12px 16px';

      let theadHtml = '';
      if (includeHeader && tableData.headers && tableData.headers.length > 0) {
        const ths = tableData.headers
          .map((h: string | TableHeaderItem) => {
            const hItem: TableHeaderItem = typeof h === 'object' && h !== null ? h : { text: String(h || '') };
            const hAny = hItem as any;
            const align = hItem.textAlign || hAny.align || 'left';
            const widthAttr = hAny.width ? ` width: ${hAny.width};` : '';
            const bgAttr = (hItem.backgroundColor || hAny.bgColor) ? ` background-color: ${hItem.backgroundColor || hAny.bgColor};` : ` background-color: ${headerBg};`;
            const colorAttr = (hItem.textColor || hAny.color) ? ` color: ${hItem.textColor || hAny.color};` : ` color: ${headerTextColor};`;
            return `<th style="padding: ${cellPadding}; border-bottom: 1px solid ${borderColor}; text-align: ${align}; font-weight: 600; font-size: 13px; letter-spacing: 0.025em;${bgAttr}${colorAttr}${widthAttr}">${hItem.text || ''}</th>`;
          })
          .join('');
        theadHtml = `${indent}    <thead>\n${indent}      <tr>${ths}</tr>\n${indent}    </thead>\n`;
      }

      const rows = tableData.rows || [];
      const trs = rows
        .map((row, rowIdx) => {
          const isZebra = zebraStripes && rowIdx % 2 === 1;
          const defaultRowBg = isZebra ? zebraBg : (isLight ? '#ffffff' : 'transparent');
          const tds = (Array.isArray(row) ? row : [])
            .map((cell: any) => {
              const cItem: TableCellItem = typeof cell === 'object' && cell !== null ? cell : { text: String(cell ?? '') };
              const cAny = cItem as any;
              const align = cItem.textAlign || cAny.align || 'left';
              const cellBg = (cItem.backgroundColor || cAny.bgColor) ? ` background-color: ${cItem.backgroundColor || cAny.bgColor};` : '';
              const cellColor = (cItem.textColor || cAny.color) ? ` color: ${cItem.textColor || cAny.color};` : ` color: ${tableTextColor};`;
              const boldStyle = (cItem.fontWeight === 'bold' || cItem.fontWeight === '700' || cAny.isBold) ? ' font-weight: 700;' : '';

              let cellContent = cItem.text || '';
              if (cItem.isCheck) {
                cellContent = `<span style="color: #22c55e; font-weight: 700; font-size: 16px;">✓</span>`;
              } else if (cItem.isCross) {
                cellContent = `<span style="color: #64748b; font-weight: 500; font-size: 16px;">—</span>`;
              } else if (cItem.badge) {
                cellContent = `<span style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 600; background-color: rgba(79, 70, 229, 0.15); color: #6366f1;">${cItem.badge}</span>`;
              }

              return `<td style="padding: ${cellPadding}; border-bottom: 1px solid ${borderColor}; text-align: ${align};${cellBg}${cellColor}${boldStyle}">${cellContent}</td>`;
            })
            .join('');
          return `<tr style="background-color: ${defaultRowBg}; transition: background 0.15s ease;">${tds}</tr>`;
        })
        .join('\n' + indent + '    ');

      const wrapStyles = [
        'width: 100%; overflow-x: auto; box-sizing: border-box;',
        `border: 1px solid ${borderColor};`,
        `border-radius: ${s.borderRadius !== undefined ? s.borderRadius : 12}px;`,
        `background-color: ${s.backgroundColor || (isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.6)')};`,
        inlineCss
      ].filter(Boolean).join(' ');
      return `${indent}<div style="${wrapStyles}">\n${indent}  <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">\n${theadHtml}${indent}    <tbody>\n${indent}    ${trs}\n${indent}    </tbody>\n${indent}  </table>\n${indent}</div>`;
    }

    case 'grid': {
      const childrenHtml = (element.children || [])
        .map((child) => `\n${indent}  <div style="width: 100%; min-width: 0;">\n${renderElementToHtml(child, indent + '    ', shouldGroupForm, isLight)}\n${indent}  </div>`)
        .join('');

      const layoutColumns = s.layoutColumns || '1';
      let gridColsStyle = 'grid-template-columns: 1fr;';
      let isFlexWrap = false;
      if (layoutColumns === '2') {
        const ratio = s.columnRatio || '1:1';
        if (ratio === '1:2') gridColsStyle = 'grid-template-columns: 1fr 2fr;';
        else if (ratio === '2:1') gridColsStyle = 'grid-template-columns: 2fr 1fr;';
        else if (ratio === '1:3') gridColsStyle = 'grid-template-columns: 1fr 3fr;';
        else if (ratio === '3:1') gridColsStyle = 'grid-template-columns: 3fr 1fr;';
        else gridColsStyle = 'grid-template-columns: repeat(2, minmax(0, 1fr));';
      } else if (layoutColumns === '3') {
        const ratio = s.columnRatio || '1:1:1';
        if (ratio === '1:2:1') gridColsStyle = 'grid-template-columns: 1fr 2fr 1fr;';
        else if (ratio === '2:1:1') gridColsStyle = 'grid-template-columns: 2fr 1fr 1fr;';
        else if (ratio === '1:1:2') gridColsStyle = 'grid-template-columns: 1fr 1fr 2fr;';
        else gridColsStyle = 'grid-template-columns: repeat(3, minmax(0, 1fr));';
      } else if (layoutColumns === '4') {
        gridColsStyle = 'grid-template-columns: repeat(4, minmax(0, 1fr));';
      } else if (layoutColumns === 'flex') {
        isFlexWrap = false;
      } else if (layoutColumns === 'flex-wrap') {
        isFlexWrap = true;
      }

      const gapVal = s.gap !== undefined ? s.gap : 24;

      let flexOrGridStyles = '';
      if (layoutColumns === 'flex' || layoutColumns === 'flex-wrap') {
        flexOrGridStyles = `display: flex; flex-wrap: ${isFlexWrap ? 'wrap' : 'nowrap'}; ${s.justifyContent ? `justify-content: ${s.justifyContent};` : ''}`;
      } else {
        flexOrGridStyles = `display: grid; ${gridColsStyle}`;
      }

      const widthCss = s.fullWidth ? 'width: 100%;' : s.width ? `width: ${typeof s.width === 'number' ? `${s.width}px` : s.width};` : 'width: 100%;';
      const maxWidthCss = s.maxWidth && s.maxWidth !== 'none' ? (
        s.maxWidth === '7xl' ? 'max-width: 1280px;' :
        s.maxWidth === '6xl' ? 'max-width: 1152px;' :
        s.maxWidth === '5xl' ? 'max-width: 1024px;' :
        s.maxWidth === '4xl' ? 'max-width: 896px;' :
        s.maxWidth === '3xl' ? 'max-width: 768px;' :
        s.maxWidth === '2xl' ? 'max-width: 672px;' :
        s.maxWidth === 'xl' ? 'max-width: 576px;' :
        s.maxWidth === 'lg' ? 'max-width: 512px;' :
        s.maxWidth === 'md' ? 'max-width: 448px;' :
        s.maxWidth === 'sm' ? 'max-width: 384px;' :
        s.maxWidth === 'full' ? 'max-width: 100%;' :
        `max-width: ${s.maxWidth};`
      ) : '';
      const alignmentCss = s.alignment === 'center' || s.marginAuto === 'center' || s.marginAuto === true ? 'margin-left: auto; margin-right: auto;' :
        s.alignment === 'right' || s.marginAuto === 'right' ? 'margin-left: auto; margin-right: 0;' :
        s.alignment === 'left' || s.marginAuto === 'left' ? 'margin-left: 0; margin-right: auto;' : '';

      const normalizedAlign =
        s.alignItems === 'top' || s.alignItems === 'start' || s.alignItems === 'flex-start'
          ? 'flex-start'
          : s.alignItems === 'bottom' || s.alignItems === 'end' || s.alignItems === 'flex-end'
          ? 'flex-end'
          : s.alignItems === 'center'
          ? 'center'
          : 'stretch';

      const gridStyles = [
        widthCss,
        maxWidthCss,
        alignmentCss,
        flexOrGridStyles,
        `gap: ${gapVal}px;`,
        s.paddingTop !== undefined ? `padding-top: ${s.paddingTop}px;` : '',
        s.paddingBottom !== undefined ? `padding-bottom: ${s.paddingBottom}px;` : '',
        s.paddingLeft !== undefined ? `padding-left: ${s.paddingLeft}px;` : '',
        s.paddingRight !== undefined ? `padding-right: ${s.paddingRight}px;` : '',
        `align-items: ${normalizedAlign};`,
        inlineCss ? inlineCss : ''
      ].filter(Boolean).join(' ');

      return `${indent}<div style="${gridStyles}">\n${childrenHtml}\n${indent}</div>`;
    }

    case 'inline': {
      const childrenHtml = renderElementsListToHtml(element.children || [], indent + '  ', shouldGroupForm, isLight);

      const isInlineFlex = s.display === 'inline-flex';
      const inlineStyles = [
        isInlineFlex ? '' : 'width: 100%;',
        `display: ${s.display || 'flex'};`,
        `flex-direction: ${s.layoutDirection === 'col' ? 'column' : 'row'};`,
        `flex-wrap: ${s.flexWrap || 'nowrap'};`,
        `gap: ${s.gap !== undefined ? `${s.gap}px` : '16px'};`,
        `align-items: ${s.alignItems || 'center'};`,
        `justify-content: ${s.justifyContent || 'flex-start'};`,
        s.paddingY !== undefined ? `padding-top: ${s.paddingY}px; padding-bottom: ${s.paddingY}px;` : 'padding-top: 16px; padding-bottom: 16px;',
        s.paddingX !== undefined ? `padding-left: ${s.paddingX}px; padding-right: ${s.paddingX}px;` : 'padding-left: 16px; padding-right: 16px;',
        s.borderRadius !== undefined ? `border-radius: ${s.borderRadius}px;` : 'border-radius: 12px;',
        inlineCss ? inlineCss : ''
      ].filter(Boolean).join(' ');

      const tag = isInlineFlex ? 'span' : 'div';
      return `${indent}<${tag} style="${inlineStyles}">\n${childrenHtml}\n${indent}</${tag}>`;
    }

    case 'card': {
      const childrenHtml = renderElementsListToHtml(element.children || [], indent + '  ', shouldGroupForm, isLight);

      const elAny = element as any;
      const cardTitle = element.title || elAny.cardTitle || elAny.header;
      const cardSubtitle = elAny.subtitle || elAny.cardSubtitle;
      const cardParagraph = element.content || element.text || elAny.description || elAny.paragraph || elAny.bodyText || elAny.body || elAny.cardDescription || elAny.cardText || elAny.details;

      let titleHtml = '';
      if (cardTitle) {
        titleHtml = `${indent}  <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">${cleanRedundantNestedSpansFromHtml(cardTitle)}</h3>`;
      }

      let subtitleHtml = '';
      if (cardSubtitle) {
        subtitleHtml = `${indent}  <p style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0; opacity: 0.8;">${cleanRedundantNestedSpansFromHtml(cardSubtitle)}</p>`;
      }

      let paragraphHtml = '';
      if (cardParagraph) {
        paragraphHtml = `${indent}  <p style="font-size: 14px; line-height: 1.6; margin: 0; opacity: 0.9;">${cleanRedundantNestedSpansFromHtml(cardParagraph)}</p>`;
      }

      const innerContent = [titleHtml, subtitleHtml, paragraphHtml, childrenHtml].filter(Boolean).join('\n');

      const defaultCardBg = isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.6)';
      const defaultCardBorder = isLight ? '#e2e8f0' : 'rgba(51, 65, 85, 0.8)';
      const cardStyles = [
        'display: flex; flex-direction: column; gap: 16px; border-radius: 16px; padding: 24px;',
        `background-color: ${s.backgroundColor || defaultCardBg};`,
        `border: ${s.borderWidth !== undefined ? s.borderWidth : 1}px ${s.borderStyle || 'solid'} ${s.borderColor || defaultCardBorder};`,
        inlineCss
      ].filter(Boolean).join(' ');
      return `${indent}<div style="${cardStyles}">\n${innerContent}\n${indent}</div>`;
    }

    case 'container': {
      const childrenHtml = renderElementsListToHtml(element.children || [], indent + '  ', shouldGroupForm, isLight);
      const containerText = element.content || element.text || (element as any).description || (element as any).paragraph || (element as any).bodyText || '';
      const textHtml = containerText ? `${indent}  <p style="font-size: 15px; line-height: 1.6; margin: 0 0 12px 0;">${cleanRedundantNestedSpansFromHtml(containerText)}</p>` : '';
      const innerContent = [textHtml, childrenHtml].filter(Boolean).join('\n');
      const containerStyles = ['width: 100%; box-sizing: border-box;', inlineCss].filter(Boolean).join(' ');
      return `${indent}<div style="${containerStyles}">\n${innerContent}\n${indent}</div>`;
    }

    case 'form': {
      const childrenHtml = renderElementsListToHtml(element.children || [], indent + '  ', false, isLight);
      const fields = element.formFields || [];
      const submitText = element.formSubmitText || 'Send Message';
      const submitAlign = element.formSubmitAlign || 'left';

      let headerHtml = '';
      if (element.showFormTitle !== false && (element.content || element.formTitle)) {
        const titleText = element.content || element.formTitle;
        const subtitleText = (element.showFormSubtitle && element.formSubtitle)
          ? `\n${indent}  <p style="font-size: 13px; opacity: 0.75; margin-top: 4px; margin-bottom: 0; text-align: left;">${element.formSubtitle}</p>`
          : '';
        headerHtml = `${indent}<div style="margin-bottom: 8px; text-align: left;">\n${indent}  <h3 style="margin: 0; font-size: 18px; font-weight: 700; text-align: left;">${titleText}</h3>${subtitleText}\n${indent}</div>\n`;
      }

      const honeypotHtml = element.formHoneypotEnabled
        ? `${indent}<div style="display:none !important; visibility:hidden !important;" aria-hidden="true"><input type="text" name="_hp_website_trap" tabindex="-1" autocomplete="off" /></div>\n`
        : '';

      const fieldsListHtml = fields.map((field, idx) => {
        const fLabel = field.label || 'Field';
        const hasCustomId = !!field.customId;
        const fId = hasCustomId ? field.customId : `field-${element.id}-${idx}`;
        const fIdAttr = ` id="${fId}"`;
        const fName = field.name || (field.label ? field.label.toLowerCase().replace(/[^a-z0-9_]/g, '_') : `field_${field.id || idx}`);
        const fPlaceholder = field.showPlaceholder !== false && field.placeholder ? ` placeholder="${field.placeholder}"` : '';
        const fRequired = field.required ? ' required' : '';
        const fReqAsterisk = field.required ? ' <span style="color: #ef4444;">*</span>' : '';
        const fieldAlign = field.fieldAlignment || 'left';

        const labelColor = field.labelColor || element.styles?.labelColor;
        const labelFontSize = field.labelFontSize || element.styles?.labelFontSize;
        const labelFontWeight = field.labelFontWeight || element.styles?.labelFontWeight;
        const labelTypeface = field.labelTypeface || element.styles?.labelTypeface;

        const labelStyles: string[] = [`display: block; font-size: 14px; font-weight: 600; margin-bottom: 6px; text-align: ${fieldAlign};`];
        if (labelTypeface) labelStyles.push(`font-family: '${labelTypeface}', sans-serif`);
        if (labelFontSize) labelStyles.push(`font-size: ${labelFontSize}px`);
        if (labelFontWeight) labelStyles.push(`font-weight: ${labelFontWeight}`);
        if (labelColor) labelStyles.push(`color: ${labelColor}`);
        if (field.labelLetterSpacing) labelStyles.push(`letter-spacing: ${field.labelLetterSpacing}em`);
        if (field.labelLineHeight) labelStyles.push(`line-height: ${field.labelLineHeight}`);
        const labelStyleAttr = ` style="${labelStyles.join('; ')}"`;

        const labelForAttr = ` for="${fId}"`;
        const labelHtml = field.showLabel !== false
          ? `${indent}  <label${labelForAttr}${labelStyleAttr}>${fLabel}${fReqAsterisk}</label>\n`
          : '';

        const inputStyles: string[] = [
          'width: 100%',
          'padding: 10px 14px',
          'border-radius: ' + (field.borderRadius ?? element.styles?.fieldBorderRadius ?? 8) + 'px',
          'border: ' + (field.borderWidth ?? element.styles?.fieldBorderWidth ?? 1) + 'px solid ' + (field.borderColor ?? element.styles?.fieldBorderColor ?? '#cbd5e1'),
          'background-color: ' + (field.backgroundColor ?? element.styles?.fieldBackgroundColor ?? '#f8fafc'),
          'color: ' + (field.textColor ?? element.styles?.fieldTextColor ?? '#0f172a'),
          'font-size: ' + (field.fontSize ?? element.styles?.fieldFontSize ?? 14) + 'px',
          'box-sizing: border-box',
          'outline: none',
          'transition: all 0.2s ease'
        ];

        if (field.paddingX !== undefined) inputStyles.push(`padding-left: ${field.paddingX}px; padding-right: ${field.paddingX}px`);
        if (field.paddingY !== undefined) inputStyles.push(`padding-top: ${field.paddingY}px; padding-bottom: ${field.paddingY}px`);

        const inputStyleAttr = ` style="${inputStyles.join('; ')}"`;
        const fieldClass = `form-field-${element.id}-${idx}`;

        const focusBorder = field.focusBorderColor || element.styles?.focusBorderColor;
        const focusBg = field.focusBackgroundColor || element.focusBackgroundColor || element.styles?.focusBackgroundColor;
        const focusRing = field.focusRingColor || element.focusRingColor || element.styles?.focusRingColor;
        const focusRingWidth = field.focusRingWidth ?? element.styles?.focusRingWidth ?? 2;
        const focusShadow = field.focusShadow || element.styles?.fieldFocusShadow;

        const hoverBorder = field.hoverBorderColor || element.styles?.fieldHoverBorderColor;
        const hoverBg = field.hoverBackgroundColor || element.styles?.fieldHoverBackgroundColor;

        const phColor = field.placeholderColor || element.styles?.placeholderColor;
        const phSize = field.placeholderFontSize || element.styles?.placeholderFontSize;

        let fieldCss = '';
        if (focusBorder || focusBg || focusRing || focusShadow || hoverBorder || hoverBg || phColor || phSize) {
          fieldCss = `\n${indent}<style>`;
          if (hoverBorder || hoverBg) {
            fieldCss += `\n  .${fieldClass}:hover { ${hoverBorder ? `border-color: ${hoverBorder} !important; ` : ''}${hoverBg ? `background-color: ${hoverBg} !important; ` : ''}}`;
          }
          if (focusBorder || focusBg || focusRing || focusShadow) {
            fieldCss += `\n  .${fieldClass}:focus { ${focusBorder ? `border-color: ${focusBorder} !important; ` : ''}${focusBg ? `background-color: ${focusBg} !important; ` : ''}${focusRing ? `box-shadow: 0 0 0 ${focusRingWidth}px ${focusRing} !important; ` : focusShadow ? `box-shadow: ${focusShadow} !important; ` : ''}}`;
          }
          if (phColor || phSize) {
            fieldCss += `\n  #${fId}::placeholder { ${phColor ? `color: ${phColor} !important; opacity: 1; ` : ''}${phSize ? `font-size: ${phSize}px !important; ` : ''}}`;
          }
          fieldCss += `\n</style>`;
        }

        let inputControl = '';
        if (field.type === 'textarea') {
          inputControl = `${indent}  <textarea${fIdAttr} name="${fName}" class="${fieldClass}" rows="${field.rows || 4}"${fPlaceholder}${fRequired}${inputStyleAttr}></textarea>`;
        } else if (field.type === 'select') {
          const opts = (field.options || ['Option 1', 'Option 2', 'Option 3'])
            .map(o => `${indent}    <option value="${o}">${o}</option>`)
            .join('\n');
          inputControl = `${indent}  <select${fIdAttr} name="${fName}" class="${fieldClass}"${fRequired}${inputStyleAttr}>\n${indent}    <option value="">${field.placeholder || 'Select an option...'}</option>\n${opts}\n${indent}  </select>`;
        } else if (field.type === 'radio' || field.type === 'checkbox') {
          const opts = (field.options || ['Option 1', 'Option 2'])
            .map((o, optIdx) => {
              const itemIdAttr = ` id="${fId}-${optIdx}"`;
              const itemForAttr = ` for="${fId}-${optIdx}"`;
              return `${indent}    <label${itemForAttr} style="display: flex; align-items: center; gap: 8px; font-size: 14px; margin-top: 4px; text-align: left;"><input type="${field.type}"${itemIdAttr} name="${fName}" value="${o}"${optIdx === 0 ? ' checked' : ''} /> ${o}</label>`;
            })
            .join('\n');
          inputControl = `${indent}  <div style="display: flex; flex-direction: column; gap: 6px; text-align: left;">\n${opts}\n${indent}  </div>`;
        } else {
          inputControl = `${indent}  <input type="${field.type || 'text'}"${fIdAttr} name="${fName}" class="${fieldClass}"${fPlaceholder}${fRequired}${inputStyleAttr} />`;
        }

        const helperTextColor = field.helperTextColor || element.styles?.helperTextColor;
        const helperTextFontSize = field.helperTextFontSize || element.styles?.helperTextFontSize;
        const helperHtml = field.helperText ? `\n${indent}  <p style="font-size: 11px; opacity: 0.7; margin-top: 4px; text-align: ${fieldAlign};${helperTextColor ? ` color: ${helperTextColor};` : ''}${helperTextFontSize ? ` font-size: ${helperTextFontSize}px;` : ''}">${field.helperText}</p>` : '';

        const fieldWidthBasis = field.width === '1/2' ? 'calc(50% - 8px)' :
          field.width === '1/3' ? 'calc(33.333% - 11px)' :
          field.width === '1/4' ? 'calc(25% - 12px)' :
          field.width === '2/3' ? 'calc(66.666% - 8px)' :
          field.width === '3/4' ? 'calc(75% - 8px)' : '100%';

        const labelPos = field.labelPosition || element.styles?.labelPosition || 'top';
        let fieldBodyHtml = '';
        if (labelPos === 'bottom') {
          fieldBodyHtml = `${inputControl}\n${labelHtml}`;
        } else if (labelPos === 'left') {
          fieldBodyHtml = `${indent}  <div style="display: flex; align-items: center; gap: 12px;">\n${indent}    <div style="min-width: 100px; flex-shrink: 0; text-align: ${fieldAlign};">\n${labelHtml}${indent}    </div>\n${indent}    <div style="flex: 1;">\n${inputControl}\n${indent}    </div>\n${indent}  </div>`;
        } else if (labelPos === 'right') {
          fieldBodyHtml = `${indent}  <div style="display: flex; align-items: center; gap: 12px;">\n${indent}    <div style="flex: 1;">\n${inputControl}\n${indent}    </div>\n${indent}    <div style="min-width: 100px; flex-shrink: 0; text-align: ${fieldAlign};">\n${labelHtml}${indent}    </div>\n${indent}  </div>`;
        } else {
          fieldBodyHtml = `${labelHtml}${inputControl}`;
        }

        return `${fieldCss}\n${indent}<div style="flex: 0 0 ${fieldWidthBasis}; max-width: ${fieldWidthBasis}; box-sizing: border-box; margin-bottom: 8px; text-align: ${fieldAlign};">\n${fieldBodyHtml}${helperHtml}\n${indent}</div>`;
      }).join('\n');

      const fieldsHtml = fields.length > 0
        ? `${indent}<div style="display: flex; flex-wrap: wrap; gap: 16px 16px; width: 100%;">\n${fieldsListHtml}\n${indent}</div>`
        : '';

      const submitBtnStyles = [
        'display: inline-flex; align-items: center; justify-content: center; padding: 12px 24px; border-radius: ' + (element.formSubmitBorderRadius ?? 8) + 'px; font-weight: ' + (element.formSubmitFontWeight || 600) + '; font-size: ' + (element.formSubmitFontSize || 14) + 'px; background-color: ' + (element.formSubmitBgColor || '#4f46e5') + '; color: ' + (element.formSubmitTextColor || '#ffffff') + '; border: ' + (element.formSubmitBorderWidth ?? 0) + 'px solid ' + (element.formSubmitBorderColor || 'transparent') + '; cursor: pointer; transition: all 0.2s ease;',
        element.formSubmitShadow ? `box-shadow: ${element.formSubmitShadow};` : '',
        element.formSubmitPaddingX !== undefined ? `padding-left: ${element.formSubmitPaddingX}px; padding-right: ${element.formSubmitPaddingX}px;` : '',
        element.formSubmitPaddingY !== undefined ? `padding-top: ${element.formSubmitPaddingY}px; padding-bottom: ${element.formSubmitPaddingY}px;` : '',
        submitAlign === 'full' ? 'width: 100%;' : ''
      ].filter(Boolean).join(' ');

      const btnClass = `form-submit-${element.id}`;
      let btnCss = '';
      if (element.formSubmitHoverBgColor || element.formSubmitHoverTextColor || element.formSubmitHoverEffect) {
        btnCss = `\n${indent}<style>\n  .${btnClass}:hover { ${element.formSubmitHoverBgColor ? `background-color: ${element.formSubmitHoverBgColor} !important; ` : ''}${element.formSubmitHoverTextColor ? `color: ${element.formSubmitHoverTextColor} !important; ` : ''}${element.formSubmitHoverEffect === 'scale' ? 'transform: scale(1.05); ' : ''}}\n</style>`;
      }

      const legacySubmitBtnHtml = fields.length > 0
        ? `${btnCss}\n${indent}<div style="margin-top: 4px; text-align: ${submitAlign === 'full' ? 'left' : submitAlign};">\n${indent}  <button type="submit" id="submit-btn-${element.id}" class="site-form-submit-btn ${btnClass}" style="${submitBtnStyles}">${submitText}</button>\n${indent}</div>`
        : '';

      const formAlign = (element.styles as any)?.textAlign || 'left';
      const formStyles = [
        `width: 100%; box-sizing: border-box; display: flex; flex-direction: column; gap: 16px; text-align: ${formAlign};`,
        inlineCss
      ].filter(Boolean).join(' ');

      const statusHtml = `<div class="site-form-status"></div>`;
      const formAttrs = [
        `id="form-${element.id}"`,
        `data-site-form="true"`,
        element.formNotificationGmailEnabled ? `data-notif-gmail="true"` : '',
        element.formNotificationTelegramEnabled ? `data-notif-telegram="true"` : '',
        element.formAutoReset !== false ? `data-auto-reset="true"` : '',
        element.formSuccessAction ? `data-success-action="${element.formSuccessAction}"` : '',
        element.formRedirectUrl ? `data-redirect-url="${element.formRedirectUrl}"` : '',
        element.formSuccessMessage ? `data-success-msg="${encodeURIComponent(element.formSuccessMessage)}"` : '',
        element.formErrorMessage ? `data-error-msg="${encodeURIComponent(element.formErrorMessage)}"` : '',
        element.formSubmittingText ? `data-submitting-text="${encodeURIComponent(element.formSubmittingText)}"` : '',
        element.formActionUrl ? `data-action-url="${element.formActionUrl}"` : '',
        element.formMethod ? `method="${element.formMethod}"` : 'method="POST"',
      ].filter(Boolean).join(' ');

      return `${indent}<form ${formAttrs} class="site-generated-form" style="${formStyles}">\n${headerHtml}${honeypotHtml}${childrenHtml}\n${fieldsHtml}\n${legacySubmitBtnHtml}\n${statusHtml}\n${indent}</form>`;
    }

    case 'map': {
      const mapUrl = element.mapEmbedUrl || 'https://maps.google.com/maps?q=London&t=&z=13&ie=UTF8&iwloc=&output=embed';
      const mapHeight = element.mapHeight || 360;
      const mapStyles = [
        'width: 100%;',
        `height: ${mapHeight}px;`,
        'border-radius: 16px;',
        'overflow: hidden;',
        'border: 1px solid rgba(255, 255, 255, 0.1);',
        inlineCss ? inlineCss : ''
      ].filter(Boolean).join(' ');

      return `${indent}<div style="${mapStyles}">\n${indent}  <iframe src="${mapUrl}" width="100%" height="${mapHeight}" style="border: 0; width: 100%; height: 100%; display: block;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>\n${indent}</div>`;
    }

    case 'icon': {
      const iconName = element.iconName || 'sparkles';
      const iconSize = typeof s.fontSize === 'number' ? s.fontSize : Number(s.fontSize) || 32;
      const colorVal = s.textColor || s.color;
      const colorStyle = colorVal ? `color: ${colorVal};` : '';
      const innerIcon = getExportedIconHtml(iconName, iconSize, colorStyle);

      const isInlineFlex = s.display === 'inline-flex';
      const wrapperTag = isInlineFlex ? 'span' : 'div';
      const wrapperStyle = [
        `display: ${isInlineFlex ? 'inline-flex' : 'flex'};`,
        inlineCss ? inlineCss : ''
      ].filter(Boolean).join(' ');

      let iconHtml = `${indent}<${wrapperTag} style="${wrapperStyle}">\n${indent}  <span>${innerIcon}</span>\n${indent}</${wrapperTag}>`;
      if (element.href && (element.linkAction === 'url' || element.linkAction === undefined)) {
        iconHtml = `${indent}<a href="${element.href}" target="${element.target || '_self'}" style="text-decoration: none; color: inherit; display: ${isInlineFlex ? 'inline-block' : 'block'};">\n${iconHtml}\n${indent}</a>`;
      }
      return iconHtml;
    }

    case 'divider': {
      const elAny = element as any;
      const dStyle = elAny.dividerStyle || element.styles?.borderStyle || 'solid';
      const isGradient = dStyle === 'gradient';
      const thickness = elAny.dividerThickness || element.styles?.borderWidth || 1;
      const dColor = elAny.dividerColor || element.styles?.borderColor || (isLight ? '#e2e8f0' : '#334155');
      const divStyles = isGradient
        ? [`border: none; height: ${thickness}px; background: linear-gradient(90deg, transparent, ${dColor}, transparent); margin: 24px 0; width: 100%;`, inlineCss].filter(Boolean).join(' ')
        : [`border: none; border-top: ${thickness}px ${dStyle} ${dColor}; margin: 24px 0; width: 100%;`, inlineCss].filter(Boolean).join(' ');
      return `${indent}<hr style="${divStyles}" />`;
    }

    case 'mixed-media': {
      const mm = element.mixedMedia || {
        mediaType: 'icon' as const,
        iconName: 'sparkles',
        layout: 'side-by-side' as const,
        mediaPosition: 'left' as const,
        responsiveBehavior: 'stack-on-mobile' as const,
        mediaWidth: 64,
        gap: 16,
        title: element.content || element.mediaHeading || 'Mixed Media Feature',
        subtitle: 'Seamlessly combined visual and textual content',
        bodyText: element.subContent || 'This mixed media block combines imagery or iconography with formatted text copy and action triggers in a balanced layout.',
        showButton: true,
        buttonText: 'Learn More',
        buttonHref: '#',
      };

      const isWrap = mm.layout === 'wrap';
      const isStacked = mm.layout === 'stacked';
      const isSideBySide = mm.layout === 'side-by-side' || !mm.layout;
      const isRight = mm.mediaPosition === 'right';
      const gapVal = mm.gap !== undefined ? mm.gap : 16;
      const mediaWidthVal = mm.mediaWidth || (mm.mediaType === 'image' ? 180 : 56);

      let mediaHtml = '';
      if (mm.mediaType === 'image') {
        const imgSrc = mm.imageUrl || element.src || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80';
        mediaHtml = `<img src="${imgSrc}" alt="${mm.imageAlt || 'Media visual'}" style="width: 100%; height: auto; object-fit: cover; border-radius: ${s.borderRadius !== undefined ? s.borderRadius : 12}px; display: block;" />`;
      } else {
        const iconName = mm.iconName || 'sparkles';
        const iconBg = s.backgroundColor || (isLight ? '#e0e7ff' : '#312e81');
        const iconColor = s.textColor || (isLight ? '#4338ca' : '#a5b4fc');
        const svgStr = getExportedIconHtml(iconName, 24);
        mediaHtml = `<div style="width: ${Math.max(mediaWidthVal, 48)}px; height: ${Math.max(mediaWidthVal, 48)}px; background-color: ${iconBg}; color: ${iconColor}; border-radius: ${s.borderRadius !== undefined ? s.borderRadius : 14}px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">${svgStr}</div>`;
      }

      const mediaWrapperStyle = isWrap
        ? `width: ${mediaWidthVal}px; float: ${isRight ? 'right' : 'left'}; margin-${isRight ? 'left' : 'right'}: 16px; margin-bottom: 8px;`
        : isSideBySide
        ? `flex-basis: ${mediaWidthVal}px; max-width: ${mediaWidthVal}px; flex-shrink: 0;`
        : 'width: 100%;';

      const mediaNode = `<div style="${mediaWrapperStyle}">${mediaHtml}</div>`;

      let titleHtml = mm.title ? `<h3 style="font-size: 18px; font-weight: 700; margin: 0; color: ${isLight ? '#0f172a' : '#ffffff'};">${mm.title}</h3>` : '';
      let subtitleHtml = mm.subtitle ? `<p style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin: 4px 0 0 0; color: ${isLight ? '#4f46e5' : '#818cf8'};">${mm.subtitle}</p>` : '';
      let bodyHtml = mm.bodyText ? `<div style="font-size: 14px; line-height: 1.6; margin-top: 8px; color: ${isLight ? '#475569' : '#cbd5e1'};">${mm.bodyText}</div>` : '';
      const btnHref = mm.buttonHref || (mm as any).buttonUrl || '#';
      let btnHtml = mm.showButton ? `<div style="margin-top: 12px;"><a href="${btnHref}" style="display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: ${isLight ? '#4f46e5' : '#818cf8'}; text-decoration: none;"><span>${mm.buttonText || 'Learn More'}</span> <span>→</span></a></div>` : '';

      const textNode = `<div style="flex: 1; min-width: 0; display: flex; flex-direction: column; text-align: left;">\n${indent}    ${titleHtml}\n${indent}    ${subtitleHtml}\n${indent}    ${bodyHtml}\n${indent}    ${btnHtml}\n${indent}  </div>`;

      const layoutDirection = isStacked ? 'column' : isRight ? 'row-reverse' : 'row';
      const containerStyle = [
        'display: flex;',
        `flex-direction: ${layoutDirection};`,
        `gap: ${gapVal}px;`,
        'align-items: flex-start;',
        inlineCss
      ].filter(Boolean).join(' ');

      return `${indent}<div style="${containerStyle}">\n${indent}  ${mediaNode}\n${indent}  ${textNode}\n${indent}</div>`;
    }

    case 'modal': {
      const elAny = element as any;
      const triggerText = element.modalTriggerText || element.modalData?.triggerText || element.content || 'Open Modal';
      const triggerIcon = elAny.modalTriggerIcon;
      const triggerIconPos = elAny.modalTriggerIconPos || 'left';
      const modalTitle = element.modalTitle || element.modalData?.title || 'Modal Title';
      const modalContent = element.modalContent || element.modalData?.content || element.content || 'Modal description or content here.';
      const backdropBg = elAny.modalBackdropColor || 'rgba(0, 0, 0, 0.6)';
      const backdropBlur = elAny.modalBackdropBlur !== undefined ? elAny.modalBackdropBlur : 4;
      const modalMaxWidth = elAny.modalMaxWidth || elAny.modalWidth || 'max-w-lg';
      const widthMap: Record<string, string> = {
        'max-w-sm': '384px',
        'max-w-md': '448px',
        'max-w-lg': '512px',
        'max-w-xl': '576px',
        'max-w-2xl': '672px',
        'max-w-full': '100%',
      };
      const dialogMaxWidth = widthMap[modalMaxWidth] || '512px';

      let triggerIconHtml = '';
      if (triggerIcon) {
        const svgStr = getExportedIconHtml(triggerIcon, 16);
        triggerIconHtml = `<span style="display: inline-flex; align-items: center;">${svgStr}</span>`;
      }
      const triggerContent = triggerIconPos === 'right'
        ? `<span>${triggerText}</span>${triggerIconHtml}`
        : `${triggerIconHtml}<span>${triggerText}</span>`;

      const triggerBtnStyles = [
        'display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 20px; border-radius: 8px; font-weight: 600; background-color: #4f46e5; color: #ffffff; border: none; cursor: pointer; transition: all 0.2s ease;',
        inlineCss
      ].filter(Boolean).join(' ');

      const childrenHtml = renderElementsListToHtml(element.children || [], indent + '        ', shouldGroupForm, isLight);

      const dialogBg = s.backgroundColor || (isLight ? '#ffffff' : '#0f172a');
      const dialogTextColor = s.textColor || (isLight ? '#0f172a' : '#f8fafc');
      const dialogBorder = s.borderColor || (isLight ? '#e2e8f0' : '#334155');
      const dialogRadius = s.borderRadius !== undefined ? s.borderRadius : 16;

      return `${indent}<!-- Modal Trigger Button -->
${indent}<button type="button" onclick="document.getElementById('modal-${element.id}').style.display='flex'" style="${triggerBtnStyles}">${triggerContent}</button>

${indent}<!-- Modal Dialog Overlay -->
${indent}<div id="modal-${element.id}" class="site-modal-overlay" style="display: none; position: fixed; inset: 0; background-color: ${backdropBg}; backdrop-filter: blur(${backdropBlur}px); -webkit-backdrop-filter: blur(${backdropBlur}px); z-index: 9999; align-items: center; justify-content: center; padding: 16px; box-sizing: border-box;">
${indent}  <div style="position: absolute; inset: 0;" onclick="document.getElementById('modal-${element.id}').style.display='none'"></div>
${indent}  <div style="position: relative; max-width: ${dialogMaxWidth}; width: 100%; border-radius: ${dialogRadius}px; background-color: ${dialogBg}; color: ${dialogTextColor}; border: 1px solid ${dialogBorder}; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); padding: 24px; box-sizing: border-box; z-index: 1;">
${indent}    <button type="button" onclick="document.getElementById('modal-${element.id}').style.display='none'" aria-label="Close" style="position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 20px; line-height: 1; cursor: pointer; color: inherit; opacity: 0.6; padding: 4px;">✕</button>
${indent}    <h3 style="font-size: 20px; font-weight: 700; margin: 0 0 8px 0; padding-right: 28px;">${modalTitle}</h3>
${indent}    <p style="font-size: 14px; opacity: 0.8; margin: 0 0 16px 0; line-height: 1.6;">${modalContent}</p>
${childrenHtml ? `${childrenHtml}\n` : ''}${indent}  </div>
${indent}</div>`;
    }

    case 'form-input-text':
    case 'form-input-email':
    case 'form-input-password':
    case 'form-input-number':
    case 'form-date':
    case 'form-textarea':
    case 'form-select':
    case 'form-checkbox':
    case 'form-radio':
    case 'form-file': {
      const fLabel = element.label || element.inputLabel || 'Field';
      const hasCustomId = !!element.customId;
      const fId = hasCustomId ? element.customId : `field-${element.id}`;
      const fIdAttr = ` id="${fId}"`;
      const fName = (element as any).name || (element.label ? element.label.toLowerCase().replace(/[^a-z0-9_]/g, '_') : (element.inputLabel ? element.inputLabel.toLowerCase().replace(/[^a-z0-9_]/g, '_') : `field_${element.id}`));
      const fPlaceholder = (element as any).showPlaceholder !== false && (element.placeholder || element.inputPlaceholder) ? ` placeholder="${element.placeholder || element.inputPlaceholder}"` : '';
      const fRequired = (element as any).required || (element as any).inputRequired ? ' required' : '';
      const fReqAsterisk = ((element as any).required || (element as any).inputRequired) ? ' <span style="color: #ef4444;">*</span>' : '';

      const fieldAlign = (element as any).fieldAlignment || (element as any).labelAlignment || s.textAlign || 'left';
      const lColor = (element as any).labelColor || s.labelColor;
      const lFontSize = (element as any).labelFontSize || s.labelFontSize;
      const lFontWeight = (element as any).labelFontWeight || s.labelFontWeight;
      const lTypeface = (element as any).labelTypeface || s.labelTypeface;

      const labelStyles: string[] = [`display: block; font-size: 14px; font-weight: 600; margin-bottom: 6px; text-align: ${fieldAlign};`];
      if (lTypeface) labelStyles.push(`font-family: '${lTypeface}', sans-serif`);
      if (lFontSize) labelStyles.push(`font-size: ${lFontSize}px`);
      if (lFontWeight) labelStyles.push(`font-weight: ${lFontWeight}`);
      if (lColor) labelStyles.push(`color: ${lColor}`);
      if ((element as any).labelLetterSpacing || s.labelLetterSpacing) labelStyles.push(`letter-spacing: ${(element as any).labelLetterSpacing || s.labelLetterSpacing}em`);
      if ((element as any).labelLineHeight || s.labelLineHeight) labelStyles.push(`line-height: ${(element as any).labelLineHeight || s.labelLineHeight}`);
      const labelStyleAttr = ` style="${labelStyles.join('; ')}"`;

      const labelForAttr = ` for="${fId}"`;
      const showLabel = (element as any).showLabel !== false && (element as any).inputShowLabel !== false;
      const labelHtml = showLabel
        ? `${indent}  <label${labelForAttr}${labelStyleAttr}>${fLabel}${fReqAsterisk}</label>\n`
        : '';

      const inputStyles: string[] = [
        'width: 100%',
        'padding: 10px 14px',
        'border-radius: ' + ((element as any).borderRadius ?? s.fieldBorderRadius ?? 8) + 'px',
        'border: ' + ((element as any).borderWidth ?? s.fieldBorderWidth ?? 1) + 'px solid ' + ((element as any).borderColor || s.fieldBorderColor || '#cbd5e1'),
        'color: ' + ((element as any).textColor || s.fieldTextColor || '#0f172a'),
        'font-size: ' + ((element as any).fontSize || s.fieldFontSize || 14) + 'px',
        'box-sizing: border-box',
        'outline: none',
        'transition: all 0.2s ease',
        'background-color: ' + ((element as any).backgroundColor || s.fieldBackgroundColor || '#f8fafc')
      ];
      if ((element as any).textColor || s.fieldTextColor) inputStyles.push(`color: ${(element as any).textColor || s.fieldTextColor}`);
      if ((element as any).paddingX !== undefined || s.fieldPaddingX !== undefined) inputStyles.push(`padding-left: ${(element as any).paddingX ?? s.fieldPaddingX}px; padding-right: ${(element as any).paddingX ?? s.fieldPaddingX}px`);
      if ((element as any).paddingY !== undefined || s.fieldPaddingY !== undefined) inputStyles.push(`padding-top: ${(element as any).paddingY ?? s.fieldPaddingY}px; padding-bottom: ${(element as any).paddingY ?? s.fieldPaddingY}px`);

      const inputStyleAttr = ` style="${inputStyles.join('; ')} ${inlineCss}"`;
      const fieldClass = `form-field-${element.id}`;

      const focusBorder = (element as any).focusBorderColor || s.focusBorderColor;
      const focusBg = (element as any).focusBackgroundColor || s.focusBackgroundColor;
      const focusRing = (element as any).focusRingColor || s.focusRingColor;
      const focusRingWidth = (element as any).focusRingWidth ?? s.focusRingWidth ?? 2;
      const focusShadow = (element as any).focusShadow || s.fieldFocusShadow;
      const hoverBorder = (element as any).hoverBorderColor || s.fieldHoverBorderColor;
      const hoverBg = (element as any).hoverBackgroundColor || s.fieldHoverBackgroundColor;
      const phColor = (element as any).placeholderColor || s.placeholderColor;
      const phSize = (element as any).placeholderFontSize || s.placeholderFontSize;

      let fieldCss = '';
      if (focusBorder || focusBg || focusRing || focusShadow || hoverBorder || hoverBg || phColor || phSize) {
        fieldCss = `\n${indent}<style>`;
        if (hoverBorder || hoverBg) {
          fieldCss += `\n  .${fieldClass}:hover { ${hoverBorder ? `border-color: ${hoverBorder} !important; ` : ''}${hoverBg ? `background-color: ${hoverBg} !important; ` : ''}}`;
        }
        if (focusBorder || focusBg || focusRing || focusShadow) {
          fieldCss += `\n  .${fieldClass}:focus { ${focusBorder ? `border-color: ${focusBorder} !important; ` : ''}${focusBg ? `background-color: ${focusBg} !important; ` : ''}${focusRing ? `box-shadow: 0 0 0 ${focusRingWidth}px ${focusRing} !important; ` : focusShadow ? `box-shadow: ${focusShadow} !important; ` : ''}}`;
        }
        if (phColor || phSize) {
          fieldCss += `\n  #${fId}::placeholder { ${phColor ? `color: ${phColor} !important; opacity: 1; ` : ''}${phSize ? `font-size: ${phSize}px !important; ` : ''}}`;
        }
        fieldCss += `\n</style>`;
      }

      let inputControl = '';
      if (element.type === 'form-textarea') {
        inputControl = `${indent}  <textarea${fIdAttr} name="${fName}" class="${fieldClass}" rows="${(element as any).inputRows || 4}"${fPlaceholder}${fRequired}${inputStyleAttr}></textarea>`;
      } else if (element.type === 'form-select') {
        const opts = (element.inputOptions || ['Option 1', 'Option 2', 'Option 3'])
          .map(o => `${indent}    <option value="${o}">${o}</option>`)
          .join('\n');
        inputControl = `${indent}  <select${fIdAttr} name="${fName}" class="${fieldClass}"${fRequired}${inputStyleAttr}>\n${indent}    <option value="">${element.placeholder || element.inputPlaceholder || 'Select an option...'}</option>\n${opts}\n${indent}  </select>`;
      } else if (element.type === 'form-radio' || element.type === 'form-checkbox') {
        const innerType = element.type === 'form-radio' ? 'radio' : 'checkbox';
        const opts = (element.inputOptions || ['Option 1', 'Option 2'])
          .map((o, idx) => {
            const itemIdAttr = ` id="${fId}-${idx}"`;
            const itemForAttr = ` for="${fId}-${idx}"`;
            return `${indent}    <label${itemForAttr} style="display: flex; align-items: center; gap: 8px; font-size: 14px; margin-top: 4px; text-align: left;"><input type="${innerType}"${itemIdAttr} name="${fName}" value="${o}"${idx === 0 ? ' checked' : ''} /> ${o}</label>`;
          })
          .join('\n');
        inputControl = `${indent}  <div style="display: flex; flex-direction: column; gap: 6px; text-align: left; ${inlineCss}">\n${opts}\n${indent}  </div>`;
      } else if (element.type === 'form-file') {
        inputControl = `${indent}  <input type="file"${fIdAttr} name="${fName}" class="${fieldClass}" ${(element as any).accept ? ` accept="${(element as any).accept}"` : ''}${(element as any).multiple ? ' multiple' : ''}${fRequired}${inputStyleAttr} />`;
      } else {
        const iType = element.type === 'form-input-email' ? 'email' : element.type === 'form-input-password' ? 'password' : element.type === 'form-input-number' ? 'number' : element.type === 'form-date' ? 'date' : 'text';
        inputControl = `${indent}  <input type="${iType}"${fIdAttr} name="${fName}" class="${fieldClass}" ${fPlaceholder}${fRequired}${inputStyleAttr} />`;
      }

      const helperHtml = element.inputHelpText ? `\n${indent}  <p style="font-size: 11px; opacity: 0.7; margin-top: 4px; text-align: ${fieldAlign};${(element as any).helperTextColor ? ` color: ${(element as any).helperTextColor};` : ''}${(element as any).helperTextFontSize ? ` font-size: ${(element as any).helperTextFontSize}px;` : ''}">${element.inputHelpText}</p>` : '';

      return `${fieldCss}\n${indent}<div style="margin-bottom: 16px; text-align: ${fieldAlign};">\n${labelHtml}${inputControl}${helperHtml}\n${indent}</div>`;
    }

    case 'form-submit': {
      const submitText = element.content || element.label || 'Submit Form';
      const submitBtnStyles = [
        'display: inline-flex; align-items: center; justify-content: center; padding: 12px 24px; border-radius: ' + ((element as any).formSubmitBorderRadius ?? 8) + 'px; font-weight: ' + ((element as any).formSubmitFontWeight || 600) + '; font-size: ' + ((element as any).formSubmitFontSize || 14) + 'px; background-color: ' + ((element as any).formSubmitBgColor || '#4f46e5') + '; color: ' + ((element as any).formSubmitTextColor || '#ffffff') + '; border: ' + ((element as any).formSubmitBorderWidth ?? 0) + 'px solid ' + ((element as any).formSubmitBorderColor || 'transparent') + '; cursor: pointer; transition: all 0.2s ease;',
        (element as any).formSubmitShadow ? `box-shadow: ${(element as any).formSubmitShadow};` : '',
        (element as any).formSubmitPaddingX !== undefined ? `padding-left: ${(element as any).formSubmitPaddingX}px; padding-right: ${(element as any).formSubmitPaddingX}px;` : '',
        (element as any).formSubmitPaddingY !== undefined ? `padding-top: ${(element as any).formSubmitPaddingY}px; padding-bottom: ${(element as any).formSubmitPaddingY}px;` : '',
        inlineCss
      ].filter(Boolean).join(' ');

      const btnClass = `form-submit-${element.id}`;
      let btnCss = '';
      if ((element as any).formSubmitHoverBgColor || (element as any).formSubmitHoverTextColor || (element as any).formSubmitHoverEffect) {
        btnCss = `\n${indent}<style>\n  .${btnClass}:hover { ${(element as any).formSubmitHoverBgColor ? `background-color: ${(element as any).formSubmitHoverBgColor} !important; ` : ''}${(element as any).formSubmitHoverTextColor ? `color: ${(element as any).formSubmitHoverTextColor} !important; ` : ''}${(element as any).formSubmitHoverEffect === 'scale' ? 'transform: scale(1.05); ' : ''}}\n</style>`;
      }

      return `${btnCss}\n${indent}<button type="submit" id="submit-btn-${element.id}" class="site-form-submit-btn ${btnClass}" style="${submitBtnStyles}">${submitText}</button>`;
    }

    default: {
      const defaultText = element.content || element.text || (element as any).description || (element as any).paragraph || (element as any).bodyText || (element as any).body || (element as any).title || (element as any).label || '';
      return `${indent}<div${styleAttr}>${cleanRedundantNestedSpansFromHtml(defaultText)}</div>`;
    }
  }
}

function renderElementsListToHtml(elements: WebsiteElement[], indent: string, shouldGroupForm = false, isLight = false): string {
  if (!elements || elements.length === 0) return '';

  return elements
    .map((el) => renderElementToHtml(el, indent, shouldGroupForm, isLight))
    .join('\n');
}

function renderSectionToHtml(section: WebsiteSection, pageIsLight = false): string {
  const s = section.styles || {};
  const sectionIsLight = (s.backgroundColor && s.backgroundColor !== 'transparent')
    ? !isColorDark(s.backgroundColor)
    : pageIsLight;
  const cssParts: string[] = [];

  const bgType =
    s.backgroundType ||
    (s.backgroundColor === 'transparent'
      ? 'transparent'
      : s.backgroundImage
      ? 'image'
      : s.backgroundGradient
      ? 'gradient'
      : 'solid');

  if (bgType === 'transparent') {
    cssParts.push('background-color: transparent');
  } else if (bgType === 'gradient' || s.backgroundGradient) {
    const grad =
      s.backgroundGradient ||
      `linear-gradient(${s.gradientAngle || 135}deg, ${s.gradientFrom || '#4f46e5'} 0%, ${s.gradientTo || '#06b6d4'} 100%)`;
    cssParts.push(`background-image: ${grad}`);
  } else if (bgType === 'image' && s.backgroundImage) {
    let overlayGrad = 'linear-gradient(to bottom, rgba(15, 23, 42, 0.82), rgba(15, 23, 42, 0.94))';
    if (s.backgroundOverlay === 'light') {
      overlayGrad = 'linear-gradient(to bottom, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.95))';
    } else if (s.backgroundOverlay === 'gradient') {
      overlayGrad = 'linear-gradient(135deg, rgba(79, 70, 229, 0.8), rgba(6, 182, 212, 0.8))';
    } else if (s.backgroundOverlay === 'none') {
      overlayGrad = '';
    } else if (s.backgroundOverlay && (s.backgroundOverlay.startsWith('linear-gradient') || s.backgroundOverlay.startsWith('rgba'))) {
      overlayGrad = s.backgroundOverlay;
    }

    const bgVal = overlayGrad ? `${overlayGrad}, url('${s.backgroundImage}')` : `url('${s.backgroundImage}')`;
    cssParts.push(`background-image: ${bgVal}`);
    cssParts.push(`background-size: ${s.backgroundSize || 'cover'}`);
    cssParts.push(`background-position: ${s.backgroundPosition || 'center'}`);
    cssParts.push(`background-repeat: ${s.backgroundRepeat || 'no-repeat'}`);
  } else if (s.backgroundColor) {
    cssParts.push(`background-color: ${s.backgroundColor}`);
  }

  if (s.textColor) {
    cssParts.push(`color: ${s.textColor}`);
  }
  if (s.paddingY !== undefined || s.paddingX !== undefined || s.paddingTop !== undefined || s.paddingBottom !== undefined || s.paddingLeft !== undefined || s.paddingRight !== undefined || s.padding !== undefined) {
    if (s.padding !== undefined) {
      cssParts.push(`padding: ${typeof s.padding === 'number' ? `${s.padding}px` : s.padding}`);
    } else {
      const pt = s.paddingTop ?? s.paddingY ?? (section.type === 'header' ? 16 : 64);
      const pb = s.paddingBottom ?? s.paddingY ?? (section.type === 'header' ? 16 : 64);
      const pl = s.paddingLeft ?? s.paddingX ?? 24;
      const pr = s.paddingRight ?? s.paddingX ?? 24;
      cssParts.push(`padding: ${pt}px ${pr}px ${pb}px ${pl}px`);
    }
  }

  const borderPosition = s.borderPosition || (section.type === 'header' ? 'bottom' : 'all');
  const bWidth = s.borderWidth !== undefined ? s.borderWidth : 0;
  const bColor = s.borderColor || '#334155';
  const bStyle = s.borderStyle || 'solid';

  if (bWidth > 0 && bStyle !== 'none' && borderPosition !== 'none') {
    if (borderPosition === 'bottom') {
      cssParts.push(`border-bottom: ${bWidth}px ${bStyle} ${bColor}`);
    } else if (borderPosition === 'top') {
      cssParts.push(`border-top: ${bWidth}px ${bStyle} ${bColor}`);
    } else if (borderPosition === 'top-bottom') {
      cssParts.push(`border-top: ${bWidth}px ${bStyle} ${bColor}; border-bottom: ${bWidth}px ${bStyle} ${bColor}`);
    } else {
      cssParts.push(`border: ${bWidth}px ${bStyle} ${bColor}`);
    }
  }

  if (s.borderRadius !== undefined && s.borderRadius > 0) {
    cssParts.push(`border-radius: ${s.borderRadius}px`);
  }

  if (s.minHeight !== undefined && s.minHeight !== 'auto') {
    cssParts.push(`min-height: ${typeof s.minHeight === 'number' ? `${s.minHeight}px` : s.minHeight}`);
  }
  if (s.overflow) {
    cssParts.push(`overflow: ${s.overflow}`);
  }
  if (s.opacity !== undefined && s.opacity < 1) {
    cssParts.push(`opacity: ${s.opacity}`);
  }
  if (s.backdropBlur && s.backdropBlur !== 'none') {
    const blurMap: Record<string, string> = {
      sm: 'blur(4px)',
      md: 'blur(12px)',
      lg: 'blur(20px)',
      xl: 'blur(32px)',
    };
    const bVal = blurMap[s.backdropBlur] || 'blur(12px)';
    cssParts.push(`backdrop-filter: ${bVal}; -webkit-backdrop-filter: ${bVal}`);
  }

  if (s.shadow && s.shadow !== 'none') {
    const shadowMap: Record<string, string> = {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    };
    const sh = shadowMap[s.shadow] || (s.shadow.includes('px') || s.shadow.includes('rgba') ? s.shadow : undefined);
    if (sh) cssParts.push(`box-shadow: ${sh}`);
  }

  const styleAttr = cssParts.length > 0 ? ` style="${cssParts.join('; ')}"` : '';

  let maxWidthCss = 'max-width: 1280px;';
  if (s.maxWidth === 'full') {
    maxWidthCss = 'width: 100%;';
  } else if (typeof s.maxWidth === 'number') {
    maxWidthCss = `max-width: ${s.maxWidth}px;`;
  } else if (typeof s.maxWidth === 'string') {
    const rawVal = s.maxWidth.trim();
    if (rawVal.endsWith('px') || rawVal.endsWith('ch') || rawVal.endsWith('%')) {
      maxWidthCss = `max-width: ${rawVal};`;
    } else if (!isNaN(Number(rawVal))) {
      maxWidthCss = `max-width: ${rawVal}px;`;
    } else {
      const map: Record<string, string> = {
        sm: '384px',
        md: '448px',
        lg: '512px',
        xl: '1400px',
        '2xl': '672px',
        '3xl': '768px',
        '4xl': '896px',
        '5xl': '1024px',
        '6xl': '1152px',
        '7xl': '1280px',
        prose: '65ch',
      };
      maxWidthCss = `max-width: ${map[rawVal] || '1280px'};`;
    }
  }

  if (section.type === 'header') {
    const layout = section.headerLayout || 'standard';
    const isSticky = section.isSticky !== false;

    const logoElements = section.elements.filter((el) => el.type === 'logo');
    const navLinks = section.elements.filter((el) => el.type === 'nav-link' || el.type === 'nav-links');
    const ctaButtons = section.elements.filter((el) => el.type === 'button');
    const primaryLogo = logoElements[0] || section.elements[0];

    const isCentered = layout === 'centered';
    const isStacked = layout === 'stacked';

    const headerContainerStyle = `display: flex; align-items: center; justify-content: space-between; ${maxWidthCss} ${isCentered ? 'flex-direction: column; text-align: center;' : ''}`;

    const navLinksHtml = navLinks.map((el) => renderElementToHtml(el, '        ', true, sectionIsLight)).join('\n');
    const ctaButtonsHtml = ctaButtons.map((el) => renderElementToHtml(el, '        ', true, sectionIsLight)).join('\n');

    const stickyClass = isSticky ? 'sticky-header' : '';
    const m = section.mobileMenuSettings || {};
    const h = section.hamburgerSettings || {};
    const openDir = m.openDirection || 'right';

    const hBg = h.backgroundColor !== 'transparent' ? h.backgroundColor || 'rgba(30, 41, 59, 0.8)' : 'transparent';
    const hColor = h.iconColor || '#e2e8f0';
    const hRad = h.borderRadius !== undefined ? `${h.borderRadius}px` : '10px';
    const hBw = h.borderWidth !== undefined ? `${h.borderWidth}px` : '1px';
    const hBc = h.borderColor || 'rgba(51, 65, 85, 1)';
    const hBs = h.borderStyle || 'solid';
    const hPx = h.paddingX !== undefined ? `${h.paddingX}px` : '10px';
    const hPy = h.paddingY !== undefined ? `${h.paddingY}px` : '8px';
    const hIconSize = h.iconSize || 20;

    const hShadowMap: Record<string, string> = {
      sm: '0 1px 2px rgba(0,0,0,0.1)',
      md: '0 4px 6px -1px rgba(0,0,0,0.2)',
      lg: '0 10px 15px -3px rgba(0,0,0,0.3)',
      xl: '0 20px 25px -5px rgba(0,0,0,0.4)',
    };
    const hBoxShadow = h.shadow ? hShadowMap[h.shadow] || 'none' : 'none';

    const hamburgerInlineStyles = ` style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; background-color: ${hBg}; color: ${hColor}; border-radius: ${hRad}; border: ${hBw} ${hBs} ${hBc}; padding: ${hPy} ${hPx}; box-shadow: ${hBoxShadow}; cursor: pointer; transition: all 0.2s ease;"`;

    const hLineThickness =
      h.lineThickness !== undefined
        ? h.lineThickness
        : h.iconThickness === 'thick'
        ? 3.5
        : h.iconThickness === 'thin'
        ? 1.5
        : 2;
    const hLineGap = h.lineGap !== undefined ? h.lineGap : 5;

    const hamburgerSvg = getHamburgerSvg(h.iconStyle, hIconSize, hLineThickness, hLineGap);
    let hamburgerInnerContent = hamburgerSvg;
    if (h.showLabel && h.labelText) {
      const labelSpan = `<span style="font-size: 13px; font-weight: 600;">${h.labelText}</span>`;
      hamburgerInnerContent =
        h.labelPosition === 'left'
          ? `${labelSpan} ${hamburgerSvg}`
          : `${hamburgerSvg} ${labelSpan}`;
    }

    const drawerW = typeof m.drawerWidth === 'number'
      ? (m.drawerWidth <= 100 ? `${m.drawerWidth}vw` : `${m.drawerWidth}px`)
      : typeof m.drawerWidth === 'string'
      ? m.drawerWidth
      : '80vw';
    const menuBgColor = m.backgroundColor && m.backgroundColor !== 'transparent' ? m.backgroundColor : '#0f172a';
    const mobileMenuInlineStyles = ` style="background-color: ${menuBgColor}; width: ${drawerW}; max-width: 100vw;"`;

    let backdropBg = 'rgba(0, 0, 0, 0.6)';
    let backdropBlur = 'blur(4px)';
    if (m.backdropDim === 'none') {
      backdropBg = 'transparent';
      backdropBlur = 'none';
    } else if (m.backdropDim === 'light') {
      backdropBg = 'rgba(0, 0, 0, 0.3)';
      backdropBlur = 'blur(2px)';
    } else if (m.backdropDim === 'heavy') {
      backdropBg = 'rgba(0, 0, 0, 0.85)';
      backdropBlur = 'blur(8px)';
    } else if (m.backdropDim === 'custom') {
      const customHex = m.backdropCustomColor || '#000000';
      const customOpacity = (m.backdropCustomOpacity !== undefined ? m.backdropCustomOpacity : 50) / 100;
      const r = parseInt(customHex.slice(1, 3) || '0', 16) || 0;
      const g = parseInt(customHex.slice(3, 5) || '0', 16) || 0;
      const b = parseInt(customHex.slice(5, 7) || '0', 16) || 0;
      backdropBg = `rgba(${r}, ${g}, ${b}, ${customOpacity})`;
      const blurPx = m.backdropCustomBlur !== undefined ? m.backdropCustomBlur : 6;
      backdropBlur = blurPx > 0 ? `blur(${blurPx}px)` : 'none';
    }
    const backdropInlineStyles = ` style="background-color: ${backdropBg}; backdrop-filter: ${backdropBlur}; -webkit-backdrop-filter: ${backdropBlur};"`;

    const cs = m.closeSettings || {};
    const closeType = cs.closeType || m.closeType || 'icon';
    const closeText = cs.closeText || m.closeText || 'Close';
    const closeIconStyle = cs.closeIconStyle || m.closeIconStyle || 'standard';
    const closeBg = cs.backgroundColor && cs.backgroundColor !== 'transparent' ? cs.backgroundColor : 'transparent';
    const closeColor = cs.textColor || m.closeIconColor || '#ffffff';
    const closeBw = cs.borderWidth !== undefined ? `${cs.borderWidth}px` : '0px';
    const closeBc = cs.borderColor || 'rgba(255,255,255,0.2)';
    const closeRad = cs.borderRadius !== undefined ? `${cs.borderRadius}px` : '8px';
    const closePx = cs.paddingX !== undefined ? `${cs.paddingX}px` : '8px';
    const closePy = cs.paddingY !== undefined ? `${cs.paddingY}px` : '6px';
    const closeFw = cs.fontWeight || '600';

    const closeBtnStyle = ` style="background-color: ${closeBg}; color: ${closeColor}; border: ${closeBw} solid ${closeBc}; border-radius: ${closeRad}; padding: ${closePy} ${closePx}; font-weight: ${closeFw}; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s ease;"`;

    let closeBtnHtml = '';
    const iconThickness = cs.iconThickness !== undefined ? cs.iconThickness : 2;
    const closeSvg = getCloseSvg(closeIconStyle, 18, iconThickness);
    if (closeType === 'text') {
      closeBtnHtml = `<span style="font-size: 13px; font-weight: ${closeFw}; letter-spacing: 0.5px;">${closeText}</span>`;
    } else if (closeType === 'icon-text') {
      closeBtnHtml = `${closeSvg}<span style="font-size: 13px; font-weight: ${closeFw};">${closeText}</span>`;
    } else {
      closeBtnHtml = closeSvg;
    }

    const linkAlign = m.textAlign || 'left';
    let linkFzPx = '18px';
    if (typeof m.linkFontSize === 'number') {
      linkFzPx = m.linkFontSize <= 5 ? `${Math.round(m.linkFontSize * 16)}px` : `${m.linkFontSize}px`;
    } else if (m.linkFontSizeRem !== undefined) {
      linkFzPx = `${Math.round(m.linkFontSizeRem * 16)}px`;
    }
    const linkColor = m.linkTextColor || '#e2e8f0';
    const linkGap = m.linkSpacing || 16;
    const mobileNavStyle = ` style="text-align: ${linkAlign}; font-size: ${linkFzPx}; color: ${linkColor}; gap: ${linkGap}px;"`;

    const showCtaInDrawer = m.showCta !== false;

    const allElementsHtml = section.elements.map((el) => renderElementToHtml(el, '      ', true, sectionIsLight)).join('\n');

    return `  <!-- Section: ${section.title} -->
  <header id="${section.id}" class="site-header ${stickyClass}"${styleAttr}>
    ${
      isStacked
        ? `<div class="top-bar container" style="${maxWidthCss}">
      <span class="text-accent">✨ Next-Gen Experience Platform</span>
      <div class="top-bar-links">
        <span>Support 24/7</span>
        <span>English (US)</span>
      </div>
    </div>`
        : ''
    }
    <div class="container" style="${headerContainerStyle}">
${allElementsHtml}

      <!-- Hamburger Menu Button -->
      <div class="mobile-toggle">
        <button onclick="document.getElementById('mobile-menu-${section.id}').classList.toggle('open')" class="menu-btn" aria-label="Toggle navigation"${hamburgerInlineStyles}>
          ${hamburgerInnerContent}
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Menu Overlay -->
  <div id="mobile-menu-${section.id}" class="mobile-menu-overlay dir-${openDir}">
    <div class="mobile-menu-backdrop"${backdropInlineStyles} onclick="document.getElementById('mobile-menu-${section.id}').classList.remove('open')"></div>
    <div class="mobile-menu-panel"${mobileMenuInlineStyles}>
      <div class="mobile-menu-header">
        <button onclick="document.getElementById('mobile-menu-${section.id}').classList.remove('open')" class="close-menu-btn" aria-label="Close navigation"${closeBtnStyle}>
          ${closeBtnHtml}
        </button>
      </div>
      <nav class="mobile-nav-links"${mobileNavStyle}>
${navLinksHtml}
      </nav>
      ${
        showCtaInDrawer
          ? `<div class="mobile-cta">
${ctaButtonsHtml}
      </div>`
          : ''
      }
    </div>
  </div>`;
  }

  if (section.type === 'footer') {
    const layout = section.footerLayout || 'columns-4';

    const alignMode = s.alignment || s.contentAlignment || 'left';
    let textAlignCss = 'text-align: left;';
    if (alignMode === 'center') textAlignCss = 'text-align: center;';
    else if (alignMode === 'right') textAlignCss = 'text-align: right;';

    const layoutColumns = s.layoutColumns || (
      layout === 'columns-3' || (layout as string) === 'columns3' ? '3' :
      layout === 'minimal' || layout === 'centered' ? '1' :
      layout === 'split' ? '2' :
      (section.elements.length > 1 ? (layout === 'columns-4' ? '4' : '1') : '1')
    );

    let gapCss = '';
    if (s.gap !== undefined) {
      gapCss = `gap: ${s.gap}px;`;
    }

    const isReversed = s.reverseLayout === true;

    const verticalAlign = s.alignItems || 'top';
    let verticalAlignCss = 'flex-start';
    if (verticalAlign === 'center') verticalAlignCss = 'center';
    else if (verticalAlign === 'flex-end' || verticalAlign === 'bottom') verticalAlignCss = 'flex-end';
    else if (verticalAlign === 'stretch') verticalAlignCss = 'stretch';

    let footerInlineStyle = '';

    if (!s.layoutColumns && layout === 'minimal') {
      footerInlineStyle = [`width: 100%; margin: 0 auto; box-sizing: border-box; display: flex; flex-direction: row; justify-content: space-between; align-items: center;`, gapCss, maxWidthCss, textAlignCss].filter(Boolean).join(' ');
    } else if (!s.layoutColumns && layout === 'centered') {
      footerInlineStyle = [`width: 100%; margin: 0 auto; box-sizing: border-box; display: flex; flex-direction: column; align-items: center;`, textAlignCss, gapCss, maxWidthCss].filter(Boolean).join(' ');
    } else if (layoutColumns === '1') {
      footerInlineStyle = [
        'width: 100%; margin: 0 auto; box-sizing: border-box;',
        textAlignCss,
        isReversed ? 'display: flex; flex-direction: column-reverse;' : '',
        verticalAlign !== 'top' ? `align-items: ${verticalAlignCss};` : '',
        gapCss,
        maxWidthCss
      ].filter(Boolean).join(' ');
    } else {
      let gridTemplateCols = 'repeat(auto-fit, minmax(280px, 1fr))';
      if (layoutColumns === '2') {
        const ratio = s.columnRatio || (layout === 'split' ? '1:2' : '1:1');
        if (ratio === '1:2') gridTemplateCols = '1fr 2fr';
        else if (ratio === '2:1') gridTemplateCols = '2fr 1fr';
        else if (ratio === '1:3') gridTemplateCols = '1fr 3fr';
        else if (ratio === '3:1') gridTemplateCols = '3fr 1fr';
        else gridTemplateCols = 'repeat(auto-fit, minmax(280px, 1fr))';
      } else if (layoutColumns === '3') {
        const ratio = s.columnRatio || '1:1:1';
        if (ratio === '1:2:1') gridTemplateCols = '1fr 2fr 1fr';
        else if (ratio === '2:1:1') gridTemplateCols = '2fr 1fr 1fr';
        else if (ratio === '1:1:2') gridTemplateCols = '1fr 1fr 2fr';
        else gridTemplateCols = 'repeat(auto-fit, minmax(240px, 1fr))';
      } else if (layoutColumns === '4') {
        gridTemplateCols = 'repeat(auto-fit, minmax(200px, 1fr))';
      }

      footerInlineStyle = [
        'width: 100%; margin: 0 auto; box-sizing: border-box;',
        'display: grid;',
        `grid-template-columns: ${gridTemplateCols};`,
        `align-items: ${verticalAlignCss};`,
        gapCss,
        maxWidthCss,
        textAlignCss,
        isReversed ? 'direction: rtl;' : ''
      ].filter(Boolean).join(' ');
    }

    const elementsHtml = renderElementsListToHtml(section.elements, '    ', true, sectionIsLight);

    return `  <!-- Section: ${section.title} -->
  <footer id="${section.id}"${styleAttr}>
    <div style="${footerInlineStyle}">
${elementsHtml}
    </div>
  </footer>`;
  }

  const alignMode = s.alignment || s.contentAlignment || 'center';
  let textAlignCss = 'text-align: center;';
  if (alignMode === 'left') textAlignCss = 'text-align: left;';
  else if (alignMode === 'right') textAlignCss = 'text-align: right;';
  else if (alignMode === 'none') textAlignCss = 'text-align: left;';

  const layoutColumns = s.layoutColumns || (
    section.type === 'image-text' || section.type === 'video-text' ? '2' :
    section.type === 'features' || section.type === 'pricing' || section.type === 'team' || section.type === 'testimonials' ? '3' :
    '1'
  );

  let gapCss = '';
  if (s.gap !== undefined) {
    gapCss = `gap: ${s.gap}px;`;
  }

  const isReversed = s.reverseLayout === true;

  const verticalAlign = s.alignItems || 'center';
  let verticalAlignCssVal = 'center';
  if (verticalAlign === 'flex-start' || verticalAlign === 'top') {
    verticalAlignCssVal = 'flex-start';
  } else if (verticalAlign === 'flex-end' || verticalAlign === 'bottom') {
    verticalAlignCssVal = 'flex-end';
  } else if (verticalAlign === 'stretch') {
    verticalAlignCssVal = 'stretch';
  }

  let containerInlineStyle = '';

  if (layoutColumns === '1') {
    containerInlineStyle = [
      'width: 100%; margin: 0 auto; box-sizing: border-box;',
      textAlignCss,
      isReversed ? 'display: flex; flex-direction: column-reverse;' : '',
      gapCss,
      maxWidthCss
    ].filter(Boolean).join(' ');
  } else {
    let gridTemplateCols = 'repeat(auto-fit, minmax(280px, 1fr))';
    if (layoutColumns === '2') {
      const ratio = s.columnRatio || '1:1';
      if (ratio === '1:2') gridTemplateCols = '1fr 2fr';
      else if (ratio === '2:1') gridTemplateCols = '2fr 1fr';
      else if (ratio === '1:3') gridTemplateCols = '1fr 3fr';
      else if (ratio === '3:1') gridTemplateCols = '3fr 1fr';
      else gridTemplateCols = 'repeat(auto-fit, minmax(280px, 1fr))';
    } else if (layoutColumns === '3') {
      const ratio = s.columnRatio || '1:1:1';
      if (ratio === '1:2:1') gridTemplateCols = '1fr 2fr 1fr';
      else if (ratio === '2:1:1') gridTemplateCols = '2fr 1fr 1fr';
      else if (ratio === '1:1:2') gridTemplateCols = '1fr 1fr 2fr';
      else gridTemplateCols = 'repeat(auto-fit, minmax(240px, 1fr))';
    } else if (layoutColumns === '4') {
      gridTemplateCols = 'repeat(auto-fit, minmax(200px, 1fr))';
    }

    containerInlineStyle = [
      'width: 100%; margin: 0 auto; box-sizing: border-box;',
      'display: grid;',
      `grid-template-columns: ${gridTemplateCols};`,
      gapCss,
      `align-items: ${verticalAlignCssVal};`,
      textAlignCss,
      maxWidthCss,
      isReversed ? 'direction: rtl;' : ''
    ].filter(Boolean).join(' ');
  }

  const elementsHtml = renderElementsListToHtml(section.elements, '      ', true, sectionIsLight);

  return `    <!-- Section: ${section.title} -->
    <section id="${section.anchorId || section.id}"${styleAttr}>
      <div style="${containerInlineStyle}">
${elementsHtml}
      </div>
    </section>`;
}

const GOOGLE_FONT_PARAMS: Record<string, string> = {
  'Hind': 'family=Hind:wght@300;400;500;600;700',
  'Inter': 'family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900',
  'Playfair Display': 'family=Playfair+Display:ital,wght@0,400..900;1,400..900',
  'Outfit': 'family=Outfit:wght@100..900',
  'Plus Jakarta Sans': 'family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800',
  'Space Grotesk': 'family=Space+Grotesk:wght@300..700',
  'Poppins': 'family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900',
  'Lora': 'family=Lora:ital,wght@0,400..700;1,400..700',
  'Cinzel': 'family=Cinzel:wght@400..900',
  'Syne': 'family=Syne:wght@400..800',
  'Fira Code': 'family=Fira+Code:wght@300..700',
  'Cal Sans': 'family=Cal+Sans',
  'DM Mono': 'family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500',
  'Elms Sans': 'family=Elms+Sans:ital,wght@0,100..900;1,100..900',
  'Figtree': 'family=Figtree:ital,wght@0,300..900;1,300..900',
  'Geist': 'family=Geist:wght@100..900',
  'Livvic': 'family=Livvic:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,900',
  'Manrope': 'family=Manrope:wght@200..800',
  'Noto Sans': 'family=Noto+Sans:ital,wght@0,100..900;1,100..900',
  'PT Sans': 'family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700',
  'Red Hat Display': 'family=Red+Hat+Display:ital,wght@0,300..900;1,300..900',
  'Red Hat Mono': 'family=Red+Hat+Mono:ital,wght@0,300..700;1,300..700',
  'Ubuntu Sans Mono': 'family=Ubuntu+Sans+Mono:ital,wght@0,400..700;1,400..700',
  'Victor Mono': 'family=Victor+Mono:ital,wght@0,100..700;1,100..700',
  'DM Serif Display': 'family=DM+Serif+Display:ital@0;1',
  'Wix Madefor Display': 'family=Wix+Madefor+Display:wght@400..800',
};

export function getUsedGoogleFontsLink(page: WebsitePage): string {
  const usedFonts = new Set<string>();

  const webSafeFonts = new Set([
    'arial', 'times new roman', 'georgia', 'courier new', 'trebuchet ms',
    'verdana', 'system-ui', 'sans-serif', 'serif', 'monospace', 'cursive', 'inherit',
    'book antiqua', 'palatino', 'palatino linotype', 'garamond', 'bookman', 'comic sans ms',
    'impact', 'lucida sans unicode', 'tahoma', 'geneva', 'helvetica', 'courier'
  ]);

  const addFont = (fontName: any) => {
    if (fontName && typeof fontName === 'string') {
      const clean = fontName.replace(/['"]/g, '').trim();
      if (!clean) return;

      const foundFont = ALL_FONTS.find(f =>
        f.name.toLowerCase() === clean.toLowerCase() ||
        f.id.toLowerCase() === clean.toLowerCase() ||
        f.family.toLowerCase().includes(`'${clean.toLowerCase()}'`)
      );

      if (foundFont?.isWebSafe) {
        return;
      }

      if (!webSafeFonts.has(clean.toLowerCase())) {
        usedFonts.add(clean);
      }
    }
  };

  addFont(page.globalStyles?.fontFamily);
  if ((page as any).globalStyles) {
    addFont((page as any).globalStyles.bodyFont);
    addFont((page as any).globalStyles.headingFont);
  }

  const processElement = (el: any) => {
    if (!el) return;
    addFont(el.styles?.typeface);
    addFont(el.styles?.fontFamily);
    addFont(el.styles?.labelTypeface);
    addFont(el.styles?.textTypeface);
    addFont(el.labelTypeface);
    addFont(el.textTypeface);

    if (el.content && typeof el.content === 'string') {
      const inlineFontRegex = /font-family:\s*([^;"]+)/gi;
      let match;
      while ((match = inlineFontRegex.exec(el.content)) !== null) {
        const rawValue = match[1];
        const firstFont = rawValue.split(',')[0].replace(/['"]/g, '').trim();
        if (firstFont) {
          addFont(firstFont);
        }
      }
    }

    if (el.children && Array.isArray(el.children)) {
      el.children.forEach(processElement);
    }
  };

  page.sections.forEach((sec) => {
    addFont(sec.styles?.typeface);
    addFont((sec.styles as any)?.fontFamily);
    sec.elements?.forEach(processElement);
  });

  const fontParams: string[] = [];
  usedFonts.forEach((fontName) => {
    if (GOOGLE_FONT_PARAMS[fontName]) {
      fontParams.push(GOOGLE_FONT_PARAMS[fontName]);
    } else {
      const formattedName = fontName.replace(/\s+/g, '+');
      const foundFont = ALL_FONTS.find(f => f.name.toLowerCase() === fontName.toLowerCase());
      if (foundFont && foundFont.weights && foundFont.weights.length > 0) {
        const weightsStr = foundFont.weights.join(';');
        fontParams.push(`family=${formattedName}:wght@${weightsStr}`);
      } else {
        fontParams.push(`family=${formattedName}:wght@400;700`);
      }
    }
  });

  if (fontParams.length === 0) {
    fontParams.push(GOOGLE_FONT_PARAMS['Hind']);
  }

  return `  <link rel="preconnect" href="https://fonts.googleapis.com" />\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n  <link href="https://fonts.googleapis.com/css2?${fontParams.join('&')}&display=swap" rel="stylesheet" />`;
}

export function extractFormFields(page: WebsitePage): string[] {
  const fields = new Set<string>();

  const processElement = (el: WebsiteElement) => {

    if (el.type === 'form' && el.formFields) {
      el.formFields.forEach((f: any) => {
        const name = f.name || (f.label ? f.label.toLowerCase().replace(/[^a-z0-9_]/g, '_') : `field_${f.id}`);
        fields.add(name);
      });
    }

    const standaloneInputTypes = [
      'form-input-text', 'form-textarea', 'form-input-email', 'form-input-password',
      'form-input-number', 'form-select', 'form-checkbox', 'form-radio',
      'form-date', 'form-file'
    ];

    if (standaloneInputTypes.includes(el.type)) {
      const name = (el as any).name || (el.label ? el.label.toLowerCase().replace(/[^a-z0-9_]/g, '_') : (el.inputLabel ? el.inputLabel.toLowerCase().replace(/[^a-z0-9_]/g, '_') : `field_${el.id}`));
      fields.add(name);
    }

    if (el.children) {
      el.children.forEach(processElement);
    }

    if ((el as any).elements) {
      (el as any).elements.forEach(processElement);
    }
  };

  page.sections.forEach(section => {
    section.elements.forEach(processElement);
  });

  return Array.from(fields);
}

export function generatePackageJson(page: WebsitePage): string {
  const brand = getBrandInfo();
  const rawPkgName = page.siteSettings?.title || page.title || brand.name || 'my-website';
  const name = rawPkgName
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'my-website';

  const authorString = brand.name
    ? `${brand.name}${brand.email ? ` <${brand.email}>` : ''}${brand.website ? ` (${brand.website})` : ''}`
    : undefined;

  const pkg: Record<string, any> = {
    name,
    version: '1.0.0',
    description: page.siteSettings?.description || brand.description || (brand.name ? `${brand.name} — ${brand.tagline || 'Website'}` : 'Website project'),
    license: 'MIT',
    scripts: {
      'dev': 'vercel dev',
      'deploy': 'vercel --prod'
    },
    dependencies: {
      'firebase-admin': '^12.0.0',
      'nodemailer': '^6.9.13'
    },
    engines: {
      'node': '20.x'
    }
  };

  if (authorString) pkg.author = authorString;
  if (brand.website) pkg.homepage = brand.website;
  if (brand.github) {
    const repoUrl = brand.github.startsWith('http') ? brand.github : `https://${brand.github.replace(/^github\.com\//i, '')}`;
    pkg.repository = { type: 'git', url: repoUrl };
  }
  if (brand.email) {
    pkg.bugs = { email: brand.email };
  }
  const keywordsStr = page.siteSettings?.keywords || brand.industry;
  if (keywordsStr) {
    pkg.keywords = keywordsStr.split(',').map((k) => k.trim()).filter(Boolean);
  }

  return cleanExportedCodeFormat(JSON.stringify(pkg, null, 2));
}

export function generateManifestJson(page: WebsitePage): string {
  const brand = getBrandInfo();
  const name = brand.name || page.siteSettings?.title || page.title || 'My Website';
  const shortName = (brand.name || page.title || 'App').slice(0, 15);
  const themeColor = page.siteSettings?.themeColor || brand.themeColor || '#4f46e5';
  const iconUrl = page.siteSettings?.appleTouchIcon || page.siteSettings?.faviconUrl || brand.faviconUrl;

  const manifest: Record<string, any> = {
    name,
    short_name: shortName,
    description: page.siteSettings?.description || brand.description || (brand.name ? `${brand.name} — ${brand.tagline || 'Website'}` : 'Modern Web Application'),
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: themeColor,
    icons: iconUrl ? [
      {
        src: iconUrl,
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: iconUrl,
        sizes: '512x512',
        type: 'image/png'
      }
    ] : []
  };

  return cleanExportedCodeFormat(JSON.stringify(manifest, null, 2));
}

export function generateVercelJson(): string {
  return cleanExportedCodeFormat(JSON.stringify({
    functions: {
      "api/*.js": {
        memory: 256,
        maxDuration: 10
      }
    }
  }, null, 2));
}

export function cleanExportedCodeFormat(code: string): string {
  if (!code) return '';
  let cleaned = code.replace(/<!--[\s\S]*?-->/g, '');
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');  const lines = cleaned.split('\n').map((line) => {
    let processedLine = line;
    const commentIdx = processedLine.indexOf('//');
    if (commentIdx !== -1) {
      const prefix = processedLine.slice(0, commentIdx);
      if (!prefix.endsWith('http:') && !prefix.endsWith('https:')) {
        processedLine = prefix;
      }
    }
    return processedLine.trimStart();
  });
  return lines.filter((line, idx, arr) => {
    if (line === '' && (idx === 0 || arr[idx - 1] === '')) return false;
    return true;
  }).join('\n');
}

export function generateSubmitFormApi(page: WebsitePage): string {
  const formFields = extractFormFields(page);

  const extractionLogic = formFields.length > 0
    ? formFields.map(f => `    const ${f} = (body.${f} || '').toString().trim();`).join('\n')
    : '    // No specific form fields detected on page';

  const validationLogic = formFields.includes('email')
    ? `    if (body.email) {\n      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n      if (!emailRegex.test(body.email.toString()) || body.email.toString().length > 254) {\n        return res.status(422).json({ success: false, error: 'Please enter a valid email address.' });\n      }\n    }`
    : '';

  const dataPayload = formFields.length > 0
    ? formFields.map(f => `${f}`).join(', ')
    : '...body';

  const hasAnyContentLogic = formFields.length > 0
    ? `${formFields.map(f => `${f}`).join(' || ')} || Object.keys(body).length > 0`
    : `Object.keys(body).length > 0`;

  return cleanExportedCodeFormat(`const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

let db = null;

function initializeFirebase() {
  if (db) return db;
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const databaseURL = process.env.FIREBASE_DATABASE_URL;

    if (projectId && clientEmail && privateKey) {
      try {
        const appConfig = {
          credential: admin.credential.cert({
            projectId: projectId,
            clientEmail: clientEmail,
            privateKey: privateKey.replace(/\\\\n/g, '\\\\n'),
          }),
        };
        if (databaseURL) appConfig.databaseURL = databaseURL;
        admin.initializeApp(appConfig);
        db = admin.firestore();
      } catch (err) {
        console.error('Firebase Admin init error:', err);
      }
    }
  } else {
    db = admin.firestore();
  }
  return db;
}

async function storeSubmission(payload) {
  const firestore = initializeFirebase();
  if (!firestore) {
    throw new Error('Database service not configured. Please check environment variables.');
  }

  const docRef = await firestore.collection('submissions').add({
    ...payload,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  try {
    const leadPayload = { ...payload, createdAt: admin.firestore.FieldValue.serverTimestamp() };
    await firestore.collection('leads').add(leadPayload);
    await firestore.collection('contactSubmissions').add(leadPayload);
  } catch (_) {}

  return docRef.id;
}

async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    if (body._hp || body._gotcha || body.honeypot || body.website_url) {
      return res.status(400).json({ success: false, error: 'Spam submission blocked.' });
    }

${extractionLogic}

${validationLogic}

    const hasAnyContent = ${hasAnyContentLogic};
    if (!hasAnyContent) {
      return res.status(422).json({ success: false, error: 'Form is empty.' });
    }

    const submissionId = await storeSubmission({
      formId: body.formId || 'contact_form',
      pageTitle: body.pageTitle || 'Published Website',
      sourcePage: body.pageTitle || 'Published Website',
      status: 'new',
      data: { ${dataPayload} },
      submittedAt: new Date().toISOString(),
      source: 'serverless_api',
    });

    try {
      const { formNotificationGmailEnabled, formNotificationTelegramEnabled } = body;
      const submittedData = { ${dataPayload} };
      const notificationContent = [
        \`New Form Submission: \${body.pageTitle || 'Website Form'}\`,
        '-----------------------------------------',
        Object.entries(submittedData).map(([k, v]) => \`\${k}: \${v}\`).join('\\n'),
        '-----------------------------------------',
        \`Submitted at: \${new Date().toLocaleString()}\`,
      ].join('\\n');

      if (formNotificationGmailEnabled) {
        const gmailUser = process.env.SMTP_USER;
        const gmailPass = process.env.SMTP_PASS;
        const smtpHost = process.env.SMTP_HOST || '';
        const rawPort = process.env.SMTP_PORT || '';
        const smtpPort = rawPort ? Number(rawPort) : undefined;
        if (gmailUser && gmailPass) {
          const transporter = nodemailer.createTransport({
            ...(smtpHost ? { host: smtpHost } : {}),
            ...(smtpPort ? { port: smtpPort, secure: smtpPort === 465 } : {}),
            auth: { user: gmailUser, pass: gmailPass },
          });

          await transporter.sendMail({
            from: \`"Website Form" <\${gmailUser}>\`,
            to: gmailUser,
            subject: \`New Submission: \${body.pageTitle || 'Website Form'}\`,
            text: notificationContent,
          });
        }
      }

      if (formNotificationTelegramEnabled) {
        const tgToken = process.env.TELEGRAM_BOT_TOKEN;
        const tgChatId = process.env.TELEGRAM_CHAT_ID;
        if (tgToken && tgChatId) {
          await fetch(\`https://api.telegram.org/bot\${tgToken}/sendMessage\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: tgChatId,
              text: notificationContent,
            }),
          });
        }
      }
    } catch (notifErr) {
      console.warn('Form notification delivery error (submission saved successfully):', notifErr);
    }

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
      submissionId,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Submit form error:', err);
    return res.status(err.message.includes('configured') ? 503 : 500).json({
      success: false,
      error: err.message || 'Error processing form submission.'
    });
  }
}

module.exports = handler;
module.exports.default = handler;
`);
}

function isColorDark(colorStr?: string): boolean {
  if (!colorStr || colorStr === 'transparent') return false;
  const str = colorStr.trim().toLowerCase();
  if (str === '#fff' || str === '#ffffff' || str === 'white') return false;
  if (str === '#000' || str === '#000000' || str === 'black') return true;
  if (str.startsWith('#')) {
    let c = str.slice(1);
    if (c.length === 3) c = c.split('').map((x) => x + x).join('');
    if (c.length >= 6) {
      const r = parseInt(c.slice(0, 2), 16) || 0;
      const g = parseInt(c.slice(2, 4), 16) || 0;
      const b = parseInt(c.slice(4, 6), 16) || 0;
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance < 0.5;
    }
  }
  if (str.startsWith('rgb')) {
    const m = str.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/);
    if (m) {
      const r = parseFloat(m[1]) || 0;
      const g = parseFloat(m[2]) || 0;
      const b = parseFloat(m[3]) || 0;
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance < 0.5;
    }
  }
  return false;
}

export function generateFullHtml(page: WebsitePage): string {
  const websiteConfig = getWebsiteConfig();
  const g = page.globalStyles;
  const s = page.siteSettings;
  const palette: PaletteConfig | undefined = s?.palette || websiteConfig.palette;
  const isLight = g?.themeMode === 'light' || (!g?.themeMode && (!g?.backgroundColor || g?.backgroundColor === '#ffffff' || g?.backgroundColor === 'white' || !isColorDark(g?.backgroundColor)));
  const defaultBgColor = isLight ? '#ffffff' : '#0f172a';
  const defaultTextColor = isLight ? '#0f172a' : '#f1f5f9';

  const headerSections = page.sections.filter((sec) => !sec.hidden && sec.type === 'header');
  const footerSections = page.sections.filter((sec) => !sec.hidden && sec.type === 'footer');
  const bodySections = page.sections.filter((sec) => !sec.hidden && sec.type !== 'header' && sec.type !== 'footer');

  const headerHtml = headerSections.map((sec) => renderSectionToHtml(sec, isLight)).join('\n\n');
  const bodyHtml = bodySections.map((sec) => renderSectionToHtml(sec, isLight)).join('\n\n');
  const footerHtml = footerSections.map((sec) => renderSectionToHtml(sec, isLight)).join('\n\n');

  const brand = getBrandInfo();

  const isGenericTitle = !s?.title || s.title === 'Home' || s.title === 'My High-Conversion Website' || s.title === 'My Website';
  const metaTitle = (isGenericTitle && brand.name)
    ? `${page.title || 'Home'} | ${brand.name}`
    : (s?.title || page.title || brand.name || 'Website');

  const rawDesc = s?.description || brand.description || (brand.name ? `${brand.name} — ${brand.tagline || 'Official Website'}` : '');
  const metaDesc = rawDesc ? `  <meta name="description" content="${rawDesc.replace(/"/g, '&quot;')}" />\n` : '';

  const rawKeywords = s?.keywords || (brand.industry ? `${brand.name}, ${brand.industry}, web design, responsive, modern ui` : '');
  const metaKeywords = rawKeywords ? `  <meta name="keywords" content="${rawKeywords.replace(/"/g, '&quot;')}" />\n` : '';

  const rawAuthor = s?.author || brand.name;
  const authorMeta = rawAuthor ? `  <meta name="author" content="${rawAuthor.replace(/"/g, '&quot;')}" />\n` : '';

  const robotsVal = s?.robots || 'index, follow';
  const robotsMeta = `  <meta name="robots" content="${robotsVal}" />\n`;

  const domainUrl = getEffectiveDomainUrl(websiteConfig);
  const effectiveBaseUrl = (domainUrl && domainUrl !== '#') ? domainUrl.replace(/\/$/, '') : (brand.website ? brand.website.replace(/\/$/, '') : '');

  const defaultDomain = websiteConfig.hosting?.vercelDeployment?.deploymentUrl?.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '') || '';
  const customDomain = (websiteConfig.domain?.customDomain || websiteConfig.domain?.attachedDomains?.find((d: any) => d.isPrimary)?.domain || '')
    .trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  let rawCanonical = s?.canonicalUrl || '';
  if (customDomain) {
    if (rawCanonical && defaultDomain && defaultDomain !== customDomain) {
      rawCanonical = rawCanonical
        .replace(new RegExp(`https?://${defaultDomain}`, 'gi'), `https://${customDomain}`)
        .replace(new RegExp(`^${defaultDomain}`, 'gi'), customDomain);
    }
    if (!rawCanonical && effectiveBaseUrl) {
      rawCanonical = `${effectiveBaseUrl}/${page.fileName || ''}`;
    }
  } else if (!rawCanonical && effectiveBaseUrl) {
    rawCanonical = `${effectiveBaseUrl}/${page.fileName || ''}`;
  }

  const canonicalMeta = rawCanonical ? `  <link rel="canonical" href="${rawCanonical}" />\n` : '';

  const faviconUrl = s?.faviconUrl || brand.faviconUrl;
  const faviconDarkUrl = s?.faviconDarkUrl || brand.faviconDarkUrl;
  const faviconLink = faviconUrl
    ? (faviconDarkUrl
        ? `  <link rel="icon" href="${faviconUrl}" media="(prefers-color-scheme: light)" />\n  <link rel="icon" href="${faviconDarkUrl}" media="(prefers-color-scheme: dark)" />\n`
        : `  <link rel="icon" href="${faviconUrl}" />\n`)
    : '';

  const appleTouchUrl = s?.appleTouchIcon || brand.appleTouchIcon || brand.faviconUrl;
  const appleTouchLink = appleTouchUrl ? `  <link rel="apple-touch-icon" href="${appleTouchUrl}" />\n` : '';

  const themeColorVal = s?.themeColor || brand.themeColor || '#4f46e5';
  const themeColorMeta = `  <meta name="theme-color" content="${themeColorVal}" />\n`;
  const manifestMeta = `  <link rel="manifest" href="manifest.json" />\n`;

  const googleFontsLink = getUsedGoogleFontsLink(page);

  const ogTitle = s?.ogTitle || metaTitle;
  const ogDesc = s?.ogDescription || rawDesc;
  const ogImgUrl = s?.ogImage || brand.logoUrl;
  const ogImg = ogImgUrl ? `  <meta property="og:image" content="${ogImgUrl}" />\n` : '';
  const ogType = s?.ogType || 'website';
  const ogSiteName = s?.ogSiteName || brand.name;
  const ogSiteNameMeta = ogSiteName ? `  <meta property="og:site_name" content="${ogSiteName.replace(/"/g, '&quot;')}" />\n` : '';
  const ogUrlMeta = rawCanonical ? `  <meta property="og:url" content="${rawCanonical}" />\n` : '';
  const ogMeta = `  <meta property="og:title" content="${ogTitle.replace(/"/g, '&quot;')}" />\n  <meta property="og:type" content="${ogType}" />\n${ogDesc ? `  <meta property="og:description" content="${ogDesc.replace(/"/g, '&quot;')}" />\n` : ''}${ogImg}${ogSiteNameMeta}${ogUrlMeta}`;

  const twitterCard = s?.twitterCard || 'summary_large_image';
  const twitterNormalized = brand.twitter
    ? '@' + brand.twitter.replace(/^https?:\/\/(www\.)?(twitter|x)\.com\//, '').replace(/^@/, '')
    : '';
  const twitterHandle = s?.twitterHandle || twitterNormalized;
  const twitterHandleMeta = twitterHandle ? `  <meta name="twitter:site" content="${twitterHandle}" />\n  <meta name="twitter:creator" content="${twitterHandle}" />\n` : '';
  const twitterImgMeta = ogImgUrl ? `  <meta name="twitter:image" content="${ogImgUrl}" />\n` : '';
  const twitterMeta = `  <meta name="twitter:card" content="${twitterCard}" />\n  <meta name="twitter:title" content="${ogTitle.replace(/"/g, '&quot;')}" />\n${ogDesc ? `  <meta name="twitter:description" content="${ogDesc.replace(/"/g, '&quot;')}" />\n` : ''}${twitterHandleMeta}${twitterImgMeta}`;

  let fullSchema = s ? (s.customJsonSchema || generateFullJsonSchema(s)) : '';
  if (fullSchema && customDomain && defaultDomain && defaultDomain !== customDomain) {
    fullSchema = fullSchema
      .replace(new RegExp(`https?://${defaultDomain}`, 'gi'), `https://${customDomain}`)
      .replace(new RegExp(defaultDomain, 'gi'), customDomain);
  }
  const jsonLd = fullSchema ? `  <script type="application/ld+json">\n${fullSchema}\n  </script>\n` : '';
  const customHead = s?.headScripts ? `  ${s.headScripts}\n` : '';
  const customBody = s?.footerScripts ? `\n  ${s.footerScripts}` : '';

  const bodyCssList: string[] = [
    `font-family: '${g?.fontFamily || 'Hind'}', sans-serif`,
  ];

  const pt = g?.paddingTop ?? g?.paddingY;
  const pb = g?.paddingBottom ?? g?.paddingY;
  const pl = g?.paddingLeft ?? g?.paddingX;
  const pr = g?.paddingRight ?? g?.paddingX;

  if (pt !== undefined) bodyCssList.push(`padding-top: ${pt}px`);
  if (pb !== undefined) bodyCssList.push(`padding-bottom: ${pb}px`);
  if (pl !== undefined) bodyCssList.push(`padding-left: ${pl}px`);
  if (pr !== undefined) bodyCssList.push(`padding-right: ${pr}px`);
  if (pt === undefined && pb === undefined && pl === undefined && pr === undefined) {
    bodyCssList.push('padding: 0');
  }

  const mt = g?.marginTop ?? g?.marginY;
  const mb = g?.marginBottom ?? g?.marginY;
  const ml = g?.marginLeft ?? g?.marginX;
  const mr = g?.marginRight ?? g?.marginX;

  if (mt !== undefined) bodyCssList.push(`margin-top: ${mt}px`);
  if (mb !== undefined) bodyCssList.push(`margin-bottom: ${mb}px`);
  if (ml !== undefined) bodyCssList.push(`margin-left: ${ml}px`);
  if (mr !== undefined) bodyCssList.push(`margin-right: ${mr}px`);
  if (mt === undefined && mb === undefined && ml === undefined && mr === undefined) {
    bodyCssList.push('margin: 0');
  }

  const effectiveBgType = g?.backgroundType || (
    g?.backgroundImage && !g?.backgroundImage.includes('gradient')
      ? 'image'
      : g?.backgroundGradient || (g?.backgroundImage && g?.backgroundImage.includes('gradient'))
      ? 'gradient'
      : g?.backgroundColor && g?.backgroundColor !== 'transparent'
      ? 'solid'
      : undefined
  );

  if (effectiveBgType === 'image' && g?.backgroundImage && !g?.backgroundImage.includes('gradient')) {
    let overlayGrad = '';
    if (g.backgroundOverlay === 'dark') {
      overlayGrad = 'linear-gradient(to bottom, rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.65))';
    } else if (g.backgroundOverlay === 'light') {
      overlayGrad = 'linear-gradient(to bottom, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.65))';
    } else if (g.backgroundOverlay === 'gradient') {
      overlayGrad = 'linear-gradient(135deg, rgba(79, 70, 229, 0.45), rgba(6, 182, 212, 0.45))';
    } else if (g.backgroundOverlay && g.backgroundOverlay !== 'none' && (g.backgroundOverlay.startsWith('linear-gradient') || g.backgroundOverlay.startsWith('rgba'))) {
      overlayGrad = g.backgroundOverlay;
    }

    if (overlayGrad) {
      bodyCssList.push(`background-image: ${overlayGrad}, url('${g.backgroundImage}')`);
    } else {
      bodyCssList.push(`background-image: url('${g.backgroundImage}')`);
    }
    bodyCssList.push(`background-size: ${g.backgroundSize || 'cover'}`);
    bodyCssList.push(`background-position: ${g.backgroundPosition || 'center'}`);
    bodyCssList.push(`background-repeat: ${g.backgroundRepeat || 'no-repeat'}`);
    bodyCssList.push('background-attachment: fixed');
  } else if (effectiveBgType === 'gradient') {
    bodyCssList.push(`background-image: ${g.backgroundGradient || `linear-gradient(${g.gradientAngle || 135}deg, ${g.gradientFrom || '#4f46e5'} 0%, ${g.gradientTo || '#06b6d4'} 100%)`}`);
    bodyCssList.push('background-attachment: fixed');
  } else if (g?.backgroundColor) {
    bodyCssList.push(`background-color: ${g.backgroundColor}`);
  } else {
    bodyCssList.push(`background-color: ${defaultBgColor}`);
  }

  if (g?.textColor) {
    bodyCssList.push(`color: ${g.textColor}`);
  } else {
    bodyCssList.push(`color: ${defaultTextColor}`);
  }

  const usedMobileMenuDirs = Array.from(
    new Set(headerSections.map((sec) => sec.mobileMenuSettings?.openDirection || 'right'))
  );

  let mobileMenuCss = '';
  if (headerSections.length > 0) {
    const dirRules = usedMobileMenuDirs
      .map((dir) => {
        switch (dir) {
          case 'left':
            return `    .dir-left .mobile-menu-panel { top: 0; left: 0; bottom: 0; width: 80%; max-width: 400px; transform: translateX(-100%); }
    .dir-left.open .mobile-menu-panel { transform: translateX(0); }
    .dir-left .mobile-menu-header { justify-content: flex-start; }`;
          case 'top':
            return `    .dir-top .mobile-menu-panel { top: 0; left: 0; right: 0; transform: translateY(-100%); padding-bottom: 32px; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px; }
    .dir-top.open .mobile-menu-panel { transform: translateY(0); }`;
          case 'fullscreen':
            return `    .dir-fullscreen .mobile-menu-panel { inset: 0; display: flex; align-items: center; justify-content: center; transform: translateY(20px); opacity: 0; transition: all 0.3s ease; }
    .dir-fullscreen.open .mobile-menu-panel { transform: translateY(0); opacity: 1; }
    .dir-fullscreen .mobile-menu-header { position: absolute; top: 0; right: 0; width: 100%; padding: 24px; }`;
          case 'right':
          default:
            return `    .dir-right .mobile-menu-panel { top: 0; right: 0; bottom: 0; width: 80%; max-width: 400px; transform: translateX(100%); }
    .dir-right.open .mobile-menu-panel { transform: translateX(0); }`;
        }
      })
      .join('\n\n');

    mobileMenuCss = `
    .desktop-nav { display: none; }
    .cta-container { display: none; }
    .mobile-toggle { display: flex; }

    .mobile-menu-overlay { position: fixed; inset: 0; z-index: 99999; display: none; }
    .mobile-menu-overlay.open { display: flex; }
    .mobile-menu-backdrop { position: absolute; inset: 0; z-index: 99998; }
    .mobile-menu-panel { position: absolute; z-index: 99999; display: flex; flex-direction: column; transition: transform 0.3s ease; }

${dirRules}

    .mobile-menu-header { display: flex; justify-content: flex-end; padding: 24px; }
    .mobile-nav-links { display: flex; flex-direction: column; padding: 0 24px; }
    .mobile-cta { display: flex; flex-direction: column; gap: 16px; padding: 24px; margin-top: auto; }

    @media (min-width: 769px) {
      .desktop-nav { display: flex; }
      .cta-container { display: flex; }
      .mobile-toggle { display: none; }
      .mobile-menu-overlay { display: none !important; }
    }`;
  } else {
    mobileMenuCss = `
    .desktop-nav { display: none; }
    .cta-container { display: none; }
    .mobile-toggle { display: none; }`;
  }

  const renderedSectionsHtml = `${headerHtml}\n\n${bodyHtml}\n\n${footerHtml}`;
  const includeDropdownCss = renderedSectionsHtml.includes('nav-item-dropdown');
  const dropdownCss = includeDropdownCss ? `
    .nav-item-dropdown {
      position: relative;
      display: inline-flex;
      align-items: center;
    }
    .dropdown-arrow {
      font-size: 12px;
      margin-left: 4px;
      transition: transform 0.2s ease;
      opacity: 0.7;
    }
    .dropdown-menu {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      min-width: 200px;
      background: ${isLight ? '#ffffff' : '#0f172a'};
      border: 1px solid ${isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.12)'};
      border-radius: 12px;
      padding: 8px;
      box-shadow: 0 12px 30px ${isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.4)'};
      color: ${isLight ? '#0f172a' : '#f1f5f9'};
      z-index: 100;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }
    .nav-item-dropdown:hover .dropdown-menu {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .nav-item-dropdown:hover .dropdown-arrow {
      transform: rotate(180deg);
    }` : '';

  const hasForms = renderedSectionsHtml.includes('data-site-form="true"') ||
                   renderedSectionsHtml.includes('<form') ||
                   renderedSectionsHtml.includes('form-field-') ||
                   renderedSectionsHtml.includes('site-form-submit-btn');

    const formCss = hasForms ? `
    .site-generated-form,
    form {
      text-align: left;
    }
    .site-generated-form label,
    form label {
      text-align: left;
    }
    .site-form-status {
      display: none;
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      margin-top: 16px;
      text-align: center;
      width: 100%;
      animation: siteFormSlideUp 0.3s ease-out;
    }
    @keyframes siteFormSlideUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .site-form-status.success {
      display: block;
      background: rgba(16, 185, 129, 0.08);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.15);
    }
    .site-form-status.error {
      display: block;
      background: rgba(239, 68, 68, 0.08);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.15);
    }
    .site-form-submitting-btn {
      opacity: 0.8;
      cursor: not-allowed;
      pointer-events: none;
      position: relative;
    }
  ` : '';

  let paletteCss = '';
  if (palette) {
    paletteCss = `
    :root {
      --color-text: ${palette.light.textColor};
      --color-bg: ${palette.light.backgroundColor};
      --color-page-bg: ${palette.light.backgroundColor};
      --color-primary: ${palette.light.primaryColor};
      --color-accent: ${palette.light.accentColor};
      --color-neutral: ${palette.light.neutralColor};
    }

    ${palette.enableDarkTheme ? `
    [data-theme="dark"], .dark, html.dark {
      --color-text: ${palette.dark.textColor};
      --color-bg: ${palette.dark.backgroundColor};
      --color-page-bg: ${palette.dark.backgroundColor};
      --color-primary: ${palette.dark.primaryColor};
      --color-accent: ${palette.dark.accentColor};
      --color-neutral: ${palette.dark.neutralColor};
    }
    ` : ''}
    `;
  }

  const baseCss = `
    ${paletteCss}

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      max-width: 100vw;
      overflow-x: hidden;
    }

    body {
      ${bodyCssList.join(';\n      ')};
      line-height: ${g?.lineHeight || 1.6};
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    main {
      flex: 1;
    }

    a {
      text-decoration: none;
      color: inherit;
    }

    img, video {
      max-width: 100%;
      height: auto;
      display: block;
    }

    @media (max-width: 640px) {
      .hide-on-mobile {
        display: none !important;
      }
    }

    @media (min-width: 641px) and (max-width: 1024px) {
      .hide-on-tablet {
        display: none !important;
      }
    }

    @media (min-width: 1025px) {
      .hide-on-desktop {
        display: none !important;
      }
    }
${dropdownCss}
${mobileMenuCss}
${formCss}
  `;

  const mobileScript = headerSections.length > 0 ? `
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      document.querySelectorAll('.mobile-menu-overlay a').forEach(function(link) {
        link.addEventListener('click', function() {
          var overlay = this.closest('.mobile-menu-overlay');
          if (overlay) overlay.classList.remove('open');
        });
      });
    });
  </script>` : '';

  const formModalsHtml = '';

  const formScript = hasForms ? `
  <script>
    (function() {

      async function submitFormData(url, payload, signal) {
        return fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload),
          signal: signal
        });
      }

      document.addEventListener('DOMContentLoaded', function() {
        var forms = document.querySelectorAll('form');
        forms.forEach(function(form) {
          form.addEventListener('submit', async function(e) {
            e.preventDefault();

            var submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
            var statusEl = form.querySelector('.site-form-status');
            var customSuccess = form.getAttribute('data-success-msg');
            var customError = form.getAttribute('data-error-msg');
            var customSubmitting = form.getAttribute('data-submitting-text');
            var successMessage = customSuccess ? decodeURIComponent(customSuccess) : 'Thank you! Your message has been sent successfully.';
            var errorMessage = customError ? decodeURIComponent(customError) : 'Something went wrong. Please check your details and try again.';
            var submittingText = customSubmitting ? decodeURIComponent(customSubmitting) : 'Sending...';
            var successAction = form.getAttribute('data-success-action') || 'inline';
            var redirectUrl = form.getAttribute('data-redirect-url');
            var autoReset = form.getAttribute('data-auto-reset') !== 'false';
            var actionUrl = form.getAttribute('data-action-url') || '/api/submit-form';

            if (!form.checkValidity()) {
              form.reportValidity();
              return;
            }

            if (statusEl) {
              statusEl.classList.remove('success', 'error');
              statusEl.textContent = '';
              statusEl.style.display = 'none';
            }

            var originalBtnText = '';
            if (submitBtn) {
              originalBtnText = submitBtn.textContent;
              submitBtn.textContent = submittingText;
              submitBtn.disabled = true;
              submitBtn.classList.add('site-form-submitting-btn');
            }

            try {
              var formData = new FormData(form);

              if (formData.get('_hp_website_trap')) {
                if (autoReset) form.reset();
                if (successAction === 'redirect' && redirectUrl) {
                  window.location.href = redirectUrl;
                  return;
                }
                if (statusEl) {
                  statusEl.textContent = successMessage;
                  statusEl.classList.add('success');
                  statusEl.style.display = 'block';
                }
                return;
              }

              var jsonBody = {
                formId: form.id || 'form',
                pageTitle: document.title || 'Published Page',
                formNotificationGmailEnabled: form.getAttribute('data-notif-gmail') === 'true' || form.getAttribute('data-notif-gmail-enabled') === 'true',
                formNotificationTelegramEnabled: form.getAttribute('data-notif-telegram') === 'true' || form.getAttribute('data-notif-telegram-enabled') === 'true',
              };

              formData.forEach(function(val, key) {
                jsonBody[key] = val;
              });

              var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
              var timeoutId = controller ? setTimeout(function() { controller.abort(); }, 20000) : null;

              var res = await submitFormData(actionUrl, jsonBody, controller ? controller.signal : undefined);
              if (timeoutId) clearTimeout(timeoutId);

              if (res.ok) {
                var resData = await res.json().catch(function() { return {}; });
                if (autoReset) form.reset();
                if (successAction === 'redirect' && redirectUrl) {
                  window.location.href = redirectUrl;
                  return;
                }
                if (statusEl) {
                  statusEl.textContent = resData.message || successMessage;
                  statusEl.classList.add('success');
                  statusEl.style.display = 'block';
                }
              } else {
                var errData = await res.json().catch(function() { return {}; });
                if (statusEl) {
                  statusEl.textContent = errData.error || errData.message || errorMessage;
                  statusEl.classList.add('error');
                  statusEl.style.display = 'block';
                }
              }
            } catch (err) {
              if (statusEl) {
                statusEl.textContent = err.message || errorMessage;
                statusEl.classList.add('error');
                statusEl.style.display = 'block';
              }
            } finally {
              if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                submitBtn.classList.remove('site-form-submitting-btn');
              }
            }
          });
        });
      });
    })();
  </script>` : '';

  const themeToggleScript = (palette && palette.enableDarkTheme) ? `
  <script>
    (function() {
      function getPreferredTheme() {
        var saved = localStorage.getItem('site_theme');
        if (saved) return saved;
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark';
        }
        return 'light';
      }
      function applyTheme(theme) {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.setAttribute('data-theme', 'light');
        }
        localStorage.setItem('site_theme', theme);
      }
      window.toggleSiteTheme = function() {
        var isDark = document.documentElement.classList.contains('dark') || document.documentElement.getAttribute('data-theme') === 'dark';
        applyTheme(isDark ? 'light' : 'dark');
      };
      window.toggleDarkMode = window.toggleSiteTheme;
      applyTheme(getPreferredTheme());
      document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('[data-action="toggle-dark-mode"], .theme-toggle-btn').forEach(function(btn) {
          btn.addEventListener('click', function(e) {
            e.preventDefault();
            window.toggleSiteTheme();
          });
        });
      });
    })();
  </script>` : '';

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${metaTitle}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
${robotsMeta}${themeColorMeta}${manifestMeta}${metaDesc}${metaKeywords}${authorMeta}${canonicalMeta}${faviconLink}${appleTouchLink}${ogMeta}${twitterMeta}${jsonLd}${customHead}
${googleFontsLink}
  <style>
    ${baseCss}
  </style>
</head>
<body class="antialiased">

${headerHtml}

  <main>
${bodyHtml}
  </main>

${footerHtml}
${customBody}${formModalsHtml}${mobileScript}${formScript}${themeToggleScript}
</body>
</html>`;

  return cleanExportedCodeFormat(cleanExportedFontFamilyQuotes(fullHtml));
}
