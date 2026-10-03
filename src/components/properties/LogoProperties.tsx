import React, { useState } from 'react';
import { Type, Image as ImageIcon } from 'lucide-react';
import { WebsiteElement } from '../../types';
import { TYPEFACE_OPTIONS, PRESET_LOGOS } from '../../data/presetSamples';
import { ElementInspectorProps, getInspectorStyles, TypographyControls } from './PropertiesCommon';
export const LogoProperties: React.FC<ElementInspectorProps> = ({ selectedContext, onUpdateElement, onSelectContext, onDeleteElement, uiTheme = 'dark', viewportMode = 'desktop', }) => {
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
    const logoType = element.logoType || 'text';
    const s = element.styles || {};
    return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
        <div>
          <label className={labelClass}>Logo Style</label>
          <div className={`grid grid-cols-2 gap-1 ${boxGroupClass}`}>
            <button type="button" onClick={() => updateProp('logoType', 'text')} className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md font-medium transition-all ${logoType === 'text'
            ? 'bg-indigo-600 text-white shadow-sm'
            : isLight
                ? 'text-slate-600 hover:bg-slate-200'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
              <Type className="w-3.5 h-3.5"/>
              Text Logo
            </button>
            <button type="button" onClick={() => updateProp('logoType', 'image')} className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md font-medium transition-all ${logoType === 'image'
            ? 'bg-indigo-600 text-white shadow-sm'
            : isLight
                ? 'text-slate-600 hover:bg-slate-200'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
              <ImageIcon className="w-3.5 h-3.5"/>
              Image Logo
            </button>
          </div>
        </div>

        {logoType === 'text' ? (<>
            <div>
              <label className={labelClass}>Brand Name</label>
              <input type="text" value={element.content || ''} onChange={(e) => updateProp('content', e.target.value)} placeholder="e.g. Apex Advisory" className={inputClass}/>
            </div>

            <div>
              <label className={labelClass}>Font Style</label>
              <select value={s.typeface || 'Plus Jakarta Sans'} onChange={(e) => updateStyle('typeface', e.target.value)} className={selectClass}>
                {TYPEFACE_OPTIONS.map((tf) => (
                  <option key={tf.name} value={tf.name} style={{ fontFamily: tf.family }}>
                    {tf.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Text Thickness</label>
                <select value={s.fontWeight || '700'} onChange={(e) => updateStyle('fontWeight', e.target.value)} className={selectClass}>
                  <option value="300">Light</option>
                  <option value="400">Regular</option>
                  <option value="500">Medium</option>
                  <option value="600">SemiBold</option>
                  <option value="700">Bold</option>
                  <option value="800">ExtraBold</option>
                  <option value="900">Black</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Text Size: {s.fontSize || 22}px</label>
                <input type="range" min={12} max={48} value={s.fontSize || 22} onChange={(e) => updateStyle('fontSize', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
              </div>
            </div>

            <div>
              <label className={labelClass}>Text Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={s.textColor || (isLight ? '#0f172a' : '#f8fafc')} onChange={(e) => updateStyle('textColor', e.target.value)} className="w-8 h-8 rounded border bg-transparent cursor-pointer"/>
                <input type="text" value={s.textColor || (isLight ? '#0f172a' : '#f8fafc')} onChange={(e) => updateStyle('textColor', e.target.value)} className={`${inputClass} font-mono`}/>
              </div>
            </div>

            {renderTypographyControls(s)}
          </>) : (<>
            <div>
              <label className={labelClass}>Image Link (URL)</label>
              <input type="text" value={element.src || ''} onChange={(e) => updateProp('src', e.target.value)} placeholder="https://example.com/logo.png" className={inputClass}/>
            </div>

            <div>
              <label className={labelClass}>Sample Logos</label>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {PRESET_LOGOS.map((sample) => (<button key={sample.name} type="button" onClick={() => {
                    updateProp('src', sample.url);
                    updateProp('alt', sample.name);
                }} className={`flex-shrink-0 p-1 rounded border hover:border-indigo-500 transition-colors ${isLight ? 'bg-white border-slate-300' : 'bg-slate-950 border-slate-800'}`} title={sample.name}>
                    <img src={sample.url} alt={sample.name} className="w-8 h-8 rounded object-cover"/>
                  </button>))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Logo Height: {s.height || 40}px</label>
              <input type="range" min={16} max={96} value={typeof s.height === 'number' ? s.height : 40} onChange={(e) => updateStyle('height', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
            </div>
          </>)}
      </div>);
};
