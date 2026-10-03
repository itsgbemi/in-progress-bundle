import React from 'react';
import { FileText, Pencil, PaintBucket } from 'lucide-react';
import { WebsiteElement } from '../../../types';
import { ActiveToolType } from './Group';

interface FormFieldProps {
  element: WebsiteElement;
  activeTool: ActiveToolType;
  toggleTool: (tool: ActiveToolType) => void;
  isLight: boolean;
}

export type FormFieldToolbarProps = FormFieldProps;
export type FormFieldSubToolbarProps = FormFieldProps;

export const FormFieldToolbar: React.FC<FormFieldProps> = ({
  element,
  activeTool,
  toggleTool,
  isLight,
}) => {
  const elementType = (element.type || 'text') as string;

  return (
    <div className="flex items-center shrink-0">
      <div className={`px-2 py-0.5 mr-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 border shrink-0 ${
        isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-indigo-950/80 border-indigo-700/60 text-indigo-300'
      }`}>
        <FileText className="w-3.5 h-3.5 text-indigo-500" />
        <span>Field: {elementType.replace('form-', '').toUpperCase()}</span>
      </div>

      <button
        type="button"
        onClick={() => toggleTool('formInputSettings')}
        className={`px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
          activeTool === 'formInputSettings'
            ? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
            : isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
        }`}
        title="Field Label, Placeholder & Required toggle"
      >
        <Pencil className="w-3.5 h-3.5 text-indigo-500" />
        <span>Field Settings</span>
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
        title="Input Field Styling & Colors"
      >
        <PaintBucket className="w-3.5 h-3.5" />
        <span>Style</span>
      </button>
    </div>
  );
};

export const FormField = FormFieldToolbar;
export const FormFieldSubToolbar = FormFieldToolbar;
