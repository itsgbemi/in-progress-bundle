import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { ScrollArea } from './ScrollArea';

export interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  headerRight?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  uiTheme?: 'dark' | 'light';
  isLight?: boolean;
  width?: string;
  zIndex?: number;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  headerRight,
  footer,
  children,
  uiTheme = 'dark',
  isLight: isLightProp,
  width = 'w-full sm:w-[420px]',
  zIndex = 85,
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className = '',
  bodyClassName = '',
  headerClassName = '',
}) => {
  const isLight = isLightProp !== undefined ? isLightProp : uiTheme === 'light';

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  const containerThemeClass = isLight
    ? 'bg-white border-slate-200 text-slate-900 shadow-2xl'
    : 'bg-slate-900 border-slate-800 text-slate-100 shadow-2xl';

  const backdropZIndex = zIndex - 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="side-panel-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ zIndex: backdropZIndex }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
            onClick={closeOnBackdropClick ? onClose : undefined}
          />

          {/* Slide-over Side Panel */}
          <motion.aside
            key="side-panel-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            style={{ zIndex }}
            className={`fixed top-0 right-0 bottom-0 ${width} max-w-full border-l flex flex-col h-full overflow-hidden ${containerThemeClass} ${className}`}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            {(title || icon || showCloseButton || headerRight) && (
              <div
                className={`flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-slate-800/80 shrink-0 ${headerClassName}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {icon && (
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      {icon}
                    </div>
                  )}
                  {(title || subtitle) && (
                    <div className="min-w-0">
                      {title && (
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {title}
                        </h3>
                      )}
                      {subtitle && (
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                          {subtitle}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {headerRight}
                  {showCloseButton && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Close panel"
                      aria-label="Close panel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Scrollable Content Body */}
            <ScrollArea className={`flex-1 min-h-0 flex flex-col ${bodyClassName}`}>
              {children}
            </ScrollArea>

            {/* Optional Footer */}
            {footer && (
              <div className="border-t border-slate-200/80 dark:border-slate-800/80 p-4 shrink-0">
                {footer}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
