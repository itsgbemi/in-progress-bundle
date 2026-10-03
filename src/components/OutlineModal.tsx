import React, { useState } from 'react';
import { WebsiteSection, WebsiteElement } from '../types';
import {
X,
Layers,
ChevronUp,
ChevronDown,
Eye,
EyeOff,
Lock,
Compass,
Sparkles,
Layout,
MessageSquare,
DollarSign,
Users,
Image as ImageIcon,
Video,
FileText,
Table,
} from 'lucide-react';

interface OutlineModalProps {
sections: WebsiteSection[];
onClose: () => void;
onMoveSection: (sectionId: string, direction: 'up' | 'down') => void;
onToggleHideSection: (sectionId: string) => void;
onSelectSection: (sectionId: string) => void;
onSelectElement?: (sectionId: string, element: WebsiteElement) => void;
uiTheme: 'dark' | 'light';
}

export const OutlineModal: React.FC<OutlineModalProps> = ({
sections,
onClose,
onMoveSection,
onToggleHideSection,
onSelectSection,
onSelectElement,
uiTheme,
}) => {
const isLight = uiTheme === 'light';

const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
const initial: Record<string, boolean> = {};
sections.forEach((sec, idx) => {
initial[sec.id] = idx === 0;
});
return initial;
});

const [openMobileMenuContent, setOpenMobileMenuContent] = useState<Record<string, boolean>>({});

const toggleSectionOpen = (secId: string) => {
setOpenSections(prev => ({ ...prev, [secId]: !prev[secId] }));
};

const toggleMobileMenuContent = (secId: string) => {
setOpenMobileMenuContent(prev => ({ ...prev, [secId]: !prev[secId] }));
};

const getSectionIcon = (type: string) => {
switch (type) {
case 'header':
return <Compass className="w-4 h-4 text-indigo-400" />;
case 'hero':
return <Sparkles className="w-4 h-4 text-amber-400" />;
case 'features':
return <Layout className="w-4 h-4 text-sky-400" />;
case 'testimonials':
return <MessageSquare className="w-4 h-4 text-emerald-400" />;
case 'pricing':
return <DollarSign className="w-4 h-4 text-teal-400" />;
case 'team':
return <Users className="w-4 h-4 text-purple-400" />;
case 'gallery':
case 'image':
case 'image-text':
return <ImageIcon className="w-4 h-4 text-pink-400" />;
case 'video':
case 'video-text':
return <Video className="w-4 h-4 text-rose-400" />;
case 'table':
return <Table className="w-4 h-4 text-orange-400" />;
case 'text':
return <FileText className="w-4 h-4 text-blue-400" />;
case 'footer':
return <Compass className="w-4 h-4 text-slate-400" />;
default:
return <Layers className="w-4 h-4 text-indigo-400" />;
}
};

