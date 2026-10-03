import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BottomDrawer } from '../BottomDrawer';
import { ScrollArea } from './ScrollArea';

interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  uiTheme: 'dark' | 'light';
  children: React.ReactNode;
  widthClassName?: string;
  className?: string;
  showDragHandle?: boolean;
  title?: string;
}

export const Popover: React.FC<PopoverProps> = ({
  isOpen,
  onClose,
  uiTheme,
  children,
  widthClassName = 'w-72 sm:w-80',
  className = '',
  showDragHandle = true,
  title,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const isLight = uiTheme === 'light';
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const targetNode = e.target as HTMLElement | null;
      if (!targetNode) return;

      // Do not close if clicking inside the popover itself
      if (popoverRef.current && popoverRef.current.contains(targetNode)) {
        return;
      }

      // Do not close if clicking inside the toolbar or toolbar buttons (toolbar buttons handle their own toggle)
      if (targetNode.closest('.toolbar-container, [data-toolbar-root], .formatting-popover, .popover-content')) {
        return;
      }

      onClose();
    };

    if (isOpen && !isMobile) {
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [isOpen, onClose, isMobile]);

  return (
    <>
      <AnimatePresence>
        {isOpen && !isMobile && (
          <motion.div
            ref={popoverRef}
            key="shared-popover"
            drag
            dragMomentum={false}
            dragElastic={0}
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className={`formatting-popover popover-content absolute left-2 sm:left-6 top-full mt-2 z-50 rounded-xl border shadow-2xl p-4 flex flex-col cursor-grab active:cursor-grabbing ${widthClassName} max-w-[calc(100vw-24px)] max-h-[65vh] ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
                : 'bg-slate-900 border-slate-800 text-slate-100 shadow-black/80'
            } ${className}`}
          >
            {showDragHandle && (
              <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700/80 rounded-full mx-auto mb-2 shrink-0" />
            )}
            <ScrollArea className="flex-1 min-h-0 pr-0.5 cursor-auto">
              {children}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomDrawer 
        isOpen={isOpen && isMobile} 
        onClose={onClose} 
        uiTheme={uiTheme} 
        showDragHandle={true} 
        showCloseButton={false} 
        title={title}
        className={`formatting-popover popover-content ${className}`}
      >
        <div className="pt-1 h-full flex flex-col min-h-0 no-scrollbar">
          {children}
        </div>
      </BottomDrawer>
    </>
  );
};
