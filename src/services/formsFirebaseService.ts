import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore, 
  Firestore, 
  collection, 
  doc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  addDoc,
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  setLogLevel
} from 'firebase/firestore';
import { recordFirestoreOperation } from './firebaseUsageService';

try {
  setLogLevel('silent');
} catch (_) {}

export interface FormsFirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  firestoreDatabaseId?: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  formTitle?: string;
  pageTitle?: string;
  sourcePage?: string;
  formType?: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  status: 'new' | 'read' | 'contacted' | 'in_progress' | 'archived' | 'spam';
  isStarred?: boolean;
  isRead?: boolean;
  customFields?: Record<string, any>;
  data?: Record<string, any>;
  submittedAt: string;
  createdAt?: string;
  source?: string;
  notes?: string;
}

export function parseFirestoreSubmissionDocument(docId: string, raw: any): FormSubmission {
  if (!raw || typeof raw !== 'object') {
    return {
      id: docId,
      formId: 'form',
      name: 'Visitor',
      email: '',
      status: 'new',
      submittedAt: new Date().toISOString(),
    };
  }

  const nestedData = (typeof raw.formData === 'object' && raw.formData !== null)
    ? raw.formData
    : (typeof raw.data === 'object' && raw.data !== null)
    ? raw.data
    : (typeof raw.values === 'object' && raw.values !== null)
    ? raw.values
    : (typeof raw.fields === 'object' && raw.fields !== null)
    ? raw.fields
    : (typeof raw.payload === 'object' && raw.payload !== null)
    ? raw.payload
    : (typeof raw.submission === 'object' && raw.submission !== null)
    ? raw.submission
    : {};

  const combined: Record<string, any> = { ...nestedData, ...raw };

  const findValue = (possibleKeys: string[]): any => {
    
    for (const key of possibleKeys) {
      if (combined[key] !== undefined && combined[key] !== null && String(combined[key]).trim() !== '') {
        return combined[key];
      }
    }
    
    const normalizedMap: Record<string, any> = {};
    for (const [k, v] of Object.entries(combined)) {
      const norm = k.toLowerCase().replace(/[\s_\-:]+/g, '');
      if (norm && v !== undefined && v !== null && String(v).trim() !== '') {
        normalizedMap[norm] = v;
      }
    }
    for (const key of possibleKeys) {
      const normKey = key.toLowerCase().replace(/[\s_\-:]+/g, '');
      if (normalizedMap[normKey] !== undefined) {
        return normalizedMap[normKey];
      }
    }
    return undefined;
  };

  let submittedAt = new Date().toISOString();
  const rawDate = raw.submittedAt || raw.submitted_at || raw.createdAt || raw.created_at || raw.timestamp || raw.date || raw.time || raw.datetime || combined.submittedAt || combined.createdAt || combined.timestamp;
  if (rawDate) {
    if (typeof rawDate?.toDate === 'function') {
      try {
        submittedAt = rawDate.toDate().toISOString();
      } catch (e) {
        submittedAt = new Date().toISOString();
      }
    } else if (rawDate && typeof rawDate === 'object' && ('seconds' in rawDate || '_seconds' in rawDate)) {
      const sec = rawDate.seconds ?? rawDate._seconds;
      submittedAt = new Date(sec * 1000).toISOString();
    } else if (typeof rawDate === 'number') {
      const ms = rawDate < 1e11 ? rawDate * 1000 : rawDate;
      submittedAt = new Date(ms).toISOString();
    } else if (typeof rawDate === 'string' && !isNaN(Date.parse(rawDate))) {
      submittedAt = new Date(rawDate).toISOString();
    }
  }

  let name = findValue([
    'name', 'fullName', 'full_name', 'senderName', 'sender_name', 'leadName', 'lead_name',
    'contactName', 'contact_name', 'author', 'sender', 'client_name', 'customer_name', 'user_name', 'username'
  ]);
  if (!name) {
    const first = findValue(['firstName', 'first_name', 'firstname', 'fname', 'givenName']);
    const last = findValue(['lastName', 'last_name', 'lastname', 'lname', 'familyName', 'surname']);
    if (first || last) {
      name = [first, last].filter(Boolean).join(' ');
    }
  }
  if (!name) {
    
    for (const [k, v] of Object.entries(combined)) {
      if (k.toLowerCase().includes('name') && typeof v === 'string' && v.trim() && !k.toLowerCase().includes('file') && !k.toLowerCase().includes('form')) {
        name = v.trim();
        break;
      }
    }
  }
  name = typeof name === 'string' ? name.trim() : (name ? String(name) : 'Visitor');

  let email = findValue([
    'email', 'emailAddress', 'email_address', 'e-mail', 'mail', 'leadEmail', 'lead_email',
    'contactEmail', 'contact_email', 'senderEmail', 'sender_email', 'userEmail', 'user_email', 'fromEmail'
  ]);
  if (!email) {
    
    for (const [_, v] of Object.entries(combined)) {
      if (typeof v === 'string' && v.includes('@') && v.includes('.')) {
        email = v.trim();
        break;
      }
    }
  }
  email = typeof email === 'string' ? email.trim() : (email ? String(email) : '');

  let phone = findValue([
    'phone', 'phoneNumber', 'phone_number', 'telephone', 'mobile', 'cell', 'tel',
    'leadPhone', 'lead_phone', 'contactPhone', 'contact_phone', 'contactNumber', 'contact_number'
  ]);
  phone = typeof phone === 'string' ? phone.trim() : (phone ? String(phone) : '');

  let subject = findValue(['subject', 'topic', 'title', 'reason', 'inquiryType', 'inquiry_type', 'service', 'interest']);
  subject = typeof subject === 'string' ? subject.trim() : '';

  let message = findValue([
    'message', 'msg', 'comment', 'comments', 'inquiry', 'description', 'notes', 'feedback',
    'details', 'query', 'body', 'content', 'text', 'question', 'questions', 'project_details',
    'projectDetails', 'about', 'requirement', 'requirements', 'leadMessage', 'lead_message'
  ]);
  message = typeof message === 'string' ? message.trim() : (message ? String(message) : '');

  const formTitle = findValue(['formTitle', 'form_title', 'formName', 'form_name', 'form_id', 'formId', 'form', 'formType', 'form_type']) || 'Website Form';
  const formId = findValue(['formId', 'form_id']) || 'form';
  const pageTitle = findValue(['pageTitle', 'page_title', 'sourcePage', 'source_page', 'page', 'url', 'sourceUrl', 'source_url', 'pathname']) || 'Website';
  const sourcePage = findValue(['sourcePage', 'source_page', 'pageTitle', 'page_title', 'url', 'page']) || pageTitle;
  const formType = findValue(['formType', 'form_type', 'type']) || (subject ? `Inquiry: ${subject}` : 'General Inquiry');

  const internalKeys = new Set([
    'id', 'createdAt', 'created_at', 'submittedAt', 'submitted_at', 'updatedAt', 'updated_at',
    'timestamp', 'status', 'isStarred', 'isRead', 'notes', 'source', 'formId', 'form_id',
    'formTitle', 'form_title', 'formName', 'form_name', 'formType', 'form_type',
    'pageTitle', 'page_title', 'sourcePage', 'source_page', 'rawDoc', 'data', 'formData',
    'values', 'fields', 'payload', 'submission', 'name', 'email', 'phone', 'message'
  ]);

  const customFields: Record<string, any> = {};

  for (const [k, v] of Object.entries(combined)) {
    const normKey = k.toLowerCase().replace(/[\s_\-:]+/g, '');
    let isInternal = internalKeys.has(k) || internalKeys.has(normKey);

    if (v === name && (k.toLowerCase().includes('name') || k.toLowerCase().includes('author'))) isInternal = true;
    if (v === email && k.toLowerCase().includes('email')) isInternal = true;
    if (v === phone && k.toLowerCase().includes('phone')) isInternal = true;
    if (v === message && (k.toLowerCase().includes('message') || k.toLowerCase().includes('comment') || k.toLowerCase().includes('inquiry'))) isInternal = true;

    if (!isInternal && v !== undefined && v !== null && String(v).trim() !== '') {
      customFields[k] = v;
    }
  }

  if (raw.customFields && typeof raw.customFields === 'object') {
    Object.assign(customFields, raw.customFields);
  }

  if (!message && Object.keys(customFields).length > 0) {
    for (const [k, v] of Object.entries(customFields)) {
      if (typeof v === 'string' && v.length > 20) {
        message = `${k}: ${v}`;
        break;
      }
    }
  }

  const status = raw.status || (raw.isRead ? 'read' : 'new');
  const isRead = Boolean(raw.isRead || raw.status === 'read' || raw.status === 'contacted' || raw.status === 'archived');
  const isStarred = Boolean(raw.isStarred);
  const notes = raw.notes || '';

  return {
    id: docId,
    formId: String(formId),
    formTitle: String(formTitle),
    pageTitle: String(pageTitle),
    sourcePage: String(sourcePage),
    formType: String(formType),
    name,
    email,
    phone,
    subject,
    message,
    status,
    isStarred,
    isRead,
    customFields,
    data: combined,
    submittedAt,
    createdAt: submittedAt,
    source: raw.source || 'forms_firebase',
    notes,
  };
}

