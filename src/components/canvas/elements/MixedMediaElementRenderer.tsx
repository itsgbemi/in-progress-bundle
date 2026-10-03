import React from 'react';
import { WebsiteElement, EditorMode } from '../../../types';
import { ArrowRight } from 'lucide-react';
import { renderIconVisual } from '../../IconRenderer';

interface MixedMediaElementRendererProps {
element: WebsiteElement;
editorMode: EditorMode;
isLight: boolean;
styleObj: React.CSSProperties;
shadowClass: string;
hoverClass: string;
onUpdate: (updatedElement: WebsiteElement) => void;
}

export const MixedMediaElementRenderer: React.FC<MixedMediaElementRendererProps> = ({
element,
editorMode,
isLight,
styleObj,
shadowClass,
hoverClass,
onUpdate,
}) => {
const s = element.styles || {};
const mm = element.mixedMedia || {
mediaType: 'icon' as const,
iconName: 'sparkles',
layout: 'side-by-side' as const,
mediaPosition: 'left' as const,
responsiveBehavior: 'stack-on-mobile' as const,
mediaWidth: 64,
gap: 16,
title: 'Mixed Media Feature',
subtitle: 'Seamlessly combined visual and textual content',
bodyText: 'This mixed media block combines imagery or iconography with formatted text copy and action triggers in a balanced layout.',
showButton: true,
buttonText: 'Learn More',
};

const isWrap = mm.layout === 'wrap';
const isStacked = mm.layout === 'stacked';
const isSideBySide = mm.layout === 'side-by-side' || !mm.layout;
const isRight = mm.mediaPosition === 'right';
const stackMobile = mm.responsiveBehavior !== 'keep-side-by-side';
const gapVal = mm.gap !== undefined ? mm.gap : 16;
const mediaWidthVal = mm.mediaWidth || (mm.mediaType === 'image' ? 180 : 56);

const mediaNode = (
<div
style={{
width: isWrap ? `${mediaWidthVal}px` : undefined,
flexBasis: isSideBySide ? `${mediaWidthVal}px` : undefined,
maxWidth: isSideBySide ? `${mediaWidthVal}px` : undefined,
}}
className={`shrink-0 ${
isWrap
? isRight
? 'float-right ml-4 mb-2'
: 'float-left mr-4 mb-2'
: ''
}`}
>
{mm.mediaType === 'image' ? (
<img
src={mm.imageUrl || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80'}
alt={mm.imageAlt || 'Media visual'}
className="w-full h-auto object-cover rounded-xl shadow-md border border-slate-700/40"
style={{
borderRadius: s.borderRadius !== undefined ? `${s.borderRadius}px` : '12px',
}}
/>
) : (
<div
style={{
width: `${Math.max(mediaWidthVal, 48)}px`,
height: `${Math.max(mediaWidthVal, 48)}px`,
backgroundColor: s.backgroundColor || (isLight ? '#e0e7ff' : '#312e81'),
color: s.textColor || (isLight ? '#4338ca' : '#a5b4fc'),
borderRadius: s.borderRadius !== undefined ? `${s.borderRadius}px` : '14px',
}}
className="flex items-center justify-center p-3 shadow-md border border-indigo-500/20"
>
<div className="w-3/4 h-3/4 flex items-center justify-center">
{renderIconVisual(mm.iconName || 'sparkles', 'w-full h-full')}
</div>
</div>
)}
</div>
);

const textNode = (
<div className="flex-1 min-w-0 flex flex-col gap-1.5">
{mm.title && (
<h3
className={`text-lg font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}
contentEditable={editorMode === 'edit'}
suppressContentEditableWarning
onBlur={(e) => {
const val = e.currentTarget.textContent || '';
onUpdate({
...element,
mixedMedia: { ...mm, title: val },
});
}}
>
{mm.title}
</h3>
)}
{mm.subtitle && (
<p
className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`}
contentEditable={editorMode === 'edit'}
suppressContentEditableWarning
onBlur={(e) => {
const val = e.currentTarget.textContent || '';
onUpdate({
...element,
mixedMedia: { ...mm, subtitle: val },
});
}}
>
{mm.subtitle}
</p>
)}
{mm.bodyText && (
<div
className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}
contentEditable={editorMode === 'edit'}
suppressContentEditableWarning
onBlur={(e) => {
const val = e.currentTarget.innerHTML || '';
onUpdate({
...element,
mixedMedia: { ...mm, bodyText: val },
});
}}
dangerouslySetInnerHTML={{ __html: mm.bodyText }}
/>
)}
{mm.showButton && (
<div className="pt-2">
<a
href={mm.buttonHref || '#'}
onClick={(e) => {
if (editorMode === 'edit') e.preventDefault();
}}
className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
>
<span>{mm.buttonText || 'Learn More'}</span>
<ArrowRight className="w-3.5 h-3.5" />
</a>
</div>
)}
</div>
);

return (
<div
style={styleObj}
className={`w-full rounded-2xl p-5 border transition-all ${shadowClass} ${hoverClass} ${
!styleObj.backgroundColor ? (isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800') : ''
}`}
>
{isWrap ? (
<div className="flow-root">
{mediaNode}
{textNode}
</div>
) : isStacked ? (
<div className="flex flex-col gap-4">
{isRight ? (
<>
{textNode}
{mediaNode}
</>
) : (
<>
{mediaNode}
{textNode}
</>
)}
</div>
) : (
<div
style={{ gap: `${gapVal}px` }}
className={`flex items-start ${
stackMobile ? 'flex-col sm:flex-row' : 'flex-row'
} ${isRight ? (stackMobile ? 'sm:flex-row-reverse' : 'flex-row-reverse') : ''}`}
>
{mediaNode}
{textNode}
</div>
)}
</div>
);
};
