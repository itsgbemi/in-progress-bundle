import React, { useState, useEffect } from 'react';
import {
  Globe,
  Check,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Plus,
  Search,
  SlidersHorizontal,
  X,
  Palette,
  Sparkles,
  FileText,
  Columns,
  Sliders,
  PaintBucket,
  Type,
  Box,
  Move,
  PanelTop,
  PanelBottom,
} from 'lucide-react';
import { WebsiteSection } from '../../types';
import { BackgroundPopover } from '../toolbar/BackgroundPopover';
import { FontPickerPopover } from '../toolbar/FontPickerPopover';
import { InlineColorPicker } from './InlineColorPicker';
import { SliderWithInput, ScrollArea } from '../common';
import { PagePropertiesProps, PageSettingsTab, getInspectorStyles, SideSpacingControl } from './PropertiesCommon';

const SOLID_PRESETS = [
  '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8',
  '#64748b', '#475569', '#334155', '#1e293b', '#0f172a', '#000000',
  '#dc2626', '#ef4444',
  '#be123c', '#f43f5e',
  '#ea580c', '#f97316',
  '#d97706', '#f59e0b',
  '#ca8a04', '#eab308',
  '#65a30d', '#84cc16',
  '#16a34a', '#22c55e',
  '#059669', '#10b981',
  '#0d9488', '#14b8a6',
  '#0891b2', '#06b6d4',
  '#0284c7', '#0ea5e9',
  '#2563eb', '#3b82f6',
  '#4338ca', '#4f46e5', '#6366f1',
  '#7c3aed', '#8b5cf6',
  '#9333ea', '#a855f7',
  '#c026d3', '#d946ef',
  '#db2777', '#ec4899',
];

