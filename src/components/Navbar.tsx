import React, { useState, useEffect, useRef } from 'react';
import {
Monitor,
Tablet,
Smartphone,
Eye,
Undo2,
Redo2,
Download,
Sun,
Moon,
MoreVertical,
Sliders,
ChevronDown,
Check,
Code2,
ArrowLeft,
Trash2,
Tag,
ExternalLink,
FolderGit2,
Loader2,
AlertCircle,
CheckCircle2,
ZoomIn,
ZoomOut,
Plus,
Copy,
FileText,
Settings,
Share2,
FileCode,
ImageIcon,
Globe,
ChevronRight,
Columns,
SlidersHorizontal,
PaintBucket,
Type,
} from 'lucide-react';
import { EditorMode, ViewportMode, WebsitePage, SelectedElementContext, WebsiteElement, WebsiteSection } from '../types';
import { TagCategory } from './SiteSettingsModal';
import { generateFullHtml } from '../utils/htmlGenerator';
import { autoPublishWebsitePage } from '../services/githubService';
import { Toolbar } from './Toolbar';
import { HeaderToolbar } from './canvas/sections/HeaderToolbar';
import { FooterToolbar } from './canvas/sections/FooterToolbar';
import { SectionToolbar } from './canvas/sections/SectionToolbar';
import { PageSettingsTab } from './properties/PropertiesCommon';
import { ScrollArea } from './common';

