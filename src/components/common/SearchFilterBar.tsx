import React, { useState, useRef, useEffect } from 'react';
import { Search, LayoutGrid, List, Check, ArrowUpDown } from 'lucide-react';

export interface FilterOption {
  id: string;
  label: string;
}

export interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  filterOptions?: FilterOption[];
  selectedFilter?: string;
  onSelectFilter?: (id: string) => void;
  filterTitle?: string;
  sortOptions?: FilterOption[];
  selectedSort?: string;
  onSelectSort?: (id: string) => void;
  sortTitle?: string;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  isLight?: boolean;
  leftActions?: React.ReactNode;
  extraControls?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filterOptions,
  selectedFilter = 'all',
  onSelectFilter,
  filterTitle = 'Filter',
  sortOptions,
  selectedSort,
  onSelectSort,
  sortTitle = 'Sort By',
  viewMode,
  onViewModeChange,
  isLight = true,
  leftActions,
  extraControls,
  className = '',
  children,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasActiveFilter = selectedFilter && selectedFilter !== 'all';
  const hasActiveSort = selectedSort && selectedSort !== (sortOptions?.[0]?.id || '');

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3.5 w-full ${className}`}>
      <div className="flex items-center gap-2.5 w-full sm:w-auto flex-1 max-w-xl">
        {leftActions}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-full text-xs outline-none transition-all bg-transparent border border-slate-300/80 dark:border-slate-700/80 focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 dark:focus:border-indigo-500 dark:focus:ring-1 dark:focus:ring-indigo-500/20 shadow-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3.5 self-end sm:self-auto flex-wrap">
        {extraControls}
        {filterOptions && filterOptions.length > 0 && onSelectFilter && (
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className={`p-2.5 rounded-full border transition-colors cursor-pointer flex items-center justify-center relative ${
                hasActiveFilter
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400'
                  : 'bg-transparent border-slate-300/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title={filterTitle}
            >
              <svg className="w-4 h-4" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="1" y1="3" x2="15" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="3" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="5" y1="11" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {hasActiveFilter && (
                <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-1 right-1" />
              )}
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 max-w-[calc(100vw-2rem)] rounded-2xl border shadow-lg py-1.5 z-20 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150">
                {filterTitle && (
                  <div className="px-3.5 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    {filterTitle}
                  </div>
                )}
                <div className="p-1 space-y-0.5">
                  {filterOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        onSelectFilter(opt.id);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-xs text-left rounded-xl flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-indigo-950/50 cursor-pointer ${
                        selectedFilter === opt.id ? 'font-bold text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {selectedFilter === opt.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {sortOptions && sortOptions.length > 0 && onSelectSort && (
          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => setIsSortOpen((prev) => !prev)}
              className={`p-2.5 rounded-full border transition-colors cursor-pointer flex items-center justify-center relative ${
                hasActiveSort
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400'
                  : 'bg-transparent border-slate-300/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title={sortTitle}
            >
              <ArrowUpDown className="w-4 h-4" />
              {hasActiveSort && (
                <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-1 right-1" />
              )}
            </button>

            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-48 max-w-[calc(100vw-2rem)] rounded-2xl border shadow-lg py-1.5 z-20 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  {sortTitle}
                </div>
                <div className="p-1 space-y-0.5">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        onSelectSort(opt.id);
                        setIsSortOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-xs text-left rounded-xl flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-indigo-950/50 cursor-pointer ${
                        selectedSort === opt.id ? 'font-bold text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {selectedSort === opt.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {viewMode && onViewModeChange && (
          <div className="flex items-center p-1 rounded-full border bg-transparent border-slate-300/80 dark:border-slate-700/80">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
