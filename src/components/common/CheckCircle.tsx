import React from 'react';
import { Check } from 'lucide-react';

export type CheckCircleSize = 'xs' | 'sm' | 'md' | 'lg';

export interface CheckCircleProps {
id?: string;
checked: boolean;
onChange?: (checked: boolean) => void;
disabled?: boolean;
size?: CheckCircleSize;
label?: React.ReactNode;
description?: React.ReactNode;
className?: string;
circleClassName?: string;
labelClassName?: string;
isLight?: boolean;
title?: string;
ariaLabel?: string;
name?: string;
value?: string;
onClick?: (e: React.MouseEvent) => void;
}

export const CheckCircle: React.FC<CheckCircleProps> = ({
id,
checked,
onChange,
disabled = false,
size = 'md',
label,
description,
className = '',
circleClassName = '',
labelClassName = '',
isLight,
title,
ariaLabel,
name,
value,
onClick,
}) => {
const sizeMap: Record<CheckCircleSize, { circle: string; icon: string; stroke: number }> = {
xs: { circle: 'w-3.5 h-3.5', icon: 'w-2 h-2', stroke: 3 },
sm: { circle: 'w-4 h-4', icon: 'w-2.5 h-2.5', stroke: 3 },
md: { circle: 'w-5 h-5', icon: 'w-3 h-3', stroke: 2.5 },
lg: { circle: 'w-6 h-6', icon: 'w-3.5 h-3.5', stroke: 2.5 },
};

const currentSize = sizeMap[size] || sizeMap.md;

const handleClick = (e: React.MouseEvent) => {
if (disabled) return;
if (onClick) {
onClick(e);
}
if (onChange) {
onChange(!checked);
}
};

const handleKeyDown = (e: React.KeyboardEvent) => {
if (disabled) return;
if (e.key === ' ' || e.key === 'Enter') {
e.preventDefault();
if (onChange) {
onChange(!checked);
}
}
};

const uncheckedClasses =
isLight === true
? 'border-slate-300 bg-white hover:border-indigo-400'
: isLight === false
? 'border-slate-700 bg-slate-800/90 hover:border-indigo-400'
: 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/90 hover:border-indigo-400';

const circleElement = (
<button
type="button"
id={id}
name={name}
value={value}
role="checkbox"
aria-checked={checked}
aria-label={ariaLabel || (typeof label === 'string' ? label : undefined)}
disabled={disabled}
onClick={handleClick}
onKeyDown={handleKeyDown}
title={title}
className={`rounded-full border flex items-center justify-center transition-all shrink-0 select-none ${
currentSize.circle
} ${
checked
? 'bg-indigo-600 border-indigo-600 text-white shadow-2xs'
: uncheckedClasses
} ${
disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
} ${circleClassName}`}
>
{checked && (
<Check className={currentSize.icon} strokeWidth={currentSize.stroke} />
)}
</button>
);

if (!label && !description) {
return circleElement;
}

const labelColorClass =
isLight === true
? 'text-slate-800'
: isLight === false
? 'text-slate-200'
: 'text-slate-800 dark:text-slate-200';

const descColorClass =
isLight === true
? 'text-slate-500'
: isLight === false
? 'text-slate-400'
: 'text-slate-500 dark:text-slate-400';

return (
<div
onClick={handleClick}
className={`flex items-start gap-2.5 select-none ${
disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
} ${className}`}
>
<div className="pt-0.5 shrink-0">{circleElement}</div>
<div className="min-w-0 flex-1">
{label && (
<div className={`text-xs font-medium leading-tight ${labelColorClass} ${labelClassName}`}>
{label}
</div>
)}
{description && (
<div className={`text-[11px] leading-snug mt-0.5 ${descColorClass}`}>
{description}
</div>
)}
</div>
</div>
);
};

export default CheckCircle;
