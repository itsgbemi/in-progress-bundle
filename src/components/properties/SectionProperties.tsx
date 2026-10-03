import React, { useState } from 'react';
import { Trash2, AlignLeft, AlignCenter, AlignRight, AlignJustify, Plus, ChevronLeft, ChevronRight, Copy, ArrowUpToLine, ArrowDownToLine, StretchVertical } from 'lucide-react';
import { WebsiteElement } from '../../types';
import { BackgroundController } from '../BackgroundController';
import { SectionPropertiesProps, getInspectorStyles } from './PropertiesCommon';
export const SectionProperties: React.FC<SectionPropertiesProps> = ({ selectedSection, onUpdateSection, onDeleteSection, uiTheme = 'dark', viewportMode = 'desktop', }) => {
    const [sectionSubTab, setSectionSubTab] = useState<'main' | 'layout'>('main');
    const [isManagingHeaderContent, setIsManagingHeaderContent] = useState(false);
    const isLight = uiTheme === 'light';
    const { inputClass, selectClass, labelClass, boxGroupClass } = getInspectorStyles(isLight);
    const updateSectionStyle = (key: string, value: any) => {
        if (!selectedSection || !onUpdateSection)
            return;
        const merged = {
            ...(selectedSection.style || {}),
            ...(selectedSection.styles || {}),
            [key]: value,
        };
        let newElements = selectedSection.elements ? [...selectedSection.elements] : [];
        if (key === 'layoutColumns') {
            const targetCount = parseInt(String(value), 10);
            if (targetCount > 1 && newElements.length < targetCount) {
                while (newElements.length < targetCount) {
                    const colIndex = newElements.length + 1;
                    newElements.push({
                        id: `col-card-${Date.now()}-${colIndex}-${Math.random().toString(36).substring(2, 6)}`,
                        type: 'card',
                        label: `Column ${colIndex}`,
                        styles: {
                            backgroundColor: 'transparent',
                            paddingX: 16,
                            paddingY: 16,
                            borderWidth: 0,
                        },
                        children: [
                            {
                                id: `col-heading-${Date.now()}-${colIndex}`,
                                type: 'heading',
                                label: 'Headline',
                                tag: 'h3',
                                content: `Column ${colIndex} Header`,
                                styles: {
                                    typeface: 'Plus Jakarta Sans',
                                    fontWeight: '700',
                                    fontSize: 18,
                                    textColor: isLight ? '#0f172a' : '#ffffff',
                                    marginY: 6,
                                },
                            },
                            {
                                id: `col-text-${Date.now()}-${colIndex}`,
                                type: 'text',
                                label: 'Paragraph',
                                tag: 'p',
                                content: 'Add content, links, or media to this layout column.',
                                styles: {
                                    typeface: 'Inter',
                                    fontSize: 14,
                                    textColor: isLight ? '#64748b' : '#94a3b8',
                                    lineHeight: 1.6,
                                },
                            },
                        ],
                    });
                }
            }
        }
        onUpdateSection({
            ...selectedSection,
            style: merged,
            styles: merged,
            elements: newElements,
        });
    };
    const updateSectionStyles = (updates: Record<string, any>) => {
        if (!selectedSection || !onUpdateSection)
            return;
        const merged = {
            ...(selectedSection.style || {}),
            ...(selectedSection.styles || {}),
            ...updates,
        };
        onUpdateSection({
            ...selectedSection,
            style: merged,
            styles: merged,
        });
    };
    const updateSectionProp = (key: string, value: any) => {
        if (!selectedSection || !onUpdateSection)
            return;
        onUpdateSection({
            ...selectedSection,
            [key]: value,
        });
    };
    const renderSectionProperties = () => {
        if (!selectedSection)
            return null;
        const s = selectedSection.styles || {};
        const isHeader = selectedSection.type === 'header';
        const isFooter = selectedSection.type === 'footer';
        if (false && sectionSubTab === 'layout') {
            return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
          <div className="flex items-center justify-between pb-2 border-b border-slate-700/30">
            <button type="button" onClick={() => setSectionSubTab('main')} className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer">
              <ChevronLeft className="w-4 h-4"/>
              <span>Back to Section Settings</span>
            </button>
          </div>

          <div>
            <label className={labelClass}>Layout Columns</label>
            <div className={`grid grid-cols-4 gap-1 ${boxGroupClass}`}>
              {[
                    { id: '1', label: '1 Col' },
                    { id: '2', label: '2 Cols' },
                    { id: '3', label: '3 Cols' },
                    { id: '4', label: '4 Cols' },
                ].map((colOpt) => {
                    const currentCols = s.layoutColumns || (selectedSection.type === 'image-text' || selectedSection.type === 'video-text' ? '2' :
                        selectedSection.type === 'features' || selectedSection.type === 'pricing' || selectedSection.type === 'team' || selectedSection.type === 'testimonials' ? '3' :
                            '1');
                    const isSel = String(currentCols) === colOpt.id;
                    return (<button key={colOpt.id} type="button" onClick={() => updateSectionStyle('layoutColumns', colOpt.id)} className={`py-1 text-[10px] rounded font-medium transition-all cursor-pointer ${isSel
                            ? 'bg-indigo-600 text-white font-semibold'
                            : isLight
                                ? 'text-slate-600 hover:bg-slate-200'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                    {colOpt.label}
                  </button>);
                })}
            </div>
          </div>

          {String(s.layoutColumns || (selectedSection.type === 'image-text' || selectedSection.type === 'video-text' ? '2' :
                    selectedSection.type === 'features' || selectedSection.type === 'pricing' || selectedSection.type === 'team' || selectedSection.type === 'testimonials' ? '3' :
                        '1')) === '2' && (<div>
              <label className={labelClass}>Column Width Ratio</label>
              <select value={s.columnRatio || '1:1'} onChange={(e) => updateSectionStyle('columnRatio', e.target.value)} className={selectClass}>
                <option value="1:1">Equal Widths (1:1)</option>
                <option value="1:2">Narrow Left, Wide Right (1:2)</option>
                <option value="2:1">Wide Left, Narrow Right (2:1)</option>
                <option value="1:3">Extra Narrow Left, Extra Wide Right (1:3)</option>
                <option value="3:1">Extra Wide Left, Extra Narrow Right (3:1)</option>
              </select>
            </div>)}

          {String(s.layoutColumns || (selectedSection.type === 'image-text' || selectedSection.type === 'video-text' ? '2' :
                    selectedSection.type === 'features' || selectedSection.type === 'pricing' || selectedSection.type === 'team' || selectedSection.type === 'testimonials' ? '3' :
                        '1')) === '3' && (<div>
              <label className={labelClass}>Column Width Ratio</label>
              <select value={s.columnRatio || '1:1:1'} onChange={(e) => updateSectionStyle('columnRatio', e.target.value)} className={selectClass}>
                <option value="1:1:1">Equal Widths (1:1:1)</option>
                <option value="1:2:1">Wide Center (1:2:1)</option>
                <option value="2:1:1">Wide Left (2:1:1)</option>
                <option value="1:1:2">Wide Right (1:1:2)</option>
              </select>
            </div>)}

          <div className="space-y-2 pt-2 border-t border-slate-700/40">
            <label className={labelClass}>Responsive Column Gaps</label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium text-slate-400">Desktop</span>
                  <span className="text-[10px] font-mono text-indigo-400">{s.gap !== undefined ? s.gap : 32}px</span>
                </div>
                <select value={s.gap !== undefined ? String(s.gap) : '32'} onChange={(e) => updateSectionStyle('gap', Number(e.target.value))} className={selectClass}>
                  <option value="0">0px</option>
                  <option value="8">8px</option>
                  <option value="12">12px</option>
                  <option value="16">16px</option>
                  <option value="24">24px</option>
                  <option value="32">32px</option>
                  <option value="48">48px</option>
                  <option value="64">64px</option>
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium text-slate-400">Tablet</span>
                  <span className="text-[10px] font-mono text-indigo-400">
                    {s.gapTablet !== undefined ? s.gapTablet : (s.gap !== undefined ? Math.min(Number(s.gap), 24) : 16)}px
                  </span>
                </div>
                <select value={s.gapTablet !== undefined ? String(s.gapTablet) : String(s.gap !== undefined ? Math.min(Number(s.gap), 24) : 16)} onChange={(e) => updateSectionStyle('gapTablet', Number(e.target.value))} className={selectClass}>
                  <option value="0">0px</option>
                  <option value="5">5px</option>
                  <option value="8">8px</option>
                  <option value="10">10px</option>
                  <option value="12">12px</option>
                  <option value="16">16px</option>
                  <option value="20">20px</option>
                  <option value="24">24px</option>
                  <option value="32">32px</option>
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium text-slate-400">Mobile</span>
                  <span className="text-[10px] font-mono text-indigo-400">
                    {s.gapMobile !== undefined ? s.gapMobile : (s.gapTablet !== undefined ? Math.min(Number(s.gapTablet), 16) : 12)}px
                  </span>
                </div>
                <select value={s.gapMobile !== undefined ? String(s.gapMobile) : String(s.gapTablet !== undefined ? Math.min(Number(s.gapTablet), 16) : 12)} onChange={(e) => updateSectionStyle('gapMobile', Number(e.target.value))} className={selectClass}>
                  <option value="0">0px</option>
                  <option value="5">5px</option>
                  <option value="8">8px</option>
                  <option value="10">10px</option>
                  <option value="12">12px</option>
                  <option value="16">16px</option>
                  <option value="20">20px</option>
                  <option value="24">24px</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Stack Direction (On Stack/Mobile)</label>
            <div className={`grid grid-cols-2 gap-1 ${boxGroupClass}`}>
              <button type="button" onClick={() => updateSectionStyle('reverseLayout', false)} className={`py-1 text-[11px] rounded font-semibold transition-all cursor-pointer ${!s.reverseLayout
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isLight
                        ? 'text-slate-600 hover:bg-slate-200'
                        : 'text-slate-400 hover:text-white'}`}>
                Normal (Left First)
              </button>
              <button type="button" onClick={() => updateSectionStyle('reverseLayout', true)} className={`py-1 text-[11px] rounded font-semibold transition-all cursor-pointer ${s.reverseLayout
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isLight
                        ? 'text-slate-600 hover:bg-slate-200'
                        : 'text-slate-400 hover:text-white'}`}>
                Reversed (Right First)
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>Vertical Alignment (Align Items)</label>
            <div className={`grid grid-cols-4 gap-1 ${boxGroupClass}`}>
              {[
                    { id: 'flex-start', icon: ArrowUpToLine, title: 'Align Top (flex-start)' },
                    { id: 'center', icon: AlignCenter, title: 'Align Middle (center)' },
                    { id: 'flex-end', icon: ArrowDownToLine, title: 'Align Bottom (flex-end)' },
                    { id: 'stretch', icon: StretchVertical, title: 'Stretch Full (stretch)' },
                ].map((al) => {
                    const IconComponent = al.icon;
                    const activeVal = s.alignItems || 'center';
                    const isSel = activeVal === al.id;
                    return (<button key={al.id} type="button" onClick={() => updateSectionStyle('alignItems', al.id)} className={`p-1.5 rounded flex items-center justify-center transition-all cursor-pointer ${isSel
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : isLight
                                ? 'text-slate-600 hover:bg-slate-200'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'}`} title={al.title}>
                    <IconComponent className="w-3.5 h-3.5"/>
                  </button>);
                })}
            </div>
          </div>

          <div>
            <label className={labelClass}>Entrance Animation Effect</label>
            <select value={s.animation || 'none'} onChange={(e) => updateSectionStyle('animation', e.target.value)} className={selectClass}>
              <option value="none">No Entrance Animation</option>
              <option value="fade">Simple Fade In</option>
              <option value="slide-up">Slide Up & Fade In</option>
              <option value="slide-left">Slide Left & Fade In</option>
              <option value="slide-right">Slide Right & Fade In</option>
              <option value="scale">Scale Up & Fade In</option>
            </select>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-700/20">
            <label className={labelClass}>Manage Columns & Content Blocks</label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => {
                    const newCol = {
                        id: `col-card-${Date.now()}`,
                        type: 'card' as const,
                        label: 'New Column (Left)',
                        styles: {
                            backgroundColor: 'transparent',
                            paddingX: 16,
                            paddingY: 16,
                            borderWidth: 0,
                        },
                        children: [
                            {
                                id: `col-heading-${Date.now()}`,
                                type: 'heading' as const,
                                label: 'Headline',
                                tag: 'h3' as const,
                                content: 'New Column Block',
                                styles: {
                                    typeface: 'Plus Jakarta Sans',
                                    fontWeight: '700',
                                    fontSize: 20,
                                    textColor: isLight ? '#0f172a' : '#ffffff',
                                    textAlign: 'left' as const,
                                },
                            },
                            {
                                id: `col-text-${Date.now()}`,
                                type: 'text' as const,
                                label: 'Paragraph',
                                tag: 'p' as const,
                                content: 'Customize your new column description text here.',
                                styles: {
                                    typeface: 'Inter',
                                    fontWeight: '400',
                                    fontSize: 14,
                                    textColor: isLight ? '#475569' : '#94a3b8',
                                    textAlign: 'left' as const,
                                },
                            },
                        ],
                    };
                    if (onUpdateSection) {
                        onUpdateSection({
                            ...selectedSection,
                            elements: [newCol, ...selectedSection.elements],
                        });
                    }
                }} className={`py-1.5 px-2.5 rounded-lg border text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'}`}>
                <Plus className="w-3.5 h-3.5 text-indigo-400"/>
                Add Column Left
              </button>

              <button type="button" onClick={() => {
                    const newCol = {
                        id: `col-card-${Date.now()}`,
                        type: 'card' as const,
                        label: 'New Column (Right)',
                        styles: {
                            backgroundColor: 'transparent',
                            paddingX: 16,
                            paddingY: 16,
                            borderWidth: 0,
                        },
                        children: [
                            {
                                id: `col-heading-${Date.now()}`,
                                type: 'heading' as const,
                                label: 'Headline',
                                tag: 'h3' as const,
                                content: 'New Column Block',
                                styles: {
                                    typeface: 'Plus Jakarta Sans',
                                    fontWeight: '700',
                                    fontSize: 20,
                                    textColor: isLight ? '#0f172a' : '#ffffff',
                                    textAlign: 'left' as const,
                                },
                            },
                            {
                                id: `col-text-${Date.now()}`,
                                type: 'text' as const,
                                label: 'Paragraph',
                                tag: 'p' as const,
                                content: 'Customize your new column description text here.',
                                styles: {
                                    typeface: 'Inter',
                                    fontWeight: '400',
                                    fontSize: 14,
                                    textColor: isLight ? '#475569' : '#94a3b8',
                                    textAlign: 'left' as const,
                                },
                            },
                        ],
                    };
                    if (onUpdateSection) {
                        onUpdateSection({
                            ...selectedSection,
                            elements: [...selectedSection.elements, newCol],
                        });
                    }
                }} className={`py-1.5 px-2.5 rounded-lg border text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'}`}>
                <Plus className="w-3.5 h-3.5 text-indigo-400"/>
                Add Column Right
              </button>
            </div>

            <div className="space-y-1.5 mt-2 max-h-[160px] overflow-y-auto pr-1">
              {selectedSection.elements.map((el, index) => (<div key={el.id} className={`flex items-center justify-between p-2 rounded-lg border text-[11px] ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800/80'}`}>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold truncate capitalize">{el.label || el.type}</div>
                    <div className="text-[9px] text-slate-500 font-mono truncate">ID: {el.id}</div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" onClick={() => {
                        const dup: WebsiteElement = {
                            ...el,
                            id: `${el.type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                            label: `${el.label || el.type} (Copy)`,
                        };
                        const updated = [...selectedSection.elements];
                        updated.splice(index + 1, 0, dup);
                        onUpdateSection?.({
                            ...selectedSection,
                            elements: updated,
                        });
                    }} className="p-1 rounded text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 cursor-pointer" title="Duplicate Column">
                      <Copy className="w-3.5 h-3.5"/>
                    </button>
                    <button type="button" onClick={() => {
                        const updated = selectedSection.elements.filter((curr) => curr.id !== el.id);
                        onUpdateSection?.({
                            ...selectedSection,
                            elements: updated,
                        });
                    }} className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer" title="Delete Column">
                      <Trash2 className="w-3.5 h-3.5"/>
                    </button>
                  </div>
                </div>))}
            </div>
          </div>
        </div>);
        }
        return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
        {selectedSection?.type === 'header' && (<div>
            <button type="button" onClick={() => setIsManagingHeaderContent(true)} className={`w-full px-3 py-2.5 rounded-lg border flex items-center justify-between transition-all cursor-pointer mb-3 ${isLight
                    ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700 font-semibold'
                    : 'bg-indigo-950/60 hover:bg-indigo-900/80 border-indigo-800 text-indigo-300 font-semibold'}`}>
              <span className="font-semibold text-xs">Manage Header</span>
              <ChevronRight className="w-4 h-4"/>
            </button>
          </div>)}

        <div>
          <label className={labelClass}>
            {selectedSection.type === 'header' ? 'Header Label' : 'Section Title / Label'}
          </label>
          <input type="text" value={selectedSection.title} onChange={(e) => updateSectionProp('title', e.target.value)} className={inputClass}/>
        </div>

        <div>
          <label className={labelClass}>Section Anchor ID (for navbar links / smooth scrolling)</label>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono text-xs font-bold">#</span>
            <input type="text" value={selectedSection.anchorId || ''} onChange={(e) => updateSectionProp('anchorId', e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))} placeholder={selectedSection.id} className={`${inputClass} font-mono`}/>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Container Max-Width</label>
            <select value={s.maxWidth || '7xl'} onChange={(e) => updateSectionStyle('maxWidth', e.target.value)} className={selectClass}>
              <option value="full">Full Width (100%)</option>
              <option value="xl">XL / Extra Wide (1400px)</option>
              <option value="7xl">7XL / Default Wide (1280px)</option>
              <option value="6xl">6XL / Compact (1152px)</option>
              <option value="5xl">5XL / Editorial (1024px)</option>
              <option value="4xl">4XL / Form Width (896px)</option>
              <option value="3xl">3XL / Narrow Column (768px)</option>
              <option value="2xl">2XL / Extra Narrow (672px)</option>
              {selectedSection?.type !== 'hero' && (<option value="prose">Prose Reading Width (65ch)</option>)}
            </select>
          </div>

          {(selectedSection?.type === 'image-text' || selectedSection?.type === 'video-text') && (<div>
              <label className={labelClass}>Image / Media Order</label>
              <div className={`grid grid-cols-2 gap-1 ${boxGroupClass}`}>
                <button type="button" onClick={() => updateSectionStyle('reverseLayout', false)} className={`py-1 text-[11px] rounded font-semibold transition-all ${!s.reverseLayout
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isLight
                        ? 'text-slate-600 hover:bg-slate-200'
                        : 'text-slate-400 hover:text-white'}`}>
                  Text First
                </button>
                <button type="button" onClick={() => updateSectionStyle('reverseLayout', true)} className={`py-1 text-[11px] rounded font-semibold transition-all ${s.reverseLayout
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isLight
                        ? 'text-slate-600 hover:bg-slate-200'
                        : 'text-slate-400 hover:text-white'}`}>
                  Image First
                </button>
              </div>
            </div>)}
        </div>

        <div className="pt-1">
          <BackgroundController styles={s} onChange={(bgUpdates) => {
                if (selectedSection && onUpdateSection) {
                    const merged = {
                        ...(selectedSection.style || {}),
                        ...(selectedSection.styles || {}),
                        ...bgUpdates,
                    };
                    onUpdateSection({
                        ...selectedSection,
                        style: merged,
                        styles: merged,
                    });
                }
            }} uiTheme={uiTheme} label="Section Background" allowTransparent={true}/>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>
              Vertical Spacing (Y): {s.paddingY !== undefined ? s.paddingY : 48}px
            </label>
            <input type="range" min={0} max={160} step={4} value={s.paddingY !== undefined ? s.paddingY : 48} onChange={(e) => updateSectionStyle('paddingY', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
          </div>
          <div>
            <label className={labelClass}>
              Horizontal Spacing (X): {s.paddingX !== undefined ? s.paddingX : 24}px
            </label>
            <input type="range" min={0} max={64} step={4} value={s.paddingX !== undefined ? s.paddingX : 24} onChange={(e) => updateSectionStyle('paddingX', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Section Text Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={s.textColor || (isLight ? '#000000' : '#ffffff')} onChange={(e) => updateSectionStyle('textColor', e.target.value)} className="w-8 h-8 rounded border bg-transparent cursor-pointer shrink-0"/>
              <input type="text" value={s.textColor || (isLight ? '#000000' : '#ffffff')} onChange={(e) => updateSectionStyle('textColor', e.target.value)} className={`${inputClass} font-mono`}/>
            </div>
          </div>
          <div>
            <label className={labelClass}>Content Alignment</label>
            <div className={`grid grid-cols-4 gap-1 ${boxGroupClass}`}>
              {[
                { id: 'left', icon: AlignLeft, title: 'Left Align' },
                { id: 'center', icon: AlignCenter, title: 'Center Align' },
                { id: 'right', icon: AlignRight, title: 'Right Align' },
                { id: 'none', icon: AlignJustify, title: 'None / Stretch' },
            ].map((al) => {
                const IconComponent = al.icon;
                const activeAlign = s.alignment || s.contentAlignment || 'center';
                const isSel = activeAlign === al.id;
                return (<button key={al.id} type="button" onClick={() => {
                        updateSectionStyles({
                            alignment: al.id,
                            contentAlignment: al.id,
                            textAlign: al.id === 'none' ? 'left' : al.id,
                        });
                    }} className={`p-1.5 rounded flex items-center justify-center transition-all ${isSel
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : isLight
                            ? 'text-slate-600 hover:bg-slate-200'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'}`} title={al.title}>
                    <IconComponent className="w-3.5 h-3.5"/>
                  </button>);
            })}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700/40 space-y-3">
          <div>
            <label className={labelClass}>Border Placement</label>
            <div className={`grid grid-cols-4 gap-1 ${boxGroupClass}`}>
              {[
                { id: isHeader ? 'bottom' : 'all', label: isHeader ? 'Bottom Only' : 'All Sides' },
                { id: isHeader ? 'all' : 'bottom', label: isHeader ? 'All Sides' : 'Bottom' },
                { id: 'top-bottom', label: 'Top & Bot' },
                { id: 'none', label: 'None' },
            ].map((pos) => {
                const currentPos = s.borderPosition || (isHeader ? 'bottom' : 'all');
                const isSel = currentPos === pos.id;
                return (<button key={pos.id} type="button" onClick={() => updateSectionStyle('borderPosition', pos.id)} className={`py-1 text-[10px] rounded font-medium transition-all ${isSel
                        ? 'bg-indigo-600 text-white font-semibold'
                        : isLight
                            ? 'text-slate-600 hover:bg-slate-200'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                    {pos.label}
                  </button>);
            })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>Border Width</label>
                <span className="text-[10px] font-mono text-indigo-400">{s.borderWidth ?? 0}px</span>
              </div>
              <input type="range" min={0} max={12} value={s.borderWidth ?? 0} onChange={(e) => updateSectionStyle('borderWidth', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
            </div>
            <div>
              <label className={labelClass}>Border Style</label>
              <select value={s.borderStyle || 'solid'} onChange={(e) => updateSectionStyle('borderStyle', e.target.value)} className={selectClass}>
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Border Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={s.borderColor || (isLight ? '#e2e8f0' : '#334155')} onChange={(e) => updateSectionStyle('borderColor', e.target.value)} className="w-8 h-8 rounded border bg-transparent cursor-pointer"/>
              <input type="text" value={s.borderColor || (isLight ? '#e2e8f0' : '#334155')} onChange={(e) => updateSectionStyle('borderColor', e.target.value)} className={`${inputClass} font-mono`}/>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Corner Radius</label>
              <span className="text-[10px] font-mono text-indigo-400">{s.borderRadius ?? 0}px</span>
            </div>
            <input type="range" min={0} max={32} value={s.borderRadius ?? 0} onChange={(e) => updateSectionStyle('borderRadius', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700/40">
          <div className="flex items-center justify-between mb-1">
            <label className={labelClass}>Box Shadow (Elevation)</label>
            <span className="text-[10px] font-mono text-indigo-400 uppercase">{s.shadow || 'none'}</span>
          </div>
          <div className={`grid grid-cols-6 gap-1 ${boxGroupClass}`}>
            {[
                { id: 'none', label: 'None' },
                { id: 'sm', label: 'SM' },
                { id: 'md', label: 'MD' },
                { id: 'lg', label: 'LG' },
                { id: 'xl', label: 'XL' },
                { id: '2xl', label: '2XL' },
            ].map((sh) => (<button key={sh.id} type="button" onClick={() => updateSectionStyle('shadow', sh.id)} className={`py-1 text-[10px] rounded font-medium transition-all ${(s.shadow || 'none') === sh.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : isLight
                        ? 'text-slate-600 hover:bg-slate-200'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                {sh.label}
              </button>))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700/40 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <label className={labelClass}>Section Minimum Height</label>
            <span className="text-[10px] font-mono text-indigo-400 font-bold">
              {s.minHeight !== undefined && s.minHeight !== 'auto'
                ? typeof s.minHeight === 'number'
                    ? `${s.minHeight}px`
                    : s.minHeight
                : 'Auto'}
            </span>
          </div>
          <div className={`grid grid-cols-5 gap-1 ${boxGroupClass}`}>
            {[
                { label: 'Auto', val: undefined },
                { label: '300px', val: 300 },
                { label: '480px', val: 480 },
                { label: '640px', val: 640 },
                { label: 'Screen', val: '100vh' },
            ].map((mh) => (<button key={mh.label} type="button" onClick={() => updateSectionStyle('minHeight', mh.val)} className={`py-1 text-[10px] rounded font-semibold transition-all ${s.minHeight === mh.val
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isLight
                        ? 'text-slate-600 hover:bg-slate-200'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                {mh.label}
              </button>))}
          </div>
          {typeof s.minHeight === 'number' && (<input type="range" min={200} max={1000} step={20} value={s.minHeight || 400} onChange={(e) => updateSectionStyle('minHeight', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer mt-1"/>)}
        </div>

        <div className="pt-2 border-t border-slate-700/40 grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Element Gap</label>
              <span className="text-[10px] font-mono text-indigo-400">{s.gap ?? 24}px</span>
            </div>
            <input type="range" min={0} max={80} step={4} value={s.gap ?? 24} onChange={(e) => updateSectionStyle('gap', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
          </div>
          <div>
            <label className={labelClass}>Section Overflow</label>
            <select value={s.overflow || 'visible'} onChange={(e) => updateSectionStyle('overflow', e.target.value)} className={selectClass}>
              <option value="visible">Visible (Default)</option>
              <option value="hidden">Hidden (Crop Spills)</option>
              <option value="clip">Clip</option>
            </select>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700/40 space-y-2">
          <label className={labelClass}>Backdrop Blur (Glass Effect)</label>
          <div className={`grid grid-cols-5 gap-1 ${boxGroupClass}`}>
            {[
                { id: 'none', label: 'None' },
                { id: 'sm', label: 'SM (4px)' },
                { id: 'md', label: 'MD (12px)' },
                { id: 'lg', label: 'LG (20px)' },
                { id: 'xl', label: 'XL (32px)' },
            ].map((b) => (<button key={b.id} type="button" onClick={() => updateSectionStyle('backdropBlur', b.id)} className={`py-1 text-[10px] rounded font-semibold transition-all ${(s.backdropBlur || 'none') === b.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isLight
                        ? 'text-slate-600 hover:bg-slate-200'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                {b.label}
              </button>))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700/40">
          <div className="flex items-center justify-between mb-1">
            <label className={labelClass}>Section Opacity</label>
            <span className="text-[10px] font-mono text-indigo-400">
              {Math.round((s.opacity ?? 1) * 100)}%
            </span>
          </div>
          <input type="range" min={0.1} max={1} step={0.05} value={s.opacity ?? 1} onChange={(e) => updateSectionStyle('opacity', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
        </div>
      </div>);
    };
    return renderSectionProperties();
};
