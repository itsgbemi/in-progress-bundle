import React, { useState, useEffect } from 'react';
import { AuthMode } from '../../context/AuthContext';
import { LoginForm } from './LoginForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { Sun, Moon } from 'lucide-react';
import { getSavedAuthCustomization, AuthCustomizationConfig } from '../../utils/themePreferences';

interface AuthLayoutProps {
initialMode?: AuthMode;
uiTheme: 'dark' | 'light';
onToggleUiTheme: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
initialMode = 'login',
uiTheme,
onToggleUiTheme,
}) => {
const [authMode, setAuthMode] = useState<AuthMode>(initialMode);
const [authConfig, setAuthConfig] = useState<AuthCustomizationConfig>(() => getSavedAuthCustomization());
const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
const isLight = uiTheme === 'light';

useEffect(() => {
const handleUpdate = () => {
setAuthConfig(getSavedAuthCustomization());
};
window.addEventListener('storage', handleUpdate);
window.addEventListener('auth_customization_updated', handleUpdate);
return () => {
window.removeEventListener('storage', handleUpdate);
window.removeEventListener('auth_customization_updated', handleUpdate);
};
}, []);

useEffect(() => {
if (authConfig.layoutMode === 'two_column' && authConfig.mediaType === 'slideshow' && authConfig.slideshowImages && authConfig.slideshowImages.length > 1) {
const interval = setInterval(() => {
setCurrentSlideIndex((prev) => (prev + 1) % authConfig.slideshowImages.length);
}, (authConfig.slideshowIntervalSeconds || 5) * 1000);
return () => clearInterval(interval);
}
}, [authConfig]);

const currentImage = authConfig.mediaType === 'single'
? (authConfig.singleImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80')
: (authConfig.slideshowImages?.[currentSlideIndex] || authConfig.slideshowImages?.[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80');

if (authConfig.layoutMode === 'two_column') {
return (
<div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative w-full overflow-hidden transition-colors duration-200 bg-white dark:bg-slate-950">
<div className="absolute top-4 right-4 z-30">
<button
onClick={onToggleUiTheme}
className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
isLight
? 'bg-white border-slate-200 hover:bg-slate-100 text-slate-600 shadow-xs'
: 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'
}`}
title="Toggle Theme"
>
{isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
</button>
</div>

<div className="hidden lg:relative lg:block h-full w-full overflow-hidden bg-slate-900">
{authConfig.mediaType === 'slideshow' && authConfig.slideshowImages && authConfig.slideshowImages.length > 0 ? (
authConfig.slideshowImages.map((img, idx) => (
<div
key={img + idx}
className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
idx === currentSlideIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
}`}
style={{ backgroundImage: `url(${img})`, transition: 'opacity 1s ease-in-out, transform 7s ease-out' }}
/>
))
) : (
<div
className="absolute inset-0 bg-cover bg-center"
style={{ backgroundImage: `url(${currentImage})` }}
/>
)}

{authConfig.darkOverlay && (
<div
className="absolute inset-0 bg-black pointer-events-none"
style={{ opacity: (authConfig.overlayOpacity ?? 50) / 100 }}
/>
)}
</div>

<div className="flex items-center justify-center p-6 sm:p-12 relative z-20">
<main className="w-full max-w-md my-auto">
<div
className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all bg-transparent"
>
{authMode === 'login' && (
<LoginForm onSwitchMode={setAuthMode} uiTheme={uiTheme} />
)}
{authMode === 'forgot_password' && (
<ForgotPasswordForm onSwitchMode={setAuthMode} uiTheme={uiTheme} />
)}
</div>
</main>
</div>
</div>
);
}

return (
<div
className={`min-h-screen relative flex items-center justify-center p-4 sm:p-6 transition-colors duration-200 ${
isLight ? 'bg-slate-100/70 text-slate-900' : 'bg-slate-950 text-slate-100'
}`}
>
<div className="absolute top-4 right-4 z-20">
<button
onClick={onToggleUiTheme}
className={`p-2 rounded-xl border transition-colors cursor-pointer ${
isLight
? 'bg-white border-slate-200 hover:bg-slate-100 text-slate-600 shadow-xs'
: 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'
}`}
title="Toggle Theme"
>
{isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
</button>
</div>

<main className="w-full max-w-md my-auto">
<div
className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all bg-transparent"
>
{authMode === 'login' && (
<LoginForm onSwitchMode={setAuthMode} uiTheme={uiTheme} />
)}
{authMode === 'forgot_password' && (
<ForgotPasswordForm onSwitchMode={setAuthMode} uiTheme={uiTheme} />
)}
</div>
</main>
</div>
);
};
