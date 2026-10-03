import React from 'react';
import { WebsiteElement, EditorMode, SelectedElementContext } from '../../../types';
import { Layers, Sliders, Plus } from 'lucide-react';

interface ModalElementRendererProps {
element: WebsiteElement;
sectionId: string;
editorMode: EditorMode;
isLight: boolean;
styleObj: React.CSSProperties;
onOpenEditBox?: (context: SelectedElementContext) => void;
onAddElementToColumn?: (sectionId: string, parentId: string) => void;
}

export const ModalElementRenderer: React.FC<ModalElementRendererProps> = ({
element,
sectionId,
editorMode,
isLight,
styleObj,
onOpenEditBox,
onAddElementToColumn,
}) => {
const md = {
triggerText: element.modalTriggerText || 'Open Modal Dialog',
title: element.modalTitle || 'Interactive Modal Dialog',
content: element.content || 'This modal can contain detailed information, forms, video embeds, or custom announcements.',
...element.modalData,
};

const showOverlayInEditMode = editorMode === 'edit';

return (
<div style={styleObj} className="inline-block relative">
<button
type="button"
onClick={(e) => {
e.stopPropagation();
if (editorMode === 'edit') {
onOpenEditBox?.({ element, sectionId });
} else {
const modalEl = document.getElementById(`modal-${element.id}`);
if (modalEl) modalEl.classList.remove('hidden');
}
}}
className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md transition-all cursor-pointer"
>
<Layers className="w-4 h-4 text-indigo-200" />
<span>{md.triggerText || 'Open Modal'}</span>
</button>

<div
id={`modal-${element.id}`}
className={`${
showOverlayInEditMode ? 'flex' : 'hidden'
} fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150`}
onClick={(e) => {
e.stopPropagation();
if (editorMode !== 'edit') {
e.currentTarget.classList.add('hidden');
}
}}
>
<div
onClick={(e) => e.stopPropagation()}
className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 relative ${
isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
}`}
>
{editorMode === 'edit' && (
<div className="flex items-center justify-between gap-2 p-2 mb-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs">
<span className="font-bold text-[11px] text-indigo-400 flex items-center gap-1">
<Layers className="w-3.5 h-3.5" />
<span>Modal Overlay Canvas</span>
</span>
<div className="flex items-center gap-1.5">
<button
type="button"
onClick={(e) => {
e.stopPropagation();
onOpenEditBox?.({ element, sectionId });
}}
className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] flex items-center gap-1 cursor-pointer"
>
<Sliders className="w-3 h-3" />
<span>Open Edit Box</span>
</button>
{onAddElementToColumn && (
<button
type="button"
onClick={(e) => {
e.stopPropagation();
onAddElementToColumn(sectionId, element.id);
}}
className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium text-[11px] flex items-center gap-1 cursor-pointer"
>
<Plus className="w-3 h-3" />
<span>Add Element</span>
</button>
)}
</div>
</div>
)}

<div className="flex items-center justify-between pb-3 border-b border-slate-700/20 mb-4">
<h3 className="text-lg font-bold">{md.title || 'Modal Title'}</h3>
<button
type="button"
onClick={(e) => {
e.stopPropagation();
const modalEl = document.getElementById(`modal-${element.id}`);
if (modalEl) modalEl.classList.add('hidden');
}}
className="p-1 rounded-lg hover:bg-slate-800/20 text-slate-400 hover:text-slate-100 cursor-pointer text-sm"
>
✕
</button>
</div>
<div
className="text-sm leading-relaxed text-slate-300"
dangerouslySetInnerHTML={{ __html: md.content || '' }}
/>
</div>
</div>
</div>
);
};
