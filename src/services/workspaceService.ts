export interface WorkspaceSecrets {
  GMAIL_USER?: string;
  GMAIL_APP_PASSWORD?: string;
  GITHUB_REPO_BRANCH?: string;
  GITHUB_REPO_OWNER?: string;
  GITHUB_REPO_NAME?: string;
  GITHUB_TOKEN?: string;
  FIREBASE_PROJECT_ID?: string;
  [key: string]: string | undefined;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  isDefault?: boolean;
  ownerEmail?: string;
  secrets?: WorkspaceSecrets;
}

const STORAGE_KEY_WORKSPACES = 'workspaces_v1';
const STORAGE_KEY_ACTIVE_WORKSPACE = 'active_workspace_id_v1';

export const DEFAULT_WORKSPACE: Workspace = {
  id: 'workspace-default',
  name: 'Untitled Workspace',
  slug: 'untitled-workspace',
  description: 'Primary workspace',
  createdAt: new Date('2026-01-01').toISOString(),
  isDefault: true,
  ownerEmail: '',
  secrets: {},
};

export const DEFAULT_WORKSPACES: Workspace[] = [DEFAULT_WORKSPACE];

export function getStoredWorkspaces(): Workspace[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_WORKSPACES) || localStorage.getItem('myoffice_workspaces_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse workspace from localStorage:', e);
  }
  return [DEFAULT_WORKSPACE];
}

export function saveWorkspacesLocally(workspaces: Workspace[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_WORKSPACES, JSON.stringify(workspaces));
    window.dispatchEvent(new CustomEvent('workspaces_updated', { detail: { workspaces } }));
  } catch (e) {
    console.warn('Failed to save workspace to localStorage:', e);
  }
}

export const saveStoredWorkspaces = saveWorkspacesLocally;

export function getActiveWorkspaceId(): string {
  try {
    const active = localStorage.getItem(STORAGE_KEY_ACTIVE_WORKSPACE) || localStorage.getItem('myoffice_active_workspace_id_v1');
    if (active) return active;
  } catch {}
  return DEFAULT_WORKSPACE.id;
}

export function setActiveWorkspaceId(workspaceId: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_WORKSPACE, workspaceId);
    window.dispatchEvent(new CustomEvent('active_workspace_changed', { detail: { workspaceId } }));
  } catch (e) {
    console.warn('Failed to set active workspace ID:', e);
  }
}

export function getActiveWorkspace(): Workspace {
  const all = getStoredWorkspaces();
  const activeId = getActiveWorkspaceId();
  return all.find((w) => w.id === activeId) || all[0] || DEFAULT_WORKSPACE;
}
