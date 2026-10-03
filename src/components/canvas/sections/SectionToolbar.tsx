import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WebsiteSection, WebsiteElement, SelectedElementContext } from '../../../types';
import {
GripVertical,
Settings,
Plus,
ChevronUp,
ChevronDown,
ArrowLeftRight,
MoreHorizontal,
Copy,
Trash2,
Columns,
PaintBucket,
Square,
Sparkles,
Sliders,
AlignLeft,
AlignCenter,
AlignRight,
AlignJustify,
ArrowUpToLine,
ArrowDownToLine,
StretchVertical,
Layers,
Zap,
Check,
X,
} from 'lucide-react';
import { BackgroundController } from '../../BackgroundController';
import { InlineColorPicker } from '../../properties/InlineColorPicker';
import { Popover } from '../../common/Popover';

interface SectionToolbarProps {
section: WebsiteSection;
isSectionSelected: boolean;
isSectionHovered: boolean;
selectedContext?: SelectedElementContext | null;
editorMode: string;
uiTheme: 'dark' | 'light';
slideshowIndex: number;
setSlideshowIndex: React.Dispatch<React.SetStateAction<number>>;
variant?: 'floating' | 'top-bar';
onClose?: () => void;
onOpenSectionEditBox?: (section: WebsiteSection) => void;
onSelectSection?: (section: WebsiteSection) => void;
onUpdateSection?: (section: WebsiteSection) => void;
onMoveSection: (sectionId: string, direction: 'up' | 'down') => void;
onAddElementToSection: (sectionId: string) => void;
onDuplicateSection: (sectionId: string) => void;
onDeleteSection: (sectionId: string) => void;
handleSectionMouseEnter: () => void;
handleSectionMouseLeave: () => void;
}

const BORDER_COLOR_PRESETS = [
'#000000',
'#334155',
'#64748b',
'#cbd5e1',
'#ffffff',
'#4f46e5',
'#06b6d4',
'#10b981',
'#f59e0b',
'#ef4444',
'#ec4899',
'#8b5cf6',
];

