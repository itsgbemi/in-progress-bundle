import React, { useState, useEffect, useRef } from 'react';
import { Globe, Mail, Phone, ExternalLink, ChevronDown, Sparkles, FolderOpen } from 'lucide-react';
import { getBrandInfo, BrandInfo } from '../../services/brandInfoService';

export interface BrandLinkOption {
id: string;
category: 'email' | 'phone' | 'link';
label: string;
value: string;
displayValue: string;
}

interface BrandLinkPickerProps {
onSelectLink: (url: string, suggestedLabel?: string) => void;
uiTheme?: 'dark' | 'light';
className?: string;
buttonLabel?: string;
variant?: 'button' | 'folderIcon';
align?: 'left' | 'right';
}

export const BrandLinkPicker: React.FC<BrandLinkPickerProps> = ({
onSelectLink,
uiTheme = 'dark',
className = '',
buttonLabel = 'Select from Brand / Profile Links',
variant = 'button',
align = 'right',
}) => {
const isLight = uiTheme === 'light';
const [isOpen, setIsOpen] = useState(false);
const [options, setOptions] = useState<BrandLinkOption[]>([]);
const containerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
const loadBrandOptions = () => {
const brand: BrandInfo = getBrandInfo(true);
const items: BrandLinkOption[] = [];

if (brand.email?.trim()) {
const mailVal = brand.email.trim().startsWith('mailto:')
? brand.email.trim()
: `mailto:${brand.email.trim()}`;
items.push({
id: 'brand-primary-email',
category: 'email',
label: 'Brand Support Email',
value: mailVal,
displayValue: brand.email.trim(),
});
}

if (brand.emails && Array.isArray(brand.emails)) {
brand.emails.forEach((item, idx) => {
if (item.email?.trim()) {
const mailVal = item.email.trim().startsWith('mailto:')
? item.email.trim()
: `mailto:${item.email.trim()}`;
if (!items.some((x) => x.value === mailVal)) {
items.push({
id: `brand-email-${idx}`,
category: 'email',
label: item.label || 'Brand Email',
value: mailVal,
displayValue: item.email.trim(),
});
}
}
});
}

try {
const userEmailsRaw = localStorage.getItem('user_emails');
if (userEmailsRaw) {
const parsed = JSON.parse(userEmailsRaw);
if (Array.isArray(parsed)) {
parsed.forEach((item, idx) => {
if (item.email?.trim()) {
const mailVal = item.email.trim().startsWith('mailto:')
? item.email.trim()
: `mailto:${item.email.trim()}`;
if (!items.some((x) => x.value === mailVal)) {
items.push({
id: `user-email-${idx}`,
category: 'email',
label: item.label || 'User Email',
value: mailVal,
displayValue: item.email.trim(),
});
}
}
});
}
}
} catch {}

if (brand.phone?.trim()) {
const phoneVal = brand.phone.trim().startsWith('tel:')
? brand.phone.trim()
: `tel:${brand.phone.trim()}`;
items.push({
id: 'brand-primary-phone',
category: 'phone',
label: 'Brand Main Phone',
value: phoneVal,
displayValue: brand.phone.trim(),
});
}

if (brand.phones && Array.isArray(brand.phones)) {
brand.phones.forEach((item, idx) => {
if (item.phone?.trim()) {
const phoneVal = item.phone.trim().startsWith('tel:')
? item.phone.trim()
: `tel:${item.phone.trim()}`;
if (!items.some((x) => x.value === phoneVal)) {
items.push({
id: `brand-phone-${idx}`,
category: 'phone',
label: item.label || 'Brand Phone',
value: phoneVal,
displayValue: item.phone.trim(),
});
}
}
});
}

try {
const userPhonesRaw = localStorage.getItem('user_phones');
if (userPhonesRaw) {
const parsed = JSON.parse(userPhonesRaw);
if (Array.isArray(parsed)) {
parsed.forEach((item, idx) => {
if (item.phone?.trim()) {
const phoneVal = item.phone.trim().startsWith('tel:')
? item.phone.trim()
: `tel:${item.phone.trim()}`;
if (!items.some((x) => x.value === phoneVal)) {
items.push({
id: `user-phone-${idx}`,
category: 'phone',
label: item.label || 'User Phone',
value: phoneVal,
displayValue: item.phone.trim(),
});
}
}
});
}
}
} catch {}

if (brand.website?.trim()) {
items.push({
id: 'brand-website',
category: 'link',
label: 'Official Website',
value: brand.website.trim(),
displayValue: brand.website.trim(),
});
}
if (brand.twitter?.trim()) {
items.push({
id: 'brand-twitter',
category: 'link',
label: 'Twitter / X',
value: brand.twitter.trim(),
displayValue: brand.twitter.trim(),
});
}
if (brand.linkedin?.trim()) {
items.push({
id: 'brand-linkedin',
category: 'link',
label: 'LinkedIn',
value: brand.linkedin.trim(),
displayValue: brand.linkedin.trim(),
});
}
if (brand.github?.trim()) {
items.push({
id: 'brand-github',
category: 'link',
label: 'GitHub',
value: brand.github.trim(),
displayValue: brand.github.trim(),
});
}
if (brand.instagram?.trim()) {
items.push({
id: 'brand-instagram',
category: 'link',
label: 'Instagram',
value: brand.instagram.trim(),
displayValue: brand.instagram.trim(),
});
}
if (brand.youtube?.trim()) {
items.push({
id: 'brand-youtube',
category: 'link',
label: 'YouTube',
value: brand.youtube.trim(),
displayValue: brand.youtube.trim(),
});
}
if (brand.facebook?.trim()) {
items.push({
id: 'brand-facebook',
category: 'link',
label: 'Facebook',
value: brand.facebook.trim(),
displayValue: brand.facebook.trim(),
});
}
if (brand.discord?.trim()) {
items.push({
id: 'brand-discord',
category: 'link',
label: 'Discord',
value: brand.discord.trim(),
displayValue: brand.discord.trim(),
});
}
if (brand.tiktok?.trim()) {
items.push({
id: 'brand-tiktok',
category: 'link',
label: 'TikTok',
value: brand.tiktok.trim(),
displayValue: brand.tiktok.trim(),
});
}

if (brand.customLinks && Array.isArray(brand.customLinks)) {
brand.customLinks.forEach((item, idx) => {
if (item.url?.trim()) {
items.push({
id: `custom-link-${idx}`,
category: 'link',
label: item.label || 'Custom Link',
value: item.url.trim(),
displayValue: item.url.trim(),
});
}
});
}

setOptions(items);
};

loadBrandOptions();
window.addEventListener('brand_info_updated', loadBrandOptions);
return () => window.removeEventListener('brand_info_updated', loadBrandOptions);
}, []);

