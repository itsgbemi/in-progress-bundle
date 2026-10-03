import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { WebsitePage } from '../../../types';
import { StoredMediaFile } from '../../../services/storageService';
import { WebsiteConfig, getEffectiveDomainDisplay, getEffectiveDomainUrl } from '../../../services/websiteConfigService';
import { WebsiteSubTab } from '../WebsiteSubNavBox';
import { EmptyState } from '../../common/EmptyState';
import {
  Globe,
  Pencil,
  ExternalLink,
  ShieldCheck,
  Lock,
  ArrowUpRight,
  RefreshCw,
  FileText,
  Activity,
  ArrowRight
} from 'lucide-react';

interface OverviewViewProps {
  pages: WebsitePage[];
  mediaFiles: StoredMediaFile[];
  onOpenPageInEditor: (pageId: string) => void;
  onNavigateTab: (tabId: string) => void;
  onNavigateToWebsiteSubTab?: (subTab: WebsiteSubTab) => void;
  config: WebsiteConfig;
  uiTheme: 'dark' | 'light';
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  pages,
  mediaFiles: _mediaFiles,
  onOpenPageInEditor,
  onNavigateTab,
  onNavigateToWebsiteSubTab,
  config,
  uiTheme,
}) => {
  const { user } = useAuth();
  const isLight = uiTheme === 'light';

  const [iframeKey, setIframeKey] = useState<number>(0);

  const effectiveDisplay = getEffectiveDomainDisplay(config);
  const effectiveUrl = getEffectiveDomainUrl(config);
  const hasDomain = effectiveUrl && effectiveUrl !== '#';

  const handleNavigateSubTab = (subTab: WebsiteSubTab) => {
    if (onNavigateToWebsiteSubTab) {
      onNavigateToWebsiteSubTab(subTab);
    } else {
      onNavigateTab('websites');
    }
  };

  const handleVisitSite = () => {
    if (hasDomain) {
      window.open(effectiveUrl, '_blank', 'noopener,noreferrer');
    } else {
      handleNavigateSubTab('domain');
    }
  };

  const handleEditSite = () => {
    if (pages.length > 0) {
      onOpenPageInEditor(pages[0].id);
    } else {
      handleNavigateSubTab('webpages');
    }
  };

  const handleReloadSnapshot = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Overview
          </h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-6">
        <div className={`flex-1 w-full min-w-0 p-5 rounded-2xl border space-y-3 ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className={`rounded-xl border overflow-hidden transition-all ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className={`px-3.5 py-2.5 border-b flex items-center justify-between gap-3 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              </div>

              <div className={`flex-1 max-w-md mx-auto px-3.5 py-1 rounded-lg border flex items-center gap-2 text-xs font-mono justify-center ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-200'
              }`}>
                <Lock className={`w-3 h-3 shrink-0 ${hasDomain ? 'text-emerald-500' : 'text-slate-400'}`} />
                <span className="text-slate-400 select-none text-[11px]">https://</span>
                <span className="truncate font-medium text-slate-800 dark:text-slate-100">{effectiveDisplay}</span>
              </div>
            </div>

            <div className="w-full h-[430px] bg-white dark:bg-slate-950 relative overflow-hidden">
              {hasDomain ? (
                <iframe
                  key={iframeKey}
                  title="Live Domain Snapshot"
                  src={effectiveUrl}
                  className="w-full h-full border-0 pointer-events-auto select-none"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              ) : (
                <EmptyState
                  icon={Globe}
                  title="Domain Not Configured"
                  description="Connect your custom domain or site address to enable the live website preview."
                  actionLabel="Connect Custom Domain"
                  onAction={() => handleNavigateSubTab('domain')}
                  actionIcon={ArrowUpRight}
                  actionIconPosition="right"
                  isLight={isLight}
                  className="w-full h-full border-none bg-transparent rounded-none flex items-center justify-center"
                />
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-1 px-1">
            {hasDomain ? (
              <button
                onClick={handleVisitSite}
                className="bg-transparent text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 underline decoration-dotted decoration-slate-400 dark:decoration-slate-500 hover:decoration-indigo-600 dark:hover:decoration-indigo-400 underline-offset-[3px] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>Visit website</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            ) : (
              <button
                onClick={() => handleNavigateSubTab('domain')}
                className="bg-transparent text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 underline decoration-dotted decoration-slate-400 dark:decoration-slate-500 hover:decoration-indigo-600 dark:hover:decoration-indigo-400 underline-offset-[3px] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>Attach domain</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            )}

            {hasDomain && (
              <button
                onClick={handleReloadSnapshot}
                className="bg-transparent text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 underline decoration-dotted decoration-slate-400 dark:decoration-slate-500 hover:decoration-indigo-600 dark:hover:decoration-indigo-400 underline-offset-[3px] inline-flex items-center cursor-pointer transition-colors"
              >
                <span>Refresh snapshot</span>
              </button>
            )}
          </div>
        </div>

        <div className={`w-full lg:w-80 xl:w-88 shrink-0 p-5 rounded-2xl border space-y-3 ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="border-b pb-3 border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Quick Actions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Direct shortcuts to manage and build.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleVisitSite}
              className={`w-full p-3 rounded-xl border text-left transition-colors group cursor-pointer flex items-center justify-between gap-3 ${
                isLight
                  ? 'bg-slate-50 hover:bg-indigo-50/70 border-slate-200/80 hover:border-indigo-200'
                  : 'bg-slate-800/40 hover:bg-slate-800 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-center shrink-0 transition-colors">
                  <Globe className="w-4 h-4 text-inherit" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                    Visit Live Site
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">
                    {effectiveDisplay}
                  </p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />
            </button>

            <button
              onClick={handleEditSite}
              className={`w-full p-3 rounded-xl border text-left transition-colors group cursor-pointer flex items-center justify-between gap-3 ${
                isLight
                  ? 'bg-slate-50 hover:bg-indigo-50/70 border-slate-200/80 hover:border-indigo-200'
                  : 'bg-slate-800/40 hover:bg-slate-800 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-center shrink-0 transition-colors">
                  <Pencil className="w-4 h-4 text-inherit" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                    Edit Site
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    Launch visual page editor
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />
            </button>

            <button
              onClick={() => handleNavigateSubTab('domain')}
              className={`w-full p-3 rounded-xl border text-left transition-colors group cursor-pointer flex items-center justify-between gap-3 ${
                isLight
                  ? 'bg-slate-50 hover:bg-indigo-50/70 border-slate-200/80 hover:border-indigo-200'
                  : 'bg-slate-800/40 hover:bg-slate-800 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-center shrink-0 transition-colors">
                  <ShieldCheck className="w-4 h-4 text-inherit" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                    Attached Domains
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    Registrars, DNS & management
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />
            </button>

            <button
              onClick={() => handleNavigateSubTab('sitemap')}
              className={`w-full p-3 rounded-xl border text-left transition-colors group cursor-pointer flex items-center justify-between gap-3 ${
                isLight
                  ? 'bg-slate-50 hover:bg-indigo-50/70 border-slate-200/80 hover:border-indigo-200'
                  : 'bg-slate-800/40 hover:bg-slate-800 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-center shrink-0 transition-colors">
                  <FileText className="w-4 h-4 text-inherit" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                    Sitemap & SEO
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    XML sitemap & robots.txt
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
