import React, { useState } from 'react';
import { BackgroundType, ElementStyles } from '../types';
import { PRESET_COLORS, PRESET_GRADIENTS, PRESET_IMAGES } from '../data/presetSamples';
import { Palette, Sparkles, Image as ImageIcon, EyeOff, Check, Plus, ChevronUp, ChevronDown, Minus, Info } from 'lucide-react';
import { ImageInputWithMediaPicker, Modal, ModalHeader, ModalBody } from './common';
import { InlineColorPicker, NoneNoDecorationIcon } from './properties/InlineColorPicker';

const BG_GRADIENT_PRESETS = [
{ name: 'Crimson Glow', from: '#991b1b', to: '#ef4444' },
{ name: 'Solar Flare', from: '#f59e0b', to: '#ef4444' },
{ name: 'Sunset Horizon', from: '#e11d48', to: '#f59e0b' },
{ name: 'Rose Gold', from: '#f43f5e', to: '#fb7185' },
{ name: 'Flamingo Pink', from: '#ec4899', to: '#f43f5e' },
{ name: 'Cherry Blossom', from: '#fda4af', to: '#fb7185' },
{ name: 'Peachy Sunrise', from: '#fb923c', to: '#f43f5e' },
{ name: 'Golden Sun', from: '#ea580c', to: '#facc15' },
{ name: 'Warm Amber', from: '#b45309', to: '#f59e0b' },
{ name: 'Cyber Amber', from: '#d97706', to: '#fbbf24' },
{ name: 'Lime Zest', from: '#65a30d', to: '#a3e635' },
{ name: 'Mint Fresh', from: '#10b981', to: '#6ee7b7' },
{ name: 'Emerald Forest', from: '#059669', to: '#10b981' },
{ name: 'Aurora Borealis', from: '#047857', to: '#0284c7' },
{ name: 'Tropical Lagoon', from: '#059669', to: '#06b6d4' },
{ name: 'Nordic Teal', from: '#0d9488', to: '#38bdf8' },
{ name: 'Aqua Marine', from: '#0891b2', to: '#22d3ee' },
{ name: 'Ocean Cyan', from: '#0284c7', to: '#06b6d4' },
{ name: 'Sky Blue', from: '#2563eb', to: '#60a5fa' },
{ name: 'Indigo Dream', from: '#4f46e5', to: '#7c3aed' },
{ name: 'Deep Nebula', from: '#312e81', to: '#581c87' },
{ name: 'Royal Purple', from: '#7c3aed', to: '#c026d3' },
{ name: 'Electric Violet', from: '#8b5cf6', to: '#ec4899' },
{ name: 'Cosmic Magenta', from: '#a21caf', to: '#e879f9' },
{ name: 'Cotton Candy', from: '#f472b6', to: '#c084fc' },
{ name: 'Lavender Mist', from: '#c4b5fd', to: '#e9d5ff' },
{ name: 'Silver Steel', from: '#475569', to: '#94a3b8' },
{ name: 'Midnight Slate', from: '#0f172a', to: '#1e293b' },
{ name: 'Abyss Blue', from: '#0f172a', to: '#1e3a8a' },
{ name: 'Dark Velvet', from: '#18181b', to: '#27272a' },
{ name: 'Deep Space', from: '#020617', to: '#0f172a' },
];

interface BackgroundControllerProps {
styles?: ElementStyles;
onChange: (updates: Partial<ElementStyles>) => void;
uiTheme?: 'dark' | 'light';
label?: string;
allowTransparent?: boolean;
}

