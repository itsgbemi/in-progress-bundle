import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
variant?: ButtonVariant;
size?: ButtonSize;
isLoading?: boolean;
loadingText?: string;
isLight?: boolean;
leftIcon?: React.ReactNode;
rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
(
{
children,
variant = 'secondary',
size = 'sm',
isLoading = false,
loadingText,
isLight = false,
leftIcon,
rightIcon,
className = '',
disabled,
type = 'button',
...props
},
ref
) => {
const sizeClasses: Record<ButtonSize, string> = {
xs: 'px-2.5 py-1 text-[11px] rounded-lg gap-1',
sm: 'px-3.5 py-1.5 text-xs rounded-xl gap-1.5 font-semibold',
md: 'px-4 py-2 text-xs sm:text-sm rounded-xl gap-2 font-semibold',
lg: 'px-5 py-2.5 text-sm rounded-xl gap-2.5 font-semibold',
};

const getVariantClasses = (): string => {
switch (variant) {
case 'primary':
return 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 border border-transparent';
case 'danger':
return 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white shadow-md shadow-rose-600/20 border border-transparent';
case 'success':
return 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 border border-transparent';
case 'warning':
return 'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white shadow-md shadow-amber-600/20 border border-transparent';
case 'outline':
return isLight
? 'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-300'
: 'bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700';
case 'ghost':
return isLight
? 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent'
: 'bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white border border-transparent';
case 'secondary':
default:
return isLight
? 'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 text-slate-700'
: 'bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700/80 text-slate-200';
}
};

const isDisabled = disabled || isLoading;

return (
<button
ref={ref}
type={type}
disabled={isDisabled}
className={`inline-flex items-center justify-center transition-all cursor-pointer select-none ${
sizeClasses[size]
} ${getVariantClasses()} ${
isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
} ${className}`}
{...props}
>
{isLoading ? (
<Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
) : (
leftIcon && <span className="shrink-0">{leftIcon}</span>
)}
{isLoading && loadingText ? (
<span>{loadingText}</span>
) : (
children && <span>{children}</span>
)}
{!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
</button>
);
}
);

Button.displayName = 'Button';
