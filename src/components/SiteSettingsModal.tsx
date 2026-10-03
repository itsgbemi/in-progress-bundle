import React, { useState, useEffect } from 'react';
import { Check, ShieldCheck, Settings } from 'lucide-react';
import { SiteSettings, WebsitePage } from '../types';
import { SchemaFormFields } from './SchemaFormFields';
import { getInitialSettings } from '../utils/siteSettingsHelpers';
import {
Modal,
ModalHeader,
ModalBody,
ModalFooter,
Tabs,
TabItem,
Button,
FormField,
TextInput,
TextArea,
SelectInput,
ImageInputWithMediaPicker,
} from './common';

export type TagCategory = 'meta' | 'og' | 'schema' | 'favicon' | 'code';

interface SiteSettingsModalProps {
isOpen: boolean;
onClose: () => void;
page?: WebsitePage;
onUpdateSiteSettings: (settings: SiteSettings) => void;
uiTheme?: 'dark' | 'light';
initialTab?: TagCategory;
}

const SETTINGS_TABS: TabItem<TagCategory>[] = [
{ id: 'meta', label: 'Meta Tags (SEO)' },
{ id: 'og', label: 'Open Graph Tags' },
{ id: 'schema', label: 'JSON-LD Schema' },
{ id: 'favicon', label: 'Favicon & Brand' },
{ id: 'code', label: 'Custom Code' },
];

const ROBOTS_OPTIONS = [
{ value: 'index, follow', label: 'index, follow (Default - Allow search indexing)' },
{ value: 'noindex, follow', label: 'noindex, follow (Hide from search engines)' },
{ value: 'noindex, nofollow', label: 'noindex, nofollow (Strict private)' },
{ value: 'index, nofollow', label: 'index, nofollow' },
];

const TWITTER_CARD_OPTIONS = [
{ value: 'summary_large_image', label: 'summary_large_image (Large Hero Banner)' },
{ value: 'summary', label: 'summary (Small Square Thumbnail)' },
];