export const BackgroundController: React.FC<BackgroundControllerProps> = ({ styles = {} as ElementStyles, onChange, uiTheme = 'dark', allowTransparent = true, }) => {
const isLight = uiTheme === 'light';
const s: ElementStyles = styles || {};
const currentMode: BackgroundType = s.backgroundType ||
(s.backgroundColor === 'transparent'
? 'transparent'
: s.backgroundImage
? 'image'
: s.backgroundGradient
? 'gradient'
: 'solid');
const [angle, setAngle] = useState<number>(s.gradientAngle ?? 135);
const [gradientStops, setGradientStops] = useState<string[]>(() => [
s.gradientFrom || '#4f46e5',
s.gradientTo || '#06b6d4',
]);
const fromColor = gradientStops[0] || '#4f46e5';
const toColor = gradientStops[gradientStops.length - 1] || '#06b6d4';
const setFromColor = (col: string) => {
const next = [...gradientStops];
next[0] = col;
handleUpdateGradient(next, angle);
};
const setToColor = (col: string) => {
const next = [...gradientStops];
next[next.length - 1] = col;
handleUpdateGradient(next, angle);
};
const [activeStopIndex, setActiveStopIndex] = useState<number>(0);
const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
const [showCustomGradient, setShowCustomGradient] = useState<boolean>(false);
const [showAllSolidPresets, setShowAllSolidPresets] = useState<boolean>(false);
const [showAllGradientPresets, setShowAllGradientPresets] = useState<boolean>(false);
const [infoGuideType, setInfoGuideType] = useState<'size' | 'position' | null>(null);
const PRESET_LIMIT = 14;
const rawOverlay = s.backgroundOverlay || 'dark';
const isCustomOverlay = rawOverlay !== 'dark' &&
rawOverlay !== 'light' &&
rawOverlay !== 'gradient' &&
rawOverlay !== 'none';
const [customOverlayColor, setCustomOverlayColor] = useState<string>(() => {
if (isCustomOverlay && rawOverlay.startsWith('rgba')) {
return '#000000';
}
return '#0f172a';
});
const [customOverlayOpacity, setCustomOverlayOpacity] = useState<number>(75);
const inputClass = `w-full px-2.5 py-1.5 rounded-lg text-xs transition-colors border outline-none ${isLight
? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500 focus:bg-white'
: 'bg-slate-900/90 border-slate-800 text-slate-100 focus:border-indigo-500'}`;
const labelClass = `block text-[11px] font-semibold uppercase tracking-wider mb-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`;
const handleModeChange = (mode: BackgroundType) => {
if (mode === 'transparent') {
onChange({
backgroundType: 'transparent',
backgroundColor: 'transparent',
backgroundImage: undefined,
backgroundGradient: undefined,
});
}
else if (mode === 'solid') {
onChange({
backgroundType: 'solid',
backgroundColor: s.backgroundColor && s.backgroundColor !== 'transparent' ? s.backgroundColor : '#0f172a',
backgroundImage: undefined,
backgroundGradient: undefined,
});
}
else if (mode === 'gradient') {
const grad = s.backgroundGradient ||
`linear-gradient(${angle}deg, ${gradientStops.join(', ')})`;
onChange({
backgroundType: 'gradient',
backgroundGradient: grad,
gradientAngle: angle,
gradientFrom: gradientStops[0],
gradientTo: gradientStops[gradientStops.length - 1],
backgroundColor: undefined,
backgroundImage: undefined,
});
}
else if (mode === 'image') {
onChange({
backgroundType: 'image',
backgroundImage: s.backgroundImage || PRESET_IMAGES[0].url,
backgroundGradient: undefined,
backgroundOverlay: s.backgroundOverlay || 'none',
backgroundSize: s.backgroundSize || 'cover',
backgroundPosition: s.backgroundPosition || 'center',
backgroundRepeat: s.backgroundRepeat || 'no-repeat',
});
}
};

const handleUpdateGradient = (newStops: string[], newAngle: number = angle) => {
setAngle(newAngle);
setGradientStops(newStops);
const grad = `linear-gradient(${newAngle}deg, ${newStops.join(', ')})`;
onChange({
backgroundType: 'gradient',
backgroundGradient: grad,
gradientAngle: newAngle,
gradientFrom: newStops[0],
gradientTo: newStops[newStops.length - 1],
backgroundColor: undefined,
backgroundImage: undefined,
});
};
const hexToRgb = (hexColor: string) => {
let r = 0, g = 0, b = 0;
if (hexColor.startsWith('#')) {
const hex = hexColor.slice(1);
if (hex.length === 3) {
r = parseInt(hex[0] + hex[0], 16);
g = parseInt(hex[1] + hex[1], 16);
b = parseInt(hex[2] + hex[2], 16);
}
else if (hex.length === 6) {
r = parseInt(hex.slice(0, 2), 16);
g = parseInt(hex.slice(2, 4), 16);
b = parseInt(hex.slice(4, 6), 16);
}
}
return { r, g, b };
};
const applyCustomOverlay = (color: string, opacityPercent: number) => {
setCustomOverlayColor(color);
setCustomOverlayOpacity(opacityPercent);
const rgb = hexToRgb(color);
const alpha = (opacityPercent / 100).toFixed(2);
const overlayCss = `linear-gradient(to bottom, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha}), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha}))`;
onChange({
backgroundType: 'image',
backgroundOverlay: overlayCss,
});
};
const applyCustomGradientOverlay = (c1: string, c2: string, deg: number, opacityPercent: number) => {
setCustomOverlayOpacity(opacityPercent);
const rgb1 = hexToRgb(c1);
const rgb2 = hexToRgb(c2);
const alpha = (opacityPercent / 100).toFixed(2);
const overlayCss = `linear-gradient(${deg}deg, rgba(${rgb1.r}, ${rgb1.g}, ${rgb1.b}, ${alpha}) 0%, rgba(${rgb2.r}, ${rgb2.g}, ${rgb2.b}, ${alpha}) 100%)`;
onChange({
backgroundType: 'image',
backgroundOverlay: overlayCss,
});
};
return (<div className="space-y-3">
{allowTransparent && (
<button
type="button"
onClick={() => {
handleModeChange('transparent');
}}
className={`w-full py-2 px-3 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
currentMode === 'transparent'
? 'border-indigo-500 bg-indigo-500/10 text-indigo-500 shadow-xs'
: isLight
? 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
: 'border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-400'
}`}
title="Clear"
>
<NoneNoDecorationIcon className="w-4 h-4 shrink-0" />
<span>Clear</span>
</button>
)}

<div className={`grid grid-cols-3 bg-transparent border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
<button
type="button"
onClick={() => handleModeChange('solid')}
className={`pb-2 text-center font-semibold text-xs transition-all cursor-pointer bg-transparent border-b-2 -mb-px ${
currentMode === 'solid'
? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
: isLight
? 'border-transparent text-slate-500 hover:text-slate-800'
: 'border-transparent text-slate-400 hover:text-slate-200'
}`}
>
Solid
</button>
<button
type="button"
onClick={() => handleModeChange('gradient')}
className={`pb-2 text-center font-semibold text-xs transition-all cursor-pointer bg-transparent border-b-2 -mb-px ${
currentMode === 'gradient'
? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
: isLight
? 'border-transparent text-slate-500 hover:text-slate-800'
: 'border-transparent text-slate-400 hover:text-slate-200'
}`}
>
Gradient
</button>
<button
type="button"
onClick={() => handleModeChange('image')}
className={`pb-2 text-center font-semibold text-xs transition-all cursor-pointer bg-transparent border-b-2 -mb-px ${
currentMode === 'image'
? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
: isLight
? 'border-transparent text-slate-500 hover:text-slate-800'
: 'border-transparent text-slate-400 hover:text-slate-200'
}`}
>
Image
</button>
</div>

{currentMode === 'solid' && (
<div className="space-y-3 pt-1">
<div>
<div className="flex flex-wrap gap-1.5 pt-0.5">
<button
type="button"
onClick={() => setShowColorPicker((prev) => !prev)}
className={`w-6 h-6 rounded-full border shadow-xs cursor-pointer hover:scale-110 transition-transform relative flex items-center justify-center shrink-0 ${
showColorPicker
? 'border-indigo-600 bg-indigo-500/15 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-400/20 dark:text-indigo-400 ring-1 ring-indigo-500/30 font-bold'
: isLight
? 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900'
: 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600 hover:text-white'
}`}
title={showColorPicker ? 'Hide custom color selector' : 'Custom color selector'}
aria-label="Custom color selector"
>
<Plus className="w-3.5 h-3.5" />
</button>

{(showAllSolidPresets ? PRESET_COLORS : PRESET_COLORS.slice(0, PRESET_LIMIT)).map((col) => {
const isSelected = (s.backgroundColor || '').toLowerCase() === col.toLowerCase();
return (
<button
key={col}
type="button"
onClick={() => onChange({
backgroundType: 'solid',
backgroundColor: col,
backgroundImage: undefined,
backgroundGradient: undefined,
})}
className="w-6 h-6 rounded-full border border-slate-700/60 shadow-xs cursor-pointer hover:scale-110 transition-transform relative flex items-center justify-center shrink-0"
style={{ backgroundColor: col }}
title={col}
>
{isSelected && (
<Check
className={`w-3.5 h-3.5 mx-auto ${
col === '#ffffff' || col === '#f8fafc' || col === '#f1f5f9' || col === '#e2e8f0'
? 'text-slate-900'
: 'text-white'
}`}
/>
)}
</button>
);
})}

{PRESET_COLORS.length > PRESET_LIMIT && (
<button
type="button"
onClick={() => setShowAllSolidPresets((prev) => !prev)}
className="px-1.5 py-0.5 h-6 text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 shrink-0 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 bg-transparent border-0 hover:underline"
title={showAllSolidPresets ? 'Show fewer presets' : 'Show all presets'}
>
<span>{showAllSolidPresets ? 'Less' : `+${PRESET_COLORS.length - PRESET_LIMIT}`}</span>
{showAllSolidPresets ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
</button>
)}
</div>
</div>

{showColorPicker && (
<div className="pt-1">
<InlineColorPicker
color={s.backgroundColor && s.backgroundColor !== 'transparent' ? s.backgroundColor : '#0f172a'}
onChange={(hex) => onChange({
backgroundType: 'solid',
backgroundColor: hex,
backgroundImage: undefined,
backgroundGradient: undefined,
})}
isLight={isLight}
canvasHeight="h-28"
showAlpha={true}
/>
</div>
)}
</div>
)}



{currentMode === 'gradient' && (
<div className="space-y-3 pt-1">
<div>
<div className="flex flex-wrap gap-1.5 pt-0.5">
<button
type="button"
onClick={() => setShowCustomGradient((prev) => !prev)}
className={`w-6 h-6 rounded-full border shadow-xs cursor-pointer hover:scale-110 transition-transform relative flex items-center justify-center shrink-0 ${
showCustomGradient
? 'border-indigo-600 bg-indigo-500/15 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-400/20 dark:text-indigo-400 ring-1 ring-indigo-500/30 font-bold'
: isLight
? 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900'
: 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600 hover:text-white'
}`}
title={showCustomGradient ? 'Hide custom gradient' : 'Custom gradient settings'}
aria-label="Custom gradient settings"
>
<Plus className="w-3.5 h-3.5" />
</button>

{(showAllGradientPresets ? BG_GRADIENT_PRESETS : BG_GRADIENT_PRESETS.slice(0, PRESET_LIMIT)).map((p) => {
const isCur =
gradientStops.length === 2 &&
gradientStops[0].toLowerCase() === p.from.toLowerCase() &&
gradientStops[1].toLowerCase() === p.to.toLowerCase();
const grad = `linear-gradient(${angle}deg, ${p.from}, ${p.to})`;
return (
<button
key={p.name}
type="button"
onClick={() => {
const newStops = [p.from, p.to];
setActiveStopIndex(0);
handleUpdateGradient(newStops, angle);
}}
className="w-6 h-6 rounded-full border border-slate-700/60 shadow-xs cursor-pointer hover:scale-110 transition-transform relative flex items-center justify-center shrink-0"
style={{ background: grad }}
title={p.name}
>
{isCur && <Check className="w-3.5 h-3.5 text-white mx-auto" />}
</button>
);
})}

{BG_GRADIENT_PRESETS.length > PRESET_LIMIT && (
<button
type="button"
onClick={() => setShowAllGradientPresets((prev) => !prev)}
className="px-1.5 py-0.5 h-6 text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 shrink-0 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 bg-transparent border-0 hover:underline"
title={showAllGradientPresets ? 'Show fewer presets' : 'Show all presets'}
>
<span>{showAllGradientPresets ? 'Less' : `+${BG_GRADIENT_PRESETS.length - PRESET_LIMIT}`}</span>
{showAllGradientPresets ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
</button>
)}
</div>
</div>

{showCustomGradient && (
<div className="space-y-3 pt-2">
<div className="space-y-1.5">
<div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar pr-0.5">
{gradientStops.map((colorVal, index) => {
const isActive = activeStopIndex === index;
return (
<div
key={index}
onClick={() => setActiveStopIndex(index)}
className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
isActive
? isLight
? 'bg-indigo-50/80 shadow-xs'
: 'bg-indigo-950/50 shadow-xs'
: isLight
? 'bg-slate-50/80 hover:bg-slate-100'
: 'bg-slate-900/40 hover:bg-slate-800/60'
}`}
>
<div className="flex items-center gap-2 min-w-0">
<span
className="w-6 h-6 rounded-full shrink-0 shadow-xs relative overflow-hidden"
style={{
backgroundImage:
'linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)',
backgroundSize: '6px 6px',
backgroundPosition: '0 0, 0 3px, 3px -3px, -3px 0px',
}}
>
<span className="absolute inset-0" style={{ backgroundColor: colorVal }} />
</span>

<input
type="text"
value={colorVal}
onClick={(e) => e.stopPropagation()}
onFocus={() => setActiveStopIndex(index)}
onChange={(e) => {
const val = e.target.value;
const next = [...gradientStops];
next[index] = val;
handleUpdateGradient(next);
}}
className={`w-20 px-2 py-1 rounded-lg border font-mono text-xs text-center outline-none transition-colors shadow-2xs ${
isLight
? 'bg-slate-50 border-slate-300 hover:border-slate-400 text-slate-800 focus:border-indigo-500'
: 'bg-slate-800 border-slate-600 hover:border-slate-500 text-slate-100 focus:border-indigo-400'
}`}
/>
</div>

<div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
<button
type="button"
disabled={index === 0}
onClick={() => {
if (index === 0) return;
const next = [...gradientStops];
const temp = next[index - 1];
next[index - 1] = next[index];
next[index] = temp;
setActiveStopIndex(index - 1);
handleUpdateGradient(next);
}}
className={`p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
index === 0
? 'opacity-20 cursor-not-allowed'
: 'cursor-pointer text-slate-500 dark:text-slate-400'
}`}
title="Move stop up"
>
<ChevronUp className="w-3.5 h-3.5" />
</button>
<button
type="button"
disabled={index === gradientStops.length - 1}
onClick={() => {
if (index === gradientStops.length - 1) return;
const next = [...gradientStops];
const temp = next[index + 1];
next[index + 1] = next[index];
next[index] = temp;
setActiveStopIndex(index + 1);
handleUpdateGradient(next);
}}
className={`p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
index === gradientStops.length - 1
? 'opacity-20 cursor-not-allowed'
: 'cursor-pointer text-slate-500 dark:text-slate-400'
}`}
title="Move stop down"
>
<ChevronDown className="w-3.5 h-3.5" />
</button>
{gradientStops.length > 2 && (
<button
type="button"
onClick={() => {
const next = gradientStops.filter((_, i) => i !== index);
const newActive = Math.min(activeStopIndex, next.length - 1);
setActiveStopIndex(newActive);
handleUpdateGradient(next);
}}
className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
title="Remove this color stop"
>
<Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
</button>
)}
</div>
</div>
);
})}
</div>

