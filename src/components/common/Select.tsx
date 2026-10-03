import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export type SelectVariant = 'pill' | 'rounded' | 'compact';
export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string | number;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  labelRight?: React.ReactNode;
  isLight?: boolean;
  variant?: SelectVariant;
  selectSize?: SelectSize;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  options?: SelectOption[];
  wrapperClassName?: string;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  hint,
  error,
  labelRight,
  isLight,
  variant = 'rounded',
  selectSize = 'md',
  icon,
  leftIcon = icon,
  options,
  value,
  disabled,
  required,
  id,
  className = '',
  wrapperClassName = '',
  containerClassName = '',
  children,
  ...props
}, ref) => {
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
      select: 'py-1.5 text-xs',
      padLeftIcon: 'pl-8 pr-7',
      padNormal: 'pl-3 pr-7',
      iconLeft: 'left-2.5',
      chevron: 'right-2.5 w-3.5 h-3.5',
      iconSize: 'w-3.5 h-3.5',
    },
    md: {
      select: variant === 'pill' ? 'py-2.5 sm:py-3 text-xs' : 'py-2.5 text-xs',
      padLeftIcon: 'pl-9.5 pr-8',
      padNormal: 'pl-3.5 pr-8',
      iconLeft: 'left-3.5',
      chevron: 'right-3 w-4 h-4',
      iconSize: 'w-4 h-4',
    },
    lg: {
      select: 'py-3.5 text-sm',
      padLeftIcon: 'pl-11 pr-9',
      padNormal: 'pl-4 pr-9',
      iconLeft: 'left-4',
      chevron: 'right-3.5 w-4 h-4',
      iconSize: 'w-4 h-4',
    },
  }[selectSize];

  const themeClass = effectiveIsLight
    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
    : 'bg-slate-800/80 border-slate-700 text-slate-100 focus:bg-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20';

  const hasLeft = Boolean(leftIcon);

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
              {required && <span className="text-rose-500 ml-1">*</span>}
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

        <select
          ref={ref}
          id={id}
          value={value}
          disabled={disabled}
          required={required}
          className={`w-full appearance-none border outline-none transition-all shadow-2xs font-normal cursor-pointer ${radiusClass} ${sizeClasses.select} ${
            hasLeft ? sizeClasses.padLeftIcon : sizeClasses.padNormal
          } ${themeClass} ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          } ${className}`}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option
                  key={String(opt.value)}
                  value={opt.value}
                  disabled={opt.disabled}
                  className={effectiveIsLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}
                >
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        <ChevronDown
          className={`absolute ${sizeClasses.chevron} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors`}
        />
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

Select.displayName = 'Select';