const STORAGE_KEY_FORMS_FIREBASE_CONFIG = 'forms_firebase_custom_config';
const STORAGE_KEY_LOCAL_SUBMISSIONS = 'forms_local_submissions_cache';

export function getFormsFirebaseConfig(): FormsFirebaseConfig {
  
  const metaEnv = (import.meta as any).env || {};
  const envApiKey = metaEnv.VITE_FORMS_FIREBASE_API_KEY;
  const envProjectId = metaEnv.VITE_FORMS_FIREBASE_PROJECT_ID;

  if (envApiKey && envProjectId) {
    return {
      apiKey: envApiKey.trim(),
      authDomain: metaEnv.VITE_FORMS_FIREBASE_AUTH_DOMAIN?.trim() || `${envProjectId.trim()}.firebaseapp.com`,
      projectId: envProjectId.trim(),
      storageBucket: metaEnv.VITE_FORMS_FIREBASE_STORAGE_BUCKET?.trim() || `${envProjectId.trim()}.appspot.com`,
      messagingSenderId: metaEnv.VITE_FORMS_FIREBASE_MESSAGING_SENDER_ID?.trim() || '',
      appId: metaEnv.VITE_FORMS_FIREBASE_APP_ID?.trim() || '',
      firestoreDatabaseId: metaEnv.VITE_FORMS_FIREBASE_DATABASE_ID?.trim() || undefined,
    };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY_FORMS_FIREBASE_CONFIG) || localStorage.getItem('myoffice_forms_firebase_custom_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse forms firebase config from localStorage:', e);
  }

  return {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  };
}

