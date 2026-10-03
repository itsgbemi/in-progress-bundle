import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { WebsitePage, WebsiteSection, WebsiteElement, SelectedElementContext, EditorMode, ViewportMode, SiteSettings, } from './types';
import { INITIAL_WEBSITE_TEMPLATES, DEFAULT_BLANK_PAGE } from './data/initialTemplates';
import { Navbar } from './components/Navbar';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { AddSectionModal } from './components/AddSectionModal';
import { AddElementModal } from './components/AddElementModal';
import { ExportModal } from './components/ExportModal';
import { TagCategory } from './components/SiteSettingsModal';
import { TagsPanel } from './components/Tags';
import { OutlineModal } from './components/OutlineModal';
import { PageSettingsTab } from './components/properties/PropertiesCommon';
import { generateFullHtml, getUsedGoogleFontsLink } from './utils/htmlGenerator';
import { Copy, Check, X, RotateCcw } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { AuthLayout } from './components/auth/AuthLayout';
import { ThreeDotLoading } from './components/ThreeDotLoading';
import { DashboardLayout } from './components/dashboard/Layout';
import { DashboardTab } from './components/dashboard/Sidebar';
import { initAppInterfacePreferences, applyAppInterfacePalette, getSavedAppPalette, getSavedAppFont, getSavedHeadingFont, getSavedFontMode } from './utils/themePreferences';
import { findFontByIdOrName, ALL_FONTS } from './data/fonts';
import { useFontPreloader } from './hooks/useFontPreloader';
import { calculateActiveTheme, saveThemeConfig, getSavedThemeConfig, type ThemeScheduleConfig } from './utils/themeSchedule';
import {
loadPagesFromFirestore,
saveAllPagesToFirestore,
deletePageFromFirestore,
getLocalPagesCache,
subscribeToUserPages,
isFirestoreQuotaExceeded,
resetFirestoreQuotaStatus,
computePageContentHash,
} from './services/pageService';
import { loadWebsiteConfigFromFirestore } from './services/websiteConfigService';
import { subscribeToUserPreferences, loadUserPreferencesFromFirestore, saveUserPreferences } from './services/userPreferencesService';
import { loadBrandInfoFromFirestore } from './services/brandInfoService';
import { getActiveWorkspaceId } from './services/workspaceService';
import * as Y from 'yjs';
import { FirestoreProvider } from '@gmcfall/yjs-firestore-provider';
import { getCollaborationProvider, cleanupCollaboration } from './services/collaborationService';

