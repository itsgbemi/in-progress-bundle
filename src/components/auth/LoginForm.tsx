import React, { useState, useEffect } from 'react';
import { useAuth, AuthMode } from '../../context/AuthContext';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { Input } from '../common';
import { NotReady } from './NotReady';

interface LoginFormProps {
onSwitchMode: (mode: AuthMode) => void;
uiTheme: 'dark' | 'light';
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 30;

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchMode, uiTheme }) => {
const { login, error, clearError, loading, isFirebaseConfigured } = useAuth();
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [localError, setLocalError] = useState<string | null>(null);
const [isSubmitting, setIsSubmitting] = useState(false);

const [failedAttempts, setFailedAttempts] = useState(0);
const [lockoutRemaining, setLockoutRemaining] = useState(0);

const isLight = uiTheme === 'light';

useEffect(() => {
if (lockoutRemaining <= 0) return;
const interval = setInterval(() => {
setLockoutRemaining((prev) => {
if (prev <= 1) {
setFailedAttempts(0);
return 0;
}
return prev - 1;
});
}, 1000);
return () => clearInterval(interval);
}, [lockoutRemaining]);

if (!isFirebaseConfigured) {
return <NotReady uiTheme={uiTheme} />;
}

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
setLocalError(null);
clearError();

if (lockoutRemaining > 0) {
setLocalError(`Too many failed attempts. Security cool-down active for ${lockoutRemaining}s.`);
return;
}

const cleanEmail = email.trim().toLowerCase();
if (!cleanEmail || !password) {
setLocalError('Please enter both your email address and password.');
return;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(cleanEmail)) {
setLocalError('Please enter a valid email format (e.g. name@domain.com).');
return;
}

setIsSubmitting(true);
try {
await login(cleanEmail, password);
setFailedAttempts(0);
} catch (err: any) {
const nextFailures = failedAttempts + 1;
setFailedAttempts(nextFailures);
if (nextFailures >= MAX_FAILED_ATTEMPTS) {
setLockoutRemaining(LOCKOUT_SECONDS);
setLocalError(`Security lockout triggered due to multiple failed attempts. Please wait ${LOCKOUT_SECONDS}s before trying again.`);
} else {
setLocalError(err.message || 'Invalid email or password. Please verify your credentials.');
}
} finally {
setIsSubmitting(false);
}
};

return (
<div className="w-full max-w-md mx-auto space-y-6">
<div className="text-left">
<h2 className="text-2xl font-bold tracking-tight">Sign In</h2>
</div>

{(localError || error) && (
<div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
<AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
<span className="leading-relaxed">{localError || error}</span>
</div>
)}

{lockoutRemaining > 0 && (
<div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2">
<ShieldCheck className="w-4 h-4 shrink-0 text-amber-500" />
<span>Security lockout active: <strong>{lockoutRemaining}s</strong> remaining</span>
</div>
)}

<form onSubmit={handleSubmit} className="space-y-5 text-xs">
<Input
label="Email Address"
type="email"
required
hideRequiredAsterisk
disabled={lockoutRemaining > 0 || isSubmitting}
value={email}
onChange={(e) => setEmail(e.target.value)}
placeholder="you@domain.com"
autoComplete="email"
variant="pill"
leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
isLight={isLight}
/>

<Input
label="Password"
labelRight={
<button
type="button"
onClick={() => onSwitchMode('forgot_password')}
className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
>
Forgot password?
</button>
}
type="password"
required
hideRequiredAsterisk
disabled={lockoutRemaining > 0 || isSubmitting}
value={password}
onChange={(e) => setPassword(e.target.value)}
placeholder="••••••••"
autoComplete="current-password"
variant="pill"
leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
showPasswordToggle
isLight={isLight}
/>

<button
type="submit"
disabled={isSubmitting || loading || lockoutRemaining > 0}
className="w-full py-3.5 px-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
>
{isSubmitting ? (
<>
<Loader2 className="w-4 h-4 animate-spin" />
<span>Verifying & Signing In...</span>
</>
) : (
<>
<span>Sign In</span>
<ArrowRight className="w-4 h-4" />
</>
)}
</button>
</form>
</div>
);
};
