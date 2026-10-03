import React from 'react';
import { BrandInfo } from '../../../../services/brandInfoService';
import { ImageInputWithMediaPicker } from '../../../common';

interface AssetsProps {
  brandInfo: BrandInfo;
  onChange: (field: keyof BrandInfo, value: any) => void;
  isLight: boolean;
}

export const Assets: React.FC<AssetsProps> = ({
  brandInfo,
  onChange,
  isLight,
}) => {
  return (
    <div className="space-y-6">
      <div
        className={`p-5 sm:p-6 rounded-2xl border space-y-5 ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div className="border-b pb-3 border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
            Brand Logos & Visual Marks
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure primary, dark mode, and browser favicon icons.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <ImageInputWithMediaPicker
              label="Primary Light Logo"
              value={brandInfo.logoUrl || ''}
              onChange={(val) => onChange('logoUrl', val)}
              placeholder="https://.../logo.png or select from media"
              variant="pill"
              isLight={isLight}
              modalTitle="Select Brand Primary Logo"
              hint="Main logo displayed on standard/light header bars and brand collateral."
            />
          </div>

          <div>
            <ImageInputWithMediaPicker
              label="Dark Mode Logo"
              value={brandInfo.logoDarkUrl || ''}
              onChange={(val) => onChange('logoDarkUrl', val)}
              placeholder="https://.../logo-white.png or select from media"
              variant="pill"
              isLight={isLight}
              modalTitle="Select Dark Mode Logo"
              hint="Light-colored logo variant displayed on dark theme backgrounds."
            />
          </div>

          <div>
            <ImageInputWithMediaPicker
              label="Apple Touch / Mobile Icon"
              value={brandInfo.appleTouchIcon || ''}
              onChange={(val) => onChange('appleTouchIcon', val)}
              placeholder="https://.../icon.png or select from media"
              variant="pill"
              isLight={isLight}
              modalTitle="Select Brand Mobile Icon"
              hint="180x180 square icon used on iOS/Android home screens and compact bookmarks."
            />
          </div>

          <div>
            <ImageInputWithMediaPicker
              label="Browser Favicon (16x16 / 32x32)"
              value={brandInfo.faviconUrl || ''}
              onChange={(val) => onChange('faviconUrl', val)}
              placeholder="https://.../favicon.ico or select from media"
              variant="pill"
              isLight={isLight}
              modalTitle="Select Website Favicon"
              hint="Browser tab icon displayed in bookmarks and search engine listings."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
