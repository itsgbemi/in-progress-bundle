import React, { useState, useMemo, useRef, useEffect } from 'react';
import { WebsitePage } from '../../../../types';
import { generateFullHtml } from '../../../../utils/htmlGenerator';
import {
  Lock,
  Eye,
  Settings,
  Copy,
  Trash2,
  Pencil,
  Check,
  MoreVertical
} from 'lucide-react';

interface WebpageSnapshotCardProps {
  page: WebsitePage;
  isSelected: boolean;
  onToggleSelect: (pageId: string, event: React.MouseEvent) => void;
  onPreviewPage: (page: WebsitePage) => void;
  onOpenEditModal: (page: WebsitePage) => void;
  onDuplicatePage: (pageId: string) => void;
  onDeletePage: (pageId: string) => void;
  onOpenPageInEditor: (pageId: string) => void;
  getStatusBadge: (page: WebsitePage) => React.ReactNode;
  isLight: boolean;
  showSelectionCheckbox?: boolean;
}

export const WebpageSnapshotCard: React.FC<WebpageSnapshotCardProps> = ({
  page,
  isSelected,
  onToggleSelect,
  onPreviewPage,
  onOpenEditModal,
  onDuplicatePage,
  onDeletePage,
  onOpenPageInEditor,
  getStatusBadge,
  isLight,
  showSelectionCheckbox = false,
}) => {
  const [, setIsIframeLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const exportedHtml = useMemo(() => {
    try {
      const rawHtml = generateFullHtml(page);
      const noScrollbarStyles = `
        <style>
          html, body {
            overflow: hidden !important;
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          * {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          ::-webkit-scrollbar, *::-webkit-scrollbar {
            display: none !important;
            width: 0px !important;
            height: 0px !important;
            background: transparent !important;
          }
        </style>
      `;

      if (rawHtml.includes('</head>')) {
        return rawHtml.replace('</head>', `${noScrollbarStyles}</head>`);
      }
      return `${noScrollbarStyles}${rawHtml}`;
    } catch (err) {
      console.warn('Failed to generate full HTML for snapshot:', err);
      return `<!DOCTYPE html><html><head><title>${page.title}</title><style>html,body{overflow:hidden!important;scrollbar-width:none!important;}::-webkit-scrollbar{display:none!important;}</style></head><body><div style="padding:20px;font-family:sans-serif;"><h2>${page.title}</h2><p>Preview loading...</p></div></body></html>`;
    }
  }, [page]);

  return (
    <div
      onClick={() => onOpenPageInEditor(page.id)}
      className={`group relative rounded-xl border overflow-hidden flex flex-col justify-between transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'ring-2 ring-indigo-500 border-indigo-500 shadow-md scale-[1.01]'
          : isLight
          ? 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
          : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:shadow-md'
      }`}
    >
      <div className="p-3 px-3.5 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-900/70">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {showSelectionCheckbox && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect(page.id, e);
              }}
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-indigo-600 border-indigo-600 text-white ring-2 ring-indigo-400'
                  : isLight
                  ? 'bg-white border-slate-300 hover:border-indigo-500'
                  : 'bg-slate-800 border-slate-700 hover:border-indigo-400'
              }`}
              title={isSelected ? 'Deselect page' : 'Select page'}
              aria-label={`Select ${page.title}`}
            >
              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
            </button>
          )}

          <div className="min-w-0 flex-1 flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" title={page.title}>
                {page.title}
              </span>
              {page.passwordProtected && (
                <span title="Password Protected" className="p-0.5 rounded text-amber-500 shrink-0">
                  <Lock className="w-3 h-3" />
                </span>
              )}
            </div>
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
              {page.fileName || `${page.title.toLowerCase().replace(/\s+/g, '-')}.html`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden xs:block">
            {getStatusBadge(page)}
          </div>

          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen((prev) => !prev);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center border border-slate-200/80 dark:border-slate-800"
              title="More Options"
              aria-label="More Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <div
                className={`absolute right-0 top-full mt-1.5 w-44 max-w-[calc(100vw-2rem)] rounded-2xl border shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150 ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-800 shadow-slate-300/50'
                    : 'bg-slate-900 border-slate-800 text-slate-100 shadow-black/70'
                }`}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    onOpenPageInEditor(page.id);
                  }}
                  className="w-full px-3.5 py-2 text-xs font-medium flex items-center gap-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors text-left cursor-pointer"
                >
                  <Pencil className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Edit Page</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
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
                    setIsMenuOpen(false);
                    onOpenEditModal(page);
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
                    setIsMenuOpen(false);
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
                    setIsMenuOpen(false);
                    onDeletePage(page.id);
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

      <div className="p-3.5 pt-2.5">
        <div className="relative w-full aspect-[16/9] bg-slate-950 rounded-lg overflow-hidden border border-slate-200/60 dark:border-slate-800/80 shadow-xs">
          <iframe
            srcDoc={exportedHtml}
            title={`Preview snapshot for ${page.title}`}
            sandbox="allow-same-origin"
            scrolling="no"
            loading="lazy"
            onLoad={() => setIsIframeLoaded(true)}
            className="w-full h-full border-0 pointer-events-none select-none overflow-hidden"
            style={{ overflow: 'hidden' }}
          />
        </div>
      </div>
    </div>
  );
};
