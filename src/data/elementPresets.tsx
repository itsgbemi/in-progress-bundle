import React from 'react';
import {
AlignLeft,
Heading1,
Heading3,
MousePointerClick,
LayoutGrid,
ImageIcon,
Video,
Table as TableIcon,
Minus,
Grid,
Columns,
Sparkles,
Layers,
CheckSquare,
FormInput,
FileText,
Mail,
Lock,
Hash,
ListFilter,
Calendar,
UploadCloud,
Send,
Radio,
Rows3,
WrapText,
CreditCard,
Square,
Type,
ChevronDown,
} from 'lucide-react';
import { WebsiteElement, ElementType } from '../types';

export interface LayoutOption {
id: string;
name: string;
icon: React.ReactNode;
}

export interface DisplayOption {
name: string;
type: ElementType;
icon: React.ReactNode;
getElement: () => WebsiteElement;
}

export interface StandardElementOption {
name: string;
type: string;
category: 'typography' | 'interactive' | 'containers' | 'media';
icon: React.ReactNode;
getElement: () => WebsiteElement;
}

export interface FormFieldOption {
name: string;
type: string;
icon: React.ReactNode;
getElement: () => WebsiteElement;
}

export const getLayoutOptions = (): LayoutOption[] => [
{
id: '1',
name: '1 Column',
icon: <Square className="w-5 h-5" />,
},
{
id: '2',
name: '2 Columns',
icon: <LayoutGrid className="w-5 h-5" />,
},
{
id: '3',
name: '3 Columns',
icon: <Grid className="w-5 h-5" />,
},
{
id: '4',
name: '4 Columns',
icon: <Columns className="w-5 h-5" />,
},
{
id: 'flex',
name: 'Flex',
icon: <Rows3 className="w-5 h-5" />,
},
{
id: 'flex-wrap',
name: 'Flex Wrap',
icon: <WrapText className="w-5 h-5" />,
},
];

export const getDisplayOptions = (): DisplayOption[] => [
{
name: 'Inline',
type: 'inline',
icon: <Rows3 className="w-5 h-5" />,
getElement: () => ({
id: `inline-${Date.now()}`,
type: 'inline',
label: 'Inline',
styles: {
layoutDirection: 'row',
flexWrap: 'wrap',
gap: 12,
alignItems: 'center',
justifyContent: 'flex-start',
backgroundColor: 'transparent',
paddingX: 8,
paddingY: 8,
},
children: [],
}),
},
];

