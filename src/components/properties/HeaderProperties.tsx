import React, { useState } from 'react';
import { Sliders, ChevronRight, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { WebsiteElement } from '../../types';
import { BackgroundController } from '../BackgroundController';
import { SectionPropertiesProps, getInspectorStyles } from './PropertiesCommon';
import { ManageHeaderModal } from './ManageHeaderModal';
export const HeaderProperties: React.FC<SectionPropertiesProps & {
    onUpdateElement: (updatedElement: WebsiteElement) => void;
}> = ({ selectedSection, onUpdateSection, onDeleteSection, onUpdateElement, uiTheme = 'dark', viewportMode = 'desktop', }) => {
    const [headerDeviceTab, setHeaderDeviceTab] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [headerSubTab, setHeaderSubTab] = useState<'content' | 'layout' | 'style' | 'menu' | 'manage'>('content');
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
        onUpdateSection({
            ...selectedSection,
            style: merged,
            styles: merged,
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
    const renderManageHeaderTab = () => {
        return (<div className="p-4 space-y-4 text-center">
        <p className="text-xs text-slate-400">Manage header navigation links, logo, and CTA buttons.</p>
        <button type="button" onClick={() => {
                setIsManagingHeaderContent(true);
                setHeaderSubTab('content');
            }} className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/25 cursor-pointer transition-all">
          Open Navigation Manager
        </button>
      </div>);
    };
    const renderHeaderProperties = () => {
        if (!selectedSection)
            return null;
        if (headerSubTab === 'manage') {
            return renderManageHeaderTab();
        }
        const s = selectedSection.styles || {};
        const isSticky = selectedSection.isSticky !== false;
        const isHeaderVisible = !selectedSection.hidden;
        return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
        <div className={`flex items-center justify-between p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
          <div>
            <span className="font-semibold text-xs block mb-0.5">Show Header</span>
            <span className="text-[10px] text-slate-400 block">Toggle header visibility on website</span>
          </div>
          <button type="button" onClick={() => updateSectionProp('hidden', !selectedSection.hidden)} className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${isHeaderVisible ? 'bg-indigo-600' : isLight ? 'bg-slate-300' : 'bg-slate-700'}`}>
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isHeaderVisible ? 'left-4.5' : 'left-0.5'}`}/>
          </button>
        </div>

        <button type="button" onClick={() => setHeaderSubTab('manage')} className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group mb-1 ${isLight
                ? 'bg-slate-50 hover:bg-indigo-50/60 border-slate-200 hover:border-indigo-300 text-slate-800'
                : 'bg-slate-900/80 hover:bg-indigo-950/40 border-slate-800 hover:border-indigo-700/60 text-slate-200'}`}>
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform"/>
            <span className="font-bold text-xs">Manage Header</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all"/>
        </button>

        <div>
          <label className={labelClass}>Header Label / Name</label>
          <input type="text" value={selectedSection.title || 'Header Bar'} onChange={(e) => updateSectionProp('title', e.target.value)} className={inputClass}/>
        </div>

        <div className={`flex items-center justify-between p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
          <div>
            <span className="font-semibold text-xs block mb-0.5">Sticky Header</span>
            <span className="text-[10px] text-slate-400 block">Pin header to top of viewport on scroll</span>
          </div>
          <button type="button" onClick={() => updateSectionProp('isSticky', !isSticky)} className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${isSticky ? 'bg-indigo-600' : 'bg-slate-700'}`}>
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isSticky ? 'left-4.5' : 'left-0.5'}`}/>
          </button>
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
            }} uiTheme={uiTheme} label="Header Background" allowTransparent={true}/>
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>Horizontal Alignment</label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'left', label: 'Left', icon: AlignLeft },
              { id: 'center', label: 'Center', icon: AlignCenter },
              { id: 'right', label: 'Right', icon: AlignRight },
            ].map((opt) => {
              const currentAlign = s.alignment || s.horizontalAlignment || 'center';
              const isSel = currentAlign === opt.id;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateSectionStyles({ alignment: opt.id, horizontalAlignment: opt.id })}
                  className={`py-1.5 px-2 text-xs rounded-lg border font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isSel
                      ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-xs'
                      : isLight
                      ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-700/40">
          <div className="flex items-center justify-between">
            <label className={labelClass}>Container Max-Width</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={320}
                max={2560}
                step={10}
                value={
                  s.maxWidth === 'full' || s.maxWidth === '100%'
                    ? 1920
                    : typeof s.maxWidth === 'number'
                    ? s.maxWidth
                    : parseInt(String(s.maxWidth || '1280'), 10) || 1280
                }
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (!isNaN(val) && val > 0) {
                    updateSectionStyle('maxWidth', `${val}px`);
                  }
                }}
                className={`w-20 px-2 py-0.5 text-right font-mono text-xs rounded border outline-none ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-900'
                    : 'bg-slate-900 border-slate-700 text-slate-100'
                }`}
              />
              <span className="text-[10px] text-slate-400 font-mono">px</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'full', label: 'Full (100%)', val: 'full' },
              { id: '1440px', label: '1440px', val: '1440px' },
              { id: '1280px', label: '1280px (7XL)', val: '1280px' },
              { id: '1152px', label: '1152px (6XL)', val: '1152px' },
              { id: '1024px', label: '1024px (5XL)', val: '1024px' },
              { id: '768px', label: '768px (Tablet)', val: '768px' },
            ].map((preset) => {
              const currentVal = s.maxWidth || '1280px';
              const isSel =
                currentVal === preset.val ||
                (preset.id === '1280px' && currentVal === '7xl') ||
                (preset.id === '1152px' && currentVal === '6xl') ||
                (preset.id === '1024px' && currentVal === '5xl') ||
                (preset.id === '768px' && currentVal === '3xl');
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => updateSectionStyle('maxWidth', preset.val)}
                  className={`py-1 text-[10px] rounded-lg border font-medium transition-all cursor-pointer text-center ${
                    isSel
                      ? 'bg-indigo-600 text-white font-bold border-indigo-600'
                      : isLight
                      ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <input
            type="range"
            min={320}
            max={1920}
            step={10}
            value={
              s.maxWidth === 'full' || s.maxWidth === '100%'
                ? 1920
                : typeof s.maxWidth === 'number'
                ? s.maxWidth
                : parseInt(String(s.maxWidth || '1280'), 10) || 1280
            }
            onChange={(e) => updateSectionStyle('maxWidth', `${e.target.value}px`)}
            className="w-full accent-indigo-500 cursor-pointer mt-1"
          />
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-700/40">
          <label className={labelClass}>Header Margins</label>

          <div className="flex items-center gap-1">
            {[0, 8, 16, 24, 32].map((mVal) => {
              const isSel = (s.marginTop === mVal && s.marginBottom === mVal) || (s.margin === mVal);
              return (
                <button
                  key={mVal}
                  type="button"
                  onClick={() => updateSectionStyles({ marginTop: mVal, marginBottom: mVal, margin: mVal })}
                  className={`flex-1 py-1 text-[10px] font-mono rounded-lg border transition-all cursor-pointer text-center ${
                    isSel
                      ? 'bg-indigo-600 text-white font-bold border-indigo-600'
                      : isLight
                      ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {mVal}px
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium text-slate-400">Margin Top</span>
                <div className="flex items-center gap-0.5">
                  <input
                    type="number"
                    min={0}
                    max={128}
                    value={s.marginTop !== undefined ? s.marginTop : (s.margin !== undefined ? s.margin : 0)}
                    onChange={(e) => updateSectionStyle('marginTop', Number(e.target.value))}
                    className={`w-12 px-1 py-0.5 text-right font-mono text-[10px] rounded border outline-none ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-100'
                    }`}
                  />
                  <span className="text-[9px] text-slate-400 font-mono">px</span>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={64}
                step={2}
                value={s.marginTop !== undefined ? s.marginTop : (s.margin !== undefined ? s.margin : 0)}
                onChange={(e) => updateSectionStyle('marginTop', Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium text-slate-400">Margin Bottom</span>
                <div className="flex items-center gap-0.5">
                  <input
                    type="number"
                    min={0}
                    max={128}
                    value={s.marginBottom !== undefined ? s.marginBottom : (s.margin !== undefined ? s.margin : 0)}
                    onChange={(e) => updateSectionStyle('marginBottom', Number(e.target.value))}
                    className={`w-12 px-1 py-0.5 text-right font-mono text-[10px] rounded border outline-none ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-100'
                    }`}
                  />
                  <span className="text-[9px] text-slate-400 font-mono">px</span>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={64}
                step={2}
                value={s.marginBottom !== undefined ? s.marginBottom : (s.margin !== undefined ? s.margin : 0)}
                onChange={(e) => updateSectionStyle('marginBottom', Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700/40">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Pad Y</label>
              <span className="text-[10px] font-mono text-indigo-400">
                {s.paddingY !== undefined ? s.paddingY : 16}px
              </span>
            </div>
            <input
              type="range"
              min={4}
              max={48}
              step={2}
              value={s.paddingY !== undefined ? s.paddingY : 16}
              onChange={(e) => updateSectionStyle('paddingY', Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Pad X</label>
              <span className="text-[10px] font-mono text-indigo-400">
                {s.paddingX !== undefined ? s.paddingX : 24}px
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={64}
              step={4}
              value={s.paddingX !== undefined ? s.paddingX : 24}
              onChange={(e) => updateSectionStyle('paddingX', Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700/40 space-y-3">
          <div>
            <label className={labelClass}>Border Placement</label>
            <div className={`grid grid-cols-4 gap-1 ${boxGroupClass}`}>
              {[
                { id: 'bottom', label: 'Bottom Only' },
                { id: 'all', label: 'All Sides' },
                { id: 'top-bottom', label: 'Top & Bot' },
                { id: 'none', label: 'None' },
            ].map((pos) => {
                const currentPos = s.borderPosition || 'bottom';
                const isSel = currentPos === pos.id;
                return (<button key={pos.id} type="button" onClick={() => updateSectionStyle('borderPosition', pos.id)} className={`py-1 text-[10px] rounded font-medium transition-all cursor-pointer ${isSel
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
              <label className={labelClass}>Border Radius</label>
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
            ].map((sh) => (<button key={sh.id} type="button" onClick={() => updateSectionStyle('shadow', sh.id)} className={`py-1 text-[10px] rounded font-medium transition-all cursor-pointer ${(s.shadow || 'none') === sh.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : isLight
                        ? 'text-slate-600 hover:bg-slate-200'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                {sh.label}
              </button>))}
          </div>
        </div>
      </div>);
    };
    return (<>
      {renderHeaderProperties()}
      <ManageHeaderModal isOpen={isManagingHeaderContent} onClose={() => setIsManagingHeaderContent(false)} selectedSection={selectedSection} onUpdateSection={onUpdateSection} onUpdateElement={onUpdateElement} uiTheme={uiTheme}/>
    </>);
};
