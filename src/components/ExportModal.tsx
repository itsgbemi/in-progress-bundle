import React, { useState } from 'react';
import { X, Copy, Check, Download, FolderGit2, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { WebsitePage } from '../types';
import {
generateFullHtml,
generatePackageJson,
generateManifestJson,
generateVercelJson,
generateSubmitFormApi
} from '../utils/htmlGenerator';
import { autoPublishWebsitePage } from '../services/githubService';
import { Button, Badge } from './common';

interface ExportModalProps {
isOpen: boolean;
onClose: () => void;
page: WebsitePage;
uiTheme?: 'dark' | 'light';
}

type ProjectFile = 'html' | 'api' | 'package' | 'manifest' | 'vercel';

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, page, uiTheme = 'dark' }) => {
const [copied, setCopied] = useState(false);
const [activeFile, setActiveFile] = useState<ProjectFile>('html');
const [showSidebar, setShowSidebar] = useState(false);
const [isPublishing, setIsPublishing] = useState(false);
const [publishFeedback, setPublishFeedback] = useState<{
type: 'success' | 'error';
message: string;
commitUrl?: string;
} | null>(null);

if (!isOpen) return null;

const isLight = uiTheme === 'light';
const fullHtml = generateFullHtml(page);
const packageJson = generatePackageJson(page);
const manifestJson = generateManifestJson(page);
const vercelJson = generateVercelJson();
const submitApi = generateSubmitFormApi(page);

const getActiveContent = () => {
switch (activeFile) {
case 'html': return fullHtml;
case 'api': return submitApi;
case 'package': return packageJson;
case 'manifest': return manifestJson;
case 'vercel': return vercelJson;
default: return fullHtml;
}
};

const getActiveFileName = () => {
switch (activeFile) {
case 'html': return page.fileName || 'index.html';
case 'api': return 'api/submit-form.js';
case 'package': return 'package.json';
case 'manifest': return 'manifest.json';
case 'vercel': return 'vercel.json';
default: return 'index.html';
}
};

const handleCopy = () => {
navigator.clipboard.writeText(getActiveContent());
setCopied(true);
setTimeout(() => setCopied(false), 2000);
};

const handleDownload = () => {
const content = getActiveContent();
const fileName = getActiveFileName();
const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = fileName;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);
};

const handleFileSelect = (fileId: ProjectFile) => {
setActiveFile(fileId);
if (window.innerWidth < 768) {
setShowSidebar(false);
}
};

const handlePublish = async () => {
if (isPublishing) return;
setIsPublishing(true);
setPublishFeedback(null);
try {
const result = await autoPublishWebsitePage(page);
if (result.success) {
setPublishFeedback({
type: 'success',
message: 'Successfully Published to GitHub!',
commitUrl: result.commitUrl,
});
} else {
setPublishFeedback({
type: 'error',
message: 'Publishing failed. Please check repository settings.',
});
}
} catch (err: any) {
setPublishFeedback({
type: 'error',
message: err.message || 'Failed to publish to GitHub.',
});
} finally {
setIsPublishing(false);
}
};

return (
<div className={`fixed inset-0 z-[100] w-full h-full flex flex-col overflow-hidden animate-in fade-in duration-150 ${
isLight ? 'bg-slate-50 text-slate-800' : 'bg-slate-950 text-slate-100'
}`}>
<div className={`flex items-center justify-between px-4 sm:px-6 py-3 border-b shrink-0 transition-colors ${
isLight ? 'border-slate-200 bg-white/95 text-slate-900' : 'border-slate-800 bg-slate-900/90 text-slate-100'
}`}>
<div className="flex items-center gap-2">
<span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
View Source Code
</span>
</div>

<div className="flex items-center gap-2">
<button
onClick={() => setShowSidebar(!showSidebar)}
className={`md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors border ${
isLight
? 'bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-200'
: 'bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-700'
}`}
>
<span>Files</span>
</button>

<div className={`p-1 rounded-xl border shadow-xs transition-colors ${
isLight
? 'bg-slate-100 hover:bg-slate-200 border-slate-200'
: 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/60'
}`}>
<button
type="button"
onClick={onClose}
className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
isLight ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-white'
}`}
title="Close Code Viewer"
aria-label="Close"
>
<span className="hidden sm:inline">Close</span>
<X className={`w-4 h-4 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
</button>
</div>
</div>
</div>

