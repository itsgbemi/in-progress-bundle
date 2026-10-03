import React, { useState, useEffect, useRef } from 'react';
import {
Sun,
Moon,
ChevronDown,
Plus,
HardDrive,
Settings,
Bell,
Inbox,
TrendingUp,
FileText,
SlidersHorizontal,
LayoutGrid,
PowerOff,
} from 'lucide-react';
import { DashboardTab, OverviewHomeIcon, BrandBagIcon, GetStartedNavIcon, WebsiteNavIcon, MobileMenuCloseIcon } from './Sidebar';
import { getSavedBrandingConfig, AppBrandingConfig } from '../../utils/themePreferences';
import { subscribeToFormsSubmissions, FormSubmission } from '../../services/formsFirebaseService';
import { NotificationPanel } from './NotificationPanel';
import { useAuth } from '../../context/AuthContext';
import { Dropdown, DropdownItem, DropdownSeparator } from '../common';

interface DashboardNavbarProps {
currentTab: DashboardTab;
settingsSubTab?: string;
onOpenMobileSidebar: () => void;
onOpenEditor: () => void;
onCreateNewPage?: () => void;
onNavigateTab?: (tab: DashboardTab, subTab?: string) => void;
uiTheme: 'dark' | 'light';
onToggleUiTheme: () => void;
}

const TAB_TITLES: Record<DashboardTab, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
'get-started': { label: 'Get Started', icon: GetStartedNavIcon },
overview: { label: 'Overview', icon: OverviewHomeIcon },
websites: { label: 'Website Management', icon: WebsiteNavIcon },
inbox: { label: 'Inbox & Submissions', icon: Inbox },
brand: { label: 'Brand Identity', icon: BrandBagIcon },
media: { label: 'Media Storage', icon: ImageIcon },
settings: { label: 'Workspace Preferences', icon: SlidersHorizontal },
};

function ImageIcon({ className }: { className?: string }) {
return (
<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
<circle cx="9" cy="9" r="2"/>
<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
</svg>
);
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
currentTab,
settingsSubTab: _settingsSubTab,
onOpenMobileSidebar,
onOpenEditor: _onOpenEditor,
onCreateNewPage,
onNavigateTab,
uiTheme,
onToggleUiTheme,
}) => {
const { logout } = useAuth();
const isLight = uiTheme === 'light';
const [branding, setBranding] = useState<AppBrandingConfig>(getSavedBrandingConfig());
const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
const dropdownRef = useRef<HTMLDivElement>(null);
const notificationRef = useRef<HTMLDivElement>(null);
const quickActionsTimerRef = useRef<NodeJS.Timeout | null>(null);

const handleQuickActionsMouseEnter = () => {
if (quickActionsTimerRef.current) clearTimeout(quickActionsTimerRef.current);
setIsQuickActionsOpen(true);
};

const handleQuickActionsMouseLeave = () => {
quickActionsTimerRef.current = setTimeout(() => {
setIsQuickActionsOpen(false);
}, 150);
};

useEffect(() => {
return () => {
if (quickActionsTimerRef.current) clearTimeout(quickActionsTimerRef.current);
};
}, []);

useEffect(() => {
const unsub = subscribeToFormsSubmissions((items) => {
setSubmissions(items);
});
return () => unsub();
}, []);

const unreadCount = submissions.filter(s => !s.isRead && s.status === 'new').length;

useEffect(() => {
const handleBrandingUpdate = () => {
setBranding(getSavedBrandingConfig());
};
window.addEventListener('storage', handleBrandingUpdate);
window.addEventListener('branding_updated', handleBrandingUpdate);
return () => {
window.removeEventListener('storage', handleBrandingUpdate);
window.removeEventListener('branding_updated', handleBrandingUpdate);
};
}, []);

useEffect(() => {
const handleClickOutside = (event: MouseEvent) => {
if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
setIsQuickActionsOpen(false);
}
if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
setIsNotificationsOpen(false);
}
};

const handleKeyDown = (event: KeyboardEvent) => {
if (event.key === 'Escape') {
setIsQuickActionsOpen(false);
setIsNotificationsOpen(false);
}
};

if (isQuickActionsOpen || isNotificationsOpen) {
document.addEventListener('mousedown', handleClickOutside);
document.addEventListener('keydown', handleKeyDown);
}
return () => {
document.removeEventListener('mousedown', handleClickOutside);
document.removeEventListener('keydown', handleKeyDown);
};
}, [isQuickActionsOpen, isNotificationsOpen]);

const currentTabInfo = TAB_TITLES[currentTab] || { label: 'Dashboard', icon: LayoutGrid };

