import React from 'react';
import { ElementStyles, WebsiteElement } from '../../../types';

export interface ComputedElementStyles {
styleObj: React.CSSProperties;
shadowClass: string;
hoverClass: string;
maxWidthClass: string;
marginAutoClass: string;
buttonSizeClass: string;
outlineClass: string;
}

export function colorWithAlpha(color: string, alpha: number): string {
if (!color) return `rgba(15, 23, 42, ${alpha})`;
if (color === 'transparent') return 'transparent';
if (color.startsWith('rgba')) {
return color.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, `rgba($1,$2,$3,${alpha})`);
}
if (color.startsWith('rgb')) {
return color.replace(/rgb\(([^,]+),([^,]+),([^)]+)\)/, `rgba($1,$2,$3,${alpha})`);
}
if (color.startsWith('#')) {
let hex = color.slice(1);
if (hex.length === 3) {
hex = hex.split('').map((c) => c + c).join('');
}
if (hex.length >= 6) {
const r = parseInt(hex.substring(0, 2), 16);
const g = parseInt(hex.substring(2, 4), 16);
const b = parseInt(hex.substring(4, 6), 16);
return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
}
return color;
}

export function computeElementStyles(
element: WebsiteElement,
editorMode: string,
isSelected: boolean,
isHovered: boolean
): ComputedElementStyles {
const s: ElementStyles = element.styles || {};

let bgColorStyle: string | undefined = undefined;
let bgImageStyle: string | undefined = undefined;
let bgSizeStyle: string | undefined = undefined;
let bgPosStyle: string | undefined = undefined;
let bgRepeatStyle: string | undefined = undefined;

const isGradientImage =
typeof s.backgroundImage === 'string' &&
(s.backgroundImage.includes('linear-gradient') ||
s.backgroundImage.includes('radial-gradient') ||
s.backgroundImage.includes('conic-gradient'));

const bgType =
s.backgroundType ||
(s.backgroundGradient || isGradientImage
? 'gradient'
: s.backgroundImage
? 'image'
: s.backgroundColor && s.backgroundColor !== 'transparent'
? 'solid'
: s.backgroundColor === 'transparent'
? 'transparent'
: undefined);

if (bgType === 'transparent') {
bgColorStyle = 'transparent';
bgImageStyle = 'none';
} else if (bgType === 'solid') {
bgColorStyle = s.backgroundColor && s.backgroundColor !== 'transparent' ? s.backgroundColor : '#0f172a';
bgImageStyle = 'none';
} else if (bgType === 'gradient') {
bgImageStyle =
s.backgroundGradient ||
(isGradientImage ? s.backgroundImage : undefined) ||
`linear-gradient(${s.gradientAngle || 135}deg, ${s.gradientFrom || '#4f46e5'} 0%, ${s.gradientTo || '#06b6d4'} 100%)`;
bgColorStyle = 'transparent';
} else if (bgType === 'image') {
if (s.backgroundImage && !isGradientImage) {
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

bgImageStyle = overlayGrad
? `${overlayGrad}, url('${s.backgroundImage}')`
: `url('${s.backgroundImage}')`;
bgSizeStyle = s.backgroundSize || 'cover';
bgPosStyle = s.backgroundPosition || 'center';
bgRepeatStyle = s.backgroundRepeat || 'no-repeat';
bgColorStyle = undefined;
} else {
bgColorStyle = s.backgroundColor || 'rgba(30, 41, 59, 0.5)';
bgImageStyle = undefined;
}
}

const cleanTypeface = s.typeface ? s.typeface.replace(/['"]/g, '').trim() : undefined;

const styleObj: React.CSSProperties = {
fontFamily: cleanTypeface ? `'${cleanTypeface}', sans-serif` : undefined,
fontWeight: s.fontWeight ? (s.fontWeight as any) : undefined,
fontSize: s.fontSize
? typeof s.fontSize === 'number'
? s.fontSize <= 5
? `${Math.round(s.fontSize * 16)}px`
: `${s.fontSize}px`
: typeof s.fontSize === 'string'
? s.fontSize.endsWith('rem')
? `${Math.round((parseFloat(s.fontSize) || 1) * 16)}px`
: s.fontSize.endsWith('px')
? s.fontSize
: !isNaN(Number(s.fontSize))
? Number(s.fontSize) <= 5
? `${Math.round(Number(s.fontSize) * 16)}px`
: `${Number(s.fontSize)}px`
: s.fontSize
: `${s.fontSize}px`
: undefined,
color: (() => {
const textColorVal = s.textColor || s.color;
if (!textColorVal) return undefined;
const alpha = (s.textColorOpacity !== undefined ? s.textColorOpacity : 100) / 100;
return alpha < 1 ? colorWithAlpha(textColorVal, alpha) : textColorVal;
})(),
caretColor: (() => {
const textColorVal = s.textColor || s.color;
if (s.gradientText || s.textGradient) {
return textColorVal || '#3b82f6';
}
return textColorVal || (editorMode === 'edit' ? 'currentColor' : undefined);
})(),
textDecorationLine:
s.textDecorationLine ||
(s.textDecoration && s.textDecoration !== 'none' ? s.textDecoration : undefined),
textDecorationStyle: (s.underlineStyle || s.overlineStyle || s.strikethroughStyle || s.textDecorationStyle as any) || undefined,
textDecorationThickness:
(s.underlineThickness ?? s.overlineThickness ?? s.strikethroughThickness ?? s.textDecorationThickness) !== undefined
? typeof (s.underlineThickness ?? s.overlineThickness ?? s.strikethroughThickness ?? s.textDecorationThickness) === 'number'
? `${s.underlineThickness ?? s.overlineThickness ?? s.strikethroughThickness ?? s.textDecorationThickness}px`
: (s.underlineThickness ?? s.overlineThickness ?? s.strikethroughThickness ?? s.textDecorationThickness)
: undefined,
textDecorationColor: s.underlineColor || s.overlineColor || s.strikethroughColor || s.textDecorationColor || undefined,
textUnderlineOffset:
(s.underlineOffset ?? s.overlineOffset ?? s.textUnderlineOffset) !== undefined
? typeof (s.underlineOffset ?? s.overlineOffset ?? s.textUnderlineOffset) === 'number'
? `${s.underlineOffset ?? s.overlineOffset ?? s.textUnderlineOffset}px`
: (s.underlineOffset ?? s.overlineOffset ?? s.textUnderlineOffset)
: undefined,
textDecorationSkipInk: (s.underlineSkipInk || s.overlineSkipInk || s.strikethroughSkipInk || s.textDecorationSkipInk) as any || undefined,
backgroundColor: bgColorStyle,
backgroundImage: bgImageStyle,
backgroundSize: bgSizeStyle,
backgroundPosition: bgPosStyle,
backgroundRepeat: bgRepeatStyle,
borderColor: s.borderColor || undefined,
borderWidth: s.borderWidth !== undefined ? `${s.borderWidth}px` : undefined,
borderStyle: s.borderStyle || (s.borderWidth ? 'solid' : undefined),
borderRadius: s.borderRadius !== undefined ? `${s.borderRadius}px` : undefined,
borderTopLeftRadius: s.borderTopLeftRadius !== undefined ? `${s.borderTopLeftRadius}px` : undefined,
borderTopRightRadius: s.borderTopRightRadius !== undefined ? `${s.borderTopRightRadius}px` : undefined,
borderBottomLeftRadius: s.borderBottomLeftRadius !== undefined ? `${s.borderBottomLeftRadius}px` : undefined,
borderBottomRightRadius: s.borderBottomRightRadius !== undefined ? `${s.borderBottomRightRadius}px` : undefined,
textAlign: s.textAlign || undefined,
textTransform: s.textTransform || undefined,
wordSpacing: s.wordSpacing !== undefined ? `${s.wordSpacing}px` : undefined,
paddingTop:
s.paddingTop !== undefined
? `${s.paddingTop}px`
: s.paddingY !== undefined
? `${s.paddingY}px`
: s.padding !== undefined
? `${s.padding}px`
: undefined,
paddingBottom:
s.paddingBottom !== undefined
? `${s.paddingBottom}px`
: s.paddingY !== undefined
? `${s.paddingY}px`
: s.padding !== undefined
? `${s.padding}px`
: undefined,
paddingLeft:
s.paddingLeft !== undefined
? `${s.paddingLeft}px`
: s.paddingX !== undefined
? `${s.paddingX}px`
: s.padding !== undefined
? `${s.padding}px`
: undefined,
paddingRight:
s.paddingRight !== undefined
? `${s.paddingRight}px`
: s.paddingX !== undefined
? `${s.paddingX}px`
: s.padding !== undefined
? `${s.padding}px`
: undefined,
boxShadow: s.boxShadow || (s.customGlow ? s.customGlow : undefined),
marginTop:
s.spaceBefore !== undefined
? `${s.spaceBefore}px`
: s.marginTop !== undefined
? `${s.marginTop}px`
: s.marginY !== undefined
? `${s.marginY}px`
: undefined,
marginBottom:
s.spaceAfter !== undefined
? `${s.spaceAfter}px`
: s.marginBottom !== undefined
? `${s.marginBottom}px`
: s.marginY !== undefined
? `${s.marginY}px`
: undefined,
listStyleType: s.listStyleType || undefined,
letterSpacing: s.letterSpacing !== undefined ? `${s.letterSpacing}em` : undefined,
lineHeight: s.lineHeight !== undefined ? s.lineHeight : undefined,
width: s.fullWidth ? '100%' : s.width ? (typeof s.width === 'number' ? `${s.width}px` : s.width) : undefined,
height: s.height ? (typeof s.height === 'number' ? `${s.height}px` : s.height) : undefined,
objectFit: s.objectFit || undefined,
aspectRatio: s.aspectRatio && s.aspectRatio !== 'auto' ? s.aspectRatio : undefined,
display: s.display || undefined,
float: s.float ? (s.float as any) : undefined,
shapeOutside: s.shapeOutside || undefined,
gap: s.gap !== undefined ? `${s.gap}px` : undefined,
};

if (s.filter && s.filter !== 'none') {
if (s.filter === 'grayscale') styleObj.filter = 'grayscale(100%)';
else if (s.filter === 'warm') styleObj.filter = 'sepia(35%) saturate(140%)';
else if (s.filter === 'vintage') styleObj.filter = 'sepia(60%) contrast(110%)';
else if (s.filter === 'darken') styleObj.filter = 'brightness(75%)';
else if (s.filter === 'contrast') styleObj.filter = 'contrast(150%)';
}
if (s.filterBrightness !== undefined && s.filterBrightness !== 100) {
const existing = styleObj.filter || '';
styleObj.filter = `${existing} brightness(${s.filterBrightness}%)`.trim();
}
if (s.filterContrast !== undefined && s.filterContrast !== 100) {
const existing = styleObj.filter || '';
styleObj.filter = `${existing} contrast(${s.filterContrast}%)`.trim();
}

const shadowClass =
s.shadow === 'sm'
? 'shadow-sm'
: s.shadow === 'md'
? 'shadow-md'
: s.shadow === 'lg'
? 'shadow-lg'
: s.shadow === 'xl'
? 'shadow-xl'
: s.shadow === '2xl'
? 'shadow-2xl'
: '';

if (s.customGlow) {
styleObj.boxShadow = s.customGlow;
}

const hoverClass =
s.hoverEffect === 'lift'
? 'hover:-translate-y-1 hover:shadow-xl transition-all duration-200'
: s.hoverEffect === 'glow'
? 'hover:ring-2 hover:ring-indigo-400/80 transition-all duration-200'
: s.hoverEffect === 'scale'
? 'hover:scale-[1.03] transition-transform duration-200'
: s.hoverEffect === 'zoom'
? 'hover:scale-105 transition-transform duration-300'
: s.hoverEffect === 'grayscale-to-color'
? 'grayscale hover:grayscale-0 transition-all duration-300'
: s.hoverEffect === 'opacity'
? 'hover:opacity-80 transition-opacity duration-200'
: s.hoverEffect === 'slide-icon'
? 'group/btn transition-all duration-200'
: s.hoverEffect === 'shadow'
? 'hover:shadow-2xl transition-shadow duration-200'
: 'transition-all duration-150';

const maxWidthMap: Record<string, string> = {
full: 'w-full max-w-full',
xs: 'w-full max-w-xs',
sm: 'w-full max-w-sm',
md: 'w-full max-w-md',
lg: 'w-full max-w-lg',
xl: 'w-full max-w-xl',
'2xl': 'w-full max-w-2xl',
'3xl': 'w-full max-w-3xl',
'4xl': 'w-full max-w-4xl',
'5xl': 'w-full max-w-5xl',
'6xl': 'w-full max-w-6xl',
'7xl': 'w-full max-w-7xl',
};
const maxWidthClass = s.maxWidth && s.maxWidth !== 'none' ? maxWidthMap[s.maxWidth] || '' : '';
if (s.maxWidth && s.maxWidth !== 'none' && !maxWidthMap[s.maxWidth]) {
styleObj.maxWidth = typeof s.maxWidth === 'number' ? `${s.maxWidth}px` : s.maxWidth;
}

const marginAutoClass =
s.marginAuto === 'center' || s.marginAuto === true || s.alignment === 'center'
? 'mx-auto'
: s.marginAuto === 'right' || s.alignment === 'right'
? 'ml-auto mr-0'
: s.marginAuto === 'left' || s.alignment === 'left'
? 'mr-auto ml-0'
: '';

const sizeOption = element.buttonSize || s.buttonSize || 'md';
const buttonSizeClass =
sizeOption === 'xs'
? 'text-[11px] px-2.5 py-1 gap-1'
: sizeOption === 'sm'
? 'text-xs px-3.5 py-1.5 gap-1.5'
: sizeOption === 'lg'
? 'text-base px-6 py-3 gap-2.5'
: sizeOption === 'xl'
? 'text-lg px-8 py-4 gap-3'
: 'text-sm px-5 py-2.5 gap-2';

const outlineClass =
editorMode === 'edit'
? isSelected
? 'outline-dotted outline-2 outline-indigo-500 outline-offset-2 relative shadow-sm'
: isHovered
? 'outline-dotted outline-2 outline-indigo-400/80 outline-offset-2 relative cursor-pointer'
: 'relative cursor-pointer'
: '';

if (s.gradientText || s.textGradient) {
const grad =
s.textGradient ||
`linear-gradient(${s.gradientAngle || 135}deg, ${s.gradientFrom || '#4f46e5'}, ${s.gradientTo || '#06b6d4'})`;
styleObj.backgroundImage = grad;
styleObj.WebkitBackgroundClip = 'text';
(styleObj as any).backgroundClip = 'text';
styleObj.WebkitTextFillColor = 'transparent';
styleObj.color = 'transparent';
if (!styleObj.display || styleObj.display === 'inline') {
styleObj.display = 'inline-block';
}
}

return {
styleObj,
shadowClass,
hoverClass,
maxWidthClass,
marginAutoClass,
buttonSizeClass,
outlineClass,
};
}
