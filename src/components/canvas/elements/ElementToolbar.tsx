import React, { useState, useEffect } from 'react';
import { Settings, Plus, ChevronUp, ChevronDown, MoreHorizontal, Copy, Trash2, Maximize2, Crop, Type, Mail, Phone, Globe, Calendar, FileText, Radio, CheckSquare, Upload, SlidersHorizontal, Hash, Shield, Link as LinkIcon, Compass, AlignLeft, AlignCenter, AlignRight, AlignJustify, ArrowRightLeft, ArrowUpDown, Palette } from 'lucide-react';
import { WebsiteElement, SelectedElementContext } from '../../../types';
interface ElementToolbarProps {
element: WebsiteElement;
sectionId: string;
isToolbarActive: boolean;
isToolbarDisabled: boolean;
uiTheme?: 'dark' | 'light';
elementRef: React.RefObject<HTMLDivElement>;
onMouseEnter: (e: React.MouseEvent) => void;
onMouseLeave: (e: React.MouseEvent) => void;
onOpenEditBox?: (context: SelectedElementContext) => void;
onUpdate: (updatedElement: WebsiteElement) => void;
onMoveElement?: (sectionId: string, elementId: string, direction: 'up' | 'down') => void;
onDuplicateElement?: (sectionId: string, elementId: string) => void;
onDeleteElement?: (elementId: string) => void;
onAddElementToColumn?: (sectionId: string, parentId: string) => void;
setManipulationMode?: (mode: 'none' | 'resize' | 'crop') => void;
canMoveUp?: boolean;
canMoveDown?: boolean;
}
export const ElementToolbar: React.FC<ElementToolbarProps> = ({ element, sectionId, isToolbarActive, isToolbarDisabled, uiTheme = 'dark', elementRef, onMouseEnter, onMouseLeave, onOpenEditBox, onUpdate, onMoveElement, onDuplicateElement, onDeleteElement, onAddElementToColumn, setManipulationMode, canMoveUp = true, canMoveDown = true, }) => {
const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);
const [showFormInsertMenu, setShowFormInsertMenu] = useState<boolean>(false);
const [showNavInsertMenu, setShowNavInsertMenu] = useState<boolean>(false);
const [showGapMenu, setShowGapMenu] = useState<boolean>(false);
const [newLinkText, setNewLinkText] = useState<string>('');
const [newLinkUrl, setNewLinkUrl] = useState<string>('');
const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth < 640 : false);
useEffect(() => {
const handleResize = () => {
setIsMobile(window.innerWidth < 640);
};
window.addEventListener('resize', handleResize);
return () => window.removeEventListener('resize', handleResize);
}, []);
const isLight = uiTheme === 'light';
if (isToolbarDisabled)
return null;

const getNavChildrenList = (el: WebsiteElement): WebsiteElement[] => {
if (el.children && el.children.length > 0) {
return el.children;
}
if (el.links && el.links.length > 0) {
return el.links.map((l, idx) => ({
id: l.id || `nav_link_${el.id}_${idx}`,
type: 'nav-link' as const,
label: l.label,
content: l.label,
href: l.href || '#',
target: (l.target as '_self' | '_blank') || '_self',
styles: {
typeface: el.styles?.typeface,
fontSize: el.styles?.fontSize || 14,
fontWeight: el.styles?.fontWeight || '600',
textColor: el.styles?.textColor,
},
}));
}
const raw = el.content || 'Home, About, Services, Contact';
return raw
.split(',')
.map((item, idx) => {
const trimmed = item.trim();
return {
id: `nav_link_${el.id}_${idx}`,
type: 'nav-link' as const,
label: trimmed,
content: trimmed,
href: `#${trimmed.toLowerCase().replace(/\s+/g, '-')}`,
target: '_self' as const,
styles: {
typeface: el.styles?.typeface,
fontSize: el.styles?.fontSize || 14,
fontWeight: el.styles?.fontWeight || '600',
textColor: el.styles?.textColor,
},
};
})
.filter((l) => l.content);
};

