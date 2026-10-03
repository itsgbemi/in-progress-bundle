import React from 'react';
import { FilterIcon } from './FilterIcon';

export interface FilterButtonProps {
  isActive?: boolean;
  onClick?: () => void;
  title?: string;
  ariaLabel?: string;
  isLight?: boolean;
  badge?: boolean;
  className?: string;
  iconClassName?: string;
  variant?: 'rounded-full' | 'rounded-xl';
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  isActive = false,
  onClick,
  title = 'Filter',
  ariaLabel = 'Filter',
  isLight = false,
  badge = false,
  className,
  iconClassName = 'w-4 h-4',
  variant = 'rounded-xl',
}) => {
  const baseClasses = className
    ? className
    : variant === 'rounded-full'
    ? `p-2.5 rounded-full border border-transparent transition-all shrink-0 cursor-pointer ${
        isActive
          ? 'bg-indigo-600 text-white shadow-xs'
          : isLight
          ? 'bg-white text-slate-600 hover:bg-slate-100'
          : 'bg-slate-950/70 text-slate-300 hover:bg-slate-900'
      }`
    : `p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer relative shrink-0 ${
        isActive
          ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400'
          : isLight
          ? 'bg-white border-slate-300/80 text-slate-700 hover:bg-slate-50'
          : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:bg-slate-800'
      }`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={baseClasses}
      title={title}
      aria-label={ariaLabel}
    >
      <FilterIcon className={iconClassName} />
      {badge && (
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600" />
      )}
    </button>
  );
};