export const SectionToolbar: React.FC<SectionToolbarProps> = ({
section,
isSectionSelected,
isSectionHovered,
selectedContext,
editorMode,
uiTheme,
slideshowIndex,
setSlideshowIndex,
variant = 'floating',
onClose,
onOpenSectionEditBox,
onSelectSection,
onUpdateSection,
onMoveSection,
onAddElementToSection,
onDuplicateSection,
onDeleteSection,
handleSectionMouseEnter,
handleSectionMouseLeave,
}) => {
const [toolbarOffset, setToolbarOffset] = useState({ x: 0, y: 0 });
const [isDraggingToolbar, setIsDraggingToolbar] = useState(false);
const [showSectionMoreMenu, setShowSectionMoreMenu] = useState(false);
const [activePopover, setActivePopover] = useState<
'layout' | 'background' | 'spacing' | 'alignment' | 'border' | 'shadow' | 'animation' | null
>(null);
const [radiusMode, setRadiusMode] = useState<'uniform' | 'corners'>('uniform');
const [showBorderColorPicker, setShowBorderColorPicker] = useState(false);

if (editorMode !== 'edit' || section.type === 'header' || section.type === 'footer') {
return null;
}

const isLight = uiTheme === 'light';
const isToolbarVisible =
isSectionSelected ||
(isSectionHovered && !selectedContext) ||
(section.type === 'slideshow' && (isSectionHovered || selectedContext?.sectionId === section.id));

const s = section.styles || {};

const updateStyle = (key: string, value: any) => {
if (!onUpdateSection) return;
const merged = {
...(section.style || {}),
...(section.styles || {}),
[key]: value,
};
onUpdateSection({
...section,
style: merged,
styles: merged,
});
};

const updateStyles = (updates: Record<string, any>) => {
if (!onUpdateSection) return;
const merged = {
...(section.style || {}),
...(section.styles || {}),
...updates,
};
onUpdateSection({
...section,
style: merged,
styles: merged,
});
};

const updateProp = (key: string, value: any) => {
if (!onUpdateSection) return;
onUpdateSection({
...section,
[key]: value,
});
};

const handlePointerDownToolbar = (e: React.PointerEvent) => {
e.stopPropagation();
setIsDraggingToolbar(true);
e.currentTarget.setPointerCapture(e.pointerId);
};

const handlePointerMoveToolbar = (e: React.PointerEvent) => {
if (isDraggingToolbar) {
setToolbarOffset((prev) => ({
x: prev.x + e.movementX,
y: prev.y + e.movementY,
}));
}
};

const handlePointerUpToolbar = (e: React.PointerEvent) => {
e.stopPropagation();
setIsDraggingToolbar(false);
e.currentTarget.releasePointerCapture(e.pointerId);
};

const isTopBar = variant === 'top-bar';

const wrapperClasses = isTopBar
? "relative w-full z-[85]"
: `absolute top-2 right-2 sm:right-4 z-40 transition-all duration-150 ${
isToolbarVisible ? 'opacity-100 scale-100' : 'opacity-0 pointer-events-none scale-95'
}`;

const toolbarClasses = isTopBar
? `w-full border-b px-4 py-2 flex items-center justify-between gap-2 text-xs transition-colors overflow-x-auto no-scrollbar flex-nowrap ${
isLight ? 'bg-slate-50/95 border-slate-200 text-slate-800' : 'bg-slate-900/95 border-slate-800 text-slate-100'
}`
: `${
isLight
? 'bg-white/95 border-slate-200/90 text-slate-800 shadow-xl ring-1 ring-slate-900/5'
: 'bg-slate-900/95 border-slate-700/90 text-slate-100 shadow-2xl ring-1 ring-white/5'
} backdrop-blur-md border rounded-xl px-2.5 py-1.5 flex items-center gap-1 text-xs ${
isDraggingToolbar ? 'ring-2 ring-indigo-500 cursor-grabbing shadow-indigo-500/20' : ''
}`;

const labelClass = `block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
isLight ? 'text-slate-600' : 'text-slate-400'
}`;
const inputClass = `w-full px-2.5 py-1.5 text-xs rounded-lg border outline-none font-mono ${
isLight
? 'bg-slate-50 border-slate-300 text-slate-800 focus:border-indigo-500'
: 'bg-slate-950 border-slate-700 text-slate-100 focus:border-indigo-400'
}`;

const renderPopoverContent = () => {
switch (activePopover) {
case 'layout':
return (
<div className="space-y-3.5 text-xs">
<div>
<label className={labelClass}>Layout Columns</label>
<div className="grid grid-cols-4 gap-1">
{[
{ id: '1', label: '1 Col' },
{ id: '2', label: '2 Cols' },
{ id: '3', label: '3 Cols' },
{ id: '4', label: '4 Cols' },
].map((colOpt) => {
const currentCols =
s.layoutColumns ||
(section.type === 'image-text' || section.type === 'video-text'
? '2'
: section.type === 'features' ||
section.type === 'pricing' ||
section.type === 'team' ||
section.type === 'testimonials'
? '3'
: '1');
const isSel = String(currentCols) === colOpt.id;
return (
<button
key={colOpt.id}
type="button"
onClick={() => updateStyle('layoutColumns', colOpt.id)}
className={`py-1.5 text-xs rounded-lg border font-medium text-center transition-colors cursor-pointer ${
isSel
? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-xs'
: isLight
? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
: 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
}`}
>
{colOpt.label}
</button>
);
})}
</div>
</div>

{String(s.layoutColumns || '1') === '2' && (
<div>
<label className={labelClass}>Column Width Ratio</label>
<select
value={s.columnRatio || '1:1'}
onChange={(e) => updateStyle('columnRatio', e.target.value)}
className={`w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
isLight
? 'bg-slate-50 border-slate-300 text-slate-800'
: 'bg-slate-950 border-slate-700 text-slate-100'
}`}
>
<option value="1:1">Equal Widths (1:1)</option>
<option value="1:2">Narrow Left, Wide Right (1:2)</option>
<option value="2:1">Wide Left, Narrow Right (2:1)</option>
<option value="1:3">Extra Narrow Left (1:3)</option>
<option value="3:1">Extra Wide Left (3:1)</option>
</select>
</div>
)}

<div className="pt-2">
<label className={labelClass}>Vertical Alignment</label>
<div className="grid grid-cols-4 gap-1">
{[
{ id: 'flex-start', icon: ArrowUpToLine, label: 'Top' },
{ id: 'center', icon: AlignCenter, label: 'Center' },
{ id: 'flex-end', icon: ArrowDownToLine, label: 'Bottom' },
{ id: 'stretch', icon: StretchVertical, label: 'Stretch' },
].map((al) => {
const currentAlign = s.alignItems || 'center';
const isSel = currentAlign === al.id;
const Icon = al.icon;
return (
<button
key={al.id}
type="button"
onClick={() => updateStyle('alignItems', al.id)}
className={`py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1 ${
isSel
? 'bg-indigo-600 text-white font-bold border-indigo-600'
: isLight
? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
: 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
}`}
>
<Icon className="w-3.5 h-3.5" />
<span>{al.label}</span>
</button>
);
})}
</div>
</div>

<div className="pt-2">
<div className="flex items-center justify-between mb-1">
<label className={labelClass}>Column Gap</label>
<span className="text-[10px] font-mono text-indigo-400 font-semibold">
{s.gap !== undefined ? s.gap : 32}px
</span>
</div>
<input
type="range"
min={0}
max={64}
step={4}
value={s.gap !== undefined ? s.gap : 32}
onChange={(e) => updateStyle('gap', Number(e.target.value))}
className="w-full accent-indigo-500 cursor-pointer"
/>
</div>

<div className="pt-2">
<label className={labelClass}>Container Max-Width</label>
<select
value={s.maxWidth || '7xl'}
onChange={(e) => updateStyle('maxWidth', e.target.value)}
className={`w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
isLight
? 'bg-slate-50 border-slate-300 text-slate-800'
: 'bg-slate-950 border-slate-700 text-slate-100'
}`}
>
<option value="full">Full Width (100%)</option>
<option value="xl">XL / Extra Wide (1400px)</option>
<option value="7xl">7XL / Default Wide (1280px)</option>
<option value="6xl">6XL / Compact (1152px)</option>
<option value="5xl">5XL / Editorial (1024px)</option>
<option value="4xl">4XL / Form Width (896px)</option>
<option value="3xl">3XL / Narrow Column (768px)</option>
<option value="2xl">2XL / Extra Narrow (672px)</option>
<option value="prose">Prose Reading (65ch)</option>
</select>
</div>

<div className="pt-2">
<label className={labelClass}>Section Min Height</label>
<div className="grid grid-cols-5 gap-1">
{[
{ label: 'Auto', val: undefined },
{ label: '300px', val: 300 },
{ label: '480px', val: 480 },
{ label: '640px', val: 640 },
{ label: 'Screen', val: '100vh' },
].map((mh) => (
<button
key={mh.label}
type="button"
onClick={() => updateStyle('minHeight', mh.val)}
className={`py-1 text-[10px] rounded-lg border font-medium transition-colors cursor-pointer text-center ${
s.minHeight === mh.val || (mh.val === undefined && !s.minHeight)
? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-xs'
: isLight
? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
: 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
}`}
>
{mh.label}
</button>
))}
</div>
</div>

<div className="pt-2">
<label className={labelClass}>Anchor ID (Smooth Scroll)</label>
<div className="flex items-center gap-1.5">
<span className="text-slate-400 font-mono text-xs font-bold">#</span>
<input
type="text"
value={section.anchorId || ''}
onChange={(e) =>
updateProp('anchorId', e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))
}
placeholder={section.id}
className={inputClass}
/>
</div>
</div>
</div>
);
case 'background':
return (
<BackgroundController
styles={s}
onChange={(bgUpdates) => updateStyles(bgUpdates)}
uiTheme={uiTheme}
allowTransparent={true}
/>
);
case 'spacing':
return (
<div className="space-y-3.5 text-xs">
<div>
<div className="flex items-center justify-between mb-1">
<label className={labelClass}>Vertical Padding (Y)</label>
<span className="text-[10px] font-mono text-indigo-400 font-semibold">
{s.paddingY !== undefined ? s.paddingY : 48}px
</span>
</div>
<div className="flex items-center gap-2">
<input
type="range"
min={0}
max={160}
step={4}
value={s.paddingY !== undefined ? s.paddingY : 48}
onChange={(e) => updateStyle('paddingY', Number(e.target.value))}
className="flex-1 accent-indigo-500 cursor-pointer"
/>
<input
type="number"
min={0}
max={240}
value={s.paddingY !== undefined ? s.paddingY : 48}
onChange={(e) =>
updateStyle('paddingY', Math.max(0, parseInt(e.target.value, 10) || 0))
}
className={`w-14 px-1.5 py-1 text-center text-xs font-semibold rounded border outline-none font-mono ${
isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'
}`}
/>
</div>
</div>

<div className="pt-2">
<div className="flex items-center justify-between mb-1">
<label className={labelClass}>Horizontal Padding (X)</label>
<span className="text-[10px] font-mono text-indigo-400 font-semibold">
{s.paddingX !== undefined ? s.paddingX : 24}px
</span>
</div>
<div className="flex items-center gap-2">
<input
type="range"
min={0}
max={64}
step={4}
value={s.paddingX !== undefined ? s.paddingX : 24}
onChange={(e) => updateStyle('paddingX', Number(e.target.value))}
className="flex-1 accent-indigo-500 cursor-pointer"
/>
<input
type="number"
min={0}
max={120}
value={s.paddingX !== undefined ? s.paddingX : 24}
onChange={(e) =>
updateStyle('paddingX', Math.max(0, parseInt(e.target.value, 10) || 0))
}
className={`w-14 px-1.5 py-1 text-center text-xs font-semibold rounded border outline-none font-mono ${
isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'
}`}
/>
</div>
</div>
</div>
);
case 'alignment':
return (
<div className="space-y-3.5 text-xs">
<div>
<label className={labelClass}>Content Alignment</label>
<div className="grid grid-cols-4 gap-1">
{[
{ id: 'left', icon: AlignLeft, label: 'Left' },
{ id: 'center', icon: AlignCenter, label: 'Center' },
{ id: 'right', icon: AlignRight, label: 'Right' },
{ id: 'none', icon: AlignJustify, label: 'Stretch' },
].map((al) => {
const currentAlign = s.alignment || s.contentAlignment || 'center';
const isSel = currentAlign === al.id;
const Icon = al.icon;
return (
<button
key={al.id}
type="button"
onClick={() => {
updateStyles({
alignment: al.id,
contentAlignment: al.id,
textAlign: al.id === 'none' ? 'left' : al.id,
});
}}
className={`py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1 ${
isSel
? 'bg-indigo-600 text-white font-bold border-indigo-600'
: isLight
? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
: 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
}`}
>
<Icon className="w-3.5 h-3.5" />
<span>{al.label}</span>
</button>
);
})}
</div>
</div>
</div>
);
case 'border':
return (
<div className="space-y-3.5 text-xs">
<div>
<label className={labelClass}>Border Placement</label>
<div className="grid grid-cols-4 gap-1">
{[
{ id: 'all', label: 'All Sides' },
{ id: 'bottom', label: 'Bottom' },
{ id: 'top-bottom', label: 'Top & Bot' },
{ id: 'none', label: 'None' },
].map((pos) => {
const currentPos = s.borderPosition || 'all';
const isSel = currentPos === pos.id;
return (
<button
key={pos.id}
type="button"
onClick={() => updateStyle('borderPosition', pos.id)}
className={`py-1 text-[10px] rounded-lg border font-medium transition-all cursor-pointer ${
isSel
? 'bg-indigo-600 text-white font-bold border-indigo-600'
: isLight
? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
: 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
}`}
>
{pos.label}
</button>
);
})}
</div>
</div>

<div className="pt-2">
<label className={labelClass}>Border Style</label>
<div className="flex flex-wrap gap-1.5 pt-0.5">
{[
{ id: 'solid', label: 'Solid' },
{ id: 'dashed', label: 'Dashed' },
{ id: 'dotted', label: 'Dotted' },
{ id: 'none', label: 'None' },
].map((b) => (
<button
key={b.id}
type="button"
onClick={() => {
updateStyles({
borderStyle: b.id,
borderWidth: b.id === 'none' ? 0 : s.borderWidth || 1,
});
}}
className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
(s.borderStyle || (s.borderWidth ? 'solid' : 'none')) === b.id
? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
: isLight
? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
: 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
}`}
>
{b.label}
</button>
))}
</div>
</div>

<div className="pt-2">
<div className="flex items-center justify-between mb-1">
<label className={labelClass}>Border Width</label>
<span className="text-[10px] font-mono text-indigo-400 font-semibold">
{s.borderWidth ?? 0}px
</span>
</div>
<div className="flex items-center gap-2">
<input
type="range"
min={0}
max={16}
value={s.borderWidth ?? 0}
onChange={(e) => updateStyle('borderWidth', Number(e.target.value))}
className="flex-1 accent-indigo-500 cursor-pointer"
/>
<input
type="number"
min={0}
max={32}
value={s.borderWidth ?? 0}
onChange={(e) =>
updateStyle('borderWidth', Math.max(0, parseInt(e.target.value, 10) || 0))
}
className={`w-14 px-1.5 py-1 text-center text-xs font-semibold rounded border outline-none font-mono ${
isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'
}`}
/>
</div>
</div>

<div className="pt-2 space-y-2">
<div className="flex items-center justify-between">
<label className={labelClass}>Border Color</label>
<button
type="button"
onClick={() => updateStyle('borderColor', 'transparent')}
className="text-[10px] text-slate-400 hover:text-indigo-500 cursor-pointer"
>
Clear
</button>
</div>

<div className="flex flex-wrap gap-1.5">
<button
type="button"
onClick={() => setShowBorderColorPicker((prev) => !prev)}
className={`w-6 h-6 rounded-full border shadow-xs cursor-pointer hover:scale-110 transition-transform relative flex items-center justify-center shrink-0 ${
showBorderColorPicker
? 'border-indigo-600 bg-indigo-50/20 text-indigo-500 font-bold'
: isLight
? 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
: 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600'
}`}
title="Custom color picker"
>
<Plus className="w-3.5 h-3.5" />
</button>

{BORDER_COLOR_PRESETS.map((hex) => {
const isSelected =
s.borderColor && s.borderColor.toLowerCase() === hex.toLowerCase();
return (
<button
key={hex}
type="button"
onClick={() => updateStyle('borderColor', hex)}
className="w-6 h-6 rounded-full border border-slate-700/60 shadow-xs cursor-pointer hover:scale-110 transition-transform relative flex items-center justify-center shrink-0"
style={{ backgroundColor: hex }}
title={hex}
>
{isSelected && (
<Check
className={`w-3.5 h-3.5 mx-auto ${
hex === '#ffffff' || hex === '#cbd5e1' ? 'text-slate-900' : 'text-white'
}`}
/>
)}
</button>
);
})}
</div>

{showBorderColorPicker && (
<div className="pt-2">
<InlineColorPicker
color={s.borderColor || '#4f46e5'}
onChange={(hex) => updateStyle('borderColor', hex)}
isLight={isLight}
canvasHeight="h-24"
/>
</div>
)}
</div>

<div className="pt-2 space-y-2">
<div className="flex items-center justify-between">
<label className={labelClass}>Corner Radius</label>
<div className="flex rounded-lg border p-0.5 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
<button
type="button"
onClick={() => setRadiusMode('uniform')}
className={`px-2 py-0.5 text-[10px] font-semibold rounded-md transition-colors cursor-pointer ${
radiusMode === 'uniform'
? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
: 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
}`}
>
Uniform
</button>
<button
type="button"
onClick={() => setRadiusMode('corners')}
className={`px-2 py-0.5 text-[10px] font-semibold rounded-md transition-colors cursor-pointer ${
radiusMode === 'corners'
? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
: 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
}`}
>
Per Corner
</button>
</div>
</div>

{radiusMode === 'uniform' ? (
<div className="flex items-center gap-2">
<input
type="range"
min={0}
max={64}
value={s.borderRadius ?? 0}
onChange={(e) => updateStyle('borderRadius', Number(e.target.value))}
className="flex-1 accent-indigo-500 cursor-pointer"
/>
<input
type="number"
min={0}
max={120}
value={s.borderRadius ?? 0}
onChange={(e) =>
updateStyle('borderRadius', Math.max(0, parseInt(e.target.value, 10) || 0))
}
className={`w-14 px-1.5 py-1 text-center text-xs font-semibold rounded border outline-none font-mono ${
isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'
}`}
/>
</div>
) : (
<div className="grid grid-cols-2 gap-2">
{[
{ label: 'Top-Left', prop: 'borderTopLeftRadius' },
{ label: 'Top-Right', prop: 'borderTopRightRadius' },
{ label: 'Bottom-Left', prop: 'borderBottomLeftRadius' },
{ label: 'Bottom-Right', prop: 'borderBottomRightRadius' },
].map(({ label, prop }) => {
const curVal = s[prop] !== undefined ? s[prop] : s.borderRadius || 0;
return (
<div key={prop} className="space-y-1">
<span className="text-[10px] text-slate-500 block">{label}</span>
<div className="flex items-center gap-1">
<input
type="range"
min={0}
max={64}
value={curVal}
onChange={(e) => updateStyle(prop, Number(e.target.value))}
className="flex-1 accent-indigo-500 cursor-pointer"
/>
<input
type="number"
min={0}
max={120}
value={curVal}
onChange={(e) =>
updateStyle(prop, Math.max(0, parseInt(e.target.value, 10) || 0))
}
className={`w-10 px-1 py-0.5 text-center text-[11px] font-semibold rounded border outline-none font-mono ${
isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'
}`}
/>
</div>
</div>
);
})}
</div>
)}
</div>
</div>
);
case 'shadow':
return (
<div className="space-y-3.5 text-xs">
<div>
<label className={labelClass}>Elevation / Box Shadow</label>
<div className="grid grid-cols-3 gap-1.5">
{[
{ id: 'none', label: 'None' },
{ id: 'sm', label: 'SM' },
{ id: 'md', label: 'MD' },
{ id: 'lg', label: 'LG' },
{ id: 'xl', label: 'XL' },
{ id: '2xl', label: '2XL' },
].map((sh) => (
<button
key={sh.id}
type="button"
onClick={() => updateStyle('shadow', sh.id)}
className={`py-2 text-xs rounded-xl border font-medium transition-all cursor-pointer text-center ${
(s.shadow || 'none') === sh.id
? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-xs'
: isLight
? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
: 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
}`}
>
{sh.label}
</button>
))}
</div>
</div>
</div>
);
case 'animation':
return (
<div className="space-y-3.5 text-xs">
<div>
<label className={labelClass}>Entrance Animation</label>
<select
value={s.animation || 'none'}
onChange={(e) => updateStyle('animation', e.target.value)}
className={`w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
isLight
? 'bg-slate-50 border-slate-300 text-slate-800'
: 'bg-slate-950 border-slate-700 text-slate-100'
}`}
>
<option value="none">No Entrance Animation</option>
<option value="fade">Simple Fade In</option>
<option value="slide-up">Slide Up & Fade In</option>
<option value="slide-left">Slide Left & Fade In</option>
<option value="slide-right">Slide Right & Fade In</option>
<option value="scale">Scale Up & Fade In</option>
</select>
</div>
</div>
);
default:
return null;
}
};

return (
<div
onClick={(e) => e.stopPropagation()}
onMouseEnter={handleSectionMouseEnter}
onMouseLeave={handleSectionMouseLeave}
onDoubleClick={(e) => {
e.stopPropagation();
setToolbarOffset({ x: 0, y: 0 });
}}
style={isTopBar ? undefined : {
transform: `translate3d(${toolbarOffset.x}px, ${toolbarOffset.y}px, 0px)`,
touchAction: 'none',
}}
className={wrapperClasses}
>
<div className={toolbarClasses}>
<div className="flex items-center gap-1.5 flex-nowrap shrink-0">
{!isTopBar && (
<div
onPointerDown={handlePointerDownToolbar}
onPointerMove={handlePointerMoveToolbar}
onPointerUp={handlePointerUpToolbar}
onPointerCancel={handlePointerUpToolbar}
className={`p-1.5 rounded-lg ${
isLight
? 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
: 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
} cursor-grab active:cursor-grabbing transition-colors select-none`}
title="Drag section controls (Double-click to reset)"
>
<GripVertical className="w-3.5 h-3.5" />
</div>
)}

<button
type="button"
onClick={(e) => {
e.stopPropagation();
onAddElementToSection(section.id);
}}
className="px-2 py-1.5 rounded-[50px] bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
title="Add element to section"
>
<Plus className="w-3.5 h-3.5" />
<span className="text-[11px]">Add</span>
</button>

<div className={`h-4 w-px ${isLight ? 'bg-slate-200' : 'bg-slate-700'} mx-0.5`} />

<button
type="button"
onClick={() => setActivePopover(activePopover === 'layout' ? null : 'layout')}
className={`px-2 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
activePopover === 'layout'
? 'bg-indigo-600/20 text-indigo-500 font-bold'
: isLight
? 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
: 'hover:bg-slate-800 text-slate-300 hover:text-white'
}`}
title="Section Layout & Columns"
>
<span className="text-[11px] font-medium">Layout</span>
</button>

<div className={`h-4 w-px ${isLight ? 'bg-slate-200' : 'bg-slate-700'} mx-0.5`} />

<button
type="button"
onClick={() => setActivePopover(activePopover === 'background' ? null : 'background')}
className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
activePopover === 'background'
? 'bg-indigo-600/20 text-indigo-500 font-bold'
: isLight
? 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
: 'hover:bg-slate-800 text-slate-300 hover:text-white'
}`}
title="Section Background"
>
<span className="text-[11px] font-medium">Background</span>
</button>

<div className={`h-4 w-px ${isLight ? 'bg-slate-200' : 'bg-slate-700'} mx-0.5`} />

<button
type="button"
onClick={() => setActivePopover(activePopover === 'spacing' ? null : 'spacing')}
className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
activePopover === 'spacing'
? 'bg-indigo-600/20 text-indigo-500 font-bold'
: isLight
? 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
: 'hover:bg-slate-800 text-slate-300 hover:text-white'
}`}
title="Section Spacing"
>
<span className="text-[11px] font-medium">Spacing</span>
</button>

<div className={`h-4 w-px ${isLight ? 'bg-slate-200' : 'bg-slate-700'} mx-0.5`} />

<button
type="button"
onClick={() => setActivePopover(activePopover === 'alignment' ? null : 'alignment')}
className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
activePopover === 'alignment'
? 'bg-indigo-600/20 text-indigo-500 font-bold'
: isLight
? 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
: 'hover:bg-slate-800 text-slate-300 hover:text-white'
}`}
title="Content Alignment"
>
<span className="text-[11px] font-medium">Alignment</span>
</button>

