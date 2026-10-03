import 'dotenv/config';

import express from 'express';
import path from 'path';
import fs from 'fs';
import os from 'os';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { v2 as cloudinary } from 'cloudinary';

const WORKSPACES_FILE = path.join(process.cwd(), 'workspaces.json');

function isIPOwnerEmail(email?: string): boolean {
if (!email) return false;
return email.trim().toLowerCase() === 'oliveajike@gmail.com';
}

function getUploadsDir(): string {
if (process.env.VERCEL || process.env.NOW_BUILDER || process.cwd().startsWith('/var/task')) {
const tmpDir = path.join(os.tmpdir(), 'uploads');
try {
if (!fs.existsSync(tmpDir)) {
fs.mkdirSync(tmpDir, { recursive: true });
}
} catch (_) {}
return tmpDir;
}

const localDir = path.join(process.cwd(), 'uploads');
try {
if (!fs.existsSync(localDir)) {
fs.mkdirSync(localDir, { recursive: true });
}
return localDir;
} catch (err) {
const tmpDir = path.join(os.tmpdir(), 'uploads');
try {
if (!fs.existsSync(tmpDir)) {
fs.mkdirSync(tmpDir, { recursive: true });
}
} catch (_) {}
return tmpDir;
}
}

function safeWriteFileSync(filePath: string, data: string | Buffer): void {
try {
fs.writeFileSync(filePath, data, typeof data === 'string' ? 'utf-8' : undefined);
} catch (err) {
console.warn(`Could not write to ${filePath} (read-only filesystem?), falling back to /tmp`);
try {
const fileName = path.basename(filePath);
const tmpPath = path.join(os.tmpdir(), fileName);
fs.writeFileSync(tmpPath, data, typeof data === 'string' ? 'utf-8' : undefined);
} catch (tmpErr) {
console.error('Failed to write to /tmp as well:', tmpErr);
}
}
}

function loadWorkspaces(): any[] {
const pathsToTry = [
WORKSPACES_FILE,
path.join(os.tmpdir(), path.basename(WORKSPACES_FILE)),
];
for (const filePath of pathsToTry) {
try {
if (fs.existsSync(filePath)) {
const content = fs.readFileSync(filePath, 'utf-8');
const parsed = JSON.parse(content);
if (parsed && Array.isArray(parsed.workspaces)) {
return parsed.workspaces;
}
}
} catch (err) {
console.warn(`Error reading ${filePath}:`, err);
}
}
return [
{
id: 'workspace-default',
name: 'Untitled Workspace',
slug: 'untitled-workspace',
description: 'Default workspace managed by IP Owner',
createdAt: '2026-01-01T00:00:00.000Z',
isDefault: true,
ownerEmail: 'oliveajike@gmail.com',
secretInheritance: {
inheritGithubAndEmail: false,
gmailUser: false,
gmailPassword: false,
githubBranch: false,
githubOwner: false,
githubToken: false,
},
secrets: {},
},
];
}

