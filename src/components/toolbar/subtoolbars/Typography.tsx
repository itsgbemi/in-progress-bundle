import React from 'react';
import {
  Link as LinkIcon,
  List,
  ListOrdered,
  Highlighter,
  PaintBucket,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  MoveVertical,
  ArrowLeftRight,
} from 'lucide-react';
import { WebsiteElement } from '../../../types';
import { ActiveToolType } from './Group';

interface TypographyProps {
  element: WebsiteElement;
  activeTool: ActiveToolType;
  toggleTool: (tool: ActiveToolType) => void;
  isLight: boolean;
  stripQuotes: (str: string | undefined) => string;
  detectedFontFamily: string;
  activeStyleLabel: string;
  currentFontSizePx: string;
  handleToggleBold: (e: React.MouseEvent) => void;
  handleToggleItalic: (e: React.MouseEvent) => void;
  handleUnderlineButtonClick: (e: React.MouseEvent) => void;
  handleOverlineButtonClick: (e: React.MouseEvent) => void;
  handleStrikethroughButtonClick: (e: React.MouseEvent) => void;
  handleToggleSuperscript: (e: React.MouseEvent) => void;
  handleToggleSubscript: (e: React.MouseEvent) => void;
  applyFormatCommand: (command: string, value?: string) => void;
  isBoldActive: boolean;
  isItalicActive: boolean;
  isUnderlineActive: boolean;
  isOverlineActive: boolean;
  isStrikethroughActive: boolean;
  isSuperscriptActive: boolean;
  isSubscriptActive: boolean;
  underlineConfig: { style: string; thickness?: number | string; color?: string; offset?: number; skipInk?: boolean };
  overlineConfig: { style: string; thickness?: number | string; color?: string; offset?: number; skipInk?: boolean };
  strikethroughConfig: { style: string; thickness?: number | string; color?: string; offset?: number; skipInk?: boolean };
  activeFormats: {
    link: boolean;
    bulletList: boolean;
    numberedList: boolean;
  };
  detectedLinkHref: string;
  updateStyle: (key: string, value: any) => void;
}

export type TypographyToolbarProps = TypographyProps;
export type TypographySubToolbarProps = TypographyProps;

