import React, { useState, useEffect } from 'react';
import {
WebsiteSection,
WebsiteElement,
SelectedElementContext,
EditorMode,
ViewportMode,
} from '../types';
import { CanvasElement } from './CanvasElement';
import { Plus } from 'lucide-react';
import { computeSectionStyles } from './canvas/sections/SectionStyleComputationHelper';
import { SectionBackgroundRenderer } from './canvas/sections/SectionBackgroundRenderer';
import { HeaderSectionRenderer } from './canvas/sections/HeaderSectionRenderer';

interface CanvasSectionProps {
section: WebsiteSection;
isSectionSelected?: boolean;
selectedSectionId?: string;
selectedContext?: SelectedElementContext | null;
editorMode: EditorMode;
viewportMode?: ViewportMode;
onSelectSection?: (section: WebsiteSection) => void;
onOpenSectionEditBox?: (section: WebsiteSection) => void;
onSelectElement: (context: SelectedElementContext) => void;
onOpenElementEditBox?: (context: SelectedElementContext) => void;
onUpdateElement: (updatedElement: WebsiteElement) => void;
onUpdateSection?: (updatedSection: WebsiteSection) => void;
onMoveSection: (sectionId: string, direction: 'up' | 'down') => void;
onMoveElement?: (sectionId: string, elementId: string, direction: 'up' | 'down') => void;
onDuplicateElement?: (sectionId: string, elementId: string) => void;
onDeleteElement?: (elementId: string) => void;
onAddElementToSection: (sectionId: string) => void;
onAddElementToColumn?: (sectionId: string, parentId: string) => void;
onDuplicateSection: (sectionId: string) => void;
onDeleteSection: (sectionId: string) => void;
uiTheme?: 'dark' | 'light';
isRotated?: boolean;
}