interface NavbarProps {
currentPage: WebsitePage;
editorMode: EditorMode;
onSetEditorMode: (mode: EditorMode) => void;
viewportMode: ViewportMode;
onSetViewportMode: (vp: ViewportMode) => void;
zoomScale?: number;
onSetZoomScale?: (scale: number) => void;
onZoomIn?: () => void;
onZoomOut?: () => void;
onResetZoom?: () => void;
canUndo: boolean;
canRedo: boolean;
onUndo: () => void;
onRedo: () => void;
onOpenAddSection: () => void;
onOpenExportModal: () => void;
onOpenTagModal?: (category: TagCategory) => void;
onOpenPageOutline?: () => void;
onSelectPageSettings?: (tab?: PageSettingsTab) => void;
onUpdatePageStyles?: (styles: WebsitePage['globalStyles'], title?: string, fileName?: string) => void;
onReset: () => void;
uiTheme: 'dark' | 'light';
onToggleUiTheme: () => void;
pages?: WebsitePage[];
onSelectPage?: (pageId: string) => void;
onDeletePage?: (pageId: string) => void;
onCreatePage?: (newPage: WebsitePage) => void;
onDuplicatePage?: (pageId: string) => void;
onBackToDashboard?: () => void;
selectedContext?: SelectedElementContext | null;
onUpdateElement?: (updatedElement: WebsiteElement) => void;
onDeselectElement?: () => void;
selectedSectionId?: string | null;
onUpdateSection?: (updatedSection: WebsiteSection) => void;
onSelectSection?: (section: WebsiteSection) => void;
onOpenSectionEditBox?: (section: WebsiteSection) => void;
onMoveSection?: (sectionId: string, direction: 'up' | 'down') => void;
onDuplicateSection?: (sectionId: string) => void;
onDeleteSection?: (sectionId: string) => void;
onAddElementToSection?: (sectionId: string) => void;
onSelectElement?: (context: SelectedElementContext) => void;
onDeleteElement?: (elementId: string) => void;
onMoveElement?: (sectionId: string, elementId: string, direction: 'up' | 'down') => void;
onDuplicateElement?: (sectionId: string, elementId: string) => void;
onDeselectSection?: () => void;
}
export const Navbar: React.FC<NavbarProps> = ({
currentPage,
editorMode,
onSetEditorMode,
viewportMode,
onSetViewportMode,
zoomScale = 1,
onSetZoomScale,
onZoomIn,
onZoomOut,
onResetZoom,
canUndo,
canRedo,
onUndo,
onRedo,
onOpenAddSection,
onOpenExportModal,
onOpenTagModal,
onOpenPageOutline,
onSelectPageSettings,
onUpdatePageStyles,
onReset,
uiTheme,
onToggleUiTheme,
pages,
onSelectPage,
onDeletePage,
onCreatePage,
onDuplicatePage,
onBackToDashboard,
selectedContext,
onUpdateElement,
onDeselectElement,
selectedSectionId,
onUpdateSection,
onSelectSection,
onOpenSectionEditBox,
onMoveSection,
onDuplicateSection,
onDeleteSection,
onAddElementToSection,
onSelectElement,
onDeleteElement,
onMoveElement,
onDuplicateElement,
onDeselectSection,
}) => {
const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
const [isInsertDropdownOpen, setIsInsertDropdownOpen] = useState(false);
const [isDeviceMenuOpen, setIsDeviceMenuOpen] = useState(false);
const [isPageDropdownOpen, setIsPageDropdownOpen] = useState(false);
const [isPageSetupDropdownOpen, setIsPageSetupDropdownOpen] = useState(false);
const [isColorExpanded, setIsColorExpanded] = useState(false);
const [isTagsExpanded, setIsTagsExpanded] = useState(false);
const [isTagsDropdownOpen, setIsTagsDropdownOpen] = useState(false);
const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
const [pageToDelete, setPageToDelete] = useState<any | null>(null);

const [isPublishing, setIsPublishing] = useState(false);
const [publishFeedback, setPublishFeedback] = useState<{
type: 'success' | 'error';
message: string;
commitUrl?: string;
repoName?: string;
} | null>(null);

const moreMenuRef = useRef<HTMLDivElement>(null);
const insertMenuRef = useRef<HTMLDivElement>(null);
const deviceMenuRef = useRef<HTMLDivElement>(null);
const pageDropdownRef = useRef<HTMLDivElement>(null);
const pageSetupDropdownRef = useRef<HTMLDivElement>(null);
const pageSetupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
const pageDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
const deviceMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
const tagsMenuRef = useRef<HTMLDivElement>(null);
const modeMenuRef = useRef<HTMLDivElement>(null);
const isLight = uiTheme === 'light';
const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);
useEffect(() => {
const handleResize = () => setWindowWidth(window.innerWidth);
window.addEventListener('resize', handleResize);
return () => window.removeEventListener('resize', handleResize);
}, []);
const isMobileScreen = windowWidth < 768;
const isTabletScreen = windowWidth >= 768 && windowWidth < 1024;
const handleDirectDownload = () => {
const fullHtml = generateFullHtml(currentPage);
const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
const filename = `${(currentPage?.title || 'website').toLowerCase().replace(/[^a-z0-9]/g, '-') || 'index'}.html`;
link.setAttribute('download', filename);
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
URL.revokeObjectURL(url);
};

