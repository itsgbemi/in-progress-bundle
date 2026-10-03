import { WebsitePage } from '../types';
import { generateFullHtml, extractFormFields } from '../utils/htmlGenerator';
import { 
  getWebsiteConfig, 
  isDomainConfigured, 
  generateRobotsTxtContent, 
  generateSitemapXml 
} from './websiteConfigService';

export interface GitHubStatus {
  configured: boolean;
  hasToken: boolean;
  owner: string;
  repo: string;
  branch: string;
}

export interface PublishParams {
  content: string;
  filePath?: string;
  previousFilePath?: string;
  commitMessage?: string;
  repoOwner?: string;
  repoName?: string;
  branch?: string;
  siteName?: string;
  siteDescription?: string;
  pageTitle?: string;
  formFields?: string[];
  robotsTxt?: string;
  sitemapXml?: string;
  pushSitemap?: boolean;
}

export interface PublishResult {
  success: boolean;
  filePath: string;
  commitSha?: string;
  commitUrl?: string;
  contentUrl?: string;
  downloadUrl?: string;
  repoFullName: string;
  branch: string;
  updated?: boolean;
}

export interface SyncSeoParams {
  robotsTxt: string;
  sitemapXml?: string;
  pushSitemap: boolean;
  repoOwner?: string;
  repoName?: string;
  branch?: string;
}

export interface SyncSeoResult {
  success: boolean;
  pushedFiles: string[];
  commitSha?: string;
  repoFullName: string;
  branch: string;
  timestamp: string;
  message?: string;
  error?: string;
}

export interface RepoVerification {
  exists: boolean;
  fullName: string;
  defaultBranch: string;
  isPrivate: boolean;
  description: string;
  htmlUrl: string;
  hasPages: boolean;
}

export async function fetchGitHubStatus(): Promise<GitHubStatus> {
  try {
    const res = await fetch('/api/github/status');
    if (!res.ok) {
      throw new Error(`Failed to fetch GitHub status (HTTP ${res.status})`);
    }
    return await res.json();
  } catch (err: any) {
    console.error('Error in fetchGitHubStatus:', err);
    return {
      configured: false,
      hasToken: false,
      owner: '',
      repo: '',
      branch: 'main',
    };
  }
}

export async function verifyGitHubRepo(owner: string, repo: string): Promise<RepoVerification> {
  const res = await fetch('/api/github/verify-repo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ owner, repo }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to verify repository');
  }
  return data;
}

export async function publishPageToGitHub(params: PublishParams): Promise<PublishResult> {
  const res = await fetch('/api/github/publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to publish to GitHub');
  }
  return data;
}

export async function autoPublishWebsitePage(
  page: WebsitePage,
  commitMsg?: string
): Promise<PublishResult> {
  const html = generateFullHtml(page);
  const isHome =
    (page.title || '').toLowerCase().trim() === 'home' ||
    page.id === 'home' ||
    page.id === 'index';

  const cleanSlug = (page.title || page.id || 'page')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'page';

  let targetPath = (page.fileName || (isHome ? 'index.html' : `${cleanSlug}.html`)).trim();
  if (!targetPath.endsWith('.html') && !targetPath.includes('.')) {
    targetPath = `${targetPath}.html`;
  }

  const previousPath =
    page.previousFileName && page.previousFileName.trim() !== targetPath
      ? page.previousFileName.trim()
      : undefined;

  const defaultCommit =
    commitMsg ||
    `Publish ${page.title || 'Page'} (${targetPath}) via Website Builder [${new Date().toLocaleDateString()}]`;

  const cfg = getWebsiteConfig();
  const domainConfigured = isDomainConfigured(cfg);
  const crawlRequirement = cfg.indexing?.crawlRequirement || (cfg.indexing?.robotsDirectives?.noIndex ? 'disallow' : 'allow');
  
  let robotsTxtContent: string | undefined = undefined;
  let sitemapXmlContent: string | undefined = undefined;

  if (domainConfigured && crawlRequirement && crawlRequirement !== 'not_selected') {
    robotsTxtContent = generateRobotsTxtContent(crawlRequirement, cfg);
    
    sitemapXmlContent = generateSitemapXml([page], cfg);
  }

  return await publishPageToGitHub({
    content: html,
    filePath: targetPath,
    previousFilePath: previousPath,
    commitMessage: defaultCommit,
    siteName: page.siteSettings?.title || page.title,
    siteDescription: page.siteSettings?.description || (page.title ? `${page.title} - Website` : undefined),
    pageTitle: page.title,
    formFields: extractFormFields(page),
    robotsTxt: robotsTxtContent,
    sitemapXml: sitemapXmlContent,
    pushSitemap: domainConfigured,
  });
}

export async function syncSeoFilesToGitHub(params: SyncSeoParams): Promise<SyncSeoResult> {
  const res = await fetch('/api/github/sync-seo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to sync SEO files to GitHub');
  }
  return data;
}