const handleAddNavQuickLink = () => {
const labelToAdd = newLinkText.trim() || 'New Link';
const hrefToAdd = newLinkUrl.trim() || `#${labelToAdd.toLowerCase().replace(/\s+/g, '-')}`;
const currentChildren = getNavChildrenList(element);
const newChild: WebsiteElement = {
id: `nav_link_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
type: 'nav-link',
label: labelToAdd,
content: labelToAdd,
href: hrefToAdd,
target: '_self',
styles: {
typeface: element.styles?.typeface,
fontSize: element.styles?.fontSize || 14,
fontWeight: element.styles?.fontWeight || '600',
textColor: element.styles?.textColor,
},
};
const updatedChildren = [...currentChildren, newChild];
onUpdate({
...element,
children: updatedChildren,
content: updatedChildren.map((c) => c.content || c.label).join(', '),
});
setNewLinkText('');
setNewLinkUrl('');
};

const updateNavLinkProp = (index: number, key: string, value: string) => {
const currentChildren = getNavChildrenList(element);
const updatedChildren = currentChildren.map((item, idx) => idx === index ? { ...item, [key]: value, ...(key === 'label' ? { content: value } : {}) } : item);
onUpdate({
...element,
children: updatedChildren,
content: updatedChildren.map((c) => c.content || c.label).join(', '),
});
};

const deleteNavLinkItem = (index: number) => {
const currentChildren = getNavChildrenList(element);
const updatedChildren = currentChildren.filter((_, idx) => idx !== index);
onUpdate({
...element,
children: updatedChildren,
content: updatedChildren.map((c) => c.content || c.label).join(', '),
});
};

const openInspectorAtTab = (tab: string) => {
if (elementRef.current) {
const rect = elementRef.current.getBoundingClientRect();
onOpenEditBox?.({
element,
sectionId,
initialTab: tab,
rect: {
top: rect.top,
left: rect.left,
width: rect.width,
height: rect.height,
bottom: rect.bottom,
right: rect.right,
},
domElement: elementRef.current,
});
}
else {
onOpenEditBox?.({
element,
sectionId,
initialTab: tab,
});
}
};
const btnClass = `p-1.5 rounded-md transition-colors cursor-pointer shrink-0 flex items-center justify-center ${isLight
? 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
: 'hover:bg-slate-800 text-slate-300 hover:text-white'}`;
return (<div onClick={(e) => e.stopPropagation()} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={`absolute -top-12 right-0 z-30 transition-all duration-150 rounded-lg border backdrop-blur-md px-2 py-1.5 flex flex-wrap items-center gap-1 shadow-xl select-none max-w-[calc(100vw-32px)] sm:max-w-2xl ${isLight
? 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-900/10'
: 'bg-slate-900/95 border-slate-700/80 text-slate-100 shadow-black/50'} ${isToolbarActive
? 'opacity-100 pointer-events-auto scale-100'
: 'opacity-0 pointer-events-none scale-95'}`}>
{onMoveElement && (<button type="button" disabled={!canMoveUp} onClick={(e) => {
e.stopPropagation();
if (canMoveUp) {
onMoveElement(sectionId, element.id, 'up');
}
}} className={`${btnClass} ${!canMoveUp ? 'opacity-30 cursor-not-allowed hover:bg-transparent' : ''}`} title={canMoveUp ? 'Move element up' : 'Cannot move up further'} aria-label="Move element up">
<ChevronUp className="w-3.5 h-3.5"/>
</button>)}

{onMoveElement && (<button type="button" disabled={!canMoveDown} onClick={(e) => {
e.stopPropagation();
if (canMoveDown) {
onMoveElement(sectionId, element.id, 'down');
}
}} className={`${btnClass} ${!canMoveDown ? 'opacity-30 cursor-not-allowed hover:bg-transparent' : ''}`} title={canMoveDown ? 'Move element down' : 'Cannot move down further'} aria-label="Move element down">
<ChevronDown className="w-3.5 h-3.5"/>
</button>)}

{(element.type === 'nav-links' || element.type === 'nav-container') && (
<div className="flex items-center gap-1.5 flex-wrap">
<div className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold flex items-center gap-1 border shrink-0 ${
isLight
? 'bg-indigo-50 border-indigo-200 text-indigo-700'
: 'bg-indigo-950/80 border-indigo-700/60 text-indigo-300'
}`}>
<Compass className="w-3 h-3 text-indigo-500" />
<span>&lt;nav&gt;</span>
</div>

<div className="relative shrink-0">
<button
type="button"
onClick={(e) => {
e.stopPropagation();
setShowNavInsertMenu((prev) => !prev);
}}
className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
isLight
? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
: 'bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200'
}`}
title="Add or edit navigation links"
aria-label="Add or edit navigation links"
>
<Plus className="w-3.5 h-3.5" />
<span>Insert Link</span>
</button>

{showNavInsertMenu && (
<div
className={`absolute left-0 sm:right-0 top-full mt-1.5 w-72 sm:w-80 rounded-xl shadow-2xl border p-3 z-50 animate-in fade-in zoom-in-95 duration-150 ${
isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
}`}
onClick={(e) => e.stopPropagation()}
>
<div className="px-1 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700/20 mb-2 flex items-center justify-between">
<span className="flex items-center gap-1.5">
<LinkIcon className="w-3.5 h-3.5 text-indigo-400" />
<span>Navigation Links ({getNavChildrenList(element).length})</span>
</span>
<button
type="button"
onClick={() => setShowNavInsertMenu(false)}
className="text-slate-400 hover:text-white text-xs cursor-pointer"
>
✕
</button>
</div>

<div className="space-y-1.5 mb-3">
<div className="flex gap-1.5">
<input
type="text"
value={newLinkText}
onChange={(e) => setNewLinkText(e.target.value)}
placeholder="Link Label (e.g. Features)"
className={`flex-1 px-2.5 py-1.5 text-xs rounded-lg border ${
isLight
? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
: 'bg-slate-950 border-slate-700 text-slate-100 focus:bg-slate-900'
} outline-none focus:ring-1 focus:ring-indigo-500`}
onKeyDown={(e) => {
if (e.key === 'Enter') {
e.preventDefault();
handleAddNavQuickLink();
}
}}
/>
<button
type="button"
onClick={handleAddNavQuickLink}
className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 cursor-pointer flex items-center gap-1"
>
<Plus className="w-3.5 h-3.5" />
<span>Add</span>
</button>
</div>
<input
type="text"
value={newLinkUrl}
onChange={(e) => setNewLinkUrl(e.target.value)}
placeholder="URL / Anchor (optional, e.g. #features)"
className={`w-full px-2.5 py-1 text-[11px] font-mono rounded-lg border ${
isLight
? 'bg-slate-50 border-slate-200 text-slate-700'
: 'bg-slate-950 border-slate-700 text-slate-300'
} outline-none focus:ring-1 focus:ring-indigo-500`}
/>
</div>

<div className="space-y-2 max-h-56 overflow-y-auto pr-1">
{getNavChildrenList(element).map((linkItem, idx) => (
<div
key={linkItem.id || idx}
className={`p-2 rounded-lg border text-xs space-y-1.5 ${
isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
}`}
>
<div className="flex items-center justify-between gap-1">
<input
type="text"
value={linkItem.content || linkItem.label || ''}
onChange={(e) => updateNavLinkProp(idx, 'label', e.target.value)}
className={`flex-1 px-1.5 py-1 font-semibold text-xs rounded border ${
isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'
} outline-none focus:border-indigo-500`}
placeholder="Label"
/>
<button
type="button"
onClick={() => deleteNavLinkItem(idx)}
className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
title="Remove link"
>
<Trash2 className="w-3.5 h-3.5" />
</button>
</div>
<div className="flex items-center gap-1.5">
<input
type="text"
value={linkItem.href || '#'}
onChange={(e) => updateNavLinkProp(idx, 'href', e.target.value)}
placeholder="URL (e.g. #pricing)"
className={`w-full px-1.5 py-0.5 font-mono text-[11px] rounded border ${
isLight
? 'bg-white border-slate-200 text-slate-600'
: 'bg-slate-900 border-slate-700 text-slate-300'
} outline-none focus:border-indigo-500`}
/>
</div>
</div>
))}
</div>
</div>
)}
</div>

<div className="relative flex items-center shrink-0">
<div className={`h-4 w-[1px] shrink-0 mr-1.5 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />
<button
type="button"
onClick={(e) => {
e.stopPropagation();
setShowGapMenu((prev) => !prev);
setShowMoreMenu(false);
setShowFormInsertMenu(false);
setShowNavInsertMenu(false);
}}
className={`px-2 py-1 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
showGapMenu
? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
: isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
}`}
title="Gap Options"
>
<span>Gap</span>
</button>

