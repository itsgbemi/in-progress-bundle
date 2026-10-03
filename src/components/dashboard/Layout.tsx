import React, { useState, useEffect } from 'react';
import { WebsitePage } from '../../types';
import { StoredMediaFile, loadMediaFilesFromStorage, syncCloudinaryResources } from '../../services/storageService';
import { autoPublishWebsitePage } from '../../services/githubService';
import { DashboardSidebar, DashboardTab } from './Sidebar';
import { DashboardNavbar } from './Navbar';
import { OverviewView } from './views/OverviewView';
import { GetStartedView } from './views/GetStartedView';
import { WebsitesView } from './views/WebsitesView';
import { BrandView } from './views/BrandView';
import { MediaStorageView } from './views/MediaStorageView';
import { AccountSettingsView } from './views/AccountSettingsView';
import { InboxView } from './views/InboxView';
import { WebsiteSubNavBox, WebsiteSubTab } from './WebsiteSubNavBox';
import { SettingsSubNavBox, SettingsSubTab } from './SettingsSubNavBox';
import { BrandSubNavBox, BrandSubTab } from './BrandSubNavBox';
import { ReportSubNavBox, ReportSubTab } from './ReportSubNavBox';
import { subscribeToFormsSubmissions, FormSubmission } from '../../services/formsFirebaseService';
import {
  WebsiteConfig,
  loadWebsiteConfig,
  saveWebsiteConfig
} from '../../services/websiteConfigService';
import { getActiveWorkspaceId } from '../../services/workspaceService';
import { isFirestoreQuotaExceeded, resetFirestoreQuotaStatus } from '../../lib/firestoreQuota';
import { getSavedBrandingConfig } from '../../utils/themePreferences';
import { Plus, X, Smartphone, Tablet, Monitor, Loader2, CheckCircle2, AlertCircle, ExternalLink, CloudOff, RefreshCw, ShieldCheck } from 'lucide-react';
import { Canvas } from '../Canvas';
import { useAuth } from '../../context/AuthContext';
import { ScrollArea } from '../common/ScrollArea';