/**
* Resolves an environment variable key honoring:
* 1. Workspace-specific secret override (if workspaceId provided and secret is not inherited)
* 2. Default process.env canonical key
*/
function resolveWorkspaceEnv(canonicalKey: string, workspaceId?: string): string | undefined {
const clean = (val?: string) => (val ? val.replace(/^['"]+|['"]+$/g, '').trim() : '');

if (workspaceId) {
const workspaces = loadWorkspaces();
const ws = workspaces.find((w: any) => w.id === workspaceId);
if (ws) {
let isInherited = false;
if (ws.secretInheritance) {
if (ws.secretInheritance.inheritGithubAndEmail) {
isInherited = true;
} else {
if (canonicalKey === 'SMTP_USER' && ws.secretInheritance.gmailUser) isInherited = true;
if (canonicalKey === 'SMTP_PASS' && ws.secretInheritance.gmailPassword) isInherited = true;
if (canonicalKey === 'GITHUB_REPO_BRANCH' && ws.secretInheritance.githubBranch) isInherited = true;
if (canonicalKey === 'GITHUB_REPO_OWNER' && ws.secretInheritance.githubOwner) isInherited = true;
if (canonicalKey === 'GITHUB_TOKEN' && ws.secretInheritance.githubToken) isInherited = true;
}
}

if (!isInherited && ws.secrets && ws.secrets[canonicalKey]) {
return clean(ws.secrets[canonicalKey]);
}
}
}

return clean(process.env[canonicalKey]);
}

function getCloudinaryConfig(workspaceId?: string) {
const cloud_name = resolveWorkspaceEnv('VITE_CLOUDINARY_CLOUD_NAME', workspaceId) || process.env.VITE_CLOUDINARY_CLOUD_NAME;
const api_key = resolveWorkspaceEnv('CLOUDINARY_API_KEY', workspaceId) || process.env.CLOUDINARY_API_KEY;
const api_secret = resolveWorkspaceEnv('CLOUDINARY_API_SECRET', workspaceId) || process.env.CLOUDINARY_API_SECRET;

const isPlaceholder = (val?: string) => !val || val.includes('your_') || val.includes('placeholder') || val.includes('xxxx') || val.trim() === '';

const isConfigured = Boolean(cloud_name && api_key && api_secret && !isPlaceholder(cloud_name) && !isPlaceholder(api_key) && !isPlaceholder(api_secret));

if (isConfigured) {
try {
cloudinary.config({
cloud_name,
api_key,
api_secret,
secure: true,
});
} catch (_) {}
}

return {
isConfigured,
cloud_name: isConfigured && cloud_name ? cloud_name : '',
apiKeyMasked: isConfigured && api_key ? `${api_key.substring(0, 4)}••••${api_key.substring(Math.max(0, api_key.length - 3))}` : '',
};
}

function sanitizeInputString(str: string): string {
if (!str) return '';
return str.replace(/<[^>]*>?/gm, '').replace(/javascript:/gi, '').trim();
}

async function startServer() {
const app = express();
const PORT = 3000;

const uploadsDir = getUploadsDir();

app.use((req, res, next) => {
res.setHeader('X-Content-Type-Options', 'nosniff');
res.setHeader('X-XSS-Protection', '1; mode=block');
res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
res.setHeader(
'Content-Security-Policy',
"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https: wss:; frame-src 'self' https:; object-src 'none'; base-uri 'self';"
);
next();
});

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

setInterval(() => {
const now = Date.now();
for (const [key, entry] of rateLimitMap.entries()) {
if (now > entry.resetTime) {
rateLimitMap.delete(key);
}
}
}, 300000);

const rateLimit = (limit: number = 30, windowMs: number = 60000) => {
return (req: express.Request, res: express.Response, next: express.NextFunction) => {
const ip = req.ip || req.socket.remoteAddress || 'anonymous';
const key = `${req.path}:${ip}`;
const now = Date.now();
const entry = rateLimitMap.get(key);

if (!entry || now > entry.resetTime) {
rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
return next();
}

if (entry.count >= limit) {
return res.status(429).json({
error: 'Rate limit exceeded. Please wait a moment before trying again.',
});
}

entry.count += 1;
next();
};
};

app.use(express.json({ limit: '25mb' }));

app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (req, res) => {
res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==========================================
// IP OWNER ROOT ARCHITECTURE ENDPOINTS
// Strictly reserved for oliveajike@gmail.com
// ==========================================

// 1. Get all workspaces
app.get('/api/ip-owner/workspaces', (req, res) => {
try {
const workspaces = loadWorkspaces();
res.json({ workspaces });
} catch (err: any) {
res.status(500).json({ error: err.message || 'Failed to load workspaces' });
}
});

// 4. Create or update workspace (IP Owner only)
app.post('/api/ip-owner/workspaces', (req, res) => {
try {
const { callerEmail, workspace } = req.body;
if (!isIPOwnerEmail(callerEmail)) {
return res.status(403).json({
error: 'Forbidden: Only the Intellectual Property Owner can provision or modify workspaces.',
});
}

if (!workspace || typeof workspace !== 'object') {
return res.status(400).json({ error: 'Valid workspace object is required.' });
}

// Auto-generate ID if missing
if (!workspace.id || typeof workspace.id !== 'string') {
workspace.id = `ws_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
}

// Default name to "Untitled Workspace" if empty
if (!workspace.name || typeof workspace.name !== 'string' || !workspace.name.trim()) {
workspace.name = 'Untitled Workspace';
}

const workspaces = loadWorkspaces();
// Workspaces are distinguished strictly by unique id, independent of names/renames
const existingIdx = workspaces.findIndex((w: any) => w.id === workspace.id);

if (existingIdx >= 0) {
workspaces[existingIdx] = { ...workspaces[existingIdx], ...workspace };
} else {
workspaces.push(workspace);
}

safeWriteFileSync(WORKSPACES_FILE, JSON.stringify({ workspaces }, null, 2));
res.json({ success: true, workspace });
} catch (err: any) {
res.status(500).json({ error: err.message || 'Failed to save workspace' });
}
});

// 5. Delete workspace (IP Owner only, default protected)
app.post('/api/ip-owner/workspaces/delete', (req, res) => {
try {
const { callerEmail, workspaceId } = req.body;
if (!isIPOwnerEmail(callerEmail)) {
return res.status(403).json({
error: 'Forbidden: Only the Intellectual Property Owner can delete workspaces.',
});
}

const workspaces = loadWorkspaces();
const target = workspaces.find((w: any) => w.id === workspaceId);
if (!target) {
return res.status(404).json({ error: 'Workspace not found.' });
}

if (target.isDefault) {
return res.status(400).json({ error: 'Cannot delete the primary default workspace.' });
}

const filtered = workspaces.filter((w: any) => w.id !== workspaceId);
safeWriteFileSync(WORKSPACES_FILE, JSON.stringify({ workspaces: filtered }, null, 2));
res.json({ success: true });
} catch (err: any) {
res.status(500).json({ error: err.message || 'Failed to delete workspace' });
}
});

// 6. Update workspace secrets & inheritance (IP Owner only)
app.post('/api/ip-owner/workspaces/secrets', (req, res) => {
try {
const { callerEmail, workspaceId, secrets, secretInheritance } = req.body;
if (!isIPOwnerEmail(callerEmail)) {
return res.status(403).json({
error: 'Forbidden: Only the Intellectual Property Owner can configure workspace secrets.',
});
}

const workspaces = loadWorkspaces();
const ws = workspaces.find((w: any) => w.id === workspaceId);
if (!ws) {
return res.status(404).json({ error: 'Workspace not found.' });
}

if (secrets !== undefined) {
ws.secrets = { ...(ws.secrets || {}), ...secrets };
}
if (secretInheritance !== undefined) {
ws.secretInheritance = { ...(ws.secretInheritance || {}), ...secretInheritance };
}

safeWriteFileSync(WORKSPACES_FILE, JSON.stringify({ workspaces }, null, 2));
res.json({ success: true, workspace: ws });
} catch (err: any) {
res.status(500).json({ error: err.message || 'Failed to update workspace secrets' });
}
});

app.get('/api/proxy-image', async (req, res) => {
try {
const imageUrl = req.query.url as string;
if (!imageUrl || (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://'))) {
return res.status(400).json({ error: 'Valid HTTP/HTTPS image URL is required.' });
}

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 10000);

const response = await fetch(imageUrl, {
signal: controller.signal,
headers: {
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
},
});
clearTimeout(timeout);

if (!response.ok) {
return res.status(response.status).json({ error: 'Failed to fetch image from remote host.' });
}

const contentType = response.headers.get('content-type') || 'image/jpeg';
const arrayBuffer = await response.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);

res.setHeader('Content-Type', contentType);
res.setHeader('Cache-Control', 'public, max-age=86400');
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
return res.send(buffer);
} catch (err: any) {
console.warn('Image proxy error:', err);
return res.status(500).json({ error: 'Unable to proxy remote image.' });
}
});

app.post('/api/submit-form', async (req, res) => {
try {
const body = req.body || {};
const { formId, pageTitle, formType, name, email, phone, message, ...customFields } = body;

if (body._hp || body._gotcha || body.honeypot || body.website_url) {
return res.status(400).json({
success: false,
error: 'Spam submission detected and blocked.',
});
}

const leadName = sanitizeInputString(name || body.full_name || body.fullName || body.leadName || '');
const leadEmail = sanitizeInputString(email || body.leadEmail || '');
const leadPhone = sanitizeInputString(phone || body.leadPhone || '');
const leadMessage = sanitizeInputString(message || body.leadMessage || body.comments || body.description || '');

const sanitizedCustomFields: Record<string, string> = {};
for (const [key, val] of Object.entries(customFields)) {
if (typeof val === 'string') {
sanitizedCustomFields[key] = sanitizeInputString(val);
} else if (val != null) {
sanitizedCustomFields[key] = String(val);
}
}

const hasAnyContent = leadName || leadEmail || leadPhone || leadMessage || Object.keys(customFields).length > 0;
if (!hasAnyContent) {
return res.status(422).json({
success: false,
error: 'Form is empty. Please enter your contact details and message.',
});
}

if (leadEmail) {
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(leadEmail) || leadEmail.length > 254) {
return res.status(422).json({
success: false,
error: 'Please enter a valid email address (e.g. name@example.com).',
});
}
}

if (leadName.length > 150) {
return res.status(422).json({
success: false,
error: 'Name exceeds maximum length of 150 characters.',
});
}

if (leadPhone.length > 40) {
return res.status(422).json({
success: false,
error: 'Phone number exceeds maximum length of 40 characters.',
});
}

if (leadMessage.length > 10000) {
return res.status(422).json({
success: false,
error: 'Message exceeds maximum length of 10,000 characters.',
});
}

let savedToFirebase = false;
let submissionId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
let dbError: string | null = null;

try {
const formsProjectId = process.env.FORMS_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
const formsClientEmail = process.env.FORMS_FIREBASE_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL;
const formsPrivateKey = process.env.FORMS_FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY;

if (formsProjectId && formsClientEmail && formsPrivateKey) {
const adminModule = await import('firebase-admin');
const admin: any = adminModule.default || adminModule;
let adminDb: any = null;
const appName = `forms-app-${formsProjectId}`;
const existingApp = admin.apps.find((a: any) => a?.name === appName);

if (existingApp) {
adminDb = existingApp.firestore();
} else {
const appConfig: any = {
credential: admin.credential.cert({
projectId: formsProjectId,
clientEmail: formsClientEmail,
privateKey: formsPrivateKey.replace(/\\n/g, '\n'),
}),
};
if (process.env.FORMS_FIREBASE_DATABASE_URL || process.env.FIREBASE_DATABASE_URL) {
appConfig.databaseURL = process.env.FORMS_FIREBASE_DATABASE_URL || process.env.FIREBASE_DATABASE_URL;
}
const customApp = admin.initializeApp(appConfig, appName);
adminDb = customApp.firestore();
}

if (adminDb) {
const payload = {
formId: formId || 'contact_form',
pageTitle: pageTitle || 'Website Form',
sourcePage: pageTitle || 'Website Form',
formType: formType || 'Inquiry',
name: leadName || 'Website Visitor',
email: leadEmail,
phone: leadPhone,
message: leadMessage,
status: 'new',
customFields: customFields || {},
data: { name: leadName, email: leadEmail, phone: leadPhone, message: leadMessage, ...customFields },
createdAt: new Date().toISOString(),
submittedAt: new Date().toISOString(),
source: 'express_server_api',
};

const docRef = await adminDb.collection('submissions').add({
...payload,
createdAt: admin.firestore.FieldValue.serverTimestamp(),
});
submissionId = docRef.id;
savedToFirebase = true;

try {
await adminDb.collection('leads').add({
...payload,
createdAt: admin.firestore.FieldValue.serverTimestamp(),
});
await adminDb.collection('users').doc('guest').collection('leads').add({
...payload,
createdAt: admin.firestore.FieldValue.serverTimestamp(),
});
} catch (_) {}
}
} else {
const fbApiKey = process.env.VITE_FORMS_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY;
const fbProjectId = process.env.VITE_FORMS_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
const fbAuthDomain = process.env.VITE_FORMS_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN;
const fbStorageBucket = process.env.VITE_FORMS_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET;
const fbAppId = process.env.VITE_FORMS_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID;

if (fbApiKey && fbProjectId) {
const fbConfig = {
apiKey: fbApiKey,
projectId: fbProjectId,
authDomain: fbAuthDomain || `${fbProjectId}.firebaseapp.com`,
storageBucket: fbStorageBucket || `${fbProjectId}.appspot.com`,
appId: fbAppId || '',
};

const { initializeApp, getApps, getApp } = await import('firebase/app');
const { getFirestore, collection, addDoc } = await import('firebase/firestore');

const fbApp = getApps().length === 0 ? initializeApp(fbConfig) : getApp();
const db = getFirestore(fbApp);

const payload = {
formId: formId || 'contact_form',
pageTitle: pageTitle || 'Website Form',
sourcePage: pageTitle || 'Website Form',
formType: formType || 'Inquiry',
name: leadName || 'Website Visitor',
email: leadEmail,
phone: leadPhone,
message: leadMessage,
status: 'new',
customFields: customFields || {},
data: { name: leadName, email: leadEmail, phone: leadPhone, message: leadMessage, ...customFields },
createdAt: new Date().toISOString(),
submittedAt: new Date().toISOString(),
source: 'express_server_api',
};

const docRef = await addDoc(collection(db, 'submissions'), payload);
submissionId = docRef.id;

try {
await addDoc(collection(db, 'leads'), payload);
await addDoc(collection(db, 'users', 'guest', 'leads'), payload);
} catch (_) {}

savedToFirebase = true;
}
}
} catch (fbErr: any) {
dbError = fbErr?.message || 'Database write error';
console.warn('Could not store form submission in Firebase:', fbErr);
}

if (!savedToFirebase) {
return res.status(503).json({
success: false,
error: dbError || 'Unable to store your submission in the database. Please verify Firebase Admin credentials or try again later.',
});
}

try {
const {
formNotificationGmailEnabled,
formNotificationGmailEmail,
formNotificationTelegramEnabled,
formNotificationTelegramBotToken,
formNotificationTelegramChatId
} = body;

const notificationContent = `
New Form Submission: ${pageTitle || 'Website Form'}
-----------------------------------------
Name: ${leadName || 'Website Visitor'}
Email: ${leadEmail || 'N/A'}
Phone: ${leadPhone || 'N/A'}
Message: ${leadMessage || 'N/A'}
${Object.entries(customFields).length > 0 ? '\nCustom Fields:\n' + Object.entries(customFields).map(([k, v]) => `${k}: ${v}`).join('\n') : ''}
-----------------------------------------
Submitted at: ${new Date().toLocaleString()}
`;

if (formNotificationGmailEnabled) {
const workspaceId = body.workspaceId;
const smtpHost = resolveWorkspaceEnv('SMTP_HOST', workspaceId) || process.env.SMTP_HOST || '';
const rawPort = resolveWorkspaceEnv('SMTP_PORT', workspaceId) || process.env.SMTP_PORT || '';
const smtpPort = rawPort ? Number(rawPort) : undefined;
const smtpUser = resolveWorkspaceEnv('SMTP_USER', workspaceId) || process.env.SMTP_USER;
const smtpPass = resolveWorkspaceEnv('SMTP_PASS', workspaceId) || process.env.SMTP_PASS;

if (smtpUser && smtpPass) {
const transporter = nodemailer.createTransport({
...(smtpHost ? { host: smtpHost } : {}),
...(smtpPort ? { port: smtpPort, secure: smtpPort === 465 } : {}),
auth: {
user: smtpUser,
pass: smtpPass,
},
});

await transporter.sendMail({
from: `"Website Form" <${smtpUser}>`,
to: smtpUser,
subject: `New Submission: ${pageTitle || 'Website Form'}`,
text: notificationContent,
});
} else {
console.warn('Gmail notification enabled but GMAIL_USER / GMAIL_APP_PASSWORD not set in environment.');
}
}

if (formNotificationTelegramEnabled) {
const tgToken = process.env.TELEGRAM_BOT_TOKEN;
const tgChatId = process.env.TELEGRAM_CHAT_ID;

if (tgToken && tgChatId) {
const telegramUrl = `https://api.telegram.org/bot${tgToken}/sendMessage`;
await fetch(telegramUrl, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
chat_id: tgChatId,
text: notificationContent,
}),
});
} else {
console.warn('Telegram notification enabled but TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set in environment.');
}
}
} catch (notifErr) {
console.warn('Notification error (ignoring to prevent form failure):', notifErr);
}

return res.json({
success: true,
message: 'Thank you! Your message has been sent successfully.',
submissionId,
timestamp: new Date().toISOString(),
});
} catch (err: any) {
console.error('Error handling form submission:', err);
return res.status(500).json({
success: false,
error: err.message || 'Failed to submit form',
});
}
});

app.get('/api/github/status', (req, res) => {
const workspaceId = (req.query.workspaceId as string) || undefined;
const token = resolveWorkspaceEnv('GITHUB_TOKEN', workspaceId)?.trim();
const owner = resolveWorkspaceEnv('GITHUB_REPO_OWNER', workspaceId)?.trim() || '';
const repo = resolveWorkspaceEnv('GITHUB_REPO_NAME', workspaceId)?.trim() || '';
const branch = resolveWorkspaceEnv('GITHUB_REPO_BRANCH', workspaceId)?.trim() || process.env.GITHUB_REPO_BRANCH || '';

res.json({
configured: Boolean(token && token.length > 8),
hasToken: Boolean(token && token.length > 8),
owner,
repo,
branch,
});
});

