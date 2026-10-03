import React, { useState } from 'react';
import { WebsitePage } from '../../../../types';
import {
  WebsiteConfig,
  saveWebsiteConfig,
  isDomainConfigured,
  getConfiguredDomain,
  generateRobotsTxtContent,
  generateSitemapXml
} from '../../../../services/websiteConfigService';
import { syncSeoFilesToGitHub } from '../../../../services/githubService';
import { EmptyState } from '../../../common/EmptyState';
import {
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Download,
  ArrowRight,
  Github,
  Info,
  X,
  Globe
} from 'lucide-react';

const ROBOT_GUIDE_CONTENT = [
  {
    title: "What is Robots.txt?",
    content: "Robots.txt is a file that tells search engine crawlers which pages or files the crawler can or can't request from your site. This is used mainly to avoid overloading your site with requests."
  },
  {
    title: "Why allow crawling?",
    content: "If you want your website to appear in search results (like Google or Bing), you must allow robots to crawl your site. This is the default and recommended setting for live websites."
  },
  {
    title: "When to block crawling?",
    content: "You might want to block crawling for private staging areas, internal tools, or websites that are still under heavy development and not ready for the public eye."
  },
  {
    title: "How it works",
    content: "When 'Allow' is enabled, we generate a robots.txt file with 'Allow: /'. When disabled, we use 'Disallow: /'. We also automatically push this file to your GitHub repository root if a domain is configured."
  }
];

interface IndexingProps {
  pages: WebsitePage[];
  config: WebsiteConfig;
  onUpdateConfig: (config: WebsiteConfig) => void;
  uiTheme: 'dark' | 'light';
  onNavigateSubTab?: (subTab: 'webpages' | 'sitemap' | 'indexing' | 'domain' | 'hosting') => void;
}

