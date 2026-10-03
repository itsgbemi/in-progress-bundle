import React, { useState } from 'react';
import { Plus, Trash2, Copy, Check } from 'lucide-react';
import { SiteSettings } from '../types';
import { getBrandInfo } from '../services/brandInfoService';
interface SchemaFormFieldsProps {
formData: SiteSettings;
onChange: (key: keyof SiteSettings, value: any) => void;
onUpdateSchemaField: (field: string, value: any) => void;
uiTheme?: 'dark' | 'light';
}
function cleanUnindentedLineBreaks(code: string): string {
if (!code) return '';
return code
.split('\n')
.map((line) => line.trimStart())
.filter((line, idx, arr) => line !== '' || (idx > 0 && arr[idx - 1] !== ''))
.join('\n');
}

export function generateFullJsonSchema(settings: SiteSettings): string {
return cleanUnindentedLineBreaks(generateRawJsonSchema(settings));
}

function generateRawJsonSchema(settings: SiteSettings): string {
const brand = getBrandInfo();
const t = settings.jsonSchemaType || 'Organization';
const d = settings.schemaData || {};
if (t === 'Custom' && settings.customJsonSchema) {
return settings.customJsonSchema;
}
if (t === 'Organization') {
const twitterLink = d.socialTwitter || (settings.twitterHandle ? `https://twitter.com/${settings.twitterHandle.replace('@', '')}` : (brand.twitter || ''));
return JSON.stringify({
'@context': 'https://schema.org',
'@type': 'Organization',
name: d.orgName || settings.ogSiteName || brand.name || settings.title || 'Organization Name',
alternateName: d.alternateName || brand.tagline || undefined,
url: d.url || settings.canonicalUrl || brand.website || 'https://example.com',
logo: d.logoUrl || settings.faviconUrl || brand.logoUrl || brand.faviconUrl || '',
description: d.description || settings.description || brand.description || '',
email: d.email || brand.email || undefined,
telephone: d.telephone || brand.phone || undefined,
address: (d.streetAddress || brand.address)
? {
'@type': 'PostalAddress',
streetAddress: d.streetAddress || brand.address,
addressLocality: d.locality || '',
addressRegion: d.region || '',
postalCode: d.postalCode || '',
addressCountry: d.country || 'US',
}
: undefined,
sameAs: [
twitterLink,
d.socialLinkedIn || brand.linkedin,
d.socialGithub || brand.github,
d.socialFacebook || brand.facebook,
d.socialYoutube || brand.youtube,
brand.instagram,
brand.discord,
].filter(Boolean),
}, null, 2);
}
if (t === 'WebSite') {
return JSON.stringify({
'@context': 'https://schema.org',
'@type': 'WebSite',
name: d.siteName || brand.name || settings.title || 'My Website',
alternateName: d.alternateName || brand.tagline || undefined,
url: d.url || settings.canonicalUrl || brand.website || 'https://example.com',
description: d.description || settings.description || brand.description || '',
potentialAction: d.searchUrlTemplate
? {
'@type': 'SearchAction',
target: d.searchUrlTemplate,
'query-input': 'required name=search_term_string',
}
: undefined,
}, null, 2);
}
if (t === 'LocalBusiness') {
return JSON.stringify({
'@context': 'https://schema.org',
'@type': d.businessType || 'LocalBusiness',
name: d.businessName || settings.title || 'Local Business',
image: d.imageUrl || settings.ogImage || '',
url: d.url || settings.canonicalUrl || 'https://example.com',
telephone: d.telephone || '+1-555-019-2834',
priceRange: d.priceRange || '$$',
openingHours: d.openingHours || 'Mo-Fr 09:00-18:00',
address: {
'@type': 'PostalAddress',
streetAddress: d.streetAddress || '100 Main Street',
addressLocality: d.locality || 'San Francisco',
addressRegion: d.region || 'CA',
postalCode: d.postalCode || '94105',
addressCountry: d.country || 'US',
},
geo: d.latitude && d.longitude
? {
'@type': 'GeoCoordinates',
latitude: Number(d.latitude),
longitude: Number(d.longitude),
}
: undefined,
}, null, 2);
}
if (t === 'Article') {
return JSON.stringify({
'@context': 'https://schema.org',
'@type': 'Article',
headline: d.headline || settings.title || 'Article Headline',
description: d.description || settings.description || '',
image: [d.imageUrl || settings.ogImage || 'https://example.com/image.jpg'],
datePublished: d.datePublished || new Date().toISOString().split('T')[0],
dateModified: d.dateModified || new Date().toISOString().split('T')[0],
author: {
'@type': 'Person',
name: d.authorName || settings.author || 'Editorial Author',
url: d.authorUrl || undefined,
},
publisher: {
'@type': 'Organization',
name: d.publisherName || settings.ogSiteName || 'Publisher',
logo: {
'@type': 'ImageObject',
url: d.publisherLogo || settings.faviconUrl || '',
},
},
mainEntityOfPage: {
'@type': 'WebPage',
'@id': d.pageUrl || settings.canonicalUrl || 'https://example.com/article',
},
}, null, 2);
}
if (t === 'Product') {
return JSON.stringify({
'@context': 'https://schema.org',
'@type': 'Product',
name: d.productName || settings.title || 'Premium Product',
image: [d.imageUrl || settings.ogImage || 'https://example.com/product.jpg'],
description: d.description || settings.description || 'High quality product designed for modern teams.',
brand: {
'@type': 'Brand',
name: d.brandName || settings.ogSiteName || 'Brand',
},
sku: d.sku || 'PROD-001',
offers: {
'@type': 'Offer',
url: d.productUrl || settings.canonicalUrl || 'https://example.com',
priceCurrency: d.priceCurrency || 'USD',
price: d.price || '99.00',
availability: `https://schema.org/${d.availability || 'InStock'}`,
},
aggregateRating: d.ratingValue
? {
'@type': 'AggregateRating',
ratingValue: Number(d.ratingValue || '4.9'),
reviewCount: Number(d.reviewCount || '85'),
}
: undefined,
}, null, 2);
}
if (t === 'FAQPage') {
const items = Array.isArray(d.faqItems) && d.faqItems.length > 0
? d.faqItems
: [
{ q: 'How does this website work?', a: 'You can customize all sections visually and export production HTML.' },
{ q: 'Is it mobile responsive?', a: 'Yes, all pages and drawers are fully responsive across all device viewports.' },
];
return JSON.stringify({
'@context': 'https://schema.org',
'@type': 'FAQPage',
mainEntity: items.map((item: any) => ({
'@type': 'Question',
name: item.q || 'Question title',
acceptedAnswer: {
'@type': 'Answer',
text: item.a || 'Answer details',
},
})),
}, null, 2);
}
if (t === 'Event') {
return JSON.stringify({
'@context': 'https://schema.org',
'@type': 'Event',
name: d.eventName || settings.title || 'Annual Innovation Summit',
description: d.description || settings.description || 'Join industry leaders for an engaging conference.',
startDate: d.startDate || '2026-10-15T09:00:00Z',
endDate: d.endDate || '2026-10-15T18:00:00Z',
eventAttendanceMode: `https://schema.org/${d.attendanceMode || 'OfflineEventAttendanceMode'}`,
location: {
'@type': 'Place',
name: d.locationName || 'Metropolitan Convention Center',
address: {
'@type': 'PostalAddress',
streetAddress: d.locationAddress || '100 Convention Blvd',
addressLocality: d.locality || 'San Francisco',
addressRegion: 'CA',
postalCode: '94105',
addressCountry: 'US',
},
},
organizer: {
'@type': 'Organization',
name: d.organizerName || settings.ogSiteName || 'Summit Organizer',
url: settings.canonicalUrl || 'https://example.com',
},
offers: {
'@type': 'Offer',
url: settings.canonicalUrl || 'https://example.com',
price: d.ticketPrice || '149.00',
priceCurrency: d.currency || 'USD',
availability: 'https://schema.org/InStock',
},
}, null, 2);
}
if (t === 'SoftwareApplication') {
return JSON.stringify({
'@context': 'https://schema.org',
'@type': 'SoftwareApplication',
name: d.appName || settings.title || 'Studio App',
operatingSystem: d.operatingSystem || 'Web, iOS, Android, macOS, Windows',
applicationCategory: d.applicationCategory || 'BusinessApplication',
offers: {
'@type': 'Offer',
price: d.price || '0',
priceCurrency: d.priceCurrency || 'USD',
},
aggregateRating: d.ratingValue
? {
'@type': 'AggregateRating',
ratingValue: Number(d.ratingValue || '4.8'),
ratingCount: Number(d.ratingCount || '150'),
}
: undefined,
}, null, 2);
}
if (t === 'Person') {
return JSON.stringify({
'@context': 'https://schema.org',
'@type': 'Person',
name: d.personName || settings.author || 'Author Name',
jobTitle: d.jobTitle || 'Lead Designer',
worksFor: {
'@type': 'Organization',
name: d.companyName || settings.ogSiteName || 'Company Name',
},
url: d.websiteUrl || settings.canonicalUrl || 'https://example.com',
email: d.email || undefined,
telephone: d.telephone || undefined,
image: d.imageUrl || settings.ogImage || '',
sameAs: [d.socialTwitter, d.socialLinkedIn, d.socialGithub].filter(Boolean),
}, null, 2);
}
if (t === 'Service') {
return JSON.stringify({
'@context': 'https://schema.org',
'@type': 'Service',
name: d.serviceName || settings.title || 'Custom Web Development',
serviceType: d.serviceType || 'Web Design & Engineering',
provider: {
'@type': 'Organization',
name: d.providerName || settings.ogSiteName || 'Visual Studio',
url: settings.canonicalUrl || 'https://example.com',
},
areaServed: d.areaServed || 'Global / North America',
description: d.description || settings.description || 'High performance web solutions.',
offers: {
'@type': 'Offer',
price: d.price || '1500.00',
priceCurrency: d.currency || 'USD',
},
}, null, 2);
}
return JSON.stringify({
'@context': 'https://schema.org',
'@type': 'WebSite',
name: settings.title || 'My Website',
url: settings.canonicalUrl || 'https://example.com',
description: settings.description || '',
}, null, 2);
}
export const SchemaFormFields: React.FC<SchemaFormFieldsProps> = ({ formData, onChange, onUpdateSchemaField, uiTheme = 'dark', }) => {
const [copied, setCopied] = useState(false);
const isLight = uiTheme === 'light';
const schemaType = formData.jsonSchemaType || 'Organization';
const d = formData.schemaData || {};
const inputClass = `w-full px-3 py-2 rounded-xl text-xs focus:outline-none transition-colors ${isLight
? 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-indigo-500 focus:bg-white'
: 'bg-slate-950 border border-slate-800 text-slate-100 focus:border-indigo-500 focus:bg-slate-900'}`;
const labelClass = `block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`;
const hintClass = `text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`;
const handleCopyJson = () => {
const jsonStr = generateFullJsonSchema(formData);
navigator.clipboard.writeText(jsonStr);
setCopied(true);
setTimeout(() => setCopied(false), 2000);
};
const faqItems: Array<{
q: string;
a: string;
}> = Array.isArray(d.faqItems)
? d.faqItems
: [
{ q: 'How does this website work?', a: 'You can customize all sections visually and export production HTML.' },
{ q: 'Is it mobile responsive?', a: 'Yes, all pages and drawers are fully responsive across all device viewports.' },
];
const handleAddFaq = () => {
const updated = [...faqItems, { q: 'New Question', a: 'Detailed answer here...' }];
onUpdateSchemaField('faqItems', updated);
};
const handleUpdateFaq = (index: number, key: 'q' | 'a', val: string) => {
const updated = [...faqItems];
updated[index] = { ...updated[index], [key]: val };
onUpdateSchemaField('faqItems', updated);
};
const handleRemoveFaq = (index: number) => {
const updated = faqItems.filter((_, i) => i !== index);
onUpdateSchemaField('faqItems', updated);
};
return (<div className="space-y-4">
<div className="pb-3 border-b border-slate-800">
<select value={schemaType} onChange={(e) => onChange('jsonSchemaType', e.target.value as any)} className={`w-full px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none ${isLight ? 'bg-slate-100 border border-slate-300 text-slate-900' : 'bg-slate-800 border border-slate-700 text-slate-100'}`}>
<option value="Organization">Organization (Company / Agency)</option>
<option value="WebSite">WebSite (Searchable Portal)</option>
<option value="LocalBusiness">LocalBusiness (Store / Firm)</option>
<option value="Article">Article / Blog Post</option>
<option value="Product">Product & Pricing</option>
<option value="FAQPage">FAQPage (Rich Q&A)</option>
<option value="Event">Event / Conference</option>
<option value="SoftwareApplication">Software / App</option>
<option value="Person">Person / Portfolio</option>
<option value="Service">Service Offering</option>
<option value="Custom">Custom JSON-LD Code</option>
</select>
</div>

{schemaType === 'Custom' ? (<div className="space-y-2">
<div className="flex items-center justify-between">
<span className="text-xs font-semibold text-slate-300">
Edit Raw JSON-LD Schema
</span>
<button type="button" onClick={handleCopyJson} className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer">
{copied ? <Check className="w-3.5 h-3.5 text-emerald-400"/> : <Copy className="w-3.5 h-3.5"/>}
<span>{copied ? 'Copied' : 'Copy JSON'}</span>
</button>
</div>

<textarea rows={10} value={formData.customJsonSchema || generateFullJsonSchema(formData)} onChange={(e) => onChange('customJsonSchema', e.target.value)} className={`font-mono text-xs ${inputClass}`} placeholder="Enter valid Schema.org JSON..."/>
</div>) : (
<div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
{schemaType === 'Organization' && (<div className="space-y-3.5">
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
<div>
<label className={labelClass}>Organization Legal Name</label>
<input type="text" value={d.orgName || formData.ogSiteName || formData.title || ''} onChange={(e) => onUpdateSchemaField('orgName', e.target.value)} placeholder="e.g. Apex Global Inc." className={inputClass}/>
</div>
<div>
<label className={labelClass}>Alternate / Trade Name</label>
<input type="text" value={d.alternateName || ''} onChange={(e) => onUpdateSchemaField('alternateName', e.target.value)} placeholder="e.g. Apex Studio" className={inputClass}/>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
<div>
<label className={labelClass}>Website URL</label>
<input type="url" value={d.url || formData.canonicalUrl || ''} onChange={(e) => onUpdateSchemaField('url', e.target.value)} placeholder="https://example.com" className={inputClass}/>
</div>
<div>
<label className={labelClass}>Official Logo URL</label>
<input type="url" value={d.logoUrl || formData.faviconUrl || ''} onChange={(e) => onUpdateSchemaField('logoUrl', e.target.value)} placeholder="https://example.com/logo.png" className={inputClass}/>
</div>
</div>

<div>
<label className={labelClass}>Company Description</label>
<textarea rows={2} value={d.description || formData.description || ''} onChange={(e) => onUpdateSchemaField('description', e.target.value)} placeholder="Summary of organizational mission..." className={inputClass}/>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
<div>
<label className={labelClass}>Contact Email</label>
<input type="email" value={d.email || ''} onChange={(e) => onUpdateSchemaField('email', e.target.value)} placeholder="contact@company.com" className={inputClass}/>
</div>
<div>
<label className={labelClass}>Telephone Number</label>
<input type="tel" value={d.telephone || ''} onChange={(e) => onUpdateSchemaField('telephone', e.target.value)} placeholder="+1-555-019-2834" className={inputClass}/>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
<div>
<label className={labelClass}>Street Address</label>
<input type="text" value={d.streetAddress || ''} onChange={(e) => onUpdateSchemaField('streetAddress', e.target.value)} placeholder="100 Market St" className={inputClass}/>
</div>
<div>
<label className={labelClass}>City / Locality</label>
<input type="text" value={d.locality || ''} onChange={(e) => onUpdateSchemaField('locality', e.target.value)} placeholder="San Francisco" className={inputClass}/>
</div>
<div>
<label className={labelClass}>Postal Code / Country</label>
<input type="text" value={d.postalCode || ''} onChange={(e) => onUpdateSchemaField('postalCode', e.target.value)} placeholder="94105, US" className={inputClass}/>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
<div>
<label className={labelClass}>Twitter / X Profile</label>
<input type="text" value={d.socialTwitter || ''} onChange={(e) => onUpdateSchemaField('socialTwitter', e.target.value)} placeholder="https://twitter.com/company" className={inputClass}/>
</div>
<div>
<label className={labelClass}>LinkedIn Company Page</label>
<input type="text" value={d.socialLinkedIn || ''} onChange={(e) => onUpdateSchemaField('socialLinkedIn', e.target.value)} placeholder="https://linkedin.com/company/apex" className={inputClass}/>
</div>
</div>
</div>)}

{schemaType === 'LocalBusiness' && (<div className="space-y-3.5">
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
<div>
<label className={labelClass}>Business Name</label>
<input type="text" value={d.businessName || formData.title || ''} onChange={(e) => onUpdateSchemaField('businessName', e.target.value)} placeholder="e.g. Downtown Bistro & Cafe" className={inputClass}/>
</div>
<div>
<label className={labelClass}>Business Sub-Type</label>
<select value={d.businessType || 'LocalBusiness'} onChange={(e) => onUpdateSchemaField('businessType', e.target.value)} className={inputClass}>
<option value="LocalBusiness">LocalBusiness (General)</option>
<option value="Restaurant">Restaurant / Cafe / Bar</option>
<option value="Store">Retail Store / Boutique</option>
<option value="MedicalClinic">Medical / Dental Clinic</option>
<option value="RealEstateAgent">Real Estate Agency</option>
<option value="LegalService">Legal / Law Firm</option>
<option value="FinancialService">Financial / Accounting Firm</option>
<option value="AutomotiveBusiness">Auto Repair / Dealership</option>
<option value="HealthAndBeautyBusiness">Salon / Spa / Fitness</option>
</select>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
<div>
<label className={labelClass}>Telephone</label>
<input type="tel" value={d.telephone || ''} onChange={(e) => onUpdateSchemaField('telephone', e.target.value)} placeholder="+1-555-019-2834" className={inputClass}/>
</div>
<div>
<label className={labelClass}>Price Range</label>
<select value={d.priceRange || '$$'} onChange={(e) => onUpdateSchemaField('priceRange', e.target.value)} className={inputClass}>
<option value="$">$ (Inexpensive)</option>
<option value="$$">$$ (Moderate)</option>
<option value="$$$">$$$ (Upscale)</option>
<option value="$$$$">$$$$ (Luxury)</option>
</select>
</div>
<div>
<label className={labelClass}>Opening Hours</label>
<input type="text" value={d.openingHours || 'Mo-Fr 09:00-18:00'} onChange={(e) => onUpdateSchemaField('openingHours', e.target.value)} placeholder="Mo-Sa 08:00-21:00" className={inputClass}/>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
<div>
<label className={labelClass}>Street Address</label>
<input type="text" value={d.streetAddress || ''} onChange={(e) => onUpdateSchemaField('streetAddress', e.target.value)} placeholder="123 Main Blvd" className={inputClass}/>
</div>
<div>
<label className={labelClass}>City / Region</label>
<input type="text" value={d.locality || ''} onChange={(e) => onUpdateSchemaField('locality', e.target.value)} placeholder="San Francisco, CA" className={inputClass}/>
</div>
<div>
<label className={labelClass}>Postal Code / Country</label>
<input type="text" value={d.postalCode || ''} onChange={(e) => onUpdateSchemaField('postalCode', e.target.value)} placeholder="94105, US" className={inputClass}/>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
<div>
<label className={labelClass}>Geo Latitude (Optional)</label>
<input type="text" value={d.latitude || ''} onChange={(e) => onUpdateSchemaField('latitude', e.target.value)} placeholder="37.7749" className={inputClass}/>
</div>
<div>
<label className={labelClass}>Geo Longitude (Optional)</label>
<input type="text" value={d.longitude || ''} onChange={(e) => onUpdateSchemaField('longitude', e.target.value)} placeholder="-122.4194" className={inputClass}/>
</div>
</div>
</div>)}

{schemaType === 'Article' && (<div className="space-y-3.5">
<div>
<label className={labelClass}>Article Headline</label>
<input type="text" value={d.headline || formData.title || ''} onChange={(e) => onUpdateSchemaField('headline', e.target.value)} placeholder="Catchy editorial headline..." className={inputClass}/>
</div>

<div>
<label className={labelClass}>Article Summary / Excerpt</label>
<textarea rows={2} value={d.description || formData.description || ''} onChange={(e) => onUpdateSchemaField('description', e.target.value)} placeholder="Key takeaways and summary..." className={inputClass}/>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
<div>
<label className={labelClass}>Author Full Name</label>
<input type="text" value={d.authorName || formData.author || ''} onChange={(e) => onUpdateSchemaField('authorName', e.target.value)} placeholder="Author Full Name" className={inputClass}/>
</div>
<div>
<label className={labelClass}>Author Bio / Profile URL</label>
<input type="url" value={d.authorUrl || ''} onChange={(e) => onUpdateSchemaField('authorUrl', e.target.value)} placeholder="https://example.com/authors/author" className={inputClass}/>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
<div>
<label className={labelClass}>Date Published (YYYY-MM-DD)</label>
<input type="date" value={d.datePublished || ''} onChange={(e) => onUpdateSchemaField('datePublished', e.target.value)} className={inputClass}/>
</div>
<div>
<label className={labelClass}>Date Modified (YYYY-MM-DD)</label>
<input type="date" value={d.dateModified || ''} onChange={(e) => onUpdateSchemaField('dateModified', e.target.value)} className={inputClass}/>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
<div>
<label className={labelClass}>Publisher Name</label>
<input type="text" value={d.publisherName || formData.ogSiteName || ''} onChange={(e) => onUpdateSchemaField('publisherName', e.target.value)} placeholder="Tech Insights Daily" className={inputClass}/>
</div>
<div>
<label className={labelClass}>Lead Image URL</label>
<input type="url" value={d.imageUrl || formData.ogImage || ''} onChange={(e) => onUpdateSchemaField('imageUrl', e.target.value)} placeholder="https://images.unsplash.com/photo-..." className={inputClass}/>
</div>
</div>
</div>)}

{schemaType === 'Product' && (<div className="space-y-3.5">
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
<div>
<label className={labelClass}>Product Name</label>
<input type="text" value={d.productName || formData.title || ''} onChange={(e) => onUpdateSchemaField('productName', e.target.value)} placeholder="e.g. Wireless Noise-Cancelling Headphones" className={inputClass}/>
</div>
<div>
<label className={labelClass}>Brand Name</label>
<input type="text" value={d.brandName || formData.ogSiteName || ''} onChange={(e) => onUpdateSchemaField('brandName', e.target.value)} placeholder="e.g. SonicPro Audio" className={inputClass}/>
</div>
</div>

<div>
<label className={labelClass}>Product Description</label>
<textarea rows={2} value={d.description || formData.description || ''} onChange={(e) => onUpdateSchemaField('description', e.target.value)} placeholder="Detailed product features and specifications..." className={inputClass}/>
</div>

<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
<div>
<label className={labelClass}>Price</label>
<input type="text" value={d.price || '99.00'} onChange={(e) => onUpdateSchemaField('price', e.target.value)} placeholder="99.00" className={inputClass}/>
</div>
<div>
<label className={labelClass}>Currency</label>
<select value={d.priceCurrency || 'USD'} onChange={(e) => onUpdateSchemaField('priceCurrency', e.target.value)} className={inputClass}>
<option value="USD">USD ($)</option>
<option value="EUR">EUR (€)</option>
<option value="GBP">GBP (£)</option>
<option value="CAD">CAD ($)</option>
<option value="AUD">AUD ($)</option>
<option value="JPY">JPY (¥)</option>
</select>
</div>
<div>
<label className={labelClass}>Stock Availability</label>
<select value={d.availability || 'InStock'} onChange={(e) => onUpdateSchemaField('availability', e.target.value)} className={inputClass}>
<option value="InStock">In Stock</option>
<option value="PreOrder">Pre-Order</option>
<option value="OutOfStock">Out of Stock</option>
<option value="Discontinued">Discontinued</option>
</select>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
<div>
<label className={labelClass}>SKU / Model Number</label>
<input type="text" value={d.sku || 'SKU-001'} onChange={(e) => onUpdateSchemaField('sku', e.target.value)} placeholder="SKU-89240" className={inputClass}/>
</div>
<div>
<label className={labelClass}>Rating Score (1.0 - 5.0)</label>
<input type="number" step="0.1" min="1" max="5" value={d.ratingValue || '4.9'} onChange={(e) => onUpdateSchemaField('ratingValue', e.target.value)} className={inputClass}/>
</div>
<div>
<label className={labelClass}>Review Count</label>
<input type="number" value={d.reviewCount || '128'} onChange={(e) => onUpdateSchemaField('reviewCount', e.target.value)} className={inputClass}/>
</div>
</div>
</div>)}

{schemaType === 'FAQPage' && (<div className="space-y-3">
<div className="flex items-center justify-between">
<div>
<label className={labelClass}>Frequently Asked Questions</label>
<p className={hintClass}>Google displays questions & answers directly in rich search results.</p>
</div>
<button type="button" onClick={handleAddFaq} className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer">
<Plus className="w-3.5 h-3.5"/>
<span>Add Question</span>
</button>
</div>

<div className="space-y-3">
{faqItems.map((item, idx) => (<div key={idx} className={`p-3 rounded-xl border space-y-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'}`}>
<div className="flex items-center justify-between gap-2">
<span className="text-[11px] font-bold text-indigo-400">Q#{idx + 1}</span>
{faqItems.length > 1 && (<button type="button" onClick={() => handleRemoveFaq(idx)} className="p-1 text-slate-500 hover:text-rose-400 transition-colors" title="Remove question">
<Trash2 className="w-3.5 h-3.5"/>
</button>)}
</div>
<input type="text" value={item.q} onChange={(e) => handleUpdateFaq(idx, 'q', e.target.value)} placeholder="Question text..." className={inputClass}/>
<textarea rows={2} value={item.a} onChange={(e) => handleUpdateFaq(idx, 'a', e.target.value)} placeholder="Answer text..." className={inputClass}/>
</div>))}
</div>
</div>)}

{schemaType === 'SoftwareApplication' && (<div className="space-y-3.5">
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
<div>
<label className={labelClass}>Application Name</label>
<input type="text" value={d.appName || formData.title || ''} onChange={(e) => onUpdateSchemaField('appName', e.target.value)} placeholder="e.g. Visual Website Studio" className={inputClass}/>
</div>
<div>
<label className={labelClass}>Application Category</label>
<select value={d.applicationCategory || 'BusinessApplication'} onChange={(e) => onUpdateSchemaField('applicationCategory', e.target.value)} className={inputClass}>
<option value="BusinessApplication">Business Application</option>
<option value="DesignApplication">Design & Creative</option>
<option value="DeveloperApplication">Developer Tools</option>
<option value="UtilitiesApplication">Utilities & Productivity</option>
<option value="MultimediaApplication">Multimedia & Audio</option>
</select>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
<div>
<label className={labelClass}>Operating Systems</label>
<input type="text" value={d.operatingSystem || 'Web, iOS, Android, macOS'} onChange={(e) => onUpdateSchemaField('operatingSystem', e.target.value)} className={inputClass}/>
</div>
<div>
<label className={labelClass}>Price ($)</label>
<input type="text" value={d.price || '0'} onChange={(e) => onUpdateSchemaField('price', e.target.value)} placeholder="0 for free / Freemium" className={inputClass}/>
</div>
<div>
<label className={labelClass}>User Rating (1.0 - 5.0)</label>
<input type="number" step="0.1" min="1" max="5" value={d.ratingValue || '4.8'} onChange={(e) => onUpdateSchemaField('ratingValue', e.target.value)} className={inputClass}/>
</div>
</div>
</div>)}

{schemaType === 'Event' && (<div className="space-y-3.5">
<div>
<label className={labelClass}>Event Name</label>
<input type="text" value={d.eventName || formData.title || ''} onChange={(e) => onUpdateSchemaField('eventName', e.target.value)} placeholder="e.g. Next-Gen Web Summit 2026" className={inputClass}/>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
<div>
<label className={labelClass}>Start Date & Time (ISO 8601)</label>
<input type="text" value={d.startDate || '2026-10-15T09:00:00Z'} onChange={(e) => onUpdateSchemaField('startDate', e.target.value)} placeholder="2026-10-15T09:00:00Z" className={inputClass}/>
</div>
<div>
<label className={labelClass}>End Date & Time</label>
<input type="text" value={d.endDate || '2026-10-15T18:00:00Z'} onChange={(e) => onUpdateSchemaField('endDate', e.target.value)} placeholder="2026-10-15T18:00:00Z" className={inputClass}/>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
<div>
<label className={labelClass}>Attendance Mode</label>
<select value={d.attendanceMode || 'OfflineEventAttendanceMode'} onChange={(e) => onUpdateSchemaField('attendanceMode', e.target.value)} className={inputClass}>
<option value="OfflineEventAttendanceMode">Physical In-Person Venue</option>
<option value="OnlineEventAttendanceMode">Online Virtual Event</option>
<option value="MixedEventAttendanceMode">Hybrid (In-Person & Online)</option>
</select>
</div>
<div>
<label className={labelClass}>Venue Name / Location</label>
<input type="text" value={d.locationName || 'Moscone Center'} onChange={(e) => onUpdateSchemaField('locationName', e.target.value)} placeholder="Moscone Convention Center" className={inputClass}/>
</div>
</div>
</div>)}

{schemaType === 'Person' && (<div className="space-y-3.5">
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
<div>
<label className={labelClass}>Full Name</label>
<input type="text" value={d.personName || formData.author || ''} onChange={(e) => onUpdateSchemaField('personName', e.target.value)} placeholder="Full Name" className={inputClass}/>
</div>
<div>
<label className={labelClass}>Job Title</label>
<input type="text" value={d.jobTitle || ''} onChange={(e) => onUpdateSchemaField('jobTitle', e.target.value)} placeholder="Principal Architect" className={inputClass}/>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
<div>
<label className={labelClass}>Company / Works For</label>
<input type="text" value={d.companyName || formData.ogSiteName || ''} onChange={(e) => onUpdateSchemaField('companyName', e.target.value)} placeholder="Apex Innovations" className={inputClass}/>
</div>
<div>
<label className={labelClass}>Personal / Portfolio URL</label>
<input type="url" value={d.websiteUrl || formData.canonicalUrl || ''} onChange={(e) => onUpdateSchemaField('websiteUrl', e.target.value)} placeholder="https://janedoe.com" className={inputClass}/>
</div>
</div>
</div>)}

{schemaType === 'Service' && (<div className="space-y-3.5">
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
<div>
<label className={labelClass}>Service Name</label>
<input type="text" value={d.serviceName || formData.title || ''} onChange={(e) => onUpdateSchemaField('serviceName', e.target.value)} placeholder="e.g. Custom Web Development & SEO" className={inputClass}/>
</div>
<div>
<label className={labelClass}>Service Category / Type</label>
<input type="text" value={d.serviceType || ''} onChange={(e) => onUpdateSchemaField('serviceType', e.target.value)} placeholder="Digital Marketing, Software Development" className={inputClass}/>
</div>
</div>

<div>
<label className={labelClass}>Service Description</label>
<textarea rows={2} value={d.description || formData.description || ''} onChange={(e) => onUpdateSchemaField('description', e.target.value)} placeholder="Describe your service deliverables..." className={inputClass}/>
</div>
</div>)}

{schemaType === 'WebSite' && (<div className="space-y-3.5">
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
<div>
<label className={labelClass}>Website Name</label>
<input type="text" value={d.siteName || formData.title || ''} onChange={(e) => onUpdateSchemaField('siteName', e.target.value)} placeholder="e.g. Visual Website Studio" className={inputClass}/>
</div>
<div>
<label className={labelClass}>Target Search URL (Optional)</label>
<input type="text" value={d.searchUrlTemplate || ''} onChange={(e) => onUpdateSchemaField('searchUrlTemplate', e.target.value)} placeholder="https://example.com/search?q={search_term_string}" className={inputClass}/>
</div>
</div>

<div>
<label className={labelClass}>Website Description</label>
<textarea rows={2} value={d.description || formData.description || ''} onChange={(e) => onUpdateSchemaField('description', e.target.value)} placeholder="Overview of website portal..." className={inputClass}/>
</div>
</div>)}
</div>)}
</div>);
};
