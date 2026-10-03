import React from 'react';
import { getSavedHeadingFont } from '../../utils/themePreferences';
import { findFontByIdOrName } from '../../data/fonts';

interface NotReadyProps {
uiTheme: 'dark' | 'light';
}

export const NotReady: React.FC<NotReadyProps> = ({ uiTheme }) => {
const isLight = uiTheme === 'light';
const headingFontId = getSavedHeadingFont();
const headingFont = findFontByIdOrName(headingFontId);
const activeFontFamily = headingFont?.family || 'var(--font-heading, var(--font-sans, inherit))';

return (
<div className="w-full max-w-md mx-auto py-10 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
<h2 
data-heading
className="text-3xl sm:text-4xl font-normal text-slate-900 dark:text-white tracking-tight"
style={{ fontFamily: activeFontFamily, fontWeight: 400, fontStyle: 'normal' }}
>
Well, hi :-)
</h2>
<p className={`text-base leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
Your office isn't ready yet. Please chill we brew in the booth.
</p>
</div>
);
};
