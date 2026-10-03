import { initFirebase, doc, getDoc, setDoc, firebaseAuth } from '../lib/firebase';
import { isFirestoreQuotaExceeded, handleFirestoreError } from '../lib/firestoreQuota';
import { getActiveWorkspaceId } from './workspaceService';

export interface AttachedDomain {
  id: string;
  domain: string;
  manageUrl: string;
  isPrimary?: boolean;
  createdAt: string;
}

export interface DomainConfig {
  attachedDomains: AttachedDomain[];
  customDomain: string;
  isCustomDomainActive: boolean;
  sslStatus?: 'active' | 'pending';
  updatedAt: string;
}

export interface HostingConfig {
  provider: 'vercel' | 'github_pages' | 'cloudflare';
  githubRepo: string;
  githubBranch: string;
  githubRepoUrl: string;
  lastCommitSha: string;
  lastCommitMessage: string;
  lastSyncTime: string;
  autoSyncOnPublish: boolean;
  vercelDeployment: {
    status: 'ready' | 'building' | 'error';
    deploymentId: string;
    deploymentUrl: string;
    manageUrl?: string;
    environment: 'production' | 'preview';
    framework: string;
    region: string;
    buildDuration: string;
    deployedAt: string;
    edgeCaching: boolean;
  };
}

export interface SitemapConfig {
  autoGenerate: boolean;
  includeImages: boolean;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  defaultPriority: number;
  customPaths: {
    path: string;
    priority: number;
    changefreq: string;
    lastmod: string;
  }[];
}

export interface IndexingConfig {
  crawlRequirement?: 'allow' | 'disallow' | 'not_selected';
  googleSearchConsole: {
    connected: boolean;
    verificationTag: string;
    indexingStatus: 'indexed' | 'crawled_not_indexed' | 'pending' | 'submitted';
    lastCrawled: string;
    mobileUsability: 'pass' | 'warning' | 'fail';
  };
  bingWebmaster: {
    connected: boolean;
    indexingStatus: 'indexed' | 'pending';
  };
  robotsDirectives: {
    allowAll: boolean;
    noIndex: boolean;
    noFollow: boolean;
    customRobotsTxt: string;
  };
  lastRobotsSync?: {
    syncedAt: string;
    status: 'success' | 'failed' | 'pending';
    commitSha?: string;
    message?: string;
    pushedFiles?: string[];
  };
}

export interface ColorPalette {
  textColor: string;
  backgroundColor: string;
  primaryColor: string;
  accentColor: string;
  neutralColor: string;
}

export interface PaletteConfig {
  enableDarkTheme: boolean;
  light: ColorPalette;
  dark: ColorPalette;
}

export interface WebsiteConfig {
  domain: DomainConfig;
  hosting: HostingConfig;
  sitemap: SitemapConfig;
  indexing: IndexingConfig;
  palette?: PaletteConfig;
}
export const DEFAULT_PALETTE_CONFIG: PaletteConfig = {
  enableDarkTheme: false,
  light: {
    textColor: '#0f172a',
    backgroundColor: '#ffffff',
    primaryColor: '#4f46e5',
    accentColor: '#06b6d4',
    neutralColor: '#f1f5f9',
  },
  dark: {
    textColor: '#f8fafc',
    backgroundColor: '#090d16',
    primaryColor: '#6366f1',
    accentColor: '#22d3ee',
    neutralColor: '#1e293b',
  },
};

export const DEFAULT_WEBSITE_CONFIG: WebsiteConfig = {
  domain: {
    attachedDomains: [],
    customDomain: '',
    isCustomDomainActive: false,
    sslStatus: 'active',
    updatedAt: new Date().toISOString(),
  },
  hosting: {
    provider: 'vercel',
    githubRepo: '',
    githubBranch: 'main',
    githubRepoUrl: '',
    lastCommitSha: '',
    lastCommitMessage: '',
    lastSyncTime: '',
    autoSyncOnPublish: true,
    vercelDeployment: {
      status: 'ready',
      deploymentId: '',
      deploymentUrl: '',
      manageUrl: '',
      environment: 'production',
      framework: 'Static HTML5 / React',
      region: 'Global Edge CDN',
      buildDuration: '1.2s',
      deployedAt: 'Latest',
      edgeCaching: true,
    },
  },
  sitemap: {
    autoGenerate: true,
    includeImages: true,
    changeFrequency: 'weekly',
    defaultPriority: 0.8,
    customPaths: [],
  },
  indexing: {
    crawlRequirement: 'allow',
    googleSearchConsole: {
      connected: false,
      verificationTag: '',
      indexingStatus: 'pending',
      lastCrawled: '',
      mobileUsability: 'pass',
    },
    bingWebmaster: {
      connected: false,
      indexingStatus: 'pending',
    },
    robotsDirectives: {
      allowAll: true,
      noIndex: false,
      noFollow: false,
      customRobotsTxt: `User-agent: *\nAllow: /\n`,
    },
  },
  palette: DEFAULT_PALETTE_CONFIG,
};

