import React from 'react';
import { Mail, CircleCheck, Send, PaintBucket } from 'lucide-react';
import { WebsiteElement } from '../../../types';
import { ActiveToolType } from './Group';

interface FormProps {
  element: WebsiteElement;
  activeTool: ActiveToolType;
  toggleTool: (tool: ActiveToolType) => void;
  isLight: boolean;
}

export type FormToolbarProps = FormProps;
export type FormSubToolbarProps = FormProps;

export const FormToolbar: React.FC<FormProps> = ({
  element,
  activeTool,
  toggleTool,
  isLight,
}) => {
  return (
    <div className="flex items-center shrink-0">
      <div className={`px-2 py-0.5 mr-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 border shrink-0 ${
        isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-indigo-950/80 border-indigo-700/60 text-indigo-300'
      }`}>
        <Mail className="w-3.5 h-3.5 text-indigo-500" />
        <span>Form Container</span>
      </div>

      <button
        type="button"
        onClick={() => toggleTool('formResponseSettings')}
        className={`px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
          activeTool === 'formResponseSettings'
            ? isLight ? 'text-emerald-600 font-bold' : 'text-emerald-400 font-bold'
            : isLight ? 'text-slate-700 hover:text-emerald-600' : 'text-slate-200 hover:text-emerald-400'
        }`}
        title="Configure form endpoint and success/error responses"
      >
        <CircleCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Response & Endpoint</span>
      </button>

      <div className={`h-4 w-[1px] shrink-0 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />

      <button
        type="button"
        onClick={() => toggleTool('formSubmitSettings')}
        className={`px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
          activeTool === 'formSubmitSettings'
            ? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
            : isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
        }`}
        title="Submit button text and appearance"
      >
        <Send className="w-3.5 h-3.5 text-indigo-500" />
        <span>Submit Button</span>
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
        title="Form Container Style & Background"
      >
        <PaintBucket className="w-3.5 h-3.5" />
        <span>Style</span>
      </button>
    </div>
  );
};

export const Form = FormToolbar;
export const FormSubToolbar = FormToolbar;