app.post('/api/github/verify-repo', async (req, res) => {
try {
const workspaceId = req.body.workspaceId;
const token = (req.body.token || resolveWorkspaceEnv('GITHUB_TOKEN', workspaceId))?.trim();
if (!token) {
return res.status(400).json({
error: 'GITHUB_TOKEN is not configured. Please add GITHUB_TOKEN to your workspace Settings -> Secrets.',
});
}

const owner = (req.body.owner || resolveWorkspaceEnv('GITHUB_REPO_OWNER', workspaceId) || '').trim();
const repo = (req.body.repo || resolveWorkspaceEnv('GITHUB_REPO_NAME', workspaceId) || '').trim();

if (!owner || !repo) {
return res.status(400).json({
error: 'Please provide both repository owner and repository name.',
});
}

const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
headers: {
Authorization: `Bearer ${token}`,
Accept: 'application/vnd.github+json',
'X-GitHub-Api-Version': '2022-11-28',
'User-Agent': 'Remix-Website-Builder',
},
});

if (!repoRes.ok) {
const errorData = await repoRes.json().catch(() => ({}));
if (repoRes.status === 401) {
return res.status(401).json({
error: 'GitHub Token unauthorized. Please verify that your token is valid and active.',
});
}
if (repoRes.status === 404) {
return res.status(404).json({
error: `Repository '${owner}/${repo}' not found or token lacks access permissions.`,
});
}
return res.status(repoRes.status).json({
error: errorData.message || `GitHub error (HTTP ${repoRes.status})`,
});
}

const repoData = await repoRes.json();
return res.json({
exists: true,
fullName: repoData.full_name,
defaultBranch: repoData.default_branch,
isPrivate: repoData.private,
description: repoData.description || '',
htmlUrl: repoData.html_url,
hasPages: Boolean(repoData.has_pages),
});
} catch (err: any) {
console.error('Error verifying GitHub repo:', err);
return res.status(500).json({ error: err.message || 'Failed to verify repository' });
}
});

app.post('/api/github/publish', async (req, res) => {
try {
const workspaceId = req.body.workspaceId;
const token = (req.body.githubToken || resolveWorkspaceEnv('GITHUB_TOKEN', workspaceId))?.trim();
if (!token) {
return res.status(400).json({
error: 'GitHub token is not configured. Please add GITHUB_TOKEN to your workspace Settings -> Secrets to enable automatic publishing.',
});
}

let owner = (req.body.repoOwner || resolveWorkspaceEnv('GITHUB_REPO_OWNER', workspaceId) || '').trim();
let repo = (req.body.repoName || resolveWorkspaceEnv('GITHUB_REPO_NAME', workspaceId) || '').trim();
let branch = (req.body.branch || resolveWorkspaceEnv('GITHUB_REPO_BRANCH', workspaceId) || '').trim();
const content = req.body.content;
let targetPath = (req.body.filePath || 'index.html').trim().replace(/^\/+/, '');

if (!owner) {
try {
const userRes = await fetch('https://api.github.com/user', {
headers: {
Authorization: `Bearer ${token}`,
Accept: 'application/vnd.github+json',
'X-GitHub-Api-Version': '2022-11-28',
'User-Agent': 'Remix-Website-Builder',
},
});
if (userRes.ok) {
const userData = await userRes.json();
owner = userData.login;
}
} catch (uErr) {
console.warn('Could not auto-fetch GitHub user profile:', uErr);
}
}

if (!owner) {
return res.status(400).json({
error: 'GitHub repository owner could not be detected. Please set GITHUB_REPO_OWNER in Settings -> Secrets.',
});
}

if (!repo) {
repo = 'website';
}

const checkRepoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
headers: {
Authorization: `Bearer ${token}`,
Accept: 'application/vnd.github+json',
'X-GitHub-Api-Version': '2022-11-28',
'User-Agent': 'Remix-Website-Builder',
},
});

if (checkRepoRes.status === 404) {
try {
const createRepoRes = await fetch('https://api.github.com/user/repos', {
method: 'POST',
headers: {
Authorization: `Bearer ${token}`,
Accept: 'application/vnd.github+json',
'Content-Type': 'application/json',
'X-GitHub-Api-Version': '2022-11-28',
'User-Agent': 'Remix-Website-Builder',
},
body: JSON.stringify({
name: repo,
description: 'Created with Website Builder',
auto_init: true,
private: false,
}),
});
if (createRepoRes.ok) {
const createdData = await createRepoRes.json();
branch = branch || createdData.default_branch || 'main';
await new Promise((r) => setTimeout(r, 1200));
}
} catch (createErr) {
console.warn('Could not auto-create repository:', createErr);
}
} else if (checkRepoRes.ok && !branch) {
const existingRepo = await checkRepoRes.json();
branch = existingRepo.default_branch || 'main';
}

if (!branch) {
branch = 'main';
}

if (!content || typeof content !== 'string') {
return res.status(400).json({
error: 'Page HTML content is empty or invalid.',
});
}

if (!targetPath.endsWith('.html') && !targetPath.includes('.')) {
targetPath = `${targetPath}.html`;
}

const commitMessage = (
req.body.commitMessage ||
`Publish ${targetPath} via Website Builder [${new Date().toISOString().split('T')[0]}]`
).trim();

const getFileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(targetPath).replace(/%2F/g, '/')}?ref=${encodeURIComponent(branch)}`;
let existingSha: string | undefined = undefined;

const checkFileRes = await fetch(getFileUrl, {
headers: {
Authorization: `Bearer ${token}`,
Accept: 'application/vnd.github+json',
'X-GitHub-Api-Version': '2022-11-28',
'User-Agent': 'Remix-Website-Builder',
},
});

if (checkFileRes.ok) {
const fileInfo = await checkFileRes.json();
existingSha = fileInfo.sha;
} else if (checkFileRes.status === 401) {
return res.status(401).json({
error: 'Your GitHub access token was rejected or expired. Please verify your access token in settings and try again.',
});
}

const base64Content = Buffer.from(content, 'utf-8').toString('base64');
const putPayload: Record<string, any> = {
message: commitMessage,
content: base64Content,
branch,
};

if (existingSha) {
putPayload.sha = existingSha;
}

const putFileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(targetPath).replace(/%2F/g, '/')}`;
const putRes = await fetch(putFileUrl, {
method: 'PUT',
headers: {
Authorization: `Bearer ${token}`,
Accept: 'application/vnd.github+json',
'Content-Type': 'application/json',
'X-GitHub-Api-Version': '2022-11-28',
'User-Agent': 'Remix-Website-Builder',
},
body: JSON.stringify(putPayload),
});

const putData = await putRes.json();

if (!putRes.ok) {
let helpfulMessage = 'Unable to publish page to GitHub right now. Please check your network connection and try again.';
if (putRes.status === 404) {
helpfulMessage = `The repository '${owner}/${repo}' or branch '${branch}' could not be found. Please verify your repository name and permissions in settings.`;
} else if (putRes.status === 409) {
helpfulMessage = `The file '${targetPath}' was recently updated on GitHub by another team member or device. Please refresh and try publishing again to make sure you're saving over the latest version.`;
} else if (putRes.status === 401 || putRes.status === 403) {
helpfulMessage = `Publishing permission was denied by GitHub. Please check that your access token has permission to write to '${owner}/${repo}'.`;
}
return res.status(putRes.status).json({
error: helpfulMessage,
details: putData,
});
}

let previousFilePath = (req.body.previousFilePath || '').trim().replace(/^\/+/, '');
if (previousFilePath && previousFilePath !== targetPath) {
try {
const getPrevUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(previousFilePath).replace(/%2F/g, '/')}?ref=${encodeURIComponent(branch)}`;
const checkPrevRes = await fetch(getPrevUrl, {
headers: {
Authorization: `Bearer ${token}`,
Accept: 'application/vnd.github+json',
'X-GitHub-Api-Version': '2022-11-28',
'User-Agent': 'Remix-Website-Builder',
},
});
if (checkPrevRes.ok) {
const prevFileInfo = await checkPrevRes.json();
if (prevFileInfo.sha) {
const deleteUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(previousFilePath).replace(/%2F/g, '/')}`;
await fetch(deleteUrl, {
method: 'DELETE',
headers: {
Authorization: `Bearer ${token}`,
Accept: 'application/vnd.github+json',
'Content-Type': 'application/json',
'X-GitHub-Api-Version': '2022-11-28',
'User-Agent': 'Remix-Website-Builder',
},
body: JSON.stringify({
message: `Rename ${previousFilePath} to ${targetPath}`,
sha: prevFileInfo.sha,
branch,
}),
});
}
}
} catch (renameErr) {
console.warn('Could not remove previous file during GitHub rename:', renameErr);
}
}

