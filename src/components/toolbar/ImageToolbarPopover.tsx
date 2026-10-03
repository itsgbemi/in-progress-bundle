import React, { useState } from 'react';
import {
  Upload,
  ExternalLink,
  MoveHorizontal,
  MoveVertical,
  Plus,
  Check,
  Crop as CropIcon,
  Maximize2,
} from 'lucide-react';
import { WebsiteElement, ImageFilterMode, ObjectFitMode, ShadowDepth } from '../../types';
import { getInspectorStyles } from '../properties/PropertiesCommon';
import { InlineColorPicker } from '../properties/InlineColorPicker';
import { ImageCropModal } from '../modals/ImageCropModal';
import { ImageInputWithMediaPicker } from '../common';

export type ImageSubTab =
  | 'source'
  | 'aspect'
  | 'size'
  | 'transform'
  | 'filter'
  | 'hover'
  | 'radius'
  | 'border'
  | 'link';

interface ImageToolbarPopoverProps {
  element: WebsiteElement;
  activeTool: string | null;
  onSelectTool: (tool: any) => void;
  onUpdateElement: (updatedElement: WebsiteElement) => void;
  isLight?: boolean;
}

const BORDER_COLOR_PRESETS = [
  '#000000', '#ffffff', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0',
  '#dc2626', '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#16a34a', '#10b981', '#06b6d4', '#0ea5e9', '#3b82f6', '#4f46e5',
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
];

const FILTER_PRESETS: { id: ImageFilterMode; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'grayscale', label: 'Grayscale' },
  { id: 'warm', label: 'Warm' },
  { id: 'vintage', label: 'Vintage' },
  { id: 'darken', label: 'Darken' },
  { id: 'contrast', label: 'Contrast' },
];

