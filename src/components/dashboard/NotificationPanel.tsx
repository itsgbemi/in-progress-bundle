import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  Check,
  CheckCircle2,
  Trash2,
  Inbox,
  MessageSquare,
  Search,
  ArrowRight,
  Filter,
  Clock,
  User,
  Mail,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { FormSubmission, updateFormSubmission, deleteFormSubmission } from '../../services/formsFirebaseService';
import { ScrollArea } from '../common/ScrollArea';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  submissions: FormSubmission[];
  uiTheme: 'dark' | 'light';
  onNavigateTab?: (tab: any, subTab?: string) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  submissions,
  uiTheme,
  onNavigateTab,
}) => {
  const isLight = uiTheme === 'light';
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = submissions.filter((s) => !s.isRead && s.status === 'new').length;

  const filteredSubmissions = submissions.filter((item) => {
    const matchesFilter = filter === 'all' || (!item.isRead && item.status === 'new');
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.email && item.email.toLowerCase().includes(query)) ||
      (item.subject && item.subject.toLowerCase().includes(query)) ||
      (item.message && item.message.toLowerCase().includes(query)) ||
      (item.formTitle && item.formTitle.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  const handleMarkAllRead = () => {
    submissions.forEach((s) => {
      if (!s.isRead) {
        updateFormSubmission(s.id, { isRead: true });
      }
    });
  };

  const handleToggleRead = (e: React.MouseEvent, sub: FormSubmission) => {
    e.stopPropagation();
    updateFormSubmission(sub.id, { isRead: !sub.isRead });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteFormSubmission(id);
  };

  const handleItemClick = (sub: FormSubmission) => {
    if (!sub.isRead) {
      updateFormSubmission(sub.id, { isRead: true });
    }
    onClose();
    if (onNavigateTab) {
      onNavigateTab('inbox');
    }
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen max-w-md flex flex-col shadow-2xl border-l transition-transform animate-in slide-in-from-right duration-250 ease-out ${
            isLight
              ? 'bg-white border-slate-200 text-slate-800'
              : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}
        >
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold tracking-tight">Notifications</h2>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Form submissions & lead alerts
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isLight
                  ? 'border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                  : 'border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-100'
              }`}
              title="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 space-y-3 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notifications..."
                className={`w-full pl-9 pr-8 py-1.5 rounded-xl text-xs border transition-colors focus:outline-none ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500'
                    : 'bg-slate-900 border-slate-700 text-slate-100 focus:border-indigo-500'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filter === 'all'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  All ({submissions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filter === 'unread'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>
          </div>

          <ScrollArea className="flex-1 min-h-0 divide-y divide-slate-100 dark:divide-slate-800/80 p-2">
            {filteredSubmissions.length === 0 ? (
              <div className="py-16 px-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Inbox className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  No notifications found
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  {searchQuery
                    ? 'No notifications match your search query.'
                    : filter === 'unread'
                    ? 'All notifications have been read.'
                    : 'Form submissions and website leads will appear here.'}
                </p>
              </div>
            ) : (
              filteredSubmissions.map((sub) => {
                const isUnread = !sub.isRead && sub.status === 'new';
                return (
                  <div
                    key={sub.id}
                    onClick={() => handleItemClick(sub)}
                    className={`group p-3.5 rounded-2xl transition-all cursor-pointer relative my-1 ${
                      isUnread
                        ? isLight
                          ? 'bg-indigo-50/70 border border-indigo-100 text-slate-900'
                          : 'bg-indigo-950/30 border border-indigo-900/40 text-slate-100'
                        : isLight
                        ? 'hover:bg-slate-50 border border-transparent'
                        : 'hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                          isUnread
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : isLight
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {sub.name ? sub.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span
                            className={`text-xs truncate ${
                              isUnread
                                ? 'font-bold text-slate-900 dark:text-white'
                                : 'font-semibold text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {sub.name || 'New Inquirer'}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                            {formatTime(sub.submittedAt)}
                          </span>
                        </div>

                        {sub.email && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mb-1 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{sub.email}</span>
                          </div>
                        )}

                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {sub.message || sub.subject || 'New website form payload received'}
                        </p>

                        {sub.formTitle && (
                          <div className="mt-2 flex items-center gap-1.5">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {sub.formTitle}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handleToggleRead(e, sub)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            isLight
                              ? 'border-slate-200 bg-white text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                              : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-indigo-400 hover:bg-slate-800'
                          }`}
                          title={sub.isRead ? 'Mark as unread' : 'Mark as read'}
                        >
                          {sub.isRead ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, sub.id)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            isLight
                              ? 'border-slate-200 bg-white text-slate-400 hover:text-red-600 hover:bg-red-50'
                              : 'border-slate-700 bg-slate-900 text-slate-500 hover:text-red-400 hover:bg-slate-800'
                          }`}
                          title="Delete notification"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </ScrollArea>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex items-center justify-between gap-3 shrink-0">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredSubmissions.length} of {submissions.length} leads
            </span>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (onNavigateTab) onNavigateTab('inbox');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <span>View Inbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