const DEFAULT_CONFIG_STORAGE_KEY = 'website_config_v1';

export function getWebsiteConfigStorageKey(workspaceId?: string): string {
  const wsId = workspaceId || getActiveWorkspaceId();
  if (!wsId || wsId === 'workspace-default') {
    return DEFAULT_CONFIG_STORAGE_KEY;
  }
  return `website_config_v1_${wsId}`;
}

const inMemoryWebsiteConfigCache: Record<string, WebsiteConfig> = {};

export function getWebsiteConfig(workspaceId?: string): WebsiteConfig {
  const wsId = workspaceId || getActiveWorkspaceId();
  if (inMemoryWebsiteConfigCache[wsId]) {
    if (!inMemoryWebsiteConfigCache[wsId].palette) {
      inMemoryWebsiteConfigCache[wsId].palette = DEFAULT_PALETTE_CONFIG;
    }
    return inMemoryWebsiteConfigCache[wsId];
  }

  if (typeof window !== 'undefined') {
    try {
      const storageKey = getWebsiteConfigStorageKey(wsId);
      const raw =
        localStorage.getItem(storageKey) ||
        localStorage.getItem(`myoffice_website_config_v1_${wsId}`) ||
        (wsId === 'workspace-default' ? localStorage.getItem('myoffice_website_config_v1') : null);
      if (raw) {
        const parsed = JSON.parse(raw);
        const resolved: WebsiteConfig = {
          ...DEFAULT_WEBSITE_CONFIG,
          ...parsed,
          palette: parsed.palette || DEFAULT_PALETTE_CONFIG,
        };
        inMemoryWebsiteConfigCache[wsId] = resolved;
        return resolved;
      }
    } catch (e) {
      console.warn('Failed to parse website config from localStorage:', e);
    }
  }

  const fresh = JSON.parse(JSON.stringify(DEFAULT_WEBSITE_CONFIG));
  inMemoryWebsiteConfigCache[wsId] = fresh;
  return fresh;
}

export const loadWebsiteConfig = getWebsiteConfig;

