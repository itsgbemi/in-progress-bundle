import React, { useRef, useEffect } from 'react';

export interface TableEditableTextProps {
content: string;
placeholder?: string;
isEditable: boolean;
className?: string;
style?: React.CSSProperties;
onUpdate: (newHtml: string) => void;
onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void;
onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const TableEditableText: React.FC<TableEditableTextProps> = ({
content,
placeholder = '',
isEditable,
className = '',
style,
onUpdate,
onFocus,
onClick,
}) => {
const domRef = useRef<HTMLDivElement>(null);
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
if (domRef.current && !isFocusedRef.current) {
const targetHtml = content || placeholder;
if (domRef.current.innerHTML !== targetHtml) {
domRef.current.innerHTML = targetHtml;
}
}
}, [content, placeholder]);

if (!isEditable) {
return (
<span
style={style}
className={`rich-text-content ${className}`}
dangerouslySetInnerHTML={{ __html: content || placeholder || '' }}
/>
);
}

return (
<div
ref={domRef}
contentEditable
suppressContentEditableWarning
style={style}
onClick={onClick}
onFocus={(e) => {
isFocusedRef.current = true;
onFocus?.(e);
}}
onInput={(e) => {
onUpdate(e.currentTarget.innerHTML);
}}
onBlur={(e) => {
isFocusedRef.current = false;
onUpdate(e.currentTarget.innerHTML);
}}
className={`outline-none font-inherit text-inherit min-w-[20px] rich-text-content cursor-text ${className}`}
/>
);
};
