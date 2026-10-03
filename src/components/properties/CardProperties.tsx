import React, { useState } from 'react';
import { WebsiteElement } from '../../types';
import { BackgroundController } from '../BackgroundController';
import { ElementInspectorProps, getInspectorStyles, TypographyControls } from './PropertiesCommon';
export const CardProperties: React.FC<ElementInspectorProps> = ({ selectedContext, onUpdateElement, onSelectContext, onDeleteElement, uiTheme = 'dark', viewportMode = 'desktop', }) => {
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
    const { element, sectionId } = selectedContext;
    const s = element.styles || {};
    const handleAddCardChild = (childType: 'heading' | 'text' | 'button' | 'badge' | 'image') => {
        const newChild: WebsiteElement = {
            id: `el-${Date.now()}`,
            type: childType,
            label: childType.toUpperCase(),
            content: childType === 'heading'
                ? 'Card Title'
                : childType === 'text'
                    ? 'Description text inside card.'
                    : childType === 'button'
                        ? 'Learn More'
                        : childType === 'badge'
                            ? 'Featured'
                            : '',
            tag: childType === 'heading' ? 'h4' : 'p',
            src: childType === 'image' ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80' : undefined,
            styles: {
                textColor: childType === 'heading' ? '#ffffff' : '#94a3b8',
                fontSize: childType === 'heading' ? 18 : 14,
                fontWeight: childType === 'heading' ? '600' : '400',
            },
        };
        const updatedChildren = [...(element.children || []), newChild];
        updateProp('children', updatedChildren);
    };
    const handleDeleteCardChild = (childId: string) => {
        const updatedChildren = (element.children || []).filter((c) => c.id !== childId);
        updateProp('children', updatedChildren);
    };
    return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
        <div>
          <BackgroundController styles={s} onChange={(bgUpdates) => {
            updateProp('styles', {
                ...s,
                ...bgUpdates,
            });
        }} uiTheme={uiTheme} label="Card Background" allowTransparent={true}/>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Border Width: {s.borderWidth || 1}px</label>
            <input type="range" min={0} max={8} value={s.borderWidth !== undefined ? s.borderWidth : 1} onChange={(e) => updateStyle('borderWidth', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
          </div>
          <div>
            <label className={labelClass}>Corner Radius: {s.borderRadius || 16}px</label>
            <input type="range" min={0} max={36} value={s.borderRadius !== undefined ? s.borderRadius : 16} onChange={(e) => updateStyle('borderRadius', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
          </div>
        </div>

        <div>
          <label className={labelClass}>Border Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={s.borderColor || (isLight ? '#e2e8f0' : '#1e293b')} onChange={(e) => updateStyle('borderColor', e.target.value)} className="w-8 h-8 rounded border bg-transparent cursor-pointer"/>
            <input type="text" value={s.borderColor || (isLight ? '#e2e8f0' : '#1e293b')} onChange={(e) => updateStyle('borderColor', e.target.value)} className={`${inputClass} font-mono`}/>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Padding Y: {s.paddingY !== undefined ? s.paddingY : 24}px</label>
            <input type="range" min={8} max={64} step={4} value={s.paddingY !== undefined ? s.paddingY : 24} onChange={(e) => updateStyle('paddingY', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
          </div>
          <div>
            <label className={labelClass}>Padding X: {s.paddingX !== undefined ? s.paddingX : 24}px</label>
            <input type="range" min={8} max={64} step={4} value={s.paddingX !== undefined ? s.paddingX : 24} onChange={(e) => updateStyle('paddingX', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
          </div>
        </div>

        <div>
          <label className={labelClass}>Card Elevation / Shadow</label>
          <div className={`grid grid-cols-5 gap-1 ${boxGroupClass}`}>
            {[
            { label: 'None', val: undefined },
            { label: 'SM', val: 'sm' },
            { label: 'MD', val: 'md' },
            { label: 'LG', val: 'lg' },
            { label: 'XL', val: 'xl' },
        ].map((sh) => (<button key={sh.label} type="button" onClick={() => updateStyle('shadow', sh.val)} className={`py-1 text-[11px] rounded font-medium transition-all ${s.shadow === sh.val
                ? 'bg-indigo-600 text-white font-semibold'
                : isLight
                    ? 'text-slate-600 hover:bg-slate-200'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                {sh.label}
              </button>))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Hover Interaction Effect</label>
          <select value={s.hoverEffect || 'none'} onChange={(e) => updateStyle('hoverEffect', e.target.value)} className={selectClass}>
            <option value="none">None (Static)</option>
            <option value="lift">Lift Up on Hover (Floating Card)</option>
            <option value="glow">Glow Border on Hover</option>
            <option value="scale">Subtle Scale Up</option>
          </select>
        </div>
      </div>);
};