const SolidColorSelector: React.FC<{
  color: string;
  onChange: (hex: string) => void;
  isLight?: boolean;
}> = ({ color, onChange, isLight }) => {
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [showAllSolidPresets, setShowAllSolidPresets] = useState<boolean>(false);
  const PRESET_LIMIT = 14;

  return (
    <div className="space-y-3 pt-1">
      <div>
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          <button
            type="button"
            onClick={() => setShowColorPicker((prev) => !prev)}
            className={`w-6 h-6 rounded-full border shadow-xs cursor-pointer hover:scale-110 transition-transform relative flex items-center justify-center shrink-0 ${
              showColorPicker
                ? 'border-indigo-600 bg-indigo-500/15 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-400/20 dark:text-indigo-400 ring-1 ring-indigo-500/30 font-bold'
                : isLight
                ? 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900'
                : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600 hover:text-white'
            }`}
            title={showColorPicker ? 'Hide color selector' : 'Custom color selector'}
            aria-label="Custom color selector"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          {(showAllSolidPresets ? SOLID_PRESETS : SOLID_PRESETS.slice(0, PRESET_LIMIT)).map((preset) => {
            const isSelected = (color || '').toLowerCase() === preset.toLowerCase();
            return (
              <button
                key={preset}
                type="button"
                onClick={() => onChange(preset)}
                className="w-6 h-6 rounded-full border border-slate-700/60 shadow-xs cursor-pointer hover:scale-110 transition-transform relative flex items-center justify-center shrink-0"
                style={{ backgroundColor: preset }}
                title={preset}
              >
                {isSelected && (
                  <Check
                    className={`w-3.5 h-3.5 mx-auto ${
                      preset === '#ffffff' ||
                      preset === '#f8fafc' ||
                      preset === '#f1f5f9' ||
                      preset === '#e2e8f0'
                        ? 'text-slate-900'
                        : 'text-white'
                    }`}
                  />
                )}
              </button>
            );
          })}
          {SOLID_PRESETS.length > PRESET_LIMIT && (
            <button
              type="button"
              onClick={() => setShowAllSolidPresets((prev) => !prev)}
              className="px-1.5 py-0.5 h-6 text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 shrink-0 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 bg-transparent border-0 hover:underline"
              title={showAllSolidPresets ? 'Show fewer presets' : 'Show all presets'}
            >
              <span>{showAllSolidPresets ? 'Show Less' : `+${SOLID_PRESETS.length - PRESET_LIMIT} More`}</span>
              {showAllSolidPresets ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {showColorPicker && (
        <div className="pt-1">
          <InlineColorPicker
            color={color || '#0f172a'}
            onChange={onChange}
            isLight={isLight}
            canvasHeight="h-32"
          />
        </div>
      )}
    </div>
  );
};

const getMaxWidthNumericValue = (val: string | number | undefined): number => {
  if (val === undefined || val === '') return 1280;
  if (typeof val === 'number') return Math.min(val, 1600);
  const str = String(val).trim().toLowerCase();
  if (str === 'full' || str === '100%') return 1600;
  if (str === '7xl') return 1280;
  if (str === '6xl') return 1152;
  if (str === '5xl') return 1024;
  if (str === '4xl') return 896;
  if (str === '3xl') return 768;
  if (str === '2xl') return 672;
  if (str === 'xl') return 576;
  const parsed = parseInt(str.replace(/[^0-9]/g, ''), 10);
  return isNaN(parsed) ? 1280 : Math.min(parsed, 1600);
};

export const PageProperties: React.FC<PagePropertiesProps> = ({
  onUpdateSection,
  page,
  onUpdatePageStyles,
  onOpenSiteSettings,
  uiTheme = 'dark',
  activeTab = 'all',
  onSelectTab,
}) => {
  const [currentTab, setCurrentTab] = useState<PageSettingsTab>(activeTab);
  const [paddingMode, setPaddingMode] = useState<'uniform' | 'pairs' | 'sides'>('uniform');
  const [marginMode, setMarginMode] = useState<'uniform' | 'pairs' | 'sides'>('uniform');

  useEffect(() => {
    if (activeTab) {
      setCurrentTab(activeTab);
    }
  }, [activeTab]);

  const handleTabChange = (tab: PageSettingsTab) => {
    setCurrentTab(tab);
    onSelectTab?.(tab);
  };

  const isLight = uiTheme === 'light';
  const { inputClass, selectClass, labelClass, boxGroupClass } = getInspectorStyles(isLight);

  const updatePageStyle = (key: string, value: any) => {
    if (!page || !onUpdatePageStyles) return;
    onUpdatePageStyles({
      ...(page.globalStyles || {}),
      [key]: value,
    });
  };

  if (!page) return null;
  const g = page.globalStyles || {};

  const headerSec = page.sections.find((s) => s.type === 'header');
  const isHeaderOn = headerSec ? !headerSec.hidden : false;
  const footerSec = page.sections.find((s) => s.type === 'footer');
  const isFooterOn = footerSec ? !footerSec.hidden : false;

  const toggleHeader = () => {
    if (headerSec) {
      onUpdateSection?.({ ...headerSec, hidden: !headerSec.hidden });
    } else if (onUpdateSection) {
      const newHeader: WebsiteSection = {
        id: `header_${Date.now()}`,
        type: 'header',
        title: 'Header Section',
        styles: {
          backgroundColor: isLight ? '#ffffff' : '#0f172a',
          textColor: isLight ? '#0f172a' : '#ffffff',
          paddingY: 16,
          paddingX: 24,
          maxWidth: '7xl',
        },
        elements: [],
      };
      onUpdateSection(newHeader);
    }
  };

  const toggleFooter = () => {
    if (footerSec) {
      onUpdateSection?.({ ...footerSec, hidden: !footerSec.hidden });
    } else if (onUpdateSection) {
      const newFooter: WebsiteSection = {
        id: `footer_${Date.now()}`,
        type: 'footer',
        title: 'Footer Section',
        styles: {
          backgroundColor: isLight ? '#f8fafc' : '#090d16',
          textColor: isLight ? '#64748b' : '#94a3b8',
          paddingY: 48,
          paddingX: 24,
          maxWidth: '7xl',
        },
        elements: [],
      };
      onUpdateSection(newFooter);
    }
  };

  const autoGenerateFileName = () => {
    const slug = (page.title || 'page')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'page';
    onUpdatePageStyles?.(g, page.title, `${slug}.html`);
  };

  const renderDetailsSection = () => (
    <div className="space-y-3.5">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className={labelClass}>Document Title</label>
          <span className="text-[10px] text-slate-400">{(page.title || '').length} chars</span>
        </div>
        <input
          type="text"
          value={page.title}
          onChange={(e) => onUpdatePageStyles?.(g, e.target.value, page.fileName)}
          placeholder="e.g. Home, About Us, Pricing"
          className={inputClass}
        />
        <p className="text-[10px] text-slate-400 mt-1">
          Shown in browser tab title bar and social sharing cards.
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className={labelClass}>File Name / Path (HTML Export)</label>
          <button
            type="button"
            onClick={autoGenerateFileName}
            className="text-[10px] text-indigo-500 hover:text-indigo-400 font-medium cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>Auto-slug</span>
          </button>
        </div>
        <input
          type="text"
          value={
            page.fileName !== undefined
              ? page.fileName
              : `${(page.title || 'page')
                  .toLowerCase()
                  .replace(/[^a-z0-9]/g, '-')
                  .replace(/-+/g, '-')
                  .replace(/^-|-$/g, '') || 'index'}.html`
          }
          onChange={(e) => onUpdatePageStyles?.(g, page.title, e.target.value)}
          placeholder="e.g. index.html or about.html"
          className={`${inputClass} font-mono text-xs`}
        />
        <p className="text-[10px] text-slate-400 mt-1">
          Target output filename when exporting or committing (e.g.{' '}
          <code className="text-indigo-400 font-mono">index.html</code>).
        </p>
      </div>
    </div>
  );

  const renderLayoutSection = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center justify-between py-0.5">
          <span className={labelClass.replace('mb-1.5', '')}>Header</span>
          <button
            type="button"
            onClick={toggleHeader}
            aria-label="Toggle Header"
            className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
              isHeaderOn ? 'bg-indigo-600' : isLight ? 'bg-slate-300' : 'bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-xs ${
                isHeaderOn ? 'left-4.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-0.5">
          <span className={labelClass.replace('mb-1.5', '')}>Footer</span>
          <button
            type="button"
            onClick={toggleFooter}
            aria-label="Toggle Footer"
            className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
              isFooterOn ? 'bg-indigo-600' : isLight ? 'bg-slate-300' : 'bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-xs ${
                isFooterOn ? 'left-4.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="space-y-2.5 pt-4">
        <SliderWithInput
          label="Max-width"
          value={getMaxWidthNumericValue(g.maxWidth)}
          onChange={(val) => {
            if (val >= 1600) {
              updatePageStyle('maxWidth', '1600px');
            } else if (val === 1280) {
              updatePageStyle('maxWidth', '7xl');
            } else if (val === 1152) {
              updatePageStyle('maxWidth', '6xl');
            } else if (val === 1024) {
              updatePageStyle('maxWidth', '5xl');
            } else {
              updatePageStyle('maxWidth', `${val}px`);
            }
          }}
          min={480}
          max={1600}
          step={10}
          unit="px"
          hideValueBadge={true}
          isLight={isLight}
          labelClass={labelClass}
        />
      </div>

      <div className="pt-2 space-y-5">
        <SideSpacingControl
          label="Padding"
          values={{
            top: g.paddingTop ?? g.paddingY ?? 0,
            bottom: g.paddingBottom ?? g.paddingY ?? 0,
            left: g.paddingLeft ?? g.paddingX ?? 0,
            right: g.paddingRight ?? g.paddingX ?? 0,
          }}
          onChange={(vals) => {
            if (onUpdatePageStyles) {
              onUpdatePageStyles({
                ...g,
                paddingY: vals.top === vals.bottom ? vals.top : g.paddingY,
                paddingX: vals.left === vals.right ? vals.left : g.paddingX,
                paddingTop: vals.top,
                paddingBottom: vals.bottom,
                paddingLeft: vals.left,
                paddingRight: vals.right,
              });
            }
          }}
          mode={paddingMode}
          onModeChange={setPaddingMode}
          min={0}
          max={120}
          step={1}
          unit="px"
          isLight={isLight}
          labelClass={labelClass}
        />

        <div>
          <SideSpacingControl
            label="Margin"
            values={{
              top: g.marginTop ?? g.marginY ?? 0,
              bottom: g.marginBottom ?? g.marginY ?? 0,
              left: g.marginLeft ?? g.marginX ?? 0,
              right: g.marginRight ?? g.marginX ?? 0,
            }}
            onChange={(vals) => {
              if (onUpdatePageStyles) {
                onUpdatePageStyles({
                  ...g,
                  marginY: vals.top === vals.bottom ? vals.top : g.marginY,
                  marginX: vals.left === vals.right ? vals.left : g.marginX,
                  marginTop: vals.top,
                  marginBottom: vals.bottom,
                  marginLeft: vals.left,
                  marginRight: vals.right,
                });
              }
            }}
            mode={marginMode}
            onModeChange={setMarginMode}
            min={0}
            max={120}
            step={1}
            unit="px"
            isLight={isLight}
            labelClass={labelClass}
          />
        </div>
      </div>
    </div>
  );

  const renderBackgroundSection = () => (
    <div>
      <BackgroundPopover
        styles={g as any}
        onUpdateStyle={(key, val) => {
          if (onUpdatePageStyles) {
            onUpdatePageStyles({
              ...g,
              [key]: val,
            });
          }
        }}
        onUpdateStyles={(bgUpdates) => {
          if (onUpdatePageStyles) {
            onUpdatePageStyles({
              ...g,
              ...bgUpdates,
            });
          }
        }}
        isLight={isLight}
        allowImage={true}
        hideNone={true}
        hideSpacingAndRadius={true}
      />
    </div>
  );

  const renderPrimaryColorSection = () => (
    <div className="space-y-3">
      <SolidColorSelector
        color={g.primaryColor || '#6366f1'}
        onChange={(hex) => updatePageStyle('primaryColor', hex)}
        isLight={isLight}
      />
    </div>
  );

  const renderTextColorSection = () => (
    <div className="space-y-3">
      <SolidColorSelector
        color={g.textColor || (isLight ? '#0f172a' : '#ffffff')}
        onChange={(hex) => updatePageStyle('textColor', hex)}
        isLight={isLight}
      />
    </div>
  );

  const renderTypographySection = () => (
    <div className="space-y-3">
      <FontPickerPopover
        currentFont={g.fontFamily || 'Plus Jakarta Sans'}
        currentWeight={g.fontWeight || 400}
        onSelectFont={(fontFamily, weight) => {
          if (!page || !onUpdatePageStyles) return;
          const updates: any = {
            ...(page.globalStyles || {}),
            fontFamily,
          };
          if (weight !== undefined) {
            updates.fontWeight = weight;
          }
          onUpdatePageStyles(updates);
        }}
        isLight={isLight}
      />
    </div>
  );

  const renderScrollbarSection = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={labelClass}>Width</label>
            <span className="text-[10px] font-mono text-indigo-400">{g.scrollbarWidth || 8}px</span>
          </div>
          <input
            type="range"
            min={4}
            max={16}
            value={g.scrollbarWidth !== undefined ? g.scrollbarWidth : 8}
            onChange={(e) => updatePageStyle('scrollbarWidth', Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={labelClass}>Radius</label>
            <span className="text-[10px] font-mono text-indigo-400">{g.scrollbarRadius !== undefined ? g.scrollbarRadius : 10}px</span>
          </div>
          <input
            type="range"
            min={0}
            max={20}
            value={g.scrollbarRadius !== undefined ? g.scrollbarRadius : 10}
            onChange={(e) => updatePageStyle('scrollbarRadius', Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Thumb Color</label>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={g.scrollbarThumbColor || '#d3e3fd'}
              onChange={(e) => updatePageStyle('scrollbarThumbColor', e.target.value)}
              className="w-7 h-7 rounded border bg-transparent cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={g.scrollbarThumbColor || '#d3e3fd'}
              onChange={(e) => updatePageStyle('scrollbarThumbColor', e.target.value)}
              className={`${inputClass} text-xs py-1 font-mono uppercase`}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Track Color</label>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={g.scrollbarTrackColor || '#f1f5f9'}
              onChange={(e) => updatePageStyle('scrollbarTrackColor', e.target.value)}
              className="w-7 h-7 rounded border bg-transparent cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={g.scrollbarTrackColor || '#f1f5f9'}
              onChange={(e) => updatePageStyle('scrollbarTrackColor', e.target.value)}
              className={`${inputClass} text-xs py-1 font-mono uppercase`}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-2 overflow-hidden">
        <ScrollArea maxHeight="5rem" className="pr-1">
          <div className="text-[10px] text-slate-400 space-y-1.5 py-1">
            <p className="font-semibold text-slate-300">Live Scrollbar Preview</p>
            <p>Uniform scrollbar with directional arrows and draggable thumb.</p>
            <p>Scroll up and down using the arrows, thumb, or mouse wheel to preview.</p>
            <p className="text-[9px] text-slate-500">Fully responsive across all devices and themes.</p>
          </div>
        </ScrollArea>
      </div>
    </div>
  );

  return (
    <div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
      
      {currentTab === 'details' && renderDetailsSection()}
      {(currentTab === 'layout' || currentTab === 'spacing') && renderLayoutSection()}
      {currentTab === 'background' && renderBackgroundSection()}
      {currentTab === 'typography' && renderTypographySection()}
      {(currentTab === 'primary-color' || currentTab === 'colors') && renderPrimaryColorSection()}
      {currentTab === 'text-color' && renderTextColorSection()}
      {currentTab === 'scrollbar' && renderScrollbarSection()}

      {currentTab === 'all' && (
        <div className="space-y-5">
          {renderLayoutSection()}
          <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/80">
            {renderDetailsSection()}
          </div>
          <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/80">
            {renderBackgroundSection()}
          </div>
          <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/80">
            {renderTypographySection()}
          </div>
          <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/80">
            {renderPrimaryColorSection()}
          </div>
          <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/80">
            {renderTextColorSection()}
          </div>
          <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/80">
            {renderScrollbarSection()}
          </div>
        </div>
      )}
    </div>
  );
};
