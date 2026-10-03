import React from 'react';
import { Link as LinkIcon, Palette } from 'lucide-react';
import { WebsiteElement } from '../../../types';

interface NavLinkProps {
  element: WebsiteElement;
  onUpdateElement: (updatedElement: WebsiteElement) => void;
  isLight: boolean;
}

export type NavLinkToolbarProps = NavLinkProps;
export type NavLinkSubToolbarProps = NavLinkProps;

export const NavLinkToolbar: React.FC<NavLinkProps> = ({
  element,
  onUpdateElement,
  isLight,
}) => {
  return (
    <div className="flex items-center gap-2 shrink-0 flex-wrap py-0.5">
      <div className={`px-2 py-1 rounded text-xs font-mono font-bold flex items-center gap-1 border shrink-0 ${
        isLight
          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
          : 'bg-indigo-950/80 border-indigo-700/60 text-indigo-300'
      }`}>
        <LinkIcon className="w-3.5 h-3.5 text-indigo-500" />
        <span>Nav Link</span>
      </div>

      <div className="flex items-center gap-1 border-l pl-2 border-slate-700/30">
        <span className="text-xs font-medium opacity-70 hidden sm:inline">Text:</span>
        <input
          type="text"
          value={element.content || element.label || ''}
          onChange={(e) => {
            onUpdateElement({
              ...element,
              content: e.target.value,
              label: e.target.value,
            });
          }}
          placeholder="Link Text"
          className={`w-32 sm:w-40 px-2.5 py-1 text-xs rounded-md border outline-none ${
            isLight
              ? 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500'
              : 'bg-slate-950 border-slate-700 text-slate-100 focus:border-indigo-500'
          }`}
        />
      </div>

      <div className="flex items-center gap-1 border-l pl-2 border-slate-700/30">
        <span className="text-xs font-medium opacity-70 hidden sm:inline">URL:</span>
        <input
          type="text"
          value={element.href || '#'}
          onChange={(e) => {
            onUpdateElement({
              ...element,
              href: e.target.value,
            });
          }}
          placeholder="URL / Anchor (e.g. #pricing)"
          className={`w-36 sm:w-48 px-2.5 py-1 text-[11px] font-mono rounded-md border outline-none ${
            isLight
              ? 'bg-white border-slate-200 text-slate-700 focus:border-indigo-500'
              : 'bg-slate-950 border-slate-700 text-slate-300 focus:border-indigo-500'
          }`}
        />
      </div>

      <div className="flex items-center border-l pl-2 border-slate-700/30 gap-1">
        <button
          type="button"
          onClick={() => {
            onUpdateElement({
              ...element,
              target: element.target === '_blank' ? '_self' : '_blank',
            });
          }}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
            element.target === '_blank'
              ? 'bg-indigo-600 text-white font-semibold'
              : isLight
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
          title="Open link in new tab"
        >
          {element.target === '_blank' ? 'New Tab (_blank)' : 'Same Tab (_self)'}
        </button>
      </div>

      <div className="flex items-center gap-1.5 border-l pl-2 border-slate-700/30" title="Link Text Color">
        <Palette className="w-4 h-4 opacity-70 shrink-0" />
        <input
          type="color"
          value={element.styles?.textColor || (isLight ? '#334155' : '#cbd5e1')}
          onChange={(e) => {
            onUpdateElement({
              ...element,
              styles: { ...(element.styles || {}), textColor: e.target.value },
            });
          }}
          className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
        />
      </div>
    </div>
  );
};

export const NavLink = NavLinkToolbar;
export const NavLinkSubToolbar = NavLinkToolbar;
