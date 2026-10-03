import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Inbox,
  Mail,
  Star,
  Trash2,
  CheckCircle2,
  Search,
  Download,
  Send,
  MessageSquare,
  Phone,
  Globe,
  Tag,
  Check,
  Archive,
  RefreshCw,
  X,
  FileSpreadsheet,
  FileCode,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Code,
  ArrowLeft,
  Clock,
  User,
  ExternalLink,
  Layers,
  Filter
} from 'lucide-react';
import {
  FormSubmission,
  subscribeToFormsSubmissions,
  fetchFormsSubmissions,
  updateFormSubmission,
  deleteFormSubmission,
  bulkDeleteFormSubmissions,
  exportSubmissionsToCsv
} from '../../../services/formsFirebaseService';
import { SearchInput, Select, CheckCircle } from '../../common';

export type InboxSubTab = 'all' | 'new' | 'starred' | 'in_progress' | 'contacted' | 'archived';

interface InboxViewProps {
  uiTheme: 'dark' | 'light';
  activeSubTab?: InboxSubTab;
  onSelectSubTab?: (tab: InboxSubTab) => void;
}

const SUBTAB_CONFIG: Record<InboxSubTab, { label: string; emptyDesc: string }> = {
  all: { label: 'All Inquiries', emptyDesc: 'No form submissions received yet.' },
  new: { label: 'Unread Inquiries', emptyDesc: 'No unread submissions in your inbox.' },
  starred: { label: 'Starred Inquiries', emptyDesc: 'No starred submissions yet.' },
  in_progress: { label: 'In Progress', emptyDesc: 'No submissions currently marked in progress.' },
  contacted: { label: 'Contacted', emptyDesc: 'No submissions marked as contacted.' },
  archived: { label: 'Archived', emptyDesc: 'No archived submissions.' },
};

