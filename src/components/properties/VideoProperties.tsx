import React, { useState } from 'react';
import { Video } from 'lucide-react';
import { WebsiteElement } from '../../types';
import { PRESET_VIDEOS } from '../../data/presetSamples';
import { ElementInspectorProps, getInspectorStyles, TypographyControls } from './PropertiesCommon';
import { ImageInputWithMediaPicker } from '../common';
export const VideoProperties: React.FC<ElementInspectorProps> = ({ selectedContext, onUpdateElement, onSelectContext, onDeleteElement, uiTheme = 'dark', viewportMode = 'desktop', }) => {
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
    return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
        <div>
          <label className={labelClass}>Video Embed / Direct Link</label>
          <input type="text" value={element.videoUrl || ''} onChange={(e) => updateProp('videoUrl', e.target.value)} placeholder="YouTube, Vimeo, or direct MP4 URL" className={inputClass}/>
        </div>

        {PRESET_VIDEOS && PRESET_VIDEOS.length > 0 && (<div>
            <label className={labelClass}>Sample Video Library</label>
            <div className="grid grid-cols-2 gap-1.5">
              {PRESET_VIDEOS.map((vid) => (<button key={vid.name} type="button" onClick={() => {
                    updateProp('videoUrl', vid.url);
                    if (vid.poster)
                        updateProp('videoPoster', vid.poster);
                }} className={`p-2 rounded-lg border text-left flex items-center gap-2 cursor-pointer transition-all hover:border-indigo-500 ${element.videoUrl === vid.url
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold'
                    : isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'}`}>
                  <Video className="w-4 h-4 text-indigo-400 flex-shrink-0"/>
                  <div className="overflow-hidden">
                    <p className="truncate text-[11px] font-medium">{vid.name}</p>
                    <p className="truncate text-[9px] text-slate-500">{vid.type}</p>
                  </div>
                </button>))}
            </div>
          </div>)}

        <div>
          <ImageInputWithMediaPicker
            label="Video Poster / Thumbnail URL (MP4 only)"
            value={element.videoPoster || ''}
            onChange={(val) => updateProp('videoPoster', val)}
            placeholder="Thumbnail URL or select from media"
            variant="default"
            isLight={isLight}
            modalTitle="Select Video Poster Image"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Aspect Ratio</label>
            <select value={s.aspectRatio || '16/9'} onChange={(e) => updateStyle('aspectRatio', e.target.value)} className={selectClass}>
              <option value="16/9">16:9 Standard Widescreen</option>
              <option value="4/3">4:3 Classic TV</option>
              <option value="21/9">21:9 Ultra Cinema</option>
              <option value="1/1">1:1 Square</option>
              <option value="9/16">9:16 Vertical Reel</option>
              <option value="auto">Auto (Natural)</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Max Width</label>
            <select value={s.maxWidth || 'none'} onChange={(e) => updateStyle('maxWidth', e.target.value)} className={selectClass}>
              <option value="none">None (Full Responsive)</option>
              <option value="full">100% Full Width</option>
              <option value="sm">SM (384px - Mini Player)</option>
              <option value="md">MD (448px - Compact)</option>
              <option value="lg">LG (512px - Medium)</option>
              <option value="xl">XL (576px - Content Width)</option>
              <option value="2xl">2XL (672px - Feature Video)</option>
              <option value="3xl">3XL (768px - Large Showcase)</option>
              <option value="4xl">4XL (896px - Hero Player)</option>
              <option value="5xl">5XL (1024px - Theater)</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Video Alignment</label>
          <select value={s.alignment || (s.marginAuto === 'center' || s.marginAuto === true ? 'center' : s.marginAuto === 'right' ? 'right' : 'left')} onChange={(e) => {
            const val = e.target.value as 'left' | 'center' | 'right';
            updateStyle('alignment', val);
            updateStyle('marginAuto', val);
        }} className={selectClass}>
            <option value="left">Left Aligned</option>
            <option value="center">Centered (Auto Margins)</option>
            <option value="right">Right Aligned</option>
          </select>
        </div>

        <div className={`p-3 rounded-lg border space-y-2.5 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
          <span className="font-semibold text-slate-200">Video Player Options</span>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button type="button" onClick={() => updateProp('videoControls', element.videoControls !== false ? false : true)} className={`p-2 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-all ${element.videoControls !== false
            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold'
            : isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
              <span>Controls</span>
              <span className="text-[10px] font-bold">{element.videoControls !== false ? 'ON' : 'OFF'}</span>
            </button>

            <button type="button" onClick={() => updateProp('videoAutoplay', !element.videoAutoplay)} className={`p-2 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-all ${element.videoAutoplay
            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold'
            : isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
              <span>Autoplay</span>
              <span className="text-[10px] font-bold">{element.videoAutoplay ? 'ON' : 'OFF'}</span>
            </button>

            <button type="button" onClick={() => updateProp('videoMuted', element.videoMuted !== false ? false : true)} className={`p-2 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-all ${element.videoMuted !== false
            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold'
            : isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
              <span>Muted</span>
              <span className="text-[10px] font-bold">{element.videoMuted !== false ? 'ON' : 'OFF'}</span>
            </button>

            <button type="button" onClick={() => updateProp('videoLoop', !element.videoLoop)} className={`p-2 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-all ${element.videoLoop
            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold'
            : isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
              <span>Loop</span>
              <span className="text-[10px] font-bold">{element.videoLoop ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={labelClass}>Corner Radius</label>
            <span className="text-[10px] font-mono text-indigo-400 font-semibold">{s.borderRadius !== undefined ? s.borderRadius : 14}px</span>
          </div>
          <div className={`grid grid-cols-4 gap-1 p-1 mb-2 ${boxGroupClass}`}>
            {[
            { label: 'Sharp (0)', val: 0 },
            { label: 'Round (8)', val: 8 },
            { label: 'Smooth (14)', val: 14 },
            { label: 'Large (24)', val: 24 },
        ].map((rd) => (<button key={rd.label} type="button" onClick={() => updateStyle('borderRadius', rd.val)} className={`py-1 text-[10px] rounded font-medium transition-all cursor-pointer ${s.borderRadius === rd.val
                ? 'bg-indigo-600 text-white font-semibold'
                : isLight
                    ? 'text-slate-600 hover:bg-slate-200'
                    : 'text-slate-400 hover:text-white'}`}>
                {rd.label}
              </button>))}
          </div>
          <input type="range" min={0} max={36} value={s.borderRadius !== undefined ? s.borderRadius : 14} onChange={(e) => updateStyle('borderRadius', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Border W: {s.borderWidth || 0}px</label>
            <input type="range" min={0} max={6} value={s.borderWidth !== undefined ? s.borderWidth : 0} onChange={(e) => updateStyle('borderWidth', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
          </div>
          <div>
            <label className={labelClass}>Border Color</label>
            <div className="flex items-center gap-1 mt-1">
              <input type="color" value={s.borderColor || '#4f46e5'} onChange={(e) => updateStyle('borderColor', e.target.value)} className="w-6 h-6 rounded border bg-transparent cursor-pointer"/>
              <input type="text" value={s.borderColor || ''} onChange={(e) => updateStyle('borderColor', e.target.value)} placeholder="Auto" className={`${inputClass} font-mono text-[10px] py-0.5 px-1`}/>
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass}>Video Shadow & Elevation</label>
          <div className={`grid grid-cols-6 gap-1 p-1 ${boxGroupClass}`}>
            {[
            { label: 'None', val: undefined },
            { label: 'SM', val: 'sm' },
            { label: 'MD', val: 'md' },
            { label: 'LG', val: 'lg' },
            { label: 'XL', val: 'xl' },
            { label: '2XL', val: '2xl' },
        ].map((sh) => (<button key={sh.label} type="button" onClick={() => updateStyle('shadow', sh.val)} className={`py-1 text-[10px] rounded font-medium transition-all cursor-pointer ${s.shadow === sh.val
                ? 'bg-indigo-600 text-white font-semibold'
                : isLight
                    ? 'text-slate-600 hover:bg-slate-200'
                    : 'text-slate-400 hover:text-white'}`}>
                {sh.label}
              </button>))}
          </div>
        </div>
      </div>);
};
