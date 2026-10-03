import React from 'react';
import { WebsitePage } from '../../../types';
import { WebsiteConfig } from '../../../services/websiteConfigService';
import { WebsiteSubTab } from '../WebsiteSubNavBox';
import { WebpagesSubView } from './website/WebpagesSubView';
import { DomainSubView } from './website/DomainSubView';
import { SitemapSubView } from './website/SitemapSubView';
import { IndexingSubView } from './website/IndexingSubView';

interface WebsitesViewProps {
  pages: WebsitePage[];
  onOpenPageInEditor: (pageId: string) => void;
  onCreateNewPage: (
    folder?: string,
    title?: string,
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
  onPreviewPage: (page: WebsitePage) => void;
  onPublishPageToGitHub?: (page: WebsitePage) => void;
  uiTheme: 'dark' | 'light';
  currentSubTab?: WebsiteSubTab;
  onSelectSubTab?: (subTab: WebsiteSubTab) => void;
  config: WebsiteConfig;
  onUpdateConfig: (config: WebsiteConfig) => void;
  onOpenEditor?: () => void;
}

export const WebsitesView: React.FC<WebsitesViewProps> = ({
  pages,
  onOpenPageInEditor,
  onCreateNewPage,
  onDuplicatePage,
  onDeletePage,
  onUpdatePageMeta,
  onPreviewPage,
  onPublishPageToGitHub,
  uiTheme,
  currentSubTab = 'webpages',
  onSelectSubTab,
  config,
  onUpdateConfig,
  onOpenEditor,
}) => {
  return (
    <div>
      {currentSubTab === 'webpages' && (
        <WebpagesSubView
          pages={pages}
          onOpenPageInEditor={onOpenPageInEditor}
          onCreateNewPage={onCreateNewPage}
          onDuplicatePage={onDuplicatePage}
          onDeletePage={onDeletePage}
          onUpdatePageMeta={onUpdatePageMeta}
          onPreviewPage={onPreviewPage}
          onPublishPageToGitHub={onPublishPageToGitHub}
          uiTheme={uiTheme}
        />
      )}

      {currentSubTab === 'domain' && (
        <DomainSubView
          config={config}
          onUpdateConfig={onUpdateConfig}
          uiTheme={uiTheme}
        />
      )}

      {currentSubTab === 'sitemap' && (
        <SitemapSubView
          pages={pages}
          config={config}
          onUpdateConfig={onUpdateConfig}
          uiTheme={uiTheme}
          onNavigateSubTab={onSelectSubTab}
        />
      )}

      {currentSubTab === 'indexing' && (
        <IndexingSubView
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
