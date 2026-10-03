import React, { useEffect } from 'react';
import { Trash2, X } from 'lucide-react';

export interface DeleteModalProps {
isOpen: boolean;
title?: string;
itemName?: string;
itemType?: string;
description?: React.ReactNode;
confirmLabel?: string;
onConfirm: () => void;
onCancel: () => void;
isLight?: boolean;
zIndex?: string;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
isOpen,
title = 'Delete Item',
itemName,
itemType = 'layer',
description,
confirmLabel = 'Delete',
onConfirm,
onCancel,
isLight = false,
zIndex = 'z-[999]',
}) => {
useEffect(() => {
if (!isOpen) return;

const handleKeyDown = (e: KeyboardEvent) => {
if (e.key === 'Escape') {
e.preventDefault();
onCancel();
}
};

window.addEventListener('keydown', handleKeyDown);
return () => window.removeEventListener('keydown', handleKeyDown);
}, [isOpen, onCancel]);

if (!isOpen) return null;

return (
<div
className={`fixed inset-0 ${zIndex} flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150`}
onClick={onCancel}
role="dialog"
aria-modal="true"
aria-labelledby="confirm-delete-modal-title"
>
<div
className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 relative animate-in zoom-in-95 duration-150 transition-all ${
isLight
? 'bg-white border-slate-200 text-slate-900'
: 'bg-slate-900 border-slate-800 text-slate-100'
}`}
onClick={(e) => e.stopPropagation()}
>
<button
type="button"
onClick={onCancel}
className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer ${
isLight
? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
}`}
aria-label="Close dialog"
>
<X className="w-4 h-4" />
</button>

<div className="flex flex-col gap-4">
<div className="flex items-center gap-3">
<div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center shrink-0">
<Trash2 className="w-4 h-4" />
</div>
<h3 id="confirm-delete-modal-title" className="text-base font-bold tracking-tight">
{title}
</h3>
</div>

<div className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
{description ? (
description
) : (
<p>
Are you sure you want to delete{' '}
{itemName ? (
<span className="font-semibold text-slate-800 dark:text-slate-200 break-words">
&ldquo;{itemName}&rdquo;
</span>
) : (
`this ${itemType}`
)}
? This action is permanent and cannot be undone.
</p>
)}
</div>
</div>

<div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
<button
type="button"
onClick={onCancel}
className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
isLight
? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
: 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
}`}
>
Cancel
</button>
<button
type="button"
onClick={onConfirm}
autoFocus
className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition-colors flex items-center gap-1.5 cursor-pointer"
>
<Trash2 className="w-3.5 h-3.5" />
<span>{confirmLabel}</span>
</button>
</div>
</div>
</div>
);
};
