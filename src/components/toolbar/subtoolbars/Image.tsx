import React from 'react';
import {
  Image as ImageIcon,
  Crop,
  Maximize2,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Square,
  SquareDashed,
  ExternalLink,
} from 'lucide-react';
import { WebsiteElement } from '../../../types';
import { ActiveToolType } from './Group';

interface ImageProps {
  element: WebsiteElement;
  activeTool: ActiveToolType;
  toggleTool: (tool: ActiveToolType) => void;
  isLight: boolean;
}

export type ImageToolbarProps = ImageProps;
export type ImageSubToolbarProps = ImageProps;

export const ImageToolbar: React.FC<ImageProps> = ({
  element,
  activeTool,
  toggleTool,
  isLight,
}) => {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <button
        type="button"
        onClick={() => toggleTool('imageSource')}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
          activeTool === 'imageSource' || activeTool === 'imageAlt'
            ? isLight ? 'bg-slate-200/80 text-indigo-600 font-bold' : 'bg-slate-800 text-indigo-400 font-bold'
            : isLight ? 'hover:bg-slate-200/80 text-slate-700' : 'hover:bg-slate-800 text-slate-200'
        }`}
        title="Image Source & Metadata"
      >
        <ImageIcon className="w-4 h-4 text-indigo-500" />
      </button>

      <button
        type="button"
        onClick={() => toggleTool('imageAspect')}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
          activeTool === 'imageAspect'
            ? isLight ? 'bg-slate-200/80 text-indigo-600 font-bold' : 'bg-slate-800 text-indigo-400 font-bold'
            : isLight ? 'hover:bg-slate-200/80 text-slate-700' : 'hover:bg-slate-800 text-slate-200'
        }`}
        title="Crop & Aspect Ratio"
      >
        <Crop className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => toggleTool('imageSize')}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
          activeTool === 'imageSize'
            ? isLight ? 'bg-slate-200/80 text-indigo-600 font-bold' : 'bg-slate-800 text-indigo-400 font-bold'
            : isLight ? 'hover:bg-slate-200/80 text-slate-700' : 'hover:bg-slate-800 text-slate-200'
        }`}
        title="Size & Dimensions"
      >
        <Maximize2 className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => toggleTool('imageTransform')}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
          activeTool === 'imageTransform'
            ? isLight ? 'bg-slate-200/80 text-indigo-600 font-bold' : 'bg-slate-800 text-indigo-400 font-bold'
            : isLight ? 'hover:bg-slate-200/80 text-slate-700' : 'hover:bg-slate-800 text-slate-200'
        }`}
        title="Rotation & Flip Transforms"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => toggleTool('imageAdjust')}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
          activeTool === 'imageAdjust'
            ? isLight ? 'bg-slate-200/80 text-indigo-600 font-bold' : 'bg-slate-800 text-indigo-400 font-bold'
            : isLight ? 'hover:bg-slate-200/80 text-slate-700' : 'hover:bg-slate-800 text-slate-200'
        }`}
        title="Filter Presets, Brightness & Contrast"
      >
        <SlidersHorizontal className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => toggleTool('imageHover')}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
          activeTool === 'imageHover' || activeTool === 'imageShadow'
            ? isLight ? 'bg-slate-200/80 text-indigo-600 font-bold' : 'bg-slate-800 text-indigo-400 font-bold'
            : isLight ? 'hover:bg-slate-200/80 text-slate-700' : 'hover:bg-slate-800 text-slate-200'
        }`}
        title="Hover Effects & Shadow Depth"
      >
        <Sparkles className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => toggleTool('imageRadius')}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
          activeTool === 'imageRadius'
            ? isLight ? 'bg-slate-200/80 text-indigo-600 font-bold' : 'bg-slate-800 text-indigo-400 font-bold'
            : isLight ? 'hover:bg-slate-200/80 text-slate-700' : 'hover:bg-slate-800 text-slate-200'
        }`}
        title="Corner Radius"
      >
        <Square className="w-4 h-4 rounded-xs" />
      </button>

      <button
        type="button"
        onClick={() => toggleTool('imageBorder')}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
          activeTool === 'imageBorder'
            ? isLight ? 'bg-slate-200/80 text-indigo-600 font-bold' : 'bg-slate-800 text-indigo-400 font-bold'
            : isLight ? 'hover:bg-slate-200/80 text-slate-700' : 'hover:bg-slate-800 text-slate-200'
        }`}
        title="Border Style, Width & Color"
      >
        <SquareDashed className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => toggleTool('imageLink')}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
          activeTool === 'imageLink' || element.href
            ? isLight ? 'bg-slate-200/80 text-indigo-600 font-bold' : 'bg-slate-800 text-indigo-400 font-bold'
            : isLight ? 'hover:bg-slate-200/80 text-slate-700' : 'hover:bg-slate-800 text-slate-200'
        }`}
        title="Click Action & Link Destination"
      >
        <ExternalLink className="w-4 h-4" />
      </button>
    </div>
  );
};

export const Image = ImageToolbar;
export const ImageSubToolbar = ImageToolbar;
