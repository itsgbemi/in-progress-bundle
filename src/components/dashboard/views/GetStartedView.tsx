import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Search,
  ChevronRight,
  Check
} from 'lucide-react';
import { DashboardTab } from '../Sidebar';
import {
  checkBrandInfoCompleted,
  getBrandInfo,
  BrandCompletionCheck
} from '../../../services/brandInfoService';
import { getActiveWorkspaceId } from '../../../services/workspaceService';
import { ThreeDotLoading } from '../../ThreeDotLoading';

interface GetStartedViewProps {
  uiTheme: 'dark' | 'light';
  onNavigateTab: (tab: DashboardTab) => void;
  onOpenEditor: () => void;
  workspaceName?: string;
}

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'Branding' | 'Design' | 'Media' | 'SEO' | 'Publishing';
  estimatedTime: string;
  targetTab?: DashboardTab;
  actionLabel: string;
  isActionEditor?: boolean;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'task-1',
    title: 'Customize Brand Identity & Logo',
    description: 'Complete your brand profile in the Brand page by providing your brand name, logo image, and identity details.',
    category: 'Branding',
    estimatedTime: '2 min',
    targetTab: 'brand',
    actionLabel: 'Open Brand Page',
  },
  {
    id: 'task-2',
    title: 'Build Your First Webpage',
    description: 'Use the drag-and-drop visual canvas editor to customize sections, headers, and hero content.',
    category: 'Design',
    estimatedTime: '5 min',
    isActionEditor: true,
    actionLabel: 'Launch Visual Editor',
  },
  {
    id: 'task-3',
    title: 'Upload Media & Image Assets',
    description: 'Upload high-resolution images, logos, or hero graphics to your media storage vault.',
    category: 'Media',
    estimatedTime: '3 min',
    targetTab: 'media',
    actionLabel: 'Open Media Vault',
  },
  {
    id: 'task-5',
    title: 'Configure Custom Domain & SEO',
    description: 'Connect a custom domain, configure OpenGraph meta tags, and verify search engine indexing.',
    category: 'SEO',
    estimatedTime: '4 min',
    targetTab: 'websites',
    actionLabel: 'Domain & SEO Settings',
  },
  {
    id: 'task-6',
    title: 'Publish Live to GitHub & Cloud',
    description: 'Deploy your website live with one-click automated sync, SSL certification, and hosting.',
    category: 'Publishing',
    estimatedTime: '1 min',
    targetTab: 'websites',
    actionLabel: 'Publish Website',
  },
];

function getChecklistStorageKey(workspaceId?: string): string {
  const wsId = workspaceId || getActiveWorkspaceId();
  if (!wsId || wsId === 'workspace-default') {
    return 'checklist_completed_v1';
  }
  return `checklist_completed_v1_${wsId}`;
}

