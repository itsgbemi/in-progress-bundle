import React, { useState, useRef, useEffect } from 'react';
import { WebsitePage, CMSCollection, CMSItem, CMSField } from '../../../../types';
import { useAuth } from '../../../../context/AuthContext';
import {
  subscribeToCMSCollections,
  saveCMSCollection,
  deleteCMSCollection,
  subscribeToCMSItems,
  saveCMSItem,
  deleteCMSItem
} from '../../../../services/cmsService';
import {
  saveUserPreferences,
  loadUserPreferencesFromFirestore,
  subscribeToUserPreferences,
  getLocalDashboardPreferences
} from '../../../../services/userPreferencesService';
import { getActiveWorkspaceId } from '../../../../services/workspaceService';
import { WebpageSnapshotCard } from './WebpageSnapshotCard';
import { EmptyState } from '../../../common/EmptyState';
import { Input, SearchInput, Select, ImageInputWithMediaPicker, FilterButton, CheckCircle } from '../../../common';
import {
  Globe,
  Plus,
  Search,
  LayoutGrid,
  List as ListIcon,
  Pencil,
  Copy,
  Trash2,
  Eye,
  FolderGit2,
  Check,
  Lock,
  Calendar,
  Database,
  Layers,
  Sparkles,
  FileText,
  Tag,
  Settings,
  X,
  ChevronDown,
  FolderPlus,
  CheckSquare,
  Square,
  AlertTriangle,
  CheckCircle2,
  Circle,
  MoreVertical,
  ArrowLeft,
  ChevronRight,
  ArrowUpDown,
  Filter
} from 'lucide-react';

interface WebpagesProps {
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
  onUpdatePageMeta: (pageId: string, title: string, description?: string, folder?: string, routePath?: string, status?: any, indexing?: 'index' | 'no-index', passwordProtected?: boolean, password?: string, fileName?: string) => void;
  onPreviewPage: (page: WebsitePage) => void;
  onPublishPageToGitHub?: (page: WebsitePage) => void;
  uiTheme: 'dark' | 'light';
}

