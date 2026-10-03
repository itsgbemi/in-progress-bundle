import React, { useState } from 'react';
import { WebsitePage } from '../../../../types';
import { WebsiteSubTab } from '../../WebsiteSubNavBox';
import {
  WebsiteConfig,
  SitemapConfig,
  getEffectiveDomainUrl,
  saveWebsiteConfig,
  isDomainConfigured,
  generateSitemapXml
} from '../../../../services/websiteConfigService';
import {
  Copy,
  Check,
  Download,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Github,
  Edit2,
  Info,
  X,
  Clock,
  Globe,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { EmptyState } from '../../../common/EmptyState';

const GUIDE_CONTENT = [
  {
    title: "What is a Sitemap?",
    content: "A sitemap is a file where you provide information about the pages, videos, and other files on your site, and the relationships between them. Search engines like Google read this file to more intelligently crawl your site."
  },
  {
    title: "Change Frequency",
    content: "This tells search engines how often the content on a particular URL is likely to change. 'Weekly' is standard for most websites, while 'Daily' is better for news sites or frequently updated blogs."
  },
  {
    title: "Priority",
    content: "The priority of a URL relative to other URLs on your site. Valid values range from 0.0 to 1.0. This value does not affect how your pages are compared to pages on other sites—it only lets search engines know which pages you deem most important for the crawlers."
  },
  {
    title: "Why do I need this?",
    content: "Sitemaps help search engines find all the pages on your site, especially if your site is very large, has pages that aren't well-linked, or is new and doesn't have many external links yet."
  }
];

interface SitemapSubViewProps {
  pages: WebsitePage[];
  config: WebsiteConfig;
  onUpdateConfig: (config: WebsiteConfig) => void;
  uiTheme: 'dark' | 'light';
  onNavigateSubTab?: (subTab: WebsiteSubTab) => void;
}

export const SitemapSubView: React.FC<SitemapSubViewProps> = ({
  pages,
  config,
  onUpdateConfig,
  uiTheme,
  onNavigateSubTab
}) => {
  const isLight = uiTheme === 'light';
  const baseUrl = getEffectiveDomainUrl(config);
  const domainActive = isDomainConfigured(config);

  const [copiedXml, setCopiedXml] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isEditingFrequency, setIsEditingFrequency] = useState(false);
  const [newCustomPath, setNewCustomPath] = useState('');
  const [customPriority, setCustomPriority] = useState('0.8');

  const xmlContent = generateSitemapXml(pages, config);

  const handleUpdateFrequency = (freq: SitemapConfig['changeFrequency']) => {
    const updated: WebsiteConfig = {
      ...config,
      sitemap: {
        ...config.sitemap,
        changeFrequency: freq
      }
    };
    onUpdateConfig(updated);
    saveWebsiteConfig(updated);
    setIsEditingFrequency(false);
  };

  const handleCopyXml = () => {
    navigator.clipboard.writeText(xmlContent);
    setCopiedXml(true);
    setTimeout(() => setCopiedXml(false), 2500);
  };

  const handleDownloadXml = () => {
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleAddCustomPath = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomPath.trim()) return;

    const formatted = newCustomPath.trim().startsWith('/') ? newCustomPath.trim() : `/${newCustomPath.trim()}`;
    const today = new Date().toISOString().split('T')[0];

    const updated: WebsiteConfig = {
      ...config,
      sitemap: {
        ...config.sitemap,
        customPaths: [
          ...(config.sitemap.customPaths || []),
          {
            path: formatted,
            priority: parseFloat(customPriority) || 0.8,
            changefreq: 'weekly',
            lastmod: today,
          }
        ]
      }
    };

    onUpdateConfig(updated);
    saveWebsiteConfig(updated);
    setNewCustomPath('');
  };

  const handleRemoveCustomPath = (index: number) => {
    const updatedPaths = [...(config.sitemap.customPaths || [])];
    updatedPaths.splice(index, 1);
    const updated: WebsiteConfig = {
      ...config,
      sitemap: {
        ...config.sitemap,
        customPaths: updatedPaths,
      }
    };
    onUpdateConfig(updated);
    saveWebsiteConfig(updated);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {showGuideModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowGuideModal(false)}
          />
          <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 ${
            isLight ? 'bg-white' : 'bg-slate-900 border border-slate-800'
          }`}>
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white">Sitemap Guide</h3>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[48vh] no-scrollbar">
              {GUIDE_CONTENT.map((item, i) => (
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
                onClick={() => setShowGuideModal(false)}
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
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">Sitemap</h2>
            {domainActive && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3" />
                Included in GitHub Deployment (/sitemap.xml)
              </span>
            )}
          </div>
        </div>

        {domainActive && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyXml}
              className={`px-4 py-2.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer min-h-[38px] ${
                isLight
                  ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              {copiedXml ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copiedXml ? 'Copied' : 'Copy XML'}</span>
            </button>
            <button
              onClick={handleDownloadXml}
              className="px-4.5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs min-h-[38px]"
            >
              {downloadSuccess ? <Check className="w-3 h-3" /> : <Download className="w-3 h-3" />}
              <span>{downloadSuccess ? 'Downloaded' : 'Download sitemap.xml'}</span>
            </button>
          </div>
        )}
      </div>

      {domainActive ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className={`lg:col-span-5 p-5 rounded-xl border space-y-3 flex flex-col justify-between ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  XML Preview
                </h3>
                <button
                  onClick={handleCopyXml}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer"
                >
                  Copy
                </button>
              </div>

              <div className={`p-3.5 rounded-lg font-sans text-[11px] overflow-auto max-h-80 leading-relaxed border ${
                isLight ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-slate-950 text-slate-300 border-slate-800'
              }`}>
                <pre className="whitespace-pre-wrap">{xmlContent}</pre>
              </div>
            </div>

            <div className={`lg:col-span-7 p-5 rounded-xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Sitemap URLs ({pages.length + (config.sitemap.customPaths?.length || 0)})
                    </h3>
                    {!isEditingFrequency ? (
                      <button
                        onClick={() => setIsEditingFrequency(true)}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer"
                        title="Change Frequency"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <select
                          value={config.sitemap.changeFrequency}
                          onChange={(e) => handleUpdateFrequency(e.target.value as any)}
                          className={`px-2 py-1 rounded border text-[10px] outline-none ${
                            isLight ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700 text-white'
                          }`}
                          autoFocus
                        >
                          <option value="always">Always</option>
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                        <button
                          onClick={() => setIsEditingFrequency(false)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowGuideModal(true)}
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mt-0.5 cursor-pointer"
                  >
                    <Info className="w-2.5 h-2.5" />
                    <span>How do sitemaps work? View Guide</span>
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 font-sans hidden sm:block truncate max-w-[150px]">{baseUrl}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`border-b text-[10px] uppercase font-semibold text-slate-400 ${
                    isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-slate-800/50 border-slate-800'
                  }`}>
                    <tr>
                      <th className="px-3 py-2">Route</th>
                      <th className="px-3 py-2">Priority</th>
                      <th className="px-3 py-2">Frequency</th>
                      <th className="px-3 py-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans text-[11px]">
                    {pages.map((page, idx) => {
                      const slug = idx === 0 ? '/' : `/${page.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                      const priority = idx === 0 ? '1.0' : '0.8';
                      return (
                        <tr key={page.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="px-3 py-2.5">
                            <div className="font-bold text-slate-800 dark:text-slate-200">{slug}</div>
                            <div className="text-[10px] text-slate-400">{page.title}</div>
                          </td>
                          <td className="px-3 py-2.5 text-indigo-600 dark:text-indigo-400 font-bold">{priority}</td>
                          <td className="px-3 py-2.5 text-slate-500">{config.sitemap.changeFrequency}</td>
                          <td className="px-3 py-2.5 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              Active
                            </span>
                          </td>
                        </tr>
                      );
                    })}

                    {(config.sitemap.customPaths || []).map((cp, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-3 py-2.5">
                          <div className="font-bold text-slate-800 dark:text-slate-200">{cp.path}</div>
                          <div className="text-[10px] text-slate-400">Custom route</div>
                        </td>
                        <td className="px-3 py-2.5 text-indigo-600 dark:text-indigo-400 font-bold">{cp.priority}</td>
                        <td className="px-3 py-2.5 text-slate-500">{cp.changefreq}</td>
                        <td className="px-3 py-2.5 text-right">
                          <button
                            onClick={() => handleRemoveCustomPath(idx)}
                            className="p-1 rounded text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                            title="Delete path"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          icon={Globe}
          title="Custom Domain Required"
          description="Sitemaps require an absolute canonical URL to be valid. Please connect a custom domain first to enable sitemap generation and automated SEO features."
          actionLabel={onNavigateSubTab ? "Configure Domain" : undefined}
          onAction={onNavigateSubTab ? () => onNavigateSubTab('domain') : undefined}
          actionIcon={ArrowRight}
          isLight={isLight}
        />
      )}
    </div>
  );
};
