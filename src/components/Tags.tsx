import React, { useState, useEffect } from 'react';
import { Globe, Share2, Code2, Tag, Image as ImageIcon, FileCode } from 'lucide-react';
import { SiteSettings, WebsitePage } from '../types';
import { SchemaFormFields } from './SchemaFormFields';
import { ImageInputWithMediaPicker, SidePanel } from './common';

export type TagType = 'meta' | 'og' | 'schema' | 'favicon' | 'code';
interface TagsPanelProps {
isOpen: boolean;
tagType: TagType;
onClose: () => void;
page?: WebsitePage;
onUpdateSiteSettings: (settings: SiteSettings) => void;
uiTheme?: 'dark' | 'light';
}
export const TagsPanel: React.FC<TagsPanelProps> = ({ isOpen, tagType, onClose, page, onUpdateSiteSettings, uiTheme = 'dark', }) => {
const isLight = uiTheme === 'light';
const getInitialSettings = (pg?: WebsitePage): SiteSettings => {
return (pg?.siteSettings || {
title: pg?.title || 'My Website',
description: 'A modern, responsive, high-performance website.',
keywords: 'website, design, modern, responsive',
author: 'Visual HTML Editor',
robots: 'index, follow',
canonicalUrl: '',
language: 'en',
ogTitle: pg?.title || 'My Website',
ogDescription: 'Experience modern, elegant web solutions.',
ogImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
ogType: 'website',
ogSiteName: 'Visual Website Studio',
twitterCard: 'summary_large_image',
twitterHandle: '@visualeditor',
jsonSchemaType: 'Organization',
faviconUrl: '',
appleTouchIcon: '',
themeColor: '#4f46e5',
headScripts: '',
footerScripts: '',
});
};
const [activeTab, setActiveTab] = useState<TagType>(tagType || 'meta');
useEffect(() => {
if (tagType) {
setActiveTab(tagType);
}
}, [tagType]);
const [formData, setFormData] = useState<SiteSettings>(() => getInitialSettings(page));
useEffect(() => {
if (isOpen) {
setFormData(getInitialSettings(page));
}
}, [isOpen, page]);
if (!isOpen)
return null;
const handleChange = (key: keyof SiteSettings, value: any) => {
const updated = { ...formData, [key]: value };
setFormData(updated);
onUpdateSiteSettings(updated);
};
const inputClass = `w-full px-3 py-2 rounded-xl text-xs focus:outline-none transition-colors ${isLight
? 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-indigo-500 focus:bg-white'
: 'bg-slate-950 border border-slate-800 text-slate-100 focus:border-indigo-500 focus:bg-slate-900'}`;
const labelClass = `block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`;
const hintClass = `text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`;
const tabs: Array<{
id: TagType;
label: string;
icon: React.ReactNode;
}> = [
{ id: 'meta', label: 'Meta SEO', icon: <Tag className="w-3.5 h-3.5"/> },
{ id: 'og', label: 'Open Graph', icon: <Share2 className="w-3.5 h-3.5"/> },
{ id: 'schema', label: 'Schema', icon: <FileCode className="w-3.5 h-3.5"/> },
{ id: 'favicon', label: 'Favicon', icon: <ImageIcon className="w-3.5 h-3.5"/> },
{ id: 'code', label: 'Scripts', icon: <Code2 className="w-3.5 h-3.5"/> },
];
const titles: Record<TagType, {
title: string;
icon: React.ReactNode;
}> = {
meta: { title: 'Meta Tags (SEO & Page Info)', icon: <Tag className="w-4 h-4 text-indigo-400"/> },
og: { title: 'Open Graph & Social Share', icon: <Share2 className="w-4 h-4 text-indigo-400"/> },
schema: { title: 'JSON-LD Structured Data', icon: <FileCode className="w-4 h-4 text-indigo-400"/> },
favicon: { title: 'Favicon & Brand Assets', icon: <Globe className="w-4 h-4 text-indigo-400"/> },
code: { title: 'Custom Head & Body Scripts', icon: <Code2 className="w-4 h-4 text-indigo-400"/> },
};
const renderTagContent = () => {
switch (activeTab) {
case 'meta':
return (<div className="space-y-4 p-4 text-xs">
<div>
<label className={labelClass}>Page Meta Title</label>
<input type="text" value={formData.title || ''} onChange={(e) => handleChange('title', e.target.value)} className={inputClass} placeholder="Page Title"/>
<p className={hintClass}>Recommended length: 50-60 characters</p>
</div>

<div>
<label className={labelClass}>Meta Description</label>
<textarea value={formData.description || ''} onChange={(e) => handleChange('description', e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="Summarize the page content for search engines..."/>
<p className={hintClass}>Recommended length: 150-160 characters</p>
</div>

<div>
<label className={labelClass}>Meta Keywords</label>
<input type="text" value={formData.keywords || ''} onChange={(e) => handleChange('keywords', e.target.value)} className={inputClass} placeholder="keyword1, keyword2, keyword3"/>
</div>

<div className="grid grid-cols-2 gap-3">
<div>
<label className={labelClass}>Robots Indexing</label>
<select value={formData.robots || 'index, follow'} onChange={(e) => handleChange('robots', e.target.value)} className={inputClass}>
<option value="index, follow">Index, Follow (Default)</option>
<option value="noindex, follow">No-Index, Follow</option>
<option value="index, nofollow">Index, No-Follow</option>
<option value="noindex, nofollow">No-Index, No-Follow</option>
</select>
</div>

<div>
<label className={labelClass}>Document Language</label>
<input type="text" value={formData.language || 'en'} onChange={(e) => handleChange('language', e.target.value)} className={inputClass} placeholder="en"/>
</div>
</div>

<div>
<label className={labelClass}>Canonical URL Tag</label>
<input type="text" value={formData.canonicalUrl || ''} onChange={(e) => handleChange('canonicalUrl', e.target.value)} className={inputClass} placeholder="https://yourdomain.com/page"/>
</div>
</div>);
case 'og':
return (<div className="space-y-4 p-4 text-xs">
<div>
<label className={labelClass}>Open Graph Title (og:title)</label>
<input type="text" value={formData.ogTitle || ''} onChange={(e) => handleChange('ogTitle', e.target.value)} className={inputClass} placeholder="Title shown on Facebook, LinkedIn, Twitter"/>
</div>

<div>
<label className={labelClass}>Open Graph Description (og:description)</label>
<textarea value={formData.ogDescription || ''} onChange={(e) => handleChange('ogDescription', e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="Summary snippet shown when link is shared on social media..."/>
</div>

<div>
<ImageInputWithMediaPicker
label="Social Share Image URL (og:image)"
value={formData.ogImage || ''}
onChange={(val) => handleChange('ogImage', val)}
placeholder="https://images.unsplash.com/... or select from media"
isLight={isLight}
variant="default"
modalTitle="Select Open Graph Share Image"
/>
</div>

<div className="grid grid-cols-2 gap-3">
<div>
<label className={labelClass}>Twitter Card Type</label>
<select value={formData.twitterCard || 'summary_large_image'} onChange={(e) => handleChange('twitterCard', e.target.value)} className={inputClass}>
<option value="summary_large_image">Summary Large Image</option>
<option value="summary">Summary Small Card</option>
</select>
</div>

<div>
<label className={labelClass}>Twitter Handle</label>
<input type="text" value={formData.twitterHandle || ''} onChange={(e) => handleChange('twitterHandle', e.target.value)} className={inputClass} placeholder="@yourbrand"/>
</div>
</div>
</div>);
case 'schema':
return (<div className="space-y-4 p-4 text-xs">
<div>
<label className={labelClass}>Structured Data Schema Type</label>
<select value={formData.jsonSchemaType || 'Organization'} onChange={(e) => handleChange('jsonSchemaType', e.target.value)} className={inputClass}>
<option value="Organization">Organization</option>
<option value="LocalBusiness">Local Business</option>
<option value="WebSite">WebSite</option>
<option value="Article">Article / Blog Post</option>
<option value="Custom">Custom Raw JSON-LD</option>
</select>
</div>

{formData.jsonSchemaType === 'Custom' ? (<div>
<label className={labelClass}>Custom Raw JSON-LD Schema Script</label>
<textarea value={formData.customJsonSchema || ''} onChange={(e) => handleChange('customJsonSchema', e.target.value)} rows={8} className={`${inputClass} font-mono text-[11px] resize-none`} placeholder='{\n  "@context": "https://schema.org",\n  "@type": "WebSite",\n  "name": "My Site"\n}'/>
</div>) : (<SchemaFormFields formData={formData} onChange={handleChange} onUpdateSchemaField={(field, val) => {
const updatedSchema = { ...(formData.schemaData || {}), [field]: val };
handleChange('schemaData', updatedSchema);
}} uiTheme={uiTheme}/>)}
</div>);
case 'favicon':
return (<div className="space-y-4 p-4 text-xs">
<div>
<ImageInputWithMediaPicker
label="Favicon Icon URL (.ico / .png / .svg)"
value={formData.faviconUrl || ''}
onChange={(val) => handleChange('faviconUrl', val)}
placeholder="https://example.com/favicon.ico or select from media"
isLight={isLight}
variant="default"
modalTitle="Select Favicon Icon"
hint="Standard browser tab icon (16x16 or 32x32)"
/>
</div>

<div>
<ImageInputWithMediaPicker
label="Apple Touch Icon URL (iPhone/iPad bookmark)"
value={formData.appleTouchIcon || ''}
onChange={(val) => handleChange('appleTouchIcon', val)}
placeholder="https://example.com/apple-icon.png or select from media"
isLight={isLight}
variant="default"
modalTitle="Select Apple Touch Icon"
/>
</div>

<div>
<label className={labelClass}>Mobile Theme Color (Meta theme-color)</label>
<div className="flex items-center gap-2">
<input type="color" value={formData.themeColor || '#4f46e5'} onChange={(e) => handleChange('themeColor', e.target.value)} className="w-8 h-8 rounded border bg-transparent cursor-pointer"/>
<input type="text" value={formData.themeColor || '#4f46e5'} onChange={(e) => handleChange('themeColor', e.target.value)} className={`${inputClass} font-mono`}/>
</div>
</div>
</div>);
case 'code':
return (<div className="space-y-4 p-4 text-xs">
<div>
<label className={labelClass}>Head Scripts & Styles (`&lt;head&gt;` tags)</label>
<textarea value={formData.headScripts || ''} onChange={(e) => handleChange('headScripts', e.target.value)} rows={5} className={`${inputClass} font-mono text-[11px] resize-none`} placeholder='<script src="https://analytics.com/script.js"></script>'/>
<p className={hintClass}>Injected before `&lt;/head&gt;` tag in generated HTML</p>
</div>

<div>
<label className={labelClass}>Footer Scripts (`&lt;/body&gt;` tags)</label>
<textarea value={formData.footerScripts || ''} onChange={(e) => handleChange('footerScripts', e.target.value)} rows={5} className={`${inputClass} font-mono text-[11px] resize-none`} placeholder='<script>console.log("App ready");</script>'/>
<p className={hintClass}>Injected before `&lt;/body&gt;` tag</p>
</div>
</div>);
}
};
return (
<SidePanel
isOpen={isOpen}
onClose={onClose}
title={titles[activeTab]?.title}
icon={titles[activeTab]?.icon}
uiTheme={uiTheme}
width="w-full sm:w-[420px]"
zIndex={90}
>
<div className="overflow-y-auto flex-1 p-1">{renderTagContent()}</div>
</SidePanel>
);
};
