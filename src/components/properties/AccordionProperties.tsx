import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { WebsiteElement, TextTag } from '../../types';
import { TYPEFACE_OPTIONS } from '../../data/presetSamples';
import { RichTextarea } from '../RichTextarea';
import { ElementInspectorProps, getInspectorStyles, TypographyControls } from './PropertiesCommon';
export const AccordionProperties: React.FC<ElementInspectorProps> = ({ selectedContext, onUpdateElement, onSelectContext, onDeleteElement, uiTheme = 'dark', viewportMode = 'desktop', }) => {
    const [activeTab, setActiveTab] = useState<'content' | 'style' | 'layout' | 'responsive'>('style');
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
    const renderAccordionProperties = () => {
        if (!selectedContext)
            return null;
        const { element } = selectedContext;
        const s = element.styles || {};
        const items = element.accordionItems || [
            { title: 'Accordion Item 1', content: 'Content for the first item.' },
            { title: 'Accordion Item 2', content: 'Content for the second item.' },
        ];
        const iconStyle = element.accordionIconStyle || 'chevron';
        const itemBg = element.accordionItemBg || s.backgroundColor || 'transparent';
        const borderColor = element.accordionItemBorderColor || s.borderColor || (isLight ? '#e2e8f0' : '#334155');
        const borderRadius = s.borderRadius !== undefined ? s.borderRadius : 10;
        const spacing = s.gap !== undefined ? s.gap : 10;
        const updateAccordionItems = (newItems: {
            title: string;
            content: string;
            isOpen?: boolean;
        }[]) => {
            onUpdateElement({
                ...element,
                accordionItems: newItems,
            });
        };
        const handleAddItem = () => {
            const newItems = [
                ...items,
                {
                    title: `Frequently Asked Question ${items.length + 1}`,
                    content: 'Add your detailed explanation, guidelines, or answers here.',
                    isOpen: false,
                },
            ];
            updateAccordionItems(newItems);
        };
        const handleRemoveItem = (idx: number) => {
            if (items.length <= 1)
                return;
            const newItems = items.filter((_, i) => i !== idx);
            updateAccordionItems(newItems);
        };
        const handleMoveItem = (idx: number, dir: 'up' | 'down') => {
            const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
            if (targetIdx < 0 || targetIdx >= items.length)
                return;
            const newItems = [...items];
            const temp = newItems[idx];
            newItems[idx] = newItems[targetIdx];
            newItems[targetIdx] = temp;
            updateAccordionItems(newItems);
        };
        return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
        <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${isLight ? 'bg-indigo-50/60 border-indigo-200' : 'bg-indigo-950/30 border-indigo-800/60'}`}>
          <div>
            <span className="font-bold text-indigo-400 block mb-0.5">Accordion Container</span>
            <span className="text-[11px] text-slate-400">Total items: {items.length}. Select any heading or text directly to edit.</span>
          </div>
          <button type="button" onClick={handleAddItem} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-xs cursor-pointer shrink-0 transition-colors">
            <Plus className="w-3.5 h-3.5"/>
            <span>Add Item</span>
          </button>
        </div>

        <div className="pt-2 border-t border-slate-700/40">
          <label className={labelClass}>Expand/Collapse Indicator Icon</label>
          <div className={`grid grid-cols-3 gap-1 ${boxGroupClass}`}>
            {[
                { id: 'chevron', label: 'Chevron ▾' },
                { id: 'plus-minus', label: 'Plus / Minus +/-' },
                { id: 'arrow', label: 'Arrow ➔' },
            ].map((ico) => (<button key={ico.id} type="button" onClick={() => onUpdateElement({ ...element, accordionIconStyle: ico.id as any })} className={`py-1.5 text-[11px] rounded font-semibold transition-all ${iconStyle === ico.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isLight
                        ? 'text-slate-600 hover:bg-slate-200'
                        : 'text-slate-400 hover:text-white'}`}>
                {ico.label}
              </button>))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700/40 grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Card Background</label>
            <div className="flex items-center gap-2">
              <input type="color" value={itemBg.startsWith('#') ? itemBg : '#1e293b'} onChange={(e) => onUpdateElement({ ...element, accordionItemBg: e.target.value })} className="w-8 h-8 rounded border bg-transparent cursor-pointer shrink-0"/>
              <input type="text" value={itemBg} onChange={(e) => onUpdateElement({ ...element, accordionItemBg: e.target.value })} className={`${inputClass} font-mono text-xs`} placeholder="transparent"/>
            </div>
          </div>

          <div>
            <label className={labelClass}>Border Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={borderColor.startsWith('#') ? borderColor : '#334155'} onChange={(e) => onUpdateElement({ ...element, accordionItemBorderColor: e.target.value })} className="w-8 h-8 rounded border bg-transparent cursor-pointer shrink-0"/>
              <input type="text" value={borderColor} onChange={(e) => onUpdateElement({ ...element, accordionItemBorderColor: e.target.value })} className={`${inputClass} font-mono text-xs`}/>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Corner Radius</label>
              <span className="text-[10px] font-mono text-indigo-400">{borderRadius}px</span>
            </div>
            <input type="range" min={0} max={24} step={2} value={borderRadius} onChange={(e) => updateStyle('borderRadius', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Gap Between Items</label>
              <span className="text-[10px] font-mono text-indigo-400">{spacing}px</span>
            </div>
            <input type="range" min={0} max={32} step={2} value={spacing} onChange={(e) => updateStyle('gap', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700/40">
          <label className={labelClass}>Accordion Max Width</label>
          <select value={s.maxWidth || 'none'} onChange={(e) => updateStyle('maxWidth', e.target.value)} className={selectClass}>
            <option value="none">Full Width (None)</option>
            <option value="lg">Large (512px)</option>
            <option value="xl">Extra Large (576px)</option>
            <option value="2xl">2XL (672px - Recommended FAQ Width)</option>
            <option value="3xl">3XL (768px)</option>
            <option value="4xl">4XL (896px)</option>
            <option value="5xl">5XL (1024px)</option>
          </select>
        </div>
      </div>);
    };
    const renderAccordionHeadingInspector = () => {
        if (!selectedContext)
            return null;
        const { element, subItemIndex = 0 } = selectedContext;
        const items = element.accordionItems || [
            { title: 'Frequently Asked Question 1', content: 'Detailed answer or guidelines for the first question.' },
            { title: 'Frequently Asked Question 2', content: 'Detailed answer or guidelines for the second question.' }
        ];
        const currentItem = items[subItemIndex] || items[0] || { title: '', content: '' };
        const s = currentItem.titleStyles || {};
        const tag = currentItem.titleTag || 'h3';
        const updateItemTitleProp = (key: string, val: any) => {
            const newItems = [...items];
            newItems[subItemIndex] = {
                ...newItems[subItemIndex],
                [key]: val,
            };
            onUpdateElement({
                ...element,
                accordionItems: newItems,
            });
        };
        const updateItemTitleStyle = (key: string, val: any) => {
            const newItems = [...items];
            const currentStyles = newItems[subItemIndex]?.titleStyles || {};
            newItems[subItemIndex] = {
                ...newItems[subItemIndex],
                titleStyles: {
                    ...currentStyles,
                    [key]: val,
                },
            };
            onUpdateElement({
                ...element,
                accordionItems: newItems,
            });
        };
        return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
        <div className={`p-2 rounded-xl border flex items-center justify-between gap-2 ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800/60 border-slate-700/60'}`}>
          <button type="button" onClick={() => onSelectContext?.({ ...selectedContext, subItemIndex: undefined, subItemPart: undefined })} className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer">
            <span>← Accordion Box</span>
          </button>
          <div className="flex items-center gap-1">
            <button type="button" className="px-2 py-1 rounded bg-indigo-600 text-white font-bold text-[10px]">
              Heading #{subItemIndex + 1}
            </button>
            <button type="button" onClick={() => onSelectContext?.({ ...selectedContext, subItemPart: 'content' })} className={`px-2 py-1 rounded text-[10px] font-medium transition-colors cursor-pointer ${isLight ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
              Answer Body →
            </button>
            <button type="button" onClick={() => {
                if (items.length > 1) {
                    const newItems = items.filter((_, i) => i !== subItemIndex);
                    onUpdateElement({
                        ...element,
                        accordionItems: newItems,
                    });
                    onSelectContext?.({
                        ...selectedContext,
                        subItemPart: undefined,
                        subItemIndex: undefined,
                    });
                }
                else {
                    onDeleteElement(element.id);
                }
            }} className="px-1.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-semibold transition-colors cursor-pointer flex items-center gap-0.5" title="Delete this accordion item">
              <Trash2 className="w-3 h-3"/>
            </button>
          </div>
        </div>

        <div>
          <label className={labelClass}>Heading Tag / Level</label>
          <select value={tag} onChange={(e) => updateItemTitleProp('titleTag', e.target.value as TextTag)} className={selectClass}>
            <option value="h1">Main Title (H1)</option>
            <option value="h2">Section Heading (H2)</option>
            <option value="h3">Sub Heading (H3 - Recommended)</option>
            <option value="h4">Card Title (H4)</option>
            <option value="h5">Small Heading (H5)</option>
            <option value="h6">Tiny Heading (H6)</option>
          </select>
        </div>

        <RichTextarea label="Heading / Question Text" value={currentItem.title || ''} onChange={(newVal) => updateItemTitleProp('title', newVal)} placeholder="Question / Toggle title..." rows={2} isLight={isLight} allowLists={false}/>

        <div>
          <label className={labelClass}>Font Style</label>
          <select value={s.typeface || 'Plus Jakarta Sans'} onChange={(e) => updateItemTitleStyle('typeface', e.target.value)} className={selectClass}>
            {TYPEFACE_OPTIONS.map((tf) => (<option key={tf.name} value={tf.name}>
                {tf.name}
              </option>))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Text Thickness</label>
            <select value={s.fontWeight || '600'} onChange={(e) => updateItemTitleStyle('fontWeight', e.target.value)} className={selectClass}>
              <option value="400">Regular (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">SemiBold (600)</option>
              <option value="700">Bold (700)</option>
              <option value="800">ExtraBold (800)</option>
            </select>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Font Size</label>
              <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                {(() => {
                const raw = s.fontSize;
                if (typeof raw === 'number')
                    return raw <= 5 ? Math.round(raw * 16) : raw;
                if (typeof raw === 'string') {
                    if (raw.endsWith('rem'))
                        return Math.round((parseFloat(raw) || 1) * 16);
                    return Math.round(parseFloat(raw) || 16);
                }
                return 16;
            })()}px
              </span>
            </div>
            <input type="range" min={10} max={64} step={1} value={(() => {
                const raw = s.fontSize;
                if (typeof raw === 'number')
                    return raw <= 5 ? Math.round(raw * 16) : raw;
                if (typeof raw === 'string') {
                    if (raw.endsWith('rem'))
                        return Math.round((parseFloat(raw) || 1) * 16);
                    return Math.round(parseFloat(raw) || 16);
                }
                return 16;
            })()} onChange={(e) => updateItemTitleStyle('fontSize', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
          </div>
        </div>

        <div>
          <label className={labelClass}>Heading Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={s.color && s.color.startsWith('#') ? s.color : isLight ? '#0f172a' : '#f8fafc'} onChange={(e) => updateItemTitleStyle('color', e.target.value)} className="w-8 h-8 rounded border bg-transparent cursor-pointer shrink-0"/>
            <input type="text" value={s.color || ''} onChange={(e) => updateItemTitleStyle('color', e.target.value)} className={`${inputClass} font-mono text-xs`} placeholder="inherit"/>
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-700/40">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Letter Spacing (Tracking)</label>
              <span className="text-[10px] font-mono text-indigo-400 font-semibold">{s.letterSpacing !== undefined ? s.letterSpacing : 0}em</span>
            </div>
            <div className={`grid grid-cols-3 gap-1 mb-2 ${boxGroupClass}`}>
              {[
                { label: 'Tight', val: -0.03 },
                { label: 'Normal', val: 0 },
                { label: 'Wide', val: 0.06 },
            ].map((p) => (<button key={p.label} type="button" onClick={() => updateItemTitleStyle('letterSpacing', p.val)} className={`py-1 text-[10px] rounded font-medium transition-all cursor-pointer ${(s.letterSpacing || 0) === p.val
                    ? 'bg-indigo-600 text-white font-semibold'
                    : isLight
                        ? 'text-slate-600 hover:bg-slate-200'
                        : 'text-slate-400 hover:text-white'}`}>
                  {p.label}
                </button>))}
            </div>
            <input type="range" min={-0.1} max={0.2} step={0.01} value={s.letterSpacing !== undefined ? s.letterSpacing : 0} onChange={(e) => updateItemTitleStyle('letterSpacing', parseFloat(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Line Height (Leading)</label>
              <span className="text-[10px] font-mono text-indigo-400 font-semibold">{s.lineHeight !== undefined ? s.lineHeight : 1.4}</span>
            </div>
            <input type="range" min={1.0} max={2.4} step={0.05} value={s.lineHeight !== undefined ? s.lineHeight : 1.4} onChange={(e) => updateItemTitleStyle('lineHeight', parseFloat(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
          </div>
        </div>
      </div>);
    };
    const renderAccordionContentInspector = () => {
        if (!selectedContext)
            return null;
        const { element, subItemIndex = 0 } = selectedContext;
        const items = element.accordionItems || [
            { title: 'Frequently Asked Question 1', content: 'Detailed answer or guidelines for the first question.' },
            { title: 'Frequently Asked Question 2', content: 'Detailed answer or guidelines for the second question.' }
        ];
        const currentItem = items[subItemIndex] || items[0] || { title: '', content: '' };
        const s = currentItem.contentStyles || {};
        const tag = currentItem.contentTag || 'p';
        const updateItemContentProp = (key: string, val: any) => {
            const newItems = [...items];
            newItems[subItemIndex] = {
                ...newItems[subItemIndex],
                [key]: val,
            };
            onUpdateElement({
                ...element,
                accordionItems: newItems,
            });
        };
        const updateItemContentStyle = (key: string, val: any) => {
            const newItems = [...items];
            const currentStyles = newItems[subItemIndex]?.contentStyles || {};
            newItems[subItemIndex] = {
                ...newItems[subItemIndex],
                contentStyles: {
                    ...currentStyles,
                    [key]: val,
                },
            };
            onUpdateElement({
                ...element,
                accordionItems: newItems,
            });
        };
        return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
        <div className={`p-2 rounded-xl border flex items-center justify-between gap-2 ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800/60 border-slate-700/60'}`}>
          <button type="button" onClick={() => onSelectContext?.({ ...selectedContext, subItemIndex: undefined, subItemPart: undefined })} className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer">
            <span>← Accordion Box</span>
          </button>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => onSelectContext?.({ ...selectedContext, subItemPart: 'title' })} className={`px-2 py-1 rounded text-[10px] font-medium transition-colors cursor-pointer ${isLight ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
              ← Heading
            </button>
            <button type="button" className="px-2 py-1 rounded bg-indigo-600 text-white font-bold text-[10px]">
              Answer Body #{subItemIndex + 1}
            </button>
            <button type="button" onClick={() => {
                if (items.length > 1) {
                    const newItems = items.filter((_, i) => i !== subItemIndex);
                    onUpdateElement({
                        ...element,
                        accordionItems: newItems,
                    });
                    onSelectContext?.({
                        ...selectedContext,
                        subItemPart: undefined,
                        subItemIndex: undefined,
                    });
                }
                else {
                    onDeleteElement(element.id);
                }
            }} className="px-1.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-semibold transition-colors cursor-pointer flex items-center gap-0.5" title="Delete this accordion item">
              <Trash2 className="w-3 h-3"/>
            </button>
          </div>
        </div>

        <div>
          <label className={labelClass}>Text Format</label>
          <select value={tag} onChange={(e) => updateItemContentProp('contentTag', e.target.value as TextTag)} className={selectClass}>
            <option value="p">Paragraph Text (P)</option>
            <option value="ul">Bullet List (UL)</option>
            <option value="ol">Numbered List (OL)</option>
            <option value="span">Inline Text (Span)</option>
            <option value="blockquote">Quote Block</option>
          </select>
        </div>

        <RichTextarea label="Accordion Body / Answer Content" value={currentItem.content || ''} onChange={(newVal) => updateItemContentProp('content', newVal)} placeholder="Detailed explanation or answer..." rows={4} isLight={isLight}/>

        <div>
          <label className={labelClass}>Font Style</label>
          <select value={s.typeface || 'Plus Jakarta Sans'} onChange={(e) => updateItemContentStyle('typeface', e.target.value)} className={selectClass}>
            {TYPEFACE_OPTIONS.map((tf) => (<option key={tf.name} value={tf.name}>
                {tf.name}
              </option>))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Text Thickness</label>
            <select value={s.fontWeight || '400'} onChange={(e) => updateItemContentStyle('fontWeight', e.target.value)} className={selectClass}>
              <option value="300">Light (300)</option>
              <option value="400">Regular (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">SemiBold (600)</option>
              <option value="700">Bold (700)</option>
            </select>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Font Size</label>
              <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                {(() => {
                const raw = s.fontSize;
                if (typeof raw === 'number')
                    return raw <= 5 ? Math.round(raw * 16) : raw;
                if (typeof raw === 'string') {
                    if (raw.endsWith('rem'))
                        return Math.round((parseFloat(raw) || 0.875) * 16);
                    return Math.round(parseFloat(raw) || 14);
                }
                return 14;
            })()}px
              </span>
            </div>
            <input type="range" min={10} max={48} step={1} value={(() => {
                const raw = s.fontSize;
                if (typeof raw === 'number')
                    return raw <= 5 ? Math.round(raw * 16) : raw;
                if (typeof raw === 'string') {
                    if (raw.endsWith('rem'))
                        return Math.round((parseFloat(raw) || 0.875) * 16);
                    return Math.round(parseFloat(raw) || 14);
                }
                return 14;
            })()} onChange={(e) => updateItemContentStyle('fontSize', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
          </div>
        </div>

        <div>
          <label className={labelClass}>Text Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={s.color && s.color.startsWith('#') ? s.color : isLight ? '#334155' : '#cbd5e1'} onChange={(e) => updateItemContentStyle('color', e.target.value)} className="w-8 h-8 rounded border bg-transparent cursor-pointer shrink-0"/>
            <input type="text" value={s.color || ''} onChange={(e) => updateItemContentStyle('color', e.target.value)} className={`${inputClass} font-mono text-xs`} placeholder="inherit"/>
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-700/40">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Letter Spacing (Tracking)</label>
              <span className="text-[10px] font-mono text-indigo-400 font-semibold">{s.letterSpacing !== undefined ? s.letterSpacing : 0}em</span>
            </div>
            <div className={`grid grid-cols-3 gap-1 mb-2 ${boxGroupClass}`}>
              {[
                { label: 'Tight', val: -0.02 },
                { label: 'Normal', val: 0 },
                { label: 'Wide', val: 0.05 },
            ].map((p) => (<button key={p.label} type="button" onClick={() => updateItemContentStyle('letterSpacing', p.val)} className={`py-1 text-[10px] rounded font-medium transition-all cursor-pointer ${(s.letterSpacing || 0) === p.val
                    ? 'bg-indigo-600 text-white font-semibold'
                    : isLight
                        ? 'text-slate-600 hover:bg-slate-200'
                        : 'text-slate-400 hover:text-white'}`}>
                  {p.label}
                </button>))}
            </div>
            <input type="range" min={-0.05} max={0.2} step={0.01} value={s.letterSpacing !== undefined ? s.letterSpacing : 0} onChange={(e) => updateItemContentStyle('letterSpacing', parseFloat(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Line Height (Leading)</label>
              <span className="text-[10px] font-mono text-indigo-400 font-semibold">{s.lineHeight !== undefined ? s.lineHeight : 1.6}</span>
            </div>
            <input type="range" min={1.0} max={2.4} step={0.05} value={s.lineHeight !== undefined ? s.lineHeight : 1.6} onChange={(e) => updateItemContentStyle('lineHeight', parseFloat(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
          </div>
        </div>
      </div>);
    };
    if (selectedContext.subItemPart === 'title') {
        return renderAccordionHeadingInspector();
    }
    if (selectedContext.subItemPart === 'content') {
        return renderAccordionContentInspector();
    }
    return renderAccordionProperties();
};
