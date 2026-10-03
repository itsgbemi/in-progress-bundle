import React from 'react';
import { Settings } from 'lucide-react';
import { WebsiteElement, HamburgerSettings, HamburgerIconStyle } from '../../types';
import { ElementInspectorProps, getInspectorStyles } from './PropertiesCommon';
export const HamburgerProperties: React.FC<ElementInspectorProps> = ({ page, selectedSection, onUpdateSection, selectedContext, onUpdateElement, onSelectContext, onDeleteElement, uiTheme = 'dark', viewportMode = 'desktop', }) => {
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
    const renderHamburgerProperties = () => {
        const section = page?.sections.find((s) => s.id === selectedContext?.sectionId) ||
            (selectedSection?.type === 'header' ? selectedSection : page?.sections.find((s) => s.type === 'header'));
        if (!section)
            return null;
        const h = section.hamburgerSettings || {};
        const displayMode = h.displayMode || (h.showLabel ? 'icon-text' : 'icon');
        const showIconOptions = displayMode === 'icon' || displayMode === 'icon-text';
        const showTextOptions = displayMode === 'text' || displayMode === 'icon-text';
        const updateHamburger = (updates: Partial<HamburgerSettings>) => {
            if (onUpdateSection) {
                onUpdateSection({
                    ...section,
                    hamburgerSettings: {
                        ...h,
                        ...updates,
                    },
                });
            }
        };
        const hamburgerLineStyles: {
            id: HamburgerIconStyle;
            label: string;
            subLabel: string;
        }[] = [
            { id: 'three-equal', label: 'Three Equal lines', subLabel: '3 Equal' },
            { id: 'three-asc-left', label: 'Three Unequal lines, ascending (Left)', subLabel: '3 Asc (Left)' },
            { id: 'three-asc-center', label: 'Three Unequal lines, ascending (Center)', subLabel: '3 Asc (Center)' },
            { id: 'three-asc-right', label: 'Three Unequal lines, ascending (Right)', subLabel: '3 Asc (Right)' },
            { id: 'three-desc-left', label: 'Three Unequal lines, descending (Left)', subLabel: '3 Desc (Left)' },
            { id: 'three-desc-center', label: 'Three Unequal lines, descending (Center)', subLabel: '3 Desc (Center)' },
            { id: 'three-desc-right', label: 'Three Unequal lines, descending (Right)', subLabel: '3 Desc (Right)' },
            { id: 'two-equal', label: 'Two equal lines', subLabel: '2 Equal' },
            { id: 'two-asc-left', label: 'Two Unequal lines, ascending (Left)', subLabel: '2 Asc (Left)' },
            { id: 'two-asc-center', label: 'Two Unequal lines, ascending (Center)', subLabel: '2 Asc (Center)' },
            { id: 'two-asc-right', label: 'Two Unequal lines, ascending (Right)', subLabel: '2 Asc (Right)' },
            { id: 'two-desc-left', label: 'Two Unequal lines, descending (Left)', subLabel: '2 Desc (Left)' },
            { id: 'two-desc-center', label: 'Two Unequal lines, descending (Center)', subLabel: '2 Desc (Center)' },
            { id: 'two-desc-right', label: 'Two Unequal lines, descending (Right)', subLabel: '2 Desc (Right)' },
        ];
        const geometricTriggerStyles: {
            id: HamburgerIconStyle;
            label: string;
            subLabel: string;
        }[] = [
            { id: 'dots', label: '3-Dot Stack', subLabel: '3-Dot Stack' },
            { id: 'grid', label: 'Three Dot Matrix', subLabel: '3-Dot Matrix' },
            { id: 'sidebar', label: 'Sidebar Panel', subLabel: 'Sidebar' },
            { id: 'plus', label: 'Plus Cross', subLabel: 'Plus Cross' },
            { id: 'arrow', label: 'Arrow Pointer', subLabel: 'Arrow Pointer' },
            { id: 'diamond', label: 'Diamond', subLabel: 'Diamond' },
        ];
        const currentStyle = h.iconStyle || 'three-equal';
        const renderVisualMiniIcon = (styleId: HamburgerIconStyle) => {
            const col = 'currentColor';
            switch (styleId) {
                case 'three-asc-left':
                    return (<svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.2" strokeLinecap="round">
              <line x1="4" y1="6" x2="11" y2="6"/>
              <line x1="4" y1="12" x2="16" y2="12"/>
              <line x1="4" y1="18" x2="20" y2="18"/>
            </svg>);
                case 'three-asc-center':
                    return (<svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.2" strokeLinecap="round">
              <line x1="8.5" y1="6" x2="15.5" y2="6"/>
              <line x1="6" y1="12" x2="18" y2="12"/>
              <line x1="4" y1="18" x2="20" y2="18"/>
            </svg>);
                case 'three-asc-right':
                    return (<svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.2" strokeLinecap="round">
              <line x1="13" y1="6" x2="20" y2="6"/>
              <line x1="8" y1="12" x2="20" y2="12"/>
              <line x1="4" y1="18" x2="20" y2="18"/>
            </svg>);
                case 'three-desc-left':
                    return (<svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.2" strokeLinecap="round">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="4" y1="12" x2="16" y2="12"/>
              <line x1="4" y1="18" x2="11" y2="18"/>
            </svg>);
                case 'three-desc-center':
                    return (<svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.2" strokeLinecap="round">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="6" y1="12" x2="18" y2="12"/>
              <line x1="8.5" y1="18" x2="15.5" y2="18"/>
            </svg>);
                case 'three-desc-right':
                    return (<svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.2" strokeLinecap="round">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="8" y1="12" x2="20" y2="12"/>
              <line x1="13" y1="18" x2="20" y2="18"/>
            </svg>);
                case 'two-equal':
                    return (<svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.2" strokeLinecap="round">
              <line x1="4" y1="8" x2="20" y2="8"/>
              <line x1="4" y1="16" x2="20" y2="16"/>
            </svg>);
                case 'two-asc-left':
                    return (<svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.2" strokeLinecap="round">
              <line x1="4" y1="8" x2="12" y2="8"/>
              <line x1="4" y1="16" x2="20" y2="16"/>
            </svg>);
                case 'two-asc-center':
                    return (<svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.2" strokeLinecap="round">
              <line x1="7" y1="8" x2="17" y2="8"/>
              <line x1="4" y1="16" x2="20" y2="16"/>
            </svg>);
                case 'two-asc-right':
                    return (<svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.2" strokeLinecap="round">
              <line x1="12" y1="8" x2="20" y2="8"/>
              <line x1="4" y1="16" x2="20" y2="16"/>
            </svg>);
                case 'two-desc-left':
                    return (<svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.2" strokeLinecap="round">
              <line x1="4" y1="8" x2="20" y2="8"/>
              <line x1="4" y1="16" x2="12" y2="16"/>
            </svg>);
                case 'two-desc-center':
                    return (<svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.2" strokeLinecap="round">
              <line x1="4" y1="8" x2="20" y2="8"/>
              <line x1="7" y1="16" x2="17" y2="16"/>
            </svg>);
                case 'two-desc-right':
                    return (<svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.2" strokeLinecap="round">
              <line x1="4" y1="8" x2="20" y2="8"/>
              <line x1="12" y1="16" x2="20" y2="16"/>
            </svg>);
                case 'dots':
                    return (<svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="2.2"/>
              <circle cx="12" cy="12" r="2.2"/>
              <circle cx="12" cy="19" r="2.2"/>
            </svg>);
                case 'grid':
                    return (<svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="6" cy="6" r="1.8"/>
              <circle cx="12" cy="6" r="1.8"/>
              <circle cx="18" cy="6" r="1.8"/>
              <circle cx="6" cy="12" r="1.8"/>
              <circle cx="12" cy="12" r="1.8"/>
              <circle cx="18" cy="12" r="1.8"/>
              <circle cx="6" cy="18" r="1.8"/>
              <circle cx="12" cy="18" r="1.8"/>
              <circle cx="18" cy="18" r="1.8"/>
            </svg>);
                case 'sidebar':
                    return (<svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2"/>
              <path d="M9 3v18"/>
            </svg>);
                case 'plus':
                    return (<svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>);
                case 'arrow':
                    return (<svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="12" x2="20" y2="12"/>
              <polyline points="13 5 20 12 13 19"/>
            </svg>);
                case 'diamond':
                    return (<svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round">
              <polygon points="12,3 21,12 12,21 3,12"/>
            </svg>);
                case 'three-equal':
                case 'thick':
                case 'standard':
                default:
                    return (<svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.2" strokeLinecap="round">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="4" y1="12" x2="20" y2="12"/>
              <line x1="4" y1="18" x2="20" y2="18"/>
            </svg>);
            }
        };
        const activeThickness = h.lineThickness !== undefined
            ? h.lineThickness
            : h.iconThickness === 'thick'
                ? 3.5
                : h.iconThickness === 'thin'
                    ? 1.5
                    : 2;
        const activeGap = h.lineGap !== undefined ? h.lineGap : 5;
        return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
        <div>
          <label className={labelClass}>Hamburger Display Mode</label>
          <div className={`grid grid-cols-3 gap-1 p-1 ${boxGroupClass}`}>
            {[
                { id: 'icon', label: 'Icon only' },
                { id: 'icon-text', label: 'Icon + Text' },
                { id: 'text', label: 'Text only' },
            ].map((opt) => (<button key={opt.id} type="button" onClick={() => {
                    updateHamburger({
                        displayMode: opt.id as any,
                        showLabel: opt.id !== 'icon',
                    });
                }} className={`py-1.5 text-[11px] rounded-lg font-bold transition-all cursor-pointer ${displayMode === opt.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isLight
                        ? 'text-slate-600 hover:bg-slate-200'
                        : 'text-slate-400 hover:text-white'}`}>
                {opt.label}
              </button>))}
          </div>
        </div>

        {showTextOptions && (<div className="space-y-3 p-3 rounded-xl border bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                Menu Text Settings
              </label>
            </div>

            <div>
              <label className={labelClass}>Label Text</label>
              <input type="text" value={h.textLabel || h.labelText || 'Menu'} onChange={(e) => updateHamburger({ textLabel: e.target.value, labelText: e.target.value })} className={inputClass} placeholder="e.g. Menu, Navigation"/>
            </div>

            {displayMode === 'icon-text' && (<div>
                <label className={labelClass}>Text Position</label>
                <div className={`grid grid-cols-2 gap-1 p-1 ${boxGroupClass}`}>
                  <button type="button" onClick={() => updateHamburger({ labelPosition: 'left' })} className={`py-1 text-[11px] rounded font-medium transition-all cursor-pointer ${h.labelPosition === 'left'
                        ? 'bg-indigo-600 text-white font-semibold'
                        : isLight
                            ? 'text-slate-600 hover:bg-slate-200'
                            : 'text-slate-400 hover:text-white'}`}>
                    Left of Icon
                  </button>
                  <button type="button" onClick={() => updateHamburger({ labelPosition: 'right' })} className={`py-1 text-[11px] rounded font-medium transition-all cursor-pointer ${h.labelPosition !== 'left'
                        ? 'bg-indigo-600 text-white font-semibold'
                        : isLight
                            ? 'text-slate-600 hover:bg-slate-200'
                            : 'text-slate-400 hover:text-white'}`}>
                    Right of Icon
                  </button>
                </div>
              </div>)}

            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-xs">Text Color</span>
              <div className="flex items-center gap-1.5">
                <input type="color" value={h.textColor && h.textColor.startsWith('#') ? h.textColor : '#ffffff'} onChange={(e) => updateHamburger({ textColor: e.target.value })} className="w-7 h-7 rounded border bg-transparent cursor-pointer"/>
                <input type="text" value={h.textColor || '#ffffff'} onChange={(e) => updateHamburger({ textColor: e.target.value })} className={`${inputClass} font-mono text-[11px] w-24`}/>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Font Size</label>
                  <span className="text-[10px] font-mono text-slate-400">{h.textFontSize || 13}px</span>
                </div>
                <input type="range" min={10} max={24} value={h.textFontSize || 13} onChange={(e) => updateHamburger({ textFontSize: Number(e.target.value) })} className="w-full accent-indigo-500 cursor-pointer"/>
              </div>
              <div>
                <label className={labelClass}>Font Weight</label>
                <select value={h.textFontWeight || '600'} onChange={(e) => updateHamburger({ textFontWeight: e.target.value })} className={selectClass}>
                  <option value="400">Normal (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semibold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="800">Extra Bold (800)</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Typeface / Font</label>
              <select value={h.textTypeface || 'inherit'} onChange={(e) => updateHamburger({ textTypeface: e.target.value === 'inherit' ? undefined : e.target.value })} className={selectClass}>
                <option value="inherit">Default Sans</option>
                <option value="Inter">Inter</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                <option value="Poppins">Poppins</option>
                <option value="Outfit">Outfit</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="Fira Code">Fira Code</option>
              </select>
            </div>
          </div>)}

        {showIconOptions && (<>
            <div className="flex justify-end">
              <button type="button" onClick={() => {
                    if (onSelectContext) {
                        onSelectContext({
                            element: {
                                id: `drawer-${section.id}`,
                                type: 'mobile-menu-drawer',
                                label: 'Mobile Menu Drawer',
                                content: '',
                                styles: {},
                            },
                            sectionId: section.id,
                        });
                    }
                }} className="bg-transparent hover:bg-slate-500/10 text-indigo-400 hover:text-indigo-300 text-xs font-semibold py-1 px-2.5 rounded-lg border border-indigo-500/30 transition-colors flex items-center gap-1.5 cursor-pointer">
                <Settings className="w-3.5 h-3.5"/>
                <span>Open Mobile Menu Settings</span>
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Hamburger Line Styles ({hamburgerLineStyles.length})</label>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {hamburgerLineStyles.map((item) => {
                    const isSelected = currentStyle === item.id ||
                        (item.id === 'three-equal' && (currentStyle === 'standard' || currentStyle === 'thick')) ||
                        (item.id === 'two-equal' && currentStyle === 'minimal') ||
                        (item.id === 'three-desc-left' && currentStyle === 'staggered') ||
                        (item.id === 'three-desc-center' && currentStyle === 'staggered-center');
                    return (<button key={item.id} type="button" onClick={() => updateHamburger({ iconStyle: item.id })} className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${isSelected
                            ? isLight
                                ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/30 text-indigo-700 shadow-sm'
                                : 'bg-indigo-500/20 border-indigo-500 ring-2 ring-indigo-500/40 text-indigo-300 shadow-sm'
                            : isLight
                                ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'}`} title={item.label}>
                      <div className="h-6 flex items-center justify-center">
                        {renderVisualMiniIcon(item.id)}
                      </div>
                    </button>);
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Alternative Trigger Icons ({geometricTriggerStyles.length})</label>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {geometricTriggerStyles.map((item) => {
                    const isSelected = currentStyle === item.id;
                    return (<button key={item.id} type="button" onClick={() => updateHamburger({ iconStyle: item.id })} className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${isSelected
                            ? isLight
                                ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/30 text-indigo-700 shadow-sm'
                                : 'bg-indigo-500/20 border-indigo-500 ring-2 ring-indigo-500/40 text-indigo-300 shadow-sm'
                            : isLight
                                ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'}`} title={item.label}>
                      <div className="h-6 flex items-center justify-center">
                        {renderVisualMiniIcon(item.id)}
                      </div>
                      <span className="text-[10px] font-medium tracking-tight text-center truncate w-full">
                        {item.subLabel}
                      </span>
                    </button>);
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Icon Size</label>
                  <span className="text-[10px] font-mono text-slate-400">{h.iconSize || 20}px</span>
                </div>
                <input type="range" min={14} max={36} value={h.iconSize || 20} onChange={(e) => updateHamburger({ iconSize: Number(e.target.value) })} className="w-full accent-indigo-500 cursor-pointer"/>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Line Thickness</label>
                  <span className="text-[10px] font-mono text-slate-400">{activeThickness}px</span>
                </div>
                <input type="range" min={1} max={5} step={0.5} value={activeThickness} onChange={(e) => updateHamburger({ lineThickness: Number(e.target.value) })} className="w-full accent-indigo-500 cursor-pointer"/>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Line Gap</label>
                  <span className="text-[10px] font-mono text-slate-400">{activeGap}px</span>
                </div>
                <input type="range" min={2} max={10} value={activeGap} onChange={(e) => updateHamburger({ lineGap: Number(e.target.value) })} className="w-full accent-indigo-500 cursor-pointer"/>
              </div>
              <div>
                <label className={labelClass}>Line End Shape</label>
                <div className={`grid grid-cols-2 gap-1 p-1 ${boxGroupClass}`}>
                  <button type="button" onClick={() => updateHamburger({ lineCap: 'round' })} className={`py-1 text-[10px] rounded font-medium transition-all cursor-pointer ${(h.lineCap || 'round') === 'round'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : isLight
                        ? 'text-slate-600 hover:bg-slate-200'
                        : 'text-slate-400 hover:text-white'}`}>
                    Rounded
                  </button>
                  <button type="button" onClick={() => updateHamburger({ lineCap: 'square' })} className={`py-1 text-[10px] rounded font-medium transition-all cursor-pointer ${h.lineCap === 'square'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : isLight
                        ? 'text-slate-600 hover:bg-slate-200'
                        : 'text-slate-400 hover:text-white'}`}>
                    Square
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Icon Color</label>
              <div className="flex items-center gap-1.5">
                <input type="color" value={h.iconColor && h.iconColor.startsWith('#')
                    ? h.iconColor
                    : isLight
                        ? '#0f172a'
                        : '#ffffff'} onChange={(e) => updateHamburger({ iconColor: e.target.value })} className="w-7 h-7 rounded border bg-transparent cursor-pointer"/>
                <input type="text" value={h.iconColor || (isLight ? '#0f172a' : '#ffffff')} onChange={(e) => updateHamburger({ iconColor: e.target.value })} className={`${inputClass} font-mono text-[11px]`}/>
              </div>
            </div>
          </>)}

        <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <label className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
            Button Container Styling
          </label>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Button Background Color</label>
              <button type="button" onClick={() => updateHamburger({ backgroundColor: 'transparent' })} className="text-[10px] text-indigo-400 hover:underline cursor-pointer">
                Clear (Transparent)
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <input type="color" value={h.backgroundColor && h.backgroundColor.startsWith('#')
                ? h.backgroundColor
                : '#1e293b'} onChange={(e) => updateHamburger({ backgroundColor: e.target.value })} className="w-7 h-7 rounded border bg-transparent cursor-pointer"/>
              <input type="text" value={h.backgroundColor || 'transparent'} onChange={(e) => updateHamburger({ backgroundColor: e.target.value })} className={`${inputClass} font-mono text-[11px]`}/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>Padding X</label>
                <span className="text-[10px] font-mono text-slate-400">{h.paddingX ?? 8}px</span>
              </div>
              <input type="range" min={2} max={24} value={h.paddingX ?? 8} onChange={(e) => updateHamburger({ paddingX: Number(e.target.value) })} className="w-full accent-indigo-500 cursor-pointer"/>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>Padding Y</label>
                <span className="text-[10px] font-mono text-slate-400">{h.paddingY ?? 8}px</span>
              </div>
              <input type="range" min={2} max={24} value={h.paddingY ?? 8} onChange={(e) => updateHamburger({ paddingY: Number(e.target.value) })} className="w-full accent-indigo-500 cursor-pointer"/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>Border Width</label>
                <span className="text-[10px] font-mono text-slate-400">{h.borderWidth ?? 1}px</span>
              </div>
              <input type="range" min={0} max={6} value={h.borderWidth ?? 1} onChange={(e) => updateHamburger({ borderWidth: Number(e.target.value) })} className="w-full accent-indigo-500 cursor-pointer"/>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>Border Radius</label>
                <span className="text-[10px] font-mono text-slate-400">{h.borderRadius ?? 10}px</span>
              </div>
              <input type="range" min={0} max={30} value={h.borderRadius ?? 10} onChange={(e) => updateHamburger({ borderRadius: Number(e.target.value) })} className="w-full accent-indigo-500 cursor-pointer"/>
            </div>
          </div>

          {(h.borderWidth ?? 1) > 0 && h.borderStyle !== 'none' && (<div>
              <label className={labelClass}>Border Color</label>
              <div className="flex items-center gap-1.5">
                <input type="color" value={h.borderColor && h.borderColor.startsWith('#')
                    ? h.borderColor
                    : isLight
                        ? '#cbd5e1'
                        : '#334155'} onChange={(e) => updateHamburger({ borderColor: e.target.value })} className="w-7 h-7 rounded border bg-transparent cursor-pointer"/>
                <input type="text" value={h.borderColor || (isLight ? '#cbd5e1' : 'rgba(51, 65, 85, 1)')} onChange={(e) => updateHamburger({ borderColor: e.target.value })} className={`${inputClass} font-mono text-[11px]`}/>
              </div>
            </div>)}

          <div>
            <label className={labelClass}>Elevation & Shadow</label>
            <div className={`grid grid-cols-5 gap-1 ${boxGroupClass}`}>
              {[
                { label: 'None', val: undefined },
                { label: 'SM', val: 'sm' },
                { label: 'MD', val: 'md' },
                { label: 'LG', val: 'lg' },
                { label: 'XL', val: 'xl' },
            ].map((sh) => (<button key={sh.label} type="button" onClick={() => updateHamburger({ shadow: sh.val as any })} className={`py-1 text-[11px] rounded font-medium transition-all cursor-pointer ${h.shadow === sh.val
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
            <select value={h.hoverEffect || 'scale'} onChange={(e) => updateHamburger({ hoverEffect: e.target.value as any })} className={selectClass}>
              <option value="none">None (Static)</option>
              <option value="scale">Subtle Scale Up</option>
              <option value="lift">Lift Up on Hover</option>
              <option value="glow">Glow Ring Accent</option>
              <option value="invert">Invert Background & Color</option>
            </select>
          </div>
        </div>
      </div>);
    };
    return renderHamburgerProperties();
};
