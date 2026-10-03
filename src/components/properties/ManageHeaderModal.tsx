import React, { useState } from 'react';
import { X, Trash2, Settings, Plus, Check, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import { SelectedElementContext, WebsiteElement, WebsiteSection } from '../../types';
import { getInspectorStyles } from './PropertiesCommon';
import { DeleteModal } from '../common/DeleteModal';
interface ManageHeaderModalProps {
    onSelectContext?: (context: SelectedElementContext | null) => void;
    isOpen: boolean;
    onClose: () => void;
    selectedSection: WebsiteSection | null;
    onUpdateSection?: (updatedSection: WebsiteSection) => void;
    onUpdateElement: (updatedElement: WebsiteElement) => void;
    uiTheme?: 'dark' | 'light';
}
export const ManageHeaderModal: React.FC<ManageHeaderModalProps> = ({ onSelectContext, isOpen, onClose, selectedSection, onUpdateSection, onUpdateElement, uiTheme = 'dark', }) => {
    const [expandedSubmenuId, setExpandedSubmenuId] = useState<string | null>(null);
    const [expandedNavLinkIds, setExpandedNavLinkIds] = useState<Record<string, boolean>>({});
    const [deleteTarget, setDeleteTarget] = useState<{
        type: 'link' | 'sub-item' | 'element';
        id: string;
        parentId?: string;
        title: string;
    } | null>(null);
    const isLight = uiTheme === 'light';
    const isManagingHeaderContent = isOpen;
    const setIsManagingHeaderContent = (val: boolean) => {
        if (!val)
            onClose();
    };
    const { inputClass, selectClass, labelClass, boxGroupClass } = getInspectorStyles(isLight);
    const updateSectionProp = (key: string, value: any) => {
        if (!selectedSection || !onUpdateSection)
            return;
        onUpdateSection({
            ...selectedSection,
            [key]: value,
        });
    };
    const renderManageHeaderModal = () => {
        if (!isManagingHeaderContent || !selectedSection)
            return null;
        const layout = selectedSection.headerLayout || 'standard';
        const allElements = selectedSection.elements || [];
        const navLinks = allElements.filter((el) => el.type === 'nav-link');
        const otherElements = allElements.filter((el) => el.type !== 'nav-link');
        const nav1Links = navLinks.filter((el, idx) => el.targetGroup === 'nav1' || (!el.targetGroup && idx < Math.ceil(navLinks.length / 2)));
        const nav2Links = navLinks.filter((el, idx) => el.targetGroup === 'nav2' || (!el.targetGroup && idx >= Math.ceil(navLinks.length / 2)));
        const handleAddNavLink = (targetGroup?: 'nav1' | 'nav2') => {
            const count = navLinks.length + 1;
            const newId = `nav-${Date.now()}`;
            const newEl: WebsiteElement = {
                id: newId,
                type: 'nav-link',
                label: `Link ${count}`,
                content: `Link ${count}`,
                href: '#',
                targetGroup: targetGroup || (layout === 'split' ? (targetGroup || 'nav1') : undefined),
                styles: {
                    fontSize: 14,
                    fontWeight: '500',
                },
            };
            setExpandedNavLinkIds(prev => ({ ...prev, [newId]: true }));
            if (onUpdateSection) {
                onUpdateSection({
                    ...selectedSection,
                    elements: [...allElements, newEl],
                });
            }
        };
        const handleAddSubmenuItem = (parentElementId: string) => {
            const parent = allElements.find((e) => e.id === parentElementId);
            if (!parent)
                return;
            const sublist = parent.submenu || [];
            const newSub = {
                id: `sub-${Date.now()}`,
                label: `Submenu Item ${sublist.length + 1}`,
                href: '#',
            };
            const updatedElements = allElements.map((item) => item.id === parentElementId
                ? { ...item, submenu: [...sublist, newSub] }
                : item);
            if (onUpdateSection) {
                onUpdateSection({ ...selectedSection, elements: updatedElements });
            }
        };
        const handleUpdateSubmenuItem = (parentElementId: string, subId: string, updates: Partial<{
            label: string;
            href: string;
        }>) => {
            const updatedElements = allElements.map((item) => {
                if (item.id === parentElementId && item.submenu) {
                    return {
                        ...item,
                        submenu: item.submenu.map((sub) => sub.id === subId ? { ...sub, ...updates } : sub),
                    };
                }
                return item;
            });
            if (onUpdateSection) {
                onUpdateSection({ ...selectedSection, elements: updatedElements });
            }
        };
        const handleDeleteSubmenuItem = (parentElementId: string, subId: string) => {
            const updatedElements = allElements.map((item) => {
                if (item.id === parentElementId && item.submenu) {
                    return {
                        ...item,
                        submenu: item.submenu.filter((sub) => sub.id !== subId),
                    };
                }
                return item;
            });
            if (onUpdateSection) {
                onUpdateSection({ ...selectedSection, elements: updatedElements });
            }
        };
        const renderNavLinkRow = (el: WebsiteElement, index: number, total: number, showMoveGroup: boolean) => {
            const isExpanded = !!expandedNavLinkIds[el.id];
            const isSubmenuExpanded = expandedSubmenuId === el.id;
            const subCount = el.submenu?.length || 0;
            return (<div key={el.id} className={`rounded-xl border transition-all overflow-hidden ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
          <div onClick={() => setExpandedNavLinkIds(prev => ({ ...prev, [el.id]: !prev[el.id] }))} className={`p-3 flex items-center justify-between gap-2 cursor-pointer select-none transition-colors ${isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/60'}`}>
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <span className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white transition-transform">
                <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}/>
              </span>
              <span className="font-bold text-xs truncate">
                {el.content || el.label || '(Untitled Link)'}
              </span>
              {el.href && (<span className="text-xs font-mono opacity-70 truncate max-w-[120px] hidden sm:inline">
                  {el.href}
                </span>)}
              {subCount > 0 && (<span className="text-xs font-medium opacity-60 shrink-0">
                  ({subCount} {subCount === 1 ? 'sub-item' : 'sub-items'})
                </span>)}
            </div>

            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
              {index > 0 && (<button type="button" onClick={() => {
                        const elIdx = allElements.findIndex((item) => item.id === el.id);
                        if (elIdx > 0) {
                            const newArr = [...allElements];
                            const temp = newArr[elIdx - 1];
                            newArr[elIdx - 1] = newArr[elIdx];
                            newArr[elIdx] = temp;
                            onUpdateSection?.({ ...selectedSection, elements: newArr });
                        }
                    }} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer" title="Move Up">
                  <ChevronUp className="w-3.5 h-3.5"/>
                </button>)}

              {index < total - 1 && (<button type="button" onClick={() => {
                        const elIdx = allElements.findIndex((item) => item.id === el.id);
                        if (elIdx < allElements.length - 1) {
                            const newArr = [...allElements];
                            const temp = newArr[elIdx + 1];
                            newArr[elIdx + 1] = newArr[elIdx];
                            newArr[elIdx] = temp;
                            onUpdateSection?.({ ...selectedSection, elements: newArr });
                        }
                    }} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer" title="Move Down">
                  <ChevronDown className="w-3.5 h-3.5"/>
                </button>)}

              <button type="button" onClick={() => {
                    setDeleteTarget({
                        type: 'link',
                        id: el.id,
                        title: el.content || el.label || 'Navigation Link',
                    });
                }} className="p-1.5 rounded text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer" title="Delete Link">
                <Trash2 className="w-3.5 h-3.5"/>
              </button>
            </div>
          </div>

          {isExpanded && (<div className={`p-3.5 border-t space-y-3 ${isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/60 border-slate-800'}`}>
              <div>
                <label className="block text-[11px] font-bold mb-1">
                  Title Field
                </label>
                <input type="text" value={el.content || el.label || ''} onChange={(e) => {
                        const updated = allElements.map((item) => item.id === el.id ? { ...item, content: e.target.value, label: e.target.value } : item);
                        onUpdateSection?.({ ...selectedSection, elements: updated });
                    }} className={`${inputClass} text-xs py-1.5 px-2.5 font-medium w-full`} placeholder="e.g. Home, About, Services"/>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">
                  Destination URL
                </label>
                <div className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select value={(el.href || '').startsWith('mailto:')
                        ? 'email'
                        : (el.href || '').startsWith('tel:')
                            ? 'phone'
                            : (el.href || '').startsWith('http://') || (el.href || '').startsWith('https://')
                                ? 'external'
                                : 'internal'} onChange={(e) => {
                        const linkType = e.target.value;
                        let raw = (el.href || '').replace(/^(mailto:|tel:|https?:\/\/)/i, '');
                        let newHref = raw;
                        if (linkType === 'email') {
                            newHref = `mailto:${raw || 'contact@example.com'}`;
                        }
                        else if (linkType === 'phone') {
                            newHref = `tel:${raw || '+15550000000'}`;
                        }
                        else if (linkType === 'external') {
                            newHref = `https://${raw || 'example.com'}`;
                        }
                        else {
                            if (!raw.startsWith('#'))
                                raw = `#${raw || 'section'}`;
                            newHref = raw;
                        }
                        const updated = allElements.map((item) => item.id === el.id ? { ...item, href: newHref } : item);
                        onUpdateSection?.({ ...selectedSection, elements: updated });
                    }} className={`${inputClass} text-xs py-1.5 px-2 font-semibold shrink-0 cursor-pointer ${isLight ? 'bg-slate-100' : 'bg-slate-800'}`}>
                      <option value="internal">Internal Link</option>
                      <option value="external">External Link</option>
                      <option value="email">Email Address</option>
                      <option value="phone">Phone Number</option>
                    </select>

                    <input type="text" value={el.href || '#'} onChange={(e) => {
                        const updated = allElements.map((item) => item.id === el.id ? { ...item, href: e.target.value } : item);
                        onUpdateSection?.({ ...selectedSection, elements: updated });
                    }} className={`${inputClass} text-xs py-1.5 px-2.5 font-mono text-xs w-full flex-1`} placeholder={(el.href || '').startsWith('mailto:')
                        ? 'mailto:hello@example.com'
                        : (el.href || '').startsWith('tel:')
                            ? 'tel:+15550000000'
                            : (el.href || '').startsWith('http')
                                ? 'https://example.com'
                                : '#section-id'}/>
                  </div>
                </div>
              </div>

              {showMoveGroup && (<div>
                  <label className="block text-xs font-bold mb-1">
                    Navigation Group
                  </label>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => {
                            const updated = allElements.map((item) => item.id === el.id ? { ...item, targetGroup: 'nav1' as const } : item);
                            onUpdateSection?.({ ...selectedSection, elements: updated });
                        }} className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${(el.targetGroup || 'nav1') === 'nav1'
                            ? isLight ? 'bg-slate-200 border-slate-400 font-bold' : 'bg-slate-800 border-slate-600 font-bold'
                            : isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                      Navigation 1 (Left of Logo)
                    </button>
                    <button type="button" onClick={() => {
                            const updated = allElements.map((item) => item.id === el.id ? { ...item, targetGroup: 'nav2' as const } : item);
                            onUpdateSection?.({ ...selectedSection, elements: updated });
                        }} className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${el.targetGroup === 'nav2'
                            ? isLight ? 'bg-slate-200 border-slate-400 font-bold' : 'bg-slate-800 border-slate-600 font-bold'
                            : isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                      Navigation 2 (Right of Logo)
                    </button>
                  </div>
                </div>)}

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <button type="button" onClick={() => setExpandedSubmenuId(isSubmenuExpanded ? null : el.id)} className="text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSubmenuExpanded ? 'rotate-180' : ''}`}/>
                    <span>Dropdown Submenu ({subCount} {subCount === 1 ? 'item' : 'items'})</span>
                  </button>

                  <button type="button" onClick={() => handleAddSubmenuItem(el.id)} className={`px-2 py-1 rounded text-xs font-bold border flex items-center gap-1 cursor-pointer transition-colors ${isLight ? 'bg-slate-100 border-slate-300 hover:bg-slate-200' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}>
                    <Plus className="w-3.5 h-3.5"/>
                    <span>Add Sub-Item</span>
                  </button>
                </div>

                {isSubmenuExpanded && (<div className={`p-3 rounded-lg border space-y-3 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                    {(!el.submenu || el.submenu.length === 0) ? (<div className="text-xs font-normal opacity-70 italic py-1 text-center">
                        No submenu items configured. Click "Add Sub-Item" to create a dropdown link.
                      </div>) : (el.submenu.map((sub, sIdx) => (<div key={sub.id} className="p-2.5 rounded-lg border space-y-2 relative bg-slate-50/60 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold opacity-80">Submenu Item {sIdx + 1}</span>
                            <button type="button" onClick={() => {
                              setDeleteTarget({
                                type: 'sub-item',
                                id: sub.id,
                                parentId: el.id,
                                title: sub.label || 'Submenu Item',
                              });
                            }} className="p-1 text-red-500 hover:bg-red-500/10 rounded cursor-pointer transition-colors" title="Delete Submenu Item">
                              <Trash2 className="w-3.5 h-3.5"/>
                            </button>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold mb-1">Title Field</label>
                            <input type="text" value={sub.label || ''} onChange={(e) => handleUpdateSubmenuItem(el.id, sub.id, { label: e.target.value })} className={`${inputClass} text-xs py-1.5 px-2.5 font-medium w-full`} placeholder="Submenu Label"/>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold mb-1">URL Field</label>
                            <div className="flex gap-2">
                              <select value={(sub.href || '').startsWith('mailto:')
                                ? 'email'
                                : (sub.href || '').startsWith('tel:')
                                    ? 'phone'
                                    : (sub.href || '').startsWith('http://') || (sub.href || '').startsWith('https://')
                                        ? 'external'
                                        : 'internal'} onChange={(e) => {
                                const linkType = e.target.value;
                                let raw = (sub.href || '').replace(/^(mailto:|tel:|https?:\/\/)/i, '');
                                let newHref = raw;
                                if (linkType === 'email')
                                    newHref = `mailto:${raw || 'contact@example.com'}`;
                                else if (linkType === 'phone')
                                    newHref = `tel:${raw || '+15550000000'}`;
                                else if (linkType === 'external')
                                    newHref = `https://${raw || 'example.com'}`;
                                else {
                                    if (!raw.startsWith('#'))
                                        raw = `#${raw || 'section'}`;
                                    newHref = raw;
                                }
                                handleUpdateSubmenuItem(el.id, sub.id, { href: newHref });
                            }} className={`${inputClass} text-xs py-1 px-2 font-semibold shrink-0 cursor-pointer ${isLight ? 'bg-slate-100' : 'bg-slate-800'}`}>
                                <option value="internal">Internal</option>
                                <option value="external">External</option>
                                <option value="email">Email</option>
                                <option value="phone">Phone</option>
                              </select>
                              <input type="text" value={sub.href || '#'} onChange={(e) => handleUpdateSubmenuItem(el.id, sub.id, { href: e.target.value })} className={`${inputClass} text-xs py-1.5 px-2.5 font-mono w-full flex-1`} placeholder="#url or https://..."/>
                            </div>
                          </div>
                        </div>)))}
                  </div>)}
              </div>
            </div>)}
        </div>);
        };
        return (<div className="fixed inset-0 top-[57px] sm:top-[61px] z-[90] pointer-events-none">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto transition-opacity" onClick={() => setIsManagingHeaderContent(false)}/>

        <div className={`relative z-10 w-full lg:w-[35vw] h-full flex flex-col pointer-events-auto border-r shadow-2xl transition-all duration-300 ease-out overflow-hidden animate-in slide-in-from-left duration-300 ${isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-200'}`}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800/80 shrink-0">
            <div>
              <h3 className="font-bold text-sm">Manage Header Content</h3>
            </div>
            <button type="button" onClick={() => setIsManagingHeaderContent(false)} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer" title="Close panel">
              <X className="w-4 h-4" strokeWidth={1.5}/>
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-5 space-y-6">
            <div>
              <label className="text-xs font-extrabold uppercase tracking-wider block mb-2">
                Layout Preset
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                { id: 'standard', name: 'Standard', desc: 'Logo left, Nav center, Action right' },
                { id: 'centered', name: 'Centered', desc: 'Logo top, Nav centered below' },
                { id: 'split', name: 'Split Navigation', desc: 'Logo center, Nav split left & right' },
                { id: 'stacked', name: 'Stacked', desc: 'Top notice bar, lower nav' },
            ].map((p) => (<button key={p.id} type="button" onClick={() => updateSectionProp('headerLayout', p.id as any)} className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${layout === p.id
                    ? isLight
                        ? 'bg-slate-100 border-slate-400 font-bold shadow-sm'
                        : 'bg-slate-800 border-slate-600 font-bold shadow-sm'
                    : isLight
                        ? 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/60'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60'}`}>
                    <div className="font-bold text-xs mb-0.5 flex items-center justify-between">
                      <span>{p.name}</span>
                      {layout === p.id && <Check className="w-3.5 h-3.5"/>}
                    </div>
                    <div className="text-[10px] font-normal opacity-75">{p.desc}</div>
                  </button>))}
              </div>
            </div>

            {layout === 'split' ? (<div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider">
                    Split Navigation Links
                  </label>
                  <span className="text-[11px] font-normal opacity-75">
                    Left group & Right group
                  </span>
                </div>

                <div className="space-y-4">
                  <div className={`p-3.5 rounded-xl border space-y-3 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-800 border-slate-700'}`}>
                          Navigation 1
                        </span>
                        <span className="text-xs font-bold">Left of Logo</span>
                      </div>
                      <button type="button" onClick={() => handleAddNavLink('nav1')} className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${isLight ? 'bg-white border-slate-300 hover:bg-slate-100' : 'bg-slate-900 border-slate-700 hover:bg-slate-800'}`}>
                        <Plus className="w-3.5 h-3.5"/>
                        <span>Add Link</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {nav1Links.length === 0 ? (<div className="text-xs font-normal opacity-70 text-center py-4 italic border border-dashed border-slate-300 dark:border-slate-800 rounded-lg">
                          No links in Navigation 1
                        </div>) : (nav1Links.map((el, idx) => renderNavLinkRow(el, idx, nav1Links.length, true)))}
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-xl border space-y-3 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-800 border-slate-700'}`}>
                          Navigation 2
                        </span>
                        <span className="text-xs font-bold">Right of Logo</span>
                      </div>
                      <button type="button" onClick={() => handleAddNavLink('nav2')} className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${isLight ? 'bg-white border-slate-300 hover:bg-slate-100' : 'bg-slate-900 border-slate-700 hover:bg-slate-800'}`}>
                        <Plus className="w-3.5 h-3.5"/>
                        <span>Add Link</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {nav2Links.length === 0 ? (<div className="text-xs font-normal opacity-70 text-center py-4 italic border border-dashed border-slate-300 dark:border-slate-800 rounded-lg">
                          No links in Navigation 2
                        </div>) : (nav2Links.map((el, idx) => renderNavLinkRow(el, idx, nav2Links.length, true)))}
                    </div>
                  </div>
                </div>
              </div>) : (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider">
                    Navigation Menu Links
                  </label>
                  <button type="button" onClick={() => handleAddNavLink()} className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${isLight ? 'bg-slate-100 border-slate-300 hover:bg-slate-200' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}>
                    <Plus className="w-3.5 h-3.5"/>
                    <span>Add Navigation Link</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {navLinks.length === 0 ? (<div className="text-xs font-normal opacity-70 text-center py-6 italic border border-dashed border-slate-300 dark:border-slate-800 rounded-xl">
                      No navigation links added yet. Click "Add Navigation Link" above to add one.
                    </div>) : (navLinks.map((el, idx) => renderNavLinkRow(el, idx, navLinks.length, false)))}
                </div>
              </div>)}

            {otherElements.length > 0 && (<div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800/80">
                <label className="text-xs font-extrabold uppercase tracking-wider block">
                  Other Header Elements
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {otherElements.map((el) => (<div key={el.id} className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                      <div className="flex items-center gap-2 truncate">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold border ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-800 border-slate-700'}`}>
                          {el.type}
                        </span>
                        <span className="font-bold text-xs truncate">
                          {el.label || el.content || el.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button type="button" onClick={() => {
                          setIsManagingHeaderContent(false);
                          onSelectContext?.({ sectionId: selectedSection.id, element: el });
                        }} className={`px-2.5 py-1 rounded-lg border text-xs font-bold cursor-pointer flex items-center gap-1 transition-colors ${isLight ? 'bg-slate-100 border-slate-300 hover:bg-slate-200' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}>
                          <Settings className="w-3.5 h-3.5"/>
                          <span>Edit</span>
                        </button>
                        <button type="button" onClick={() => {
                          setDeleteTarget({
                            type: 'element',
                            id: el.id,
                            title: el.label || el.content || el.type || 'Header Element',
                          });
                        }} className="p-1.5 rounded-lg border border-transparent text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer" title="Delete Element">
                          <Trash2 className="w-3.5 h-3.5"/>
                        </button>
                      </div>
                    </div>))}
                </div>
              </div>)}
          </div>

          <div className="flex items-center justify-end px-5 py-3.5 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 shrink-0">
            <button type="button" onClick={() => setIsManagingHeaderContent(false)} className="px-5 py-2 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 cursor-pointer transition-all">
              Done editing
            </button>
          </div>
        </div>

        <DeleteModal
          isOpen={Boolean(deleteTarget)}
          title={
            deleteTarget?.type === 'link'
              ? 'Delete Navigation Link'
              : deleteTarget?.type === 'sub-item'
              ? 'Delete Submenu Item'
              : 'Delete Header Element'
          }
          itemName={deleteTarget?.title}
          itemType={
            deleteTarget?.type === 'link'
              ? 'navigation link'
              : deleteTarget?.type === 'sub-item'
              ? 'submenu item'
              : 'header element'
          }
          isLight={isLight}
          zIndex="z-[100]"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            if (!deleteTarget) return;
            if (deleteTarget.type === 'link' || deleteTarget.type === 'element') {
              const updated = allElements.filter((item) => item.id !== deleteTarget.id);
              onUpdateSection?.({ ...selectedSection, elements: updated });
            } else if (deleteTarget.type === 'sub-item' && deleteTarget.parentId) {
              handleDeleteSubmenuItem(deleteTarget.parentId, deleteTarget.id);
            }
            setDeleteTarget(null);
          }}
        />
      </div>);
    };
    return renderManageHeaderModal();
};