try {
const formFields: string[] = req.body.formFields || ['name', 'email', 'phone', 'message'];

const extractionLogic = formFields
.map(f => `    const ${f} = (body.${f} || '').toString().trim();`)
.join('\n');

const validationLogic = formFields
.includes('email')
? `    if (body.email) {\n      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n      if (!emailRegex.test(body.email.toString()) || body.email.toString().length > 254) {\n        return res.status(422).json({ success: false, error: 'Please enter a valid email address.' });\n      }\n    }`
: '';

const dataPayload = formFields
.map(f => `${f}`)
.join(', ');

const localApiHandlerContent = `const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

let db = null;

function initializeFirebase() {
if (db) return db;
if (!admin.apps.length) {
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;
const databaseURL = process.env.FIREBASE_DATABASE_URL;

if (projectId && clientEmail && privateKey) {
try {
const appConfig = {
credential: admin.credential.cert({
projectId: projectId,
clientEmail: clientEmail,
privateKey: privateKey.replace(/\\\\n/g, '\\n'),
}),
};
if (databaseURL) appConfig.databaseURL = databaseURL;
admin.initializeApp(appConfig);
db = admin.firestore();
} catch (err) {
console.error('Firebase Admin init error:', err);
}
}
} else {
db = admin.firestore();
}
return db;
}

async function storeSubmission(payload) {
const firestore = initializeFirebase();
if (!firestore) {
throw new Error('Database service not configured. Please check environment variables.');
}

const docRef = await firestore.collection('submissions').add({
...payload,
createdAt: admin.firestore.FieldValue.serverTimestamp(),
});

try {
const leadPayload = { ...payload, createdAt: admin.firestore.FieldValue.serverTimestamp() };
await firestore.collection('leads').add(leadPayload);
await firestore.collection('contactSubmissions').add(leadPayload);
} catch (_) {}

return docRef.id;
}

async function handler(req, res) {
res.setHeader('Access-Control-Allow-Credentials', 'true');
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

if (req.method === 'OPTIONS') return res.status(200).end();
if (req.method !== 'POST') {
return res.status(405).json({ success: false, error: 'Method not allowed.' });
}

try {
const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

if (body._hp || body._gotcha || body.honeypot || body.website_url) {
return res.status(400).json({ success: false, error: 'Spam submission blocked.' });
}

${extractionLogic}

${validationLogic}

const hasAnyContent = ${formFields.map(f => `${f}`).join(' || ')} || Object.keys(body).length > 2;
if (!hasAnyContent) {
return res.status(422).json({ success: false, error: 'Form is empty.' });
}

const submissionId = await storeSubmission({
formId: body.formId || 'contact_form',
pageTitle: body.pageTitle || 'Published Website',
sourcePage: body.pageTitle || 'Published Website',
status: 'new',
data: { ${dataPayload} },
submittedAt: new Date().toISOString(),
source: 'vercel_serverless_api',
});

try {
const {
formNotificationGmailEnabled,
formNotificationGmailEmail,
formNotificationTelegramEnabled,
formNotificationTelegramBotToken,
formNotificationTelegramChatId
} = body;

const notificationContent = \`
New Form Submission: \${body.pageTitle || 'Website Form'}
-----------------------------------------
\${Object.entries({ ${dataPayload} }).map(([k, v]) => \`\${k}: \${v}\`).join('\\n')}
-----------------------------------------
Submitted at: \${new Date().toLocaleString()}
\`;

if (formNotificationGmailEnabled) {
const smtpHost = process.env.SMTP_HOST || '';
const rawPort = process.env.SMTP_PORT || '';
const smtpPort = rawPort ? Number(rawPort) : undefined;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

if (smtpUser && smtpPass) {
const transporter = nodemailer.createTransport({
...(smtpHost ? { host: smtpHost } : {}),
...(smtpPort ? { port: smtpPort, secure: smtpPort === 465 } : {}),
auth: { user: smtpUser, pass: smtpPass },
});

await transporter.sendMail({
from: \`"Website Form" <\${smtpUser}>\`,
to: smtpUser,
subject: \`New Submission: \${body.pageTitle || 'Website Form'}\`,
text: notificationContent,
});
}
}

if (formNotificationTelegramEnabled) {
const tgToken = process.env.TELEGRAM_BOT_TOKEN;
const tgChatId = process.env.TELEGRAM_CHAT_ID;

if (tgToken && tgChatId) {
await fetch(\`https://api.telegram.org/bot\${tgToken}/sendMessage\`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
chat_id: tgChatId,
text: notificationContent,
}),
});
}
}
} catch (notifErr) {
console.warn('Notification error:', notifErr);
}

return res.status(200).json({
success: true,
message: 'Thank you! Your message has been sent successfully.',
submissionId,
timestamp: new Date().toISOString(),
});
} catch (err) {
console.error('Submit form error:', err);
return res.status(err.message.includes('configured') ? 503 : 500).json({
success: false,
error: err.message || 'Error processing form submission.'
});
}
}

module.exports = handler;
module.exports.default = handler;
`;

const rawSiteName = req.body.siteName || req.body.repoName || repo || 'my-website';
const cleanPkgName = String(rawSiteName)
.toLowerCase()
.replace(/[^a-z0-9_-]/g, '-')
.replace(/-+/g, '-')
.replace(/^-|-$/g, '') || 'my-website';

const siteDesc = (
req.body.siteDescription ||
(req.body.pageTitle ? `${req.body.pageTitle} - Website` : undefined) ||
(repo ? `${repo} - Website` : 'Website project')
).trim();

const packageJsonContent = JSON.stringify({
name: cleanPkgName,
version: "1.0.0",
description: siteDesc,
private: true,
scripts: {
"dev": "vercel dev",
"deploy": "vercel --prod"
},
dependencies: {
"firebase-admin": "^12.0.0",
"nodemailer": "^6.9.0"
},
engines: {
"node": "20.x"
}
}, null, 2);

const localVercelJsonPath = fs.existsSync(path.join(process.cwd(), 'vercel.website.json'))
? path.join(process.cwd(), 'vercel.website.json')
: path.join(process.cwd(), 'vercel.json');
const vercelJsonContent = fs.existsSync(localVercelJsonPath)
? fs.readFileSync(localVercelJsonPath, 'utf8')
: JSON.stringify({
functions: {
"api/*.js": {
memory: 256,
maxDuration: 10
}
}
}, null, 2);

const syncFiles = [
{ path: 'api/submit-form.js', content: localApiHandlerContent, msg: 'Add Vercel form submission API handler' },
{ path: 'package.json', content: packageJsonContent, msg: 'Update package.json configuration for website' },
{ path: 'vercel.json', content: vercelJsonContent, msg: 'Update vercel.json configuration' }
];

if (typeof req.body.robotsTxt === 'string' && req.body.robotsTxt.trim()) {
syncFiles.push({ path: 'robots.txt', content: req.body.robotsTxt, msg: 'Update robots.txt' });
}
if (req.body.pushSitemap && typeof req.body.sitemapXml === 'string' && req.body.sitemapXml.trim()) {
syncFiles.push({ path: 'sitemap.xml', content: req.body.sitemapXml, msg: 'Update sitemap.xml' });
}

for (const fileItem of syncFiles) {
const checkUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(fileItem.path).replace(/%2F/g, '/')}?ref=${encodeURIComponent(branch)}`;
const checkRes = await fetch(checkUrl, {
headers: {
Authorization: `Bearer ${token}`,
Accept: 'application/vnd.github+json',
'X-GitHub-Api-Version': '2022-11-28',
'User-Agent': 'Remix-Website-Builder',
},
});

let fileSha: string | undefined = undefined;
let existingTextContent = '';

if (checkRes.ok) {
const info = await checkRes.json();
fileSha = info.sha;
if (info.content) {
try {
existingTextContent = Buffer.from(info.content, 'base64').toString('utf-8');
} catch (_) {}
}
}

let shouldUpload = false;
let contentToUpload = fileItem.content;

if (!checkRes.ok) {

shouldUpload = true;
} else if (fileItem.path === 'package.json') {

try {
const existingPkg = JSON.parse(existingTextContent || '{}');
const targetPkg = JSON.parse(contentToUpload);
const isDifferent =
existingPkg.name !== targetPkg.name ||
existingPkg.description !== targetPkg.description ||
!existingPkg.dependencies?.['firebase-admin'] ||
existingPkg.engines?.node !== targetPkg.engines?.node;
if (isDifferent) {
const mergedPkg = {
...existingPkg,
name: targetPkg.name,
version: targetPkg.version || '1.0.0',
description: targetPkg.description,
private: true,
scripts: {
...(existingPkg.scripts || {}),
...targetPkg.scripts,
},
dependencies: {
...(existingPkg.dependencies || {}),
...targetPkg.dependencies,
},
engines: {
...(existingPkg.engines || {}),
...targetPkg.engines,
},
};
contentToUpload = JSON.stringify(mergedPkg, null, 2);
shouldUpload = true;
}
} catch (_) {
shouldUpload = true;
}
} else if (fileItem.path === 'api/submit-form.js' || fileItem.path === 'vercel.json') {

if (existingTextContent.trim() !== contentToUpload.trim()) {
shouldUpload = true;
}
}

if (shouldUpload) {
const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(fileItem.path).replace(/%2F/g, '/')}`;
await fetch(putUrl, {
method: 'PUT',
headers: {
Authorization: `Bearer ${token}`,
Accept: 'application/vnd.github+json',
'Content-Type': 'application/json',
'X-GitHub-Api-Version': '2022-11-28',
'User-Agent': 'Remix-Website-Builder',
},
body: JSON.stringify({
message: fileItem.msg,
content: Buffer.from(contentToUpload, 'utf-8').toString('base64'),
branch,
...(fileSha ? { sha: fileSha } : {}),
}),
});
}
}

