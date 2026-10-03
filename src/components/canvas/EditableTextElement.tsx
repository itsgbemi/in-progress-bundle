import React, { useRef, useEffect } from 'react';

export interface EditableTextElementProps {
tag?: string;
content: string;
style?: React.CSSProperties;
className?: string;
isEditable: boolean;
onUpdateContent: (newHtml: string) => void;
placeholder?: string;
elementId?: string;
}

function cleanFontQuotes(html: string): string {
if (!html) return '';
return html
.replace(/font-family:\s*&quot;([^&"]+?)&quot;/gi, "font-family: '$1'")
.replace(/font-family:\s*\\"([^\\"]+?)\\"/gi, "font-family: '$1'")
.replace(/font-family:\s*"([^"]+?)"/gi, "font-family: '$1'")
.replace(/font-family:\s*&apos;([^&]+?)&apos;/gi, "font-family: '$1'");
}

export const EditableTextElement: React.FC<EditableTextElementProps> = ({
tag = 'p',
content,
style,
className = '',
isEditable,
onUpdateContent,
placeholder = '',
elementId,
}) => {
const Tag = (tag || 'p') as any;
const domRef = useRef<HTMLElement>(null);
const isFocusedRef = useRef(false);

useEffect(() => {
if (domRef.current) {
const initialHtml = content || placeholder;
if (domRef.current.innerHTML !== initialHtml) {
domRef.current.innerHTML = initialHtml;
}
}
}, []);

useEffect(() => {
if (domRef.current) {
const isFocused =
isFocusedRef.current ||
document.activeElement === domRef.current ||
(domRef.current.contains && domRef.current.contains(document.activeElement));
if (!isFocused) {
const targetHtml = content || placeholder;
if (domRef.current.innerHTML !== targetHtml) {
domRef.current.innerHTML = targetHtml;
}
}
}
}, [content, placeholder]);

return (
<Tag
ref={domRef}
data-editable-id={elementId}
data-element-id={elementId}
style={{
caretColor: 'currentColor',
...style,
}}
contentEditable={isEditable}
suppressContentEditableWarning
onFocus={() => {
isFocusedRef.current = true;
}}
onClick={(e: React.MouseEvent<HTMLElement>) => {
isFocusedRef.current = true;
}}
onInput={(e: React.FormEvent<HTMLElement>) => {
const html = cleanFontQuotes(e.currentTarget.innerHTML);
onUpdateContent(html);
}}
onBlur={(e: React.FocusEvent<HTMLElement>) => {
isFocusedRef.current = false;
const html = cleanFontQuotes(e.currentTarget.innerHTML);
onUpdateContent(html);
}}
className={`rich-text-content ${className}`}
/>
);
};
