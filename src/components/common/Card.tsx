import React from 'react';

export type CardVariant = 'default' | 'subtle' | 'flat' | 'bordered';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
variant?: CardVariant;
padding?: CardPadding;
isLight?: boolean;
interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
children,
variant = 'default',
padding = 'md',
isLight,
interactive = false,
className = '',
...props
}) => {
const effectiveIsLight = isLight !== undefined
? isLight
: typeof document !== 'undefined'
? !document.documentElement.classList.contains('dark')
: false;

const paddingClasses: Record<CardPadding, string> = {
none: '',
sm: 'p-3 sm:p-4',
md: 'p-5 sm:p-6',
lg: 'p-6 sm:p-8',
xl: 'p-8 sm:p-10',
};

const variantClasses = {
default: effectiveIsLight
? 'bg-white border-slate-200/80 shadow-xs'
: 'bg-slate-900 border-slate-800',
subtle: effectiveIsLight
? 'bg-slate-50/70 border-slate-200/60'
: 'bg-slate-950/60 border-slate-800/60',
flat: effectiveIsLight
? 'bg-slate-100/80 border-transparent'
: 'bg-slate-800/50 border-transparent',
bordered: effectiveIsLight
? 'bg-transparent border-slate-200'
: 'bg-transparent border-slate-800',
}[variant];

const interactiveClasses = interactive
? effectiveIsLight
? 'hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all'
: 'hover:border-slate-700 hover:bg-slate-900/90 cursor-pointer transition-all'
: 'transition-all';

return (
<div
className={`rounded-2xl border ${variantClasses} ${paddingClasses[padding]} ${interactiveClasses} ${className}`}
{...props}
>
{children}
</div>
);
};
