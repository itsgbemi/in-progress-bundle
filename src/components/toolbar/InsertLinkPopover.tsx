import React, { useState } from 'react';
import { Link as LinkIcon, Unlink, ChevronDown } from 'lucide-react';
import { BrandLinkPicker } from '../common';

interface InsertLinkPopoverProps {
  currentHref?: string;
  currentTarget?: string;
  currentText?: string;
  onApplyLink: (url: string, target?: string, text?: string, rel?: string, title?: string) => void;
  onRemoveLink: () => void;
  onClose?: () => void;
  isLight?: boolean;
}

export const InsertLinkPopover: React.FC<InsertLinkPopoverProps> = ({
  currentHref = '',
  currentTarget = '_self',
  currentText = '',
  onApplyLink,
  onRemoveLink,
  onClose,
  isLight = false,
}) => {
  const [linkUrl, setLinkUrl] = useState<string>(currentHref);
  const [linkText, setLinkText] = useState<string>(currentText);
  const [linkOpenNewTab, setLinkOpenNewTab] = useState<boolean>(currentTarget === '_blank');

  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
  const [relOption, setRelOption] = useState<'nofollow' | 'sponsored' | 'ugc' | 'custom' | ''>('');
  const [customRel, setCustomRel] = useState('');
  const [linkTitle, setLinkTitle] = useState('');

  const inputClass = `w-full px-3.5 py-2 text-xs font-normal border rounded-full shadow-xs opacity-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${
    isLight
      ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
      : 'bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500'
  }`;

  const handleApply = () => {
    if (!linkUrl.trim()) return;
    let finalRel = relOption === 'custom' ? customRel.trim() : relOption;
    if (linkOpenNewTab && !finalRel) {
      finalRel = 'noopener noreferrer';
    } else if (linkOpenNewTab && finalRel && !finalRel.includes('noopener')) {
      finalRel = `${finalRel} noopener noreferrer`;
    }
    onApplyLink(
      linkUrl.trim(),
      linkOpenNewTab ? '_blank' : '_self',
      linkText.trim() || undefined,
      finalRel || undefined,
      linkTitle.trim() || undefined
    );
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="space-y-3.5 overflow-visible">
      <div className="space-y-3 overflow-visible">
        <div>
          <label className={`text-[10px] font-bold block mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Destination</label>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com, mailto:..., or tel:..."
              className={`${inputClass} flex-1`}
            />
            <BrandLinkPicker
              uiTheme={isLight ? 'light' : 'dark'}
              variant="folderIcon"
              align="right"
              onSelectLink={(url, suggestedLabel) => {
                setLinkUrl(url);
                if (!linkText.trim() && suggestedLabel) {
                  setLinkText(suggestedLabel);
                }
              }}
            />
          </div>
        </div>

        <div>
          <label className={`text-[10px] font-bold block mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Text (leave blank to use selection)</label>
          <input
            type="text"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            placeholder="Click here..."
            className={inputClass}
          />
        </div>

        <div className="flex items-center justify-between py-1">
          <span className={`font-semibold text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
            Open in New Tab
          </span>

          <button
            type="button"
            role="switch"
            aria-checked={linkOpenNewTab}
            onClick={() => setLinkOpenNewTab(!linkOpenNewTab)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              linkOpenNewTab
                ? 'bg-indigo-600'
                : isLight ? 'bg-slate-300' : 'bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                linkOpenNewTab ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800/80 pt-2">
          <button
            type="button"
            onClick={() => setIsMoreOptionsOpen(!isMoreOptionsOpen)}
            className={`w-full flex items-center justify-between text-xs font-semibold py-1 transition-colors cursor-pointer ${
              isLight ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-slate-100'
            }`}
          >
            <span>More options</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreOptionsOpen ? 'rotate-180' : ''}`} />
          </button>

          {isMoreOptionsOpen && (
            <div className="space-y-2.5 pt-2.5 animate-in fade-in duration-150">
              <div>
                <label className={`text-[10px] font-bold block mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Link Relationship (rel)
                </label>
                <select
                  value={relOption}
                  onChange={(e) => setRelOption(e.target.value as any)}
                  className={inputClass}
                >
                  <option value="">Default (None)</option>
                  <option value="nofollow">nofollow (Search engines don&apos;t follow)</option>
                  <option value="sponsored">sponsored (Paid or sponsored link)</option>
                  <option value="ugc">ugc (User Generated Content)</option>
                  <option value="custom">Custom rel value...</option>
                </select>
              </div>

              {relOption === 'custom' && (
                <div>
                  <label className={`text-[10px] font-bold block mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Custom rel Value
                  </label>
                  <input
                    type="text"
                    value={customRel}
                    onChange={(e) => setCustomRel(e.target.value)}
                    placeholder="e.g. author help"
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label className={`text-[10px] font-bold block mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Title Attribute (tooltip)
                </label>
                <input
                  type="text"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="Tooltip text on hover..."
                  className={inputClass}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleApply}
            disabled={!linkUrl.trim()}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer shadow-xs ${
              linkUrl.trim()
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Apply</span>
          </button>

          {(currentHref || linkUrl) && (
            <button
              type="button"
              onClick={() => {
                setLinkUrl('');
                setLinkText('');
                onRemoveLink();
                if (onClose) {
                  onClose();
                }
              }}
              className="w-full py-2 px-3 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-semibold flex items-center justify-center transition-all cursor-pointer"
            >
              <span>Remove Link</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