const handleAutoPublish = async () => {
if (isPublishing) return;
setIsPublishing(true);
setPublishFeedback(null);
try {
const result = await autoPublishWebsitePage(currentPage);
if (result.success) {
setPublishFeedback({
type: 'success',
message: `Published to GitHub! (${result.repoFullName || 'repository'})`,
commitUrl: result.commitUrl || result.contentUrl,
repoName: result.repoFullName,
});
setTimeout(() => {
setPublishFeedback((prev) => (prev?.type === 'success' ? null : prev));
}, 5000);
} else {
setPublishFeedback({
type: 'error',
message: 'Publishing failed. Please check repository permissions.',
});
}
} catch (err: any) {
setPublishFeedback({
type: 'error',
message: err.message || 'Failed to publish to GitHub.',
});
setTimeout(() => {
setPublishFeedback((prev) => (prev?.type === 'error' ? null : prev));
}, 7000);
} finally {
setIsPublishing(false);
}
};
useEffect(() => {
const handleClickOutside = (event: MouseEvent) => {
if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
setIsMoreMenuOpen(false);
}
if (deviceMenuRef.current && !deviceMenuRef.current.contains(event.target as Node)) {
setIsDeviceMenuOpen(false);
}
if (pageDropdownRef.current && !pageDropdownRef.current.contains(event.target as Node)) {
setIsPageDropdownOpen(false);
}
if (pageSetupDropdownRef.current && !pageSetupDropdownRef.current.contains(event.target as Node)) {
setIsPageSetupDropdownOpen(false);
}
if (tagsMenuRef.current && !tagsMenuRef.current.contains(event.target as Node)) {
setIsTagsDropdownOpen(false);
}
if (modeMenuRef.current && !modeMenuRef.current.contains(event.target as Node)) {
setIsModeDropdownOpen(false);
}
};
document.addEventListener('mousedown', handleClickOutside);
return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
const getDeviceLabel = (vp: ViewportMode) => {
switch (vp) {
case 'mobile':
return 'Mobile (390px)';
case 'tablet':
return isTabletScreen ? 'Tablet (100%)' : 'Tablet (768px)';
case 'desktop':
case 'responsive':
default:
return 'Desktop (100%)';
}
};
const getDeviceIcon = (vp: ViewportMode) => {
switch (vp) {
case 'mobile':
return <Smartphone className="w-4 h-4"/>;
case 'tablet':
return <Tablet className="w-4 h-4"/>;
case 'desktop':
case 'responsive':
default:
return <Monitor className="w-4 h-4"/>;
}
};
return (<header className={`sticky top-0 z-[80] backdrop-blur-md border-b select-none transition-colors ${isLight
? 'bg-white/95 border-slate-200 text-slate-800 shadow-sm'
: 'bg-slate-950/95 border-slate-800 text-slate-100 shadow-sm'}`}>
{publishFeedback && (
<div className={`px-4 py-1.5 text-xs font-medium flex items-center justify-between border-b ${
publishFeedback.type === 'success'
? 'bg-emerald-600/90 text-white border-emerald-500/50'
: 'bg-rose-600/90 text-white border-rose-500/50'
}`}>
<div className="flex items-center gap-2 max-w-2xl truncate">
{publishFeedback.type === 'success' ? (
<CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
) : (
<AlertCircle className="w-3.5 h-3.5 shrink-0" />
)}
<span className="truncate">{publishFeedback.message}</span>
</div>
<div className="flex items-center gap-3 shrink-0">
{publishFeedback.commitUrl && (
<a
href={publishFeedback.commitUrl}
target="_blank"
rel="noreferrer"
className="underline flex items-center gap-1 hover:opacity-90 font-semibold text-[11px]"
>
<span>View on GitHub</span>
<ExternalLink className="w-3 h-3" />
</a>
)}
<button
type="button"
onClick={() => setPublishFeedback(null)}
className="p-0.5 hover:bg-black/20 rounded cursor-pointer leading-none text-xs"
aria-label="Dismiss banner"
>
&times;
</button>
</div>
</div>
)}
<div className="px-2.5 sm:px-4 py-2.5 flex items-center justify-between gap-2">
<div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
{onBackToDashboard && (
  <button
    onClick={onBackToDashboard}
    className={`p-2 rounded-lg transition-all cursor-pointer ${
      isLight
        ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/60'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
    }`}
    title="Exit"
    aria-label="Exit"
  >
    <svg
      viewBox="0 0 16 16"
      className="w-4 h-4 fill-current"
      style={{ transform: 'matrix(1, 0, 0, -1, 0, 0) rotate(90deg)' }}
    >
      <g>
        <path fill="currentColor" d="M3 2v2l5 5 5-5v-2l-5 5z" />
        <path fill="currentColor" d="M3 7v2l5 5 5-5v-2l-5 5z" />
      </g>
    </svg>
  </button>
)}

<div className={`flex items-center p-0.5 rounded-lg border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
<button onClick={onUndo} disabled={!canUndo} className={`p-1.5 rounded-md transition-colors cursor-pointer ${canUndo
? isLight
? 'text-slate-700 hover:bg-white'
: 'text-slate-200 hover:bg-slate-800'
: 'text-slate-400/50 cursor-not-allowed'}`} title="Undo (Ctrl+Z)" aria-label="Undo">
<Undo2 className="w-4 h-4"/>
</button>
<button onClick={onRedo} disabled={!canRedo} className={`p-1.5 rounded-md transition-colors cursor-pointer ${canRedo
? isLight
? 'text-slate-700 hover:bg-white'
: 'text-slate-200 hover:bg-slate-800'
: 'text-slate-400/50 cursor-not-allowed'}`} title="Redo (Ctrl+Y)" aria-label="Redo">
<Redo2 className="w-4 h-4"/>
</button>
</div>

<div 
className="relative" 
ref={pageSetupDropdownRef}
onMouseEnter={() => {
if (pageSetupTimeoutRef.current) clearTimeout(pageSetupTimeoutRef.current);
setIsPageSetupDropdownOpen(true);
}}
onMouseLeave={() => {
pageSetupTimeoutRef.current = setTimeout(() => {
setIsPageSetupDropdownOpen(false);
}, 200);
}}
>
<button
type="button"
onClick={() => setIsPageSetupDropdownOpen((prev) => !prev)}
className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-slate-800 text-slate-200'
}`}
title="Page Setup & Global Theme"
aria-label="Page setup"
>
<span>Page setup</span>
<ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform shrink-0 ${isPageSetupDropdownOpen ? 'rotate-180' : ''}`} />
</button>

{isPageSetupDropdownOpen && (
<div
className={`absolute left-0 top-full mt-1.5 w-52 rounded-xl border shadow-2xl p-1.5 z-[100] animate-in fade-in duration-100 ${
isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
}`}
>
<ScrollArea maxHeight="18rem" className="space-y-0.5 pr-0.5">
<button
type="button"
onClick={() => {
onSelectPageSettings?.('details');
setIsPageSetupDropdownOpen(false);
}}
className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
}`}
>
Details
</button>

<div>
<button
type="button"
onClick={(e) => {
e.stopPropagation();
setIsTagsExpanded((prev) => !prev);
}}
className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
}`}
>
<span>Tags</span>
<ChevronDown
className={`w-3.5 h-3.5 opacity-60 transition-transform duration-150 ${
isTagsExpanded ? 'rotate-180' : ''
}`}
/>
</button>

{isTagsExpanded && (
<div className="space-y-0.5 my-0.5">
<button
type="button"
onClick={() => {
onOpenTagModal?.('meta');
setIsPageSetupDropdownOpen(false);
}}
className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
}`}
>
Meta Tags (SEO)
</button>