{showGapMenu && (
<div
onClick={(e) => e.stopPropagation()}
className={`absolute bottom-full mb-1 left-0 z-50 p-2.5 rounded-xl border shadow-xl w-56 space-y-2 ${
isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
}`}
>
<div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Select Item Gap</div>
<div className="grid grid-cols-3 gap-1">
{[0, 8, 12, 16, 24, 32].map((gVal) => {
const currentG = element.styles?.gap !== undefined ? element.styles.gap : 24;
return (
<button
key={gVal}
type="button"
onClick={() => {
onUpdate({
...element,
styles: { ...(element.styles || {}), gap: gVal },
});
setShowGapMenu(false);
}}
className={`py-1 text-xs font-mono font-semibold rounded-md border text-center transition-all cursor-pointer ${
currentG === gVal
? 'bg-indigo-600 text-white border-indigo-600 font-bold'
: isLight
? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
: 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
}`}
>
{gVal}px
</button>
);
})}
</div>
</div>
)}
</div>

<div className="border-l pl-1.5 border-slate-700/30">
<button
type="button"
onClick={(e) => {
e.stopPropagation();
const isCol = element.styles?.flexDirection === 'column';
onUpdate({
...element,
styles: {
...(element.styles || {}),
flexDirection: isCol ? 'row' : 'column',
},
});
}}
className={`p-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
element.styles?.flexDirection === 'column'
? 'bg-indigo-600 text-white'
: isLight
? 'hover:bg-slate-100 text-slate-700'
: 'hover:bg-slate-800 text-slate-300'
}`}
title={`Switch layout direction (${element.styles?.flexDirection === 'column' ? 'Row' : 'Column'})`}
>
{element.styles?.flexDirection === 'column' ? (
<ArrowUpDown className="w-3.5 h-3.5" />
) : (
<ArrowRightLeft className="w-3.5 h-3.5" />
)}
</button>
</div>

