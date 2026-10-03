import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { ScrollArea } from './ScrollArea';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: ModalSize;
  isLight?: boolean;
  zIndex?: string;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  containerClassName?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  full: 'max-w-[96vw] h-[86vh]',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  size = '2xl',
  isLight = false,
  zIndex = 'z-[100]',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className = '',
  containerClassName = '',
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className={`fixed inset-0 ${zIndex} bg-black/75 backdrop-blur-xs flex justify-center items-end sm:items-center p-0 sm:p-6 overflow-y-auto animate-in fade-in duration-150 ${containerClassName}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    >
      <div
        ref={modalRef}
        className={`w-full ${sizeClasses[size]} rounded-t-2xl sm:rounded-2xl shadow-2xl border flex flex-col overflow-hidden max-h-[82vh] sm:max-h-[76vh] transition-all animate-in zoom-in-95 duration-150 ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-slate-900 border-slate-800 text-slate-100'
        } ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export interface ModalHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  onClose?: () => void;
  isLight?: boolean;
  className?: string;
  closeAriaLabel?: string;
  titleId?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  description,
  icon,
  badge,
  onClose,
  isLight = false,
  className = '',
  closeAriaLabel = 'Close modal',
  titleId,
}) => {
  return (
    <div
      className={`px-5 py-3.5 sm:px-6 sm:py-4 border-b flex items-center justify-between shrink-0 transition-colors ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
      } ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0 pr-2">
        {icon && (
          <div
            className={`p-2 sm:p-2.5 rounded-xl shrink-0 flex items-center justify-center ${
              isLight
                ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
            }`}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2
              id={titleId}
              className="text-sm sm:text-base font-bold tracking-tight truncate"
            >
              {title}
            </h2>
            {badge}
          </div>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 sm:line-clamp-none">
              {description}
            </p>
          )}
        </div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={`p-1.5 sm:p-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
            isLight
              ? 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'
              : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
          aria-label={closeAriaLabel}
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  isLight?: boolean;
}

export const ModalBody: React.FC<ModalBodyProps> = ({
  children,
  className = '',
  noPadding = false,
  isLight,
}) => {
  return (
    <ScrollArea
      className={`flex-1 min-h-0 ${
        noPadding ? '' : 'p-4 sm:p-6'
      } ${className}`}
    >
      {children}
    </ScrollArea>
  );
};

export interface ModalFooterProps {
  children: React.ReactNode;
  isLight?: boolean;
  align?: 'right' | 'between' | 'left' | 'center';
  className?: string;
  noBorder?: boolean;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  isLight = false,
  align = 'right',
  className = '',
  noBorder = false,
}) => {
  const alignClass = {
    right: 'justify-end',
    between: 'justify-between',
    left: 'justify-start',
    center: 'justify-center',
  }[align];

  return (
    <div
      className={`px-5 py-3.5 sm:px-6 sm:py-4 flex items-center gap-2.5 shrink-0 ${alignClass} ${
        noBorder
          ? ''
          : isLight
          ? 'border-t border-slate-200 bg-slate-50/50'
          : 'border-t border-slate-800 bg-slate-950/40'
      } ${className}`}
    >
      {children}
    </div>
  );
};