<button
type="button"
onClick={() => {
onOpenTagModal?.('og');
setIsPageSetupDropdownOpen(false);
}}
className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
}`}
>
Open Graph Tags
</button>

<button
type="button"
onClick={() => {
onOpenTagModal?.('schema');
setIsPageSetupDropdownOpen(false);
}}
className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
}`}
>
JSON-LD Schema
</button>

<button
type="button"
onClick={() => {
onOpenTagModal?.('favicon');
setIsPageSetupDropdownOpen(false);
}}
className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
}`}
>
Favicon & Brand
</button>
</div>
)}
</div>

<button
type="button"
onClick={() => {
onSelectPageSettings?.('layout');
setIsPageSetupDropdownOpen(false);
}}
className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
}`}
>
Layout
</button>

<button
type="button"
onClick={() => {
onSelectPageSettings?.('background');
setIsPageSetupDropdownOpen(false);
}}
className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
}`}
>
Background
</button>

<div>
<button
type="button"
onClick={(e) => {
e.stopPropagation();
setIsColorExpanded((prev) => !prev);
}}
className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
}`}
>
<span>Color</span>
<ChevronDown
className={`w-3.5 h-3.5 opacity-60 transition-transform duration-150 ${
isColorExpanded ? 'rotate-180' : ''
}`}
/>
</button>

{isColorExpanded && (
<div className="space-y-0.5 my-0.5">
<button
type="button"
onClick={() => {
onSelectPageSettings?.('primary-color');
setIsPageSetupDropdownOpen(false);
}}
className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
}`}
>
Accent
</button>

<button
type="button"
onClick={() => {
onSelectPageSettings?.('text-color');
setIsPageSetupDropdownOpen(false);
}}
className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
}`}
>
Default Text
</button>
</div>
)}
</div>

