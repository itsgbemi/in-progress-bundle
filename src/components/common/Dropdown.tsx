import React, { useRef, useEffect } from 'react';
import { ScrollArea } from './ScrollArea';

export interface DropdownItemProps {
onClick?: () => void;
icon?: React.ReactNode;
children: React.ReactNode;
variant?: 'default' | 'danger' | 'primary';
disabled?: boolean;
className?: string;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
onClick,
icon,
children,
variant = 'default',
disabled = false,
className = '',
}) => {
const getVariantClasses = () => {
if (disabled) return 'opacity-50 cursor-not-allowed text-slate-400';
switch (variant) {
case 'danger':
return 'text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400';
case 'primary':
case 'default':
default:
return 'text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300';
}
};

return (
<button
type="button"
role="menuitem"
disabled={disabled}
onClick={onClick}
className={`w-full px-3 py-2 text-xs font-medium flex items-center gap-2.5 transition-colors text-left cursor-pointer whitespace-nowrap ${getVariantClasses()} ${className}`}
>
{icon && <span className="shrink-0 text-slate-400">{icon}</span>}
<span className="font-medium truncate">{children}</span>
</button>
);
};

export const DropdownSeparator: React.FC<{ className?: string }> = ({ className = '' }) => (
<div className={`my-1 border-t border-slate-100 dark:border-slate-800 ${className}`} role="separator" />
);

export const DropdownLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({
children,
className = '',
}) => (
<div className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1 ${className}`}>
{children}
</div>
);

export interface DropdownScrollAreaProps {
children: React.ReactNode;
maxHeight?: string | number;
scrollbar?: 'custom' | 'thin' | 'none';
showScrollButtons?: boolean;
className?: string;
}

export const DropdownScrollArea: React.FC<DropdownScrollAreaProps> = ({
children,
maxHeight = 280,
scrollbar = 'thin',
showScrollButtons = false,
className = '',
}) => (
<ScrollArea
maxHeight={maxHeight}
scrollbar={scrollbar}
showScrollButtons={showScrollButtons}
orientation="vertical"
className={`w-full ${className}`}
>
{children}
</ScrollArea>
);

export interface DropdownProps {
isOpen: boolean;
onClose: () => void;
trigger?: React.ReactNode;
align?: 'left' | 'right' | 'center';
isLight?: boolean;
maxHeight?: string | number;
scrollable?: boolean;
scrollbar?: 'custom' | 'thin' | 'none';
showScrollButtons?: boolean;
children: React.ReactNode;
className?: string;
containerClassName?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
isOpen,
onClose,
trigger,
align = 'right',
isLight,
maxHeight,
scrollable = false,
scrollbar = 'thin',
showScrollButtons = false,
children,
className = '',
containerClassName = '',
}) => {
const dropdownRef = useRef<HTMLDivElement>(null);

useEffect(() => {
if (!isOpen) return;

const handleClickOutside = (e: MouseEvent | TouchEvent) => {
if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
onClose();
}
};

const handleKeyDown = (e: KeyboardEvent) => {
if (e.key === 'Escape') {
onClose();
}
};

document.addEventListener('mousedown', handleClickOutside);
document.addEventListener('touchstart', handleClickOutside);
document.addEventListener('keydown', handleKeyDown);

return () => {
document.removeEventListener('mousedown', handleClickOutside);
document.removeEventListener('touchstart', handleClickOutside);
document.removeEventListener('keydown', handleKeyDown);
};
}, [isOpen, onClose]);

const getAlignClass = () => {
switch (align) {
case 'left':
return 'left-0';
case 'center':
return 'left-1/2 -translate-x-1/2';
case 'right':
default:
return 'right-0';
}
};

const shouldWrapInScrollArea = scrollable || maxHeight !== undefined;
const resolvedMaxHeight = maxHeight || 'calc(100vh - 6rem)';

return (
<div className={`relative inline-block ${containerClassName}`} ref={dropdownRef}>
{trigger}
{isOpen && (
<div
role="menu"
className={`absolute ${getAlignClass()} mt-2 w-max min-w-full max-w-[calc(100vw-1.5rem)] max-h-[calc(100vh-4rem)] rounded-xl border shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden flex flex-col ${
isLight
? 'bg-white border-slate-200 text-slate-800 shadow-slate-300/50'
: 'bg-slate-900 border-slate-800 text-slate-100 shadow-black/70'
} ${className}`}
>
{shouldWrapInScrollArea ? (
<ScrollArea
maxHeight={resolvedMaxHeight}
scrollbar={scrollbar}
showScrollButtons={showScrollButtons}
orientation="vertical"
className="w-full flex-1"
>
{children}
</ScrollArea>
) : (
<ScrollArea maxHeight="calc(100vh - 5rem)" className="w-full flex-1">
{children}
</ScrollArea>
)}
</div>
)}
</div>
);
};

export default Dropdown;