try {
const envCheckUrl = `https://api.github.com/repos/${owner}/${repo}/contents/.env.example?ref=${encodeURIComponent(branch)}`;
const envCheckRes = await fetch(envCheckUrl, {
headers: {
Authorization: `Bearer ${token}`,
Accept: 'application/vnd.github+json',
'X-GitHub-Api-Version': '2022-11-28',
'User-Agent': 'Remix-Website-Builder',
},
});
if (envCheckRes.ok) {
const envInfo = await envCheckRes.json();
if (envInfo.sha) {
await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/.env.example`, {
method: 'DELETE',
headers: {
Authorization: `Bearer ${token}`,
Accept: 'application/vnd.github+json',
'Content-Type': 'application/json',
'X-GitHub-Api-Version': '2022-11-28',
'User-Agent': 'Remix-Website-Builder',
},
body: JSON.stringify({
message: 'Remove .env.example from website repository',
sha: envInfo.sha,
branch,
}),
});
console.log(`Deleted .env.example from repository ${owner}/${repo}`);
}
}
} catch (delEnvErr) {
console.warn('Could not remove .env.example from website repo:', delEnvErr);
}
} catch (syncErr) {
console.warn('Could not auto-sync API form handler files to target GitHub repository:', syncErr);
}

return res.json({
success: true,
filePath: targetPath,
commitSha: putData.commit?.sha,
commitUrl: putData.commit?.html_url,
contentUrl: putData.content?.html_url,
downloadUrl: putData.content?.download_url,
repoFullName: `${owner}/${repo}`,
branch,
updated: Boolean(existingSha),
});
} catch (err: any) {
console.error('Error publishing to GitHub:', err);
return res.status(500).json({
error: err.message || 'Internal server error while publishing to GitHub',
});
}
});

app.post('/api/github/sync-seo', async (req, res) => {
try {
const workspaceId = req.body.workspaceId;
const token = (req.body.githubToken || resolveWorkspaceEnv('GITHUB_TOKEN', workspaceId))?.trim();
if (!token) {
return res.status(400).json({
error: 'GitHub token is not configured. Please add GITHUB_TOKEN to your workspace Settings -> Secrets to enable automatic publishing.',
});
}

let owner = (req.body.repoOwner || resolveWorkspaceEnv('GITHUB_REPO_OWNER', workspaceId) || '').trim();
let repo = (req.body.repoName || resolveWorkspaceEnv('GITHUB_REPO_NAME', workspaceId) || '').trim();
let branch = (req.body.branch || resolveWorkspaceEnv('GITHUB_REPO_BRANCH', workspaceId) || process.env.GITHUB_REPO_BRANCH || '').trim();
const robotsTxt = req.body.robotsTxt;
const sitemapXml = req.body.sitemapXml;
const pushSitemap = Boolean(req.body.pushSitemap);

if (!owner) {
try {
const userRes = await fetch('https://api.github.com/user', {
headers: {
Authorization: `Bearer ${token}`,
Accept: 'application/vnd.github+json',
'X-GitHub-Api-Version': '2022-11-28',
'User-Agent': 'Remix-Website-Builder',
},
});
if (userRes.ok) {
const userData = await userRes.json();
owner = userData.login;
}
} catch (uErr) {
console.warn('Could not auto-fetch GitHub user profile:', uErr);
}
}

if (!owner) {
return res.status(400).json({
error: 'GitHub repository owner could not be detected. Please set GITHUB_REPO_OWNER in Settings -> Secrets.',
});
}

if (!repo) {
return res.status(400).json({
error: 'GitHub repository name could not be detected. Please set GITHUB_REPO_NAME in Settings -> Secrets.',
});
}

const pushedFiles: string[] = [];
let latestCommitSha: string | undefined = undefined;

const pushFileToGitHubRoot = async (fileName: string, contentStr: string, commitMsg: string) => {
const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(fileName).replace(/%2F/g, '/')}?ref=${encodeURIComponent(branch)}`;
const checkRes = await fetch(getUrl, {
headers: {
Authorization: `Bearer ${token}`,
Accept: 'application/vnd.github+json',
'X-GitHub-Api-Version': '2022-11-28',
'User-Agent': 'Remix-Website-Builder',
},
});

let existingSha: string | undefined = undefined;
if (checkRes.ok) {
const info = await checkRes.json();
existingSha = info.sha;
}

const putPayload: Record<string, any> = {
message: commitMsg,
content: Buffer.from(contentStr, 'utf-8').toString('base64'),
branch,
};
if (existingSha) {
putPayload.sha = existingSha;
}

const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(fileName).replace(/%2F/g, '/')}`;
const putRes = await fetch(putUrl, {
method: 'PUT',
headers: {
Authorization: `Bearer ${token}`,
Accept: 'application/vnd.github+json',
'Content-Type': 'application/json',
'X-GitHub-Api-Version': '2022-11-28',
'User-Agent': 'Remix-Website-Builder',
},
body: JSON.stringify(putPayload),
});

if (!putRes.ok) {
const errData = await putRes.json().catch(() => ({}));
throw new Error(`Failed to update ${fileName} on GitHub (${putRes.status}): ${errData.message || putRes.statusText}`);
}

const resData = await putRes.json();
latestCommitSha = resData.commit?.sha;
pushedFiles.push(fileName);
return resData;
};

if (typeof robotsTxt === 'string') {
await pushFileToGitHubRoot(
'robots.txt',
robotsTxt,
`Update robots.txt [${new Date().toISOString().split('T')[0]}]`
);
}

if (pushSitemap && typeof sitemapXml === 'string' && sitemapXml.trim()) {
await pushFileToGitHubRoot(
'sitemap.xml',
sitemapXml,
`Update sitemap.xml [${new Date().toISOString().split('T')[0]}]`
);
}

try {
const envCheckUrl = `https://api.github.com/repos/${owner}/${repo}/contents/.env.example?ref=${encodeURIComponent(branch)}`;
const envCheckRes = await fetch(envCheckUrl, {
headers: {
Authorization: `Bearer ${token}`,
Accept: 'application/vnd.github+json',
'X-GitHub-Api-Version': '2022-11-28',
'User-Agent': 'Remix-Website-Builder',
},
});
if (envCheckRes.ok) {
const envInfo = await envCheckRes.json();
if (envInfo.sha) {
await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/.env.example`, {
method: 'DELETE',
headers: {
Authorization: `Bearer ${token}`,
Accept: 'application/vnd.github+json',
'Content-Type': 'application/json',
'X-GitHub-Api-Version': '2022-11-28',
'User-Agent': 'Remix-Website-Builder',
},
body: JSON.stringify({
message: 'Remove .env.example from website repository',
sha: envInfo.sha,
branch,
}),
});
}
}
} catch (delEnvErr) {
console.warn('Could not check/remove .env.example during SEO sync:', delEnvErr);
}

return res.json({
success: true,
pushedFiles,
commitSha: latestCommitSha,
repoFullName: `${owner}/${repo}`,
branch,
timestamp: new Date().toISOString(),
message: `Successfully synchronized ${pushedFiles.join(' and ')} to GitHub root.`
});
} catch (err: any) {
console.error('Error syncing SEO files to GitHub:', err);
return res.status(500).json({
error: err.message || 'Internal server error while syncing SEO files to GitHub',
});
}
});

app.post('/api/github/delete-page', async (req, res) => {
try {
const workspaceId = req.body.workspaceId;
const token = (req.body.githubToken || resolveWorkspaceEnv('GITHUB_TOKEN', workspaceId))?.trim();
if (!token) {
return res.status(400).json({
error: 'GitHub token is not configured.',
});
}

let owner = (req.body.repoOwner || resolveWorkspaceEnv('GITHUB_REPO_OWNER', workspaceId) || '').trim();
let repo = (req.body.repoName || resolveWorkspaceEnv('GITHUB_REPO_NAME', workspaceId) || '').trim();
let branch = (req.body.branch || resolveWorkspaceEnv('GITHUB_REPO_BRANCH', workspaceId) || process.env.GITHUB_REPO_BRANCH || '').trim();
let targetPath = (req.body.filePath || '').trim().replace(/^\/+/, '');

if (!targetPath) {
return res.status(400).json({ error: 'Page file path is required.' });
}

if (!targetPath.endsWith('.html') && !targetPath.includes('.')) {
targetPath = `${targetPath}.html`;
}

if (!owner) {
try {
const userRes = await fetch('https://api.github.com/user', {
headers: {
Authorization: `Bearer ${token}`,
Accept: 'application/vnd.github+json',
'X-GitHub-Api-Version': '2022-11-28',
'User-Agent': 'Remix-Website-Builder',
},
});
if (userRes.ok) {
const userData = await userRes.json();
owner = userData.login;
}
} catch (_) {}
}

if (!owner) {
return res.status(400).json({ error: 'GitHub owner could not be detected.' });
}

if (!repo) {
repo = 'website';
}

const getFileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(targetPath).replace(/%2F/g, '/')}?ref=${encodeURIComponent(branch)}`;
const checkFileRes = await fetch(getFileUrl, {
headers: {
Authorization: `Bearer ${token}`,
Accept: 'application/vnd.github+json',
'X-GitHub-Api-Version': '2022-11-28',
'User-Agent': 'Remix-Website-Builder',
},
});

if (!checkFileRes.ok) {
if (checkFileRes.status === 404) {
return res.json({
success: true,
deleted: false,
message: `File '${targetPath}' was not found on GitHub repository.`,
});
}
return res.status(checkFileRes.status).json({
error: `GitHub returned status ${checkFileRes.status}`,
});
}

const fileInfo = await checkFileRes.json();
if (!fileInfo.sha) {
return res.status(400).json({ error: 'Target file SHA could not be retrieved from GitHub.' });
}

const deleteUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(targetPath).replace(/%2F/g, '/')}`;
const deleteRes = await fetch(deleteUrl, {
method: 'DELETE',
headers: {
Authorization: `Bearer ${token}`,
Accept: 'application/vnd.github+json',
'Content-Type': 'application/json',
'X-GitHub-Api-Version': '2022-11-28',
'User-Agent': 'Remix-Website-Builder',
},
body: JSON.stringify({
message: `Delete ${targetPath} via Website Builder`,
sha: fileInfo.sha,
branch,
}),
});

if (!deleteRes.ok) {
const errData = await deleteRes.json().catch(() => ({}));
return res.status(deleteRes.status).json({
error: errData.message || `Failed to delete file from GitHub (HTTP ${deleteRes.status})`,
});
}

const deleteData = await deleteRes.json();
return res.json({
success: true,
deleted: true,
filePath: targetPath,
commitSha: deleteData.commit?.sha,
commitUrl: deleteData.commit?.html_url,
});
} catch (err: any) {
console.error('Error deleting page file from GitHub:', err);
return res.status(500).json({
error: err.message || 'Internal server error while deleting file from GitHub',
});
}
});

// ==========================================
// PROJECT BUNDLES & GITHUB DISTRIBUTION API
// ==========================================

function collectBundleFiles(options: {
  excludeBundlesPage?: boolean;
  excludeUsagePage?: boolean;
  excludeInboxPage?: boolean;
  excludeMediaPage?: boolean;
  excludeBrandPage?: boolean;
  excludeSecrets?: boolean;
  customAppName?: string;
  customDescription?: string;
}) {
  const rootDir = process.cwd();
  const ignoreDirs = new Set(['node_modules', '.git', 'dist', 'uploads', '.cache', '.turbo', '.vercel']);
  const ignoreFiles = new Set(['.DS_Store', '.env', 'bun.lockb']);

  const filesMap: Record<string, string> = {};
  const manifestItems: Array<{
    path: string;
    size: number;
    category: 'core' | 'views' | 'components' | 'styles' | 'config' | 'public';
    omitted: boolean;
    modified: boolean;
    reason?: string;
  }> = [];

  function walk(currentDir: string, relativePrefix: string = '') {
    if (!fs.existsSync(currentDir)) return;
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (ignoreDirs.has(entry.name)) continue;
        walk(path.join(currentDir, entry.name), relativePrefix ? `${relativePrefix}/${entry.name}` : entry.name);
      } else if (entry.isFile()) {
        if (ignoreFiles.has(entry.name)) continue;
        const relPath = relativePrefix ? `${relativePrefix}/${entry.name}` : entry.name;
        const fullPath = path.join(currentDir, entry.name);

        let category: 'core' | 'views' | 'components' | 'styles' | 'config' | 'public' = 'core';
        if (relPath.includes('views/')) category = 'views';
        else if (relPath.includes('components/')) category = 'components';
        else if (relPath.endsWith('.css') || relPath.endsWith('.scss')) category = 'styles';
        else if (relPath.endsWith('.json') || relPath.endsWith('.toml') || relPath.endsWith('.config.ts')) category = 'config';

        let shouldOmit = false;
        let omitReason = '';

        if (options.excludeBundlesPage) {
          if (
            relPath.includes('BundlesView.tsx') ||
            relPath.includes('BundlesSubNavBox.tsx') ||
            relPath.includes('views/bundles') ||
            relPath.includes('BundleGuideModal.tsx') ||
            relPath.includes('bundleService.ts')
          ) {
            shouldOmit = true;
            omitReason = 'Omitted: Exclude Bundles Page selected';
          }
        }

        if (options.excludeUsagePage) {
          if (
            relPath.includes('UsageView.tsx') ||
            relPath.includes('views/usage') ||
            relPath.includes('ReportSubNavBox.tsx') ||
            relPath.includes('firebaseUsageService.ts')
          ) {
            shouldOmit = true;
            omitReason = 'Omitted: Exclude Usage Page selected';
          }
        }

        if (options.excludeInboxPage) {
          if (relPath.includes('InboxView.tsx')) {
            shouldOmit = true;
            omitReason = 'Omitted: Exclude Inbox selected';
          }
        }

        if (options.excludeMediaPage) {
          if (relPath.includes('MediaStorageView.tsx')) {
            shouldOmit = true;
            omitReason = 'Omitted: Exclude Media selected';
          }
        }

        if (options.excludeBrandPage) {
          if (
            relPath.includes('BrandView.tsx') ||
            relPath.includes('views/brand') ||
            relPath.includes('BrandSubNavBox.tsx')
          ) {
            shouldOmit = true;
            omitReason = 'Omitted: Exclude Brand selected';
          }
        }

        const stats = fs.statSync(fullPath);
        if (shouldOmit) {
          manifestItems.push({
            path: relPath,
            size: stats.size,
            category,
            omitted: true,
            modified: false,
            reason: omitReason,
          });
          continue;
        }

        let content = '';
        try {
          content = fs.readFileSync(fullPath, 'utf-8');
        } catch (_) {
          continue;
        }

        let modified = false;

        // Apply transformations to Sidebar.tsx
        if (relPath === 'src/components/dashboard/Sidebar.tsx') {
          if (options.excludeBundlesPage) {
            content = content.replace(/ \| 'bundles'/g, '');
            content = content.replace(/'bundles' \| /g, '');
            content = content.replace(/\{ id: 'bundles', label: 'Bundles'.*?\},?\n?/g, '');
            content = content.replace(/export const BundlesNavIcon[\s\S]*?\n\);\n?/g, '');
            modified = true;
          }
          if (options.excludeUsagePage) {
            content = content.replace(/ \| 'usage'/g, '');
            content = content.replace(/'usage' \| /g, '');
            content = content.replace(/\{ id: 'usage', label: 'Usage'.*?\},?\n?/g, '');
            modified = true;
          }
          if (options.excludeInboxPage) {
            content = content.replace(/ \| 'inbox'/g, '');
            content = content.replace(/'inbox' \| /g, '');
            content = content.replace(/\{ id: 'inbox', label: 'Inbox'.*?\},?\n?/g, '');
            modified = true;
          }
          if (options.excludeMediaPage) {
            content = content.replace(/ \| 'media'/g, '');
            content = content.replace(/'media' \| /g, '');
            content = content.replace(/\{ id: 'media', label: 'Media'.*?\},?\n?/g, '');
            modified = true;
          }
          if (options.excludeBrandPage) {
            content = content.replace(/ \| 'brand'/g, '');
            content = content.replace(/'brand' \| /g, '');
            content = content.replace(/\{ id: 'brand', label: 'Brand'.*?\},?\n?/g, '');
            modified = true;
          }
        }

        // Apply transformations to Layout.tsx
        if (relPath === 'src/components/dashboard/Layout.tsx') {
          if (options.excludeBundlesPage) {
            content = content.replace(/import\s*\{\s*BundlesView\s*\}\s*from\s*['"]\.\/views\/BundlesView['"];?\r?\n?/g, '');
            content = content.replace(/\{currentTab === ['"]bundles['"]\s*&&[\s\S]*?\)\s*\}\r?\n?/g, '');
            modified = true;
          }
          if (options.excludeUsagePage) {
            content = content.replace(/import\s*\{\s*UsageView\s*\}\s*from\s*['"]\.\/views\/UsageView['"];?\r?\n?/g, '');
            content = content.replace(/\{currentTab === ['"]usage['"]\s*&&[\s\S]*?\)\s*\}\r?\n?/g, '');
            modified = true;
          }
          if (options.excludeInboxPage) {
            content = content.replace(/import\s*\{\s*InboxView\s*\}\s*from\s*['"]\.\/views\/InboxView['"];?\r?\n?/g, '');
            content = content.replace(/\{currentTab === ['"]inbox['"]\s*&&[\s\S]*?\)\s*\}\r?\n?/g, '');
            modified = true;
          }
          if (options.excludeMediaPage) {
            content = content.replace(/import\s*\{\s*MediaStorageView\s*\}\s*from\s*['"]\.\/views\/MediaStorageView['"];?\r?\n?/g, '');
            content = content.replace(/\{currentTab === ['"]media['"]\s*&&[\s\S]*?\)\s*\}\r?\n?/g, '');
            modified = true;
          }
          if (options.excludeBrandPage) {
            content = content.replace(/import\s*\{\s*BrandView\s*\}\s*from\s*['"]\.\/views\/BrandView['"];?\r?\n?/g, '');
            content = content.replace(/\{currentTab === ['"]brand['"]\s*&&[\s\S]*?\)\s*\}\r?\n?/g, '');
            modified = true;
          }
        }

        // Apply transformations to Navbar.tsx
        if (relPath === 'src/components/dashboard/Navbar.tsx') {
          if (options.excludeBundlesPage) {
            content = content.replace(/,\s*BundlesNavIcon/g, '');
            content = content.replace(/bundles:\s*\{[^}]*\},?\n?/g, '');
            modified = true;
          }
          if (options.excludeUsagePage) {
            content = content.replace(/usage:\s*\{[^}]*\},?\n?/g, '');
            modified = true;
          }
          if (options.excludeInboxPage) {
            content = content.replace(/inbox:\s*\{[^}]*\},?\n?/g, '');
            modified = true;
          }
          if (options.excludeMediaPage) {
            content = content.replace(/media:\s*\{[^}]*\},?\n?/g, '');
            modified = true;
          }
          if (options.excludeBrandPage) {
            content = content.replace(/brand:\s*\{[^}]*\},?\n?/g, '');
            modified = true;
          }
        }

        // Apply transformations to themePreferences.ts
        if (relPath === 'src/utils/themePreferences.ts') {
          if (options.excludeBundlesPage) {
            content = content.replace(/\{ id: 'bundles', visible: true \},?\n?/g, '');
            modified = true;
          }
          if (options.excludeUsagePage) {
            content = content.replace(/\{ id: 'usage', visible: true \},?\n?/g, '');
            modified = true;
          }
          if (options.excludeInboxPage) {
            content = content.replace(/\{ id: 'inbox', visible: true \},?\n?/g, '');
            modified = true;
          }
          if (options.excludeMediaPage) {
            content = content.replace(/\{ id: 'media', visible: true \},?\n?/g, '');
            modified = true;
          }
          if (options.excludeBrandPage) {
            content = content.replace(/\{ id: 'brand', visible: true \},?\n?/g, '');
            modified = true;
          }
        }

        // Sanitize workspaces.json if excludeSecrets
        if (relPath === 'workspaces.json' && options.excludeSecrets) {
          try {
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed.workspaces)) {
              parsed.workspaces = parsed.workspaces.map((w: any) => ({
                ...w,
                secrets: {},
              }));
              content = JSON.stringify(parsed, null, 2);
              modified = true;
            }
          } catch (_) {}
        }

        // Custom App Name transformations
        if (options.customAppName && options.customAppName.trim()) {
          const appName = options.customAppName.trim();
          const slugName = appName.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
          if (relPath === 'package.json') {
            content = content.replace(/"name":\s*"[^"]*"/, `"name": "${slugName}"`);
            modified = true;
          }
          if (relPath === 'metadata.json') {
            content = content.replace(/"name":\s*"[^"]*"/, `"name": "${appName}"`);
            if (options.customDescription) {
              content = content.replace(/"description":\s*"[^"]*"/, `"description": "${options.customDescription.trim()}"`);
            }
            modified = true;
          }
          if (relPath === 'index.html') {
            content = content.replace(/<title>.*?<\/title>/, `<title>${appName}</title>`);
            modified = true;
          }
        }

        filesMap[relPath] = content;
        manifestItems.push({
          path: relPath,
          size: Buffer.byteLength(content, 'utf-8'),
          category,
          omitted: false,
          modified,
        });
      }
    }
  }

  walk(rootDir);
  return { files: filesMap, manifest: manifestItems };
}

function calculateGitBlobSha(content: string): string {
  return crypto.createHash('sha1').update('blob ' + Buffer.byteLength(content, 'utf-8') + '\0' + content).digest('hex');
}

app.post('/api/github/bundle-manifest', (req, res) => {
  try {
    const { manifest } = collectBundleFiles(req.body || {});
    const totalFiles = manifest.length;
    const omittedCount = manifest.filter((m) => m.omitted).length;
    const includedCount = totalFiles - omittedCount;

    return res.json({
      totalFiles,
      includedCount,
      omittedCount,
      files: manifest,
      preset: req.body?.targetPreset || 'custom',
    });
  } catch (err: any) {
    console.error('Error generating bundle manifest:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate bundle manifest' });
  }
});

app.post('/api/github/bundle-files', (req, res) => {
  try {
    const { files } = collectBundleFiles(req.body || {});
    const appName = req.body?.customAppName || 'app-bundle';
    return res.json({ files, appName });
  } catch (err: any) {
    console.error('Error generating bundle files:', err);
    return res.status(500).json({ error: err.message || 'Failed to collect bundle files' });
  }
});

app.post('/api/github/bundle-diff', async (req, res) => {
  try {
    const workspaceId = req.body.workspaceId;
    const token = (req.body.githubToken || resolveWorkspaceEnv('GITHUB_TOKEN', workspaceId))?.trim();
    if (!token) {
      return res.status(400).json({
        error: 'GitHub token not found. Please configure GITHUB_TOKEN in Settings -> Secrets.',
      });
    }

    let owner = (req.body.repoOwner || resolveWorkspaceEnv('GITHUB_REPO_OWNER', workspaceId) || '').trim();
    let repo = (req.body.repoName || resolveWorkspaceEnv('GITHUB_REPO_NAME', workspaceId) || '').trim();
    let branch = (req.body.branch || 'main').trim();

    if (!owner) {
      try {
        const userRes = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'Remix-Website-Builder',
          },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          owner = userData.login;
        }
      } catch (_) {}
    }

    if (!owner || !repo) {
      return res.status(400).json({ error: 'Please specify both repository owner and repository name.' });
    }

    const { files: bundledFiles } = collectBundleFiles(req.body.options || {});
    const fileEntries = Object.entries(bundledFiles);

    let baseTreeSha: string | undefined;
    let baseCommitSha: string | undefined;
    const remoteTreeMap = new Map<string, { path: string; sha: string; size?: number }>();

    const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'Remix-Website-Builder',
      },
    });

    if (refRes.ok) {
      const refData = await refRes.json();
      baseCommitSha = refData.object?.sha;
      if (baseCommitSha) {
        const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits/${baseCommitSha}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'Remix-Website-Builder',
          },
        });
        if (commitRes.ok) {
          const commitData = await commitRes.json();
          baseTreeSha = commitData.tree?.sha;
          if (baseTreeSha) {
            const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${baseTreeSha}?recursive=1`, {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
                'User-Agent': 'Remix-Website-Builder',
              },
            });
            if (treeRes.ok) {
              const treeData = await treeRes.json();
              if (Array.isArray(treeData.tree)) {
                for (const item of treeData.tree) {
                  if (item.type === 'blob') {
                    remoteTreeMap.set(item.path, item);
                  }
                }
              }
            }
          }
        }
      }
    }

    const diffItems: Array<{
      path: string;
      size: number;
      status: 'added' | 'modified' | 'deleted' | 'unchanged';
      localSha?: string;
      remoteSha?: string;
      category: 'core' | 'views' | 'components' | 'styles' | 'config' | 'public';
      omitted?: boolean;
    }> = [];

    const localPathsSet = new Set<string>();

    for (const [filePath, content] of fileEntries) {
      localPathsSet.add(filePath);
      const localSha = calculateGitBlobSha(content);
      const remote = remoteTreeMap.get(filePath);

      let category: 'core' | 'views' | 'components' | 'styles' | 'config' | 'public' = 'core';
      if (filePath.includes('views/')) category = 'views';
      else if (filePath.includes('components/')) category = 'components';
      else if (filePath.endsWith('.css') || filePath.endsWith('.scss')) category = 'styles';
      else if (filePath.endsWith('.json') || filePath.endsWith('.toml') || filePath.endsWith('.config.ts')) category = 'config';

      if (!remote) {
        diffItems.push({
          path: filePath,
          size: Buffer.byteLength(content, 'utf-8'),
          status: 'added',
          localSha,
          category,
        });
      } else if (remote.sha !== localSha) {
        diffItems.push({
          path: filePath,
          size: Buffer.byteLength(content, 'utf-8'),
          status: 'modified',
          localSha,
          remoteSha: remote.sha,
          category,
        });
      } else {
        diffItems.push({
          path: filePath,
          size: Buffer.byteLength(content, 'utf-8'),
          status: 'unchanged',
          localSha,
          remoteSha: remote.sha,
          category,
        });
      }
    }

    for (const [remotePath, remoteItem] of remoteTreeMap.entries()) {
      if (!localPathsSet.has(remotePath)) {
        diffItems.push({
          path: remotePath,
          size: remoteItem.size || 0,
          status: 'deleted',
          remoteSha: remoteItem.sha,
          category: 'core',
          omitted: true,
        });
      }
    }

    const modifiedCount = diffItems.filter((d) => d.status === 'modified').length;
    const addedCount = diffItems.filter((d) => d.status === 'added').length;
    const deletedCount = diffItems.filter((d) => d.status === 'deleted').length;
    const unchangedCount = diffItems.filter((d) => d.status === 'unchanged').length;
    const isUpToDate = modifiedCount === 0 && addedCount === 0 && deletedCount === 0 && Boolean(baseCommitSha);

    return res.json({
      totalFiles: diffItems.length,
      modifiedCount,
      addedCount,
      deletedCount,
      unchangedCount,
      isUpToDate,
      files: diffItems,
      baseCommitSha,
      branch,
      repoFullName: `${owner}/${repo}`,
    });
  } catch (err: any) {
    console.error('Error calculating bundle diff:', err);
    return res.status(500).json({ error: err.message || 'Failed to calculate diff' });
  }
});