useEffect(() => {
const handleClickOutside = (e: MouseEvent) => {
if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
setIsOpen(false);
}
};
document.addEventListener('mousedown', handleClickOutside);
return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

const emailsList = options.filter((o) => o.category === 'email');
const phonesList = options.filter((o) => o.category === 'phone');
const linksList = options.filter((o) => o.category === 'link');

const handleSelectOption = (opt: BrandLinkOption) => {
onSelectLink(opt.value, opt.displayValue);
setIsOpen(false);
};

return (
<div ref={containerRef} className={`relative inline-block text-xs ${className}`}>
{variant === 'folderIcon' ? (
<button
type="button"
onClick={() => setIsOpen(!isOpen)}
title="Pick saved brand link, email, or phone number"
aria-label="Pick saved brand link, email, or phone number"
className={`w-9 h-9 sm:w-9.5 sm:h-9.5 shrink-0 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
isLight
? 'bg-slate-100/90 hover:bg-indigo-50/70 border-slate-300 text-slate-600 hover:text-indigo-600'
: 'bg-slate-800/90 hover:bg-indigo-950/70 border-slate-700 text-slate-300 hover:text-indigo-400'
}`}
>
<FolderOpen className="w-4 h-4" />
</button>
) : (
<button
type="button"
onClick={() => setIsOpen(!isOpen)}
className={`w-full px-3 py-2 rounded-xl border font-medium text-xs flex items-center justify-between gap-2 transition-all cursor-pointer shadow-xs ${
isLight
? 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 hover:border-slate-300'
: 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-200 hover:border-slate-700'
}`}
>
<div className="flex items-center gap-1.5 truncate">
<Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
<span className="truncate">{buttonLabel}</span>
</div>
<ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
</button>
)}

{isOpen && (
<div
className={`absolute mt-1.5 z-50 rounded-2xl border shadow-2xl overflow-hidden max-h-72 overflow-y-auto no-scrollbar animate-in fade-in duration-150 ${
variant === 'folderIcon' ? 'w-64 sm:w-72' : 'w-full left-0 right-0'
} ${align === 'right' ? 'right-0' : 'left-0'} ${
isLight
? 'bg-white border-slate-200 text-slate-800'
: 'bg-slate-950 border-slate-800 text-slate-100'
}`}
>
{options.length === 0 ? (
<div className="p-3 text-center">
<p className="text-xs text-slate-400">No saved brand links found.</p>
</div>
) : (
<div className="p-1.5 space-y-0.5">
{options.map((opt) => (
<button
key={opt.id}
type="button"
onClick={() => handleSelectOption(opt)}
className={`w-full px-3 py-2 rounded-lg text-left transition-colors cursor-pointer text-xs font-normal flex items-center min-w-0 ${
isLight
? 'hover:bg-slate-100 text-slate-800'
: 'hover:bg-slate-900 text-slate-200'
}`}
>
<span className="font-mono text-xs truncate w-full block text-left pl-0.5">{opt.displayValue}</span>
</button>
))}
</div>
)}
</div>
)}
</div>
);
};
