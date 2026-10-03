import React from 'react';

export interface TabItem<T extends string = string> {
  id: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  variant?: 'underline' | 'pills' | 'segmented';
  isLight?: boolean;
  className?: string;
  tabClassName?: string;
  size?: 'sm' | 'md';
}

export function Tabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  isLight = false,
  className = '',
  tabClassName = '',
  size = 'md',
}: TabsProps<T>) {
  if (variant === 'segmented') {
    return (
      <div
        className={`flex items-center p-1 rounded-xl border ${
          isLight
            ? 'bg-slate-100 border-slate-200 text-slate-700'
            : 'bg-slate-950 border-slate-800 text-slate-300'
        } ${className}`}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
                isActive
                  ? isLight
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'bg-slate-800 text-white shadow-xs'
                  : isLight
                  ? 'text-slate-500 hover:text-slate-900'
                  : 'text-slate-400 hover:text-white'
              } ${tab.disabled ? 'opacity-40 cursor-not-allowed' : ''} ${tabClassName}`}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && <span className="shrink-0">{tab.badge}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'pills') {
    return (
      <div
        className={`flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className}`}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer select-none ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isLight
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              } ${tab.disabled ? 'opacity-40 cursor-not-allowed' : ''} ${tabClassName}`}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && <span className="shrink-0">{tab.badge}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1 sm:gap-2 border-b overflow-x-auto overflow-y-hidden shrink-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
        isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900'
      } ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const paddingClass = size === 'sm' ? 'px-3 py-2 text-xs' : 'px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm';
        return (
          <button
            key={tab.id}
            type="button"
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 font-semibold border-b-2 whitespace-nowrap transition-all shrink-0 cursor-pointer select-none ${paddingClass} ${
              isActive
                ? 'border-indigo-600 text-indigo-600'
                : isLight
                ? 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            } ${tab.disabled ? 'opacity-40 cursor-not-allowed' : ''} ${tabClassName}`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge && <span className="shrink-0">{tab.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}