export const CanvasSection: React.FC<CanvasSectionProps> = ({
section,
isSectionSelected: explicitIsSectionSelected,
selectedSectionId,
selectedContext,
editorMode,
viewportMode = 'desktop',
isRotated = false,
onSelectSection,
onOpenSectionEditBox,
onSelectElement,
onOpenElementEditBox,
onUpdateElement,
onUpdateSection,
onMoveSection,
onMoveElement,
onDuplicateElement,
onDeleteElement,
onAddElementToSection,
onAddElementToColumn,
onDuplicateSection,
onDeleteSection,
uiTheme = 'dark',
}) => {
const isSectionSelected = explicitIsSectionSelected !== undefined ? explicitIsSectionSelected : selectedSectionId === section.id;
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [slideshowIndex, setSlideshowIndex] = useState(0);
const [mobileExpandedNavIds, setMobileExpandedNavIds] = useState<Record<string, boolean>>({});

const handleAddHeaderNavLink = (targetGroup?: 'nav1' | 'nav2') => {
const newId = `nav-link-${Date.now()}`;
const newElement: WebsiteElement = {
id: newId,
type: 'nav-link',
content: 'New Link',
label: 'New Link',
href: '#',
target: '_self',
targetGroup: targetGroup,
styles: {
fontSize: 14,
textColor: 'inherit',
fontWeight: '600',
},
};
if (onUpdateSection) {
onUpdateSection({
...section,
elements: [...section.elements, newElement],
});
}
};

const handleAddHeaderCtaButton = () => {
const newId = `btn-${Date.now()}`;
const newElement: WebsiteElement = {
id: newId,
type: 'button',
content: 'Get Started',
href: '#',
target: '_self',
styles: {
fontSize: 14,
textColor: '#ffffff',
backgroundColor: '#6366f1',
borderRadius: 8,
padding: 12,
fontWeight: '600',
},
};
if (onUpdateSection) {
onUpdateSection({
...section,
elements: [...section.elements, newElement],
});
}
};

const handleAddHeaderCtaIcon = () => {
const newId = `icon-${Date.now()}`;
const newElement: WebsiteElement = {
id: newId,
type: 'icon',
iconName: 'Sparkles',
styles: {
fontSize: 20,
textColor: '#6366f1',
backgroundColor: 'transparent',
padding: 8,
borderRadius: 9999,
},
};
if (onUpdateSection) {
onUpdateSection({
...section,
elements: [...section.elements, newElement],
});
}
};

const isLight = uiTheme === 'light';
const s = { ...(section.style || {}), ...(section.styles || {}) };

const { sectionStyle, maxWidthClass, containerStyle } = computeSectionStyles(section, uiTheme);

useEffect(() => {
if (section.type === 'slideshow' && section.elements.length > 1) {
const interval = setInterval(() => {
setSlideshowIndex((prev) => (prev + 1) % section.elements.length);
}, 5000);
return () => clearInterval(interval);
}
}, [section.type, section.elements.length]);

useEffect(() => {
if (
selectedContext?.element?.type === 'mobile-menu-drawer' &&
(selectedContext.sectionId === section.id || section.type === 'header')
) {
setIsMobileMenuOpen(true);
}
}, [selectedContext, section.id, section.type]);

const handleSectionClick = (e: React.MouseEvent) => {
e.stopPropagation();
if (section.type === 'header' || section.type === 'footer') {
if (onOpenSectionEditBox) {
onOpenSectionEditBox(section);
} else {
onSelectSection?.(section);
}
} else {
onSelectSection?.(section);
}
};

if (section.type === 'header') {
return (
<HeaderSectionRenderer
section={section}
sectionStyle={sectionStyle}
maxWidthClass={maxWidthClass}
containerStyle={containerStyle}
isSticky={section.isSticky !== false}
editorMode={editorMode}
viewportMode={viewportMode}
isRotated={isRotated}
uiTheme={uiTheme}
isSectionSelected={isSectionSelected}
selectedContext={selectedContext}
isMobileMenuOpen={isMobileMenuOpen}
setIsMobileMenuOpen={setIsMobileMenuOpen}
mobileExpandedNavIds={mobileExpandedNavIds}
setMobileExpandedNavIds={setMobileExpandedNavIds}
onSelectElement={onSelectElement}
onUpdateElement={onUpdateElement}
onUpdateSection={onUpdateSection}
onSelectSection={onSelectSection}
onOpenSectionEditBox={onOpenSectionEditBox}
onAddElementToSection={onAddElementToSection}
onDeleteSection={onDeleteSection}
handleSectionClick={handleSectionClick}
handleSectionMouseEnter={() => {}}
handleSectionMouseLeave={() => {}}
handleAddHeaderNavLink={handleAddHeaderNavLink}
handleAddHeaderCtaButton={handleAddHeaderCtaButton}
handleAddHeaderCtaIcon={handleAddHeaderCtaIcon}
/>
);
}

if (section.type === 'footer') {
const layout = section.footerLayout || 'columns-4';
const isStackedNewsletter = layout === 'stacked-newsletter';

const alignMode = s.alignment || s.contentAlignment || s.textAlign || 'left';
let alignClasses = 'items-center text-center [&>*]:mx-auto [&>*]:text-center';
if (alignMode === 'left') {
alignClasses = 'items-start text-left [&>*]:mr-auto [&>*]:ml-0 [&>*]:text-left';
} else if (alignMode === 'right') {
alignClasses = 'items-end text-right [&>*]:ml-auto [&>*]:mr-0 [&>*]:text-right';
} else if (alignMode === 'none') {
alignClasses = 'items-stretch text-left [&>*]:m-0 [&>*]:text-left';
}

const layoutColumns =
s.layoutColumns ||
(layout === 'columns-3' || (layout as string) === 'columns3'
? '3'
: layout === 'minimal' || layout === 'centered'
? '1'
: layout === 'split'
? '2'
: section.elements.length > 1
? layout === 'columns-4'
? '4'
: '1'
: '1');

const isDesktopOrTablet = viewportMode === 'desktop' || viewportMode === 'tablet';
const forceDesktopCols = isDesktopOrTablet || isRotated;
const isMobileViewport = viewportMode === 'mobile' && !isRotated;

let gridColsClass = 'grid-cols-1';
const layoutStyle: React.CSSProperties = {};
if (layoutColumns === '2') {
const ratio = s.columnRatio || (layout === 'split' ? '1:2' : '1:1');
if (forceDesktopCols) {
gridColsClass = 'grid-cols-2';
layoutStyle.gridTemplateColumns = ratio === '1:2' ? '1fr 2fr' : ratio === '2:1' ? '2fr 1fr' : ratio === '1:3' ? '1fr 3fr' : ratio === '3:1' ? '3fr 1fr' : 'repeat(2, minmax(0, 1fr))';
} else if (isMobileViewport) {
gridColsClass = 'grid-cols-1';
layoutStyle.gridTemplateColumns = '1fr';
} else {
if (ratio === '1:2') {
gridColsClass = 'grid-cols-1 lg:grid-cols-[1fr_2fr]';
layoutStyle.gridTemplateColumns = '1fr 2fr';
} else if (ratio === '2:1') {
gridColsClass = 'grid-cols-1 lg:grid-cols-[2fr_1fr]';
layoutStyle.gridTemplateColumns = '2fr 1fr';
} else if (ratio === '1:3') {
gridColsClass = 'grid-cols-1 lg:grid-cols-[1fr_3fr]';
layoutStyle.gridTemplateColumns = '1fr 3fr';
} else if (ratio === '3:1') {
gridColsClass = 'grid-cols-1 lg:grid-cols-[3fr_1fr]';
layoutStyle.gridTemplateColumns = '3fr 1fr';
} else {
gridColsClass = 'grid-cols-1 lg:grid-cols-2';
}
}
} else if (layoutColumns === '3') {
const ratio = s.columnRatio || '1:1:1';
if (forceDesktopCols) {
gridColsClass = 'grid-cols-3';
layoutStyle.gridTemplateColumns = ratio === '1:2:1' ? '1fr 2fr 1fr' : ratio === '2:1:1' ? '2fr 1fr 1fr' : ratio === '1:1:2' ? '1fr 1fr 2fr' : 'repeat(3, minmax(0, 1fr))';
} else if (isMobileViewport) {
gridColsClass = 'grid-cols-1';
layoutStyle.gridTemplateColumns = '1fr';
} else {
if (ratio === '1:2:1') {
gridColsClass = 'grid-cols-1 md:grid-cols-[1fr_2fr_1fr]';
layoutStyle.gridTemplateColumns = '1fr 2fr 1fr';
} else if (ratio === '2:1:1') {
gridColsClass = 'grid-cols-1 md:grid-cols-[2fr_1fr_1fr]';
layoutStyle.gridTemplateColumns = '2fr 1fr 1fr';
} else if (ratio === '1:1:2') {
gridColsClass = 'grid-cols-1 md:grid-cols-[1fr_1fr_2fr]';
layoutStyle.gridTemplateColumns = '1fr 1fr 2fr';
} else {
gridColsClass = 'grid-cols-1 md:grid-cols-3';
}
}
} else if (layoutColumns === '4') {
if (forceDesktopCols) {
if (viewportMode === 'tablet') {
gridColsClass = 'grid-cols-2';
layoutStyle.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
} else {
gridColsClass = 'grid-cols-4';
layoutStyle.gridTemplateColumns = 'repeat(4, minmax(0, 1fr))';
}
} else if (isMobileViewport) {
gridColsClass = 'grid-cols-1';
layoutStyle.gridTemplateColumns = '1fr';
} else {
gridColsClass = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
}
} else {
gridColsClass = 'grid-cols-1';
}

const gapDesktop = s.gap !== undefined ? Number(s.gap) : 32;
const gapTablet = s.gapTablet !== undefined ? Number(s.gapTablet) : Math.min(gapDesktop, 24);
const gapMobile = s.gapMobile !== undefined ? Number(s.gapMobile) : Math.min(gapTablet, 12);

let gapClass = '';
if (forceDesktopCols) {
layoutStyle.gap = viewportMode === 'tablet' ? `${gapTablet}px` : `${gapDesktop}px`;
} else if (isMobileViewport) {
layoutStyle.gap = `${gapMobile}px`;
} else {
(layoutStyle as any)['--gap-desktop'] = `${gapDesktop}px`;
(layoutStyle as any)['--gap-tablet'] = `${gapTablet}px`;
(layoutStyle as any)['--gap-mobile'] = `${gapMobile}px`;
gapClass = `gap-[var(--gap-mobile)] md:gap-[var(--gap-tablet)] lg:gap-[var(--gap-desktop)]`;
}

const isReversed = s.reverseLayout === true;
const orderClass = isReversed
? layoutColumns === '1'
? 'flex-col-reverse'
: 'reverse-grid [&>:first-child]:order-2 [&>:last-child]:order-1 lg:[&>:first-child]:order-2 lg:[&>:last-child]:order-1'
: layoutColumns === '1'
? 'flex-col'
: '';

const verticalAlign = s.alignItems || 'top';
let verticalAlignClass = 'items-start';
if (verticalAlign === 'center') {
verticalAlignClass = 'items-center';
} else if (verticalAlign === 'flex-end' || verticalAlign === 'bottom') {
verticalAlignClass = 'items-end';
} else if (verticalAlign === 'stretch') {
verticalAlignClass = 'items-stretch';
}

let footerGridClass = '';
if (!s.layoutColumns && layout === 'minimal') {
footerGridClass = `${maxWidthClass} flex flex-col sm:flex-row items-center justify-between gap-4 w-full mx-auto`;
} else if (!s.layoutColumns && layout === 'centered') {
footerGridClass = `${maxWidthClass} flex flex-col items-center justify-center text-center gap-6 w-full mx-auto`;
} else if (layoutColumns === '1') {
footerGridClass = `flex ${orderClass} ${gapClass} ${verticalAlignClass} ${maxWidthClass} w-full mx-auto ${alignClasses}`;
} else {
footerGridClass = `grid ${gridColsClass} ${gapClass} ${verticalAlignClass} ${maxWidthClass} w-full ${orderClass}`;
}

return (
<footer
style={sectionStyle}
onClick={handleSectionClick}
onMouseEnter={() => {}}
onMouseLeave={() => {}}
className={`relative group transition-all mt-auto ${
editorMode === 'edit' ? 'cursor-pointer' : ''
} ${
isSectionSelected ? 'outline-dotted outline-2 outline-indigo-500 outline-offset-2 shadow-lg' : ''
}`}
>
{isStackedNewsletter && (
<div
className={`${maxWidthClass} mb-12 p-8 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6`}
>
<div>
<h3 className="text-xl font-bold text-white mb-1">Stay updated with our newsletter</h3>
<p className="text-sm text-slate-400">
Get the latest articles and product releases directly in your inbox.
</p>
</div>
<div className="flex items-center gap-2 w-full md:w-auto">
<input
type="email"
placeholder="Enter your email"
className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500 w-full sm:w-64"
/>
<button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors whitespace-nowrap shadow-lg shadow-indigo-600/30">
Subscribe
</button>
</div>
</div>
)}

{section.elements.length === 0 ? (
<div className={`${maxWidthClass} w-full mx-auto py-8 flex items-center justify-center`}>
<button
type="button"
onClick={(e) => {
e.stopPropagation();
onAddElementToSection(section.id);
}}
className="px-6 py-2.5 rounded-xl border border-slate-400/50 hover:border-indigo-500 bg-transparent hover:bg-indigo-500/5 text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 group text-inherit"
>
<Plus className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
<span>Add to footer</span>
</button>
</div>
) : (
<div className={footerGridClass} style={layoutStyle}>
{section.elements.map((element, idx) => (
<CanvasElement
key={element.id}
element={element}
sectionId={section.id}
isSelected={editorMode === 'edit' && selectedContext?.element?.id === element.id}
selectedElementId={editorMode === 'edit' ? selectedContext?.element?.id : undefined}
selectedContext={selectedContext}
editorMode={editorMode}
onSelect={onSelectElement}
onOpenEditBox={onOpenElementEditBox}
onUpdate={onUpdateElement}
onMoveElement={onMoveElement}
onDuplicateElement={onDuplicateElement}
onDeleteElement={onDeleteElement}
onAddElementToColumn={onAddElementToColumn}
uiTheme={uiTheme}
viewportMode={viewportMode}
isRotated={isRotated}
canMoveUp={idx > 0}
canMoveDown={idx < section.elements.length - 1}
/>
))}
{editorMode === 'edit' &&
parseInt(layoutColumns || '1', 10) > section.elements.length &&
Array.from({
length: parseInt(layoutColumns || '1', 10) - section.elements.length,
}).map((_, colIdx) => {
const colNum = section.elements.length + colIdx + 1;
return (
<div
key={`footer-empty-col-${colNum}`}
onClick={(e) => {
e.stopPropagation();
onAddElementToSection(section.id);
}}
className={`w-full min-h-[140px] p-6 border-2 border-dashed ${
isLight
? 'border-indigo-300 bg-indigo-50/40 hover:bg-indigo-50 hover:border-indigo-500'
: 'border-indigo-500/30 bg-indigo-950/20 hover:bg-indigo-950/40 hover:border-indigo-400'
} rounded-2xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all group/colslot`}
>
<div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover/colslot:scale-110 transition-transform">
<Plus className="w-5 h-5" />
</div>
<div>
<span className="text-xs font-bold text-indigo-400 block">
Footer Column {colNum}
</span>
<span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
Click to add column content
</span>
</div>
</div>
);
})}
</div>
)}
</footer>
);
}

const isHero = section.type === 'hero';
const alignMode =
s.alignment || s.contentAlignment || s.textAlign || (isHero ? 'center' : 'center');
let alignClasses = 'items-center text-center [&>*]:mx-auto [&>*]:text-center';
if (alignMode === 'left') {
alignClasses = 'items-start text-left [&>*]:mr-auto [&>*]:ml-0 [&>*]:text-left';
} else if (alignMode === 'right') {
alignClasses = 'items-end text-right [&>*]:ml-auto [&>*]:mr-0 [&>*]:text-right';
} else if (alignMode === 'none') {
alignClasses = 'items-stretch text-left [&>*]:m-0 [&>*]:text-left';
}

const layoutColumns = s.layoutColumns || '1';

const isDesktopOrTablet = viewportMode === 'desktop' || viewportMode === 'tablet';
const forceDesktopCols = isDesktopOrTablet || isRotated;
const isMobileViewport = viewportMode === 'mobile' && !isRotated;

let gridColsClass = 'grid-cols-1';
const layoutStyle: React.CSSProperties = {};
if (layoutColumns === '2') {
const ratio = s.columnRatio || '1:1';
if (forceDesktopCols) {
gridColsClass = 'grid-cols-2';
layoutStyle.gridTemplateColumns = ratio === '1:2' ? '1fr 2fr' : ratio === '2:1' ? '2fr 1fr' : ratio === '1:3' ? '1fr 3fr' : ratio === '3:1' ? '3fr 1fr' : 'repeat(2, minmax(0, 1fr))';
} else if (isMobileViewport) {
gridColsClass = 'grid-cols-1';
layoutStyle.gridTemplateColumns = '1fr';
} else {
if (ratio === '1:2') {
gridColsClass = 'grid-cols-1 lg:grid-cols-[1fr_2fr]';
layoutStyle.gridTemplateColumns = '1fr 2fr';
} else if (ratio === '2:1') {
gridColsClass = 'grid-cols-1 lg:grid-cols-[2fr_1fr]';
layoutStyle.gridTemplateColumns = '2fr 1fr';
} else if (ratio === '1:3') {
gridColsClass = 'grid-cols-1 lg:grid-cols-[1fr_3fr]';
layoutStyle.gridTemplateColumns = '1fr 3fr';
} else if (ratio === '3:1') {
gridColsClass = 'grid-cols-1 lg:grid-cols-[3fr_1fr]';
layoutStyle.gridTemplateColumns = '3fr 1fr';
} else {
gridColsClass = 'grid-cols-1 lg:grid-cols-2';
}
}
} else if (layoutColumns === '3') {
const ratio = s.columnRatio || '1:1:1';
if (forceDesktopCols) {
gridColsClass = 'grid-cols-3';
layoutStyle.gridTemplateColumns = ratio === '1:2:1' ? '1fr 2fr 1fr' : ratio === '2:1:1' ? '2fr 1fr 1fr' : ratio === '1:1:2' ? '1fr 1fr 2fr' : 'repeat(3, minmax(0, 1fr))';
} else if (isMobileViewport) {
gridColsClass = 'grid-cols-1';
layoutStyle.gridTemplateColumns = '1fr';
} else {
if (ratio === '1:2:1') {
gridColsClass = 'grid-cols-1 md:grid-cols-[1fr_2fr_1fr]';
layoutStyle.gridTemplateColumns = '1fr 2fr 1fr';
} else if (ratio === '2:1:1') {
gridColsClass = 'grid-cols-1 md:grid-cols-[2fr_1fr_1fr]';
layoutStyle.gridTemplateColumns = '2fr 1fr 1fr';
} else if (ratio === '1:1:2') {
gridColsClass = 'grid-cols-1 md:grid-cols-[1fr_1fr_2fr]';
layoutStyle.gridTemplateColumns = '1fr 1fr 2fr';
} else {
gridColsClass = 'grid-cols-1 md:grid-cols-3';
}
}
} else if (layoutColumns === '4') {
if (forceDesktopCols) {
if (viewportMode === 'tablet') {
gridColsClass = 'grid-cols-2';
layoutStyle.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
} else {
gridColsClass = 'grid-cols-4';
layoutStyle.gridTemplateColumns = 'repeat(4, minmax(0, 1fr))';
}
} else if (isMobileViewport) {
gridColsClass = 'grid-cols-1';
layoutStyle.gridTemplateColumns = '1fr';
} else {
gridColsClass = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
}
} else {
gridColsClass = 'grid-cols-1';
}

const gapDesktop = s.gap !== undefined ? Number(s.gap) : 32;
const gapTablet = s.gapTablet !== undefined ? Number(s.gapTablet) : Math.min(gapDesktop, 24);
const gapMobile = s.gapMobile !== undefined ? Number(s.gapMobile) : Math.min(gapTablet, 12);

let gapClass = '';
if (forceDesktopCols) {
layoutStyle.gap = viewportMode === 'tablet' ? `${gapTablet}px` : `${gapDesktop}px`;
} else if (isMobileViewport) {
layoutStyle.gap = `${gapMobile}px`;
} else {
(layoutStyle as any)['--gap-desktop'] = `${gapDesktop}px`;
(layoutStyle as any)['--gap-tablet'] = `${gapTablet}px`;
(layoutStyle as any)['--gap-mobile'] = `${gapMobile}px`;
gapClass = `gap-[var(--gap-mobile)] md:gap-[var(--gap-tablet)] lg:gap-[var(--gap-desktop)]`;
}

const isReversed = s.reverseLayout === true;
const orderClass = isReversed
? layoutColumns === '1'
? 'flex-col-reverse'
: 'reverse-grid [&>:first-child]:order-2 [&>:last-child]:order-1 lg:[&>:first-child]:order-2 lg:[&>:last-child]:order-1'
: layoutColumns === '1'
? 'flex-col'
: '';

const verticalAlign = s.alignItems || 'center';
let verticalAlignClass = 'items-center';
if (verticalAlign === 'flex-start' || verticalAlign === 'top') {
verticalAlignClass = 'items-start';
} else if (verticalAlign === 'flex-end' || verticalAlign === 'bottom') {
verticalAlignClass = 'items-end';
} else if (verticalAlign === 'stretch') {
verticalAlignClass = 'items-stretch';
}

let layoutClasses = '';
if (layoutColumns === '1') {
layoutClasses = `flex ${orderClass} ${gapClass} ${verticalAlignClass} ${maxWidthClass} w-full mx-auto ${alignClasses}`;
} else {
layoutClasses = `grid ${gridColsClass} ${gapClass} ${verticalAlignClass} ${maxWidthClass} w-full ${orderClass}`;
}

return (
<section
id={section.anchorId || section.id}
data-section-id={section.id}
style={sectionStyle}
onClick={handleSectionClick}
onMouseEnter={() => {}}
onMouseLeave={() => {}}
className={`relative group transition-all ${
editorMode === 'edit' ? 'cursor-pointer' : ''
} ${
isSectionSelected ? 'outline-dotted outline-2 outline-indigo-500 outline-offset-2 shadow-lg' : ''
}`}
>
<SectionBackgroundRenderer section={section} slideshowIndex={slideshowIndex} />

{section.type === 'slideshow' ? (
<div className={`w-full max-w-full overflow-hidden relative group/slideshow ${maxWidthClass}`}>
<div
className="flex w-full transition-transform duration-700 ease-in-out"
style={{ transform: `translateX(-${(slideshowIndex || 0) * 100}%)` }}
>
{section.elements.map((element, idx) => (
<div key={element.id} className="min-w-full relative">
<CanvasElement
element={element}
sectionId={section.id}
isSelected={selectedContext?.element?.id === element.id}
selectedElementId={selectedContext?.element?.id}
editorMode={editorMode}
onSelect={onSelectElement}
onOpenEditBox={onOpenElementEditBox}
onUpdate={onUpdateElement}
onMoveElement={onMoveElement}
onDuplicateElement={onDuplicateElement}
onDeleteElement={onDeleteElement}
uiTheme={uiTheme}
viewportMode={viewportMode}
isRotated={isRotated}
canMoveUp={idx > 0}
canMoveDown={idx < section.elements.length - 1}
/>
</div>
))}
</div>
</div>
) : (
<div className={layoutClasses} style={layoutStyle}>
{section.elements.map((element, idx) => {
const isSelected = selectedContext?.element?.id === element.id;
return (
<div key={element.id} className="w-full">
<CanvasElement
key={element.id}
element={element}
sectionId={section.id}
isSelected={isSelected}
selectedElementId={selectedContext?.element?.id}
selectedContext={selectedContext}
editorMode={editorMode}
onSelect={onSelectElement}
onOpenEditBox={onOpenElementEditBox}
onUpdate={onUpdateElement}
onMoveElement={onMoveElement}
onDuplicateElement={onDuplicateElement}
onDeleteElement={onDeleteElement}
onAddElementToColumn={onAddElementToColumn}
uiTheme={uiTheme}
viewportMode={viewportMode}
isRotated={isRotated}
canMoveUp={idx > 0}
canMoveDown={idx < section.elements.length - 1}
/>
</div>
);
})}
{editorMode === 'edit' &&
parseInt(layoutColumns || '1', 10) > section.elements.length &&
Array.from({
length: parseInt(layoutColumns || '1', 10) - section.elements.length,
}).map((_, colIdx) => {
const colNum = section.elements.length + colIdx + 1;
const isBlankSection = (layoutColumns === '1' || !layoutColumns) && section.elements.length === 0;
const headingText = isBlankSection || (colNum === 1 && section.elements.length === 0) ? 'Blank section' : `Column ${colNum}`;
return (
<div
key={`body-empty-col-${colNum}`}
onClick={(e) => {
e.stopPropagation();
onAddElementToSection(section.id);
}}
className="w-full min-h-[140px] p-6 border-2 border-dashed border-indigo-400/40 hover:border-indigo-500 bg-transparent hover:bg-indigo-500/5 rounded-2xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all group/colslot"
>
<div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover/colslot:scale-110 transition-transform">
<Plus className="w-5 h-5" />
</div>
<div>
<span className="text-xs font-bold text-indigo-400 block">{headingText}</span>
<span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
Tap to start designing
</span>
</div>
</div>
);
})}
</div>
)}
</section>
);
};
