import React, { useState } from 'react';
import { WebsiteElement } from '../../types';
import { BackgroundController } from '../BackgroundController';
import { ElementInspectorProps, getInspectorStyles } from './PropertiesCommon';
import { AlignLeft, AlignCenter, AlignRight, Maximize2, LayoutGrid, SlidersHorizontal, Layers, Columns, ArrowUpToLine, ArrowDownToLine, StretchVertical } from 'lucide-react';

export const GridProperties: React.FC<ElementInspectorProps> = ({ selectedContext, onUpdateElement, onSelectContext, onDeleteElement, uiTheme = 'dark', viewportMode = 'desktop', }) => {
    const [activeTab, setActiveTab] = useState<'layout' | 'style' | 'content'>('layout');
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

    const updateMultipleStyles = (newStyles: Record<string, any>) => {
        if (!selectedContext)
            return;
        const updatedElement: WebsiteElement = {
            ...selectedContext.element,
            styles: {
                ...(selectedContext.element.styles || {}),
                ...newStyles,
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

    const currentWidth = s.width !== undefined ? String(s.width) : (s.fullWidth !== false ? '100%' : '100%');
    const isCustomWidth = currentWidth !== '100%' && currentWidth !== '75%' && currentWidth !== '66.6%' && currentWidth !== '50%';

    return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
      <div className={`flex border-b pb-2 gap-2 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
        <button type="button" onClick={() => setActiveTab('layout')} className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${activeTab === 'layout'
            ? 'bg-indigo-600 text-white'
            : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'}`}>
          Layout & Width
        </button>
        <button type="button" onClick={() => setActiveTab('style')} className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${activeTab === 'style'
            ? 'bg-indigo-600 text-white'
            : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'}`}>
          Background & Spacing
        </button>
        <button type="button" onClick={() => setActiveTab('content')} className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${activeTab === 'content'
            ? 'bg-indigo-600 text-white'
            : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'}`}>
          Items ({children.length})
        </button>
      </div>

      {activeTab === 'layout' && (<div className="space-y-4">
          <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/40 border-slate-800'} space-y-3`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[11px] flex items-center gap-1.5 text-indigo-500">
                <Maximize2 className="w-3.5 h-3.5" />
                Grid Container Width
              </span>
              <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {currentWidth}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1">
              {[
                { label: '100%', val: '100%', full: true },
                { label: '75%', val: '75%', full: false },
                { label: '66%', val: '66.6%', full: false },
                { label: '50%', val: '50%', full: false },
                { label: 'Custom', val: 'custom', full: false },
              ].map((w) => {
                const isActive = w.val === 'custom' ? isCustomWidth : currentWidth === w.val;
                return (
                  <button
                    key={w.label}
                    type="button"
                    onClick={() => {
                      if (w.val === 'custom') {
                        if (!isCustomWidth) {
                          updateMultipleStyles({ width: '800px', fullWidth: false });
                        }
                      } else {
                        updateMultipleStyles({ width: w.val, fullWidth: w.full });
                      }
                    }}
                    className={`py-1 text-[11px] rounded-md font-semibold transition-all cursor-pointer text-center ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : isLight
                        ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        : 'bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {w.label}
                  </button>
                );
              })}
            </div>

            {isCustomWidth && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Custom Width Value:</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        const numeric = parseFloat(currentWidth) || 800;
                        updateMultipleStyles({ width: `${numeric}%`, fullWidth: false });
                      }}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer ${
                        currentWidth.endsWith('%')
                          ? 'bg-indigo-600 text-white'
                          : isLight ? 'bg-slate-200 text-slate-600' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      %
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const numeric = parseFloat(currentWidth) || 800;
                        updateMultipleStyles({ width: `${numeric}px`, fullWidth: false });
                      }}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer ${
                        currentWidth.endsWith('px') || !currentWidth.endsWith('%')
                          ? 'bg-indigo-600 text-white'
                          : isLight ? 'bg-slate-200 text-slate-600' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      px
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={currentWidth}
                  onChange={(e) => updateMultipleStyles({ width: e.target.value, fullWidth: false })}
                  placeholder="e.g. 800px, 90%, 64rem"
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label className={labelClass}>Container Max-Width Limit</label>
              <select
                value={s.maxWidth || 'full'}
                onChange={(e) => updateStyle('maxWidth', e.target.value)}
                className={selectClass}
              >
                <option value="full">Full Width (100% - No Constraint)</option>
                <option value="7xl">7XL / Extra Wide (1280px)</option>
                <option value="6xl">6XL / Standard Wide (1152px)</option>
                <option value="5xl">5XL / Editorial (1024px)</option>
                <option value="4xl">4XL / Content Width (896px)</option>
                <option value="3xl">3XL / Medium Column (768px)</option>
                <option value="2xl">2XL / Compact (672px)</option>
                <option value="xl">XL / Narrow (576px)</option>
                <option value="lg">LG (512px)</option>
                <option value="md">MD (448px)</option>
                <option value="sm">SM (384px)</option>
                <option value="none">None (Inherit Parent)</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Horizontal Alignment</label>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { id: 'left', label: 'Left', icon: AlignLeft },
                  { id: 'center', label: 'Center', icon: AlignCenter },
                  { id: 'right', label: 'Right', icon: AlignRight },
                ].map((al) => {
                  const Icon = al.icon;
                  const isActive = (s.alignment === al.id || s.marginAuto === al.id) || (!s.alignment && !s.marginAuto && al.id === 'center');
                  return (
                    <button
                      key={al.id}
                      type="button"
                      onClick={() => updateMultipleStyles({ alignment: al.id, marginAuto: al.id })}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : isLight
                          ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          : 'bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{al.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={boxGroupClass}>
            <label className={labelClass}>Layout Columns / Mode</label>
            <select value={s.layoutColumns || '1'} onChange={(e) => updateStyle('layoutColumns', e.target.value)} className={selectClass}>
              <option value="1">1 Column (Stack)</option>
              <option value="2">2 Columns Grid</option>
              <option value="3">3 Columns Grid</option>
              <option value="4">4 Columns Grid</option>
              <option value="flex">Flexbox (No Wrap)</option>
              <option value="flex-wrap">Flexbox (Wrap)</option>
            </select>
            <p className={`mt-2 text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Grid columns automatically collapse to 1 column on mobile devices.
            </p>
          </div>

          {s.layoutColumns === '2' && (
            <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/40 border-slate-800'} space-y-2`}>
              <label className={labelClass}>Column Width Distribution (2 Columns)</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Equal (1:1 / 50-50)', val: '1:1' },
                  { label: 'Left Sidebar (1:2)', val: '1:2' },
                  { label: 'Right Sidebar (2:1)', val: '2:1' },
                  { label: 'Slim Left (1:3)', val: '1:3' },
                  { label: 'Slim Right (3:1)', val: '3:1' },
                ].map((r) => (
                  <button
                    key={r.val}
                    type="button"
                    onClick={() => updateStyle('columnRatio', r.val)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center border transition-all cursor-pointer ${
                      (s.columnRatio || '1:1') === r.val
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : isLight
                        ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {s.layoutColumns === '3' && (
            <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/40 border-slate-800'} space-y-2`}>
              <label className={labelClass}>Column Width Distribution (3 Columns)</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Equal (1:1:1)', val: '1:1:1' },
                  { label: 'Wide Center (1:2:1)', val: '1:2:1' },
                  { label: 'Left Focus (2:1:1)', val: '2:1:1' },
                  { label: 'Right Focus (1:1:2)', val: '1:1:2' },
                ].map((r) => (
                  <button
                    key={r.val}
                    type="button"
                    onClick={() => updateStyle('columnRatio', r.val)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center border transition-all cursor-pointer ${
                      (s.columnRatio || '1:1:1') === r.val
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : isLight
                        ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(s.layoutColumns === 'flex' || s.layoutColumns === 'flex-wrap') && (
            <div className={boxGroupClass}>
              <label className={labelClass}>Flex Item Distribution (Justify)</label>
              <select
                value={s.justifyContent || 'flex-start'}
                onChange={(e) => updateStyle('justifyContent', e.target.value)}
                className={selectClass}
              >
                <option value="flex-start">Start (Left Align)</option>
                <option value="center">Center</option>
                <option value="flex-end">End (Right Align)</option>
                <option value="space-between">Space Between (Edges)</option>
                <option value="space-around">Space Around</option>
                <option value="space-evenly">Space Evenly</option>
              </select>
            </div>
          )}

          <div className={boxGroupClass}>
            <label className={labelClass}>Vertical Alignment</label>
            <div className="grid grid-cols-4 gap-1 mt-1">
              {[
                { id: 'flex-start', label: 'Top', icon: ArrowUpToLine, title: 'Align Top' },
                { id: 'center', label: 'Center', icon: AlignCenter, title: 'Align Center' },
                { id: 'flex-end', label: 'Bottom', icon: ArrowDownToLine, title: 'Align Bottom' },
                { id: 'stretch', label: 'Stretch', icon: StretchVertical, title: 'Stretch (Fill Height)' },
              ].map((al) => {
                const Icon = al.icon;
                const activeVal = s.alignItems || 'stretch';
                const isSel =
                  activeVal === al.id ||
                  (al.id === 'flex-start' && (activeVal === 'top' || activeVal === 'start')) ||
                  (al.id === 'flex-end' && (activeVal === 'bottom' || activeVal === 'end'));
                return (
                  <button
                    key={al.id}
                    type="button"
                    onClick={() => updateStyle('alignItems', al.id)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSel
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : isLight
                        ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        : 'bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                    title={al.title}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{al.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={boxGroupClass}>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Gap Between Items</label>
              <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {s.gap !== undefined ? s.gap : 24}px
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1 mb-2">
              {[0, 12, 16, 24, 32].map((g) => {
                const currentGap = s.gap !== undefined ? s.gap : 24;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => updateStyle('gap', g)}
                    className={`py-1 text-[10px] font-semibold rounded-md transition-all cursor-pointer text-center ${
                      currentGap === g
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : isLight
                        ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        : 'bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {g}px
                  </button>
                );
              })}
            </div>
            <input
              type="number"
              value={s.gap !== undefined ? s.gap : 24}
              onChange={(e) => updateStyle('gap', Number(e.target.value))}
              className={inputClass}
              min={0}
              step={4}
            />
          </div>
        </div>)}

      {activeTab === 'style' && (<div className="space-y-4">
          <div>
            <BackgroundController styles={s} onChange={(bgUpdates) => {
                onUpdateElement({
                    ...selectedContext.element,
                    styles: {
                        ...(selectedContext.element.styles || {}),
                        ...bgUpdates,
                    },
                });
            }} uiTheme={uiTheme}/>
          </div>

          <div className={boxGroupClass}>
            <label className={labelClass}>Inner Padding (px)</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <span className={`text-[10px] uppercase mb-1 block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Top</span>
                <input type="number" value={s.paddingTop || 0} onChange={(e) => updateStyle('paddingTop', Number(e.target.value))} className={inputClass} min={0} step={4}/>
              </div>
              <div>
                <span className={`text-[10px] uppercase mb-1 block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Bottom</span>
                <input type="number" value={s.paddingBottom || 0} onChange={(e) => updateStyle('paddingBottom', Number(e.target.value))} className={inputClass} min={0} step={4}/>
              </div>
              <div>
                <span className={`text-[10px] uppercase mb-1 block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Left</span>
                <input type="number" value={s.paddingLeft || 0} onChange={(e) => updateStyle('paddingLeft', Number(e.target.value))} className={inputClass} min={0} step={4}/>
              </div>
              <div>
                <span className={`text-[10px] uppercase mb-1 block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Right</span>
                <input type="number" value={s.paddingRight || 0} onChange={(e) => updateStyle('paddingRight', Number(e.target.value))} className={inputClass} min={0} step={4}/>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Border Width ({s.borderWidth || 0}px)</label>
              <input type="range" min={0} max={8} value={s.borderWidth || 0} onChange={(e) => updateStyle('borderWidth', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
            </div>
            <div>
              <label className={labelClass}>Corner Radius ({s.borderRadius || 0}px)</label>
              <input type="range" min={0} max={40} value={s.borderRadius || 0} onChange={(e) => updateStyle('borderRadius', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
            </div>
          </div>

          {Number(s.borderWidth || 0) > 0 && (
            <div>
              <label className={labelClass}>Border Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={s.borderColor || (isLight ? '#cbd5e1' : '#334155')} onChange={(e) => updateStyle('borderColor', e.target.value)} className="w-7 h-7 rounded border bg-transparent cursor-pointer shrink-0"/>
                <input type="text" value={s.borderColor || (isLight ? '#cbd5e1' : '#334155')} onChange={(e) => updateStyle('borderColor', e.target.value)} className={`${inputClass} font-mono`}/>
              </div>
            </div>
          )}
        </div>)}

      {activeTab === 'content' && (<div className="space-y-4">
          <div className={boxGroupClass}>
            <label className={labelClass}>Manage Grid Items ({children.length})</label>
            <p className={`mt-1 text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Select items directly on the canvas to edit their contents.
              To reorder, drag them in the canvas layout.
            </p>
            {children.length === 0 && (<div className={`mt-3 p-3 rounded-lg text-center ${isLight ? 'bg-amber-50 text-amber-700' : 'bg-amber-500/10 text-amber-400'}`}>
                This grid is currently empty.
              </div>)}
          </div>
        </div>)}

    </div>);
};