export default function App() {
const { user, loading } = useAuth();
const [uiTheme, setUiTheme] = useState<'dark' | 'light'>(() => calculateActiveTheme());
const [dashboardTab, setDashboardTab] = useState<DashboardTab>(() => {
if (typeof window !== 'undefined') {
const saved = localStorage.getItem('dashboard_tab') || localStorage.getItem('user_dashboard_tab');
if (saved) return saved as DashboardTab;
}
return 'get-started';
});

const handleSelectDashboardTab = useCallback((tab: DashboardTab) => {
setDashboardTab(tab);
if (typeof window !== 'undefined') {
localStorage.setItem('dashboard_tab', tab);
}
if (user?.uid) {
saveUserPreferences(user.uid, { lastDashboardTab: tab }).catch(() => {});
}
}, [user?.uid]);

useEffect(() => {
initAppInterfacePreferences();
}, []);

useEffect(() => {
const checkSchedule = () => {
const config = getSavedThemeConfig();

if (config.mode === 'manual') {
return;
}
const computed = calculateActiveTheme(config);
setUiTheme((prev) => (prev !== computed ? computed : prev));
};

checkSchedule();
const intervalId = setInterval(checkSchedule, 10000);

const handleFocus = () => checkSchedule();
const handleScheduleEvent = (e: Event) => {
const customEvent = e as CustomEvent<ThemeScheduleConfig>;
const config = customEvent.detail || getSavedThemeConfig();
const computed = calculateActiveTheme(config);
setUiTheme((prev) => (prev !== computed ? computed : prev));
};

const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
const handleMediaQueryChange = () => {
const config = getSavedThemeConfig();
if (config.mode === 'system') {
checkSchedule();
}
};

window.addEventListener('focus', handleFocus);
window.addEventListener('theme_schedule_updated', handleScheduleEvent);
document.addEventListener('visibilitychange', handleFocus);
mediaQuery?.addEventListener?.('change', handleMediaQueryChange);

return () => {
clearInterval(intervalId);
window.removeEventListener('focus', handleFocus);
window.removeEventListener('theme_schedule_updated', handleScheduleEvent);
document.removeEventListener('visibilitychange', handleFocus);
mediaQuery?.removeEventListener?.('change', handleMediaQueryChange);
};
}, []);

useEffect(() => {
if (uiTheme === 'dark') {
document.documentElement.classList.add('dark');
document.documentElement.classList.remove('light');
}
else {
document.documentElement.classList.remove('dark');
document.documentElement.classList.add('light');
}
applyAppInterfacePalette(getSavedAppPalette());
}, [uiTheme]);

const toggleUiTheme = useCallback(() => {
const currentTheme = uiTheme || (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

if (nextTheme === 'dark') {
document.documentElement.classList.add('dark');
document.documentElement.classList.remove('light');
} else {
document.documentElement.classList.remove('dark');
document.documentElement.classList.add('light');
}

saveThemeConfig({ mode: 'manual', manualTheme: nextTheme });

setUiTheme(nextTheme);

if (user?.uid) {
saveUserPreferences(user.uid, {
themeMode: nextTheme,
themeSchedule: {
...getSavedThemeConfig(),
mode: 'manual',
manualTheme: nextTheme,
},
}).catch(() => {});
}
}, [uiTheme, user?.uid]);

const handleSetUiTheme = useCallback((theme: 'dark' | 'light') => {
if (theme === 'dark') {
document.documentElement.classList.add('dark');
document.documentElement.classList.remove('light');
} else {
document.documentElement.classList.remove('dark');
document.documentElement.classList.add('light');
}

saveThemeConfig({ mode: 'manual', manualTheme: theme });
setUiTheme(theme);

if (user?.uid) {
saveUserPreferences(user.uid, {
themeMode: theme,
themeSchedule: {
...getSavedThemeConfig(),
mode: 'manual',
manualTheme: theme,
},
}).catch(() => {});
}
}, [user?.uid]);
const [currentView, setCurrentView] = useState<'dashboard' | 'editor'>('dashboard');
const [pages, setPages] = useState<WebsitePage[]>([]);

useEffect(() => {
const handleLocalPagesUpdated = (e: Event) => {
const customEvent = e as CustomEvent<{ pages: WebsitePage[] }>;
if (customEvent.detail?.pages) {
setPages(customEvent.detail.pages);
}
};
window.addEventListener('local_pages_updated', handleLocalPagesUpdated);
return () => window.removeEventListener('local_pages_updated', handleLocalPagesUpdated);
}, []);
const [currentPage, setCurrentPage] = useState<WebsitePage | null>(null);
const [collab, setCollab] = useState<{ doc: Y.Doc; provider: FirestoreProvider | null } | null>(null);
const [history, setHistory] = useState<WebsitePage[]>([]);

const [historyIndex, setHistoryIndex] = useState<number>(0);
const [editorMode, setEditorMode] = useState<EditorMode>('edit');
const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
const [customViewportWidth, setCustomViewportWidth] = useState<number | null>(null);
const [customViewportScale, setCustomViewportScale] = useState<number>(1);
const [selectedContext, setSelectedContext] = useState<SelectedElementContext | null>(null);
const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
const [isPageSelected, setIsPageSelected] = useState<boolean>(false);
const [pageSettingsTab, setPageSettingsTab] = useState<PageSettingsTab>('all');
const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
const [isAddSectionOpen, setIsAddSectionOpen] = useState<boolean>(false);
const [addElementSectionId, setAddElementSectionId] = useState<string | null>(null);
const [addElementParentId, setAddElementParentId] = useState<string | null>(null);
const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
const [isSiteSettingsOpen, setIsSiteSettingsOpen] = useState<boolean>(false);
const [tagCategory, setTagCategory] = useState<TagCategory>('meta');
const [isPageOutlineOpen, setIsPageOutlineOpen] = useState<boolean>(false);
const [copiedCode, setCopiedCode] = useState<boolean>(false);
const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);
const [isSavingToFirestore, setIsSavingToFirestore] = useState<boolean>(false);
const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
const [saveError, setSaveError] = useState<string | null>(null);
const [isPagesLoaded, setIsPagesLoaded] = useState<boolean>(false);

const currentPageFonts = useMemo(() => {
if (!currentPage) return [];
const fonts: any[] = [];

const addFontToPreload = (fontName: string | undefined) => {
if (!fontName) return;
const clean = fontName.replace(/['"]/g, '').trim();
const found = ALL_FONTS.find(f =>
f.name.toLowerCase() === clean.toLowerCase() ||
f.id.toLowerCase() === clean.toLowerCase()
);
if (found && !found.isWebSafe && !fonts.some(x => x.id === found.id)) {
fonts.push(found);
}
};

addFontToPreload(currentPage.globalStyles?.fontFamily);

const scanElement = (el: any) => {
if (!el) return;
addFontToPreload(el.styles?.typeface);
addFontToPreload(el.styles?.fontFamily);
addFontToPreload(el.styles?.labelTypeface);
addFontToPreload(el.styles?.textTypeface);
addFontToPreload(el.labelTypeface);
addFontToPreload(el.textTypeface);

if (el.content && typeof el.content === 'string') {
const inlineFontRegex = /font-family:\s*([^;"]+)/gi;
let match;
while ((match = inlineFontRegex.exec(el.content)) !== null) {
const rawValue = match[1];
const firstFont = rawValue.split(',')[0].replace(/['"]/g, '').trim();
if (firstFont) {
addFontToPreload(firstFont);
}
}
}

if (el.children && Array.isArray(el.children)) {
el.children.forEach(scanElement);
}
};

currentPage.sections?.forEach(sec => {
addFontToPreload(sec.styles?.typeface);
addFontToPreload((sec.styles as any)?.fontFamily);
sec.elements?.forEach(scanElement);
});

return fonts;
}, [currentPage]);

useFontPreloader(currentPageFonts);

const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(() => getActiveWorkspaceId());

useEffect(() => {
const loadWorkspaceFonts = () => {
const appFontId = getSavedAppFont(activeWorkspaceId);
const headingFontId = getSavedHeadingFont(activeWorkspaceId);
const fontMode = getSavedFontMode(activeWorkspaceId);

const appFont = findFontByIdOrName(appFontId);
const headingFont = fontMode === 'separate_heading' ? findFontByIdOrName(headingFontId) : null;

const fontsToLoad = [appFont, headingFont].filter((f): f is NonNullable<typeof f> => !!f && !f.isWebSafe);

if (fontsToLoad.length > 0) {
const familyStrings = fontsToLoad.map(f => {
const formattedName = f.name.replace(/\s+/g, '+');
const weightsStr = (f.weights || [400]).join(';');
return `family=${formattedName}:wght@${weightsStr}`;
});

const url = `https://fonts.googleapis.com/css2?${familyStrings.join('&')}&display=swap`;
let linkEl = document.getElementById('workspace-dynamic-google-fonts') as HTMLLinkElement | null;
if (!linkEl) {
linkEl = document.createElement('link');
linkEl.id = 'workspace-dynamic-google-fonts';
linkEl.rel = 'stylesheet';
document.head.appendChild(linkEl);
}
if (linkEl.href !== url) {
linkEl.href = url;
}
}
};

loadWorkspaceFonts();

window.addEventListener('user_preferences_updated', loadWorkspaceFonts);
return () => {
window.removeEventListener('user_preferences_updated', loadWorkspaceFonts);
};
}, [activeWorkspaceId]);

useEffect(() => {
const handleWorkspaceChange = (e: Event) => {
const customEvent = e as CustomEvent<{ workspaceId: string }>;
const nextWsId = customEvent.detail?.workspaceId || getActiveWorkspaceId();
setActiveWorkspaceId(nextWsId);
};
window.addEventListener('active_workspace_changed', handleWorkspaceChange);
return () => {
window.removeEventListener('active_workspace_changed', handleWorkspaceChange);
};
}, []);

const hasLocalUnsavedChangesRef = useRef<boolean>(false);
const markUnsavedChanges = useCallback(() => {
hasLocalUnsavedChangesRef.current = true;
}, []);

useEffect(() => {
const handleQuotaExceeded = () => {
setSaveError('Saved locally (Cloud sync limit reached)');
setIsSavingToFirestore(false);
};
window.addEventListener('firestore_quota_exceeded', handleQuotaExceeded);
return () => {
window.removeEventListener('firestore_quota_exceeded', handleQuotaExceeded);
};
}, []);

useEffect(() => {
if (!user) {
setIsPagesLoaded(false);
return;
}
let isInitial = true;
setIsPagesLoaded(false);
setPages([]);
setCurrentPage(null);
setHistory([]);
setHistoryIndex(0);

const unsubscribe = subscribeToUserPages(
user.uid,
(remotePages, status) => {
if (remotePages) {
if (isInitial) {
setPages(remotePages);
if (remotePages.length > 0) {
setCurrentPage(remotePages[0]);
setHistory([remotePages[0]]);
} else {
(setCurrentPage as any)(null);
setHistory([]);
}
setHistoryIndex(0);
setIsPagesLoaded(true);
isInitial = false;
hasLocalUnsavedChangesRef.current = false;
} else {

setPages((prevPages) => {
const prevHash = JSON.stringify(prevPages.map(computePageContentHash));
const remoteHash = JSON.stringify(remotePages.map(computePageContentHash));
if (prevHash === remoteHash) {
return prevPages;
}

if (currentPage) {
const updatedCurrentPage = remotePages.find(p => p.id === currentPage.id);
if (updatedCurrentPage) {
setCurrentPage(updatedCurrentPage);
}
}
return remotePages;
});
if (remotePages.length === 0) {
(setCurrentPage as any)(null);
}
}
if (isFirestoreQuotaExceeded()) {
setSaveError('Saved locally (Cloud sync limit reached)');
} else {
setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
setSaveError(null);
}
}
},
(err: any) => {
if (
err?.code === 'resource-exhausted' ||
err?.message?.includes('Quota limit exceeded') ||
err?.message?.includes('quota')
) {
setSaveError('Saved locally (Cloud sync limit reached)');
} else if (
err?.code === 'permission-denied' ||
err?.message?.includes('Missing or insufficient permissions')
) {
console.warn('Real-time Firestore sync operating in local-first mode:', err?.message || err);
setSaveError(null);
} else {
console.error('Real-time Firestore sync listener error:', err);
setSaveError('Cloud sync warning');
}
},
activeWorkspaceId
);

loadWebsiteConfigFromFirestore(user.uid, activeWorkspaceId).catch(() => {});
loadUserPreferencesFromFirestore(user.uid).catch(() => {});
loadBrandInfoFromFirestore(user.uid, activeWorkspaceId).catch(() => {});

const unsubPrefs = subscribeToUserPreferences(user.uid, (remotePrefs) => {
const nextMode = remotePrefs.themeSchedule
? calculateActiveTheme(remotePrefs.themeSchedule)
: remotePrefs.themeMode;
if (nextMode && (nextMode === 'light' || nextMode === 'dark')) {
setUiTheme((current) => (current !== nextMode ? nextMode : current));
}
});

if (currentPage) {
const { doc, provider } = getCollaborationProvider(currentPage.id, user.uid, activeWorkspaceId);
setCollab({ doc, provider });
const yPage = doc.getMap<any>('page');
yPage.observe(() => {
const remotePage = yPage.toJSON() as WebsitePage;
if (remotePage) {
setCurrentPage(remotePage);
}
});
}

return () => {
unsubscribe();
unsubPrefs();
if (currentPage) {
cleanupCollaboration(currentPage.id);
}
};

}, [user?.uid, activeWorkspaceId]);

const handleManualSync = useCallback(() => {
if (!user || !pages || pages.length === 0) return;
setIsSavingToFirestore(true);
setSaveError(null);
resetFirestoreQuotaStatus();
saveAllPagesToFirestore(pages, user.uid, true, activeWorkspaceId)
.then(() => {
hasLocalUnsavedChangesRef.current = false;
if (isFirestoreQuotaExceeded()) {
setSaveError('Saved locally (Cloud sync limit reached)');
} else {
setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
setSaveError(null);
}
})
.catch((err) => {
console.error('Manual sync to Firestore failed:', err);
if (isFirestoreQuotaExceeded()) {
setSaveError('Saved locally (Cloud sync limit reached)');
} else {
setSaveError('Cloud sync error. Click to retry.');
}
})
.finally(() => {
setIsSavingToFirestore(false);
});
}, [pages, user, activeWorkspaceId]);

useEffect(() => {

if (!isPagesLoaded || !pages || pages.length === 0 || !user || !hasLocalUnsavedChangesRef.current) return;

const timer = setTimeout(() => {
setIsSavingToFirestore(true);
saveAllPagesToFirestore(pages, user.uid, false, activeWorkspaceId)
.then(() => {
hasLocalUnsavedChangesRef.current = false;
if (isFirestoreQuotaExceeded()) {
setSaveError('Saved locally (Cloud sync limit reached)');
} else {
setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
setSaveError(null);
}
})
.catch((err) => {
console.error('Auto-save to Firestore failed:', err);
if (isFirestoreQuotaExceeded()) {
setSaveError('Saved locally (Cloud sync limit reached)');
} else {
setSaveError('Cloud sync error');
}
})
.finally(() => {
setIsSavingToFirestore(false);
});
}, 1500);

return () => clearTimeout(timer);
}, [pages, user?.uid, isPagesLoaded, activeWorkspaceId]);
const pushState = useCallback((newPage: WebsitePage) => {
markUnsavedChanges();
setCurrentPage(newPage);
setHistory((prev) => {
const updated = prev.slice(0, historyIndex + 1);
return [...updated, newPage];
});
setHistoryIndex((prev) => prev + 1);
setPages((prevPages) => {
const index = prevPages.findIndex((p) => p.id === newPage.id);
if (index >= 0) {
const updated = [...prevPages];
updated[index] = newPage;
return updated;
}
return [newPage, ...prevPages];
});
}, [historyIndex, markUnsavedChanges]);
const handleOpenPage = (pageId: string) => {
const target = pages.find((p) => p.id === pageId) || pages[0];
if (target) {
setCurrentPage(target);
setHistory([target]);
setHistoryIndex(0);
setSelectedContext(null);
setSelectedSectionId(null);
setIsPageSelected(false);
setIsInspectorOpen(false);
setCurrentView('editor');
}
};
const handleCreatePage = (newPage: WebsitePage) => {
markUnsavedChanges();
setPages((prev) => [newPage, ...prev]);
setCurrentPage(newPage);
setHistory([newPage]);
setHistoryIndex(0);
setSelectedContext(null);
setSelectedSectionId(null);
setIsPageSelected(false);
setIsInspectorOpen(false);
setCurrentView('editor');
};
const handleCreatePageFromDashboard = (
title: string,
templateType?: string,
folder?: string,
fileName?: string,
description?: string,
status?: any,
indexing?: 'index' | 'no-index',
passwordProtected?: boolean,
password?: string
) => {
markUnsavedChanges();
const baseTemplate = DEFAULT_BLANK_PAGE;

let pageFileName = fileName ? fileName.trim() : '';
if (pageFileName) {
if (!pageFileName.endsWith('.html') && !pageFileName.includes('.')) {
pageFileName = `${pageFileName}.html`;
}
} else {
pageFileName = pages.length === 0 && !folder ? 'index.html' : `${title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'page'}.html`;
}

const newPage: WebsitePage = {
id: `page-${Date.now().toString(36)}`,
title,
fileName: pageFileName,
folder: folder || '/',
status: status || 'draft',
indexing: indexing || 'index',
passwordProtected: passwordProtected || false,
password: password || '',
globalStyles: { ...baseTemplate.globalStyles },
siteSettings: {
...baseTemplate.siteSettings,
title,
robots: indexing === 'no-index' ? 'noindex, nofollow' : 'index, follow',
description: description || `Custom responsive website page for ${title}.`,
},
sections: templateType === 'blank' ? [] : JSON.parse(JSON.stringify(baseTemplate.sections || [])),
};
setPages((prev) => [newPage, ...prev]);
setCurrentPage(newPage);
setHistory([newPage]);
setHistoryIndex(0);
setSelectedContext(null);
setSelectedSectionId(null);
setIsPageSelected(false);
setIsInspectorOpen(false);
setCurrentView('editor');
};
const handleDuplicatePage = (pageId: string) => {
markUnsavedChanges();
const target = pages.find((p) => p.id === pageId);
if (target) {
const cloned: WebsitePage = JSON.parse(JSON.stringify(target));
cloned.id = `page-${Date.now().toString(36)}`;
cloned.title = `${target.title} (Copy)`;
if (cloned.siteSettings) {
cloned.siteSettings.title = `${cloned.title}`;
}
setPages((prev) => [cloned, ...prev]);
}
};
const handleDeletePage = async (pageId: string) => {
markUnsavedChanges();

const targetPage = pages.find((p) => p.id === pageId);
const filePathToDelete = targetPage
? targetPage.fileName || (targetPage.routePath && targetPage.routePath !== '/' ? `${targetPage.routePath.replace(/^\/+/, '')}.html` : 'index.html')
: null;

try {
await deletePageFromFirestore(pageId, user?.uid, activeWorkspaceId);
} catch (err) {
console.error('Failed to delete page:', err);
}

if (filePathToDelete) {
fetch('/api/github/delete-page', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ filePath: filePathToDelete }),
})
.then((res) => res.json())
.then((data) => {
if (data.success && data.deleted) {
console.log(`Deleted '${data.filePath}' from GitHub repository.`);
}
})
.catch((err) => {
console.warn('Could not auto-delete page file from GitHub:', err);
});
}

let remainingPages: WebsitePage[] = [];
setPages((prev) => {
const remaining = prev.filter((p) => p.id !== pageId);
remainingPages = remaining;
return remaining;
});

if (currentPage && currentPage.id === pageId) {
if (remainingPages.length > 0) {
const next = remainingPages[0];
setCurrentPage(next);
setHistory([next]);
setHistoryIndex(0);
} else {
setCurrentPage(null);
setHistory([]);
setHistoryIndex(0);
setCurrentView('dashboard');
}
}

setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
setSaveError(null);
};
const handleUpdatePageMeta = (
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
) => {
markUnsavedChanges();
setPages((prev) => prev.map((p) => {
if (p.id === pageId) {
const updated: WebsitePage = {
...p,
title,
folder: folder !== undefined ? folder : p.folder,
routePath: routePath !== undefined ? routePath : p.routePath,
status: status !== undefined ? status : p.status,
indexing: indexing !== undefined ? indexing : p.indexing,
passwordProtected: passwordProtected !== undefined ? passwordProtected : p.passwordProtected,
password: password !== undefined ? password : p.password,
fileName: fileName !== undefined ? fileName : p.fileName,
};
if (updated.siteSettings) {
updated.siteSettings = {
...updated.siteSettings,
title,
robots: updated.indexing === 'no-index' ? 'noindex, nofollow' : 'index, follow',
description: description !== undefined ? description : updated.siteSettings.description,
};
}
return updated;
}
return p;
}));
if (currentPage && currentPage.id === pageId) {
setCurrentPage((prev) => {
if (!prev) return prev;
const updated: WebsitePage = {
...prev,
title,
folder: folder !== undefined ? folder : prev.folder,
routePath: routePath !== undefined ? routePath : prev.routePath,
status: status !== undefined ? status : prev.status,
indexing: indexing !== undefined ? indexing : prev.indexing,
passwordProtected: passwordProtected !== undefined ? passwordProtected : prev.passwordProtected,
password: password !== undefined ? password : prev.password,
fileName: fileName !== undefined ? fileName : prev.fileName,
};
if (updated.siteSettings) {
updated.siteSettings = {
...updated.siteSettings,
title,
robots: updated.indexing === 'no-index' ? 'noindex, nofollow' : 'index, follow',
description: description !== undefined ? description : updated.siteSettings.description,
};
}
return updated;
});
}
};
const handleUndo = () => {
if (historyIndex > 0) {
const prevIndex = historyIndex - 1;
setHistoryIndex(prevIndex);
setCurrentPage(history[prevIndex]);
setSelectedContext(null);
setSelectedSectionId(null);
setIsPageSelected(false);
}
};
const handleRedo = () => {
if (historyIndex < history.length - 1) {
const nextIndex = historyIndex + 1;
setHistoryIndex(nextIndex);
setCurrentPage(history[nextIndex]);
setSelectedContext(null);
setSelectedSectionId(null);
setIsPageSelected(false);
}
};

const handleZoomIn = useCallback(() => {
setCustomViewportScale((prev) => Math.min(2.0, Math.round((prev + 0.1) * 100) / 100));
}, []);

const handleZoomOut = useCallback(() => {
setCustomViewportScale((prev) => Math.max(0.25, Math.round((prev - 0.1) * 100) / 100));
}, []);

const handleResetZoom = useCallback(() => {
setCustomViewportScale(1);
}, []);

const handleSetZoomScale = useCallback((scale: number) => {
const clamped = Math.min(2.0, Math.max(0.25, Math.round(scale * 100) / 100));
setCustomViewportScale(clamped);
}, []);

const handleSetViewportMode = useCallback((mode: ViewportMode) => {
setViewportMode(mode);
if (mode === 'responsive') {
setCustomViewportScale(1);
return;
}
const targetWidth = mode === 'desktop' ? 1280 : mode === 'tablet' ? 768 : 390;
const availableWidth = typeof window !== 'undefined' ? window.innerWidth - 64 : 1200;
if (targetWidth > availableWidth) {
const fitScale = Math.max(0.25, Math.floor((availableWidth / targetWidth) * 100) / 100);
setCustomViewportScale(fitScale);
} else {
setCustomViewportScale(1);
}
}, []);

useEffect(() => {
const handleKeyDown = (e: KeyboardEvent) => {
if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
if (e.shiftKey) {
handleRedo();
}
else {
handleUndo();
}
}
else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
handleRedo();
}
else if ((e.metaKey || e.ctrlKey) && (e.key === '=' || e.key === '+')) {
e.preventDefault();
handleZoomIn();
}
else if ((e.metaKey || e.ctrlKey) && e.key === '-') {
e.preventDefault();
handleZoomOut();
}
else if ((e.metaKey || e.ctrlKey) && e.key === '0') {
e.preventDefault();
handleResetZoom();
}
else if (e.key === 'Escape') {
setSelectedContext(null);
setSelectedSectionId(null);
setIsPageSelected(false);
}
};
window.addEventListener('keydown', handleKeyDown);
return () => window.removeEventListener('keydown', handleKeyDown);
}, [historyIndex, history, handleZoomIn, handleZoomOut, handleResetZoom]);
const handleReset = () => {
setIsResetConfirmOpen(true);
};
const executeReset = () => {
pushState(DEFAULT_BLANK_PAGE);
setSelectedContext(null);
setSelectedSectionId(null);
setIsPageSelected(false);
setIsResetConfirmOpen(false);
};
const updateElementInList = (list: WebsiteElement[], updatedElement: WebsiteElement): WebsiteElement[] => {
return list.map((item) => {
if (item.id === updatedElement.id) {
return updatedElement;
}
if (item.children && item.children.length > 0) {
return {
...item,
children: updateElementInList(item.children, updatedElement),
};
}
return item;
});
};
const handleUpdateElement = (updatedElement: WebsiteElement) => {
const updatedSections = currentPage.sections.map((section) => ({
...section,
elements: updateElementInList(section.elements, updatedElement),
}));
const newPage = { ...currentPage, sections: updatedSections };
pushState(newPage);
if (selectedContext) {
setSelectedContext({
...selectedContext,
element: updatedElement,
});
}
};
const deleteElementFromList = (list: WebsiteElement[], elementId: string): WebsiteElement[] => {
const hasField = list.some((item) => item.formFields && item.formFields.some((f) => f.id === elementId));
if (hasField) {
return list.map((item) => {
if (item.formFields && item.formFields.some((f) => f.id === elementId)) {
return {
...item,
formFields: item.formFields.filter((f) => f.id !== elementId),
};
}
return item;
});
}
return list
.filter((item) => item.id !== elementId)
.map((item) => {
if (item.children && item.children.length > 0) {
return {
...item,
children: deleteElementFromList(item.children, elementId),
};
}
return item;
});
};
const handleDeleteElement = (elementId: string) => {
const updatedSections = currentPage.sections.map((section) => ({
...section,
elements: deleteElementFromList(section.elements, elementId),
}));
const newPage = { ...currentPage, sections: updatedSections };
pushState(newPage);
setSelectedContext(null);
};
const handleMoveElement = (sectionId: string, elementId: string, direction: 'up' | 'down') => {
const updatedSections = currentPage.sections.map((sec) => {
if (sec.id !== sectionId)
return sec;
const index = sec.elements.findIndex((e) => e.id === elementId);
if (index < 0)
return sec;
const targetIndex = direction === 'up' ? index - 1 : index + 1;
if (targetIndex < 0 || targetIndex >= sec.elements.length)
return sec;
const newElements = [...sec.elements];
const [moved] = newElements.splice(index, 1);
newElements.splice(targetIndex, 0, moved);
return { ...sec, elements: newElements };
});
pushState({ ...currentPage, sections: updatedSections });
};
const handleDuplicateElement = (sectionId: string, elementId: string) => {
const updatedSections = currentPage.sections.map((sec) => {
if (sec.id !== sectionId)
return sec;
const index = sec.elements.findIndex((e) => e.id === elementId);
if (index < 0)
return sec;
const el = sec.elements[index];
const dup: WebsiteElement = {
...el,
id: `${el.type}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
label: `${el.label || el.type} (Copy)`,
};
const newElements = [...sec.elements];
newElements.splice(index + 1, 0, dup);
return { ...sec, elements: newElements };
});
pushState({ ...currentPage, sections: updatedSections });
};
const handleOpenElementEditBox = (ctx: SelectedElementContext) => {
setSelectedSectionId(null);
setIsPageSelected(false);
setSelectedContext(ctx);
setIsInspectorOpen(true);
};
const handleSelectSection = (section: WebsiteSection) => {
setSelectedContext(null);
setIsPageSelected(false);
if (section.id.startsWith('blank-section-') && !currentPage.sections.some((s) => s.id === section.id)) {
const isLight = uiTheme === 'light';
const newId = `section-${Date.now()}`;
const newSection: WebsiteSection = {
...section,
id: newId,
type: 'custom',
title: 'Custom Section',
styles: {
backgroundColor: isLight ? '#ffffff' : '#0f172a',
textColor: isLight ? '#0f172a' : '#ffffff',
paddingY: 64,
paddingX: 24,
maxWidth: '7xl',
layoutColumns: '1',
...(section.styles || {}),
},
elements: [],
};
const footerIndex = currentPage.sections.findIndex((s) => s.type === 'footer');
const updatedSections = [...currentPage.sections];
if (footerIndex >= 0) {
updatedSections.splice(footerIndex, 0, newSection);
} else {
updatedSections.push(newSection);
}
setSelectedSectionId(newId);
pushState({ ...currentPage, sections: updatedSections });
return;
}
setSelectedSectionId(section.id);
};
const handleOpenSectionEditBox = (section: WebsiteSection) => {
setSelectedContext(null);
setIsPageSelected(false);
setSelectedSectionId(section.id);
setIsInspectorOpen(true);
};
const handleUpdateSection = (updatedSection: WebsiteSection) => {
const exists = currentPage.sections.some((sec) => sec.id === updatedSection.id);
if (exists) {
const updatedSections = currentPage.sections.map((sec) => sec.id === updatedSection.id ? updatedSection : sec);
pushState({ ...currentPage, sections: updatedSections });
} else {
if (updatedSection.type === 'header') {
const nonHeaders = currentPage.sections.filter((s) => s.type !== 'header');
pushState({
...currentPage,
sections: [updatedSection, ...nonHeaders],
});
} else if (updatedSection.type === 'footer') {
const nonFooters = currentPage.sections.filter((s) => s.type !== 'footer');
pushState({
...currentPage,
sections: [...nonFooters, updatedSection],
});
} else {
pushState({
...currentPage,
sections: [...currentPage.sections, updatedSection],
});
}
}
};
const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
const index = currentPage.sections.findIndex((s) => s.id === sectionId);
if (index < 0)
return;
const section = currentPage.sections[index];
if (section.type === 'header' || section.type === 'hero' || section.type === 'footer') {
return;
}
const targetIndex = direction === 'up' ? index - 1 : index + 1;
if (targetIndex < 0 || targetIndex >= currentPage.sections.length)
return;
const targetSection = currentPage.sections[targetIndex];
if (targetSection.type === 'header' || targetSection.type === 'hero' || targetSection.type === 'footer') {
return;
}
const newSections = [...currentPage.sections];
const [moved] = newSections.splice(index, 1);
newSections.splice(targetIndex, 0, moved);
pushState({ ...currentPage, sections: newSections });
};
const handleToggleHideSection = (sectionId: string) => {
const updatedSections = currentPage.sections.map((sec) => sec.id === sectionId ? { ...sec, hidden: !sec.hidden } : sec);
pushState({ ...currentPage, sections: updatedSections });
};
const handleDuplicateSection = (sectionId: string) => {
const section = currentPage.sections.find((s) => s.id === sectionId);
if (!section)
return;
const duplicatedSection: WebsiteSection = {
...section,
id: `${section.type}-${Date.now()}`,
title: `${section.title} (Copy)`,
elements: section.elements.map((el) => ({
...el,
id: `${el.type}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
})),
};
const index = currentPage.sections.findIndex((s) => s.id === sectionId);
const newSections = [...currentPage.sections];
newSections.splice(index + 1, 0, duplicatedSection);
pushState({ ...currentPage, sections: newSections });
};
const handleDeleteSection = (sectionId: string) => {
if (currentPage.sections.length <= 1) {
alert('Your website must have at least one section.');
return;
}
const newSections = currentPage.sections.filter((s) => s.id !== sectionId);
pushState({ ...currentPage, sections: newSections });
setSelectedSectionId(null);
};
const handleAddSection = (newSection: WebsiteSection) => {
if (newSection.type === 'header') {
const nonHeaders = currentPage.sections.filter((s) => s.type !== 'header');
pushState({
...currentPage,
sections: [newSection, ...nonHeaders],
});
setSelectedSectionId(newSection.id);
setSelectedContext(null);
setTimeout(() => {
const sectionEl = document.getElementById(newSection.anchorId || newSection.id) ||
document.getElementById(newSection.id) ||
document.querySelector(`[data-section-id="${newSection.id}"]`);
if (sectionEl) {
sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
}, 80);
return;
}
if (newSection.type === 'footer') {
const nonFooters = currentPage.sections.filter((s) => s.type !== 'footer');
pushState({
...currentPage,
sections: [...nonFooters, newSection],
});
setSelectedSectionId(newSection.id);
setSelectedContext(null);
setTimeout(() => {
const sectionEl = document.getElementById(newSection.anchorId || newSection.id) ||
document.getElementById(newSection.id) ||
document.querySelector(`[data-section-id="${newSection.id}"]`);
if (sectionEl) {
sectionEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
}
}, 80);
return;
}
const newSections = [...currentPage.sections];
const footerIndex = newSections.findIndex((s) => s.type === 'footer');
if (selectedSectionId) {
const selectedIndex = newSections.findIndex((s) => s.id === selectedSectionId);
if (selectedIndex >= 0 && selectedIndex !== footerIndex) {
newSections.splice(selectedIndex + 1, 0, newSection);
}
else if (footerIndex >= 0) {
newSections.splice(footerIndex, 0, newSection);
}
else {
newSections.push(newSection);
}
}
else if (footerIndex >= 0) {
newSections.splice(footerIndex, 0, newSection);
}
else {
newSections.push(newSection);
}
pushState({
...currentPage,
sections: newSections,
});
setSelectedSectionId(newSection.id);
setSelectedContext(null);
setTimeout(() => {
const sectionEl = document.getElementById(newSection.anchorId || newSection.id) ||
document.getElementById(newSection.id) ||
document.querySelector(`[data-section-id="${newSection.id}"]`);
if (sectionEl) {
sectionEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
}, 80);
};
const addElementToNestedParent = (elements: WebsiteElement[], parentId: string, newElement: WebsiteElement): WebsiteElement[] => {
return elements.map((el) => {
if (el.id === parentId) {
return {
...el,
children: [...(el.children || []), newElement],
};
}
if (el.children && el.children.length > 0) {
return {
...el,
children: addElementToNestedParent(el.children, parentId, newElement),
};
}
return el;
});
};
const handleAddNewBlankSection = () => {
const isLight = uiTheme === 'light';
const id = Date.now();
const blankSection: WebsiteSection = {
id: `section-${id}`,
type: 'custom',
title: 'Custom Section',
styles: {
backgroundColor: isLight ? '#ffffff' : '#0f172a',
textColor: isLight ? '#0f172a' : '#ffffff',
paddingY: 64,
paddingX: 24,
maxWidth: '7xl',
},
elements: [],
};
handleAddSection(blankSection);
};
const handleAddPreset = (sectionId: string, elements: WebsiteElement[], sectionStyles?: any) => {
const sectionExists = currentPage.sections.some((s) => s.id === sectionId);
let updatedSections: WebsiteSection[];

if (!sectionExists) {
const isLight = uiTheme === 'light';
const newBlankSection: WebsiteSection = {
id: sectionId.startsWith('blank-section-') ? `section-${Date.now()}` : sectionId,
type: 'custom',
title: 'Custom Section',
styles: {
backgroundColor: isLight ? '#ffffff' : '#0f172a',
textColor: isLight ? '#0f172a' : '#ffffff',
paddingY: 64,
paddingX: 24,
maxWidth: '7xl',
...(sectionStyles || {}),
},
elements: elements,
};
const footerIndex = currentPage.sections.findIndex((s) => s.type === 'footer');
updatedSections = [...currentPage.sections];
if (footerIndex >= 0) {
updatedSections.splice(footerIndex, 0, newBlankSection);
} else {
updatedSections.push(newBlankSection);
}
} else {
updatedSections = currentPage.sections.map((section) => {
if (section.id === sectionId) {
return {
...section,
elements: [...section.elements, ...elements],
styles: {
...section.styles,
...(sectionStyles || {}),
},
};
}
return section;
});
}
pushState({ ...currentPage, sections: updatedSections });
};
const handleAddLayout = (sectionId: string, columnsCount: '1' | '2' | '3' | '4' | 'flex' | 'flex-wrap') => {
const isFlex = columnsCount === 'flex' || columnsCount === 'flex-wrap';
const count = isFlex ? 2 : parseInt(columnsCount, 10);
const columnCards: WebsiteElement[] = Array.from({ length: count }, (_, i) => ({
id: `col-card-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
type: 'card',
label: isFlex ? `Flex Item ${i + 1}` : count === 1 ? 'Column Container' : `Column Container ${i + 1}`,
styles: {
backgroundColor: 'transparent',
borderColor: 'transparent',
paddingTop: 16,
paddingBottom: 16,
paddingLeft: 16,
paddingRight: 16,
flex: isFlex ? '1 1 0%' : undefined,
width: '100%',
},
children: [],
}));
const gridElement: WebsiteElement = {
id: `grid-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
type: 'grid',
label: isFlex ? 'Flex Layout' : count === 1 ? '1 Column Layout' : `${count} Column Grid`,
styles: {
layoutColumns: columnsCount,
gap: 24,
paddingTop: 0,
paddingBottom: 0,
width: '100%',
},
children: columnCards,
};

const sectionExists = currentPage.sections.some((s) => s.id === sectionId);
let updatedSections: WebsiteSection[];

if (!sectionExists) {
const isLight = uiTheme === 'light';
const newBlankSection: WebsiteSection = {
id: sectionId.startsWith('blank-section-') ? `section-${Date.now()}` : sectionId,
type: 'custom',
title: 'Custom Section',
styles: {
backgroundColor: isLight ? '#ffffff' : '#0f172a',
textColor: isLight ? '#0f172a' : '#ffffff',
paddingY: 64,
paddingX: 24,
maxWidth: '7xl',
layoutColumns: '1',
},
elements: [gridElement],
};
const footerIndex = currentPage.sections.findIndex((s) => s.type === 'footer');
updatedSections = [...currentPage.sections];
if (footerIndex >= 0) {
updatedSections.splice(footerIndex, 0, newBlankSection);
} else {
updatedSections.push(newBlankSection);
}
} else {
updatedSections = currentPage.sections.map((section) => {
if (section.id === sectionId) {
return {
...section,
styles: {
...section.styles,
layoutColumns: section.elements.length === 0 ? '1' : (section.styles?.layoutColumns || '1'),
},
elements: [...section.elements, gridElement],
};
}
return section;
});
}
pushState({ ...currentPage, sections: updatedSections });
};
const handleAddElementToSection = (sectionId: string, newElement: WebsiteElement, parentId?: string | null) => {
let extraElements: WebsiteElement[] = [];

const globalFont = currentPage.globalStyles?.fontFamily || 'Plus Jakarta Sans';
const applyGlobalFont = (el: WebsiteElement): WebsiteElement => {
const tf = el.styles?.typeface;
const fontToUse = (!tf || tf === 'Roboto' || tf === 'Inter' || tf === 'Plus Jakarta Sans') ? globalFont : tf;
return {
...el,
styles: {
...(el.styles || {}),
typeface: fontToUse,
},
...(el.children ? { children: el.children.map(applyGlobalFont) } : {}),
};
};

const processedElement = newElement;

const sectionExists = currentPage.sections.some((s) => s.id === sectionId);
let updatedSections: WebsiteSection[];

if (!sectionExists) {
const isLight = uiTheme === 'light';
const newBlankSection: WebsiteSection = {
id: sectionId.startsWith('blank-section-') ? `section-${Date.now()}` : sectionId,
type: 'custom',
title: 'Custom Section',
styles: {
backgroundColor: isLight ? '#ffffff' : '#0f172a',
textColor: isLight ? '#0f172a' : '#ffffff',
paddingY: 64,
paddingX: 24,
maxWidth: '7xl',
},
elements: [processedElement, ...extraElements],
};
const footerIndex = currentPage.sections.findIndex((s) => s.type === 'footer');
updatedSections = [...currentPage.sections];
if (footerIndex >= 0) {
updatedSections.splice(footerIndex, 0, newBlankSection);
} else {
updatedSections.push(newBlankSection);
}
} else {
updatedSections = currentPage.sections.map((section) => {
if (section.id !== sectionId)
return section;
if (parentId) {
return {
...section,
elements: addElementToNestedParent(section.elements, parentId, processedElement),
};
}
else {
return {
...section,
elements: [...section.elements, processedElement, ...extraElements],
};
}
});
}
pushState({ ...currentPage, sections: updatedSections });
};
const handleUpdatePageStyles = (globalStyles: WebsitePage['globalStyles'], title?: string, fileName?: string) => {
const defaultCurrentFileName = currentPage.fileName || `${(currentPage.title || 'page').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'index'}.html`;
const newFileName = fileName !== undefined
? (fileName.trim() ? (fileName.trim().endsWith('.html') || fileName.trim().includes('.') ? fileName.trim() : `${fileName.trim()}.html`) : '')
: currentPage.fileName;

const prevFileName = (fileName !== undefined && newFileName && newFileName !== defaultCurrentFileName)
? defaultCurrentFileName
: currentPage.previousFileName;

pushState({
...currentPage,
title: title !== undefined ? title : currentPage.title,
fileName: newFileName,
previousFileName: prevFileName,
globalStyles: {
...(currentPage.globalStyles || {}),
...globalStyles,
},
});
};
const handleSaveSiteSettings = (settings: SiteSettings) => {
pushState({
...currentPage,
title: settings.title || currentPage.title,
siteSettings: settings,
});
};

const handleApplyPaletteToPages = (primaryColor: string, backgroundColor: string) => {
markUnsavedChanges();
setPages((prev) =>
prev.map((p) => ({
...p,
globalStyles: {
...(p.globalStyles || {}),
primaryColor,
backgroundColor,
},
}))
);
setCurrentPage((prev) => ({
...prev,
globalStyles: {
...(prev.globalStyles || {}),
primaryColor,
backgroundColor,
},
}));
};

const selectedSection = selectedSectionId && !selectedContext
? currentPage.sections.find((s) => s.id === selectedSectionId) || null
: null;
const isLight = uiTheme === 'light';
if (loading) {
return (
<div className={`min-h-screen flex flex-col items-center justify-center ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
<div className="flex flex-col items-center justify-center">
<ThreeDotLoading className="text-indigo-500 scale-150" />
</div>
</div>
);
}
if (!user) {
return (<AuthLayout uiTheme={uiTheme} onToggleUiTheme={toggleUiTheme}/>);
}
if (currentView === 'editor' && !currentPage) {
return (<DashboardLayout pages={pages} activePageId="" onSelectPage={handleOpenPage} onOpenEditor={() => setCurrentView('editor')} onCreatePage={handleCreatePageFromDashboard} onDuplicatePage={handleDuplicatePage} onDeletePage={handleDeletePage} onUpdatePageMeta={handleUpdatePageMeta} onApplyPaletteToWebsite={handleApplyPaletteToPages} uiTheme={uiTheme} onToggleUiTheme={toggleUiTheme} onSetUiTheme={handleSetUiTheme} currentTab={dashboardTab} onSelectTab={handleSelectDashboardTab}/>);
}
if (currentView === 'dashboard') {
return (<DashboardLayout pages={pages} activePageId={currentPage?.id || ''} onSelectPage={handleOpenPage} onOpenEditor={() => setCurrentView('editor')} onCreatePage={handleCreatePageFromDashboard} onDuplicatePage={handleDuplicatePage} onDeletePage={handleDeletePage} onUpdatePageMeta={handleUpdatePageMeta} onApplyPaletteToWebsite={handleApplyPaletteToPages} uiTheme={uiTheme} onToggleUiTheme={toggleUiTheme} onSetUiTheme={handleSetUiTheme} currentTab={dashboardTab} onSelectTab={handleSelectDashboardTab}/>);
}
return (<div className={`min-h-screen flex flex-col font-sans transition-colors selection:bg-indigo-500 selection:text-white ${isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
<Navbar currentPage={currentPage} editorMode={editorMode} onSetEditorMode={setEditorMode} viewportMode={viewportMode} onSetViewportMode={handleSetViewportMode} zoomScale={customViewportScale} onSetZoomScale={handleSetZoomScale} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onResetZoom={handleResetZoom} canUndo={historyIndex > 0} canRedo={historyIndex < history.length - 1} onUndo={handleUndo} onRedo={handleRedo} onOpenAddSection={handleAddNewBlankSection} onOpenExportModal={() => setIsExportOpen(true)} onOpenTagModal={(category) => {
setTagCategory(category);
setIsSiteSettingsOpen(true);
}} onOpenPageOutline={() => setIsPageOutlineOpen(true)} onSelectPageSettings={(tab = 'all') => {
setSelectedContext(null);
setSelectedSectionId(null);
setIsPageSelected(true);
setPageSettingsTab(tab);
setIsInspectorOpen(true);
}} onReset={handleReset} onUpdatePageStyles={handleUpdatePageStyles} uiTheme={uiTheme} onToggleUiTheme={toggleUiTheme} pages={pages} onSelectPage={handleOpenPage} onDeletePage={handleDeletePage} onCreatePage={handleCreatePage} onDuplicatePage={handleDuplicatePage} onBackToDashboard={() => setCurrentView('dashboard')} selectedContext={selectedContext} onUpdateElement={handleUpdateElement} onDeselectElement={() => {
setSelectedContext(null);
setIsInspectorOpen(false);
}} selectedSectionId={selectedSectionId} onUpdateSection={handleUpdateSection} onSelectSection={handleSelectSection} onOpenSectionEditBox={handleOpenSectionEditBox} onMoveSection={handleMoveSection} onDuplicateSection={handleDuplicateSection} onDeleteSection={handleDeleteSection} onDeleteElement={handleDeleteElement} onMoveElement={handleMoveElement} onDuplicateElement={handleDuplicateElement} onAddElementToSection={(secId) => {
setAddElementSectionId(secId);
setAddElementParentId(null);
}} onSelectElement={(ctx) => {
setSelectedSectionId(null);
setIsPageSelected(false);
setSelectedContext(ctx);
setIsInspectorOpen(true);
}} onDeselectSection={() => {
setSelectedSectionId(null);
setIsInspectorOpen(false);
}} />

{editorMode === 'code' ? (<div className="flex-1 p-6 max-w-6xl mx-auto w-full flex flex-col gap-4">
<div className={`flex items-center justify-between p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
<div>
<h2 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
Live Generated HTML Code
</h2>
<p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
Pure HTML + CSS markup ready for production deployment
</p>
</div>
<div className="flex items-center gap-2">
<button onClick={() => {
navigator.clipboard.writeText(generateFullHtml(currentPage));
setCopiedCode(true);
setTimeout(() => setCopiedCode(false), 2000);
}} className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors">
{copiedCode ? <Check className="w-4 h-4 text-emerald-400"/> : <Copy className="w-4 h-4"/>}
{copiedCode ? 'Copied to Clipboard!' : 'Copy Source Code'}
</button>
<button onClick={() => setEditorMode('edit')} className={`p-2 rounded-lg border transition-colors cursor-pointer ${isLight
? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
: 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'}`} title="Close source code view" aria-label="Close source code view">
<X className="w-4 h-4"/>
</button>
</div>
</div>
<div className={`rounded-xl border p-4 overflow-auto font-mono text-xs max-h-[70vh] ${isLight
? 'bg-slate-50 border-slate-200 text-slate-800 selection:bg-indigo-100 selection:text-indigo-900'
: 'bg-slate-900 border-slate-800 text-indigo-200 selection:bg-indigo-500 selection:text-white'}`}>
<pre className="whitespace-pre-wrap">{generateFullHtml(currentPage)}</pre>
</div>
</div>) : (<div className="flex-1 flex relative overflow-hidden">
<Canvas onSelectPageSettings={() => {
setSelectedContext(null);
setSelectedSectionId(null);
setIsPageSelected(true);
setIsInspectorOpen(true);
}} onUpdateSection={handleUpdateSection} page={currentPage} selectedContext={selectedContext} selectedSectionId={selectedSectionId} editorMode={editorMode} viewportMode={viewportMode} uiTheme={uiTheme} zoomScale={customViewportScale} onSetZoomScale={handleSetZoomScale} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onResetZoom={handleResetZoom} onSelectElement={(ctx) => {
setSelectedSectionId(null);
setIsPageSelected(false);
setSelectedContext(ctx);
setIsInspectorOpen(true);
}} onOpenElementEditBox={handleOpenElementEditBox} onSelectSection={handleSelectSection} onOpenSectionEditBox={handleOpenSectionEditBox} onDeselect={() => {
setSelectedContext(null);
setSelectedSectionId(null);
setIsPageSelected(false);
setIsInspectorOpen(false);
}} onUpdateElement={handleUpdateElement} onMoveElement={handleMoveElement} onDuplicateElement={handleDuplicateElement} onDeleteElement={handleDeleteElement} onMoveSection={handleMoveSection} onDuplicateSection={handleDuplicateSection} onDeleteSection={handleDeleteSection} onAddElementToSection={(secId) => {
setAddElementSectionId(secId);
setAddElementParentId(null);
}} onAddElementToColumn={(secId, parentId) => {
setAddElementSectionId(secId);
setAddElementParentId(parentId);
}} onAddSection={handleAddSection} onOpenTagModal={(category) => {
setTagCategory(category);
setIsSiteSettingsOpen(true);
}}/>

{editorMode === 'edit' && isInspectorOpen && (selectedContext || selectedSection || isPageSelected) && (<PropertiesPanel selectedContext={selectedContext} selectedSection={selectedSection} isPageSelected={isPageSelected} page={currentPage} onSelectContext={setSelectedContext} onUpdateElement={handleUpdateElement} onDeleteElement={handleDeleteElement} onMoveElement={handleMoveElement} onDuplicateElement={handleDuplicateElement} onUpdateSection={handleUpdateSection} onDeleteSection={handleDeleteSection} onUpdatePageStyles={handleUpdatePageStyles} onOpenSiteSettings={() => setIsSiteSettingsOpen(true)} onClose={() => {
setIsInspectorOpen(false);
setSelectedContext(null);
setSelectedSectionId(null);
setIsPageSelected(false);
}} viewportMode={viewportMode} uiTheme={uiTheme} pageSettingsTab={pageSettingsTab} onSelectPageSettingsTab={setPageSettingsTab}/>)}
</div>)}

<AddSectionModal isOpen={isAddSectionOpen} onClose={() => setIsAddSectionOpen(false)} onAddSection={handleAddSection} uiTheme={uiTheme}/>

<AddElementModal isOpen={Boolean(addElementSectionId)} sectionId={addElementSectionId} parentId={addElementParentId} allowedTypes={addElementParentId && currentPage
? (() => {
const findInlineParent = (elements: WebsiteElement[]): boolean => {
for (const el of elements) {
if (el.id === addElementParentId && el.type === 'inline')
return true;
if (el.children && findInlineParent(el.children))
return true;
}
return false;
};
for (const sec of currentPage.sections) {
if (sec.elements && findInlineParent(sec.elements)) {
return ['span', 'image', 'icon', 'button'];
}
}
return undefined;
})()
: undefined} onClose={() => {
setAddElementSectionId(null);
setAddElementParentId(null);
}} onAddElement={handleAddElementToSection} onAddPreset={handleAddPreset} onAddLayout={handleAddLayout} uiTheme={uiTheme} globalFontFamily={currentPage?.globalStyles?.fontFamily || 'Plus Jakarta Sans'}/>

<ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} page={currentPage} uiTheme={uiTheme}/>

<TagsPanel isOpen={isSiteSettingsOpen} tagType={tagCategory || 'meta'} onClose={() => setIsSiteSettingsOpen(false)} page={currentPage} onUpdateSiteSettings={handleSaveSiteSettings} uiTheme={uiTheme}/>

{isPageOutlineOpen && (<OutlineModal sections={currentPage.sections} onClose={() => setIsPageOutlineOpen(false)} onMoveSection={handleMoveSection} onToggleHideSection={handleToggleHideSection} onSelectSection={(secId) => {
setSelectedContext(null);
setIsPageSelected(false);
setSelectedSectionId(secId);
setIsInspectorOpen(true);
}} onSelectElement={(secId, element) => {
setSelectedSectionId(secId);
setSelectedContext({ sectionId: secId, element, rect: null });
setIsPageSelected(false);
setIsInspectorOpen(true);
}} uiTheme={uiTheme}/>)}

{isResetConfirmOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
<div className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150 ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'}`}>
<div className="flex items-center gap-3 border-b border-slate-700/30 pb-3">
<div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg shrink-0">
<RotateCcw className="w-5 h-5"/>
</div>
<div>
<h3 className="text-sm font-bold">Reset Canvas Template</h3>
<p className="text-[10px] text-slate-400">All current custom pages and modifications will be cleared.</p>
</div>
</div>

<p className="text-xs">
Are you sure you want to reset this page to the default template? Your unsaved custom sections and styles on this page will be replaced by the clean starter template.
</p>

<div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/30">
<button type="button" onClick={() => setIsResetConfirmOpen(false)} className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>
Cancel
</button>
<button type="button" onClick={executeReset} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer shadow-md transition-all">
Yes, Reset Template
</button>
</div>
</div>
</div>)}
</div>);
}
