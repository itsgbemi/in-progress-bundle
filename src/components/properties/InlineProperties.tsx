import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { WebsiteElement } from '../../types';
import { BackgroundController } from '../BackgroundController';
import { ElementInspectorProps, getInspectorStyles } from './PropertiesCommon';
export const InlineProperties: React.FC<ElementInspectorProps> = ({ selectedContext, onUpdateElement, onSelectContext, onDeleteElement, uiTheme = 'dark', viewportMode = 'desktop', }) => {
    const [activeTab, setActiveTab] = useState<'content' | 'style' | 'layout'>('style');
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
    if (!selectedContext)
        return null;
    const { element, sectionId } = selectedContext;
    const s = element.styles || {};
    const children = element.children || [];
    return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
      <div className={`flex border-b pb-2 gap-2 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
        <button type="button" onClick={() => setActiveTab('style')} className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${activeTab === 'style'
            ? 'bg-indigo-600 text-white'
            : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'}`}>
          Style & Appearance
        </button>
        <button type="button" onClick={() => setActiveTab('layout')} className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${activeTab === 'layout'
            ? 'bg-indigo-600 text-white'
            : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'}`}>
          Layout & Wrap
        </button>
        <button type="button" onClick={() => setActiveTab('content')} className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${activeTab === 'content'
            ? 'bg-indigo-600 text-white'
            : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'}`}>
          Items ({children.length})
        </button>
      </div>

      {activeTab === 'style' && (<div className="space-y-4">
          <div>
            <BackgroundController styles={s} onChange={(bgUpdates) => {
                updateProp('styles', {
                    ...s,
                    ...bgUpdates,
                });
            }} uiTheme={uiTheme}/>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Padding X (px)</label>
              <input type="number" value={s.paddingX ?? 16} onChange={(e) => updateStyle('paddingX', Number(e.target.value))} className={inputClass}/>
            </div>
            <div>
              <label className={labelClass}>Padding Y (px)</label>
              <input type="number" value={s.paddingY ?? 16} onChange={(e) => updateStyle('paddingY', Number(e.target.value))} className={inputClass}/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Border Radius (px)</label>
              <input type="number" value={s.borderRadius ?? 12} onChange={(e) => updateStyle('borderRadius', Number(e.target.value))} className={inputClass}/>
            </div>
            <div>
              <label className={labelClass}>Border Width (px)</label>
              <input type="number" value={s.borderWidth ?? 1} onChange={(e) => updateStyle('borderWidth', Number(e.target.value))} className={inputClass}/>
            </div>
          </div>
        </div>)}

      {activeTab === 'layout' && (<div className="space-y-4">
          <div className={`p-4 rounded-xl border space-y-4 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
            <div>
              <label className={labelClass}>Display Mode</label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                <button type="button" onClick={() => updateStyle('display', 'flex')} className={`py-2 px-3 rounded-lg border text-center font-medium cursor-pointer ${(s.display || 'flex') === 'flex'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : isLight ? 'border-slate-200 bg-white text-slate-700' : 'border-slate-800 bg-slate-900 text-slate-300'}`}>
                  Block Flex
                </button>
                <button type="button" onClick={() => updateStyle('display', 'inline-flex')} className={`py-2 px-3 rounded-lg border text-center font-medium cursor-pointer ${s.display === 'inline-flex'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : isLight ? 'border-slate-200 bg-white text-slate-700' : 'border-slate-800 bg-slate-900 text-slate-300'}`}>
                  Inline Flex
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Inline Flex allows this container to sit inside text naturally.</p>
            </div>
          </div>

          <div>
            <label className={labelClass}>Layout Direction</label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => updateStyle('layoutDirection', 'row')} className={`py-2 px-3 rounded-lg border text-center font-medium cursor-pointer ${(s.layoutDirection || 'row') === 'row'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : isLight ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-slate-800 bg-slate-900 text-slate-300'}`}>
                Horizontal (Row)
              </button>
              <button type="button" onClick={() => updateStyle('layoutDirection', 'col')} className={`py-2 px-3 rounded-lg border text-center font-medium cursor-pointer ${s.layoutDirection === 'col'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : isLight ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-slate-800 bg-slate-900 text-slate-300'}`}>
                Vertical (Column)
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>Flex Wrap</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'nowrap', label: 'No Wrap' },
                { id: 'wrap', label: 'Wrap' },
                { id: 'wrap-reverse', label: 'Wrap Rev' },
            ].map((w) => (<button key={w.id} type="button" onClick={() => updateStyle('flexWrap', w.id)} className={`py-1.5 px-2 rounded-lg border text-center font-medium text-[11px] cursor-pointer ${(s.flexWrap || 'nowrap') === w.id
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : isLight ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-slate-800 bg-slate-900 text-slate-300'}`}>
                  {w.label}
                </button>))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Item Gap: {s.gap ?? 16}px</label>
            <input type="range" min="0" max="48" step="4" value={s.gap ?? 16} onChange={(e) => updateStyle('gap', Number(e.target.value))} className="w-full accent-indigo-600 cursor-pointer"/>
          </div>

          <div>
            <label className={labelClass}>Align Items</label>
            <select value={s.alignItems || 'center'} onChange={(e) => updateStyle('alignItems', e.target.value)} className={selectClass}>
              <option value="flex-start">Start</option>
              <option value="center">Center</option>
              <option value="flex-end">End</option>
              <option value="stretch">Stretch</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Justify Content</label>
            <select value={s.justifyContent || 'flex-start'} onChange={(e) => updateStyle('justifyContent', e.target.value)} className={selectClass}>
              <option value="flex-start">Start</option>
              <option value="center">Center</option>
              <option value="flex-end">End</option>
              <option value="space-between">Space Between</option>
              <option value="space-around">Space Around</option>
            </select>
          </div>
        </div>)}

      {activeTab === 'content' && (<div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Inline Items</span>
            <span className="text-[10px] text-slate-500">Icon, Image, Text allowed</span>
          </div>

          {children.length === 0 ? (<div className={`p-6 text-center border border-dashed rounded-xl ${isLight ? 'border-slate-300 bg-slate-50' : 'border-slate-800 bg-slate-900/40'}`}>
              <p className="text-slate-500 mb-2">No items in this Inline Box</p>
            </div>) : (<div className="space-y-2 max-h-60 overflow-y-auto">
              {children.map((child, idx) => (<div key={child.id} className={`flex items-center justify-between p-2 rounded-lg border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] text-slate-400">#{idx + 1}</span>
                    <span className="font-medium capitalize truncate">{child.label || child.type}</span>
                  </div>
                  <button type="button" onClick={() => {
                        const newChildren = children.filter((c) => c.id !== child.id);
                        updateProp('children', newChildren);
                    }} className="p-1 rounded hover:bg-rose-500/10 text-rose-500 transition-colors cursor-pointer" title="Remove item">
                    <Trash2 className="w-3.5 h-3.5"/>
                  </button>
                </div>))}
            </div>)}
        </div>)}
    </div>);
};
