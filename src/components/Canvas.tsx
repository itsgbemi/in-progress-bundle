import React, { useState, useEffect, useRef } from 'react';
import { Plus, Tablet, Smartphone } from 'lucide-react';
import {
WebsitePage,
SelectedElementContext,
EditorMode,
ViewportMode,
WebsiteElement,
WebsiteSection,
} from '../types';
import { CanvasSection } from './CanvasSection';

interface CanvasProps {
page: WebsitePage;
selectedContext: SelectedElementContext | null;
selectedSectionId?: string | null;
editorMode: EditorMode;
viewportMode: ViewportMode;
isRotated?: boolean;
uiTheme?: 'dark' | 'light';
zoomScale?: number;
onSetZoomScale?: (scale: number) => void;
onZoomIn?: () => void;
onZoomOut?: () => void;
onResetZoom?: () => void;
onSelectElement: (context: SelectedElementContext) => void;
onOpenElementEditBox?: (context: SelectedElementContext) => void;
onSelectSection?: (section: WebsiteSection) => void;
onOpenSectionEditBox?: (section: WebsiteSection) => void;
onDeselect: () => void;
onUpdateElement: (updatedElement: WebsiteElement) => void;
onMoveElement?: (sectionId: string, elementId: string, direction: 'up' | 'down') => void;
onDuplicateElement?: (sectionId: string, elementId: string) => void;
onDeleteElement?: (elementId: string) => void;
onMoveSection: (sectionId: string, direction: 'up' | 'down') => void;
onDuplicateSection: (sectionId: string) => void;
onDeleteSection: (sectionId: string) => void;
onUpdateSection?: (section: WebsiteSection) => void;
onAddElementToSection: (sectionId: string) => void;
onAddElementToColumn?: (sectionId: string, parentId: string) => void;
onAddSection?: (section: WebsiteSection) => void;
onSelectPageSettings?: () => void;
onOpenTagModal?: (category: any) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
page,
selectedContext,
selectedSectionId,
editorMode,
viewportMode,
isRotated = false,
uiTheme = 'dark',
zoomScale = 1,
onSetZoomScale,
onSelectElement,
onOpenElementEditBox,
onSelectSection,
onOpenSectionEditBox,
onDeselect,
onUpdateElement,
onMoveElement,
onDuplicateElement,
onDeleteElement,
onMoveSection,
onDuplicateSection,
onDeleteSection,
onAddElementToSection,
onAddElementToColumn,
onUpdateSection,
onAddSection,
onSelectPageSettings,
onOpenTagModal,
}) => {
const isLight = uiTheme === 'light';
const containerRef = useRef<HTMLDivElement>(null);
const [containerWidth, setContainerWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);

useEffect(() => {
const el = containerRef.current;
if (!el) return;

const observer = new ResizeObserver((entries) => {
for (const entry of entries) {
setContainerWidth(entry.contentRect.width);
}
});

observer.observe(el);
setContainerWidth(el.clientWidth);

return () => observer.disconnect();
}, []);

useEffect(() => {
const el = containerRef.current;
if (!el) return;

const handleWheel = (e: WheelEvent) => {
if (e.ctrlKey || e.metaKey) {
e.preventDefault();
const delta = e.deltaY < 0 ? 0.05 : -0.05;
const newScale = Math.min(2.0, Math.max(0.25, Math.round((zoomScale + delta) * 100) / 100));
if (onSetZoomScale) {
onSetZoomScale(newScale);
}
}
};

el.addEventListener('wheel', handleWheel, { passive: false });
return () => el.removeEventListener('wheel', handleWheel);
}, [zoomScale, onSetZoomScale]);

const g = page.globalStyles || {};
const pageBgStyle: React.CSSProperties = {};

const effectiveBgType = g.backgroundType || (
g.backgroundImage && !g.backgroundImage.includes('gradient')
? 'image'
: g.backgroundGradient || (g.backgroundImage && g.backgroundImage.includes('gradient'))
? 'gradient'
: g.backgroundColor && g.backgroundColor !== 'transparent'
? 'solid'
: 'transparent'
);

if (effectiveBgType === 'image' && g.backgroundImage && !g.backgroundImage.includes('gradient')) {
let overlayGrad = '';
if (g.backgroundOverlay === 'dark') {
overlayGrad = 'linear-gradient(to bottom, rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.65))';
} else if (g.backgroundOverlay === 'light') {
overlayGrad = 'linear-gradient(to bottom, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.65))';
} else if (g.backgroundOverlay === 'gradient') {
overlayGrad = 'linear-gradient(135deg, rgba(79, 70, 229, 0.45), rgba(6, 182, 212, 0.45))';
} else if (g.backgroundOverlay && g.backgroundOverlay !== 'none' && (g.backgroundOverlay.startsWith('linear-gradient') || g.backgroundOverlay.startsWith('rgba'))) {
overlayGrad = g.backgroundOverlay;
}

pageBgStyle.backgroundImage = overlayGrad
? `${overlayGrad}, url('${g.backgroundImage}')`
: `url('${g.backgroundImage}')`;
pageBgStyle.backgroundSize = g.backgroundSize || 'cover';
pageBgStyle.backgroundPosition = g.backgroundPosition || 'center';
pageBgStyle.backgroundRepeat = g.backgroundRepeat || 'no-repeat';
} else if (effectiveBgType === 'gradient') {
pageBgStyle.backgroundImage =
g.backgroundGradient ||
(g.backgroundImage && g.backgroundImage.includes('gradient') ? g.backgroundImage : undefined) ||
`linear-gradient(${g.gradientAngle || 135}deg, ${g.gradientFrom || '#4f46e5'} 0%, ${g.gradientTo || '#06b6d4'} 100%)`;
} else if (effectiveBgType === 'solid' && g.backgroundColor && g.backgroundColor !== 'transparent') {
pageBgStyle.backgroundColor = g.backgroundColor;
} else if (effectiveBgType === 'transparent') {
pageBgStyle.backgroundColor = 'transparent';
} else {
pageBgStyle.backgroundColor = isLight ? '#ffffff' : '#0b0f19';
}

const isDesktopMode = viewportMode === 'desktop' || viewportMode === 'responsive';
let isFluidWidth = isDesktopMode || isRotated;
let baseWidthNumber = 1280;

if (viewportMode === 'tablet') {
if (containerWidth <= 768) {
isFluidWidth = true;
} else {
baseWidthNumber = 768;
}
} else if (viewportMode === 'mobile') {
if (containerWidth <= 390) {
isFluidWidth = true;
} else {
baseWidthNumber = 390;
}
}

let effectiveZoom = zoomScale;
if (!isFluidWidth && containerWidth > 0 && baseWidthNumber > containerWidth - 32) {
effectiveZoom = Math.min(zoomScale, (containerWidth - 32) / baseWidthNumber);
}

const scaledWidth = isFluidWidth ? '100%' : `${baseWidthNumber}px`;
const transformStyle = !isFluidWidth ? `scale(${effectiveZoom})` : 'none';

let frameClasses = `min-h-[calc(100vh-3rem)] flex flex-col justify-between mx-auto my-0 rounded-none border-0 shadow-none overflow-x-hidden ${
isLight ? 'text-slate-900 bg-white' : 'text-white bg-slate-900'
}`;

const handleCanvasBackgroundClick = (e: React.MouseEvent) => {
if (e.target === e.currentTarget) {
onDeselect();
}
};

const visibleSections = page.sections.filter((section) => !section.hidden);

if (visibleSections.length === 0 && editorMode === 'edit') {
const handleInsertBlankSection = () => {
if (onAddSection) {
onAddSection({
id: `section-${Math.random().toString(36).substring(2, 9)}`,
title: 'New Section',
type: 'custom',
elements: [],
styles: {
paddingTop: 80,
paddingBottom: 80,
paddingX: 20,
backgroundType: 'transparent'
}
});
}
};

return (
<main
ref={containerRef}
className={`flex-1 overflow-auto min-h-[calc(100vh-60px)] p-4 sm:p-8 flex flex-col items-center justify-center transition-colors duration-200 relative ${
isLight ? 'bg-slate-50' : 'bg-slate-950/40'
}`}
>
<div className="max-w-2xl w-full p-8 text-center relative select-none">
<div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16">
<button
onClick={() => onSelectPageSettings?.()}
className={`flex flex-col items-center gap-3 transition-all cursor-pointer active:scale-95 group ${
isLight ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-400 hover:text-indigo-400'
}`}
>
<div className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all bg-transparent ${
isLight ? 'border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50/30' : 'border-slate-800 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/5'
}`}>
<div className="w-5 h-5 rounded-sm border-2 border-current"></div>
</div>
<span className="text-sm font-medium">Tweak Page</span>
</button>

<button
onClick={handleInsertBlankSection}
className={`flex flex-col items-center gap-3 transition-all cursor-pointer active:scale-95 group ${
isLight ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-400 hover:text-indigo-400'
}`}
>
<div className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all bg-transparent ${
isLight ? 'border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50/30' : 'border-slate-800 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/5'
}`}>
<Plus className="w-6 h-6" />
</div>
<span className="text-sm font-medium">Insert Section</span>
</button>

<button
onClick={() => onOpenTagModal?.('meta')}
className={`flex flex-col items-center gap-3 transition-all cursor-pointer active:scale-95 group ${
isLight ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-400 hover:text-indigo-400'
}`}
>
<div className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all bg-transparent ${
isLight ? 'border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50/30' : 'border-slate-800 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/5'
}`}>
<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
<line x1="7" y1="7" x2="7.01" y2="7"></line>
</svg>
</div>
<span className="text-sm font-medium">Tweak Tag</span>
</button>
</div>
</div>
</main>
);
}

const hasBlankSection = visibleSections.some(
(s) => s.type !== 'header' && s.type !== 'footer' && (!s.elements || s.elements.length === 0)
);

let effectiveSections = [...visibleSections];
if (editorMode === 'edit' && !hasBlankSection) {
const defaultBlankSection: WebsiteSection = {
id: `blank-section-${page.id}`,
title: 'Blank Section',
type: 'custom',
elements: [],
styles: { backgroundType: 'transparent' },
};

const footerIndex = visibleSections.findIndex((s) => s.type === 'footer');
if (footerIndex >= 0) {
effectiveSections.splice(footerIndex, 0, defaultBlankSection);
} else {
effectiveSections.push(defaultBlankSection);
}
}

const seenIds = new Set<string>();
const uniqueEffectiveSections = effectiveSections.map((section, idx) => {
let id = section.id || `section-${idx}`;
if (seenIds.has(id)) {
id = `${id}-${idx}-${Math.random().toString(36).substring(2, 5)}`;
}
seenIds.add(id);
return { ...section, id };
});

const renderedSections = uniqueEffectiveSections.map((section) => (
<CanvasSection
onUpdateSection={onUpdateSection}
key={section.id}
section={section}
selectedContext={selectedContext}
selectedSectionId={selectedSectionId}
editorMode={editorMode}
viewportMode={viewportMode}
isRotated={isRotated}
uiTheme={uiTheme}
onSelectElement={onSelectElement}
onOpenElementEditBox={onOpenElementEditBox}
onSelectSection={onSelectSection}
onOpenSectionEditBox={onOpenSectionEditBox}
onUpdateElement={onUpdateElement}
onMoveElement={onMoveElement}
onDuplicateElement={onDuplicateElement}
onDeleteElement={onDeleteElement}
onMoveSection={onMoveSection}
onDuplicateSection={onDuplicateSection}
onDeleteSection={onDeleteSection}
onAddElementToSection={onAddElementToSection}
onAddElementToColumn={onAddElementToColumn}
/>
));

return (
<main
ref={containerRef}
data-canvas-container="true"
data-canvas-render="true"
onClick={handleCanvasBackgroundClick}
className={`canvas-render-container flex-1 overflow-auto min-h-[calc(100vh-60px)] ${isRotated ? 'p-0' : 'p-0 sm:p-2 md:p-4'} transition-colors duration-200 relative flex flex-col items-center ${
isLight ? 'bg-slate-100/80' : 'bg-slate-950/80'
}`}
>
<div
className="transition-all duration-150 ease-out flex flex-col items-center justify-start w-full max-w-full"
style={{
width: scaledWidth,
marginBottom: !isFluidWidth && !isRotated && zoomScale < 1 ? `-${(1 - zoomScale) * 45}%` : '0px',
}}
>
<div
data-canvas-container="true"
className={`canvas-frame canvas-render-container ${frameClasses}`}
style={{
...pageBgStyle,
fontFamily: g.fontFamily ? `'${g.fontFamily}', sans-serif` : undefined,
paddingTop: g.paddingTop !== undefined ? `${g.paddingTop}px` : (g.paddingY !== undefined ? `${g.paddingY}px` : undefined),
paddingBottom: g.paddingBottom !== undefined ? `${g.paddingBottom}px` : (g.paddingY !== undefined ? `${g.paddingY}px` : undefined),
paddingLeft: g.paddingLeft !== undefined ? `${g.paddingLeft}px` : (g.paddingX !== undefined ? `${g.paddingX}px` : undefined),
paddingRight: g.paddingRight !== undefined ? `${g.paddingRight}px` : (g.paddingX !== undefined ? `${g.paddingX}px` : undefined),
marginTop: g.marginTop !== undefined ? `${g.marginTop}px` : (g.marginY !== undefined ? `${g.marginY}px` : undefined),
marginBottom: g.marginBottom !== undefined ? `${g.marginBottom}px` : (g.marginY !== undefined ? `${g.marginY}px` : undefined),
marginLeft: g.marginLeft !== undefined ? `${g.marginLeft}px` : (g.marginX !== undefined ? `${g.marginX}px` : undefined),
marginRight: g.marginRight !== undefined ? `${g.marginRight}px` : (g.marginX !== undefined ? `${g.marginX}px` : undefined),
width: isFluidWidth ? '100%' : `${baseWidthNumber}px`,
transform: isRotated ? 'none' : transformStyle,
transformOrigin: 'top center',
}}
>
{renderedSections}
</div>
</div>
</main>
);
};
