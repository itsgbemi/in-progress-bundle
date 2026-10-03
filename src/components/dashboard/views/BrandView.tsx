import React, { useState, useEffect } from 'react';
import { Check, Save } from 'lucide-react';
import {
  BrandInfo,
  getBrandInfo,
  saveBrandInfo,
  loadBrandInfoFromFirestore,
} from '../../../services/brandInfoService';
import { useAuth } from '../../../context/AuthContext';
import { BrandSubTab } from '../BrandSubNavBox';
import { Identity } from './brand/Identity';
import { Assets } from './brand/Assets';
import { Contact } from './brand/Contact';
import { Social } from './brand/Social';

interface BrandViewProps {
  uiTheme: 'dark' | 'light';
  activeSubTab?: BrandSubTab;
}

const SUBTAB_CONFIG: Record<string, { title: string; description: string }> = {
  identity: {
    title: 'Brand Identity',
    description: 'Core company name, tagline, industry, and founding year.',
  },
  assets: {
    title: 'Brand Assets & Media',
    description: 'Primary logos, dark mode variations, and browser favicons.',
  },
  contact: {
    title: 'Contact Details',
    description: 'Support emails, office telephones, physical location, and website.',
  },
  social: {
    title: 'Social & Links',
    description: 'Official social profiles and custom external web links.',
  },
};

export const BrandView: React.FC<BrandViewProps> = ({
  uiTheme,
  activeSubTab = 'identity',
}) => {
  const { user } = useAuth();
  const isLight = uiTheme === 'light';

  const [brandInfo, setBrandInfo] = useState<BrandInfo>(() => getBrandInfo(true));
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentConfig = SUBTAB_CONFIG[activeSubTab] || SUBTAB_CONFIG.identity;

  useEffect(() => {
    if (user?.uid) {
      loadBrandInfoFromFirestore(user.uid).then((data) => {
        if (data) setBrandInfo(data);
      });
    }
  }, [user?.uid]);

  const handleChange = (field: keyof BrandInfo, value: any) => {
    setBrandInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveBrandInfo(brandInfo, user?.uid);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {currentConfig.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {currentConfig.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">
              <Check className="w-3.5 h-3.5" />
              <span>Saved Successfully</span>
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {activeSubTab === 'identity' && (
          <Identity
            brandInfo={brandInfo}
            onChange={handleChange}
            isLight={isLight}
          />
        )}

        {activeSubTab === 'assets' && (
          <Assets
            brandInfo={brandInfo}
            onChange={handleChange}
            isLight={isLight}
          />
        )}

        {activeSubTab === 'contact' && (
          <Contact
            brandInfo={brandInfo}
            onChange={handleChange}
            isLight={isLight}
          />
        )}

        {activeSubTab === 'social' && (
          <Social
            brandInfo={brandInfo}
            onChange={handleChange}
            isLight={isLight}
          />
        )}
      </form>
    </div>
  );
};