<div className="flex items-center gap-0.5 border-l pl-1.5 border-slate-700/30">
{[
{ key: 'flex-start', icon: AlignLeft, label: 'Align Left' },
{ key: 'center', icon: AlignCenter, label: 'Center' },
{ key: 'flex-end', icon: AlignRight, label: 'Align Right' },
{ key: 'space-between', icon: AlignJustify, label: 'Space Between' },
].map((align) => {
const IconComp = align.icon;
const isActive = (element.styles?.justifyContent || 'flex-start') === align.key;
return (
<button
key={align.key}
type="button"
onClick={(e) => {
e.stopPropagation();
onUpdate({
...element,
styles: { ...(element.styles || {}), justifyContent: align.key },
});
}}
className={`p-1 rounded transition-colors cursor-pointer ${
isActive
? 'bg-indigo-600 text-white'
: isLight
? 'hover:bg-slate-100 text-slate-600'
: 'hover:bg-slate-800 text-slate-300'
}`}
title={align.label}
>
<IconComp className="w-3.5 h-3.5" />
</button>
);
})}
</div>

<div className="flex items-center gap-1 border-l pl-1.5 border-slate-700/30" title="Nav Links Text Color">
<Palette className="w-3.5 h-3.5 opacity-70 shrink-0" />
<input
type="color"
value={element.styles?.textColor || (isLight ? '#334155' : '#cbd5e1')}
onChange={(e) => {
const color = e.target.value;
const updatedChildren = getNavChildrenList(element).map((c) => ({
...c,
styles: { ...(c.styles || {}), textColor: color },
}));
onUpdate({
...element,
styles: { ...(element.styles || {}), textColor: color },
children: updatedChildren,
});
}}
className="w-5 h-5 rounded border-0 bg-transparent cursor-pointer"
/>
</div>
</div>
)}

