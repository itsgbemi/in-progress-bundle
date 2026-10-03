import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { EmptyState } from '../../common/EmptyState';
import { ConfirmDeleteModal } from '../../common/ConfirmDeleteModal';
import { SearchFilterBar } from '../../common/SearchFilterBar';
import { Input } from '../../common';
import {
  StoredMediaFile,
  uploadMediaFile,
  deleteMediaFile,
  checkMediaStorageStatus,
  syncMediaResources,
  MediaStorageStatus
} from '../../../services/storageService';
import {
  UploadCloud,
  HardDrive,
  Search,
  Trash2,
  Copy,
  Check,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  ShieldCheck,
  X,
  Eye,
  RefreshCw,
  ExternalLink,
  Info,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Cloud,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Laptop,
  Link as LinkIcon,
  Filter,
  LayoutGrid,
  List,
  Circle
} from 'lucide-react';

interface MediaStorageViewProps {
  mediaFiles: StoredMediaFile[];
  onUpdateMediaFiles: (files: StoredMediaFile[]) => void;
  uiTheme: 'dark' | 'light';
}

export const MediaStorageView: React.FC<MediaStorageViewProps> = ({
  mediaFiles,
  onUpdateMediaFiles,
  uiTheme,
}) => {
  const { isFirebaseConfigured, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'audio' | 'doc'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<'normal' | 'optimized' | null>(null);
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<StoredMediaFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [isSelectMultipleMenuOpen, setIsSelectMultipleMenuOpen] = useState(false);
  const selectMultipleMenuRef = useRef<HTMLDivElement>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);

  const [isUploadDropdownOpen, setIsUploadDropdownOpen] = useState(false);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');
  const [urlAssetNameValue, setUrlAssetNameValue] = useState('');
  const uploadDropdownRef = useRef<HTMLDivElement>(null);

  const [mediaStorageStatus, setMediaStorageStatus] = useState<MediaStorageStatus>({
    configured: true,
    provider: 'native',
    ping: 'checking',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLight = uiTheme === 'light';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (uploadDropdownRef.current && !uploadDropdownRef.current.contains(event.target as Node)) {
        setIsUploadDropdownOpen(false);
      }
      if (selectMultipleMenuRef.current && !selectMultipleMenuRef.current.contains(event.target as Node)) {
        setIsSelectMultipleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddByUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInputValue.trim()) return;

    const newAsset: StoredMediaFile = {
      id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: urlAssetNameValue.trim() || 'URL Image Asset',
      url: urlInputValue.trim(),
      type: 'image/png',
      size: 150000,
      createdAt: new Date().toISOString(),
      storageProvider: 'local',
      storagePath: 'web_url',
      isFirebaseStored: false,
    };

    onUpdateMediaFiles([newAsset, ...mediaFiles]);
    setUrlInputValue('');
    setUrlAssetNameValue('');
    setIsUrlModalOpen(false);
  };

  useEffect(() => {
    let isMounted = true;
    const performAutoSync = async () => {
      try {
        const [status, syncedAssets] = await Promise.all([
          checkMediaStorageStatus(),
          syncMediaResources(),
        ]);
        if (isMounted) {
          setMediaStorageStatus(status);
          if (syncedAssets && syncedAssets.length > 0) {
            onUpdateMediaFiles(syncedAssets);
          }
        }
      } catch {

      }
    };

    performAutoSync();

    const interval = setInterval(performAutoSync, 300000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const totalSizeBytes = mediaFiles.reduce((acc, f) => acc + (f.size || 0), 0);
  const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);
  const storedFilesCount = mediaFiles.length;

  const isImage = (file: StoredMediaFile) =>
    Boolean(file.type?.startsWith('image/')) || /\.(jpg|jpeg|png|webp|gif|svg|avif|bmp|ico)$/i.test(file.name || file.url);

  const isVideo = (file: StoredMediaFile) =>
    Boolean(file.type?.startsWith('video/')) || /\.(mp4|webm|mov|avi|mkv|m4v|ogv)$/i.test(file.name || file.url);

  const isAudio = (file: StoredMediaFile) =>
    Boolean(file.type?.startsWith('audio/')) || /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(file.name || file.url);

  const isDoc = (file: StoredMediaFile) =>
    !isImage(file) && !isVideo(file) && !isAudio(file);

  const imageCount = mediaFiles.filter(isImage).length;
  const videoCount = mediaFiles.filter(isVideo).length;
  const audioCount = mediaFiles.filter(isAudio).length;
  const docCount = mediaFiles.filter(isDoc).length;

  const filteredFiles = mediaFiles.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (file.publicId && file.publicId.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterType === 'image') {
      return isImage(file);
    }
    if (filterType === 'video') {
      return isVideo(file);
    }
    if (filterType === 'audio') {
      return isAudio(file);
    }
    if (filterType === 'doc') {
      return isDoc(file);
    }
    return true;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, itemsPerPage]);

  const totalItems = filteredFiles.length;
  const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(totalItems / itemsPerPage) || 1;
  const effectiveCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = itemsPerPage === -1 ? 0 : (effectiveCurrentPage - 1) * itemsPerPage;
  const endIndex = itemsPerPage === -1 ? totalItems : Math.min(startIndex + itemsPerPage, totalItems);

  const paginatedFiles = itemsPerPage === -1 ? filteredFiles : filteredFiles.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (effectiveCurrentPage > 3) pages.push('...');

      const start = Math.max(2, effectiveCurrentPage - 1);
      const end = Math.min(totalPages - 1, effectiveCurrentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (effectiveCurrentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const handleProcessUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadProgress(10);

    try {
      const updatedList = [...mediaFiles];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploaded = await uploadMediaFile(file, 'website_assets', (progress) => {
          setUploadProgress(progress);
        });

        const index = updatedList.findIndex(f => f.id === uploaded.id || (uploaded.publicId && f.publicId === uploaded.publicId));
        if (index >= 0) {
          updatedList[index] = uploaded;
        } else {
          updatedList.unshift(uploaded);
        }
      }
      onUpdateMediaFiles(updatedList);
    } catch (err: any) {
      console.error('File upload error:', err);
      setSyncMessage(`Upload failed: ${err.message || 'Please check your connection and try again.'}`);
      setTimeout(() => setSyncMessage(null), 8000);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSyncMedia = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const synced = await syncMediaResources();
      onUpdateMediaFiles(synced);
      const updatedStatus = await checkMediaStorageStatus();
      setMediaStorageStatus(updatedStatus);
      setSyncMessage(`All media assets are up to date.`);
      setTimeout(() => setSyncMessage(null), 4000);
    } catch {
      setSyncMessage('Unable to synchronize media assets. Please try again or contact support.');
      setTimeout(() => setSyncMessage(null), 5000);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleProcessUpload(e.dataTransfer.files);
    }
  };

  const handleCopyUrl = (file: StoredMediaFile) => {
    navigator.clipboard.writeText(file.url);
    setCopiedId(file.id);
    setCopiedType('normal');
    setTimeout(() => {
      setCopiedId(null);
      setCopiedType(null);
    }, 2000);
  };

  const paginatedFileIds = paginatedFiles.map((f) => f.id);
  const allFilteredIds = filteredFiles.map((f) => f.id);

  const isCurrentPageFullySelected =
    paginatedFileIds.length > 0 &&
    paginatedFileIds.every((id) => selectedFileIds.includes(id));

  const isAllVisibleSelected =
    allFilteredIds.length > 0 &&
    allFilteredIds.every((id) => selectedFileIds.includes(id));

  const handleToggleSelectFile = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedFileIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectPage = () => {
    if (isCurrentPageFullySelected) {
      setSelectedFileIds((prev) => prev.filter((id) => !paginatedFileIds.includes(id)));
    } else {
      setSelectedFileIds((prev) => Array.from(new Set([...prev, ...paginatedFileIds])));
    }
  };

  const handleSelectAllFiles = () => {
    if (isAllVisibleSelected) {
      setSelectedFileIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
    } else {
      setSelectedFileIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  const handleToggleSelectAll = () => {
    handleSelectAllFiles();
  };

  const handleClearSelection = () => {
    setSelectedFileIds([]);
  };

  const handleBulkCopyUrls = () => {
    const selectedFiles = mediaFiles.filter((f) => selectedFileIds.includes(f.id));
    if (selectedFiles.length === 0) return;
    const urlsText = selectedFiles.map((f) => f.url).join('\n');
    navigator.clipboard.writeText(urlsText);
    setSyncMessage(`Copied ${selectedFiles.length} media URL${selectedFiles.length === 1 ? '' : 's'} to clipboard.`);
    setTimeout(() => setSyncMessage(null), 3000);
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedFileIds.length === 0) return;
    setIsBulkDeleting(true);
    try {
      const filesToDelete = mediaFiles.filter((f) => selectedFileIds.includes(f.id));
      for (const f of filesToDelete) {
        await deleteMediaFile(f);
      }
      const remaining = mediaFiles.filter((f) => !selectedFileIds.includes(f.id));
      onUpdateMediaFiles(remaining);
      setSyncMessage(`Deleted ${filesToDelete.length} asset${filesToDelete.length === 1 ? '' : 's'}.`);
      setTimeout(() => setSyncMessage(null), 4000);
      setSelectedFileIds([]);
      setIsBulkDeleteModalOpen(false);
    } catch (err: any) {
      console.error('Bulk delete error:', err);
      setSyncMessage(`Bulk delete failed: ${err.message || 'Please try again'}`);
      setTimeout(() => setSyncMessage(null), 5000);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const [fileToDelete, setFileToDelete] = useState<StoredMediaFile | null>(null);

  const handleDelete = async (file: StoredMediaFile) => {
    setFileToDelete(file);
  };

  const confirmDelete = async () => {
    if (!fileToDelete) return;
    await deleteMediaFile(fileToDelete);
    onUpdateMediaFiles(mediaFiles.filter((f) => f.id !== fileToDelete.id && f.publicId !== fileToDelete.publicId));
    if (selectedFileForPreview?.id === fileToDelete.id) {
      setSelectedFileForPreview(null);
    }
    setFileToDelete(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Media & Asset Library</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 flex-wrap">
            <span><strong>{totalSizeMB} MB</strong> used</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span>{mediaFiles.length} asset{mediaFiles.length === 1 ? '' : 's'}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSyncMedia}
            disabled={isSyncing}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer border ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            } ${isSyncing ? 'opacity-70 cursor-not-allowed' : ''}`}
            title="Refresh assets"
          >
            <span>{isSyncing ? 'Updating...' : 'Refresh'}</span>
          </button>

          <div className="relative" ref={uploadDropdownRef}>
            <button
              onClick={() => setIsUploadDropdownOpen((prev) => !prev)}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isUploadDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isUploadDropdownOpen && (
              <div
                className={`absolute left-0 sm:left-auto right-auto sm:right-0 mt-2 w-48 max-w-[calc(100vw-2rem)] rounded-2xl border shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-800 shadow-slate-300/50'
                    : 'bg-slate-900 border-slate-800 text-slate-100 shadow-black/70'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsUploadDropdownOpen(false);
                    fileInputRef.current?.click();
                  }}
                  className="w-full px-3.5 py-2 text-xs font-medium flex items-center gap-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors text-left cursor-pointer"
                >
                  <Laptop className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div>
                    <p className="font-semibold leading-tight">Device</p>
                    <span className="text-[10px] text-slate-400">Browse local files</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsUploadDropdownOpen(false);
                    setIsUrlModalOpen(true);
                  }}
                  className="w-full px-3.5 py-2 text-xs font-medium flex items-center gap-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors text-left cursor-pointer"
                >
                  <LinkIcon className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div>
                    <p className="font-semibold leading-tight">By URL</p>
                    <span className="text-[10px] text-slate-400">Import web image link</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {syncMessage && (
        <div className={`p-3 rounded-2xl border text-xs flex items-center gap-2 ${
          syncMessage.includes('Successfully')
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
            : 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300'
        }`}>
          {syncMessage.includes('Successfully') ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
          )}
          <span>{syncMessage}</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,application/pdf"
        onChange={(e) => handleProcessUpload(e.target.files)}
        className="hidden"
      />

      {isUploading && (
        <div className={`p-4 rounded-2xl border space-y-2 ${isLight ? 'bg-indigo-50/50 border-indigo-200' : 'bg-indigo-950/30 border-indigo-900/50'}`}>
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-300">
            <span>Uploading files to Cloud Storage...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search assets by name..."
        filterOptions={[
          { id: 'all', label: `All (${mediaFiles.length})` },
          { id: 'image', label: `Images (${imageCount})` },
          { id: 'video', label: `Videos (${videoCount})` },
          { id: 'audio', label: `Audio (${audioCount})` },
          { id: 'doc', label: `Documents (${docCount})` },
        ]}
        selectedFilter={filterType}
        onSelectFilter={(id) => setFilterType(id as any)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isLight={isLight}
        leftActions={
          filteredFiles.length > 0 ? (
            <div className="relative text-left shrink-0" ref={selectMultipleMenuRef}>
              <button
                type="button"
                onClick={() => setIsSelectMultipleMenuOpen(!isSelectMultipleMenuOpen)}
                className={`px-3.5 py-2.5 sm:py-3 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap shadow-xs ${
                  selectedFileIds.length > 0
                    ? isLight
                      ? 'bg-indigo-50/80 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500/20 shadow-xs'
                      : 'bg-indigo-950/60 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500/30 shadow-xs'
                    : isLight
                    ? 'bg-white border-slate-300/80 text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
                    : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
                }`}
                title="Select Media Files"
              >
                <Circle
                  className={`w-3.5 h-3.5 transition-colors ${
                    selectedFileIds.length > 0
                      ? 'text-indigo-600 dark:text-indigo-400 fill-indigo-500/20'
                      : 'text-slate-400'
                  }`}
                />
                <span className="text-xs font-semibold">Select</span>
                {selectedFileIds.length > 0 && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                      isLight ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-900/80 text-indigo-300'
                    }`}
                  >
                    {selectedFileIds.length}
                  </span>
                )}
                <ChevronDown
                  className={`w-3.5 h-3.5 shrink-0 ml-0.5 transition-transform duration-200 ${
                    isSelectMultipleMenuOpen ? 'rotate-180' : ''
                  } ${
                    selectedFileIds.length > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                  }`}
                />
              </button>

              {isSelectMultipleMenuOpen && (
                <div
                  className={`absolute left-0 top-full mt-1.5 w-60 max-w-[calc(100vw-2rem)] rounded-2xl border shadow-xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150 ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-800 shadow-slate-300/50'
                      : 'bg-slate-900 border-slate-800 text-slate-100 shadow-black/70'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setIsSelectMultipleMenuOpen(false);
                      handleSelectPage();
                    }}
                    className={`w-full px-3.5 py-2 text-xs font-medium flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors text-left cursor-pointer ${
                      isCurrentPageFullySelected ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          isCurrentPageFullySelected
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-400'
                        }`}
                      />
                      <span>
                        {isCurrentPageFullySelected
                          ? `Deselect Page (${paginatedFiles.length})`
                          : `Select Page (${paginatedFiles.length})`}
                      </span>
                    </div>
                    {isCurrentPageFullySelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSelectMultipleMenuOpen(false);
                      handleSelectAllFiles();
                    }}
                    className={`w-full px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors text-left cursor-pointer ${
                      isAllVisibleSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          isAllVisibleSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                        }`}
                      />
                      <span>
                        {isAllVisibleSelected
                          ? `Deselect All (${filteredFiles.length})`
                          : `Select All Files (${filteredFiles.length})`}
                      </span>
                    </div>
                    {isAllVisibleSelected && <Check className="w-3.5 h-3.5" />}
                  </button>

                  {selectedFileIds.length > 0 && (
                    <>
                      <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                      <button
                        type="button"
                        onClick={() => {
                          setIsSelectMultipleMenuOpen(false);
                          handleClearSelection();
                        }}
                        className="w-full px-3.5 py-2 text-xs font-medium flex items-center gap-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition-colors text-left cursor-pointer text-slate-600 dark:text-slate-300"
                      >
                        <X className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Clear Selection</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : undefined
        }
      />

      {filteredFiles.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No Media Files Found"
          description={searchQuery ? 'Try modifying your search or filter criteria.' : 'Upload your first image, banner, graphics asset, or logo above.'}
          actionLabel={searchQuery ? undefined : 'Upload Asset'}
          onAction={searchQuery ? undefined : () => fileInputRef.current?.click()}
          actionIcon={UploadCloud}
          isLight={isLight}
        />
      ) : (
        <div className="space-y-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedFiles.map((file) => {
                const isSelected = selectedFileIds.includes(file.id);
                return (
                  <div
                    key={file.id}
                    onClick={() => {
                      if (selectedFileIds.length > 0) {
                        handleToggleSelectFile(file.id);
                      }
                    }}
                    className={`rounded-2xl border overflow-hidden flex flex-col justify-between group transition-all cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-indigo-500 border-indigo-500 shadow-md bg-indigo-50/20 dark:bg-indigo-950/20'
                        : isLight
                        ? 'bg-white border-slate-200 hover:border-indigo-400/60 hover:shadow-md'
                        : 'bg-slate-900 border-slate-800 hover:border-indigo-500/40 hover:shadow-md'
                    }`}
                  >
                    <div className="relative h-40 bg-slate-100 dark:bg-slate-800/80 overflow-hidden flex items-center justify-center">
                      <button
                        type="button"
                        onClick={(e) => handleToggleSelectFile(file.id, e)}
                        className={`absolute top-2.5 left-2.5 z-20 w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                          isSelected
                            ? 'bg-indigo-600 text-white ring-2 ring-white/80'
                            : 'bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-xs opacity-0 group-hover:opacity-100'
                        } ${selectedFileIds.length > 0 ? '!opacity-100' : ''}`}
                        title={isSelected ? 'Deselect asset' : 'Select asset'}
                      >
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          <div className="w-3 h-3 rounded-xs border border-white/80" />
                        )}
                      </button>

                      {file.type.startsWith('image/') ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="p-6 text-center space-y-2">
                          <FileText className="w-10 h-10 mx-auto text-indigo-500" />
                          <span className="text-[10px] font-mono uppercase text-slate-400">
                            {file.name.split('.').pop() || 'FILE'}
                          </span>
                        </div>
                      )}

                      <div className="absolute top-2 right-2 flex flex-col items-center gap-2 transition-opacity z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFileForPreview(file);
                          }}
                          className="p-1.5 rounded-md bg-white/80 hover:bg-white text-slate-900 shadow-sm cursor-pointer transition-transform hover:scale-105 backdrop-blur-xs"
                          title="View details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyUrl(file);
                          }}
                          className="p-1.5 rounded-md bg-white/80 hover:bg-white text-slate-900 shadow-sm cursor-pointer transition-transform hover:scale-105 backdrop-blur-xs"
                          title="Copy direct file URL"
                        >
                          {copiedId === file.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(file);
                          }}
                          className="p-1.5 rounded-md bg-white/80 hover:bg-white text-slate-900 shadow-sm cursor-pointer transition-transform hover:scale-105 backdrop-blur-xs"
                          title="Delete file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 space-y-1.5">
                      <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate" title={file.name}>
                        {file.name}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{formatFileSize(file.size)}</span>
                        {file.width && file.height ? (
                          <span className="font-mono text-[10px]">{file.width}×{file.height}</span>
                        ) : (
                          <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={`rounded-2xl border divide-y overflow-hidden ${
              isLight ? 'bg-white border-slate-200 divide-slate-100' : 'bg-slate-900 border-slate-800 divide-slate-800'
            }`}>
              {paginatedFiles.map((file) => {
                const isSelected = selectedFileIds.includes(file.id);
                return (
                  <div
                    key={file.id}
                    onClick={() => {
                      if (selectedFileIds.length > 0) {
                        handleToggleSelectFile(file.id);
                      }
                    }}
                    className={`p-3 flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/50 dark:bg-indigo-950/40'
                        : isLight
                        ? 'hover:bg-slate-50'
                        : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={(e) => handleToggleSelectFile(file.id, e)}
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : isLight
                            ? 'border border-slate-300 hover:border-indigo-500 bg-white'
                            : 'border border-slate-600 hover:border-indigo-500 bg-slate-800'
                        }`}
                        title={isSelected ? 'Deselect asset' : 'Select asset'}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                        {file.type.startsWith('image/') ? (
                          <img src={file.url} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <FileText className="w-5 h-5 text-indigo-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{formatFileSize(file.size)}</span>
                          <span>•</span>
                          <span className="capitalize">{file.storageProvider || 'Cloud'}</span>
                          <span>•</span>
                          <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFileForPreview(file);
                        }}
                        className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyUrl(file);
                        }}
                        className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                        title="Copy URL"
                      >
                        {copiedId === file.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(file);
                        }}
                        className="p-2 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer transition-colors"
                        title="Delete file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {selectedFileIds.length > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[calc(100%-2rem)] animate-in fade-in slide-in-from-bottom-4 duration-200">
              <div
                className={`px-4 py-3 rounded-2xl border shadow-2xl flex items-center justify-between gap-3 backdrop-blur-md ${
                  isLight
                    ? 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-900/20'
                    : 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-black/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                    {selectedFileIds.length}
                  </span>
                  <span className="text-xs font-semibold">
                    Selected
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                      isLight
                        ? 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {isAllVisibleSelected ? 'Deselect All' : 'Select All'}
                  </button>

                  <button
                    type="button"
                    onClick={handleBulkCopyUrls}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isLight
                        ? 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                    title="Copy URLs of all selected assets"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Copy URLs</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsBulkDeleteModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    title="Delete all selected assets"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete ({selectedFileIds.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-1"
                    title="Clear selection"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {totalItems > 0 && (
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                <span>
                  Showing <strong className="text-slate-800 dark:text-slate-200">{startIndex + 1}</strong>–
                  <strong className="text-slate-800 dark:text-slate-200">{endIndex}</strong> of{' '}
                  <strong className="text-slate-800 dark:text-slate-200">{totalItems}</strong> assets
                </span>

                <div className="flex items-center gap-1.5 ml-0 sm:ml-2 border-l-0 sm:border-l border-slate-200 dark:border-slate-800 pl-0 sm:pl-3">
                  <label className="text-[11px] font-medium text-slate-400">Per page:</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className={`px-2 py-1 rounded-lg border text-xs font-medium outline-none cursor-pointer ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-200'
                    }`}
                  >
                    <option value={8}>8</option>
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                    <option value={-1}>All</option>
                  </select>
                </div>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={effectiveCurrentPage <= 1}
                    className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                      isLight
                        ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((pg, idx) =>
                      typeof pg === 'number' ? (
                        <button
                          key={pg}
                          onClick={() => setCurrentPage(pg)}
                          className={`min-w-[32px] h-8 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                            effectiveCurrentPage === pg
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                              : isLight
                              ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                          }`}
                        >
                          {pg}
                        </button>
                      ) : (
                        <span key={`ellipsis-${idx}`} className="px-1 text-xs text-slate-400">
                          ...
                        </span>
                      )
                    )}
                  </div>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={effectiveCurrentPage >= totalPages}
                    className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                      isLight
                        ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {selectedFileForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div
            className={`w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
            }`}
          >
            <div
              className={`px-6 py-4 border-b flex items-center justify-between ${
                isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2 max-w-md">
                <Cloud className="w-4 h-4 text-indigo-500 shrink-0" />
                <h3 className="font-bold text-sm truncate">{selectedFileForPreview.name}</h3>
              </div>
              <button
                onClick={() => setSelectedFileForPreview(null)}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="w-full max-h-72 rounded-2xl bg-slate-100 dark:bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-800 p-2">
                {selectedFileForPreview.type.startsWith('image/') ? (
                  <img
                    src={selectedFileForPreview.url}
                    alt={selectedFileForPreview.name}
                    className="max-h-64 object-contain rounded-xl"
                  />
                ) : (
                  <div className="p-8 text-center space-y-2">
                    <FileText className="w-16 h-16 mx-auto text-indigo-500" />
                    <p className="font-semibold">{selectedFileForPreview.name}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/60 border-slate-700'}`}>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">File Size</span>
                  <span className="font-bold text-xs">{formatFileSize(selectedFileForPreview.size)}</span>
                </div>
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/60 border-slate-700'}`}>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
                  <span className="font-bold text-xs capitalize text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Active & Synced
                  </span>
                </div>
                <div className={`p-3 rounded-xl border col-span-2 sm:col-span-1 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/60 border-slate-700'}`}>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Resolution</span>
                  <span className="font-bold text-xs font-mono">
                    {selectedFileForPreview.width && selectedFileForPreview.height
                      ? `${selectedFileForPreview.width} × ${selectedFileForPreview.height}`
                      : selectedFileForPreview.format || 'Standard'}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">Direct File URL</label>
                  <a
                    href={selectedFileForPreview.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-indigo-500 hover:underline flex items-center gap-1"
                  >
                    <span>Open in new tab</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={selectedFileForPreview.url}
                    className={`flex-1 px-3 py-2 rounded-full border text-xs font-mono outline-none ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  />
                  <button
                    onClick={() => handleCopyUrl(selectedFileForPreview)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                  >
                    {copiedId === selectedFileForPreview.id ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === selectedFileForPreview.id ? 'Copied' : 'Copy URL'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleDelete(selectedFileForPreview)}
                className="px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-500/10 font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Asset</span>
              </button>
              <button
                onClick={() => setSelectedFileForPreview(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {isUrlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div
            className={`w-full max-w-md p-6 rounded-2xl border shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150 ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-indigo-500" />
                <span>Import Asset by Web URL</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsUrlModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddByUrlSubmit} className="space-y-4 text-xs">
              <Input
                label="Image / Asset URL"
                type="url"
                required
                value={urlInputValue}
                onChange={(e) => setUrlInputValue(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                variant="rounded"
                isLight={isLight}
              />

              <Input
                label="Asset Name (Optional)"
                type="text"
                value={urlAssetNameValue}
                onChange={(e) => setUrlAssetNameValue(e.target.value)}
                placeholder="e.g. Hero Banner Image"
                variant="rounded"
                isLight={isLight}
              />

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUrlModalOpen(false)}
                  className={`px-3.5 py-1.5 rounded-xl border font-medium cursor-pointer ${
                    isLight ? 'border-slate-200 text-slate-700' : 'border-slate-700 text-slate-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium cursor-pointer shadow-xs"
                >
                  Add Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {fileToDelete && (
        <ConfirmDeleteModal
          isOpen={true}
          title="Delete Asset"
          itemName={fileToDelete.name}
          itemType="asset"
          onConfirm={confirmDelete}
          onCancel={() => setFileToDelete(null)}
          isLight={isLight}
        />
      )}
      {isBulkDeleteModalOpen && (
        <ConfirmDeleteModal
          isOpen={true}
          title={`Delete ${selectedFileIds.length} Media Asset${selectedFileIds.length === 1 ? '' : 's'}?`}
          description={`Are you sure you want to permanently delete the ${selectedFileIds.length} selected asset${selectedFileIds.length === 1 ? '' : 's'} from your library? This action cannot be undone.`}
          confirmLabel={isBulkDeleting ? 'Deleting...' : 'Delete Selected'}
          onConfirm={handleConfirmBulkDelete}
          onCancel={() => setIsBulkDeleteModalOpen(false)}
          isLight={isLight}
        />
      )}
    </div>
  );
};
