import React from 'react';
import { Plus, ChevronDown, ArrowRight } from 'lucide-react';
import { WebsiteElement, SelectedElementContext, EditorMode } from '../../types';

export interface ElementAccordionRendererProps {
element: WebsiteElement;
sectionId: string;
editorMode: EditorMode;
isSelected: boolean;
selectedContext: SelectedElementContext | null;
onSelect: (ctx: SelectedElementContext) => void;
onOpenEditBox?: (ctx: SelectedElementContext) => void;
onUpdate: (updatedElement: WebsiteElement) => void;
isLight: boolean;
maxWidthClass: string;
marginAutoClass: string;
shadowClass: string;
styleObj: React.CSSProperties;
}

export const ElementAccordionRenderer: React.FC<ElementAccordionRendererProps> = ({
element,
sectionId,
editorMode,
isSelected,
selectedContext,
onSelect,
onOpenEditBox,
onUpdate,
isLight,
maxWidthClass,
marginAutoClass,
shadowClass,
styleObj,
}) => {
const items = element.accordionItems || [
{ title: 'Frequently Asked Question 1', content: 'Detailed answer or guidelines for the first question.' },
{ title: 'Frequently Asked Question 2', content: 'Detailed answer or guidelines for the second question.' }
];
const iconStyle = element.accordionIconStyle || 'chevron';
const itemBg = element.accordionItemBg || (isLight ? '#ffffff' : '#1e293b');
const itemBorderColor = element.accordionItemBorderColor || (isLight ? '#e2e8f0' : '#334155');
const borderRadius = (styleObj as any).borderRadius !== undefined ? (styleObj as any).borderRadius : 12;
const gapVal = (styleObj as any).gap !== undefined ? (styleObj as any).gap : 10;

return (
<div
style={styleObj}
className={`${maxWidthClass} ${marginAutoClass} ${shadowClass} w-full max-w-full box-border`}
>
<div style={{ gap: `${gapVal}px` }} className="flex flex-col w-full max-w-full box-border">
{items.map((item, idx) => {
const isHeadingSelected =
isSelected &&
selectedContext?.subItemIndex === idx &&
selectedContext?.subItemPart === 'title';

const isContentSelected =
isSelected &&
selectedContext?.subItemIndex === idx &&
selectedContext?.subItemPart === 'content';

const titleStyles = item.titleStyles || {};
const contentStyles = item.contentStyles || {};

if (editorMode === 'edit') {
return (
<div
key={idx}
onClick={(e) => {
e.stopPropagation();
onSelect({ element, sectionId, subItemIndex: idx, subItemPart: undefined });
onOpenEditBox?.({ element, sectionId, subItemIndex: idx, subItemPart: undefined });
}}
style={{
backgroundColor: itemBg === 'transparent' ? undefined : itemBg,
borderColor: itemBorderColor,
borderRadius: `${borderRadius}px`,
}}
className={`border p-3.5 transition-all relative group/item w-full max-w-full box-border ${
isLight ? 'text-slate-800' : 'text-slate-100'
}`}
>
<div
onClick={(e) => {
e.stopPropagation();
onSelect({ element, sectionId, subItemIndex: idx, subItemPart: 'title' });
onOpenEditBox?.({ element, sectionId, subItemIndex: idx, subItemPart: 'title' });
}}
style={{
fontFamily: titleStyles.typeface ? `"${titleStyles.typeface}", sans-serif` : undefined,
fontWeight: titleStyles.fontWeight || 600,
fontSize: titleStyles.fontSize
? typeof titleStyles.fontSize === 'number'
? titleStyles.fontSize <= 5
? `${Math.round(titleStyles.fontSize * 16)}px`
: `${titleStyles.fontSize}px`
: titleStyles.fontSize.endsWith('rem')
? `${Math.round((parseFloat(titleStyles.fontSize) || 1) * 16)}px`
: titleStyles.fontSize
: '15px',
color: titleStyles.color || 'inherit',
letterSpacing: titleStyles.letterSpacing ? `${titleStyles.letterSpacing}em` : undefined,
lineHeight: titleStyles.lineHeight || 1.4,
textAlign: (titleStyles.textAlign as any) || 'left',
}}
className={`p-2.5 rounded-lg border transition-all cursor-pointer relative mb-2 w-full max-w-full box-border flex items-center justify-between gap-3 ${
isHeadingSelected
? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-500/10 shadow-sm'
: 'border-dashed border-indigo-400/30 hover:border-indigo-400/70 hover:bg-indigo-500/5'
}`}
>
<span
className="flex-1 font-inherit text-inherit"
dangerouslySetInnerHTML={{ __html: item.title || 'Accordion Toggle Title...' }}
/>
<span className="text-slate-400 text-xs shrink-0 select-none">
{iconStyle === 'plus-minus' ? '+' : iconStyle === 'arrow' ? '➔' : '▾'}
</span>
</div>

<div
onClick={(e) => {
e.stopPropagation();
onSelect({ element, sectionId, subItemIndex: idx, subItemPart: 'content' });
onOpenEditBox?.({ element, sectionId, subItemIndex: idx, subItemPart: 'content' });
}}
style={{
fontFamily: contentStyles.typeface ? `"${contentStyles.typeface}", sans-serif` : undefined,
fontWeight: contentStyles.fontWeight || 400,
fontSize: contentStyles.fontSize
? typeof contentStyles.fontSize === 'number'
? contentStyles.fontSize <= 5
? `${Math.round(contentStyles.fontSize * 16)}px`
: `${contentStyles.fontSize}px`
: contentStyles.fontSize.endsWith('rem')
? `${Math.round((parseFloat(contentStyles.fontSize) || 1) * 16)}px`
: contentStyles.fontSize
: '14px',
color: contentStyles.color || 'inherit',
letterSpacing: contentStyles.letterSpacing ? `${contentStyles.letterSpacing}em` : undefined,
lineHeight: contentStyles.lineHeight || 1.6,
textAlign: (contentStyles.textAlign as any) || 'left',
}}
className={`p-2.5 rounded-lg border transition-all cursor-pointer relative w-full max-w-full box-border [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_li]:leading-relaxed ${
isContentSelected
? 'ring-2 ring-sky-500 border-sky-500 bg-sky-500/10 shadow-sm'
: 'border-dashed border-slate-700/40 hover:border-slate-500 hover:bg-slate-800/10'
}`}
>
<div
className="font-inherit text-inherit opacity-90 leading-relaxed"
dangerouslySetInnerHTML={{ __html: item.content || 'Accordion content / answer body...' }}
/>
</div>
</div>
);
}

const TitleTag = (item.titleTag || 'h3') as React.ElementType;
const ContentTag = (item.contentTag || 'p') as React.ElementType;

return (
<details
key={idx}
open={item.isOpen}
style={{
backgroundColor: itemBg === 'transparent' ? undefined : itemBg,
borderColor: itemBorderColor,
borderRadius: `${borderRadius}px`,
}}
className={`border overflow-hidden group/acc transition-all w-full max-w-full box-border ${
isLight ? 'text-slate-800' : 'text-slate-100'
}`}
>
<summary className="p-4 flex items-center justify-between cursor-pointer select-none list-none w-full max-w-full box-border [&::-webkit-details-marker]:hidden">
<TitleTag
style={{
fontFamily: titleStyles.typeface ? `"${titleStyles.typeface}", sans-serif` : undefined,
fontWeight: titleStyles.fontWeight || 600,
fontSize: titleStyles.fontSize
? typeof titleStyles.fontSize === 'number'
? titleStyles.fontSize <= 5
? `${Math.round(titleStyles.fontSize * 16)}px`
: `${titleStyles.fontSize}px`
: titleStyles.fontSize.endsWith('rem')
? `${Math.round((parseFloat(titleStyles.fontSize) || 1) * 16)}px`
: titleStyles.fontSize
: '16px',
color: titleStyles.color || 'inherit',
letterSpacing: titleStyles.letterSpacing ? `${titleStyles.letterSpacing}em` : undefined,
lineHeight: titleStyles.lineHeight || 1.4,
textAlign: (titleStyles.textAlign as any) || 'left',
}}
className="m-0 flex-1"
dangerouslySetInnerHTML={{ __html: item.title || 'Accordion Title' }}
/>
<span className="text-slate-400 group-open/acc:rotate-180 transition-transform duration-200 shrink-0 ml-3">
{iconStyle === 'plus-minus' ? (
<span className="group-open/acc:hidden text-base font-bold">+</span>
) : iconStyle === 'arrow' ? (
<ArrowRight className="w-4 h-4 group-open/acc:rotate-90 transition-transform" />
) : (
<ChevronDown className="w-4 h-4" />
)}
{iconStyle === 'plus-minus' && (
<span className="hidden group-open/acc:inline text-base font-bold">−</span>
)}
</span>
</summary>
<div className="px-4 pb-4 pt-1 border-t border-slate-700/20 w-full max-w-full box-border">
<ContentTag
style={{
fontFamily: contentStyles.typeface ? `"${contentStyles.typeface}", sans-serif` : undefined,
fontWeight: contentStyles.fontWeight || 400,
fontSize: contentStyles.fontSize
? typeof contentStyles.fontSize === 'number'
? contentStyles.fontSize <= 5
? `${Math.round(contentStyles.fontSize * 16)}px`
: `${contentStyles.fontSize}px`
: contentStyles.fontSize.endsWith('rem')
? `${Math.round((parseFloat(contentStyles.fontSize) || 1) * 16)}px`
: contentStyles.fontSize
: '14px',
color: contentStyles.color || 'inherit',
letterSpacing: contentStyles.letterSpacing ? `${contentStyles.letterSpacing}em` : undefined,
lineHeight: contentStyles.lineHeight || 1.6,
textAlign: (contentStyles.textAlign as any) || 'left',
}}
className="m-0 opacity-90 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_li]:leading-relaxed"
dangerouslySetInnerHTML={{ __html: item.content || '' }}
/>
</div>
</details>
);
})}
</div>

{editorMode === 'edit' && isSelected && (
<div className="mt-3 pt-2 flex items-center gap-2">
<button
type="button"
onClick={(e) => {
e.stopPropagation();
const newItems = [
...items,
{
title: `Frequently Asked Question ${items.length + 1}`,
content: 'Detailed explanation or answer for this question.',
isOpen: false,
},
];
onUpdate({ ...element, accordionItems: newItems });
}}
className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
>
<Plus className="w-3.5 h-3.5" />
<span>Add Accordion Item</span>
</button>
</div>
)}
</div>
);
};

export { TableElementRenderer as ElementTableRenderer } from './elements/TableElementRenderer';
export type { TableElementRendererProps as ElementTableRendererProps } from './elements/TableElementRenderer';
