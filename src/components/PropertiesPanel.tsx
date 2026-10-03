import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ArrowLeft, GripVertical } from 'lucide-react';
import {
SelectedElementContext,
WebsiteElement,
WebsiteSection,
WebsitePage,
ViewportMode,
} from '../types';
import { SubHeaderState, PageSettingsTab } from './properties/PropertiesCommon';

import { CardProperties } from './properties/CardProperties';
import { ButtonProperties } from './properties/ButtonProperties';
import { LinkProperties } from './properties/LinkProperties';
import { LogoProperties } from './properties/LogoProperties';
import { VideoProperties } from './properties/VideoProperties';
import { TableProperties } from './properties/TableProperties';
import { IconProperties } from './properties/IconProperties';
import { FormProperties } from './properties/FormProperties';
import { ModalProperties } from './properties/ModalProperties';
import { MapProperties } from './properties/MapProperties';
import { MediaProperties } from './properties/MediaProperties';
import { DividerProperties } from './properties/DividerProperties';
import { ListProperties } from './properties/ListProperties';
import { AccordionProperties } from './properties/AccordionProperties';
import { HeaderProperties } from './properties/HeaderProperties';
import { FooterProperties } from './properties/FooterProperties';
import { SectionProperties } from './properties/SectionProperties';
import { PageProperties } from './properties/PageProperties';
import { HamburgerProperties } from './properties/HamburgerProperties';
import { MobileMenuProperties } from './properties/MobileMenuProperties';
import { SubmenuProperties } from './properties/SubmenuProperties';
import { InlineProperties } from './properties/InlineProperties';
import { GridProperties } from './properties/GridProperties';
import { ScrollArea } from './common/ScrollArea';

