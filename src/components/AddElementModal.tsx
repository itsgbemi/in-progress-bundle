import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Search, GripVertical } from 'lucide-react';
import { WebsiteElement } from '../types';
import {
getLayoutOptions,
getDisplayOptions,
getStandardElements,
getFormFieldElements,
} from '../data/elementPresets';
import { TextInput } from './common';

export interface AddElementModalProps {
isOpen: boolean;
sectionId: string | null;
parentId?: string | null;
allowedTypes?: string[];
onClose: () => void;
onAddElement: (sectionId: string, element: WebsiteElement, parentId?: string | null) => void;
onAddPreset?: (sectionId: string, elements: WebsiteElement[], sectionStyles?: any) => void;
onAddLayout?: (sectionId: string, columnsCount: '1' | '2' | '3' | '4' | 'flex' | 'flex-wrap') => void;
uiTheme?: 'dark' | 'light';
globalFontFamily?: string;
}

export const AddElementModal: React.FC<AddElementModalProps> = ({
isOpen,
sectionId,
parentId = null,
allowedTypes,
onClose,
onAddElement,
onAddPreset,
onAddLayout,
uiTheme = 'dark',
globalFontFamily,
}) => {
const [searchQuery, setSearchQuery] = useState('');
const [isMobile, setIsMobile] = useState<boolean>(() =>
typeof window !== 'undefined' ? window.innerWidth < 640 : false
);

const [drawerHeight, setDrawerHeight] = useState<number>(() =>
typeof window !== 'undefined' ? Math.min(Math.round(window.innerHeight * 0.5), 380) : 380
);
const startYRef = useRef<number>(0);
const startHeightRef = useRef<number>(drawerHeight);
const isDraggingDrawerRef = useRef<boolean>(false);

useEffect(() => {
const handleResize = () => {
setIsMobile(typeof window !== 'undefined' ? window.innerWidth < 640 : false);
};
window.addEventListener('resize', handleResize);
return () => window.removeEventListener('resize', handleResize);
}, []);

useEffect(() => {
const handleTouchMove = (e: TouchEvent) => {
if (!isDraggingDrawerRef.current || !e.touches || !e.touches[0]) return;
const deltaY = e.touches[0].clientY - startYRef.current;
const targetHeight = startHeightRef.current - deltaY;
const minH = 180;
const maxH = typeof window !== 'undefined' ? Math.round(window.innerHeight * 0.9) : 700;
setDrawerHeight(Math.max(minH, Math.min(maxH, targetHeight)));
};
const handleTouchEnd = () => {
if (isDraggingDrawerRef.current) isDraggingDrawerRef.current = false;
};
const handleMouseMove = (e: MouseEvent) => {
if (!isDraggingDrawerRef.current) return;
const deltaY = e.clientY - startYRef.current;
const targetHeight = startHeightRef.current - deltaY;
const minH = 180;
const maxH = typeof window !== 'undefined' ? Math.round(window.innerHeight * 0.9) : 700;
setDrawerHeight(Math.max(minH, Math.min(maxH, targetHeight)));
};
const handleMouseUp = () => {
if (isDraggingDrawerRef.current) isDraggingDrawerRef.current = false;
};

window.addEventListener('touchmove', handleTouchMove, { passive: true });
window.addEventListener('touchend', handleTouchEnd);
window.addEventListener('touchcancel', handleTouchEnd);
window.addEventListener('mousemove', handleMouseMove);
window.addEventListener('mouseup', handleMouseUp);
return () => {
window.removeEventListener('touchmove', handleTouchMove);
window.removeEventListener('touchend', handleTouchEnd);
window.removeEventListener('touchcancel', handleTouchEnd);
window.removeEventListener('mousemove', handleMouseMove);
window.removeEventListener('mouseup', handleMouseUp);
};
}, []);

const handleStartDrawerDrag = (clientY: number) => {
isDraggingDrawerRef.current = true;
startYRef.current = clientY;
startHeightRef.current = drawerHeight;
};

useEffect(() => {
if (isOpen) {
setSearchQuery('');
}
}, [isOpen, parentId, sectionId]);

if (!isOpen || !sectionId) return null;

const isLight = uiTheme === 'light';
const effectiveFont = globalFontFamily || 'Plus Jakarta Sans';

const layoutOptions = getLayoutOptions();
const displayOptions = getDisplayOptions();
const standardElements = getStandardElements(isLight, effectiveFont);
const formFieldElements = getFormFieldElements(isLight);

const filteredLayouts = layoutOptions.filter((l) =>
l.name.toLowerCase().includes(searchQuery.toLowerCase())
);

const filteredDisplayOptions = displayOptions.filter((item) => {
if (allowedTypes && allowedTypes.length > 0) {
if (!allowedTypes.includes('inline') && !allowedTypes.includes(item.type)) return false;
}
return item.name.toLowerCase().includes(searchQuery.toLowerCase());
});

const filteredElements = standardElements.filter((item) => {
if (allowedTypes && allowedTypes.length > 0) {
if (item.type === 'button-primary' && allowedTypes.includes('button')) {
} else if (
item.type === 'nav-link' &&
(allowedTypes.includes('nav-link') || allowedTypes.includes('navigation') || allowedTypes.includes('nav'))
) {
} else if (!allowedTypes.includes(item.type)) {
return false;
}
}
return (
item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
item.category.toLowerCase().includes(searchQuery.toLowerCase())
);
});

const showLayouts = !parentId && !allowedTypes && filteredLayouts.length > 0;
const showDisplay = filteredDisplayOptions.length > 0;
const showContent = filteredElements.length > 0;
const filteredFormFieldElements = formFieldElements.filter((item) => {
if (allowedTypes && allowedTypes.length > 0) {
if (!allowedTypes.includes(item.type) && !allowedTypes.includes('form') && !allowedTypes.includes('input')) {
return false;
}
}
return item.name.toLowerCase().includes(searchQuery.toLowerCase());
});
const showFormFields = filteredFormFieldElements.length > 0;
const hasAnyResults = showLayouts || showDisplay || showContent || showFormFields;

const getIconColorClass = isLight
? 'text-slate-800 group-hover:text-indigo-600'
: 'text-slate-200 group-hover:text-indigo-400';

const getTextClass = isLight
? 'text-slate-800 group-hover:text-indigo-600 font-medium'
: 'text-slate-200 group-hover:text-indigo-400 font-medium';

return (
<>
{isMobile && (
<div
id="add-element-backdrop"
className="fixed inset-0 z-[74] bg-black/40 backdrop-blur-xs transition-opacity"
onClick={onClose}
/>
)}
<motion.div
{...(!isMobile ? { drag: true, dragMomentum: false } : {})}
initial={isMobile ? { y: '100%', opacity: 0 } : { opacity: 0, scale: 0.95, y: -10 }}
animate={isMobile ? { y: 0, opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
exit={isMobile ? { y: '100%', opacity: 0 } : { opacity: 0, scale: 0.95, y: -10 }}
transition={{ type: 'spring', damping: 26, stiffness: 280 }}
style={
isMobile
? {
height: `${drawerHeight}px`,
maxHeight: '92vh',
}
: {}
}
className={`fixed z-[75] flex flex-col shadow-2xl border backdrop-blur-2xl overflow-hidden ${
isMobile
? 'bottom-0 left-0 right-0 w-full rounded-t-3xl border-t'
: 'top-20 right-6 sm:right-16 w-[360px] sm:w-[420px] max-h-[84vh] rounded-2xl'
} ${
isLight
? 'bg-white/95 border-slate-200/90 text-slate-900 shadow-slate-900/10'
: 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-black/40'
}`}
>
{isMobile && (
<div
onTouchStart={(e) => {
if (e.touches && e.touches[0]) {
handleStartDrawerDrag(e.touches[0].clientY);
}
}}
onMouseDown={(e) => {
handleStartDrawerDrag(e.clientY);
}}
className="w-full pt-3 pb-2 flex flex-col items-center justify-center cursor-ns-resize active:cursor-grabbing touch-none select-none group shrink-0"
>
<div
className={`w-14 h-1.5 rounded-full transition-colors ${
isLight
? 'bg-slate-300 group-hover:bg-slate-400 group-active:bg-indigo-500'
: 'bg-slate-600/80 group-hover:bg-slate-500 group-active:bg-indigo-400'
}`}
/>
</div>
)}

<div
className={`flex items-center justify-between px-3.5 py-2.5 border-b select-none shrink-0 ${
!isMobile ? 'cursor-grab active:cursor-grabbing' : ''
} ${
isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/60 border-slate-800'
}`}
>
<div className="flex items-center gap-2">
{!isMobile && <GripVertical className="w-4 h-4 text-slate-400 shrink-0" />}
<div className="flex items-center gap-1.5">
<span className="text-xs font-semibold tracking-tight">
{parentId ? 'Insert into Column' : 'Insert'}
</span>
</div>
</div>

<button
type="button"
onClick={onClose}
className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
isLight
? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
: 'text-slate-400 hover:text-white hover:bg-slate-800'
}`}
aria-label="Close box"
>
<X className="w-4 h-4" />
</button>
</div>

<div
className={`p-2.5 border-b shrink-0 ${
isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
}`}
>
<TextInput
type="text"
placeholder="Search elements, forms, and layouts..."
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
isLight={isLight}
leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
rightIcon={
searchQuery ? (
<button
type="button"
onClick={() => setSearchQuery('')}
className="text-slate-400 hover:text-slate-200 text-xs cursor-pointer"
>
×
</button>
) : undefined
}
/>
</div>

<div className="p-3 overflow-y-auto flex-1 space-y-4 min-h-0 pb-8">
{showLayouts && (
<div>
<div className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-2 px-0.5">
Column & Flex Layouts
</div>
<div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
{filteredLayouts.map((layout) => (
<button
key={layout.id}
type="button"
onClick={() => {
onAddLayout?.(sectionId, layout.id as any);
onClose();
}}
className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer group text-center ${
isLight ? 'hover:bg-slate-100/80' : 'hover:bg-slate-800/60'
}`}
title={layout.name}
>
<div
className={`p-1.5 mb-1 transition-transform group-hover:scale-110 ${getIconColorClass} [&>svg]:stroke-[1.3]`}
>
{layout.icon}
</div>
<span className={`text-[11px] font-medium truncate max-w-full ${getTextClass}`}>
{layout.name}
</span>
</button>
))}
</div>
</div>
)}

