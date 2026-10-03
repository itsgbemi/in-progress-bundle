import React from 'react';
import { X, User as UserIcon, Sparkles, SlidersHorizontal } from 'lucide-react';

export type SettingsSubTab = 'account' | 'workspace' | 'preferences' | 'branding';

interface SettingsSubNavBoxProps {
  currentSubTab: SettingsSubTab;
  onSelectSubTab: (subTab: SettingsSubTab) => void;
  uiTheme: 'dark' | 'light';
  onClose?: () => void;
  isMobile?: boolean;
}

interface NavItem {
  id: SettingsSubTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const SettingsSubNavBox: React.FC<SettingsSubNavBoxProps> = ({
  currentSubTab,
  onSelectSubTab,
  uiTheme,
  onClose,
  isMobile = false,
}) => {
  const isLight = uiTheme === 'light';

  const subNavItems: NavItem[] = [
    { id: 'account', label: 'Account', icon: UserIcon },
    { id: 'workspace', label: 'Workspace', icon: Sparkles },
    { id: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
  ];

  return (
    <aside
      className={`h-full flex flex-col justify-between border-r border-slate-200/60 dark:border-slate-800/60 lg:border-r-0 lg:border-transparent shrink-0 transition-all duration-300 ease-in-out bg-transparent ${
        isMobile ? 'w-full' : 'w-44'
      } ${
        isLight
          ? 'text-slate-900'
          : 'text-slate-100'
      }`}
    >
      <div className="flex flex-col flex-1 min-h-0">
        <div className="p-3 pb-2 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2 p-2 min-w-0 flex-1">
            <span className="font-bold text-base text-slate-900 dark:text-white block truncate leading-tight">
              Settings
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <nav className="py-2 overflow-y-auto no-scrollbar flex-1 space-y-1">
          {subNavItems.map((item) => {
            const isActive = currentSubTab === item.id || (item.id === 'workspace' && (currentSubTab as string) === 'branding');
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSubTab(item.id)}
                className={`w-full rounded-none text-xs font-semibold transition-all cursor-pointer relative px-4 py-2.5 flex items-center justify-between border-0 bg-transparent hover:bg-transparent ${
                  isActive
                    ? isLight
                      ? 'text-[var(--brand-primary)] font-bold bg-transparent'
                      : 'text-[var(--brand-accent)] font-bold bg-transparent'
                    : isLight
                    ? 'text-slate-700 hover:text-slate-900 bg-transparent'
                    : 'text-slate-300 hover:text-white bg-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className="w-4 h-4 shrink-0 hidden lg:block" />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-tight shrink-0 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
