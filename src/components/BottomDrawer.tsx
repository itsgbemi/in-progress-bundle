import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { ScrollArea } from './common/ScrollArea';

interface BottomDrawerProps {
isOpen: boolean;
onClose: () => void;
title?: string | React.ReactNode;
subtitle?: string;
icon?: React.ReactNode;
uiTheme?: 'dark' | 'light';
maxHeight?: string;
children: React.ReactNode;
showDragHandle?: boolean;
showCloseButton?: boolean;
className?: string;
}

export const BottomDrawer: React.FC<BottomDrawerProps> = ({
isOpen,
onClose,
title,
subtitle,
icon,
uiTheme = 'dark',
maxHeight = '92vh',
children,
showDragHandle = true,
showCloseButton = true,
className = '',
}) => {
const isLight = uiTheme === 'light';

const [mounted, setMounted] = React.useState(false);
React.useEffect(() => {
setMounted(true);
}, []);

const [drawerHeight, setDrawerHeight] = useState<number>(() =>
typeof window !== 'undefined' ? Math.min(Math.round(window.innerHeight * 0.55), 480) : 480
);
const startYRef = useRef<number>(0);
const startHeightRef = useRef<number>(drawerHeight);
const isDraggingDrawerRef = useRef<boolean>(false);

useEffect(() => {
const handleTouchMove = (e: TouchEvent) => {
if (!isDraggingDrawerRef.current || !e.touches || e.touches.length === 0) return;
const currentY = e.touches[0].clientY;
const deltaY = currentY - startYRef.current;
const targetHeight = startHeightRef.current - deltaY;
const minH = 160;
const maxH = typeof window !== 'undefined' ? Math.round(window.innerHeight * 0.88) : 700;
setDrawerHeight(Math.max(minH, Math.min(maxH, targetHeight)));
};
const handleTouchEnd = () => {
isDraggingDrawerRef.current = false;
};
const handleMouseMove = (e: MouseEvent) => {
if (!isDraggingDrawerRef.current) return;
const currentY = e.clientY;
const deltaY = currentY - startYRef.current;
const targetHeight = startHeightRef.current - deltaY;
const minH = 160;
const maxH = typeof window !== 'undefined' ? Math.round(window.innerHeight * 0.88) : 700;
setDrawerHeight(Math.max(minH, Math.min(maxH, targetHeight)));
};
const handleMouseUp = () => {
isDraggingDrawerRef.current = false;
};

if (isOpen) {
document.addEventListener('touchmove', handleTouchMove, { passive: false });
document.addEventListener('touchend', handleTouchEnd);
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseup', handleMouseUp);
}
return () => {
document.removeEventListener('touchmove', handleTouchMove);
document.removeEventListener('touchend', handleTouchEnd);
document.removeEventListener('mousemove', handleMouseMove);
document.removeEventListener('mouseup', handleMouseUp);
};
}, [isOpen]);

const handleStartDrawerDrag = (clientY: number) => {
isDraggingDrawerRef.current = true;
startYRef.current = clientY;
startHeightRef.current = drawerHeight;
};

const content = (
<AnimatePresence>
{isOpen && (
<div className="fixed inset-0 z-[100] flex items-end justify-center overflow-hidden pointer-events-none">
<motion.div
key="mobile-drawer-backdrop"
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
transition={{ duration: 0.18 }}
onClick={onClose}
className="absolute inset-0 bg-transparent pointer-events-auto"
aria-hidden="true"
/>

<motion.div
key="mobile-drawer-sheet"
initial={{ y: '100%' }}
animate={{ y: 0 }}
exit={{ y: '100%' }}
transition={{ type: 'spring', damping: 25, stiffness: 250 }}
style={{ height: `${drawerHeight}px`, maxHeight }}
className={`relative z-10 w-full rounded-t-3xl border-t shadow-2xl flex flex-col overflow-hidden pointer-events-auto ${
isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
} ${className}`}
>
{showDragHandle && (
<div
onTouchStart={(e) => {
if (e.touches && e.touches[0]) {
handleStartDrawerDrag(e.touches[0].clientY);
}
}}
onMouseDown={(e) => {
handleStartDrawerDrag(e.clientY);
}}
className="w-full pt-3 pb-2 flex flex-col items-center justify-center cursor-ns-resize active:cursor-grabbing touch-none select-none group shrink-0"
>
<div
className={`w-14 h-1.5 rounded-full transition-colors ${
isLight
? 'bg-slate-300 group-hover:bg-slate-400 group-active:bg-indigo-500'
: 'bg-slate-600/80 group-hover:bg-slate-500 group-active:bg-indigo-400'
}`}
/>
</div>
)}

{(title || showCloseButton) && (
<div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/80 shrink-0 mb-3 px-4 sm:px-5">
<div className="flex items-center gap-2">
{icon}
<div>
{title && <h3 className="font-bold text-sm tracking-tight">{title}</h3>}
{subtitle && <p className="text-[11px] text-slate-500 dark:text-slate-400">{subtitle}</p>}
</div>
</div>

{showCloseButton && (
<button
type="button"
onClick={onClose}
className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
isLight
? 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
: 'hover:bg-slate-800 text-slate-400 hover:text-slate-100'
}`}
aria-label="Close drawer"
>
<X className="w-4 h-4" />
</button>
)}
</div>
)}

<ScrollArea className="flex flex-col flex-1 min-h-0 space-y-3 pb-2 px-4 sm:px-5">
{children}
</ScrollArea>
</motion.div>
</div>
)}
</AnimatePresence>
);

if (!mounted) return null;
return createPortal(content, document.body);
};