<button
type="button"
onClick={() => {
onSelectPageSettings?.('typography');
setIsPageSetupDropdownOpen(false);
}}
className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
}`}
>
Typography
</button>

<button
type="button"
onClick={() => {
onSelectPageSettings?.('scrollbar');
setIsPageSetupDropdownOpen(false);
}}
className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
}`}
>
Scrollbar
</button>

<button
type="button"
onClick={() => {
onOpenTagModal?.('code');
setIsPageSetupDropdownOpen(false);
}}
className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
}`}
>
Custom Code
</button>
</ScrollArea>
</div>
)}
</div>

</div>

<div className="hidden lg:flex items-center gap-2">
<div 
className="relative" 
ref={pageDropdownRef}
onMouseEnter={() => {
if (pageDropdownTimeoutRef.current) clearTimeout(pageDropdownTimeoutRef.current);
setIsPageDropdownOpen(true);
}}
onMouseLeave={() => {
pageDropdownTimeoutRef.current = setTimeout(() => {
setIsPageDropdownOpen(false);
}, 200);
}}
>
<button
type="button"
onClick={() => setIsPageDropdownOpen((prev) => !prev)}
className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all cursor-pointer hover:border-indigo-500 ${
isLight
? 'bg-slate-100/70 border-slate-200 text-slate-700 hover:bg-slate-100'
: 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-900'
} max-w-[200px] sm:max-w-[240px] xl:max-w-xs min-w-0`}
title={`Page: ${currentPage?.title || 'Home'} - Switch or manage webpages`}
aria-label="Webpage menu"
>
<span className="text-slate-400 text-xs font-normal shrink-0">Page:</span>
<span className="font-semibold text-slate-900 dark:text-slate-100 truncate min-w-0 flex-1 text-left">
{currentPage?.title || 'Home'}
</span>
<ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform shrink-0 ${isPageDropdownOpen ? 'rotate-180' : ''}`} />
</button>

{isPageDropdownOpen && (
<div
className={`absolute left-0 top-full mt-1.5 w-72 rounded-xl border shadow-2xl p-1.5 z-[100] animate-in fade-in duration-100 ${
isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
}`}
>
<ScrollArea maxHeight="16rem" className="space-y-0.5">
{(pages || [currentPage]).map((page) => {
return (
<div
key={page.id}
className={`group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${
isLight
? 'hover:bg-slate-100 text-slate-800'
: 'hover:bg-slate-800 text-slate-200'
}`}
>
<button
type="button"
onClick={() => {
if (onSelectPage && page.id !== currentPage?.id) {
onSelectPage(page.id);
}
setIsPageDropdownOpen(false);
}}
className="flex items-center gap-2 flex-1 min-w-0 text-left cursor-pointer text-slate-800 dark:text-slate-200"
>
<span className="truncate">{page.title || 'Untitled'}</span>
</button>

<div className="flex items-center gap-1 shrink-0 ml-1">
{onDuplicatePage && (
<button
type="button"
onClick={(e) => {
e.stopPropagation();
onDuplicatePage(page.id);
setIsPageDropdownOpen(false);
}}
className="p-1 rounded hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
title="Duplicate page"
>
<Copy className="w-3 h-3" />
</button>
)}

{onDeletePage && (
<button
type="button"
onClick={(e) => {
e.stopPropagation();
setPageToDelete(page);
}}
className="p-1 rounded hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 cursor-pointer transition-colors"
title="Delete page"
>
<Trash2 className="w-3 h-3" />
</button>
)}
</div>
</div>
);
})}
</ScrollArea>

{onCreatePage && (
<div className="pt-1 mt-1 border-t border-slate-200/60 dark:border-slate-800/80">
<button
type="button"
onClick={() => {
const count = (pages?.length || 1) + 1;
const title = `Page ${count}`;
const newPage: WebsitePage = {
id: `page-${Date.now().toString(36)}`,
title,
fileName: `page-${count}.html`,
globalStyles: { ...(currentPage?.globalStyles || {}) },
siteSettings: {
title,
description: `Custom webpage for ${title}.`,
},
sections: JSON.parse(JSON.stringify(currentPage?.sections || [])),
};
onCreatePage(newPage);
setIsPageDropdownOpen(false);
}}
className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
isLight
? 'hover:bg-slate-100 text-slate-700'
: 'hover:bg-slate-800 text-slate-300'
}`}
>
<Plus className="w-3.5 h-3.5 text-slate-400" />
<span>Add Webpage</span>
</button>
</div>
)}
</div>
)}
</div>
</div>

