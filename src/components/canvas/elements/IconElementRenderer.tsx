import React from 'react';
import { WebsiteElement, EditorMode } from '../../../types';
import { renderIconVisual } from '../../IconRenderer';

interface IconElementRendererProps {
element: WebsiteElement;
editorMode: EditorMode;
isLight: boolean;
styleObj: React.CSSProperties;
shadowClass: string;
hoverClass: string;
}

export const IconElementRenderer: React.FC<IconElementRendererProps> = ({
element,
editorMode,
isLight,
styleObj,
shadowClass,
hoverClass,
}) => {
const s = element.styles || {};
const iconSize = s.fontSize ? (typeof s.fontSize === 'number' ? s.fontSize : parseInt(String(s.fontSize), 10) || 32) : 32;
const iconColor = s.textColor || s.color || (isLight ? '#4f46e5' : '#818cf8');
const iconBg = s.backgroundColor && s.backgroundColor !== 'transparent' ? s.backgroundColor : 'transparent';
const hasBg = iconBg !== 'transparent' || !!s.backgroundGradient;
const padVal = s.padding !== undefined ? s.padding : s.paddingY !== undefined ? s.paddingY : (hasBg ? 12 : 0);

let bgStyle: string = iconBg;
if (s.backgroundType === 'gradient' || s.backgroundGradient) {
bgStyle = s.backgroundGradient || 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)';
}

const transforms: string[] = [];
if (s.rotation) transforms.push(`rotate(${s.rotation}deg)`);
if (s.flipX) transforms.push('scaleX(-1)');
if (s.flipY) transforms.push('scaleY(-1)');
const transformStr = transforms.length > 0 ? transforms.join(' ') : undefined;

let customBoxShadow: string | undefined = undefined;
if (s.glowColor && s.glowColor !== 'transparent') {
customBoxShadow = `0 0 20px ${s.glowColor}`;
}

const containerWidth = s.fixedRatio !== false && hasBg
? `${Math.max(iconSize + padVal * 2, 36)}px`
: undefined;
const containerHeight = s.fixedRatio !== false && hasBg
? `${Math.max(iconSize + padVal * 2, 36)}px`
: undefined;

let hoverEffectClass = hoverClass;
if (s.hoverEffect === 'scale') hoverEffectClass += ' hover:scale-110';
else if (s.hoverEffect === 'lift') hoverEffectClass += ' hover:-translate-y-1.5';
else if (s.hoverEffect === 'rotate') hoverEffectClass += ' hover:rotate-12';
else if (s.hoverEffect === 'pulse') hoverEffectClass += ' hover:animate-pulse';
else if (s.hoverEffect === 'glow') hoverEffectClass += ' hover:shadow-lg hover:shadow-indigo-500/50';

const alignStyle = s.textAlign === 'center'
? 'justify-center'
: s.textAlign === 'right'
? 'justify-end'
: 'justify-start';

const iconNode = (
<div
style={{
...styleObj,
display: styleObj.display || 'inline-flex',
alignItems: styleObj.alignItems || 'center',
opacity: s.opacity !== undefined ? Number(s.opacity) : 1,
}}
className={`${alignStyle} transition-all`}
>
<div
style={{
width: containerWidth,
height: containerHeight,
minWidth: containerWidth,
minHeight: containerHeight,
background: bgStyle,
color: iconColor,
borderRadius: s.borderRadius !== undefined ? `${s.borderRadius}px` : hasBg ? '12px' : '0px',
padding: `${padVal}px`,
borderWidth: s.borderWidth ? `${s.borderWidth}px` : undefined,
borderColor: s.borderColor || undefined,
borderStyle: s.borderStyle || (s.borderWidth ? 'solid' : undefined),
boxShadow: customBoxShadow,
transform: transformStr,
}}
className={`inline-flex items-center justify-center transition-all shrink-0 ${shadowClass} ${hoverEffectClass}`}
>
<div style={{ width: `${iconSize}px`, height: `${iconSize}px` }} className="flex items-center justify-center pointer-events-none">
{renderIconVisual(element.iconName || 'sparkles', 'w-full h-full')}
</div>
</div>
</div>
);

if (element.href && (element.linkAction === 'url' || element.linkAction === undefined)) {
return (
<a
href={element.href}
target={element.target || '_self'}
rel={element.target === '_blank' ? 'noopener noreferrer' : undefined}
onClick={(e) => {
if (editorMode === 'edit') {
e.preventDefault();
}
}}
title={element.title || element.label}
className="inline-block no-underline cursor-pointer w-full"
>
{iconNode}
</a>
);
}

return iconNode;
};