return (
<header className={`relative z-30 w-full px-4 sm:px-6 lg:px-8 py-3.5 transition-colors bg-[var(--app-panel)] border-b border-slate-200/50 dark:border-slate-800/50 ${
isLight ? 'text-slate-900' : 'text-slate-100'
}`}>
<div className="max-w-7xl w-full mx-auto flex items-center justify-between">
<div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
<button
onClick={onOpenMobileSidebar}
className={`lg:hidden w-9 h-9 flex items-center justify-center rounded-full border-none transition-all cursor-pointer active:scale-95 shrink-0 ${
isLight
? 'bg-transparent hover:bg-slate-500/10 text-slate-700 hover:text-[var(--brand-primary)]'
: 'bg-transparent hover:bg-white/10 text-slate-200 hover:text-[var(--brand-accent)]'
}`}
title="Open Navigation Menu"
aria-label="Open Navigation Menu"
>
<MobileMenuCloseIcon className="w-5 h-5" />
</button>

<div className="flex items-center min-w-0 flex-1">
<h1 className="text-sm sm:text-base font-bold tracking-tight truncate min-w-0 max-w-[130px] xs:max-w-[180px] sm:max-w-none text-slate-900 dark:text-white" title={currentTabInfo.label}>
{currentTabInfo.label}
</h1>
</div>
</div>

<div className="flex items-center gap-2 sm:gap-3 shrink-0">
<div
className="relative"
ref={dropdownRef}
onMouseEnter={handleQuickActionsMouseEnter}
onMouseLeave={handleQuickActionsMouseLeave}
>
<Dropdown
isOpen={isQuickActionsOpen}
onClose={() => setIsQuickActionsOpen(false)}
align="right"
isLight={isLight}
trigger={
<button
onClick={() => {
setIsQuickActionsOpen((prev) => !prev);
setIsNotificationsOpen(false);
}}
className={`w-9 h-9 sm:w-auto px-0 sm:px-3.5 rounded-full border text-xs font-semibold flex items-center justify-center sm:justify-start gap-2 transition-all cursor-pointer active:scale-95 ${
isQuickActionsOpen
? 'bg-[var(--brand-primary)]/15 border-[var(--brand-primary)]/40 text-[var(--brand-primary)] ring-2 ring-[var(--brand-primary)]/20 dark:bg-[var(--brand-accent)]/20 dark:border-[var(--brand-accent)]/50 dark:text-[var(--brand-accent)] dark:ring-[var(--brand-accent)]/30'
: isLight
? 'bg-transparent hover:bg-slate-500/10 border-slate-300/80 text-slate-700 hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary)]/40'
: 'bg-transparent hover:bg-white/10 border-slate-700/80 text-slate-200 hover:text-[var(--brand-accent)] hover:border-[var(--brand-accent)]/50'
}`}
title="Quick Actions Menu"
>
<Plus className="w-4 h-4 text-current shrink-0 sm:hidden" />
<span className="font-semibold hidden sm:inline">Quick Actions</span>
<ChevronDown className={`hidden sm:inline-block w-3.5 h-3.5 transition-transform duration-200 text-slate-400 ${isQuickActionsOpen ? 'rotate-180' : ''}`} />
</button>
}
>
{onCreateNewPage && (
<DropdownItem
onClick={() => {
setIsQuickActionsOpen(false);
onCreateNewPage();
}}
icon={<Plus className="w-4 h-4" />}
>
New Website / Page
</DropdownItem>
)}

{onNavigateTab && (
<>
<DropdownItem
onClick={() => {
setIsQuickActionsOpen(false);
onNavigateTab('inbox');
}}
icon={<Inbox className="w-4 h-4" />}
>
Inbox Submissions
</DropdownItem>

<DropdownItem
onClick={() => {
setIsQuickActionsOpen(false);
onNavigateTab('media');
}}
icon={<HardDrive className="w-4 h-4" />}
>
Media Storage
</DropdownItem>
</>
)}

<DropdownSeparator />

{onNavigateTab && (
<DropdownItem
onClick={() => {
setIsQuickActionsOpen(false);
onNavigateTab('settings');
}}
icon={<Settings className="w-4 h-4" />}
>
Settings & System
</DropdownItem>
)}

<DropdownItem
variant="danger"
onClick={() => {
setIsQuickActionsOpen(false);
logout();
}}
icon={<PowerOff className="w-4 h-4" />}
>
Log Out
</DropdownItem>
</Dropdown>
</div>

<div className="relative" ref={notificationRef}>
<button
onClick={() => {
setIsNotificationsOpen((prev) => !prev);
setIsQuickActionsOpen(false);
}}
className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all cursor-pointer active:scale-95 relative ${
isNotificationsOpen
? 'bg-[var(--brand-primary)]/15 border-[var(--brand-primary)]/40 text-[var(--brand-primary)] ring-2 ring-[var(--brand-primary)]/20 dark:bg-[var(--brand-accent)]/20 dark:border-[var(--brand-accent)]/50 dark:text-[var(--brand-accent)] dark:ring-[var(--brand-accent)]/30'
: isLight
? 'bg-transparent hover:bg-slate-500/10 border-slate-300/80 text-slate-700 hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary)]/40'
: 'bg-transparent hover:bg-white/10 border-slate-700/80 text-slate-200 hover:text-[var(--brand-accent)] hover:border-[var(--brand-accent)]/50'
}`}
title={`Notifications ${unreadCount > 0 ? `(${unreadCount} new submissions)` : ''}`}
aria-label="Notifications"
>
<Bell className="w-4 h-4 text-current shrink-0" />
{unreadCount > 0 && (
<span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-950 animate-pulse">
{unreadCount > 9 ? '9+' : unreadCount}
</span>
)}
</button>

<NotificationPanel
isOpen={isNotificationsOpen}
onClose={() => setIsNotificationsOpen(false)}
submissions={submissions}
uiTheme={uiTheme}
onNavigateTab={onNavigateTab}
/>
</div>

<button
type="button"
onClick={(e) => {
e.stopPropagation();
onToggleUiTheme();
}}
className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all cursor-pointer select-none active:scale-95 ${
isLight
? 'bg-transparent hover:bg-slate-500/10 border-slate-300/80 text-slate-700 hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary)]/40'
: 'bg-transparent hover:bg-white/10 border-slate-700/80 text-slate-200 hover:text-[var(--brand-accent)] hover:border-[var(--brand-accent)]/50'
}`}
title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
aria-label={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
>
{isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
</button>
</div>
</div>
</header>
);
};