interface DashboardLayoutProps {
  pages: WebsitePage[];
  activePageId: string;
  onSelectPage: (id: string) => void;
  onOpenEditor: () => void;
  onCreatePage: (
    title: string,
    templateType?: string,
    folder?: string,
    fileName?: string,
    description?: string,
    status?: any,
    indexing?: 'index' | 'no-index',
    passwordProtected?: boolean,
    password?: string
  ) => void;
  onDuplicatePage: (pageId: string) => void;
  onDeletePage: (pageId: string) => void;
  onUpdatePageMeta: (
    pageId: string,
    title: string,
    description?: string,
    folder?: string,
    routePath?: string,
    status?: any,
    indexing?: 'index' | 'no-index',
    passwordProtected?: boolean,
    password?: string,
    fileName?: string
  ) => void;
  onApplyPaletteToWebsite?: (primaryColor: string, backgroundColor: string) => void;
  uiTheme: 'dark' | 'light';
  onToggleUiTheme: () => void;
  onSetUiTheme?: (theme: 'dark' | 'light') => void;
  currentTab?: DashboardTab;
  onSelectTab?: (tab: DashboardTab) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  pages,
  activePageId,
  onSelectPage,
  onOpenEditor,
  onCreatePage,
  onDuplicatePage,
  onDeletePage,
  onUpdatePageMeta,
  onApplyPaletteToWebsite,
  uiTheme,
  onToggleUiTheme,
  onSetUiTheme,
  currentTab: externalTab,
  onSelectTab: externalSelectTab,
}) => {
  const [internalTab, setInternalTab] = useState<DashboardTab>('get-started');
  const currentTab = externalTab ?? internalTab;
  const setCurrentTab = externalSelectTab ?? setInternalTab;

  const [websiteSubTab, setWebsiteSubTab] = useState<WebsiteSubTab>('webpages');
  const [settingsSubTab, setSettingsSubTab] = useState<SettingsSubTab>('account');
  const [brandSubTab, setBrandSubTab] = useState<BrandSubTab>('identity');
  const [reportSubTab, setReportSubTab] = useState<ReportSubTab>('overview');
  const [websiteConfig, setWebsiteConfig] = useState<WebsiteConfig>(() => loadWebsiteConfig());

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [previewPage, setPreviewPage] = useState<WebsitePage | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [mediaFiles, setMediaFiles] = useState<StoredMediaFile[]>(() => loadMediaFilesFromStorage());
  const [publishStatus, setPublishStatus] = useState<{
    type: 'loading' | 'success' | 'error';
    message: string;
    commitUrl?: string;
  } | null>(null);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState<boolean>(() => isFirestoreQuotaExceeded());
  const [isQuotaBannerDismissed, setIsQuotaBannerDismissed] = useState<boolean>(false);

  const isLight = uiTheme === 'light';
  const [, setPaletteTick] = useState(0);

  useEffect(() => {
    const handleSyncWebsiteConfig = () => {
      setWebsiteConfig(loadWebsiteConfig());
    };
    window.addEventListener('active_workspace_changed', handleSyncWebsiteConfig);
    window.addEventListener('website_config_updated', handleSyncWebsiteConfig);
    return () => {
      window.removeEventListener('active_workspace_changed', handleSyncWebsiteConfig);
      window.removeEventListener('website_config_updated', handleSyncWebsiteConfig);
    };
  }, []);

  useEffect(() => {
    const handlePaletteChange = () => setPaletteTick((t) => t + 1);
    window.addEventListener('interface_palette_changed', handlePaletteChange);
    window.addEventListener('surface_mode_updated', handlePaletteChange);
    return () => {
      window.removeEventListener('interface_palette_changed', handlePaletteChange);
      window.removeEventListener('surface_mode_updated', handlePaletteChange);
    };
  }, []);

  useEffect(() => {
    const handleQuotaExceeded = () => {
      setIsQuotaExceeded(true);
      setIsQuotaBannerDismissed(false);
    };
    window.addEventListener('firestore_quota_exceeded', handleQuotaExceeded);

    syncCloudinaryResources()
      .then((synced) => {
        if (synced && synced.length > 0) {
          setMediaFiles(synced);
        }
      })
      .catch((e) => {
        console.warn('Initial Cloudinary/Firebase sync completed with fallback:', e);
      });

    return () => {
      window.removeEventListener('firestore_quota_exceeded', handleQuotaExceeded);
    };
  }, []);

  const handleUpdateWebsiteConfig = (updated: WebsiteConfig) => {
    setWebsiteConfig(updated);
    saveWebsiteConfig(updated);
  };

  const handleAutoPublish = async (page: WebsitePage) => {
    setPublishStatus({
      type: 'loading',
      message: `Publishing "${page.title}" to GitHub automatically...`,
    });
    try {
      const result = await autoPublishWebsitePage(page);
      if (result.success) {
        setPublishStatus({
          type: 'success',
          message: `Published "${page.title}" to ${result.repoFullName || 'GitHub'}!`,
          commitUrl: result.commitUrl || result.contentUrl,
        });
        setTimeout(() => {
          setPublishStatus((prev) => (prev?.type === 'success' ? null : prev));
        }, 5000);
      } else {
        setPublishStatus({
          type: 'error',
          message: `Could not publish "${page.title}". Check GitHub permissions.`,
        });
      }
    } catch (err: any) {
      setPublishStatus({
        type: 'error',
        message: err.message || `Failed to publish "${page.title}".`,
      });
      setTimeout(() => {
        setPublishStatus((prev) => (prev?.type === 'error' ? null : prev));
      }, 7000);
    }
  };

  const handleDirectCreateNewPage = (
    folder?: string,
    title?: string,
    fileName?: string,
    description?: string,
    status?: any,
    indexing?: 'index' | 'no-index',
    passwordProtected?: boolean,
    password?: string
  ) => {
    const nextNum = pages.length + 1;
    const dynamicTitle = title || (folder ? `${folder.replace(/^\/+/, '') || 'Page'} Home` : `Page ${nextNum}`);
    onCreatePage(dynamicTitle, 'blank', folder, fileName, description, status, indexing, passwordProtected, password);
  };

  const handleLaunchEditorForPage = (pageId: string) => {
    onSelectPage(pageId);
    onOpenEditor();
  };

  const handleNavigateToWebsiteSubTab = (subTab: WebsiteSubTab) => {
    setCurrentTab('websites');
    setWebsiteSubTab(subTab);
  };

  return (
    <div
      id="dashboard-viewport"
      data-dashboard="true"
      className="dashboard-container h-screen max-h-screen overflow-hidden flex flex-row transition-colors duration-200 bg-[var(--app-bg)] text-[var(--app-text)]"
    >
      <DashboardSidebar
        currentTab={currentTab}
        settingsSubTab={settingsSubTab}
        websiteSubTab={websiteSubTab}
        brandSubTab={brandSubTab}
        reportSubTab={reportSubTab}
        onSelectWebsiteSubTab={(sub) => setWebsiteSubTab(sub)}
        onSelectSettingsSubTab={(sub) => setSettingsSubTab(sub)}
        onSelectBrandSubTab={(sub) => setBrandSubTab(sub)}
        onSelectReportSubTab={(sub) => setReportSubTab(sub)}
        onSelectTab={(tab, subTab) => {
          setCurrentTab(tab);
          if (tab === 'websites') {
            if (subTab) {
              setWebsiteSubTab(subTab as WebsiteSubTab);
            } else if (!websiteSubTab) {
              setWebsiteSubTab('webpages');
            }
          }
          if (tab === 'settings') {
            if (subTab) {
              setSettingsSubTab(subTab as SettingsSubTab);
            } else if (!settingsSubTab) {
              setSettingsSubTab('workspace');
            }
          }
          if (tab === 'brand') {
            if (subTab) {
              setBrandSubTab(subTab as BrandSubTab);
            } else if (!brandSubTab) {
              setBrandSubTab('identity');
            }
          }
          if (tab === 'usage') {
            if (subTab) {
              setReportSubTab(subTab as ReportSubTab);
            } else if (!reportSubTab) {
              setReportSubTab('overview');
            }
          }
        }}
        onOpenEditor={onOpenEditor}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        uiTheme={uiTheme}
        isMinimized={currentTab === 'websites' || currentTab === 'settings' || currentTab === 'brand' || currentTab === 'usage'}
        onToggleUiTheme={onToggleUiTheme}
        onCreateNewPage={handleDirectCreateNewPage}
      />

      {currentTab === 'websites' && (
        <div className="hidden lg:block h-full shrink-0 animate-in fade-in slide-in-from-left-2 duration-200">
          <WebsiteSubNavBox
            currentSubTab={websiteSubTab}
            onSelectSubTab={(sub) => setWebsiteSubTab(sub)}
            pagesCount={pages.length}
            config={websiteConfig}
            uiTheme={uiTheme}
          />
        </div>
      )}

      {currentTab === 'settings' && (
        <div className="hidden lg:block h-full shrink-0 animate-in fade-in slide-in-from-left-2 duration-200">
          <SettingsSubNavBox
            currentSubTab={settingsSubTab}
            onSelectSubTab={(sub) => setSettingsSubTab(sub)}
            uiTheme={uiTheme}
          />
        </div>
      )}

      {currentTab === 'brand' && (
        <div className="hidden lg:block h-full shrink-0 animate-in fade-in slide-in-from-left-2 duration-200">
          <BrandSubNavBox
            currentSubTab={brandSubTab}
            onSelectSubTab={(sub) => setBrandSubTab(sub)}
            uiTheme={uiTheme}
          />
        </div>
      )}

                  uiTheme={uiTheme}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[var(--app-panel)]">
        <DashboardNavbar
          currentTab={currentTab}
          settingsSubTab={settingsSubTab}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenEditor={onOpenEditor}
          onCreateNewPage={handleDirectCreateNewPage}
          onNavigateTab={(tab, subTab) => {
            setCurrentTab(tab);
            if (tab === 'settings' && subTab) {
              setSettingsSubTab(subTab as SettingsSubTab);
            }
          }}
          uiTheme={uiTheme}
          onToggleUiTheme={onToggleUiTheme}
        />

        {publishStatus && (
          <div
            className={`px-4 sm:px-6 lg:px-8 py-2 text-xs font-medium transition-all shrink-0 ${
              publishStatus.type === 'loading'
                ? 'bg-indigo-600 text-white'
                : publishStatus.type === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2 max-w-2xl truncate">
                {publishStatus.type === 'loading' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                ) : publishStatus.type === 'success' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                )}
                <span className="truncate">{publishStatus.message}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {publishStatus.commitUrl && (
                  <a
                    href={publishStatus.commitUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline flex items-center gap-1 hover:opacity-90 font-semibold text-[11px]"
                  >
                    <span>View on GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setPublishStatus(null)}
                  className="p-0.5 hover:bg-black/20 rounded cursor-pointer leading-none text-xs"
                  aria-label="Dismiss banner"
                >
                  &times;
                </button>
              </div>
            </div>
          </div>
        )}

        {isQuotaExceeded && !isQuotaBannerDismissed && (
          <div className="px-4 sm:px-6 lg:px-8 py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs shrink-0 transition-all">
            <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <CloudOff className="w-4 h-4 shrink-0 text-amber-500" />
                <span className="truncate">
                  <strong>Offline / Local Mode Active:</strong> Cloud database write quota limit reached. Your changes are safely preserved in browser local storage and will sync when limits reset.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    resetFirestoreQuotaStatus();
                    setIsQuotaExceeded(false);
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-[11px] font-medium text-amber-700 dark:text-amber-300 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry Sync</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsQuotaBannerDismissed(true)}
                  className="p-1 hover:bg-amber-500/20 rounded text-amber-600 dark:text-amber-400 cursor-pointer text-xs leading-none"
                  aria-label="Dismiss notification"
                >
                  &times;
                </button>
              </div>
            </div>
          </div>
        )}

        <ScrollArea
          id="dashboard-main"
          className="flex-1 bg-[var(--app-panel)] text-[var(--app-text)] px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 w-full transition-colors duration-200"
        >
          <div className="max-w-7xl w-full mx-auto">
          {currentTab === 'get-started' && (
            <GetStartedView
              uiTheme={uiTheme}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onOpenEditor={onOpenEditor}
              workspaceName={getSavedBrandingConfig().logoName || ''}
            />
          )}

          {currentTab === 'overview' && (
            <OverviewView
              pages={pages}
              mediaFiles={mediaFiles}
              onOpenPageInEditor={handleLaunchEditorForPage}
              onNavigateTab={(tab) => setCurrentTab(tab as DashboardTab)}
              onNavigateToWebsiteSubTab={handleNavigateToWebsiteSubTab}
              config={websiteConfig}
              uiTheme={uiTheme}
            />
          )}

          {currentTab === 'websites' && (
            <WebsitesView
              pages={pages}
              onOpenPageInEditor={handleLaunchEditorForPage}
              onCreateNewPage={handleDirectCreateNewPage}
              onDuplicatePage={onDuplicatePage}
              onDeletePage={onDeletePage}
              onUpdatePageMeta={onUpdatePageMeta}
              onPreviewPage={setPreviewPage}
              onPublishPageToGitHub={handleAutoPublish}
              uiTheme={uiTheme}
              currentSubTab={websiteSubTab}
              onSelectSubTab={setWebsiteSubTab}
              config={websiteConfig}
              onUpdateConfig={handleUpdateWebsiteConfig}
              onOpenEditor={onOpenEditor}
            />
          )}

          {currentTab === 'inbox' && (
            <InboxView
              uiTheme={uiTheme}
            />
          )}

          {currentTab === 'brand' && (
            <BrandView
              uiTheme={uiTheme}
              activeSubTab={brandSubTab}
            />
          )}

          {currentTab === 'media' && (
            <MediaStorageView
              mediaFiles={mediaFiles}
              onUpdateMediaFiles={setMediaFiles}
              uiTheme={uiTheme}
            />
          )}

                      />
          )}

                      />
          )}

          {currentTab === 'settings' && (
            <AccountSettingsView
              currentSubTab={settingsSubTab}
              onSelectSubTab={setSettingsSubTab}
              uiTheme={uiTheme}
              onToggleUiTheme={onToggleUiTheme}
              onSetUiTheme={onSetUiTheme}
            />
          )}
          </div>
        </ScrollArea>
      </div>

      {previewPage && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 backdrop-blur-md">
          <div className="px-6 py-3 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white text-sm">{previewPage.title}</span>
              <span className="text-[11px] text-slate-400 font-mono">Live Preview Mode</span>
            </div>

            <div className="flex items-center rounded-xl bg-slate-800 border border-slate-700 p-1">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                  previewDevice === 'desktop'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                  previewDevice === 'tablet'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                  previewDevice === 'mobile'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const pid = previewPage.id;
                  setPreviewPage(null);
                  handleLaunchEditorForPage(pid);
                }}
                className="px-4.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer shadow-xs min-h-[38px]"
              >
                Open in Editor
              </button>
              <button
                onClick={() => setPreviewPage(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center">
            <div
              className={`h-full bg-white text-slate-900 rounded-2xl shadow-2xl overflow-y-auto transition-all duration-300 ${
                previewDevice === 'mobile'
                  ? 'w-[375px] max-h-[750px] border-8 border-slate-800 rounded-[40px]'
                  : previewDevice === 'tablet'
                  ? 'w-[768px] max-h-[900px] border-8 border-slate-800 rounded-[32px]'
                  : 'w-full max-w-6xl max-h-full border border-slate-800'
              }`}
            >
              <Canvas
                page={previewPage}
                selectedContext={null}
                selectedSectionId={null}
                editorMode="preview"
                viewportMode={previewDevice}
                uiTheme={uiTheme}
                onSelectElement={() => {}}
                onDeselect={() => {}}
                onUpdateElement={() => {}}
                onMoveSection={() => {}}
                onDuplicateSection={() => {}}
                onDeleteSection={() => {}}
                onAddElementToSection={() => {}}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
