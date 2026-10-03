import React from 'react';
import { WebsiteElement, EditorMode } from '../../../types';
import { Check, ArrowRight, Star, Plus } from 'lucide-react';

interface ListElementRendererProps {
element: WebsiteElement;
editorMode: EditorMode;
isSelected: boolean;
isLight: boolean;
styleObj: React.CSSProperties;
maxWidthClass: string;
marginAutoClass: string;
shadowClass: string;
onUpdate: (updatedElement: WebsiteElement) => void;
}

export const ListElementRenderer: React.FC<ListElementRendererProps> = ({
element,
editorMode,
isSelected,
isLight,
styleObj,
maxWidthClass,
marginAutoClass,
shadowClass,
onUpdate,
}) => {
const s = element.styles || {};
const items = element.listItems || ['First list item', 'Second list item', 'Third list item'];
const markerStyle = element.listMarkerStyle || (element.tag === 'ol' ? 'numbers' : 'bullet');
const checkedStates = element.listCheckedState || items.map(() => false);
const iconColor = element.listIconColor || s.color || (isLight ? '#4f46e5' : '#818cf8');
const gapVal = element.listSpacing !== undefined ? element.listSpacing : (s.gap !== undefined ? s.gap : 10);
const indentVal = s.paddingLeft !== undefined ? s.paddingLeft : (s.paddingX !== undefined ? s.paddingX : undefined);

const renderMarker = (idx: number) => {
switch (markerStyle) {
case 'checklist':
case 'checklist-empty': {
const isChecked = checkedStates[idx] || (markerStyle === 'checklist' && checkedStates[idx] === undefined);
return (
<span className="inline-flex items-center justify-center w-5 h-6 shrink-0">
<button
type="button"
onClick={(e) => {
e.stopPropagation();
const newChecked = [...checkedStates];
newChecked[idx] = !newChecked[idx];
onUpdate({
...element,
listCheckedState: newChecked,
});
}}
className={`w-4 h-4 rounded flex items-center justify-center transition-colors cursor-pointer ${
isChecked
? 'bg-indigo-600 text-white'
: isLight
? 'border border-slate-400 bg-white hover:border-indigo-500'
: 'border border-slate-600 bg-slate-800 hover:border-indigo-400'
}`}
title="Toggle check"
>
{isChecked && <Check className="w-3 h-3 stroke-[3]" />}
</button>
</span>
);
}
case 'bullet':
case 'disc':
return (
<span style={{ color: iconColor }} className="inline-flex items-center justify-center w-5 h-6 text-xl leading-none shrink-0 font-bold select-none">
•
</span>
);
case 'circle':
return (
<span style={{ color: iconColor }} className="inline-flex items-center justify-center w-5 h-6 text-base leading-none shrink-0 select-none">
○
</span>
);
case 'square':
return (
<span style={{ color: iconColor }} className="inline-flex items-center justify-center w-5 h-6 text-xs leading-none shrink-0 select-none">
■
</span>
);
case 'numbers':
case 'decimal':
return (
<span style={{ color: iconColor }} className="inline-flex items-center justify-start min-w-[1.25rem] h-6 text-xs font-mono font-bold leading-none shrink-0 select-none">
{idx + 1}.
</span>
);
case 'decimal-leading-zero': {
const numStr = String(idx + 1).padStart(2, '0');
return (
<span style={{ color: iconColor }} className="inline-flex items-center justify-start min-w-[1.5rem] h-6 text-xs font-mono font-bold leading-none shrink-0 select-none">
{numStr}.
</span>
);
}
case 'alpha':
case 'upper-alpha': {
const letter = String.fromCharCode(65 + (idx % 26));
return (
<span style={{ color: iconColor }} className="inline-flex items-center justify-start min-w-[1.25rem] h-6 text-xs font-mono font-bold leading-none shrink-0 select-none">
{letter}.
</span>
);
}
case 'lower-alpha': {
const letter = String.fromCharCode(97 + (idx % 26));
return (
<span style={{ color: iconColor }} className="inline-flex items-center justify-start min-w-[1.25rem] h-6 text-xs font-mono font-bold leading-none shrink-0 select-none">
{letter}.
</span>
);
}
case 'roman':
case 'upper-roman': {
const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
return (
<span style={{ color: iconColor }} className="inline-flex items-center justify-start min-w-[1.5rem] h-6 text-xs font-mono font-bold leading-none shrink-0 select-none">
{romans[idx % romans.length]}.
</span>
);
}
case 'lower-roman': {
const romans = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii'];
return (
<span style={{ color: iconColor }} className="inline-flex items-center justify-start min-w-[1.5rem] h-6 text-xs font-mono font-bold leading-none shrink-0 select-none">
{romans[idx % romans.length]}.
</span>
);
}
case 'arrow':
return (
<span style={{ color: iconColor }} className="inline-flex items-center justify-center w-5 h-6 shrink-0 select-none">
<ArrowRight className="w-3.5 h-3.5" />
</span>
);
case 'dash':
return (
<span style={{ color: iconColor }} className="inline-flex items-center justify-center w-5 h-6 text-sm font-bold leading-none shrink-0 select-none">
—
</span>
);
case 'star':
return (
<span style={{ color: iconColor }} className="inline-flex items-center justify-center w-5 h-6 shrink-0 select-none">
<Star className="w-3.5 h-3.5 fill-current" />
</span>
);
case 'none':
default:
return null;
}
};

const ListTag =
element.tag === 'ol' ||
['numbers', 'decimal', 'decimal-leading-zero', 'alpha', 'upper-alpha', 'lower-alpha', 'roman', 'upper-roman', 'lower-roman'].includes(markerStyle)
? 'ol'
: 'ul';

const listContainerStyle: React.CSSProperties = {
...styleObj,
paddingLeft: indentVal !== undefined ? `${indentVal}px` : styleObj.paddingLeft,
};

return (
<div
style={listContainerStyle}
className={`${maxWidthClass} ${marginAutoClass} ${shadowClass} transition-all`}
>
<ListTag style={{ gap: `${gapVal}px` }} className="flex flex-col text-inherit w-full">
{items.map((item, idx) => (
<li key={idx} className="flex items-start gap-2.5 text-inherit min-h-6">
{renderMarker(idx)}
{editorMode === 'edit' && isSelected ? (
<input
type="text"
value={item}
onChange={(e) => {
const newItems = [...items];
newItems[idx] = e.target.value;
onUpdate({ ...element, listItems: newItems });
}}
className="bg-transparent border-b border-dashed border-indigo-400/40 hover:border-indigo-400 focus:border-indigo-500 focus:outline-none flex-1 text-inherit py-0.5 leading-normal"
/>
) : (
<span className="flex-1 py-0.5 leading-normal text-inherit">{item}</span>
)}
</li>
))}
</ListTag>

{editorMode === 'edit' && isSelected && (
<div className="mt-3 pt-2 border-t border-dashed border-slate-700/40 flex items-center gap-2">
<button
type="button"
onClick={(e) => {
e.stopPropagation();
const newItems = [...items, `New list item ${items.length + 1}`];
const newChecked = [...checkedStates, false];
onUpdate({
...element,
listItems: newItems,
listCheckedState: newChecked,
});
}}
className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 text-xs font-semibold transition-colors cursor-pointer"
>
<Plus className="w-3 h-3" />
<span>Add Item</span>
</button>
</div>
)}
</div>
);
};
