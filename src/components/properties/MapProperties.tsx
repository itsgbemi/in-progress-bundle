import React, { useState } from 'react';
import { WebsiteElement } from '../../types';
import { ElementInspectorProps, getInspectorStyles, TypographyControls } from './PropertiesCommon';
export const MapProperties: React.FC<ElementInspectorProps> = ({ selectedContext, onUpdateElement, onSelectContext, onDeleteElement, uiTheme = 'dark', viewportMode = 'desktop', }) => {
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
    const embedUrl = element.mapEmbedUrl || element.mapEmbedCode || '';
    const height = element.mapHeight || s.height || 340;
    const location = element.mapLocation || 'Times Square, New York, NY';
    const handleEmbedChange = (raw: string) => {
        const iframeMatch = raw.match(/src=["']([^"']+)["']/i);
        if (iframeMatch && iframeMatch[1]) {
            updateProp('mapEmbedUrl', iframeMatch[1]);
            updateProp('mapEmbedCode', raw);
        }
        else {
            updateProp('mapEmbedUrl', raw);
            updateProp('mapEmbedCode', raw);
        }
    };
    return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
        <div className="space-y-1.5">
          <label className={labelClass}>Google Maps Embed Code / URL</label>
          <textarea value={embedUrl} onChange={(e) => handleEmbedChange(e.target.value)} placeholder="<iframe src='https://www.google.com/maps/embed?...' width='600' height='450' ...></iframe>" rows={3} className={`${inputClass} font-mono text-[10px] resize-none`}/>
        </div>

        <div>
          <label className={labelClass}>Location Caption / Search Query</label>
          <input
            type="text"
            value={location}
            onChange={(e) => {
              updateProp('mapLocation', e.target.value);
              if (!embedUrl || embedUrl.includes('output=embed')) {
                updateProp('mapEmbedUrl', `https://maps.google.com/maps?q=${encodeURIComponent(e.target.value)}&t=&z=13&ie=UTF8&iwloc=&output=embed`);
              }
            }}
            placeholder="e.g. 1600 Amphitheatre Pkwy, Mountain View, CA"
            className={inputClass}
          />
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Map Height ({height}px)</label>
            </div>
            <input type="range" min={180} max={650} step={10} value={typeof height === 'number' ? height : 340} onChange={(e) => {
            const val = Number(e.target.value);
            updateProp('mapHeight', val);
            updateStyle('height', val);
        }} className="w-full accent-indigo-500 cursor-pointer"/>
          </div>

          <div>
            <label className={labelClass}>Container Maximum Width</label>
            <div className="grid grid-cols-3 gap-1">
              {[
            { label: 'Full Width', value: 'full' },
            { label: 'sm (384px)', value: 'sm' },
            { label: 'md (448px)', value: 'md' },
            { label: 'lg (512px)', value: 'lg' },
            { label: 'xl (576px)', value: 'xl' },
            { label: '2xl (672px)', value: '2xl' },
        ].map((w) => (<button key={w.value} type="button" onClick={() => updateStyle('maxWidth', w.value)} className={`py-1 px-1.5 rounded text-[10px] font-medium transition-all cursor-pointer ${(s.maxWidth || 'full') === w.value
                ? 'bg-indigo-600 text-white'
                : isLight ? 'bg-white text-slate-700 hover:bg-slate-100 border' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                  {w.label}
                </button>))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Corner Radius ({s.borderRadius || 16}px)</label>
            <input type="range" min={0} max={40} value={s.borderRadius !== undefined ? s.borderRadius : 16} onChange={(e) => updateStyle('borderRadius', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
          </div>
        </div>
      </div>);
};
