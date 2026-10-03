import React from 'react';
import { WebsiteElement, SelectedElementContext, EditorMode, TableCellItem, TableHeaderItem } from '../../../types';
import { TableEditableText } from './TableEditableText';

export interface TableElementRendererProps {
element: WebsiteElement;
sectionId: string;
selectedElementId?: string | null;
selectedContext?: SelectedElementContext | null;
editorMode: EditorMode;
uiTheme?: 'dark' | 'light';
shadowClass?: string;
styleObj?: React.CSSProperties;
onSelect: (context: SelectedElementContext) => void;
onOpenEditBox?: (context: SelectedElementContext) => void;
onUpdate: (updatedElement: WebsiteElement) => void;
}

export const TableElementRenderer: React.FC<TableElementRendererProps> = ({
element,
sectionId,
selectedElementId,
selectedContext,
editorMode,
uiTheme = 'dark',
shadowClass = '',
styleObj = {},
onSelect,
onOpenEditBox,
onUpdate,
}) => {
const isLight = uiTheme === 'light';
const isSelected = selectedElementId === element.id;

const tableData = element.tableData || {
headers: ['Table Header 1', 'Table Header 2', 'Table Header 3'],
rows: [
['Cell 1', 'Cell 2', 'Cell 3'],
['Cell 4', 'Cell 5', 'Cell 6'],
],
includeHeader: true,
zebraStripes: false,
tableAlignment: 'full',
};

const rawHeaders: (string | TableHeaderItem)[] = tableData.headers && tableData.headers.length > 0
? tableData.headers
: ['Table Header 1', 'Table Header 2', 'Table Header 3'];

const rawRows: (string | TableCellItem)[][] = tableData.rows && tableData.rows.length > 0
? tableData.rows
: [
['Cell 1', 'Cell 2', 'Cell 3'],
['Cell 4', 'Cell 5', 'Cell 6'],
];

const includeHeader = tableData.includeHeader !== false;
const zebraStripes = !!tableData.zebraStripes;
const tableAlignment = tableData.tableAlignment || 'full';

const s = element.styles || {};
const containerBg = s.backgroundColor || (isLight ? '#ffffff' : '#1e293b');
const containerTextColor = s.textColor || (isLight ? '#031738' : '#f8fafc');
const borderColor = s.borderColor || (isLight ? '#e2e8f0' : '#334155');
const borderWidth = s.borderWidth !== undefined ? s.borderWidth : 1;
const borderRadius = s.borderRadius !== undefined ? s.borderRadius : 12;

const headerBg = tableData.headerBg || (isLight ? '#f1f5f9' : '#0f172a');
const headerTextColor = tableData.headerTextColor || (isLight ? '#0f172a' : '#f8fafc');

const cellPaddingClass =
tableData.cellPadding === 'compact'
? 'p-2'
: tableData.cellPadding === 'relaxed'
? 'p-4'
: 'p-3';

const handleUpdateHeader = (colIdx: number, newText: string) => {
const newHeaders = [...rawHeaders];
const curr = newHeaders[colIdx];
if (typeof curr === 'object' && curr !== null) {
newHeaders[colIdx] = { ...curr, text: newText };
} else {
newHeaders[colIdx] = newText;
}
onUpdate({
...element,
tableData: {
...tableData,
headers: newHeaders,
},
});
};

const handleUpdateCellText = (rowIdx: number, colIdx: number, newHtml: string) => {
const newRows = rawRows.map((r) => [...r]);
const curr = newRows[rowIdx]?.[colIdx];
if (typeof curr === 'object' && curr !== null) {
newRows[rowIdx][colIdx] = { ...curr, text: newHtml };
} else {
newRows[rowIdx][colIdx] = newHtml;
}
onUpdate({
...element,
tableData: {
...tableData,
rows: newRows,
},
});
};

const alignContainerClass =
tableAlignment === 'center'
? 'mx-auto'
: tableAlignment === 'right'
? 'ml-auto'
: tableAlignment === 'left'
? 'mr-auto'
: 'w-full';

return (
<div
onClick={(e) => {
if (editorMode !== 'edit') return;
e.stopPropagation();
const ctx: SelectedElementContext = {
element,
sectionId,
tablePart: 'table',
rect: e.currentTarget.getBoundingClientRect(),
domElement: e.currentTarget,
};
onSelect(ctx);
onOpenEditBox?.(ctx);
}}
style={{
...styleObj,
backgroundColor: containerBg,
color: containerTextColor,
borderColor: borderWidth > 0 ? borderColor : 'transparent',
borderWidth: `${borderWidth}px`,
borderRadius: `${borderRadius}px`,
}}
className={`overflow-hidden border transition-all ${alignContainerClass} ${shadowClass} ${
isSelected && (!selectedContext?.tablePart || selectedContext?.tablePart === 'table')
? 'ring-2 ring-indigo-500/80 ring-offset-2'
: ''
}`}
>
<div className="w-full overflow-x-auto">
<table className="w-full text-left border-collapse text-xs sm:text-sm">
{includeHeader && (
<thead>
<tr
onClick={(e) => {
if (editorMode !== 'edit') return;
e.stopPropagation();
const ctx: SelectedElementContext = {
element,
sectionId,
tablePart: 'header',
subItemPart: 'header',
rect: e.currentTarget.getBoundingClientRect(),
domElement: e.currentTarget as HTMLElement,
};
onSelect(ctx);
onOpenEditBox?.(ctx);
}}
style={{
backgroundColor: headerBg,
color: headerTextColor,
}}
className={`border-b border-slate-700/40 transition-colors ${
isSelected && selectedContext?.tablePart === 'header'
? 'ring-2 ring-indigo-500 ring-inset'
: ''
}`}
>
{rawHeaders.map((headerItem, colIdx) => {
const isHeaderObj = typeof headerItem === 'object' && headerItem !== null;
const headerText = isHeaderObj ? headerItem.text : String(headerItem || '');
const thBg = isHeaderObj && headerItem.backgroundColor ? headerItem.backgroundColor : undefined;
const thColor = isHeaderObj && headerItem.textColor ? headerItem.textColor : undefined;
const thAlign = isHeaderObj && headerItem.textAlign ? headerItem.textAlign : undefined;
const thWeight = isHeaderObj && headerItem.fontWeight ? headerItem.fontWeight : '600';

const isColSelected =
isSelected &&
selectedContext?.tablePart === 'header-cell' &&
selectedContext?.tableColIndex === colIdx;

return (
<th
key={colIdx}
onClick={(e) => {
if (editorMode !== 'edit') return;
e.stopPropagation();
const ctx: SelectedElementContext = {
element,
sectionId,
tablePart: 'header-cell',
tableColIndex: colIdx,
subItemPart: 'header-cell',
rect: e.currentTarget.getBoundingClientRect(),
domElement: e.currentTarget,
};
onSelect(ctx);
onOpenEditBox?.(ctx);
}}
style={{
backgroundColor: thBg,
color: thColor,
textAlign: thAlign,
fontWeight: thWeight as any,
}}
className={`${cellPaddingClass} font-semibold transition-all relative`}
>
<TableEditableText
content={headerText}
placeholder={`Header ${colIdx + 1}`}
isEditable={editorMode === 'edit'}
onUpdate={(newHtml) => handleUpdateHeader(colIdx, newHtml)}
onFocus={(e) => {
e.stopPropagation();
const ctx: SelectedElementContext = {
element,
sectionId,
tablePart: 'header-cell',
tableColIndex: colIdx,
subItemPart: 'header-cell',
rect: e.currentTarget.getBoundingClientRect(),
domElement: e.currentTarget,
};
onSelect(ctx);
}}
onClick={(e) => {
e.stopPropagation();
const ctx: SelectedElementContext = {
element,
sectionId,
tablePart: 'header-cell',
tableColIndex: colIdx,
subItemPart: 'header-cell',
rect: e.currentTarget.getBoundingClientRect(),
domElement: e.currentTarget,
};
onSelect(ctx);
onOpenEditBox?.(ctx);
}}
className="w-full"
/>
</th>
);
})}
</tr>
</thead>
)}

<tbody className="divide-y divide-slate-700/30">
{rawRows.map((row, rowIdx) => {
const isEven = rowIdx % 2 === 1;
const zebraBg =
zebraStripes && isEven
? isLight
? '#f8fafc'
: 'rgba(255, 255, 255, 0.03)'
: undefined;

return (
<tr
key={rowIdx}
style={{ backgroundColor: zebraBg }}
className="hover:bg-slate-500/5 transition-colors"
>
{row.map((cell, colIdx) => {
const isCellObj = typeof cell === 'object' && cell !== null;
const cellText = isCellObj ? cell.text || '' : String(cell !== undefined ? cell : '');

const cellBg = isCellObj && cell.backgroundColor ? cell.backgroundColor : undefined;
const cellColor = isCellObj && cell.textColor ? cell.textColor : undefined;
const cellAlign = isCellObj && cell.textAlign ? cell.textAlign : 'left';
const cellWeight = isCellObj && cell.fontWeight ? cell.fontWeight : undefined;
const cellFontSize = isCellObj && cell.fontSize ? `${cell.fontSize}px` : undefined;

const isCellSelected =
isSelected &&
(selectedContext?.tablePart === 'cell' || selectedContext?.tablePart === 'cell-text') &&
selectedContext?.tableRowIndex === rowIdx &&
selectedContext?.tableColIndex === colIdx;

const isTextActive =
isSelected &&
selectedContext?.tablePart === 'cell-text' &&
selectedContext?.tableRowIndex === rowIdx &&
selectedContext?.tableColIndex === colIdx;

return (
<td
key={colIdx}
onClick={(e) => {
if (editorMode !== 'edit') return;
e.stopPropagation();
const ctx: SelectedElementContext = {
element,
sectionId,
tablePart: 'cell',
tableRowIndex: rowIdx,
tableColIndex: colIdx,
subItemPart: 'cell',
rect: e.currentTarget.getBoundingClientRect(),
domElement: e.currentTarget,
};
onSelect(ctx);
onOpenEditBox?.(ctx);
}}
style={{
backgroundColor: cellBg,
color: cellColor,
textAlign: cellAlign as any,
fontWeight: cellWeight as any,
fontSize: cellFontSize,
}}
className={`${cellPaddingClass} transition-all relative`}
>
{isCellObj && cell.isCheck ? (
<span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs">
✓
</span>
) : isCellObj && cell.isCross ? (
<span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-700 text-slate-400 text-xs">
✕
</span>
) : isCellObj && cell.badge ? (
<span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono text-[11px] font-medium">
{cell.badge}
</span>
) : (
<TableEditableText
content={cellText}
placeholder={`Cell ${rowIdx * row.length + colIdx + 1}`}
isEditable={editorMode === 'edit'}
onUpdate={(newHtml) => handleUpdateCellText(rowIdx, colIdx, newHtml)}
onFocus={(e) => {
e.stopPropagation();
const ctx: SelectedElementContext = {
element,
sectionId,
tablePart: 'cell-text',
tableRowIndex: rowIdx,
tableColIndex: colIdx,
subItemPart: 'cell-text',
rect: e.currentTarget.getBoundingClientRect(),
domElement: e.currentTarget,
};
onSelect(ctx);
}}
onClick={(e) => {
e.stopPropagation();
const ctx: SelectedElementContext = {
element,
sectionId,
tablePart: 'cell-text',
tableRowIndex: rowIdx,
tableColIndex: colIdx,
subItemPart: 'cell-text',
rect: e.currentTarget.getBoundingClientRect(),
domElement: e.currentTarget,
};
onSelect(ctx);
onOpenEditBox?.(ctx);
}}
className="w-full inline-block"
/>
)}
</td>
);
})}
</tr>
);
})}
</tbody>
</table>
</div>
</div>
);
};
