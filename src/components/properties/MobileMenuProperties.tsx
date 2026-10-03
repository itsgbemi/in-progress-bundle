import React from 'react';
import { WebsiteElement, MobileMenuSettings, MobileMenuCloseSettings, CloseButtonType, CloseIconStyle } from '../../types';
import { ElementInspectorProps, getInspectorStyles } from './PropertiesCommon';
export const MobileMenuProperties: React.FC<ElementInspectorProps> = ({ page, selectedSection, onUpdateSection, selectedContext, onUpdateElement, onSelectContext, onDeleteElement, uiTheme = 'dark', viewportMode = 'desktop', }) => {
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
    const renderMobileMenuProperties = () => {
        const section = page?.sections.find((s) => s.id === selectedContext?.sectionId) ||
            (selectedSection?.type === 'header' ? selectedSection : page?.sections.find((s) => s.type === 'header'));
        if (!section)
            return null;
        const m = section.mobileMenuSettings || {};
        const updateMobileMenu = (updates: Partial<MobileMenuSettings>) => {
            if (onUpdateSection) {
                onUpdateSection({
                    ...section,
                    mobileMenuSettings: {
                        ...m,
                        ...updates,
                    },
                });
            }
        };
        const updateCloseSettings = (updates: Partial<MobileMenuCloseSettings>) => {
            const currentClose = m.closeSettings || {
                closeType: (m.closeType || (m.closeIconStyle === 'text' ? 'text' : 'icon')) as CloseButtonType,
                closeText: m.closeText || 'Close',
                closeIconStyle: (m.closeIconStyle && m.closeIconStyle !== 'text' ? m.closeIconStyle : 'standard') as CloseIconStyle,
                backgroundColor: 'transparent',
                textColor: m.closeIconColor || '#ffffff',
            };
            const updatedClose = { ...currentClose, ...updates };
            updateMobileMenu({
                closeSettings: updatedClose,
                closeType: updatedClose.closeType,
                closeText: updatedClose.closeText,
                closeIconStyle: updatedClose.closeIconStyle,
                closeIconColor: updatedClose.textColor,
            });
        };
        const closeType: CloseButtonType = m.closeSettings?.closeType || m.closeType || (m.closeIconStyle === 'text' ? 'text' : 'icon');
        const closeText = m.closeSettings?.closeText || m.closeText || 'Close';
        const closeIconStyle = m.closeSettings?.closeIconStyle ||
            (m.closeIconStyle && m.closeIconStyle !== 'text' ? m.closeIconStyle : 'standard');
        const cs = m.closeSettings || {};
        const closeIconOptions: {
            id: CloseIconStyle;
            label: string;
        }[] = [
            { id: 'standard', label: 'Standard X' },
            { id: 'arrow', label: 'Arrow Left' },
            { id: 'chevron', label: 'Chevron' },
            { id: 'sidebar', label: 'Sidebar' },
        ];
        const renderCloseMiniIcon = (iconId: CloseIconStyle, thickness = 2) => {
            const col = 'currentColor';
            switch (iconId) {
                case 'sidebar':
                    return (<svg className="w-4 h-4 mx-auto" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth={thickness} strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2"/>
              <path d="M9 3v18"/>
            </svg>);
                case 'arrow':
                    return (<svg className="w-4 h-4 mx-auto" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth={thickness} strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>);
                case 'chevron':
                    return (<svg className="w-4 h-4 mx-auto" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth={thickness} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>);
                case 'standard':
                default:
                    return (<svg className="w-4 h-4 mx-auto" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth={thickness} strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18"/>
              <line x1="18" y1="6" x2="6" y2="18"/>
            </svg>);
            }
        };
        return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
        <div>
          <label className={labelClass}>Drawer Open Direction</label>
          <select value={m.openDirection || 'right'} onChange={(e) => updateMobileMenu({ openDirection: e.target.value as any })} className={selectClass}>
            <option value="right">Slide from Right (Drawer)</option>
            <option value="left">Slide from Left (Drawer)</option>
            <option value="top">Dropdown from Top</option>
            <option value="fullscreen">Fullscreen Modal Overlay</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Drawer Background</label>
            <div className="flex items-center gap-1.5">
              <input type="color" value={m.backgroundColor && m.backgroundColor.startsWith('#') ? m.backgroundColor : '#0f172a'} onChange={(e) => updateMobileMenu({ backgroundColor: e.target.value })} className="w-7 h-7 rounded border bg-transparent cursor-pointer"/>
              <input type="text" value={m.backgroundColor || '#0f172a'} onChange={(e) => updateMobileMenu({ backgroundColor: e.target.value })} className={`${inputClass} font-mono text-[11px]`}/>
            </div>
          </div>
          <div>
            <label className={labelClass}>Backdrop Dimmer</label>
            <select value={m.backdropDim || 'medium'} onChange={(e) => updateMobileMenu({ backdropDim: e.target.value as any })} className={selectClass}>
              <option value="none">None (Clear)</option>
              <option value="light">Light Dim</option>
              <option value="medium">Medium Dark</option>
              <option value="heavy">Heavy Dark</option>
              <option value="custom">Custom Dimmer</option>
            </select>
          </div>
        </div>

        {m.backdropDim === 'custom' && (<div className={`p-3 rounded-xl border space-y-2.5 ${isLight ? 'bg-indigo-50/50 border-indigo-200' : 'bg-slate-900/80 border-slate-800'}`}>
            <span className="font-bold text-[11px] text-indigo-400 uppercase tracking-wide">
              Custom Backdrop Settings
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass}>Backdrop Color</label>
                <div className="flex items-center gap-1.5">
                  <input type="color" value={m.backdropCustomColor && m.backdropCustomColor.startsWith('#') ? m.backdropCustomColor : '#000000'} onChange={(e) => updateMobileMenu({ backdropCustomColor: e.target.value })} className="w-7 h-7 rounded border bg-transparent cursor-pointer"/>
                  <input type="text" value={m.backdropCustomColor || '#000000'} onChange={(e) => updateMobileMenu({ backdropCustomColor: e.target.value })} className={`${inputClass} font-mono text-[11px]`}/>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Opacity</label>
                  <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                    {m.backdropCustomOpacity !== undefined ? m.backdropCustomOpacity : 50}%
                  </span>
                </div>
                <input type="range" min={0} max={100} step={5} value={m.backdropCustomOpacity !== undefined ? m.backdropCustomOpacity : 50} onChange={(e) => updateMobileMenu({ backdropCustomOpacity: Number(e.target.value) })} className="w-full accent-indigo-500 cursor-pointer"/>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>Backdrop Blur</label>
                <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                  {m.backdropCustomBlur !== undefined ? m.backdropCustomBlur : 6}px
                </span>
              </div>
              <input type="range" min={0} max={24} step={1} value={m.backdropCustomBlur !== undefined ? m.backdropCustomBlur : 6} onChange={(e) => updateMobileMenu({ backdropCustomBlur: Number(e.target.value) })} className="w-full accent-indigo-500 cursor-pointer"/>
            </div>
          </div>)}

        {m.openDirection !== 'fullscreen' && m.openDirection !== 'top' && (<div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Drawer Width</label>
              <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                {typeof m.drawerWidth === 'number' && m.drawerWidth <= 100
                    ? m.drawerWidth
                    : (m.drawerWidthVw || 80)}vw
              </span>
            </div>
            <input type="range" min={40} max={100} step={5} value={typeof m.drawerWidth === 'number' && m.drawerWidth <= 100
                    ? m.drawerWidth
                    : (m.drawerWidthVw || 80)} onChange={(e) => {
                    const val = Number(e.target.value);
                    updateMobileMenu({ drawerWidth: val, drawerWidthVw: val });
                }} className="w-full accent-indigo-500 cursor-pointer"/>
          </div>)}

        <div className={`p-3 rounded-xl border space-y-3 ${isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase tracking-wide">Close Button Controls</span>
            <span className="text-[10px] font-mono text-indigo-400 font-semibold capitalize">{closeType}</span>
          </div>

          <div>
            <label className={labelClass}>Close Button Type (Preceding Choice)</label>
            <div className={`grid grid-cols-3 gap-1 p-1 ${boxGroupClass}`}>
              {[
                { id: 'icon', label: 'Icon Only' },
                { id: 'text', label: 'Text Only' },
                { id: 'icon-text', label: 'Icon + Text' },
            ].map((opt) => (<button key={opt.id} type="button" onClick={() => updateCloseSettings({ closeType: opt.id as CloseButtonType })} className={`py-1.5 text-[11px] rounded font-semibold transition-all cursor-pointer ${closeType === opt.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isLight
                        ? 'text-slate-600 hover:bg-slate-200'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                  {opt.label}
                </button>))}
            </div>
          </div>

          {(closeType === 'text' || closeType === 'icon-text') && (<div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-700/20">
              <div>
                <label className={labelClass}>Close Button Text</label>
                <input type="text" value={closeText} onChange={(e) => updateCloseSettings({ closeText: e.target.value })} className={inputClass} placeholder="e.g. Close, Back"/>
              </div>
              <div>
                <label className={labelClass}>Text Font Weight</label>
                <select value={cs.fontWeight || '600'} onChange={(e) => updateCloseSettings({ fontWeight: e.target.value as any })} className={selectClass}>
                  <option value="400">Regular (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">SemiBold (600)</option>
                  <option value="700">Bold (700)</option>
                </select>
              </div>
            </div>)}

          {(closeType === 'icon' || closeType === 'icon-text') && (<div className="space-y-3 pt-1 border-t border-slate-700/20">
              <div>
                <label className={labelClass}>Close Icon Style</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {closeIconOptions.map((item) => {
                    const isSel = closeIconStyle === item.id;
                    const thicknessVal = cs.iconThickness !== undefined ? cs.iconThickness : 2;
                    return (<button key={item.id} type="button" onClick={() => updateCloseSettings({ closeIconStyle: item.id })} className={`h-10 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${isSel
                            ? isLight
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500'
                                : 'bg-indigo-500/20 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500'
                            : isLight
                                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'}`} title={item.label} aria-label={item.label}>
                        <div className="h-5 w-5 flex items-center justify-center">
                          {renderCloseMiniIcon(item.id, thicknessVal)}
                        </div>
                      </button>);
                })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Icon Thickness</label>
                  <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                    {cs.iconThickness !== undefined ? cs.iconThickness : 2}px
                  </span>
                </div>
                <input type="range" min={1} max={4} step={0.5} value={cs.iconThickness !== undefined ? cs.iconThickness : 2} onChange={(e) => updateCloseSettings({ iconThickness: Number(e.target.value) })} className="w-full accent-indigo-500 cursor-pointer"/>
              </div>
            </div>)}

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-700/20">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>Background</label>
                <button type="button" onClick={() => updateCloseSettings({
                backgroundColor: cs.backgroundColor === 'transparent' ? '#334155' : 'transparent',
            })} className={`px-1.5 py-0.2 rounded text-[9px] font-semibold transition-all cursor-pointer ${(cs.backgroundColor || 'transparent') === 'transparent'
                ? 'bg-indigo-600 text-white'
                : isLight
                    ? 'bg-slate-200 text-slate-700'
                    : 'bg-slate-800 text-slate-300'}`}>
                  {(cs.backgroundColor || 'transparent') === 'transparent' ? '✓ Transp.' : 'Transp.'}
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <input type="color" value={cs.backgroundColor && cs.backgroundColor !== 'transparent'
                ? cs.backgroundColor.startsWith('#')
                    ? cs.backgroundColor
                    : '#334155'
                : '#334155'} onChange={(e) => updateCloseSettings({ backgroundColor: e.target.value })} className="w-6 h-6 rounded border bg-transparent cursor-pointer"/>
                <input type="text" value={cs.backgroundColor || 'transparent'} onChange={(e) => updateCloseSettings({ backgroundColor: e.target.value })} className={`${inputClass} font-mono text-[10px] py-1`}/>
              </div>
            </div>

            <div>
              <label className={labelClass}>Text / Icon Color</label>
              <div className="flex items-center gap-1.5">
                <input type="color" value={cs.textColor && cs.textColor.startsWith('#') ? cs.textColor : '#ffffff'} onChange={(e) => updateCloseSettings({ textColor: e.target.value })} className="w-6 h-6 rounded border bg-transparent cursor-pointer"/>
                <input type="text" value={cs.textColor || '#ffffff'} onChange={(e) => updateCloseSettings({ textColor: e.target.value })} className={`${inputClass} font-mono text-[10px] py-1`}/>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className={labelClass}>Border: {cs.borderWidth ?? 0}px</label>
              <input type="range" min={0} max={4} value={cs.borderWidth ?? 0} onChange={(e) => updateCloseSettings({ borderWidth: Number(e.target.value) })} className="w-full accent-indigo-500 cursor-pointer"/>
            </div>
            <div>
              <label className={labelClass}>Radius: {cs.borderRadius ?? 8}px</label>
              <input type="range" min={0} max={36} value={cs.borderRadius ?? 8} onChange={(e) => updateCloseSettings({ borderRadius: Number(e.target.value) })} className="w-full accent-indigo-500 cursor-pointer"/>
            </div>
            <div>
              <label className={labelClass}>Padding: {cs.paddingX ?? 8}px</label>
              <input type="range" min={2} max={16} value={cs.paddingX ?? 8} onChange={(e) => {
                const val = Number(e.target.value);
                updateCloseSettings({ paddingX: val, paddingY: Math.max(2, val - 2) });
            }} className="w-full accent-indigo-500 cursor-pointer"/>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-700/40">
          <label className={labelClass}>Drawer Navigation Links</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Link Alignment</label>
              <div className={`flex gap-1 p-1 ${boxGroupClass}`}>
                {(['left', 'center', 'right'] as ('left' | 'center' | 'right')[]).map((align) => (<button key={align} type="button" onClick={() => updateMobileMenu({ textAlign: align })} className={`flex-1 py-1 text-[10px] rounded font-semibold capitalize transition-all cursor-pointer ${(m.textAlign || 'left') === align
                    ? 'bg-indigo-600 text-white'
                    : isLight
                        ? 'text-slate-600 hover:bg-slate-200'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                    {align}
                  </button>))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>Link Font Size</label>
                <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                  {(() => {
                if (m.linkFontSize !== undefined) {
                    return m.linkFontSize <= 5 ? Math.round(m.linkFontSize * 16) : m.linkFontSize;
                }
                if (m.linkFontSizeRem !== undefined) {
                    return Math.round(m.linkFontSizeRem * 16);
                }
                return 18;
            })()}px
                </span>
              </div>
              <input type="range" min={12} max={48} step={1} value={(() => {
                if (m.linkFontSize !== undefined) {
                    return m.linkFontSize <= 5 ? Math.round(m.linkFontSize * 16) : m.linkFontSize;
                }
                if (m.linkFontSizeRem !== undefined) {
                    return Math.round(m.linkFontSizeRem * 16);
                }
                return 18;
            })()} onChange={(e) => {
                const val = Number(e.target.value);
                updateMobileMenu({ linkFontSize: val, linkFontSizeRem: Number((val / 16).toFixed(3)) });
            }} className="w-full accent-indigo-500 cursor-pointer"/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Link Text Color</label>
              <div className="flex items-center gap-1.5">
                <input type="color" value={m.linkTextColor && m.linkTextColor.startsWith('#') ? m.linkTextColor : '#e2e8f0'} onChange={(e) => updateMobileMenu({ linkTextColor: e.target.value })} className="w-7 h-7 rounded border bg-transparent cursor-pointer"/>
                <input type="text" value={m.linkTextColor || '#e2e8f0'} onChange={(e) => updateMobileMenu({ linkTextColor: e.target.value })} className={`${inputClass} font-mono text-[11px]`}/>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>Link Vertical Gap</label>
                <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                  {m.linkSpacing || 16}px
                </span>
              </div>
              <input type="range" min={8} max={32} step={2} value={m.linkSpacing || 16} onChange={(e) => updateMobileMenu({ linkSpacing: Number(e.target.value) })} className="w-full accent-indigo-500 cursor-pointer"/>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg border border-slate-700/60 bg-slate-900/40">
          <div>
            <span className="font-semibold text-slate-200">Show CTA Buttons in Menu</span>
            <p className="text-[10px] text-slate-400">Include header call-to-action buttons in mobile drawer</p>
          </div>
          <button type="button" onClick={() => updateMobileMenu({ showCta: m.showCta !== false ? false : true })} className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${m.showCta !== false ? 'bg-indigo-600' : 'bg-slate-700'}`}>
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${m.showCta !== false ? 'left-5' : 'left-0.5'}`}/>
          </button>
        </div>
      </div>);
    };
    return renderMobileMenuProperties();
};
