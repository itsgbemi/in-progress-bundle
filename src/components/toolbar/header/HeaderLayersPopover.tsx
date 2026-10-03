import React from 'react';
import { ChevronLeft, ChevronRight, Copy, Trash2, Plus } from 'lucide-react';
import { WebsiteSection, WebsiteElement, SelectedElementContext } from '../../../types';

interface HeaderLayersPopoverProps {
  section: WebsiteSection;
  isLight: boolean;
  onSelectElement?: (context: SelectedElementContext) => void;
  onAddElementToSection?: (sectionId: string) => void;
  onMoveLayer: (idx: number, direction: 'left' | 'right') => void;
  onDuplicateLayer: (el: WebsiteElement) => void;
  onSetLayerToDelete: (el: WebsiteElement) => void;
}

export const HeaderLayersPopover: React.FC<HeaderLayersPopoverProps> = ({
  section,
  isLight,
  onSelectElement,
  onAddElementToSection,
  onMoveLayer,
  onDuplicateLayer,
  onSetLayerToDelete,
}) => {
  return (
    <>
      <div className="flex items-center justify-between pb-1.5 mb-1">
        <span className="text-[11px] font-medium text-slate-400">Total Layers</span>
        <span className="text-[10px] text-slate-400 font-mono">
          {section.elements.length} Total
        </span>
      </div>

      <div className="space-y-0.5 max-h-56 overflow-y-auto pr-1">
        {section.elements.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            No blocks in header. Add one below!
          </div>
        ) : (
          section.elements.map((el, idx) => {
            const elType = el.type || 'element';
            const elLabel = el.label || `Block ${idx + 1}`;
            return (
              <div
                key={el.id}
                className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-xs transition-colors cursor-pointer ${
                  isLight
                    ? 'hover:bg-slate-100 text-slate-700'
                    : 'hover:bg-slate-800/80 text-slate-200'
                }`}
              >
                <div
                  className="flex items-center gap-2 flex-1 min-w-0"
                  onClick={() => onSelectElement?.({ element: el, sectionId: section.id })}
                >
                  <span className="w-5 h-5 rounded-md text-slate-400 flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <div className="font-semibold truncate">{elLabel}</div>
                    <div className="text-[10px] text-slate-400 capitalize">{elType}</div>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => onMoveLayer(idx, 'left')}
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                    title="Move Left"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === section.elements.length - 1}
                    onClick={() => onMoveLayer(idx, 'right')}
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                    title="Move Right"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDuplicateLayer(el)}
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer text-slate-400 hover:text-indigo-400"
                    title="Duplicate"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetLayerToDelete(el);
                    }}
                    className="p-1 rounded hover:bg-red-500/10 text-slate-400 hover:text-red-400 cursor-pointer"
                    title="Delete Layer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <button
        type="button"
        onClick={() => onAddElementToSection?.(section.id)}
        className="w-full mt-2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add Element</span>
      </button>
    </>
  );
};