export function saveFormsFirebaseConfig(config: FormsFirebaseConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_FORMS_FIREBASE_CONFIG, JSON.stringify(config));
    
    formsAppInstance = null;
    formsDbInstance = null;
  } catch (e) {
    console.error('Failed to save forms firebase config to localStorage:', e);
  }
}

export function isFormsFirebaseConfigured(config: FormsFirebaseConfig = getFormsFirebaseConfig()): boolean {
  return Boolean(
    config.apiKey && 
    config.apiKey.length > 5 && 
    config.projectId && 
    config.projectId.length > 2
  );
}

let formsAppInstance: FirebaseApp | null = null;
let formsDbInstance: Firestore | null = null;

export function getFormsFirestore(): Firestore | null {
  const config = getFormsFirebaseConfig();
  if (!isFormsFirebaseConfigured(config)) {
    return null;
  }

  try {
    const appName = `forms-app-${config.projectId}`;
    const existingApps = getApps();
    const existingApp = existingApps.find(a => a.name === appName);

    if (existingApp) {
      formsAppInstance = existingApp;
    } else {
      formsAppInstance = initializeApp(config, appName);
    }

    if (!formsDbInstance) {
      if (config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)') {
        formsDbInstance = getFirestore(formsAppInstance, config.firestoreDatabaseId);
      } else {
        formsDbInstance = getFirestore(formsAppInstance);
      }
    }
    return formsDbInstance;
  } catch (err) {
    console.error('Error initializing Forms Firebase Firestore instance:', err);
    return null;
  }
}