export const getStandardElements = (isLight: boolean, effectiveFont: string): StandardElementOption[] => [
{
name: 'Heading',
type: 'heading',
category: 'typography',
icon: <Heading1 className="w-5 h-5" />,
getElement: () => ({
id: `heading-${Date.now()}`,
type: 'heading',
label: 'Heading Title',
tag: 'h2',
content: 'Transform Your Digital Workflow',
styles: {
typeface: effectiveFont,
fontWeight: '700',
fontSize: 32,
textColor: isLight ? '#031738' : '#ffffff',
textAlign: 'left',
},
}),
},

{
name: 'Subheading',
type: 'subheading',
category: 'typography',
icon: <Heading3 className="w-5 h-5" />,
getElement: () => ({
id: `subheading-${Date.now()}`,
type: 'heading',
label: 'Subheading',
tag: 'h3',
content: 'Enterprise-grade speed and reliability',
styles: {
typeface: effectiveFont,
fontWeight: '600',
fontSize: 20,
textColor: isLight ? '#1e293b' : '#cbd5e1',
textAlign: 'left',
},
}),
},

{
name: 'Paragraph',
type: 'text',
category: 'typography',
icon: <AlignLeft className="w-5 h-5" />,
getElement: () => ({
id: `text-${Date.now()}`,
type: 'text',
label: 'Paragraph Copy',
tag: 'p',
content:
'Design, build, and publish modern responsive web experiences with precision typography, clean layouts, and instantaneous HTML code exports.',
styles: {
typeface: effectiveFont,
fontWeight: '400',
fontSize: 16,
textColor: isLight ? '#334155' : '#94a3b8',
lineHeight: 1.65,
textAlign: 'left',
},
}),
},

{
name: 'Span',
type: 'span',
category: 'typography',
icon: <Type className="w-5 h-5" />,
getElement: () => ({
id: `span-${Date.now()}`,
type: 'text',
label: 'Span Text',
tag: 'span',
content: 'Inline text snippet',
styles: {
typeface: effectiveFont,
fontWeight: '400',
fontSize: 14,
textColor: isLight ? '#334155' : '#cbd5e1',
textAlign: 'left',
},
}),
},

{
name: 'Button',
type: 'button-primary',
category: 'interactive',
icon: <MousePointerClick className="w-5 h-5" />,
getElement: () => ({
id: `btn-${Date.now()}`,
type: 'button',
label: 'Button',
content: 'Get Started Now',
buttonStyle: 'primary',
buttonSize: 'md',
buttonDisplayMode: 'icon-text',
buttonIcon: 'arrow-right',
icon: 'ArrowRight',
iconPosition: 'right',
styles: {
typeface: effectiveFont,
backgroundColor: '#4f46e5',
textColor: '#ffffff',
borderRadius: 10,
paddingX: 20,
paddingY: 10,
fontWeight: '600',
},
}),
},

{
name: 'Logo',
type: 'logo',
category: 'interactive',
icon: <Sparkles className="w-5 h-5" />,
getElement: () => ({
id: `logo-${Date.now()}`,
type: 'logo',
label: 'Brand Logo',
content: 'BRAND LOGO',
logoType: 'text',
styles: {
typeface: effectiveFont,
fontWeight: '800',
fontSize: 22,
textColor: isLight ? '#09090b' : '#ffffff',
letterSpacing: 0.5,
},
}),
},

{
name: 'Navigation',
type: 'nav-links',
category: 'interactive',
icon: <Layers className="w-5 h-5" />,
getElement: () => {
const id = Date.now();
const font = effectiveFont;
const textColor = isLight ? '#334155' : '#cbd5e1';
return {
id: `nav-${id}`,
type: 'nav-links',
label: 'Navigation',
content: 'Home, About, Services, Contact',
styles: {
typeface: font,
fontSize: 14,
fontWeight: '600',
textColor,
gap: 24,
paddingX: 8,
paddingY: 4,
},
children: [
{
id: `nav-link-${id}-1`,
type: 'nav-link',
label: 'Home',
content: 'Home',
href: '#home',
target: '_self',
styles: { typeface: font, fontSize: 14, fontWeight: '600', textColor },
},
{
id: `nav-link-${id}-2`,
type: 'nav-link',
label: 'About',
content: 'About',
href: '#about',
target: '_self',
styles: { typeface: font, fontSize: 14, fontWeight: '600', textColor },
},
{
id: `nav-link-${id}-3`,
type: 'nav-link',
label: 'Services',
content: 'Services',
href: '#services',
target: '_self',
styles: { typeface: font, fontSize: 14, fontWeight: '600', textColor },
},
{
id: `nav-link-${id}-4`,
type: 'nav-link',
label: 'Contact',
content: 'Contact',
href: '#contact',
target: '_self',
styles: { typeface: font, fontSize: 14, fontWeight: '600', textColor },
},
],
};
},
},

{
name: 'Form Area',
type: 'form',
category: 'containers',
icon: <CheckSquare className="w-5 h-5" />,
getElement: () => {
const id = Date.now();
return {
id: `form-${id}`,
type: 'form',
label: 'Form Area',
styles: {
backgroundColor: isLight ? '#f8fafc' : '#1e293b',
borderColor: isLight ? '#e2e8f0' : '#334155',
borderWidth: 1,
borderRadius: 16,
paddingX: 24,
paddingY: 24,
display: 'flex',
flexDirection: 'column',
gap: 16,
},
children: [],
};
},
},

{
name: 'Image',
type: 'image',
category: 'media',
icon: <ImageIcon className="w-5 h-5" />,
getElement: () => ({
id: `img-${Date.now()}`,
type: 'image',
label: 'Image',
src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
alt: 'Modern Tech Workspace',
title: 'Modern Tech Workspace',
styles: { width: '100%', borderRadius: 8, height: 280, objectFit: 'cover' },
}),
},

{
name: 'Video',
type: 'video',
category: 'media',
icon: <Video className="w-5 h-5" />,
getElement: () => ({
id: `vid-${Date.now()}`,
type: 'video',
label: 'Video',
videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
styles: { borderRadius: 14, height: 340, shadow: 'lg' },
}),
},

{
name: 'Accordion',
type: 'accordion',
category: 'containers',
icon: <ChevronDown className="w-5 h-5" />,
getElement: () => ({
id: `el-${Date.now()}`,
type: 'accordion',
accordionItems: [
{
title: 'How do I publish or export my website?',
content: 'You can export clean, standalone HTML and CSS files directly using the Export button in the top navbar.',
isOpen: true,
},
],
accordionIconStyle: 'chevron',
accordionItemBg: 'transparent',
styles: {
paddingY: 8,
paddingX: 0,
},
}),
},

{
name: 'Table',
type: 'table',
category: 'containers',
icon: <TableIcon className="w-5 h-5" />,
getElement: () => ({
id: `tbl-${Date.now()}`,
type: 'table',
label: 'Data Table',
tableData: {
headers: ['Table Header 1', 'Table Header 2', 'Table Header 3'],
rows: [
['Cell 1', 'Cell 2', 'Cell 3'],
['Cell 4', 'Cell 5', 'Cell 6'],
],
includeHeader: true,
zebraStripes: false,
tableAlignment: 'full',
},
styles: {
backgroundColor: isLight ? '#ffffff' : '#1e293b',
textColor: isLight ? '#031738' : '#f8fafc',
borderColor: isLight ? '#e2e8f0' : '#334155',
borderWidth: 1,
borderRadius: 12,
},
}),
},

{
name: 'Icon',
type: 'icon',
category: 'media',
icon: <Sparkles className="w-5 h-5" />,
getElement: () => ({
id: `icon-${Date.now()}`,
type: 'icon',
label: 'Feature Icon',
iconName: 'sparkles',
iconSize: 32,
iconColor: '#4f46e5',
iconBgColor: isLight ? '#e0e7ff' : '#1e1b4b',
iconBorderRadius: 12,
iconPadding: 12,
styles: {
paddingY: 4,
paddingX: 4,
},
}),
},

{
name: 'Modal',
type: 'modal',
category: 'interactive',
icon: <Layers className="w-5 h-5" />,
getElement: () => ({
id: `modal-${Date.now()}`,
type: 'modal',
label: 'Interactive Modal',
modalTriggerText: 'Open Announcement Modal',
modalTriggerStyle: 'button',
modalTitle: 'Special Announcement',
modalContent: 'Explore our latest features, templates, and integration capabilities designed to elevate your site performance.',
modalIsOpen: false,
styles: {
paddingY: 8,
},
}),
},

{
name: 'Divider',
type: 'divider',
category: 'typography',
icon: <Minus className="w-5 h-5" />,
getElement: () => ({
id: `divider-${Date.now()}`,
type: 'divider',
label: 'Divider Line',
styles: {
borderColor: isLight ? '#e2e8f0' : '#334155',
borderWidth: 1,
marginY: 24,
width: '100%',
},
}),
},
];

