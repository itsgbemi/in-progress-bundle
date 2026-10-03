import React, { useState, useEffect } from 'react';
import { 
Check, 
ExternalLink, 
AlertCircle, 
CheckCircle2, 
GitBranch, 
FolderGit2, 
FileCode, 
KeyRound, 
RefreshCw,
Sparkles
} from 'lucide-react';
import { WebsitePage } from '../types';
import { generateFullHtml, extractFormFields } from '../utils/htmlGenerator';
import { 
fetchGitHubStatus, 
publishPageToGitHub, 
verifyGitHubRepo, 
GitHubStatus, 
PublishResult,
RepoVerification 
} from '../services/githubService';
import {
Modal,
ModalHeader,
ModalBody,
ModalFooter,
Button,
Badge,
FormField,
TextInput,
} from './common';

interface PublishModalProps {
isOpen: boolean;
onClose: () => void;
page: WebsitePage;
uiTheme?: 'dark' | 'light';
}

export const PublishModal: React.FC<PublishModalProps> = ({
isOpen,
onClose,
page,
uiTheme = 'dark',
}) => {
const isLight = uiTheme === 'light';

const [status, setStatus] = useState<GitHubStatus | null>(null);
const [loadingStatus, setLoadingStatus] = useState(true);

const defaultSlug = (page?.title || 'index')
.toLowerCase()
.replace(/[^a-z0-9]/g, '-')
.replace(/-+/g, '-')
.replace(/^-|-$/g, '') || 'index';

const [repoOwner, setRepoOwner] = useState('');
const [repoName, setRepoName] = useState('');
const [branch, setBranch] = useState('main');
const [filePath, setFilePath] = useState('index.html');
const [commitMessage, setCommitMessage] = useState('');

const [isVerifying, setIsVerifying] = useState(false);
const [verificationResult, setVerificationResult] = useState<RepoVerification | null>(null);
const [verificationError, setVerificationError] = useState<string | null>(null);

const [isPublishing, setIsPublishing] = useState(false);
const [publishResult, setPublishResult] = useState<PublishResult | null>(null);
const [publishError, setPublishError] = useState<string | null>(null);

useEffect(() => {
if (isOpen) {
loadStatus();
setCommitMessage(`Publish ${page?.title || 'Page'} via Website Builder [${new Date().toLocaleDateString()}]`);

const isHome = (page?.title || '').toLowerCase() === 'home' || page?.id === 'home';
setFilePath(page?.fileName || (isHome ? 'index.html' : `${defaultSlug}.html`));
setPublishResult(null);
setPublishError(null);
setVerificationResult(null);
setVerificationError(null);
}
}, [isOpen, page?.title, page?.id]);

const loadStatus = async () => {
setLoadingStatus(true);
try {
const s = await fetchGitHubStatus();
setStatus(s);
if (s.owner && !repoOwner) setRepoOwner(s.owner);
if (s.repo && !repoName) setRepoName(s.repo);
if (s.branch && branch === 'main') setBranch(s.branch);
} catch (e) {
console.error(e);
} finally {
setLoadingStatus(false);
}
};

if (!isOpen) return null;

const handleVerifyRepo = async () => {
const owner = repoOwner.trim() || status?.owner || '';
const repo = repoName.trim() || status?.repo || '';

if (!owner || !repo) {
setVerificationError('Please enter both repository owner and repository name.');
return;
}

setIsVerifying(true);
setVerificationError(null);
setVerificationResult(null);

try {
const res = await verifyGitHubRepo(owner, repo);
setVerificationResult(res);
if (res.defaultBranch && branch === 'main') {
setBranch(res.defaultBranch);
}
} catch (err: any) {
setVerificationError(err.message || 'Failed to verify repository');
} finally {
setIsVerifying(false);
}
};

const handlePublish = async () => {
const owner = repoOwner.trim() || status?.owner || '';
const repo = repoName.trim() || status?.repo || '';

if (!owner || !repo) {
setPublishError('Repository owner and repository name are required.');
return;
}

setIsPublishing(true);
setPublishError(null);
setPublishResult(null);

try {
const targetPath = filePath.trim() || 'index.html';
const prevPath = page?.previousFileName && page.previousFileName.trim() !== targetPath ? page.previousFileName.trim() : undefined;

const htmlContent = generateFullHtml(page);
const formFields = extractFormFields(page);

const result = await publishPageToGitHub({
content: htmlContent,
filePath: targetPath,
previousFilePath: prevPath,
commitMessage: commitMessage.trim() || `Publish ${page?.title || 'page'}`,
repoOwner: owner,
repoName: repo,
branch: branch.trim() || 'main',
siteName: repo || page?.siteSettings?.title || page?.title,
siteDescription: page?.siteSettings?.description || (page?.title ? `${page.title} - Website` : undefined),
pageTitle: page?.title,
formFields,
});
setPublishResult(result);
} catch (err: any) {
setPublishError(err.message || 'An error occurred while publishing to GitHub.');
} finally {
setIsPublishing(false);
}
};

return (
<Modal
isOpen={isOpen}
onClose={onClose}
isLight={isLight}
size="xl"
aria-labelledby="publish-modal-title"
>
<ModalHeader
title="Publish to GitHub"
description={`Commit & deploy "${page?.title || 'this page'}" directly into your repository`}
icon={<FolderGit2 className="w-5 h-5" />}
badge={<Badge variant="primary" isLight={isLight}>Direct Git Commit</Badge>}
onClose={onClose}
isLight={isLight}
titleId="publish-modal-title"
/>

<ModalBody isLight={isLight} className="p-6 space-y-6 text-xs">
{loadingStatus ? (
<div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 text-slate-400">
<span className="inline-block w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
<span>Checking GitHub connection status...</span>
</div>
) : status?.hasToken ? (
<div className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
isLight ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' : 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
}`}>
<div className="flex items-start gap-3">
<CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
<div className="space-y-1">
<div className="font-bold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
<span>GitHub Personal Access Token Active</span>
</div>
<p className="text-[11px] text-emerald-800/80 dark:text-emerald-400/80 leading-relaxed">
Connected securely via your workspace secrets (<code>GITHUB_TOKEN</code>). You can commit directly to public and private repositories.
</p>
</div>
</div>
<Button
variant="ghost"
size="xs"
onClick={loadStatus}
isLight={isLight}
className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
title="Refresh Status"
aria-label="Refresh status"
>
<RefreshCw className="w-3.5 h-3.5" />
</Button>
</div>
) : (
<div className={`p-4.5 rounded-2xl border space-y-3 ${
isLight ? 'bg-amber-50/80 border-amber-200 text-amber-950' : 'bg-amber-950/20 border-amber-800/50 text-amber-200'
}`}>
<div className="flex items-start gap-3">
<KeyRound className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
<div className="space-y-1.5">
<div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
<span>GitHub Secret Keys Required</span>
</div>
<p className="text-[11px] text-amber-900/80 dark:text-amber-300/80 leading-relaxed">
To publish pages directly to GitHub, please configure the following secret environment variables in your workspace 
<strong> Settings &gt; Secrets</strong>:
</p>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
<div className={`p-2.5 rounded-xl border ${isLight ? 'bg-white/80 border-amber-200' : 'bg-slate-900/80 border-amber-800/40'}`}>
<span className="font-bold text-amber-700 dark:text-amber-400 block mb-0.5">GITHUB_TOKEN</span>
<span className="text-slate-500 dark:text-slate-400 font-sans text-[11px]">
Personal access token with <code>repo</code> or <code>contents:write</code> scope
</span>
</div>
<div className={`p-2.5 rounded-xl border ${isLight ? 'bg-white/80 border-amber-200' : 'bg-slate-900/80 border-amber-800/40'}`}>
<span className="font-bold text-amber-700 dark:text-amber-400 block mb-0.5">GITHUB_REPO_OWNER</span>
<span className="text-slate-500 dark:text-slate-400 font-sans text-[11px]">
GitHub username or org (e.g. <code>username</code>)
</span>
</div>
<div className={`p-2.5 rounded-xl border ${isLight ? 'bg-white/80 border-amber-200' : 'bg-slate-900/80 border-amber-800/40'}`}>
<span className="font-bold text-amber-700 dark:text-amber-400 block mb-0.5">GITHUB_REPO_NAME</span>
<span className="text-slate-500 dark:text-slate-400 font-sans text-[11px]">
Target repository name (e.g. <code>my-landing-page</code>)
</span>
</div>
<div className={`p-2.5 rounded-xl border ${isLight ? 'bg-white/80 border-amber-200' : 'bg-slate-900/80 border-amber-800/40'}`}>
<span className="font-bold text-amber-700 dark:text-amber-400 block mb-0.5">GITHUB_REPO_BRANCH</span>
<span className="text-slate-500 dark:text-slate-400 font-sans text-[11px]">
Target repository branch
</span>
</div>
</div>

<div className="flex items-center justify-between pt-1 text-[11px]">
<span className="text-slate-500 dark:text-slate-400">
After setting your keys in Secrets, click refresh:
</span>
<Button
variant="warning"
size="xs"
onClick={loadStatus}
isLight={isLight}
leftIcon={<RefreshCw className="w-3 h-3" />}
>
Check Secrets
</Button>
</div>
</div>
)}

<div className="space-y-4">
<h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
<span>Target Repository & Destination</span>
</h4>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
<FormField label="Repository Owner" required isLight={isLight}>
<TextInput
value={repoOwner}
onChange={(e) => setRepoOwner(e.target.value)}
placeholder="e.g. username or organization"
isLight={isLight}
className="font-mono"
/>
</FormField>

<FormField label="Repository Name" required isLight={isLight}>
<TextInput
value={repoName}
onChange={(e) => setRepoName(e.target.value)}
placeholder="e.g. personal-site or docs"
isLight={isLight}
className="font-mono"
/>
</FormField>
</div>

<div className="flex items-center justify-between">
<Button
variant="secondary"
size="xs"
onClick={handleVerifyRepo}
disabled={isVerifying || !status?.hasToken}
isLoading={isVerifying}
loadingText="Verifying..."
isLight={isLight}
leftIcon={<FolderGit2 className="w-3.5 h-3.5" />}
>
Verify Repository Access
</Button>

{verificationResult && (
<span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
<Check className="w-3.5 h-3.5" />
<span>Found: {verificationResult.fullName} ({verificationResult.isPrivate ? 'Private' : 'Public'})</span>
</span>
)}
</div>

{verificationError && (
<div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-[11px] flex items-center gap-2">
<AlertCircle className="w-4 h-4 shrink-0" />
<span>{verificationError}</span>
</div>
)}

<div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
<FormField
label={
<span className="flex items-center gap-1">
<GitBranch className="w-3.5 h-3.5 text-indigo-500" />
<span>Target Branch</span>
</span>
}
isLight={isLight}
>
<TextInput
value={branch}
onChange={(e) => setBranch(e.target.value)}
placeholder="main or gh-pages"
isLight={isLight}
className="font-mono"
/>
</FormField>

<FormField
label={
<span className="flex items-center gap-1">
<FileCode className="w-3.5 h-3.5 text-indigo-500" />
<span>File Path in Repository</span>
</span>
}
isLight={isLight}
>
<div className="flex gap-1.5">
<TextInput
value={filePath}
onChange={(e) => setFilePath(e.target.value)}
placeholder="index.html or pages/about.html"
isLight={isLight}
className="flex-1 font-mono"
/>
<Button
variant={filePath === 'index.html' ? 'primary' : 'secondary'}
size="sm"
onClick={() => setFilePath('index.html')}
isLight={isLight}
className="font-mono text-[11px]"
title="Set to root index.html"
>
index.html
</Button>
</div>
</FormField>
</div>

<FormField label="Commit Message" isLight={isLight}>
<TextInput
value={commitMessage}
onChange={(e) => setCommitMessage(e.target.value)}
placeholder="Commit message"
isLight={isLight}
/>
</FormField>

<div className={`p-3.5 rounded-2xl border ${
isLight ? 'bg-indigo-50/60 border-indigo-200 text-indigo-950' : 'bg-indigo-950/20 border-indigo-800/40 text-indigo-200'
}`}>
<div className="flex items-start gap-2.5">
<Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
<div className="space-y-1 text-[11px] leading-relaxed">
<span className="font-bold block text-indigo-900 dark:text-indigo-300">
Automated Form Handling & Backend Integration
</span>
<p className="text-slate-600 dark:text-slate-300">
When you publish, serverless form processing files (<code>api/submit-form.js</code>, <code>package.json</code>, and site deployment configs) are automatically committed to your repository.
</p>
<p className="text-slate-500 dark:text-slate-400 font-mono text-[10px] pt-0.5">
Configure backend environment variables in your host: <strong>PROJECT_ID</strong>, <strong>CLIENT_EMAIL</strong>, <strong>PRIVATE_KEY</strong>, <strong>DATABASE_URL</strong>
</p>
</div>
</div>
</div>
</div>

{publishResult && (
<div className={`p-5 rounded-2xl border space-y-3 animate-in zoom-in-95 duration-150 ${
isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-emerald-950/30 border-emerald-700/50 text-emerald-200'
}`}>
<div className="flex items-start gap-3">
<div className="p-2 rounded-xl bg-emerald-500 text-white shrink-0 shadow-sm">
<Check className="w-4 h-4" />
</div>
<div className="space-y-1">
<h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-300">
Successfully Published to GitHub!
</h4>
<p className="text-[11px] text-slate-600 dark:text-slate-300">
File <code className="font-mono font-bold">{publishResult.filePath}</code> was committed to branch{' '}
<code className="font-mono font-bold">{publishResult.branch}</code> on{' '}
<code className="font-mono font-bold">{publishResult.repoFullName}</code>.
</p>
</div>
</div>

<div className="flex flex-wrap items-center gap-2 pt-1 border-t border-emerald-500/20">
{publishResult.contentUrl && (
<a
href={publishResult.contentUrl}
target="_blank"
rel="noopener noreferrer"
className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
>
<span>View File on GitHub</span>
<ExternalLink className="w-3.5 h-3.5" />
</a>
)}
{publishResult.commitUrl && (
<a
href={publishResult.commitUrl}
target="_blank"
rel="noopener noreferrer"
className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
isLight ? 'bg-white border-emerald-300 hover:bg-emerald-100 text-emerald-800' : 'bg-emerald-900/50 border-emerald-700 text-emerald-200 hover:bg-emerald-900'
}`}
>
<span>View Commit</span>
<ExternalLink className="w-3.5 h-3.5" />
</a>
)}
</div>
</div>
)}

{publishError && (
<div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 space-y-1.5 animate-in shake duration-150">
<div className="font-bold flex items-center gap-2">
<AlertCircle className="w-4 h-4 shrink-0" />
<span>Publishing Failed</span>
</div>
<p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 pl-6">
{publishError}
</p>
</div>
)}
</ModalBody>

<ModalFooter isLight={isLight} className="justify-between">
<div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
<Sparkles className="w-3.5 h-3.5 text-indigo-400" />
<span>Generates clean static HTML for GitHub Pages & static hosting</span>
</div>

<div className="flex items-center gap-2.5">
<Button variant="secondary" onClick={onClose} isLight={isLight}>
Cancel
</Button>

<Button
variant="primary"
onClick={handlePublish}
disabled={isPublishing || !status?.hasToken}
isLoading={isPublishing}
loadingText="Committing to GitHub..."
isLight={isLight}
leftIcon={<FolderGit2 className="w-4 h-4" />}
>
Publish to GitHub
</Button>
</div>
</ModalFooter>
</Modal>
);
};
