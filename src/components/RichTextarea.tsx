import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, RemoveFormatting, List, ListOrdered } from 'lucide-react';
import { sanitizeHtml } from '../utils/sanitizer';
interface RichTextareaProps {
label?: string;
value: string;
onChange: (newValue: string) => void;
placeholder?: string;
rows?: number;
isLight?: boolean;
helpText?: string;
allowLists?: boolean;
id?: string;
}
export const RichTextarea: React.FC<RichTextareaProps> = ({ label = 'Text Content', value, onChange, placeholder = 'Type text here...', rows = 3, isLight = false, helpText, allowLists = true, id, }) => {
const editorRef = useRef<HTMLDivElement>(null);
const [showHtmlCode, setShowHtmlCode] = useState(false);
const [isFocused, setIsFocused] = useState(false);
useEffect(() => {
if (editorRef.current && !isFocused) {
const currentHtml = editorRef.current.innerHTML;
const normalizedProp = value || '';
if (currentHtml !== normalizedProp) {
editorRef.current.innerHTML = normalizedProp;
}
}
}, [value, isFocused]);
const handleInput = () => {
if (editorRef.current) {
const html = editorRef.current.innerHTML;
onChange(sanitizeHtml(html));
}
};
const handleFormat = (command: 'bold' | 'italic' | 'underline' | 'removeFormat' | 'insertUnorderedList' | 'insertOrderedList') => {
if (editorRef.current) {
editorRef.current.focus();
}
const success = document.execCommand(command, false, undefined);
if (editorRef.current) {
let html = editorRef.current.innerHTML.trim();
if (command === 'insertUnorderedList' && !html.includes('<ul>')) {
const lines = html ? html.split(/<br\s*\/?>|\n/i).filter(Boolean) : ['List item 1', 'List item 2'];
const listItems = lines.map(line => `<li>${line.replace(/<\/?p>/gi, '')}</li>`).join('');
editorRef.current.innerHTML = `<ul>${listItems}</ul>`;
}
else if (command === 'insertOrderedList' && !html.includes('<ol>')) {
const lines = html ? html.split(/<br\s*\/?>|\n/i).filter(Boolean) : ['First step', 'Second step'];
const listItems = lines.map(line => `<li>${line.replace(/<\/?p>/gi, '')}</li>`).join('');
editorRef.current.innerHTML = `<ol>${listItems}</ol>`;
}
onChange(editorRef.current.innerHTML);
}
};
const labelClass = isLight
? 'block text-[11px] font-semibold text-slate-700 mb-1 tracking-wide'
: 'block text-[11px] font-semibold text-slate-300 mb-1 tracking-wide';
const containerBorder = isLight
? 'border-slate-300 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
: 'border-slate-700 bg-slate-950/90 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20';
const toolbarBg = isLight
? 'bg-slate-100/90 border-b border-slate-200 text-slate-700'
: 'bg-slate-900/90 border-b border-slate-800 text-slate-300';
const buttonHover = isLight
? 'hover:bg-slate-200 text-slate-700 hover:text-slate-900'
: 'hover:bg-slate-800 text-slate-300 hover:text-white';
const minHeightPx = Math.max(72, rows * 26);
return (<div className="w-full space-y-1.5" id={id}>
<div className="flex items-center justify-between">
{label && <label className={labelClass}>{label}</label>}
</div>

<div className={`rounded-xl border transition-all overflow-hidden ${containerBorder}`}>
<div className={`px-2 py-1.5 flex items-center gap-1 ${toolbarBg}`}>
<button type="button" onMouseDown={(e) => {
handleFormat('bold');
}} className={`p-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${buttonHover}`} title="Bold (Select text & click)" aria-label="Format Bold">
<Bold className="w-3.5 h-3.5"/>
</button>

<button type="button" onMouseDown={(e) => {
handleFormat('italic');
}} className={`p-1.5 rounded-md text-xs font-serif italic transition-colors cursor-pointer ${buttonHover}`} title="Italic (Select text & click)" aria-label="Format Italic">
<Italic className="w-3.5 h-3.5"/>
</button>

<button type="button" onMouseDown={(e) => {
handleFormat('underline');
}} className={`p-1.5 rounded-md text-xs underline transition-colors cursor-pointer ${buttonHover}`} title="Underline (Select text & click)" aria-label="Format Underline">
<Underline className="w-3.5 h-3.5"/>
</button>

{allowLists && (<>
<div className="w-px h-3.5 bg-slate-700/40 mx-0.5"/>

<button type="button" onMouseDown={(e) => {
handleFormat('insertUnorderedList');
}} className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${buttonHover}`} title="Unordered List (Bullet points - <ul><li>)" aria-label="Unordered List">
<List className="w-3.5 h-3.5"/>
</button>

<button type="button" onMouseDown={(e) => {
handleFormat('insertOrderedList');
}} className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${buttonHover}`} title="Ordered List (Numbered - <ol><li>)" aria-label="Ordered List">
<ListOrdered className="w-3.5 h-3.5"/>
</button>
</>)}

<div className="w-px h-3.5 bg-slate-700/40 mx-0.5"/>

<button type="button" onMouseDown={(e) => {
handleFormat('removeFormat');
}} className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${buttonHover}`} title="Clear Formatting" aria-label="Clear Formatting">
<RemoveFormatting className="w-3.5 h-3.5"/>
</button>
</div>

{showHtmlCode ? (<textarea rows={rows} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`w-full px-3 py-2 text-xs bg-transparent ${isLight ? 'text-slate-900' : 'text-slate-100'} placeholder:text-slate-500 focus:outline-none font-mono leading-relaxed resize-y`} style={{ minHeight: `${minHeightPx}px` }}/>) : (<div ref={editorRef} contentEditable suppressContentEditableWarning onFocus={() => setIsFocused(true)} onBlur={() => {
setIsFocused(false);
handleInput();
}} onInput={handleInput} className={`w-full px-3 py-2 text-xs bg-transparent ${isLight ? 'text-slate-900' : 'text-slate-100'} focus:outline-none font-sans leading-relaxed min-h-[72px] overflow-y-auto [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_li]:leading-relaxed [&_p]:my-1`} style={{ minHeight: `${minHeightPx}px` }} data-placeholder={placeholder}/>)}
</div>

{helpText && (<p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
{helpText}
</p>)}
</div>);
};