export function saveWebsiteConfig(config: WebsiteConfig, userId?: string, workspaceId?: string): void {
  const wsId = workspaceId || getActiveWorkspaceId();
  inMemoryWebsiteConfigCache[wsId] = config;

  if (typeof window !== 'undefined') {
    const storageKey = getWebsiteConfigStorageKey(wsId);
    try {
      localStorage.setItem(storageKey, JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save website config to localStorage:', e);
    }
    window.dispatchEvent(new CustomEvent('website_config_updated', { detail: { config, workspaceId: wsId } }));
  }

  const targetUid = userId || firebaseAuth?.currentUser?.uid;
  if (targetUid) {
    saveWebsiteConfigToFirestore(targetUid, config, wsId).catch((err) => {
      console.warn('Failed to save website config to Firestore:', err);
    });
  }
}

export async function saveWebsiteConfigToFirestore(userId: string, config: WebsiteConfig, workspaceId?: string): Promise<void> {
  if (isFirestoreQuotaExceeded()) return;
  const { db, auth, isConfigured } = initFirebase();
  if (!db || !isConfigured || !userId) return;
  if (auth?.currentUser && auth.currentUser.uid !== userId) return;
  try {
    const wsId = workspaceId || getActiveWorkspaceId();
    const configDocRef = (!wsId || wsId === 'workspace-default')
      ? doc(db, 'users', userId, 'config', 'website')
      : doc(db, 'users', userId, 'workspaces', wsId, 'config', 'website');

    await setDoc(configDocRef, JSON.parse(JSON.stringify(config)), { merge: true });
  } catch (err) {
    handleFirestoreError(err, 'Saving website config');
  }
}

export async function loadWebsiteConfigFromFirestore(userId: string, workspaceId?: string): Promise<WebsiteConfig | null> {
  if (isFirestoreQuotaExceeded()) return null;
  const { db, auth, isConfigured } = initFirebase();
  if (!db || !isConfigured || !userId) return null;
  if (auth?.currentUser && auth.currentUser.uid !== userId) return null;
  try {
    const wsId = workspaceId || getActiveWorkspaceId();
    const configDocRef = (!wsId || wsId === 'workspace-default')
      ? doc(db, 'users', userId, 'config', 'website')
      : doc(db, 'users', userId, 'workspaces', wsId, 'config', 'website');

    const snap = await getDoc(configDocRef);
    if (snap.exists()) {
      const data = snap.data() as WebsiteConfig;
      inMemoryWebsiteConfigCache[wsId] = data;
      if (typeof window !== 'undefined') {
        const storageKey = getWebsiteConfigStorageKey(wsId);
        try {
          localStorage.setItem(storageKey, JSON.stringify(data));
        } catch {}
        window.dispatchEvent(new CustomEvent('website_config_updated', { detail: { config: data, workspaceId: wsId } }));
      }
      return data;
    }
  } catch (err) {
    handleFirestoreError(err, 'Loading website config');
  }
  return null;
}

if (typeof window !== 'undefined') {
  window.addEventListener('active_workspace_changed', (e: Event) => {
    const customEvent = e as CustomEvent<{ workspaceId: string }>;
    const wsId = customEvent.detail?.workspaceId || getActiveWorkspaceId();
    const config = getWebsiteConfig(wsId);
    window.dispatchEvent(new CustomEvent('website_config_updated', { detail: { config, workspaceId: wsId } }));
  });
}

export function getEffectiveDomainUrl(config: WebsiteConfig): string {
  const domain = getConfiguredDomain(config);
  if (domain) {
    return `https://${domain}`;
  }
  return '#';
}

export function getEffectiveDomainDisplay(config: WebsiteConfig): string {
  const domain = getConfiguredDomain(config);
  return domain || 'Not configured';
}

export function isDomainConfigured(config: WebsiteConfig): boolean {
  return Boolean(getConfiguredDomain(config));
}

export function getConfiguredDomain(config: WebsiteConfig): string {
  const primary = config.domain?.attachedDomains?.find((d) => d.isPrimary) || config.domain?.attachedDomains?.[0];
  if (primary && primary.domain && primary.domain.trim()) {
    return primary.domain.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  }
  if (config.domain?.customDomain && config.domain.customDomain.trim()) {
    return config.domain.customDomain.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  }
  if (config.hosting?.vercelDeployment?.deploymentUrl && config.hosting.vercelDeployment.deploymentUrl.trim()) {
    return config.hosting.vercelDeployment.deploymentUrl.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  }
  return '';
}

export function generateRobotsTxtContent(
  crawlRequirement: 'allow' | 'disallow',
  config: WebsiteConfig
): string {
  const domain = getConfiguredDomain(config);
  const isDomainActive = Boolean(domain);

  if (crawlRequirement === 'disallow') {
    return `User-agent: *
Disallow: /`;
  }

  let content = `User-agent: *
Allow: /`;

  if (isDomainActive) {
    content += `\nSitemap: https://${domain}/sitemap.xml`;
  }

  return content;
}

export function generateSitemapXml(
  pages: { id?: string; title?: string; fileName?: string }[],
  config: WebsiteConfig
): string {
  const domain = getConfiguredDomain(config);
  const baseUrl = domain ? `https://${domain}` : '';
  const today = new Date().toISOString().split('T')[0];

  const pageItems = pages.map((p, idx) => {
    const slug = idx === 0 ? '' : (p.fileName ? p.fileName.replace(/\.html$/, '') : (p.title || p.id || 'page').toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    const priority = idx === 0 ? '1.0' : '0.8';
    const loc = slug ? `${baseUrl}/${slug}` : baseUrl;
    return `<url>\n<loc>${loc}</loc>\n<lastmod>${today}</lastmod>\n<changefreq>weekly</changefreq>\n<priority>${priority}</priority>\n</url>`;
  });

  const customItems = (config.sitemap?.customPaths || []).map((cp) => {
    const loc = cp.path.startsWith('http') ? cp.path : `${baseUrl}${cp.path.startsWith('/') ? '' : '/'}${cp.path}`;
    return `<url>\n<loc>${loc}</loc>\n<lastmod>${cp.lastmod || today}</lastmod>\n<changefreq>${cp.changefreq || 'weekly'}</changefreq>\n<priority>${cp.priority || '0.8'}</priority>\n</url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...pageItems, ...customItems].join('\n')}\n</urlset>`;
}
