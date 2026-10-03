import React, { useState, useRef } from 'react';
import { Bold, Italic, Underline, Highlighter } from 'lucide-react';
import { WebsiteElement } from '../../types';
import { ElementInspectorProps, getInspectorStyles, TypographyControls } from './PropertiesCommon';
export const ListProperties: React.FC<ElementInspectorProps> = ({ selectedContext, onUpdateElement, onSelectContext, onDeleteElement, uiTheme = 'dark', viewportMode = 'desktop', }) => {
    const [activeTab, setActiveTab] = useState<'content' | 'style' | 'layout' | 'responsive'>('style');
    const listTextareaRef = useRef<HTMLTextAreaElement>(null);
    const isLight = uiTheme === 'light';
    const { inputClass, selectClass, labelClass, boxGroupClass } = getInspectorStyles(isLight);
    const updateStyle = (key: string, value: any) => {
        if (!selectedContext)
            return;
        const updatedElement: WebsiteElement = {
            ...selectedContext.element,
            styles: {
                ...(selectedContext.element.styles || {}),
                [key]: value,
            },
        };
        onUpdateElement(updatedElement);
    };
    const updateProp = (key: string, value: any) => {
        if (!selectedContext)
            return;
        const updatedElement: WebsiteElement = {
            ...selectedContext.element,
            [key]: value,
        };
        onUpdateElement(updatedElement);
    };
    const renderTypographyControls = (styles: any) => (<TypographyControls styles={styles} onUpdateStyle={updateStyle} uiTheme={uiTheme}/>);
    if (!selectedContext)
        return null;
    const { element } = selectedContext;
    const s = element.styles || {};
    const items = element.listItems || ['First list item', 'Second list item', 'Third list item'];
    const isOrdered = element.tag === 'ol' || ['numbers', 'decimal', 'decimal-leading-zero', 'alpha', 'upper-alpha', 'lower-alpha', 'roman', 'upper-roman', 'lower-roman'].includes(element.listMarkerStyle || '');
    const markerStyle = element.listMarkerStyle || (isOrdered ? 'numbers' : 'bullet');
    const checkedStates = element.listCheckedState || items.map(() => false);
    const markerColor = element.listIconColor || s.color || (isLight ? '#4f46e5' : '#818cf8');
    const spacing = element.listSpacing !== undefined ? element.listSpacing : (s.gap !== undefined ? s.gap : 10);
    const indent = s.paddingLeft !== undefined ? s.paddingLeft : (s.paddingX !== undefined ? s.paddingX : 0);
    const fontSize = s.fontSize !== undefined ? s.fontSize : 16;
    const textColor = s.color || (isLight ? '#1e293b' : '#f8fafc');
    const updateItems = (newItems: string[], newChecked?: boolean[]) => {
        onUpdateElement({
            ...element,
            listItems: newItems,
            listCheckedState: newChecked || checkedStates,
        });
    };
    const applyListTextareaFormat = (wrapperOpen: string, wrapperClose: string) => {
        const textarea = listTextareaRef.current;
        if (!textarea)
            return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentText = textarea.value;
        const selectedText = currentText.substring(start, end);
        let replacement = '';
        if (selectedText.length > 0) {
            replacement = `${wrapperOpen}${selectedText}${wrapperClose}`;
        }
        else {
            replacement = `${wrapperOpen}Sample text${wrapperClose}`;
        }
        const newText = currentText.substring(0, start) + replacement + currentText.substring(end);
        const newLines = newText.split('\n');
        updateItems(newLines);
        setTimeout(() => {
            if (textarea) {
                textarea.focus();
                const newStart = start + wrapperOpen.length;
                const newEnd = newStart + (selectedText.length || 11);
                textarea.setSelectionRange(newStart, newEnd);
            }
        }, 10);
    };
    const removeListTextareaFormat = () => {
        const textarea = listTextareaRef.current;
        if (!textarea)
            return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentText = textarea.value;
        if (start !== end) {
            const selectedText = currentText.substring(start, end);
            const cleaned = selectedText.replace(/<[^>]*>/g, '');
            const newText = currentText.substring(0, start) + cleaned + currentText.substring(end);
            updateItems(newText.split('\n'));
        }
        else {
            const cleaned = currentText.replace(/<[^>]*>/g, '');
            updateItems(cleaned.split('\n'));
        }
    };
    const ulMarkerOptions: {
        id: string;
        label: string;
        iconSample: string;
    }[] = [
        { id: 'bullet', label: 'Disc (Bullet)', iconSample: '•' },
        { id: 'circle', label: 'Circle', iconSample: '○' },
        { id: 'square', label: 'Square', iconSample: '■' },
        { id: 'checklist-empty', label: 'Checkbox (Empty)', iconSample: '☐' },
        { id: 'checklist', label: 'Checkbox (Checked)', iconSample: '☑' },
        { id: 'arrow', label: 'Arrow', iconSample: '➔' },
        { id: 'dash', label: 'Dash', iconSample: '—' },
        { id: 'star', label: 'Star', iconSample: '★' },
        { id: 'none', label: 'None', iconSample: '∅' },
    ];
    const olMarkerOptions: {
        id: string;
        label: string;
        iconSample: string;
    }[] = [
        { id: 'numbers', label: 'Decimal (1, 2, 3)', iconSample: '1.' },
        { id: 'decimal-leading-zero', label: 'Zero-Padded (01, 02)', iconSample: '01.' },
        { id: 'alpha', label: 'Upper Alpha (A, B, C)', iconSample: 'A.' },
        { id: 'lower-alpha', label: 'Lower Alpha (a, b, c)', iconSample: 'a.' },
        { id: 'roman', label: 'Upper Roman (I, II)', iconSample: 'I.' },
        { id: 'lower-roman', label: 'Lower Roman (i, ii)', iconSample: 'i.' },
        { id: 'none', label: 'None', iconSample: '∅' },
    ];
    const currentMarkerOptions = isOrdered ? olMarkerOptions : ulMarkerOptions;
    return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
        <div>
          <label className={labelClass}>List Type</label>
          <div className={`grid grid-cols-2 gap-1 ${boxGroupClass}`}>
            <button type="button" onClick={() => {
            onUpdateElement({
                ...element,
                tag: 'ul',
                listMarkerStyle: 'bullet',
            });
        }} className={`py-1.5 text-xs rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${!isOrdered
            ? 'bg-indigo-600 text-white shadow-xs'
            : isLight
                ? 'text-slate-600 hover:bg-slate-200'
                : 'text-slate-400 hover:text-white'}`}>
              <span>• Unordered List (ul)</span>
            </button>
            <button type="button" onClick={() => {
            onUpdateElement({
                ...element,
                tag: 'ol',
                listMarkerStyle: 'numbers',
            });
        }} className={`py-1.5 text-xs rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${isOrdered
            ? 'bg-indigo-600 text-white shadow-xs'
            : isLight
                ? 'text-slate-600 hover:bg-slate-200'
                : 'text-slate-400 hover:text-white'}`}>
              <span>1. Ordered List (ol)</span>
            </button>
          </div>
        </div>

        <div>
          <label className={labelClass}>{isOrdered ? 'Ordered List Style Options' : 'Unordered List Style Options'}</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mt-1">
            {currentMarkerOptions.map((opt) => (<button key={opt.id} type="button" onClick={() => onUpdateElement({ ...element, listMarkerStyle: opt.id as any })} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-left transition-all ${markerStyle === opt.id || (opt.id === 'bullet' && markerStyle === 'disc') || (opt.id === 'numbers' && markerStyle === 'decimal') || (opt.id === 'alpha' && markerStyle === 'upper-alpha') || (opt.id === 'roman' && markerStyle === 'upper-roman')
                ? 'bg-indigo-600 border-indigo-500 text-white font-semibold shadow-xs'
                : isLight
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-300'}`}>
                <span className="font-mono text-sm leading-none shrink-0 w-4 text-center">{opt.iconSample}</span>
                <span className="truncate text-[11px]">{opt.label}</span>
              </button>))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700/40 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className={labelClass}>List Content ({items.length} items)</label>
            <span className="text-[10px] text-slate-400">One item per line</span>
          </div>

          <div className={`rounded-xl border overflow-hidden transition-all ${isLight ? 'border-slate-300 bg-white' : 'border-slate-700 bg-slate-950/90'}`}>
            <div className={`px-2 py-1.5 flex items-center gap-1 border-b flex-wrap ${isLight ? 'bg-slate-100/90 border-slate-200 text-slate-700' : 'bg-slate-900/90 border-slate-800 text-slate-300'}`}>
              <button type="button" onMouseDown={(e) => {
            applyListTextareaFormat('<b>', '</b>');
        }} className={`p-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${isLight ? 'hover:bg-slate-200 text-slate-700' : 'hover:bg-slate-800 text-slate-300'}`} title="Bold (Select text & click)" aria-label="Format Bold">
                <Bold className="w-3.5 h-3.5"/>
              </button>

              <button type="button" onMouseDown={(e) => {
            applyListTextareaFormat('<i>', '</i>');
        }} className={`p-1.5 rounded-md text-xs italic font-serif transition-colors cursor-pointer ${isLight ? 'hover:bg-slate-200 text-slate-700' : 'hover:bg-slate-800 text-slate-300'}`} title="Italic (Select text & click)" aria-label="Format Italic">
                <Italic className="w-3.5 h-3.5"/>
              </button>

              <button type="button" onMouseDown={(e) => {
            applyListTextareaFormat('<u>', '</u>');
        }} className={`p-1.5 rounded-md text-xs underline transition-colors cursor-pointer ${isLight ? 'hover:bg-slate-200 text-slate-700' : 'hover:bg-slate-800 text-slate-300'}`} title="Underline (Select text & click)" aria-label="Format Underline">
                <Underline className="w-3.5 h-3.5"/>
              </button>

              <button type="button" onMouseDown={(e) => {
            applyListTextareaFormat('<s>', '</s>');
        }} className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${isLight ? 'hover:bg-slate-200 text-slate-700' : 'hover:bg-slate-800 text-slate-300'}`} title="Strikethrough" aria-label="Format Strikethrough">
                <span className="line-through text-xs font-mono font-bold">S</span>
              </button>

              <button type="button" onMouseDown={(e) => {
            applyListTextareaFormat('<mark style="background-color: #fef08a; color: #854d0e; padding: 2px 4px; border-radius: 4px;">', '</mark>');
        }} className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${isLight ? 'hover:bg-slate-200 text-slate-700' : 'hover:bg-slate-800 text-slate-300'}`} title="Highlight" aria-label="Format Highlight">
                <Highlighter className="w-3.5 h-3.5"/>
              </button>

              <div className="w-px h-3.5 bg-slate-700/40 mx-0.5"/>

              <button type="button" onMouseDown={(e) => {
            applyListTextareaFormat('<span style="color: #6366f1;">', '</span>');
        }} className="w-4 h-4 rounded-full bg-indigo-500 hover:scale-110 transition-transform cursor-pointer" title="Indigo Text Color"/>
              <button type="button" onMouseDown={(e) => {
            applyListTextareaFormat('<span style="color: #10b981;">', '</span>');
        }} className="w-4 h-4 rounded-full bg-emerald-500 hover:scale-110 transition-transform cursor-pointer" title="Emerald Text Color"/>
              <button type="button" onMouseDown={(e) => {
            applyListTextareaFormat('<span style="color: #f59e0b;">', '</span>');
        }} className="w-4 h-4 rounded-full bg-amber-500 hover:scale-110 transition-transform cursor-pointer" title="Amber Text Color"/>
              <button type="button" onMouseDown={(e) => {
            applyListTextareaFormat('<span style="color: #ef4444;">', '</span>');
        }} className="w-4 h-4 rounded-full bg-rose-500 hover:scale-110 transition-transform cursor-pointer" title="Rose Text Color"/>

              <div className="w-px h-3.5 bg-slate-700/40 mx-0.5"/>

              <button type="button" onMouseDown={(e) => {
            removeListTextareaFormat();
        }} className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${isLight ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-slate-800 text-slate-400'}`} title="Clear Formatting">
                Clear Format
              </button>
            </div>

            <textarea ref={listTextareaRef} rows={8} value={items.join('\n')} onChange={(e) => {
            const lines = e.target.value.split('\n');
            updateItems(lines);
        }} className={`w-full p-3 font-sans text-xs leading-relaxed focus:outline-none resize-y min-h-[170px] ${isLight ? 'bg-white text-slate-900 placeholder:text-slate-400' : 'bg-slate-950 text-slate-100 placeholder:text-slate-600'}`} placeholder="Enter list items (one per line)..."/>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Tip: Press Enter to create a new list item. Select any text to apply bold, italic, color or highlights using the formatting toolbar.
          </p>
        </div>

        <div className="pt-2 border-t border-slate-700/40 grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Left Indent</label>
              <span className="text-[10px] font-mono text-indigo-400">{indent}px</span>
            </div>
            <input type="range" min={0} max={64} step={4} value={indent} onChange={(e) => {
            const val = Number(e.target.value);
            onUpdateElement({
                ...element,
                styles: {
                    ...(element.styles || {}),
                    paddingLeft: val,
                    paddingX: val,
                },
            });
        }} className="w-full accent-indigo-500 cursor-pointer"/>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Item Spacing (Gap)</label>
              <span className="text-[10px] font-mono text-indigo-400">{spacing}px</span>
            </div>
            <input type="range" min={0} max={32} step={2} value={spacing} onChange={(e) => {
            const val = Number(e.target.value);
            onUpdateElement({
                ...element,
                listSpacing: val,
                styles: { ...(element.styles || {}), gap: val },
            });
        }} className="w-full accent-indigo-500 cursor-pointer"/>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Marker / Icon Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={markerColor.startsWith('#') ? markerColor : '#4f46e5'} onChange={(e) => onUpdateElement({ ...element, listIconColor: e.target.value })} className="w-8 h-8 rounded border bg-transparent cursor-pointer shrink-0"/>
              <input type="text" value={markerColor} onChange={(e) => onUpdateElement({ ...element, listIconColor: e.target.value })} className={`${inputClass} font-mono text-xs`}/>
            </div>
          </div>

          <div>
            <label className={labelClass}>Text Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={textColor.startsWith('#') ? textColor : '#ffffff'} onChange={(e) => updateStyle('color', e.target.value)} className="w-8 h-8 rounded border bg-transparent cursor-pointer shrink-0"/>
              <input type="text" value={textColor} onChange={(e) => updateStyle('color', e.target.value)} className={`${inputClass} font-mono text-xs`}/>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={labelClass}>Text Font Size</label>
            <span className="text-[10px] font-mono text-indigo-400">{fontSize}px</span>
          </div>
          <input type="range" min={12} max={32} step={1} value={fontSize} onChange={(e) => updateStyle('fontSize', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
        </div>

        <div className="pt-2 border-t border-slate-700/40 grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Max Width</label>
            <select value={s.maxWidth || 'none'} onChange={(e) => updateStyle('maxWidth', e.target.value)} className={selectClass}>
              <option value="none">Full / Fit (None)</option>
              <option value="sm">Small (384px)</option>
              <option value="md">Medium (448px)</option>
              <option value="lg">Large (512px)</option>
              <option value="xl">Extra Large (576px)</option>
              <option value="2xl">2XL (672px)</option>
              <option value="3xl">3XL (768px)</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Block Alignment</label>
            <div className={`grid grid-cols-3 gap-1 ${boxGroupClass}`}>
              {[
            { id: 'left', label: 'Left' },
            { id: 'center', label: 'Center' },
            { id: 'right', label: 'Right' },
        ].map((al) => (<button key={al.id} type="button" onClick={() => updateStyle('marginAuto', al.id)} className={`py-1 text-[11px] rounded font-semibold transition-all ${(s.marginAuto === al.id || (al.id === 'center' && s.marginAuto === true))
                ? 'bg-indigo-600 text-white shadow-xs'
                : isLight
                    ? 'text-slate-600 hover:bg-slate-200'
                    : 'text-slate-400 hover:text-white'}`}>
                  {al.label}
                </button>))}
            </div>
          </div>
        </div>
      </div>);
};
