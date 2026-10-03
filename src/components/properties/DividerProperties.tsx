import React, { useState } from 'react';
import { WebsiteElement } from '../../types';
import { ElementInspectorProps, getInspectorStyles, TypographyControls } from './PropertiesCommon';
export const DividerProperties: React.FC<ElementInspectorProps> = ({ selectedContext, onUpdateElement, onSelectContext, onDeleteElement, uiTheme = 'dark', viewportMode = 'desktop', }) => {
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
    const thickness = s.borderWidth !== undefined ? s.borderWidth : 1;
    const color = s.borderColor || s.backgroundColor || (isLight ? '#cbd5e1' : '#334155');
    const borderStyle = s.borderStyle || 'solid';
    const spacingY = s.marginY !== undefined ? s.marginY : s.paddingY !== undefined ? s.paddingY : 16;
    const maxWidth = s.maxWidth || 'full';
    const marginAuto = s.marginAuto !== undefined ? s.marginAuto : true;
    return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={labelClass}>Line Thickness</label>
            <span className="text-[10px] font-mono text-indigo-400">{thickness}px</span>
          </div>
          <input type="range" min={1} max={16} value={thickness} onChange={(e) => {
            updateStyle('borderWidth', Number(e.target.value));
        }} className="w-full accent-indigo-500 cursor-pointer"/>
        </div>

        <div>
          <label className={labelClass}>Line Style</label>
          <div className={`grid grid-cols-3 gap-1 ${boxGroupClass}`}>
            {(['solid', 'dashed', 'dotted'] as const).map((styleOpt) => (<button key={styleOpt} type="button" onClick={() => updateStyle('borderStyle', styleOpt)} className={`py-1.5 text-xs rounded capitalize font-medium transition-all ${borderStyle === styleOpt
                ? 'bg-indigo-600 text-white font-semibold'
                : isLight
                    ? 'text-slate-600 hover:bg-slate-200'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                {styleOpt}
              </button>))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Line Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={color.startsWith('#') ? color : '#334155'} onChange={(e) => {
            updateStyle('borderColor', e.target.value);
            updateStyle('backgroundColor', e.target.value);
        }} className={`w-8 h-8 rounded border bg-transparent cursor-pointer ${isLight ? 'border-slate-300' : 'border-slate-800'}`}/>
            <input type="text" value={color} onChange={(e) => {
            updateStyle('borderColor', e.target.value);
            updateStyle('backgroundColor', e.target.value);
        }} className={`${inputClass} font-mono`}/>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={labelClass}>Vertical Spacing / Margin</label>
            <span className="text-[10px] font-mono text-indigo-400">{spacingY}px</span>
          </div>
          <input type="range" min={4} max={80} step={2} value={spacingY} onChange={(e) => {
            updateStyle('marginY', Number(e.target.value));
            updateStyle('paddingY', Number(e.target.value));
        }} className="w-full accent-indigo-500 cursor-pointer"/>
        </div>
      </div>);
};