<div className={`h-4 w-px ${isLight ? 'bg-slate-200' : 'bg-slate-700'} mx-0.5`} />

<button
type="button"
onClick={() => setActivePopover(activePopover === 'border' ? null : 'border')}
className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
activePopover === 'border'
? 'bg-indigo-600/20 text-indigo-500 font-bold'
: isLight
? 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
: 'hover:bg-slate-800 text-slate-300 hover:text-white'
}`}
title="Section Border & Radius"
>
<span className="text-[11px] font-medium">Border</span>
</button>

<div className={`h-4 w-px ${isLight ? 'bg-slate-200' : 'bg-slate-700'} mx-0.5`} />

<button
type="button"
onClick={() => setActivePopover(activePopover === 'shadow' ? null : 'shadow')}
className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
activePopover === 'shadow'
? 'bg-indigo-600/20 text-indigo-500 font-bold'
: isLight
? 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
: 'hover:bg-slate-800 text-slate-300 hover:text-white'
}`}
title="Box Shadow & Elevation"
>
<span className="text-[11px] font-medium">Box Shadow</span>
</button>

<div className={`h-4 w-px ${isLight ? 'bg-slate-200' : 'bg-slate-700'} mx-0.5`} />

<button
type="button"
onClick={() => setActivePopover(activePopover === 'animation' ? null : 'animation')}
className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
activePopover === 'animation'
? 'bg-indigo-600/20 text-indigo-500 font-bold'
: isLight
? 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
: 'hover:bg-slate-800 text-slate-300 hover:text-white'
}`}
title="Entrance Animation"
>
<span className="text-[11px] font-medium">Animation</span>
</button>

<div className={`h-4 w-px ${isLight ? 'bg-slate-200' : 'bg-slate-700'} mx-0.5`} />

{section.type === 'slideshow' && (
<>
<div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/20 text-[11px] font-mono text-slate-300">
<span>Slide {slideshowIndex + 1}/{Math.max(1, section.elements.length)}</span>
</div>
<button
type="button"
onClick={() =>
setSlideshowIndex((i) => (i > 0 ? i - 1 : Math.max(0, section.elements.length - 1)))
}
className={`p-1.5 rounded-lg ${
isLight ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-slate-800 text-slate-300'
} transition-colors cursor-pointer`}
title="Previous Slide"
>
<ChevronUp className="w-3.5 h-3.5 -rotate-90" />
</button>
<button
type="button"
onClick={() =>
setSlideshowIndex((i) => (i < section.elements.length - 1 ? i + 1 : 0))
}
className={`p-1.5 rounded-lg ${
isLight ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-slate-800 text-slate-300'
} transition-colors cursor-pointer`}
title="Next Slide"
>
<ChevronDown className="w-3.5 h-3.5 -rotate-90" />
</button>
</>
)}

{(section.type === 'image-text' || section.type === 'video-text') && (
<button
type="button"
onClick={() =>
updateStyle('reverseLayout', !section.styles?.reverseLayout)
}
className={`p-1.5 rounded-lg ${
section.styles?.reverseLayout
? 'bg-indigo-600 text-white'
: isLight
? 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
: 'hover:bg-slate-800 text-slate-300 hover:text-white'
} transition-colors cursor-pointer`}
title="Reverse Media Order"
>
<ArrowLeftRight className="w-3.5 h-3.5" />
</button>
)}

<div className={`h-4 w-px ${isLight ? 'bg-slate-200' : 'bg-slate-700'} mx-0.5`} />

<div className="flex items-center">
<button
type="button"
onClick={() => onMoveSection(section.id, 'up')}
className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
isLight ? 'text-slate-600' : 'text-slate-300'
}`}
title="Move Section Up"
>
<ChevronUp className="w-3.5 h-3.5" />
</button>
<button
type="button"
onClick={() => onMoveSection(section.id, 'down')}
className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
isLight ? 'text-slate-600' : 'text-slate-300'
}`}
title="Move Section Down"
>
<ChevronDown className="w-3.5 h-3.5" />
</button>
</div>

<div className="relative">
<button
type="button"
onClick={() => setShowSectionMoreMenu((prev) => !prev)}
className={`p-1.5 rounded-lg ${
showSectionMoreMenu
? 'bg-slate-700 text-white'
: isLight
? 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
: 'hover:bg-slate-800 text-slate-300 hover:text-white'
} transition-colors cursor-pointer`}
title="More Actions"
>
<MoreHorizontal className="w-3.5 h-3.5" />
</button>

{showSectionMoreMenu && (
<div
className={`absolute right-0 top-full mt-1.5 w-48 rounded-xl shadow-xl border p-1 z-50 animate-in fade-in zoom-in-95 duration-100 ${
isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
}`}
>
<button
type="button"
onClick={() => {
setShowSectionMoreMenu(false);
onOpenSectionEditBox?.(section);
}}
className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center gap-2 font-medium transition-colors cursor-pointer ${
isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-200'
}`}
>
<Settings className="w-3.5 h-3.5 shrink-0" />
<span>Section Inspector</span>
</button>
<button
type="button"
onClick={() => {
setShowSectionMoreMenu(false);
onDuplicateSection(section.id);
}}
className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center gap-2 font-medium transition-colors cursor-pointer ${
isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-200'
}`}
>
<Copy className="w-3.5 h-3.5 shrink-0" />
<span>Duplicate Section</span>
</button>
<button
type="button"
onClick={() => {
setShowSectionMoreMenu(false);
onDeleteSection(section.id);
}}
className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center gap-2 font-medium transition-colors cursor-pointer hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-950/40 dark:text-rose-400"
>
<Trash2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
<span>Delete Section</span>
</button>
</div>
)}
</div>

{isTopBar && onClose && (
<>
<div className={`h-4 w-px ${isLight ? 'bg-slate-200' : 'bg-slate-800'} mx-0.5 shrink-0`} />
<button
type="button"
onClick={(e) => {
e.stopPropagation();
onClose();
}}
className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
isLight ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-slate-800 text-slate-400'
}`}
title="Close section toolbar"
aria-label="Close section toolbar"
>
<X className="w-4 h-4" />
</button>
</>
)}
</div>
</div>

<Popover
isOpen={activePopover !== null}
onClose={() => setActivePopover(null)}
uiTheme={uiTheme}
>
{renderPopoverContent()}
</Popover>
</div>
);
};
