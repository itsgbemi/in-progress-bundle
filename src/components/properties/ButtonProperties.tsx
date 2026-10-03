import React, { useState } from 'react';
import { X, AlignLeft, AlignCenter, AlignRight, ExternalLink, Layers, Globe, Search, ChevronLeft, ChevronRight, ArrowDownToLine, Mail, Phone, Moon, Sun, Sparkles } from 'lucide-react';
import { WebsiteElement } from '../../types';
import { ALL_ICON_ITEMS, renderIconVisual } from '../IconRenderer';
import { ElementInspectorProps, getInspectorStyles, TypographyControls } from './PropertiesCommon';
import { BrandLinkPicker } from '../common';
export const ButtonProperties: React.FC<ElementInspectorProps> = ({ selectedContext, onUpdateElement, onSelectContext, onDeleteElement, uiTheme = 'dark', viewportMode = 'desktop', }) => {
    const [activeTab, setActiveTab] = useState<'content' | 'style' | 'layout' | 'responsive'>('style');
    const [buttonSubTab, setButtonSubTab] = useState<'main' | 'icon'>('main');
    const [iconSearchQuery, setIconSearchQuery] = useState('');
    const [iconCategoryFilter, setIconCategoryFilter] = useState('All');
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
    const displayMode = element.buttonDisplayMode || 'icon-text';
    const showIcon = displayMode === 'icon' || displayMode === 'icon-text';
    const showText = displayMode === 'text' || displayMode === 'icon-text';
    const isGradient = Boolean(s.gradientFrom || s.gradientTo);
    const CATEGORIES = ['All', 'Popular', 'Actions & Arrows', 'Tech & Media', 'Social & Brands', 'Objects & UI'];
    const filteredIcons = ALL_ICON_ITEMS.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(iconSearchQuery.toLowerCase()) ||
            item.id.toLowerCase().includes(iconSearchQuery.toLowerCase()) ||
            (item.keywords || []).some(k => k.toLowerCase().includes(iconSearchQuery.toLowerCase()));
        const matchesCategory = iconCategoryFilter === 'All' || item.category === iconCategoryFilter;
        return matchesSearch && matchesCategory;
    });
    if (buttonSubTab === 'icon') {
        return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <button type="button" onClick={() => setButtonSubTab('main')} className="flex items-center gap-1.5 font-bold text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
              <ChevronLeft className="w-4 h-4"/>
              <span>Back to Button Settings</span>
            </button>
            <span className="text-[11px] text-slate-400 font-mono">
              Current: <strong className="text-indigo-500 capitalize">{element.buttonIcon || element.icon || 'arrow-right'}</strong>
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input type="text" placeholder="Search icons (e.g. arrow, check, star, heart)..." value={iconSearchQuery} onChange={(e) => setIconSearchQuery(e.target.value)} className={`${inputClass} pl-8 py-1.5 text-xs`}/>
            {iconSearchQuery && (<button type="button" onClick={() => setIconSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-3 h-3"/>
              </button>)}
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-[10px]">
            {CATEGORIES.map((cat) => (<button key={cat} type="button" onClick={() => setIconCategoryFilter(cat)} className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${iconCategoryFilter === cat
                    ? 'bg-indigo-600 text-white font-bold'
                    : isLight
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                {cat}
              </button>))}
          </div>

          <div className="grid grid-cols-4 gap-2.5 p-3 rounded-xl border max-h-[380px] overflow-y-auto bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-inner">
            {filteredIcons.length === 0 ? (<div className="col-span-4 text-center py-6 text-slate-400 italic text-xs">
                No icons found matching "{iconSearchQuery}"
              </div>) : (filteredIcons.map((item) => {
                const isSelected = (element.buttonIcon || element.icon || 'arrow-right') === item.id;
                return (<button key={item.id} type="button" onClick={() => {
                        updateProp('buttonIcon', item.id);
                        updateProp('icon', item.id);
                        setButtonSubTab('main');
                    }} className={`h-14 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md ring-2 ring-indigo-400 scale-[1.03]'
                        : isLight
                            ? 'bg-slate-50 border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 text-slate-700 hover:text-indigo-600'
                            : 'bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-indigo-500 text-slate-300 hover:text-white'}`} title={`${item.name} (${item.category})`}>
                    <div className="w-7 h-7 flex items-center justify-center">
                      {renderIconVisual(item.id, 'w-6 h-6')}
                    </div>
                  </button>);
            }))}
          </div>
        </div>);
    }
    return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
        <div>
          <label className={labelClass}>Button Display Mode</label>
          <div className={`grid grid-cols-3 gap-1 p-1 ${boxGroupClass}`}>
            {[
            { id: 'icon', label: 'Icon only' },
            { id: 'icon-text', label: 'Icon + Text' },
            { id: 'text', label: 'Text only' },
        ].map((opt) => (<button key={opt.id} type="button" onClick={() => updateProp('buttonDisplayMode', opt.id)} className={`py-1.5 text-[11px] rounded-lg font-bold transition-all cursor-pointer ${displayMode === opt.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : isLight
                    ? 'text-slate-600 hover:bg-slate-200'
                    : 'text-slate-400 hover:text-white'}`}>
                {opt.label}
              </button>))}
          </div>
        </div>

        {showIcon && (<div className="space-y-2">
            <label className={labelClass}>Button Icon</label>
            <button type="button" onClick={() => setButtonSubTab('icon')} className={`w-full px-3.5 py-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${isLight
                ? 'bg-indigo-50/70 hover:bg-indigo-100/70 border-indigo-200 text-indigo-900'
                : 'bg-indigo-950/40 hover:bg-indigo-950/70 border-indigo-800/60 text-indigo-200'}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  {renderIconVisual(element.buttonIcon || element.icon || 'arrow-right', 'w-3.5 h-3.5')}
                </div>
                <span className="font-bold text-xs capitalize">
                  {element.buttonIcon || element.icon || 'arrow-right'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>Select icon</span>
                <ChevronRight className="w-4 h-4"/>
              </div>
            </button>

            {displayMode === 'icon-text' && (<div className="pt-1">
                <label className={labelClass}>Icon Position</label>
                <div className={`grid grid-cols-2 gap-1 p-1 ${boxGroupClass}`}>
                  <button type="button" onClick={() => {
                    updateProp('buttonIconPosition', 'left');
                    updateProp('iconPosition', 'left');
                }} className={`py-1 text-[11px] rounded font-semibold transition-all cursor-pointer ${(element.buttonIconPosition || element.iconPosition || 'left') === 'left'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isLight
                        ? 'text-slate-600 hover:bg-slate-200'
                        : 'text-slate-400 hover:text-white'}`}>
                    Left
                  </button>
                  <button type="button" onClick={() => {
                    updateProp('buttonIconPosition', 'right');
                    updateProp('iconPosition', 'right');
                }} className={`py-1 text-[11px] rounded font-semibold transition-all cursor-pointer ${(element.buttonIconPosition || element.iconPosition) === 'right'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isLight
                        ? 'text-slate-600 hover:bg-slate-200'
                        : 'text-slate-400 hover:text-white'}`}>
                    Right
                  </button>
                </div>
              </div>)}
          </div>)}

        {showText && (<div>
            <label className={labelClass}>Button Text</label>
            <input type="text" value={element.content || ''} onChange={(e) => updateProp('content', e.target.value)} className={inputClass} placeholder="e.g. Get Started Now"/>
          </div>)}

        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <label className={labelClass}>Button Action Trigger</label>
          <div className={`grid grid-cols-6 gap-1 p-1 ${boxGroupClass}`}>
            {[
            { id: 'url', label: 'URL', icon: Globe },
            { id: 'toggle-dark-mode', label: 'Dark Mode', icon: Moon },
            { id: 'modal', label: 'Modal', icon: Layers },
            { id: 'email', label: 'Email', icon: Mail },
            { id: 'phone', label: 'Call', icon: Phone },
            { id: 'scroll', label: 'Scroll', icon: ArrowDownToLine },
        ].map((act) => {
            const IconComp = act.icon;
            const isActSelected = (element.buttonActionType === act.id) || (!element.buttonActionType && act.id === 'url') || (element.buttonActionType === 'dark-mode' && act.id === 'toggle-dark-mode');
            return (<button key={act.id} type="button" onClick={() => {
                updateProp('buttonActionType', act.id);
                if (act.id === 'toggle-dark-mode') {
                  if (!element.buttonIcon || element.buttonIcon === 'arrow-right') {
                    updateProp('buttonIcon', 'moon');
                    updateProp('icon', 'moon');
                  }
                  if (element.content === 'Click Me' || !element.content) {
                    updateProp('content', 'Toggle Theme');
                  }
                }
              }} className={`py-1.5 flex flex-col items-center justify-center gap-1 text-[10px] rounded-lg font-bold transition-all cursor-pointer ${isActSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isLight
                        ? 'text-slate-600 hover:bg-slate-200'
                        : 'text-slate-400 hover:text-white'}`} title={act.label}>
                  <IconComp className="w-3.5 h-3.5"/>
                  <span>{act.label}</span>
                </button>);
        })}
          </div>

          {(element.buttonActionType === 'toggle-dark-mode' || element.buttonActionType === 'dark-mode') && (
            <div className="space-y-3 pt-1 p-3 rounded-xl border bg-amber-500/10 dark:bg-amber-500/10 border-amber-300 dark:border-amber-700/60">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs">
                <Moon className="w-4 h-4 text-amber-500" />
                <span>Dark Mode Switcher Utility</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Turns this button into an interactive switch that flips the website between Light and Dark mode using the colors configured in Website Palette.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    updateProp('buttonDisplayMode', 'icon-text');
                    updateProp('buttonIcon', 'moon');
                    updateProp('icon', 'moon');
                    updateProp('content', 'Theme');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border cursor-pointer transition-colors ${
                    isLight ? 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700' : 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-200'
                  }`}
                >
                  Apply Icon + Text
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateProp('buttonDisplayMode', 'icon');
                    updateProp('buttonIcon', 'moon');
                    updateProp('icon', 'moon');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border cursor-pointer transition-colors ${
                    isLight ? 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700' : 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-200'
                  }`}
                >
                  Icon Only (Navbar style)
                </button>
              </div>
            </div>
          )}

          {(element.buttonActionType === 'url' || !element.buttonActionType) && (<div className="space-y-3 pt-1">
              <div>
                <label className={labelClass}>Destination</label>
                <div className="flex items-center gap-1.5">
                  <input type="text" value={element.href || ''} onChange={(e) => updateProp('href', e.target.value)} placeholder="https://example.com, mailto:..., or tel:..." className={`${inputClass} flex-1`}/>
                  <BrandLinkPicker
                    uiTheme={uiTheme}
                    variant="folderIcon"
                    align="right"
                    onSelectLink={(url, suggestedLabel) => {
                      updateProp('href', url);
                      if ((element.content === 'Click Me' || !element.content) && suggestedLabel) {
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
            </div>)}

          {element.buttonActionType === 'modal' && (<div className="space-y-2 pt-1 p-2.5 rounded-xl border bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5"/>
                  <span>Open Modal Dialog</span>
                </label>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Clicking this button will trigger and display the target modal overlay on screen.
              </p>
              <div>
                <label className={labelClass}>Modal Identifier / Title</label>
                <input type="text" value={element.buttonModalTargetId || element.modalTitle || 'Contact Inquiry Modal'} onChange={(e) => {
                updateProp('buttonModalTargetId', e.target.value);
                updateProp('modalTitle', e.target.value);
            }} placeholder="e.g. Lead Form Modal or Newsletter Popup" className={inputClass}/>
              </div>
            </div>)}

          {element.buttonActionType === 'email' && (<div className="space-y-2 pt-1 p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-500"/>
                <span>Compose Email (mailto:)</span>
              </label>
              <div>
                <label className={labelClass}>Recipient Email Address</label>
                <input type="email" value={element.buttonEmail || ''} onChange={(e) => {
                const email = e.target.value;
                updateProp('buttonEmail', email);
                const subject = element.buttonSubject ? `?subject=${encodeURIComponent(element.buttonSubject)}` : '';
                updateProp('href', `mailto:${email}${subject}`);
            }} placeholder="support@example.com" className={inputClass}/>
              </div>
              <div>
                <label className={labelClass}>Default Subject Line (Optional)</label>
                <input type="text" value={element.buttonSubject || ''} onChange={(e) => {
                const subj = e.target.value;
                updateProp('buttonSubject', subj);
                const email = element.buttonEmail || '';
                const subjectParam = subj ? `?subject=${encodeURIComponent(subj)}` : '';
                updateProp('href', `mailto:${email}${subjectParam}`);
            }} placeholder="e.g. Project Inquiry" className={inputClass}/>
              </div>
            </div>)}

          {element.buttonActionType === 'phone' && (<div className="space-y-2 pt-1 p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-500"/>
                <span>Direct Call (tel:)</span>
              </label>
              <div>
                <label className={labelClass}>Phone Number</label>
                <input type="tel" value={element.buttonPhone || ''} onChange={(e) => {
                const phone = e.target.value;
                updateProp('buttonPhone', phone);
                updateProp('href', `tel:${phone}`);
            }} placeholder="+1 (555) 234-5678" className={inputClass}/>
              </div>
            </div>)}

          {element.buttonActionType === 'scroll' && (<div className="space-y-2 pt-1 p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ArrowDownToLine className="w-3.5 h-3.5 text-indigo-500"/>
                <span>Scroll to Section / Anchor</span>
              </label>
              <div>
                <label className={labelClass}>Target Section Anchor (e.g. #pricing, #features)</label>
                <input type="text" value={element.buttonScrollTarget || element.href || '#'} onChange={(e) => {
                const target = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
                updateProp('buttonScrollTarget', target);
                updateProp('href', target);
            }} placeholder="#pricing or #contact" className={inputClass}/>
              </div>
            </div>)}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Button Size</label>
            <div className={`grid grid-cols-5 gap-1 p-1 ${boxGroupClass}`}>
              {[
            { label: 'XS', val: 'xs' },
            { label: 'SM', val: 'sm' },
            { label: 'MD', val: 'md' },
            { label: 'LG', val: 'lg' },
            { label: 'XL', val: 'xl' },
        ].map((sz) => (<button key={sz.val} type="button" onClick={() => updateStyle('buttonSize', sz.val as any)} className={`py-1 text-[10px] rounded font-semibold transition-all cursor-pointer ${(s.buttonSize || 'md') === sz.val
                ? 'bg-indigo-600 text-white shadow-sm'
                : isLight
                    ? 'text-slate-600 hover:bg-slate-200'
                    : 'text-slate-400 hover:text-white'}`}>
                  {sz.label}
                </button>))}
            </div>
          </div>
          <div>
            <label className={labelClass}>Button Alignment</label>
            <div className={`grid grid-cols-3 gap-1 p-1 ${boxGroupClass}`}>
              {(['left', 'center', 'right'] as const).map((al) => (<button key={al} type="button" onClick={() => {
                updateStyle('alignment', al);
                updateStyle('marginAuto', al);
            }} className={`py-1 text-[11px] rounded font-medium transition-all cursor-pointer flex items-center justify-center ${(s.alignment || (s.marginAuto === 'center' || s.marginAuto === true ? 'center' : s.marginAuto === 'right' ? 'right' : 'left')) === al
                ? 'bg-indigo-600 text-white font-semibold'
                : isLight
                    ? 'text-slate-600 hover:bg-slate-200'
                    : 'text-slate-400 hover:text-white'}`}>
                  {al === 'left' && <AlignLeft className="w-3.5 h-3.5"/>}
                  {al === 'center' && <AlignCenter className="w-3.5 h-3.5"/>}
                  {al === 'right' && <AlignRight className="w-3.5 h-3.5"/>}
                </button>))}
            </div>
          </div>
        </div>

        <div className={`flex items-center justify-between p-2.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
          <div>
            <span className="font-semibold text-slate-200">Full Width Button</span>
            <p className="text-[10px] text-slate-400">Stretch button to 100% width of parent</p>
          </div>
          <button type="button" onClick={() => updateStyle('fullWidth', !s.fullWidth)} className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${s.fullWidth ? 'bg-indigo-600' : 'bg-slate-700'}`}>
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${s.fullWidth ? 'left-5' : 'left-0.5'}`}/>
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={labelClass}>Background Styling</label>
            <div className="flex gap-1">
              <button type="button" onClick={() => {
            updateStyle('gradientFrom', undefined);
            updateStyle('gradientTo', undefined);
            updateStyle('backgroundColor', '#4f46e5');
        }} className={`px-1.5 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${!isGradient && s.backgroundColor !== 'transparent'
            ? 'bg-indigo-600 text-white'
            : isLight ? 'bg-slate-200 text-slate-600' : 'bg-slate-800 text-slate-400'}`}>
                Solid
              </button>
              <button type="button" onClick={() => {
            updateStyle('gradientFrom', '#4f46e5');
            updateStyle('gradientTo', '#7c3aed');
            updateStyle('gradientAngle', 'to right');
        }} className={`px-1.5 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${isGradient
            ? 'bg-indigo-600 text-white'
            : isLight ? 'bg-slate-200 text-slate-600' : 'bg-slate-800 text-slate-400'}`}>
                Gradient
              </button>
              <button type="button" onClick={() => {
            updateStyle('gradientFrom', undefined);
            updateStyle('gradientTo', undefined);
            updateStyle('backgroundColor', 'transparent');
            updateStyle('borderWidth', s.borderWidth || 1);
            updateStyle('borderColor', s.borderColor || '#4f46e5');
        }} className={`px-1.5 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${s.backgroundColor === 'transparent' && !isGradient
            ? 'bg-indigo-600 text-white'
            : isLight ? 'bg-slate-200 text-slate-600' : 'bg-slate-800 text-slate-400'}`}>
                Outline
              </button>
            </div>
          </div>
          {!isGradient ? (<div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Background Color</label>
                <div className="flex items-center gap-1.5">
                  <input type="color" value={s.backgroundColor && s.backgroundColor !== 'transparent' ? s.backgroundColor : '#4f46e5'} onChange={(e) => updateStyle('backgroundColor', e.target.value)} className="w-7 h-7 rounded border bg-transparent cursor-pointer"/>
                  <input type="text" value={s.backgroundColor || '#4f46e5'} onChange={(e) => updateStyle('backgroundColor', e.target.value)} className={`${inputClass} font-mono text-[11px]`}/>
                </div>
              </div>
              <div>
                <label className={labelClass}>Text Color</label>
                <div className="flex items-center gap-1.5">
                  <input type="color" value={s.textColor || '#ffffff'} onChange={(e) => updateStyle('textColor', e.target.value)} className="w-7 h-7 rounded border bg-transparent cursor-pointer"/>
                  <input type="text" value={s.textColor || '#ffffff'} onChange={(e) => updateStyle('textColor', e.target.value)} className={`${inputClass} font-mono text-[11px]`}/>
                </div>
              </div>
            </div>) : (<div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400">From</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <input type="color" value={s.gradientFrom || '#4f46e5'} onChange={(e) => updateStyle('gradientFrom', e.target.value)} className="w-6 h-6 rounded border bg-transparent cursor-pointer"/>
                    <input type="text" value={s.gradientFrom || '#4f46e5'} onChange={(e) => updateStyle('gradientFrom', e.target.value)} className={`${inputClass} font-mono text-[10px] py-1`}/>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">To</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <input type="color" value={s.gradientTo || '#7c3aed'} onChange={(e) => updateStyle('gradientTo', e.target.value)} className="w-6 h-6 rounded border bg-transparent cursor-pointer"/>
                    <input type="text" value={s.gradientTo || '#7c3aed'} onChange={(e) => updateStyle('gradientTo', e.target.value)} className={`${inputClass} font-mono text-[10px] py-1`}/>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[
                { label: '→ Right', val: 'to right' },
                { label: '↓ Down', val: 'to bottom' },
                { label: '↘ Diag', val: 'to bottom right' },
                { label: '↗ Diag', val: 'to top right' },
            ].map((dir) => (<button key={dir.val} type="button" onClick={() => updateStyle('gradientAngle', dir.val)} className={`py-1 text-[10px] rounded font-medium border cursor-pointer ${(s.gradientAngle || 'to right') === dir.val
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : isLight
                        ? 'bg-slate-100 border-slate-200 text-slate-700'
                        : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                    {dir.label}
                  </button>))}
              </div>
            </div>)}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Border Radius</label>
              <span className="text-[10px] font-mono text-slate-400">{s.borderRadius ?? 8}px</span>
            </div>
            <input type="range" min={0} max={40} value={s.borderRadius ?? 8} onChange={(e) => updateStyle('borderRadius', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Border Width</label>
              <span className="text-[10px] font-mono text-slate-400">{s.borderWidth ?? 0}px</span>
            </div>
            <input type="range" min={0} max={6} value={s.borderWidth ?? 0} onChange={(e) => updateStyle('borderWidth', Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer"/>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Shadow</label>
            <select value={s.shadow || 'none'} onChange={(e) => updateStyle('shadow', e.target.value === 'none' ? undefined : e.target.value)} className={selectClass}>
              <option value="none">None</option>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="xl">Extra Large</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Hover Effect</label>
            <select value={s.hoverEffect || 'none'} onChange={(e) => updateStyle('hoverEffect', e.target.value === 'none' ? undefined : e.target.value)} className={selectClass}>
              <option value="none">None</option>
              <option value="scale">Scale Up</option>
              <option value="lift">Lift Up</option>
              <option value="glow">Glow</option>
              <option value="slide-icon">Slide Icon</option>
            </select>
          </div>
        </div>
      </div>);
};
