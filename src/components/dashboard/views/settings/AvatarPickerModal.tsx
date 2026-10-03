import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Sliders, Image as ImageIcon, HardDrive, Check } from 'lucide-react';
import { Input } from '../../../common';
import { AvatarAdjustEditor } from './AvatarAdjustEditor';
import { getCachedMediaFiles, StoredMediaFile } from '../../../../services/storageService';

interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  uiTheme: 'dark' | 'light';
  isUploading?: boolean;
  onFileUpload: (file: File) => void;
  onSaveAdjusted?: (blob: Blob, dataUrl: string) => void | Promise<void>;
  initialAdjustSource?: string | null;
}

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  uiTheme,
  isUploading,
  onFileUpload,
  onSaveAdjusted,
  initialAdjustSource,
}) => {
  const [activeTab, setActiveTab] = useState<'media' | 'upload' | 'url'>('media');
  const [customUrl, setCustomUrl] = useState('');
  const [adjustingSource, setAdjustingSource] = useState<string | null>(null);
  const [dashboardMedia, setDashboardMedia] = useState<StoredMediaFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLight = uiTheme === 'light';

  useEffect(() => {
    if (isOpen) {
      setDashboardMedia(getCachedMediaFiles());
      if (initialAdjustSource) {
        setAdjustingSource(initialAdjustSource);
      } else {
        setAdjustingSource(null);
      }
    } else {
      setAdjustingSource(null);
    }
  }, [isOpen, initialAdjustSource]);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onSelect(customUrl.trim());
      onClose();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const objectUrl = URL.createObjectURL(file);
      setAdjustingSource(objectUrl);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md rounded-2xl overflow-hidden border shadow-2xl transition-colors ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-slate-950 border-slate-800 text-white'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold tracking-tight">
            {adjustingSource ? 'Adjust Profile Picture' : 'Choose Avatar'}
          </h3>
          <button
            onClick={() => {
              setAdjustingSource(null);
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {adjustingSource ? (
          <div className="p-4 sm:p-5">
            <AvatarAdjustEditor
              imageSource={adjustingSource}
              uiTheme={uiTheme}
              isSaving={isUploading}
              onCancel={() => {
                setAdjustingSource(null);
                if (initialAdjustSource) {
                  onClose();
                }
              }}
              onSave={async (croppedDataUrl, blob) => {
                if (onSaveAdjusted) {
                  await onSaveAdjusted(blob, croppedDataUrl);
                } else {
                  onSelect(croppedDataUrl);
                }
                setAdjustingSource(null);
                onClose();
              }}
            />
          </div>
        ) : (
          <>
            <div className="px-6 pt-4">
              <div className="flex p-1 gap-1 rounded-full bg-slate-100 dark:bg-slate-900">
                <button
                  onClick={() => setActiveTab('media')}
                  className={`flex-1 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'media'
                      ? 'bg-[var(--brand-primary)] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <HardDrive className="w-3 h-3" />
                  <span>Media</span>
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'upload'
                      ? 'bg-[var(--brand-primary)] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Upload
                </button>
                <button
                  onClick={() => setActiveTab('url')}
                  className={`flex-1 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'url'
                      ? 'bg-[var(--brand-primary)] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Link
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'media' && (
                <div className="space-y-4">
                  {dashboardMedia.length > 0 ? (
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 max-h-[260px] overflow-y-auto pr-1">
                      {dashboardMedia
                        .filter((f) => !f.type || f.type.startsWith('image/'))
                        .map((media) => (
                          <div
                            key={media.id}
                            title={`Select ${media.name}`}
                            onClick={() => {
                              onSelect(media.url);
                              onClose();
                            }}
                            className={`group relative p-1 rounded-full border flex flex-col items-center justify-center cursor-pointer transition-all aspect-square overflow-hidden ${
                              isLight
                                ? 'border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-slate-100'
                                : 'border-slate-800 hover:border-indigo-500 bg-slate-900 hover:bg-slate-800'
                            }`}
                          >
                            <img
                              src={media.url}
                              alt={media.name}
                              className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition-opacity">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                            <button
                              type="button"
                              title="Adjust framing & crop"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAdjustingSource(media.url);
                              }}
                              className="absolute bottom-1 right-1 p-1 rounded-full bg-slate-900/90 hover:bg-indigo-600 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer shadow-xs"
                            >
                              <Sliders className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center space-y-2">
                      <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs text-slate-500">No dashboard media files found.</p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('upload')}
                        className="px-3.5 py-1.5 rounded-full bg-[var(--brand-primary)] text-white text-xs font-semibold cursor-pointer"
                      >
                        Upload an Image
                      </button>
                    </div>
                  )}
                  <p className="text-[11px] text-slate-400 text-center">
                    Select any image from your workspace media library to adjust and use as your profile avatar.
                  </p>
                </div>
              )}

              {activeTab === 'url' && (
                <form onSubmit={handleUrlSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Direct Image Link (HTTPS URL)
                    </label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="url"
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        placeholder="https://example.com/avatar.png"
                        variant="pill"
                        isLight={isLight}
                        autoFocus
                        containerClassName="flex-1"
                      />
                      <button
                        type="submit"
                        disabled={!customUrl.trim()}
                        className="px-4 py-3 rounded-full bg-[var(--brand-primary)] hover:opacity-90 disabled:opacity-50 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs shrink-0 flex items-center gap-1.5"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Adjust & Apply</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">
                      Paste any image URL to preview, adjust framing, and scale your picture.
                    </p>
                  </div>
                </form>
              )}

              {activeTab === 'upload' && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center mx-auto">
                    {isUploading ? <Upload className="w-7 h-7 animate-bounce" /> : <Upload className="w-7 h-7" />}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold">Upload Image from Device</h4>
                    <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                      Supports PNG, JPG, WEBP, or SVG. You can crop, resize, and center your photo after selection.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-5 py-2.5 rounded-full bg-[var(--brand-primary)] hover:opacity-90 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs inline-flex items-center gap-2"
                  >
                    <span>Browse & Adjust Picture</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