app.post('/api/github/push-bundle', async (req, res) => {
  try {
    const workspaceId = req.body.workspaceId;
    const token = (req.body.githubToken || resolveWorkspaceEnv('GITHUB_TOKEN', workspaceId))?.trim();
    if (!token) {
      return res.status(400).json({
        error: 'GitHub token not found. Please provide a GitHub token or configure GITHUB_TOKEN in Settings -> Secrets.',
      });
    }

    let owner = (req.body.repoOwner || resolveWorkspaceEnv('GITHUB_REPO_OWNER', workspaceId) || '').trim();
    let repo = (req.body.repoName || resolveWorkspaceEnv('GITHUB_REPO_NAME', workspaceId) || '').trim();
    let branch = (req.body.branch || 'main').trim();
    const visibility = req.body.visibility || 'private';
    const isPrivate = visibility !== 'public';
    const commitMessage = (req.body.commitMessage || 'Deploy customized app bundle via Bundles').trim();

    if (!owner) {
      try {
        const userRes = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'Remix-Website-Builder',
          },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          owner = userData.login;
        }
      } catch (_) {}
    }

    if (!owner || !repo) {
      return res.status(400).json({ error: 'Please specify both repository owner and repository name.' });
    }

    const { files: bundledFiles, manifest } = collectBundleFiles(req.body || {});
    const fileEntries = Object.entries(bundledFiles);

    if (fileEntries.length === 0) {
      return res.status(400).json({ error: 'No files found to bundle.' });
    }

    // 1. Verify or create repository
    const checkRepoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'Remix-Website-Builder',
      },
    });

    if (checkRepoRes.status === 404) {
      const createRepoRes = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'Remix-Website-Builder',
        },
        body: JSON.stringify({
          name: repo,
          description: req.body.customDescription || 'Customized application bundle created with Website Builder',
          auto_init: true,
          private: isPrivate,
        }),
      });

      if (!createRepoRes.ok) {
        const errData = await createRepoRes.json().catch(() => ({}));
        return res.status(createRepoRes.status).json({
          error: `Could not create repository '${owner}/${repo}': ${errData.message || 'Permission denied'}`,
        });
      }
      await new Promise((r) => setTimeout(r, 1500));
    } else if (!checkRepoRes.ok) {
      const errData = await checkRepoRes.json().catch(() => ({}));
      return res.status(checkRepoRes.status).json({
        error: errData.message || `Failed to access repository '${owner}/${repo}' (HTTP ${checkRepoRes.status})`,
      });
    }

    // 2. Fetch current branch commit and remote tree for Smart Delta Push
    let latestCommitSha: string | undefined;
    let baseTreeSha: string | undefined;
    const remoteTreeMap = new Map<string, { path: string; sha: string; size?: number }>();

    const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'Remix-Website-Builder',
      },
    });

    if (refRes.ok) {
      const refData = await refRes.json();
      latestCommitSha = refData.object?.sha;
      if (latestCommitSha) {
        const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits/${latestCommitSha}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'Remix-Website-Builder',
          },
        });
        if (commitRes.ok) {
          const commitData = await commitRes.json();
          baseTreeSha = commitData.tree?.sha;
          if (baseTreeSha) {
            const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${baseTreeSha}?recursive=1`, {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
                'User-Agent': 'Remix-Website-Builder',
              },
            });
            if (treeRes.ok) {
              const treeData = await treeRes.json();
              if (Array.isArray(treeData.tree)) {
                for (const item of treeData.tree) {
                  if (item.type === 'blob') {
                    remoteTreeMap.set(item.path, item);
                  }
                }
              }
            }
          }
        }
      }
    }

    // 3. Compute Delta Tree Items (Only modified, added, or deleted files)
    const localPathsSet = new Set<string>();
    const deltaTreeItems: any[] = [];
    let modifiedCount = 0;
    let addedCount = 0;
    let deletedCount = 0;
    let unchangedCount = 0;

    for (const [filePath, content] of fileEntries) {
      localPathsSet.add(filePath);
      const localSha = calculateGitBlobSha(content);
      const remote = remoteTreeMap.get(filePath);

      if (!baseTreeSha || !remote) {
        deltaTreeItems.push({
          path: filePath,
          mode: '100644',
          type: 'blob',
          content,
        });
        addedCount++;
      } else if (remote.sha !== localSha) {
        deltaTreeItems.push({
          path: filePath,
          mode: '100644',
          type: 'blob',
          content,
        });
        modifiedCount++;
      } else {
        unchangedCount++;
      }
    }

    if (baseTreeSha) {
      for (const [remotePath] of remoteTreeMap.entries()) {
        if (!localPathsSet.has(remotePath)) {
          deltaTreeItems.push({
            path: remotePath,
            mode: '100644',
            type: 'blob',
            sha: null,
          });
          deletedCount++;
        }
      }
    }

    // If baseTreeSha exists and 0 files changed, skip redundant commit to avoid rate limits
    if (baseTreeSha && latestCommitSha && deltaTreeItems.length === 0) {
      return res.json({
        success: true,
        unchanged: true,
        repoFullName: `${owner}/${repo}`,
        branch,
        commitSha: latestCommitSha,
        commitUrl: `https://github.com/${owner}/${repo}/commit/${latestCommitSha}`,
        filesCount: fileEntries.length,
        omittedFilesCount: manifest.filter((m) => m.omitted).length,
        modifiedCount: 0,
        addedCount: 0,
        deletedCount: 0,
        unchangedCount: fileEntries.length,
        timestamp: new Date().toISOString(),
        message: 'Repository is already up to date with this bundle. 0 files changed.',
      });
    }

    // 4. Post Delta Tree
    const createTreePayload: any = { tree: deltaTreeItems };
    if (baseTreeSha) {
      createTreePayload.base_tree = baseTreeSha;
    }

    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'Remix-Website-Builder',
      },
      body: JSON.stringify(createTreePayload),
    });

    if (!treeRes.ok) {
      const treeErr = await treeRes.json().catch(() => ({}));
      return res.status(treeRes.status).json({
        error: treeErr.message || `Failed to create Git tree on GitHub (HTTP ${treeRes.status})`,
      });
    }

    const treeData = await treeRes.json();

    // 5. Create Commit
    const finalCommitMessage = `${commitMessage} [${modifiedCount} mod, ${addedCount} add, ${deletedCount} del, ${unchangedCount} unch]`;
    const commitPayload: any = {
      message: finalCommitMessage,
      tree: treeData.sha,
      parents: latestCommitSha ? [latestCommitSha] : [],
    };

    const newCommitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'Remix-Website-Builder',
      },
      body: JSON.stringify(commitPayload),
    });

    if (!newCommitRes.ok) {
      const commitErr = await newCommitRes.json().catch(() => ({}));
      return res.status(newCommitRes.status).json({
        error: commitErr.message || `Failed to create Git commit on GitHub (HTTP ${newCommitRes.status})`,
      });
    }

    const newCommitData = await newCommitRes.json();

    // 6. Update or Create Branch Ref
    if (latestCommitSha) {
      const updateRefRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'Remix-Website-Builder',
        },
        body: JSON.stringify({ sha: newCommitData.sha, force: true }),
      });

      if (!updateRefRes.ok) {
        const updateErr = await updateRefRes.json().catch(() => ({}));
        return res.status(updateRefRes.status).json({
          error: updateErr.message || `Failed to update branch reference '${branch}'`,
        });
      }
    } else {
      const createRefRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'Remix-Website-Builder',
        },
        body: JSON.stringify({
          ref: `refs/heads/${branch}`,
          sha: newCommitData.sha,
        }),
      });

      if (!createRefRes.ok) {
        const createRefErr = await createRefRes.json().catch(() => ({}));
        return res.status(createRefRes.status).json({
          error: createRefErr.message || `Failed to create branch reference '${branch}'`,
        });
      }
    }

    const omittedCount = manifest.filter((m) => m.omitted).length;

    return res.json({
      success: true,
      repoFullName: `${owner}/${repo}`,
      branch,
      commitSha: newCommitData.sha,
      commitUrl: `https://github.com/${owner}/${repo}/commit/${newCommitData.sha}`,
      filesCount: fileEntries.length,
      omittedFilesCount: omittedCount,
      modifiedCount,
      addedCount,
      deletedCount,
      unchangedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error pushing bundle to GitHub:', err);
    return res.status(500).json({ error: err.message || 'Failed to push bundle to GitHub' });
  }
});

