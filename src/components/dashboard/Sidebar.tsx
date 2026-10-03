import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Inbox,
  Image as ImageIcon,
  TrendingUp,
  FileText,
  SlidersHorizontal,
  User as UserIcon,
  Zap,
  Sparkles,
  Box,
  Layers,
  Flame,
  Globe,
  ChevronRight,
  ChevronLeft,
  GitBranch,
  Search,
  Link2,
  Mail,
  Share2,
  Settings,
} from 'lucide-react';
import { getSavedBrandingConfig, AppBrandingConfig, DEFAULT_MENU_ITEMS } from '../../utils/themePreferences';
import { subscribeToFormsSubmissions } from '../../services/formsFirebaseService';
import { getBrandInfo, BrandInfo } from '../../services/brandInfoService';
import { WebsiteSubTab } from './WebsiteSubNavBox';
import { SettingsSubTab } from './SettingsSubNavBox';
import { BrandSubTab } from './BrandSubNavBox';
import { ReportSubTab } from './ReportSubNavBox';

export type DashboardTab = 'get-started' | 'overview' | 'websites' | 'inbox' | 'brand' | 'media' | 'settings';

interface DashboardSidebarProps {
  currentTab: DashboardTab;
  settingsSubTab?: string;
  websiteSubTab?: WebsiteSubTab;
  brandSubTab?: BrandSubTab;
  reportSubTab?: ReportSubTab;
  onSelectTab: (tab: DashboardTab, subTab?: string) => void;
  onSelectWebsiteSubTab?: (subTab: WebsiteSubTab) => void;
  onSelectSettingsSubTab?: (subTab: SettingsSubTab) => void;
  onSelectBrandSubTab?: (subTab: BrandSubTab) => void;
  onSelectReportSubTab?: (subTab: ReportSubTab) => void;
  onOpenEditor: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  uiTheme: 'dark' | 'light';
  isMinimized?: boolean;
  onToggleUiTheme?: () => void;
  onCreateNewPage?: () => void;
}

export const OverviewHomeIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M9 16C9.85038 16.6303 10.8846 17 12 17C13.1154 17 14.1496 16.6303 15 16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const BrandBagIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
    <g id="SVGRepo_iconCarrier">
      <path d="M6 10H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.8333 11H18.2308C16.4465 11 15 12.3431 15 14C15 15.6569 16.4465 17 18.2308 17H20.8333C20.9167 17 20.9583 17 20.9935 16.9979C21.5328 16.965 21.9623 16.5662 21.9977 16.0654C22 16.0327 22 15.994 22 15.9167V12.0833C22 12.006 22 11.9673 21.9977 11.9346C21.9623 11.4338 21.5328 11.035 20.9935 11.0021C20.9583 11 20.9167 11 20.8333 11Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20.965 11C20.8873 9.1277 20.6366 7.97975 19.8284 7.17157C18.6569 6 16.7712 6 13 6H10C6.22876 6 4.34315 6 3.17157 7.17157C2 8.34315 2 10.2288 2 14C2 17.7712 2 19.6569 3.17157 20.8284C4.34315 22 6.22876 22 10 22H13C16.7712 22 18.6569 22 19.8284 20.8284C20.6366 20.0203 20.8873 18.8723 20.965 17" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 6L9.73549 3.52313C10.7874 2.82562 12.2126 2.82562 13.2645 3.52313L17 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17.9912 14H18.0002" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const GetStartedNavIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M11 6L21 6.00072M11 12L21 12.0007M11 18L21 18.0007M3 11.9444L4.53846 13.5L8 10M3 5.94444L4.53846 7.5L8 4M4.5 18H4.51M5 18C5 18.2761 4.77614 18.5 4.5 18.5C4.22386 18.5 4 18.2761 4 18C4 17.7239 4.22386 17.5 4.5 17.5C4.77614 17.5 5 17.7239 5 18Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const WebsiteNavIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 21 21"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
  >
    <g fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" transform="translate(3 3)">
      <path d="m2 .5h11c1.1045695 0 2 .8954305 2 2v6.04882185c0 1.05436179-.8158778 1.91816515-1.8507377 1.99451425l-.1567755.0054716-10.99999997-.0413227c-1.10162878-.0041384-1.99248683-.89834933-1.99248683-1.99998589v-6.00749911c0-1.1045695.8954305-2 2-2z" />
      <path d="m2.464 12.5h10.036" />
      <path d="m4.5 14.5h6" />
    </g>
  </svg>
);

