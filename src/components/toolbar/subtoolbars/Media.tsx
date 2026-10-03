import React from 'react';
import { Video, Maximize2, Square } from 'lucide-react';
import { WebsiteElement } from '../../../types';
import { ActiveToolType } from './Group';

interface MediaProps {
  element: WebsiteElement;
  activeTool: ActiveToolType;
  toggleTool: (tool: ActiveToolType) => void;
  isLight: boolean;
}

export type MediaToolbarProps = MediaProps;
export type MediaSubToolbarProps = MediaProps;

export const MediaToolbar: React.FC<MediaProps> = ({
  element,
  activeTool,
  toggleTool,
  isLight,
}) => {
  return (
    <div className="flex items-center shrink-0">
      <button
        type="button"
        onClick={() => toggleTool('mediaSource')}
        className={`px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
          activeTool === 'mediaSource'
            ? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
            : isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
        }`}
        title="Embed URL"
      >
        <Video className="w-3.5 h-3.5 text-indigo-500" />
        <span>Media Source</span>
      </button>

      <div className={`h-4 w-[1px] shrink-0 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />

      <button
        type="button"
        onClick={() => toggleTool('imageAspect')}
        className={`px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
          activeTool === 'imageAspect'
            ? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
            : isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
        }`}
        title="Aspect Ratio"
      >
        <Maximize2 className="w-3.5 h-3.5" />
        <span>Aspect Ratio</span>
      </button>

      <div className={`h-4 w-[1px] shrink-0 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />

      <button
        type="button"
        onClick={() => toggleTool('imageBorder')}
        className={`px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
          activeTool === 'imageBorder'
            ? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
            : isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
        }`}
        title="Border & Corners"
      >
        <Square className="w-3.5 h-3.5" />
        <span>Border</span>
      </button>
    </div>
  );
};

export const Media = MediaToolbar;
export const MediaSubToolbar = MediaToolbar;