export const getFormFieldElements = (isLight: boolean): FormFieldOption[] => [
{
name: 'Text Input',
type: 'form-input-text',
icon: <FormInput className="w-5 h-5" />,
getElement: () => ({
id: `input-text-${Date.now()}`,
type: 'form-input-text',
label: 'Text Field',
inputLabel: 'Full Name',
showInputLabel: true,
inputPlaceholder: 'Enter your name...',
inputRequired: false,
styles: {
textColor: isLight ? '#0f172a' : '#f8fafc',
backgroundColor: isLight ? '#ffffff' : '#0f172a',
borderColor: isLight ? '#cbd5e1' : '#334155',
borderWidth: 1,
borderRadius: 8,
paddingY: 10,
paddingX: 14,
fontSize: 14,
},
}),
},
{
name: 'Textarea',
type: 'form-textarea',
icon: <FileText className="w-5 h-5" />,
getElement: () => ({
id: `textarea-${Date.now()}`,
type: 'form-textarea',
label: 'Textarea Field',
inputLabel: 'Message / Details',
showInputLabel: true,
inputPlaceholder: 'Write your message here...',
inputRows: 4,
inputRequired: false,
styles: {
textColor: isLight ? '#0f172a' : '#f8fafc',
backgroundColor: isLight ? '#ffffff' : '#0f172a',
borderColor: isLight ? '#cbd5e1' : '#334155',
borderWidth: 1,
borderRadius: 8,
paddingY: 10,
paddingX: 14,
fontSize: 14,
},
}),
},

{
name: 'Email Input',
type: 'form-input-email',
icon: <Mail className="w-5 h-5" />,
getElement: () => ({
id: `input-email-${Date.now()}`,
type: 'form-input-email',
label: 'Email Field',
inputLabel: 'Email Address',
showInputLabel: true,
inputPlaceholder: 'user@example.com',
inputRequired: true,
styles: {
textColor: isLight ? '#0f172a' : '#f8fafc',
backgroundColor: isLight ? '#ffffff' : '#0f172a',
borderColor: isLight ? '#cbd5e1' : '#334155',
borderWidth: 1,
borderRadius: 8,
paddingY: 10,
paddingX: 14,
fontSize: 14,
},
}),
},

{
name: 'Password Input',
type: 'form-input-password',
icon: <Lock className="w-5 h-5" />,
getElement: () => ({
id: `input-pwd-${Date.now()}`,
type: 'form-input-password',
label: 'Password Field',
inputLabel: 'Password',
showInputLabel: true,
inputPlaceholder: '••••••••',
inputRequired: true,
styles: {
textColor: isLight ? '#0f172a' : '#f8fafc',
backgroundColor: isLight ? '#ffffff' : '#0f172a',
borderColor: isLight ? '#cbd5e1' : '#334155',
borderWidth: 1,
borderRadius: 8,
paddingY: 10,
paddingX: 14,
fontSize: 14,
},
}),
},

{
name: 'Number Input',
type: 'form-input-number',
icon: <Hash className="w-5 h-5" />,
getElement: () => ({
id: `input-num-${Date.now()}`,
type: 'form-input-number',
label: 'Number Field',
inputLabel: 'Quantity / Amount',
showInputLabel: true,
inputPlaceholder: '0',
inputMin: 0,
inputMax: 100,
inputStep: 1,
styles: {
textColor: isLight ? '#0f172a' : '#f8fafc',
backgroundColor: isLight ? '#ffffff' : '#0f172a',
borderColor: isLight ? '#cbd5e1' : '#334155',
borderWidth: 1,
borderRadius: 8,
paddingY: 10,
paddingX: 14,
fontSize: 14,
},
}),
},

{
name: 'Select Dropdown',
type: 'form-select',
icon: <ListFilter className="w-5 h-5" />,
getElement: () => ({
id: `select-${Date.now()}`,
type: 'form-select',
label: 'Dropdown Select',
inputLabel: 'Select an Option',
showInputLabel: true,
inputOptions: ['Option 1', 'Option 2', 'Option 3'],
styles: {
textColor: isLight ? '#0f172a' : '#f8fafc',
backgroundColor: isLight ? '#ffffff' : '#0f172a',
borderColor: isLight ? '#cbd5e1' : '#334155',
borderWidth: 1,
borderRadius: 8,
paddingY: 10,
paddingX: 14,
fontSize: 14,
},
}),
},

{
name: 'Checkbox',
type: 'form-checkbox',
icon: <CheckSquare className="w-5 h-5" />,
getElement: () => ({
id: `chk-${Date.now()}`,
type: 'form-checkbox',
label: 'Checkbox Field',
inputLabel: 'I agree to the terms and privacy policy',
styles: {
textColor: isLight ? '#0f172a' : '#f8fafc',
fontSize: 14,
paddingY: 4,
paddingX: 4,
},
}),
},

{
name: 'Radio Button',
type: 'form-radio',
icon: <Radio className="w-5 h-5" />,
getElement: () => ({
id: `radio-${Date.now()}`,
type: 'form-radio',
label: 'Radio Options',
inputLabel: 'Choose Preference',
showInputLabel: true,
inputOptions: ['Standard Delivery', 'Express Shipping'],
styles: {
textColor: isLight ? '#0f172a' : '#f8fafc',
fontSize: 14,
paddingY: 4,
paddingX: 4,
},
}),
},

{
name: 'Date Picker',
type: 'form-date',
icon: <Calendar className="w-5 h-5" />,
getElement: () => ({
id: `date-${Date.now()}`,
type: 'form-date',
label: 'Date Input',
inputLabel: 'Select Date',
showInputLabel: true,
styles: {
textColor: isLight ? '#0f172a' : '#f8fafc',
backgroundColor: isLight ? '#ffffff' : '#0f172a',
borderColor: isLight ? '#cbd5e1' : '#334155',
borderWidth: 1,
borderRadius: 8,
paddingY: 10,
paddingX: 14,
fontSize: 14,
},
}),
},

{
name: 'File Upload',
type: 'form-file',
icon: <UploadCloud className="w-5 h-5" />,
getElement: () => ({
id: `file-${Date.now()}`,
type: 'form-file',
label: 'File Upload',
inputLabel: 'Upload Document / Image',
showInputLabel: true,
inputHelpText: 'PNG, JPG, PDF up to 10MB',
styles: {
textColor: isLight ? '#0f172a' : '#f8fafc',
backgroundColor: isLight ? '#f8fafc' : '#0f172a',
borderColor: isLight ? '#6366f1' : '#6366f1',
borderWidth: 1,
borderRadius: 8,
paddingY: 14,
paddingX: 14,
fontSize: 14,
},
}),
},

{
name: 'Submit Button',
type: 'form-submit',
icon: <Send className="w-5 h-5" />,
getElement: () => ({
id: `submit-${Date.now()}`,
type: 'form-submit',
label: 'Form Submit Button',
content: 'Submit Form',
styles: {
backgroundColor: '#4f46e5',
textColor: '#ffffff',
borderRadius: 8,
paddingY: 10,
paddingX: 20,
fontWeight: '600',
fontSize: 14,
width: '100%',
},
}),
},
];