export function getLocalSubmissions(): FormSubmission[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LOCAL_SUBMISSIONS) || localStorage.getItem('myoffice_forms_local_submissions_cache');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        
        return parsed.filter(item => item && !item.id?.startsWith('sub_demo_'));
      }
    }
  } catch (e) {
    console.warn('Failed to load local submissions cache:', e);
  }
  return [];
}

export function saveLocalSubmissions(submissions: FormSubmission[]): void {
  try {
    const cleanSubmissions = submissions.filter(item => item && !item.id?.startsWith('sub_demo_'));
    localStorage.setItem(STORAGE_KEY_LOCAL_SUBMISSIONS, JSON.stringify(cleanSubmissions));
    window.dispatchEvent(new Event('forms_submissions_updated'));
  } catch (e) {
    console.error('Failed to save local submissions:', e);
  }
}

export function subscribeToFormsSubmissions(
  callback: (submissions: FormSubmission[]) => void,
  onError?: (err: any) => void
): () => void {
  const db = getFormsFirestore();

  if (!db) {
    const initial = getLocalSubmissions();
    callback(initial);

    const handleLocalUpdate = () => {
      callback(getLocalSubmissions());
    };

    window.addEventListener('forms_submissions_updated', handleLocalUpdate);
    window.addEventListener('storage', handleLocalUpdate);

    return () => {
      window.removeEventListener('forms_submissions_updated', handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
    };
  }

  try {
    const submissionsCol = collection(db, 'submissions');
    const q = query(submissionsCol, orderBy('createdAt', 'desc'), limit(200));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: FormSubmission[] = [];
        snapshot.forEach((docSnap) => {
          items.push(parseFirestoreSubmissionDocument(docSnap.id, docSnap.data()));
        });

        saveLocalSubmissions(items);
        callback(items);
      },
      (error) => {
        console.warn('Forms Firestore real-time listener error (using cache):', error);
        callback(getLocalSubmissions());
        if (onError) onError(error);
      }
    );

    return () => {
      unsubscribe();
    };
  } catch (err) {
    console.error('Failed to subscribe to Forms Firebase submissions:', err);
    callback(getLocalSubmissions());
    if (onError) onError(err);
    return () => {};
  }
}

export async function fetchFormsSubmissions(): Promise<FormSubmission[]> {
  const db = getFormsFirestore();
  if (!db) {
    return getLocalSubmissions();
  }

  try {
    const submissionsCol = collection(db, 'submissions');
    const q = query(submissionsCol, orderBy('createdAt', 'desc'), limit(200));
    const snapshot = await getDocs(q);
    recordFirestoreOperation('read', Math.max(1, snapshot.docs.length));

    const items: FormSubmission[] = [];
    snapshot.forEach((docSnap) => {
      items.push(parseFirestoreSubmissionDocument(docSnap.id, docSnap.data()));
    });

    saveLocalSubmissions(items);
    return items;
  } catch (err) {
    console.warn('Error fetching submissions from Forms Firebase:', err);
    return getLocalSubmissions();
  }
}

