import React from 'react';
import { AlignCenter, ArrowUpToLine, ArrowDownToLine, StretchVertical } from 'lucide-react';
import { BackgroundController } from '../BackgroundController';
import { SectionPropertiesProps, getInspectorStyles } from './PropertiesCommon';
export const FooterProperties: React.FC<SectionPropertiesProps> = ({ selectedSection, onUpdateSection, onDeleteSection, uiTheme = 'dark', viewportMode = 'desktop', }) => {
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
    const renderFooterProperties = () => {
        if (!selectedSection)
            return null;
        const s = selectedSection.styles || {};
        const layout = selectedSection.footerLayout || 'columns-4';
        const currentCols = String(s.layoutColumns || (layout === 'columns-3' || (layout as string) === 'columns3' ? '3' :
            layout === 'minimal' || layout === 'centered' ? '1' :
                layout === 'split' ? '2' :
                    '4'));
        return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
        <div>
          <label className={labelClass}>Footer Label / Name</label>
          <input type="text" value={selectedSection.title || 'Footer Section'} onChange={(e) => updateSectionProp('title', e.target.value)} className={inputClass}/>
        </div>

        <div className="pt-2 border-t border-slate-700/40 space-y-3">
          <h4 className="font-extrabold uppercase tracking-wider text-[11px] opacity-80">
            Footer Layout & Multi-Column
          </h4>

          <div>
            <label className={labelClass}>Layout Columns</label>
            <div className={`grid grid-cols-4 gap-1 ${boxGroupClass}`}>
              {[
                { id: '1', label: '1 Col / Stack' },
                { id: '2', label: '2 Columns' },
                { id: '3', label: '3 Columns' },
                { id: '4', label: '4 Columns' },
            ].map((colOpt) => {
                const isSel = currentCols === colOpt.id;
                return (<button key={colOpt.id} type="button" onClick={() => updateSectionStyle('layoutColumns', colOpt.id)} className={`py-1 text-[10px] rounded font-medium transition-all cursor-pointer ${isSel
                        ? 'bg-indigo-600 text-white font-semibold'
                        : isLight
                            ? 'text-slate-600 hover:bg-slate-200'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                    {colOpt.label}
                  </button>);
            })}
            </div>
          </div>

          {currentCols === '2' && (<div>
              <label className={labelClass}>Column Width Ratio</label>
              <select value={s.columnRatio || (layout === 'split' ? '1:2' : '1:1')} onChange={(e) => updateSectionStyle('columnRatio', e.target.value)} className={selectClass}>
                <option value="1:1">Equal Widths (1:1)</option>
                <option value="1:2">Narrow Left, Wide Right (1:2)</option>
                <option value="2:1">Wide Left, Narrow Right (2:1)</option>
                <option value="1:3">Extra Narrow Left, Extra Wide Right (1:3)</option>
                <option value="3:1">Extra Wide Left, Extra Narrow Right (3:1)</option>
              </select>
            </div>)}

          {currentCols === '3' && (<div>
              <label className={labelClass}>Column Width Ratio</label>
              <select value={s.columnRatio || '1:1:1'} onChange={(e) => updateSectionStyle('columnRatio', e.target.value)} className={selectClass}>
                <option value="1:1:1">Equal Widths (1:1:1)</option>
                <option value="1:2:1">Wide Center (1:2:1)</option>
                <option value="2:1:1">Wide Left (2:1:1)</option>
                <option value="1:1:2">Wide Right (1:1:2)</option>
              </select>
            </div>)}

          <div className="space-y-2 pt-2 border-t border-slate-700/40">
            <label className={labelClass}>Responsive Column Gaps</label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium text-slate-400">Desktop</span>
                  <span className="text-[10px] font-mono text-indigo-400">{s.gap !== undefined ? s.gap : 32}px</span>
                </div>
                <select value={s.gap !== undefined ? String(s.gap) : '32'} onChange={(e) => updateSectionStyle('gap', Number(e.target.value))} className={selectClass}>
                  <option value="0">0px</option>
                  <option value="8">8px</option>
                  <option value="12">12px</option>
                  <option value="16">16px</option>
                  <option value="24">24px</option>
                  <option value="32">32px</option>
                  <option value="48">48px</option>
                  <option value="64">64px</option>
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium text-slate-400">Tablet</span>
                  <span className="text-[10px] font-mono text-indigo-400">{s.gapTablet !== undefined ? s.gapTablet : (s.gap !== undefined ? Math.min(Number(s.gap), 24) : 16)}px</span>
                </div>
                <select value={s.gapTablet !== undefined ? String(s.gapTablet) : String(s.gap !== undefined ? Math.min(Number(s.gap), 24) : 16)} onChange={(e) => updateSectionStyle('gapTablet', Number(e.target.value))} className={selectClass}>
                  <option value="0">0px</option>
                  <option value="5">5px</option>
                  <option value="8">8px</option>
                  <option value="10">10px</option>
                  <option value="12">12px</option>
                  <option value="16">16px</option>
                  <option value="20">20px</option>
                  <option value="24">24px</option>
                  <option value="32">32px</option>
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium text-slate-400">Mobile Stack</span>
                  <span className="text-[10px] font-mono text-indigo-400">{s.gapMobile !== undefined ? s.gapMobile : (s.gapTablet !== undefined ? Math.min(Number(s.gapTablet), 16) : 12)}px</span>
                </div>
                <select value={s.gapMobile !== undefined ? String(s.gapMobile) : String(s.gapTablet !== undefined ? Math.min(Number(s.gapTablet), 16) : 12)} onChange={(e) => updateSectionStyle('gapMobile', Number(e.target.value))} className={selectClass}>
                  <option value="0">0px</option>
                  <option value="5">5px</option>
                  <option value="8">8px</option>
                  <option value="10">10px</option>
                  <option value="12">12px</option>
                  <option value="16">16px</option>
                  <option value="20">20px</option>
                  <option value="24">24px</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Vertical Alignment (Align Items)</label>
            <div className={`grid grid-cols-4 gap-1 ${boxGroupClass}`}>
              {[
                { id: 'flex-start', icon: ArrowUpToLine, title: 'Align Top (flex-start)' },
                { id: 'center', icon: AlignCenter, title: 'Align Middle (center)' },
                { id: 'flex-end', icon: ArrowDownToLine, title: 'Align Bottom (flex-end)' },
                { id: 'stretch', icon: StretchVertical, title: 'Stretch Full (stretch)' },
            ].map((al) => {
                const IconComponent = al.icon;
                const activeVal = s.alignItems || 'flex-start';
                const isSel = activeVal === al.id || (activeVal === 'top' && al.id === 'flex-start');
                return (<button key={al.id} type="button" onClick={() => updateSectionStyle('alignItems', al.id)} className={`p-1.5 rounded flex items-center justify-center transition-all cursor-pointer ${isSel
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : isLight
                            ? 'text-slate-600 hover:bg-slate-200'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'}`} title={al.title}>
                    <IconComponent className="w-3.5 h-3.5"/>
                  </button>);
            })}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700/40">
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
            }} uiTheme={uiTheme} label="Footer Background" allowTransparent={true}/>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700/40">
          <div>
            <label className={labelClass}>Container Max-Width</label>
            <select value={s.maxWidth || '7xl'} onChange={(e) => updateSectionStyle('maxWidth', e.target.value)} className={selectClass}>
              <option value="full">Full Width (100%)</option>
              <option value="xl">XL (1400px)</option>
              <option value="7xl">7XL Default (1280px)</option>
              <option value="6xl">6XL Compact (1152px)</option>
              <option value="5xl">5XL Editorial (1024px)</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Vertical Spacing (Y): {s.paddingY !== undefined ? s.paddingY : 48}px</label>
            <input type="range" min={12} max={120} step={4} value={s.paddingY !== undefined ? s.paddingY : 48} onChange={(e) => updateSectionStyle('paddingY', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
          </div>
        </div>

        <div>
          <label className={labelClass}>Horizontal Spacing (X): {s.paddingX !== undefined ? s.paddingX : 24}px</label>
          <input type="range" min={0} max={64} step={4} value={s.paddingX !== undefined ? s.paddingX : 24} onChange={(e) => updateSectionStyle('paddingX', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
        </div>

        <div className="pt-2 border-t border-slate-700/40 space-y-3">
          <div>
            <label className={labelClass}>Border Placement</label>
            <div className={`grid grid-cols-5 gap-1 ${boxGroupClass}`}>
              {[
                { id: 'top', label: 'Top' },
                { id: 'all', label: 'All Sides' },
                { id: 'bottom', label: 'Bottom' },
                { id: 'top-bottom', label: 'Top & Bot' },
                { id: 'none', label: 'None' },
            ].map((pos) => {
                const currentPos = s.borderPosition || 'top';
                const isSel = currentPos === pos.id;
                return (<button key={pos.id} type="button" onClick={() => updateSectionStyle('borderPosition', pos.id)} className={`py-1 text-[10px] rounded font-medium transition-all ${isSel
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
                <span className="text-[10px] font-mono text-indigo-400">
                  {s.borderWidth !== undefined ? s.borderWidth : (s.borderPosition && s.borderPosition !== 'none' ? 1 : 1)}px
                </span>
              </div>
              <input type="range" min={0} max={12} value={s.borderWidth !== undefined ? s.borderWidth : (s.borderPosition && s.borderPosition !== 'none' ? 1 : 1)} onChange={(e) => updateSectionStyle('borderWidth', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
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
              <input type="color" value={s.borderColor || (isLight ? '#e2e8f0' : '#1e293b')} onChange={(e) => updateSectionStyle('borderColor', e.target.value)} className="w-8 h-8 rounded border bg-transparent cursor-pointer shrink-0"/>
              <input type="text" value={s.borderColor || (isLight ? '#e2e8f0' : '#1e293b')} onChange={(e) => updateSectionStyle('borderColor', e.target.value)} className={`${inputClass} font-mono`}/>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Corner Radius</label>
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
            ].map((sh) => (<button key={sh.id} type="button" onClick={() => updateSectionStyle('shadow', sh.id)} className={`py-1 text-[10px] rounded font-medium transition-all ${(s.shadow || 'none') === sh.id
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
    return renderFooterProperties();
};