{element.type === 'nav-link' && (
<div className="flex items-center gap-1.5 shrink-0 flex-wrap">
<div className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold flex items-center gap-1 border shrink-0 ${
isLight
? 'bg-indigo-50 border-indigo-200 text-indigo-700'
: 'bg-indigo-950/80 border-indigo-700/60 text-indigo-300'
}`}>
<LinkIcon className="w-3 h-3 text-indigo-500" />
<span>Link</span>
</div>
<input
type="text"
value={element.content || element.label || ''}
onChange={(e) => {
onUpdate({
...element,
content: e.target.value,
label: e.target.value,
});
}}
placeholder="Link Text"
className={`w-28 px-2 py-1 text-xs rounded-md border outline-none ${
isLight
? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
: 'bg-slate-950 border-slate-700 text-slate-100'
}`}
title="Edit Link Text"
/>
<input
type="text"
value={element.href || '#'}
onChange={(e) => {
onUpdate({
...element,
href: e.target.value,
});
}}
placeholder="URL (#pricing)"
className={`w-32 px-2 py-1 text-[11px] font-mono rounded-md border outline-none ${
isLight
? 'bg-slate-50 border-slate-200 text-slate-700'
: 'bg-slate-950 border-slate-700 text-slate-300'
}`}
title="Edit Link URL"
/>
<div className="flex items-center gap-1 border-l pl-1.5 border-slate-700/30" title="Link Text Color">
<Palette className="w-3.5 h-3.5 opacity-70 shrink-0" />
<input
type="color"
value={element.styles?.textColor || (isLight ? '#334155' : '#cbd5e1')}
onChange={(e) => {
onUpdate({
...element,
styles: { ...(element.styles || {}), textColor: e.target.value },
});
}}
className="w-5 h-5 rounded border-0 bg-transparent cursor-pointer"
/>
</div>
</div>
)}

{element.type === 'form' && (<div className="relative shrink-0">
<button type="button" onClick={(e) => {
e.stopPropagation();
setShowFormInsertMenu((prev) => !prev);
}} className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${isLight
? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
: 'bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200'}`} title="Insert Form Field Options" aria-label="Insert Form Field Options">
<Plus className="w-3.5 h-3.5"/>
<span>Insert Field</span>
</button>

{showFormInsertMenu && (<div className={`absolute right-0 top-full mt-1.5 w-64 rounded-xl shadow-2xl border p-2 z-50 animate-in fade-in zoom-in-95 duration-150 ${isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'}`} onClick={(e) => e.stopPropagation()}>
<div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700/20 mb-1.5 flex items-center justify-between">
<span>Insert Form Field</span>
<button type="button" onClick={() => setShowFormInsertMenu(false)} className="text-slate-400 hover:text-white text-xs cursor-pointer">
✕
</button>
</div>
<div className="grid grid-cols-2 gap-1 max-h-60 overflow-y-auto pr-1">
{[
{ type: 'text', label: 'Text Input', icon: Type },
{ type: 'email', label: 'Email', icon: Mail },
{ type: 'tel', label: 'Phone', icon: Phone },
{ type: 'url', label: 'URL / Link', icon: Globe },
{ type: 'date', label: 'Date Picker', icon: Calendar },
{ type: 'textarea', label: 'Text Area', icon: FileText },
{ type: 'radio', label: 'Radio Choice', icon: Radio },
{ type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
{ type: 'file', label: 'File Upload', icon: Upload },
{ type: 'select', label: 'Dropdown', icon: SlidersHorizontal },
{ type: 'number', label: 'Number', icon: Hash },
{ type: 'password', label: 'Password', icon: Shield },
].map((item) => {
const IconComp = item.icon;
return (<button key={item.type} type="button" onClick={() => {
const newField = {
id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
type: item.type as any,
label: item.label,
placeholder: `Enter ${item.label.toLowerCase()}...`,
required: false,
showLabel: true,
showPlaceholder: true,
options: item.type === 'radio' || item.type === 'select'
? ['Option 1', 'Option 2', 'Option 3']
: item.type === 'checkbox'
? ['I agree to the terms']
: undefined,
};
const updatedFields = [...(element.formFields || []), newField];
onUpdate({ ...element, formFields: updatedFields });
setShowFormInsertMenu(false);
}} className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs font-medium transition-colors cursor-pointer ${isLight
? 'hover:bg-indigo-50 hover:text-indigo-700 text-slate-700'
: 'hover:bg-slate-800 hover:text-indigo-300 text-slate-200'}`}>
<IconComp className="w-3.5 h-3.5 shrink-0 text-indigo-400"/>
<span className="truncate">{item.label}</span>
</button>);
})}
</div>
</div>)}
</div>)}

{onAddElementToColumn && (<button type="button" onClick={(e) => {
e.stopPropagation();
onAddElementToColumn(sectionId, element.id);
}} className={btnClass} title="Add element inside this container/column" aria-label="Add element inside this container/column">
<Plus className="w-3.5 h-3.5"/>
</button>)}

<div className="h-4 w-px bg-slate-700/30 shrink-0 mx-0.5"/>

<button type="button" onClick={(e) => {
e.stopPropagation();
openInspectorAtTab('main');
}} className={btnClass} title="Open Settings Inspector" aria-label="Open Settings Inspector">
<Settings className="w-3.5 h-3.5"/>
</button>

{(onDuplicateElement || onDeleteElement) && (<div className="relative shrink-0">
<button type="button" onClick={(e) => {
e.stopPropagation();
setShowMoreMenu((prev) => !prev);
}} className={btnClass} title="More actions" aria-label="More actions">
<MoreHorizontal className="w-3.5 h-3.5"/>
</button>

{showMoreMenu && (<div className={`absolute right-0 top-full mt-1.5 w-44 rounded-xl shadow-xl border p-1 z-50 animate-in fade-in zoom-in-95 duration-100 ${isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'}`} onClick={(e) => e.stopPropagation()}>
{onDuplicateElement && (<button type="button" onClick={() => {
setShowMoreMenu(false);
onDuplicateElement(sectionId, element.id);
}} className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center gap-2 font-medium transition-colors cursor-pointer ${isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-200'}`}>
<Copy className="w-3.5 h-3.5 shrink-0"/>
<span>Duplicate</span>
</button>)}
{element.type === 'image' && setManipulationMode && (<>
<button type="button" onClick={() => {
setShowMoreMenu(false);
setManipulationMode('resize');
}} className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center gap-2 font-medium transition-colors cursor-pointer ${isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-200'}`}>
<Maximize2 className="w-3.5 h-3.5 shrink-0"/>
<span>Resize Image</span>
</button>
<button type="button" onClick={() => {
setShowMoreMenu(false);
setManipulationMode('crop');
}} className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center gap-2 font-medium transition-colors cursor-pointer ${isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-200'}`}>
<Crop className="w-3.5 h-3.5 shrink-0"/>
<span>Crop Image</span>
</button>
</>)}
{onDeleteElement && (<button type="button" onClick={() => {
setShowMoreMenu(false);
onDeleteElement(element.id);
}} className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center gap-2 font-medium transition-colors cursor-pointer ${isLight ? 'hover:bg-rose-50 text-rose-600' : 'hover:bg-rose-950/40 text-rose-400'}`}>
<Trash2 className="w-3.5 h-3.5 text-rose-500"/>
<span>Delete</span>
</button>)}
</div>)}
</div>)}
</div>);
};
