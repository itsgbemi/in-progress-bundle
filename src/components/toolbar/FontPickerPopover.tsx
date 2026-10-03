import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, Check } from 'lucide-react';
import { FilterButton } from '../common/FilterButton';
import { ALL_FONTS } from '../../data/fonts';
import { WEIGHT_LABELS } from '../properties/InlineColorPicker';
import { useFontPreloader } from '../../hooks/useFontPreloader';

interface FontPickerPopoverProps {
    currentFont?: string;
    currentWeight?: number | string;
    onSelectFont: (fontFamily: string, weight?: number) => void;
    isLight?: boolean;
}

export const FontPickerPopover: React.FC<FontPickerPopoverProps> = ({ currentFont = 'Plus Jakarta Sans', currentWeight = 400, onSelectFont, isLight = false }) => {
    const [fontSearch, setFontSearch] = useState('');
    const [fontCategory, setFontCategory] = useState<string>('all');
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [expandedFonts, setExpandedFonts] = useState<Record<string, boolean>>({});

    const toggleFontExpanded = (fontId: string) => {
        setExpandedFonts((prev) => ({
            ...prev,
            [fontId]: !prev[fontId],
        }));
    };

    const filteredFonts = useMemo(() => {
        return ALL_FONTS.filter((f) => {
            const matchesCategory = fontCategory === 'all' || f.category === fontCategory;
            const matchesSearch = fontSearch === '' || f.name.toLowerCase().includes(fontSearch.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [fontCategory, fontSearch]);

    useFontPreloader(filteredFonts);

    const inputClass = isLight
        ? 'w-full px-3.5 py-2 text-xs font-normal bg-white border border-slate-300 rounded-full text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-xs'
        : 'w-full px-3.5 py-2 text-xs font-normal bg-slate-950 border border-slate-700/90 rounded-full text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-xs';

    return (
      <div className="space-y-3 flex flex-col h-full min-h-0">
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex-1 min-w-0">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            <input type="text" value={fontSearch} onChange={(e) => setFontSearch(e.target.value)} placeholder="Search fonts by name..." className={`${inputClass} pl-9`}/>
          </div>
          <FilterButton
            variant="rounded-full"
            isActive={showFilters || fontCategory !== 'all'}
            onClick={() => setShowFilters((prev) => !prev)}
            isLight={isLight}
            iconClassName="w-3.5 h-3.5"
            title={showFilters ? "Hide category filters" : "Filter font categories"}
            ariaLabel="Filter font categories"
          />
        </div>

        {showFilters && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[10px] shrink-0">
            {['all', 'sans-serif', 'serif', 'monospace', 'cursive'].map((cat) => (
              <button
                key={cat}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setFontCategory(cat)}
                className={`py-1 px-3 rounded-full capitalize whitespace-nowrap transition-all cursor-pointer ${
                  fontCategory === cat
                    ? 'bg-indigo-600 text-white font-semibold border border-transparent shadow-xs'
                    : isLight
                      ? 'bg-transparent text-slate-600 border border-slate-300/80 hover:bg-slate-100 hover:text-slate-900'
                      : 'bg-transparent text-slate-400 border border-slate-700/80 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Fonts' : cat}
              </button>
            ))}
          </div>
        )}

      <div className="space-y-1.5 flex-1 min-h-[250px] sm:min-h-0 overflow-y-auto no-scrollbar pr-0.5">
        {filteredFonts.map((f) => {
            const isSelectedFont = currentFont ? (currentFont.toLowerCase() === f.name.toLowerCase()) : false;
            const isExpanded = !!expandedFonts[f.id];
            return (<div key={f.id} className={`rounded-xl border transition-all ${isSelectedFont
                    ? isLight
                        ? 'border-indigo-400 bg-indigo-50/50'
                        : 'border-indigo-600/70 bg-indigo-950/20'
                    : isLight
                        ? 'border-slate-200 bg-white hover:border-slate-300'
                        : 'border-slate-800/80 bg-slate-900/50 hover:border-slate-700'}`}>
              <div onMouseDown={(e) => {
                    e.preventDefault();
                    onSelectFont(f.name);
                    if (!isExpanded) {
                        toggleFontExpanded(f.id);
                    }
                }} className="flex items-center justify-between p-2.5 cursor-pointer select-none group">
                <div className="flex items-center gap-2 min-w-0">
                  <button type="button" onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFontExpanded(f.id);
                }} className={`p-1 rounded-md transition-transform shrink-0 ${isLight
                    ? 'hover:bg-slate-200 text-slate-500'
                    : 'hover:bg-slate-800 text-slate-400'}`} title={isExpanded ? 'Collapse weights' : 'Expand weights'}>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-90 text-indigo-400' : ''}`}/>
                  </button>

                  <div className="truncate">
                    <span className="text-xs font-semibold block text-slate-800 dark:text-slate-100" style={{ fontFamily: f.family }}>
                      {f.name}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span className="capitalize">{f.category}</span>
                      <span>•</span>
                      <span>
                        {f.weights.length} {f.weights.length === 1 ? 'weight' : 'weights'}
                      </span>
                      {f.isWebSafe && (<>
                          <span>•</span>
                          <span className="text-emerald-500 font-medium">Web-Safe</span>
                        </>)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isSelectedFont && (<div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                      <Check className="w-3 h-3"/>
                    </div>)}
                </div>
              </div>

              {isExpanded && (<div className={`px-3 pb-2.5 pt-1 border-t ${isLight
                        ? 'border-slate-200/80 bg-slate-50/60'
                        : 'border-slate-800/80 bg-slate-950/40'} rounded-b-xl`}>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Available Weights
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {f.weights.map((w) => {
                        const currentWeightNum = typeof currentWeight === 'number'
                            ? currentWeight
                            : parseInt(currentWeight, 10) || 400;
                        const isWeightActive = isSelectedFont && currentWeightNum === w;
                        return (<button key={w} type="button" onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onSelectFont(f.name, w);
                            }} className={`py-1.5 px-2 rounded-lg text-[11px] transition-all cursor-pointer flex items-center justify-between text-left ${isWeightActive
                                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                                : isLight
                                    ? 'bg-white hover:bg-indigo-50 border border-slate-200 text-slate-700'
                                    : 'bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300'}`}>
                          <span style={{
                                fontFamily: f.family,
                                fontWeight: w,
                            }}>
                            {WEIGHT_LABELS[w] || `${w}`}
                          </span>
                          {isWeightActive && (<Check className="w-3 h-3 text-white shrink-0 ml-1"/>)}
                        </button>);
                    })}
                  </div>
                </div>)}
            </div>);
        })}
      </div>
    </div>);
};
