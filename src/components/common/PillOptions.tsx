import React from 'react';

interface PillOption {
  id: string;
  label: string;
}

export interface PillOptionsProps {
  options: PillOption[];
  value: string;
  onChange: (id: string) => void;
  isLight?: boolean;
  gridCols?: number;
  scrollable?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const gridColsMap: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
};

export const PillOptions: React.FC<PillOptionsProps> = ({
  options,
  value,
  onChange,
  isLight = false,
  gridCols,
  scrollable = false,
  fullWidth = false,
  className = '',
}) => {
  const colClass = gridCols ? (gridColsMap[gridCols] || 'grid-cols-3') : '';

  const layoutClass = scrollable
    ? `${fullWidth ? 'flex w-full' : 'inline-flex w-fit'} max-w-full overflow-x-auto no-scrollbar flex-nowrap`
    : fullWidth
    ? `grid w-full ${colClass || 'grid-cols-3'}`
    : `inline-grid w-fit ${colClass || 'grid-cols-3'}`;

  return (
    <div
      className={`${layoutClass} gap-1 p-1 rounded-xl border ${
        isLight
          ? 'bg-slate-100 border-slate-200 text-slate-700'
          : 'bg-slate-950 border-slate-800 text-slate-300'
      } ${className}`}
    >
      {options.map((option) => {
        const isActive = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`flex items-center justify-center py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
              scrollable ? 'shrink-0 whitespace-nowrap px-4' : ''
            } ${
              isActive
                ? isLight
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'bg-slate-800 text-white shadow-xs'
                : isLight
                ? 'text-slate-500 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