<div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
{!isMobileScreen && (
<div 
  className="hidden md:block relative" 
  ref={deviceMenuRef}
  onMouseEnter={() => {
    if (deviceMenuTimeoutRef.current) clearTimeout(deviceMenuTimeoutRef.current);
    setIsDeviceMenuOpen(true);
  }}
  onMouseLeave={() => {
    deviceMenuTimeoutRef.current = setTimeout(() => {
      setIsDeviceMenuOpen(false);
    }, 200);
  }}
>
<button
  type="button"
  onClick={() => setIsDeviceMenuOpen((prev) => !prev)}
  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
    isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-slate-800 text-slate-200'
  }`}
  title={`Device Viewport: ${getDeviceLabel(viewportMode)}`}
  aria-label="Select viewport device mode"
>
  {getDeviceIcon(viewportMode)}
  <span className="hidden lg:inline text-xs">{getDeviceLabel(viewportMode)}</span>
  <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform shrink-0 ${isDeviceMenuOpen ? 'rotate-180' : ''}`} />
</button>

{isDeviceMenuOpen && (
<div className={`absolute right-0 top-full mt-1.5 w-52 rounded-xl border shadow-2xl p-1.5 z-[100] animate-in fade-in duration-100 ${
  isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
}`}>
  <ScrollArea maxHeight="18rem" className="space-y-0.5 pr-0.5">
    {!isTabletScreen && (
      <button
        type="button"
        onClick={() => {
          onSetViewportMode('desktop');
          setIsDeviceMenuOpen(false);
        }}
        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
          viewportMode === 'desktop' || viewportMode === 'responsive'
            ? 'bg-indigo-600/10 text-indigo-500 font-medium'
            : isLight
            ? 'hover:bg-slate-100 text-slate-700'
            : 'hover:bg-slate-800 text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4"/>
          <span>Desktop (100%)</span>
        </div>
        {(viewportMode === 'desktop' || viewportMode === 'responsive') && <Check className="w-3.5 h-3.5"/>}
      </button>
    )}

    <button
      type="button"
      onClick={() => {
        onSetViewportMode('tablet');
        setIsDeviceMenuOpen(false);
      }}
      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
        viewportMode === 'tablet'
          ? 'bg-indigo-600/10 text-indigo-500 font-medium'
          : isLight
          ? 'hover:bg-slate-100 text-slate-700'
          : 'hover:bg-slate-800 text-slate-300'
      }`}
    >
      <div className="flex items-center gap-2">
        <Tablet className="w-4 h-4"/>
        <span>{isTabletScreen ? 'Tablet (100%)' : 'Tablet (768px)'}</span>
      </div>
      {viewportMode === 'tablet' && <Check className="w-3.5 h-3.5"/>}
    </button>

    <button
      type="button"
      onClick={() => {
        onSetViewportMode('mobile');
        setIsDeviceMenuOpen(false);
      }}
      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
        viewportMode === 'mobile'
          ? 'bg-indigo-600/10 text-indigo-500 font-medium'
          : isLight
          ? 'hover:bg-slate-100 text-slate-700'
          : 'hover:bg-slate-800 text-slate-300'
      }`}
    >
      <div className="flex items-center gap-2">
        <Smartphone className="w-4 h-4"/>
        <span>Mobile (390px)</span>
      </div>
      {viewportMode === 'mobile' && <Check className="w-3.5 h-3.5"/>}
    </button>
  </ScrollArea>