function saveFileLocally(fileData: string, filename?: string) {
const uploadsDirectory = getUploadsDir();

let buffer: Buffer;
let extension = 'png';
let mimeType = 'image/png';

if (fileData.startsWith('data:')) {
const matches = fileData.match(/^data:([A-Za-z0-9-+\/]+);base64,(.+)$/);
if (matches && matches.length === 3) {
mimeType = matches[1];
const subType = mimeType.split('/')[1] || 'png';
extension = subType.replace('+xml', '').replace('jpeg', 'jpg');
buffer = Buffer.from(matches[2], 'base64');
} else {
const parts = fileData.split(',');
buffer = Buffer.from(parts[1] || parts[0], 'base64');
}
} else {
buffer = Buffer.from(fileData, 'base64');
}

const cleanBase = filename
? filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')
: `asset_${Date.now()}`;
const safeFilename = `${cleanBase}_${Date.now()}.${extension}`;
const filePath = path.join(uploadsDirectory, safeFilename);

safeWriteFileSync(filePath, buffer);

return {
id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
publicId: safeFilename,
name: filename || safeFilename,
url: `/uploads/${safeFilename}`,
storagePath: `/uploads/${safeFilename}`,
size: buffer.length,
type: mimeType,
format: extension,
createdAt: new Date().toISOString(),
isFirebaseStored: false,
storageProvider: 'local',
};
}