export const MobileMenuCloseIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <line x1="6.5" y1="7.5" x2="6.5" y2="16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12" y1="3.5" x2="12" y2="20.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="17.5" y1="7.5" x2="17.5" y2="16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const InboxNavIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
    <g id="SVGRepo_iconCarrier"> 
      <path d="M13.0867 21.3877L13.7321 21.7697L13.0867 21.3877ZM13.6288 20.4718L12.9833 20.0898L13.6288 20.4718ZM10.3712 20.4718L9.72579 20.8539H9.72579L10.3712 20.4718ZM10.9133 21.3877L11.5587 21.0057L10.9133 21.3877ZM2.3806 15.9134L3.07351 15.6264V15.6264L2.3806 15.9134ZM7.78958 18.9915L7.77666 19.7413L7.78958 18.9915ZM5.08658 18.6194L4.79957 19.3123H4.79957L5.08658 18.6194ZM21.6194 15.9134L22.3123 16.2004V16.2004L21.6194 15.9134ZM16.2104 18.9915L16.1975 18.2416L16.2104 18.9915ZM18.9134 18.6194L19.2004 19.3123H19.2004L18.9134 18.6194ZM19.6125 2.7368L19.2206 3.37628L19.6125 2.7368ZM21.2632 4.38751L21.9027 3.99563V3.99563L21.2632 4.38751ZM4.38751 2.7368L3.99563 2.09732V2.09732L4.38751 2.7368ZM2.7368 4.38751L2.09732 3.99563H2.09732L2.7368 4.38751ZM9.40279 19.2098L9.77986 18.5615L9.77986 18.5615L9.40279 19.2098ZM13.7321 21.7697L14.2742 20.8539L12.9833 20.0898L12.4412 21.0057L13.7321 21.7697ZM9.72579 20.8539L10.2679 21.7697L11.5587 21.0057L11.0166 20.0898L9.72579 20.8539ZM12.4412 21.0057C12.2485 21.3313 11.7515 21.3313 11.5587 21.0057L10.2679 21.7697C11.0415 23.0767 12.9585 23.0767 13.7321 21.7697L12.4412 21.0057ZM10.5 2.75H13.5V1.25H10.5V2.75ZM21.25 10.5V11.5H22.75V10.5H21.25ZM2.75 11.5V10.5H1.25V11.5H2.75ZM1.25 11.5C1.25 12.6546 1.24959 13.5581 1.29931 14.2868C1.3495 15.0223 1.45323 15.6344 1.68769 16.2004L3.07351 15.6264C2.92737 15.2736 2.84081 14.8438 2.79584 14.1847C2.75041 13.5189 2.75 12.6751 2.75 11.5H1.25ZM7.8025 18.2416C6.54706 18.2199 5.88923 18.1401 5.37359 17.9265L4.79957 19.3123C5.60454 19.6457 6.52138 19.7197 7.77666 19.7413L7.8025 18.2416ZM1.68769 16.2004C2.27128 17.6093 3.39066 18.7287 4.79957 19.3123L5.3736 17.9265C4.33223 17.4951 3.50486 16.6678 3.07351 15.6264L1.68769 16.2004ZM21.25 11.5C21.25 12.6751 21.2496 13.5189 21.2042 14.1847C21.1592 14.8438 21.0726 15.2736 20.9265 15.6264L22.3123 16.2004C22.5468 15.6344 22.6505 15.0223 22.7007 14.2868C22.7504 13.5581 22.75 12.6546 22.75 11.5H21.25ZM16.2233 19.7413C17.4786 19.7197 18.3955 19.6457 19.2004 19.3123L18.6264 17.9265C18.1108 18.1401 17.4529 18.2199 16.1975 18.2416L16.2233 19.7413ZM20.9265 15.6264C20.4951 16.6678 19.6678 17.4951 18.6264 17.9265L19.2004 19.3123C20.6093 18.7287 21.7287 17.6093 22.3123 16.2004L20.9265 15.6264ZM13.5 2.75C15.1512 2.75 16.337 2.75079 17.2619 2.83873C18.1757 2.92561 18.7571 3.09223 19.2206 3.37628L20.0044 2.09732C19.2655 1.64457 18.4274 1.44279 17.4039 1.34547C16.3915 1.24921 15.1222 1.25 13.5 1.25V2.75ZM22.75 10.5C22.75 8.87781 22.7508 7.6085 22.6545 6.59611C22.5572 5.57256 22.3554 4.73445 21.9027 3.99563L20.6237 4.77938C20.9078 5.24291 21.0744 5.82434 21.1613 6.73809C21.2492 7.663 21.25 8.84876 21.25 10.5H22.75ZM19.2206 3.37628C19.7925 3.72672 20.2733 4.20752 20.6237 4.77938L21.9027 3.99563C21.4286 3.22194 20.7781 2.57144 20.0044 2.09732L19.2206 3.37628ZM10.5 1.25C8.87781 1.25 7.6085 1.24921 6.59611 1.34547C5.57256 1.44279 4.73445 1.64457 3.99563 2.09732L4.77938 3.37628C5.24291 3.09223 5.82434 2.92561 6.73809 2.83873C7.663 2.75079 8.84876 2.75 10.5 2.75V1.25ZM2.75 10.5C2.75 8.84876 2.75079 7.663 2.83873 6.73809C2.92561 5.82434 3.09223 5.24291 3.37628 4.77938L2.09732 3.99563C1.64457 4.73445 1.44279 5.57256 1.34547 6.59611C1.24921 7.6085 1.25 8.87781 1.25 10.5H2.75ZM3.99563 2.09732C3.22194 2.57144 2.57144 3.22194 2.09732 3.99563L3.37628 4.77938C3.72672 4.20752 4.20752 3.72672 4.77938 3.37628L3.99563 2.09732ZM11.0166 20.0898C10.8136 19.7468 10.6354 19.4441 10.4621 19.2063C10.2795 18.9559 10.0702 18.7304 9.77986 18.5615L9.02572 19.8582C9.07313 19.8857 9.13772 19.936 9.24985 20.0898C9.37122 20.2564 9.50835 20.4865 9.72579 20.8539L11.0166 20.0898ZM7.77666 19.7413C8.21575 19.7489 8.49387 19.7545 8.70588 19.7779C8.90399 19.7999 8.98078 19.832 9.02572 19.8582L9.77986 18.5615C9.4871 18.3912 9.18246 18.3215 8.87097 18.287C8.57339 18.2541 8.21375 18.2487 7.8025 18.2416L7.77666 19.7413ZM14.2742 20.8539C14.4916 20.4865 14.6287 20.2564 14.7501 20.0898C14.8622 19.936 14.9268 19.8857 14.9742 19.8582L14.2201 18.5615C13.9298 18.7304 13.7204 18.9559 13.5379 19.2063C13.3646 19.4441 13.1864 19.7468 12.9833 20.0898L14.2742 20.8539ZM16.1975 18.2416C15.7862 18.2487 15.4266 18.2541 15.129 18.287C14.8175 18.3215 14.5129 18.3912 14.2201 18.5615L14.9742 19.8582C15.0192 19.832 15.096 19.7999 15.2941 19.7779C15.5061 19.7545 15.7842 19.7489 16.2233 19.7413L16.1975 18.2416Z" fill="currentColor"></path> 
      <path d="M10.9901 14.3082L11.435 13.7045H11.435L10.9901 14.3082ZM12 8.10615L11.4641 8.63086C11.6052 8.77495 11.7983 8.85615 12 8.85615C12.2017 8.85615 12.3948 8.77495 12.5359 8.63086L12 8.10615ZM13.0099 14.3082L12.565 13.7045L12.565 13.7045L13.0099 14.3082ZM12 14.8103L12 14.0603H12L12 14.8103ZM11.435 13.7045C10.7914 13.2302 9.96746 12.5568 9.31176 11.808C8.63279 11.0325 8.25 10.3064 8.25 9.71476H6.75C6.75 10.8757 7.44886 11.9574 8.18323 12.7961C8.94088 13.6614 9.86191 14.4085 10.5451 14.912L11.435 13.7045ZM8.25 9.71476C8.25 8.60703 8.74454 8.02373 9.25333 7.83348C9.77052 7.6401 10.5951 7.74331 11.4641 8.63086L12.5359 7.58145C11.38 6.40091 9.95456 5.96985 8.72797 6.42849C7.49299 6.89028 6.75 8.14533 6.75 9.71476H8.25ZM13.4549 14.912C14.1381 14.4085 15.0591 13.6614 15.8168 12.7961C16.5511 11.9574 17.25 10.8758 17.25 9.71475H15.75C15.75 10.3064 15.3672 11.0326 14.6882 11.808C14.0325 12.5568 13.2086 13.2302 12.565 13.7045L13.4549 14.912ZM17.25 9.71475C17.25 8.14532 16.507 6.89027 15.272 6.42849C14.0454 5.96985 12.62 6.40091 11.4641 7.58145L12.5359 8.63086C13.4049 7.74331 14.2295 7.6401 14.7467 7.83348C15.2555 8.02373 15.75 8.60702 15.75 9.71475H17.25ZM10.5451 14.912C10.9368 15.2007 11.3752 15.5603 12 15.5603L12 14.0603C11.9852 14.0603 11.9682 14.0626 11.899 14.0252C11.8008 13.972 11.678 13.8836 11.435 13.7045L10.5451 14.912ZM12.565 13.7045C12.322 13.8836 12.1992 13.972 12.101 14.0252C12.0318 14.0626 12.0148 14.0603 12 14.0603L12 15.5603C12.6248 15.5603 13.0632 15.2007 13.4549 14.912L12.565 13.7045Z" fill="currentColor"></path> 
    </g>
  </svg>
);