{showDisplay && (
<div>
<div className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-2 px-0.5">
DISPLAY
</div>
<div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
{filteredDisplayOptions.map((item) => (
<button
key={item.name}
type="button"
onClick={() => {
onAddElement(sectionId, item.getElement(), parentId);
onClose();
}}
className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer group text-center ${
isLight ? 'hover:bg-slate-100/80' : 'hover:bg-slate-800/60'
}`}
title={`Add ${item.name}`}
>
<div
className={`p-1.5 mb-1 transition-transform group-hover:scale-110 ${getIconColorClass} [&>svg]:stroke-[1.3]`}
>
{item.icon}
</div>
<span className={`text-[11px] font-medium truncate max-w-full ${getTextClass}`}>
{item.name}
</span>
</button>
))}
</div>
</div>
)}

{showContent && (
<div>
<div className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-2 px-0.5">
Elements
</div>
<div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
{filteredElements.map((item) => (
<button
key={item.type}
type="button"
onClick={() => {
onAddElement(sectionId, item.getElement(), parentId);
onClose();
}}
className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer group text-center ${
isLight ? 'hover:bg-slate-100/80' : 'hover:bg-slate-800/60'
}`}
title={`Add ${item.name}`}
>
<div
className={`p-1.5 mb-1 transition-transform group-hover:scale-110 ${getIconColorClass} [&>svg]:stroke-[1.3]`}
>
{item.icon}
</div>
<span className={`text-[11px] font-medium truncate max-w-full ${getTextClass}`}>
{item.name}
</span>
</button>
))}
</div>
</div>
)}

{showFormFields && (
<div>
<div className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-2 px-0.5">
Form Fields
</div>
<div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
{filteredFormFieldElements.map((item) => (
<button
key={item.type}
type="button"
onClick={() => {
onAddElement(sectionId, item.getElement(), parentId);
onClose();
}}
className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer group text-center ${
isLight ? 'hover:bg-slate-100/80' : 'hover:bg-slate-800/60'
}`}
title={`Add ${item.name}`}
>
<div
className={`p-1.5 mb-1 transition-transform group-hover:scale-110 ${getIconColorClass} [&>svg]:stroke-[1.3]`}
>
{item.icon}
</div>
<span className={`text-[11px] font-medium truncate max-w-full ${getTextClass}`}>
{item.name}
</span>
</button>
))}
</div>
</div>
)}

{!hasAnyResults && (
<div className="text-center py-8 text-xs text-slate-400">
No elements or layouts found matching &ldquo;{searchQuery}&rdquo;.
</div>
)}
</div>
</motion.div>
</>
);
};