return (
<div className="fixed inset-0 z-[100] flex justify-center items-end sm:items-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
<div
className={`w-full max-w-lg rounded-t-2xl sm:rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] ${
isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
}`}
>
<div
className={`flex items-center justify-between px-5 py-4 border-b ${
isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
}`}
>
<div>
<h2 className="text-base font-bold">Page Content Outline</h2>
</div>

<button
onClick={onClose}
className={`p-2 rounded-xl transition-colors ${
isLight ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-slate-800 text-slate-400'
}`}
title="Close outline"
>
<X className="w-5 h-5" />
</button>
</div>

<div className="flex-1 overflow-y-auto p-4 space-y-2">
{sections.map((section, index) => {
const isHeader = section.type === 'header';
const isHero = section.type === 'hero';
const isFooter = section.type === 'footer';
const isPinned = isHeader || isFooter;

const prevSection = index > 0 ? sections[index - 1] : null;
const nextSection = index < sections.length - 1 ? sections[index + 1] : null;

const canMoveUp = !isPinned && prevSection && prevSection.type !== 'header';
const canMoveDown = !isPinned && nextSection && nextSection.type !== 'footer';

const isOpen = openSections[section.id] ?? (index === 0);
const isMobileMenuOpenForHeader = openMobileMenuContent[section.id] ?? true;

return (
<div
key={section.id}
className={`p-3 rounded-xl border transition-all ${
section.hidden
? isLight
? 'bg-slate-100/70 border-slate-200 opacity-60'
: 'bg-slate-950/40 border-slate-800 opacity-50'
: isLight
? 'bg-white border-slate-200 hover:border-indigo-300 shadow-xs'
: 'bg-slate-800/60 border-slate-700/70 hover:border-indigo-500/60 shadow-xs'
}`}
>
<div className="flex items-center justify-between">
<div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
<button
type="button"
onClick={() => toggleSectionOpen(section.id)}
className={`p-1 rounded-lg transition-colors ${
isLight ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-slate-700 text-slate-300'
}`}
title={isOpen ? 'Collapse Section' : 'Expand Section'}
>
{isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4 rotate-180" />}
</button>

<button
type="button"
onClick={() => {
onSelectSection(section.id);
onClose();
}}
className="flex items-center gap-3 text-left flex-1 min-w-0 group"
>
<div className="min-w-0">
<div className="flex items-center gap-2">
<span className="font-semibold text-xs truncate group-hover:text-indigo-500 transition-colors">
{section.title || `${section.type} Section`}
</span>
{isPinned && (
<span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-500/10 text-slate-400">
<Lock className="w-2.5 h-2.5" />
Fixed
</span>
)}
{section.hidden && (
<span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-500">
Hidden
</span>
)}
</div>
<span className="text-[11px] text-slate-500 capitalize">
{section.type} • {section.elements.length} element{section.elements.length !== 1 ? 's' : ''}
</span>
</div>
</button>
</div>

<div className="flex items-center gap-1 shrink-0">
{!isPinned ? (
<>
<button
onClick={() => onMoveSection(section.id, 'up')}
disabled={!canMoveUp}
className={`p-1.5 rounded-lg border transition-colors ${
canMoveUp
? isLight
? 'border-slate-200 text-slate-700 hover:bg-slate-100'
: 'border-slate-700 text-slate-200 hover:bg-slate-700'
: 'border-transparent text-slate-400/40 cursor-not-allowed'
}`}
title="Move Up"
>
<ChevronUp className="w-4 h-4" />
</button>

<button
onClick={() => onMoveSection(section.id, 'down')}
disabled={!canMoveDown}
className={`p-1.5 rounded-lg border transition-colors ${
canMoveDown
? isLight
? 'border-slate-200 text-slate-700 hover:bg-slate-100'
: 'border-slate-700 text-slate-200 hover:bg-slate-700'
: 'border-transparent text-slate-400/40 cursor-not-allowed'
}`}
title="Move Down"
>
<ChevronDown className="w-4 h-4" />
</button>
</>
) : null}

<button
onClick={() => onToggleHideSection(section.id)}
className={`p-1.5 rounded-lg border transition-colors ${
section.hidden
? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
: isLight
? 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
: 'border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
}`}
title={section.hidden ? 'Show Section on Page' : 'Hide Section from Page'}
>
{section.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
</button>
</div>
</div>

{isOpen && section.elements && section.elements.length > 0 && (
<div className="mt-2.5 pt-2 border-t border-slate-700/30 space-y-1">
<div className="flex items-center justify-between">
<div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
Elements:
</div>
</div>
{section.elements.map((el) => (
<button
key={el.id}
type="button"
onClick={(e) => {
e.stopPropagation();
onSelectElement?.(section.id, el);
onClose();
}}
className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800/80 text-slate-300'
}`}
>
<span className="text-[11px] truncate flex items-center gap-1.5">
<span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
{el.label || el.type}: {el.content || el.type}
</span>
<span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 capitalize">
{el.type}
</span>
</button>
))}
{isHeader && (
<>
<button
type="button"
onClick={(e) => {
e.stopPropagation();
onSelectElement?.(section.id, {
id: 'hamburger-button',
type: 'hamburger-button',
label: 'Hamburger Button',
content: 'Mobile Menu Trigger',
styles: {}
} as any);
onClose();
}}
className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800/80 text-slate-300'
}`}
>
<span className="text-[11px] truncate flex items-center gap-1.5">
<Lock className="w-2.5 h-2.5 text-slate-400" />
Hamburger Button
</span>
<span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-500/10 text-slate-400 capitalize">
Fixed
</span>
</button>
<button
type="button"
onClick={(e) => {
e.stopPropagation();
onSelectElement?.(section.id, {
id: 'mobile-menu-drawer',
type: 'mobile-menu-drawer',
label: 'Mobile Menu Drawer',
content: 'Mobile Menu Layout',
styles: {}
} as any);
onClose();
}}
className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800/80 text-slate-300'
}`}
>
<span className="text-[11px] truncate flex items-center gap-1.5">
<Lock className="w-2.5 h-2.5 text-slate-400" />
Mobile Menu Drawer
</span>
<span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-500/10 text-slate-400 capitalize">
Fixed
</span>
</button>
</>
)}
</div>
)}
</div>
);
})}
</div>

<div
className={`px-5 py-3 border-t flex items-center justify-end ${
isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
}`}
>
<button
onClick={onClose}
className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
>
Done
</button>
</div>
</div>
</div>
);
};