interface NavItem {
  id: DashboardTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  desc?: string;
  hasSubNav?: boolean;
}

const PresetIconMap: Record<string, any> = {
  Zap,
  Sparkles,
  Globe,
  Box,
  Layers,
  Flame,
};

export const RenderBrandLogo: React.FC<{ branding: AppBrandingConfig; className?: string; uiTheme?: 'dark' | 'light' }> = ({
  branding,
  className = 'w-9 h-9',
  uiTheme,
}) => {
  const brand = getBrandInfo(true);
  const brandDisplayName = brand?.name || branding.logoName || 'Boof Horfice';
  const isLightMode = uiTheme === 'light';

  const brandLogoImage = isLightMode
    ? (brand?.logoUrl || brand?.logoDarkUrl)
    : (brand?.logoDarkUrl || brand?.logoUrl);

  if (brandLogoImage) {
    return (
      <div className={`${className} flex items-center justify-center shrink-0`}>
        <img src={brandLogoImage} alt={brandDisplayName} className="w-full h-full object-contain" />
      </div>
    );
  }

  if ((branding.logoDisplayType as string) === 'svg_only' && (branding.logoSvg || (branding.logoIconSource === 'svg' && branding.logoIconSvg))) {
    return (
      <div
        className={`${className} flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain shrink-0`}
        dangerouslySetInnerHTML={{ __html: branding.logoSvg || branding.logoIconSvg || '' }}
      />
    );
  }

  if (branding.logoDisplayType === 'image_only') {
    const chosenImage = isLightMode
      ? (branding.logoImageUrlLight || branding.logoImageUrl)
      : (branding.logoImageUrlDark || branding.logoImageUrlLight || branding.logoImageUrl);
    if (chosenImage) {
      return (
        <div className={`${className} flex items-center justify-center shrink-0`}>
          <img src={chosenImage} alt={brandDisplayName} className="w-full h-full object-contain" />
        </div>
      );
    }
  }

  if ((branding.logoIconSource === 'svg' || (!branding.logoIconSource && branding.logoIconSvg)) && branding.logoIconSvg) {
    return (
      <div
        className={`${className} flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain shrink-0`}
        dangerouslySetInnerHTML={{ __html: branding.logoIconSvg }}
      />
    );
  }

  if ((branding.logoIconSource === 'url' || (!branding.logoIconSource && branding.logoIconUrl)) && branding.logoIconUrl) {
    return (
      <div className={`${className} flex items-center justify-center shrink-0`}>
        <img src={branding.logoIconUrl} alt={brandDisplayName} className="w-full h-full object-contain" />
      </div>
    );
  }

  if (branding.logoDisplayType === 'text_only') {
    return (
      <div className={`${className} flex items-center justify-center font-bold text-sm shrink-0`}>
        {brandDisplayName.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div className={`${className} text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0`}>
      <Sparkles className="w-full h-full" />
    </div>
  );
};

const WEBSITE_SUB_ITEMS: { id: WebsiteSubTab; label: string; icon: React.ElementType; desc: string }[] = [
  { id: 'webpages', label: 'Webpages', icon: Globe, desc: 'Pages, routes & HTML layouts' },
  { id: 'sitemap', label: 'Sitemap', icon: GitBranch, desc: 'Page hierarchy & navigation' },
  { id: 'indexing', label: 'Indexing', icon: Search, desc: 'SEO, metadata & search engines' },
  { id: 'domain', label: 'Domain', icon: Link2, desc: 'Custom domains & DNS records' },
];

const SETTINGS_SUB_ITEMS: { id: SettingsSubTab; label: string; icon: React.ElementType; desc: string; badge?: string }[] = [
  { id: 'account', label: 'Account', icon: UserIcon, desc: 'User avatar & security' },
  { id: 'workspace', label: 'Workspace', icon: Sparkles, desc: 'Appearance & branding' },
  { id: 'preferences', label: 'Preferences', icon: SlidersHorizontal, desc: 'System defaults & UI' },
];

const BRAND_SUB_ITEMS: { id: BrandSubTab; label: string; icon: React.ElementType; desc: string }[] = [
  { id: 'identity', label: 'Identity', icon: Sparkles, desc: 'Logos, names & fonts' },
  { id: 'assets', label: 'Assets', icon: ImageIcon, desc: 'Logos & media files' },
  { id: 'contact', label: 'Contact', icon: Mail, desc: 'Public email & location' },
  { id: 'social', label: 'Social', icon: Share2, desc: 'Social channels & links' },
];

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  currentTab,
  settingsSubTab = 'account',
  websiteSubTab = 'webpages',
  brandSubTab = 'identity',
  reportSubTab = 'overview',
  onSelectTab,
  onSelectWebsiteSubTab,
  onSelectSettingsSubTab,
  onSelectBrandSubTab,
  onSelectReportSubTab: _onSelectReportSubTab,
  onOpenEditor: _onOpenEditor,
  isOpenMobile,
  onCloseMobile,
  uiTheme,
  isMinimized = false,
  onToggleUiTheme: _onToggleUiTheme,
  onCreateNewPage: _onCreateNewPage,
}) => {
  const { user } = useAuth();
  const isLight = uiTheme === 'light';
  const [branding, setBranding] = useState<AppBrandingConfig>(getSavedBrandingConfig());
  const [brandInfo, setBrandInfo] = useState<BrandInfo>(() => getBrandInfo(true));
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const [mobileNavView, setMobileNavView] = useState<'main' | 'websites' | 'settings' | 'brand'>('main');

  useEffect(() => {
    if (isOpenMobile) {
      setMobileNavView('main');
    }
  }, [isOpenMobile]);

  useEffect(() => {
    const unsub = subscribeToFormsSubmissions((items) => {
      const unread = items.filter((i) => !i.isRead && i.status === 'new').length;
      setUnreadCount(unread);
    });
    return () => unsub();
  }, []);

  const allNavItems: NavItem[] = [
    { id: 'get-started', label: 'Get Started', icon: GetStartedNavIcon, desc: 'Setup Wizard' },
    { id: 'overview', label: 'Overview', icon: OverviewHomeIcon, desc: 'Performance & Stats' },
    { id: 'brand', label: 'Brand', icon: BrandBagIcon, desc: 'Identity & Details', hasSubNav: true },
    { id: 'websites', label: 'Website', icon: WebsiteNavIcon, desc: 'Pages & Domains', hasSubNav: true },
    { id: 'inbox', label: 'Inbox', icon: InboxNavIcon, badge: unreadCount > 0 ? String(unreadCount) : undefined, desc: 'Form Submissions' },
    { id: 'media', label: 'Media', icon: ImageIcon, desc: 'Assets & Storage' },
          ];

  const navItems = useMemo(() => {
    const customConfig = branding.menuItems || DEFAULT_MENU_ITEMS;
    const itemMap = new Map(allNavItems.map((item) => [item.id, item]));
    const result: NavItem[] = [];

    customConfig.forEach((cfg) => {
      if (cfg.id === 'audit' || cfg.id === 'ip-owner') return;
      if (cfg.visible !== false) {
        const item = itemMap.get(cfg.id as DashboardTab);
        if (item) {
          result.push(item);
          itemMap.delete(cfg.id as DashboardTab);
        }
      } else {
        itemMap.delete(cfg.id as DashboardTab);
      }
    });

    itemMap.forEach((item) => {
      result.push(item);
    });

    return result;
  }, [branding.menuItems, unreadCount]);

  useEffect(() => {
    const handleBrandingUpdate = () => {
      setBranding(getSavedBrandingConfig());
      setBrandInfo(getBrandInfo(true));
    };
    window.addEventListener('storage', handleBrandingUpdate);
    window.addEventListener('branding_updated', handleBrandingUpdate);
    window.addEventListener('brand_info_updated', handleBrandingUpdate);
    window.addEventListener('workspaces_updated', handleBrandingUpdate);
    window.addEventListener('active_workspace_changed', handleBrandingUpdate);
    return () => {
      window.removeEventListener('storage', handleBrandingUpdate);
      window.removeEventListener('branding_updated', handleBrandingUpdate);
      window.removeEventListener('brand_info_updated', handleBrandingUpdate);
      window.removeEventListener('workspaces_updated', handleBrandingUpdate);
      window.removeEventListener('active_workspace_changed', handleBrandingUpdate);
    };
  }, []);

  const isDesktopStacked = branding.sidebarLayout === 'stacked' || isMinimized;
  const brandDisplayName = brandInfo?.name?.trim() || branding.logoName?.trim() || 'Boof Horfice';
  const currentLogoImage = brandInfo?.logoUrl || (isLight
    ? branding.logoImageUrlLight || branding.logoImageUrl
    : branding.logoImageUrlDark || branding.logoImageUrlLight || branding.logoImageUrl);
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Account User';

  const handleMobileNavClick = (item: NavItem) => {
    if (item.id === 'websites') {
      onSelectTab('websites');
      setMobileNavView('websites');
      return;
    }
    if (item.id === 'brand') {
      onSelectTab('brand');
      setMobileNavView('brand');
      return;
    }
    if (item.id === 'settings') {
      onSelectTab('settings');
      setMobileNavView('settings');
      return;
    }

    onSelectTab(item.id);
    onCloseMobile();
  };

  return (
    <>
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside
        data-sidebar="true"
        className={`fixed lg:static top-0 left-0 ${isOpenMobile ? 'z-50' : 'z-20 lg:z-10'} ${
          isDesktopStacked ? 'w-64 sm:w-72 lg:w-16 lg:sm:w-18' : 'w-64 sm:w-72 lg:w-60'
        } h-full max-h-full shrink-0 flex flex-col justify-between overflow-hidden transition-all duration-300 ease-in-out bg-transparent border-r border-slate-200/60 dark:border-slate-800/60 ${
          isLight ? 'text-slate-900' : 'text-slate-100'
        } ${isOpenMobile ? 'translate-x-0 shadow-2xl bg-white dark:bg-[#1d1f21]' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          <div className="p-3 pb-2 shrink-0 relative hidden lg:block">
            <div className={`hidden ${isDesktopStacked ? 'lg:flex' : ''} justify-center relative`}>
              <div
                className={`w-10 h-10 flex items-center justify-center font-bold text-base select-none ${
                  isLight
                    ? 'text-slate-800'
                    : 'text-slate-200'
                }`}
                title={brandDisplayName}
              >
                {currentLogoImage ? (
                  <img src={currentLogoImage} alt={brandDisplayName} className="w-6 h-6 object-contain" />
                ) : (
                  brandDisplayName.charAt(0).toUpperCase()
                )}
              </div>
            </div>

            <div className={`hidden ${!isDesktopStacked ? 'lg:block' : ''} relative`}>
              <div
                className={`w-full p-2 flex items-center gap-2.5 select-none ${
                  isLight
                    ? 'text-slate-800'
                    : 'text-slate-200'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                    isLight ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'
                  }`}
                >
                  {currentLogoImage ? (
                    <img src={currentLogoImage} alt={brandDisplayName} className="w-5 h-5 object-contain" />
                  ) : (
                    brandDisplayName.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <span className="font-bold text-xs text-slate-900 dark:text-white block truncate leading-tight">
                    {brandDisplayName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={`hidden ${isDesktopStacked ? 'lg:flex' : ''} flex-col flex-1 min-h-0`}>
            <nav className="py-2 px-2 overflow-y-auto no-scrollbar flex-1 space-y-1 rounded-none">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectTab(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full py-2.5 flex items-center justify-center group cursor-pointer relative transition-all border-l-[3px] rounded-none bg-transparent hover:bg-transparent ${
                      isActive
                        ? isLight
                          ? 'border-l-[var(--brand-primary)] text-[var(--brand-primary)] font-bold bg-transparent'
                          : 'border-l-[var(--brand-accent)] text-[var(--brand-accent)] font-bold bg-transparent'
                        : isLight
                        ? 'border-l-transparent text-slate-600 hover:text-slate-900 bg-transparent'
                        : 'border-l-transparent text-slate-400 hover:text-white bg-transparent'
                    }`}
                    title={item.label}
                  >
                    <div className="w-10 h-6 flex items-center justify-center relative transition-all rounded-none">
                      <Icon
                        className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                          isActive
                            ? isLight
                              ? 'text-[var(--brand-primary)]'
                              : 'text-[var(--brand-accent)]'
                            : isLight
                            ? 'text-slate-600'
                            : 'text-slate-400'
                        }`}
                      />

                      {item.badge && (
                        <span
                          className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-none text-[9px] font-bold z-10 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className={`hidden ${!isDesktopStacked ? 'lg:flex' : ''} flex-col flex-1 min-h-0`}>
            <nav className="py-2 pl-3 pr-2 overflow-y-auto no-scrollbar flex-1 space-y-1 rounded-none">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectTab(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full rounded-none text-xs font-semibold transition-all cursor-pointer relative pl-3.5 pr-4 py-2.5 flex items-center justify-between border-l-[3px] bg-transparent hover:bg-transparent ${
                      isActive
                        ? isLight
                          ? 'border-l-[var(--brand-primary)] text-[var(--brand-primary)] font-bold bg-transparent'
                          : 'border-l-[var(--brand-accent)] text-[var(--brand-accent)] font-bold bg-transparent'
                        : isLight
                        ? 'border-l-transparent text-slate-700 hover:text-slate-900 bg-transparent'
                        : 'border-l-transparent text-slate-300 hover:text-white bg-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-5 h-5 shrink-0 ${
                          isActive
                            ? isLight
                              ? 'text-[var(--brand-primary)]'
                              : 'text-[var(--brand-accent)]'
                            : isLight
                            ? 'text-slate-600'
                            : 'text-slate-400'
                        }`}
                      />
                      <div className="text-left">
                        <span className="block">{item.label}</span>
                      </div>
                    </div>

                    {item.badge && (
                      <span
                        className="px-2 py-0.5 rounded-none text-[9px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex lg:hidden flex-col flex-1 min-h-0">
            {mobileNavView === 'main' && (
              <div className="flex flex-col flex-1 min-h-0 animate-in fade-in duration-150">
                <div className="p-3 pb-2 shrink-0 relative">
                  <div className="flex items-center justify-between gap-1">
                    <div
                      className={`flex items-center gap-2 p-1.5 text-left min-w-0 flex-1 select-none ${
                        isLight
                          ? 'text-slate-800'
                          : 'text-slate-200'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {currentLogoImage ? (
                          <img src={currentLogoImage} alt={brandDisplayName} className="h-5 w-5 object-contain" />
                        ) : (
                          brandDisplayName.charAt(0).toUpperCase()
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-xs text-slate-900 dark:text-white block truncate leading-tight">
                          {brandDisplayName}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onCloseMobile}
                      className={`p-2 rounded-lg transition-colors cursor-pointer shrink-0 ml-1 ${
                        isLight
                          ? 'text-slate-700 hover:text-[var(--brand-primary)] hover:bg-slate-500/10'
                          : 'text-slate-200 hover:text-[var(--brand-accent)] hover:bg-white/10'
                      }`}
                      title="Close Menu"
                    >
                      <MobileMenuCloseIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <nav className="py-2 pl-3 pr-2 overflow-y-auto no-scrollbar flex-1 space-y-1 rounded-none">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleMobileNavClick(item)}
                        className={`w-full rounded-none text-xs font-semibold transition-all cursor-pointer relative pl-3.5 pr-4 py-2.5 flex items-center justify-between border-l-[3px] bg-transparent hover:bg-transparent ${
                          isActive
                            ? isLight
                              ? 'border-l-[var(--brand-primary)] text-[var(--brand-primary)] font-bold bg-transparent'
                              : 'border-l-[var(--brand-accent)] text-[var(--brand-accent)] font-bold bg-transparent'
                            : isLight
                            ? 'border-l-transparent text-slate-700 hover:text-slate-900 bg-transparent'
                            : 'border-l-transparent text-slate-300 hover:text-white bg-transparent'
                        }`}
                      >
                        <div className="flex items-center min-w-0">
                          <span className="block truncate">{item.label}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.badge && (
                            <span
                              className="px-2 py-0.5 rounded-none text-[9px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                            >
                              {item.badge}
                            </span>
                          )}

                          {item.hasSubNav && (
                            <ChevronRight
                              className={`w-4 h-4 shrink-0 ${
                                isActive
                                  ? isLight
                                    ? 'text-[var(--brand-primary)]'
                                    : 'text-[var(--brand-accent)]'
                                  : 'text-slate-400'
                              }`}
                            />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>
            )}

            {mobileNavView === 'websites' && (
              <div className="flex flex-col flex-1 min-h-0 animate-in slide-in-from-right-4 duration-200">
                <div className="p-3 pb-2 shrink-0 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setMobileNavView('main')}
                    className={`p-2 rounded-lg transition-colors cursor-pointer shrink-0 ${
                      isLight
                        ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Back to Main Menu"
                  >
                    <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
                  </button>

                  <span className="font-medium text-base text-slate-900 dark:text-white truncate">
                    Website
                  </span>

                  <button
                    type="button"
                    onClick={onCloseMobile}
                    className={`p-2 rounded-lg transition-colors cursor-pointer shrink-0 ml-1 ${
                      isLight
                        ? 'text-slate-700 hover:text-[var(--brand-primary)] hover:bg-slate-500/10'
                        : 'text-slate-200 hover:text-[var(--brand-accent)] hover:bg-white/10'
                    }`}
                    title="Close Menu"
                  >
                    <MobileMenuCloseIcon className="w-5 h-5" />
                  </button>
                </div>

                <nav className="py-2 overflow-y-auto no-scrollbar flex-1 space-y-1">
                  {WEBSITE_SUB_ITEMS.map((item) => {
                    const isActive = currentTab === 'websites' && websiteSubTab === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectTab('websites');
                          if (onSelectWebsiteSubTab) {
                            onSelectWebsiteSubTab(item.id);
                          }
                          onCloseMobile();
                        }}
                        className={`w-full rounded-none text-xs font-semibold transition-all cursor-pointer relative px-4 py-2.5 flex items-center justify-center text-center border-0 bg-transparent hover:bg-transparent ${
                          isActive
                            ? isLight
                              ? 'text-[var(--brand-primary)] font-bold bg-transparent'
                              : 'text-[var(--brand-accent)] font-bold bg-transparent'
                            : isLight
                            ? 'text-slate-700 hover:text-slate-900 bg-transparent'
                            : 'text-slate-300 hover:text-white bg-transparent'
                        }`}
                      >
                        <span className="truncate text-center">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            )}

            {mobileNavView === 'settings' && (
              <div className="flex flex-col flex-1 min-h-0 animate-in slide-in-from-right-4 duration-200">
                <div className="p-3 pb-2 shrink-0 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setMobileNavView('main')}
                    className={`p-2 rounded-lg transition-colors cursor-pointer shrink-0 ${
                      isLight
                        ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Back to Main Menu"
                  >
                    <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
                  </button>

                  <span className="font-medium text-base text-slate-900 dark:text-white truncate">
                    Settings
                  </span>

                  <button
                    type="button"
                    onClick={onCloseMobile}
                    className={`p-2 rounded-lg transition-colors cursor-pointer shrink-0 ml-1 ${
                      isLight
                        ? 'text-slate-700 hover:text-[var(--brand-primary)] hover:bg-slate-500/10'
                        : 'text-slate-200 hover:text-[var(--brand-accent)] hover:bg-white/10'
                    }`}
                    title="Close Menu"
                  >
                    <MobileMenuCloseIcon className="w-5 h-5" />
                  </button>
                </div>

                <nav className="py-2 overflow-y-auto no-scrollbar flex-1 space-y-1">
                  {SETTINGS_SUB_ITEMS.map((item) => {
                    const isActive = currentTab === 'settings' && settingsSubTab === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectTab('settings', item.id);
                          if (onSelectSettingsSubTab) {
                            onSelectSettingsSubTab(item.id);
                          }
                          onCloseMobile();
                        }}
                        className={`w-full rounded-none text-xs font-semibold transition-all cursor-pointer relative px-4 py-2.5 flex items-center justify-center gap-2 text-center border-0 bg-transparent hover:bg-transparent ${
                          isActive
                            ? isLight
                              ? 'text-[var(--brand-primary)] font-bold bg-transparent'
                              : 'text-[var(--brand-accent)] font-bold bg-transparent'
                            : isLight
                            ? 'text-slate-700 hover:text-slate-900 bg-transparent'
                            : 'text-slate-300 hover:text-white bg-transparent'
                        }`}
                      >
                        <span className="truncate text-center">{item.label}</span>

                        {item.badge && (
                          <span
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-tight shrink-0 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            )}

            {mobileNavView === 'brand' && (
              <div className="flex flex-col flex-1 min-h-0 animate-in slide-in-from-right-4 duration-200">
                <div className="p-3 pb-2 shrink-0 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setMobileNavView('main')}
                    className={`p-2 rounded-lg transition-colors cursor-pointer shrink-0 ${
                      isLight
                        ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Back to Main Menu"
                  >
                    <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
                  </button>

                  <span className="font-medium text-base text-slate-900 dark:text-white truncate">
                    Brand
                  </span>

                  <button
                    type="button"
                    onClick={onCloseMobile}
                    className={`p-2 rounded-lg transition-colors cursor-pointer shrink-0 ml-1 ${
                      isLight
                        ? 'text-slate-700 hover:text-[var(--brand-primary)] hover:bg-slate-500/10'
                        : 'text-slate-200 hover:text-[var(--brand-accent)] hover:bg-white/10'
                    }`}
                    title="Close Menu"
                  >
                    <MobileMenuCloseIcon className="w-5 h-5" />
                  </button>
                </div>

                <nav className="py-2 overflow-y-auto no-scrollbar flex-1 space-y-1">
                  {BRAND_SUB_ITEMS.map((item) => {
                    const isActive = currentTab === 'brand' && brandSubTab === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectTab('brand');
                          if (onSelectBrandSubTab) {
                            onSelectBrandSubTab(item.id);
                          }
                          onCloseMobile();
                        }}
                        className={`w-full rounded-none text-xs font-semibold transition-all cursor-pointer relative px-4 py-2.5 flex items-center justify-center text-center border-0 bg-transparent hover:bg-transparent ${
                          isActive
                            ? isLight
                              ? 'text-[var(--brand-primary)] font-bold bg-transparent'
                              : 'text-[var(--brand-accent)] font-bold bg-transparent'
                            : isLight
                            ? 'text-slate-700 hover:text-slate-900 bg-transparent'
                            : 'text-slate-300 hover:text-white bg-transparent'
                        }`}
                      >
                        <span className="truncate text-center">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            )}
          </div>
        </div>

        <div className="p-3 pt-2 shrink-0 border-t border-slate-200/60 dark:border-slate-800/60 relative">
          <div className={`hidden ${isDesktopStacked ? 'lg:flex' : ''} justify-center`}>
            <button
              type="button"
              onClick={() => {
                onSelectTab('settings');
                onCloseMobile();
              }}
              className={`w-10 h-10 flex items-center justify-center transition-all cursor-pointer border-0 bg-transparent shadow-none select-none ${
                currentTab === 'settings'
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : isLight
                  ? 'text-slate-800 hover:text-slate-900'
                  : 'text-slate-200 hover:text-white'
              }`}
              title="Settings"
            >
              <Settings className="w-5 h-5 shrink-0" />
            </button>
          </div>

          <div className={`${isDesktopStacked ? 'lg:hidden' : ''}`}>
            <button
              type="button"
              onClick={() => {
                onSelectTab('settings');
                setMobileNavView('settings');
              }}
              className={`w-full p-2 flex items-center justify-between gap-2.5 transition-all text-left cursor-pointer border-0 bg-transparent shadow-none select-none ${
                currentTab === 'settings'
                  ? isLight
                    ? 'text-indigo-600 font-bold'
                    : 'text-indigo-400 font-bold'
                  : isLight
                  ? 'text-slate-800 hover:text-slate-900'
                  : 'text-slate-200 hover:text-white'
              }`}
              title="Settings"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Settings className="w-5 h-5 shrink-0 hidden lg:inline-block" />
                <span className="font-semibold text-xs block truncate leading-tight">
                  Settings
                </span>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 lg:hidden shrink-0" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