<button
type="button"
onClick={() => {
const fallbackPalette = [
'#ef4444',
'#f97316',
'#f59e0b',
'#10b981',
'#06b6d4',
'#3b82f6',
'#8b5cf6',
'#ec4899',
];
const nextColor = fallbackPalette.find((c) => !gradientStops.includes(c)) || '#6366f1';
const next = [...gradientStops, nextColor];
const newIdx = next.length - 1;
setActiveStopIndex(newIdx);
handleUpdateGradient(next);
}}
className={`w-full py-2 px-3 rounded-xl border border-dashed font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
isLight
? 'border-indigo-300 text-indigo-600 hover:bg-indigo-50/70 hover:border-indigo-400'
: 'border-indigo-500/40 text-indigo-400 hover:bg-indigo-950/40 hover:border-indigo-400'
}`}
>
<Plus className="w-4 h-4" />
<span>Add Color Stop</span>
</button>
</div>

<div className="pt-1">
<InlineColorPicker
color={gradientStops[activeStopIndex] || '#4f46e5'}
onChange={(hex) => {
const next = [...gradientStops];
next[activeStopIndex] = hex;
handleUpdateGradient(next);
}}
isLight={isLight}
canvasHeight="h-28"
showAlpha={true}
/>
</div>

<div className="space-y-1 pt-1">
<div className="flex justify-between items-center mb-1">
<span className="text-[11px] text-slate-500 font-medium">Angle Direction</span>
<span className="text-[11px] font-mono font-semibold text-indigo-400">{angle}°</span>
</div>
<input
type="range"
min={0}
max={360}
step={5}
value={angle}
onChange={(e) => handleUpdateGradient(gradientStops, Number(e.target.value))}
className="w-full accent-indigo-500 cursor-pointer"
/>
</div>
</div>
)}
</div>
)}

