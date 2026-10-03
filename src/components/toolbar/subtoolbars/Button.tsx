import React from 'react';
import { Pencil, Palette, Sparkles, Maximize2, Link as LinkIcon } from 'lucide-react';
import { WebsiteElement } from '../../../types';
import { ActiveToolType } from './Group';

interface ButtonProps {
  element: WebsiteElement;
  activeTool: ActiveToolType;
  toggleTool: (tool: ActiveToolType) => void;
  isLight: boolean;
}

export type ButtonSubToolbarProps = ButtonProps;
export type ButtonToolbarProps = ButtonProps;

export const ButtonToolbar: React.FC<ButtonProps> = ({
  element,
  activeTool,
  toggleTool,
  isLight,
}) => {
  const s = element.styles || {};
  return (
    <div className="flex items-center shrink-0">
      <button
        type="button"
        onClick={() => toggleTool('buttonText')}
        className={`px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
          activeTool === 'buttonText'
            ? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
            : isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
        }`}
        title="Button Label"
      >
        <Pencil className="w-3.5 h-3.5" />
        <span>Label</span>
      </button>

      <div className={`h-4 w-[1px] shrink-0 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />

      <button
        type="button"
        onClick={() => toggleTool('buttonVariant')}
        className={`px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
          activeTool === 'buttonVariant'
            ? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
            : isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
        }`}
        title="Button Variant"
      >
        <Palette className="w-3.5 h-3.5" />
        <span>Variant</span>
      </button>

      <div className={`h-4 w-[1px] shrink-0 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />

      <button
        type="button"
        onClick={() => toggleTool('buttonIcon')}
        className={`px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
          activeTool === 'buttonIcon'
            ? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
            : isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
        }`}
        title="Button Icon"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Icon</span>
      </button>

      <div className={`h-4 w-[1px] shrink-0 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />

      <button
        type="button"
        onClick={() => toggleTool('buttonSize')}
        className={`px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
          activeTool === 'buttonSize'
            ? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
            : isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
        }`}
        title="Button Size & Radius"
      >
        <Maximize2 className="w-3.5 h-3.5" />
        <span>Size</span>
      </button>

      <div className={`h-4 w-[1px] shrink-0 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />

      <button
        type="button"
        onClick={() => toggleTool('link')}
        className={`px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
          activeTool === 'link' || s.href
            ? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
            : isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
        }`}
        title="Button Link URL"
      >
        <LinkIcon className="w-3.5 h-3.5" />
        <span>Link</span>
      </button>
    </div>
  );
};

export const Button = ButtonToolbar;
export const ButtonSubToolbar = ButtonToolbar;
