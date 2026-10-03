import React from 'react';

export const ThreeDotLoading: React.FC<{ className?: string }> = ({ className = 'text-slate-400' }) => (
<span className={`inline-flex items-center gap-1.5 ${className}`} title="Loading workspace name...">
<span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.3s]"></span>
<span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.15s]"></span>
<span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce"></span>
</span>
);
