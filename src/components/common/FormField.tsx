import React from 'react';
import { ChevronDown } from 'lucide-react';
import { SelectOption } from './Select';

export interface FormFieldProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  isLight?: boolean;
  htmlFor?: string;
  badge?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  hint,
  error,
  required = false,
  isLight = false,
  htmlFor,
  badge,
  className = '',
  children,
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={htmlFor}
            className={`block text-xs font-semibold ${
              isLight ? 'text-slate-700' : 'text-slate-300'
            }`}
          >
            {label}
            {required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
          {badge}
        </div>
      )}

      {children}

      {hint && !error && (
        <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          {hint}
        </p>
      )}

      {error && (
        <p className="text-[11px] font-medium text-rose-500">
          {error}
        </p>
      )}
    </div>
  );
};

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isLight?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ isLight = false, leftIcon, rightIcon, className = '', disabled, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={`w-full text-xs rounded-xl transition-colors outline-none ${
            leftIcon ? 'pl-9' : 'px-3.5'
          } ${rightIcon ? 'pr-9' : 'pr-3.5'} py-2.5 ${
            isLight
              ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
              : 'bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:bg-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 flex items-center pointer-events-none text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isLight?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ isLight = false, className = '', disabled, rows = 3, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        className={`w-full px-3.5 py-2.5 text-xs rounded-xl transition-colors outline-none resize-y ${
          isLight
            ? 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
            : 'bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:bg-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        {...props}
      />
    );
  }
);

TextArea.displayName = 'TextArea';

export type { SelectOption };

export interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  isLight?: boolean;
  options?: SelectOption[];
}

export const SelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ isLight = false, options, children, className = '', disabled, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        <select
          ref={ref}
          disabled={disabled}
          className={`w-full appearance-none px-3.5 py-2.5 pr-9 text-xs rounded-xl transition-colors outline-none cursor-pointer ${
            isLight
              ? 'bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
              : 'bg-slate-950 border border-slate-800 text-slate-100 focus:bg-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
      </div>
    );
  }
);

SelectInput.displayName = 'SelectInput';

export interface SwitchToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  isLight?: boolean;
  disabled?: boolean;
  className?: string;
}

export const SwitchToggle: React.FC<SwitchToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  isLight = false,
  disabled = false,
  className = '',
}) => {
  return (
    <label
      className={`flex items-start justify-between gap-3 cursor-pointer select-none ${
        disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
      } ${className}`}
    >
      {(label || description) && (
        <div className="space-y-0.5 min-w-0">
          {label && (
            <span
              className={`block text-xs font-semibold ${
                isLight ? 'text-slate-800' : 'text-slate-200'
              }`}
            >
              {label}
            </span>
          )}
          {description && (
            <span
              className={`block text-[11px] ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              {description}
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
          checked ? 'bg-indigo-600' : isLight ? 'bg-slate-300' : 'bg-slate-700'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-4.5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </label>
  );
};
