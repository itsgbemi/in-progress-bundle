import React from 'react';
import { WebsiteElement, EditorMode } from '../../../types';
import { Plus } from 'lucide-react';

interface CardElementRendererProps {
element: WebsiteElement;
sectionId: string;
editorMode: EditorMode;
isLight: boolean;
styleObj: React.CSSProperties;
shadowClass: string;
hoverClass: string;
onAddElementToColumn?: (sectionId: string, parentId: string) => void;
renderChildElement: (child: WebsiteElement) => React.ReactNode;
}

export const CardElementRenderer: React.FC<CardElementRendererProps> = ({
element,
sectionId,
editorMode,
isLight,
styleObj,
shadowClass,
hoverClass,
onAddElementToColumn,
renderChildElement,
}) => {
const s = element.styles || {};
const hasChildren = element.children && element.children.length > 0;

const isUnstyledColumn = (!s.backgroundColor || s.backgroundColor === 'transparent') && (!s.borderColor || s.borderColor === 'transparent');

const cardContent = (
<div
style={styleObj}
className={`flex flex-col gap-3 w-full rounded-2xl transition-all ${shadowClass} ${hoverClass} ${
!styleObj.backgroundColor && !styleObj.backgroundImage && s.backgroundType !== 'transparent' && !isUnstyledColumn ? 'bg-slate-900/60' : ''
} ${!styleObj.borderColor && !isUnstyledColumn ? 'border border-slate-800' : ''} ${
!styleObj.paddingTop && !styleObj.paddingBottom && !isUnstyledColumn ? 'p-6' : ''
}`}
>
{hasChildren ? (
(element.children || []).map((child) => renderChildElement(child))
) : editorMode === 'edit' ? (
<div
onClick={(e) => {
e.stopPropagation();
if (onAddElementToColumn) {
onAddElementToColumn(sectionId, element.id);
}
}}
className="w-full min-h-[140px] p-6 border-2 border-dashed border-indigo-400/40 hover:border-indigo-500 bg-transparent hover:bg-indigo-500/5 rounded-2xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all group/colslot"
>
<div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover/colslot:scale-110 transition-transform">
<Plus className="w-5 h-5" />
</div>
<div>
<span className="text-xs font-bold text-indigo-400 block">{element.label || 'Empty Column'}</span>
<span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
Tap to start designing
</span>
</div>
</div>
) : null}
</div>
);

if (element.href) {
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
className="block w-full text-inherit no-underline cursor-pointer"
>
{cardContent}
</a>
);
}

return cardContent;
};