function getLocalUploadedAssets() {
try {
const uploadsDirectory = getUploadsDir();
if (!fs.existsSync(uploadsDirectory)) return [];
const files = fs.readdirSync(uploadsDirectory);
return files.map((file) => {
const filePath = path.join(uploadsDirectory, file);
const stats = fs.statSync(filePath);
const ext = path.extname(file).replace('.', '') || 'png';
return {
id: `local_${file}`,
publicId: file,
name: file,
url: `/uploads/${file}`,
storagePath: `/uploads/${file}`,
size: stats.size,
type: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
format: ext,
createdAt: stats.birthtime.toISOString(),
isFirebaseStored: false,
storageProvider: 'local',
};
});
} catch {
return [];
}
}

// Cloudinary direct upload signature endpoint
app.post('/api/cloudinary/sign', (req, res) => {
try {
const { folder, tags, workspaceId } = req.body || {};
const timestamp = Math.round(new Date().getTime() / 1000);
const api_secret = resolveWorkspaceEnv('CLOUDINARY_API_SECRET', workspaceId) || process.env.CLOUDINARY_API_SECRET;
const api_key = resolveWorkspaceEnv('CLOUDINARY_API_KEY', workspaceId) || process.env.CLOUDINARY_API_KEY;
const cloud_name =
resolveWorkspaceEnv('VITE_CLOUDINARY_CLOUD_NAME', workspaceId) ||
process.env.VITE_CLOUDINARY_CLOUD_NAME;

if (!api_secret || !api_key || !cloud_name) {
return res.status(500).json({ error: 'Cloudinary not configured. Missing API Key, API Secret, or Cloud Name.' });
}

const paramsToSign: Record<string, any> = {
folder: folder || 'website_assets',
timestamp,
};
if (tags) {
paramsToSign.tags = tags;
}

const signature = cloudinary.utils.api_sign_request(paramsToSign, api_secret);

res.json({ signature, api_key, timestamp, cloud_name });
} catch (err: any) {
console.error('Signature generation error:', err);
res.status(500).json({ error: 'Failed to sign upload' });
}
});

// Cloudinary status check
app.get('/api/cloudinary/status', async (req, res) => {
const workspaceId = (req.query.workspaceId as string) || undefined;
const cfg = getCloudinaryConfig(workspaceId);
if (!cfg.isConfigured) {
return res.json({
configured: false,
cloudName: '',
apiKeyMasked: '',
message: 'VITE_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET need to be set in environment secrets.',
});
}

try {
const pingResult = await cloudinary.api.ping();
let usageInfo: any = null;
try {
const usageRes = await cloudinary.api.usage();
if (usageRes) {
usageInfo = {
plan: usageRes.plan || 'Free',
lastUpdated: usageRes.last_updated || new Date().toISOString(),
credits: {
used: typeof usageRes.credits?.usage === 'number' ? usageRes.credits.usage : null,
limit: typeof usageRes.credits?.limit === 'number' ? usageRes.credits.limit : 25,
usedPercent: typeof usageRes.credits?.used_percent === 'number' ? usageRes.credits.used_percent : null,
},
storage: {
usedBytes: typeof usageRes.storage?.usage === 'number' ? usageRes.storage.usage : null,
creditsUsed: typeof usageRes.storage?.credits_usage === 'number' ? usageRes.storage.credits_usage : null,
},
bandwidth: {
usedBytes: typeof usageRes.bandwidth?.usage === 'number' ? usageRes.bandwidth.usage : null,
creditsUsed: typeof usageRes.bandwidth?.credits_usage === 'number' ? usageRes.bandwidth.credits_usage : null,
},
transformations: {
count: typeof usageRes.transformations?.usage === 'number' ? usageRes.transformations.usage : null,
creditsUsed: typeof usageRes.transformations?.credits_usage === 'number' ? usageRes.transformations.credits_usage : null,
},
objects: {
count: typeof usageRes.objects?.usage === 'number' ? usageRes.objects.usage : null,
},
};
}
} catch (err: any) {
console.warn('Cloudinary usage API notice:', err?.message);
}

return res.json({
configured: true,
cloudName: cfg.cloud_name,
apiKeyMasked: cfg.apiKeyMasked,
ping: pingResult.status || 'ok',
usage: usageInfo,
});
} catch (err: any) {
return res.json({
configured: false,
cloudName: cfg.cloud_name,
apiKeyMasked: cfg.apiKeyMasked,
ping: 'unauthorized',
error: err?.message || 'Invalid Cloudinary credentials or API key permissions.',
});
}
});

// Media upload endpoint (Cloudinary first with server fallback)
app.post('/api/media/upload', async (req, res) => {
try {
const { file, filename, folder } = req.body;
if (!file) {
return res.status(400).json({ error: 'File data is required.' });
}

const cfg = getCloudinaryConfig();
if (cfg.isConfigured) {
try {
const uploadRes = await cloudinary.uploader.upload(file, {
folder: folder || 'website_assets',
resource_type: 'auto',
});

return res.json({
success: true,
asset: {
id: uploadRes.public_id,
publicId: uploadRes.public_id,
name: filename || (uploadRes.public_id.split('/').pop() || uploadRes.public_id) + `.${uploadRes.format || 'jpg'}`,
url: uploadRes.secure_url || uploadRes.url,
storagePath: uploadRes.public_id,
size: uploadRes.bytes || 0,
type: `${uploadRes.resource_type || 'image'}/${uploadRes.format || 'jpeg'}`,
format: uploadRes.format,
width: uploadRes.width,
height: uploadRes.height,
createdAt: uploadRes.created_at || new Date().toISOString(),
isFirebaseStored: false,
storageProvider: 'cloudinary',
},
});
} catch (cloudErr: any) {
console.warn('Cloudinary server-side upload failed, saving locally:', cloudErr?.message);
}
}

const asset = saveFileLocally(file, filename);
return res.json({
success: true,
asset,
});
} catch (err: any) {
console.error('Media upload error:', err);
return res.status(500).json({ error: 'Failed to upload media file.' });
}
});

// Get uploaded media resources (Cloudinary + Local)
app.get('/api/media/resources', async (req, res) => {
try {
const localAssets = getLocalUploadedAssets();
const cfg = getCloudinaryConfig();

if (!cfg.isConfigured) {
return res.json({
success: true,
assets: localAssets,
totalCount: localAssets.length,
cloudinaryConfigured: false,
});
}

let cloudAssets: any[] = [];
try {
const resourceTypes = ['image', 'video', 'raw'];

for (const rType of resourceTypes) {
let nextCursor: string | undefined = undefined;
let fetchMore = true;
let iterations = 0;
const MAX_ITERATIONS = 50; // Fetch up to 25,000 assets per type (50 * 500)

while (fetchMore && iterations < MAX_ITERATIONS) {
const response: any = await cloudinary.api.resources({
type: 'upload',
max_results: 500,
resource_type: rType,
next_cursor: nextCursor,
});

if (response && Array.isArray(response.resources)) {
const mapped = response.resources.map((item: any) => ({
id: item.asset_id || item.public_id,
publicId: item.public_id,
name: (item.public_id.split('/').pop() || item.public_id) + (item.format ? `.${item.format}` : ''),
url: item.secure_url || item.url,
storagePath: item.public_id,
size: item.bytes || 0,
type: `${item.resource_type || rType}/${item.format || 'unknown'}`,
format: item.format,
width: item.width,
height: item.height,
createdAt: item.created_at || new Date().toISOString(),
isFirebaseStored: false,
storageProvider: 'cloudinary',
}));
cloudAssets = [...cloudAssets, ...mapped];
}

nextCursor = response.next_cursor;
fetchMore = Boolean(nextCursor);
iterations++;
}
}
} catch (err: any) {
console.warn('Failed to retrieve Cloudinary resources:', err?.message);
}

const merged = [
...cloudAssets,
...localAssets.filter(
(la) => !cloudAssets.some((ca) => ca.publicId === la.publicId || ca.name === la.name)
),
];

return res.json({
success: true,
assets: merged,
totalCount: merged.length,
cloudinaryConfigured: true,
});
} catch (err: any) {
return res.json({
success: true,
assets: [],
totalCount: 0,
cloudinaryConfigured: false,
});
}
});

// Delete media file (Cloudinary and/or Local)
app.post('/api/media/delete', async (req, res) => {
try {
const { publicId, storagePath, storageProvider } = req.body;
const idToDelete = publicId || storagePath;
if (!idToDelete) {
return res.status(400).json({ error: 'Asset identifier is required.' });
}

const cfg = getCloudinaryConfig();
if (cfg.isConfigured && (storageProvider === 'cloudinary' || publicId)) {
try {
await cloudinary.uploader.destroy(idToDelete, {
resource_type: 'image',
});
} catch (e: any) {
console.warn('Could not destroy Cloudinary asset:', e?.message);
}
}

const uploadsDirectory = getUploadsDir();
const filename = path.basename(idToDelete);
const localFilePath = path.join(uploadsDirectory, filename);
if (fs.existsSync(localFilePath)) {
try {
fs.unlinkSync(localFilePath);
} catch {}
}

return res.json({
success: true,
publicId: idToDelete,
});
} catch (err: any) {
return res.json({
success: true,
publicId: req.body?.publicId,
});
}
});

if (process.env.NODE_ENV !== 'production') {
const { createServer: createViteServer } = await import('vite');
const vite = await createViteServer({
server: { middlewareMode: true },
appType: 'spa',
});
app.use(vite.middlewares);
} else {
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));
app.get('*all', (req, res) => {
res.sendFile(path.join(distPath, 'index.html'));
});
}

app.listen(PORT, '0.0.0.0', () => {
console.log(`Server running on http://localhost:${PORT}`);
});
}

startServer();
