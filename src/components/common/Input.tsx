import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, Search, X } from 'lucide-react';

export type InputVariant = 'pill' | 'rounded' | 'compact';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  labelRight?: React.ReactNode;
  isLight?: boolean;
  themeClass?: string;
  variant?: InputVariant;
  inputSize?: InputSize;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
  showPasswordToggle?: boolean;
  wrapperClassName?: string;
  containerClassName?: string;
  hideRequiredAsterisk?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  hint,
  error,
  labelRight,
  isLight,
  themeClass: customThemeClass,
  variant = 'rounded',
  inputSize = 'md',
  icon,
  leftIcon = icon,
  rightIcon,
  onClear,
  showPasswordToggle = false,
  type = 'text',
  value,
  disabled,
  required,
  hideRequiredAsterisk = false,
  id,
  className = '',
  wrapperClassName = '',
  containerClassName = '',
  ...props
}, ref) => {
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === 'password' || showPasswordToggle;
  const actualType = isPassword ? (revealed ? 'text' : 'password') : type;

  const effectiveIsLight = isLight !== undefined
    ? isLight
    : typeof document !== 'undefined'
      ? !document.documentElement.classList.contains('dark')
      : false;

  const radiusClass =
    variant === 'pill' ? 'rounded-full' :
    variant === 'compact' ? 'rounded-lg' : 'rounded-xl';

  const sizeClasses = {
    sm: {
      input: 'py-1.5 text-xs',
      padLeftIcon: 'pl-8',
      padRightIcon: 'pr-8',
      padNormal: 'px-3',
      iconLeft: 'left-2.5',
      iconRight: 'right-2.5',
      iconSize: 'w-3.5 h-3.5',
    },
    md: {
      input: variant === 'pill' ? 'py-3 text-xs' : 'py-2.5 text-xs',
      padLeftIcon: 'pl-10',
      padRightIcon: 'pr-10',
      padNormal: 'px-3.5',
      iconLeft: 'left-3.5',
      iconRight: 'right-3.5',
      iconSize: 'w-4 h-4',
    },
    lg: {
      input: 'py-3.5 text-sm',
      padLeftIcon: 'pl-11',
      padRightIcon: 'pr-11',
      padNormal: 'px-4',
      iconLeft: 'left-4',
      iconRight: 'right-4',
      iconSize: 'w-4 h-4',
    },
  }[inputSize];

  const defaultThemeClass = effectiveIsLight
    ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
    : 'bg-[var(--app-panel)] border-[var(--app-border)] text-[var(--app-text)] placeholder:text-slate-500 focus:bg-[var(--app-bg)] focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/20';

  const themeClass = customThemeClass || defaultThemeClass;

  const hasLeft = Boolean(leftIcon);
  const hasRight = Boolean(rightIcon || isPassword || onClear);

  return (
    <div className={`w-full ${containerClassName}`}>
      {(label || labelRight) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <label
              htmlFor={id}
              className={`block text-xs font-semibold ${
                effectiveIsLight ? 'text-slate-700' : 'text-slate-300'
              }`}
            >
              {label}
              {required && !hideRequiredAsterisk && <span className="text-rose-500 ml-1">*</span>}
            </label>
          )}
          {labelRight && <div>{labelRight}</div>}
        </div>
      )}

      <div className={`relative flex items-center w-full ${wrapperClassName}`}>
        {leftIcon && (
          <div
            className={`absolute ${sizeClasses.iconLeft} top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400 shrink-0`}
          >
            {React.isValidElement(leftIcon)
              ? React.cloneElement(leftIcon as React.ReactElement<{ className?: string }>, {
                  className: `${sizeClasses.iconSize} ${(leftIcon.props as { className?: string }).className || ''}`.trim(),
                })
              : leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={id}
          type={actualType}
          value={value}
          disabled={disabled}
          required={required}
          className={`w-full border outline-none transition-all shadow-2xs font-normal ${radiusClass} ${sizeClasses.input} ${
            hasLeft ? sizeClasses.padLeftIcon : sizeClasses.padNormal
          } ${hasRight ? sizeClasses.padRightIcon : sizeClasses.padNormal} ${themeClass} ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          } ${className}`}
          {...props}
        />

        <div className={`absolute ${sizeClasses.iconRight} top-1/2 -translate-y-1/2 flex items-center gap-1.5`}>
          {onClear && value && !disabled && (
            <button
              type="button"
              onClick={onClear}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer transition-colors"
              title="Clear input"
            >
              <X className={sizeClasses.iconSize} />
            </button>
          )}

          {isPassword && !disabled && (
            <button
              type="button"
              onClick={() => setRevealed(!revealed)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer transition-colors"
              title={revealed ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {revealed ? (
                <EyeOff className={sizeClasses.iconSize} />
              ) : (
                <Eye className={sizeClasses.iconSize} />
              )}
            </button>
          )}

          {rightIcon && !isPassword && (
            <div className="text-slate-400 pointer-events-none flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
      </div>

      {hint && !error && (
        <p className={`mt-1 text-[11px] ${effectiveIsLight ? 'text-slate-500' : 'text-slate-400'}`}>
          {hint}
        </p>
      )}

      {error && (
        <p className="mt-1 text-[11px] font-medium text-rose-500">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  searchIcon?: React.ReactNode;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(({
  placeholder = 'Search...',
  variant = 'pill',
  onClear,
  searchIcon = <Search className="w-3.5 h-3.5 text-slate-400" />,
  className = '',
  ...props
}, ref) => {
  return (
    <Input
      ref={ref}
      variant={variant}
      leftIcon={searchIcon}
      placeholder={placeholder}
      onClear={onClear}
      themeClass="bg-transparent border-slate-300/80 dark:border-slate-700/80 focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 dark:focus:border-indigo-500 dark:focus:ring-1 dark:focus:ring-indigo-500/20"
      className={className}
      {...props}
    />
  );
});

SearchInput.displayName = 'SearchInput';
