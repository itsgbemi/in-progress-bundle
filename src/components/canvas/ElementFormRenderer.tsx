import React from 'react';
import { Send, ChevronUp, ChevronDown, Trash2, Upload, Calendar, Plus } from 'lucide-react';
import { WebsiteElement, SelectedElementContext, EditorMode } from '../../types';

export interface ElementFormRendererProps {
element: WebsiteElement;
sectionId: string;
editorMode: EditorMode;
isSelected: boolean;
selectedContext: SelectedElementContext | null;
selectedFormFieldId: string | null;
setSelectedFormFieldId: (id: string | null) => void;
onSelect: (ctx: SelectedElementContext) => void;
onOpenEditBox?: (ctx: SelectedElementContext) => void;
onUpdate: (updatedElement: WebsiteElement) => void;
isLight: boolean;
shadowClass: string;
hoverClass: string;
styleObj: React.CSSProperties;
renderChildElement?: (child: WebsiteElement) => React.ReactNode;
onAddElementToColumn?: (sectionId: string, parentId: string) => void;
}

export const ElementFormRenderer: React.FC<ElementFormRendererProps> = ({
element,
sectionId,
editorMode,
isSelected,
selectedContext,
selectedFormFieldId,
setSelectedFormFieldId,
onSelect,
onOpenEditBox,
onUpdate,
isLight,
shadowClass,
hoverClass,
styleObj,
renderChildElement,
onAddElementToColumn,
}) => {
const fields = element.formFields || [];
const submitText = element.formSubmitText || 'Submit Message';
const submitAlign = element.formSubmitAlign || 'full';
const isFormSelected = isSelected && !selectedContext?.subItemPart;
const isContainerSelected = isSelected && selectedContext?.subItemPart === 'form-container';

const [submissionStatus, setSubmissionStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
const [isSubmitting, setIsSubmitting] = React.useState(false);
const [hoveredFieldId, setHoveredFieldId] = React.useState<string | null>(null);
const [isButtonHovered, setIsButtonHovered] = React.useState(false);

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
if (editorMode === 'edit') return;

setSubmissionStatus('idle');
setIsSubmitting(true);

try {
const formData = new FormData(e.currentTarget as HTMLFormElement);
const data: Record<string, any> = {};
formData.forEach((value, key) => {
data[key] = value;
});

const response = await fetch('/api/submit-form', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
...data,
formId: element.id,
pageTitle: document.title,
formNotificationGmailEnabled: !!element.formNotificationGmailEnabled,
formNotificationTelegramEnabled: !!element.formNotificationTelegramEnabled,
}),
});

const result = await response.json();

if (result.success) {
setSubmissionStatus('success');
if (element.formAutoReset) {
(e.currentTarget as HTMLFormElement).reset();
}
setTimeout(() => setSubmissionStatus('idle'), 5000);
} else {
setSubmissionStatus('error');
}
} catch (err) {
console.error('Form submission error:', err);
setSubmissionStatus('error');
} finally {
setIsSubmitting(false);
}
};