export const TypographyToolbar: React.FC<TypographyProps> = ({
  element,
  activeTool,
  toggleTool,
  isLight,
  stripQuotes,
  detectedFontFamily,
  activeStyleLabel,
  currentFontSizePx,
  handleToggleBold,
  handleToggleItalic,
  handleUnderlineButtonClick,
  handleOverlineButtonClick,
  handleStrikethroughButtonClick,
  handleToggleSuperscript,
  handleToggleSubscript,
  applyFormatCommand,
  isBoldActive,
  isItalicActive,
  isUnderlineActive,
  isOverlineActive,
  isStrikethroughActive,
  isSuperscriptActive,
  isSubscriptActive,
  underlineConfig,
  overlineConfig,
  strikethroughConfig,
  activeFormats,
  detectedLinkHref,
  updateStyle,
}) => {
  const s = element.styles || {};

  return (
    <>
      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={() => toggleTool('font')}
          className={`px-2.5 py-1 text-xs font-semibold flex items-center transition-colors cursor-pointer shrink-0 ${
            activeTool === 'font'
              ? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
              : isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
          }`}
          title="Font Family / Typeface"
          aria-label="Font Family"
        >
          <span className="max-w-[100px] truncate">
            {stripQuotes(s.typeface) || stripQuotes(detectedFontFamily) || 'Font'}
          </span>
        </button>

        <div className={`h-4 w-[1px] shrink-0 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />

        <button
          type="button"
          onClick={() => toggleTool('fontStyle')}
          className={`px-2.5 py-1 text-xs font-semibold flex items-center transition-colors cursor-pointer shrink-0 ${
            activeTool === 'fontStyle'
              ? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
              : isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
          }`}
          title="Text Style"
          aria-label="Text Style"
        >
          <span>{activeStyleLabel}</span>
        </button>

        <div className={`h-4 w-[1px] shrink-0 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />

        <button
          type="button"
          onClick={() => toggleTool('fontSize')}
          className={`px-2.5 py-1 min-w-[38px] justify-center text-xs font-semibold flex items-center transition-colors cursor-pointer shrink-0 ${
            activeTool === 'fontSize'
              ? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
              : isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
          }`}
          title="Font Size"
          aria-label="Font Size"
        >
          <span>{currentFontSizePx}</span>
        </button>
      </div>

      <div className={`h-5 w-[1px] shrink-0 mx-1 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`}/>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          type="button"
          onMouseDown={handleToggleBold}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center ${
            isBoldActive
              ? isLight
                ? 'bg-slate-200/80 text-indigo-600 font-semibold'
                : 'bg-slate-800 text-indigo-400 font-semibold'
              : isLight
              ? 'hover:bg-slate-200/80 text-slate-700'
              : 'hover:bg-slate-800 text-slate-200'
          }`}
          title="Bold"
          aria-label="Bold"
        >
          <span className="font-semibold text-sm inline-block px-0.5 leading-none">B</span>
        </button>

        <button
          type="button"
          onMouseDown={handleToggleItalic}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center ${
            isItalicActive
              ? isLight
                ? 'bg-slate-200/80 text-indigo-600 font-semibold'
                : 'bg-slate-800 text-indigo-400 font-semibold'
              : isLight
              ? 'hover:bg-slate-200/80 text-slate-700'
              : 'hover:bg-slate-800 text-slate-200'
          }`}
          title="Italics"
          aria-label="Italics"
        >
          <span className="font-semibold italic text-sm inline-block px-0.5 leading-none">I</span>
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleUnderlineButtonClick}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center ${
            isUnderlineActive || activeTool === 'underline'
              ? isLight
                ? 'bg-slate-200/80 text-indigo-600 font-semibold'
                : 'bg-slate-800 text-indigo-400 font-semibold'
              : isLight
              ? 'hover:bg-slate-200/80 text-slate-700'
              : 'hover:bg-slate-800 text-slate-200'
          }`}
          title="Underline (Click to format & open settings)"
          aria-label="Underline"
        >
          <span
            className="font-semibold text-sm inline-block px-0.5 leading-none"
            style={{
              textDecorationLine: 'underline',
              textDecorationStyle: (underlineConfig.style as any) || 'solid',
              textDecorationThickness:
                typeof underlineConfig.thickness === 'number'
                  ? `${underlineConfig.thickness}px`
                  : underlineConfig.style === 'double'
                  ? '3px'
                  : '1.5px',
              textUnderlineOffset: '2px',
              textDecorationColor: 'currentColor',
            }}
          >
            U
          </span>
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleOverlineButtonClick}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center ${
            isOverlineActive || activeTool === 'overline'
              ? isLight
                ? 'bg-slate-200/80 text-indigo-600 font-semibold'
                : 'bg-slate-800 text-indigo-400 font-semibold'
              : isLight
              ? 'hover:bg-slate-200/80 text-slate-700'
              : 'hover:bg-slate-800 text-slate-200'
          }`}
          title="Overline (Click to format & open settings)"
          aria-label="Overline"
        >
          <div className="flex flex-col items-center justify-center h-4 select-none px-0.5">
            <div
              className="w-full border-t border-current shrink-0"
              style={{
                borderTopStyle: (overlineConfig.style as any) || 'solid',
                borderTopWidth:
                  typeof overlineConfig.thickness === 'number'
                    ? `${overlineConfig.thickness}px`
                    : overlineConfig.style === 'double'
                    ? '3px'
                    : '1.5px',
                marginBottom:
                  typeof overlineConfig.offset === 'number'
                    ? `${Math.max(0, overlineConfig.offset - 1)}px`
                    : '0.5px',
              }}
            />
            <span className="font-semibold text-sm leading-none">O</span>
          </div>
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleStrikethroughButtonClick}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center ${
            isStrikethroughActive || activeTool === 'strikethrough'
              ? isLight
                ? 'bg-slate-200/80 text-indigo-600 font-semibold'
                : 'bg-slate-800 text-indigo-400 font-semibold'
              : isLight
              ? 'hover:bg-slate-200/80 text-slate-700'
              : 'hover:bg-slate-800 text-slate-200'
          }`}
          title="Strikethrough (Click to format & open settings)"
          aria-label="Strikethrough"
        >
          <span
            className="font-semibold text-sm inline-block px-0.5 leading-none"
            style={{
              textDecorationLine: 'line-through',
              textDecorationStyle: (strikethroughConfig.style as any) || 'solid',
              textDecorationThickness:
                typeof strikethroughConfig.thickness === 'number'
                  ? `${strikethroughConfig.thickness}px`
                  : strikethroughConfig.style === 'double'
                  ? '3px'
                  : '1.5px',
              textDecorationColor: 'currentColor',
            }}
          >
            S
          </span>
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            handleToggleSuperscript(e);
          }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center relative ${
            isSuperscriptActive
              ? isLight
                ? 'bg-slate-200/80 text-indigo-600 font-semibold'
                : 'bg-slate-800 text-indigo-400 font-semibold'
              : isLight
              ? 'hover:bg-slate-200/80 text-slate-700'
              : 'hover:bg-slate-800 text-slate-200'
          }`}
          title={`Superscript (X²)${isSuperscriptActive ? ' - Active (Click to undo)' : ''}`}
          aria-label="Superscript"
        >
          <span className="font-semibold text-sm inline-block px-0.5 leading-none">
            X<sup className="text-[8px] font-normal leading-none ml-0.5">2</sup>
          </span>
          {isSuperscriptActive && (
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
          )}
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            handleToggleSubscript(e);
          }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center relative ${
            isSubscriptActive
              ? isLight
                ? 'bg-slate-200/80 text-indigo-600 font-semibold'
                : 'bg-slate-800 text-indigo-400 font-semibold'
              : isLight
              ? 'hover:bg-slate-200/80 text-slate-700'
              : 'hover:bg-slate-800 text-slate-200'
          }`}
          title={`Subscript (X₂)${isSubscriptActive ? ' - Active (Click to undo)' : ''}`}
          aria-label="Subscript"
        >
          <span className="font-semibold text-sm inline-block px-0.5 leading-none">
            X<sub className="text-[8px] font-normal leading-none ml-0.5">2</sub>
          </span>
          {isSubscriptActive && (
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
          )}
        </button>
      </div>

      <div className={`h-5 w-[1px] shrink-0 mx-1 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`}/>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => toggleTool('link')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center ${
            activeTool === 'link' || activeFormats.link || s.href || element.href || detectedLinkHref
              ? isLight
                ? 'bg-slate-200/80 text-indigo-600 font-semibold'
                : 'bg-slate-800 text-indigo-400 font-semibold'
              : isLight
              ? 'hover:bg-slate-200/80 text-slate-700'
              : 'hover:bg-slate-800 text-slate-200'
          }`}
          title="Insert / Edit Link"
          aria-label="Insert / Edit Link"
        >
          <LinkIcon className="w-4 h-4"/>
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            applyFormatCommand('insertUnorderedList');
          }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center ${
            activeFormats.bulletList
              ? isLight
                ? 'bg-slate-200/80 text-indigo-600 font-semibold'
                : 'bg-slate-800 text-indigo-400 font-semibold'
              : isLight
              ? 'hover:bg-slate-200/80 text-slate-700'
              : 'hover:bg-slate-800 text-slate-200'
          }`}
          title="Bullet List"
          aria-label="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            applyFormatCommand('insertOrderedList');
          }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center ${
            activeFormats.numberedList
              ? isLight
                ? 'bg-slate-200/80 text-indigo-600 font-semibold'
                : 'bg-slate-800 text-indigo-400 font-semibold'
              : isLight
              ? 'hover:bg-slate-200/80 text-slate-700'
              : 'hover:bg-slate-800 text-slate-200'
          }`}
          title="Numbered List"
          aria-label="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => toggleTool('casing')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center ${
            activeTool === 'casing' || s.textTransform
              ? isLight
                ? 'bg-slate-200/80 text-indigo-600 font-semibold'
                : 'bg-slate-800 text-indigo-400 font-semibold'
              : isLight
              ? 'hover:bg-slate-200/80 text-slate-700'
              : 'hover:bg-slate-800 text-slate-200'
          }`}
          title="Text Casing"
          aria-label="Text Casing"
        >
          <span className="font-semibold text-sm inline-block px-0.5 leading-none">Aa</span>
        </button>
      </div>

      <div className={`h-5 w-[1px] shrink-0 mx-1 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`}/>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => toggleTool('textColor')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
            activeTool === 'textColor'
              ? isLight
                ? 'bg-slate-200/80 text-indigo-600 font-semibold'
                : 'bg-slate-800 text-indigo-400 font-semibold'
              : isLight
              ? 'hover:bg-slate-200/80 text-slate-700'
              : 'hover:bg-slate-800 text-slate-200'
          }`}
          title="Text Color"
          aria-label="Text Color"
        >
          <span className="font-bold text-sm leading-none h-4 flex items-center justify-center">A</span>
          <span
            className="w-4 h-[3px] rounded-full border border-black/20"
            style={{
              backgroundColor: s.textColor || (isLight ? '#0f172a' : '#ffffff'),
            }}
          />
        </button>

        <button
          type="button"
          onClick={() => toggleTool('highlightColor')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTool === 'highlightColor'
              ? isLight
                ? 'bg-slate-200/80 text-indigo-600 font-semibold'
                : 'bg-slate-800 text-indigo-400 font-semibold'
              : isLight
              ? 'hover:bg-slate-200/80 text-slate-700'
              : 'hover:bg-slate-800 text-slate-200'
          }`}
          title="Highlight Color"
          aria-label="Highlight Color"
        >
          <Highlighter className="w-4 h-4"/>
          {s.highlightColor && (
            <span className="w-2.5 h-2.5 rounded-full border border-white/40" style={{ backgroundColor: s.highlightColor }} />
          )}
        </button>

        <button
          type="button"
          onClick={() => toggleTool('backgroundColor')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTool === 'backgroundColor'
              ? isLight
                ? 'bg-slate-200/80 text-indigo-600 font-semibold'
                : 'bg-slate-800 text-indigo-400 font-semibold'
              : isLight
              ? 'hover:bg-slate-200/80 text-slate-700'
              : 'hover:bg-slate-800 text-slate-200'
          }`}
          title="Container / Background Style"
          aria-label="Background Color"
        >
          <PaintBucket className="w-4 h-4"/>
          {s.backgroundColor && s.backgroundColor !== 'transparent' && (
            <span className="w-2.5 h-2.5 rounded-full border border-white/40" style={{ backgroundColor: s.backgroundColor }} />
          )}
          {s.backgroundImage && (
            <span className="w-2.5 h-2.5 rounded-full border border-white/40" style={{ background: s.backgroundImage }} />
          )}
        </button>
      </div>
    </>
  );
};

export const Typography = TypographyToolbar;
export const TypographySubToolbar = TypographyToolbar;
