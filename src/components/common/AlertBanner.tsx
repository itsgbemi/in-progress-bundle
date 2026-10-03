import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface AlertBannerProps {
message: string;
type?: 'success' | 'error' | 'warning' | 'info';
isLight?: boolean;
onDismiss?: () => void;
className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
message,
type = 'success',
isLight = false,
onDismiss,
className = '',
}) => {
const getColors = () => {
switch (type) {
case 'error':
return isLight
? 'bg-rose-50 border-rose-200 text-rose-800'
: 'bg-rose-950/40 border-rose-900/50 text-rose-200';
case 'warning':
return isLight
? 'bg-amber-50 border-amber-200 text-amber-800'
: 'bg-amber-950/40 border-amber-900/50 text-amber-200';
case 'info':
return isLight
? 'bg-blue-50 border-blue-200 text-blue-800'
: 'bg-blue-950/40 border-blue-900/50 text-blue-200';
case 'success':
default:
return isLight
? 'bg-emerald-50 border-emerald-200 text-emerald-800'
: 'bg-emerald-950/40 border-emerald-900/50 text-emerald-200';
}
};

const Icon = type === 'success' ? CheckCircle2 : AlertCircle;

return (
<div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs font-medium animate-in fade-in duration-200 ${getColors()} ${className}`}>
<div className="flex items-center gap-2 min-w-0">
<Icon className="w-4 h-4 shrink-0" />
<span className="truncate">{message}</span>
</div>
{onDismiss && (
<button
type="button"
onClick={onDismiss}
className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer shrink-0"
>
<X className="w-3.5 h-3.5" />
</button>
)}
</div>
);
};