export const Indexing: React.FC<IndexingProps> = ({
  pages,
  config,
  onUpdateConfig,
  uiTheme,
  onNavigateSubTab
}) => {
  const isLight = uiTheme === 'light';
  const indexing = config.indexing;
  const domainConfigured = isDomainConfigured(config);
  const domainDisplay = getConfiguredDomain(config);

  const currentCrawlPref: 'allow' | 'disallow' =
    (indexing.crawlRequirement === 'allow' || indexing.crawlRequirement === 'disallow')
      ? indexing.crawlRequirement
      : (indexing.robotsDirectives?.noIndex ? 'disallow' : 'allow');

  const [crawlPref, setCrawlPref] = useState<'allow' | 'disallow'>(currentCrawlPref);
  const [isSyncingGitHub, setIsSyncingGitHub] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [copiedRobots, setCopiedRobots] = useState(false);
  const [showRobotGuideModal, setShowRobotGuideModal] = useState(false);

  const robotsTxtContent = generateRobotsTxtContent(crawlPref, config);

  const handleSelectCrawlPref = async (newPref: 'allow' | 'disallow') => {
    setCrawlPref(newPref);

    const updatedRobotsDirectives = {
      ...indexing.robotsDirectives,
      allowAll: newPref === 'allow',
      noIndex: newPref === 'disallow',
      customRobotsTxt: generateRobotsTxtContent(newPref, config),
    };

    const updatedConfig: WebsiteConfig = {
      ...config,
      indexing: {
        ...config.indexing,
        crawlRequirement: newPref,
        robotsDirectives: updatedRobotsDirectives,
      },
    };

    onUpdateConfig(updatedConfig);
    saveWebsiteConfig(updatedConfig);

    if (domainConfigured) {
      await triggerGitHubPush(newPref, updatedConfig);
    } else {
      setSyncStatusMsg({
        type: 'info',
        text: `Crawl preference set to "${newPref === 'allow' ? 'Allow Robots' : 'Block Robots'}". Configure your domain to automatically push robots.txt & sitemap to GitHub root.`
      });
      setTimeout(() => setSyncStatusMsg(null), 6000);
    }
  };

  const triggerGitHubPush = async (pref: 'allow' | 'disallow', targetConfig: WebsiteConfig) => {
    setIsSyncingGitHub(true);
    setSyncStatusMsg(null);

    const generatedRobots = generateRobotsTxtContent(pref, targetConfig);
    const generatedSitemap = domainConfigured ? generateSitemapXml(pages, targetConfig) : undefined;

    try {
      const result = await syncSeoFilesToGitHub({
        robotsTxt: generatedRobots,
        sitemapXml: generatedSitemap,
        pushSitemap: domainConfigured,
        repoOwner: targetConfig.hosting?.githubRepo?.split('/')[0],
        repoName: targetConfig.hosting?.githubRepo?.split('/')[1] || targetConfig.hosting?.githubRepo,
        branch: targetConfig.hosting?.githubBranch || 'main',
      });

      const now = new Date().toISOString();
      const updatedConfigWithSync: WebsiteConfig = {
        ...targetConfig,
        indexing: {
          ...targetConfig.indexing,
          lastRobotsSync: {
            syncedAt: now,
            status: 'success',
            commitSha: result.commitSha,
            message: result.message,
            pushedFiles: result.pushedFiles,
          },
        },
      };

      onUpdateConfig(updatedConfigWithSync);
      saveWebsiteConfig(updatedConfigWithSync);

      const pushedNames = result.pushedFiles?.join(' and ') || 'robots.txt';
      setSyncStatusMsg({
        type: 'success',
        text: `Successfully pushed ${pushedNames} to the root of your GitHub repository!`
      });
      setTimeout(() => setSyncStatusMsg(null), 5000);
    } catch (err: any) {
      console.error('Error syncing SEO files to GitHub:', err);
      setSyncStatusMsg({
        type: 'error',
        text: err.message || 'Failed to push files to GitHub. Please verify your GITHUB_TOKEN and repository settings.'
      });
    } finally {
      setIsSyncingGitHub(false);
    }
  };

  const handleCopyRobots = () => {
    navigator.clipboard.writeText(robotsTxtContent);
    setCopiedRobots(true);
    setTimeout(() => setCopiedRobots(false), 2500);
  };

  const handleDownloadRobots = () => {
    const blob = new Blob([robotsTxtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const lastSync = indexing.lastRobotsSync;

  return (
    <div className="space-y-6 max-w-5xl">
      {showRobotGuideModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowRobotGuideModal(false)}
          />
          <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 ${
            isLight ? 'bg-white' : 'bg-slate-900 border border-slate-800'
          }`}>
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white">Robots & Crawling Guide</h3>
              <button
                onClick={() => setShowRobotGuideModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[48vh] no-scrollbar">
              {ROBOT_GUIDE_CONTENT.map((item, i) => (
                <div key={i} className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowRobotGuideModal(false)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Search Engine Crawling & Robots
            </h2>
            {domainConfigured && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3" />
                Domain Configured
              </span>
            )}
            {domainConfigured && lastSync?.status === 'success' && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                <Github className="w-3 h-3" />
                Synced to GitHub Root
              </span>
            )}
          </div>
        </div>
      </div>

      {domainConfigured ? (
        <>
          {syncStatusMsg && (
            <div className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2.5 transition-all ${
              syncStatusMsg.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                : syncStatusMsg.type === 'error'
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300'
                  : 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300'
            }`}>
              {syncStatusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : syncStatusMsg.type === 'error' ? (
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              )}
              <span className="flex-1">{syncStatusMsg.text}</span>
            </div>
          )}

          <div className={`p-4 rounded-xl border ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              GitHub Deployment Requirements
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg border bg-emerald-500/5 border-emerald-500/20 dark:bg-emerald-500/10 flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span>Requirement 1: Domain Configuration</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono">
                      {domainDisplay}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Custom domain is configured. Sitemaps and canonical robots.txt directives are enabled.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border bg-emerald-500/5 border-emerald-500/20 dark:bg-emerald-500/10 flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span>Requirement 2: Crawl Preference</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                      crawlPref === 'allow'
                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
                    }`}>
                      {crawlPref === 'allow' ? 'Crawling Allowed' : 'Crawling Blocked'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {crawlPref === 'allow'
                      ? 'Instructs crawlers to index all public website pages.'
                      : 'Instructs crawlers not to crawl or index any website content.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-xl border space-y-5 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Select Robot Crawling Preference
              </h3>
              <button
                type="button"
                onClick={() => setShowRobotGuideModal(true)}
                className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mt-0.5 cursor-pointer"
              >
                <Info className="w-2.5 h-2.5" />
                <span>Learn how crawling works. View Guide</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Allow robots to crawl:
              </span>
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-900 dark:text-slate-100 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="crawlPref"
                    value="allow"
                    checked={crawlPref === 'allow'}
                    onChange={() => handleSelectCrawlPref('allow')}
                    className="w-3.5 h-3.5 text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-600 cursor-pointer"
                  />
                  <span>Yes</span>
                </label>
                <label className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-900 dark:text-slate-100 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="crawlPref"
                    value="disallow"
                    checked={crawlPref === 'disallow'}
                    onChange={() => handleSelectCrawlPref('disallow')}
                    className="w-3.5 h-3.5 text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-600 cursor-pointer"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <pre className={`p-4 rounded-lg font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed border ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-200'
              }`}>
                {robotsTxtContent}
              </pre>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCopyRobots}
                  className="px-2.5 py-1 text-xs rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedRobots ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedRobots ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadRobots}
                  className="px-2.5 py-1 text-xs rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          icon={Globe}
          title="Custom Domain Required"
          description="Search engine indexing and robots.txt directives require a configured domain. Connect a custom domain first to enable crawler indexing preferences and automated SEO deployment."
          actionLabel={onNavigateSubTab ? "Configure Domain" : undefined}
          onAction={onNavigateSubTab ? () => onNavigateSubTab('domain') : undefined}
          actionIcon={ArrowRight}
          isLight={isLight}
        />
      )}
    </div>
  );
};
