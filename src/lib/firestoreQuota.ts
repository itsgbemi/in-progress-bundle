
const STORAGE_KEY_QUOTA = 'firestore_quota_exceeded';
const QUOTA_COOLDOWN_MS = 60 * 60 * 1000;

function getStoredQuotaTimestamp(): number {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_QUOTA) || localStorage.getItem('myoffice_firestore_quota_exceeded');
    if (saved) {
      const num = Number(saved);
      if (!isNaN(num) && num > 0) return num;
    }
  } catch (_) {}
  return 0;
}

let quotaExceededTimestamp = getStoredQuotaTimestamp();

export function isFirestoreQuotaExceeded(): boolean {
  if (!quotaExceededTimestamp) return false;
  if (Date.now() - quotaExceededTimestamp > QUOTA_COOLDOWN_MS) {
    quotaExceededTimestamp = 0;
    try {
      localStorage.removeItem(STORAGE_KEY_QUOTA);
    } catch (_) {}
    return false;
  }
  return true;
}

export function markFirestoreQuotaExceeded(): void {
  const wasAlreadyExceeded = isFirestoreQuotaExceeded();
  quotaExceededTimestamp = Date.now();
  try {
    localStorage.setItem(STORAGE_KEY_QUOTA, String(quotaExceededTimestamp));
  } catch (_) {}
  if (!wasAlreadyExceeded && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('firestore_quota_exceeded', {
      detail: { timestamp: quotaExceededTimestamp }
    }));
  }
}

export function resetFirestoreQuotaStatus(): void {
  quotaExceededTimestamp = 0;
  try {
    localStorage.removeItem(STORAGE_KEY_QUOTA);
  } catch (_) {}
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('firestore_quota_reset'));
  }
}

export function isQuotaError(err: any): boolean {
  if (!err) return false;
  const code = err.code || err.name || '';
  const msg = err.message || (typeof err === 'string' ? err : '');
  return (
    code === 'resource-exhausted' ||
    code === 'RESOURCE_EXHAUSTED' ||
    msg.includes('resource-exhausted') ||
    msg.includes('Quota limit exceeded') ||
    msg.includes('Free daily write units') ||
    msg.includes('quota metric')
  );
}

export function handleFirestoreError(err: any, operationDescription = 'Firestore operation'): void {
  if (isQuotaError(err)) {
    markFirestoreQuotaExceeded();
    console.warn(`[Firestore Quota Exceeded] ${operationDescription} switched to local offline cache mode.`);
  } else {
    console.warn(`[Firestore Notice] ${operationDescription}:`, err?.message || err);
  }
}
