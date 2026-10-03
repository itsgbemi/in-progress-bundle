import React from 'react';
import {
  Compass,
  Plus,
  Link as LinkIcon,
  Trash2,
  ArrowUpDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
} from 'lucide-react';
import { WebsiteElement } from '../../../types';
import { ActiveToolType } from './Group';

interface NavContainerProps {
  element: WebsiteElement;
  onUpdateElement: (updatedElement: WebsiteElement) => void;
  activeTool: ActiveToolType;
  toggleTool: (tool: ActiveToolType) => void;
  isLight: boolean;
  showNavInsertMenu: boolean;
  setShowNavInsertMenu: React.Dispatch<React.SetStateAction<boolean>>;
  newLinkText: string;
  setNewLinkText: React.Dispatch<React.SetStateAction<string>>;
  newLinkUrl: string;
  setNewLinkUrl: React.Dispatch<React.SetStateAction<string>>;
  getNavChildrenList: (el: WebsiteElement) => WebsiteElement[];
  handleAddNavQuickLink: () => void;
  updateNavLinkProp: (childIdx: number, prop: 'label' | 'href', value: string) => void;
  deleteNavLinkItem: (childIdx: number) => void;
}

export type NavContainerToolbarProps = NavContainerProps;
export type NavContainerSubToolbarProps = NavContainerProps;

