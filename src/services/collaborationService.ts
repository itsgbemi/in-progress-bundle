import * as Y from 'yjs';
import { FirestoreProvider } from '@gmcfall/yjs-firestore-provider';
import { firebaseApp } from '../lib/firebase';
import { WebsitePage } from '../types';

const docMap: Map<string, Y.Doc> = new Map();
const providerMap: Map<string, FirestoreProvider | null> = new Map();

export function getCollaborationProvider(
  pageId: string,
  userId: string,
  workspaceId: string
): { doc: Y.Doc; provider: FirestoreProvider | null } {
  if (providerMap.has(pageId) && docMap.has(pageId)) {
    return { doc: docMap.get(pageId)!, provider: providerMap.get(pageId) ?? null };
  }

  const ydoc = docMap.get(pageId) || new Y.Doc();
  docMap.set(pageId, ydoc);

  if (!firebaseApp) {
    providerMap.set(pageId, null);
    return { doc: ydoc, provider: null };
  }

  const pathSegments = workspaceId && workspaceId !== 'workspace-default'
    ? ['users', userId, 'workspaces', workspaceId, 'pages', pageId, 'collaboration']
    : ['users', userId, 'pages', pageId, 'collaboration'];

  try {
    const provider = new FirestoreProvider(firebaseApp, ydoc, pathSegments, {
      disableAwareness: true,
      maxUpdatePause: 1000,
    });
    providerMap.set(pageId, provider);
    return { doc: ydoc, provider };
  } catch (err) {
    console.warn('Could not initialize FirestoreProvider for collaboration:', err);
    providerMap.set(pageId, null);
    return { doc: ydoc, provider: null };
  }
}

export function cleanupCollaboration(pageId: string) {
  const provider = providerMap.get(pageId);
  if (provider) {
    try {
      provider.destroy();
    } catch (_) {}
    providerMap.delete(pageId);
  }
  const ydoc = docMap.get(pageId);
  if (ydoc) {
    try {
      ydoc.destroy();
    } catch (_) {}
    docMap.delete(pageId);
  }
}
