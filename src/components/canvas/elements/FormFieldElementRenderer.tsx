import React from 'react';
import { WebsiteElement, EditorMode } from '../../../types';
import { Send, Upload } from 'lucide-react';

interface FormFieldElementRendererProps {
element: WebsiteElement;
editorMode: EditorMode;
isLight: boolean;
}

export const FormFieldElementRenderer: React.FC<FormFieldElementRendererProps> = ({
element,
editorMode,
isLight,
}) => {
const s = element.styles || {};
const inputLabel = element.label || element.inputLabel || 'Field Label';
const showLabel = (element as any).inputShowLabel !== false;
const ph = (element as any).placeholder || element.inputPlaceholder || '';
const isReq = Boolean(element.inputRequired);
const fieldType = element.type;

const inputCommonStyle: React.CSSProperties = {
color: s.textColor || (isLight ? '#0f172a' : '#f8fafc'),
backgroundColor: s.backgroundColor || (isLight ? '#f8fafc' : '#0f172a'),
borderColor: s.borderColor || (isLight ? '#cbd5e1' : '#334155'),
borderWidth: s.borderWidth !== undefined ? `${s.borderWidth}px` : '1px',
borderRadius: s.borderRadius !== undefined ? `${s.borderRadius}px` : '8px',
paddingTop: s.paddingY !== undefined ? `${s.paddingY}px` : '10px',
paddingBottom: s.paddingY !== undefined ? `${s.paddingY}px` : '10px',
paddingLeft: s.paddingX !== undefined ? `${s.paddingX}px` : '14px',
paddingRight: s.paddingX !== undefined ? `${s.paddingX}px` : '14px',
fontSize: s.fontSize ? `${s.fontSize}px` : '14px',
fontFamily: s.typeface ? `"${s.typeface}", sans-serif` : undefined,
};

const labelStyle: React.CSSProperties = {
color: (element as any).labelColor || s.labelColor || (isLight ? '#334155' : '#cbd5e1'),
fontSize: (element as any).labelFontSize ? `${(element as any).labelFontSize}px` : (s.labelFontSize ? `${s.labelFontSize}px` : '13px'),
fontWeight: (element as any).labelFontWeight || (s.labelFontWeight as any) || '600',
fontFamily: (element as any).labelTypeface ? `"${(element as any).labelTypeface}", sans-serif` : (s.labelTypeface ? `"${s.labelTypeface}", sans-serif` : undefined),
textAlign: ((s as any).labelAlignment as any) || (s.textAlign as any) || 'left',
};

if (fieldType === 'form-submit') {
return (
<button
type="button"
style={{
backgroundColor: s.backgroundColor || '#4f46e5',
color: s.textColor || '#ffffff',
borderRadius: s.borderRadius !== undefined ? `${s.borderRadius}px` : '8px',
paddingTop: s.paddingY !== undefined ? `${s.paddingY}px` : '10px',
paddingBottom: s.paddingY !== undefined ? `${s.paddingY}px` : '10px',
paddingLeft: s.paddingX !== undefined ? `${s.paddingX}px` : '20px',
paddingRight: s.paddingX !== undefined ? `${s.paddingX}px` : '20px',
fontWeight: (s.fontWeight as any) || '600',
fontSize: s.fontSize ? `${s.fontSize}px` : '14px',
width: s.fullWidth !== false ? '100%' : 'auto',
}}
className="inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:opacity-90 active:scale-[0.99]"
>
<span>{element.content || element.label || 'Submit Form'}</span>
<Send className="w-4 h-4" />
</button>
);
}

if (fieldType === 'form-checkbox') {
const cid = element.customId || undefined;
return (
<label htmlFor={cid} className="inline-flex items-center gap-2.5 cursor-pointer select-none">
<input
id={cid}
type="checkbox"
disabled={editorMode === 'edit'}
defaultChecked={element.inputDefaultChecked}
className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 accent-indigo-600"
/>
<span style={labelStyle}>
{inputLabel} {isReq && <span className="text-red-500">*</span>}
</span>
</label>
);
}

if (fieldType === 'form-radio') {
const opts = element.inputOptions || ['Option 1', 'Option 2'];
return (
<div className="space-y-2">
{showLabel && (
<div style={labelStyle} className="mb-1">
{inputLabel} {isReq && <span className="text-red-500">*</span>}
</div>
)}
<div className="flex flex-col gap-2">
{opts.map((opt, i) => {
const rid = element.customId ? `${element.customId}-${i}` : undefined;
return (
<label key={i} htmlFor={rid} className="inline-flex items-center gap-2 cursor-pointer select-none text-sm">
<input
id={rid}
type="radio"
name={`radio-${element.id}`}
disabled={editorMode === 'edit'}
defaultChecked={i === 0}
className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-700 accent-indigo-600"
/>
<span style={{ color: s.textColor || (isLight ? '#334155' : '#cbd5e1') }}>{opt}</span>
</label>
);
})}
</div>
</div>
);
}

const fieldId = element.customId || `field-${element.id}`;
const phColor = (element as any).placeholderColor || s.placeholderColor;
const phSize = (element as any).placeholderFontSize || s.placeholderFontSize;
const helperColor = (element as any).helperTextColor || s.helperTextColor;
const helperFontSize = (element as any).helperTextFontSize || s.helperTextFontSize;
const helperText = element.inputHelpText || (element as any).helperText;

return (
<div className="w-full space-y-1.5 text-left">
{(phColor || phSize) && (
<style>{`
#${fieldId}::placeholder {
${phColor ? `color: ${phColor} !important; opacity: 1;` : ''}
${phSize ? `font-size: ${phSize}px !important;` : ''}
}
`}</style>
)}
{showLabel && (
<label htmlFor={fieldId} style={labelStyle} className="block text-left">
{inputLabel} {isReq && <span className="text-red-500">*</span>}
</label>
)}
{fieldType === 'form-textarea' ? (
<textarea
id={fieldId}
rows={element.inputRows || 4}
placeholder={ph}
disabled={editorMode === 'edit'}
style={inputCommonStyle}
className="w-full border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y"
/>
) : fieldType === 'form-select' ? (
<select
id={fieldId}
disabled={editorMode === 'edit'}
style={inputCommonStyle}
className="w-full border focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
>
<option value="">{ph || 'Select an option...'}</option>
{(element.inputOptions || ['Option 1', 'Option 2', 'Option 3']).map((opt, i) => (
<option key={i} value={opt}>
{opt}
</option>
))}
</select>
) : fieldType === 'form-file' ? (
<label
htmlFor={fieldId}
style={inputCommonStyle}
className="w-full border-2 border-dashed flex flex-col items-center justify-center text-center gap-1.5 py-4 cursor-pointer"
>
<input type="file" id={fieldId} className="hidden" disabled={editorMode === 'edit'} />
<Upload className="w-5 h-5 text-indigo-500" />
<span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
{ph || 'Click or drag file to upload'}
</span>
<span 
className="text-[10px] text-slate-400"
style={{
color: helperColor || undefined,
fontSize: helperFontSize ? `${helperFontSize}px` : undefined,
}}
>
{element.inputHelpText || 'PNG, JPG, PDF up to 10MB'}
</span>
</label>
) : (
<input
id={fieldId}
type={
fieldType === 'form-input-email'
? 'email'
: fieldType === 'form-input-password'
? 'password'
: fieldType === 'form-input-number'
? 'number'
: fieldType === 'form-date'
? 'date'
: 'text'
}
placeholder={ph}
disabled={editorMode === 'edit'}
style={inputCommonStyle}
className="w-full border focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
/>
)}
{helperText && fieldType !== 'form-file' && (
<p
className="text-[10px] text-slate-400 mt-1"
style={{
color: helperColor || undefined,
fontSize: helperFontSize ? `${helperFontSize}px` : undefined,
}}
>
{helperText}
</p>
)}
</div>
);
};
