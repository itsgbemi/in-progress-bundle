import React from 'react';
import { BrandInfo } from '../../../../services/brandInfoService';
import { Input } from '../../../common';

interface IdentityProps {
  brandInfo: BrandInfo;
  onChange: (field: keyof BrandInfo, value: any) => void;
  isLight: boolean;
}

export const Identity: React.FC<IdentityProps> = ({
  brandInfo,
  onChange,
  isLight,
}) => {
  return (
    <div
      className={`p-5 sm:p-6 rounded-2xl border space-y-5 ${
        isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
      }`}
    >
      <div className="border-b pb-3 border-slate-100 dark:border-slate-800">
        <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
          Identity Information
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Basic brand identifiers, company nomenclature, and corporate tagline.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Brand Name"
          type="text"
          value={brandInfo.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="e.g. Acme Studio"
          variant="pill"
          isLight={isLight}
        />

        <Input
          label="Tagline"
          type="text"
          value={brandInfo.tagline || ''}
          onChange={(e) => onChange('tagline', e.target.value)}
          placeholder="e.g. Design without limits"
          variant="pill"
          isLight={isLight}
        />

        <Input
          label="Industry / Category"
          type="text"
          value={brandInfo.industry || ''}
          onChange={(e) => onChange('industry', e.target.value)}
          placeholder="e.g. Technology, Agency, Retail"
          variant="pill"
          isLight={isLight}
        />

        <Input
          label="Founded Year"
          type="text"
          value={brandInfo.foundedYear || ''}
          onChange={(e) => onChange('foundedYear', e.target.value)}
          placeholder="e.g. 2024"
          variant="pill"
          isLight={isLight}
        />
      </div>

      <div className="pt-2">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Brand Story & Description
        </label>
        <textarea
          value={brandInfo.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Brief description of the brand's core mission, values, and offerings..."
          rows={4}
          className={`w-full px-4 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
            isLight
              ? 'border-slate-200 bg-white focus:border-indigo-500 text-slate-900'
              : 'border-slate-700 bg-slate-950 focus:border-indigo-400 text-slate-100'
          }`}
        />
      </div>
    </div>
  );
};
