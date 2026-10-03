import React from 'react';
import { WebsiteElement, SelectedElementContext, EditorMode, ViewportMode } from '../../../types';
import { Plus, Settings, Copy, Trash2 } from 'lucide-react';

interface GridElementRendererProps {
element: WebsiteElement;
sectionId: string;
selectedElementId?: string | null;
selectedContext?: SelectedElementContext | null;
editorMode: EditorMode;
viewportMode?: ViewportMode;
isRotated?: boolean;
isSelected: boolean;
isHovered: boolean;
uiTheme?: 'dark' | 'light';
styleObj: React.CSSProperties;
elementRef: React.RefObject<HTMLDivElement>;
onSelect: (context: SelectedElementContext) => void;
onOpenEditBox?: (context: SelectedElementContext) => void;
onUpdate: (updatedElement: WebsiteElement) => void;
onMoveElement?: (sectionId: string, elementId: string, direction: 'up' | 'down') => void;
onDuplicateElement?: (sectionId: string, elementId: string) => void;
onDeleteElement?: (elementId: string) => void;
onAddElementToColumn?: (sectionId: string, parentId: string) => void;
renderChildElement: (child: WebsiteElement) => React.ReactNode;
}

export const GridElementRenderer: React.FC<GridElementRendererProps> = ({
element,
sectionId,
selectedElementId,
editorMode,
viewportMode = 'desktop',
isRotated = false,
isSelected,
isHovered,
uiTheme = 'dark',
styleObj,
elementRef,
onSelect,
onOpenEditBox,
onDuplicateElement,
onDeleteElement,
onAddElementToColumn,
renderChildElement,
}) => {
const s = element.styles || {};
const isLight = uiTheme === 'light';
const layoutColumns = s.layoutColumns || '1';
let gridColsClass = 'grid-cols-1';
let isFlexWrap = false;
const customGridStyle: React.CSSProperties = {};

const isDesktopOrTablet = viewportMode === 'desktop' || viewportMode === 'tablet';
const isMobileViewport = viewportMode === 'mobile';
const forceDesktop = isDesktopOrTablet || isRotated;
const isMobileScreen = typeof window !== 'undefined' && window.innerWidth < 640;

if (layoutColumns === '2') {
const ratio = s.columnRatio || '1:1';
if (forceDesktop) {
gridColsClass = 'grid-cols-2';
if (ratio === '1:2') {
customGridStyle.gridTemplateColumns = '1fr 2fr';
} else if (ratio === '2:1') {
customGridStyle.gridTemplateColumns = '2fr 1fr';
} else if (ratio === '1:3') {
customGridStyle.gridTemplateColumns = '1fr 3fr';
} else if (ratio === '3:1') {
customGridStyle.gridTemplateColumns = '3fr 1fr';
} else {
customGridStyle.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
}
} else if (isMobileViewport) {
gridColsClass = 'grid-cols-1';
customGridStyle.gridTemplateColumns = '1fr';
} else if (!isMobileScreen) {
if (ratio === '1:2') {
gridColsClass = 'grid-cols-1 sm:grid-cols-[1fr_2fr]';
customGridStyle.gridTemplateColumns = '1fr 2fr';
} else if (ratio === '2:1') {
gridColsClass = 'grid-cols-1 sm:grid-cols-[2fr_1fr]';
customGridStyle.gridTemplateColumns = '2fr 1fr';
} else if (ratio === '1:3') {
gridColsClass = 'grid-cols-1 sm:grid-cols-[1fr_3fr]';
customGridStyle.gridTemplateColumns = '1fr 3fr';
} else if (ratio === '3:1') {
gridColsClass = 'grid-cols-1 sm:grid-cols-[3fr_1fr]';
customGridStyle.gridTemplateColumns = '3fr 1fr';
} else {
gridColsClass = 'grid-cols-1 sm:grid-cols-2';
}
} else {
gridColsClass = 'grid-cols-1';
}
} else if (layoutColumns === '3') {
const ratio = s.columnRatio || '1:1:1';
if (forceDesktop) {
gridColsClass = 'grid-cols-3';
if (ratio === '1:2:1') {
customGridStyle.gridTemplateColumns = '1fr 2fr 1fr';
} else if (ratio === '2:1:1') {
customGridStyle.gridTemplateColumns = '2fr 1fr 1fr';
} else if (ratio === '1:1:2') {
customGridStyle.gridTemplateColumns = '1fr 1fr 2fr';
} else {
customGridStyle.gridTemplateColumns = 'repeat(3, minmax(0, 1fr))';
}
} else if (isMobileViewport) {
gridColsClass = 'grid-cols-1';
customGridStyle.gridTemplateColumns = '1fr';
} else if (!isMobileScreen) {
if (ratio === '1:2:1') {
gridColsClass = 'grid-cols-1 sm:grid-cols-[1fr_2fr_1fr]';
customGridStyle.gridTemplateColumns = '1fr 2fr 1fr';
} else if (ratio === '2:1:1') {
gridColsClass = 'grid-cols-1 sm:grid-cols-[2fr_1fr_1fr]';
customGridStyle.gridTemplateColumns = '2fr 1fr 1fr';
} else if (ratio === '1:1:2') {
gridColsClass = 'grid-cols-1 sm:grid-cols-[1fr_1fr_2fr]';
customGridStyle.gridTemplateColumns = '1fr 1fr 2fr';
} else {
gridColsClass = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
}
} else {
gridColsClass = 'grid-cols-1';
}
} else if (layoutColumns === '4') {
if (forceDesktop) {
if (viewportMode === 'tablet') {
gridColsClass = 'grid-cols-2';
customGridStyle.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
} else {
gridColsClass = 'grid-cols-4';
customGridStyle.gridTemplateColumns = 'repeat(4, minmax(0, 1fr))';
}
} else if (isMobileViewport) {
gridColsClass = 'grid-cols-1';
customGridStyle.gridTemplateColumns = '1fr';
} else {
gridColsClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
}
} else if (layoutColumns === 'flex') {
isFlexWrap = false;
customGridStyle.justifyContent = s.justifyContent || 'flex-start';
} else if (layoutColumns === 'flex-wrap') {
isFlexWrap = true;
customGridStyle.justifyContent = s.justifyContent || 'flex-start';
}

const gapVal = s.gap !== undefined ? s.gap : 24;

const normalizedAlign =
s.alignItems === 'top' || s.alignItems === 'start' || s.alignItems === 'flex-start'
? 'flex-start'
: s.alignItems === 'bottom' || s.alignItems === 'end' || s.alignItems === 'flex-end'
? 'flex-end'
: s.alignItems === 'center'
? 'center'
: 'stretch';

const alignClass =
normalizedAlign === 'flex-start'
? 'items-start'
: normalizedAlign === 'flex-end'
? 'items-end'
: normalizedAlign === 'center'
? 'items-center'
: 'items-stretch';

let layoutClass = '';
if (layoutColumns === 'flex' || layoutColumns === 'flex-wrap') {
layoutClass = `flex ${isFlexWrap ? 'flex-wrap' : 'flex-nowrap'} ${alignClass}`;
} else {
layoutClass = `grid ${gridColsClass} ${alignClass}`;
}

const widthVal = s.fullWidth ? '100%' : s.width ? (typeof s.width === 'number' ? `${s.width}px` : s.width) : '100%';

const gridStyle: React.CSSProperties = {
...styleObj,
...customGridStyle,
width: widthVal,
gap: `${gapVal}px`,
paddingTop: s.paddingTop !== undefined ? `${s.paddingTop}px` : undefined,
paddingBottom: s.paddingBottom !== undefined ? `${s.paddingBottom}px` : undefined,
paddingLeft: s.paddingLeft !== undefined ? `${s.paddingLeft}px` : undefined,
paddingRight: s.paddingRight !== undefined ? `${s.paddingRight}px` : undefined,
alignItems: normalizedAlign,
};

const hasChildren = element.children && element.children.length > 0;

return (
<div
ref={elementRef}
onClick={(e) => {
if (editorMode !== 'edit') return;
e.stopPropagation();
if (elementRef.current) {
const rect = elementRef.current.getBoundingClientRect();
onSelect({
element,
sectionId,
rect: {
top: rect.top,
left: rect.left,
width: rect.width,
height: rect.height,
bottom: rect.bottom,
right: rect.right,
},
});
}
}}
className={`w-full relative group/el cursor-default ${layoutClass} transition-all`}
style={gridStyle}
>
{hasChildren ? (
(element.children || []).map((child) => (
<div key={child.id} className="w-full flex-1 min-w-0">
{renderChildElement(child)}
</div>
))
) : editorMode === 'edit' ? (
<div
onClick={(e) => {
e.stopPropagation();
if (onAddElementToColumn) {
onAddElementToColumn(sectionId, element.id);
}
}}
className="w-full min-h-[140px] p-6 border-2 border-dashed border-indigo-400/40 hover:border-indigo-500 bg-transparent hover:bg-indigo-500/5 rounded-2xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all group/colslot"
>
<div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover/colslot:scale-110 transition-transform">
<Plus className="w-5 h-5" />
</div>
<div>
<span className="text-xs font-bold text-indigo-400 block">{element.label || 'Empty Grid'}</span>
<span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
Tap to start designing
</span>
</div>
</div>
) : null}

{editorMode === 'edit' && parseInt(layoutColumns || '1', 10) > (element.children?.length || 0) && (
Array.from({ length: parseInt(layoutColumns || '1', 10) - (element.children?.length || 0) }).map((_, colIdx) => {
const colNum = (element.children?.length || 0) + colIdx + 1;
return (
<div
key={`grid-empty-col-${colNum}`}
onClick={(e) => {
e.stopPropagation();
if (onAddElementToColumn) {
onAddElementToColumn(sectionId, element.id);
}
}}
className="w-full min-h-[140px] p-6 border-2 border-dashed border-indigo-400/40 hover:border-indigo-500 bg-transparent hover:bg-indigo-500/5 rounded-2xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all group/colslot"
>
<div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover/colslot:scale-110 transition-transform">
<Plus className="w-5 h-5" />
</div>
<div>
<span className="text-xs font-bold text-indigo-400 block">Column {colNum}</span>
<span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
Tap to start designing
</span>
</div>
</div>
);
})
)}

{editorMode === 'edit' && (isSelected || isHovered) && (
<div
className="absolute -top-3 -right-3 z-50 flex items-center shadow-lg rounded-md overflow-hidden bg-slate-800 text-white border border-slate-700"
onClick={(e) => e.stopPropagation()}
>
<button
type="button"
onClick={() => onOpenEditBox?.({ element, sectionId })}
className="p-2 hover:bg-indigo-600 transition-colors"
title="Grid Settings"
>
<Settings className="w-3.5 h-3.5" />
</button>
{onDuplicateElement && (
<button
type="button"
onClick={() => onDuplicateElement(sectionId, element.id)}
className="p-2 hover:bg-slate-700 transition-colors border-l border-slate-700"
title="Duplicate Grid"
>
<Copy className="w-3.5 h-3.5" />
</button>
)}
{onDeleteElement && (
<button
type="button"
onClick={() => onDeleteElement(element.id)}
className="p-2 hover:bg-red-600 transition-colors border-l border-slate-700"
title="Delete Grid"
>
<Trash2 className="w-3.5 h-3.5" />
</button>
)}
</div>
)}
</div>
);
};
