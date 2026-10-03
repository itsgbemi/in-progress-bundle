import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlignLeft, AlignCenter, AlignRight, ExternalLink, Search, RotateCw, Sparkles, Info, MoveHorizontal, ChevronRight } from 'lucide-react';
import { WebsiteElement } from '../../types';
import { ALL_ICON_ITEMS, renderIconVisual } from '../IconRenderer';
import { ElementInspectorProps, getInspectorStyles } from './PropertiesCommon';
export const IconProperties: React.FC<ElementInspectorProps> = ({ selectedContext, onUpdateElement, uiTheme = 'dark', }) => {
    const [showSidePanel, setShowSidePanel] = useState(false);
    const [iconSearchQuery, setIconSearchQuery] = useState('');
    const [iconCategoryFilter, setIconCategoryFilter] = useState('All');
    const [customIconInput, setCustomIconInput] = useState('');
    const isLight = uiTheme === 'light';
    const { inputClass, labelClass, boxGroupClass } = getInspectorStyles(isLight);
    if (!selectedContext)
        return null;
    const { element } = selectedContext;
    const s = element.styles || {};
    const iconName = element.iconName || 'sparkles';
    const iconColor = s.textColor || s.color || '#6366f1';
    const iconBg = s.backgroundColor || 'transparent';
    const iconSize = s.fontSize || 32;
    const rotation = s.rotation || 0;
    const isFlipX = !!s.flipX;
    const isFlipY = !!s.flipY;
    const glowColor = s.glowColor || '';
    const hoverEffect = s.hoverEffect || 'none';
    const bgType = s.backgroundGradient
        ? 'gradient'
        : s.backgroundColor && s.backgroundColor !== 'transparent'
            ? 'solid'
            : 'transparent';
    const align = s.textAlign || 'center';
    const iconGap = element.iconGap !== undefined ? element.iconGap : 12;
    const iconTextLayout = element.iconTextLayout || 'separate';
    const iconItems = element.iconItems || [];
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
    const CATEGORIES = ['All', 'Popular', 'Actions & Arrows', 'Tech & Media', 'Social & Brands', 'Objects & UI'];
    const filteredIcons = ALL_ICON_ITEMS.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(iconSearchQuery.toLowerCase()) ||
            item.id.toLowerCase().includes(iconSearchQuery.toLowerCase()) ||
            (item.keywords || []).some((k) => k.toLowerCase().includes(iconSearchQuery.toLowerCase()));
        const matchesCategory = iconCategoryFilter === 'All' || item.category === iconCategoryFilter;
        return matchesSearch && matchesCategory;
    });
    const GRADIENT_PRESETS = [
        { name: 'Indigo to Purple', val: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' },
        { name: 'Sunset Glow', val: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)' },
        { name: 'Emerald Mint', val: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' },
        { name: 'Ocean Cyan', val: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' },
        { name: 'Midnight Dark', val: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)' },
        { name: 'Amber Gold', val: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' },
    ];
    return (<div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
      <div className="space-y-2 p-3 rounded-xl border bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/60">
        <label className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5"/>
            <span>Icon</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono font-normal">
            Active: <strong className="text-indigo-600 dark:text-indigo-400">{iconName}</strong>
          </span>
        </label>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            {renderIconVisual(iconName, 'w-5 h-5')}
          </div>
          <input type="text" value={customIconInput || iconName} onChange={(e) => {
            setCustomIconInput(e.target.value);
            updateProp('iconName', e.target.value);
        }} placeholder="e.g. star, fa-brands fa-github, 🚀..." className={`${inputClass} flex-1 text-xs py-1.5`}/>
        </div>

        <div className="pt-0.5">
          <button type="button" onClick={() => setShowSidePanel(true)} className="underline font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 text-xs cursor-pointer inline-flex items-center gap-1.5 transition-colors">
            <span>Select an Icon</span>
            <ChevronRight className="w-3.5 h-3.5 no-underline inline"/>
          </button>
        </div>
      </div>

      <div className="space-y-4 pt-1">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className={labelClass}>Icon Size</label>
            <span className="text-[11px] font-mono text-indigo-500 font-bold">{iconSize}px</span>
          </div>

          <div className="flex items-center gap-3">
            <input type="range" min={12} max={96} step={2} value={iconSize} onChange={(e) => updateStyle('fontSize', Number(e.target.value))} className="flex-1 accent-indigo-500 cursor-pointer"/>
          </div>

          <div className="flex items-center gap-1.5">
            {[16, 24, 32, 48, 64].map((sz) => (<button key={sz} type="button" onClick={() => updateStyle('fontSize', sz)} className={`flex-1 py-1 rounded-lg text-[10px] font-mono font-bold border transition-colors cursor-pointer ${iconSize === sz
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : isLight
                    ? 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
                    : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'}`}>
                {sz}px
              </button>))}
          </div>

          <div>
            <label className={labelClass}>Horizontal Alignment</label>
            <div className="flex items-center gap-1.5">
              {[
            { val: 'left', label: 'Left', icon: AlignLeft },
            { val: 'center', label: 'Center', icon: AlignCenter },
            { val: 'right', label: 'Right', icon: AlignRight },
        ].map((al) => {
            const IconComponent = al.icon;
            return (<button key={al.val} type="button" onClick={() => updateStyle('textAlign', al.val)} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${align === al.val
                    ? 'bg-indigo-600 border-indigo-600 text-white font-bold'
                    : isLight
                        ? 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                        : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'}`}>
                    <IconComponent className="w-3.5 h-3.5"/>
                    <span>{al.label}</span>
                  </button>);
        })}
            </div>
          </div>

          <div>
            <label className={labelClass}>Display Mode</label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              <button type="button" onClick={() => updateStyle('display', 'flex')} className={`py-1.5 px-3 rounded-lg border text-center text-xs font-semibold cursor-pointer ${(s.display || 'inline-flex') === 'flex'
            ? 'bg-indigo-600 text-white border-indigo-600'
            : isLight ? 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700' : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300'}`}>
                Block Flex
              </button>
              <button type="button" onClick={() => updateStyle('display', 'inline-flex')} className={`py-1.5 px-3 rounded-lg border text-center text-xs font-semibold cursor-pointer ${(s.display || 'inline-flex') === 'inline-flex'
            ? 'bg-indigo-600 text-white border-indigo-600'
            : isLight ? 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700' : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300'}`}>
                Inline Flex
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Inline Flex allows this icon to sit inside text naturally.</p>
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          <label className={labelClass}>Colors & Background</label>

          <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800">
            <span className="font-semibold text-xs">Icon Color</span>
            <div className="flex items-center gap-2">
              <input type="color" value={iconColor.startsWith('#') ? iconColor : '#6366f1'} onChange={(e) => {
            updateStyle('textColor', e.target.value);
            updateStyle('color', e.target.value);
        }} className="w-7 h-7 rounded border bg-transparent cursor-pointer shrink-0"/>
              <input type="text" value={iconColor} onChange={(e) => {
            updateStyle('textColor', e.target.value);
            updateStyle('color', e.target.value);
        }} className={`${inputClass} text-[11px] py-1 px-2 font-mono w-24`}/>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1 mb-2">
              {[
            { id: 'transparent', label: 'None' },
            { id: 'solid', label: 'Solid' },
            { id: 'gradient', label: 'Gradient' },
        ].map((m) => (<button key={m.id} type="button" onClick={() => {
                if (m.id === 'transparent') {
                    updateStyle('backgroundColor', 'transparent');
                    updateStyle('backgroundGradient', undefined);
                }
                else if (m.id === 'solid') {
                    updateStyle('backgroundColor', s.backgroundColor && s.backgroundColor !== 'transparent'
                        ? s.backgroundColor
                        : '#1e1b4b');
                    updateStyle('backgroundGradient', undefined);
                }
                else {
                    updateStyle('backgroundGradient', s.backgroundGradient || GRADIENT_PRESETS[0].val);
                }
            }} className={`flex-1 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${bgType === m.id
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}>
                  {m.label}
                </button>))}
            </div>

            {bgType === 'solid' && (<div className="flex items-center justify-between gap-2 p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-xs">Background Color</span>
                <div className="flex items-center gap-2">
                  <input type="color" value={iconBg.startsWith('#') ? iconBg : '#1e1b4b'} onChange={(e) => updateStyle('backgroundColor', e.target.value)} className="w-7 h-7 rounded border bg-transparent cursor-pointer shrink-0"/>
                  <input type="text" value={iconBg} onChange={(e) => updateStyle('backgroundColor', e.target.value)} className={`${inputClass} text-[11px] py-1 px-2 font-mono w-24`}/>
                </div>
              </div>)}

            {bgType === 'gradient' && (<div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-500">Preset Gradients</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {GRADIENT_PRESETS.map((g) => (<button key={g.name} type="button" onClick={() => updateStyle('backgroundGradient', g.val)} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-semibold flex items-center gap-2 text-left hover:border-indigo-500 cursor-pointer">
                      <div className="w-4 h-4 rounded-full shrink-0 shadow-xs" style={{ background: g.val }}/>
                      <span className="truncate">{g.name}</span>
                    </button>))}
                </div>
              </div>)}
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          <label className={labelClass}>Rotation & Flip</label>
          <div className="flex items-center gap-2">
            {[0, 45, 90, 180, 270].map((deg) => (<button key={deg} type="button" onClick={() => updateStyle('rotation', deg)} className={`flex-1 py-1 rounded-lg text-[10px] font-mono font-bold border transition-colors cursor-pointer ${rotation === deg
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}>
                {deg}°
              </button>))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => updateStyle('flipX', !isFlipX)} className={`py-1.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${isFlipX
            ? 'bg-indigo-600 text-white border-indigo-600'
            : isLight ? 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700' : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300'}`}>
              <MoveHorizontal className="w-3.5 h-3.5"/>
              <span>Flip Horizontal</span>
            </button>

            <button type="button" onClick={() => updateStyle('flipY', !isFlipY)} className={`py-1.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${isFlipY
            ? 'bg-indigo-600 text-white border-indigo-600'
            : isLight ? 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700' : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300'}`}>
              <RotateCw className="w-3.5 h-3.5"/>
              <span>Flip Vertical</span>
            </button>
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-xs block">Clickable Link Destination</span>
              <span className="text-[10px] text-slate-400">Make icon navigate when clicked</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold mb-1">Destination URL</label>
            <div className="flex gap-2">
              <input type="text" value={element.href || ''} onChange={(e) => updateProp('href', e.target.value)} placeholder="https://example.com or #features" className={`${inputClass} text-xs py-1.5 flex-1`}/>
              <button type="button" onClick={() => updateProp('target', element.target === '_blank' ? '_self' : '_blank')} className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${element.target === '_blank'
            ? 'bg-indigo-600 border-indigo-500 text-white'
            : isLight
                ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'}`} title="Open link in a new tab">
                <ExternalLink className="w-3.5 h-3.5 inline mr-1"/>
                {element.target === '_blank' ? 'New Tab' : 'Same Tab'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSidePanel && (<div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8">
            <motion.div key="icon-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSidePanel(false)} className="absolute inset-0 bg-black/75 backdrop-blur-md"/>

            <motion.div key="icon-modal" initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className={`relative z-[105] w-full max-w-5xl h-[90vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'}`}>
              <div className="p-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/80 dark:bg-slate-950/70">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                    <Sparkles className="w-5 h-5"/>
                  </div>
                  <div>
                    <h3 className="text-base font-bold">Icon Picker & Library Catalog</h3>
                    <p className="text-xs text-slate-400">Browse 100+ icons, Font Awesome classes, Unicode symbols, emojis or raw SVG</p>
                  </div>
                </div>
                <button type="button" onClick={() => setShowSidePanel(false)} className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer transition-colors" aria-label="Close modal">
                  <X className="w-5 h-5"/>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-thin">
                <div className="p-4 rounded-2xl border bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/80 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                    <Info className="w-4 h-4 text-indigo-500 shrink-0"/>
                    <span>Supported Icon Formats & Instructions</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-600 dark:text-slate-300">
                    <div className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-indigo-100 dark:border-indigo-900/50">
                      <div className="font-bold text-indigo-600 dark:text-indigo-400 mb-0.5">1. Lucide Icons</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Type standard Lucide names like <code className="text-indigo-500 font-mono">star</code>, <code className="text-indigo-500 font-mono">shield</code>, <code className="text-indigo-500 font-mono">rocket</code>.
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-indigo-100 dark:border-indigo-900/50">
                      <div className="font-bold text-indigo-600 dark:text-indigo-400 mb-0.5">2. Font Awesome</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Use classes like <code className="text-indigo-500 font-mono">fa-brands fa-github</code> or <code className="text-indigo-500 font-mono">fa-solid fa-cart-shopping</code>.
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-indigo-100 dark:border-indigo-900/50">
                      <div className="font-bold text-indigo-600 dark:text-indigo-400 mb-0.5">3. Emojis & Symbols</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Paste any emoji or unicode directly (e.g. 🚀, ⚡, 🔥, ✨, 💡, ✦).
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-indigo-100 dark:border-indigo-900/50">
                      <div className="font-bold text-indigo-600 dark:text-indigo-400 mb-0.5">4. Raw SVG</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Paste raw <code className="text-indigo-500 font-mono">&lt;svg&gt;...&lt;/svg&gt;</code> code snippet into the input field.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <label className="font-bold text-sm">Icon Library</label>
                      <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {filteredIcons.length} available
                      </span>
                    </div>

                    <div className="relative w-full sm:w-80">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                      <input type="text" placeholder="Search icons (e.g. star, bolt, heart, github)..." value={iconSearchQuery} onChange={(e) => setIconSearchQuery(e.target.value)} className={`${inputClass} pl-9 py-2 text-xs sm:text-sm`}/>
                      {iconSearchQuery && (<button type="button" onClick={() => setIconSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                          <X className="w-4 h-4"/>
                        </button>)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin text-xs">
                    {CATEGORIES.map((cat) => (<button key={cat} type="button" onClick={() => setIconCategoryFilter(cat)} className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer font-medium ${iconCategoryFilter === cat
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                    : isLight
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}>
                        {cat}
                      </button>))}
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 p-4 rounded-2xl border min-h-[320px] max-h-[480px] overflow-y-auto bg-slate-50/50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 shadow-inner scrollbar-thin">
                    {filteredIcons.length === 0 ? (<div className="col-span-full text-center py-12 text-slate-400 italic text-sm">
                        No icons found matching "{iconSearchQuery}"
                      </div>) : (filteredIcons.map((item) => {
                const isSelected = iconName.toLowerCase() === item.id.toLowerCase() ||
                    iconName.toLowerCase() === item.name.toLowerCase();
                return (<button key={item.id} type="button" onClick={() => {
                        setCustomIconInput(item.id);
                        updateProp('iconName', item.id);
                    }} className={`h-20 rounded-xl flex flex-col items-center justify-center p-2 transition-all cursor-pointer border group ${isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg ring-2 ring-indigo-400 scale-[1.04]'
                        : isLight
                            ? 'bg-white border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 text-slate-700 hover:text-indigo-600'
                            : 'bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-indigo-500 text-slate-300 hover:text-white'}`} title={`${item.name} (${item.category})`}>
                            <div className="w-8 h-8 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                              {renderIconVisual(item.id, 'w-7 h-7')}
                            </div>
                            <span className="text-[10px] truncate max-w-full font-medium opacity-80">
                              {item.name}
                            </span>
                          </button>);
            }))}
                  </div>
                </div>
              </div>

              <div className="p-4 sm:px-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 bg-slate-50/80 dark:bg-slate-950/70">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Selected Icon:</span>
                  <strong className="text-indigo-600 dark:text-indigo-400 font-mono text-sm">{iconName}</strong>
                </div>

                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setShowSidePanel(false)} className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-indigo-600/20 transition-all">
                    Done & Apply Icon
                  </button>
                </div>
              </div>
            </motion.div>
          </div>)}
      </AnimatePresence>
    </div>);
};