export const SiteSettingsModal: React.FC<SiteSettingsModalProps> = ({
isOpen,
onClose,
page,
onUpdateSiteSettings,
uiTheme = 'dark',
initialTab = 'meta',
}) => {
const [activeTab, setActiveTab] = useState<TagCategory>(initialTab);
const [savedSuccess, setSavedSuccess] = useState(false);

useEffect(() => {
if (isOpen) {
setActiveTab(initialTab || 'meta');
}
}, [isOpen, initialTab]);

const [formData, setFormData] = useState<SiteSettings>(() => getInitialSettings(page));

useEffect(() => {
if (isOpen) {
setFormData(getInitialSettings(page));
}
}, [isOpen, page]);

if (!isOpen) return null;

const isLight = uiTheme === 'light';

const handleChange = (key: keyof SiteSettings, value: any) => {
setFormData((prev) => ({
...prev,
[key]: value,
}));
};

const handleUpdateSchemaField = (field: string, value: any) => {
setFormData((prev) => ({
...prev,
schemaData: {
...(prev.schemaData || {}),
[field]: value,
},
}));
};

const handleSave = () => {
onUpdateSiteSettings(formData);
setSavedSuccess(true);
setTimeout(() => {
setSavedSuccess(false);
onClose();
}, 600);
};

const getTabTitle = () => {
switch (activeTab) {
case 'meta':
return 'Meta Tags (SEO & Document)';
case 'og':
return 'Open Graph Social Meta Tags';
case 'schema':
return 'JSON-LD Structured Data Schema';
case 'favicon':
return 'Favicon & Brand Icons';
case 'code':
return 'Custom Script & Stylesheet Tags';
}
};

return (
<Modal
isOpen={isOpen}
onClose={onClose}
isLight={isLight}
size="2xl"
aria-labelledby="site-settings-title"
>
<ModalHeader
title={getTabTitle()}
description="Configure search engine optimization, social cards, and branding"
icon={<Settings className="w-5 h-5" />}
onClose={onClose}
isLight={isLight}
titleId="site-settings-title"
/>

<Tabs<TagCategory>
tabs={SETTINGS_TABS}
activeTab={activeTab}
onChange={(tabId) => setActiveTab(tabId)}
variant="underline"
isLight={isLight}
className="px-4 sm:px-6"
/>

<ModalBody isLight={isLight} className="p-6 space-y-4">
{activeTab === 'meta' && (
<div className="space-y-4">
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<FormField
label="Document & Page Title"
hint="Recommended: 50-60 characters for search engines."
isLight={isLight}
>
<TextInput
value={formData.title || ''}
onChange={(e) => handleChange('title', e.target.value)}
placeholder="e.g. Apex Studio - Modern Web Architecture"
isLight={isLight}
/>
</FormField>

<FormField label="Author / Organization" isLight={isLight}>
<TextInput
value={formData.author || ''}
onChange={(e) => handleChange('author', e.target.value)}
placeholder="e.g. Acme Corporation"
isLight={isLight}
/>
</FormField>
</div>

<FormField
label="Meta Description"
hint={`Character count: ${(formData.description || '').length} / 160 characters`}
isLight={isLight}
>
<TextArea
rows={3}
value={formData.description || ''}
onChange={(e) => handleChange('description', e.target.value)}
placeholder="Summarize your website in 150-160 characters..."
isLight={isLight}
/>
</FormField>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<FormField label="Keywords (Comma Separated)" isLight={isLight}>
<TextInput
value={formData.keywords || ''}
onChange={(e) => handleChange('keywords', e.target.value)}
placeholder="saas, web design, modern ui, templates"
isLight={isLight}
/>
</FormField>

<FormField label="Robots Meta Tag" isLight={isLight}>
<SelectInput
value={formData.robots || 'index, follow'}
onChange={(e) => handleChange('robots', e.target.value)}
options={ROBOTS_OPTIONS}
isLight={isLight}
/>
</FormField>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<FormField label="Canonical URL" isLight={isLight}>
<TextInput
value={formData.canonicalUrl || ''}
onChange={(e) => handleChange('canonicalUrl', e.target.value)}
placeholder="https://www.yourdomain.com"
isLight={isLight}
/>
</FormField>

<FormField label="HTML Language Code" isLight={isLight}>
<TextInput
value={formData.language || 'en'}
onChange={(e) => handleChange('language', e.target.value)}
placeholder="en, es, fr, de, ja"
isLight={isLight}
/>
</FormField>
</div>
</div>
)}

{activeTab === 'og' && (
<div className="space-y-4">
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<FormField label="OG Social Title" isLight={isLight}>
<TextInput
value={formData.ogTitle || ''}
onChange={(e) => handleChange('ogTitle', e.target.value)}
placeholder="Social card title"
isLight={isLight}
/>
</FormField>

<FormField label="Site Name" isLight={isLight}>
<TextInput
value={formData.ogSiteName || ''}
onChange={(e) => handleChange('ogSiteName', e.target.value)}
placeholder="e.g. Apex Design Agency"
isLight={isLight}
/>
</FormField>
</div>

<FormField label="OG Social Description" isLight={isLight}>
<TextArea
rows={2}
value={formData.ogDescription || ''}
onChange={(e) => handleChange('ogDescription', e.target.value)}
placeholder="Catchy social summary..."
isLight={isLight}
/>
</FormField>

<div>
<ImageInputWithMediaPicker
label="OG Share Image URL (1200 x 630px recommended)"
value={formData.ogImage || ''}
onChange={(val) => handleChange('ogImage', val)}
placeholder="https://images.unsplash.com/photo-... or select from media"
isLight={isLight}
variant="default"
modalTitle="Select Social Card Share Image"
/>
{formData.ogImage && (
<div className="mt-2 relative rounded-xl overflow-hidden border border-slate-700 h-32 w-full max-w-sm bg-slate-950">
<img
src={formData.ogImage}
alt="Social Preview"
className="w-full h-full object-cover"
referrerPolicy="no-referrer"
/>
<div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white">
Social Card Preview
</div>
</div>
)}
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<FormField label="Twitter / X Card Type" isLight={isLight}>
<SelectInput
value={formData.twitterCard || 'summary_large_image'}
onChange={(e) => handleChange('twitterCard', e.target.value)}
options={TWITTER_CARD_OPTIONS}
isLight={isLight}
/>
</FormField>

<FormField label="Twitter / X Handle" isLight={isLight}>
<TextInput
value={formData.twitterHandle || ''}
onChange={(e) => handleChange('twitterHandle', e.target.value)}
placeholder="@companyhandle"
isLight={isLight}
/>
</FormField>
</div>
</div>
)}

{activeTab === 'schema' && (
<SchemaFormFields
formData={formData}
onChange={handleChange}
onUpdateSchemaField={handleUpdateSchemaField}
uiTheme={uiTheme}
/>
)}

{activeTab === 'favicon' && (
<div className="space-y-4">
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<ImageInputWithMediaPicker
label="Favicon URL (Light Theme / Standard)"
value={formData.faviconUrl || ''}
onChange={(val) => handleChange('faviconUrl', val)}
placeholder="https://.../favicon-light.png"
isLight={isLight}
variant="default"
modalTitle="Select Light Favicon"
hint="Used for standard/light browser tabs."
/>
</div>

<div>
<ImageInputWithMediaPicker
label="Favicon URL (Dark Theme)"
value={formData.faviconDarkUrl || ''}
onChange={(val) => handleChange('faviconDarkUrl', val)}
placeholder="https://.../favicon-dark.png"
isLight={isLight}
variant="default"
modalTitle="Select Dark Favicon"
hint="Used when browser is set to dark mode preference."
/>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<ImageInputWithMediaPicker
label="Brand Logo URL (Light Theme Backgrounds)"
value={formData.logoLightUrl || ''}
onChange={(val) => handleChange('logoLightUrl', val)}
placeholder="https://.../logo-dark-text.png"
isLight={isLight}
variant="default"
modalTitle="Select Brand Logo (Light Theme)"
hint="Dark text logo image URL for light canvases."
/>
</div>

<div>
<ImageInputWithMediaPicker
label="Brand Logo URL (Dark Theme Backgrounds)"
value={formData.logoDarkUrl || ''}
onChange={(val) => handleChange('logoDarkUrl', val)}
placeholder="https://.../logo-light-text.png"
isLight={isLight}
variant="default"
modalTitle="Select Brand Logo (Dark Theme)"
hint="Light text logo image URL for dark canvases."
/>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<FormField
label="Brand Logo <svg> (Light Theme)"
hint="Optional raw <svg> markup for light canvases."
isLight={isLight}
>
<TextArea
rows={2}
value={formData.logoLightSvg || ''}
onChange={(e) => handleChange('logoLightSvg', e.target.value)}
className="font-mono text-xs"
placeholder="<svg ...>...</svg>"
isLight={isLight}
/>
</FormField>

<FormField
label="Brand Logo <svg> (Dark Theme)"
hint="Optional raw <svg> markup for dark canvases."
isLight={isLight}
>
<TextArea
rows={2}
value={formData.logoDarkSvg || ''}
onChange={(e) => handleChange('logoDarkSvg', e.target.value)}
className="font-mono text-xs"
placeholder="<svg ...>...</svg>"
isLight={isLight}
/>
</FormField>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<FormField label="Theme Color (Light Theme)" isLight={isLight}>
<div className="flex items-center gap-2.5">
<input
type="color"
value={formData.themeColor || '#4f46e5'}
onChange={(e) => handleChange('themeColor', e.target.value)}
className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0"
/>
<TextInput
value={formData.themeColor || '#4f46e5'}
onChange={(e) => handleChange('themeColor', e.target.value)}
placeholder="#4f46e5"
isLight={isLight}
/>
</div>
</FormField>

<FormField label="Theme Color (Dark Theme)" isLight={isLight}>
<div className="flex items-center gap-2.5">
<input
type="color"
value={formData.themeColorDark || '#0f172a'}
onChange={(e) => handleChange('themeColorDark', e.target.value)}
className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0"
/>
<TextInput
value={formData.themeColorDark || '#0f172a'}
onChange={(e) => handleChange('themeColorDark', e.target.value)}
placeholder="#0f172a"
isLight={isLight}
/>
</div>
</FormField>
</div>

<FormField
label="Apple Touch Icon URL (iOS bookmark icon)"
isLight={isLight}
>
<TextInput
value={formData.appleTouchIcon || ''}
onChange={(e) => handleChange('appleTouchIcon', e.target.value)}
placeholder="https://.../apple-touch-icon.png"
isLight={isLight}
/>
</FormField>

<div
className={`p-4 rounded-xl border flex items-center gap-4 ${
isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
}`}
>
<div className="flex items-center gap-3">
{(isLight ? formData.faviconUrl : formData.faviconDarkUrl || formData.faviconUrl) ? (
<img
src={(isLight ? formData.faviconUrl : formData.faviconDarkUrl || formData.faviconUrl) || ''}
alt="Favicon"
className="w-8 h-8 rounded p-1 bg-white/10 object-contain"
referrerPolicy="no-referrer"
/>
) : (
<div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
B
</div>
)}
<div>
<div className="text-xs font-semibold flex items-center gap-2">
<span>{formData.title || 'My Website'}</span>
<span className="text-[10px] text-slate-400 font-normal">| Browser Tab</span>
</div>
<span className="text-[11px] text-slate-500">
{formData.canonicalUrl || 'https://mywebsite.com'}
</span>
</div>
</div>
</div>
</div>
)}

{activeTab === 'code' && (
<div className="space-y-4">
<FormField
label="Head Custom Code / Scripts (inside <head>)"
hint="Will be automatically injected into the generated HTML <head> section."
isLight={isLight}
>
<TextArea
rows={4}
value={formData.headScripts || ''}
onChange={(e) => handleChange('headScripts', e.target.value)}
className="font-mono text-xs"
placeholder="<!-- Google Analytics, GTM, custom fonts, or custom meta tags -->"
isLight={isLight}
/>
</FormField>

<FormField
label="Footer Custom Code / Scripts (before </body>)"
hint="Will be rendered immediately before the closing </body> tag."
isLight={isLight}
>
<TextArea
rows={4}
value={formData.footerScripts || ''}
onChange={(e) => handleChange('footerScripts', e.target.value)}
className="font-mono text-xs"
placeholder="<!-- Live chat widgets, tracking pixels, or custom JS scripts -->"
isLight={isLight}
/>
</FormField>
</div>
)}
</ModalBody>

<ModalFooter isLight={isLight} className="justify-between">
<Button variant="secondary" onClick={onClose} isLight={isLight}>
Cancel
</Button>

<Button
variant="primary"
onClick={handleSave}
isLight={isLight}
leftIcon={
savedSuccess ? (
<Check className="w-4 h-4 text-emerald-300" />
) : (
<ShieldCheck className="w-4 h-4" />
)
}
>
{savedSuccess ? 'Settings Applied!' : 'Save & Apply SEO Settings'}
</Button>
</ModalFooter>
</Modal>
);
};