</div>
)}
</div>
)}

<button onClick={() => {
const html = generateFullHtml(currentPage);
const blob = new Blob([html], { type: 'text/html' });
const url = URL.createObjectURL(blob);
window.open(url, '_blank');
}} className={`hidden sm:flex p-2 rounded-lg transition-colors cursor-pointer ${isLight
? 'text-slate-700 hover:bg-slate-100'
: 'text-slate-200 hover:bg-slate-800'}`} title="Preview HTML Website in New Tab" aria-label="Preview HTML Website in New Tab">
<Eye className="w-4 h-4"/>
</button>

<button
onClick={handleAutoPublish}
disabled={isPublishing}
className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed ${
publishFeedback?.type === 'success'
? 'bg-emerald-600 hover:bg-emerald-500 text-white'
: publishFeedback?.type === 'error'
? 'bg-rose-600 hover:bg-rose-500 text-white'
: 'bg-indigo-600 hover:bg-indigo-500 text-white'
}`}
title="Publish"
aria-label="Publish"
>

{isPublishing ? (
<Loader2 className="w-4 h-4 animate-spin" />
) : publishFeedback?.type === 'success' ? (
<Check className="w-4 h-4" />
) : publishFeedback?.type === 'error' ? (
<AlertCircle className="w-4 h-4" />
) : (
<FolderGit2 className="w-4 h-4" />
)}
<span className="hidden sm:inline">
{isPublishing
? 'Publishing...'
: publishFeedback?.type === 'success'
? 'Published!'
: publishFeedback?.type === 'error'
? 'Retry Publish'
: 'Publish'}
</span>
</button>

<button
type="button"
onClick={(e) => {
e.stopPropagation();
onToggleUiTheme();
}}
className={`hidden lg:flex p-2 rounded-lg transition-colors cursor-pointer select-none active:scale-95 ${isLight
? 'text-slate-700 hover:bg-slate-100'
: 'text-slate-200 hover:bg-slate-800'}`}
title={isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
aria-label={isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
>
{isLight ? <Moon className="w-4 h-4"/> : <Sun className="w-4 h-4"/>}
</button>

<div className="relative" ref={moreMenuRef}>
<button onClick={() => setIsMoreMenuOpen((prev) => !prev)} className={`p-2 rounded-lg transition-colors cursor-pointer ${isLight
? 'text-slate-700 hover:bg-slate-100'
: 'text-slate-300 hover:bg-slate-800'}`} title="More Options" aria-label="More Options">
<MoreVertical className="w-4 h-4"/>
</button>

{isMoreMenuOpen && (<div className={`absolute right-0 mt-1.5 w-auto min-w-[210px] whitespace-nowrap rounded-xl border shadow-2xl p-1 z-[90] animate-in fade-in duration-100 ${isLight
? 'bg-white border-slate-200 text-slate-800'
: 'bg-slate-900 border-slate-800 text-slate-200'}`}>
<button type="button" onClick={() => {
handleDirectDownload();
setIsMoreMenuOpen(false);
}} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-200'}`}>
<Download className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0"/>
<span>Export HTML Website</span>
</button>

<button type="button" onClick={() => {
onOpenExportModal();
setIsMoreMenuOpen(false);
}} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-200'}`}>
<Code2 className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0"/>
<span>Export / View Code</span>
</button>

<div className={`my-1 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}/>

<button type="button" onClick={() => {
const html = generateFullHtml(currentPage);
const blob = new Blob([html], { type: 'text/html' });
const url = URL.createObjectURL(blob);
window.open(url, '_blank');
setIsMoreMenuOpen(false);
}} className={`sm:hidden w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-200'}`}>
<ExternalLink className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0"/>
<span>Preview in New Tab</span>
</button>

<button type="button" onClick={(e) => {
e.stopPropagation();
onToggleUiTheme();
setIsMoreMenuOpen(false);
}} className={`lg:hidden w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-200'}`}>
{isLight ? (<>
<Moon className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0"/>
<span>Switch to Dark Theme</span>
</>) : (<>
<Sun className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0"/>
<span>Switch to Light Theme</span>
</>)}
</button>
</div>)}
</div>
</div>
</div>