{currentMode === 'image' && (<div className="space-y-3 pt-1">
<div>
<ImageInputWithMediaPicker
value={s.backgroundImage || ''}
onChange={(val) => onChange({
backgroundType: 'image',
backgroundImage: val,
backgroundGradient: undefined,
backgroundOverlay: s.backgroundOverlay || 'none',
})}
showClearButton={false}
placeholder="https://images.unsplash.com/photo-... or select from media"
isLight={isLight}
variant="default"
modalTitle="Select Background Image"
/>
</div>

<div>
<span className="text-[10px] text-slate-500 block mb-1 font-medium">Quick Photo Gallery</span>
<div className="grid grid-cols-3 gap-1.5">
{PRESET_IMAGES.map((img) => (<button key={img.name} type="button" onClick={() => onChange({
backgroundType: 'image',
backgroundImage: img.url,
backgroundOverlay: s.backgroundOverlay || 'dark',
backgroundSize: s.backgroundSize || 'cover',
backgroundPosition: s.backgroundPosition || 'center',
})} className={`group relative rounded-lg overflow-hidden border h-12 transition-all ${s.backgroundImage === img.url ? 'ring-2 ring-indigo-500 border-indigo-500' : ''} ${isLight ? 'border-slate-300' : 'border-slate-800'}`} title={img.name}>
<img src={img.url} alt={img.name} className="w-full h-full object-cover"/>
{s.backgroundImage === img.url && (<div className="absolute top-1 right-1 bg-indigo-600 text-white rounded-full p-0.5 shadow-sm">
<Check className="w-2.5 h-2.5"/>
</div>)}
<span className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[10px] text-white font-medium">
{img.name}
</span>
</button>))}
</div>
</div>

<div className="space-y-2 pt-1 border-t border-slate-700/40">
<div className="flex items-center justify-between">
<label className="text-[11px] text-slate-500 font-medium">Contrast Overlay Mode</label>
{isCustomOverlay && (<span className="text-[10px] text-indigo-400 font-semibold px-1.5 py-0.5 bg-indigo-500/10 rounded">
Custom Tint
</span>)}
</div>

<select value={s.backgroundOverlay === 'none'
? 'none'
: s.backgroundOverlay === 'light'
? 'light'
: s.backgroundOverlay === 'gradient'
? 'gradient'
: isCustomOverlay
? 'custom'
: 'dark'} onChange={(e) => {
const val = e.target.value;
if (val === 'custom') {
applyCustomOverlay(customOverlayColor, customOverlayOpacity);
}
else {
onChange({
backgroundType: 'image',
backgroundOverlay: val,
});
}
}} className={inputClass}>
<option value="dark">Dark Gradient Overlay (High contrast text)</option>
<option value="light">Soft Light Overlay</option>
<option value="gradient">Vibrant Gradient Tint Overlay</option>
<option value="custom">Custom Color & Opacity Overlay</option>
<option value="none">No Overlay (Raw Photo)</option>
</select>

{(isCustomOverlay || s.backgroundOverlay === 'custom') && (<div className={`p-3 rounded-xl border space-y-3 animate-in fade-in duration-150 ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-900 border-slate-800'}`}>
<div className="flex items-center justify-between">
<span className="text-[11px] font-semibold text-indigo-400">Custom Overlay Mode</span>
<div className="flex gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
<button type="button" onClick={() => applyCustomOverlay(customOverlayColor, customOverlayOpacity)} className={`px-2 py-0.5 text-[10px] rounded font-medium ${!s.backgroundOverlay?.includes('deg')
? 'bg-indigo-600 text-white font-semibold'
: 'text-slate-400 hover:text-white'}`}>
Single Color
</button>
<button type="button" onClick={() => applyCustomGradientOverlay('#4f46e5', '#06b6d4', 135, customOverlayOpacity)} className={`px-2 py-0.5 text-[10px] rounded font-medium ${s.backgroundOverlay?.includes('deg')
? 'bg-indigo-600 text-white font-semibold'
: 'text-slate-400 hover:text-white'}`}>
Gradient
</button>
</div>
</div>

{!s.backgroundOverlay?.includes('deg') ? (<div className="flex items-center justify-between">
<span className="text-[10px] text-slate-500 font-medium">Tint Color</span>
<div className="flex items-center gap-1.5">
<input type="color" value={customOverlayColor} onChange={(e) => applyCustomOverlay(e.target.value, customOverlayOpacity)} className="w-6 h-6 rounded border bg-transparent cursor-pointer p-0"/>
<input type="text" value={customOverlayColor} onChange={(e) => applyCustomOverlay(e.target.value, customOverlayOpacity)} className={`w-20 px-1.5 py-1 rounded text-[11px] font-mono border ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'}`}/>
</div>
</div>) : (<div className="space-y-2">
<div className="grid grid-cols-2 gap-2">
<div>
<span className="text-[10px] text-slate-500 block mb-1">Gradient From</span>
<input type="color" value={fromColor} onChange={(e) => {
setFromColor(e.target.value);
applyCustomGradientOverlay(e.target.value, toColor, angle, customOverlayOpacity);
}} className="w-full h-7 rounded border bg-transparent cursor-pointer p-0"/>
</div>
<div>
<span className="text-[10px] text-slate-500 block mb-1">Gradient To</span>
<input type="color" value={toColor} onChange={(e) => {
setToColor(e.target.value);
applyCustomGradientOverlay(fromColor, e.target.value, angle, customOverlayOpacity);
}} className="w-full h-7 rounded border bg-transparent cursor-pointer p-0"/>
</div>
</div>
<div>
<div className="flex justify-between items-center mb-1">
<span className="text-[10px] text-slate-500 font-medium">Gradient Angle</span>
<span className="text-[10px] font-mono text-indigo-400 font-bold">{angle}°</span>
</div>
<input type="range" min={0} max={360} step={15} value={angle} onChange={(e) => {
const a = Number(e.target.value);
setAngle(a);
applyCustomGradientOverlay(fromColor, toColor, a, customOverlayOpacity);
}} className="w-full accent-indigo-500 cursor-pointer"/>
</div>
</div>)}

<div>
<div className="flex justify-between items-center mb-1">
<span className="text-[10px] text-slate-500 font-medium">Overlay Opacity</span>
<span className="text-[10px] font-mono font-semibold text-indigo-400">
{customOverlayOpacity}%
</span>
</div>
<input type="range" min={5} max={95} step={5} value={customOverlayOpacity} onChange={(e) => {
const op = Number(e.target.value);
if (s.backgroundOverlay?.includes('deg')) {
applyCustomGradientOverlay(fromColor, toColor, angle, op);
}
else {
applyCustomOverlay(customOverlayColor, op);
}
}} className="w-full accent-indigo-500 cursor-pointer"/>
</div>
</div>)}
</div>

<div className="space-y-3 pt-2 border-t border-slate-700/40">
<div>
<div className="flex items-center gap-1.5 mb-1.5">
<span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Size Scaling</span>
<button
type="button"
onClick={() => setInfoGuideType('size')}
className="text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors cursor-pointer p-0.5"
title="View Size Scaling Guide"
aria-label="View Size Scaling Guide"
>
<Info className="w-3.5 h-3.5" />
</button>
</div>
<div className="grid grid-cols-3 gap-1.5">
{[
{ label: 'Cover', val: 'cover' },
{ label: 'Contain', val: 'contain' },
{ label: 'Auto', val: 'auto' },
].map((opt) => {
const isSelected = (s.backgroundSize || 'cover') === opt.val;
return (
<button
key={opt.val}
type="button"
onClick={() => onChange({ backgroundType: 'image', backgroundSize: opt.val })}
className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all text-center cursor-pointer ${
isSelected
? 'bg-indigo-600 text-white font-semibold border-indigo-600 shadow-xs'
: isLight
? 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
: 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
}`}
>
{opt.label}
</button>
);
})}
</div>
</div>

<div>
<div className="flex items-center gap-1.5 mb-1.5">
<span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Position</span>
<button
type="button"
onClick={() => setInfoGuideType('position')}
className="text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors cursor-pointer p-0.5"
title="View Position Guide"
aria-label="View Position Guide"
>
<Info className="w-3.5 h-3.5" />
</button>
</div>
<div className="grid grid-cols-3 gap-1.5">
{[
{ label: 'Top', val: 'top' },
{ label: 'Center', val: 'center' },
{ label: 'Bottom', val: 'bottom' },
].map((opt) => {
const isSelected = (s.backgroundPosition || 'center') === opt.val;
return (
<button
key={opt.val}
type="button"
onClick={() => onChange({ backgroundType: 'image', backgroundPosition: opt.val })}
className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all text-center cursor-pointer ${
isSelected
? 'bg-indigo-600 text-white font-semibold border-indigo-600 shadow-xs'
: isLight
? 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
: 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
}`}
>
{opt.label}
</button>
);
})}
</div>
</div>
</div>
</div>)}

