import React from 'react';
import { WebsiteSection } from '../../../types';

export interface ComputedSectionStyles {
sectionStyle: React.CSSProperties;
maxWidthClass: string;
sectionMargin: string;
isLight: boolean;
bgType: string | undefined;
sectionBgColor: string | undefined;
sectionBgImage: string | undefined;
containerStyle: React.CSSProperties;
}

export function computeSectionStyles(
section: WebsiteSection,
uiTheme: 'dark' | 'light' = 'dark'
): ComputedSectionStyles {
const isLight = uiTheme === 'light';
const s = { ...(section.style || {}), ...(section.styles || {}) };
const px = s.paddingX !== undefined ? `${s.paddingX}px` : '1rem';
const py = s.paddingY !== undefined ? `${s.paddingY}px` : '2rem';

const bgType =
s.backgroundType ||
(s.backgroundImage
? 'image'
: s.backgroundGradient
? 'gradient'
: s.backgroundColor && s.backgroundColor !== 'transparent'
? 'solid'
: undefined);

let sectionBgColor: string | undefined = undefined;
let sectionBgImage: string | undefined = undefined;
let sectionBgSize: string | undefined = undefined;
let sectionBgPos: string | undefined = undefined;
let sectionBgRepeat: string | undefined = undefined;

if (bgType === 'transparent') {
sectionBgColor = 'transparent';
sectionBgImage = undefined;
} else if (bgType === 'solid') {
sectionBgColor = s.backgroundColor || 'transparent';
sectionBgImage = undefined;
} else if (bgType === 'gradient') {
sectionBgImage =
s.backgroundGradient ||
`linear-gradient(${s.gradientAngle || 135}deg, ${s.gradientFrom || '#4f46e5'} 0%, ${s.gradientTo || '#06b6d4'} 100%)`;
sectionBgColor = undefined;
} else if (bgType === 'image') {
if (s.backgroundImage) {
let overlayGrad: string | undefined = undefined;
const overlay = s.backgroundOverlay || 'dark';

if (overlay === 'dark') {
overlayGrad = 'linear-gradient(to bottom, rgba(15, 23, 42, 0.82), rgba(15, 23, 42, 0.94))';
} else if (overlay === 'light') {
overlayGrad = 'linear-gradient(to bottom, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.95))';
} else if (overlay === 'gradient') {
overlayGrad = 'linear-gradient(135deg, rgba(79, 70, 229, 0.85) 0%, rgba(6, 182, 212, 0.85) 100%)';
} else if (overlay === 'none') {
overlayGrad = undefined;
} else if (overlay) {
overlayGrad = overlay;
}

sectionBgImage = overlayGrad
? `${overlayGrad}, url('${s.backgroundImage}')`
: `url('${s.backgroundImage}')`;
sectionBgSize = s.backgroundSize || 'cover';
sectionBgPos = s.backgroundPosition || 'center';
sectionBgRepeat = s.backgroundRepeat || 'no-repeat';
sectionBgColor = undefined;
} else {
sectionBgColor = s.backgroundColor || 'transparent';
sectionBgImage = undefined;
}
}

const marginTop = s.marginTop !== undefined ? `${s.marginTop}px` : (s.margin !== undefined ? `${s.margin}px` : undefined);
const marginBottom = s.marginBottom !== undefined ? `${s.marginBottom}px` : (s.margin !== undefined ? `${s.margin}px` : undefined);
const marginLeft = s.marginLeft !== undefined ? `${s.marginLeft}px` : undefined;
const marginRight = s.marginRight !== undefined ? `${s.marginRight}px` : undefined;

const sectionStyle: React.CSSProperties = {
padding: `${py} ${px}`,
backgroundColor: sectionBgColor,
backgroundImage: sectionBgImage,
backgroundSize: sectionBgSize,
backgroundPosition: sectionBgPos,
backgroundRepeat: sectionBgRepeat,
color: s.textColor || 'inherit',
marginTop,
marginBottom,
marginLeft,
marginRight,
};

const rawMaxWidth = s.maxWidth;
const strMaxWidth = rawMaxWidth !== undefined ? String(rawMaxWidth).trim() : '';
let computedMaxWidth: string | undefined = undefined;
let maxWidthBase = 'max-w-7xl';

if (!strMaxWidth || strMaxWidth === '7xl' || strMaxWidth === '1280px' || strMaxWidth === '1280') {
computedMaxWidth = '1280px';
maxWidthBase = 'max-w-7xl';
} else if (strMaxWidth === 'full' || strMaxWidth === '100%') {
computedMaxWidth = '100%';
maxWidthBase = 'w-full';
} else if (strMaxWidth === '6xl' || strMaxWidth === '1152px' || strMaxWidth === '1152') {
computedMaxWidth = '1152px';
maxWidthBase = 'max-w-6xl';
} else if (strMaxWidth === '5xl' || strMaxWidth === '1024px' || strMaxWidth === '1024') {
computedMaxWidth = '1024px';
maxWidthBase = 'max-w-5xl';
} else if (strMaxWidth === '4xl' || strMaxWidth === '896px' || strMaxWidth === '896') {
computedMaxWidth = '896px';
maxWidthBase = 'max-w-4xl';
} else if (strMaxWidth === '3xl' || strMaxWidth === '768px' || strMaxWidth === '768') {
computedMaxWidth = '768px';
maxWidthBase = 'max-w-3xl';
} else if (strMaxWidth === '2xl' || strMaxWidth === '672px' || strMaxWidth === '672') {
computedMaxWidth = '672px';
maxWidthBase = 'max-w-2xl';
} else if (strMaxWidth === 'xl' || strMaxWidth === '1400px' || strMaxWidth === '1400') {
computedMaxWidth = '1400px';
maxWidthBase = 'max-w-xl';
} else if (typeof rawMaxWidth === 'number') {
computedMaxWidth = `${rawMaxWidth}px`;
maxWidthBase = 'w-full';
} else if (typeof rawMaxWidth === 'string') {
const trimmed = rawMaxWidth.trim();
if (/^\d+$/.test(trimmed)) {
computedMaxWidth = `${trimmed}px`;
} else {
computedMaxWidth = trimmed;
}
maxWidthBase = 'w-full';
}

const horizAlign = s.alignment || s.horizontalAlignment || 'center';
const sectionMargin =
horizAlign === 'center'
? 'mx-auto'
: horizAlign === 'right'
? 'ml-auto mr-0'
: 'mr-auto ml-0';

const maxWidthClass = `${maxWidthBase} ${sectionMargin}`;

const containerStyle: React.CSSProperties = {
maxWidth: computedMaxWidth,
width: '100%',
marginLeft: horizAlign === 'left' ? '0px' : horizAlign === 'right' ? 'auto' : 'auto',
marginRight: horizAlign === 'left' ? 'auto' : horizAlign === 'right' ? '0px' : 'auto',
};

const borderPosition =
s.borderPosition ||
(section.type === 'header' ? 'bottom' : section.type === 'footer' ? 'top' : 'all');
const bWidth =
s.borderWidth !== undefined
? s.borderWidth
: section.type === 'footer' && borderPosition === 'top'
? 1
: 0;
const bColor = s.borderColor || (isLight ? '#e2e8f0' : 'rgba(51, 65, 85, 0.8)');
const bStyle = s.borderStyle || 'solid';

if (bWidth > 0 && bStyle !== 'none' && borderPosition !== 'none') {
if (borderPosition === 'all') {
sectionStyle.border = `${bWidth}px ${bStyle} ${bColor}`;
} else if (borderPosition === 'top') {
sectionStyle.borderTop = `${bWidth}px ${bStyle} ${bColor}`;
} else if (borderPosition === 'bottom') {
sectionStyle.borderBottom = `${bWidth}px ${bStyle} ${bColor}`;
} else if (borderPosition === 'top-bottom') {
sectionStyle.borderTop = `${bWidth}px ${bStyle} ${bColor}`;
sectionStyle.borderBottom = `${bWidth}px ${bStyle} ${bColor}`;
} else if (borderPosition === 'left') {
sectionStyle.borderLeft = `${bWidth}px ${bStyle} ${bColor}`;
} else if (borderPosition === 'right') {
sectionStyle.borderRight = `${bWidth}px ${bStyle} ${bColor}`;
}
}

const borderRadius = s.borderRadius !== undefined ? `${s.borderRadius}px` : '0';
if (parseInt(borderRadius, 10) > 0) {
sectionStyle.borderRadius = borderRadius;
sectionStyle.overflow = 'hidden';
}

const shadowVal = s.shadow || s.boxShadow;
if (shadowVal && shadowVal !== 'none') {
if (shadowVal === 'sm') sectionStyle.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
else if (shadowVal === 'md') sectionStyle.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
else if (shadowVal === 'lg') sectionStyle.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1)';
else if (shadowVal === 'xl') sectionStyle.boxShadow = '0 20px 25px -5px rgb(0 0 0 / 0.1)';
else if (shadowVal === '2xl') sectionStyle.boxShadow = '0 25px 50px -12px rgb(0 0 0 / 0.25)';
else sectionStyle.boxShadow = shadowVal;
}

return {
sectionStyle,
containerStyle,
maxWidthClass,
sectionMargin,
isLight,
bgType,
sectionBgColor,
sectionBgImage,
};
}