interface PropertiesPanelProps {
selectedContext: SelectedElementContext | null;
selectedSection: WebsiteSection | null;
isPageSelected?: boolean;
page?: WebsitePage;
onSelectContext?: (context: SelectedElementContext | null) => void;
onUpdateElement: (updatedElement: WebsiteElement) => void;
onDeleteElement: (elementId: string) => void;
onMoveElement?: (sectionId: string, elementId: string, direction: 'up' | 'down') => void;
onDuplicateElement?: (sectionId: string, elementId: string) => void;
onUpdateSection?: (updatedSection: WebsiteSection) => void;
onDeleteSection?: (sectionId: string) => void;
onUpdatePageStyles?: (styles: WebsitePage['globalStyles'], title?: string, fileName?: string) => void;
onOpenSiteSettings?: () => void;
onClose: () => void;
viewportMode: ViewportMode;
uiTheme?: 'dark' | 'light';
pageSettingsTab?: PageSettingsTab;
onSelectPageSettingsTab?: (tab: PageSettingsTab) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
selectedContext,
selectedSection,
isPageSelected = false,
page,
onSelectContext,
onUpdateElement,
onDeleteElement,
onMoveElement,
onDuplicateElement,
onUpdateSection,
onDeleteSection,
onUpdatePageStyles,
onOpenSiteSettings,
onClose,
viewportMode,
uiTheme = 'dark',
pageSettingsTab = 'all',
onSelectPageSettingsTab,
}) => {
const [isWindowMobile, setIsWindowMobile] = useState<boolean>(
typeof window !== 'undefined' ? window.innerWidth < 768 : false
);

const [drawerHeight, setDrawerHeight] = useState<number>(() =>
typeof window !== 'undefined' ? Math.min(Math.round(window.innerHeight * 0.55), 480) : 480
);
const startYRef = useRef<number>(0);
const startHeightRef = useRef<number>(drawerHeight);
const isDraggingDrawerRef = useRef<boolean>(false);

useEffect(() => {
const handleResize = () => {
setIsWindowMobile(window.innerWidth < 768);
};
window.addEventListener('resize', handleResize);
return () => window.removeEventListener('resize', handleResize);
}, []);

useEffect(() => {
const handleTouchMove = (e: TouchEvent) => {
if (!isDraggingDrawerRef.current || !e.touches || e.touches.length === 0) return;
const currentY = e.touches[0].clientY;
const deltaY = currentY - startYRef.current;
const targetHeight = startHeightRef.current - deltaY;
const minH = 160;
const maxH = typeof window !== 'undefined' ? Math.round(window.innerHeight * 0.88) : 700;
setDrawerHeight(Math.max(minH, Math.min(maxH, targetHeight)));
};
const handleTouchEnd = () => {
if (isDraggingDrawerRef.current) isDraggingDrawerRef.current = false;
};
const handleMouseMove = (e: MouseEvent) => {
if (!isDraggingDrawerRef.current) return;
const deltaY = e.clientY - startYRef.current;
const targetHeight = startHeightRef.current - deltaY;
const minH = 160;
const maxH = typeof window !== 'undefined' ? Math.round(window.innerHeight * 0.88) : 700;
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

const [subHeaderState, setSubHeaderState] = useState<SubHeaderState | null>(null);

useEffect(() => {
setSubHeaderState(null);
}, [selectedContext?.element?.id, selectedSection?.id, isPageSelected]);

const handleStartDrawerDrag = (clientY: number) => {
isDraggingDrawerRef.current = true;
startYRef.current = clientY;
startHeightRef.current = drawerHeight;
};

if (!selectedContext && !selectedSection && !isPageSelected) return null;

const isLight = uiTheme === 'light';
const isMobileView = isWindowMobile;

const isTextElement = Boolean(
selectedContext?.element &&
(selectedContext.element.type === 'heading' || selectedContext.element.type === 'text')
);

let floatStyle: React.CSSProperties = {};
if (!isMobileView) {
const popoverWidth = 390;
let left = selectedContext?.rect ? selectedContext.rect.right + 16 : window.innerWidth - popoverWidth - 24;
if (viewportMode === 'mobile' || viewportMode === 'tablet') {
left = Math.max(16, window.innerWidth - popoverWidth - 24);
} else {
if (left + popoverWidth > window.innerWidth - 16) {
left = selectedContext?.rect ? selectedContext.rect.left - popoverWidth - 16 : window.innerWidth - popoverWidth - 24;
}
if (left < 16) {
left = Math.max(16, Math.min(window.innerWidth - popoverWidth - 16, selectedContext?.rect ? selectedContext.rect.left : 24));
}
}
let top = selectedContext?.rect ? selectedContext.rect.top : 80;
top = Math.max(70, Math.min(window.innerHeight - 560, top));
floatStyle = {
position: 'fixed',
top: `${top}px`,
left: `${left}px`,
width: `${popoverWidth}px`,
zIndex: 70,
};
}

const renderHeader = () => {
if (subHeaderState) {
return (
<div
className={`flex items-center justify-between px-4 py-3 border-b ${
isLight ? 'border-slate-200/80 bg-transparent' : 'border-slate-800/80 bg-transparent'
}`}
>
<button
type="button"
onClick={subHeaderState.onBack}
className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
isLight
? 'hover:bg-slate-100 text-slate-800 hover:text-slate-600'
: 'hover:bg-slate-800 text-slate-100 hover:text-slate-300'
}`}
title="Back"
aria-label="Back"
>
<ArrowLeft className="w-4 h-4" />
</button>

<div className="flex items-center justify-center flex-1 px-2 select-none cursor-grab active:cursor-grabbing gap-1.5" title="Drag to move inspector box">
<GripVertical className="w-3.5 h-3.5 text-slate-400 shrink-0" />
<span className="font-semibold text-xs truncate text-slate-800 dark:text-slate-100">
{subHeaderState.tabName}
</span>
</div>

<button
type="button"
onClick={onClose}
className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
isLight
? 'hover:bg-slate-100 text-slate-800 hover:text-slate-600'
: 'hover:bg-slate-800 text-slate-100 hover:text-slate-300'
}`}
title="Close Inspector"
aria-label="Close Inspector"
>
<X className="w-4 h-4" strokeWidth={1.5} />
</button>
</div>
);
}

let title = 'Inspector';
if (isPageSelected) {
if (pageSettingsTab === 'details') title = 'Page Details';
else if (pageSettingsTab === 'layout') title = 'Layout';
else if (pageSettingsTab === 'spacing') title = 'Page Spacing';
else if (pageSettingsTab === 'background') title = 'Page Background';
else if (pageSettingsTab === 'typography') title = 'Page Typography';
else if (pageSettingsTab === 'primary-color') title = 'Accent Color';
else if (pageSettingsTab === 'text-color') title = 'Default Text Color';
else if (pageSettingsTab === 'colors') title = 'Page Colors';
else if (pageSettingsTab === 'scrollbar') title = 'Custom Scrollbar';
else title = 'Page Settings & Theme';
} else if (selectedContext?.element) {
const type = selectedContext.element.type;
if (type === 'heading') title = 'Heading';
else if (type === 'text') title = 'Text';
else if (type === 'button') title = 'Button';
else if (type === 'image') title = 'Image';
else if (type === 'video') title = 'Video';
else if (type === 'icon') title = 'Icon';
else if (type === 'card') title = 'Card';
else if (type === 'grid') title = 'Grid';
else if (type === 'inline') title = 'Inline';
else if (type === 'hamburger-button') title = 'Hamburger Menu';
else if (type === 'mobile-menu-drawer') title = 'Mobile Menu';
else if (selectedContext.subItemPart === 'title') title = 'Accordion Heading';
else if (selectedContext.subItemPart === 'content') title = 'Accordion Content';
else if (type === 'accordion') title = 'Accordion';
else if (type === 'table') {
if (selectedContext.tablePart === 'cell') title = 'Cell';
else if (selectedContext.tablePart === 'cell-text') title = 'Text';
else if (selectedContext.tablePart === 'header' || selectedContext.tablePart === 'header-cell') title = 'Table Header';
else title = 'Table';
}
else if (type === 'form') title = 'Form';
else if (type.startsWith('form-')) title = 'Form Field';
else if (type === 'list') title = 'List';
else if (type === 'modal') title = 'Modal';
else if (type === 'map') title = 'Map';
else if (type === 'mixed-media') title = 'Mixed Media';
else if (type === 'divider') title = 'Divider';
else if (type === 'badge') title = 'Badge';
else if (type === 'nav-link') title = 'Link';
else if (type === 'cta-container') title = 'Call to Action';
else if (type === 'submenu') title = 'Submenu';
else {
title = type.charAt(0).toUpperCase() + type.slice(1);
}
} else if (selectedSection) {
if (selectedSection.type === 'header') title = 'Header';
else if (selectedSection.type === 'footer') title = 'Footer';
else {
const cleanTitle = (selectedSection.title || selectedSection.type)
.replace(/^section:\s*/i, '')
.replace(/\s*(split|grid)?\s*section$/i, '')
.trim();
const words = (cleanTitle || 'Section').split(/\s+/);
title = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}
}

const isFixedHeaderChild =
selectedContext?.element &&
(selectedContext.element.type === 'hamburger-button' ||
selectedContext.element.type === 'mobile-menu-drawer');

return (
<div
className={`flex items-center justify-between px-4 py-3 border-b ${
isLight ? 'border-slate-200/80 bg-transparent' : 'border-slate-800/80 bg-transparent'
}`}
>
<div className="flex items-center gap-1.5 cursor-grab active:cursor-grabbing flex-1 select-none" title="Drag to move inspector box">
<GripVertical className="w-3.5 h-3.5 text-slate-400 shrink-0" />
<span className="font-semibold text-xs text-slate-800 dark:text-slate-100">{title}</span>
</div>
<div className="flex items-center gap-1.5">
{selectedContext?.element && !isFixedHeaderChild && (
<button
type="button"
onClick={() => {
if (selectedContext.element.type === 'form' && (selectedContext.formFieldId || selectedContext.formFieldIndex !== undefined || selectedContext.subItemPart === 'form-field' || selectedContext.formPart === 'field')) {
const fields = selectedContext.element.formFields || [];
const activeIdx = selectedContext.formFieldIndex !== undefined
? selectedContext.formFieldIndex
: selectedContext.formFieldId
? fields.findIndex((f) => f.id === selectedContext.formFieldId)
: selectedContext.subItemIndex ?? 0;

if (activeIdx >= 0 && fields.length > 1) {
const newFields = fields.filter((_, i) => i !== activeIdx);
onUpdateElement({
...selectedContext.element,
formFields: newFields,
});
onSelectContext?.({
...selectedContext,
formFieldId: undefined,
formFieldIndex: undefined,
subItemPart: undefined,
subItemIndex: undefined,
formPart: 'container',
});
return;
}
}

if (selectedContext.subItemPart && selectedContext.element.type === 'accordion') {
const idx = selectedContext.subItemIndex ?? 0;
const items = selectedContext.element.accordionItems || [];
if (items.length > 1) {
const newItems = items.filter((_, i) => i !== idx);
onUpdateElement({
...selectedContext.element,
accordionItems: newItems,
});
onSelectContext?.({
...selectedContext,
subItemPart: undefined,
subItemIndex: undefined,
});
} else {
onDeleteElement(selectedContext.element.id);
}
} else {
onDeleteElement(selectedContext.element.id);
}
}}
className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
title={
selectedContext.element.type === 'form' && (selectedContext.formFieldId || selectedContext.subItemPart === 'form-field')
? 'Delete Form Field'
: selectedContext.subItemPart
? 'Delete Accordion Item'
: 'Delete Element'
}
>
<Trash2 className="w-3.5 h-3.5" />
</button>
)}
{selectedSection && onDeleteSection && selectedSection.type !== 'header' && selectedSection.type !== 'footer' && (
<button
type="button"
onClick={() => onDeleteSection(selectedSection.id)}
className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
title="Delete Section"
>
<Trash2 className="w-3.5 h-3.5" />
</button>
)}
<button
type="button"
onClick={onClose}
className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
isLight
? 'hover:bg-slate-100 text-slate-800 hover:text-slate-600'
: 'hover:bg-slate-800 text-slate-100 hover:text-slate-300'
}`}
title="Close Inspector"
aria-label="Close Inspector"
>
<X className="w-4 h-4" strokeWidth={1.5} />
</button>
</div>
</div>
);
};

const renderContent = () => {
if (isPageSelected) {
return (
<PageProperties
page={page}
onUpdatePageStyles={onUpdatePageStyles}
onUpdateSection={onUpdateSection}
onOpenSiteSettings={onOpenSiteSettings}
uiTheme={uiTheme}
activeTab={pageSettingsTab}
onSelectTab={onSelectPageSettingsTab}
/>
);
}

if (selectedSection && !selectedContext?.element) {
if (selectedSection.type === 'header') {
return null;
}
if (selectedSection.type === 'footer') {
return (
<FooterProperties
selectedSection={selectedSection}
onUpdateSection={onUpdateSection}
onDeleteSection={onDeleteSection}
uiTheme={uiTheme}
viewportMode={viewportMode}
/>
);
}
return (
<SectionProperties
selectedSection={selectedSection}
onUpdateSection={onUpdateSection}
onDeleteSection={onDeleteSection}
uiTheme={uiTheme}
viewportMode={viewportMode}
/>
);
}

if (selectedContext?.element) {
const activeSecId = selectedContext.sectionId || (selectedSection ? selectedSection.id : '');
const activeElId = selectedContext.element.id;

const targetSec = page?.sections.find((s) => s.id === activeSecId) || selectedSection;
const elements = targetSec?.elements || [];
const elIndex = elements.findIndex((e) => e.id === activeElId);
const canMoveUp = elIndex > 0;
const canMoveDown = elIndex >= 0 && elIndex < elements.length - 1;

const elementProps = {
selectedContext,
onUpdateElement,
onSelectContext,
onDeleteElement,
canMoveUp,
canMoveDown,
onMoveElementUp: () => {
if (activeSecId && onMoveElement) {
onMoveElement(activeSecId, activeElId, 'up');
}
},
onMoveElementDown: () => {
if (activeSecId && onMoveElement) {
onMoveElement(activeSecId, activeElId, 'down');
}
},
onDuplicateElement: () => {
if (activeSecId && onDuplicateElement) {
onDuplicateElement(activeSecId, activeElId);
}
},
page,
selectedSection,
onUpdateSection,
uiTheme,
viewportMode,
onSubHeaderChange: setSubHeaderState,
};

switch (selectedContext.element.type) {
case 'hamburger-button':
return <HamburgerProperties {...elementProps} />;
case 'mobile-menu-drawer':
return <MobileMenuProperties {...elementProps} />;
case 'logo':
return <LogoProperties {...elementProps} />;
case 'heading':
case 'text':
case 'image':
return null;
case 'form-input-text':
case 'form-textarea':
case 'form-input-email':
case 'form-input-password':
case 'form-input-number':
case 'form-select':
case 'form-checkbox':
case 'form-radio':
case 'form-date':
case 'form-file':
case 'form-submit':
case 'form':
return <FormProperties {...elementProps} />;
case 'button':
return <ButtonProperties {...elementProps} />;
case 'card':
return <CardProperties {...elementProps} />;
case 'grid':
return <GridProperties {...elementProps} />;
case 'inline':
return <InlineProperties {...elementProps} />;
case 'video':
return <VideoProperties {...elementProps} />;
case 'table':
return <TableProperties {...elementProps} />;
case 'icon':
return <IconProperties {...elementProps} />;
case 'modal':
return <ModalProperties {...elementProps} />;
case 'map':
return <MapProperties {...elementProps} />;
case 'mixed-media':
return <MediaProperties {...elementProps} />;
case 'list':
return <ListProperties {...elementProps} />;
case 'accordion':
return <AccordionProperties {...elementProps} />;
case 'divider':
return <DividerProperties {...elementProps} />;
case 'badge':
case 'nav-link':
case 'cta-container':
return <LinkProperties {...elementProps} />;
case 'submenu':
return <SubmenuProperties {...elementProps} />;
default:
return null;
}
}

return null;
};

const inspectorContent = renderContent();
if (!inspectorContent) return null;

const containerClass = isLight
? 'bg-white/95 backdrop-blur-xl border-slate-300/80 shadow-2xl text-slate-900'
: 'bg-slate-900/95 backdrop-blur-xl border-slate-700/80 shadow-2xl text-slate-100';

return (
<AnimatePresence>
{isMobileView && (
<motion.div
key="inspector-backdrop"
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
onClick={onClose}
className="fixed inset-0 z-[69] bg-transparent"
/>
)}
{isMobileView ? (
<motion.div
key="mobile-bottom-panel"
initial={{ y: '100%' }}
animate={{ y: 0 }}
exit={{ y: '100%' }}
transition={{ type: 'spring', damping: 25, stiffness: 250 }}
style={{
height: `${drawerHeight}px`,
maxHeight: '92vh',
}}
className={`fixed bottom-0 left-0 right-0 z-[70] border-t rounded-t-2xl shadow-2xl flex flex-col overflow-hidden ${containerClass}`}
>
<div
onTouchStart={(e) => {
if (e.touches && e.touches[0]) {
handleStartDrawerDrag(e.touches[0].clientY);
}
}}
onMouseDown={(e) => {
handleStartDrawerDrag(e.clientY);
}}
className="w-full pt-3 pb-2 flex flex-col items-center justify-center cursor-ns-resize active:cursor-grabbing touch-none select-none group"
>
<div
className={`w-14 h-1.5 rounded-full transition-colors ${
isLight
? 'bg-slate-300 group-hover:bg-slate-400 group-active:bg-indigo-500'
: 'bg-slate-600/80 group-hover:bg-slate-500 group-active:bg-indigo-400'
}`}
/>
</div>
{renderHeader()}
<ScrollArea className="flex-1 min-h-0 pb-8">{inspectorContent}</ScrollArea>
</motion.div>
) : (
<motion.div
key="desktop-floating-box"
initial={{ opacity: 0, scale: 0.95, y: -8 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.95, y: -8 }}
transition={{ duration: 0.18 }}
drag
dragMomentum={false}
style={floatStyle}
className={`border shadow-2xl rounded-xl max-h-[80vh] flex flex-col overflow-hidden ${containerClass}`}
>
<div
className="w-full pt-2 pb-0.5 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none group shrink-0"
title="Drag to reposition inspector"
>
<div
className={`w-10 h-1 rounded-full transition-colors ${
isLight
? 'bg-slate-300/80 group-hover:bg-slate-400 group-active:bg-indigo-500'
: 'bg-slate-700/80 group-hover:bg-slate-500 group-active:bg-indigo-400'
}`}
/>
</div>
{renderHeader()}
<ScrollArea className="flex-1 min-h-0">{inspectorContent}</ScrollArea>
</motion.div>
)}
</AnimatePresence>
);
};
