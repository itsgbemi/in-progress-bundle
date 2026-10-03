import React from 'react';
import { WebsitePage } from '../../../types';
import { WebsiteConfig } from '../../../services/websiteConfigService';
import { WebsiteSubTab } from '../WebsiteSubNavBox';
import { Webpages } from './website/Webpages';
import { Domain } from './website/Domain';
import { Sitemap } from './website/Sitemap';
import { Indexing } from './website/Indexing';

interface WebsitesViewProps {
  pages: WebsitePage[];
  onOpenPageInEditor?: (pageId: string) => void;
  onOpenEditor?: () => void;
  onCreateNewPage?: (
    folder?: string,
    title?: string,
    fileName?: string,
    description?: string,
    status?: any,
    indexing?: 'index' | 'no-index',
    passwordProtected?: boolean,
    password?: string
  ) => void;
  onCreatePage?: (
    title: string,
    templateId?: string,
    folder?: string,
    routePath?: string,
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
  onPreviewPage?: (page: WebsitePage) => void;
  uiTheme: 'dark' | 'light';
  currentSubTab?: WebsiteSubTab;
  activeSubTab?: WebsiteSubTab;
  onSelectSubTab?: (subTab: WebsiteSubTab) => void;
  config: WebsiteConfig;
  onUpdateConfig: (config: WebsiteConfig) => void;
  onPublishPageToGitHub?: (page: WebsitePage) => void;
}

export const WebsitesView: React.FC<WebsitesViewProps> = ({
  pages,
  onOpenPageInEditor,
  onOpenEditor,
  onCreateNewPage,
  onCreatePage,
  onDuplicatePage,
  onDeletePage,
  onUpdatePageMeta,
  onPreviewPage,
  uiTheme,
  currentSubTab,
  activeSubTab,
  onSelectSubTab,
  config,
  onUpdateConfig,
  onPublishPageToGitHub,
}) => {
  const activeTab = currentSubTab || activeSubTab || 'webpages';

  const handleOpenPage = (pageId: string) => {
    if (onOpenPageInEditor) {
      onOpenPageInEditor(pageId);
    } else if (onOpenEditor) {
      onOpenEditor();
    }
  };

  const handleCreate = (
    folder?: string,
    title?: string,
    fileName?: string,
    description?: string,
    status?: any,
    indexing?: 'index' | 'no-index',
    passwordProtected?: boolean,
    password?: string
  ) => {
    if (onCreateNewPage) {
      onCreateNewPage(folder, title, fileName, description, status, indexing, passwordProtected, password);
    } else if (onCreatePage) {
      onCreatePage(title || 'New Page', undefined, folder, undefined);
    }
  };

  return (
    <div className="space-y-6">
      {activeTab === 'webpages' && (
        <Webpages
          pages={pages}
          onOpenPageInEditor={handleOpenPage}
          onCreateNewPage={handleCreate}
          onDuplicatePage={onDuplicatePage}
          onDeletePage={onDeletePage}
          onUpdatePageMeta={onUpdatePageMeta}
          onPreviewPage={onPreviewPage || (() => {})}
          onPublishPageToGitHub={onPublishPageToGitHub}
          uiTheme={uiTheme}
        />
      )}

      {activeTab === 'domain' && (
        <Domain
          config={config}
          onUpdateConfig={onUpdateConfig}
          uiTheme={uiTheme}
        />
      )}

      {activeTab === 'sitemap' && (
        <Sitemap
          pages={pages}
          config={config}
          onUpdateConfig={onUpdateConfig}
          uiTheme={uiTheme}
          onNavigateSubTab={onSelectSubTab}
        />
      )}

      {activeTab === 'indexing' && (
        <Indexing
          pages={pages}
          config={config}
          onUpdateConfig={onUpdateConfig}
          uiTheme={uiTheme}
          onNavigateSubTab={onSelectSubTab}
        />
      )}
    </div>
  );
};