export const InboxView: React.FC<InboxViewProps> = ({
  uiTheme,
  activeSubTab: propActiveSubTab,
  onSelectSubTab
}) => {
  const isLight = uiTheme === 'light';

  const [internalSubTab, setInternalSubTab] = useState<InboxSubTab>('all');
  const activeSubTab = propActiveSubTab !== undefined ? propActiveSubTab : internalSubTab;

  const handleSelectSubTab = (tab: InboxSubTab) => {
    setInternalSubTab(tab);
    onSelectSubTab?.(tab);
  };

  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormFilter, setSelectedFormFilter] = useState<string>('all');

  const [mobileViewMode, setMobileViewMode] = useState<'list' | 'detail'>('list');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [internalNote, setInternalNote] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [showRawPayload, setShowRawPayload] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const exportDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setIsExportDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const unsub = subscribeToFormsSubmissions((items) => {
      setSubmissions(items);
      if (items.length > 0) {
        setSelectedSubmissionId((prev) => {
          if (prev && items.some(s => s.id === prev)) return prev;
          return items[0].id;
        });
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (mobileViewMode === 'detail' && selectedSubmissionId) {
      const match = submissions.find(s => s.id === selectedSubmissionId);
      if (match) {
        if (activeSubTab === 'new' && (match.isRead || match.status !== 'new')) setMobileViewMode('list');
        if (activeSubTab === 'starred' && !match.isStarred) setMobileViewMode('list');
        if (activeSubTab === 'in_progress' && match.status !== 'in_progress') setMobileViewMode('list');
        if (activeSubTab === 'contacted' && match.status !== 'contacted') setMobileViewMode('list');
        if (activeSubTab === 'archived' && match.status !== 'archived') setMobileViewMode('list');
      }
    }
  }, [activeSubTab]);

  const uniqueForms = useMemo(() => {
    const formTitles = new Set<string>();
    submissions.forEach(s => {
      if (s.formTitle) formTitles.add(s.formTitle);
      else if (s.formId) formTitles.add(s.formId);
    });
    return Array.from(formTitles);
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(item => {
      if (activeSubTab === 'new' && (item.isRead || item.status !== 'new')) return false;
      if (activeSubTab === 'starred' && !item.isStarred) return false;
      if (activeSubTab === 'in_progress' && item.status !== 'in_progress') return false;
      if (activeSubTab === 'contacted' && item.status !== 'contacted') return false;
      if (activeSubTab === 'archived' && item.status !== 'archived') return false;

      if (selectedFormFilter !== 'all') {
        const itemForm = item.formTitle || item.formId;
        if (itemForm !== selectedFormFilter) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name?.toLowerCase().includes(q);
        const matchEmail = item.email?.toLowerCase().includes(q);
        const matchPhone = item.phone?.toLowerCase().includes(q);
        const matchSubject = item.subject?.toLowerCase().includes(q);
        const matchMsg = item.message?.toLowerCase().includes(q);
        const matchForm = (item.formTitle || item.formId)?.toLowerCase().includes(q);
        const matchPage = (item.sourcePage || item.pageTitle)?.toLowerCase().includes(q);

        let matchCustom = false;
        if (item.customFields) {
          matchCustom = Object.entries(item.customFields).some(([k, v]) =>
            k.toLowerCase().includes(q) || String(v).toLowerCase().includes(q)
          );
        }

        if (!matchName && !matchEmail && !matchPhone && !matchSubject && !matchMsg && !matchForm && !matchPage && !matchCustom) {
          return false;
        }
      }

      return true;
    });
  }, [submissions, activeSubTab, selectedFormFilter, searchQuery]);

  const activeSubmission = useMemo(() => {
    if (!selectedSubmissionId) {
      return filteredSubmissions.length > 0 ? filteredSubmissions[0] : null;
    }
    const found = filteredSubmissions.find(s => s.id === selectedSubmissionId);
    if (found) return found;
    return filteredSubmissions.length > 0 ? filteredSubmissions[0] : null;
  }, [filteredSubmissions, selectedSubmissionId]);

  useEffect(() => {
    if (activeSubmission) {
      setInternalNote(activeSubmission.notes || '');
    }
  }, [activeSubmission?.id]);

  const activeSubmissionIndex = useMemo(() => {
    if (!activeSubmission) return -1;
    return filteredSubmissions.findIndex(s => s.id === activeSubmission.id);
  }, [filteredSubmissions, activeSubmission]);

  const unreadCount = useMemo(() => {
    return submissions.filter(s => !s.isRead && s.status === 'new').length;
  }, [submissions]);

  const folderCounts = useMemo(() => ({
    all: submissions.length,
    new: submissions.filter(s => !s.isRead && s.status === 'new').length,
    starred: submissions.filter(s => s.isStarred).length,
    in_progress: submissions.filter(s => s.status === 'in_progress').length,
    contacted: submissions.filter(s => s.status === 'contacted').length,
    archived: submissions.filter(s => s.status === 'archived').length,
  }), [submissions]);

  const currentFolderConfig = useMemo(() => {
    return SUBTAB_CONFIG[activeSubTab] || { label: 'Inquiries', emptyDesc: 'No inquiries found.' };
  }, [activeSubTab]);

  const showNotification = (text: string) => {
    setActionNotice(text);
    setTimeout(() => {
      setActionNotice(null);
    }, 3500);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const items = await fetchFormsSubmissions();
      setSubmissions(items);
      showNotification('Inbox refreshed');
    } catch {
      showNotification('Refreshed local cache');
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  const handleSelectSubmission = (sub: FormSubmission) => {
    setSelectedSubmissionId(sub.id);
    setMobileViewMode('detail');
    if (!sub.isRead) {
      updateFormSubmission(sub.id, { isRead: true, status: sub.status === 'new' ? 'read' : sub.status });
    }
  };

  const handleNavigatePrev = () => {
    if (activeSubmissionIndex > 0) {
      const prevSub = filteredSubmissions[activeSubmissionIndex - 1];
      handleSelectSubmission(prevSub);
    }
  };

  const handleNavigateNext = () => {
    if (activeSubmissionIndex < filteredSubmissions.length - 1 && activeSubmissionIndex >= 0) {
      const nextSub = filteredSubmissions[activeSubmissionIndex + 1];
      handleSelectSubmission(nextSub);
    }
  };

  const handleToggleStar = (e: React.MouseEvent, id: string, currentStarred?: boolean) => {
    e.stopPropagation();
    updateFormSubmission(id, { isStarred: !currentStarred });
    showNotification(!currentStarred ? 'Starred inquiry' : 'Unstarred inquiry');
  };

  const handleToggleSelectOne = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredSubmissions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSubmissions.map(s => s.id));
    }
  };

  const handleUpdateStatus = (status: FormSubmission['status']) => {
    if (!activeSubmission) return;
    updateFormSubmission(activeSubmission.id, { status, isRead: true });
    showNotification(`Status updated to "${status.replace('_', ' ')}"`);
  };

  const handleSaveInternalNote = () => {
    if (!activeSubmission) return;
    updateFormSubmission(activeSubmission.id, { notes: internalNote });
    showNotification('Private note saved');
  };

  const handleExportCsv = () => {
    setIsExportDropdownOpen(false);
    const csvData = exportSubmissionsToCsv(filteredSubmissions);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form-submissions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Exported submissions to CSV');
  };

  const handleExportJson = () => {
    setIsExportDropdownOpen(false);
    const jsonData = JSON.stringify(filteredSubmissions, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form-submissions-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Exported submissions to JSON');
  };

  const handleCopyText = (text: string, keyIdentifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyIdentifier);
    setTimeout(() => setCopiedKey(null), 2000);
    showNotification('Copied to clipboard');
  };

  const handleCopyAllDetails = () => {
    if (!activeSubmission) return;
    const lines = [
      `Name: ${activeSubmission.name || 'Anonymous Visitor'}`,
      `Email: ${activeSubmission.email || 'None'}`,
      `Phone: ${activeSubmission.phone || 'None'}`,
      `Subject: ${activeSubmission.subject || 'None'}`,
      `Source: ${activeSubmission.formTitle || activeSubmission.formId} (${activeSubmission.sourcePage || 'Live'})`,
      `Submitted: ${new Date(activeSubmission.submittedAt).toLocaleString()}`,
      `Status: ${activeSubmission.status}`,
      '',
      `Message:`,
      activeSubmission.message || 'No direct message',
    ];

    if (activeSubmission.customFields && Object.keys(activeSubmission.customFields).length > 0) {
      lines.push('', 'Custom Fields:');
      Object.entries(activeSubmission.customFields).forEach(([k, v]) => {
        lines.push(`- ${k}: ${String(v)}`);
      });
    }

    if (activeSubmission.notes) {
      lines.push('', `Team Notes:`, activeSubmission.notes);
    }

    handleCopyText(lines.join('\n'), 'all_details');
  };

  const handleConfirmSingleDelete = async () => {
    if (!itemToDelete) return;
    await deleteFormSubmission(itemToDelete);
    if (selectedSubmissionId === itemToDelete) {
      const remaining = submissions.filter(s => s.id !== itemToDelete);
      setSelectedSubmissionId(remaining.length > 0 ? remaining[0].id : null);
      if (remaining.length === 0) {
        setMobileViewMode('list');
      }
    }
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
    showNotification('Submission deleted');
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    await bulkDeleteFormSubmissions(selectedIds);
    setSelectedIds([]);
    setIsBulkDeleteModalOpen(false);
    showNotification(`Deleted ${selectedIds.length} submissions`);
  };

  const handleBulkMarkRead = () => {
    selectedIds.forEach(id => {
      updateFormSubmission(id, { isRead: true });
    });
    setSelectedIds([]);
    showNotification('Marked selected as read');
  };

  const handleBulkMarkUnread = () => {
    selectedIds.forEach(id => {
      updateFormSubmission(id, { isRead: false, status: 'new' });
    });
    setSelectedIds([]);
    showNotification('Marked selected as unread');
  };

  const getSubmissionPreview = (sub: FormSubmission): string => {
    if (sub.message && sub.message.trim()) {
      return sub.message.trim();
    }
    if (sub.subject && sub.subject.trim()) {
      return `Subject: ${sub.subject.trim()}`;
    }
    if (sub.customFields && Object.keys(sub.customFields).length > 0) {
      const firstEntry = Object.entries(sub.customFields)[0];
      return `${firstEntry[0].replace(/_/g, ' ')}: ${String(firstEntry[1])}`;
    }
    return 'Website inquiry response captured.';
  };

  const getRelativeTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Recently';
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  const getInitials = (name?: string, email?: string): string => {
    if (name && name.trim() && name.toLowerCase() !== 'visitor') {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (email && email.trim()) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'IN';
  };

  return (
    <div className="space-y-3 sm:space-y-5">
      {actionNotice && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 bg-indigo-600 text-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate">
              Inbox
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
                {unreadCount} New
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center justify-center transition-colors cursor-pointer min-h-[36px] sm:min-h-[38px] ${
              isLight
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 active:bg-slate-100'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 active:bg-slate-700'
            } ${isRefreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
            title="Refresh submissions"
          >
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <div className="relative" ref={exportDropdownRef}>
            <button
              onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer min-h-[36px] sm:min-h-[38px] ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 active:bg-slate-100'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 active:bg-slate-700'
              }`}
              title="Export submissions data"
            >
              <span>Export</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isExportDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isExportDropdownOpen && (
              <div className={`absolute right-0 mt-1.5 w-52 sm:w-56 max-w-[calc(100vw-2rem)] rounded-xl border shadow-xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150 ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-800'
                  : 'bg-slate-900 border-slate-800 text-slate-200'
              }`}>
                <div className="px-3 py-1 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Export Options ({filteredSubmissions.length})
                </div>

                <button
                  onClick={handleExportCsv}
                  className={`w-full text-left px-3 py-2 flex items-center gap-2.5 text-xs transition-colors cursor-pointer ${
                    isLight ? 'hover:bg-slate-50 text-slate-700' : 'hover:bg-slate-800 text-slate-200'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-xs">Export as CSV</div>
                    <div className="text-[10px] text-slate-400">Spreadsheet format (.csv)</div>
                  </div>
                </button>

                <button
                  onClick={handleExportJson}
                  className={`w-full text-left px-3 py-2 flex items-center gap-2.5 text-xs transition-colors cursor-pointer ${
                    isLight ? 'hover:bg-slate-50 text-slate-700' : 'hover:bg-slate-800 text-slate-200'
                  }`}
                >
                  <FileCode className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-xs">Export as JSON</div>
                    <div className="text-[10px] text-slate-400">Raw JSON format (.json)</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto no-scrollbar pb-0.5">
        {([
          { id: 'all', label: 'All Inquiries', icon: Inbox, count: folderCounts.all },
          { id: 'new', label: 'Unread', icon: Mail, count: folderCounts.new },
          { id: 'starred', label: 'Starred', icon: Star, count: folderCounts.starred },
          { id: 'in_progress', label: 'In Progress', icon: Clock, count: folderCounts.in_progress },
          { id: 'contacted', label: 'Contacted', icon: CheckCircle2, count: folderCounts.contacted },
          { id: 'archived', label: 'Archived', icon: Archive, count: folderCounts.archived },
        ] as const).map((tab) => {
          const isActive = activeSubTab === tab.id;
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelectSubTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 min-h-[44px] sm:min-h-[38px] ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : isLight
                    ? 'bg-transparent border border-slate-300/80 lg:border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100'
                    : 'bg-transparent border border-slate-700/80 lg:border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200 active:bg-slate-700'
              }`}
            >
              <IconComp className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold leading-tight ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : isLight
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className={`rounded-2xl border overflow-hidden flex flex-col lg:flex-row min-h-[580px] h-[calc(100vh-13.5rem)] sm:h-[720px] lg:h-[760px] max-h-[85vh] ${
        isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800 shadow-xl'
      }`}>

        <div className={`w-full lg:w-[350px] xl:w-[390px] flex flex-col border-b lg:border-b-0 lg:border-r shrink-0 ${
          mobileViewMode === 'detail' ? 'hidden lg:flex' : 'flex'
        } ${isLight ? 'border-slate-200 bg-slate-50/30' : 'border-slate-800 bg-slate-950/30'}`}>

          <div className="p-2.5 sm:p-3 border-b border-slate-200 dark:border-slate-800 space-y-2">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search name, email, message..."
              isLight={isLight}
            />

            <div className="flex flex-row items-center gap-2.5 sm:gap-3.5">
              <button
                type="button"
                onClick={handleSelectAll}
                className={`px-3 py-2 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                  selectedIds.length > 0 && selectedIds.length === filteredSubmissions.length
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400'
                    : isLight
                    ? 'bg-white border-slate-300/80 text-slate-700 hover:bg-slate-50'
                    : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                }`}
                title={
                  selectedIds.length === filteredSubmissions.length
                    ? 'Deselect all submissions'
                    : 'Select all submissions'
                }
              >
                <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                  selectedIds.length > 0 && selectedIds.length === filteredSubmissions.length
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : selectedIds.length > 0
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : isLight
                    ? 'border-slate-300 bg-white'
                    : 'border-slate-700 bg-slate-800'
                }`}>
                  {selectedIds.length > 0 && selectedIds.length === filteredSubmissions.length ? (
                    <Check className="w-3 h-3 stroke-[3]" />
                  ) : selectedIds.length > 0 ? (
                    <span className="w-2 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                  ) : null}
                </div>
                <span className="text-[11px] font-semibold">
                  {selectedIds.length > 0
                    ? `${selectedIds.length} Selected`
                    : 'Select'}
                </span>
              </button>

              <Select
                value={selectedFormFilter}
                onChange={(e) => setSelectedFormFilter(e.target.value)}
                variant="pill"
                isLight={isLight}
                containerClassName="w-40 sm:w-60"
              >
                <option value="all">All Website Forms ({submissions.length})</option>
                {uniqueForms.map(formName => (
                  <option key={formName} value={formName}>{formName}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="px-3.5 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
              {currentFolderConfig.label}
            </span>
            <span className="text-[11px] text-slate-400 font-medium shrink-0 ml-2">
              {filteredSubmissions.length} {filteredSubmissions.length === 1 ? 'inquiry' : 'inquiries'}
            </span>
          </div>

          {selectedIds.length > 0 && (
            <div className="px-3 py-2 bg-indigo-50 dark:bg-indigo-950/60 border-b border-indigo-200 dark:border-indigo-900/60 flex items-center justify-between text-xs shrink-0">
              <span className="font-semibold text-indigo-700 dark:text-indigo-300">
                {selectedIds.length} Selected
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleBulkMarkRead}
                  className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-medium hover:bg-slate-50 cursor-pointer min-h-[28px]"
                >
                  Mark Read
                </button>
                <button
                  onClick={handleBulkMarkUnread}
                  className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-medium hover:bg-slate-50 cursor-pointer min-h-[28px]"
                >
                  Mark Unread
                </button>
                <button
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                  className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 cursor-pointer min-h-[28px] min-w-[28px] flex items-center justify-center"
                  title="Delete Selected"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 -webkit-overflow-scrolling-touch">
            {filteredSubmissions.length === 0 ? (
              <div className="p-6 sm:p-8 text-center flex flex-col items-center justify-center h-full">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {currentFolderConfig.label} is empty
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  {searchQuery || selectedFormFilter !== 'all'
                    ? 'No submissions match your active filter criteria.'
                    : currentFolderConfig.emptyDesc}
                </p>
              </div>
            ) : (
              filteredSubmissions.map((sub) => {
                const isSelected = activeSubmission?.id === sub.id;
                const isChecked = selectedIds.includes(sub.id);
                const isUnread = !sub.isRead && sub.status === 'new';
                const previewText = getSubmissionPreview(sub);

                return (
                  <div
                    key={sub.id}
                    onClick={() => handleSelectSubmission(sub)}
                    className={`p-3 sm:p-3.5 transition-all cursor-pointer relative group flex items-start gap-2.5 sm:gap-3 ${
                      isSelected
                        ? isLight
                          ? 'bg-indigo-50/90 border-l-3 border-l-indigo-600'
                          : 'bg-indigo-950/40 border-l-3 border-l-indigo-500'
                        : isLight
                        ? 'hover:bg-slate-100/70 active:bg-slate-100 border-l-3 border-l-transparent'
                        : 'hover:bg-slate-800/40 active:bg-slate-800 border-l-3 border-l-transparent'
                    }`}
                  >
                    <div className="pt-0.5">
                      <CheckCircle
                        checked={isChecked}
                        size="sm"
                        isLight={isLight}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSelectOne(e as any, sub.id);
                        }}
                        title={isChecked ? 'Deselect message' : 'Select message'}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                          )}
                          <span className={`text-xs truncate ${isUnread ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                            {sub.name || 'Anonymous Visitor'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                          {getRelativeTime(sub.submittedAt)}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mb-1">
                        {sub.email || sub.phone || 'No direct contact'}
                      </p>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {previewText}
                      </p>

                      <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium truncate max-w-[150px] sm:max-w-[180px]">
                          {sub.formTitle || sub.formId}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => handleToggleStar(e, sub.id, sub.isStarred)}
                            className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer min-h-[28px] min-w-[28px] flex items-center justify-center ${
                              sub.isStarred ? 'text-amber-500' : 'text-slate-400 hover:text-slate-600'
                            }`}
                            title={sub.isStarred ? 'Unstar' : 'Star'}
                          >
                            <Star className={`w-3.5 h-3.5 ${sub.isStarred ? 'fill-amber-500' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className={`flex-1 flex-col min-w-0 bg-transparent overflow-hidden ${
          mobileViewMode === 'detail' ? 'flex' : 'hidden lg:flex'
        }`}>
          {activeSubmission ? (
            <div className="flex-1 flex flex-col h-full overflow-y-auto -webkit-overflow-scrolling-touch">

              <div className={`p-3 sm:p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 ${
                isLight ? 'border-slate-200 bg-slate-50/50' : 'border-slate-800 bg-slate-950/50'
              }`}>

                <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setMobileViewMode('list')}
                    className="lg:hidden p-2 rounded-xl border transition-colors cursor-pointer bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 active:bg-slate-100 min-h-[34px] flex items-center justify-center"
                    title="Back to Inquiries"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  {filteredSubmissions.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <span className="hidden sm:inline">Inquiry</span>
                      <span>{activeSubmissionIndex >= 0 ? activeSubmissionIndex + 1 : 1} of {filteredSubmissions.length}</span>
                      <div className="flex items-center ml-1">
                        <button
                          onClick={handleNavigatePrev}
                          disabled={activeSubmissionIndex <= 0}
                          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer min-h-[30px] min-w-[30px] flex items-center justify-center"
                          title="Previous Inquiry"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleNavigateNext}
                          disabled={activeSubmissionIndex >= filteredSubmissions.length - 1}
                          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer min-h-[30px] min-w-[30px] flex items-center justify-center"
                          title="Next Inquiry"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-between sm:justify-end overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {activeSubmission.email && (
                      <a
                        href={`mailto:${activeSubmission.email}?subject=Re: ${encodeURIComponent(activeSubmission.subject || activeSubmission.formTitle || 'Your Inquiry')}`}
                        className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors min-h-[34px]"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Reply</span>
                      </a>
                    )}

                    <Select
                      value={activeSubmission.status}
                      onChange={(e) => handleUpdateStatus(e.target.value as any)}
                      variant="rounded"
                      selectSize="sm"
                      isLight={isLight}
                      className="font-semibold text-xs"
                      containerClassName="w-auto min-w-[100px] sm:min-w-[140px]"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="in_progress">In Progress</option>
                      <option value="contacted">Contacted</option>
                      <option value="archived">Archived</option>
                      <option value="spam">Spam</option>
                    </Select>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <button
                      onClick={(e) => handleToggleStar(e, activeSubmission.id, activeSubmission.isStarred)}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer min-h-[34px] min-w-[34px] flex items-center justify-center ${
                        activeSubmission.isStarred
                          ? 'text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-950/40'
                          : isLight
                          ? 'border-slate-200 bg-white hover:bg-slate-100 text-slate-600'
                          : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300'
                      }`}
                      title={activeSubmission.isStarred ? 'Unstar Inquiry' : 'Star Inquiry'}
                    >
                      <Star className={`w-3.5 h-3.5 ${activeSubmission.isStarred ? 'fill-amber-500' : ''}`} />
                    </button>

                    <button
                      onClick={handleCopyAllDetails}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer min-h-[34px] min-w-[34px] flex items-center justify-center ${
                        isLight
                          ? 'border-slate-200 bg-white hover:bg-slate-100 text-slate-600'
                          : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300'
                      }`}
                      title="Copy details"
                    >
                      {copiedKey === 'all_details' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => {
                        setItemToDelete(activeSubmission.id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer min-h-[34px] min-w-[34px] flex items-center justify-center"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-5 flex-1 max-w-4xl">

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 pb-3.5 sm:pb-4 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-start gap-3 sm:gap-3.5 min-w-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
                      {getInitials(activeSubmission.name, activeSubmission.email)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <h2 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                          {activeSubmission.name || 'Anonymous Visitor'}
                        </h2>

                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                          activeSubmission.status === 'new'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                            : activeSubmission.status === 'contacted'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : activeSubmission.status === 'in_progress'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20'
                        }`}>
                          {activeSubmission.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-2.5 sm:gap-x-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {activeSubmission.email ? (
                          <div className="flex items-center gap-1.5 group min-w-0">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <a href={`mailto:${activeSubmission.email}`} className="text-indigo-600 dark:text-indigo-400 hover:underline truncate max-w-[200px] sm:max-w-none">
                              {activeSubmission.email}
                            </a>
                            <button
                              onClick={() => handleCopyText(activeSubmission.email, 'sender_email')}
                              className="p-1 hover:text-slate-800 dark:hover:text-slate-100 cursor-pointer shrink-0"
                              title="Copy Email"
                            >
                              {copiedKey === 'sender_email' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400">No email</span>
                        )}

                        {activeSubmission.phone && (
                          <div className="flex items-center gap-1.5 group min-w-0">
                            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
                            <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <a href={`tel:${activeSubmission.phone}`} className="text-slate-700 dark:text-slate-300 hover:underline truncate">
                              {activeSubmission.phone}
                            </a>
                            <button
                              onClick={() => handleCopyText(activeSubmission.phone!, 'sender_phone')}
                              className="p-1 hover:text-slate-800 dark:hover:text-slate-100 cursor-pointer shrink-0"
                              title="Copy Phone"
                            >
                              {copiedKey === 'sender_phone' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col sm:items-end justify-between gap-1 text-[11px] text-slate-500 dark:text-slate-400 shrink-0 pt-1 sm:pt-0">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(activeSubmission.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(activeSubmission.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                      <Globe className="w-3.5 h-3.5 text-cyan-500" />
                      <span className="truncate max-w-[180px] sm:max-w-[200px]">
                        {activeSubmission.formTitle || activeSubmission.formId || 'Website Form'}
                      </span>
                    </div>
                  </div>
                </div>

                {activeSubmission.subject && (
                  <div className={`p-2.5 sm:p-3 rounded-xl border flex items-center gap-2.5 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                  }`}>
                    <Tag className="w-4 h-4 text-indigo-500 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Subject</span>
                      <h3 className="text-xs sm:text-sm font-semibold truncate">{activeSubmission.subject}</h3>
                    </div>
                  </div>
                )}

                  <div className={`rounded-xl border ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                  }`}>
                    <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Message
                      </span>
                      {activeSubmission.message && (
                        <button
                          onClick={() => handleCopyText(activeSubmission.message!, 'main_message')}
                          className="text-[11px] font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedKey === 'main_message' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'main_message' ? 'Copied' : 'Copy'}</span>
                        </button>
                      )}
                    </div>

                    <div className="p-3.5 sm:p-5">
                      {activeSubmission.message ? (
                        <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed select-text font-normal">
                          {activeSubmission.message}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 italic py-1">
                          No freeform message text was provided with this form entry. See submitted form fields below.
                        </div>
                      )}
                    </div>
                  </div>

                  {activeSubmission.customFields && Object.keys(activeSubmission.customFields).length > 0 && (
                    <div className={`rounded-xl border overflow-hidden ${
                      isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                    }`}>
                      <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Form Answers ({Object.keys(activeSubmission.customFields).length})
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">Structured Fields</span>
                      </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {Object.entries(activeSubmission.customFields).map(([key, val]) => {
                        const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
                        const stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
                        return (
                          <div
                            key={key}
                            className={`p-3 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 group transition-colors ${
                              isLight ? 'hover:bg-slate-50/70' : 'hover:bg-slate-800/30'
                            }`}
                          >
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0 sm:w-44 truncate">
                              {displayKey}
                            </span>

                            <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
                              <span className="text-xs font-medium text-slate-800 dark:text-slate-200 break-words select-text">
                                {stringVal}
                              </span>
                              <button
                                onClick={() => handleCopyText(stringVal, key)}
                                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer shrink-0"
                                title="Copy Value"
                              >
                                {copiedKey === key ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className={`rounded-xl border ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                }`}>
                  <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Private Internal Notes
                    </span>
                    <span className="text-[10px] text-slate-400">Team only</span>
                  </div>

                  <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">
                    <textarea
                      rows={3}
                      value={internalNote}
                      onChange={(e) => setInternalNote(e.target.value)}
                      placeholder="Add follow-up notes, status remarks, or team assignments..."
                      className={`w-full p-2.5 sm:p-3 text-xs rounded-xl border outline-none resize-none transition-colors ${
                        isLight
                          ? 'bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
                          : 'bg-slate-950 border-slate-800 text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
                      }`}
                    />

                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveInternalNote}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs cursor-pointer shadow-xs transition-colors min-h-[32px]"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                </div>

                <div className={`rounded-xl border p-3 text-xs ${
                  isLight ? 'bg-slate-50/50 border-slate-200 text-slate-600' : 'bg-slate-950/40 border-slate-800 text-slate-400'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 text-[11px] text-slate-400 truncate">
                      <span>Doc: <span className="font-mono text-slate-600 dark:text-slate-300">{activeSubmission.id}</span></span>
                      {activeSubmission.sourcePage && (
                        <span>• Page: <span className="text-slate-600 dark:text-slate-300">{activeSubmission.sourcePage}</span></span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowRawPayload(!showRawPayload)}
                        className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Code className="w-3.5 h-3.5 text-slate-400" />
                        <span>{showRawPayload ? 'Hide JSON' : 'Inspect JSON'}</span>
                      </button>
                    </div>
                  </div>

                  {showRawPayload && (
                    <div className="mt-2.5 pt-2.5 border-t border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Submission Payload</span>
                        <button
                          onClick={() => handleCopyText(JSON.stringify(activeSubmission.data || activeSubmission, null, 2), 'raw_json')}
                          className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === 'raw_json' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>Copy Payload</span>
                        </button>
                      </div>

                      <pre className="p-2.5 sm:p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[10px] sm:text-[11px] overflow-x-auto leading-relaxed border border-slate-800 max-h-52">
                        {JSON.stringify(activeSubmission.data || activeSubmission, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                <Mail className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No inquiry selected</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Select an inquiry from the list to view contact details, message contents, and reply.
              </p>
            </div>
          )}
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-sm rounded-2xl border shadow-2xl p-4 sm:p-5 space-y-3 sm:space-y-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Delete Inquiry?</h3>
                <p className="text-xs text-slate-400">This action will remove the record permanently.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer min-h-[36px]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSingleDelete}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer shadow-xs min-h-[36px]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-sm rounded-2xl border shadow-2xl p-4 sm:p-5 space-y-3 sm:space-y-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Delete {selectedIds.length} Inquiries?
                </h3>
                <p className="text-xs text-slate-400">All selected submission records will be permanently removed.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer min-h-[36px]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBulkDelete}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer shadow-xs min-h-[36px]"
              >
                Delete All Selected
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