export const GetStartedView: React.FC<GetStartedViewProps> = ({
  uiTheme,
  onNavigateTab,
  onOpenEditor,
  workspaceName = '',
}) => {
  const isLight = uiTheme === 'light';

  const [brandStatus, setBrandStatus] = useState<BrandCompletionCheck>(() =>
    checkBrandInfoCompleted(getBrandInfo(true))
  );

  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    const currentBrand = checkBrandInfoCompleted(getBrandInfo(true));
    try {
      const key = getChecklistStorageKey();
      const stored =
        localStorage.getItem(key) ||
        localStorage.getItem(`myoffice_${key}`) ||
        (key === 'checklist_completed_v1' ? localStorage.getItem('myoffice_checklist_completed_v1') : null);
      if (stored) {
        const parsed: string[] = JSON.parse(stored);

        if (!currentBrand.isCompleted) {
          return parsed.filter((id) => id !== 'task-1');
        } else if (!parsed.includes('task-1')) {
          return [...parsed, 'task-1'];
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse checklist state', e);
    }
    return currentBrand.isCompleted ? ['task-1'] : [];
  });

  const [filterCategory, setFilterCategory] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(getChecklistStorageKey(), JSON.stringify(completedTaskIds));
    } catch (e) {
      console.warn('Failed to save checklist state', e);
    }
  }, [completedTaskIds]);

  useEffect(() => {
    const syncBrandState = () => {
      const status = checkBrandInfoCompleted(getBrandInfo(true));
      setBrandStatus(status);
      try {
        const stored = localStorage.getItem(getChecklistStorageKey());
        if (stored) {
          const parsed: string[] = JSON.parse(stored);
          setCompletedTaskIds(
            status.isCompleted && !parsed.includes('task-1')
              ? [...parsed, 'task-1']
              : !status.isCompleted
              ? parsed.filter((id) => id !== 'task-1')
              : parsed
          );
          return;
        }
      } catch {}
      setCompletedTaskIds(status.isCompleted ? ['task-1'] : []);
    };

    syncBrandState();
    window.addEventListener('brand_info_updated', syncBrandState);
    window.addEventListener('active_workspace_changed', syncBrandState);
    window.addEventListener('storage', syncBrandState);
    return () => {
      window.removeEventListener('brand_info_updated', syncBrandState);
      window.removeEventListener('active_workspace_changed', syncBrandState);
      window.removeEventListener('storage', syncBrandState);
    };
  }, []);

  const toggleTask = (taskId: string) => {
    setCompletedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const completedCount = completedTaskIds.length;
  const totalCount = CHECKLIST_ITEMS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const filteredTasks = CHECKLIST_ITEMS.filter((item) => {
    const isCompleted = completedTaskIds.includes(item.id);
    if (filterCategory === 'Pending' && isCompleted) return false;
    if (filterCategory === 'Completed' && !isCompleted) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-12 max-w-5xl">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Get Started
        </h1>
      </div>

      <div className="space-y-6">
        <div className="pb-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Setup Progress</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{completedCount} of {totalCount} completed ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto py-1">
            {(['All', 'Pending', 'Completed'] as const).map((cat) => {
              const isActive = filterCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                    isActive
                      ? isLight
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                        : 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                      : isLight
                      ? 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-700'
                      : 'bg-slate-800/80 hover:bg-slate-700 border-slate-750 text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search checklist tasks..."
              className={`w-full pl-9 pr-4 py-2 sm:py-2.5 rounded-full text-xs border outline-none transition-all ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
                  : 'bg-slate-800/80 border-slate-700 text-slate-100 focus:bg-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredTasks.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
              No tasks found matching your filters.
            </div>
          ) : (
            filteredTasks.map((item) => {
              const isDone = completedTaskIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`group p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isDone
                      ? isLight
                        ? 'bg-slate-50/60 border-slate-200/80 opacity-80'
                        : 'bg-slate-950/40 border-slate-800/80 opacity-75'
                      : isLight
                      ? 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs'
                      : 'bg-slate-900 border-slate-800 hover:border-indigo-500/50 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <button
                      onClick={() => toggleTask(item.id)}
                      className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-transform cursor-pointer"
                      title={isDone ? 'Mark Pending' : 'Mark Completed'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
                      )}
                    </button>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm font-bold tracking-tight ${
                            isDone
                              ? 'line-through text-slate-500 dark:text-slate-500'
                              : isLight
                              ? 'text-slate-900'
                              : 'text-slate-100'
                          }`}
                        >
                          {item.title}
                        </span>

                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                          {item.category}
                        </span>

                        <span className="text-[11px] text-slate-400 font-medium">
                          ~ {item.estimatedTime}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {item.description}
                      </p>

                      {item.id === 'task-1' && brandStatus.isCompleted && (
                        <div className="pt-1.5 flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Brand Profile completed: {brandStatus.brandName || 'Configured'} {brandStatus.hasLogo ? '• Logo URL set' : ''}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                    {item.isActionEditor ? (
                      <button
                        onClick={onOpenEditor}
                        className="px-4.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs min-h-[38px]"
                      >
                        <span>{item.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : item.targetTab ? (
                      <button
                        onClick={() => onNavigateTab(item.targetTab!)}
                        className={`px-4.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border min-h-[38px] ${
                          isLight
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                        }`}
                      >
                        <span>{item.actionLabel}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
