import React from 'react';
import { Share2, Plus, Trash2, Link as LinkIcon } from 'lucide-react';
import { BrandInfo } from '../../../../services/brandInfoService';
import { Input } from '../../../common';

interface SocialProps {
  brandInfo: BrandInfo;
  onChange: (field: keyof BrandInfo, value: any) => void;
  isLight: boolean;
}

export const Social: React.FC<SocialProps> = ({
  brandInfo,
  onChange,
  isLight,
}) => {
  const customLinksList = brandInfo.customLinks || [];

  const handleAddCustomLink = () => {
    const updated = [...customLinksList, { id: `link_${Date.now()}`, label: 'New Link', url: '', platform: 'Website' }];
    onChange('customLinks', updated);
  };

  const handleUpdateCustomLink = (id: string, field: 'label' | 'url' | 'platform', value: string) => {
    const updated = customLinksList.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    onChange('customLinks', updated);
  };

  const handleRemoveCustomLink = (id: string) => {
    const updated = customLinksList.filter((item) => item.id !== id);
    onChange('customLinks', updated);
  };

  return (
    <div className="space-y-6">
      {/* Social Profiles */}
      <div
        className={`p-5 sm:p-6 rounded-2xl border space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div className="border-b pb-3 border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-indigo-500" />
            <span>Social Network Profiles</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Official social handles and profile destination URLs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Twitter / X Profile"
            type="url"
            value={brandInfo.twitter || ''}
            onChange={(e) => onChange('twitter', e.target.value)}
            placeholder="https://x.com/yourhandle"
            variant="pill"
            isLight={isLight}
          />

          <Input
            label="LinkedIn Profile / Company"
            type="url"
            value={brandInfo.linkedin || ''}
            onChange={(e) => onChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/company/yourbrand"
            variant="pill"
            isLight={isLight}
          />

          <Input
            label="Instagram Profile"
            type="url"
            value={brandInfo.instagram || ''}
            onChange={(e) => onChange('instagram', e.target.value)}
            placeholder="https://instagram.com/yourbrand"
            variant="pill"
            isLight={isLight}
          />

          <Input
            label="GitHub Organization or Repo"
            type="url"
            value={brandInfo.github || ''}
            onChange={(e) => onChange('github', e.target.value)}
            placeholder="https://github.com/yourbrand"
            variant="pill"
            isLight={isLight}
          />
        </div>
      </div>

      {/* Custom Links */}
      <div
        className={`p-5 sm:p-6 rounded-2xl border space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-indigo-500" />
              <span>Custom External Links & Resources</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Documentation links, community forums, or sister portal URLs.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCustomLink}
            className="px-3 py-1.5 rounded-lg border text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Link</span>
          </button>
        </div>

        {customLinksList.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No custom links added yet. Click &quot;Add Link&quot; above to create one.
          </div>
        ) : (
          <div className="space-y-3">
            {customLinksList.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleUpdateCustomLink(item.id, 'label', e.target.value)}
                  placeholder="Link Title (e.g. Docs)"
                  className={`w-32 px-3 py-2 rounded-xl border text-xs outline-none ${
                    isLight ? 'border-slate-200 bg-white' : 'border-slate-700 bg-slate-950 text-slate-100'
                  }`}
                />
                <input
                  type="url"
                  value={item.url}
                  onChange={(e) => handleUpdateCustomLink(item.id, 'url', e.target.value)}
                  placeholder="https://docs.example.com"
                  className={`flex-1 px-3 py-2 rounded-xl border text-xs outline-none ${
                    isLight ? 'border-slate-200 bg-white' : 'border-slate-700 bg-slate-950 text-slate-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCustomLink(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                  title="Remove link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