{selectedContext?.element && onUpdateElement ? (
<Toolbar
selectedContext={selectedContext}
onUpdateElement={onUpdateElement}
onClose={onDeselectElement}
uiTheme={uiTheme}
onUpdateSection={onUpdateSection}
currentSection={currentPage.sections?.find((s) => s.id === selectedContext.sectionId)}
/>
) : (() => {
const selectedSection = currentPage.sections?.find((s) => s.id === selectedSectionId);
if (selectedSection && selectedSection.type === 'header' && editorMode === 'edit') {
return (
<HeaderToolbar
section={selectedSection}
isSectionSelected={true}
isSectionHovered={false}
selectedContext={selectedContext}
editorMode={editorMode}
uiTheme={uiTheme}
viewportMode={viewportMode}
variant="top-bar"
onClose={onDeselectSection}
onUpdateSection={onUpdateSection}
onSelectSection={onSelectSection}
onOpenSectionEditBox={onOpenSectionEditBox}
onAddElementToSection={onAddElementToSection}
onSelectElement={onSelectElement}
onDeleteSection={onDeleteSection}
onDeleteElement={onDeleteElement}
onMoveElement={onMoveElement}
onDuplicateElement={onDuplicateElement}
/>
);
}
if (selectedSection && selectedSection.type === 'footer' && editorMode === 'edit') {
return (
<FooterToolbar
section={selectedSection}
isSectionSelected={true}
isSectionHovered={false}
selectedContext={selectedContext}
editorMode={editorMode}
uiTheme={uiTheme}
viewportMode={viewportMode}
variant="top-bar"
onClose={onDeselectSection}
onOpenSectionEditBox={onOpenSectionEditBox}
onSelectSection={onSelectSection}
onUpdateSection={onUpdateSection}
onMoveSection={onMoveSection}
onAddElementToSection={onAddElementToSection}
onDuplicateSection={onDuplicateSection}
onDeleteSection={onDeleteSection}
/>
);
}
if (selectedSection && editorMode === 'edit') {
return (
<SectionToolbar
section={selectedSection}
isSectionSelected={true}
isSectionHovered={false}
selectedContext={selectedContext}
editorMode={editorMode}
uiTheme={uiTheme}
variant="top-bar"
onClose={onDeselectSection}
onOpenSectionEditBox={onOpenSectionEditBox}
onSelectSection={onSelectSection}
onUpdateSection={onUpdateSection}
onMoveSection={onMoveSection || (() => {})}
onAddElementToSection={onAddElementToSection || (() => {})}
onDuplicateSection={onDuplicateSection || (() => {})}
onDeleteSection={onDeleteSection || (() => {})}
slideshowIndex={0}
setSlideshowIndex={() => {}}
handleSectionMouseEnter={() => {}}
handleSectionMouseLeave={() => {}}
/>
);
}
return null;
})()}

{pageToDelete && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
<div className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150 text-left ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'}`}>
<div className="flex items-center gap-3 border-b border-slate-700/30 pb-3">
<div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg shrink-0">
<Trash2 className="w-5 h-5"/>
</div>
<div>
<h3 className="text-sm font-bold">Delete Webpage</h3>
<p className="text-[10px] text-slate-400">This action is permanent and cannot be undone.</p>
</div>
</div>

<p className="text-xs">
Are you sure you want to delete <span className="font-bold">"{pageToDelete.title}"</span>? All content sections on this page will be permanently removed.
</p>

<div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/30">
<button type="button" onClick={() => setPageToDelete(null)} className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>
Cancel
</button>
<button type="button" onClick={() => {
if (onDeletePage) {
onDeletePage(pageToDelete.id);
}
if (currentPage.id === pageToDelete.id && pages && pages.length === 1) {
setIsPageDropdownOpen(false);
}
setPageToDelete(null);
}} className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer shadow-md transition-all">
Yes, Delete Page
</button>
</div>
</div>
</div>)}
</header>);
};
