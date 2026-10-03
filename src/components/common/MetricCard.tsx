import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  progress?: {
    percent: number;
    color?: string;
  };
  isLight?: boolean;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  iconColor = 'text-indigo-500',
  progress,
  isLight = false,
  className = '',
}) => {
  return (
    <div className={`p-5 rounded-2xl border ${
      isLight ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-900 border-slate-800'
    } ${className}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${
          isLight ? 'text-slate-500' : 'text-slate-400'
        }`}>
          {title}
        </span>
        {Icon && <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />}
      </div>

      <div className={`text-2xl font-bold tracking-tight ${
        isLight ? 'text-slate-900' : 'text-white'
      }`}>
        {value}
      </div>

      {description && (
        <p className={`text-xs mt-1 ${
          isLight ? 'text-slate-500' : 'text-slate-400'
        }`}>
          {description}
        </p>
      )}

      {progress && (
        <div className="mt-4">
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${
            isLight ? 'bg-slate-100' : 'bg-slate-800'
          }`}>
            <div 
              className={`h-full rounded-full transition-all duration-500 ${progress.color || 'bg-indigo-600'}`}
              style={{ width: `${Math.min(100, Math.max(0, progress.percent))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