<div className={`px-4 sm:px-6 py-3 sm:py-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 shrink-0 transition-colors ${
isLight ? 'border-slate-200 bg-white' : 'border-slate-800/80 bg-slate-900/60'
}`}>
<div className="flex items-center gap-3">
<div>
<h2 className={`text-xs sm:text-lg font-bold leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
Export Webpage
</h2>
<p className={`hidden xs:block text-[9px] sm:text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
Clean, production-ready source code
</p>
</div>
</div>

<div className="flex items-center gap-2 w-full md:w-auto">
<Button
variant="secondary"
size="sm"
onClick={handleCopy}
isLight={isLight}
className="flex-1 md:flex-none"
leftIcon={
copied ? (
<Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
) : (
<Copy className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`} />
)
}
>
<span className="truncate">{copied ? 'Copied!' : `Copy ${activeFile.toUpperCase()}`}</span>
</Button>

<Button
variant="secondary"
size="sm"
onClick={handleDownload}
isLight={isLight}
className="flex-1 md:flex-none"
leftIcon={<Download className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`} />}
>
<span className="truncate">{activeFile === 'html' ? '.html' : 'File'}</span>
</Button>

<Button
variant={
publishFeedback?.type === 'success' ? 'success' :
publishFeedback?.type === 'error' ? 'danger' : 'primary'
}
size="sm"
onClick={handlePublish}
disabled={isPublishing}
isLoading={isPublishing}
loadingText="Publishing..."
isLight={isLight}
className="flex-1 md:flex-none"
leftIcon={
publishFeedback?.type === 'success' ? (
<CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
) : publishFeedback?.type === 'error' ? (
<AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
) : (
<FolderGit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
)
}
>
<span className="truncate">{publishFeedback?.type === 'success' ? 'Published!' : 'Publish'}</span>
</Button>
</div>
</div>

<div className="flex-1 flex overflow-hidden relative">
<div className={`
absolute md:relative inset-y-0 left-0 z-50 w-full sm:w-72 md:w-72 border-r flex flex-col overflow-hidden shrink-0 transition-transform duration-300 ease-in-out
${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
${isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900'}
`}>
<div className={`p-4 border-b flex items-center justify-between ${
isLight ? 'border-slate-200 bg-slate-50/70' : 'border-slate-800 bg-slate-900/20'
}`}>
<h3 className={`text-[11px] font-bold uppercase tracking-widest ${
isLight ? 'text-slate-500' : 'text-slate-400'
}`}>
<span>Project Manifest</span>
</h3>
<button
onClick={() => setShowSidebar(false)}
className={`md:hidden p-1 rounded-lg transition-colors ${
isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-slate-800 text-slate-400'
}`}
>
<X className="w-4 h-4" />
</button>
</div>

<div className="flex-1 overflow-y-auto p-3 space-y-4">
<div className="space-y-1.5">
{[
{ id: 'html', path: page.fileName || 'index.html', desc: 'Main Page HTML' },
{ id: 'api', path: 'api/submit-form.js', desc: 'Serverless Form Handler' },
{ id: 'package', path: 'package.json', desc: 'Project Dependencies' },
{ id: 'manifest', path: 'manifest.json', desc: 'PWA Web App Manifest' },
{ id: 'vercel', path: 'vercel.json', desc: 'Deployment Config' }
].map((file, idx) => {
const isSelected = activeFile === file.id;
return (
<button
key={idx}
onClick={() => handleFileSelect(file.id as ProjectFile)}
className={`w-full group flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
isSelected
? isLight
? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-xs font-semibold'
: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200 shadow-sm'
: isLight
? 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-700'
: 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400'
}`}
>
<div className="flex items-center gap-2.5 min-w-0">
<div className="flex flex-col min-w-0">
<span className="font-mono text-[11px] font-bold truncate">{file.path}</span>
<span className={`text-[9px] truncate ${
isSelected
? isLight ? 'text-indigo-700' : 'text-indigo-300'
: isLight ? 'text-slate-500' : 'opacity-60'
}`}>
{file.desc}
</span>
</div>
</div>
</button>
);
})}
</div>

{publishFeedback && (
<div className={`p-3.5 rounded-2xl border animate-in slide-in-from-bottom-2 duration-200 ${
publishFeedback.type === 'success'
? isLight
? 'bg-emerald-50 border-emerald-300 text-emerald-800'
: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
: isLight
? 'bg-rose-50 border-rose-300 text-rose-800'
: 'bg-rose-500/10 border-rose-500/30 text-rose-400'
}`}>
<div className="flex flex-col gap-2">
<div className="flex items-center gap-2 font-bold text-[10px]">
{publishFeedback.type === 'success' ? (
<CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-600' : ''}`} />
) : (
<AlertCircle className={`w-3.5 h-3.5 ${isLight ? 'text-rose-600' : ''}`} />
)}
<span>{publishFeedback.type === 'success' ? 'Success' : 'Error'}</span>
</div>
<p className="text-[10px] leading-relaxed opacity-90">{publishFeedback.message}</p>
{publishFeedback.commitUrl && (
<a
href={publishFeedback.commitUrl}
target="_blank"
rel="noopener noreferrer"
className={`text-[10px] underline hover:opacity-80 transition-opacity font-bold mt-1 ${
isLight ? 'text-emerald-700' : ''
}`}
>
View Commit on GitHub
</a>
)}
</div>
</div>
)}
</div>
</div>

{showSidebar && (
<div
className={`absolute inset-0 z-40 md:hidden backdrop-blur-xs transition-all ${
isLight ? 'bg-slate-900/20' : 'bg-slate-950/60'
}`}
onClick={() => setShowSidebar(false)}
/>
)}

<div className={`flex-1 p-3 sm:p-6 overflow-auto font-mono text-[10px] sm:text-xs md:text-sm leading-relaxed scrollbar-thin transition-colors ${
isLight
? 'bg-[#f8fafc] text-slate-800 selection:bg-indigo-100 selection:text-indigo-900'
: 'bg-slate-950 text-indigo-200 selection:bg-indigo-500 selection:text-white'
}`}>
<div className={`mb-4 flex items-center justify-between gap-2 text-[10px] uppercase tracking-widest border-b pb-2 ${
isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-500'
}`}>
<div className="flex items-center gap-2 truncate">
<span className="truncate font-semibold">File: {getActiveFileName()}</span>
</div>
<Badge variant="neutral" size="xs" isLight={isLight}>
{activeFile.toUpperCase()}
</Badge>
</div>
<pre className="whitespace-pre-wrap break-all sm:break-normal">{getActiveContent()}</pre>
</div>
</div>
</div>
);
};
