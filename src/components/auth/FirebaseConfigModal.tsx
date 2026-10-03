import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FirebaseConfig } from '../../lib/firebase';
import { KeyRound, X, Check, HelpCircle, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { Input } from '../common';
interface FirebaseConfigModalProps {
isOpen: boolean;
onClose: () => void;
uiTheme: 'dark' | 'light';
}
export const FirebaseConfigModal: React.FC<FirebaseConfigModalProps> = ({ isOpen, onClose, uiTheme, }) => {
const { firebaseConfig, saveConfigAndReload, isFirebaseConfigured } = useAuth();
const [formData, setFormData] = useState<FirebaseConfig>({ ...firebaseConfig });
const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
const [statusMessage, setStatusMessage] = useState<string>('');
if (!isOpen)
return null;
const isLight = uiTheme === 'light';
const handleChange = (field: keyof FirebaseConfig, val: string) => {
setFormData((prev) => ({ ...prev, [field]: val.trim() }));
setSavedSuccess(false);
};
const handleSave = (e: React.FormEvent) => {
e.preventDefault();
const isValid = saveConfigAndReload(formData);
setSavedSuccess(true);
if (isValid) {
setTestStatus('success');
setStatusMessage('Firebase config successfully saved and initialized!');
}
else {
setTestStatus('idle');
setStatusMessage('Config saved. Note: An API Key and Project ID are required for live Firebase authentication.');
}
setTimeout(() => {
setSavedSuccess(false);
}, 2500);
};
const handleTestConnection = async () => {
setTestStatus('testing');
setStatusMessage('Validating Firebase configuration...');
try {
const isValid = saveConfigAndReload(formData);
if (isValid) {
setTestStatus('success');
setStatusMessage('Firebase credentials are valid and ready for Auth & Storage!');
}
else {
setTestStatus('error');
setStatusMessage('Incomplete configuration. Please provide at least API Key and Project ID.');
}
}
catch (err: any) {
setTestStatus('error');
setStatusMessage(err.message || 'Failed to connect to Firebase.');
}
};
return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
<div className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'}`}>
<div className={`px-6 py-4 border-b flex items-center justify-between ${isLight ? 'border-slate-200 bg-slate-50/70' : 'border-slate-800 bg-slate-800/40'}`}>
<div className="flex items-center gap-3">
<div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
<KeyRound className="w-5 h-5"/>
</div>
<div>
<h3 className="text-base font-bold">Firebase Configuration Keys</h3>
<p className="text-xs text-slate-400">Configure Authentication & Storage keys</p>
</div>
</div>
<button onClick={onClose} className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isLight ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-slate-800 text-slate-400'}`}>
<X className="w-5 h-5"/>
</button>
</div>

<form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
<div className={`p-4 rounded-xl border flex items-start gap-3 ${isFirebaseConfigured
? isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
: isLight ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-blue-950/40 border-blue-800/60 text-blue-200'}`}>
{isFirebaseConfigured ? (<ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"/>) : (<HelpCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5"/>)}
<div className="space-y-1">
<div className="font-semibold text-sm flex items-center gap-2">
{isFirebaseConfigured ? 'Firebase Active' : 'Provide Your Firebase Config'}
</div>
<p className="text-[11px] opacity-90 leading-relaxed">
You can obtain these keys in the <strong className="font-semibold">Firebase Console &gt; Project Settings &gt; General &gt; Your Apps (Web App)</strong>.
</p>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
<div className="md:col-span-2">
<Input
label="API Key"
required
hideRequiredAsterisk
value={formData.apiKey || ''}
onChange={(e) => handleChange('apiKey', e.target.value)}
placeholder="Paste Firebase API Key"
variant="pill"
isLight={isLight}
/>
</div>

<div>
<Input
label="Project ID"
required
hideRequiredAsterisk
value={formData.projectId || ''}
onChange={(e) => handleChange('projectId', e.target.value)}
placeholder="my-website-project"
variant="pill"
isLight={isLight}
/>
</div>

<div>
<Input
label="Auth Domain"
value={formData.authDomain || ''}
onChange={(e) => handleChange('authDomain', e.target.value)}
placeholder="my-project.firebaseapp.com"
variant="pill"
isLight={isLight}
/>
</div>

<div>
<Input
label="Storage Bucket"
value={formData.storageBucket || ''}
onChange={(e) => handleChange('storageBucket', e.target.value)}
placeholder="my-project.appspot.com"
variant="pill"
isLight={isLight}
/>
</div>

<div>
<Input
label="App ID"
value={formData.appId || ''}
onChange={(e) => handleChange('appId', e.target.value)}
placeholder="1:123456789:web:abcdef"
variant="pill"
isLight={isLight}
/>
</div>

<div className="md:col-span-2">
<Input
label="Messaging Sender ID"
value={formData.messagingSenderId || ''}
onChange={(e) => handleChange('messagingSenderId', e.target.value)}
placeholder="1234567890"
variant="pill"
isLight={isLight}
/>
</div>
</div>

{statusMessage && (<div className={`p-3 rounded-xl flex items-center gap-2 text-xs ${testStatus === 'success'
? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
: testStatus === 'error'
? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
: 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'}`}>
{testStatus === 'success' && <Check className="w-4 h-4 shrink-0"/>}
{testStatus === 'error' && <AlertCircle className="w-4 h-4 shrink-0"/>}
{testStatus === 'testing' && <RefreshCw className="w-4 h-4 shrink-0 animate-spin"/>}
<span>{statusMessage}</span>
</div>)}

<div className="pt-3 border-t border-slate-700/20 flex items-center justify-between gap-3">
<button type="button" onClick={handleTestConnection} className={`px-3.5 py-2.5 rounded-xl border font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${isLight ? 'border-slate-300 hover:bg-slate-100 text-slate-700' : 'border-slate-700 hover:bg-slate-800 text-slate-200'}`}>
<RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin' : ''}`}/>
<span>Test Connection</span>
</button>

<div className="flex items-center gap-2">
<button type="button" onClick={onClose} className={`px-4 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${isLight ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-slate-800 text-slate-300'}`}>
Close
</button>
<button type="submit" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer">
{savedSuccess ? <Check className="w-4 h-4"/> : <ShieldCheck className="w-4 h-4"/>}
<span>{savedSuccess ? 'Saved!' : 'Save Credentials'}</span>
</button>
</div>
</div>
</form>
</div>
</div>);
};