export const ImageToolbarPopover: React.FC<ImageToolbarPopoverProps> = ({
  element,
  activeTool,
  onUpdateElement,
  isLight = false,
}) => {
  const { inputClass, selectClass, labelClass, boxGroupClass } = getInspectorStyles(isLight);
  const s = element.styles || {};

  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [showImageCropModal, setShowImageCropModal] = useState<boolean>(false);
  const [radiusMode, setRadiusMode] = useState<'uniform' | 'corners'>(
    s.borderTopLeftRadius !== undefined ||
    s.borderTopRightRadius !== undefined ||
    s.borderBottomLeftRadius !== undefined ||
    s.borderBottomRightRadius !== undefined
      ? 'corners'
      : 'uniform'
  );

  const getCurrentTab = (): ImageSubTab => {
    switch (activeTool) {
      case 'imageSource':
      case 'imageAlt':
        return 'source';
      case 'imageAspect':
        return 'aspect';
      case 'imageSize':
        return 'size';
      case 'imageTransform':
        return 'transform';
      case 'imageAdjust':
        return 'filter';
      case 'imageHover':
      case 'imageShadow':
        return 'hover';
      case 'imageRadius':
        return 'radius';
      case 'imageBorder':
        return 'border';
      case 'imageLink':
        return 'link';
      default:
        return 'source';
    }
  };

  const currentTab = getCurrentTab();

  const updateProp = (key: string, value: any) => {
    const updated: WebsiteElement = {
      ...element,
      [key]: value,
    };
    if (key === 'src') {
      updated.url = value;
    }
    onUpdateElement(updated);
  };

  const updateStyle = (key: string, value: any) => {
    const updated: WebsiteElement = {
      ...element,
      styles: {
        ...(element.styles || {}),
        [key]: value,
      },
    };
    onUpdateElement(updated);
  };

  const updateStyles = (updates: Record<string, any>) => {
    const updated: WebsiteElement = {
      ...element,
      styles: {
        ...(element.styles || {}),
        ...updates,
      },
    };
    onUpdateElement(updated);
  };

  return (
    <div className="space-y-3">
      {currentTab === 'source' && (
        <div className="space-y-3 text-xs">
          <div>
            <ImageInputWithMediaPicker
              label="Image Source"
              value={element.src || element.url || ''}
              onChange={(val) => updateProp('src', val)}
              placeholder="https://images.unsplash.com/... or select from media"
              isLight={isLight}
              variant="default"
              modalTitle="Select Image Source"
            />
          </div>

          <div>
            <label className={labelClass}>Upload Local Image</label>
            <label
              className={`w-full py-2 px-3 rounded-lg border border-dashed flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700'
                  : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <Upload className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-medium">Choose File from Computer</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      if (event.target?.result) {
                        updateProp('src', event.target.result as string);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className={labelClass}>Alt Description (SEO)</label>
              <input
                type="text"
                value={element.alt || ''}
                onChange={(e) => updateProp('alt', e.target.value)}
                placeholder="Image description"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Hover Title / Tooltip</label>
              <input
                type="text"
                value={element.title || ''}
                onChange={(e) => updateProp('title', e.target.value)}
                placeholder="Tooltip title"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      )}

      {currentTab === 'aspect' && (
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl border border-indigo-500/30 bg-indigo-50/40 dark:bg-indigo-950/20 flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <CropIcon className="w-3.5 h-3.5" />
                <span>Interactive Freeform Crop</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Open full cropper modal to crop and frame freely
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowImageCropModal(true)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
            >
              Open Cropper
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className={labelClass}>Aspect Ratio</label>
              <select
                value={s.aspectRatio || 'auto'}
                onChange={(e) => updateStyle('aspectRatio', e.target.value)}
                className={selectClass}
              >
                <option value="auto">Auto (Original)</option>
                <option value="1/1">1:1 Square</option>
                <option value="16/9">16:9 Widescreen</option>
                <option value="4/3">4:3 Standard Photo</option>
                <option value="21/9">21:9 Ultra-Wide</option>
                <option value="3/2">3:2 Classic Photo</option>
                <option value="3/4">3:4 Portrait</option>
                <option value="9/16">9:16 Story / Reel</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Object Fit Mode</label>
              <select
                value={s.objectFit || 'cover'}
                onChange={(e) => updateStyle('objectFit', e.target.value as ObjectFitMode)}
                className={selectClass}
              >
                <option value="cover">Cover (Fill & Crop)</option>
                <option value="contain">Contain (Fit Entire)</option>
                <option value="fill">Fill (Stretch)</option>
                <option value="none">None (Original Size)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>Zoom / Framing Scale</label>
                <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                  {s.cropZoom || 100}%
                </span>
              </div>
              <input
                type="range"
                min={100}
                max={250}
                step={5}
                value={s.cropZoom || 100}
                onChange={(e) => updateStyle('cropZoom', Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Pan X Offset</label>
                  <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                    {s.cropPanX || 0}%
                  </span>
                </div>
                <input
                  type="range"
                  min={-50}
                  max={50}
                  step={2}
                  value={s.cropPanX || 0}
                  onChange={(e) => updateStyle('cropPanX', Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Pan Y Offset</label>
                  <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                    {s.cropPanY || 0}%
                  </span>
                </div>
                <input
                  type="range"
                  min={-50}
                  max={50}
                  step={2}
                  value={s.cropPanY || 0}
                  onChange={(e) => updateStyle('cropPanY', Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Focal Point Alignment</label>
              <div className="grid grid-cols-3 gap-1 max-w-[120px]">
                {[
                  'top left', 'top center', 'top right',
                  'center left', 'center center', 'center right',
                  'bottom left', 'bottom center', 'bottom right',
                ].map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => updateStyle('objectPosition', pos)}
                    className={`h-6 rounded border transition-colors cursor-pointer ${
                      (s.objectPosition || 'center center') === pos
                        ? 'bg-indigo-600 border-indigo-600'
                        : isLight
                        ? 'bg-white border-slate-300 hover:bg-slate-100'
                        : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                    }`}
                    title={pos}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentTab === 'size' && (
        <div className="space-y-3 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Image Width</label>
              <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                {s.width || '100%'}
              </span>
            </div>
            <div className={`grid grid-cols-5 gap-1 p-1 mb-2 ${boxGroupClass}`}>
              {['25%', '50%', '75%', '100%', 'auto'].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => updateStyle('width', w)}
                  className={`py-1 text-[10px] rounded-md font-medium transition-all cursor-pointer ${
                    s.width === w || (w === '100%' && !s.width)
                      ? 'bg-indigo-600 text-white font-semibold'
                      : isLight
                      ? 'text-slate-600 hover:bg-slate-200'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={
                  typeof s.width === 'string' && s.width.endsWith('%')
                    ? parseInt(s.width, 10)
                    : 100
                }
                onChange={(e) => updateStyle('width', `${e.target.value}%`)}
                className="flex-1 accent-indigo-500 cursor-pointer"
              />
              <div className="flex items-center gap-1 shrink-0">
                <input
                  type="number"
                  min={10}
                  max={100}
                  value={
                    typeof s.width === 'string' && s.width.endsWith('%')
                      ? parseInt(s.width, 10)
                      : 100
                  }
                  onChange={(e) => {
                    const val = Math.min(100, Math.max(10, parseInt(e.target.value, 10) || 100));
                    updateStyle('width', `${val}%`);
                  }}
                  className={`w-14 px-1.5 py-1 text-center text-xs font-semibold rounded border outline-none font-mono ${
                    isLight
                      ? 'border-slate-300 bg-white text-slate-800 focus:border-indigo-500'
                      : 'border-slate-600 bg-slate-900 text-slate-100 focus:border-indigo-400'
                  }`}
                />
                <span className="text-[11px] text-slate-400">%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className={labelClass}>Height (e.g. 300px or auto)</label>
              <input
                type="text"
                value={s.height || ''}
                onChange={(e) => updateStyle('height', e.target.value || undefined)}
                placeholder="auto"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Max Width (e.g. 600px)</label>
              <input
                type="text"
                value={s.maxWidth || ''}
                onChange={(e) => updateStyle('maxWidth', e.target.value || undefined)}
                placeholder="none"
                className={inputClass}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className={labelClass}>Float Alignment</label>
            <div className="flex bg-slate-200/50 dark:bg-slate-800 rounded-lg p-1 mt-1">
              {(['none', 'left', 'right'] as const).map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => updateStyle('float', pos === 'none' ? undefined : pos)}
                  className={`flex-1 text-xs py-1.5 rounded-md capitalize transition-colors cursor-pointer ${
                    (s.float || 'none') === pos
                      ? 'bg-white dark:bg-slate-700 shadow-xs font-semibold text-indigo-600 dark:text-indigo-300'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentTab === 'transform' && (
        <div className="space-y-3 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Rotation Angle</label>
              <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                {s.rotation || 0}°
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={360}
                step={1}
                value={s.rotation || 0}
                onChange={(e) => updateStyle('rotation', Number(e.target.value))}
                className="flex-1 accent-indigo-500 cursor-pointer"
              />
              <div className="flex items-center gap-1 shrink-0">
                <input
                  type="number"
                  min={0}
                  max={360}
                  value={s.rotation || 0}
                  onChange={(e) => {
                    const deg = ((parseInt(e.target.value, 10) || 0) % 360 + 360) % 360;
                    updateStyle('rotation', deg);
                  }}
                  className={`w-14 px-1.5 py-1 text-center text-xs font-semibold rounded border outline-none font-mono ${
                    isLight
                      ? 'border-slate-300 bg-white text-slate-800 focus:border-indigo-500'
                      : 'border-slate-600 bg-slate-900 text-slate-100 focus:border-indigo-400'
                  }`}
                />
                <span className="text-[11px] text-slate-400">°</span>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-1 mt-2">
              {[0, 90, 180, 270, 360].map((deg) => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => updateStyle('rotation', deg % 360)}
                  className={`py-1 text-[10px] rounded-md border font-medium transition-colors cursor-pointer ${
                    (s.rotation || 0) === deg || (deg === 360 && s.rotation === 0)
                      ? 'bg-indigo-600 text-white font-bold border-indigo-600'
                      : isLight
                      ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className={labelClass}>Flip Orientation</label>
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => updateStyle('flipHorizontal', !s.flipHorizontal)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  s.flipHorizontal
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : isLight
                    ? 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                    : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <MoveHorizontal className="w-4 h-4" />
                <span>Flip Horizontal</span>
              </button>
              <button
                type="button"
                onClick={() => updateStyle('flipVertical', !s.flipVertical)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  s.flipVertical
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : isLight
                    ? 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                    : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <MoveVertical className="w-4 h-4" />
                <span>Flip Vertical</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {currentTab === 'filter' && (
        <div className="space-y-3 text-xs">
          <div>
            <label className={labelClass}>Filter Presets</label>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {FILTER_PRESETS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => updateStyle('filter', f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    (s.filter || 'none') === f.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-bold'
                      : isLight
                      ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>Brightness</label>
                <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                  {s.filterBrightness !== undefined ? s.filterBrightness : 100}%
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={150}
                step={5}
                value={s.filterBrightness !== undefined ? s.filterBrightness : 100}
                onChange={(e) => updateStyle('filterBrightness', Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>Contrast</label>
                <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                  {s.filterContrast !== undefined ? s.filterContrast : 100}%
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={150}
                step={5}
                value={s.filterContrast !== undefined ? s.filterContrast : 100}
                onChange={(e) => updateStyle('filterContrast', Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Opacity</label>
              <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                {Math.round((s.opacity !== undefined ? Number(s.opacity) : 1) * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={Math.round((s.opacity !== undefined ? Number(s.opacity) : 1) * 100)}
                onChange={(e) => updateStyle('opacity', Number(e.target.value) / 100)}
                className="flex-1 accent-indigo-500 cursor-pointer"
              />
              <div className="flex items-center gap-1 shrink-0">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={Math.round((s.opacity !== undefined ? Number(s.opacity) : 1) * 100)}
                  onChange={(e) => {
                    const val = Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0));
                    updateStyle('opacity', val / 100);
                  }}
                  className={`w-14 px-1.5 py-1 text-center text-xs font-semibold rounded border outline-none font-mono ${
                    isLight
                      ? 'border-slate-300 bg-white text-slate-800 focus:border-indigo-500'
                      : 'border-slate-600 bg-slate-900 text-slate-100 focus:border-indigo-400'
                  }`}
                />
                <span className="text-[11px] text-slate-400">%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentTab === 'hover' && (
        <div className="space-y-3 text-xs">
          <div>
            <label className={labelClass}>Hover Interaction Effect</label>
            <select
              value={s.hoverEffect || 'none'}
              onChange={(e) => updateStyle('hoverEffect', e.target.value)}
              className={selectClass}
            >
              <option value="none">None (Static)</option>
              <option value="lift">Lift Up (Floating Card Effect)</option>
              <option value="zoom">Smooth Zoom (Ken Burns Focus)</option>
              <option value="grayscale-to-color">B&W to Vibrant Color on Hover</option>
              <option value="glow">Indigo Glowing Border</option>
              <option value="opacity">Subtle Dimming / Brightening</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Shadow / Depth</label>
            <div className={`grid grid-cols-6 gap-1 p-1 ${boxGroupClass}`}>
              {[
                { label: 'None', val: undefined },
                { label: 'SM', val: 'sm' },
                { label: 'MD', val: 'md' },
                { label: 'LG', val: 'lg' },
                { label: 'XL', val: 'xl' },
                { label: '2XL', val: '2xl' },
              ].map((sh) => (
                <button
                  key={sh.label}
                  type="button"
                  onClick={() => updateStyle('shadow', sh.val as ShadowDepth)}
                  className={`py-1 text-[10px] rounded-md font-medium transition-all cursor-pointer ${
                    s.shadow === sh.val || (sh.val === undefined && !s.shadow)
                      ? 'bg-indigo-600 text-white font-semibold'
                      : isLight
                      ? 'text-slate-600 hover:bg-slate-200'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sh.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentTab === 'radius' && (
        <div className="space-y-3 text-xs">
          <div className="flex rounded-lg border p-0.5 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setRadiusMode('uniform')}
              className={`flex-1 py-1 px-1 text-xs font-medium truncate rounded-md transition-colors cursor-pointer ${
                radiusMode === 'uniform'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Uniform
            </button>
            <button
              type="button"
              onClick={() => {
                setRadiusMode('corners');

                const baseVal = s.borderRadius || 0;
                if (s.borderTopLeftRadius === undefined) updateStyle('borderTopLeftRadius', baseVal);
                if (s.borderTopRightRadius === undefined) updateStyle('borderTopRightRadius', baseVal);
                if (s.borderBottomLeftRadius === undefined) updateStyle('borderBottomLeftRadius', baseVal);
                if (s.borderBottomRightRadius === undefined) updateStyle('borderBottomRightRadius', baseVal);
              }}
              className={`flex-1 py-1 px-1 text-xs font-medium truncate rounded-md transition-colors cursor-pointer ${
                radiusMode === 'corners'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Per Corner
            </button>
          </div>

          {radiusMode === 'uniform' ? (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className={labelClass}>All Corners Radius</label>
                  <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                    {s.borderRadius !== undefined ? s.borderRadius : 0}px
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={
                      s.borderRadius !== undefined && s.borderRadius <= 100
                        ? s.borderRadius
                        : s.borderRadius === 999
                        ? 100
                        : 0
                    }
                    onChange={(e) => {
                      updateStyles({
                        borderRadius: Number(e.target.value),
                        borderTopLeftRadius: undefined,
                        borderTopRightRadius: undefined,
                        borderBottomLeftRadius: undefined,
                        borderBottomRightRadius: undefined,
                      });
                    }}
                    className="flex-1 accent-indigo-500 cursor-pointer"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <input
                      type="number"
                      min={0}
                      max={999}
                      value={s.borderRadius !== undefined ? s.borderRadius : 0}
                      onChange={(e) => {
                        const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                        updateStyles({
                          borderRadius: val,
                          borderTopLeftRadius: undefined,
                          borderTopRightRadius: undefined,
                          borderBottomLeftRadius: undefined,
                          borderBottomRightRadius: undefined,
                        });
                      }}
                      className={`w-14 px-1.5 py-1.5 text-center text-xs font-semibold rounded border outline-none font-mono ${
                        isLight
                          ? 'border-slate-300 bg-white text-slate-800 focus:border-indigo-500'
                          : 'border-slate-600 bg-slate-900 text-slate-100 focus:border-indigo-400'
                      }`}
                    />
                    <span className="text-[11px] text-slate-400">px</span>
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Radius Presets</label>
                <div className={`grid grid-cols-5 gap-1 p-1 ${boxGroupClass}`}>
                  {[
                    { label: '0px', val: 0 },
                    { label: '8px', val: 8 },
                    { label: '14px', val: 14 },
                    { label: '24px', val: 24 },
                    { label: 'Circle', val: 999 },
                  ].map((rd) => (
                    <button
                      key={rd.label}
                      type="button"
                      onClick={() => {
                        updateStyles({
                          borderRadius: rd.val,
                          borderTopLeftRadius: undefined,
                          borderTopRightRadius: undefined,
                          borderBottomLeftRadius: undefined,
                          borderBottomRightRadius: undefined,
                        });
                      }}
                      className={`py-1 text-[10px] rounded-md font-medium transition-all cursor-pointer ${
                        s.borderRadius === rd.val ||
                        (rd.val === 0 && (s.borderRadius === undefined || s.borderRadius === 0))
                          ? 'bg-indigo-600 text-white font-semibold'
                          : isLight
                          ? 'text-slate-600 hover:bg-slate-200'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {rd.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (

            <div className="grid grid-cols-2 gap-3 pt-1">
              {[
                { label: 'Top-Left', prop: 'borderTopLeftRadius' as const },
                { label: 'Top-Right', prop: 'borderTopRightRadius' as const },
                { label: 'Bottom-Left', prop: 'borderBottomLeftRadius' as const },
                { label: 'Bottom-Right', prop: 'borderBottomRightRadius' as const },
              ].map(({ label, prop }) => {
                const curVal =
                  s[prop] !== undefined ? (s[prop] as number) : s.borderRadius || 0;
                return (
                  <div key={prop} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-500">{label}</span>
                      <span className="text-[10px] font-mono text-indigo-400">{curVal}px</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="range"
                        min={0}
                        max={64}
                        value={curVal}
                        onChange={(e) => {
                          updateStyles({
                            [prop]: Number(e.target.value),
                            borderRadius: undefined,
                          });
                        }}
                        className="flex-1 accent-indigo-500 cursor-pointer"
                      />
                      <input
                        type="number"
                        min={0}
                        max={999}
                        value={curVal}
                        onChange={(e) => {
                          const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                          updateStyles({
                            [prop]: val,
                            borderRadius: undefined,
                          });
                        }}
                        className={`w-11 px-1 py-0.5 text-center text-xs font-semibold rounded border outline-none font-mono ${
                          isLight
                            ? 'border-slate-300 bg-white text-slate-800'
                            : 'border-slate-600 bg-slate-900 text-slate-100'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {currentTab === 'border' && (
        <div className="space-y-3 text-xs">
          <div>
            <label className={labelClass}>Border Style</label>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {[
                { id: 'solid', label: 'Solid' },
                { id: 'dashed', label: 'Dashed' },
                { id: 'dotted', label: 'Dotted' },
                { id: 'none', label: 'None' },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    updateStyles({
                      borderStyle: b.id,
                      borderWidth: b.id === 'none' ? 0 : s.borderWidth || 1,
                    });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    (s.borderStyle || (s.borderWidth ? 'solid' : 'none')) === b.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-bold'
                      : isLight
                      ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <label className={labelClass}>Border Width</label>
              <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                {s.borderWidth !== undefined ? s.borderWidth : 0}px
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={16}
                value={s.borderWidth !== undefined ? s.borderWidth : 0}
                onChange={(e) => {
                  const w = Number(e.target.value);
                  updateStyles({
                    borderWidth: w,
                    borderStyle: w > 0 && (!s.borderStyle || s.borderStyle === 'none') ? 'solid' : s.borderStyle,
                  });
                }}
                className="flex-1 accent-indigo-500 cursor-pointer"
              />
              <div className="flex items-center gap-1 shrink-0">
                <input
                  type="number"
                  min={0}
                  max={32}
                  value={s.borderWidth !== undefined ? s.borderWidth : 0}
                  onChange={(e) => {
                    const w = Math.max(0, parseInt(e.target.value, 10) || 0);
                    updateStyles({
                      borderWidth: w,
                      borderStyle: w > 0 && (!s.borderStyle || s.borderStyle === 'none') ? 'solid' : s.borderStyle,
                    });
                  }}
                  className={`w-14 px-1.5 py-1 text-center text-xs font-semibold rounded border outline-none font-mono ${
                    isLight
                      ? 'border-slate-300 bg-white text-slate-800 focus:border-indigo-500'
                      : 'border-slate-600 bg-slate-900 text-slate-100 focus:border-indigo-400'
                  }`}
                />
                <span className="text-[11px] text-slate-400">px</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className={labelClass}>Border Color</label>
              <button
                type="button"
                onClick={() => updateStyle('borderColor', 'transparent')}
                className="text-[10px] text-slate-400 hover:text-indigo-500 cursor-pointer"
              >
                Clear / Transparent
              </button>
            </div>

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
                title={showColorPicker ? 'Hide custom color picker' : 'Custom color picker'}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              {BORDER_COLOR_PRESETS.map((hex) => {
                const isSelected =
                  s.borderColor && s.borderColor.toLowerCase() === hex.toLowerCase();
                return (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => updateStyle('borderColor', hex)}
                    className="w-6 h-6 rounded-full border border-slate-700/60 shadow-xs cursor-pointer hover:scale-110 transition-transform relative flex items-center justify-center shrink-0"
                    style={{ backgroundColor: hex }}
                    title={hex}
                  >
                    {isSelected && (
                      <Check
                        className={`w-3.5 h-3.5 mx-auto ${
                          hex === '#ffffff' || hex === '#cbd5e1' || hex === '#e2e8f0' || hex === '#eab308'
                            ? 'text-slate-900'
                            : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {showColorPicker && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <InlineColorPicker
                  color={s.borderColor || '#4f46e5'}
                  onChange={(hex) => updateStyle('borderColor', hex)}
                  isLight={isLight}
                  canvasHeight="h-28"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {currentTab === 'link' && (
        <div className="space-y-3 text-xs">
          <div>
            <label className={labelClass}>Image Click Action (Link)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={element.href || ''}
                onChange={(e) => updateProp('href', e.target.value)}
                placeholder="https://example.com or #section"
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() =>
                  updateProp('target', element.target === '_blank' ? '_self' : '_blank')
                }
                className={`px-3 py-2 rounded-lg border text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
                  element.target === '_blank'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
                title="Open link in a new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{element.target === '_blank' ? 'New Tab' : 'Same'}</span>
              </button>
            </div>
          </div>

          {element.href && (
            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
              <span>Target: {element.target === '_blank' ? 'Opens in new browser tab' : 'Navigates within current window'}</span>
              <button
                type="button"
                onClick={() => {
                  updateProp('href', '');
                  updateProp('target', '_self');
                }}
                className="text-rose-500 hover:underline cursor-pointer"
              >
                Clear Link
              </button>
            </div>
          )}
        </div>
      )}

      <ImageCropModal
        isOpen={showImageCropModal}
        onClose={() => setShowImageCropModal(false)}
        imageUrl={element.src || element.url || ''}
        onApplyCrop={(croppedDataUrl) => {
          updateProp('src', croppedDataUrl);
          updateStyle('aspectRatio', 'auto');
        }}
        isLight={isLight}
      />
    </div>
  );
};