export const Webpages: React.FC<WebpagesProps> = ({
  pages,
  onOpenPageInEditor,
  onCreateNewPage,
  onDuplicatePage,
  onDeletePage,
  onUpdatePageMeta,
  onPreviewPage,
  onPublishPageToGitHub,
  uiTheme,
}) => {
  const { user } = useAuth();
  const userId = user?.uid;
  const isLight = uiTheme === 'light';

  const activeTab = 'pages';

  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
  const createDropdownRef = useRef<HTMLDivElement>(null);

  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const [openMenuPageId, setOpenMenuPageId] = useState<string | null>(null);
  const rowMenuRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const initialPrefs = getLocalDashboardPreferences();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => initialPrefs.webpagesViewMode || 'grid');
  const [sortBy] = useState<'title-asc' | 'title-desc' | 'name-asc' | 'newest' | 'oldest'>('title-asc');
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(() => getActiveWorkspaceId());

  const isFolderCollapsed = (folderKey: string) => {
    if (collapsedFolders[folderKey] !== undefined) {
      return collapsedFolders[folderKey];
    }
    return folderKey !== '/';
  };

  const toggleFolderCollapse = (folderKey: string) => {
    setCollapsedFolders((prev) => {
      const current = prev[folderKey] !== undefined ? prev[folderKey] : (folderKey !== '/');
      return {
        ...prev,
        [folderKey]: !current,
      };
    });
  };

  useEffect(() => {
    const handleWsChange = () => {
      setActiveWorkspaceId(getActiveWorkspaceId());
    };
    window.addEventListener('active_workspace_changed', handleWsChange);
    return () => window.removeEventListener('active_workspace_changed', handleWsChange);
  }, []);

  const [customFolders, setCustomFolders] = useState<string[]>(() => {
    try {
      const perWs = localStorage.getItem(`webpages_custom_folders_${activeWorkspaceId}`);
      if (perWs) return JSON.parse(perWs);
      const global = localStorage.getItem('webpages_custom_folders');
      return global ? JSON.parse(global) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const perWs = localStorage.getItem(`webpages_custom_folders_${activeWorkspaceId}`);
      if (perWs) {
        setCustomFolders(JSON.parse(perWs));
        return;
      }
      const global = localStorage.getItem('webpages_custom_folders');
      if (global) setCustomFolders(JSON.parse(global));
    } catch {}
  }, [activeWorkspaceId]);

  const handleAddFolder = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    let path = trimmed.startsWith('/') ? trimmed : '/' + trimmed;
    path = path.replace(/\/+$/, '') || '/';
    if (path === '/') return;

    setCustomFolders((prev) => {
      if (prev.includes(path)) return prev;
      const next = [...prev, path];
      try {
        localStorage.setItem(`webpages_custom_folders_${activeWorkspaceId}`, JSON.stringify(next));
        localStorage.setItem('webpages_custom_folders', JSON.stringify(next));
      } catch {}
      return next;
    });

    setCollapsedFolders((prev) => ({
      ...prev,
      [path]: false,
    }));

    if (userId) {
      saveUserPreferences(userId, {
        webpagesCustomFolders: Array.from(new Set([...customFolders, path])),
      }).catch(() => {});
    }
  };

  const handleDeleteCustomFolder = (folderName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCustomFolders((prev) => {
      const next = prev.filter((f) => f !== folderName);
      try {
        localStorage.setItem(`webpages_custom_folders_${activeWorkspaceId}`, JSON.stringify(next));
        localStorage.setItem('webpages_custom_folders', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);
  const [isMultiSelectActive, setIsMultiSelectActive] = useState(false);
  const [isSelectMultipleMenuOpen, setIsSelectMultipleMenuOpen] = useState(false);
  const selectMultipleMenuRef = useRef<HTMLDivElement>(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [bulkActionSuccess, setBulkActionSuccess] = useState<string | null>(null);

  const [editingPage, setEditingPage] = useState<WebsitePage | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editFolder, setEditFolder] = useState('/');
  const [editRoute, setEditRoute] = useState('');
  const [editFileName, setEditFileName] = useState('');
  const [editStatus, setEditStatus] = useState<'draft' | 'published' | 'scheduled' | 'archived'>('draft');
  const [editIndexing, setEditIndexing] = useState<'index' | 'no-index'>('index');
  const [editPasswordProtected, setEditPasswordProtected] = useState(false);
  const [editPassword, setEditPassword] = useState('');
  const [pageToDelete, setPageToDelete] = useState<WebsitePage | null>(null);

  useEffect(() => {
    if (!userId) return;
    const unsub = subscribeToUserPreferences(userId, (prefs) => {
      if (prefs.webpagesViewMode) setViewMode(prefs.webpagesViewMode);
    });
    return () => unsub();
  }, [userId]);

  const handleSetViewMode = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    saveUserPreferences(userId, { webpagesViewMode: mode }).catch(() => {});
  };

  const [collections, setCollections] = useState<CMSCollection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<CMSCollection | null>(null);
  const [cmsItems, setCmsItems] = useState<CMSItem[]>([]);
  const [showCreateCollectionModal, setShowCreateCollectionModal] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColSlug, setNewColSlug] = useState('');
  const [newColDesc, setNewColDesc] = useState('');

  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CMSItem | null>(null);
  const [itemTitle, setItemTitle] = useState('');
  const [itemSlug, setItemSlug] = useState('');
  const [itemStatus, setItemStatus] = useState<'draft' | 'published' | 'archived'>('published');
  const [itemData, setItemData] = useState<Record<string, any>>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (createDropdownRef.current && !createDropdownRef.current.contains(event.target as Node)) {
        setIsCreateDropdownOpen(false);
      }
      if (rowMenuRef.current && !rowMenuRef.current.contains(event.target as Node)) {
        setOpenMenuPageId(null);
      }
      if (selectMultipleMenuRef.current && !selectMultipleMenuRef.current.contains(event.target as Node)) {
        setIsSelectMultipleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!userId) return;
    const unsub = subscribeToCMSCollections(userId, (cols) => {
      setCollections(cols);
      if (cols.length > 0 && !selectedCollection) {
        setSelectedCollection(cols[0]);
      } else if (cols.length === 0) {
        setSelectedCollection(null);
      }
    }, activeWorkspaceId);
    return () => unsub();
  }, [userId, activeWorkspaceId]);

  useEffect(() => {
    if (!userId || !selectedCollection) {
      setCmsItems([]);
      return;
    }
    const unsub = subscribeToCMSItems(userId, selectedCollection.id, (items) => {
      setCmsItems(items);
    }, activeWorkspaceId);
    return () => unsub();
  }, [userId, selectedCollection?.id, activeWorkspaceId]);

  const foldersList = Array.from(
    new Set([
      ...customFolders,
      ...pages
        .map((p) => p.folder)
        .filter((f): f is string => Boolean(f) && f !== '/' && f.trim() !== '')
    ])
  ).sort((a, b) => a.localeCompare(b));
  const availableFolders = Array.from(new Set(['/', ...foldersList]));
  const allFolderSections = ['/', ...foldersList];

  const filteredPages = pages.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.routePath && p.routePath.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.fileName && p.fileName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.siteSettings?.description && p.siteSettings.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const sortedAndFilteredPages = [...filteredPages].sort((a, b) => {
    if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
    if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
    if (sortBy === 'name-asc') return (a.fileName || a.title).localeCompare(b.fileName || b.title);
    if (sortBy === 'newest') return (b.createdAt || 0) - (a.createdAt || 0);
    if (sortBy === 'oldest') return (a.createdAt || 0) - (b.createdAt || 0);
    return 0;
  });

  const sectionsToDisplay = allFolderSections.filter((folderKey) => {
    if (!searchQuery.trim()) return true;
    const count = sortedAndFilteredPages.filter((p) => (p.folder || '/') === folderKey).length;
    return count > 0;
  });

  const handleToggleSelect = (pageId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setSelectedPageIds((prev) =>
      prev.includes(pageId) ? prev.filter((id) => id !== pageId) : [...prev, pageId]
    );
  };

  const handleSelectAllFiltered = () => {
    const allFilteredIds = filteredPages.map((p) => p.id);
    const areAllSelected = allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedPageIds.includes(id));
    if (areAllSelected) {

      setSelectedPageIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
    } else {

      setSelectedPageIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  const handleDeselectAll = () => {
    setSelectedPageIds([]);
    setIsMultiSelectActive(false);
  };

  const handleConfirmBulkDelete = () => {
    if (selectedPageIds.length === 0) return;
    const count = selectedPageIds.length;
    selectedPageIds.forEach((id) => {
      onDeletePage(id);
    });
    setSelectedPageIds([]);
    setShowBulkDeleteModal(false);
    setBulkActionSuccess(`Successfully deleted ${count} page${count > 1 ? 's' : ''}`);
    setTimeout(() => setBulkActionSuccess(null), 3000);
  };

  const handleTriggerSingleDelete = (page: WebsitePage) => {
    setPageToDelete(page);
  };

  const handleConfirmSingleDelete = () => {
    if (!pageToDelete) return;
    onDeletePage(pageToDelete.id);
    setSelectedPageIds((prev) => prev.filter((id) => id !== pageToDelete.id));
    setPageToDelete(null);
  };

  const handleOpenEditModal = (page: WebsitePage) => {
    setEditingPage(page);
    setEditTitle(page.title);
    setEditDesc(page.siteSettings?.description || '');
    setEditFolder(page.folder || '/');
    setEditFileName(page.fileName || '');
    setEditRoute('');
    setEditStatus(page.status || (page.isPublished ? 'published' : 'draft'));
    setEditIndexing(page.indexing || 'index');
    setEditPasswordProtected(!!page.passwordProtected);
    setEditPassword(page.password || '');
  };

  const handleSavePageSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;

    if (editingPage.id === 'new') {
      onCreateNewPage(
        editFolder,
        editTitle.trim(),
        editFileName.trim(),
        editDesc.trim(),
        editStatus,
        editIndexing,
        editPasswordProtected,
        editPassword
      );
    } else {
      onUpdatePageMeta(
        editingPage.id,
        editTitle.trim() || editingPage.title,
        editDesc.trim(),
        editFolder,
        undefined,
        editStatus,
        editIndexing,
        editPasswordProtected,
        editPassword,
        editFileName.trim()
      );
    }
    setEditingPage(null);
  };

  const handleOpenNewPageModal = (initialFolder?: string | React.MouseEvent) => {
    setIsCreateDropdownOpen(false);
    setEditTitle('');
    setEditDesc('');
    const folderToUse = (typeof initialFolder === 'string' && initialFolder) ? initialFolder : '/';
    setEditFolder(folderToUse);
    setEditFileName('');
    setEditRoute('');
    setEditStatus('draft');
    setEditIndexing('index');
    setEditPasswordProtected(false);
    setEditPassword('');
    setEditingPage({
      id: 'new',
      title: '',
      fileName: '',
      folder: folderToUse,
      sections: []
    });
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !newColName.trim()) return;

    const colId = `col_${Date.now()}`;
    const slug = newColSlug.trim() || newColName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const newCol: CMSCollection = {
      id: colId,
      name: newColName.trim(),
      slug,
      description: newColDesc.trim(),
      fields: [
        { id: 'f_title', name: 'Title', key: 'title', type: 'text', required: true },
        { id: 'f_slug', name: 'Slug', key: 'slug', type: 'text', required: true },
        { id: 'f_summary', name: 'Summary', key: 'summary', type: 'text' },
        { id: 'f_content', name: 'Body Content', key: 'content', type: 'rich-text' },
        { id: 'f_image', name: 'Featured Image URL', key: 'image', type: 'image' },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveCMSCollection(userId, newCol, activeWorkspaceId);
    setSelectedCollection(newCol);
    setShowCreateCollectionModal(false);
    setNewColName('');
    setNewColSlug('');
    setNewColDesc('');
  };

  const handleDeleteCollection = async (colId: string) => {
    if (!userId) return;
    await deleteCMSCollection(userId, colId, activeWorkspaceId);
    if (selectedCollection?.id === colId) {
      setSelectedCollection(collections.find((c) => c.id !== colId) || null);
    }
  };

  const handleOpenItemModal = (item?: CMSItem) => {
    if (item) {
      setEditingItem(item);
      setItemTitle(item.title);
      setItemSlug(item.slug);
      setItemStatus(item.status);
      setItemData(item.data || {});
    } else {
      setEditingItem(null);
      setItemTitle('');
      setItemSlug('');
      setItemStatus('published');
      setItemData({});
    }
    setShowItemModal(true);
  };

  const handleSaveCMSItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !selectedCollection || !itemTitle.trim()) return;

    const itemId = editingItem?.id || `item_${Date.now()}`;
    const slug = itemSlug.trim() || itemTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const newItem: CMSItem = {
      id: itemId,
      collectionId: selectedCollection.id,
      title: itemTitle.trim(),
      slug,
      status: itemStatus,
      data: itemData,
      createdAt: editingItem?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveCMSItem(userId, newItem, activeWorkspaceId);
    setShowItemModal(false);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!userId) return;
    await deleteCMSItem(userId, itemId, activeWorkspaceId);
  };

  const getStatusBadge = (page: WebsitePage) => {
    const st = page.status || (page.isPublished ? 'published' : 'draft');
    switch (st) {
      case 'published':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Published
          </span>
        );
      case 'scheduled':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Scheduled
          </span>
        );
      case 'archived':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            Archived
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Webpages
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowCreateFolderModal(true)}
            className={`px-3.5 py-2 rounded-xl border font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              isLight
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700'
            }`}
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>New Folder</span>
          </button>

          <button
            type="button"
            onClick={handleOpenNewPageModal}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Page</span>
          </button>
        </div>
      </div>

      {activeTab === 'pages' ? (
        <>
          {bulkActionSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{bulkActionSuccess}</span>
              </div>
              <button
                onClick={() => setBulkActionSuccess(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search pages by title, route path, or description..."
              isLight={isLight}
              variant="pill"
              containerClassName="flex-1 min-w-0"
            />

            <div className="flex items-center gap-2 justify-between sm:justify-end shrink-0">
              {filteredPages.length > 0 && (
                <div className="relative text-left shrink-0" ref={selectMultipleMenuRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSelectMultipleMenuOpen(!isSelectMultipleMenuOpen);
                      if (!isMultiSelectActive) {
                        setIsMultiSelectActive(true);
                      }
                    }}
                    className={`px-3.5 py-2.5 sm:py-3 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap shadow-xs ${
                      isMultiSelectActive
                        ? isLight
                          ? 'bg-indigo-50/80 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500/20 shadow-xs'
                          : 'bg-indigo-950/60 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500/30 shadow-xs'
                        : isLight
                        ? 'bg-white border-slate-300/80 text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
                        : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
                    }`}
                    title="Select Webpages"
                  >
                    <Circle className={`w-3.5 h-3.5 transition-colors ${
                      isMultiSelectActive
                        ? 'text-indigo-600 dark:text-indigo-400 fill-indigo-500/20'
                        : 'text-slate-400'
                    }`} />
                    <span className="text-xs font-semibold">
                      Select
                    </span>
                    {selectedPageIds.length > 0 && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                        isLight ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-900/80 text-indigo-300'
                      }`}>
                        {selectedPageIds.length}
                      </span>
                    )}
                    <ChevronDown className={`w-3.5 h-3.5 shrink-0 ml-0.5 transition-transform duration-200 ${
                      isSelectMultipleMenuOpen ? 'rotate-180' : ''
                    } ${
                      isMultiSelectActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                    }`} />
                  </button>

                  {isSelectMultipleMenuOpen && (
                    <div
                      className={`absolute left-0 sm:right-0 sm:left-auto top-full mt-1.5 w-48 max-w-[calc(100vw-2rem)] rounded-2xl border shadow-xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150 ${
                        isLight
                          ? 'bg-white border-slate-200 text-slate-800 shadow-slate-300/50'
                          : 'bg-slate-900 border-slate-800 text-slate-100 shadow-black/70'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setIsSelectMultipleMenuOpen(false);
                          setIsMultiSelectActive(true);
                          const allFilteredIds = filteredPages.map((p) => p.id);
                          setSelectedPageIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
                        }}
                        className="w-full px-3.5 py-2 text-xs font-semibold flex items-center gap-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors text-left cursor-pointer text-indigo-600 dark:text-indigo-400"
                      >
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Select All ({filteredPages.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsSelectMultipleMenuOpen(false);
                          handleDeselectAll();
                        }}
                        className="w-full px-3.5 py-2 text-xs font-medium flex items-center gap-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors text-left cursor-pointer text-slate-600 dark:text-slate-300"
                      >
                        <X className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Clear Selection</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className={`p-1 border rounded-full shrink-0 ${
                isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900'
              }`}>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleSetViewMode('grid')}
                    className={`p-1.5 rounded-full transition-colors cursor-pointer border text-center flex items-center justify-center ${
                      viewMode === 'grid'
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                        : isLight
                        ? 'bg-transparent border-transparent text-slate-600 hover:bg-slate-100/50'
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800/50'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetViewMode('list')}
                    className={`p-1.5 rounded-full transition-colors cursor-pointer border text-center flex items-center justify-center ${
                      viewMode === 'list'
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                        : isLight
                        ? 'bg-transparent border-transparent text-slate-600 hover:bg-slate-100/50'
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800/50'
                    }`}
                    title="List View"
                  >
                    <ListIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {selectedPageIds.length > 0 && (
            <div className={`p-3 rounded-2xl border flex flex-wrap items-center justify-between gap-3 shadow-lg animate-in slide-in-from-top-2 duration-200 ${
              isLight
                ? 'bg-indigo-50/90 border-indigo-200 text-indigo-950 backdrop-blur-md'
                : 'bg-indigo-950/80 border-indigo-800 text-indigo-100 backdrop-blur-md'
            }`}>
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  {selectedPageIds.length}
                </span>
                <span className="text-xs font-semibold">
                  {selectedPageIds.length} {selectedPageIds.length === 1 ? 'webpage' : 'webpages'} selected
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllFiltered}
                  className="px-2.5 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 text-xs font-medium hover:bg-indigo-100/50 dark:hover:bg-indigo-900/50 cursor-pointer"
                >
                  {filteredPages.every((p) => selectedPageIds.includes(p.id))
                    ? 'Deselect All'
                    : `Select All (${filteredPages.length})`}
                </button>

                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="px-2.5 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 text-xs font-medium hover:bg-indigo-100/50 dark:hover:bg-indigo-900/50 cursor-pointer"
                >
                  Clear Selection
                </button>

                <button
                  type="button"
                  onClick={() => setShowBulkDeleteModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Selected ({selectedPageIds.length})</span>
                </button>
              </div>
            </div>
          )}

          {pages.length === 0 && customFolders.length === 0 ? (
            <EmptyState
              icon={Globe}
              title={searchQuery ? 'No matching pages found' : 'No webpages created yet'}
              description={
                searchQuery
                  ? 'Try changing your search keywords.'
                  : 'Start by creating your first page layout or organizing with a new folder.'
              }
              actionLabel={!searchQuery ? 'Create First Page' : undefined}
              onAction={!searchQuery ? () => handleOpenNewPageModal('/') : undefined}
              actionIcon={Plus}
              isLight={isLight}
            />
          ) : sortedAndFilteredPages.length === 0 && searchQuery.trim() !== '' ? (
            <EmptyState
              icon={FileText}
              title="No matching pages found"
              description="Try changing your search keywords."
              isLight={isLight}
            />
          ) : (
            <div className="space-y-8">
              {sectionsToDisplay.map((folderKey) => {
                const isRoot = folderKey === '/';
                const folderPages = sortedAndFilteredPages.filter((p) => (p.folder || '/') === folderKey);
                const displayName = isRoot ? 'Root' : (folderKey.startsWith('/') ? folderKey.slice(1) : folderKey);
                const isCollapsed = isFolderCollapsed(folderKey);
                const isCustomFolder = !isRoot && customFolders.includes(folderKey);

                return (
                  <div key={folderKey} className="space-y-3.5">
                    <div
                      onClick={() => toggleFolderCollapse(folderKey)}
                      className="flex items-center justify-between gap-3 select-none cursor-pointer py-1 group"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFolderCollapse(folderKey);
                          }}
                          className="p-1 -ml-1 rounded-lg text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 cursor-pointer mt-0.5"
                          title={isCollapsed ? 'Expand folder' : 'Collapse folder'}
                        >
                          {isCollapsed ? (
                            <ChevronRight className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>

                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-base text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                              {displayName}
                            </span>
                            {folderPages.length > 0 && (
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                                {folderPages.length} {folderPages.length === 1 ? 'page' : 'pages'}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                            {isRoot
                              ? 'Pages created here will show on your main web address (e.g. yourwebsite.com/index.html)'
                              : `Pages created here will show under this folder (e.g. yourwebsite.com/${displayName}/page.html)`}
                          </span>
                        </div>
                      </div>

                      {isCustomFolder && folderPages.length === 0 && (
                        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCustomFolder(folderKey, e)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Delete empty folder"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {!isCollapsed && (
                      <div>
                        {folderPages.length === 0 ? (
                          <div className={`p-8 rounded-xl border border-dashed text-center flex flex-col items-center justify-center gap-2.5 ${
                            isLight ? 'border-slate-200/90 bg-slate-50/50' : 'border-slate-800/90 bg-slate-900/20'
                          }`}>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                              No webpages in {displayName} yet.
                            </p>
                            <button
                              type="button"
                              onClick={() => handleOpenNewPageModal(folderKey)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Create Page in {displayName}</span>
                            </button>
                          </div>
                        ) : viewMode === 'grid' ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {folderPages.map((page) => (
                              <WebpageSnapshotCard
                                key={page.id}
                                page={page}
                                isSelected={selectedPageIds.includes(page.id)}
                                showSelectionCheckbox={isMultiSelectActive}
                                onToggleSelect={handleToggleSelect}
                                onPreviewPage={onPreviewPage}
                                onOpenEditModal={handleOpenEditModal}
                                onDuplicatePage={onDuplicatePage}
                                onDeletePage={() => handleTriggerSingleDelete(page)}
                                onOpenPageInEditor={onOpenPageInEditor}
                                getStatusBadge={getStatusBadge}
                                isLight={isLight}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {folderPages.map((page) => {
                              const isRowSelected = selectedPageIds.includes(page.id);
                              const routePathDisplay = page.routePath || (page.fileName ? `/${page.fileName.replace('.html', '')}` : '/');

                              return (
                                <div
                                  key={page.id}
                                  onClick={() => onOpenPageInEditor(page.id)}
                                  className={`group relative rounded-2xl border p-4 transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                    isRowSelected
                                      ? 'ring-2 ring-indigo-500 border-indigo-500 shadow-md'
                                      : isLight
                                      ? 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:shadow-sm'
                                  }`}
                                >
                                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                    {isMultiSelectActive && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleToggleSelect(page.id, e);
                                        }}
                                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                                          isRowSelected
                                            ? 'bg-indigo-600 border-indigo-600 text-white'
                                            : isLight
                                            ? 'border-slate-300 bg-white hover:border-indigo-400'
                                            : 'border-slate-700 bg-slate-800 hover:border-indigo-400'
                                        }`}
                                        title={isRowSelected ? 'Deselect page' : 'Select page'}
                                      >
                                        {isRowSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                      </button>
                                    )}

                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                                      isLight
                                        ? 'bg-slate-50 border-slate-200 text-indigo-600 group-hover:bg-indigo-50 group-hover:border-indigo-200'
                                        : 'bg-slate-800/80 border-slate-700 text-indigo-400 group-hover:bg-indigo-950/50 group-hover:border-indigo-800'
                                    }`}>
                                      <Globe className="w-5 h-5" />
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate max-w-sm">
                                          {page.title}
                                        </h4>
                                        {page.passwordProtected && (
                                          <span title="Password Protected" className="p-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px]">
                                            <Lock className="w-3 h-3" />
                                          </span>
                                        )}
                                      </div>

                                      <div className="flex items-center gap-2.5 text-xs text-slate-500 flex-wrap">
                                        <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900/50 truncate max-w-[200px] sm:max-w-xs">
                                          {routePathDisplay}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-1.5">
                                      <div className="relative text-left" ref={openMenuPageId === page.id ? rowMenuRef : null}>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenMenuPageId(openMenuPageId === page.id ? null : page.id);
                                          }}
                                          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                          title="More Options"
                                          aria-label="More Options"
                                        >
                                          <MoreVertical className="w-4.5 h-4.5" />
                                        </button>

                                        {openMenuPageId === page.id && (
                                          <div
                                            className={`absolute right-0 top-full mt-1.5 w-48 max-w-[calc(100vw-2rem)] rounded-2xl border shadow-xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150 ${
                                              isLight
                                                ? 'bg-white border-slate-200 text-slate-800 shadow-slate-300/50'
                                                : 'bg-slate-900 border-slate-800 text-slate-100 shadow-black/70'
                                            }`}
                                          >
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuPageId(null);
                                                onOpenPageInEditor(page.id);
                                              }}
                                              className="w-full px-3.5 py-2 text-xs font-semibold flex items-center gap-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors text-left cursor-pointer text-indigo-600 dark:text-indigo-400"
                                            >
                                              <Pencil className="w-4 h-4 shrink-0" />
                                              <span>Edit in Builder</span>
                                            </button>

                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuPageId(null);
                                                onPreviewPage(page);
                                              }}
                                              className="w-full px-3.5 py-2 text-xs font-medium flex items-center gap-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors text-left cursor-pointer"
                                            >
                                              <Eye className="w-4 h-4 text-slate-400 shrink-0" />
                                              <span>Quick Preview</span>
                                            </button>

                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuPageId(null);
                                                handleOpenEditModal(page);
                                              }}
                                              className="w-full px-3.5 py-2 text-xs font-medium flex items-center gap-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors text-left cursor-pointer"
                                            >
                                              <Settings className="w-4 h-4 text-slate-400 shrink-0" />
                                              <span>Page Setup</span>
                                            </button>

                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuPageId(null);
                                                onDuplicatePage(page.id);
                                              }}
                                              className="w-full px-3.5 py-2 text-xs font-medium flex items-center gap-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors text-left cursor-pointer"
                                            >
                                              <Copy className="w-4 h-4 text-slate-400 shrink-0" />
                                              <span>Duplicate</span>
                                            </button>

                                            <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuPageId(null);
                                                handleTriggerSingleDelete(page);
                                              }}
                                              className="w-full px-3.5 py-2 text-xs font-medium flex items-center gap-2.5 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 transition-colors text-left cursor-pointer"
                                            >
                                              <Trash2 className="w-4 h-4 text-red-500 shrink-0" />
                                              <span>Delete</span>
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`lg:col-span-4 p-5 rounded-2xl border space-y-4 ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-500" />
                <span>Collections ({collections.length})</span>
              </h3>
              <button
                onClick={() => setShowCreateCollectionModal(true)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>New</span>
              </button>
            </div>

            {collections.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                <Database className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No CMS Collections created yet.</p>
                <button
                  onClick={() => setShowCreateCollectionModal(true)}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Create Collection (e.g. Blog, FAQs)
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                {collections.map((col) => (
                  <div
                    key={col.id}
                    onClick={() => setSelectedCollection(col)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      selectedCollection?.id === col.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200'
                        : isLight
                        ? 'bg-slate-50/50 border-slate-200 hover:bg-slate-100'
                        : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-xs">{col.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">/{col.slug}</p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCollection(col.id);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                      title="Delete Collection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`lg:col-span-8 p-5 rounded-2xl border space-y-4 ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
          }`}>
            {selectedCollection ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {selectedCollection.name} Items
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      /{selectedCollection.slug} • {cmsItems.length} records stored in cloud
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenItemModal()}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                {cmsItems.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    <Layers className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>No items in this collection yet.</p>
                    <button
                      onClick={() => handleOpenItemModal()}
                      className="mt-3 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold cursor-pointer"
                    >
                      Add First Record
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {cmsItems.map((item) => (
                      <div
                        key={item.id}
                        className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                              {item.title}
                            </span>
                            <span className={`px-2 py-0.2 rounded text-[10px] font-semibold ${
                              item.status === 'published'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <span className="text-[11px] font-medium text-slate-400">
                            /{selectedCollection.slug}/{item.slug}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenItemModal(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer"
                            title="Edit Item"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Select or create a CMS collection to manage records.
              </div>
            )}
          </div>
        </div>
      )}

      {editingPage && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 space-y-4 shadow-xl ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  {editingPage.id === 'new' ? 'Create New Webpage' : 'Page Setup'}
                </h3>
                {editingPage.id !== 'new' && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    {editFileName || editingPage.fileName || 'index.html'}
                  </p>
                )}
              </div>
              <button
                onClick={() => setEditingPage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePageSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-2">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">Page Title</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setEditTitle(newTitle);
                      if (editingPage.id === 'new') {
                        const slug = newTitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                        setEditFileName(slug ? `${slug}.html` : '');
                      }
                    }}
                    className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-slate-100'
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">Indexing</label>
                  <select
                    value={editIndexing}
                    onChange={(e) => setEditIndexing(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs outline-none cursor-pointer ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-slate-100'
                    }`}
                  >
                    <option value="index">Index (Search Engines Can Crawl)</option>
                    <option value="no-index">No-index (Robots Cannot Crawl)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-2">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">Folder Hierarchy</label>
                  <select
                    value={editFolder}
                    onChange={(e) => setEditFolder(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs outline-none cursor-pointer ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-slate-100'
                    }`}
                  >
                    <option value="/">Root (/)</option>
                    {availableFolders.filter(f => f && f !== '/').map(fold => (
                      <option key={fold} value={fold}>{fold}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">File Name</label>
                  <input
                    type="text"
                    value={editFileName}
                    onChange={(e) => setEditFileName(e.target.value)}
                    placeholder="e.g. about.html"
                    className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-slate-100'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">Meta Description</label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-slate-100'
                  }`}
                />
              </div>

              <div className={`p-3.5 rounded-xl border space-y-2.5 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/50 border-slate-700'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Password Protection
                    </span>
                  </div>
                  <CheckCircle
                    checked={editPasswordProtected}
                    onChange={(checked) => setEditPasswordProtected(checked)}
                    size="md"
                    isLight={isLight}
                  />
                </div>

                {editPasswordProtected && (
                  <div className="pt-1 space-y-2">
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block">Access Passcode</label>
                    <input
                      type="password"
                      placeholder="Enter access passcode"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${
                        isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-700 text-slate-100'
                      }`}
                    />
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPage(null)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingPage.id === 'new' ? 'Create Webpage' : 'Save Page Setup'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-md rounded-2xl border p-6 space-y-4 shadow-xl ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Create New Folder
                </h3>
              </div>
              <button
                onClick={() => setShowCreateFolderModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newFolderName.trim()) return;

                handleAddFolder(newFolderName);

                setNewFolderName('');
                setShowCreateFolderModal(false);
              }}
              className="space-y-4 text-xs"
            >
              <Input
                label="Folder Path"
                type="text"
                required
                hideRequiredAsterisk
                placeholder="e.g. blog, services, project"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                variant="rounded"
                isLight={isLight}
                autoFocus
              />

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateFolderModal(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateCollectionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl border p-6 space-y-4 shadow-xl ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Create CMS Collection
              </h3>
              <button
                onClick={() => setShowCreateCollectionModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCollection} className="space-y-3 text-xs">
              <Input
                label="Collection Name"
                type="text"
                required
                placeholder="e.g. Blog Posts, Team, Testimonials"
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                variant="rounded"
                isLight={isLight}
              />

              <Input
                label="Slug / URL Route"
                type="text"
                placeholder="e.g. blog, team, testimonials"
                value={newColSlug}
                onChange={(e) => setNewColSlug(e.target.value)}
                variant="rounded"
                isLight={isLight}
                className="font-mono"
              />

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  rows={2}
                  placeholder="Optional description of this schema..."
                  value={newColDesc}
                  onChange={(e) => setNewColDesc(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-slate-100'
                  }`}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateCollectionModal(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Schema</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showItemModal && selectedCollection && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 space-y-4 shadow-xl ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {editingItem ? 'Edit Record' : `New ${selectedCollection.name} Item`}
              </h3>
              <button
                onClick={() => setShowItemModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCMSItem} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Title"
                  type="text"
                  required
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  variant="rounded"
                  isLight={isLight}
                />

                <Select
                  label="Status"
                  value={itemStatus}
                  onChange={(e) => setItemStatus(e.target.value as any)}
                  variant="rounded"
                  isLight={isLight}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </Select>
              </div>

              <Input
                label="Custom Slug"
                type="text"
                value={itemSlug}
                onChange={(e) => setItemSlug(e.target.value)}
                placeholder="auto-generated-from-title"
                variant="rounded"
                isLight={isLight}
                className="font-mono"
              />

              {selectedCollection.fields.filter(f => f.key !== 'title' && f.key !== 'slug').map((field) => (
                <div key={field.id} className="space-y-1">
                  {field.type === 'image' ? (
                    <ImageInputWithMediaPicker
                      label={field.name}
                      value={itemData[field.key] || ''}
                      onChange={(val) => setItemData({ ...itemData, [field.key]: val })}
                      placeholder="https://... or select from media"
                      variant="default"
                      isLight={isLight}
                      modalTitle={`Select ${field.name} Image`}
                    />
                  ) : (
                    <>
                      <label className="font-semibold text-slate-700 dark:text-slate-300">{field.name}</label>
                      {field.type === 'rich-text' ? (
                        <textarea
                          rows={3}
                          value={itemData[field.key] || ''}
                          onChange={(e) => setItemData({ ...itemData, [field.key]: e.target.value })}
                          className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                            isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-slate-100'
                          }`}
                        />
                      ) : (
                        <input
                          type={field.type === 'number' ? 'number' : field.type === 'url' ? 'url' : 'text'}
                          value={itemData[field.key] || ''}
                          onChange={(e) => setItemData({ ...itemData, [field.key]: e.target.value })}
                          className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                            isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-800 border-slate-700 text-slate-100'
                          }`}
                        />
                      )}
                    </>
                  )}
                </div>
              ))}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBulkDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-md rounded-2xl border p-6 space-y-4 shadow-2xl ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Delete {selectedPageIds.length} Webpages
                </h3>
                <p className="text-[11px] text-slate-500">
                  Bulk action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Are you sure you want to permanently delete the following <strong className="text-slate-900 dark:text-slate-100">{selectedPageIds.length}</strong> selected pages?
            </p>

            <div className={`max-h-40 overflow-y-auto rounded-xl border p-2.5 space-y-1.5 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
            }`}>
              {pages
                .filter((p) => selectedPageIds.includes(p.id))
                .map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-xs py-1 px-1.5 rounded-lg">
                    <div className="flex items-center gap-2 truncate">
                      <Globe className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{p.title}</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 shrink-0 ml-2">
                      {p.folder || '/'} ({p.sections?.length || 0} sects)
                    </span>
                  </div>
                ))}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowBulkDeleteModal(false)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete {selectedPageIds.length} Pages</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {pageToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-md rounded-2xl border p-6 space-y-4 shadow-2xl ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Delete Webpage
                </h3>
                <p className="text-[11px] text-slate-500">
                  Permanent removal
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900 dark:text-slate-100">"{pageToDelete.title}"</strong> ({pageToDelete.folder || '/'})? All sections and metadata will be deleted.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPageToDelete(null)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSingleDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Webpage</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
