import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  StoredMediaFile,
  getCachedMediaFiles,
  syncCloudinaryResources,
  uploadMediaToCloudinary,
  saveMediaUrlToFirestore,
  saveCachedMediaFiles,
} from '../../services/storageService';
import {
  X,
  Search,
  Upload,
  Image as ImageIcon,
  Check,
  RefreshCw,
  FolderOpen,
  Link as LinkIcon,
  Sparkles,
  ExternalLink,
  Layers,
  HardDrive,
  UploadCloud,
  Eye,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, file?: StoredMediaFile) => void;
  currentValue?: string;
  title?: string;
  uiTheme?: 'dark' | 'light';
  filterType?: 'image' | 'all';
}

const STOCK_PRESETS = [
  {
    category: 'Abstract & Modern',
    items: [
      { name: 'Fluid Indigo Wave', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Geometric Violet', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Prism Spectrum', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Minimal Dark Satin', url: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=1200&q=80' },
    ]
  },
  {
    category: 'Business & Workspace',
    items: [
      { name: 'Executive Modern Desk', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Analytics & Growth', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Creative Studio Laptop', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Minimal Meeting Room', url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80' },
    ]
  },
  {
    category: 'Technology & SaaS',
    items: [
      { name: 'Cyber Server Grid', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Digital Architecture', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Neon Fiber Lines', url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Futuristic Glow', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80' },
    ]
  },
  {
    category: 'Logos & Brand Badges',
    items: [
      { name: 'Minimalist Monogram', url: 'https://cdn-icons-png.flaticon.com/512/5968/5968292.png' },
      { name: 'Hexagon Tech Node', url: 'https://cdn-icons-png.flaticon.com/512/5968/5968853.png' },
      { name: 'Prism Geometry Icon', url: 'https://cdn-icons-png.flaticon.com/512/5968/5968705.png' },
    ]
  }
];

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentValue = '',
  title = 'Select Media Asset',
  uiTheme = 'dark',
  filterType = 'image',
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload' | 'presets' | 'url'>('dashboard');
  const [mediaFiles, setMediaFiles] = useState<StoredMediaFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState(currentValue);
  const [selectedPresetCategory, setSelectedPresetCategory] = useState<string>('All');
  const [previewHoverUrl, setPreviewHoverUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLight = uiTheme === 'light';

  useEffect(() => {
    if (!isOpen) return;

    const loadFiles = () => {
      const cached = getCachedMediaFiles();
      setMediaFiles(cached);
    };

    loadFiles();

    setIsSyncing(true);
    syncCloudinaryResources()
      .then((synced) => {
        if (synced && synced.length > 0) {
          setMediaFiles(synced);
        }
      })
      .catch((err) => {
        console.warn('Media picker sync warning:', err);
      })
      .finally(() => {
        setIsSyncing(false);
      });

    const handleMediaUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setMediaFiles(e.detail);
      } else {
        loadFiles();
      }
    };

    window.addEventListener('media_files_updated', handleMediaUpdate);
    return () => {
      window.removeEventListener('media_files_updated', handleMediaUpdate);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setCustomUrlInput(currentValue || '');
      setUploadError(null);
    }
  }, [isOpen, currentValue]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredMediaFiles = mediaFiles.filter((file) => {
    if (filterType === 'image' && file.type && !file.type.startsWith('image/')) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      (file.name && file.name.toLowerCase().includes(query)) ||
      (file.url && file.url.toLowerCase().includes(query)) ||
      (file.format && file.format.toLowerCase().includes(query))
    );
  });

  const handleSelectUrl = (url: string, file?: StoredMediaFile) => {
    if (!url) return;
    onSelect(url, file);
    onClose();
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(10);
    setUploadError(null);

    try {
      const uploadedFile = await uploadMediaToCloudinary(file, 'website_assets', (p) => {
        setUploadProgress(Math.min(95, Math.max(15, p)));
      });

      setUploadProgress(100);
      const updatedList = [uploadedFile, ...mediaFiles.filter(f => f.id !== uploadedFile.id)];
      setMediaFiles(updatedList);
      saveCachedMediaFiles(updatedList);

      handleSelectUrl(uploadedFile.url, uploadedFile);
    } catch (err: any) {
      console.error('Failed to upload image:', err);
      setUploadError(err.message || 'Failed to upload image. Please check format and try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRefreshSync = async () => {
    setIsSyncing(true);
    try {
      const synced = await syncCloudinaryResources();
      setMediaFiles(synced);
    } catch (e) {
      console.warn('Sync failed:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs cursor-pointer"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden z-10 ${
            isLight
              ? 'bg-white border-slate-200 text-slate-900 shadow-slate-900/20'
              : 'bg-slate-900 border-slate-800 text-slate-100 shadow-black/60'
          }`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                {title}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Select from dashboard media, upload a new asset, or use curated presets.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              aria-label="Close media picker"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between px-5 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 shrink-0 gap-2 overflow-x-auto">
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : isLight
                    ? 'text-slate-600 hover:bg-slate-200/60'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span>Dashboard Media</span>
                {mediaFiles.length > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      activeTab === 'dashboard'
                        ? 'bg-indigo-700/80 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {mediaFiles.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'upload'
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : isLight
                    ? 'text-slate-600 hover:bg-slate-200/60'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span>Upload New</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'presets'
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : isLight
                    ? 'text-slate-600 hover:bg-slate-200/60'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span>Stock Library</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'url'
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : isLight
                    ? 'text-slate-600 hover:bg-slate-200/60'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span>Direct URL</span>
              </button>
            </div>

            {activeTab === 'dashboard' && (
              <button
                type="button"
                onClick={handleRefreshSync}
                disabled={isSyncing}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0 text-xs font-medium flex items-center gap-1"
                title="Sync & refresh media assets"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-indigo-500' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-5 min-h-[340px]">
            {activeTab === 'dashboard' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search dashboard media by name, format or tag..."
                      className={`w-full pl-9 pr-4 py-2 rounded-xl border text-xs outline-none transition-all ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 text-slate-900'
                          : 'bg-slate-800/80 border-slate-700 focus:bg-slate-900 focus:border-indigo-500 text-slate-100'
                      }`}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Upload New</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="hidden"
                  />
                </div>

                {filteredMediaFiles.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                    {filteredMediaFiles.map((file) => {
                      const isCurrent = currentValue === file.url;
                      return (
                        <div
                          key={file.id}
                          onClick={() => handleSelectUrl(file.url, file)}
                          className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all duration-150 flex flex-col ${
                            isCurrent
                              ? 'ring-2 ring-indigo-500 border-indigo-500 shadow-md'
                              : isLight
                              ? 'bg-slate-50 border-slate-200 hover:border-indigo-300 hover:shadow-md hover:bg-white'
                              : 'bg-slate-800/60 border-slate-700/80 hover:border-indigo-500/50 hover:bg-slate-800 hover:shadow-md'
                          }`}
                        >
                          <div className="relative aspect-4/3 w-full bg-slate-950/20 dark:bg-slate-950 flex items-center justify-center overflow-hidden">
                            <img
                              src={file.url}
                              alt={file.name}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />

                            {isCurrent && (
                              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
                                <Check className="w-3 h-3" />
                                <span>Active</span>
                              </div>
                            )}

                            <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-mono text-white/90">
                              {file.format ? file.format.toUpperCase() : file.type?.split('/')[1]?.toUpperCase() || 'IMG'}
                              {file.size ? ` • ${Math.round(file.size / 1024)} KB` : ''}
                            </div>

                            <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold shadow-lg flex items-center gap-1.5 transform scale-95 group-hover:scale-100 transition-transform">
                                <Check className="w-3.5 h-3.5" />
                                <span>Select Asset</span>
                              </span>
                            </div>
                          </div>

                          <div className="p-2.5">
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate" title={file.name}>
                              {file.name || 'Untitled Asset'}
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5 font-mono">
                              {file.width && file.height ? `${file.width} × ${file.height}px` : 'Dashboard Media'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {searchQuery ? 'No media found matching your search' : 'No media files in your library yet'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                        {searchQuery
                          ? 'Try searching with a different term or clear the filter.'
                          : 'Upload an image asset from your computer or choose from our stock library.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('upload')}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload an Image Now</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="space-y-4 max-w-xl mx-auto py-2">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    isLight
                      ? 'border-slate-300 bg-slate-50/60 hover:bg-indigo-50/40 hover:border-indigo-400'
                      : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800/80 hover:border-indigo-500'
                  }`}
                >
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Click to browse or drag and drop image file
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Supports PNG, JPG, JPEG, SVG, WebP and GIF (up to 10MB)
                  </p>

                  {isUploading && (
                    <div className="mt-6 space-y-2">
                      <div className="flex items-center justify-between text-xs text-indigo-500 font-semibold">
                        <span>Uploading asset to cloud storage...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 transition-all duration-200 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {uploadError && (
                    <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    Instant Library Integration
                  </p>
                  <p>
                    Uploaded images are automatically saved to your media library and synced across your entire dashboard workspace.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'presets' && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() => setSelectedPresetCategory('All')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      selectedPresetCategory === 'All'
                        ? 'bg-indigo-600 text-white'
                        : isLight
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {STOCK_PRESETS.map((cat) => (
                    <button
                      key={cat.category}
                      type="button"
                      onClick={() => setSelectedPresetCategory(cat.category)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        selectedPresetCategory === cat.category
                          ? 'bg-indigo-600 text-white'
                          : isLight
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {cat.category}
                    </button>
                  ))}
                </div>

                <div className="space-y-6">
                  {STOCK_PRESETS.filter(
                    (c) => selectedPresetCategory === 'All' || c.category === selectedPresetCategory
                  ).map((group) => (
                    <div key={group.category} className="space-y-2.5">
                      <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {group.category}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {group.items.map((item) => {
                          const isCurrent = currentValue === item.url;
                          return (
                            <div
                              key={item.url}
                              onClick={() => handleSelectUrl(item.url)}
                              className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all duration-150 ${
                                isCurrent
                                  ? 'ring-2 ring-indigo-500 border-indigo-500 shadow-md'
                                  : isLight
                                  ? 'bg-slate-50 border-slate-200 hover:border-indigo-400 hover:shadow-md'
                                  : 'bg-slate-800/60 border-slate-700 hover:border-indigo-500 hover:shadow-md'
                              }`}
                            >
                              <div className="aspect-4/3 w-full bg-slate-950 flex items-center justify-center overflow-hidden relative">
                                <img
                                  src={item.url}
                                  alt={item.name}
                                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                />
                                {isCurrent && (
                                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-bold flex items-center gap-1 shadow-md">
                                    <Check className="w-3 h-3" />
                                    <span>Active</span>
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <span className="px-2.5 py-1 rounded-md bg-indigo-600 text-white text-xs font-medium shadow-md flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    <span>Select</span>
                                  </span>
                                </div>
                              </div>
                              <div className="p-2">
                                <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                                  {item.name}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'url' && (
              <div className="space-y-4 max-w-xl mx-auto py-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Direct Image URL
                  </label>
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={customUrlInput}
                        onChange={(e) => setCustomUrlInput(e.target.value)}
                        placeholder="https://images.unsplash.com/... or https://domain.com/logo.png"
                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                          isLight
                            ? 'bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 text-slate-900'
                            : 'bg-slate-800 border-slate-700 focus:bg-slate-900 focus:border-indigo-500 text-slate-100'
                        }`}
                        autoFocus
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectUrl(customUrlInput.trim())}
                      disabled={!customUrlInput.trim()}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs shrink-0 flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Apply URL</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Paste any direct web link to an image file (.png, .jpg, .svg, .webp).
                  </p>
                </div>

                {customUrlInput.trim() && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                      Live URL Preview
                    </span>
                    <div className="aspect-16/9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden flex items-center justify-center relative">
                      <img
                        src={customUrlInput.trim()}
                        alt="Live URL Preview"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
            <div className="flex items-center gap-2">
              {currentValue ? (
                <button
                  type="button"
                  onClick={() => {
                    onSelect('');
                    onClose();
                  }}
                  className="text-xs text-rose-500 hover:text-rose-600 font-medium cursor-pointer transition-colors"
                >
                  Clear Current Image
                </button>
              ) : (
                <span className="text-[11px] text-slate-400">
                  Select an asset to update your input field.
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
