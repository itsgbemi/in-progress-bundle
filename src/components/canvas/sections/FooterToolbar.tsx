import React, { useState, useEffect, useRef } from 'react';
import {
GripVertical,
Plus,
Columns,
Palette,
Square,
Sparkles,
Smartphone,
Tablet,
Trash2,
Settings,
ChevronUp,
ChevronDown,
Check,
Copy,
AlignLeft,
AlignCenter,
AlignRight,
ArrowUpToLine,
ArrowDownToLine,
StretchVertical,
X,
} from 'lucide-react';
import { WebsiteSection, SelectedElementContext, ViewportMode } from '../../../types';
import { BackgroundController } from '../../BackgroundController';
import { InlineColorPicker } from '../../properties/InlineColorPicker';
import { Popover } from '../../common/Popover';

interface FooterToolbarProps {
section: WebsiteSection;
isSectionSelected: boolean;
isSectionHovered: boolean;
selectedContext?: SelectedElementContext | null;
editorMode: string;
uiTheme: 'dark' | 'light';
viewportMode?: ViewportMode;
variant?: 'floating' | 'top-bar';
onClose?: () => void;
onUpdateSection?: (section: WebsiteSection) => void;
onSelectSection?: (section: WebsiteSection) => void;
onOpenSectionEditBox?: (section: WebsiteSection) => void;
onAddElementToSection: (sectionId: string) => void;
onMoveSection?: (sectionId: string, direction: 'up' | 'down') => void;
onDuplicateSection?: (sectionId: string) => void;
onDeleteSection?: (sectionId: string) => void;
handleSectionMouseEnter?: () => void;
handleSectionMouseLeave?: () => void;
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

export const FooterToolbar: React.FC<FooterToolbarProps> = ({
section,
isSectionSelected,
isSectionHovered,
selectedContext,
editorMode,
uiTheme,
viewportMode = 'desktop',
variant = 'floating',
onClose,
onUpdateSection,
onSelectSection,
onOpenSectionEditBox,
onAddElementToSection,
onMoveSection,
onDuplicateSection,
onDeleteSection,
handleSectionMouseEnter,
handleSectionMouseLeave,
}) => {
const [toolbarOffset, setToolbarOffset] = useState({ x: 0, y: 0 });
const [isDraggingToolbar, setIsDraggingToolbar] = useState(false);
const [activePopover, setActivePopover] = useState<
'columns' | 'background' | 'border' | 'shadow' | 'mobile' | null
>(null);
const [radiusMode, setRadiusMode] = useState<'uniform' | 'corners'>('uniform');
const [showBorderColorPicker, setShowBorderColorPicker] = useState(false);
const [mobileTab, setMobileTab] = useState<'mobile' | 'tablet'>('mobile');

const popoverRef = useRef<HTMLDivElement>(null);

useEffect(() => {
const handleClickOutside = (e: MouseEvent) => {
const target = e.target as HTMLElement | null;
if (
popoverRef.current &&
!popoverRef.current.contains(target) &&
!target?.closest('.formatting-popover') &&
!target?.closest('[role="dialog"]') &&
!target?.closest('.color-picker-popover')
) {
setActivePopover(null);
}
};
if (activePopover) {
document.addEventListener('mousedown', handleClickOutside);
}
return () => document.removeEventListener('mousedown', handleClickOutside);
}, [activePopover]);

if (editorMode !== 'edit') return null;

const isLight = uiTheme === 'light';
const isTopBar = variant === 'top-bar';
const isToolbarVisible =
isTopBar || isSectionSelected || (isSectionHovered && !selectedContext);

const s = { ...(section.style || {}), ...(section.styles || {}) };

const updateStyle = (key: string, value: any) => {
if (!onUpdateSection) return;
const currentStyles = {
...(section.style || {}),
...(section.styles || {}),
};
const merged = {
...currentStyles,
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
const currentStyles = {
...(section.style || {}),
...(section.styles || {}),
};
const merged = {
...currentStyles,
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

const labelClass = `block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
isLight ? 'text-slate-600' : 'text-slate-400'
}`;

const getPopoverTitle = (type: typeof activePopover) => {
switch (type) {
case 'columns': return 'Footer Columns & Layout';
case 'background': return 'Footer Background';
case 'border': return 'Footer Border & Radius';
case 'shadow': return 'Footer Elevation & Shadow';
case 'mobile': return 'Responsive Footer Settings';
default: return 'Footer Settings';
}
};

const renderPopovers = () => (
<>
{activePopover === 'columns' && (
<div className="space-y-3.5 text-xs">
<div>
<label className={labelClass}>Footer Columns</label>
<div className="grid grid-cols-4 gap-1.5">
{[
{ id: 'columns-1', label: '1 Col', num: 1 },
{ id: 'columns-2', label: '2 Cols', num: 2 },
{ id: 'columns-3', label: '3 Cols', num: 3 },
{ id: 'columns-4', label: '4 Cols', num: 4 },
].map((col) => {
const currentCols = section.footerLayout || 'columns-4';
const isSel = currentCols === col.id;
return (
<button
key={col.id}
type="button"
onClick={() => updateProp('footerLayout', col.id)}
className={`py-1.5 text-xs rounded-lg border font-medium text-center transition-colors cursor-pointer ${
isSel
? 'bg-indigo-600 text-white font-bold border-indigo-600'
: isLight
? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
: 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
}`}
>
{col.label}
</button>
);
})}
</div>
</div>

<div>
<label className={labelClass}>Column Width Ratio</label>
<select
value={section.footerColumnRatio || 'equal'}
onChange={(e) => updateProp('footerColumnRatio', e.target.value)}
className={`w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
isLight
? 'bg-slate-50 border-slate-300 text-slate-800'
: 'bg-slate-950 border-slate-700 text-slate-100'
}`}
>
<option value="equal">Equal Widths (1:1:1)</option>
<option value="2-1">Wide Left (2:1)</option>
<option value="1-2">Wide Right (1:2)</option>
<option value="3-1">Large Left Hero (3:1)</option>
<option value="1-3">Large Right Form (1:3)</option>
<option value="2-1-1">Wide First, Split Rest (2:1:1)</option>
</select>
</div>

<div className="pt-2 border-t border-slate-200 dark:border-slate-800">
<label className={labelClass}>Content Alignment</label>
<div className="grid grid-cols-3 gap-1">
{[
{ id: 'left', label: 'Left', icon: AlignLeft },
{ id: 'center', label: 'Center', icon: AlignCenter },
{ id: 'right', label: 'Right', icon: AlignRight },
].map((al) => {
const currentAlign = s.textAlign || 'left';
const isSel = currentAlign === al.id;
const Icon = al.icon;
return (
<button
key={al.id}
type="button"
onClick={() => updateStyle('textAlign', al.id)}
className={`py-1.5 text-xs rounded-lg border font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer ${
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

<div className="pt-2 border-t border-slate-200 dark:border-slate-800">
<label className={labelClass}>Vertical Alignment</label>
<div className="grid grid-cols-4 gap-1">
{[
{ id: 'flex-start', label: 'Top', icon: ArrowUpToLine },
{ id: 'center', label: 'Center', icon: AlignCenter },
{ id: 'flex-end', label: 'Bottom', icon: ArrowDownToLine },
{ id: 'stretch', label: 'Stretch', icon: StretchVertical },
].map((al) => {
const currentAlign = s.alignItems || 'flex-start';
const isSel =
currentAlign === al.id ||
(al.id === 'flex-start' && (currentAlign === 'top' || currentAlign === 'start')) ||
(al.id === 'flex-end' && (currentAlign === 'bottom' || currentAlign === 'end'));
const Icon = al.icon;
return (
<button
key={al.id}
type="button"
onClick={() => updateStyle('alignItems', al.id)}
className={`py-1.5 text-xs rounded-lg border font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer ${
isSel
? 'bg-indigo-600 text-white font-bold border-indigo-600'
: isLight
? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
: 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
}`}
title={al.label}
>
<Icon className="w-3.5 h-3.5" />
<span>{al.label}</span>
</button>
);
})}
</div>
</div>

<div className="pt-2 border-t border-slate-200 dark:border-slate-800">
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

<div className="pt-2 border-t border-slate-200 dark:border-slate-800">
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
<option value="xl">XL (1400px)</option>
<option value="7xl">7XL Default (1280px)</option>
<option value="6xl">6xl Compact (1152px)</option>
<option value="5xl">5xl Editorial (1024px)</option>
</select>
</div>

<div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
<div>
<div className="flex items-center justify-between mb-1">
<label className={labelClass}>Pad Y</label>
<span className="text-[10px] font-mono text-indigo-400">
{s.paddingY !== undefined ? s.paddingY : 48}px
</span>
</div>
<input
type="range"
min={8}
max={96}
step={4}
value={s.paddingY !== undefined ? s.paddingY : 48}
onChange={(e) => updateStyle('paddingY', Number(e.target.value))}
className="w-full accent-indigo-500 cursor-pointer"
/>
</div>
<div>
<div className="flex items-center justify-between mb-1">
<label className={labelClass}>Pad X</label>
<span className="text-[10px] font-mono text-indigo-400">
{s.paddingX !== undefined ? s.paddingX : 24}px
</span>
</div>
<input
type="range"
min={0}
max={64}
step={4}
value={s.paddingX !== undefined ? s.paddingX : 24}
onChange={(e) => updateStyle('paddingX', Number(e.target.value))}
className="w-full accent-indigo-500 cursor-pointer"
/>
</div>
</div>
</div>
)}

{activePopover === 'background' && (
<BackgroundController
styles={s}
onChange={(bgUpdates) => updateStyles(bgUpdates)}
uiTheme={uiTheme}
label="Footer Background"
allowTransparent={true}
/>
)}

{activePopover === 'border' && (
<div className="space-y-3.5 text-xs">
<div>
<label className={labelClass}>Border Placement</label>
<div className="grid grid-cols-4 gap-1">
{[
{ id: 'top', label: 'Top' },
{ id: 'all', label: 'All Sides' },
{ id: 'top-bottom', label: 'Top & Bot' },
{ id: 'none', label: 'None' },
].map((pos) => {
const currentPos = s.borderPosition || 'top';
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

<div className="pt-2 border-t border-slate-200 dark:border-slate-800">
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

<div className="pt-2 border-t border-slate-200 dark:border-slate-800">
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
className="w-14 px-1.5 py-1 text-center text-xs font-semibold rounded border outline-none font-mono"
/>
</div>
</div>

<div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
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
? 'border-indigo-600 bg-indigo-500/20 text-indigo-500 font-bold'
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
<div className="pt-2 border-t border-slate-200 dark:border-slate-800">
<InlineColorPicker
color={s.borderColor || '#4f46e5'}
onChange={(hex) => updateStyle('borderColor', hex)}
isLight={isLight}
canvasHeight="h-24"
/>
</div>
)}
</div>

<div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
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
max={48}
value={s.borderRadius ?? 0}
onChange={(e) => updateStyle('borderRadius', Number(e.target.value))}
className="flex-1 accent-indigo-500 cursor-pointer"
/>
<input
type="number"
min={0}
max={64}
value={s.borderRadius ?? 0}
onChange={(e) =>
updateStyle('borderRadius', Math.max(0, parseInt(e.target.value, 10) || 0))
}
className="w-14 px-1.5 py-1 text-center text-xs font-semibold rounded border outline-none font-mono"
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
max={48}
value={curVal}
onChange={(e) => updateStyle(prop, Number(e.target.value))}
className="flex-1 accent-indigo-500 cursor-pointer"
/>
<input
type="number"
min={0}
max={64}
value={curVal}
onChange={(e) =>
updateStyle(prop, Math.max(0, parseInt(e.target.value, 10) || 0))
}
className="w-10 px-1 py-0.5 text-center text-[11px] font-semibold rounded border outline-none font-mono"
/>
</div>
</div>
);
})}
</div>
)}
</div>
</div>
)}

{activePopover === 'shadow' && (
<div className="space-y-3.5 text-xs">
<label className={labelClass}>Footer Elevation / Shadow</label>
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
)}

{activePopover === 'mobile' && (
<div className="space-y-3.5 text-xs">
<div className="flex rounded-xl border p-0.5 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 mb-3">
<button
type="button"
onClick={() => setMobileTab('mobile')}
className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
mobileTab === 'mobile'
? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
: 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
}`}
>
<Smartphone className="w-3.5 h-3.5" />
<span>Mobile Devices</span>
</button>
<button
type="button"
onClick={() => setMobileTab('tablet')}
className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
mobileTab === 'tablet'
? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
: 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
}`}
>
<Tablet className="w-3.5 h-3.5" />
<span>Tablets</span>
</button>
</div>

{mobileTab === 'mobile' ? (
<div className="space-y-3 text-xs">
<div>
<label className={labelClass}>Mobile Column Layout</label>
<div className="grid grid-cols-3 gap-1.5">
{[
{ id: 'stacked', label: '1-Column (Stacked)' },
{ id: 'grid-2', label: '2-Columns (Compact)' },
{ id: 'scroll', label: 'Horizontal Swipe' },
].map((style) => {
const currentStyle = section.footerMobileBehavior || 'stacked';
const isSel = currentStyle === style.id;
return (
<button
key={style.id}
type="button"
onClick={() => updateProp('footerMobileBehavior', style.id)}
className={`py-1.5 text-xs rounded-lg border font-medium text-center transition-colors cursor-pointer ${
isSel
? 'bg-indigo-600 text-white font-bold border-indigo-600'
: isLight
? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
: 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
}`}
>
{style.label}
</button>
);
})}
</div>
</div>

<div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
<div>
<div className="flex items-center justify-between mb-1">
<label className={labelClass}>Mobile Pad Y</label>
<span className="text-[10px] font-mono text-indigo-400">
{s.mobilePaddingY !== undefined ? s.mobilePaddingY : 32}px
</span>
</div>
<input
type="range"
min={8}
max={64}
step={4}
value={s.mobilePaddingY !== undefined ? s.mobilePaddingY : 32}
onChange={(e) => updateStyle('mobilePaddingY', Number(e.target.value))}
className="w-full accent-indigo-500 cursor-pointer"
/>
</div>
<div>
<div className="flex items-center justify-between mb-1">
<label className={labelClass}>Mobile Pad X</label>
<span className="text-[10px] font-mono text-indigo-400">
{s.mobilePaddingX !== undefined ? s.mobilePaddingX : 16}px
</span>
</div>
<input
type="range"
min={4}
max={40}
step={2}
value={s.mobilePaddingX !== undefined ? s.mobilePaddingX : 16}
onChange={(e) => updateStyle('mobilePaddingX', Number(e.target.value))}
className="w-full accent-indigo-500 cursor-pointer"
/>
</div>
</div>
</div>
) : (
<div className="space-y-3 text-xs">
<div>
<label className={labelClass}>Tablet Column Layout</label>
<div className="grid grid-cols-3 gap-1.5">
{[
{ id: 'grid-2', label: '2-Columns' },
{ id: 'grid-3', label: '3-Columns' },
{ id: 'row', label: 'Full Row' },
].map((tbl) => {
const currentStyle = section.footerTabletBehavior || 'grid-2';
const isSel = currentStyle === tbl.id;
return (
<button
key={tbl.id}
type="button"
onClick={() => updateProp('footerTabletBehavior', tbl.id)}
className={`py-1.5 text-xs rounded-lg border font-medium text-center transition-colors cursor-pointer ${
isSel
? 'bg-indigo-600 text-white font-bold border-indigo-600'
: isLight
? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
: 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
}`}
>
{tbl.label}
</button>
);
})}
</div>
</div>

<div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
<div>
<div className="flex items-center justify-between mb-1">
<label className={labelClass}>Tablet Pad Y</label>
<span className="text-[10px] font-mono text-indigo-400">
{s.tabletPaddingY !== undefined ? s.tabletPaddingY : 36}px
</span>
</div>
<input
type="range"
min={12}
max={64}
step={4}
value={s.tabletPaddingY !== undefined ? s.tabletPaddingY : 36}
onChange={(e) => updateStyle('tabletPaddingY', Number(e.target.value))}
className="w-full accent-indigo-500 cursor-pointer"
/>
</div>
<div>
<div className="flex items-center justify-between mb-1">
<label className={labelClass}>Tablet Pad X</label>
<span className="text-[10px] font-mono text-indigo-400">
{s.tabletPaddingX !== undefined ? s.tabletPaddingX : 20}px
</span>
</div>
<input
type="range"
min={4}
max={48}
step={2}
value={s.tabletPaddingX !== undefined ? s.tabletPaddingX : 20}
onChange={(e) => updateStyle('tabletPaddingX', Number(e.target.value))}
className="w-full accent-indigo-500 cursor-pointer"
/>
</div>
</div>
</div>
)}
</div>
)}
</>
);

const wrapperClasses = isTopBar
? "relative w-full z-[85]"
: `absolute top-2 right-2 sm:right-4 z-40 transition-all duration-150 ${
isToolbarVisible ? 'opacity-100 scale-100' : 'opacity-0 pointer-events-none scale-95'
}`;

const toolbarClasses = isTopBar
? `w-full border-b px-4 py-2 flex items-center justify-between gap-2 text-xs transition-colors overflow-x-auto no-scrollbar flex-nowrap ${
isLight ? 'bg-slate-50/95 border-slate-200 text-slate-700' : 'bg-slate-900/95 border-slate-800 text-slate-200'
}`
: `${
isLight
? 'bg-white/95 border-slate-200/90 text-slate-800 shadow-xl ring-1 ring-slate-900/5'
: 'bg-slate-900/95 border-slate-700/90 text-slate-100 shadow-2xl ring-1 ring-white/5'
} backdrop-blur-md border rounded-xl px-2.5 py-1.5 flex items-center gap-1 text-xs transition-all duration-150 ${
isDraggingToolbar ? 'ring-2 ring-indigo-500 cursor-grabbing shadow-indigo-500/20' : ''
}`;

return (
<div
ref={popoverRef}
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
title="Drag footer controls (Double-click to reset)"
>
<GripVertical className="w-3.5 h-3.5" />
</div>
)}

{isTopBar && (
<>
<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 font-bold text-xs shrink-0">
<span>Footer</span>
</div>
<div className={`h-4 w-px ${isLight ? 'bg-slate-200' : 'bg-slate-800'} mx-0.5 shrink-0`} />
</>
)}

<button
type="button"
onClick={(e) => {
e.stopPropagation();
onAddElementToSection(section.id);
}}
className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
title="Add Element to Footer"
>
<Plus className="w-3.5 h-3.5" />
<span className={isTopBar ? "" : "text-[11px]"}>Add Element</span>
</button>

<div className={`h-4 w-px ${isLight ? 'bg-slate-200' : 'bg-slate-800'} mx-0.5 shrink-0`} />

<button
type="button"
onClick={() => setActivePopover(activePopover === 'columns' ? null : 'columns')}
className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs shrink-0 ${
activePopover === 'columns'
? 'bg-indigo-600/20 text-indigo-500 font-bold'
: isLight
? 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
: 'hover:bg-slate-800 text-slate-300 hover:text-white'
}`}
title="Footer Columns & Layout"
>
<Columns className="w-3.5 h-3.5" />
<span className="font-medium hidden sm:inline">Columns</span>
</button>

<button
type="button"
onClick={() => setActivePopover(activePopover === 'background' ? null : 'background')}
className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs shrink-0 ${
activePopover === 'background'
? 'bg-indigo-600/20 text-indigo-500 font-bold'
: isLight
? 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
: 'hover:bg-slate-800 text-slate-300 hover:text-white'
}`}
title="Footer Background"
>
<Palette className="w-3.5 h-3.5" />
<span className="font-medium hidden sm:inline">Background</span>
</button>

<button
type="button"
onClick={() => setActivePopover(activePopover === 'border' ? null : 'border')}
className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs shrink-0 ${
activePopover === 'border'
? 'bg-indigo-600/20 text-indigo-500 font-bold'
: isLight
? 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
: 'hover:bg-slate-800 text-slate-300 hover:text-white'
}`}
title="Footer Border & Radius"
>
<Square className="w-3.5 h-3.5" />
<span className="font-medium hidden sm:inline">Border</span>
</button>

<button
type="button"
onClick={() => setActivePopover(activePopover === 'shadow' ? null : 'shadow')}
className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs shrink-0 ${
activePopover === 'shadow'
? 'bg-indigo-600/20 text-indigo-500 font-bold'
: isLight
? 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
: 'hover:bg-slate-800 text-slate-300 hover:text-white'
}`}
title="Footer Elevation / Shadow"
>
<Sparkles className="w-3.5 h-3.5" />
<span className="font-medium hidden sm:inline">Shadow</span>
</button>

<button
type="button"
onClick={() => setActivePopover(activePopover === 'mobile' ? null : 'mobile')}
className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs shrink-0 ${
activePopover === 'mobile'
? 'bg-indigo-600/20 text-indigo-500 font-bold'
: isLight
? 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
: 'hover:bg-slate-800 text-slate-300 hover:text-white'
}`}
title="Mobile & Tablet Footer Options"
>
<Smartphone className="w-3.5 h-3.5" />
<span className="font-medium hidden md:inline">Responsive</span>
</button>

<div className={`h-4 w-px ${isLight ? 'bg-slate-200' : 'bg-slate-800'} mx-0.5 shrink-0`} />

{onMoveSection && (
<div className="flex items-center gap-0.5 shrink-0">
<button
type="button"
onClick={() => onMoveSection(section.id, 'up')}
className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
isLight ? 'hover:bg-slate-200/80 text-slate-600' : 'hover:bg-slate-800 text-slate-300'
}`}
title="Move Section Up"
>
<ChevronUp className="w-3.5 h-3.5" />
</button>
<button
type="button"
onClick={() => onMoveSection(section.id, 'down')}
className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
isLight ? 'hover:bg-slate-200/80 text-slate-600' : 'hover:bg-slate-800 text-slate-300'
}`}
title="Move Section Down"
>
<ChevronDown className="w-3.5 h-3.5" />
</button>
</div>
)}

{onDuplicateSection && (
<button
type="button"
onClick={() => onDuplicateSection(section.id)}
className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
isLight ? 'hover:bg-slate-200/80 text-slate-600' : 'hover:bg-slate-800 text-slate-300'
}`}
title="Duplicate Footer"
>
<Copy className="w-3.5 h-3.5" />
</button>
)}

{onDeleteSection && (
<button
type="button"
onClick={() => onDeleteSection(section.id)}
className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500 cursor-pointer transition-colors shrink-0"
title="Delete Footer"
>
<Trash2 className="w-3.5 h-3.5" />
</button>
)}

<button
type="button"
onClick={() => onOpenSectionEditBox?.(section)}
className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs shrink-0 ${
isLight ? 'hover:bg-slate-200/80 text-slate-700' : 'hover:bg-slate-800 text-slate-200'
}`}
title="Open Footer Inspector"
>
<Settings className="w-3.5 h-3.5" />
<span className="font-medium hidden lg:inline">Inspector</span>
</button>

{isTopBar && onClose && (
<button
type="button"
onClick={onClose}
className={`ml-auto px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
isLight ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-slate-800 text-slate-400'
}`}
title="Close Footer Toolbar"
aria-label="Close"
>
<X className="w-4 h-4" />
</button>
)}
</div>

<Popover
isOpen={activePopover !== null}
onClose={() => setActivePopover(null)}
uiTheme={uiTheme}
title={getPopoverTitle(activePopover)}
>
{renderPopovers()}
</Popover>
</div>
);
};
