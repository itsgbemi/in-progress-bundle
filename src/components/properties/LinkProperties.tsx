import React from 'react';
import { WebsiteElement } from '../../types';
import { ElementInspectorProps, getInspectorStyles, TypographyControls } from './PropertiesCommon';
import { BrandLinkPicker } from '../common';

export const LinkProperties: React.FC<ElementInspectorProps> = ({ selectedContext, onUpdateElement, uiTheme = 'dark' }) => {
    const isLight = uiTheme === 'light';
    const { inputClass, selectClass, labelClass } = getInspectorStyles(isLight);

    if (!selectedContext)
        return null;
    const { element } = selectedContext;
    const s = element.styles || {};

    const updateStyle = (key: string, value: any) => {
        const updatedElement: WebsiteElement = {
            ...element,
            styles: {
                ...(element.styles || {}),
                [key]: value,
            },
        };
        onUpdateElement(updatedElement);
    };

    const updateProp = (key: string, value: any) => {
        const updatedElement: WebsiteElement = {
            ...element,
            [key]: value,
            ...(key === 'content' ? { label: value } : {}),
        };
        onUpdateElement(updatedElement);
    };

    const renderTypographyControls = (styles: any) => (<TypographyControls styles={styles} onUpdateStyle={updateStyle} uiTheme={uiTheme}/>);

    return (
        <div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
            <div>
                <label className={labelClass}>Link Text Label</label>
                <input type="text" value={element.content || element.label || ''} onChange={(e) => updateProp('content', e.target.value)} className={inputClass} placeholder="e.g. About Us"/>
            </div>

            <div>
                <label className={labelClass}>Destination</label>
                <div className="flex items-center gap-1.5">
                    <input type="text" value={element.href || ''} onChange={(e) => updateProp('href', e.target.value)} placeholder="e.g. #about, https://..., mailto:..." className={`${inputClass} flex-1`}/>
                    <BrandLinkPicker
                        uiTheme={uiTheme}
                        variant="folderIcon"
                        align="right"
                        onSelectLink={(url, suggestedLabel) => {
                            updateProp('href', url);
                            if (!element.content && suggestedLabel) {
                                updateProp('content', suggestedLabel);
                            }
                        }}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between py-1">
                <span className={`font-semibold text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    Open in New Tab
                </span>
                <button
                    type="button"
                    role="switch"
                    aria-checked={element.target === '_blank'}
                    onClick={() => updateProp('target', element.target === '_blank' ? '_self' : '_blank')}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        element.target === '_blank'
                            ? 'bg-indigo-600'
                            : isLight ? 'bg-slate-300' : 'bg-slate-700'
                    }`}
                >
                    <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                            element.target === '_blank' ? 'translate-x-4' : 'translate-x-0'
                        }`}
                    />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelClass}>Text Color</label>
                    <div className="flex items-center gap-1.5">
                        <input type="color" value={s.textColor || (isLight ? '#4f46e5' : '#cbd5e1')} onChange={(e) => updateStyle('textColor', e.target.value)} className="w-7 h-7 rounded border bg-transparent cursor-pointer shrink-0"/>
                        <input type="text" value={s.textColor || (isLight ? '#4f46e5' : '#cbd5e1')} onChange={(e) => updateStyle('textColor', e.target.value)} className={`${inputClass} font-mono text-[11px]`}/>
                    </div>
                </div>
                <div>
                    <label className={labelClass}>Background</label>
                    <div className="flex items-center gap-1.5">
                        <input type="color" value={s.backgroundColor && s.backgroundColor !== 'transparent' ? s.backgroundColor : '#312e81'} onChange={(e) => updateStyle('backgroundColor', e.target.value)} className="w-7 h-7 rounded border bg-transparent cursor-pointer shrink-0"/>
                        <input type="text" value={s.backgroundColor || 'transparent'} onChange={(e) => updateStyle('backgroundColor', e.target.value)} className={`${inputClass} font-mono text-[11px]`}/>
                    </div>
                </div>
            </div>

            {renderTypographyControls(s)}
        </div>
    );
};
