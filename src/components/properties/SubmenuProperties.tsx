import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import { WebsiteElement } from '../../types';
import { ElementInspectorProps, getInspectorStyles } from './PropertiesCommon';

export const SubmenuProperties: React.FC<ElementInspectorProps> = ({
  selectedContext,
  onUpdateElement,
  onSelectContext,
  onDeleteElement,
  uiTheme = 'dark',
  viewportMode = 'desktop',
}) => {
  const isLight = uiTheme === 'light';
  const { inputClass, selectClass, labelClass, boxGroupClass } = getInspectorStyles(isLight);

  const updateStyle = (key: string, value: any) => {
    if (!selectedContext) return;
    const updatedElement: WebsiteElement = {
      ...selectedContext.element,
      styles: {
        ...(selectedContext.element.styles || {}),
        [key]: value,
      },
    };
    onUpdateElement(updatedElement);
  };

  const updateProp = (key: string, value: any) => {
    if (!selectedContext) return;
    const updatedElement: WebsiteElement = {
      ...selectedContext.element,
      [key]: value,
    };
    onUpdateElement(updatedElement);
  };

  const renderSubmenuProperties = () => {
    if (!selectedContext) return null;
    const { element } = selectedContext;
    const s = element.styles || {};
    const submenuItems = element.submenu || [
      { id: 'sub-1', label: 'Overview', href: '#overview' },
      { id: 'sub-2', label: 'Features', href: '#features' },
      { id: 'sub-3', label: 'Documentation', href: '#docs' },
    ];

    const updateSubItem = (id: string, updates: Partial<{ label: string; href: string }>) => {
      const updated = submenuItems.map((item) => (item.id === id ? { ...item, ...updates } : item));
      updateProp('submenu', updated);
    };

    const addSubItem = () => {
      const newItem = { id: `sub-${Date.now()}`, label: 'New Link', href: '#' };
      updateProp('submenu', [...submenuItems, newItem]);
    };

    const removeSubItem = (id: string) => {
      updateProp('submenu', submenuItems.filter((item) => item.id !== id));
    };

    return (
      <div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
        <div className="flex items-center justify-between">
          <label className={labelClass}>Submenu Items</label>
          <button
            type="button"
            onClick={addSubItem}
            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="space-y-2">
          {submenuItems.map((item) => (
            <div
              key={item.id}
              className={`p-2.5 rounded-xl border space-y-2 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateSubItem(item.id, { label: e.target.value })}
                  placeholder="Link label"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => removeSubItem(item.id)}
                  className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="text"
                value={item.href}
                onChange={(e) => updateSubItem(item.id, { href: e.target.value })}
                placeholder="https:// or #section"
                className={`${inputClass} font-mono text-[10px]`}
              />
            </div>
          ))}
        </div>

        <div className="space-y-3 pt-3 border-t border-slate-700/40">
          <label className={labelClass}>Submenu Position & Alignment</label>
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'left', label: 'Align Left' },
              { id: 'center', label: 'Center' },
              { id: 'right', label: 'Align Right' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => updateStyle('submenuAlign', p.id as any)}
                className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                  (s.submenuAlign || 'left') === p.id
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : isLight
                    ? 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                    : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-slate-700/40">
          <label className={labelClass}>Submenu Container Background</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={s.submenuBg && s.submenuBg.startsWith('#') ? s.submenuBg : '#ffffff'}
              onChange={(e) => updateStyle('submenuBg', e.target.value)}
              className="w-7 h-7 rounded border bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={s.submenuBg || '#ffffff'}
              onChange={(e) => updateStyle('submenuBg', e.target.value)}
              className={`${inputClass} font-mono`}
            />
          </div>
        </div>
      </div>
    );
  }

  return renderSubmenuProperties();
};
