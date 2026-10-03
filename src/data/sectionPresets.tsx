import React from 'react';
import { SquareDashed, Image as ImageIcon } from 'lucide-react';
import { WebsiteSection } from '../types';

export interface SectionPreset {
type: string;
title: string;
category: 'layout' | 'content' | 'media' | 'marketing';
renderVisual: () => React.ReactNode;
getSection: () => WebsiteSection;
}
export const getSectionPresets = (isLight: boolean): SectionPreset[] => [
{
type: 'blank',
title: 'Blank Section',
category: 'layout',
renderVisual: () => (<div className="w-full h-24 rounded-lg border-2 border-dashed border-slate-600/60 bg-slate-900/40 flex flex-col items-center justify-center gap-1.5 transition-colors group-hover:border-indigo-500/80 group-hover:bg-indigo-950/20">
<SquareDashed className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors"/>
<span className="text-[10px] font-medium text-slate-400 group-hover:text-indigo-300">Empty Canvas</span>
</div>),
getSection: () => {
const id = Date.now();
return {
id: `section-${id}`,
type: 'custom',
title: 'Custom Section',
styles: {
backgroundColor: isLight ? '#ffffff' : '#0f172a',
textColor: isLight ? '#0f172a' : '#ffffff',
paddingY: 64,
paddingX: 24,
maxWidth: '7xl',
},
elements: [],
};
},
},
{
type: 'text',
title: 'Text & Editorial',
category: 'content',
renderVisual: () => (<div className="w-full h-24 rounded-lg border border-slate-700/70 bg-slate-900/60 p-3 flex flex-col justify-center gap-1.5 transition-colors group-hover:border-indigo-500/80 group-hover:bg-indigo-950/20">
<div className="w-2/3 h-2.5 rounded bg-indigo-400/80 mb-0.5"></div>
<div className="w-full h-1.5 rounded bg-slate-500/60"></div>
<div className="w-11/12 h-1.5 rounded bg-slate-500/60"></div>
<div className="w-4/5 h-1.5 rounded bg-slate-500/40"></div>
</div>),
getSection: () => {
const id = Date.now();
return {
id: `text-${id}`,
type: 'text',
title: 'Text Section',
styles: {
backgroundColor: isLight ? '#ffffff' : '#0f172a',
textColor: isLight ? '#0f172a' : '#ffffff',
paddingY: 56,
paddingX: 24,
maxWidth: '5xl',
},
elements: [
{
id: `heading-${id}`,
type: 'heading',
label: 'Main Heading',
tag: 'h2',
content: 'Crafting Next-Generation Digital Experiences',
styles: {
typeface: 'Plus Jakarta Sans',
fontWeight: '700',
fontSize: 32,
textColor: isLight ? '#0f172a' : '#ffffff',
textAlign: 'left',
},
},
{
id: `p1-${id}`,
type: 'text',
label: 'Paragraph 1',
tag: 'p',
content: 'We believe that great software is built at the intersection of precision engineering and human-centered design. Every component, typography choice, and responsive layout is intentionally crafted to deliver unparalleled speed, aesthetic elegance, and lasting user delight.',
styles: {
typeface: 'Inter',
fontWeight: '400',
fontSize: 16,
textColor: isLight ? '#475569' : '#94a3b8',
lineHeight: 1.65,
textAlign: 'left',
},
},
{
id: `p2-${id}`,
type: 'text',
label: 'Paragraph 2',
tag: 'p',
content: 'From high-performance web applications to scalable design systems, our platform equips modern creators with intuitive live editing and clean, standards-compliant HTML output.',
styles: {
typeface: 'Inter',
fontWeight: '400',
fontSize: 15,
textColor: isLight ? '#64748b' : '#94a3b8',
lineHeight: 1.6,
textAlign: 'left',
},
},
],
};
},
},
{
type: 'image',
title: 'Image Showcase',
category: 'media',
renderVisual: () => (<div className="w-full h-24 rounded-lg border border-slate-700/70 bg-slate-900/60 p-2 flex flex-col items-center justify-between transition-colors group-hover:border-indigo-500/80 group-hover:bg-indigo-950/20">
<div className="w-full flex-1 rounded bg-slate-800 border border-slate-700/50 flex items-center justify-center relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/30 to-emerald-900/30"></div>
<ImageIcon className="w-6 h-6 text-emerald-400 relative z-10"/>
</div>
<div className="w-1/2 h-1.5 rounded bg-slate-500/50 mt-1.5"></div>
</div>),
getSection: () => {
const id = Date.now();
return {
id: `image-${id}`,
type: 'image',
title: 'Image Showcase Section',
styles: {
backgroundColor: isLight ? '#f8fafc' : '#090d16',
textColor: isLight ? '#0f172a' : '#ffffff',
paddingY: 56,
paddingX: 24,
maxWidth: '7xl',
},
elements: [
{
id: `heading-${id}`,
type: 'heading',
label: 'Gallery Header',
tag: 'h2',
content: 'Visual Showcase & Architecture',
styles: {
typeface: 'Outfit',
fontWeight: '700',
fontSize: 32,
textColor: isLight ? '#0f172a' : '#ffffff',
textAlign: 'center',
},
},
{
id: `img-${id}`,
type: 'image',
label: 'Showcase Image',
src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
alt: 'Modern Architecture',
title: 'Luxury Architecture Showcase',
styles: {
borderRadius: 16,
height: 480,
objectFit: 'cover',
shadow: 'xl',
},
},
{
id: `caption-${id}`,
type: 'text',
label: 'Image Caption',
tag: 'p',
content: 'Photo: High-precision modern architectural facade captured in natural evening light.',
styles: {
typeface: 'Inter',
fontWeight: '400',
fontSize: 13,
textColor: '#64748b',
textAlign: 'center',
},
},
],
};
},
},
{
type: 'video',
title: 'Video Player',
category: 'media',
renderVisual: () => (<div className="w-full h-24 rounded-lg border border-slate-700/70 bg-slate-900/60 p-2 flex flex-col items-center justify-between transition-colors group-hover:border-indigo-500/80 group-hover:bg-indigo-950/20">
<div className="w-full flex-1 rounded bg-slate-950 border border-slate-800 flex items-center justify-center relative overflow-hidden">
<div className="w-7 h-7 rounded-full bg-rose-600/90 flex items-center justify-center shadow-lg">
<div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[7px] border-l-white ml-0.5"></div>
</div>
</div>
<div className="w-2/3 h-1.5 rounded bg-slate-500/50 mt-1.5"></div>
</div>),
getSection: () => {
const id = Date.now();
return {
id: `video-${id}`,
type: 'video',
title: 'Featured Video Section',
styles: {
backgroundColor: '#0b0f19',
textColor: '#ffffff',
paddingY: 64,
paddingX: 24,
maxWidth: '6xl',
},
elements: [
{
id: `heading-${id}`,
type: 'heading',
label: 'Video Section Title',
tag: 'h2',
content: 'Watch How It Works',
styles: {
typeface: 'Outfit',
fontWeight: '700',
fontSize: 32,
textColor: '#ffffff',
textAlign: 'center',
},
},
{
id: `sub-${id}`,
type: 'text',
label: 'Video Subtitle',
tag: 'p',
content: 'Take a 2-minute tour of our visual design canvas and instantaneous HTML export.',
styles: {
typeface: 'Inter',
fontWeight: '400',
fontSize: 16,
textColor: '#94a3b8',
textAlign: 'center',
},
},
{
id: `vid-${id}`,
type: 'video',
label: 'Featured Video',
videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
poster: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
styles: {
borderRadius: 16,
height: 440,
shadow: '2xl',
},
},
],
};
},
},
{
type: 'image-text',
title: 'Image & Text Split',
category: 'content',
renderVisual: () => (<div className="w-full h-24 rounded-lg border border-slate-700/70 bg-slate-900/60 p-2 flex items-center gap-2 transition-colors group-hover:border-indigo-500/80 group-hover:bg-indigo-950/20">
<div className="w-1/2 h-full rounded bg-slate-800 border border-slate-700 flex items-center justify-center">
<ImageIcon className="w-5 h-5 text-sky-400"/>
</div>
<div className="w-1/2 flex flex-col justify-center gap-1">
<div className="w-3/4 h-2 rounded bg-sky-400/80"></div>
<div className="w-full h-1 rounded bg-slate-500/50"></div>
<div className="w-5/6 h-1 rounded bg-slate-500/50"></div>
<div className="w-1/2 h-2.5 rounded bg-indigo-600/80 mt-1"></div>
</div>
</div>),
getSection: () => {
const id = Date.now();
return {
id: `image-text-${id}`,
type: 'image-text',
title: 'Image & Text Split Section',
styles: {
backgroundColor: isLight ? '#f8fafc' : '#0f172a',
textColor: isLight ? '#0f172a' : '#ffffff',
paddingY: 64,
paddingX: 24,
maxWidth: '7xl',
},
elements: [
{
id: `img-${id}`,
type: 'image',
label: 'Feature Photo',
src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
alt: 'Creative Team Collaboration',
styles: {
borderRadius: 16,
height: 380,
objectFit: 'cover',
shadow: 'lg',
},
},
{
id: `col-text-${id}`,
type: 'card',
label: 'Text Column',
styles: {
backgroundColor: 'transparent',
paddingX: 0,
paddingY: 0,
},
children: [
{
id: `h-${id}`,
type: 'heading',
label: 'Column Headline',
tag: 'h2',
content: 'Collaborative Workflows for High-Growth Teams',
styles: {
typeface: 'Plus Jakarta Sans',
fontWeight: '700',
fontSize: 28,
textColor: isLight ? '#0f172a' : '#ffffff',
textAlign: 'left',
},
},
{
id: `p-${id}`,
type: 'text',
label: 'Column Description',
tag: 'p',
content: 'Empower designers and developers to align instantly with frictionless visual editing and production-ready HTML code export.',
styles: {
typeface: 'Inter',
fontWeight: '400',
fontSize: 15,
textColor: isLight ? '#475569' : '#94a3b8',
lineHeight: 1.6,
textAlign: 'left',
},
},
{
id: `btn-${id}`,
type: 'button',
label: 'Action Button',
content: 'Explore Features',
buttonStyle: 'primary',
icon: 'ArrowRight',
styles: {
backgroundColor: '#6366f1',
textColor: '#ffffff',
borderRadius: 8,
paddingX: 20,
paddingY: 10,
},
},
],
},
],
};
},
},
{
type: 'video-text',
title: 'Video & Text Split',
category: 'content',
renderVisual: () => (<div className="w-full h-24 rounded-lg border border-slate-700/70 bg-slate-900/60 p-2 flex items-center gap-2 transition-colors group-hover:border-indigo-500/80 group-hover:bg-indigo-950/20">
<div className="w-1/2 h-full rounded bg-slate-950 border border-slate-800 flex items-center justify-center relative">
<div className="w-5 h-5 rounded-full bg-amber-500/90 flex items-center justify-center">
<div className="w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[5px] border-l-slate-950 ml-0.5"></div>
</div>
</div>
<div className="w-1/2 flex flex-col justify-center gap-1">
<div className="w-3/4 h-2 rounded bg-amber-400/80"></div>
<div className="w-full h-1 rounded bg-slate-500/50"></div>
<div className="w-5/6 h-1 rounded bg-slate-500/50"></div>
<div className="w-1/2 h-2.5 rounded bg-amber-500/80 mt-1"></div>
</div>
</div>),
getSection: () => {
const id = Date.now();
return {
id: `video-text-${id}`,
type: 'video-text',
title: 'Video & Text Split Section',
styles: {
backgroundColor: '#090d16',
textColor: '#ffffff',
paddingY: 64,
paddingX: 24,
maxWidth: '7xl',
},
elements: [
{
id: `vid-${id}`,
type: 'video',
label: 'Side Video Player',
videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
poster: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
styles: {
borderRadius: 16,
height: 340,
shadow: 'xl',
},
},
{
id: `col-text-${id}`,
type: 'card',
label: 'Text Column',
styles: {
backgroundColor: 'transparent',
paddingX: 0,
paddingY: 0,
},
children: [
{
id: `h-${id}`,
type: 'heading',
label: 'Headline',
tag: 'h2',
content: 'See It in Real-Time Action',
styles: {
typeface: 'Plus Jakarta Sans',
fontWeight: '700',
fontSize: 28,
textColor: '#ffffff',
},
},
{
id: `p-${id}`,
type: 'text',
label: 'Description',
tag: 'p',
content: 'Watch our step-by-step walkthrough detailing how to customize styles, inspect elements, and export production HTML in seconds.',
styles: {
typeface: 'Inter',
fontWeight: '400',
fontSize: 15,
textColor: '#94a3b8',
lineHeight: 1.6,
},
},
{
id: `btn-${id}`,
type: 'button',
label: 'Demo Button',
content: 'Schedule a Consultation',
buttonStyle: 'primary',
icon: 'ArrowRight',
styles: {
backgroundColor: '#f59e0b',
textColor: '#0f172a',
borderRadius: 8,
paddingX: 20,
paddingY: 10,
},
},
],
},
],
};
},
},
{
type: 'features',
title: 'Feature Cards (3 Columns)',
category: 'content',
renderVisual: () => (<div className="w-full h-24 rounded-lg border border-slate-700/70 bg-slate-900/60 p-2 flex items-center gap-1.5 transition-colors group-hover:border-indigo-500/80 group-hover:bg-indigo-950/20">
{[1, 2, 3].map((i) => (<div key={i} className="flex-1 h-full rounded bg-slate-800/80 border border-slate-700/60 p-1.5 flex flex-col justify-between">
<div className="w-3.5 h-3.5 rounded bg-indigo-500/40"></div>
<div className="w-3/4 h-1.5 rounded bg-slate-400/80"></div>
<div className="w-full h-1 rounded bg-slate-600/60"></div>
</div>))}
</div>),
getSection: () => {
const id = Date.now();
return {
id: `features-${id}`,
type: 'features',
title: 'Features Grid',
styles: {
backgroundColor: isLight ? '#f8fafc' : '#0f172a',
textColor: isLight ? '#0f172a' : '#ffffff',
paddingY: 64,
paddingX: 24,
maxWidth: '7xl',
},
elements: [
{
id: `f1-${id}`,
type: 'card',
label: 'Feature 1',
styles: {
backgroundColor: isLight ? '#ffffff' : '#1e293b',
borderColor: isLight ? '#e2e8f0' : '#334155',
borderWidth: 1,
borderRadius: 16,
paddingX: 20,
paddingY: 24,
shadow: 'sm',
},
children: [
{
id: `f1-h-${id}`,
type: 'heading',
label: 'Feature Title',
tag: 'h3',
content: 'Lightning Performance',
styles: { typeface: 'Plus Jakarta Sans', fontWeight: '700', fontSize: 18, textColor: isLight ? '#0f172a' : '#ffffff' },
},
{
id: `f1-p-${id}`,
type: 'text',
label: 'Feature Description',
tag: 'p',
content: 'Optimized asset pipelines deliver sub-second paint times and smooth 60fps animations.',
styles: { typeface: 'Inter', fontWeight: '400', fontSize: 14, textColor: isLight ? '#64748b' : '#94a3b8', lineHeight: 1.6 },
},
],
},
{
id: `f2-${id}`,
type: 'card',
label: 'Feature 2',
styles: {
backgroundColor: isLight ? '#ffffff' : '#1e293b',
borderColor: isLight ? '#e2e8f0' : '#334155',
borderWidth: 1,
borderRadius: 16,
paddingX: 20,
paddingY: 24,
shadow: 'sm',
},
children: [
{
id: `f2-h-${id}`,
type: 'heading',
label: 'Feature Title',
tag: 'h3',
content: 'Clean HTML Output',
styles: { typeface: 'Plus Jakarta Sans', fontWeight: '700', fontSize: 18, textColor: isLight ? '#0f172a' : '#ffffff' },
},
{
id: `f2-p-${id}`,
type: 'text',
label: 'Feature Description',
tag: 'p',
content: 'Export pure, semantic HTML and Tailwind CSS ready to deploy on any host instantly.',
styles: { typeface: 'Inter', fontWeight: '400', fontSize: 14, textColor: isLight ? '#64748b' : '#94a3b8', lineHeight: 1.6 },
},
],
},
{
id: `f3-${id}`,
type: 'card',
label: 'Feature 3',
styles: {
backgroundColor: isLight ? '#ffffff' : '#1e293b',
borderColor: isLight ? '#e2e8f0' : '#334155',
borderWidth: 1,
borderRadius: 16,
paddingX: 20,
paddingY: 24,
shadow: 'sm',
},
children: [
{
id: `f3-h-${id}`,
type: 'heading',
label: 'Feature Title',
tag: 'h3',
content: 'Full Responsive Design',
styles: { typeface: 'Plus Jakarta Sans', fontWeight: '700', fontSize: 18, textColor: isLight ? '#0f172a' : '#ffffff' },
},
{
id: `f3-p-${id}`,
type: 'text',
label: 'Feature Description',
tag: 'p',
content: 'Fluid adaptive columns and typography that look stunning on desktop, tablet, and mobile.',
styles: { typeface: 'Inter', fontWeight: '400', fontSize: 14, textColor: isLight ? '#64748b' : '#94a3b8', lineHeight: 1.6 },
},
],
},
],
};
},
},
{
type: 'pricing',
title: 'Pricing Plans',
category: 'marketing',
renderVisual: () => (<div className="w-full h-24 rounded-lg border border-slate-700/70 bg-slate-900/60 p-2 flex items-center gap-1.5 transition-colors group-hover:border-indigo-500/80 group-hover:bg-indigo-950/20">
<div className="flex-1 h-full rounded bg-slate-800/60 border border-slate-700/40 p-1 flex flex-col justify-between">
<div className="w-1/2 h-1.5 rounded bg-slate-400"></div>
<div className="w-3/4 h-3 rounded bg-slate-500"></div>
<div className="w-full h-2 rounded bg-slate-700"></div>
</div>
<div className="flex-1 h-full rounded bg-indigo-950/60 border border-indigo-500/60 p-1 flex flex-col justify-between">
<div className="w-1/2 h-1.5 rounded bg-indigo-300"></div>
<div className="w-3/4 h-3 rounded bg-indigo-400"></div>
<div className="w-full h-2 rounded bg-indigo-600"></div>
</div>
</div>),
getSection: () => {
const id = Date.now();
return {
id: `pricing-${id}`,
type: 'pricing',
title: 'Pricing Section',
styles: {
backgroundColor: isLight ? '#ffffff' : '#0b0f19',
textColor: isLight ? '#0f172a' : '#ffffff',
paddingY: 64,
paddingX: 24,
maxWidth: '6xl',
},
elements: [
{
id: `p-starter-${id}`,
type: 'card',
label: 'Starter Tier',
styles: {
backgroundColor: isLight ? '#f8fafc' : '#1e293b',
borderColor: isLight ? '#e2e8f0' : '#334155',
borderWidth: 1,
borderRadius: 16,
paddingX: 24,
paddingY: 28,
shadow: 'md',
},
children: [
{
id: `p-st-h-${id}`,
type: 'heading',
label: 'Tier Name',
tag: 'h3',
content: 'Starter',
styles: { typeface: 'Plus Jakarta Sans', fontWeight: '700', fontSize: 20, textColor: isLight ? '#0f172a' : '#ffffff' },
},
{
id: `p-st-p-${id}`,
type: 'heading',
label: 'Price',
tag: 'h2',
content: '$0 <span style="font-size:14px;font-weight:400;color:#94a3b8">/ month</span>',
styles: { typeface: 'Outfit', fontWeight: '800', fontSize: 32, textColor: isLight ? '#0f172a' : '#ffffff' },
},
{
id: `p-st-btn-${id}`,
type: 'button',
label: 'CTA',
content: 'Get Started Free',
buttonStyle: 'secondary',
styles: { borderRadius: 10, paddingX: 18, paddingY: 10, fullWidth: true },
},
],
},
{
id: `p-pro-${id}`,
type: 'card',
label: 'Pro Tier',
styles: {
backgroundColor: isLight ? '#f5f3ff' : '#1e1b4b',
borderColor: '#6366f1',
borderWidth: 2,
borderRadius: 16,
paddingX: 24,
paddingY: 28,
shadow: 'xl',
},
children: [
{
id: `p-pro-h-${id}`,
type: 'heading',
label: 'Tier Name',
tag: 'h3',
content: 'Professional',
styles: { typeface: 'Plus Jakarta Sans', fontWeight: '700', fontSize: 20, textColor: isLight ? '#0f172a' : '#ffffff' },
},
{
id: `p-pro-p-${id}`,
type: 'heading',
label: 'Price',
tag: 'h2',
content: '$29 <span style="font-size:14px;font-weight:400;color:#94a3b8">/ month</span>',
styles: { typeface: 'Outfit', fontWeight: '800', fontSize: 32, textColor: '#6366f1' },
},
{
id: `p-pro-btn-${id}`,
type: 'button',
label: 'CTA',
content: 'Start Pro Trial',
buttonStyle: 'primary',
styles: { backgroundColor: '#6366f1', textColor: '#ffffff', borderRadius: 10, paddingX: 18, paddingY: 10, fullWidth: true },
},
],
},
],
};
},
},
{
type: 'cta',
title: 'Call to Action Banner',
category: 'marketing',
renderVisual: () => (<div className="w-full h-24 rounded-lg border border-indigo-500/40 bg-gradient-to-r from-indigo-950/80 to-purple-950/80 p-3 flex flex-col items-center justify-center text-center gap-1.5 transition-colors group-hover:border-indigo-400">
<div className="w-3/4 h-2.5 rounded bg-indigo-300"></div>
<div className="w-1/2 h-1.5 rounded bg-slate-400/70"></div>
<div className="w-1/3 h-3 rounded bg-indigo-600 mt-1"></div>
</div>),
getSection: () => {
const id = Date.now();
return {
id: `cta-${id}`,
type: 'custom',
title: 'Call to Action Section',
styles: {
backgroundColor: '#1e1b4b',
textColor: '#ffffff',
paddingY: 72,
paddingX: 24,
maxWidth: '5xl',
borderRadius: 24,
},
elements: [
{
id: `cta-h-${id}`,
type: 'heading',
label: 'CTA Heading',
tag: 'h2',
content: 'Ready to Elevate Your Web Presence?',
styles: {
typeface: 'Plus Jakarta Sans',
fontWeight: '800',
fontSize: 34,
textColor: '#ffffff',
textAlign: 'center',
},
},
{
id: `cta-p-${id}`,
type: 'text',
label: 'CTA Description',
tag: 'p',
content: 'Join thousands of creative teams building production-ready web experiences faster.',
styles: {
typeface: 'Inter',
fontWeight: '400',
fontSize: 16,
textColor: '#c7d2fe',
textAlign: 'center',
lineHeight: 1.6,
},
},
{
id: `cta-btn-${id}`,
type: 'button',
label: 'CTA Button',
content: 'Get Started for Free',
buttonStyle: 'primary',
icon: 'ArrowRight',
styles: {
backgroundColor: '#6366f1',
textColor: '#ffffff',
borderRadius: 12,
paddingX: 28,
paddingY: 12,
fontSize: 16,
fontWeight: '600',
},
},
],
};
},
},
{
type: 'stats',
title: 'Stats & Metrics',
category: 'marketing',
renderVisual: () => (<div className="w-full h-24 rounded-lg border border-slate-700/70 bg-slate-900/60 p-2 flex items-center justify-around gap-1 transition-colors group-hover:border-indigo-500/80 group-hover:bg-indigo-950/20">
{[
{ val: '99%', lbl: 'Uptime' },
{ val: '10k+', lbl: 'Users' },
{ val: '4.9★', lbl: 'Rating' },
].map((item, idx) => (<div key={idx} className="flex flex-col items-center gap-1">
<span className="text-xs font-black text-indigo-400">{item.val}</span>
<span className="text-[9px] text-slate-400">{item.lbl}</span>
</div>))}
</div>),
getSection: () => {
const id = Date.now();
return {
id: `stats-${id}`,
type: 'features',
title: 'Stats Counter Section',
styles: {
backgroundColor: isLight ? '#f1f5f9' : '#0f172a',
textColor: isLight ? '#0f172a' : '#ffffff',
paddingY: 56,
paddingX: 24,
maxWidth: '7xl',
},
elements: [
{
id: `st1-${id}`,
type: 'card',
label: 'Stat 1',
styles: {
backgroundColor: isLight ? '#ffffff' : '#1e293b',
borderRadius: 16,
paddingX: 20,
paddingY: 20,
textAlign: 'center',
},
children: [
{
id: `st1-num-${id}`,
type: 'heading',
label: 'Value',
tag: 'h2',
content: '99.99%',
styles: { typeface: 'Outfit', fontWeight: '800', fontSize: 36, textColor: '#10b981', textAlign: 'center' },
},
{
id: `st1-txt-${id}`,
type: 'text',
label: 'Label',
tag: 'p',
content: 'System Availability & Uptime',
styles: { typeface: 'Inter', fontWeight: '500', fontSize: 13, textColor: isLight ? '#64748b' : '#94a3b8', textAlign: 'center' },
},
],
},
{
id: `st2-${id}`,
type: 'card',
label: 'Stat 2',
styles: {
backgroundColor: isLight ? '#ffffff' : '#1e293b',
borderRadius: 16,
paddingX: 20,
paddingY: 20,
textAlign: 'center',
},
children: [
{
id: `st2-num-${id}`,
type: 'heading',
label: 'Value',
tag: 'h2',
content: '50M+',
styles: { typeface: 'Outfit', fontWeight: '800', fontSize: 36, textColor: '#6366f1', textAlign: 'center' },
},
{
id: `st2-txt-${id}`,
type: 'text',
label: 'Label',
tag: 'p',
content: 'Requests Processed Daily',
styles: { typeface: 'Inter', fontWeight: '500', fontSize: 13, textColor: isLight ? '#64748b' : '#94a3b8', textAlign: 'center' },
},
],
},
{
id: `st3-${id}`,
type: 'card',
label: 'Stat 3',
styles: {
backgroundColor: isLight ? '#ffffff' : '#1e293b',
borderRadius: 16,
paddingX: 20,
paddingY: 20,
textAlign: 'center',
},
children: [
{
id: `st3-num-${id}`,
type: 'heading',
label: 'Value',
tag: 'h2',
content: '4.9 / 5',
styles: { typeface: 'Outfit', fontWeight: '800', fontSize: 36, textColor: '#f59e0b', textAlign: 'center' },
},
{
id: `st3-txt-${id}`,
type: 'text',
label: 'Label',
tag: 'p',
content: 'Customer Satisfaction Score',
styles: { typeface: 'Inter', fontWeight: '500', fontSize: 13, textColor: isLight ? '#64748b' : '#94a3b8', textAlign: 'center' },
},
],
},
],
};
},
},
{
type: 'faq',
title: 'Frequently Asked Questions',
category: 'content',
renderVisual: () => (<div className="w-full h-24 rounded-lg border border-slate-700/70 bg-slate-900/60 p-2.5 flex flex-col justify-center gap-1.5 transition-colors group-hover:border-indigo-500/80 group-hover:bg-indigo-950/20">
<div className="w-full h-4 rounded bg-slate-800 border border-slate-700 flex items-center px-1.5">
<div className="w-2/3 h-1.5 rounded bg-slate-400"></div>
</div>
<div className="w-full h-4 rounded bg-slate-800 border border-slate-700 flex items-center px-1.5">
<div className="w-3/4 h-1.5 rounded bg-slate-400"></div>
</div>
<div className="w-full h-4 rounded bg-slate-800 border border-slate-700 flex items-center px-1.5">
<div className="w-1/2 h-1.5 rounded bg-slate-400"></div>
</div>
</div>),
getSection: () => {
const id = Date.now();
return {
id: `faq-${id}`,
type: 'custom',
title: 'FAQ Section',
styles: {
backgroundColor: isLight ? '#ffffff' : '#0f172a',
textColor: isLight ? '#0f172a' : '#ffffff',
paddingY: 64,
paddingX: 24,
maxWidth: '4xl',
},
elements: [
{
id: `faq-h-${id}`,
type: 'heading',
label: 'FAQ Title',
tag: 'h2',
content: 'Frequently Asked Questions',
styles: { typeface: 'Plus Jakarta Sans', fontWeight: '700', fontSize: 32, textAlign: 'center' },
},
{
id: `faq-q1-${id}`,
type: 'card',
label: 'Question 1',
styles: {
backgroundColor: isLight ? '#f8fafc' : '#1e293b',
borderColor: isLight ? '#e2e8f0' : '#334155',
borderWidth: 1,
borderRadius: 12,
paddingX: 20,
paddingY: 16,
},
children: [
{
id: `faq-q1-t-${id}`,
type: 'heading',
label: 'Question',
tag: 'h4',
content: 'How does the live HTML code export work?',
styles: { typeface: 'Plus Jakarta Sans', fontWeight: '600', fontSize: 16 },
},
{
id: `faq-q1-a-${id}`,
type: 'text',
label: 'Answer',
tag: 'p',
content: 'Our compiler converts your entire page structure, typography, responsive styling, and embedded media into a standalone, single-file HTML document with embedded Tailwind styling.',
styles: { typeface: 'Inter', fontWeight: '400', fontSize: 14, textColor: isLight ? '#64748b' : '#94a3b8', lineHeight: 1.6 },
},
],
},
{
id: `faq-q2-${id}`,
type: 'card',
label: 'Question 2',
styles: {
backgroundColor: isLight ? '#f8fafc' : '#1e293b',
borderColor: isLight ? '#e2e8f0' : '#334155',
borderWidth: 1,
borderRadius: 12,
paddingX: 20,
paddingY: 16,
},
children: [
{
id: `faq-q2-t-${id}`,
type: 'heading',
label: 'Question',
tag: 'h4',
content: 'Can I customize font families and Google Fonts?',
styles: { typeface: 'Plus Jakarta Sans', fontWeight: '600', fontSize: 16 },
},
{
id: `faq-q2-a-${id}`,
type: 'text',
label: 'Answer',
tag: 'p',
content: 'Yes, choose from over a dozen curated typography typefaces in the inspector box, and they will render in real-time and export seamlessly.',
styles: { typeface: 'Inter', fontWeight: '400', fontSize: 14, textColor: isLight ? '#64748b' : '#94a3b8', lineHeight: 1.6 },
},
],
},
],
};
},
},
{
type: 'testimonials',
title: 'Testimonials & Reviews',
category: 'marketing',
renderVisual: () => (<div className="w-full h-24 rounded-lg border border-slate-700/70 bg-slate-900/60 p-2 flex items-center gap-1.5 transition-colors group-hover:border-indigo-500/80 group-hover:bg-indigo-950/20">
<div className="flex-1 h-full rounded bg-slate-800/80 border border-slate-700/60 p-2 flex flex-col justify-between">
<div className="text-[9px] text-amber-400">★★★★★</div>
<div className="w-full h-1 rounded bg-slate-500"></div>
<div className="w-1/2 h-1.5 rounded bg-indigo-300"></div>
</div>
<div className="flex-1 h-full rounded bg-slate-800/80 border border-slate-700/60 p-2 flex flex-col justify-between">
<div className="text-[9px] text-amber-400">★★★★★</div>
<div className="w-full h-1 rounded bg-slate-500"></div>
<div className="w-1/2 h-1.5 rounded bg-indigo-300"></div>
</div>
</div>),
getSection: () => {
const id = Date.now();
return {
id: `testimonials-${id}`,
type: 'testimonials',
title: 'Customer Testimonials',
styles: {
backgroundColor: isLight ? '#f8fafc' : '#090d16',
textColor: isLight ? '#0f172a' : '#ffffff',
paddingY: 64,
paddingX: 24,
maxWidth: '7xl',
},
elements: [
{
id: `t1-${id}`,
type: 'card',
label: 'Review 1',
styles: {
backgroundColor: isLight ? '#ffffff' : '#1e293b',
borderColor: isLight ? '#e2e8f0' : '#334155',
borderWidth: 1,
borderRadius: 16,
paddingX: 24,
paddingY: 24,
shadow: 'md',
},
children: [
{
id: `t1-stars-${id}`,
type: 'heading',
label: 'Stars',
tag: 'h4',
content: '★★★★★',
styles: { fontSize: 16, textColor: '#f59e0b' },
},
{
id: `t1-quote-${id}`,
type: 'text',
label: 'Quote',
tag: 'p',
content: '“This editor completely transformed our design-to-production workflow. Exporting clean standalone HTML in seconds is a superpower.”',
styles: { typeface: 'Inter', fontWeight: '400', fontSize: 14, lineHeight: 1.6 },
},
{
id: `t1-author-${id}`,
type: 'heading',
label: 'Author',
tag: 'h4',
content: 'Elena Vance — VP of Product',
styles: { typeface: 'Plus Jakarta Sans', fontWeight: '600', fontSize: 13, textColor: '#6366f1' },
},
],
},
{
id: `t2-${id}`,
type: 'card',
label: 'Review 2',
styles: {
backgroundColor: isLight ? '#ffffff' : '#1e293b',
borderColor: isLight ? '#e2e8f0' : '#334155',
borderWidth: 1,
borderRadius: 16,
paddingX: 24,
paddingY: 24,
shadow: 'md',
},
children: [
{
id: `t2-stars-${id}`,
type: 'heading',
label: 'Stars',
tag: 'h4',
content: '★★★★★',
styles: { fontSize: 16, textColor: '#f59e0b' },
},
{
id: `t2-quote-${id}`,
type: 'text',
label: 'Quote',
tag: 'p',
content: '“The visual controls are unbelievably precise. Modifying typography, borders, and responsive grid layouts directly on screen saved us days of work.”',
styles: { typeface: 'Inter', fontWeight: '400', fontSize: 14, lineHeight: 1.6 },
},
{
id: `t2-author-${id}`,
type: 'heading',
label: 'Author',
tag: 'h4',
content: 'Marcus Sterling — Design Lead',
styles: { typeface: 'Plus Jakarta Sans', fontWeight: '600', fontSize: 13, textColor: '#6366f1' },
},
],
},
],
};
},
},
{
type: 'slideshow',
title: 'Image Slideshow',
category: 'media',
renderVisual: () => (<div className="w-full h-24 rounded-lg border border-slate-700/70 bg-slate-900/60 p-2 flex items-center justify-center transition-colors group-hover:border-indigo-500/80 group-hover:bg-indigo-950/20 relative overflow-hidden">
<div className="absolute left-2 w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center"><div className="w-0 h-0 border-t-[3px] border-t-transparent border-r-[4px] border-r-slate-400 border-b-[3px] border-b-transparent"></div></div>
<ImageIcon className="w-6 h-6 text-indigo-400"/>
<div className="absolute right-2 w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center"><div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[4px] border-l-slate-400 border-b-[3px] border-b-transparent"></div></div>
</div>),
getSection: () => {
const id = Date.now();
return {
id: `sec-${id}`,
type: 'slideshow',
title: 'Image Slideshow',
styles: {
paddingY: 64,
paddingX: 24,
backgroundColor: isLight ? '#f8fafc' : '#0f172a',
textColor: isLight ? '#0f172a' : '#ffffff',
maxWidth: '7xl',
},
elements: [
{
id: `el-${id}-1`,
type: 'image',
content: 'Slide 1',
src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200&auto=format&fit=crop&q=80',
styles: { width: '100%', height: 480, objectFit: 'cover', borderRadius: 16 },
},
{
id: `el-${id}-2`,
type: 'image',
content: 'Slide 2',
src: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=1200&auto=format&fit=crop&q=80',
styles: { width: '100%', height: 480, objectFit: 'cover', borderRadius: 16 },
},
{
id: `el-${id}-3`,
type: 'image',
content: 'Slide 3',
src: 'https://images.unsplash.com/photo-1682687220199-d0124f48f95b?w=1200&auto=format&fit=crop&q=80',
styles: { width: '100%', height: 480, objectFit: 'cover', borderRadius: 16 },
},
],
};
},
},
{
type: 'collage',
title: 'Image Collage',
category: 'media',
renderVisual: () => (<div className="w-full h-24 rounded-lg border border-slate-700/70 bg-slate-900/60 p-2 grid grid-cols-2 gap-1 transition-colors group-hover:border-indigo-500/80 group-hover:bg-indigo-950/20">
<div className="rounded bg-slate-800 flex items-center justify-center h-full"><ImageIcon className="w-4 h-4 text-sky-400"/></div>
<div className="grid grid-rows-2 gap-1 h-full">
<div className="rounded bg-slate-800 flex items-center justify-center"><ImageIcon className="w-3 h-3 text-emerald-400"/></div>
<div className="rounded bg-slate-800 flex items-center justify-center"><ImageIcon className="w-3 h-3 text-amber-400"/></div>
</div>
</div>),
getSection: () => {
const id = Date.now();
return {
id: `sec-${id}`,
type: 'collage',
title: 'Image Collage',
styles: {
paddingY: 64,
paddingX: 24,
backgroundColor: isLight ? '#ffffff' : '#0f172a',
textColor: isLight ? '#0f172a' : '#ffffff',
maxWidth: '7xl',
},
elements: [
{
id: `el-${id}-1`,
type: 'image',
content: 'Main Image',
src: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&auto=format&fit=crop&q=80',
styles: { width: '100%', height: 420, objectFit: 'cover', borderRadius: 16 },
},
{
id: `el-${id}-2`,
type: 'image',
content: 'Top Right Image',
src: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=800&auto=format&fit=crop&q=80',
styles: { width: '100%', height: 200, objectFit: 'cover', borderRadius: 16 },
},
{
id: `el-${id}-3`,
type: 'image',
content: 'Bottom Right Image',
src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop&q=80',
styles: { width: '100%', height: 200, objectFit: 'cover', borderRadius: 16 },
},
],
};
},
},
];
