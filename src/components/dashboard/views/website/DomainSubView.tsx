import React, { useState } from 'react';
import {
  WebsiteConfig,
  saveWebsiteConfig,
  AttachedDomain,
  getEffectiveDomainDisplay,
  getEffectiveDomainUrl,
  generateRobotsTxtContent,
  generateSitemapXml
} from '../../../../services/websiteConfigService';
import { syncSeoFilesToGitHub } from '../../../../services/githubService';
import {
  Globe,
  ExternalLink,
  CheckCircle2,
  Trash2,
  Save,
  X,
  Link,
  Edit2,
  ArrowUpRight,
  Plus,
  Settings
} from 'lucide-react';
import { EmptyState } from '../../../common/EmptyState';
import { Input, DashboardViewHeader, AlertBanner } from '../../../common';

interface DomainSubViewProps {
  config: WebsiteConfig;
  onUpdateConfig: (config: WebsiteConfig) => void;
  uiTheme: 'dark' | 'light';
}

export const DomainSubView: React.FC<DomainSubViewProps> = ({ config, onUpdateConfig, uiTheme }) => {
  const isLight = uiTheme === 'light';

  const attachedDomains: AttachedDomain[] = config.domain.attachedDomains || [];
  const primaryDomain = attachedDomains[0]?.domain || config.domain.customDomain || '';
  const primaryManageUrl = attachedDomains[0]?.manageUrl || '';

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDefault, setIsEditingDefault] = useState(false);
  const [domainInput, setDomainInput] = useState(primaryDomain);
  const [defaultDomainInput, setDefaultDomainInput] = useState(config.hosting.vercelDeployment.deploymentUrl || '');
  const [defaultManageUrlInput, setDefaultManageUrlInput] = useState(config.hosting.vercelDeployment.manageUrl || '');
  const [manageUrlInput, setManageUrlInput] = useState(primaryManageUrl);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleStartEdit = () => {
    setDomainInput(primaryDomain);
    setManageUrlInput(primaryManageUrl);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setDomainInput(primaryDomain);
    setManageUrlInput(primaryManageUrl);
    setIsEditing(false);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const cleanedDomain = domainInput
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '');

    const cleanedManageUrl = manageUrlInput.trim();

    let updatedDomains: AttachedDomain[] = [];

    if (cleanedDomain) {
      updatedDomains = [
        {
          id: attachedDomains[0]?.id || `dom_${Date.now()}`,
          domain: cleanedDomain,
          manageUrl: cleanedManageUrl,
          isPrimary: true,
          createdAt: attachedDomains[0]?.createdAt || new Date().toISOString(),
        },
      ];
    }

    const updatedConfig: WebsiteConfig = {
      ...config,
      domain: {
        ...config.domain,
        attachedDomains: updatedDomains,
        customDomain: cleanedDomain,
        isCustomDomainActive: Boolean(cleanedDomain),
        updatedAt: new Date().toISOString(),
      },
    };

    onUpdateConfig(updatedConfig);
    saveWebsiteConfig(updatedConfig);
    setIsEditing(false);
    showToast(cleanedDomain ? 'Domain information updated successfully.' : 'Domain cleared.');

    if (cleanedDomain) {
      const crawlReq = updatedConfig.indexing?.crawlRequirement || (updatedConfig.indexing?.robotsDirectives?.noIndex ? 'disallow' : 'allow');
      if (crawlReq && crawlReq !== 'not_selected') {
        const robotsTxt = generateRobotsTxtContent(crawlReq, updatedConfig);
        const sitemapXml = generateSitemapXml([], updatedConfig);
        syncSeoFilesToGitHub({
          robotsTxt,
          sitemapXml,
          pushSitemap: true,
        }).catch((err) => {
          console.warn('Auto-sync SEO files to GitHub upon domain save:', err);
        });
      }
    }
  };

  const handleStartEditDefault = () => {
    setDefaultDomainInput(config.hosting.vercelDeployment.deploymentUrl || '');
    setDefaultManageUrlInput(config.hosting.vercelDeployment.manageUrl || '');
    setIsEditingDefault(true);
  };

  const handleSaveDefault = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const cleaned = defaultDomainInput
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '');

    const cleanedManageUrl = defaultManageUrlInput.trim();

    const updatedConfig: WebsiteConfig = {
      ...config,
      hosting: {
        ...config.hosting,
        vercelDeployment: {
          ...config.hosting.vercelDeployment,
          deploymentUrl: cleaned,
          manageUrl: cleanedManageUrl,
        },
      },
    };

    onUpdateConfig(updatedConfig);
    saveWebsiteConfig(updatedConfig);
    setIsEditingDefault(false);
    showToast(cleaned ? 'Default domain updated.' : 'Default domain cleared.');
  };

  const handleDelete = () => {
    const updatedConfig: WebsiteConfig = {
      ...config,
      domain: {
        ...config.domain,
        attachedDomains: [],
        customDomain: '',
        isCustomDomainActive: false,
        updatedAt: new Date().toISOString(),
      },
    };

    setDomainInput('');
    setManageUrlInput('');
    onUpdateConfig(updatedConfig);
    saveWebsiteConfig(updatedConfig);
    setIsEditing(false);
    showToast('Domain removed.');
  };

  const hasDomain = Boolean(primaryDomain);
  const hasDefaultDomain = Boolean(config.hosting.vercelDeployment.deploymentUrl);
  const effectiveUrl = hasDomain ? (primaryDomain.startsWith('http') ? primaryDomain : `https://${primaryDomain}`) : '';
  const effectiveManageUrl = primaryManageUrl ? (primaryManageUrl.startsWith('http') ? primaryManageUrl : `https://${primaryManageUrl}`) : '';

  return (
    <div className="space-y-10 max-w-4xl">
      {successMessage && (
        <AlertBanner
          message={successMessage}
          type="success"
          isLight={isLight}
          onDismiss={() => setSuccessMessage(null)}
        />
      )}

      <DashboardViewHeader
        title="Domains"
        description="Manage your default system domain and custom branded domains."
        isLight={isLight}
      />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Default Domain</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              The free subdomain provisioned by the hosting service (.netlify.app, .vercel.app, .pages.dev, .run.app etc).
            </p>
          </div>
          {!isEditingDefault && hasDefaultDomain && (
            <button
              onClick={handleStartEditDefault}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs min-h-[36px]"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Update</span>
            </button>
          )}
        </div>

        {isEditingDefault && (
          <form
            onSubmit={handleSaveDefault}
            className={`p-6 rounded-xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <Input
              label="Default Domain URL"
              type="text"
              autoFocus
              value={defaultDomainInput}
              onChange={(e) => setDefaultDomainInput(e.target.value)}
              placeholder="e.g. site-name.vercel.app"
              icon={<Globe className="w-4 h-4" />}
              variant="rounded"
              isLight={isLight}
              className="font-mono"
            />
            <Input
              label="Link to Manage Domain (Optional)"
              type="url"
              value={defaultManageUrlInput}
              onChange={(e) => setDefaultManageUrlInput(e.target.value)}
              placeholder="e.g. https://vercel.com/dashboard/settings/domains"
              icon={<Link className="w-4 h-4" />}
              variant="rounded"
              isLight={isLight}
            />
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditingDefault(false)}
                className={`px-3.5 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                  isLight ? 'hover:bg-slate-100 border-slate-200 text-slate-700' : 'hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </form>
        )}

        {!isEditingDefault && (
          config.hosting.vercelDeployment.deploymentUrl ? (
            <div className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {config.hosting.vercelDeployment.deploymentUrl}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">System-assigned deployment address</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://${config.hosting.vercelDeployment.deploymentUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Visit Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                {config.hosting.vercelDeployment.manageUrl && (
                  <a
                    href={config.hosting.vercelDeployment.manageUrl.startsWith('http') ? config.hosting.vercelDeployment.manageUrl : `https://${config.hosting.vercelDeployment.manageUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Manage</span>
                    <Settings className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={handleStartEditDefault}
                  className={`p-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                    isLight
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                  }`}
                  title="Edit Default Domain Settings"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Globe}
              title="No Default Domain Found"
              description="Your site hasn't been assigned a default system domain yet. This usually happens after your first successful deployment."
              actionLabel="Add"
              onAction={handleStartEditDefault}
              actionIcon={Plus}
              isLight={isLight}
            />
          )
        )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Custom Domain</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              If you choose to buy and connect a custom domain (.com etc).
            </p>
          </div>
          {!isEditing && hasDomain && (
            <button
              onClick={handleStartEdit}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs min-h-[36px]"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Update</span>
            </button>
          )}
        </div>

        {!isEditing && !hasDomain && (
          <EmptyState
            icon={Link}
            title="No Custom Domain Connected"
            description="Personalize your site by connecting a custom domain you already own."
            actionLabel="Add"
            onAction={handleStartEdit}
            actionIcon={Plus}
            isLight={isLight}
          />
        )}

        {!isEditing && hasDomain && (
          <div className={`p-6 rounded-xl border space-y-6 ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-500" />
                  Custom Domain
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <a
                      href={effectiveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 transition-colors"
                    >
                      <span>{primaryDomain}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <Link className="w-3.5 h-3.5 text-indigo-500" />
                  Management Link
                </span>
                <div>
                  {effectiveManageUrl ? (
                    <a
                      href={effectiveManageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 truncate max-w-xs"
                    >
                      <span className="truncate">{primaryManageUrl}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No management link added</p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {effectiveManageUrl ? (
                <a
                  href={effectiveManageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Manage Domain</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDelete}
                  className="px-3 py-2 rounded-lg border border-transparent hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>

                <button
                  onClick={handleStartEdit}
                  className={`px-4 py-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isLight
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                  }`}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {isEditing && (
          <form
            onSubmit={handleSave}
            className={`p-6 rounded-xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <Input
              label="Custom Domain Name"
              type="text"
              autoFocus
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="e.g. yourdomain.com"
              icon={<Globe className="w-4 h-4" />}
              variant="rounded"
              isLight={isLight}
              className="font-mono"
            />

            <Input
              label="Link to Manage Domain (Optional)"
              type="url"
              value={manageUrlInput}
              onChange={(e) => setManageUrlInput(e.target.value)}
              placeholder="e.g. https://dash.cloudflare.com or registrar DNS portal URL"
              icon={<Link className="w-4 h-4" />}
              variant="rounded"
              isLight={isLight}
            />

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className={`px-3.5 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                  isLight ? 'hover:bg-slate-100 border-slate-200 text-slate-700' : 'hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
