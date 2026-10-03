import React from 'react';
import { Smile, Maximize2, Palette, PaintBucket } from 'lucide-react';
import { WebsiteElement } from '../../../types';
import { ActiveToolType } from './Group';

interface IconProps {
  element: WebsiteElement;
  activeTool: ActiveToolType;
  toggleTool: (tool: ActiveToolType) => void;
  isLight: boolean;
}

export type IconToolbarProps = IconProps;
export type IconSubToolbarProps = IconProps;

export const IconToolbar: React.FC<IconProps> = ({
  element,
  activeTool,
  toggleTool,
  isLight,
}) => {
  return (
    <div className="flex items-center shrink-0">
      <button
        type="button"
        onClick={() => toggleTool('iconPicker')}
        className={`px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
          activeTool === 'iconPicker'
            ? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
            : isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
        }`}
        title="Change Icon"
      >
        <Smile className="w-3.5 h-3.5 text-indigo-500" />
        <span>Change Icon</span>
      </button>

      <div className={`h-4 w-[1px] shrink-0 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />

      <button
        type="button"
        onClick={() => toggleTool('iconSize')}
        className={`px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
          activeTool === 'iconSize'
            ? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
            : isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
        }`}
        title="Icon Size"
      >
        <Maximize2 className="w-3.5 h-3.5" />
        <span>Size</span>
      </button>

      <div className={`h-4 w-[1px] shrink-0 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />

      <button
        type="button"
        onClick={() => toggleTool('textColor')}
        className={`px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
          activeTool === 'textColor'
            ? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
            : isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
        }`}
        title="Icon Color"
      >
        <Palette className="w-3.5 h-3.5" />
        <span>Color</span>
      </button>

      <div className={`h-4 w-[1px] shrink-0 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />

      <button
        type="button"
        onClick={() => toggleTool('backgroundColor')}
        className={`px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
          activeTool === 'backgroundColor'
            ? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
            : isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
        }`}
        title="Icon Background"
      >
        <PaintBucket className="w-3.5 h-3.5" />
        <span>Background</span>
      </button>
    </div>
  );
};

export const Icon = IconToolbar;
export const IconSubToolbar = IconToolbar;
