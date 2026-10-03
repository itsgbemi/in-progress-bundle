import React, { useState } from 'react';
import { Plus, Trash2, ChevronRight, Columns, Rows, Split, AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Italic, Underline, Strikethrough, List, ListOrdered, Indent, Outdent, ArrowLeft, Paintbrush } from 'lucide-react';
import { WebsiteElement, TableData, TableCellItem, TableHeaderItem } from '../../types';
import { TYPEFACE_OPTIONS } from '../../data/presetSamples';
import { ElementInspectorProps, getInspectorStyles } from './PropertiesCommon';
import { CheckCircle } from '../common';
export const TableProperties: React.FC<ElementInspectorProps> = ({ selectedContext, onUpdateElement, onSelectContext, onDeleteElement, uiTheme = 'dark', viewportMode = 'desktop', }) => {
    const [cellSubView, setCellSubView] = useState<'menu' | 'style'>('menu');
    const [cellActiveTab, setCellActiveTab] = useState<'color' | 'text' | 'border'>('color');
    const isLight = uiTheme === 'light';
    const { inputClass, selectClass, labelClass } = getInspectorStyles(isLight);
    if (!selectedContext)
        return null;
    const { element } = selectedContext;
    const s = element.styles || {};
    const tableData: TableData = element.tableData || {
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
    const updateTableData = (newTableData: Partial<TableData>) => {
        const updated: WebsiteElement = {
            ...element,
            tableData: {
                ...tableData,
                ...newTableData,
            },
        };
        onUpdateElement(updated);
    };
    const updateStyle = (key: string, value: any) => {
        const updated: WebsiteElement = {
            ...element,
            styles: {
                ...(element.styles || {}),
                [key]: value,
            },
        };
        onUpdateElement(updated);
    };
    const tablePart = selectedContext.tablePart || 'table';
    const rowIndex = selectedContext.tableRowIndex ?? 0;
    const colIndex = selectedContext.tableColIndex ?? 0;
    const currentCellRaw = rawRows[rowIndex]?.[colIndex];
    const isCellObj = typeof currentCellRaw === 'object' && currentCellRaw !== null;
    const currentCell: TableCellItem = isCellObj
        ? currentCellRaw
        : { text: currentCellRaw !== undefined ? String(currentCellRaw) : '' };
    const updateSelectedCell = (cellUpdates: Partial<TableCellItem>) => {
        const newRows = rawRows.map((r) => [...r]);
        if (!newRows[rowIndex])
            return;
        const existing = newRows[rowIndex][colIndex];
        const existingObj = typeof existing === 'object' && existing !== null ? existing : { text: String(existing || '') };
        newRows[rowIndex][colIndex] = {
            ...existingObj,
            ...cellUpdates,
        };
        updateTableData({ rows: newRows });
    };
    const handleInsertColumnLeft = () => {
        const newColNum = rawHeaders.length + 1;
        const newHeaders = [...rawHeaders];
        newHeaders.splice(colIndex, 0, `Column ${newColNum}`);
        const newRows = rawRows.map((row) => {
            const copy = [...row];
            copy.splice(colIndex, 0, `Cell ${newColNum}`);
            return copy;
        });
        updateTableData({ headers: newHeaders, rows: newRows });
        onSelectContext?.({
            ...selectedContext,
            tableColIndex: colIndex,
        });
    };
    const handleInsertColumnRight = () => {
        const targetCol = colIndex + 1;
        const newColNum = rawHeaders.length + 1;
        const newHeaders = [...rawHeaders];
        newHeaders.splice(targetCol, 0, `Column ${newColNum}`);
        const newRows = rawRows.map((row) => {
            const copy = [...row];
            copy.splice(targetCol, 0, `Cell ${newColNum}`);
            return copy;
        });
        updateTableData({ headers: newHeaders, rows: newRows });
        onSelectContext?.({
            ...selectedContext,
            tableColIndex: targetCol,
        });
    };
    const handleInsertRowAbove = () => {
        const newRow = rawHeaders.map((_, i) => `Cell ${rawRows.length * rawHeaders.length + i + 1}`);
        const newRows = [...rawRows];
        newRows.splice(rowIndex, 0, newRow);
        updateTableData({ rows: newRows });
        onSelectContext?.({
            ...selectedContext,
            tableRowIndex: rowIndex,
        });
    };
    const handleInsertRowBelow = () => {
        const targetRow = rowIndex + 1;
        const newRow = rawHeaders.map((_, i) => `Cell ${rawRows.length * rawHeaders.length + i + 1}`);
        const newRows = [...rawRows];
        newRows.splice(targetRow, 0, newRow);
        updateTableData({ rows: newRows });
        onSelectContext?.({
            ...selectedContext,
            tableRowIndex: targetRow,
        });
    };
    const handleDeleteColumn = (targetCol = colIndex) => {
        if (rawHeaders.length <= 1)
            return;
        const newHeaders = rawHeaders.filter((_, idx) => idx !== targetCol);
        const newRows = rawRows.map((row) => row.filter((_, idx) => idx !== targetCol));
        updateTableData({ headers: newHeaders, rows: newRows });
        const nextCol = Math.max(0, Math.min(targetCol, newHeaders.length - 1));
        onSelectContext?.({
            ...selectedContext,
            tableColIndex: nextCol,
        });
    };
    const handleDeleteRow = (targetRow = rowIndex) => {
        if (rawRows.length <= 1)
            return;
        const newRows = rawRows.filter((_, idx) => idx !== targetRow);
        updateTableData({ rows: newRows });
        const nextRow = Math.max(0, Math.min(targetRow, newRows.length - 1));
        onSelectContext?.({
            ...selectedContext,
            tableRowIndex: nextRow,
        });
    };
    const handleSplitCell = () => {
        handleInsertColumnRight();
    };
    const switchSelection = (part: 'table' | 'header' | 'header-cell' | 'cell' | 'cell-text') => {
        onSelectContext?.({
            ...selectedContext,
            tablePart: part,
            subItemPart: part,
        });
    };
    if (tablePart === 'cell') {
        if (cellSubView === 'style') {
            return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
          <div className="flex items-center justify-between pb-2 border-b border-slate-700/30">
            <button type="button" onClick={() => setCellSubView('menu')} className="flex items-center gap-1 text-slate-400 hover:text-indigo-400 font-medium transition-colors cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5"/>
              <span>Back to Cell Options</span>
            </button>
            <span className="text-[11px] font-mono text-indigo-400 font-medium">
              R{rowIndex + 1} : C{colIndex + 1}
            </span>
          </div>

          <div className={`flex rounded-xl p-1 border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
            {(['color', 'text', 'border'] as const).map((tab) => (<button key={tab} type="button" onClick={() => setCellActiveTab(tab)} className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg capitalize transition-all cursor-pointer ${cellActiveTab === tab
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'}`}>
                {tab}
              </button>))}
          </div>

          {cellActiveTab === 'color' && (<div className="space-y-3">
              <div>
                <label className={labelClass}>Cell Background Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={currentCell.backgroundColor || (isLight ? '#ffffff' : '#1e293b')} onChange={(e) => updateSelectedCell({ backgroundColor: e.target.value })} className="w-8 h-8 rounded-lg border border-slate-700 cursor-pointer p-0 bg-transparent shrink-0"/>
                  <input type="text" value={currentCell.backgroundColor || ''} onChange={(e) => updateSelectedCell({ backgroundColor: e.target.value })} placeholder="Transparent" className={`flex-1 ${inputClass}`}/>
                  {currentCell.backgroundColor && (<button type="button" onClick={() => updateSelectedCell({ backgroundColor: undefined })} className="px-2 py-1.5 text-[10px] rounded-lg border border-slate-700 text-slate-400 hover:text-white">
                      Clear
                    </button>)}
                </div>
              </div>

              <div>
                <label className={labelClass}>Cell Text Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={currentCell.textColor || (isLight ? '#0f172a' : '#f8fafc')} onChange={(e) => updateSelectedCell({ textColor: e.target.value })} className="w-8 h-8 rounded-lg border border-slate-700 cursor-pointer p-0 bg-transparent shrink-0"/>
                  <input type="text" value={currentCell.textColor || ''} onChange={(e) => updateSelectedCell({ textColor: e.target.value })} placeholder="Inherit" className={`flex-1 ${inputClass}`}/>
                </div>
              </div>

              <div>
                <label className={labelClass}>Quick Color Presets</label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                        { bg: '#f8fafc', text: '#0f172a', name: 'Slate' },
                        { bg: '#eff6ff', text: '#1e40af', name: 'Blue' },
                        { bg: '#ecfdf5', text: '#065f46', name: 'Emerald' },
                        { bg: '#fef3c7', text: '#92400e', name: 'Amber' },
                        { bg: '#fdf2f8', text: '#9d174d', name: 'Pink' },
                        { bg: '#1e293b', text: '#f8fafc', name: 'Dark' },
                    ].map((p) => (<button key={p.name} type="button" onClick={() => updateSelectedCell({ backgroundColor: p.bg, textColor: p.text })} style={{ backgroundColor: p.bg, color: p.text }} className="px-2.5 py-1 rounded-md text-[10px] font-medium border border-slate-300 dark:border-slate-700 shadow-2xs hover:scale-105 transition-transform cursor-pointer">
                      {p.name}
                    </button>))}
                </div>
              </div>
            </div>)}

          {cellActiveTab === 'text' && (<div className="space-y-3">
              <div>
                <label className={labelClass}>Text Alignment</label>
                <div className="grid grid-cols-4 gap-1">
                  {[
                        { val: 'left', icon: <AlignLeft className="w-3.5 h-3.5"/> },
                        { val: 'center', icon: <AlignCenter className="w-3.5 h-3.5"/> },
                        { val: 'right', icon: <AlignRight className="w-3.5 h-3.5"/> },
                        { val: 'justify', icon: <AlignJustify className="w-3.5 h-3.5"/> },
                    ].map((a) => (<button key={a.val} type="button" onClick={() => updateSelectedCell({ textAlign: a.val as any })} className={`p-2 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${(currentCell.textAlign || 'left') === a.val
                            ? 'text-indigo-600 dark:text-indigo-400 bg-transparent'
                            : isLight ? 'text-slate-700 hover:bg-slate-200' : 'text-slate-300 hover:bg-slate-800'}`} title={`Align ${a.val}`}>
                      {a.icon}
                    </button>))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Font Weight</label>
                <select value={currentCell.fontWeight || 'normal'} onChange={(e) => updateSelectedCell({ fontWeight: e.target.value })} className={selectClass}>
                  <option value="300">Light (300)</option>
                  <option value="400">Regular (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semi Bold (600)</option>
                  <option value="700">Bold (700)</option>
                </select>
              </div>

              <div className="pt-2">
                <button type="button" onClick={() => switchSelection('cell-text')} className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                  <span>Open Full Text Inspector</span>
                  <ChevronRight className="w-3.5 h-3.5"/>
                </button>
              </div>
            </div>)}

          {cellActiveTab === 'border' && (<div className="space-y-3">
              <div>
                <label className={labelClass}>Border Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={currentCell.borderColor || (isLight ? '#e2e8f0' : '#334155')} onChange={(e) => updateSelectedCell({ borderColor: e.target.value })} className="w-8 h-8 rounded-lg border border-slate-700 cursor-pointer p-0 bg-transparent shrink-0"/>
                  <input type="text" value={currentCell.borderColor || ''} onChange={(e) => updateSelectedCell({ borderColor: e.target.value })} placeholder="Default" className={`flex-1 ${inputClass}`}/>
                </div>
              </div>

              <div>
                <label className={labelClass}>Border Width ({currentCell.borderWidth || 0}px)</label>
                <input type="range" min={0} max={4} value={currentCell.borderWidth || 0} onChange={(e) => updateSelectedCell({ borderWidth: Number(e.target.value) })} className="w-full accent-indigo-500"/>
              </div>
            </div>)}
        </div>);
        }
        return (<div className={`space-y-3 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
        <div className="flex items-center justify-between pb-2 border-b border-slate-700/30">
          <div>
            <div className="font-medium text-xs">Selected Cell</div>
            <div className="text-[10px] text-slate-400">
              Row {rowIndex + 1} of {rawRows.length}, Column {colIndex + 1} of {rawHeaders.length}
            </div>
          </div>
          <button type="button" onClick={() => switchSelection('table')} className="text-[11px] text-indigo-400 hover:underline cursor-pointer">
            Table Settings
          </button>
        </div>

        <div className="space-y-1 pt-1">
          <button type="button" onClick={() => setCellSubView('style')} className={`w-full flex items-center justify-between py-2 px-2.5 rounded-lg transition-colors cursor-pointer ${isLight
                ? 'text-slate-800 hover:bg-slate-100/70'
                : 'text-slate-200 hover:bg-slate-800/60'}`}>
            <div className="flex items-center gap-2.5 font-normal text-[11.5px]">
              <Paintbrush className="w-4 h-4 text-current stroke-[1.25]"/>
              <span>Style Cell</span>
            </div>
            <ChevronRight className="w-4 h-4 text-current opacity-70 stroke-[1.25]"/>
          </button>

          <button type="button" onClick={handleSplitCell} className={`w-full flex items-center justify-between py-2 px-2.5 rounded-lg transition-colors cursor-pointer ${isLight
                ? 'text-slate-800 hover:bg-slate-100/70'
                : 'text-slate-200 hover:bg-slate-800/60'}`}>
            <div className="flex items-center gap-2.5 font-normal text-[11.5px]">
              <Split className="w-4 h-4 text-current stroke-[1.25]"/>
              <span>Split Cell</span>
            </div>
          </button>

          <button type="button" onClick={handleInsertColumnLeft} className={`w-full flex items-center justify-between py-2 px-2.5 rounded-lg transition-colors cursor-pointer ${isLight
                ? 'text-slate-800 hover:bg-slate-100/70'
                : 'text-slate-200 hover:bg-slate-800/60'}`}>
            <div className="flex items-center gap-2.5 font-normal text-[11.5px]">
              <Columns className="w-4 h-4 text-current stroke-[1.25]"/>
              <span>Insert Column Left</span>
            </div>
          </button>

          <button type="button" onClick={handleInsertColumnRight} className={`w-full flex items-center justify-between py-2 px-2.5 rounded-lg transition-colors cursor-pointer ${isLight
                ? 'text-slate-800 hover:bg-slate-100/70'
                : 'text-slate-200 hover:bg-slate-800/60'}`}>
            <div className="flex items-center gap-2.5 font-normal text-[11.5px]">
              <Columns className="w-4 h-4 text-current stroke-[1.25]"/>
              <span>Insert Column Right</span>
            </div>
          </button>

          <button type="button" onClick={handleInsertRowAbove} className={`w-full flex items-center justify-between py-2 px-2.5 rounded-lg transition-colors cursor-pointer ${isLight
                ? 'text-slate-800 hover:bg-slate-100/70'
                : 'text-slate-200 hover:bg-slate-800/60'}`}>
            <div className="flex items-center gap-2.5 font-normal text-[11.5px]">
              <Rows className="w-4 h-4 text-current stroke-[1.25]"/>
              <span>Insert Row Above</span>
            </div>
          </button>

          <button type="button" onClick={handleInsertRowBelow} className={`w-full flex items-center justify-between py-2 px-2.5 rounded-lg transition-colors cursor-pointer ${isLight
                ? 'text-slate-800 hover:bg-slate-100/70'
                : 'text-slate-200 hover:bg-slate-800/60'}`}>
            <div className="flex items-center gap-2.5 font-normal text-[11.5px]">
              <Rows className="w-4 h-4 text-current stroke-[1.25]"/>
              <span>Insert Row Below</span>
            </div>
          </button>

          <button type="button" disabled={rawHeaders.length <= 1} onClick={() => handleDeleteColumn()} className={`w-full flex items-center justify-between py-2 px-2.5 rounded-lg transition-colors cursor-pointer ${rawHeaders.length <= 1
                ? 'opacity-40 cursor-not-allowed'
                : isLight
                    ? 'text-rose-700 hover:bg-rose-50'
                    : 'text-rose-400 hover:bg-rose-950/30'}`}>
            <div className="flex items-center gap-2.5 font-normal text-[11.5px]">
              <Trash2 className="w-4 h-4 text-current stroke-[1.25]"/>
              <span>Delete Column ({colIndex + 1})</span>
            </div>
          </button>

          <button type="button" disabled={rawRows.length <= 1} onClick={() => handleDeleteRow()} className={`w-full flex items-center justify-between py-2 px-2.5 rounded-lg transition-colors cursor-pointer ${rawRows.length <= 1
                ? 'opacity-40 cursor-not-allowed'
                : isLight
                    ? 'text-rose-700 hover:bg-rose-50'
                    : 'text-rose-400 hover:bg-rose-950/30'}`}>
            <div className="flex items-center gap-2.5 font-normal text-[11.5px]">
              <Trash2 className="w-4 h-4 text-current stroke-[1.25]"/>
              <span>Delete Row ({rowIndex + 1})</span>
            </div>
          </button>
        </div>
      </div>);
    }
    if (tablePart === 'cell-text') {
        const textVal = currentCell.text || '';
        const applyCellFormat = (command: string, value: any = null) => {
            document.execCommand(command, false, value);
        };
        return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
        <div className="flex items-center justify-between pb-2 border-b border-slate-700/30">
          <button type="button" onClick={() => switchSelection('cell')} className="flex items-center gap-1 text-slate-400 hover:text-indigo-400 font-medium transition-colors cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5"/>
            <span>Cell Options</span>
          </button>
          <span className="text-[11px] font-mono text-indigo-400 font-medium">
            R{rowIndex + 1} : C{colIndex + 1}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1 pb-1">
          <button type="button" onClick={() => {
                applyCellFormat('bold');
                updateSelectedCell({ fontWeight: currentCell.fontWeight === '700' ? '400' : '700' });
            }} className={`p-1.5 rounded-lg transition-colors cursor-pointer ${currentCell.fontWeight === '700' || currentCell.fontWeight === 'bold'
                ? 'text-indigo-600 dark:text-indigo-400 bg-transparent'
                : isLight ? 'text-slate-700 hover:bg-slate-200' : 'text-slate-300 hover:bg-slate-800'}`} title="Bold">
            <Bold className="w-3.5 h-3.5"/>
          </button>

          <button type="button" onClick={() => applyCellFormat('italic')} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-transparent transition-colors cursor-pointer" title="Italic">
            <Italic className="w-3.5 h-3.5"/>
          </button>

          <button type="button" onClick={() => applyCellFormat('underline')} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-transparent transition-colors cursor-pointer" title="Underline">
            <Underline className="w-3.5 h-3.5"/>
          </button>

          <button type="button" onClick={() => applyCellFormat('strikeThrough')} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-transparent transition-colors cursor-pointer" title="Strikethrough">
            <Strikethrough className="w-3.5 h-3.5"/>
          </button>

          <div className="h-4 w-px bg-slate-700/30 my-auto mx-0.5 shrink-0"/>

          <button type="button" onClick={() => applyCellFormat('insertUnorderedList')} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-transparent transition-colors cursor-pointer" title="Bullet List">
            <List className="w-3.5 h-3.5"/>
          </button>

          <button type="button" onClick={() => applyCellFormat('insertOrderedList')} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-transparent transition-colors cursor-pointer" title="Numbered List">
            <ListOrdered className="w-3.5 h-3.5"/>
          </button>

          <button type="button" onClick={() => applyCellFormat('outdent')} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-transparent transition-colors cursor-pointer" title="Outdent">
            <Outdent className="w-3.5 h-3.5"/>
          </button>

          <button type="button" onClick={() => applyCellFormat('indent')} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-transparent transition-colors cursor-pointer" title="Indent">
            <Indent className="w-3.5 h-3.5"/>
          </button>

          <div className="h-4 w-px bg-slate-700/30 my-auto mx-0.5 shrink-0"/>

          {[
                { val: 'left', icon: <AlignLeft className="w-3.5 h-3.5"/> },
                { val: 'center', icon: <AlignCenter className="w-3.5 h-3.5"/> },
                { val: 'right', icon: <AlignRight className="w-3.5 h-3.5"/> },
            ].map((a) => (<button key={a.val} type="button" onClick={() => updateSelectedCell({ textAlign: a.val as any })} className={`p-1.5 rounded-lg transition-colors cursor-pointer ${(currentCell.textAlign || 'left') === a.val
                    ? 'text-indigo-600 dark:text-indigo-400 bg-transparent'
                    : isLight ? 'text-slate-700 hover:bg-slate-200' : 'text-slate-300 hover:bg-slate-800'}`} title={`Align ${a.val}`}>
              {a.icon}
            </button>))}
        </div>

        <div>
          <label className={labelClass}>Cell Content (HTML/Text)</label>
          <textarea value={textVal} onChange={(e) => updateSelectedCell({ text: e.target.value })} rows={3} className={`w-full ${inputClass} resize-y font-normal`} placeholder="Type cell text..."/>
        </div>

        <div>
          <label className={labelClass}>Typeface / Font Family</label>
          <select value={s.typeface || 'Plus Jakarta Sans'} onChange={(e) => updateStyle('typeface', e.target.value)} className={selectClass}>
            {TYPEFACE_OPTIONS.map((f) => (<option key={f.name} value={f.name}>
                {f.name}
              </option>))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Font Weight</label>
            <select value={currentCell.fontWeight || '400'} onChange={(e) => updateSelectedCell({ fontWeight: e.target.value })} className={selectClass}>
              <option value="300">Light (300)</option>
              <option value="400">Regular (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semi Bold (600)</option>
              <option value="700">Bold (700)</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Text Color</label>
            <div className="flex items-center gap-1.5">
              <input type="color" value={currentCell.textColor || (isLight ? '#0f172a' : '#f8fafc')} onChange={(e) => updateSelectedCell({ textColor: e.target.value })} className="w-7 h-7 rounded border border-slate-700 cursor-pointer p-0 bg-transparent shrink-0"/>
              <input type="text" value={currentCell.textColor || ''} onChange={(e) => updateSelectedCell({ textColor: e.target.value })} placeholder="Default" className={`flex-1 ${inputClass} py-1`}/>
            </div>
          </div>
        </div>
      </div>);
    }
    if (tablePart === 'header' || tablePart === 'header-cell') {
        const colHdr = rawHeaders[colIndex];
        const isColObj = typeof colHdr === 'object' && colHdr !== null;
        const colText = isColObj ? colHdr.text : String(colHdr || '');
        const updateColHeader = (updates: Partial<TableHeaderItem> | string) => {
            const newHeaders = [...rawHeaders];
            if (typeof updates === 'string') {
                newHeaders[colIndex] = updates;
            }
            else {
                const curr = newHeaders[colIndex];
                const currObj = typeof curr === 'object' && curr !== null ? curr : { text: String(curr || '') };
                newHeaders[colIndex] = { ...currObj, ...updates };
            }
            updateTableData({ headers: newHeaders });
        };
        return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
        <div className="flex items-center justify-between pb-2 border-b border-slate-700/30">
          <div>
            <div className="font-medium text-xs">Table Header</div>
            <div className="text-[10px] text-slate-400">
              {tablePart === 'header-cell' ? `Column ${colIndex + 1} Header` : 'Global Header Settings'}
            </div>
          </div>
          <button type="button" onClick={() => switchSelection('table')} className="text-[11px] text-indigo-400 hover:underline cursor-pointer">
            Table Settings
          </button>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-700/40 bg-slate-800/30">
          <div>
            <div className="font-medium text-xs">Include Table Header</div>
            <div className="text-[10px] text-slate-400">Show or hide header row</div>
          </div>
          <CheckCircle
            checked={tableData.includeHeader !== false}
            onChange={(checked) => updateTableData({ includeHeader: checked })}
            size="sm"
            isLight={isLight}
          />
        </div>

        {tablePart === 'header-cell' && (<div className="space-y-2 pt-1">
            <label className={labelClass}>Column Title</label>
            <input type="text" value={colText} onChange={(e) => updateColHeader(e.target.value)} placeholder="Header title..." className={inputClass}/>
          </div>)}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Header BG Color</label>
            <div className="flex items-center gap-1.5">
              <input type="color" value={tableData.headerBg || (isLight ? '#f1f5f9' : '#0f172a')} onChange={(e) => updateTableData({ headerBg: e.target.value })} className="w-7 h-7 rounded border border-slate-700 cursor-pointer p-0 bg-transparent shrink-0"/>
              <input type="text" value={tableData.headerBg || ''} onChange={(e) => updateTableData({ headerBg: e.target.value })} placeholder="Default" className={`flex-1 ${inputClass} py-1`}/>
            </div>
          </div>

          <div>
            <label className={labelClass}>Header Text Color</label>
            <div className="flex items-center gap-1.5">
              <input type="color" value={tableData.headerTextColor || (isLight ? '#0f172a' : '#f8fafc')} onChange={(e) => updateTableData({ headerTextColor: e.target.value })} className="w-7 h-7 rounded border border-slate-700 cursor-pointer p-0 bg-transparent shrink-0"/>
              <input type="text" value={tableData.headerTextColor || ''} onChange={(e) => updateTableData({ headerTextColor: e.target.value })} placeholder="Default" className={`flex-1 ${inputClass} py-1`}/>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-700/30">
          <label className={labelClass}>Column Controls</label>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={handleInsertColumnLeft} className={`py-2 px-3 rounded-xl border text-center font-medium transition-colors cursor-pointer ${isLight ? 'bg-slate-50 hover:bg-slate-100 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 border-slate-700'}`}>
              Insert Col Left
            </button>
            <button type="button" onClick={handleInsertColumnRight} className={`py-2 px-3 rounded-xl border text-center font-medium transition-colors cursor-pointer ${isLight ? 'bg-slate-50 hover:bg-slate-100 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 border-slate-700'}`}>
              Insert Col Right
            </button>
          </div>
          {rawHeaders.length > 1 && (<button type="button" onClick={() => handleDeleteColumn()} className="w-full py-2 px-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-center font-medium transition-colors cursor-pointer mt-1">
              Delete Column ({colIndex + 1})
            </button>)}
        </div>
      </div>);
    }
    return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
      <div className="flex items-center gap-2">
        <button type="button" onClick={handleInsertRowBelow} className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all shadow-xs cursor-pointer">
          <Plus className="w-3.5 h-3.5"/>
          <span>Add Row</span>
        </button>
        <button type="button" onClick={handleInsertColumnRight} className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-medium border transition-all cursor-pointer ${isLight
            ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
            : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'}`}>
          <Plus className="w-3.5 h-3.5"/>
          <span>Add Column</span>
        </button>
      </div>

      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-700/40 bg-slate-800/30">
          <div>
            <div className="font-medium text-xs">Include Table Header</div>
            <div className="text-[10px] text-slate-400">Display header row with titles</div>
          </div>
          <CheckCircle
            checked={tableData.includeHeader !== false}
            onChange={(checked) => updateTableData({ includeHeader: checked })}
            size="sm"
            isLight={isLight}
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-700/40 bg-slate-800/30">
          <div>
            <div className="font-medium text-xs">Zebra Alternating Rows</div>
            <div className="text-[10px] text-slate-400">Subtle background tint on even rows</div>
          </div>
          <CheckCircle
            checked={!!tableData.zebraStripes}
            onChange={(checked) => updateTableData({ zebraStripes: checked })}
            size="sm"
            isLight={isLight}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Table Alignment</label>
        <div className="grid grid-cols-4 gap-1">
          {[
            { id: 'full', label: 'Full' },
            { id: 'left', label: 'Left' },
            { id: 'center', label: 'Center' },
            { id: 'right', label: 'Right' },
        ].map((a) => (<button key={a.id} type="button" onClick={() => updateTableData({ tableAlignment: a.id as any })} className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all cursor-pointer text-center ${(tableData.tableAlignment || 'full') === a.id
                ? 'bg-indigo-600 text-white'
                : isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'}`}>
              {a.label}
            </button>))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Cell Padding Density</label>
        <div className="grid grid-cols-3 gap-1">
          {[
            { id: 'compact', label: 'Compact' },
            { id: 'normal', label: 'Normal' },
            { id: 'relaxed', label: 'Relaxed' },
        ].map((p) => (<button key={p.id} type="button" onClick={() => updateTableData({ cellPadding: p.id as any })} className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all cursor-pointer text-center ${(tableData.cellPadding || 'normal') === p.id
                ? 'bg-indigo-600 text-white'
                : isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'}`}>
              {p.label}
            </button>))}
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-700/40">
        <label className={labelClass}>Background & Colors</label>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-medium text-slate-400 block mb-1">Table Background</label>
            <div className="flex items-center gap-1.5">
              <input type="color" value={s.backgroundColor || (isLight ? '#ffffff' : '#1e293b')} onChange={(e) => updateStyle('backgroundColor', e.target.value)} className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer p-0 shrink-0"/>
              <input type="text" value={s.backgroundColor || ''} onChange={(e) => updateStyle('backgroundColor', e.target.value)} placeholder="Default" className={`flex-1 ${inputClass} text-[11px] py-1`}/>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-medium text-slate-400 block mb-1">Text Color</label>
            <div className="flex items-center gap-1.5">
              <input type="color" value={s.textColor || (isLight ? '#031738' : '#f8fafc')} onChange={(e) => updateStyle('textColor', e.target.value)} className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer p-0 shrink-0"/>
              <input type="text" value={s.textColor || ''} onChange={(e) => updateStyle('textColor', e.target.value)} placeholder="Default" className={`flex-1 ${inputClass} text-[11px] py-1`}/>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-700/40">
        <label className={labelClass}>Border Options</label>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-medium text-slate-400 block mb-1">Border Color</label>
            <div className="flex items-center gap-1.5">
              <input type="color" value={s.borderColor || (isLight ? '#e2e8f0' : '#334155')} onChange={(e) => updateStyle('borderColor', e.target.value)} className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer p-0 shrink-0"/>
              <input type="text" value={s.borderColor || ''} onChange={(e) => updateStyle('borderColor', e.target.value)} placeholder="Default" className={`flex-1 ${inputClass} text-[11px] py-1`}/>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-medium text-slate-400 block mb-1">
              Border Width ({s.borderWidth !== undefined ? s.borderWidth : 1}px)
            </label>
            <input type="range" min={0} max={6} value={s.borderWidth !== undefined ? s.borderWidth : 1} onChange={(e) => updateStyle('borderWidth', Number(e.target.value))} className="w-full accent-indigo-500"/>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-medium text-slate-400 block mb-1">
            Corner Radius ({s.borderRadius !== undefined ? s.borderRadius : 12}px)
          </label>
          <input type="range" min={0} max={24} value={s.borderRadius !== undefined ? s.borderRadius : 12} onChange={(e) => updateStyle('borderRadius', Number(e.target.value))} className="w-full accent-indigo-500"/>
        </div>
      </div>
    </div>);
};
