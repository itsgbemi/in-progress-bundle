import React from 'react';

export type BadgeVariant = 'indigo' | 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
export type BadgeSize = 'xs' | 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
variant?: BadgeVariant;
size?: BadgeSize;
dot?: boolean;
isLight?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
children,
variant = 'indigo',
size = 'sm',
dot = false,
isLight = false,
className = '',
...props
}) => {
const sizeClasses: Record<BadgeSize, string> = {
xs: 'px-1.5 py-0.5 text-[9px]',
sm: 'px-2 py-0.5 text-[10px]',
md: 'px-2.5 py-1 text-xs',
};

const effectiveVariant = variant === 'primary' ? 'indigo' : variant;

const variantClasses: Record<string, string> = {
indigo: isLight
? 'bg-indigo-50 text-indigo-700 border-indigo-200'
: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
success: isLight
? 'bg-emerald-50 text-emerald-700 border-emerald-200'
: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
warning: isLight
? 'bg-amber-50 text-amber-700 border-amber-200'
: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
danger: isLight
? 'bg-rose-50 text-rose-700 border-rose-200'
: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
neutral: isLight
? 'bg-slate-100 text-slate-700 border-slate-200'
: 'bg-slate-800 text-slate-300 border-slate-700',
};

const dotClasses: Record<string, string> = {
indigo: 'bg-indigo-500',
primary: 'bg-indigo-500',
success: 'bg-emerald-500',
warning: 'bg-amber-500',
danger: 'bg-rose-500',
neutral: 'bg-slate-400',
};

return (
<span
className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full border ${
sizeClasses[size]
} ${variantClasses[effectiveVariant]} ${className}`}
{...props}
>
{dot && <span className={`w-1.5 h-1.5 rounded-full ${dotClasses[effectiveVariant]}`} />}
{children}
</span>
);
};
