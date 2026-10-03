import React from 'react';
import { X, Globe, GitBranch, Search, Link2 } from 'lucide-react';
import { WebsiteConfig } from '../../services/websiteConfigService';

export type WebsiteSubTab = 'webpages' | 'sitemap' | 'indexing' | 'domain';

interface WebsiteSubNavBoxProps {
  currentSubTab: WebsiteSubTab;
  onSelectSubTab: (subTab: WebsiteSubTab) => void;
  pagesCount?: number;
  config?: WebsiteConfig;
  uiTheme: 'dark' | 'light';
  onClose?: () => void;
  isMobile?: boolean;
}

interface NavItem {
  id: WebsiteSubTab;
  label: string;
  icon: React.ElementType;
}

const SUB_NAV_ITEMS: NavItem[] = [
  { id: 'webpages', label: 'Webpages', icon: Globe },
  { id: 'sitemap', label: 'Sitemap', icon: GitBranch },
  { id: 'indexing', label: 'Indexing', icon: Search },
  { id: 'domain', label: 'Domain', icon: Link2 },
];

export const WebsiteSubNavBox: React.FC<WebsiteSubNavBoxProps> = ({
  currentSubTab,
  onSelectSubTab,
  uiTheme,
  onClose,
  isMobile = false,
}) => {
  const isLight = uiTheme === 'light';

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
              Website
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
          {SUB_NAV_ITEMS.map((item) => {
            const isActive = currentSubTab === item.id;
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
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
