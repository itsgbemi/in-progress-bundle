import React from 'react';
import { Layers, Eye, X, MousePointer, Move, Maximize2 } from 'lucide-react';
import { ElementInspectorProps, getInspectorStyles } from './PropertiesCommon';
import { CheckCircle } from '../common';
export const ModalProperties: React.FC<ElementInspectorProps> = ({ selectedContext, onUpdateElement, uiTheme = 'dark', }) => {
    const isLight = uiTheme === 'light';
    const { inputClass, selectClass, labelClass } = getInspectorStyles(isLight);
    if (!selectedContext)
        return null;
    const { element } = selectedContext;
    const s = element.styles || {};
    const updateStyle = (key: string, value: any) => {
        onUpdateElement({
            ...element,
            styles: {
                ...(element.styles || {}),
                [key]: value,
            },
        });
    };
    const updateProp = (key: string, value: any) => {
        onUpdateElement({
            ...element,
            [key]: value,
        });
    };
    return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
      <div className={`p-3 rounded-xl border space-y-2.5 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
        <span className="font-bold text-[11px] flex items-center gap-1.5 text-indigo-400">
          <MousePointer className="w-3.5 h-3.5"/>
          <span>Trigger Action</span>
        </span>
        <div>
          <label className={labelClass}>Trigger Event / Action</label>
          <select value={element.modalTriggerAction || 'button'} onChange={(e) => updateProp('modalTriggerAction', e.target.value)} className={selectClass}>
            <option value="button">Button Click / User Action</option>
            <option value="visit">On Page Visit (Auto-Open)</option>
            <option value="scroll">On Scroll Depth (50%)</option>
            <option value="exit">On Exit Intent (Cursor Leave)</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Trigger Button Text</label>
          <input type="text" value={element.modalTriggerText || 'Open Modal Dialog'} onChange={(e) => updateProp('modalTriggerText', e.target.value)} className={inputClass}/>
        </div>
      </div>

      <div className={`p-3 rounded-xl border space-y-2.5 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
        <span className="font-bold text-[11px] flex items-center gap-1.5 text-indigo-400">
          <Layers className="w-3.5 h-3.5"/>
          <span>Modal Heading & Content</span>
        </span>

        <div>
          <label className={labelClass}>Modal Title</label>
          <input type="text" value={element.modalTitle || 'Special Announcement'} onChange={(e) => updateProp('modalTitle', e.target.value)} className={inputClass}/>
        </div>

        <div>
          <label className={labelClass}>Modal Body Content</label>
          <textarea value={element.content || 'Explore our latest features and exclusive offers.'} onChange={(e) => updateProp('content', e.target.value)} rows={3} className={`${inputClass} resize-none`}/>
        </div>
      </div>

      <div className={`p-3 rounded-xl border space-y-2.5 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
        <span className="font-bold text-[11px] flex items-center gap-1.5 text-indigo-400">
          <Eye className="w-3.5 h-3.5"/>
          <span>Overlay & Backdrop</span>
        </span>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Backdrop Blur</label>
            <select value={s.backdropBlur || 'md'} onChange={(e) => updateStyle('backdropBlur', e.target.value)} className={selectClass}>
              <option value="none">None</option>
              <option value="sm">Subtle (sm)</option>
              <option value="md">Medium (md)</option>
              <option value="lg">Heavy (lg)</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Overlay Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={s.overlayColor || '#000000'} onChange={(e) => updateStyle('overlayColor', e.target.value)} className="w-8 h-8 rounded-lg border border-slate-700 cursor-pointer p-0 bg-transparent shrink-0"/>
              <input type="text" value={s.overlayColor || '#000000'} onChange={(e) => updateStyle('overlayColor', e.target.value)} className={inputClass}/>
            </div>
          </div>
        </div>

        <div className="pt-1">
          <CheckCircle
            checked={element.closeOnClickOutside !== false}
            onChange={(checked) => updateProp('closeOnClickOutside', checked)}
            size="sm"
            isLight={isLight}
            label="Close Modal On Overlay Click"
            labelClassName="font-medium text-xs"
          />
        </div>
      </div>

      <div className={`p-3 rounded-xl border space-y-2.5 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
        <span className="font-bold text-[11px] flex items-center gap-1.5 text-indigo-400">
          <X className="w-3.5 h-3.5"/>
          <span>Close Button Settings</span>
        </span>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Close Button Visibility</label>
            <select value={element.showCloseButton !== false ? 'show' : 'hide'} onChange={(e) => updateProp('showCloseButton', e.target.value === 'show')} className={selectClass}>
              <option value="show">Visible</option>
              <option value="hide">Hidden</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Position</label>
            <select value={element.closeButtonPosition || 'top-right'} onChange={(e) => updateProp('closeButtonPosition', e.target.value)} className={selectClass}>
              <option value="top-right">Top Right</option>
              <option value="top-left">Top Left</option>
              <option value="outside">Outside Window</option>
            </select>
          </div>
        </div>
      </div>

      <div className={`p-3 rounded-xl border space-y-2.5 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
        <span className="font-bold text-[11px] flex items-center gap-1.5 text-indigo-400">
          <Move className="w-3.5 h-3.5"/>
          <span>Position & Placement</span>
        </span>

        <div>
          <label className={labelClass}>Screen Position</label>
          <select value={element.modalPosition || 'center'} onChange={(e) => updateProp('modalPosition', e.target.value)} className={selectClass}>
            <option value="center">Centered Screen Overlay</option>
            <option value="top">Top Banner Sheet</option>
            <option value="bottom">Bottom Bottom Sheet</option>
            <option value="left-drawer">Left Side Drawer</option>
            <option value="right-drawer">Right Side Drawer</option>
          </select>
        </div>
      </div>

      <div className={`p-3 rounded-xl border space-y-2.5 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
        <span className="font-bold text-[11px] flex items-center gap-1.5 text-indigo-400">
          <Maximize2 className="w-3.5 h-3.5"/>
          <span>Dimensions & Background</span>
        </span>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Width</label>
            <select value={s.modalWidth || 'md'} onChange={(e) => updateStyle('modalWidth', e.target.value)} className={selectClass}>
              <option value="sm">Small (380px)</option>
              <option value="md">Medium (512px)</option>
              <option value="lg">Large (640px)</option>
              <option value="xl">Extra Large (768px)</option>
              <option value="full">Full Screen (100%)</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Height</label>
            <select value={s.modalHeight || 'auto'} onChange={(e) => updateStyle('modalHeight', e.target.value)} className={selectClass}>
              <option value="auto">Auto Content Height</option>
              <option value="sm">Compact (320px)</option>
              <option value="md">Standard (500px)</option>
              <option value="lg">Tall (700px)</option>
              <option value="screen">Full Screen Height</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className={labelClass}>Card Background</label>
            <div className="flex items-center gap-2">
              <input type="color" value={s.backgroundColor || (isLight ? '#ffffff' : '#1e293b')} onChange={(e) => updateStyle('backgroundColor', e.target.value)} className="w-8 h-8 rounded-lg border border-slate-700 cursor-pointer p-0 bg-transparent shrink-0"/>
              <input type="text" value={s.backgroundColor || (isLight ? '#ffffff' : '#1e293b')} onChange={(e) => updateStyle('backgroundColor', e.target.value)} className={inputClass}/>
            </div>
          </div>

          <div>
            <label className={labelClass}>Text Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={s.textColor || (isLight ? '#0f172a' : '#ffffff')} onChange={(e) => updateStyle('textColor', e.target.value)} className="w-8 h-8 rounded-lg border border-slate-700 cursor-pointer p-0 bg-transparent shrink-0"/>
              <input type="text" value={s.textColor || (isLight ? '#0f172a' : '#ffffff')} onChange={(e) => updateStyle('textColor', e.target.value)} className={inputClass}/>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
