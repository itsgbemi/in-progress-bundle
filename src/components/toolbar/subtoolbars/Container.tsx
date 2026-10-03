import React from 'react';
import { WebsiteElement } from '../../../types';
import { ActiveToolType } from './Group';

interface ContainerProps {
  element: WebsiteElement;
  activeTool: ActiveToolType;
  toggleTool: (tool: ActiveToolType) => void;
  isLight: boolean;
}

export type ContainerToolbarProps = ContainerProps;
export type ContainerSubToolbarProps = ContainerProps;

export const ContainerToolbar: React.FC<ContainerProps> = ({
  element,
  activeTool,
  toggleTool,
  isLight,
}) => {
  return (
    <div className="flex items-center shrink-0">
      <button
        type="button"
        onClick={() => toggleTool('containerLayout')}
        className={`px-3 py-1 text-xs font-semibold flex items-center transition-colors cursor-pointer ${
          activeTool === 'containerLayout'
            ? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
            : isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
        }`}
        title="Grid / Layout"
      >
        <span>Layout</span>
      </button>

      <div className={`h-4 w-[1px] shrink-0 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />

      <button
        type="button"
        onClick={() => toggleTool('containerWidth')}
        className={`px-3 py-1 text-xs font-semibold flex items-center transition-colors cursor-pointer ${
          activeTool === 'containerWidth'
            ? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
            : isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
        }`}
        title="Container Width & Max-Width"
      >
        <span>Width</span>
      </button>

      <div className={`h-4 w-[1px] shrink-0 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />

      <button
        type="button"
        onClick={() => toggleTool('containerPadding')}
        className={`px-3 py-1 text-xs font-semibold flex items-center transition-colors cursor-pointer ${
          activeTool === 'containerPadding'
            ? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
            : isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
        }`}
        title="Padding & Spacing"
      >
        <span>Padding</span>
      </button>

      <div className={`h-4 w-[1px] shrink-0 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />

      <button
        type="button"
        onClick={() => toggleTool('backgroundColor')}
        className={`px-3 py-1 text-xs font-semibold flex items-center transition-colors cursor-pointer ${
          activeTool === 'backgroundColor'
            ? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
            : isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
        }`}
        title="Background Fill"
      >
        <span>Background</span>
      </button>

      <div className={`h-4 w-[1px] shrink-0 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />

      <button
        type="button"
        onClick={() => toggleTool('containerBorder')}
        className={`px-3 py-1 text-xs font-semibold flex items-center transition-colors cursor-pointer ${
          activeTool === 'containerBorder'
            ? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
            : isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
        }`}
        title="Border & Corners"
      >
        <span>Border</span>
      </button>
    </div>
  );
};

export const Container = ContainerToolbar;
export const ContainerSubToolbar = ContainerToolbar;
