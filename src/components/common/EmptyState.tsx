import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: LucideIcon;
  actionIconPosition?: 'left' | 'right';
  isLight?: boolean;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon,
  actionIconPosition = 'right',
  isLight = false,
  className = '',
}) => {
  const isRightIcon = actionIconPosition === 'right';

  return (
    <div
      className={`p-12 rounded-xl border border-dashed text-center flex flex-col items-center justify-center ${
        isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-slate-900/30 border-slate-800'
      } ${className}`}
    >
      <Icon className="w-8 h-8 text-slate-400 opacity-60 mb-2" />
      <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 px-4.5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer shadow-xs min-h-[38px]"
        >
          {!isRightIcon && ActionIcon && (
            <ActionIcon className="w-3.5 h-3.5 shrink-0 inline-block align-middle" />
          )}
          <span className="inline-block align-middle">{actionLabel}</span>
          {isRightIcon && ActionIcon && (
            <ActionIcon className="w-3.5 h-3.5 shrink-0 inline-block align-middle" />
          )}
        </button>
      )}
    </div>
  );
};
