import React, { useState } from 'react';
import { MediaPickerModal } from './MediaPickerModal';
import {
  FolderOpen,
  X,
} from 'lucide-react';
import { StoredMediaFile } from '../../services/storageService';

export interface ImageInputWithMediaPickerProps {
  value: string;
  onChange: (value: string, file?: StoredMediaFile) => void;
  placeholder?: string;
  label?: string;
  hint?: string;
  uiTheme?: 'dark' | 'light';
  isLight?: boolean;
  variant?: 'pill' | 'rounded' | 'compact' | 'default';
  modalTitle?: string;
  showPreview?: boolean;
  className?: string;
  containerClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
  id?: string;
  filterType?: 'image' | 'all';
  showClearButton?: boolean;
}

export const ImageInputWithMediaPicker: React.FC<ImageInputWithMediaPickerProps> = ({
  value,
  onChange,
  placeholder = 'https://example.com/image.png or browse media...',
  label,
  hint,
  uiTheme,
  isLight: isLightProp,
  variant = 'rounded',
  modalTitle = 'Select Media Asset',
  showPreview = true,
  className = '',
  containerClassName = '',
  inputClassName = '',
  disabled = false,
  id,
  filterType = 'image',
  showClearButton = true,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewZoomOpen, setPreviewZoomOpen] = useState(false);

  const isLight = isLightProp !== undefined ? isLightProp : uiTheme === 'light';

  const roundedClasses =
    variant === 'pill'
      ? 'rounded-full'
      : variant === 'compact'
      ? 'rounded-lg'
      : 'rounded-xl';

  const hasRightAction = (Boolean(value) && !disabled && showClearButton) || !showPreview;

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            {label}
          </label>
        </div>
      )}

      <div className={`flex items-center gap-2 ${className}`}>
        {showPreview && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsModalOpen(true)}
            title={value ? 'Change selected media' : 'Select existing media from library'}
            aria-label={value ? 'Change selected media' : 'Select existing media from library'}
            className={`w-9.5 h-9.5 sm:w-10 sm:h-10 shrink-0 ${roundedClasses} border flex items-center justify-center overflow-hidden transition-all group ${
              disabled
                ? 'opacity-60 cursor-not-allowed'
                : 'cursor-pointer hover:ring-2 hover:ring-indigo-500/30 hover:border-indigo-400 dark:hover:border-indigo-500'
            } ${
              isLight
                ? value
                  ? 'bg-slate-100 border-slate-300 text-slate-400'
                  : 'bg-slate-100/90 hover:bg-indigo-50/70 border-slate-300 text-slate-500 hover:text-indigo-600 shadow-2xs'
                : value
                ? 'bg-slate-800 border-slate-700 text-slate-500'
                : 'bg-slate-800 hover:bg-indigo-950/60 border-slate-700 text-slate-400 hover:text-indigo-400 shadow-2xs'
            }`}
          >
            {value ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={value}
                  alt="Selected asset preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                  <FolderOpen className="w-3.5 h-3.5" />
                </div>
              </div>
            ) : (
              <FolderOpen className="w-4 h-4 transition-transform group-hover:scale-110" />
            )}
          </button>
        )}

        <div className="relative flex-1 flex items-center min-w-0">
          <input
            id={id}
            type="text"
            value={value || ''}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full ${roundedClasses} border text-xs outline-none transition-all ${
              hasRightAction ? (!showPreview ? 'pr-20' : 'pr-9') : 'pr-3.5'
            } ${
              variant === 'compact' ? 'px-2.5 py-1.5' : 'pl-3.5 py-2.5'
            } ${
              isLight
                ? 'bg-slate-50 border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 placeholder:text-slate-400'
                : 'bg-slate-800 border-slate-700 focus:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-slate-100 placeholder:text-slate-500'
            } ${inputClassName}`}
          />

          {hasRightAction && (
            <div className="absolute right-1.5 flex items-center gap-1">
              {value && !disabled && showClearButton && (
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  title="Clear input"
                  aria-label="Clear image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {!showPreview && (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => setIsModalOpen(true)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                    isLight
                      ? 'bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300'
                      : 'bg-indigo-950/70 border border-indigo-800 text-indigo-300 hover:bg-indigo-900 hover:text-white'
                  }`}
                  title="Select existing media in dashboard or upload new"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Media</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {hint && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
          {hint}
        </p>
      )}

      <MediaPickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(newUrl, file) => {
          onChange(newUrl, file);
        }}
        currentValue={value}
        title={modalTitle}
        uiTheme={isLight ? 'light' : 'dark'}
        filterType={filterType}
      />
    </div>
  );
};
