import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Check, Type } from 'lucide-react';
import { SearchInput, FilterButton, SidePanel } from '../common';
import { INTERFACE_FONTS, findFontByIdOrName } from '../../data/fonts';
import { useFontPreloader } from '../../hooks/useFontPreloader';

export interface FontModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFontId: string;
  onSelectFont: (fontId: string) => void;
  uiTheme: 'dark' | 'light';
  title?: string;
}

const PAGE_SIZE = 16;

export const FontModal: React.FC<FontModalProps> = ({
  isOpen,
  onClose,
  currentFontId,
  onSelectFont,
  uiTheme,
  title = 'Typography',
}) => {
  const isLight = uiTheme === 'light';
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'sans-serif' | 'serif' | 'monospace' | 'cursive'>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
      setCategoryFilter('all');
      setVisibleCount(PAGE_SIZE);
    }
  }, [isOpen]);

  const filteredFonts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return INTERFACE_FONTS.filter((font) => {
      const matchesCategory = categoryFilter === 'all' || font.category === categoryFilter;
      if (!matchesCategory) return false;
      if (!query) return true;
      return (
        font.name.toLowerCase().includes(query) ||
        font.category.toLowerCase().includes(query) ||
        (font.description && font.description.toLowerCase().includes(query)) ||
        font.family.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, categoryFilter]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [searchQuery, categoryFilter]);

  useEffect(() => {
    if (!isOpen) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredFonts.length));
        }
      },
      {
        root: containerRef.current,
        rootMargin: '120px',
        threshold: 0.1,
      }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isOpen, filteredFonts.length]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 120) {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredFonts.length));
    }
  };

  const currentFontObj = findFontByIdOrName(currentFontId) || INTERFACE_FONTS[0];
  const categories: Array<{
    id: 'all' | 'sans-serif' | 'serif' | 'monospace' | 'cursive';
    label: string;
  }> = [
    { id: 'all', label: 'All' },
    { id: 'sans-serif', label: 'Sans-Serif' },
    { id: 'serif', label: 'Serif' },
    { id: 'monospace', label: 'Monospace' },
  ];
  const displayedFonts = filteredFonts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredFonts.length;

  useFontPreloader(displayedFonts, isOpen);

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={`${filteredFonts.length} typefaces available`}
      icon={<Type className="w-4 h-4" />}
      uiTheme={uiTheme}
      width="w-full sm:w-[420px]"
    >
      {/* Search & Filters */}
      <div
        className={`p-4 border-b shrink-0 space-y-2.5 ${
          isLight ? 'border-slate-200/80 bg-slate-50/60' : 'border-slate-800/80 bg-slate-950/40'
        }`}
      >
        <div className="flex items-center gap-2">
          <SearchInput
            ref={searchInputRef}
            id="interface-font-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fonts (e.g., Plus Jakarta, Inter, Poppins)..."
            onClear={() => setSearchQuery('')}
            isLight={isLight}
            containerClassName="flex-1 min-w-0"
          />
          <FilterButton
            variant="rounded-full"
            isActive={showFilters || categoryFilter !== 'all'}
            onClick={() => setShowFilters((prev) => !prev)}
            isLight={isLight}
            iconClassName="w-3.5 h-3.5"
            title={showFilters ? 'Hide font category filters' : 'Filter font categories'}
            ariaLabel="Filter font categories"
          />
        </div>

        {showFilters && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold border border-transparent'
                    : isLight
                    ? 'bg-white text-slate-600 border border-slate-300/80 hover:bg-slate-100 hover:text-slate-900'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Font List */}
      <div
        ref={containerRef}
        id="interface-font-inspector-scroll-list"
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0"
      >
        {filteredFonts.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Type className="w-8 h-8 text-slate-400 mx-auto opacity-40" />
            <p className="text-xs font-medium text-slate-400">No matching fonts found</p>
            <p className="text-[11px] text-slate-500">Try searching another typeface name</p>
          </div>
        ) : (
          displayedFonts.map((font) => {
            const isSelected = font.id === currentFontId || font.family === currentFontObj.family;
            return (
              <div
                key={font.id}
                id={`font-option-${font.id}`}
                onClick={() => onSelectFont(font.id)}
                className={`px-3.5 py-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? isLight
                      ? 'bg-indigo-50/90 border-indigo-300 text-indigo-950 shadow-xs'
                      : 'bg-indigo-950/60 border-indigo-700 text-indigo-100 shadow-xs'
                    : isLight
                    ? 'bg-slate-50/80 border-slate-200/70 hover:bg-slate-100 hover:border-slate-300'
                    : 'bg-slate-800/50 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm truncate ${
                        isSelected
                          ? 'font-bold text-indigo-600 dark:text-indigo-400'
                          : 'font-semibold text-slate-900 dark:text-slate-100'
                      }`}
                      style={{ fontFamily: font.family }}
                    >
                      {font.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono capitalize">
                      {font.category}
                    </span>
                  </div>
                  <p
                    className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate"
                    style={{ fontFamily: font.family }}
                  >
                    Sphinx of black quartz, judge my vow. 12345
                  </p>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                )}
              </div>
            );
          })
        )}

        <div ref={sentinelRef} className="h-4 w-full flex items-center justify-center text-xs text-slate-400">
          {hasMore && (
            <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin my-2" />
          )}
        </div>
      </div>
    </SidePanel>
  );
};
