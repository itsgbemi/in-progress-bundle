import React, { useState } from 'react';
import { WebsiteElement } from '../../types';
import { ElementInspectorProps, getInspectorStyles, TypographyControls } from './PropertiesCommon';
import { ImageInputWithMediaPicker } from '../common';
export const MediaProperties: React.FC<ElementInspectorProps> = ({ selectedContext, onUpdateElement, onSelectContext, onDeleteElement, uiTheme = 'dark', viewportMode = 'desktop', }) => {
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
    if (!selectedContext)
        return null;
    const { element } = selectedContext;
    const s = element.styles || {};
    const mediaType = element.mediaType || 'icon';
    const layoutMode = element.mixedMediaLayout || 'side-by-side';
    const mediaPosition = element.mediaPosition || 'left';
    const keepBeside = element.keepBesideOnMobile !== false;
    const mediaWidth = s.mediaWidth || 64;
    const mediaGap = s.gap || 20;
    return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
      <div>
        <label className={labelClass}>Media Type</label>
        <div className={`grid grid-cols-2 gap-1 p-1 ${boxGroupClass}`}>
          <button type="button" onClick={() => updateProp('mediaType', 'icon')} className={`py-1.5 rounded text-xs font-bold transition-all ${mediaType === 'icon'
            ? 'bg-indigo-600 text-white'
            : isLight ? 'text-slate-700 hover:bg-slate-200' : 'text-slate-300 hover:bg-slate-800'}`}>
            Icon + Text
          </button>
          <button type="button" onClick={() => updateProp('mediaType', 'image')} className={`py-1.5 rounded text-xs font-bold transition-all ${mediaType === 'image'
            ? 'bg-indigo-600 text-white'
            : isLight ? 'text-slate-700 hover:bg-slate-200' : 'text-slate-300 hover:bg-slate-800'}`}>
            Image + Text
          </button>
        </div>
      </div>

      <div>
        <label className={labelClass}>Mixed Media Layout Mode</label>
        <div className={`grid grid-cols-2 gap-1 p-1 ${boxGroupClass}`}>
          <button type="button" onClick={() => updateProp('mixedMediaLayout', 'side-by-side')} className={`py-1.5 rounded text-xs font-bold transition-all ${layoutMode === 'side-by-side'
            ? 'bg-indigo-600 text-white'
            : isLight ? 'text-slate-700 hover:bg-slate-200' : 'text-slate-300 hover:bg-slate-800'}`}>
            Side-by-Side Boxes
          </button>
          <button type="button" onClick={() => updateProp('mixedMediaLayout', 'wrap')} className={`py-1.5 rounded text-xs font-bold transition-all ${layoutMode === 'wrap'
            ? 'bg-indigo-600 text-white'
            : isLight ? 'text-slate-700 hover:bg-slate-200' : 'text-slate-300 hover:bg-slate-800'}`}>
            Text Wrapping
          </button>
        </div>
      </div>

      <div>
        <label className={labelClass}>Media Position</label>
        <div className={`grid grid-cols-2 gap-1 p-1 ${boxGroupClass}`}>
          <button type="button" onClick={() => updateProp('mediaPosition', 'left')} className={`py-1.5 rounded text-xs font-bold transition-all ${mediaPosition === 'left'
            ? 'bg-indigo-600 text-white'
            : isLight ? 'text-slate-700 hover:bg-slate-200' : 'text-slate-300 hover:bg-slate-800'}`}>
            Media on Left
          </button>
          <button type="button" onClick={() => updateProp('mediaPosition', 'right')} className={`py-1.5 rounded text-xs font-bold transition-all ${mediaPosition === 'right'
            ? 'bg-indigo-600 text-white'
            : isLight ? 'text-slate-700 hover:bg-slate-200' : 'text-slate-300 hover:bg-slate-800'}`}>
            Media on Right
          </button>
        </div>
      </div>

      <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold">Mobile/Tablet Layout</span>
          <span className="text-[10px] text-indigo-400 font-semibold">{keepBeside ? 'Side-by-side' : 'Stacked'}</span>
        </div>
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-200 dark:bg-slate-900 rounded-lg">
          <button type="button" onClick={() => updateProp('keepBesideOnMobile', true)} className={`py-1 rounded text-[11px] font-bold transition-all ${keepBeside
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'text-slate-400 hover:text-white'}`}>
            Keep Beside
          </button>
          <button type="button" onClick={() => updateProp('keepBesideOnMobile', false)} className={`py-1 rounded text-[11px] font-bold transition-all ${!keepBeside
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'text-slate-400 hover:text-white'}`}>
            Stack Vertically
          </button>
        </div>
      </div>

      {mediaType === 'image' ? (<div>
          <ImageInputWithMediaPicker
            label="Image Source"
            value={element.src || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80'}
            onChange={(val) => updateProp('src', val)}
            placeholder="Image URL or select from media"
            variant="default"
            isLight={isLight}
            modalTitle="Select Element Media Image"
          />
        </div>) : (<div>
          <label className={labelClass}>Icon Name</label>
          <select value={element.iconName || 'Sparkles'} onChange={(e) => updateProp('iconName', e.target.value)} className={selectClass}>
            {['Sparkles', 'Star', 'CheckCircle2', 'Heart', 'Shield', 'Zap', 'Flame', 'Compass', 'Rocket', 'Feather'].map((ic) => (<option key={ic} value={ic}>{ic}</option>))}
          </select>
        </div>)}

      <div className="space-y-2 pt-2 border-t border-slate-700/40">
        <div>
          <label className={labelClass}>Headline</label>
          <input type="text" value={element.content || 'Integrated Media Block'} onChange={(e) => updateProp('content', e.target.value)} className={inputClass}/>
        </div>
        <div>
          <label className={labelClass}>Body Description</label>
          <textarea value={element.subContent || 'Combines rich visual media beside independent typography space or text wrapping.'} onChange={(e) => updateProp('subContent', e.target.value)} rows={2} className={`${inputClass} resize-none`}/>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <div>
          <label className="text-[10px] font-bold text-slate-400 block mb-1">Media Width ({mediaWidth}px)</label>
          <input type="range" min={32} max={280} step={8} value={mediaWidth} onChange={(e) => updateStyle('mediaWidth', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 block mb-1">Gap Space ({mediaGap}px)</label>
          <input type="range" min={8} max={48} step={4} value={mediaGap} onChange={(e) => updateStyle('gap', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
        </div>
      </div>
    </div>);
};