export const NavContainerToolbar: React.FC<NavContainerProps> = ({
  element,
  onUpdateElement,
  activeTool,
  toggleTool,
  isLight,
  showNavInsertMenu,
  setShowNavInsertMenu,
  newLinkText,
  setNewLinkText,
  newLinkUrl,
  setNewLinkUrl,
  getNavChildrenList,
  handleAddNavQuickLink,
  updateNavLinkProp,
  deleteNavLinkItem,
}) => {
  return (
    <div className="flex items-center shrink-0">
      <div className={`px-2 py-0.5 mr-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 border shrink-0 ${
        isLight
          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
          : 'bg-indigo-950/80 border-indigo-700/60 text-indigo-300'
      }`}>
        <Compass className="w-3.5 h-3.5 text-indigo-500" />
        <span>&lt;nav&gt; Navigation Box</span>
      </div>

      <div className="relative shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowNavInsertMenu((prev) => !prev);
          }}
          className={`px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            isLight
              ? 'text-indigo-700 hover:text-indigo-600'
              : 'text-indigo-300 hover:text-indigo-200'
          }`}
          title="Add or edit navigation links"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Insert Link</span>
        </button>

        {showNavInsertMenu && (
          <div
            className={`absolute left-0 top-full mt-2 w-72 sm:w-80 rounded-xl shadow-2xl border p-3 z-50 animate-in fade-in zoom-in-95 duration-150 ${
              isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-1 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700/20 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Navigation Links ({getNavChildrenList(element).length})</span>
              </span>
              <button
                type="button"
                onClick={() => setShowNavInsertMenu(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 mb-3">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newLinkText}
                  onChange={(e) => setNewLinkText(e.target.value)}
                  placeholder="Link Label (e.g. Features)"
                  className={`flex-1 px-2.5 py-1.5 text-xs rounded-lg border ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                      : 'bg-slate-950 border-slate-700 text-slate-100 focus:bg-slate-900'
                  } outline-none focus:ring-1 focus:ring-indigo-500`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNavQuickLink();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddNavQuickLink}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
              <input
                type="text"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="URL / Anchor (optional, e.g. #features)"
                className={`w-full px-2.5 py-1 text-[11px] font-mono rounded-lg border ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-700'
                    : 'bg-slate-950 border-slate-700 text-slate-300'
                } outline-none focus:ring-1 focus:ring-indigo-500`}
              />
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {getNavChildrenList(element).map((linkItem, idx) => (
                <div
                  key={linkItem.id || idx}
                  className={`p-2 rounded-lg border text-xs space-y-1.5 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <input
                      type="text"
                      value={linkItem.content || linkItem.label || ''}
                      onChange={(e) => updateNavLinkProp(idx, 'label', e.target.value)}
                      className={`flex-1 px-1.5 py-1 font-semibold text-xs rounded border ${
                        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'
                      } outline-none focus:border-indigo-500`}
                      placeholder="Label"
                    />
                    <button
                      type="button"
                      onClick={() => deleteNavLinkItem(idx)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
                      title="Remove link"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={linkItem.href || '#'}
                      onChange={(e) => updateNavLinkProp(idx, 'href', e.target.value)}
                      placeholder="URL (e.g. #pricing)"
                      className={`w-full px-1.5 py-0.5 font-mono text-[11px] rounded border ${
                        isLight
                          ? 'bg-white border-slate-200 text-slate-600'
                          : 'bg-slate-900 border-slate-700 text-slate-300'
                      } outline-none focus:border-indigo-500`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={`h-4 w-[1px] shrink-0 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />
      <button
        type="button"
        onClick={() => toggleTool('containerGap')}
        className={`px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
          activeTool === 'containerGap'
            ? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
            : isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
        }`}
        title="Adjust Nav Item Gap"
      >
        <span>Gap</span>
      </button>

      <div className="border-l pl-1.5 border-slate-700/30">
        <button
          type="button"
          onClick={() => {
            const isCol = element.styles?.flexDirection === 'column';
            onUpdateElement({
              ...element,
              styles: {
                ...(element.styles || {}),
                flexDirection: isCol ? 'row' : 'column',
              },
            });
          }}
          className={`p-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
            element.styles?.flexDirection === 'column'
              ? 'bg-indigo-600 text-white'
              : isLight
              ? 'hover:bg-slate-200 text-slate-700'
              : 'hover:bg-slate-800 text-slate-300'
          }`}
          title={`Switch layout direction (${element.styles?.flexDirection === 'column' ? 'Row' : 'Column'})`}
        >
          <ArrowUpDown className="w-4 h-4" />
          <span className="text-xs font-semibold hidden md:inline">{element.styles?.flexDirection === 'column' ? 'Vertical' : 'Horizontal'}</span>
        </button>
      </div>

      <div className="flex items-center gap-0.5 border-l pl-1.5 border-slate-700/30">
        {[
          { key: 'flex-start', icon: AlignLeft, label: 'Align Left' },
          { key: 'center', icon: AlignCenter, label: 'Center' },
          { key: 'flex-end', icon: AlignRight, label: 'Align Right' },
          { key: 'space-between', icon: AlignJustify, label: 'Space Between' },
        ].map((align) => {
          const IconComp = align.icon;
          const isActive = (element.styles?.justifyContent || 'flex-start') === align.key;
          return (
            <button
              key={align.key}
              type="button"
              onClick={() => {
                onUpdateElement({
                  ...element,
                  styles: { ...(element.styles || {}), justifyContent: align.key },
                });
              }}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : isLight
                  ? 'hover:bg-slate-200 text-slate-600'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
              title={align.label}
            >
              <IconComp className="w-4 h-4" />
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5 border-l pl-2 border-slate-700/30" title="Nav Links Text Color">
        <Palette className="w-4 h-4 opacity-70 shrink-0" />
        <span className="text-xs font-medium hidden sm:inline">Color:</span>
        <input
          type="color"
          value={element.styles?.textColor || (isLight ? '#334155' : '#cbd5e1')}
          onChange={(e) => {
            const color = e.target.value;
            const updatedChildren = getNavChildrenList(element).map((c) => ({
              ...c,
              styles: { ...(c.styles || {}), textColor: color },
            }));
            onUpdateElement({
              ...element,
              styles: { ...(element.styles || {}), textColor: color },
              children: updatedChildren,
            });
          }}
          className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
        />
      </div>
    </div>
  );
};

export const NavContainer = NavContainerToolbar;
export const NavContainerSubToolbar = NavContainerToolbar;
