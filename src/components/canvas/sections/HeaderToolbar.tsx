import React, { useState, useEffect, useRef } from 'react';
import {
GripVertical,
GripHorizontal,
Plus,
Layers,
Square,
Trash2,
Settings,
ChevronLeft,
ChevronRight,
ChevronDown,
Check,
Copy,
AlignLeft,
AlignCenter,
AlignRight,
Menu,
X,
FolderKanban,
Compass,
Navigation,
MousePointer,
Type,
Image,
Eye,
EyeOff,
} from 'lucide-react';
import { WebsiteSection, WebsiteElement, SelectedElementContext, ViewportMode } from '../../../types';
import { BackgroundController } from '../../BackgroundController';
import { InlineColorPicker } from '../../properties/InlineColorPicker';
import { DeleteModal } from '../../common/DeleteModal';
import { CheckCircle } from '../../common';
import { Popover } from '../../common/Popover';
import { HeaderLayersPopover } from '../../toolbar/header/HeaderLayersPopover';

interface HeaderToolbarProps {
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
onAddElementToSection?: (sectionId: string) => void;
onSelectElement?: (context: SelectedElementContext) => void;
onDeleteSection?: (sectionId: string) => void;
onDeleteElement?: (elementId: string) => void;
onMoveElement?: (sectionId: string, elementId: string, direction: 'up' | 'down') => void;
onDuplicateElement?: (sectionId: string, elementId: string) => void;
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

export const HeaderToolbar: React.FC<HeaderToolbarProps> = ({
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
onSelectElement,
onDeleteSection,
onDeleteElement,
onMoveElement,
onDuplicateElement,
handleSectionMouseEnter,
handleSectionMouseLeave,
}) => {
const [toolbarOffset, setToolbarOffset] = useState({ x: 0, y: 0 });
const [isDraggingToolbar, setIsDraggingToolbar] = useState(false);
const [popoverOffset, setPopoverOffset] = useState({ x: 0, y: 0 });
const [isDraggingPopover, setIsDraggingPopover] = useState(false);
const [activePopover, setActivePopover] = useState<
'layers' | 'layout' | 'group' | 'background' | 'border' | 'shadow' | 'mobile' | 'tablet' | 'desktop' | null
>(null);
const [selectedGroupElementIds, setSelectedGroupElementIds] = useState<string[]>([]);
const [layerToDelete, setLayerToDelete] = useState<WebsiteElement | null>(null);
const [radiusMode, setRadiusMode] = useState<'uniform' | 'corners'>('uniform');
const [showBorderColorPicker, setShowBorderColorPicker] = useState(false);
const [expandedNavVisibility, setExpandedNavVisibility] = useState(false);

const [isMobileScreen, setIsMobileScreen] = useState(() => {
if (typeof window !== 'undefined') {
return window.innerWidth < 768;
}
return false;
});

useEffect(() => {
const handleResize = () => {
setIsMobileScreen(window.innerWidth < 768);
};
window.addEventListener('resize', handleResize);
return () => window.removeEventListener('resize', handleResize);
}, []);

const isMobile = isMobileScreen || viewportMode === 'mobile';

useEffect(() => {
if (activePopover === 'group' && selectedGroupElementIds.length === 0) {
if (selectedContext?.element && section.elements.some((el) => el.id === selectedContext.element.id)) {

const currentId = selectedContext.element.id;
const otherEl = section.elements.find((el) => el.id !== currentId);
setSelectedGroupElementIds(otherEl ? [currentId, otherEl.id] : [currentId]);
} else if (section.elements.length >= 2) {

setSelectedGroupElementIds([section.elements[0].id, section.elements[1].id]);
} else {
setSelectedGroupElementIds(section.elements.map((el) => el.id));
}
}
}, [activePopover, selectedContext, section.elements]);

const popoverRef = useRef<HTMLDivElement>(null);

const handleGroupSelectedElements = (idsToGroup: string[]) => {
if (!onUpdateSection || idsToGroup.length < 2) return;
const currentElements = [...section.elements];

const elementsToGroup: WebsiteElement[] = [];
let firstIndex = -1;

currentElements.forEach((el, idx) => {
if (idsToGroup.includes(el.id)) {
elementsToGroup.push(el);
if (firstIndex === -1) firstIndex = idx;
}
});

if (elementsToGroup.length < 2 || firstIndex === -1) return;

const newGroup: WebsiteElement = {
id: `group-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
type: 'inline',
label: `Header Group (${elementsToGroup.length})`,
children: elementsToGroup,
styles: {
display: 'flex',
flexDirection: 'row',
gap: 16,
alignItems: 'center',
justifyContent: 'flex-start',
},
};

const remainingElements = currentElements.filter((el) => !idsToGroup.includes(el.id));
const updatedElements = [...remainingElements];
updatedElements.splice(firstIndex, 0, newGroup);

onUpdateSection({
...section,
elements: updatedElements,
});

setSelectedGroupElementIds([newGroup.id]);

if (onSelectElement) {
onSelectElement({
element: newGroup,
sectionId: section.id,
});
}
};

const handleUngroupElement = (groupId: string) => {
if (!onUpdateSection) return;
const currentElements = [...section.elements];
const groupIdx = currentElements.findIndex((el) => el.id === groupId);
if (groupIdx === -1) return;

const groupEl = currentElements[groupIdx];
const children = groupEl.children || [];
if (children.length === 0) return;

const updatedElements = [...currentElements];
updatedElements.splice(groupIdx, 1, ...children);

onUpdateSection({
...section,
elements: updatedElements,
});

setSelectedGroupElementIds(children.map((c) => c.id));

if (children[0] && onSelectElement) {
onSelectElement({
element: children[0],
sectionId: section.id,
});
}
};

useEffect(() => {
const handleKeyDown = (e: KeyboardEvent) => {
const isCmdOrCtrl = e.metaKey || e.ctrlKey;
if (isCmdOrCtrl && e.key.toLowerCase() === 'g') {
const activeTag = (document.activeElement?.tagName || '').toLowerCase();
const isEditable = (document.activeElement as HTMLElement)?.isContentEditable;
if (activeTag === 'input' || activeTag === 'textarea' || isEditable) {
return;
}

e.preventDefault();

if (e.shiftKey) {

const targetGroup = section.elements.find(
(el) =>
(selectedContext?.element?.id === el.id || selectedGroupElementIds.includes(el.id)) &&
(el.type === 'inline' || el.type === 'container' || (el.children && el.children.length > 0))
) || section.elements.find((el) => el.type === 'inline' || el.type === 'container' || (el.children && el.children.length > 0));

if (targetGroup) {
handleUngroupElement(targetGroup.id);
}
} else {

if (selectedGroupElementIds.length >= 2) {
handleGroupSelectedElements(selectedGroupElementIds);
} else if (section.elements.length >= 2) {

const selIdx = selectedContext?.element
? section.elements.findIndex((el) => el.id === selectedContext.element.id)
: 0;
const idx1 = selIdx !== -1 ? selIdx : 0;
const idx2 = idx1 + 1 < section.elements.length ? idx1 + 1 : idx1 - 1;
const idsToGroup = [section.elements[Math.min(idx1, idx2)].id, section.elements[Math.max(idx1, idx2)].id];
handleGroupSelectedElements(idsToGroup);
}
}
}
};

window.addEventListener('keydown', handleKeyDown);
return () => window.removeEventListener('keydown', handleKeyDown);
}, [selectedGroupElementIds, section, selectedContext, onUpdateSection]);

const getElementTypeIcon = (type: string) => {
switch (type) {
case 'logo':
return <Compass className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
case 'nav-links':
case 'nav-container':
case 'nav-link':
return <Navigation className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
case 'button':
return <MousePointer className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
case 'heading':
case 'text':
return <Type className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
case 'image':
return <Image className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
case 'inline':
case 'container':
return <FolderKanban className="w-3.5 h-3.5 text-indigo-500 shrink-0" />;
default:
return <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
}
};

useEffect(() => {
setPopoverOffset({ x: 0, y: 0 });
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
const isToolbarVisible = isSectionSelected || isSectionHovered;

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
} backdrop-blur-md border rounded-xl px-2.5 py-1.5 flex items-center gap-1 text-xs transition-all duration-150 ${
isDraggingToolbar ? 'ring-2 ring-indigo-500 cursor-grabbing shadow-indigo-500/20' : ''
}`;

const popoverContainerClasses = `formatting-popover popover-content z-[100] backdrop-blur-xl flex flex-col overflow-hidden transition-shadow ${
isLight
? 'bg-white/98 border-slate-200 text-slate-800 shadow-slate-300/60'
: 'bg-slate-900/98 border-slate-750 text-slate-100 shadow-black/80'
} ${
isDraggingPopover ? 'ring-2 ring-indigo-500 shadow-indigo-500/25' : ''
} absolute top-full mt-2 w-92 max-w-[calc(100vw-24px)] rounded-2xl border shadow-2xl ${
isTopBar ? 'left-4' : 'right-0'
}`;

const labelClass = `block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
isLight ? 'text-slate-600' : 'text-slate-400'
}`;
const inputClass = `w-full px-2.5 py-1.5 text-xs rounded-lg border outline-none font-mono ${
isLight
? 'bg-slate-50 border-slate-300 text-slate-800 focus:border-indigo-500'
: 'bg-slate-950 border-slate-700 text-slate-100 focus:border-indigo-400'
}`;

const getPopoverTitle = (type: typeof activePopover) => {
switch (type) {
case 'layers':
return 'Header Layers & Blocks';
case 'layout':
return 'Header Layout & Spacing';
case 'group':
return 'Group Header Elements';
case 'background':
return 'Header Background';
case 'border':
return 'Header Border & Radius';
case 'shadow':
return 'Header Elevation & Shadow';
case 'mobile':
return 'Mobile Settings';
case 'tablet':
return 'Tablet Settings';
case 'desktop':
return 'Desktop Settings';
default:
return 'Header Settings';
}
};

const moveLayer = (index: number, direction: 'left' | 'right') => {
const el = section.elements[index];
if (el && onMoveElement) {
onMoveElement(section.id, el.id, direction === 'left' ? 'up' : 'down');
} else if (onUpdateSection) {
const targetIndex = direction === 'left' ? index - 1 : index + 1;
if (targetIndex < 0 || targetIndex >= section.elements.length) return;
const newElements = [...section.elements];
const [moved] = newElements.splice(index, 1);
newElements.splice(targetIndex, 0, moved);
onUpdateSection({ ...section, elements: newElements });
}
};

const deleteLayer = (elementId: string) => {
if (onDeleteElement) {
onDeleteElement(elementId);
} else if (onUpdateSection) {
const newElements = section.elements.filter((el) => el.id !== elementId);
onUpdateSection({ ...section, elements: newElements });
}
};

const duplicateLayer = (element: WebsiteElement) => {
if (onDuplicateElement) {
onDuplicateElement(section.id, element.id);
} else if (onUpdateSection) {
const dup: WebsiteElement = {
...element,
id: `${element.type || 'block'}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
label: `${element.label || 'Block'} (Copy)`,
};
onUpdateSection({ ...section, elements: [...section.elements, dup] });
}
};

const toggleHeaderItemVisibility = (
itemId: string,
target: 'mobile' | 'tablet' | 'desktop'
) => {
if (!onUpdateSection) return;
const prop = target === 'mobile' ? 'hideOnMobile' : target === 'tablet' ? 'hideOnTablet' : 'hideOnDesktop';

if (itemId === 'hamburger-button') {
const isHidden =
target === 'mobile'
? Boolean(section.hamburgerSettings?.hideOnMobile)
: target === 'tablet'
? Boolean(section.hamburgerSettings?.hideOnTablet ?? true)
: Boolean(section.hamburgerSettings?.hideOnDesktop ?? true);

const nextHidden = !isHidden;

onUpdateSection({
...section,
hamburgerSettings: {
...(section.hamburgerSettings || {}),
[prop]: nextHidden,
},
styles: {
...(section.styles || {}),
[prop === 'hideOnMobile' ? 'hideHamburgerOnMobile' : prop === 'hideOnTablet' ? 'hideHamburgerOnTablet' : 'hideHamburgerOnDesktop']: nextHidden,
},
});
return;
}

if (itemId === 'navigation-all') {
const navElements = section.elements.filter(
(el) => el.type === 'nav-link' || el.type === 'nav-links' || el.type === 'nav-container'
);
const allHidden = navElements.every((el) => Boolean(el[prop] || el.styles?.[prop]));
const nextHidden = !allHidden;

const updated = section.elements.map((el) => {
if (el.type === 'nav-link' || el.type === 'nav-links' || el.type === 'nav-container') {
return {
...el,
[prop]: nextHidden,
styles: {
...(el.styles || {}),
[prop]: nextHidden,
},
};
}
return el;
});

onUpdateSection({ ...section, elements: updated });
return;
}

const updated = section.elements.map((el) => {
if (el.id === itemId) {
const currentlyHidden = Boolean(el[prop] || el.styles?.[prop]);
return {
...el,
[prop]: !currentlyHidden,
styles: {
...(el.styles || {}),
[prop]: !currentlyHidden,
},
};
}
return el;
});

onUpdateSection({ ...section, elements: updated });
};

const renderHeaderContentVisibility = (targetTab: 'mobile' | 'tablet' | 'desktop') => {
const prop = targetTab === 'mobile' ? 'hideOnMobile' : targetTab === 'tablet' ? 'hideOnTablet' : 'hideOnDesktop';
const tabLabel = targetTab === 'mobile' ? 'Mobile' : targetTab === 'tablet' ? 'Tablet' : 'Desktop';

const isHamburgerHidden =
targetTab === 'mobile'
? Boolean(section.hamburgerSettings?.hideOnMobile)
: targetTab === 'tablet'
? Boolean(section.hamburgerSettings?.hideOnTablet ?? true)
: Boolean(section.hamburgerSettings?.hideOnDesktop ?? true);

const navElements = section.elements.filter(
(el) => el.type === 'nav-link' || el.type === 'nav-links' || el.type === 'nav-container'
);

const logoElements = section.elements.filter(
(el) => el.type === 'logo' || el.id.includes('logo') || (el.label && el.label.toLowerCase().includes('logo'))
);

const buttonElements = section.elements.filter(
(el) => el.type === 'button' && !logoElements.some((l) => l.id === el.id)
);

const otherElements = section.elements.filter(
(el) =>
!navElements.some((n) => n.id === el.id) &&
!logoElements.some((l) => l.id === el.id) &&
!buttonElements.some((b) => b.id === el.id)
);

const hasNav = navElements.length > 0;
const isNavHidden = hasNav && navElements.every((el) => Boolean(el[prop] || el.styles?.[prop]));

return (
<div className="space-y-2 pb-1">
<label className={labelClass}>Visibility</label>

<div className="space-y-0.5">
<div className="flex items-center justify-between py-1.5 px-2 rounded-lg text-xs transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/60">
<span
className={`truncate mr-2 font-medium ${
isHamburgerHidden ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'
}`}
>
Hamburger Button
</span>

<button
type="button"
onClick={() => toggleHeaderItemVisibility('hamburger-button', targetTab)}
className={`p-1.5 rounded-md transition-colors cursor-pointer shrink-0 hover:bg-slate-200/70 dark:hover:bg-slate-700/60 ${
isHamburgerHidden
? 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
: 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
}`}
title={isHamburgerHidden ? `Show on ${tabLabel}` : `Hide on ${tabLabel}`}
aria-label={isHamburgerHidden ? `Show on ${tabLabel}` : `Hide on ${tabLabel}`}
>
{isHamburgerHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
</button>
</div>

{logoElements.map((el) => {
const isHidden = Boolean(el[prop] || el.styles?.[prop]);
const elLabel = el.label || 'Logo';
return (
<div
key={el.id}
className="flex items-center justify-between py-1.5 px-2 rounded-lg text-xs transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/60"
>
<span className={`truncate mr-2 font-medium ${isHidden ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>
{elLabel}
</span>

<button
type="button"
onClick={() => toggleHeaderItemVisibility(el.id, targetTab)}
className={`p-1.5 rounded-md transition-colors cursor-pointer shrink-0 hover:bg-slate-200/70 dark:hover:bg-slate-700/60 ${
isHidden
? 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
: 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
}`}
title={isHidden ? `Show on ${tabLabel}` : `Hide on ${tabLabel}`}
aria-label={isHidden ? `Show on ${tabLabel}` : `Hide on ${tabLabel}`}
>
{isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
</button>
</div>
);
})}

{hasNav && (
<div>
<div className="flex items-center justify-between py-1.5 px-2 rounded-lg text-xs transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/60">
<span className={`truncate mr-2 font-medium ${isNavHidden ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>
Navigation {navElements.length > 1 ? `(${navElements.length})` : ''}
</span>

<div className="flex items-center gap-1 shrink-0">
{navElements.length > 1 && (
<button
type="button"
onClick={() => setExpandedNavVisibility((prev) => !prev)}
className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
title={expandedNavVisibility ? 'Hide individual links' : 'Show individual links'}
aria-label="Toggle link list"
>
<ChevronDown
className={`w-3.5 h-3.5 transition-transform ${
expandedNavVisibility ? 'rotate-180' : ''
}`}
/>
</button>
)}
<button
type="button"
onClick={() => toggleHeaderItemVisibility('navigation-all', targetTab)}
className={`p-1.5 rounded-md transition-colors cursor-pointer shrink-0 hover:bg-slate-200/70 dark:hover:bg-slate-700/60 ${
isNavHidden
? 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
: 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
}`}
title={isNavHidden ? `Show on ${tabLabel}` : `Hide on ${tabLabel}`}
aria-label={isNavHidden ? `Show on ${tabLabel}` : `Hide on ${tabLabel}`}
>
{isNavHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
</button>
</div>
</div>

{expandedNavVisibility && navElements.length > 1 && (
<div className="pl-4 pr-1 py-0.5 space-y-0.5">
{navElements.map((navItem) => {
const itemHidden = Boolean(navItem[prop] || navItem.styles?.[prop]);
const itemLabel = navItem.label || navItem.content || 'Link';
return (
<div
key={navItem.id}
className="flex items-center justify-between py-1 px-2 rounded-md text-[11px] transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/40"
>
<span
className={`truncate mr-2 ${
itemHidden ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300'
}`}
>
{itemLabel}
</span>
<button
type="button"
onClick={() => toggleHeaderItemVisibility(navItem.id, targetTab)}
className={`p-1 rounded transition-colors cursor-pointer shrink-0 hover:bg-slate-200/70 dark:hover:bg-slate-700/60 ${
itemHidden
? 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
: 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
}`}
title={itemHidden ? `Show on ${tabLabel}` : `Hide on ${tabLabel}`}
aria-label={itemHidden ? `Show on ${tabLabel}` : `Hide on ${tabLabel}`}
>
{itemHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
</button>
</div>
);
})}
</div>
)}
</div>
)}

{buttonElements.map((el) => {
const isHidden = Boolean(el[prop] || el.styles?.[prop]);
const elLabel = el.content?.replace(/<[^>]*>/g, '') || el.label || 'Button';
return (
<div
key={el.id}
className="flex items-center justify-between py-1.5 px-2 rounded-lg text-xs transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/60"
>
<span className={`truncate mr-2 font-medium ${isHidden ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>
{elLabel}
</span>

<button
type="button"
onClick={() => toggleHeaderItemVisibility(el.id, targetTab)}
className={`p-1.5 rounded-md transition-colors cursor-pointer shrink-0 hover:bg-slate-200/70 dark:hover:bg-slate-700/60 ${
isHidden
? 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
: 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
}`}
title={isHidden ? `Show on ${tabLabel}` : `Hide on ${tabLabel}`}
aria-label={isHidden ? `Show on ${tabLabel}` : `Hide on ${tabLabel}`}
>
{isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
</button>
</div>
);
})}

{otherElements.map((el) => {
const isHidden = Boolean(el[prop] || el.styles?.[prop]);
const elLabel =
el.label ||
el.content?.replace(/<[^>]*>/g, '') ||
(el.type ? el.type.charAt(0).toUpperCase() + el.type.slice(1) : 'Element');
return (
<div
key={el.id}
className="flex items-center justify-between py-1.5 px-2 rounded-lg text-xs transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/60"
>
<span className={`truncate mr-2 font-medium ${isHidden ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>
{elLabel}
</span>

<button
type="button"
onClick={() => toggleHeaderItemVisibility(el.id, targetTab)}
className={`p-1.5 rounded-md transition-colors cursor-pointer shrink-0 hover:bg-slate-200/70 dark:hover:bg-slate-700/60 ${
isHidden
? 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
: 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
}`}
title={isHidden ? `Show on ${tabLabel}` : `Hide on ${tabLabel}`}
aria-label={isHidden ? `Show on ${tabLabel}` : `Hide on ${tabLabel}`}
>
{isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
</button>
</div>
);
})}
</div>
</div>
);
};

const renderPopoverPanel = (content: React.ReactNode) => content;

const renderPopovers = () => {
const s = (section.styles || {}) as Record<string, any>;
const isSticky = Boolean((section as any).isSticky ?? (section as any).sticky);
const updateStyle = (key: string, value: any) => {
onUpdateSection?.({
...section,
styles: { ...(section.styles || {}), [key]: value },
});
};
const updateStyles = (newStyles: Record<string, any>) => {
onUpdateSection?.({
...section,
styles: { ...(section.styles || {}), ...newStyles },
});
};
const updateProp = (prop: string, value: any) => {
onUpdateSection?.({
...section,
[prop]: value,
});
};

return (
<>
{activePopover === 'layers' &&
renderPopoverPanel(
<HeaderLayersPopover
section={section}
isLight={isLight}
onSelectElement={onSelectElement}
onAddElementToSection={onAddElementToSection}
onMoveLayer={moveLayer}
onDuplicateLayer={duplicateLayer}
onSetLayerToDelete={setLayerToDelete}
/>
)}

{activePopover === 'layout' &&
renderPopoverPanel(
<div className="space-y-3.5 text-xs">
<div>
<label className={labelClass}>Layout Distribution</label>
<div className="grid grid-cols-3 gap-1.5">
{[
{ id: 'space-between', label: 'Space Between' },
{ id: 'space-around', label: 'Space Around' },
{ id: 'space-evenly', label: 'Space Evenly' },
{ id: 'center', label: 'Center' },
{ id: 'flex-start', label: 'Left / Start' },
{ id: 'flex-end', label: 'Right / End' },
].map((opt) => {
const currentDist =
s.layoutDistribution ||
(section.headerLayout === 'centered'
? 'center'
: section.headerLayout === 'split'
? 'space-between'
: 'space-between');
const isSel = currentDist === opt.id;
return (
<button
key={opt.id}
type="button"
onClick={() => updateStyle('layoutDistribution', opt.id)}
className={`py-1.5 px-1 text-[11px] rounded-lg border font-medium text-center transition-all cursor-pointer leading-tight ${
isSel
? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-xs'
: isLight
? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
: 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
}`}
>
{opt.label}
</button>
);
})}
</div>
</div>

<div className="pt-2">
<label className={labelClass}>Horizontal Alignment</label>
<div className="grid grid-cols-3 gap-1.5">
{[
{ id: 'left', label: 'Left', icon: AlignLeft },
{ id: 'center', label: 'Center', icon: AlignCenter },
{ id: 'right', label: 'Right', icon: AlignRight },
].map((opt) => {
const currentAlign = s.alignment || s.horizontalAlignment || 'center';
const isSel = currentAlign === opt.id;
const Icon = opt.icon;
return (
<button
key={opt.id}
type="button"
onClick={() => updateStyles({ alignment: opt.id, horizontalAlignment: opt.id })}
className={`py-1.5 px-2 text-xs rounded-lg border font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
isSel
? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-xs'
: isLight
? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
: 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
}`}
>
<Icon className="w-3.5 h-3.5" />
<span>{opt.label}</span>
</button>
);
})}
</div>
</div>

<div className="pt-2">
<label className={labelClass}>Vertical Alignment</label>
<div className="grid grid-cols-4 gap-1">
{[
{ id: 'center', label: 'Center' },
{ id: 'flex-start', label: 'Top' },
{ id: 'flex-end', label: 'Bottom' },
{ id: 'stretch', label: 'Stretch' },
].map((al) => {
const currentAlign = s.verticalAlignment || 'center';
const isSel = currentAlign === al.id;
return (
<button
key={al.id}
type="button"
onClick={() => updateStyle('verticalAlignment', al.id)}
className={`py-1 text-[10px] rounded-lg border font-medium transition-all cursor-pointer ${
isSel
? 'bg-indigo-600 text-white font-bold border-indigo-600'
: isLight
? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
: 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
}`}
>
{al.label}
</button>
);
})}
</div>
</div>

<div className="pt-2">
<div className="flex items-center justify-between mb-1">
<label className={labelClass}>Item Gap / Spacing</label>
<span className="text-[10px] font-mono text-indigo-400 font-semibold">
{s.gap !== undefined ? s.gap : 24}px
</span>
</div>
<input
type="range"
min={0}
max={64}
step={4}
value={s.gap !== undefined ? s.gap : 24}
onChange={(e) => updateStyle('gap', Number(e.target.value))}
className="w-full accent-indigo-500 cursor-pointer"
/>
</div>

<div className="pt-2 space-y-2">
<div className="flex items-center justify-between">
<label className={labelClass}>Container Max-Width</label>
<div className="flex items-center gap-1">
<input
type="number"
min={320}
max={2560}
step={10}
value={
s.maxWidth === 'full' || s.maxWidth === '100%'
? 1920
: typeof s.maxWidth === 'number'
? s.maxWidth
: parseInt(String(s.maxWidth || '1280'), 10) || 1280
}
onChange={(e) => {
const val = Number(e.target.value);
if (!isNaN(val) && val > 0) {
updateStyle('maxWidth', `${val}px`);
}
}}
className={`w-20 px-2 py-1.5 text-right font-mono text-xs rounded border outline-none ${
isLight
? 'bg-white border-slate-300 text-slate-900'
: 'bg-slate-900 border-slate-700 text-slate-100'
}`}
/>
<span className="text-[10px] text-slate-400 font-mono">px</span>
</div>
</div>

<div className="grid grid-cols-3 gap-1">
{[
{ id: 'full', label: 'Full (100%)', val: 'full' },
{ id: '1440px', label: '1440px', val: '1440px' },
{ id: '1280px', label: '1280px (7XL)', val: '1280px' },
{ id: '1152px', label: '1152px (6XL)', val: '1152px' },
{ id: '1024px', label: '1024px (5XL)', val: '1024px' },
{ id: '768px', label: '768px (Tablet)', val: '768px' },
].map((preset) => {
const currentVal = s.maxWidth || '1280px';
const isSel =
currentVal === preset.val ||
(preset.id === '1280px' && currentVal === '7xl') ||
(preset.id === '1152px' && currentVal === '6xl') ||
(preset.id === '1024px' && currentVal === '5xl') ||
(preset.id === '768px' && currentVal === '3xl');
return (
<button
key={preset.id}
type="button"
onClick={() => updateStyle('maxWidth', preset.val)}
className={`py-1 text-[10px] rounded-lg border font-medium transition-all cursor-pointer text-center ${
isSel
? 'bg-indigo-600 text-white font-bold border-indigo-600'
: isLight
? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
: 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
}`}
>
{preset.label}
</button>
);
})}
</div>

<input
type="range"
min={320}
max={1920}
step={10}
value={
s.maxWidth === 'full' || s.maxWidth === '100%'
? 1920
: typeof s.maxWidth === 'number'
? s.maxWidth
: parseInt(String(s.maxWidth || '1280'), 10) || 1280
}
onChange={(e) => updateStyle('maxWidth', `${e.target.value}px`)}
className="w-full accent-indigo-500 cursor-pointer mt-1"
/>
</div>

<div className="pt-2 space-y-2">
<label className={labelClass}>Header Margins</label>

<div className="flex items-center gap-1">
{[0, 8, 16, 24, 32].map((mVal) => {
const isSel = (s.marginTop === mVal && s.marginBottom === mVal) || (s.margin === mVal);
return (
<button
key={mVal}
type="button"
onClick={() => updateStyles({ marginTop: mVal, marginBottom: mVal, margin: mVal })}
className={`flex-1 py-1 text-[10px] font-mono rounded-lg border transition-all cursor-pointer text-center ${
isSel
? 'bg-indigo-600 text-white font-bold border-indigo-600'
: isLight
? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
: 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
}`}
>
{mVal}px
</button>
);
})}
</div>

<div className="grid grid-cols-2 gap-3 pt-1">
<div>
<div className="flex items-center justify-between mb-1">
<span className="text-[10px] font-medium text-slate-400">Margin Top</span>
<div className="flex items-center gap-0.5">
<input
type="number"
min={0}
max={128}
value={s.marginTop !== undefined ? s.marginTop : (s.margin !== undefined ? s.margin : 0)}
onChange={(e) => updateStyle('marginTop', Number(e.target.value))}
className={`w-12 px-1 py-0.5 text-right font-mono text-[10px] rounded border outline-none ${
isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-100'
}`}
/>
<span className="text-[9px] text-slate-400 font-mono">px</span>
</div>
</div>
<input
type="range"
min={0}
max={64}
step={2}
value={s.marginTop !== undefined ? s.marginTop : (s.margin !== undefined ? s.margin : 0)}
onChange={(e) => updateStyle('marginTop', Number(e.target.value))}
className="w-full accent-indigo-500 cursor-pointer"
/>
</div>
<div>
<div className="flex items-center justify-between mb-1">
<span className="text-[10px] font-medium text-slate-400">Margin Bottom</span>
<div className="flex items-center gap-0.5">
<input
type="number"
min={0}
max={128}
value={s.marginBottom !== undefined ? s.marginBottom : (s.margin !== undefined ? s.margin : 0)}
onChange={(e) => updateStyle('marginBottom', Number(e.target.value))}
className={`w-12 px-1 py-0.5 text-right font-mono text-[10px] rounded border outline-none ${
isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-100'
}`}
/>
<span className="text-[9px] text-slate-400 font-mono">px</span>
</div>
</div>
<input
type="range"
min={0}
max={64}
step={2}
value={s.marginBottom !== undefined ? s.marginBottom : (s.margin !== undefined ? s.margin : 0)}
onChange={(e) => updateStyle('marginBottom', Number(e.target.value))}
className="w-full accent-indigo-500 cursor-pointer"
/>
</div>
</div>
</div>

<div className="pt-2 flex items-center justify-between">
<div>
<span className="font-semibold text-xs block">Sticky Header</span>
<span className="text-[10px] text-slate-400 block">Pin to top on scroll</span>
</div>
<button
type="button"
onClick={() => updateProp('isSticky', !isSticky)}
className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
isSticky ? 'bg-indigo-600' : isLight ? 'bg-slate-300' : 'bg-slate-700'
}`}
>
<span
className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
isSticky ? 'left-4.5' : 'left-0.5'
}`}
/>
</button>
</div>

<div className="grid grid-cols-2 gap-3 pt-2">
<div>
<div className="flex items-center justify-between mb-1">
<label className={labelClass}>Pad Y</label>
<span className="text-[10px] font-mono text-indigo-400">
{s.paddingY !== undefined ? s.paddingY : 16}px
</span>
</div>
<input
type="range"
min={4}
max={48}
step={2}
value={s.paddingY !== undefined ? s.paddingY : 16}
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

{activePopover === 'group' &&
renderPopoverPanel(
<div className="space-y-3.5 text-xs">
<div className="flex items-center justify-between pb-1.5">
<span className="font-semibold text-xs text-slate-800 dark:text-slate-200">Group Elements</span>
<div className="flex items-center gap-2 text-[11px]">
<button
type="button"
onClick={() => setSelectedGroupElementIds(section.elements.map((el) => el.id))}
className="font-medium hover:underline cursor-pointer"
style={{ color: 'var(--brand-primary, #6366f1)' }}
>
Select All
</button>
<span className="text-slate-400">•</span>
<button
type="button"
onClick={() => setSelectedGroupElementIds([])}
className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
>
Clear
</button>
</div>
</div>

<div className="space-y-1">
<div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
{section.elements.length === 0 ? (
<div className="text-center py-5 text-slate-400 text-xs">
No elements available in header.
</div>
) : (
section.elements.map((el) => {
const isChecked = selectedGroupElementIds.includes(el.id);
const isGroup =
el.type === 'inline' ||
el.type === 'container' ||
(el.children && el.children.length > 0);
return (
<div
key={el.id}
onClick={() => {
setSelectedGroupElementIds((prev) =>
prev.includes(el.id) ? prev.filter((id) => id !== el.id) : [...prev, el.id]
);
}}
className={`py-1.5 px-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
isLight
? 'hover:bg-slate-100 text-slate-700'
: 'hover:bg-slate-800/80 text-slate-200'
}`}
>
<div className="flex items-center gap-2 truncate min-w-0">
<CheckCircle
checked={isChecked}
size="xs"
isLight={isLight}
circleClassName="shrink-0"
/>
<div className="flex items-center gap-1.5 truncate">
<span className="truncate">{el.label || el.content || el.type}</span>
{isGroup && (
<span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
Group ({el.children?.length || 0})
</span>
)}
</div>
</div>

{isGroup && (
<button
type="button"
onClick={(e) => {
e.stopPropagation();
handleUngroupElement(el.id);
}}
className="px-2 py-0.5 text-[10px] font-medium rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer shrink-0 ml-1 transition-colors"
title="Ungroup this container"
>
Ungroup
</button>
)}
</div>
);
})
)}
</div>
</div>

<div className="flex items-center gap-2 pt-2">
<button
type="button"
disabled={selectedGroupElementIds.length < 2}
onClick={() => handleGroupSelectedElements(selectedGroupElementIds)}
style={{
backgroundColor: selectedGroupElementIds.length >= 2 ? 'var(--brand-primary, #6366f1)' : undefined,
}}
className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
selectedGroupElementIds.length >= 2
? 'text-white cursor-pointer hover:opacity-90'
: 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-60'
}`}
>
<span>Group Selected ({selectedGroupElementIds.length})</span>
</button>

{section.elements.some(
(el) => el.type === 'inline' || el.type === 'container' || (el.children && el.children.length > 0)
) && (
<button
type="button"
onClick={() => {
const groupToUngroup =
section.elements.find(
(el) =>
selectedGroupElementIds.includes(el.id) &&
(el.type === 'inline' || el.type === 'container' || (el.children && el.children.length > 0))
) ||
section.elements.find(
(el) => el.type === 'inline' || el.type === 'container' || (el.children && el.children.length > 0)
);

if (groupToUngroup) {
handleUngroupElement(groupToUngroup.id);
}
}}
className="py-2 px-3 rounded-lg text-xs font-semibold transition-all border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1 shrink-0"
title="Ungroup Container (⌘⇧G / Ctrl+Shift+G)"
>
<span>Ungroup</span>
</button>
)}
</div>

{(() => {
const activeGroup = section.elements.find(
(el) =>
(selectedContext?.element?.id === el.id || selectedGroupElementIds.includes(el.id)) &&
(el.type === 'inline' || el.type === 'container' || (el.children && el.children.length > 0))
);

if (!activeGroup) return null;
const groupStyles = activeGroup.styles || {};

return (
<div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 space-y-2.5 mt-2">
<div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
<span>Active Group Settings</span>
<span className="font-mono text-[10px] text-slate-400">{activeGroup.label || 'Group'}</span>
</div>

<div className="space-y-1">
<span className="text-[11px] font-medium text-slate-500 block">Inner Gap:</span>
<div className="flex items-center gap-1">
{[0, 8, 12, 16, 24, 32].map((gVal) => {
const isSel = (groupStyles.gap !== undefined ? groupStyles.gap : 16) === gVal;
return (
<button
key={gVal}
type="button"
onClick={() => {
const updatedGroup = {
...activeGroup,
styles: { ...(activeGroup.styles || {}), gap: gVal },
};
const newEls = section.elements.map((e) => (e.id === activeGroup.id ? updatedGroup : e));
onUpdateSection?.({ ...section, elements: newEls });
}}
style={{
backgroundColor: isSel ? 'var(--brand-primary, #6366f1)' : undefined,
}}
className={`flex-1 py-1 text-xs font-mono rounded transition-colors cursor-pointer text-center ${
isSel
? 'text-white font-bold'
: isLight
? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
: 'bg-slate-800 text-slate-300 hover:bg-slate-700'
}`}
>
{gVal}px
</button>
);
})}
</div>
</div>

<div className="space-y-1">
<span className="text-[11px] font-medium text-slate-500 block">Align Items:</span>
<div className="grid grid-cols-4 gap-1">
{[
{ key: 'center', label: 'Center' },
{ key: 'flex-start', label: 'Top' },
{ key: 'flex-end', label: 'Bottom' },
{ key: 'stretch', label: 'Stretch' },
].map((align) => {
const isSel = (groupStyles.alignItems || 'center') === align.key;
return (
<button
key={align.key}
type="button"
onClick={() => {
const updatedGroup = {
...activeGroup,
styles: { ...(activeGroup.styles || {}), alignItems: align.key },
};
const newEls = section.elements.map((e) => (e.id === activeGroup.id ? updatedGroup : e));
onUpdateSection?.({ ...section, elements: newEls });
}}
style={{
backgroundColor: isSel ? 'var(--brand-primary, #6366f1)' : undefined,
}}
className={`py-1 px-1 text-[10px] font-medium rounded transition-colors cursor-pointer text-center ${
isSel
? 'text-white font-bold'
: isLight
? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
: 'bg-slate-800 text-slate-300 hover:bg-slate-700'
}`}
>
{align.label}
</button>
);
})}
</div>
</div>
</div>
);
})()}
</div>
)}

{activePopover === 'background' &&
renderPopoverPanel(
<BackgroundController
styles={s}
onChange={(bgUpdates) => updateStyles(bgUpdates)}
uiTheme={uiTheme}
label="Header Background"
allowTransparent={true}
/>
)}

{activePopover === 'border' &&
renderPopoverPanel(
<div className="space-y-3.5 text-xs">
<div>
<label className={labelClass}>Border Placement</label>
<div className="grid grid-cols-4 gap-1">
{[
{ id: 'bottom', label: 'Bottom' },
{ id: 'all', label: 'All Sides' },
{ id: 'top-bottom', label: 'Top & Bot' },
{ id: 'none', label: 'None' },
].map((pos) => {
const currentPos = s.borderPosition || 'bottom';
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
className="w-14 px-1.5 py-1 text-center text-xs font-semibold rounded border outline-none font-mono"
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

{activePopover === 'shadow' &&
renderPopoverPanel(
<>
<label className={labelClass}>Header Elevation / Shadow</label>
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
</>
)}

{activePopover === 'desktop' &&
renderPopoverPanel(
<div className="space-y-3 text-xs">
<div className="pt-2">
{renderHeaderContentVisibility('desktop')}
</div>

<div className="grid grid-cols-2 gap-2 pt-6 mt-3">
<div>
<div className="flex items-center justify-between mb-1">
<label className={labelClass}>Padding Y</label>
<span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
{s.paddingY !== undefined ? s.paddingY : 16}px
</span>
</div>
<input
type="range"
min={4}
max={48}
step={2}
value={s.paddingY !== undefined ? s.paddingY : 16}
onChange={(e) => updateStyle('paddingY', Number(e.target.value))}
className="w-full accent-slate-700 dark:accent-slate-300 cursor-pointer"
/>
</div>
<div>
<div className="flex items-center justify-between mb-1">
<label className={labelClass}>Padding X</label>
<span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
{s.paddingX !== undefined ? s.paddingX : 24}px
</span>
</div>
<input
type="range"
min={4}
max={64}
step={2}
value={s.paddingX !== undefined ? s.paddingX : 24}
onChange={(e) => updateStyle('paddingX', Number(e.target.value))}
className="w-full accent-slate-700 dark:accent-slate-300 cursor-pointer"
/>
</div>
</div>
</div>
)}

{activePopover === 'tablet' &&
renderPopoverPanel(
<div className="space-y-3 text-xs">
<div className="pt-4 mt-2">
{renderHeaderContentVisibility('tablet')}
</div>

<div className="pt-3">
<label className={labelClass}>Layout</label>
<div className="grid grid-cols-3 gap-1.5 mt-1">
{[
{ id: 'auto', label: 'Auto' },
{ id: 'stacked', label: 'Stacked' },
{ id: 'row', label: 'Horizontal' },
].map((tbl) => {
const currentStyle = section.headerTabletStyle || 'auto';
const isSel = currentStyle === tbl.id;
return (
<button
key={tbl.id}
type="button"
onClick={() => updateProp('headerTabletStyle', tbl.id)}
className={`py-1.5 text-xs rounded-lg border font-medium text-center transition-colors cursor-pointer ${
isSel
? isLight
? 'bg-slate-900 text-white font-semibold border-slate-900'
: 'bg-white text-slate-900 font-semibold border-white'
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

<div className="grid grid-cols-2 gap-2 pt-6 mt-3">
<div>
<div className="flex items-center justify-between mb-1">
<label className={labelClass}>Padding Y</label>
<span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
{s.tabletPaddingY !== undefined ? s.tabletPaddingY : 14}px
</span>
</div>
<input
type="range"
min={4}
max={40}
step={2}
value={s.tabletPaddingY !== undefined ? s.tabletPaddingY : 14}
onChange={(e) => updateStyle('tabletPaddingY', Number(e.target.value))}
className="w-full accent-slate-700 dark:accent-slate-300 cursor-pointer"
/>
</div>
<div>
<div className="flex items-center justify-between mb-1">
<label className={labelClass}>Padding X</label>
<span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
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
className="w-full accent-slate-700 dark:accent-slate-300 cursor-pointer"
/>
</div>
</div>
</div>
)}

{activePopover === 'mobile' &&
renderPopoverPanel(
<>
<div className="flex flex-col gap-1">
<button
type="button"
onClick={() => {
setActivePopover(null);
onSelectElement?.({
sectionId: section.id,
element: {
id: `hamburger-${section.id}`,
type: 'hamburger-button',
label: 'Hamburger Button',
content: 'Mobile Menu Trigger',
styles: {},
},
});
}}
className={`w-full py-2 px-2.5 rounded-lg flex items-center justify-between text-xs font-medium transition-colors cursor-pointer ${
isLight
? 'text-slate-700 hover:bg-slate-100'
: 'text-slate-200 hover:bg-slate-800'
}`}
>
<span>Hamburger Button</span>
<ChevronRight className={`w-3.5 h-3.5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
</button>

<button
type="button"
onClick={() => {
setActivePopover(null);
onSelectElement?.({
sectionId: section.id,
element: {
id: `mobile-menu-${section.id}`,
type: 'mobile-menu-drawer',
label: 'Mobile Menu Drawer',
content: 'Mobile Menu Layout',
styles: {},
},
});
}}
className={`w-full py-2 px-2.5 rounded-lg flex items-center justify-between text-xs font-medium transition-colors cursor-pointer ${
isLight
? 'text-slate-700 hover:bg-slate-100'
: 'text-slate-200 hover:bg-slate-800'
}`}
>
<span>Mobile Drawer</span>
<ChevronRight className={`w-3.5 h-3.5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
</button>
</div>

<div className="space-y-3 text-xs pt-6 mt-3">
{renderHeaderContentVisibility('mobile')}

<div className="grid grid-cols-2 gap-2 pt-6 mt-3">
<div>
<div className="flex items-center justify-between mb-1">
<label className={labelClass}>Padding Y</label>
<span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
{s.mobilePaddingY !== undefined ? s.mobilePaddingY : 12}px
</span>
</div>
<input
type="range"
min={4}
max={32}
step={2}
value={s.mobilePaddingY !== undefined ? s.mobilePaddingY : 12}
onChange={(e) => updateStyle('mobilePaddingY', Number(e.target.value))}
className="w-full accent-slate-700 dark:accent-slate-300 cursor-pointer"
/>
</div>
<div>
<div className="flex items-center justify-between mb-1">
<label className={labelClass}>Padding X</label>
<span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
{s.mobilePaddingX !== undefined ? s.mobilePaddingX : 16}px
</span>
</div>
<input
type="range"
min={4}
max={32}
step={2}
value={s.mobilePaddingX !== undefined ? s.mobilePaddingX : 16}
onChange={(e) => updateStyle('mobilePaddingX', Number(e.target.value))}
className="w-full accent-slate-700 dark:accent-slate-300 cursor-pointer"
/>
</div>
</div>
</div>
</>
)}

<DeleteModal
isOpen={Boolean(layerToDelete)}
title="Delete Header Layer"
itemName={layerToDelete?.label || layerToDelete?.content || (layerToDelete?.type ? `${layerToDelete.type.charAt(0).toUpperCase()}${layerToDelete.type.slice(1)} Block` : 'Layer')}
itemType="header layer"
isLight={isLight}
onCancel={() => setLayerToDelete(null)}
onConfirm={() => {
if (layerToDelete) {
deleteLayer(layerToDelete.id);
setLayerToDelete(null);
}
}}
/>
</>
);
};

const renderActivePopoverContent = () => renderPopovers();

return (
<div
ref={popoverRef}
onClick={(e) => e.stopPropagation()}
className="relative w-full select-none z-[85]"
>
<div
className={`w-full flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 border-t overflow-x-auto no-scrollbar shadow-xs transition-colors ${
isLight
? 'bg-slate-50/95 border-slate-200 text-slate-700'
: 'bg-slate-900/95 border-slate-800 text-slate-200'
}`}
>
<button
type="button"
onClick={(e) => {
e.stopPropagation();
onAddElementToSection?.(section.id);
}}
className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs shrink-0"
title="Add Element to Header"
>
Add Element
</button>

<button
type="button"
onClick={() => setActivePopover(activePopover === 'layers' ? null : 'layers')}
className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-xs shrink-0 ${
activePopover === 'layers'
? isLight ? 'bg-slate-200/80 text-indigo-600 font-bold' : 'bg-slate-800 text-indigo-400 font-bold'
: isLight ? 'hover:bg-slate-200/80 text-slate-700' : 'hover:bg-slate-800 text-slate-200'
}`}
title="Manage Header Layers & Blocks"
>
<span className="font-medium">Layers</span>
</button>

<button
type="button"
onClick={() => setActivePopover(activePopover === 'layout' ? null : 'layout')}
className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-xs shrink-0 ${
activePopover === 'layout'
? isLight ? 'bg-slate-200/80 text-indigo-600 font-bold' : 'bg-slate-800 text-indigo-400 font-bold'
: isLight ? 'hover:bg-slate-200/80 text-slate-700' : 'hover:bg-slate-800 text-slate-200'
}`}
title="Header Layout & Alignment"
>
<span className="font-medium">Layout</span>
</button>

<button
type="button"
onClick={() => setActivePopover(activePopover === 'group' ? null : 'group')}
className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs shrink-0 ${
activePopover === 'group'
? isLight ? 'bg-slate-200/80 text-indigo-600 font-bold' : 'bg-slate-800 text-indigo-400 font-bold'
: isLight ? 'hover:bg-slate-200/80 text-slate-700' : 'hover:bg-slate-800 text-slate-200'
}`}
title="Group / Ungroup Header Elements (⌘G / Ctrl+G)"
>
<span className="font-medium">Group</span>
{selectedGroupElementIds.length > 0 && (
<span className="px-1.5 py-0.2 text-[10px] bg-indigo-600 text-white font-bold rounded-full">
{selectedGroupElementIds.length}
</span>
)}
</button>

<button
type="button"
onClick={() => setActivePopover(activePopover === 'background' ? null : 'background')}
className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-xs shrink-0 ${
activePopover === 'background'
? isLight ? 'bg-slate-200/80 text-indigo-600 font-bold' : 'bg-slate-800 text-indigo-400 font-bold'
: isLight ? 'hover:bg-slate-200/80 text-slate-700' : 'hover:bg-slate-800 text-slate-200'
}`}
title="Header Background"
>
<span className="font-medium">Background</span>
</button>

<button
type="button"
onClick={() => setActivePopover(activePopover === 'border' ? null : 'border')}
className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-xs shrink-0 ${
activePopover === 'border'
? isLight ? 'bg-slate-200/80 text-indigo-600 font-bold' : 'bg-slate-800 text-indigo-400 font-bold'
: isLight ? 'hover:bg-slate-200/80 text-slate-700' : 'hover:bg-slate-800 text-slate-200'
}`}
title="Header Border & Radius"
>
<span className="font-medium">Border</span>
</button>

<button
type="button"
onClick={() => setActivePopover(activePopover === 'shadow' ? null : 'shadow')}
className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-xs shrink-0 ${
activePopover === 'shadow'
? isLight ? 'bg-slate-200/80 text-indigo-600 font-bold' : 'bg-slate-800 text-indigo-400 font-bold'
: isLight ? 'hover:bg-slate-200/80 text-slate-700' : 'hover:bg-slate-800 text-slate-200'
}`}
title="Header Elevation / Shadow"
>
<span className="font-medium">Shadow</span>
</button>

<button
type="button"
onClick={() => setActivePopover(activePopover === 'desktop' ? null : 'desktop')}
className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-xs shrink-0 ${
activePopover === 'desktop'
? isLight ? 'bg-slate-200/80 text-indigo-600 font-bold' : 'bg-slate-800 text-indigo-400 font-bold'
: isLight ? 'hover:bg-slate-200/80 text-slate-700' : 'hover:bg-slate-800 text-slate-200'
}`}
title="On Desktop Settings"
>
<span className="font-medium">On desktop</span>
</button>

<button
type="button"
onClick={() => setActivePopover(activePopover === 'tablet' ? null : 'tablet')}
className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-xs shrink-0 ${
activePopover === 'tablet'
? isLight ? 'bg-slate-200/80 text-indigo-600 font-bold' : 'bg-slate-800 text-indigo-400 font-bold'
: isLight ? 'hover:bg-slate-200/80 text-slate-700' : 'hover:bg-slate-800 text-slate-200'
}`}
title="On Tablet Settings"
>
<span className="font-medium">On tablet</span>
</button>

<button
type="button"
onClick={() => setActivePopover(activePopover === 'mobile' ? null : 'mobile')}
className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-xs shrink-0 ${
activePopover === 'mobile'
? isLight ? 'bg-slate-200/80 text-indigo-600 font-bold' : 'bg-slate-800 text-indigo-400 font-bold'
: isLight ? 'hover:bg-slate-200/80 text-slate-700' : 'hover:bg-slate-800 text-slate-200'
}`}
title="On Mobile Settings"
>
<span className="font-medium">On mobile</span>
</button>

{onClose && (
<button
type="button"
onClick={onClose}
className={`ml-auto px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
isLight ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-slate-800 text-slate-400'
}`}
title="Close Header Toolbar"
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
{renderActivePopoverContent()}
</Popover>

<DeleteModal
isOpen={Boolean(layerToDelete)}
title="Delete Header Layer"
itemName={layerToDelete?.label || layerToDelete?.content || (layerToDelete?.type ? `${layerToDelete.type.charAt(0).toUpperCase()}${layerToDelete.type.slice(1)} Block` : 'Layer')}
itemType="header layer"
isLight={isLight}
onCancel={() => setLayerToDelete(null)}
onConfirm={() => {
if (layerToDelete) {
deleteLayer(layerToDelete.id);
setLayerToDelete(null);
}
}}
/>
</div>
);
};