return (
<div
style={styleObj}
onClick={(e) => {
if (editorMode === 'edit') {
e.stopPropagation();
onSelect({ element, sectionId, subItemPart: 'form-container', formPart: 'container' });
onOpenEditBox?.({ element, sectionId, subItemPart: 'form-container', formPart: 'container' });
}
}}
className={`w-full rounded-2xl border p-6 sm:p-8 transition-all relative ${shadowClass} ${hoverClass} ${
!styleObj.backgroundColor ? (isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800') : ''
} ${
(isFormSelected || isContainerSelected) && editorMode === 'edit' ? 'ring-2 ring-indigo-500/50' : ''
}`}
>
<form
onSubmit={handleSubmit}
className="flex flex-wrap -mx-2 gap-y-4 w-full"
>
{element.showFormTitle !== false && (element.content || element.formTitle) && (
<div className="w-full px-2 mb-2">
<h3 className={`text-base sm:text-lg font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>
{element.content || element.formTitle}
</h3>
{element.showFormSubtitle && element.formSubtitle && (
<p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
{element.formSubtitle}
</p>
)}
</div>
)}

{renderChildElement && element.children && element.children.length > 0 && (
<div className="w-full px-2 flex flex-col gap-4">
{element.children.map((child) => renderChildElement(child))}
</div>
)}

{submissionStatus !== 'idle' && (
<div className={`w-full px-2 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
<div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 border ${
submissionStatus === 'success'
? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
}`}>
{submissionStatus === 'success' ? (
<>
<div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
<span>{element.formSuccessMessage || 'Thank you! Your submission has been received.'}</span>
</>
) : (
<>
<div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
<span>Something went wrong. Please try again.</span>
</>
)}
</div>
</div>
)}

{renderChildElement && (!element.children || element.children.length === 0) && editorMode === 'edit' && fields.length === 0 && (
<div
onClick={(e) => {
e.stopPropagation();
onAddElementToColumn?.(sectionId, element.id);
}}
className="w-full px-2 mb-4"
>
<div className={`w-full py-12 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${
isLight ? 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50' : 'border-slate-800 bg-slate-900/30 hover:bg-slate-800/30'
} cursor-pointer group/formslot`}>
<div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover/formslot:scale-110 transition-transform">
<Plus className="w-6 h-6" />
</div>
<div className="text-center">
<p className={`text-sm font-bold ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>Form Canvas Area</p>
<p className="text-xs text-slate-500 mt-1">Drag fields or click to add elements here</p>
</div>
</div>
</div>
)}

{fields.map((field, idx) => {
const isFieldActive =
(selectedFormFieldId === field.id) ||
(selectedContext?.subItemIndex === idx && selectedContext?.subItemPart === 'form-field') ||
(selectedContext?.formFieldId === field.id && selectedContext?.formPart === 'field');

const isLabelActive =
(selectedContext?.subItemIndex === idx && selectedContext?.subItemPart === 'form-label') ||
(selectedContext?.formFieldId === field.id && selectedContext?.formPart === 'label');

const isFieldHovered = hoveredFieldId === field.id;

const fieldLabel = field.label !== undefined ? field.label : `Field ${idx + 1}`;
const fieldPlaceholder = field.placeholder !== undefined ? field.placeholder : '';

const inputStyle: React.CSSProperties = {
borderRadius: field.borderRadius !== undefined ? `${field.borderRadius}px` : (element.styles?.fieldBorderRadius !== undefined ? `${element.styles.fieldBorderRadius}px` : undefined),
backgroundColor: (isFieldActive && (field.focusBackgroundColor || element.focusBackgroundColor || element.styles?.focusBackgroundColor))
? (field.focusBackgroundColor || element.focusBackgroundColor || element.styles?.focusBackgroundColor)
: (isFieldHovered && (field.hoverBackgroundColor || element.styles?.fieldHoverBackgroundColor))
? (field.hoverBackgroundColor || element.styles?.fieldHoverBackgroundColor)
: (field.backgroundColor || element.styles?.fieldBackgroundColor || (isLight ? '#f8fafc' : '#0f172a')),
color: field.textColor || element.styles?.fieldTextColor || (isLight ? '#0f172a' : '#f8fafc'),
borderColor: (isFieldActive && (field.focusBorderColor || element.focusBorderColor || element.styles?.focusBorderColor))
? (field.focusBorderColor || element.focusBorderColor || element.styles?.focusBorderColor)
: (isFieldHovered && (field.hoverBorderColor || element.styles?.fieldHoverBorderColor))
? (field.hoverBorderColor || element.styles?.fieldHoverBorderColor)
: (field.borderColor || element.styles?.fieldBorderColor || (isLight ? '#cbd5e1' : '#334155')),
borderWidth: field.borderWidth !== undefined ? `${field.borderWidth}px` : (element.styles?.fieldBorderWidth !== undefined ? `${element.styles.fieldBorderWidth}px` : undefined),
paddingLeft: field.paddingX !== undefined ? `${field.paddingX}px` : (element.styles?.fieldPaddingX !== undefined ? `${element.styles.fieldPaddingX}px` : undefined),
paddingRight: field.paddingX !== undefined ? `${field.paddingX}px` : (element.styles?.fieldPaddingX !== undefined ? `${element.styles.fieldPaddingX}px` : undefined),
paddingTop: field.paddingY !== undefined ? `${field.paddingY}px` : (element.styles?.fieldPaddingY !== undefined ? `${element.styles.fieldPaddingY}px` : undefined),
paddingBottom: field.paddingY !== undefined ? `${field.paddingY}px` : (element.styles?.fieldPaddingY !== undefined ? `${element.styles.fieldPaddingY}px` : undefined),
fontSize: field.fontSize ? `${field.fontSize}px` : (element.styles?.fieldFontSize ? `${element.styles.fieldFontSize}px` : undefined),
boxShadow: (isFieldActive && (field.focusRingColor || element.focusRingColor || element.styles?.focusRingColor))
? `0 0 0 ${(field.focusRingWidth !== undefined ? field.focusRingWidth : element.focusRingWidth !== undefined ? element.focusRingWidth : element.styles?.focusRingWidth !== undefined ? element.styles.focusRingWidth : 2)}px ${field.focusRingColor || element.focusRingColor || element.styles?.focusRingColor}`
: (isFieldActive && (field.focusShadow || element.styles?.fieldFocusShadow))
? (field.focusShadow || element.styles?.fieldFocusShadow)
: undefined,
};

const labelStyle: React.CSSProperties = {
fontFamily: field.labelTypeface ? `"${field.labelTypeface}", sans-serif` : (element.styles?.labelTypeface ? `"${element.styles.labelTypeface}", sans-serif` : undefined),
fontSize: field.labelFontSize ? `${field.labelFontSize}px` : (element.styles?.labelFontSize ? `${element.styles.labelFontSize}px` : undefined),
fontWeight: field.labelFontWeight ? (field.labelFontWeight as any) : (element.styles?.labelFontWeight ? (element.styles.labelFontWeight as any) : undefined),
color: field.labelColor || element.styles?.labelColor || undefined,
letterSpacing: field.labelLetterSpacing ? `${field.labelLetterSpacing}em` : (element.styles?.labelLetterSpacing ? `${element.styles.labelLetterSpacing}em` : undefined),
lineHeight: field.labelLineHeight ? field.labelLineHeight : (element.styles?.labelLineHeight ? element.styles.labelLineHeight : undefined),
};

const fieldWidthClass =
field.width === '1/2' ? 'w-full sm:w-1/2 px-2' :
field.width === '1/3' ? 'w-full sm:w-1/3 px-2' :
field.width === '1/4' ? 'w-full sm:w-1/4 px-2' :
field.width === '2/3' ? 'w-full sm:w-2/3 px-2' :
field.width === '3/4' ? 'w-full sm:w-3/4 px-2' : 'w-full px-2';

const labelPos = field.labelPosition || element.styles?.labelPosition || 'top';
const isInlineLabel = labelPos === 'left' || labelPos === 'right';

const fieldId = field.id ? `field-${field.id}` : `field-${idx}`;

const renderLabelNode = () => {
if (field.showLabel === false) return null;
return (
<label htmlFor={fieldId} className={`flex items-center justify-between ${isInlineLabel ? 'shrink-0' : 'mb-1.5'}`}>
<div
onClick={(e) => {
if (editorMode === 'edit') {
e.stopPropagation();
setSelectedFormFieldId(field.id);
onSelect({
element,
sectionId,
subItemIndex: idx,
subItemPart: 'form-label',
formFieldId: field.id,
formFieldIndex: idx,
formPart: 'label',
});
onOpenEditBox?.({
element,
sectionId,
subItemIndex: idx,
subItemPart: 'form-label',
formFieldId: field.id,
formFieldIndex: idx,
formPart: 'label',
});
}
}}
style={labelStyle}
className={`text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all rounded px-1 -mx-1 ${
isLabelActive && editorMode === 'edit'
? 'ring-2 ring-indigo-500 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 font-bold'
: isLight ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'
}`}
>
<span
contentEditable={editorMode === 'edit'}
suppressContentEditableWarning
onBlur={(e) => {
const newLabel = e.currentTarget.textContent || '';
const updated = fields.map((f, i) => (i === idx ? { ...f, label: newLabel } : f));
onUpdate({ ...element, formFields: updated });
}}
className="outline-none"
>
{fieldLabel}
</span>
{field.required && <span className="text-rose-500 font-bold">*</span>}
</div>

{editorMode === 'edit' && isFieldActive && !isInlineLabel && (
<div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-md px-1.5 py-0.5 shadow-md" onClick={(e) => e.stopPropagation()}>
<span className="text-[9px] font-mono uppercase text-indigo-300 px-1">
{field.type}
</span>
{idx > 0 && (
<button
type="button"
onClick={(e) => {
e.stopPropagation();
const updated = [...fields];
const temp = updated[idx];
updated[idx] = updated[idx - 1];
updated[idx - 1] = temp;
onUpdate({ ...element, formFields: updated });
}}
className="p-0.5 hover:text-white text-slate-400 cursor-pointer"
title="Move field up"
>
<ChevronUp className="w-3 h-3" />
</button>
)}
{idx < fields.length - 1 && (
<button
type="button"
onClick={(e) => {
e.stopPropagation();
const updated = [...fields];
const temp = updated[idx];
updated[idx] = updated[idx + 1];
updated[idx + 1] = temp;
onUpdate({ ...element, formFields: updated });
}}
className="p-0.5 hover:text-white text-slate-400 cursor-pointer"
title="Move field down"
>
<ChevronDown className="w-3 h-3" />
</button>
)}
<button
type="button"
onClick={(e) => {
e.stopPropagation();
const updated = fields.filter((_, i) => i !== idx);
onUpdate({ ...element, formFields: updated });
setSelectedFormFieldId(null);
}}
className="p-0.5 hover:text-rose-400 text-slate-400 cursor-pointer"
title="Delete field"
>
<Trash2 className="w-3 h-3" />
</button>
</div>
)}
</label>
);
};

const renderInputNode = () => {
const phColor = field.placeholderColor || element.styles?.placeholderColor;
const phSize = field.placeholderFontSize || element.styles?.placeholderFontSize;
const helperColor = field.helperTextColor || element.styles?.helperTextColor;
const helperFontSize = field.helperTextFontSize || element.styles?.helperTextFontSize;

return (
<div
className="flex-1 w-full"
onMouseEnter={() => setHoveredFieldId(field.id)}
onMouseLeave={() => setHoveredFieldId(null)}
>
{(phColor || phSize) && (
<style>{`
#${fieldId}::placeholder {
${phColor ? `color: ${phColor} !important; opacity: 1;` : ''}
${phSize ? `font-size: ${phSize}px !important;` : ''}
}
`}</style>
)}
{field.type === 'textarea' ? (
<textarea
id={fieldId}
rows={field.rows || 4}
placeholder={field.showPlaceholder !== false ? fieldPlaceholder : undefined}
required={field.required}
disabled={editorMode === 'edit'}
style={inputStyle}
className={`w-full text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border transition-all resize-y ${
!field.backgroundColor
? isLight
? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
: 'bg-slate-900/90 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
: ''
}`}
/>
) : field.type === 'select' ? (
<select
id={fieldId}
required={field.required}
disabled={editorMode === 'edit'}
style={inputStyle}
className={`w-full text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border transition-all ${
!field.backgroundColor
? isLight
? 'bg-slate-50 border-slate-300 text-slate-900'
: 'bg-slate-900/90 border-slate-700 text-slate-100'
: ''
}`}
>
<option value="">{fieldPlaceholder || 'Select an option...'}</option>
{(field.options || ['Option 1', 'Option 2', 'Option 3']).map((opt, oIdx) => (
<option key={oIdx} value={opt}>
{opt}
</option>
))}
</select>
) : field.type === 'radio' ? (
<div className="flex flex-col gap-2 pt-1">
{(field.options || ['Option 1', 'Option 2', 'Option 3']).map((opt, oIdx) => {
const rid = `${fieldId}-radio-${oIdx}`;
return (
<label key={oIdx} htmlFor={rid} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300 cursor-pointer">
<input
type="radio"
id={rid}
name={`radio-${field.id || idx}`}
disabled={editorMode === 'edit'}
defaultChecked={oIdx === 0}
className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-600 bg-slate-800"
/>
<span className={isLight ? 'text-slate-700' : 'text-slate-300'}>{opt}</span>
</label>
);
})}
</div>
) : field.type === 'checkbox' ? (
<div className="flex flex-col gap-2 pt-1">
{(field.options || ['Accept terms and conditions']).map((opt, oIdx) => {
const cid = `${fieldId}-cb-${oIdx}`;
return (
<label key={oIdx} htmlFor={cid} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300 cursor-pointer">
<input
type="checkbox"
id={cid}
disabled={editorMode === 'edit'}
defaultChecked={oIdx === 0}
className="w-4 h-4 text-indigo-600 rounded-sm focus:ring-indigo-500 border-slate-600 bg-slate-800"
/>
<span className={isLight ? 'text-slate-700' : 'text-slate-300'}>{opt}</span>
</label>
);
})}
</div>
) : field.type === 'file' ? (
<label
htmlFor={fieldId}
style={inputStyle}
className={`w-full border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer ${
!field.backgroundColor
? isLight
? 'border-slate-300 bg-slate-50/60 hover:border-indigo-500'
: 'border-slate-700 bg-slate-900/40 hover:border-indigo-400'
: ''
}`}
>
<input type="file" id={fieldId} className="hidden" disabled={editorMode === 'edit'} />
<Upload className="w-5 h-5 text-indigo-400" />
<span className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
{fieldPlaceholder || 'Click or drag file to upload'}
</span>
<span className="text-[10px] text-slate-500">
{field.accept ? `Accepted formats: ${field.accept}` : 'PDF, DOCX, PNG, JPG up to 10MB'}
</span>
</label>
) : (
<div className="relative">
<input
id={fieldId}
type={field.type || 'text'}
placeholder={field.showPlaceholder !== false ? fieldPlaceholder : undefined}
required={field.required}
disabled={editorMode === 'edit'}
style={inputStyle}
className={`w-full text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border transition-all ${
!field.backgroundColor
? isLight
? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
: 'bg-slate-900/90 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
: ''
}`}
/>
{field.type === 'date' && (
<Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
)}
</div>
)}

{field.helperText && (
<p
className="text-[10px] text-slate-500 mt-1"
style={{
color: helperColor || undefined,
fontSize: helperFontSize ? `${helperFontSize}px` : undefined,
}}
>
{field.helperText}
</p>
)}
</div>
);
};

return (
<div key={field.id || idx} className={fieldWidthClass}>
<div
onClick={(e) => {
if (editorMode === 'edit') {
e.stopPropagation();
setSelectedFormFieldId(field.id);
onSelect({
element,
sectionId,
subItemIndex: idx,
subItemPart: 'form-field',
formFieldId: field.id,
formFieldIndex: idx,
formPart: 'field',
});
onOpenEditBox?.({
element,
sectionId,
subItemIndex: idx,
subItemPart: 'form-field',
formFieldId: field.id,
formFieldIndex: idx,
formPart: 'field',
});
}
}}
className={`relative rounded-xl p-2.5 transition-all group/field ${
editorMode === 'edit'
? isFieldActive
? 'outline-dashed outline-2 outline-indigo-500 outline-offset-2 bg-indigo-500/5 shadow-xs'
: 'hover:outline-dashed hover:outline-2 hover:outline-indigo-400/70 hover:outline-offset-2 cursor-pointer'
: ''
} ${
field.fieldAlignment === 'center' ? 'text-center' :
field.fieldAlignment === 'right' ? 'text-right' : 'text-left'
}`}
>
{editorMode === 'edit' && isFieldActive && fields.length > 1 && (
<button
type="button"
onClick={(e) => {
e.stopPropagation();
const newFields = fields.filter((_, fIdx) => fIdx !== idx);
onUpdate({
...element,
formFields: newFields,
});
}}
className="absolute -top-3 right-2 bg-rose-600 hover:bg-rose-500 text-white rounded-md px-1.5 py-0.5 text-[10px] font-bold shadow-md flex items-center gap-1 z-30 transition-colors cursor-pointer"
title="Delete this field"
>
<Trash2 className="w-2.5 h-2.5" />
<span>Delete Field</span>
</button>
)}
{labelPos === 'bottom' ? (
<div className="flex flex-col gap-1.5">
{renderInputNode()}
{renderLabelNode()}
</div>
) : labelPos === 'left' ? (
<div className="flex items-center gap-3">
<div className="w-1/3 min-w-[90px]">{renderLabelNode()}</div>
<div className="flex-1">{renderInputNode()}</div>
</div>
) : labelPos === 'right' ? (
<div className="flex items-center gap-3">
<div className="flex-1">{renderInputNode()}</div>
<div className="w-1/3 min-w-[90px]">{renderLabelNode()}</div>
</div>
) : (
<div>
{renderLabelNode()}
{renderInputNode()}
</div>
)}
</div>
</div>
);
})}

{fields.length === 0 && editorMode === 'edit' && (
<div
onClick={() => {
onSelect({
element,
sectionId,
formPart: 'container',
});
}}
className={`w-full py-8 px-4 border border-dashed rounded-xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-colors ${
isLight
? 'border-slate-300 bg-slate-50 hover:border-indigo-500 hover:bg-indigo-50/20'
: 'border-slate-800 bg-slate-900/30 hover:border-indigo-500 hover:bg-indigo-950/20'
}`}
>
<Plus className="w-5 h-5 text-indigo-400 animate-pulse" />
<span className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
No form fields yet
</span>
<span className="text-[11px] text-slate-500">
Use "Add Field to Form" in inspector to add fields
</span>
</div>
)}

{fields.length > 0 && (() => {
const btnCustomStyle: React.CSSProperties = {
backgroundColor: isButtonHovered && element.formSubmitHoverBgColor
? element.formSubmitHoverBgColor
: (element.formSubmitBgColor || undefined),
color: isButtonHovered && element.formSubmitHoverTextColor
? element.formSubmitHoverTextColor
: (element.formSubmitTextColor || undefined),
borderRadius: element.formSubmitBorderRadius !== undefined ? `${element.formSubmitBorderRadius}px` : undefined,
paddingLeft: element.formSubmitPaddingX !== undefined ? `${element.formSubmitPaddingX}px` : undefined,
paddingRight: element.formSubmitPaddingX !== undefined ? `${element.formSubmitPaddingX}px` : undefined,
paddingTop: element.formSubmitPaddingY !== undefined ? `${element.formSubmitPaddingY}px` : undefined,
paddingBottom: element.formSubmitPaddingY !== undefined ? `${element.formSubmitPaddingY}px` : undefined,
fontSize: element.formSubmitFontSize ? `${element.formSubmitFontSize}px` : undefined,
fontWeight: element.formSubmitFontWeight ? (element.formSubmitFontWeight as any) : undefined,
borderColor: element.formSubmitBorderColor || undefined,
borderWidth: element.formSubmitBorderWidth !== undefined ? `${element.formSubmitBorderWidth}px` : undefined,
boxShadow: element.formSubmitShadow || undefined,
transform: isButtonHovered && element.formSubmitHoverEffect === 'scale' ? 'scale(1.05)' : undefined,
};

return (
<div
className={`w-full px-2 pt-3 flex ${
submitAlign === 'left'
? 'justify-start'
: submitAlign === 'center'
? 'justify-center'
: submitAlign === 'right'
? 'justify-end'
: 'w-full'
}`}
>
<button
type={editorMode === 'edit' ? 'button' : 'submit'}
onMouseEnter={() => setIsButtonHovered(true)}
onMouseLeave={() => setIsButtonHovered(false)}
onClick={(e) => {
if (editorMode === 'edit') {
e.preventDefault();
e.stopPropagation();
onSelect({
element,
sectionId,
subItemPart: 'form-button',
formPart: 'button',
});
onOpenEditBox?.({
element,
sectionId,
subItemPart: 'form-button',
formPart: 'button',
rect: e.currentTarget.getBoundingClientRect(),
});
}
}}
style={btnCustomStyle}
disabled={isSubmitting}
className={`py-3 px-6 rounded-xl font-semibold text-xs sm:text-sm text-white ${
!element.formSubmitBgColor ? 'bg-indigo-600 hover:bg-indigo-500' : ''
} active:scale-[0.99] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
submitAlign === 'full' ? 'w-full' : ''
} ${
selectedContext?.subItemPart === 'form-button' && editorMode === 'edit'
? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900'
: ''
} ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
>
{isSubmitting ? (
<>
<div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
<span>{element.formSubmittingText || 'Submitting...'}</span>
</>
) : (
<>
<span
contentEditable={editorMode === 'edit'}
suppressContentEditableWarning
onBlur={(e) => {
const val = e.currentTarget.textContent || '';
onUpdate({ ...element, formSubmitText: val });
}}
>
{submitText}
</span>
<Send className="w-3.5 h-3.5" />
</>
)}
</button>
</div>
);
})()}
</form>
</div>
);
};