export async function updateFormSubmission(
  submissionId: string, 
  updates: Partial<FormSubmission>
): Promise<void> {
  const current = getLocalSubmissions();
  const updatedList = current.map(item => item.id === submissionId ? { ...item, ...updates } : item);
  saveLocalSubmissions(updatedList);

  const db = getFormsFirestore();
  if (db && !submissionId.startsWith('sub_demo_')) {
    try {
      const docRef = doc(db, 'submissions', submissionId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Could not update submission on remote Forms Firebase:', err);
    }
  }
}

export async function deleteFormSubmission(submissionId: string): Promise<void> {
  const current = getLocalSubmissions();
  const updatedList = current.filter(item => item.id !== submissionId);
  saveLocalSubmissions(updatedList);

  const db = getFormsFirestore();
  if (db && !submissionId.startsWith('sub_demo_')) {
    try {
      const docRef = doc(db, 'submissions', submissionId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Could not delete submission from remote Forms Firebase:', err);
    }
  }
}

export async function bulkDeleteFormSubmissions(submissionIds: string[]): Promise<void> {
  const idSet = new Set(submissionIds);
  const current = getLocalSubmissions();
  const updatedList = current.filter(item => !idSet.has(item.id));
  saveLocalSubmissions(updatedList);

  const db = getFormsFirestore();
  if (db) {
    for (const id of submissionIds) {
      if (!id.startsWith('sub_demo_')) {
        try {
          await deleteDoc(doc(db, 'submissions', id));
        } catch (err) {
          console.warn(`Could not delete submission ${id}:`, err);
        }
      }
    }
  }
}

export async function createTestFormSubmission(submissionData?: Partial<FormSubmission>): Promise<FormSubmission> {
  const newSubmission: FormSubmission = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    formId: submissionData?.formId || 'demo_contact',
    formTitle: submissionData?.formTitle || 'Website Contact Form',
    pageTitle: submissionData?.pageTitle || 'Landing Page',
    sourcePage: submissionData?.sourcePage || 'Home Page',
    formType: submissionData?.formType || 'Test Lead',
    name: submissionData?.name || 'Alex Morgan',
    email: submissionData?.email || 'alex.morgan@example.com',
    phone: submissionData?.phone || '+1 (555) 019-2834',
    message: submissionData?.message || 'This is a live test submission connecting website forms to the Inbox dashboard.',
    status: 'new',
    isStarred: false,
    isRead: false,
    customFields: submissionData?.customFields || { company: 'Sample Studio Inc.' },
    data: submissionData?.data || {
      name: submissionData?.name || 'Alex Morgan',
      email: submissionData?.email || 'alex.morgan@example.com',
      phone: submissionData?.phone || '+1 (555) 019-2834',
      company: 'Sample Studio Inc.',
      message: submissionData?.message || 'This is a live test submission connecting website forms to the Inbox dashboard.'
    },
    submittedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    source: 'inbox_manual_test',
  };

  const db = getFormsFirestore();
  if (db) {
    try {
      const docRef = await addDoc(collection(db, 'submissions'), {
        ...newSubmission,
        createdAt: serverTimestamp(),
      });
      newSubmission.id = docRef.id;
    } catch (err) {
      console.warn('Could not write test submission to Forms Firebase:', err);
    }
  }

  const current = getLocalSubmissions();
  saveLocalSubmissions([newSubmission, ...current]);
  return newSubmission;
}

export function exportSubmissionsToCsv(submissions: FormSubmission[]): string {
  if (submissions.length === 0) return '';
  const headers = ['ID', 'Date', 'Name', 'Email', 'Phone', 'Status', 'Form Title', 'Source Page', 'Message'];
  
  const rows = submissions.map(s => [
    `"${s.id}"`,
    `"${new Date(s.submittedAt).toLocaleString()}"`,
    `"${(s.name || '').replace(/"/g, '""')}"`,
    `"${(s.email || '').replace(/"/g, '""')}"`,
    `"${(s.phone || '').replace(/"/g, '""')}"`,
    `"${s.status}"`,
    `"${(s.formTitle || s.formId || '').replace(/"/g, '""')}"`,
    `"${(s.sourcePage || s.pageTitle || '').replace(/"/g, '""')}"`,
    `"${(s.message || '').replace(/"/g, '""')}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
