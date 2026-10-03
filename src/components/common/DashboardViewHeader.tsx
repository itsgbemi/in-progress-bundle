import React from 'react';

export interface DashboardViewHeaderProps {
title: string;
description?: string;
actions?: React.ReactNode;
isLight?: boolean;
className?: string;
}

export const DashboardViewHeader: React.FC<DashboardViewHeaderProps> = ({
title,
actions,
isLight = false,
className = '',
}) => {
return (
<div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/60 mb-6 ${className}`}>
<div className="space-y-1 min-w-0">
<h2 className={`text-lg font-semibold tracking-tight ${
isLight ? 'text-slate-900' : 'text-slate-100'
}`}>
{title}
</h2>
</div>
{actions && (
<div className="flex items-center gap-2.5 shrink-0">
{actions}
</div>
)}
</div>
);
};
