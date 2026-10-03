import React from 'react';
import { WebsiteElement, SelectedElementContext, EditorMode } from '../../../types';
import { Plus } from 'lucide-react';

interface InlineElementRendererProps {
element: WebsiteElement;
sectionId: string;
selectedElementId?: string | null;
selectedContext?: SelectedElementContext | null;
editorMode: EditorMode;
uiTheme?: 'dark' | 'light';
styleObj: React.CSSProperties;
hoverClass: string;
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

export const InlineElementRenderer: React.FC<InlineElementRendererProps> = ({
element,
sectionId,
selectedElementId,
editorMode,
uiTheme = 'dark',
styleObj,
hoverClass,
elementRef,
onSelect,
onAddElementToColumn,
renderChildElement,
}) => {
const s = element.styles || {};
const isLight = uiTheme === 'light';
const hasChildren = element.children && element.children.length > 0;
const isSelected = selectedElementId === element.id;

const inlineStyle: React.CSSProperties = {
...styleObj,
display: styleObj.display || 'flex',
flexDirection: s.layoutDirection === 'col' ? 'column' : 'row',
flexWrap: (s.flexWrap as any) || 'wrap',
gap: s.gap !== undefined ? `${s.gap}px` : '8px',
alignItems: s.alignItems || 'baseline',
justifyContent: s.justifyContent || 'flex-start',
paddingTop: s.paddingY !== undefined ? `${s.paddingY}px` : '8px',
paddingBottom: s.paddingY !== undefined ? `${s.paddingY}px` : '8px',
paddingLeft: s.paddingX !== undefined ? `${s.paddingX}px` : '8px',
paddingRight: s.paddingX !== undefined ? `${s.paddingX}px` : '8px',
borderRadius: s.borderRadius !== undefined ? `${s.borderRadius}px` : '10px',
};

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
domElement: elementRef.current,
});
} else {
onSelect({ element, sectionId });
}
}}
style={inlineStyle}
className={`relative transition-all cursor-pointer ${
isSelected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
} ${hoverClass}`}
>
{hasChildren ? (
(element.children || []).map((child) => renderChildElement(child))
) : editorMode === 'edit' ? (
<div
onClick={(e) => {
e.stopPropagation();
if (onAddElementToColumn) {
onAddElementToColumn(sectionId, element.id);
}
}}
className={`py-3 px-4 border border-dashed rounded-xl flex items-center justify-center text-center gap-2 cursor-pointer w-full hover:border-indigo-500 hover:bg-indigo-50/20 transition-colors ${
isLight ? 'border-slate-300 bg-slate-50/80' : 'border-slate-800 bg-slate-900/40'
}`}
>
<Plus className="w-4 h-4 text-indigo-500 animate-pulse shrink-0" />
<span className="text-[11px] font-medium text-slate-400">Empty Inline Display (Click to add Span, Image, Icon, Button)</span>
</div>
) : null}
</div>
);
};
