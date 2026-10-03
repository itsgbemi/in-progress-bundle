import React, { useState } from 'react';
import { useAuth, AuthMode } from '../../context/AuthContext';
import { 
Mail, 
ArrowLeft, 
AlertCircle, 
CheckCircle2, 
Loader2, 
KeyRound, 
ArrowRight 
} from 'lucide-react';
import { Input } from '../common';
import { NotReady } from './NotReady';

interface ForgotPasswordFormProps {
onSwitchMode: (mode: AuthMode) => void;
uiTheme: 'dark' | 'light';
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
onSwitchMode,
uiTheme,
}) => {
const { resetPassword, error, clearError, loading, isFirebaseConfigured } = useAuth();
const [email, setEmail] = useState('');
const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
const [localError, setLocalError] = useState<string | null>(null);
const [isSubmitting, setIsSubmitting] = useState(false);

const isLight = uiTheme === 'light';

if (!isFirebaseConfigured) {
return <NotReady uiTheme={uiTheme} />;
}

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
setLocalError(null);
clearError();

if (!email.trim()) {
setLocalError('Please enter your account email address.');
return;
}

setIsSubmitting(true);
try {
await resetPassword(email.trim());
setSubmittedEmail(email.trim());
} catch (err: any) {
setLocalError(err.message || 'Unable to send password recovery email. Please try again or contact support.');
} finally {
setIsSubmitting(false);
}
};

return (
<div className="w-full max-w-md mx-auto space-y-6">
<div className="flex items-center justify-between">
<button
type="button"
onClick={() => onSwitchMode('login')}
className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
>
<ArrowLeft className="w-3.5 h-3.5" />
<span>Back to Login</span>
</button>
</div>

<div className="text-left">
<h2 className="text-2xl font-bold tracking-tight">Forgot Password</h2>
</div>

{submittedEmail ? (
<div className="space-y-4">
<div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs space-y-2 animate-in fade-in duration-200">
<div className="flex items-center gap-2 font-bold text-sm">
<CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
<span>Password Reset Email Sent!</span>
</div>
<p className="leading-relaxed text-[11px] opacity-90">
We&apos;ve dispatched a secure recovery link to <strong className="font-semibold">{submittedEmail}</strong>. Follow the instructions in the email to set a new password.
</p>
</div>
</div>
) : (
<>
{(localError || error) && (
<div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
<AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
<span className="leading-relaxed">{localError || error}</span>
</div>
)}

<form onSubmit={handleSubmit} className="space-y-5 text-xs">
<Input
label="Account Email"
type="email"
required
hideRequiredAsterisk
value={email}
onChange={(e) => setEmail(e.target.value)}
placeholder="you@domain.com"
autoComplete="email"
variant="pill"
leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
isLight={isLight}
/>

<button
type="submit"
disabled={isSubmitting || loading}
className="w-full py-3.5 px-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
>
{isSubmitting ? (
<>
<Loader2 className="w-4 h-4 animate-spin" />
<span>Sending Reset Link...</span>
</>
) : (
<>
<span>Send Recovery Email</span>
<ArrowRight className="w-4 h-4" />
</>
)}
</button>
</form>
</>
)}
</div>
);
};