{infoGuideType && (
<Modal
isOpen={!!infoGuideType}
onClose={() => setInfoGuideType(null)}
size="md"
isLight={isLight}
>
<ModalHeader
title={infoGuideType === 'size' ? 'Image Size Scaling Guide' : 'Image Position Guide'}
onClose={() => setInfoGuideType(null)}
isLight={isLight}
/>
<ModalBody isLight={isLight} className="space-y-4 p-5 text-xs">
{infoGuideType === 'size' ? (
<div className="space-y-4">
<div className="space-y-1">
<h4 className={`font-semibold text-xs ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
Cover (Full Area)
</h4>
<p className={`leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
Scales the image proportionally to completely fill the background container. Part of the photo may clip if aspect ratios differ. Best for hero sections and full-bleed photo banners.
</p>
</div>

<div className="space-y-1">
<h4 className={`font-semibold text-xs ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
Contain
</h4>
<p className={`leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
Scales the image to fit entirely inside the section bounds without cropping any edges. Any unmapped area displays the background fill color. Great for logos and diagrams.
</p>
</div>

<div className="space-y-1">
<h4 className={`font-semibold text-xs ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
Auto (Original Size)
</h4>
<p className={`leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
Displays the image at its original native dimensions without scaling. Recommended for repeating texture patterns or pixel-perfect graphics.
</p>
</div>
</div>
) : (
<div className="space-y-4">
<div className="space-y-1">
<h4 className={`font-semibold text-xs ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
Top
</h4>
<p className={`leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
Aligns the top edge of the background photo with the top of the section. Ensures header content or faces at the top of the photo stay visible.
</p>
</div>

<div className="space-y-1">
<h4 className={`font-semibold text-xs ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
Center
</h4>
<p className={`leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
Centers the image horizontally and vertically within the section area. Recommended for most hero photos and centered subject focal points.
</p>
</div>

<div className="space-y-1">
<h4 className={`font-semibold text-xs ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
Bottom
</h4>
<p className={`leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
Aligns the bottom edge of the image with the bottom of the section. Ideal for landscape horizon photos and bottom-anchored graphic art.
</p>
</div>
</div>
)}
</ModalBody>
</Modal>
)}
</div>);
};
