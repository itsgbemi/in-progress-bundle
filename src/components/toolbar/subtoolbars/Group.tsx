import React from 'react';
import { WebsiteElement } from '../../../types';

export type ActiveToolType =
  | 'font'
  | 'fontStyle'
  | 'fontSize'
  | 'link'
  | 'listStyles'
  | 'casing'
  | 'textColor'
  | 'highlightColor'
  | 'backgroundColor'
  | 'spacing'
  | 'lineHeight'
  | 'letterSpacing'
  | 'wordSpacing'
  | 'underline'
  | 'overline'
  | 'strikethrough'
  | 'imageSource'
  | 'imageAlt'
  | 'imageAspect'
  | 'imageSize'
  | 'imageTransform'
  | 'imageAdjust'
  | 'imageHover'
  | 'imageShadow'
  | 'imageRadius'
  | 'imageBorder'
  | 'imageAlign'
  | 'imageLink'
  | 'buttonText'
  | 'buttonVariant'
  | 'buttonIcon'
  | 'buttonSize'
  | 'iconPicker'
  | 'iconSize'
  | 'iconColor'
  | 'iconBg'
  | 'iconRotation'
  | 'mediaSource'
  | 'mediaAspect'
  | 'containerBg'
  | 'containerPadding'
  | 'containerBorder'
  | 'containerShadow'
  | 'containerLayout'
  | 'containerWidth'
  | 'containerGap'
  | 'formInputSettings'
  | 'formResponseSettings'
  | 'formSubmitSettings'
  | 'formFields'
  | null;

interface GroupSubToolbarProps {
  element: WebsiteElement;
  activeTool: ActiveToolType;
  toggleTool: (tool: ActiveToolType) => void;
  isLight: boolean;
  onUpdateSection?: (section: any) => void;
  currentSection?: any;
  onClose?: () => void;
}

export type GroupToolbarProps = GroupSubToolbarProps;
export type GroupProps = GroupSubToolbarProps;

export const GroupToolbar: React.FC<GroupToolbarProps> = ({
  element,
  activeTool,
  toggleTool,
  isLight,
  onUpdateSection,
  currentSection,
  onClose,
}) => {
  return (
    <div className="flex items-center shrink-0">
      <div
        className={`px-3 py-1 text-xs font-semibold flex items-center gap-1.5 shrink-0 ${
          isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
        }`}
        title="Group Container"
      >
        <span>Group</span>
      </div>

      <div className={`h-4 w-[1px] shrink-0 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />

      <button
        type="button"
        onClick={() => toggleTool('containerGap')}
        className={`px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
          activeTool === 'containerGap'
            ? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
            : isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
        }`}
        title="Adjust Item Gap"
      >
        <span>Gap</span>
      </button>

      {onUpdateSection && currentSection && (
        <>
          <div className={`h-4 w-[1px] shrink-0 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />

          <button
            type="button"
            onClick={() => {
              const groupIdx = currentSection.elements.findIndex((el: any) => el.id === element.id);
              if (groupIdx !== -1) {
                const children = element.children || [];
                const newElements = [...currentSection.elements];
                newElements.splice(groupIdx, 1, ...children);
                onUpdateSection({ ...currentSection, elements: newElements });
                if (onClose) onClose();
              }
            }}
            className={`px-3 py-1 text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors shrink-0 ${
              isLight
                ? 'text-slate-700 hover:text-indigo-600'
                : 'text-slate-200 hover:text-indigo-400'
            }`}
            title="Ungroup (⌘⇧G / Ctrl+Shift+G)"
          >
            <span>Ungroup</span>
          </button>
        </>
      )}

      <div className={`h-4 w-[1px] shrink-0 mr-1 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />
    </div>
  );
};

export const Group = GroupToolbar;
export const GroupSubToolbar = GroupToolbar;
