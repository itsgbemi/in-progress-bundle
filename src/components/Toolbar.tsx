import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
Link as LinkIcon,
List,
CaseSensitive,
Type,
Highlighter,
PaintBucket,
X,
ListOrdered,
ArrowUpDown,
Check,
MoveVertical,
ArrowLeftRight,
AlignJustify,
Superscript,
Subscript,
ChevronDown,
RotateCcw,
Crop,
Plus,
ToggleLeft,
ToggleRight,
Image as ImageIcon,
Upload,
Maximize2,
Sparkles,
Sliders,
Square,
SquareDashed,
SlidersHorizontal,
AlignLeft,
AlignCenter,
AlignRight,
MousePointerClick,
Zap,
Star,
Heart,
Mail,
Phone,
ShoppingCart,
Shield,
Globe,
User,
Search,
ArrowRight,
Settings,
Bell,
Camera,
Lock,
Eye,
Download,
Code,
Play,
Folder,
ThumbsUp,
Compass,
Award,
CircleCheck,
Video,
MapPin,
Box,
Layers,
FileText,
Smile,
Pencil,
Palette,
ExternalLink,
Send,
Trash2,
CheckSquare,
Calendar,
Hash,
Radio,
ArrowUpToLine,
ArrowDownToLine,
StretchVertical,
LayoutGrid,
} from 'lucide-react';
import { SelectedElementContext, WebsiteElement, ElementStyles, ButtonStyle, ObjectFitMode, ImageFilterMode, ShadowDepth } from '../types';
import { SliderWithInput } from './properties/SliderWithInput';
import { InlineColorPicker } from './properties/InlineColorPicker';
import { BottomDrawer } from './BottomDrawer';
import { cleanExportedFontFamilyQuotes } from '../utils/htmlGenerator';
import { colorWithAlpha } from './canvas/elements/StyleComputationHelper';
import { getSelectionOffsets, restoreSelectionFromOffsets, cleanInlineColorStyles } from '../utils/selectionUtils';
import { Popover } from './common/Popover';
import { FontPickerPopover } from './toolbar/FontPickerPopover';
import { TextColorPopover } from './toolbar/TextColorPopover';
import { HighlightPopover } from './toolbar/HighlightPopover';
import { BackgroundPopover } from './toolbar/BackgroundPopover';
import { InsertLinkPopover } from './toolbar/InsertLinkPopover';
import { ImageToolbarPopover } from './toolbar/ImageToolbarPopover';
import { TextDecorationPopover } from './toolbar/TextDecorationPopover';

import { GroupToolbar } from './toolbar/subtoolbars/Group';
import { NavContainerToolbar } from './toolbar/subtoolbars/NavContainer';
import { NavLinkToolbar } from './toolbar/subtoolbars/NavLink';
import { ImageToolbar } from './toolbar/subtoolbars/Image';
import { ButtonToolbar } from './toolbar/subtoolbars/Button';
import { IconToolbar } from './toolbar/subtoolbars/Icon';
import { MediaToolbar } from './toolbar/subtoolbars/Media';
import { ContainerToolbar } from './toolbar/subtoolbars/Container';
import { FormToolbar } from './toolbar/subtoolbars/Form';
import { FormFieldToolbar } from './toolbar/subtoolbars/FormField';
import { TypographyToolbar } from './toolbar/subtoolbars/Typography';

export type TextDecorationStyleType = 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy';

export interface TextDecorationConfig {
active: boolean;
style: TextDecorationStyleType;
thickness: number | 'auto';
color: string;
offset: number;
skipInk?: boolean;
}

export interface DecorationConfigState {
style: TextDecorationStyleType;
thickness: number | 'auto';
color: string;
offset: number;
skipInk: boolean;
}

export type ActiveToolType =
| 'font'
| 'fontStyle'
| 'fontSize'
| 'link'
| 'listStyles'
| 'casing'
| 'textColor'
| 'highlightColor'
| 'backgroundColor'
| 'spacing'
| 'lineHeight'
| 'letterSpacing'
| 'wordSpacing'
| 'underline'
| 'overline'
| 'strikethrough'
| 'imageSource'
| 'imageAlt'
| 'imageAspect'
| 'imageSize'
| 'imageTransform'
| 'imageAdjust'
| 'imageHover'
| 'imageShadow'
| 'imageRadius'
| 'imageBorder'
| 'imageAlign'
| 'imageLink'
| 'buttonText'
| 'buttonVariant'
| 'buttonIcon'
| 'buttonSize'
| 'iconPicker'
| 'iconSize'
| 'iconColor'
| 'iconBg'
| 'iconRotation'
| 'mediaSource'
| 'mediaAspect'
| 'containerBg'
| 'containerPadding'
| 'containerBorder'
| 'containerShadow'
| 'containerLayout'
| 'containerWidth'
| 'containerGap'
| 'formInputSettings'
| 'formResponseSettings'
| 'formSubmitSettings'
| 'formFields'
| null;
interface TextToolbarProps {
selectedContext: SelectedElementContext;
onUpdateElement: (updatedElement: WebsiteElement) => void;
onClose?: () => void;
uiTheme?: 'dark' | 'light';
onUpdateSection?: (section: any) => void;
currentSection?: any;
}
const WEIGHT_OPTIONS = [
{ weight: 100, label: '100 - Thin' },
{ weight: 200, label: '200 - Extra Light' },
{ weight: 300, label: '300 - Light' },
{ weight: 400, label: '400 - Regular' },
{ weight: 500, label: '500 - Medium' },
{ weight: 600, label: '600 - Semi Bold' },
{ weight: 700, label: '700 - Bold' },
{ weight: 800, label: '800 - Extra Bold' },
{ weight: 900, label: '900 - Black' },
];
const SIZE_PRESETS = [
{ label: 'XS 12px', px: 12 },
{ label: 'SM 14px', px: 14 },
{ label: 'Base 16px', px: 16 },
{ label: 'LG 18px', px: 18 },
{ label: 'XL 20px', px: 20 },
{ label: '2XL 24px', px: 24 },
{ label: '3XL 30px', px: 30 },
{ label: '4XL 36px', px: 36 },
{ label: '5XL 48px', px: 48 },
{ label: '6XL 64px', px: 64 },
{ label: '7XL 72px', px: 72 },
{ label: '8XL 96px', px: 96 },
];
const TEXT_STYLE_OPTIONS = [
{ tag: 'h1', label: 'Heading 1', desc: 'Primary Page / Hero Title', sample: 'Main Heading' },
{ tag: 'h2', label: 'Heading 2', desc: 'Section Headline', sample: 'Section Title' },
{ tag: 'h3', label: 'Heading 3', desc: 'Sub-section Headline', sample: 'Sub-heading' },
{ tag: 'h4', label: 'Heading 4', desc: 'Component Title', sample: 'Minor Title' },
{ tag: 'h5', label: 'Heading 5', desc: 'Card Title / Small Heading', sample: 'Small Heading' },
{ tag: 'h6', label: 'Heading 6', desc: 'Uppercase Label / Subtitle', sample: 'Label Text' },
{ tag: 'p', label: 'Paragraph', desc: 'Body Text & Paragraphs', sample: 'Standard body text paragraph content...' },
{ tag: 'span', label: 'Span', desc: 'Inline Text Segment', sample: 'Inline text element' },
{ tag: 'blockquote', label: 'Blockquote', desc: 'Featured Quote / Testimonial', sample: '“Quoted text message”' },
];
const SPACING_PRESETS = [
{ label: 'None', px: 0 },
{ label: 'XS', px: 4 },
{ label: 'SM', px: 8 },
{ label: 'MD', px: 16 },
{ label: 'LG', px: 24 },
{ label: 'XL', px: 32 },
{ label: '2XL', px: 48 },
];
const DECORATION_LINE_STYLES: Array<{
id: TextDecorationStyleType;
label: string;
renderPreview: (type: 'underline' | 'overline' | 'strikethrough', color: string) => React.ReactNode;
}> = [
{
id: 'solid',
label: 'Solid',
renderPreview: (type, c) => (
<span
className="text-base font-serif font-bold relative flex items-center justify-center select-none w-full h-full leading-none"
style={{
textDecorationLine: type === 'underline' ? 'underline' : type === 'overline' ? 'overline' : 'line-through',
textDecorationStyle: 'solid',
textDecorationColor: c,
textDecorationThickness: '2px',
textUnderlineOffset: '2px',
}}
>
{type === 'underline' ? 'u' : type === 'overline' ? 'o' : 's'}
</span>
),
},
{
id: 'double',
label: 'Double',
renderPreview: (type, c) => (
<span
className="text-base font-serif font-bold relative flex items-center justify-center select-none w-full h-full leading-none"
style={{
textDecorationLine: type === 'underline' ? 'underline' : type === 'overline' ? 'overline' : 'line-through',
textDecorationStyle: 'double',
textDecorationColor: c,
textDecorationThickness: '3px',
textUnderlineOffset: '2px',
}}
>
{type === 'underline' ? 'u' : type === 'overline' ? 'o' : 's'}
</span>
),
},
{
id: 'dotted',
label: 'Dotted',
renderPreview: (type, c) => (
<span
className="text-base font-serif font-bold relative flex items-center justify-center select-none w-full h-full leading-none"
style={{
textDecorationLine: type === 'underline' ? 'underline' : type === 'overline' ? 'overline' : 'line-through',
textDecorationStyle: 'dotted',
textDecorationColor: c,
textDecorationThickness: '3px',
textUnderlineOffset: '2px',
}}
>
{type === 'underline' ? 'u' : type === 'overline' ? 'o' : 's'}
</span>
),
},
{
id: 'dashed',
label: 'Dashed',
renderPreview: (type, c) => (
<span
className="text-base font-serif font-bold relative flex items-center justify-center select-none w-full h-full leading-none"
style={{
textDecorationLine: type === 'underline' ? 'underline' : type === 'overline' ? 'overline' : 'line-through',
textDecorationStyle: 'dashed',
textDecorationColor: c,
textDecorationThickness: '2px',
textUnderlineOffset: '2px',
}}
>
{type === 'underline' ? 'u' : type === 'overline' ? 'o' : 's'}
</span>
),
},
{
id: 'wavy',
label: 'Wavy',
renderPreview: (type, c) => (
<span
className="text-base font-serif font-bold relative flex items-center justify-center select-none w-full h-full leading-none"
style={{
textDecorationLine: type === 'underline' ? 'underline' : type === 'overline' ? 'overline' : 'line-through',
textDecorationStyle: 'wavy',
textDecorationColor: c,
textDecorationThickness: '2px',
textUnderlineOffset: '2px',
}}
>
{type === 'underline' ? 'u' : type === 'overline' ? 'o' : 's'}
</span>
),
},
];

const DECORATION_COLOR_PRESETS = [
'#000000', '#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#ffffff',
'#dc2626', '#ef4444', '#ea580c', '#f59e0b', '#16a34a', '#10b981',
'#06b6d4', '#0ea5e9', '#3b82f6', '#4f46e5', '#8b5cf6', '#a855f7', '#ec4899',
];

const stripQuotes = (str?: string): string => {
if (!str)
return '';
return str.replace(/^['"\s]+|['"\s]+$/g, '').replace(/\\"/g, '').replace(/\\'/g, '').trim();
};
const getClosestDecorationSpan = (
node: Node,
root: HTMLElement,
decType?: 'underline' | 'overline' | 'strikethrough'
): HTMLSpanElement | null => {
let curr: Node | null = node;
const targetKey = decType === 'underline' ? 'underline' : decType === 'overline' ? 'overline' : decType === 'strikethrough' ? 'line-through' : undefined;
while (curr && curr !== root) {
if (curr.nodeType === Node.ELEMENT_NODE) {
const el = curr as HTMLElement;
if (el.tagName === 'SPAN') {
const decAttr = el.getAttribute('data-dec-type') || '';
const decLine = (el.style.textDecorationLine || el.style.textDecoration || '').toLowerCase();
if (decType && (decAttr.includes(decType) || (targetKey && decLine.includes(targetKey)))) {
return el as HTMLSpanElement;
} else if (!decType && (decLine && decLine !== 'none' || decAttr)) {
return el as HTMLSpanElement;
}
}
}
curr = curr.parentNode;
}

if (decType && root) {
const spans = Array.from(root.querySelectorAll('span'));
for (const s of spans) {
const decAttr = s.getAttribute('data-dec-type') || '';
const decLine = (s.style.textDecorationLine || s.style.textDecoration || '').toLowerCase();
if (decAttr.includes(decType) || (targetKey && decLine.includes(targetKey))) {
return s;
}
}
}

return null;
};

const findEnclosingSpanForRange = (range: Range, root: HTMLElement): HTMLSpanElement | null => {
if (!root) return null;

let curr: Node | null = range.commonAncestorContainer;
while (curr && curr !== root) {
if (curr.nodeType === Node.ELEMENT_NODE && (curr as HTMLElement).tagName === 'SPAN') {
return curr as HTMLSpanElement;
}
curr = curr.parentNode;
}

if (range.startContainer === range.endContainer && range.startContainer.nodeType === Node.ELEMENT_NODE) {
const parent = range.startContainer as HTMLElement;
if (range.endOffset - range.startOffset === 1) {
const child = parent.childNodes[range.startOffset];
if (child && child.nodeType === Node.ELEMENT_NODE && (child as HTMLElement).tagName === 'SPAN') {
return child as HTMLSpanElement;
}
}
}

const rangeText = range.toString().trim();
if (rangeText) {
const spans = Array.from(root.querySelectorAll('span'));
for (const s of spans) {
const sText = (s.textContent || '').trim();
if (sText === rangeText) {
return s;
}
}
for (const s of spans) {
try {
if (range.intersectsNode(s) && (s.textContent || '').trim()) {
return s;
}
} catch {
}
}
}

if (root.children.length === 1 && root.firstElementChild?.tagName === 'SPAN') {
return root.firstElementChild as HTMLSpanElement;
}

return null;
};

const findEnclosingSpanForElement = (domEl: HTMLElement): HTMLSpanElement | null => {
if (!domEl) return null;
if (domEl.children.length === 1 && domEl.firstElementChild?.tagName === 'SPAN') {
return domEl.firstElementChild as HTMLSpanElement;
}
if (domEl.childNodes.length === 1 && domEl.firstChild?.nodeType === Node.ELEMENT_NODE && (domEl.firstChild as HTMLElement).tagName === 'SPAN') {
return domEl.firstChild as HTMLSpanElement;
}
const decSpan = domEl.querySelector('span[data-dec-type], span[style*="text-decoration"]') as HTMLSpanElement | null;
if (decSpan && (decSpan.textContent || '').trim() === (domEl.textContent || '').trim()) {
return decSpan;
}
const allSpans = domEl.querySelectorAll('span');
if (allSpans.length === 1 && (allSpans[0].textContent || '').trim() === (domEl.textContent || '').trim()) {
return allSpans[0];
}
return null;
};

const cleanRedundantNestedSpans = (container: HTMLElement) => {
if (!container) return;
let changed = true;
let iterations = 0;
while (changed && iterations < 10) {
changed = false;
iterations++;
const spans = Array.from(container.querySelectorAll('span'));
for (const span of spans) {
if (!span.parentNode) continue;

const style = span.getAttribute('style')?.trim();
const className = span.getAttribute('class')?.trim();
const dataDec = span.getAttribute('data-dec-type');

if (!style && !className && !dataDec) {
while (span.firstChild) {
span.parentNode.insertBefore(span.firstChild, span);
}
span.parentNode.removeChild(span);
changed = true;
continue;
}

if (span.childNodes.length === 1) {
const child = span.firstChild;
if (child && child.nodeType === Node.ELEMENT_NODE && (child as HTMLElement).tagName === 'SPAN') {
const childSpan = child as HTMLElement;
for (let i = 0; i < childSpan.style.length; i++) {
const prop = childSpan.style[i];
const val = childSpan.style.getPropertyValue(prop);
const prio = childSpan.style.getPropertyPriority(prop);
if (val) {
span.style.setProperty(prop, val, prio);
}
}
if (childSpan.className && !span.className) {
span.className = childSpan.className;
} else if (childSpan.className && span.className) {
span.className = `${span.className} ${childSpan.className}`;
}
while (childSpan.firstChild) {
span.insertBefore(childSpan.firstChild, childSpan);
}
span.removeChild(childSpan);
changed = true;
}
}
}
}
};

const unwrapSpan = (span: HTMLElement) => {
const parent = span.parentNode;
if (!parent) return;
while (span.firstChild) {
parent.insertBefore(span.firstChild, span);
}
parent.removeChild(span);
};
const renderStyleIcon = (styleId: TextDecorationStyleType) => {
switch (styleId) {
case 'solid':
return <span className="w-3.5 h-[2px] bg-current rounded-full inline-block" />;
case 'double':
return (
<span className="w-3.5 flex flex-col gap-[1.5px] inline-flex justify-center">
<span className="w-full h-[1.5px] bg-current rounded-full" />
<span className="w-full h-[1.5px] bg-current rounded-full" />
</span>
);
case 'dotted':
return (
<span className="w-3.5 flex items-center justify-between inline-flex">
<span className="w-[3px] h-[3px] rounded-full bg-current" />
<span className="w-[3px] h-[3px] rounded-full bg-current" />
<span className="w-[3px] h-[3px] rounded-full bg-current" />
</span>
);
case 'dashed':
return (
<span className="w-3.5 flex items-center gap-[2px] inline-flex">
<span className="w-[6px] h-[2px] rounded-full bg-current" />
<span className="w-[6px] h-[2px] rounded-full bg-current" />
</span>
);
case 'wavy':
return (
<svg className="w-3.5 h-1.5 overflow-visible inline-block" viewBox="0 0 14 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
<path d="M0.5 2.5 Q 2 0.5, 3.5 2.5 T 6.5 2.5 T 9.5 2.5 T 12.5 2.5" />
</svg>
);
}
};

export const Toolbar: React.FC<TextToolbarProps> = ({ selectedContext, onUpdateElement, onClose, uiTheme = 'dark', onUpdateSection, currentSection, }) => {
const isLight = uiTheme === 'light';
const element = selectedContext?.element;
if (!element) return null;
const s = element.styles || {};
const [activeTool, setActiveTool] = useState<ActiveToolType>(null);
const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);
const popoverRef = useRef<HTMLDivElement>(null);
const toolbarRef = useRef<HTMLDivElement>(null);
const savedSelectionRef = useRef<Range | null>(null);
const savedSelectionOffsetsRef = useRef<{ start: number; end: number } | null>(null);
useEffect(() => {
const handleResize = () => {
setIsMobile(window.innerWidth < 640);
};
window.addEventListener('resize', handleResize);
return () => window.removeEventListener('resize', handleResize);
}, []);
const [detectedFontFamily, setDetectedFontFamily] = useState<string>('');
const [detectedFontSize, setDetectedFontSize] = useState<number | null>(null);
const [detectedLinkHref, setDetectedLinkHref] = useState<string>('');
const [detectedLinkTarget, setDetectedLinkTarget] = useState<string>('_self');
const [underlineConfig, setUnderlineConfig] = useState<DecorationConfigState>({
style: (s.underlineStyle as TextDecorationStyleType) || 'solid',
thickness: (s.underlineThickness as any) ?? 'auto',
color: s.underlineColor || '',
offset: s.underlineOffset !== undefined ? Number(s.underlineOffset) : (s.textUnderlineOffset !== undefined ? Number(s.textUnderlineOffset) : 2),
skipInk: (s.underlineSkipInk || s.textDecorationSkipInk) === 'auto',
});
const [overlineConfig, setOverlineConfig] = useState<DecorationConfigState>({
style: (s.overlineStyle as TextDecorationStyleType) || 'solid',
thickness: (s.overlineThickness as any) ?? 'auto',
color: s.overlineColor || '',
offset: s.overlineOffset !== undefined ? Number(s.overlineOffset) : 0,
skipInk: (s.overlineSkipInk || s.textDecorationSkipInk) === 'auto',
});
const [strikethroughConfig, setStrikethroughConfig] = useState<DecorationConfigState>({
style: (s.strikethroughStyle as TextDecorationStyleType) || 'solid',
thickness: (s.strikethroughThickness as any) ?? 'auto',
color: s.strikethroughColor || '',
offset: 0,
skipInk: (s.strikethroughSkipInk || s.textDecorationSkipInk) === 'auto',
});
const [decTab, setDecTab] = useState<'style' | 'color'>('style');
const [showCustomDecColor, setShowCustomDecColor] = useState<boolean>(false);

const [showNavInsertMenu, setShowNavInsertMenu] = useState<boolean>(false);
const [newLinkText, setNewLinkText] = useState<string>('');
const [newLinkUrl, setNewLinkUrl] = useState<string>('');

const getNavChildrenList = (el: WebsiteElement): WebsiteElement[] => {
if (el.children && el.children.length > 0) return el.children;
if (el.items && el.items.length > 0) {
return el.items.map((it: any, idx: number) => ({
id: it.id || `nav_child_${idx}`,
type: 'nav-link',
label: it.label || it.content || 'Link',
content: it.content || it.label || 'Link',
href: it.href || '#',
}));
}
return [];
};

const handleAddNavQuickLink = () => {
if (!element || !onUpdateElement) return;
const currentChildren = getNavChildrenList(element);
const labelToUse = newLinkText.trim() || 'New Link';
const hrefToUse = newLinkUrl.trim() || `#${labelToUse.toLowerCase().replace(/\s+/g, '-')}`;

const newChild: WebsiteElement = {
id: `nav_link_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
type: 'nav-link',
label: labelToUse,
content: labelToUse,
href: hrefToUse,
target: '_self',
};

const updatedChildren = [...currentChildren, newChild];
onUpdateElement({
...element,
children: updatedChildren,
items: updatedChildren.map((c) => ({
id: c.id,
label: c.content || c.label,
href: c.href,
})),
});

setNewLinkText('');
setNewLinkUrl('');
};

const updateNavLinkProp = (childIdx: number, prop: 'label' | 'href', value: string) => {
if (!element || !onUpdateElement) return;
const currentChildren = [...getNavChildrenList(element)];
if (!currentChildren[childIdx]) return;

if (prop === 'label') {
currentChildren[childIdx] = {
...currentChildren[childIdx],
content: value,
label: value,
};
} else if (prop === 'href') {
currentChildren[childIdx] = {
...currentChildren[childIdx],
href: value,
};
}

onUpdateElement({
...element,
children: currentChildren,
items: currentChildren.map((c) => ({
id: c.id,
label: c.content || c.label,
href: c.href,
})),
});
};

const deleteNavLinkItem = (childIdx: number) => {
if (!element || !onUpdateElement) return;
const currentChildren = getNavChildrenList(element).filter((_, idx) => idx !== childIdx);
onUpdateElement({
...element,
children: currentChildren,
items: currentChildren.map((c) => ({
id: c.id,
label: c.content || c.label,
href: c.href,
})),
});
};

const getDecConfig = (type: 'underline' | 'overline' | 'strikethrough'): DecorationConfigState => {
if (type === 'underline') return underlineConfig;
if (type === 'overline') return overlineConfig;
return strikethroughConfig;
};

const updateDecConfig = (type: 'underline' | 'overline' | 'strikethrough', partial: Partial<DecorationConfigState>) => {
if (type === 'underline') setUnderlineConfig((prev) => ({ ...prev, ...partial }));
else if (type === 'overline') setOverlineConfig((prev) => ({ ...prev, ...partial }));
else setStrikethroughConfig((prev) => ({ ...prev, ...partial }));
};
const [activeFormats, setActiveFormats] = useState({
bold: false,
italic: false,
underline: false,
overline: false,
strikethrough: false,
superscript: false,
subscript: false,
link: false,
bulletList: false,
numberedList: false,
});
useEffect(() => {
const handleSelectionChange = () => {
const sel = window.getSelection();
if (!sel || sel.rangeCount === 0 || !selectedContext || !selectedContext.element)
return;
const range = sel.getRangeAt(0);
const elId = selectedContext.element.id;
const domEl = (document.querySelector(`[data-editable-id="${elId}"]`) as HTMLElement) ||
(document.querySelector(`[data-element-id="${elId}"] [contenteditable="true"]`) as HTMLElement) ||
(document.querySelector(`[data-element-id="${elId}"]`) as HTMLElement);
if (domEl && domEl.contains(range.commonAncestorContainer)) {
savedSelectionRef.current = range.cloneRange();
const offsets = getSelectionOffsets(domEl);
if (offsets) {
savedSelectionOffsetsRef.current = offsets;
}
try {
const node = range.commonAncestorContainer;
const targetEl = (node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement) as HTMLElement | null;
if (targetEl) {
const computed = window.getComputedStyle(targetEl);
if (computed.fontFamily) {
const rawFont = computed.fontFamily.split(',')[0].trim();
const firstFont = stripQuotes(rawFont);
if (firstFont) {
setDetectedFontFamily(firstFont);
}
}
const computedPx = parseFloat(computed.fontSize);
if (!isNaN(computedPx) && computedPx > 0) {
setDetectedFontSize(Math.round(computedPx));
}

const uSpan = getClosestDecorationSpan(node, domEl, 'underline');
const oSpan = getClosestDecorationSpan(node, domEl, 'overline');
const sSpan = getClosestDecorationSpan(node, domEl, 'strikethrough');

if (uSpan) {
const th = uSpan.style.textDecorationThickness;
const off = uSpan.style.textUnderlineOffset;
setUnderlineConfig({
style: (uSpan.style.textDecorationStyle as TextDecorationStyleType) || 'solid',
thickness: th === 'auto' ? 'auto' : th ? (parseFloat(th) || 'auto') : 'auto',
color: uSpan.style.textDecorationColor || '',
offset: off ? (parseFloat(off) || 2) : 2,
skipInk: uSpan.style.textDecorationSkipInk === 'auto',
});
} else {
setUnderlineConfig({
style: (s.underlineStyle as TextDecorationStyleType) || (s.textDecorationLine?.includes('underline') ? (s.textDecorationStyle as any) : undefined) || 'solid',
thickness: (s.underlineThickness as any) ?? (s.textDecorationThickness as any) ?? 'auto',
color: s.underlineColor || (s.textDecorationLine?.includes('underline') ? s.textDecorationColor : '') || '',
offset: s.underlineOffset !== undefined ? Number(s.underlineOffset) : (s.textUnderlineOffset !== undefined ? Number(s.textUnderlineOffset) : 2),
skipInk: (s.underlineSkipInk || s.textDecorationSkipInk) === 'auto',
});
}

if (oSpan) {
const th = oSpan.style.textDecorationThickness;
const off = oSpan.style.textUnderlineOffset;
setOverlineConfig({
style: (oSpan.style.textDecorationStyle as TextDecorationStyleType) || 'solid',
thickness: th === 'auto' ? 'auto' : th ? (parseFloat(th) || 'auto') : 'auto',
color: oSpan.style.textDecorationColor || '',
offset: off ? (parseFloat(off) || 0) : 0,
skipInk: oSpan.style.textDecorationSkipInk === 'auto',
});
} else {
setOverlineConfig({
style: (s.overlineStyle as TextDecorationStyleType) || (s.textDecorationLine?.includes('overline') ? (s.textDecorationStyle as any) : undefined) || 'solid',
thickness: (s.overlineThickness as any) ?? (s.textDecorationThickness as any) ?? 'auto',
color: s.overlineColor || (s.textDecorationLine?.includes('overline') ? s.textDecorationColor : '') || '',
offset: s.overlineOffset !== undefined ? Number(s.overlineOffset) : 0,
skipInk: (s.overlineSkipInk || s.textDecorationSkipInk) === 'auto',
});
}

if (sSpan) {
const th = sSpan.style.textDecorationThickness;
setStrikethroughConfig({
style: (sSpan.style.textDecorationStyle as TextDecorationStyleType) || 'solid',
thickness: th === 'auto' ? 'auto' : th ? (parseFloat(th) || 'auto') : 'auto',
color: sSpan.style.textDecorationColor || '',
offset: 0,
skipInk: sSpan.style.textDecorationSkipInk === 'auto',
});
} else {
setStrikethroughConfig({
style: (s.strikethroughStyle as TextDecorationStyleType) || (s.textDecorationLine?.includes('line-through') ? (s.textDecorationStyle as any) : undefined) || 'solid',
thickness: (s.strikethroughThickness as any) ?? (s.textDecorationThickness as any) ?? 'auto',
color: s.strikethroughColor || (s.textDecorationLine?.includes('line-through') ? s.textDecorationColor : '') || '',
offset: 0,
skipInk: (s.strikethroughSkipInk || s.textDecorationSkipInk) === 'auto',
});
}

const textDec = (computed.textDecorationLine || computed.textDecoration || '').toLowerCase();
const isOverline = Boolean(oSpan || textDec.includes('overline') || s.overlineStyle || s.textDecorationLine?.includes('overline'));
const isUnderline = Boolean(uSpan || textDec.includes('underline') || s.underlineStyle || s.textDecorationLine?.includes('underline'));
const isStrike = Boolean(sSpan || textDec.includes('line-through') || s.strikethroughStyle || s.textDecorationLine?.includes('line-through'));
const isBold = Number(computed.fontWeight) >= 600 || computed.fontWeight === 'bold' || Number(s.fontWeight) >= 600 || s.fontWeight === 'bold';
const isItalic = computed.fontStyle === 'italic' || s.fontStyle === 'italic';

const aEl = targetEl.closest('a');
if (aEl) {
setDetectedLinkHref(aEl.getAttribute('href') || '');
setDetectedLinkTarget(aEl.getAttribute('target') || '_self');
} else if (s.href || element.href) {
setDetectedLinkHref(s.href || element.href || '');
setDetectedLinkTarget(s.target || element.target || '_self');
} else {
setDetectedLinkHref('');
setDetectedLinkTarget('_self');
}

const supEl = targetEl.closest('sup');
const subEl = targetEl.closest('sub');
let isSuperCmd = false;
let isSubCmd = false;
try {
isSuperCmd = document.queryCommandState('superscript');
isSubCmd = document.queryCommandState('subscript');
} catch {}

let hasSupInsideRange = false;
let hasSubInsideRange = false;
if (!range.collapsed && domEl) {
const sups = domEl.querySelectorAll('sup');
sups.forEach((sup) => {
if (range.intersectsNode(sup)) hasSupInsideRange = true;
});
const subs = domEl.querySelectorAll('sub');
subs.forEach((sub) => {
if (range.intersectsNode(sub)) hasSubInsideRange = true;
});
}

const isSuper = Boolean(
supEl ||
isSuperCmd ||
hasSupInsideRange ||
computed.verticalAlign === 'super' ||
s.verticalAlign === 'super'
);
const isSub = Boolean(
subEl ||
isSubCmd ||
hasSubInsideRange ||
computed.verticalAlign === 'sub' ||
s.verticalAlign === 'sub'
);
setActiveFormats({
bold: Boolean(isBold),
italic: Boolean(isItalic),
underline: Boolean(isUnderline),
overline: Boolean(isOverline),
strikethrough: Boolean(isStrike),
superscript: Boolean(isSuper),
subscript: Boolean(isSub),
link: Boolean(aEl || s.href || element.href),
bulletList: Boolean(targetEl.closest('ul')),
numberedList: Boolean(targetEl.closest('ol')),
});
}
}
catch {
}
}
};
document.addEventListener('selectionchange', handleSelectionChange);
document.addEventListener('keyup', handleSelectionChange);
document.addEventListener('mouseup', handleSelectionChange);
handleSelectionChange();
return () => {
document.removeEventListener('selectionchange', handleSelectionChange);
document.removeEventListener('keyup', handleSelectionChange);
document.removeEventListener('mouseup', handleSelectionChange);
};
}, [selectedContext, s]);
useEffect(() => {
const handleClickOutside = (event: Event) => {
if (popoverRef.current &&
!popoverRef.current.contains(event.target as Node) &&
toolbarRef.current &&
!toolbarRef.current.contains(event.target as Node)) {
setActiveTool(null);
}
};
if (activeTool) {
document.addEventListener('mousedown', handleClickOutside);
document.addEventListener('touchstart', handleClickOutside);
}
return () => {
document.removeEventListener('mousedown', handleClickOutside);
document.removeEventListener('touchstart', handleClickOutside);
};
}, [activeTool]);
const currentFontSizePx = detectedFontSize || (() => {
const raw = s.fontSize;
if (typeof raw === 'number')
return raw;
if (typeof raw === 'string') {
const parsed = parseFloat(raw);
if (!isNaN(parsed)) {
if (raw.endsWith('rem'))
return Math.round(parsed * 16);
return Math.round(parsed);
}
}
return 16;
})();
const updateStyles = (updates: Record<string, any>) => {
const updatedStyles = {
...element.styles,
...updates,
};
for (const [key, val] of Object.entries(updates)) {
if (val === undefined || val === '') {
delete (updatedStyles as any)[key];
}
}
onUpdateElement({
...element,
styles: updatedStyles,
});
};
const updateStyle = (key: keyof ElementStyles | string, value: any) => {
updateStyles({ [key]: value });
};
const getEditableDomElement = (): HTMLElement | null => {
const elId = element.id;
return (document.querySelector(`[data-editable-id="${elId}"]`) as HTMLElement) ||
(document.querySelector(`[data-element-id="${elId}"] [contenteditable="true"]`) as HTMLElement) ||
(document.querySelector(`[data-element-id="${elId}"]`) as HTMLElement);
};

const restoreSelection = (): HTMLElement | null => {
const domEl = getEditableDomElement();
if (domEl && savedSelectionOffsetsRef.current) {
const { start, end } = savedSelectionOffsetsRef.current;
restoreSelectionFromOffsets(domEl, start, end);
return domEl;
}
const sel = window.getSelection();
if (sel && savedSelectionRef.current) {
try {
sel.removeAllRanges();
sel.addRange(savedSelectionRef.current);
} catch {}
}
return domEl;
};

const getActiveSelection = (): {
sel: Selection;
range: Range;
isFullSelection: boolean;
domEl: HTMLElement;
} | null => {
const domEl = getEditableDomElement();
if (!domEl) return null;

restoreSelection();
let sel = window.getSelection();
let range: Range | null = null;
if (sel && sel.rangeCount > 0 && !sel.getRangeAt(0).collapsed) {
range = sel.getRangeAt(0);
} else if (savedSelectionRef.current && !savedSelectionRef.current.collapsed) {
range = savedSelectionRef.current;
}

if (!range || range.collapsed) return null;

if (domEl.contains(range.commonAncestorContainer)) {
const rangeText = range.toString().replace(/\s+/g, '');
const domText = domEl.innerText.replace(/\s+/g, '');
const isFullSelection = rangeText.length > 0 && rangeText.length >= domText.length;

return { sel: sel!, range, isFullSelection, domEl };
}
return null;
};

const syncContentToElement = () => {
const domEl = getEditableDomElement();
if (domEl) {
const html = cleanExportedFontFamilyQuotes(domEl.innerHTML);
const text = domEl.innerText;
onUpdateElement({
...element,
content: html || text || element.content,
});
}
};

const applyInlineStyleToSelection = (styleName: string, value: string) => {
const active = getActiveSelection();
const domEl = getEditableDomElement();
const offsets = domEl ? getSelectionOffsets(domEl) : savedSelectionOffsetsRef.current;
if (active && domEl) {
try {
const range = active.range;
let targetSpan = findEnclosingSpanForRange(range, domEl);
if (targetSpan) {
(targetSpan.style as any)[styleName] = value;
} else {
const span = document.createElement('span');
(span.style as any)[styleName] = value;
const contents = range.extractContents();
span.appendChild(contents);
range.insertNode(span);
targetSpan = span;
}
cleanRedundantNestedSpans(domEl);
syncContentToElement();
if (offsets) {
restoreSelectionFromOffsets(domEl, offsets.start, offsets.end);
}
return true;
} catch {
return false;
}
}
return false;
};
const applyFormatCommand = (command: string, value: string = '') => {
restoreSelection();
document.execCommand(command, false, value);
syncContentToElement();
};
const handleToggleBold = (e: React.MouseEvent) => {
const active = getActiveSelection();
if (active) {
const isBoldActive = activeFormats.bold;
applyInlineStyleToSelection('fontWeight', isBoldActive ? '400' : '700');
}
else {
const currentWeight = Number(s.fontWeight) || (s.fontWeight === 'bold' ? 700 : 400);
const isBold = currentWeight >= 700;
updateStyle('fontWeight', isBold ? 400 : 700);
}
};
const handleToggleItalic = (e: React.MouseEvent) => {
const active = getActiveSelection();
if (active) {
const isItalicActive = activeFormats.italic;
applyInlineStyleToSelection('fontStyle', isItalicActive ? 'normal' : 'italic');
}
else {
const isItalic = s.fontStyle === 'italic';
updateStyle('fontStyle', isItalic ? 'normal' : 'italic');
}
};
const handleApplyDecorationConfig = (
type: 'underline' | 'overline' | 'strikethrough',
config: TextDecorationConfig
) => {
const activeSelection = getActiveSelection();
const domEl = getEditableDomElement();
const offsets = domEl ? getSelectionOffsets(domEl) : savedSelectionOffsetsRef.current;

const targetLineKey = type === 'underline' ? 'underline' : type === 'overline' ? 'overline' : 'line-through';

updateDecConfig(type, {
style: config.style,
thickness: config.thickness,
color: config.color,
offset: config.offset,
skipInk: config.skipInk ?? false,
});

if (activeSelection && domEl && !activeSelection.isFullSelection) {
try {
const range = activeSelection.range;
let targetSpan = findEnclosingSpanForRange(range, domEl);

if (config.active) {
if (targetSpan) {
const existingRaw = (targetSpan.style.textDecorationLine || targetSpan.style.textDecoration || '').toLowerCase();
const lines = new Set<string>();
if (existingRaw.includes('underline')) lines.add('underline');
if (existingRaw.includes('overline')) lines.add('overline');
if (existingRaw.includes('line-through') || existingRaw.includes('strikethrough')) lines.add('line-through');
lines.add(targetLineKey);

targetSpan.style.textDecorationLine = Array.from(lines).join(' ');
targetSpan.style.textDecorationStyle = config.style;
if (config.thickness !== undefined && config.thickness !== 'auto') {
targetSpan.style.textDecorationThickness = `${config.thickness}px`;
} else {
targetSpan.style.removeProperty('text-decoration-thickness');
}
if (config.color) {
targetSpan.style.textDecorationColor = config.color;
} else {
targetSpan.style.removeProperty('text-decoration-color');
}
if (type !== 'strikethrough' && config.offset !== undefined) {
targetSpan.style.textUnderlineOffset = `${config.offset}px`;
} else if (type !== 'strikethrough') {
targetSpan.style.removeProperty('text-underline-offset');
}
targetSpan.style.textDecorationSkipInk = config.skipInk ? 'auto' : 'none';
} else {
const span = document.createElement('span');
span.style.textDecorationLine = targetLineKey;
span.style.textDecorationStyle = config.style;
if (config.thickness !== undefined && config.thickness !== 'auto') {
span.style.textDecorationThickness = `${config.thickness}px`;
}
if (config.color) {
span.style.textDecorationColor = config.color;
}
if (type !== 'strikethrough' && config.offset !== undefined) {
span.style.textUnderlineOffset = `${config.offset}px`;
}
span.style.textDecorationSkipInk = config.skipInk ? 'auto' : 'none';

const contents = range.extractContents();
span.appendChild(contents);
range.insertNode(span);
targetSpan = span;
}
} else {
if (targetSpan) {
const existingRaw = (targetSpan.style.textDecorationLine || targetSpan.style.textDecoration || '').toLowerCase();
const lines = new Set<string>();
if (existingRaw.includes('underline')) lines.add('underline');
if (existingRaw.includes('overline')) lines.add('overline');
if (existingRaw.includes('line-through') || existingRaw.includes('strikethrough')) lines.add('line-through');
lines.delete(targetLineKey);

if (lines.size > 0) {
targetSpan.style.textDecorationLine = Array.from(lines).join(' ');
} else {
targetSpan.style.removeProperty('text-decoration-line');
targetSpan.style.removeProperty('text-decoration-style');
targetSpan.style.removeProperty('text-decoration-thickness');
targetSpan.style.removeProperty('text-decoration-color');
targetSpan.style.removeProperty('text-underline-offset');
targetSpan.style.removeProperty('text-decoration-skip-ink');
targetSpan.removeAttribute('data-dec-type');

const remainingStyle = targetSpan.getAttribute('style')?.trim();
if (!remainingStyle || remainingStyle === '' || remainingStyle === ';') {
unwrapSpan(targetSpan);
}
}
}
}

cleanRedundantNestedSpans(domEl);

const newHtml = cleanExportedFontFamilyQuotes(domEl.innerHTML);
onUpdateElement({
...element,
content: newHtml,
});

if (targetSpan && targetSpan.parentNode && activeSelection.sel) {
try {
const newRange = document.createRange();
newRange.selectNodeContents(targetSpan);
activeSelection.sel.removeAllRanges();
activeSelection.sel.addRange(newRange);
savedSelectionRef.current = newRange.cloneRange();
} catch {}
} else if (offsets && domEl) {
restoreSelectionFromOffsets(domEl, offsets.start, offsets.end);
}
return;
} catch (e) {
console.warn('Failed inline decoration application:', e);
}
}

const updatedStyles: Record<string, any> = {
...element.styles,
};

if (type === 'underline') {
if (config.active) {
updatedStyles.underlineStyle = config.style;
updatedStyles.underlineThickness = config.thickness;
updatedStyles.underlineColor = config.color || undefined;
updatedStyles.underlineOffset = config.offset;
updatedStyles.underlineSkipInk = config.skipInk ? 'auto' : 'none';
} else {
delete updatedStyles.underlineStyle;
delete updatedStyles.underlineThickness;
delete updatedStyles.underlineColor;
delete updatedStyles.underlineOffset;
delete updatedStyles.underlineSkipInk;
}
} else if (type === 'overline') {
if (config.active) {
updatedStyles.overlineStyle = config.style;
updatedStyles.overlineThickness = config.thickness;
updatedStyles.overlineColor = config.color || undefined;
updatedStyles.overlineOffset = config.offset;
updatedStyles.overlineSkipInk = config.skipInk ? 'auto' : 'none';
} else {
delete updatedStyles.overlineStyle;
delete updatedStyles.overlineThickness;
delete updatedStyles.overlineColor;
delete updatedStyles.overlineOffset;
delete updatedStyles.overlineSkipInk;
}
} else if (type === 'strikethrough') {
if (config.active) {
updatedStyles.strikethroughStyle = config.style;
updatedStyles.strikethroughThickness = config.thickness;
updatedStyles.strikethroughColor = config.color || undefined;
updatedStyles.strikethroughSkipInk = config.skipInk ? 'auto' : 'none';
} else {
delete updatedStyles.strikethroughStyle;
delete updatedStyles.strikethroughThickness;
delete updatedStyles.strikethroughColor;
delete updatedStyles.strikethroughSkipInk;
}
}

const activeLines: string[] = [];
if (updatedStyles.underlineStyle || (type === 'underline' && config.active)) activeLines.push('underline');
if (updatedStyles.overlineStyle || (type === 'overline' && config.active)) activeLines.push('overline');
if (updatedStyles.strikethroughStyle || (type === 'strikethrough' && config.active)) activeLines.push('line-through');

updatedStyles.textDecorationLine = activeLines.length > 0 ? activeLines.join(' ') : 'none';
delete updatedStyles.textDecoration;

if (domEl) {
const enclosingSpan = findEnclosingSpanForElement(domEl);
if (enclosingSpan) {
const existingRaw = (enclosingSpan.style.textDecorationLine || enclosingSpan.style.textDecoration || '').toLowerCase();
const lines = new Set<string>();
if (existingRaw.includes('underline')) lines.add('underline');
if (existingRaw.includes('overline')) lines.add('overline');
if (existingRaw.includes('line-through') || existingRaw.includes('strikethrough')) lines.add('line-through');

if (config.active) {
lines.add(targetLineKey);
enclosingSpan.style.textDecorationLine = Array.from(lines).join(' ');
enclosingSpan.style.textDecorationStyle = config.style;
if (config.thickness !== 'auto' && config.thickness !== undefined) {
enclosingSpan.style.textDecorationThickness = `${config.thickness}px`;
} else {
enclosingSpan.style.removeProperty('text-decoration-thickness');
}
if (config.color) enclosingSpan.style.textDecorationColor = config.color;
else enclosingSpan.style.removeProperty('text-decoration-color');
if (type !== 'strikethrough' && config.offset !== undefined) {
enclosingSpan.style.textUnderlineOffset = `${config.offset}px`;
} else if (type !== 'strikethrough') {
enclosingSpan.style.removeProperty('text-underline-offset');
}
enclosingSpan.style.textDecorationSkipInk = config.skipInk ? 'auto' : 'none';
} else {
lines.delete(targetLineKey);
if (lines.size > 0) {
enclosingSpan.style.textDecorationLine = Array.from(lines).join(' ');
} else {
enclosingSpan.style.removeProperty('text-decoration-line');
enclosingSpan.style.removeProperty('text-decoration-style');
enclosingSpan.style.removeProperty('text-decoration-thickness');
enclosingSpan.style.removeProperty('text-decoration-color');
enclosingSpan.style.removeProperty('text-underline-offset');
enclosingSpan.style.removeProperty('text-decoration-skip-ink');
enclosingSpan.removeAttribute('data-dec-type');

const remainingStyle = enclosingSpan.getAttribute('style')?.trim();
if (!remainingStyle || remainingStyle === '' || remainingStyle === ';') {
unwrapSpan(enclosingSpan);
}
}
}
} else {
if (config.active) {
domEl.style.textDecorationLine = activeLines.length > 0 ? activeLines.join(' ') : targetLineKey;
domEl.style.textDecorationStyle = config.style;
if (config.thickness !== 'auto' && config.thickness !== undefined) {
domEl.style.textDecorationThickness = `${config.thickness}px`;
} else {
domEl.style.removeProperty('text-decoration-thickness');
}
if (config.color) domEl.style.textDecorationColor = config.color;
else domEl.style.removeProperty('text-decoration-color');
if (type !== 'strikethrough' && config.offset !== undefined) {
domEl.style.textUnderlineOffset = `${config.offset}px`;
} else if (type !== 'strikethrough') {
domEl.style.removeProperty('text-underline-offset');
}
domEl.style.textDecorationSkipInk = config.skipInk ? 'auto' : 'none';
} else if (activeLines.length === 0) {
domEl.style.removeProperty('text-decoration-line');
domEl.style.removeProperty('text-decoration-style');
domEl.style.removeProperty('text-decoration-thickness');
domEl.style.removeProperty('text-decoration-color');
domEl.style.removeProperty('text-underline-offset');
domEl.style.removeProperty('text-decoration-skip-ink');
} else {
domEl.style.textDecorationLine = activeLines.join(' ');
}
}

cleanRedundantNestedSpans(domEl);

const newHtml = cleanExportedFontFamilyQuotes(domEl.innerHTML);
onUpdateElement({
...element,
content: newHtml,
styles: updatedStyles as any,
});
if (offsets && domEl) {
restoreSelectionFromOffsets(domEl, offsets.start, offsets.end);
}
} else {
onUpdateElement({
...element,
styles: updatedStyles as any,
});
}
};

const handleRemoveDecoration = (type: 'underline' | 'overline' | 'strikethrough') => {
const curCfg = getDecConfig(type);
handleApplyDecorationConfig(type, {
active: false,
style: curCfg.style,
thickness: curCfg.thickness,
color: curCfg.color,
offset: curCfg.offset,
skipInk: curCfg.skipInk,
});
};

const handleSetDecorationStyle = (
type: 'underline' | 'overline' | 'strikethrough',
newStyle: TextDecorationStyleType
) => {
const curCfg = getDecConfig(type);
updateDecConfig(type, { style: newStyle });
handleApplyDecorationConfig(type, {
active: true,
style: newStyle,
thickness: curCfg.thickness,
color: curCfg.color,
offset: curCfg.offset,
skipInk: curCfg.skipInk,
});
};

const handleUnderlineButtonClick = (e: React.MouseEvent) => {
e.preventDefault();
const curCfg = getDecConfig('underline');
if (activeTool === 'underline') {
setActiveTool(null);
} else {
if (!isUnderlineActive) {
handleApplyDecorationConfig('underline', {
active: true,
style: curCfg.style,
thickness: curCfg.thickness,
color: curCfg.color,
offset: curCfg.offset,
skipInk: curCfg.skipInk,
});
}
setActiveTool('underline');
}
};

const handleOverlineButtonClick = (e: React.MouseEvent) => {
e.preventDefault();
const curCfg = getDecConfig('overline');
if (activeTool === 'overline') {
setActiveTool(null);
} else {
if (!isOverlineActive) {
handleApplyDecorationConfig('overline', {
active: true,
style: curCfg.style,
thickness: curCfg.thickness,
color: curCfg.color,
offset: curCfg.offset,
skipInk: curCfg.skipInk,
});
}
setActiveTool('overline');
}
};

const handleStrikethroughButtonClick = (e: React.MouseEvent) => {
e.preventDefault();
const curCfg = getDecConfig('strikethrough');
if (activeTool === 'strikethrough') {
setActiveTool(null);
} else {
if (!isStrikethroughActive) {
handleApplyDecorationConfig('strikethrough', {
active: true,
style: curCfg.style,
thickness: curCfg.thickness,
color: curCfg.color,
offset: curCfg.offset,
skipInk: curCfg.skipInk,
});
}
setActiveTool('strikethrough');
}
};

const handleSetDecorationThickness = (
type: 'underline' | 'overline' | 'strikethrough',
newThickness: number | 'auto'
) => {
const curCfg = getDecConfig(type);
updateDecConfig(type, { thickness: newThickness });
handleApplyDecorationConfig(type, {
active: true,
style: curCfg.style,
thickness: newThickness,
color: curCfg.color,
offset: curCfg.offset,
skipInk: curCfg.skipInk,
});
};

const handleSetDecorationOffset = (
type: 'underline' | 'overline' | 'strikethrough',
newOffset: number
) => {
const curCfg = getDecConfig(type);
updateDecConfig(type, { offset: newOffset });
handleApplyDecorationConfig(type, {
active: true,
style: curCfg.style,
thickness: curCfg.thickness,
color: curCfg.color,
offset: newOffset,
skipInk: curCfg.skipInk,
});
};

const handleSetDecorationColor = (
type: 'underline' | 'overline' | 'strikethrough',
newColor: string
) => {
const curCfg = getDecConfig(type);
updateDecConfig(type, { color: newColor });
handleApplyDecorationConfig(type, {
active: true,
style: curCfg.style,
thickness: curCfg.thickness,
color: newColor,
offset: curCfg.offset,
skipInk: curCfg.skipInk,
});
};

const handleSetDecorationSkipInk = (
type: 'underline' | 'overline' | 'strikethrough',
newSkipInk: boolean
) => {
const curCfg = getDecConfig(type);
updateDecConfig(type, { skipInk: newSkipInk });
handleApplyDecorationConfig(type, {
active: true,
style: curCfg.style,
thickness: curCfg.thickness,
color: curCfg.color,
offset: curCfg.offset,
skipInk: newSkipInk,
});
};

const handleToggleSuperscript = (e?: React.MouseEvent) => {
if (e) e.preventDefault();
const active = getActiveSelection();
const elId = element.id;
const domEl = (document.querySelector(`[data-editable-id="${elId}"]`) as HTMLElement) ||
(document.querySelector(`[data-element-id="${elId}"] [contenteditable="true"]`) as HTMLElement) ||
(document.querySelector(`[data-element-id="${elId}"]`) as HTMLElement);
const offsets = domEl ? getSelectionOffsets(domEl) : savedSelectionOffsetsRef.current;

const isCurrentlySuper = Boolean(
activeFormats.superscript ||
s.verticalAlign === 'super' ||
(active && domEl && (() => {
const node = active.range.commonAncestorContainer;
const el = (node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement) as HTMLElement | null;
return Boolean(el?.closest('sup'));
})())
);

if (active && domEl) {
const range = active.range;
const node = range.commonAncestorContainer;
const targetEl = (node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement) as HTMLElement | null;
const supAncestor = targetEl?.closest('sup');

if (isCurrentlySuper) {

try {
document.execCommand('superscript', false);
} catch {}

if (supAncestor && domEl.contains(supAncestor)) {
const parent = supAncestor.parentNode;
if (parent) {
while (supAncestor.firstChild) {
parent.insertBefore(supAncestor.firstChild, supAncestor);
}
parent.removeChild(supAncestor);
}
}

const allSups = domEl.querySelectorAll('sup');
allSups.forEach((sEl) => {
if (range.intersectsNode(sEl)) {
const p = sEl.parentNode;
if (p) {
while (sEl.firstChild) {
p.insertBefore(sEl.firstChild, sEl);
}
p.removeChild(sEl);
}
}
});

if (s.verticalAlign === 'super') {
updateStyle('verticalAlign', undefined);
}
setActiveFormats((prev) => ({ ...prev, superscript: false }));
} else {

const subAncestor = targetEl?.closest('sub');
if (subAncestor && domEl.contains(subAncestor)) {
const parent = subAncestor.parentNode;
if (parent) {
while (subAncestor.firstChild) {
parent.insertBefore(subAncestor.firstChild, subAncestor);
}
parent.removeChild(subAncestor);
}
}
const allSubs = domEl.querySelectorAll('sub');
allSubs.forEach((sEl) => {
if (range.intersectsNode(sEl)) {
const p = sEl.parentNode;
if (p) {
while (sEl.firstChild) {
p.insertBefore(sEl.firstChild, sEl);
}
p.removeChild(sEl);
}
}
});

try {
document.execCommand('superscript', false);
} catch {}

if (s.verticalAlign === 'sub') {
updateStyle('verticalAlign', undefined);
}
setActiveFormats((prev) => ({ ...prev, superscript: true, subscript: false }));
}

syncContentToElement();
if (offsets && domEl) {
restoreSelectionFromOffsets(domEl, offsets.start, offsets.end);
}
} else {

const isSuper = s.verticalAlign === 'super' || activeFormats.superscript;
updateStyle('verticalAlign', isSuper ? undefined : 'super');
setActiveFormats((prev) => ({ ...prev, superscript: !isSuper, subscript: false }));
}
};

const handleToggleSubscript = (e?: React.MouseEvent) => {
if (e) e.preventDefault();
const active = getActiveSelection();
const elId = element.id;
const domEl = (document.querySelector(`[data-editable-id="${elId}"]`) as HTMLElement) ||
(document.querySelector(`[data-element-id="${elId}"] [contenteditable="true"]`) as HTMLElement) ||
(document.querySelector(`[data-element-id="${elId}"]`) as HTMLElement);
const offsets = domEl ? getSelectionOffsets(domEl) : savedSelectionOffsetsRef.current;

const isCurrentlySub = Boolean(
activeFormats.subscript ||
s.verticalAlign === 'sub' ||
(active && domEl && (() => {
const node = active.range.commonAncestorContainer;
const el = (node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement) as HTMLElement | null;
return Boolean(el?.closest('sub'));
})())
);

if (active && domEl) {
const range = active.range;
const node = range.commonAncestorContainer;
const targetEl = (node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement) as HTMLElement | null;
const subAncestor = targetEl?.closest('sub');

if (isCurrentlySub) {

try {
document.execCommand('subscript', false);
} catch {}

if (subAncestor && domEl.contains(subAncestor)) {
const parent = subAncestor.parentNode;
if (parent) {
while (subAncestor.firstChild) {
parent.insertBefore(subAncestor.firstChild, subAncestor);
}
parent.removeChild(subAncestor);
}
}

const allSubs = domEl.querySelectorAll('sub');
allSubs.forEach((sEl) => {
if (range.intersectsNode(sEl)) {
const p = sEl.parentNode;
if (p) {
while (sEl.firstChild) {
p.insertBefore(sEl.firstChild, sEl);
}
p.removeChild(sEl);
}
}
});

if (s.verticalAlign === 'sub') {
updateStyle('verticalAlign', undefined);
}
setActiveFormats((prev) => ({ ...prev, subscript: false }));
} else {

const supAncestor = targetEl?.closest('sup');
if (supAncestor && domEl.contains(supAncestor)) {
const parent = supAncestor.parentNode;
if (parent) {
while (supAncestor.firstChild) {
parent.insertBefore(supAncestor.firstChild, supAncestor);
}
parent.removeChild(supAncestor);
}
}
const allSups = domEl.querySelectorAll('sup');
allSups.forEach((sEl) => {
if (range.intersectsNode(sEl)) {
const p = sEl.parentNode;
if (p) {
while (sEl.firstChild) {
p.insertBefore(sEl.firstChild, sEl);
}
p.removeChild(sEl);
}
}
});

try {
document.execCommand('subscript', false);
} catch {}

if (s.verticalAlign === 'super') {
updateStyle('verticalAlign', undefined);
}
setActiveFormats((prev) => ({ ...prev, subscript: true, superscript: false }));
}

syncContentToElement();
if (offsets && domEl) {
restoreSelectionFromOffsets(domEl, offsets.start, offsets.end);
}
} else {

const isSub = s.verticalAlign === 'sub' || activeFormats.subscript;
updateStyle('verticalAlign', isSub ? undefined : 'sub');
setActiveFormats((prev) => ({ ...prev, subscript: !isSub, superscript: false }));
}
};
const handleApplyFont = (fontFamily: string, weight?: number) => {
const cleanFont = cleanExportedFontFamilyQuotes(fontFamily);
const active = getActiveSelection();
const domEl = getEditableDomElement();
const offsets = domEl ? getSelectionOffsets(domEl) : savedSelectionOffsetsRef.current;
if (active && domEl && !active.isFullSelection) {
try {
const range = active.range;
let targetSpan = findEnclosingSpanForRange(range, domEl);
if (targetSpan) {
targetSpan.style.fontFamily = `'${cleanFont}', sans-serif`;
if (weight) targetSpan.style.fontWeight = String(weight);
} else {
const span = document.createElement('span');
span.style.fontFamily = `'${cleanFont}', sans-serif`;
if (weight) span.style.fontWeight = String(weight);
const contents = range.extractContents();
span.appendChild(contents);
range.insertNode(span);
targetSpan = span;
}
cleanRedundantNestedSpans(domEl);
active.sel.removeAllRanges();
const newRange = document.createRange();
newRange.selectNodeContents(targetSpan);
active.sel.addRange(newRange);
savedSelectionRef.current = newRange.cloneRange();

const html = cleanExportedFontFamilyQuotes(domEl.innerHTML);
const text = domEl.innerText;
onUpdateElement({
...element,
content: html || text || element.content,
});

if (offsets && domEl) {
restoreSelectionFromOffsets(domEl, offsets.start, offsets.end);
}
} catch {
const updatedStyles = {
...element.styles,
fontFamily: cleanFont,
typeface: cleanFont,
...(weight ? { fontWeight: String(weight) } : {}),
};
onUpdateElement({
...element,
styles: updatedStyles,
});
}
} else {
const updatedStyles = {
...element.styles,
fontFamily: cleanFont,
typeface: cleanFont,
...(weight ? { fontWeight: String(weight) } : {}),
};
let updatedContent = element.content;
if (domEl) {
const spans = domEl.querySelectorAll('span');
spans.forEach(span => {
if (span.style.fontFamily) {
span.style.fontFamily = '';
}
});
const html = cleanExportedFontFamilyQuotes(domEl.innerHTML);
const text = domEl.innerText;
updatedContent = html || text || element.content;
} else if (typeof updatedContent === 'string') {
updatedContent = updatedContent.replace(/font-family:[^;"]+;?/gi, '');
updatedContent = updatedContent.replace(/style="\s*"/gi, '');
}
onUpdateElement({
...element,
styles: updatedStyles,
content: updatedContent,
});
}
};
const handleApplyFontSize = (px: number) => {
const active = getActiveSelection();
const domEl = getEditableDomElement();
const offsets = domEl ? getSelectionOffsets(domEl) : savedSelectionOffsetsRef.current;
if (active && domEl && !active.isFullSelection) {
try {
const range = active.range;
let targetSpan = findEnclosingSpanForRange(range, domEl);
if (targetSpan) {
targetSpan.style.fontSize = `${px}px`;
} else {
const span = document.createElement('span');
span.style.fontSize = `${px}px`;
const contents = range.extractContents();
span.appendChild(contents);
range.insertNode(span);
targetSpan = span;
}
cleanRedundantNestedSpans(domEl);
active.sel.removeAllRanges();
const newRange = document.createRange();
newRange.selectNodeContents(targetSpan);
active.sel.addRange(newRange);
savedSelectionRef.current = newRange.cloneRange();
syncContentToElement();
if (offsets && domEl) {
restoreSelectionFromOffsets(domEl, offsets.start, offsets.end);
}
} catch {
updateStyle('fontSize', px);
}
} else {
updateStyle('fontSize', px);
}
};
const handleApplyFontWeight = (weight: number) => {
const active = getActiveSelection();
if (active) {
applyInlineStyleToSelection('fontWeight', String(weight));
}
else {
updateStyle('fontWeight', weight);
}
};
const handleApplySolidTextColor = (hex: string, opacity: number = 100) => {
const finalColor = opacity < 100 ? colorWithAlpha(hex, opacity / 100) : hex;
const active = getActiveSelection();
const domEl = getEditableDomElement();
const offsets = domEl ? getSelectionOffsets(domEl) : savedSelectionOffsetsRef.current;

const updatedStyles = {
...element.styles,
textColor: hex,
color: hex,
textColorOpacity: opacity,
};
delete (updatedStyles as any).textGradient;
delete (updatedStyles as any).gradientText;

if (active && domEl && (!active.isFullSelection)) {
try {
const range = active.range;
let targetSpan = findEnclosingSpanForRange(range, domEl);
if (targetSpan) {
targetSpan.style.color = finalColor;
targetSpan.style.backgroundImage = 'none';
targetSpan.style.webkitBackgroundClip = 'unset';
(targetSpan.style as any).backgroundClip = 'unset';
(targetSpan.style as any).webkitTextFillColor = 'initial';
cleanInlineColorStyles(targetSpan, { clearColor: false, clearGradient: true });
} else {
const span = document.createElement('span');
span.style.color = finalColor;
span.style.backgroundImage = 'none';
span.style.webkitBackgroundClip = 'unset';
(span.style as any).backgroundClip = 'unset';
(span.style as any).webkitTextFillColor = 'initial';
span.style.display = 'inline';

const contents = range.extractContents();
cleanInlineColorStyles(contents, { clearColor: true, clearGradient: true });

span.appendChild(contents);
range.insertNode(span);
targetSpan = span;
}

cleanRedundantNestedSpans(domEl);

const newHtml = cleanExportedFontFamilyQuotes(domEl.innerHTML);
onUpdateElement({
...element,
content: newHtml,
styles: updatedStyles,
});

if (offsets && domEl) {
restoreSelectionFromOffsets(domEl, offsets.start, offsets.end);
}
return;
} catch {
applyFormatCommand('foreColor', finalColor);
return;
}
}

if (domEl) {
cleanInlineColorStyles(domEl, { clearColor: true, clearGradient: true });
const newHtml = cleanExportedFontFamilyQuotes(domEl.innerHTML);
onUpdateElement({
...element,
content: newHtml,
styles: updatedStyles,
});
if (offsets) {
restoreSelectionFromOffsets(domEl, offsets.start, offsets.end);
}
} else {
onUpdateElement({
...element,
styles: updatedStyles,
});
}
};

const handleApplyGradientTextColor = (stops: string[], angle: number, opacity: number = 100) => {
const grad = `linear-gradient(${angle}deg, ${stops.join(', ')})`;
const active = getActiveSelection();
const domEl = getEditableDomElement();
const offsets = domEl ? getSelectionOffsets(domEl) : savedSelectionOffsetsRef.current;

const updatedStyles = {
...element.styles,
textGradient: grad,
gradientText: true,
textGradientStops: stops,
textGradientAngle: angle,
textColorOpacity: opacity,
};

if (active && domEl && (!active.isFullSelection)) {
try {
const range = active.range;
let targetSpan = findEnclosingSpanForRange(range, domEl);
if (targetSpan) {
targetSpan.style.backgroundImage = grad;
targetSpan.style.webkitBackgroundClip = 'text';
(targetSpan.style as any).backgroundClip = 'text';
(targetSpan.style as any).webkitTextFillColor = 'transparent';
targetSpan.style.color = 'transparent';
targetSpan.style.display = 'inline-block';
cleanInlineColorStyles(targetSpan, { clearColor: true, clearGradient: false });
} else {
const span = document.createElement('span');
span.style.backgroundImage = grad;
span.style.webkitBackgroundClip = 'text';
(span.style as any).backgroundClip = 'text';
(span.style as any).webkitTextFillColor = 'transparent';
span.style.color = 'transparent';
span.style.display = 'inline-block';

const contents = range.extractContents();
cleanInlineColorStyles(contents, { clearColor: true, clearGradient: true });

span.appendChild(contents);
range.insertNode(span);
targetSpan = span;
}

cleanRedundantNestedSpans(domEl);

const newHtml = cleanExportedFontFamilyQuotes(domEl.innerHTML);
onUpdateElement({
...element,
content: newHtml,
styles: updatedStyles,
});

if (offsets && domEl) {
restoreSelectionFromOffsets(domEl, offsets.start, offsets.end);
}
return;
} catch {}
}

if (domEl) {
cleanInlineColorStyles(domEl, { clearColor: true, clearGradient: true });
const newHtml = cleanExportedFontFamilyQuotes(domEl.innerHTML);
onUpdateElement({
...element,
content: newHtml,
styles: updatedStyles,
});
if (offsets) {
restoreSelectionFromOffsets(domEl, offsets.start, offsets.end);
}
} else {
onUpdateElement({
...element,
styles: updatedStyles,
});
}
};
const unwrapMarks = (domEl: HTMLElement, range?: Range | null) => {
if (!domEl)
return;
const marks = Array.from(domEl.querySelectorAll('mark'));
if (range) {
const ancestor = range.commonAncestorContainer;
const parentMark = ancestor.nodeType === Node.ELEMENT_NODE
? (ancestor as HTMLElement).closest('mark')
: ancestor.parentElement?.closest('mark');
if (parentMark && !marks.includes(parentMark)) {
marks.push(parentMark);
}
}
marks.forEach((mark) => {
if (!range || range.collapsed) {
const parent = mark.parentNode;
if (parent) {
while (mark.firstChild)
parent.insertBefore(mark.firstChild, mark);
parent.removeChild(mark);
}
}
else {
try {
if (range.intersectsNode(mark)) {
const parent = mark.parentNode;
if (parent) {
while (mark.firstChild)
parent.insertBefore(mark.firstChild, mark);
parent.removeChild(mark);
}
}
}
catch {
const parent = mark.parentNode;
if (parent) {
while (mark.firstChild)
parent.insertBefore(mark.firstChild, mark);
parent.removeChild(mark);
}
}
}
});
};
const handleApplyHighlightConfig = (config: {
color?: string;
isGradient?: boolean;
gradFrom?: string;
gradTo?: string;
gradAngle?: number;
radiusTop?: number;
radiusRight?: number;
radiusBottom?: number;
radiusLeft?: number;
paddingTop?: number;
paddingRight?: number;
paddingBottom?: number;
paddingLeft?: number;
} | null) => {
const active = getActiveSelection();
const domEl = getEditableDomElement();
const offsets = domEl ? getSelectionOffsets(domEl) : savedSelectionOffsetsRef.current;
if (!config || !config.color || config.color === 'transparent') {
if (domEl) {
unwrapMarks(domEl, active?.range);
syncContentToElement();
}
const updatedStyles = { ...element.styles };
delete (updatedStyles as any).highlightColor;
delete (updatedStyles as any).highlightMode;
delete (updatedStyles as any).highlightGradient;
delete (updatedStyles as any).highlightGradFrom;
delete (updatedStyles as any).highlightGradTo;
delete (updatedStyles as any).highlightGradAngle;
delete (updatedStyles as any).highlightRadius;
delete (updatedStyles as any).highlightRadiusTop;
delete (updatedStyles as any).highlightRadiusRight;
delete (updatedStyles as any).highlightRadiusBottom;
delete (updatedStyles as any).highlightRadiusLeft;
delete (updatedStyles as any).highlightPadding;
delete (updatedStyles as any).highlightPaddingTop;
delete (updatedStyles as any).highlightPaddingRight;
delete (updatedStyles as any).highlightPaddingBottom;
delete (updatedStyles as any).highlightPaddingLeft;
onUpdateElement({
...element,
styles: updatedStyles,
});
return;
}
const styleMark = (mark: HTMLElement) => {
if (config.isGradient && config.gradFrom && config.gradTo) {
const gradAngle = config.gradAngle ?? 90;
mark.style.backgroundImage = `linear-gradient(${gradAngle}deg, ${config.gradFrom} 0%, ${config.gradTo} 100%)`;
mark.style.backgroundColor = 'transparent';
}
else {
mark.style.backgroundColor = config.color;
mark.style.backgroundImage = 'none';
}
mark.style.color = 'inherit';
mark.style.padding = `${config.paddingTop ?? 2}px ${config.paddingRight ?? 6}px ${config.paddingBottom ?? 2}px ${config.paddingLeft ?? 6}px`;
mark.style.borderRadius = `${config.radiusTop ?? 4}px ${config.radiusRight ?? 4}px ${config.radiusBottom ?? 4}px ${config.radiusLeft ?? 4}px`;
};
if (domEl) {
if (active && domEl.contains(active.range.commonAncestorContainer) && !active.range.collapsed) {
const { range, sel } = active;
const containerNode = range.commonAncestorContainer;
const existingMark = containerNode.nodeType === Node.ELEMENT_NODE
? (containerNode as HTMLElement).closest('mark')
: containerNode.parentElement?.closest('mark');
if (existingMark && domEl.contains(existingMark)) {
styleMark(existingMark as HTMLElement);
existingMark.querySelectorAll('mark').forEach((m) => {
const parent = m.parentNode;
while (m.firstChild)
parent?.insertBefore(m.firstChild, m);
parent?.removeChild(m);
});
}
else {
const mark = document.createElement('mark');
styleMark(mark);
const contents = range.extractContents();
contents.querySelectorAll('mark').forEach((m) => {
const parent = m.parentNode;
while (m.firstChild)
parent?.insertBefore(m.firstChild, m);
parent?.removeChild(m);
});
mark.appendChild(contents);
range.insertNode(mark);
sel.removeAllRanges();
const newRange = document.createRange();
newRange.selectNodeContents(mark);
sel.addRange(newRange);
savedSelectionRef.current = newRange.cloneRange();
}
}
else {
let caretMark: HTMLElement | null = null;
const sel = window.getSelection();
if (sel && sel.rangeCount > 0) {
const container = sel.getRangeAt(0).commonAncestorContainer;
const parent = container.nodeType === Node.ELEMENT_NODE ? (container as HTMLElement) : container.parentElement;
if (parent) {
caretMark = parent.closest('mark');
}
}
if (caretMark && domEl.contains(caretMark)) {
styleMark(caretMark);
caretMark.querySelectorAll('mark').forEach((m) => {
const p = m.parentNode;
while (m.firstChild)
p?.insertBefore(m.firstChild, m);
p?.removeChild(m);
});
}
else {
const existingMarks = domEl.querySelectorAll('mark');
if (existingMarks.length > 0) {
existingMarks.forEach((m) => {
styleMark(m as HTMLElement);
m.querySelectorAll('mark').forEach((child) => {
const p = child.parentNode;
while (child.firstChild)
p?.insertBefore(child.firstChild, child);
p?.removeChild(child);
});
});
}
else {
const mark = document.createElement('mark');
styleMark(mark);
while (domEl.firstChild) {
mark.appendChild(domEl.firstChild);
}
domEl.appendChild(mark);
}
}
}
syncContentToElement();
if (domEl && offsets) {
restoreSelectionFromOffsets(domEl, offsets.start, offsets.end);
}
onUpdateElement({
...element,
styles: {
...element.styles,
highlightColor: config.color,
highlightGradFrom: config.gradFrom,
highlightGradTo: config.gradTo,
highlightGradAngle: config.gradAngle,
highlightRadiusTop: config.radiusTop,
highlightRadiusRight: config.radiusRight,
highlightRadiusBottom: config.radiusBottom,
highlightRadiusLeft: config.radiusLeft,
highlightPaddingTop: config.paddingTop,
highlightPaddingRight: config.paddingRight,
highlightPaddingBottom: config.paddingBottom,
highlightPaddingLeft: config.paddingLeft,
} as ElementStyles,
});
}
else {
onUpdateElement({
...element,
styles: {
...element.styles,
highlightColor: config.color,
highlightGradFrom: config.gradFrom,
highlightGradTo: config.gradTo,
highlightGradAngle: config.gradAngle,
highlightRadiusTop: config.radiusTop,
highlightRadiusRight: config.radiusRight,
highlightRadiusBottom: config.radiusBottom,
highlightRadiusLeft: config.radiusLeft,
highlightPaddingTop: config.paddingTop,
highlightPaddingRight: config.paddingRight,
highlightPaddingBottom: config.paddingBottom,
highlightPaddingLeft: config.paddingLeft,
} as ElementStyles,
});
}
};
const handleApplyLink = (url: string, target: string = '_self', text?: string, rel?: string, title?: string) => {
const active = getActiveSelection();
if (active) {
const a = document.createElement('a');
a.href = url;
a.target = target;
if (rel) {
a.rel = rel;
} else if (target === '_blank') {
a.rel = 'noopener noreferrer';
}
if (title) {
a.title = title;
}
a.style.textDecorationLine = 'underline';
a.style.color = 'inherit';
const selectedText = active.range.toString();
if (text && text !== selectedText && text.trim() !== '') {
a.innerText = text;
active.range.deleteContents();
active.range.insertNode(a);
}
else {
const contents = active.range.extractContents();
a.appendChild(contents);
active.range.insertNode(a);
}
active.sel.removeAllRanges();
const newRange = document.createRange();
newRange.selectNodeContents(a);
active.sel.addRange(newRange);
savedSelectionRef.current = newRange.cloneRange();
syncContentToElement();
}
else {
onUpdateElement({
...element,
styles: {
...element.styles,
href: url,
target: target,
...(rel ? { rel } : {}),
...(title ? { title } : {}),
},
});
}
setActiveTool(null);
};
const handleRemoveLink = () => {
const active = getActiveSelection();
const elId = element.id;
const domEl = (document.querySelector(`[data-editable-id="${elId}"]`) as HTMLElement) ||
(document.querySelector(`[data-element-id="${elId}"] [contenteditable="true"]`) as HTMLElement) ||
(document.querySelector(`[data-element-id="${elId}"]`) as HTMLElement);
if (active && domEl && domEl.contains(active.range.commonAncestorContainer)) {
applyFormatCommand('unlink');
}
else if (domEl) {
const links = domEl.querySelectorAll('a');
links.forEach((l) => {
const parent = l.parentNode;
while (l.firstChild)
parent?.insertBefore(l.firstChild, l);
parent?.removeChild(l);
});
syncContentToElement();
}
const updatedStyles = { ...element.styles };
delete (updatedStyles as any).href;
delete (updatedStyles as any).target;
onUpdateElement({
...element,
styles: updatedStyles,
});
};
const toggleTool = (toolName: ActiveToolType) => {
setActiveTool((prev) => (prev === toolName ? null : toolName));
};
const isBoldActive = Boolean(activeFormats.bold || Number(s.fontWeight) >= 700 || s.fontWeight === 'bold');
const isItalicActive = Boolean(activeFormats.italic || s.fontStyle === 'italic');
const isUnderlineActive = Boolean(activeFormats.underline || (s.textDecorationLine || s.textDecoration || '').includes('underline'));
const isOverlineActive = Boolean(activeFormats.overline || (s.textDecorationLine || s.textDecoration || '').includes('overline'));
const isStrikethroughActive = Boolean(activeFormats.strikethrough || (s.textDecorationLine || s.textDecoration || '').includes('line-through'));
const isSuperscriptActive = Boolean(
activeFormats.superscript ||
s.verticalAlign === 'super' ||
(typeof element.content === 'string' && (element.content.startsWith('<sup>') && element.content.endsWith('</sup>')))
);
const isSubscriptActive = Boolean(
activeFormats.subscript ||
s.verticalAlign === 'sub' ||
(typeof element.content === 'string' && (element.content.startsWith('<sub>') && element.content.endsWith('</sub>')))
);
const isAnyDecorationActive = isUnderlineActive || isOverlineActive || isStrikethroughActive;
const renderToolContent = () => {
if (!activeTool)
return null;
return (<>
{activeTool === 'font' && (<FontPickerPopover currentFont={s.typeface} currentWeight={s.fontWeight} onSelectFont={handleApplyFont} isLight={isLight}/>)}

{activeTool === 'fontStyle' && (<div className="space-y-4 max-h-[380px] overflow-y-auto no-scrollbar pr-0.5">
<div className="space-y-1">
{TEXT_STYLE_OPTIONS.map((opt) => {
const isSelected = (element.tag || (element.type === 'heading' ? 'h2' : 'p')).toLowerCase() === opt.tag.toLowerCase();
return (<button key={opt.tag} type="button" onClick={() => {
const isHeading = opt.tag.startsWith('h');
onUpdateElement({
...element,
tag: opt.tag as any,
type: isHeading ? 'heading' : 'text',
});
}} className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${isSelected
? 'border-indigo-500 bg-indigo-500/10 text-indigo-500'
: isLight
? 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
: 'border-slate-800 hover:border-slate-700 bg-slate-800/50 text-slate-300'}`}>
<div className="flex-1 min-w-0">
<div className="text-xs font-semibold">{opt.label}</div>
</div>
{isSelected && <Check className="w-4 h-4 text-indigo-500 shrink-0"/>}
</button>);
})}
</div>
</div>)}

{activeTool === 'fontSize' && (<div className="space-y-3 py-1">
<div className="flex items-center justify-between gap-4.5 w-full">
<input type="range" min={8} max={160} step={1} value={currentFontSizePx} onChange={(e) => handleApplyFontSize(Number(e.target.value))} className="flex-1 min-w-0 accent-indigo-500 cursor-pointer"/>

<input type="number" value={currentFontSizePx} onChange={(e) => {
const val = parseInt(e.target.value, 10);
if (!isNaN(val)) {
handleApplyFontSize(val);
}
}} className={`w-14 px-1 py-1.5 text-center text-xs font-mono font-bold rounded-lg border outline-none transition-all shrink-0 ${isLight
? 'bg-white border-slate-300 text-slate-800 focus:border-indigo-500'
: 'bg-slate-900 border-slate-700 text-slate-200 focus:border-indigo-500'}`}/>
</div>
</div>)}

{activeTool === 'link' && (<InsertLinkPopover currentHref={detectedLinkHref || element.href || s.href || ''} currentTarget={detectedLinkTarget || element.target || s.target || '_self'} currentText={savedSelectionRef.current ? savedSelectionRef.current.toString() : ''} onApplyLink={handleApplyLink} onRemoveLink={handleRemoveLink} onClose={() => setActiveTool(null)} isLight={isLight}/>)}

{activeTool === 'listStyles' && (<div className="space-y-2">
<div className="grid grid-cols-2 gap-2">
<button type="button" onClick={() => applyFormatCommand('insertUnorderedList')} className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${activeFormats.bulletList
? 'border-indigo-500 bg-indigo-500/10 text-indigo-500 font-bold'
: isLight
? 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
: 'border-slate-800 hover:border-slate-700 bg-slate-800/50 text-slate-300'}`}>
<List className="w-4 h-4 shrink-0"/>
<span className="text-xs font-medium">Bullet List</span>
</button>

<button type="button" onClick={() => applyFormatCommand('insertOrderedList')} className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${activeFormats.numberedList
? 'border-indigo-500 bg-indigo-500/10 text-indigo-500 font-bold'
: isLight
? 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
: 'border-slate-800 hover:border-slate-700 bg-slate-800/50 text-slate-300'}`}>
<ListOrdered className="w-4 h-4 shrink-0"/>
<span className="text-xs font-medium">Numbered List</span>
</button>
</div>
</div>)}

{activeTool === 'casing' && (<div className="space-y-2">
<div className="grid grid-cols-4 gap-2">
{[
{ label: 'Aa', title: 'Default (None)', val: 'none' },
{ label: 'AA', title: 'UPPERCASE', val: 'uppercase' },
{ label: 'aa', title: 'lowercase', val: 'lowercase' },
{ label: 'A/a', title: 'Capitalize Words', val: 'capitalize' },
].map((opt) => (<button key={opt.val} type="button" title={opt.title} onClick={() => updateStyle('textTransform', opt.val)} className={`py-2 px-3 rounded-xl text-sm font-bold transition-all text-center cursor-pointer bg-transparent ${(s.textTransform || 'none') === opt.val
? isLight
? 'bg-slate-200/80 text-indigo-600 border border-indigo-300/80 shadow-xs'
: 'bg-slate-800 text-indigo-400 border border-indigo-700/80 shadow-xs'
: isLight
? 'border border-transparent hover:bg-slate-200/80 text-slate-700'
: 'border border-transparent hover:bg-slate-800 text-slate-300'}`}>
{opt.label}
</button>))}
</div>
</div>)}

{activeTool === 'textColor' && (
<TextColorPopover
color={s.textColor || s.color || (isLight ? '#0f172a' : '#ffffff')}
isGradient={Boolean(s.textGradient || s.gradientText)}
textGradient={s.textGradient}
opacity={s.textColorOpacity !== undefined ? Number(s.textColorOpacity) : 100}
onApplySolidColor={handleApplySolidTextColor}
onApplyGradient={handleApplyGradientTextColor}
isLight={isLight}
/>
)}

{activeTool === 'highlightColor' && (<HighlightPopover currentHighlightColor={s.backgroundColor || s.highlightColor} onApplyHighlight={handleApplyHighlightConfig} isLight={isLight}/>)}

{activeTool === 'backgroundColor' && (<BackgroundPopover styles={s} onUpdateStyle={updateStyle} onUpdateStyles={updateStyles} isLight={isLight}/>)}

{activeTool === 'underline' && (
<TextDecorationPopover
type="underline"
active={isUnderlineActive}
currentStyle={getDecConfig('underline').style}
currentThickness={getDecConfig('underline').thickness}
currentColor={getDecConfig('underline').color}
currentOffset={getDecConfig('underline').offset}
onApplyDecoration={(config) => handleApplyDecorationConfig('underline', config)}
isLight={isLight}
/>
)}
{activeTool === 'overline' && (
<TextDecorationPopover
type="overline"
active={isOverlineActive}
currentStyle={getDecConfig('overline').style}
currentThickness={getDecConfig('overline').thickness}
currentColor={getDecConfig('overline').color}
currentOffset={getDecConfig('overline').offset}
onApplyDecoration={(config) => handleApplyDecorationConfig('overline', config)}
isLight={isLight}
/>
)}
{activeTool === 'strikethrough' && (
<TextDecorationPopover
type="strikethrough"
active={isStrikethroughActive}
currentStyle={getDecConfig('strikethrough').style}
currentThickness={getDecConfig('strikethrough').thickness}
currentColor={getDecConfig('strikethrough').color}
currentOffset={getDecConfig('strikethrough').offset}
onApplyDecoration={(config) => handleApplyDecorationConfig('strikethrough', config)}
isLight={isLight}
/>
)}

{activeTool === 'spacing' && (<div className="space-y-4 max-h-[380px] overflow-y-auto no-scrollbar pr-0.5">
<div className="space-y-2">
<SliderWithInput label="Space Before (Top Margin)" value={Number(s.marginTop || s.spaceBefore || 0)} onChange={(val) => {
updateStyle('marginTop', val);
updateStyle('spaceBefore', val);
}} min={0} max={120} step={1} unit="" hideValueBadge={true} isLight={isLight}/>
</div>

<div className="space-y-2">
<SliderWithInput label="Space After (Bottom Margin)" value={Number(s.marginBottom || s.spaceAfter || 0)} onChange={(val) => {
updateStyle('marginBottom', val);
updateStyle('spaceAfter', val);
}} min={0} max={120} step={1} unit="" hideValueBadge={true} isLight={isLight}/>
</div>
</div>)}

{activeTool === 'lineHeight' && (<div className="space-y-3.5 py-1">
<SliderWithInput label="Line Height" value={Number(s.lineHeight || 1.5)} onChange={(val) => updateStyle('lineHeight', val)} min={0.8} max={3.0} step={0.05} precision={2} unit="" hideValueBadge={true} isLight={isLight}/>
<div className="grid grid-cols-3 gap-1 pt-2">
{[
{ label: 'Tight', val: 1.2 },
{ label: 'Normal', val: 1.5 },
{ label: 'Loose', val: 2.0 },
].map((item) => (<button key={item.val} type="button" onClick={() => updateStyle('lineHeight', item.val)} className={`py-1.5 px-1.5 rounded-[50px] text-[11px] font-medium border transition-all text-center cursor-pointer ${Math.abs(Number(s.lineHeight || 1.5) - item.val) < 0.05
? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-xs'
: isLight
? 'bg-transparent border-slate-300 hover:bg-slate-100 text-slate-700'
: 'bg-transparent border-slate-700 hover:bg-slate-800 text-slate-300'}`}>
{item.label}
</button>))}
</div>
</div>)}

{activeTool === 'letterSpacing' && (<div className="space-y-3.5 py-1">
<SliderWithInput label="Letter Spacing" value={Number(s.letterSpacing || 0)} onChange={(val) => updateStyle('letterSpacing', val)} min={-3} max={16} step={0.5} unit="" hideValueBadge={true} precision={1} allowNegative={true} isLight={isLight}/>
<div className="grid grid-cols-3 gap-1 pt-2">
{[
{ label: 'Tight', val: -1 },
{ label: 'Normal', val: 0 },
{ label: 'Wide', val: 2 },
].map((item) => (<button key={item.val} type="button" onClick={() => updateStyle('letterSpacing', item.val)} className={`py-1.5 px-1.5 rounded-[50px] text-[11px] font-medium border transition-all text-center cursor-pointer ${Number(s.letterSpacing || 0) === item.val
? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-xs'
: isLight
? 'bg-transparent border-slate-300 hover:bg-slate-100 text-slate-700'
: 'bg-transparent border-slate-700 hover:bg-slate-800 text-slate-300'}`}>
{item.label}
</button>))}
</div>
</div>)}

{activeTool === 'wordSpacing' && (
<div className="space-y-3.5 py-1">
<SliderWithInput
label="Word Spacing"
value={Number(s.wordSpacing || 0)}
onChange={(val) => updateStyle('wordSpacing', val)}
min={-4}
max={24}
step={1}
unit=""
hideValueBadge={true}
precision={0}
allowNegative={true}
isLight={isLight}
/>
<div className="grid grid-cols-3 gap-1 pt-2">
{[
{ label: 'Tight', val: -2 },
{ label: 'Normal', val: 0 },
{ label: 'Wide', val: 6 },
].map((item) => (
<button
key={item.val}
type="button"
onClick={() => updateStyle('wordSpacing', item.val)}
className={`py-1.5 px-1.5 rounded-[50px] text-[11px] font-medium border transition-all text-center cursor-pointer ${
Number(s.wordSpacing || 0) === item.val
? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-xs'
: isLight
? 'bg-transparent border-slate-300 hover:bg-slate-100 text-slate-700'
: 'bg-transparent border-slate-700 hover:bg-slate-800 text-slate-300'
}`}
>
{item.label}
</button>
))}
</div>
</div>
)}

{(activeTool === 'imageSource' ||
activeTool === 'imageAlt' ||
activeTool === 'imageAspect' ||
activeTool === 'imageSize' ||
activeTool === 'imageTransform' ||
activeTool === 'imageAdjust' ||
activeTool === 'imageHover' ||
activeTool === 'imageShadow' ||
activeTool === 'imageRadius' ||
activeTool === 'imageBorder' ||
activeTool === 'imageLink') && (
<ImageToolbarPopover
element={element}
activeTool={activeTool}
onSelectTool={setActiveTool}
onUpdateElement={onUpdateElement}
isLight={isLight}
/>
)}

{activeTool === 'containerBorder' && (
<div className="space-y-3 text-xs">
<div className="space-y-1.5">
<SliderWithInput
label="Corner Radius"
value={Number(s.borderRadius || 0)}
onChange={(val) => updateStyle('borderRadius', val)}
min={0}
max={64}
step={1}
unit="px"
isLight={isLight}
/>
<div className="grid grid-cols-5 gap-1 pt-1">
{[0, 8, 16, 24, 9999].map((r) => (
<button
key={r}
type="button"
onClick={() => updateStyle('borderRadius', r)}
className={`py-1 rounded-md text-[10px] font-medium border text-center cursor-pointer ${
Number(s.borderRadius || 0) === r
? 'bg-indigo-600 text-white font-bold border-indigo-600'
: isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
}`}
>
{r === 9999 ? 'Full' : `${r}px`}
</button>
))}
</div>
</div>

<div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
<SliderWithInput
label="Border Width"
value={Number(s.borderWidth || 0)}
onChange={(val) => {
updateStyle('borderWidth', val);
if (val > 0 && !s.borderColor) {
updateStyle('borderColor', isLight ? '#cbd5e1' : '#475569');
}
}}
min={0}
max={12}
step={1}
unit="px"
isLight={isLight}
/>
</div>

{Number(s.borderWidth || 0) > 0 && (
<div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
<label className={`font-semibold text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Border Color</label>
<InlineColorPicker
color={s.borderColor || (isLight ? '#cbd5e1' : '#475569')}
onChange={(color) => updateStyle('borderColor', color)}
isLight={isLight}
/>
</div>
)}
</div>
)}

{activeTool === 'buttonText' && (
<div className="space-y-2 text-xs">
<label className={`font-semibold text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Button Label Text</label>
<input
type="text"
value={element.content || element.label || element.text || ''}
onChange={(e) => {
onUpdateElement({
...element,
content: e.target.value,
label: e.target.value,
text: e.target.value,
});
}}
placeholder="Click Me..."
className={`w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
isLight ? 'bg-slate-50 border-slate-300 focus:border-indigo-500' : 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
}`}
/>
</div>
)}

{activeTool === 'buttonVariant' && (
<div className="space-y-2 text-xs">
<label className={`font-semibold text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Button Style Variant</label>
<div className="grid grid-cols-3 gap-1.5">
{[
{ label: 'Primary', val: 'primary' },
{ label: 'Secondary', val: 'secondary' },
{ label: 'Outline', val: 'outline' },
{ label: 'Ghost', val: 'ghost' },
{ label: 'Gradient', val: 'gradient' },
{ label: 'Dark', val: 'dark' },
].map((v) => (
<button
key={v.val}
type="button"
onClick={() => updateStyle('buttonStyle', v.val)}
className={`py-2 px-2 rounded-lg text-xs font-semibold border text-center cursor-pointer ${
(s.buttonStyle || 'primary') === v.val
? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
: isLight ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-slate-300'
}`}
>
{v.label}
</button>
))}
</div>
</div>
)}

{activeTool === 'buttonIcon' && (
<div className="space-y-3 text-xs">
<div className="space-y-1.5">
<label className={`font-semibold text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Select Icon</label>
<div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto no-scrollbar p-1 border rounded-lg border-slate-200 dark:border-slate-800">
{[
'ArrowRight', 'ExternalLink', 'Mail', 'Phone', 'Download', 'ShoppingCart', 'Star', 'Heart', 'Check', 'Zap', 'Play', 'Send', 'Sparkles', 'None'
].map((ic) => (
<button
key={ic}
type="button"
onClick={() => {
onUpdateElement({
...element,
icon: ic === 'None' ? undefined : ic,
});
}}
className={`py-1.5 px-1 rounded-md text-[11px] font-medium border text-center truncate cursor-pointer ${
(element.icon === ic) || (ic === 'None' && !element.icon)
? 'bg-indigo-600 text-white font-bold border-indigo-600'
: isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
}`}
>
{ic}
</button>
))}
</div>
</div>

<div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
<label className={`font-semibold text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Icon Position</label>
<div className="grid grid-cols-2 gap-2">
{['left', 'right'].map((pos) => (
<button
key={pos}
type="button"
onClick={() => onUpdateElement({ ...element, iconPosition: pos as any })}
className={`py-1.5 rounded-lg text-xs font-semibold capitalize border text-center cursor-pointer ${
(element.iconPosition || 'right') === pos
? 'bg-indigo-600 text-white border-indigo-600'
: isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
}`}
>
{pos}
</button>
))}
</div>
</div>
</div>
)}

{activeTool === 'buttonSize' && (
<div className="space-y-3 text-xs">
<div className="space-y-1.5">
<label className={`font-semibold text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Size Preset</label>
<div className="grid grid-cols-4 gap-1">
{['sm', 'md', 'lg', 'xl'].map((sz) => (
<button
key={sz}
type="button"
onClick={() => updateStyle('buttonSize', sz)}
className={`py-1.5 rounded-lg text-xs uppercase font-bold border text-center cursor-pointer ${
(s.buttonSize || 'md') === sz
? 'bg-indigo-600 text-white border-indigo-600'
: isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
}`}
>
{sz}
</button>
))}
</div>
</div>

<div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
<SliderWithInput
label="Corner Radius"
value={Number(s.borderRadius || 8)}
onChange={(val) => updateStyle('borderRadius', val)}
min={0}
max={48}
step={1}
unit="px"
isLight={isLight}
/>
</div>
</div>
)}

{activeTool === 'iconPicker' && (
<div className="space-y-2 text-xs">
<label className={`font-semibold text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Choose Icon</label>
<div className="grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto no-scrollbar p-1">
{[
'Star', 'Heart', 'Check', 'Zap', 'Mail', 'Phone', 'ShoppingCart', 'Shield', 'Sparkles', 'Globe', 'User', 'Search', 'ArrowRight', 'Settings', 'Bell', 'Camera', 'Lock', 'Eye', 'Download', 'Code', 'Play', 'Folder', 'ThumbsUp', 'Compass', 'Award', 'CircleCheck', 'Flame', 'Activity', 'Box', 'Layers', 'Send', 'Smile'
].map((iconName) => (
<button
key={iconName}
type="button"
onClick={() => onUpdateElement({ ...element, icon: iconName, label: iconName })}
className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
(element.icon === iconName)
? 'bg-indigo-600 text-white font-bold border-indigo-600'
: isLight ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-slate-300'
}`}
title={iconName}
>
<span className="text-[10px] font-medium truncate max-w-full">{iconName}</span>
</button>
))}
</div>
</div>
)}

{activeTool === 'iconSize' && (
<div className="space-y-3 text-xs">
<SliderWithInput
label="Icon Size"
value={Number(s.fontSize || 24)}
onChange={(val) => {
updateStyle('fontSize', val);
updateStyle('width', val);
updateStyle('height', val);
}}
min={12}
max={120}
step={2}
unit="px"
isLight={isLight}
/>
<div className="grid grid-cols-5 gap-1 pt-1">
{[16, 20, 24, 32, 48].map((sz) => (
<button
key={sz}
type="button"
onClick={() => {
updateStyle('fontSize', sz);
updateStyle('width', sz);
updateStyle('height', sz);
}}
className={`py-1 rounded-md text-[10px] font-medium border text-center cursor-pointer ${
Number(s.fontSize || 24) === sz
? 'bg-indigo-600 text-white font-bold border-indigo-600'
: isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
}`}
>
{sz}px
</button>
))}
</div>
</div>
)}

{activeTool === 'mediaSource' && (
<div className="space-y-2 text-xs">
<label className={`font-semibold text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
{element.type === 'map' ? 'Google Maps Embed URL' : 'Video Embed URL'}
</label>
<input
type="text"
value={element.videoUrl || element.mapUrl || element.src || ''}
onChange={(e) => {
onUpdateElement({
...element,
videoUrl: e.target.value,
mapUrl: e.target.value,
src: e.target.value,
url: e.target.value,
});
}}
placeholder={element.type === 'map' ? 'https://maps.google.com...' : 'https://...'}
className={`w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
isLight ? 'bg-slate-50 border-slate-300 focus:border-indigo-500' : 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
}`}
/>

<SliderWithInput
label="Horizontal Padding (Left & Right)"
value={Number(s.paddingX !== undefined ? s.paddingX : s.paddingLeft || 24)}
onChange={(val) => {
updateStyle('paddingX', val);
updateStyle('paddingLeft', val);
updateStyle('paddingRight', val);
}}
min={0}
max={128}
step={4}
unit="px"
isLight={isLight}
/>

<SliderWithInput
label="Inner Gap"
value={Number(s.gap || 16)}
onChange={(val) => updateStyle('gap', val)}
min={0}
max={64}
step={2}
unit="px"
isLight={isLight}
/>
</div>
)}

{activeTool === 'containerLayout' && (
<div className="space-y-3 text-xs w-72">
<div>
<label className={`font-semibold text-[11px] block mb-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Grid Columns / Layout</label>
<div className="grid grid-cols-3 gap-1.5">
{[
{ label: '1 Column', val: '1' },
{ label: '2 Columns', val: '2' },
{ label: '3 Columns', val: '3' },
{ label: '4 Columns', val: '4' },
{ label: 'Flex Row', val: 'flex' },
{ label: 'Flex Wrap', val: 'flex-wrap' },
].map((l) => (
<button
key={l.val}
type="button"
onClick={() => updateStyle('layoutColumns', l.val)}
className={`py-1.5 px-2 rounded-lg text-xs font-semibold border text-center cursor-pointer transition-all ${
(s.layoutColumns || '1') === l.val
? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
: isLight ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-slate-300'
}`}
>
{l.label}
</button>
))}
</div>
</div>

{s.layoutColumns === '2' && (
<div>
<label className={`font-semibold text-[11px] block mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Column Proportions (2 Columns)</label>
<div className="grid grid-cols-2 gap-1">
{[
{ label: 'Equal (1:1)', val: '1:1' },
{ label: 'Left Sidebar (1:2)', val: '1:2' },
{ label: 'Right Sidebar (2:1)', val: '2:1' },
{ label: 'Slim Left (1:3)', val: '1:3' },
{ label: 'Slim Right (3:1)', val: '3:1' },
].map((r) => (
<button
key={r.val}
type="button"
onClick={() => updateStyle('columnRatio', r.val)}
className={`py-1 px-1.5 rounded text-[10px] font-semibold border text-center cursor-pointer transition-all ${
(s.columnRatio || '1:1') === r.val
? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
: isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-800/50 border-slate-700 text-slate-300'
}`}
>
{r.label}
</button>
))}
</div>
</div>
)}

{s.layoutColumns === '3' && (
<div>
<label className={`font-semibold text-[11px] block mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Column Proportions (3 Columns)</label>
<div className="grid grid-cols-2 gap-1">
{[
{ label: 'Equal (1:1:1)', val: '1:1:1' },
{ label: 'Wide Center (1:2:1)', val: '1:2:1' },
{ label: 'Left Focus (2:1:1)', val: '2:1:1' },
{ label: 'Right Focus (1:1:2)', val: '1:1:2' },
].map((r) => (
<button
key={r.val}
type="button"
onClick={() => updateStyle('columnRatio', r.val)}
className={`py-1 px-1.5 rounded text-[10px] font-semibold border text-center cursor-pointer transition-all ${
(s.columnRatio || '1:1:1') === r.val
? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
: isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-800/50 border-slate-700 text-slate-300'
}`}
>
{r.label}
</button>
))}
</div>
</div>
)}

<div className={`pt-2.5 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
<label className={`font-semibold text-[11px] block mb-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
Vertical Alignment
</label>
<div className="grid grid-cols-4 gap-1">
{[
{ id: 'flex-start', label: 'Top', icon: ArrowUpToLine },
{ id: 'center', label: 'Center', icon: AlignCenter },
{ id: 'flex-end', label: 'Bottom', icon: ArrowDownToLine },
{ id: 'stretch', label: 'Stretch', icon: StretchVertical },
].map((al) => {
const currentAlign = s.alignItems || 'stretch';
const isSel =
currentAlign === al.id ||
(al.id === 'flex-start' && (currentAlign === 'top' || currentAlign === 'start')) ||
(al.id === 'flex-end' && (currentAlign === 'bottom' || currentAlign === 'end'));
const Icon = al.icon;
return (
<button
key={al.id}
type="button"
onClick={() => updateStyle('alignItems', al.id)}
className={`py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
isSel
? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-xs'
: isLight
? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
: 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-800'
}`}
title={al.label}
>
<Icon className="w-3.5 h-3.5" />
<span>{al.label}</span>
</button>
);
})}
</div>
</div>

<div className={`pt-2.5 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
<div className="flex items-center justify-between mb-1">
<label className={`font-semibold text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
Column Gap
</label>
<span className="text-[10px] font-mono text-indigo-400 font-bold">
{s.gap !== undefined ? s.gap : 24}px
</span>
</div>
<div className="grid grid-cols-4 gap-1">
{[0, 16, 24, 32].map((g) => {
const currentGap = s.gap !== undefined ? s.gap : 24;
return (
<button
key={g}
type="button"
onClick={() => updateStyle('gap', g)}
className={`py-1 text-[10px] font-semibold rounded-md border text-center cursor-pointer transition-all ${
currentGap === g
? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
: isLight
? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
: 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-800'
}`}
>
{g}px
</button>
);
})}
</div>
</div>
</div>
)}

{activeTool === 'containerWidth' && (
<div className="space-y-3 text-xs w-72">
<div>
<div className="flex items-center justify-between mb-1.5">
<label className={`font-semibold text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Container Width</label>
<span className="text-[10px] font-mono text-indigo-400 font-bold">{s.width ? String(s.width) : (s.fullWidth !== false ? '100%' : '100%')}</span>
</div>
<div className="grid grid-cols-4 gap-1">
{[
{ label: '100%', val: '100%', full: true },
{ label: '75%', val: '75%', full: false },
{ label: '66%', val: '66.6%', full: false },
{ label: '50%', val: '50%', full: false },
].map((w) => {
const currentWidth = s.width !== undefined ? String(s.width) : (s.fullWidth !== false ? '100%' : '100%');
const isActive = currentWidth === w.val;
return (
<button
key={w.label}
type="button"
onClick={() => updateStyles({ width: w.val, fullWidth: w.full })}
className={`py-1 rounded text-[11px] font-semibold border text-center cursor-pointer transition-all ${
isActive
? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
: isLight ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
}`}
>
{w.label}
</button>
);
})}
</div>
<div className="mt-1.5 flex items-center gap-1.5">
<input
type="text"
value={s.width || ''}
onChange={(e) => updateStyles({ width: e.target.value, fullWidth: false })}
placeholder="Custom e.g. 800px, 90%"
className={`w-full text-[11px] px-2 py-1 rounded border ${isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-800 border-slate-700 text-white'}`}
/>
</div>
</div>

<div>
<label className={`font-semibold text-[11px] block mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Container Max-Width</label>
<select
value={s.maxWidth || 'full'}
onChange={(e) => updateStyle('maxWidth', e.target.value)}
className={`w-full text-xs px-2 py-1.5 rounded-lg border ${isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-800 border-slate-700 text-white'}`}
>
<option value="full">Full (100% - No constraint)</option>
<option value="7xl">7XL (1280px Wide)</option>
<option value="6xl">6XL (1152px)</option>
<option value="5xl">5XL (1024px)</option>
<option value="4xl">4XL (896px)</option>
<option value="3xl">3XL (768px)</option>
<option value="2xl">2XL (672px)</option>
<option value="xl">XL (576px)</option>
<option value="lg">LG (512px)</option>
<option value="none">None</option>
</select>
</div>

<div>
<label className={`font-semibold text-[11px] block mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Alignment / Centering</label>
<div className="grid grid-cols-3 gap-1">
{[
{ id: 'left', label: 'Left', icon: AlignLeft },
{ id: 'center', label: 'Center', icon: AlignCenter },
{ id: 'right', label: 'Right', icon: AlignRight },
].map((al) => {
const Icon = al.icon;
const isActive = (s.alignment === al.id || s.marginAuto === al.id) || (!s.alignment && !s.marginAuto && al.id === 'center');
return (
<button
key={al.id}
type="button"
onClick={() => updateStyles({ alignment: al.id, marginAuto: al.id })}
className={`py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1 border cursor-pointer transition-all ${
isActive
? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
: isLight ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
}`}
>
<Icon className="w-3.5 h-3.5" />
<span>{al.label}</span>
</button>
);
})}
</div>
</div>
</div>
)}

{activeTool === 'containerGap' && (
<div className="space-y-3 text-xs w-72 p-1">
<div className="flex items-center justify-between">
<label className={`font-semibold text-xs flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
<LayoutGrid className="w-4 h-4 text-indigo-500" />
<span>Column / Item Gap</span>
</label>
<span className="text-xs font-mono font-bold text-indigo-500">
{s.gap !== undefined ? s.gap : (elementType === 'nav-links' ? 24 : 16)}px
</span>
</div>

<div className="grid grid-cols-6 gap-1">
{[0, 8, 12, 16, 24, 32].map((gVal) => {
const currentGap = s.gap !== undefined ? s.gap : (elementType === 'nav-links' ? 24 : 16);
return (
<button
key={gVal}
type="button"
onClick={() => updateStyle('gap', gVal)}
className={`py-1.5 rounded-lg text-xs font-mono font-semibold border text-center transition-all cursor-pointer ${
currentGap === gVal
? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-bold'
: isLight
? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
: 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
}`}
>
{gVal}px
</button>
);
})}
</div>

<SliderWithInput
label="Custom Gap"
value={Number(s.gap !== undefined ? s.gap : (elementType === 'nav-links' ? 24 : 16))}
onChange={(val) => updateStyle('gap', val)}
min={0}
max={96}
step={2}
unit="px"
isLight={isLight}
/>
</div>
)}

{activeTool === 'formInputSettings' && (
<div className="space-y-3 text-xs">
<div className="space-y-1">
<label className={`font-semibold text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Field Label</label>
<input
type="text"
value={element.label || ''}
onChange={(e) => onUpdateElement({ ...element, label: e.target.value })}
placeholder="Field Label..."
className={`w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
isLight ? 'bg-slate-50 border-slate-300 focus:border-indigo-500' : 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
}`}
/>
</div>

<div className="space-y-1">
<label className={`font-semibold text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Placeholder Text</label>
<input
type="text"
value={element.placeholder || ''}
onChange={(e) => onUpdateElement({ ...element, placeholder: e.target.value })}
placeholder="Enter value..."
className={`w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
isLight ? 'bg-slate-50 border-slate-300 focus:border-indigo-500' : 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
}`}
/>
</div>
</div>
)}

{activeTool === 'formResponseSettings' && (
<div className="space-y-3.5 text-xs w-80 max-h-[440px] overflow-y-auto no-scrollbar pr-0.5">
<div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800">
<span className="font-bold text-xs flex items-center gap-1.5 text-emerald-500">
<CircleCheck className="w-4 h-4" />
<span>Form Submission & Responses</span>
</span>
<span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono font-semibold">API Ready</span>
</div>

<div className="space-y-1.5">
<label className={`font-semibold text-[11px] block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
Form Action / API Endpoint
</label>
<input
type="text"
value={element.formActionUrl || ''}
onChange={(e) => onUpdateElement({ ...element, formActionUrl: e.target.value })}
placeholder="/api/submit-form or https://formspree.io/f/..."
className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono outline-none ${
isLight ? 'bg-white border-slate-300 focus:border-indigo-500 text-slate-800' : 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
}`}
/>
<div className="flex items-center gap-1 flex-wrap pt-0.5">
<button
type="button"
onClick={() => onUpdateElement({ ...element, formActionUrl: '/api/submit-form' })}
className={`text-[10px] px-2 py-0.5 rounded font-medium border cursor-pointer ${
element.formActionUrl === '/api/submit-form'
? 'bg-indigo-600 text-white border-indigo-600'
: isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
}`}
>
⚡ Native API: /api/submit-form
</button>
<button
type="button"
onClick={() => onUpdateElement({ ...element, formActionUrl: '#' })}
className={`text-[10px] px-2 py-0.5 rounded font-medium border cursor-pointer ${
!element.formActionUrl || element.formActionUrl === '#'
? 'bg-indigo-600 text-white border-indigo-600'
: isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
}`}
>
Browser Local Mode
</button>
</div>
</div>

<div className="space-y-1.5">
<label className={`font-semibold text-[11px] block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
Submitting Button Text (Loading Feedback)
</label>
<input
type="text"
value={element.formSubmittingText || 'Sending...'}
onChange={(e) => onUpdateElement({ ...element, formSubmittingText: e.target.value })}
placeholder="Sending..."
className={`w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
isLight ? 'bg-white border-slate-300 focus:border-indigo-500 text-slate-800' : 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
}`}
/>
</div>

<div className="space-y-1.5">
<label className={`font-semibold text-[11px] block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
Success Response Behavior
</label>
<div className="grid grid-cols-3 gap-1">
{[
{ id: 'inline', label: 'Inline Alert' },
{ id: 'modal', label: 'Popup Modal' },
{ id: 'redirect', label: 'Redirect URL' },
].map((act) => (
<button
key={act.id}
type="button"
onClick={() => onUpdateElement({ ...element, formSuccessAction: act.id as any })}
className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border text-center cursor-pointer transition-all ${
(element.formSuccessAction || 'inline') === act.id
? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
: isLight ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
}`}
>
{act.label}
</button>
))}
</div>
</div>

<div className="space-y-1.5">
<label className={`font-semibold text-[11px] block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
Success Message
</label>
<textarea
rows={2}
value={element.formSuccessMessage || 'Thank you! Your message has been sent successfully.'}
onChange={(e) => onUpdateElement({ ...element, formSuccessMessage: e.target.value })}
placeholder="Enter success message..."
className={`w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none resize-none ${
isLight ? 'bg-white border-slate-300 focus:border-emerald-500 text-slate-800' : 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500'
}`}
/>
</div>

<div className="space-y-1.5">
<label className={`font-semibold text-[11px] block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
Error Message
</label>
<textarea
rows={2}
value={element.formErrorMessage || 'Something went wrong. Please check your details and try again.'}
onChange={(e) => onUpdateElement({ ...element, formErrorMessage: e.target.value })}
placeholder="Enter error message..."
className={`w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none resize-none ${
isLight ? 'bg-white border-slate-300 focus:border-rose-500 text-slate-800' : 'bg-slate-900 border-slate-700 text-white focus:border-rose-500'
}`}
/>
</div>

{element.formSuccessAction === 'redirect' && (
<div className="space-y-1.5">
<label className={`font-semibold text-[11px] block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
Redirect URL
</label>
<input
type="text"
value={element.formRedirectUrl || ''}
onChange={(e) => onUpdateElement({ ...element, formRedirectUrl: e.target.value })}
placeholder="https://example.com/thank-you"
className={`w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
isLight ? 'bg-white border-slate-300 focus:border-indigo-500 text-slate-800' : 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
}`}
/>
</div>
)}

<div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
<span className={`font-semibold text-[11px] ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
Auto-reset fields after submit
</span>
<button
type="button"
onClick={() => onUpdateElement({ ...element, formAutoReset: element.formAutoReset === false })}
className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${
element.formAutoReset !== false ? 'bg-emerald-600' : isLight ? 'bg-slate-300' : 'bg-slate-700'
}`}
>
<span
className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
element.formAutoReset !== false ? 'left-4.5' : 'left-0.5'
}`}
/>
</button>
</div>
</div>
)}

{activeTool === 'formSubmitSettings' && (
<div className="space-y-3.5 text-xs w-72">
<div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800">
<span className="font-bold text-xs flex items-center gap-1.5 text-indigo-500">
<Send className="w-4 h-4" />
<span>Submit Button Settings</span>
</span>
</div>

<div className="space-y-1.5">
<label className={`font-semibold text-[11px] block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
Button Label
</label>
<input
type="text"
value={element.formSubmitText || 'Send Message'}
onChange={(e) => onUpdateElement({ ...element, formSubmitText: e.target.value })}
placeholder="Send Message"
className={`w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
isLight ? 'bg-white border-slate-300 focus:border-indigo-500 text-slate-800' : 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500'
}`}
/>
</div>

<div className="space-y-1.5">
<label className={`font-semibold text-[11px] block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
Button Alignment
</label>
<div className="grid grid-cols-4 gap-1">
{[
{ id: 'left', label: 'Left', icon: AlignLeft },
{ id: 'center', label: 'Center', icon: AlignCenter },
{ id: 'right', label: 'Right', icon: AlignRight },
{ id: 'full', label: 'Full', icon: StretchVertical },
].map((al) => {
const Icon = al.icon;
const isSel = (element.formSubmitAlign || 'left') === al.id;
return (
<button
key={al.id}
type="button"
onClick={() => onUpdateElement({ ...element, formSubmitAlign: al.id as any })}
className={`py-1.5 rounded-lg border text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all ${
isSel
? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
: isLight ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
}`}
title={al.label}
>
<Icon className="w-3.5 h-3.5" />
<span>{al.label}</span>
</button>
);
})}
</div>
</div>

<div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 dark:border-slate-800">
<div>
<label className={`text-[10px] font-bold block mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Button Color</label>
<div className="flex items-center gap-1.5">
<input
type="color"
value={element.formSubmitBgColor || '#4f46e5'}
onChange={(e) => onUpdateElement({ ...element, formSubmitBgColor: e.target.value })}
className="w-7 h-7 rounded border bg-transparent cursor-pointer shrink-0"
/>
<input
type="text"
value={element.formSubmitBgColor || '#4f46e5'}
onChange={(e) => onUpdateElement({ ...element, formSubmitBgColor: e.target.value })}
className={`w-full text-[10px] px-1.5 py-1 rounded border ${isLight ? 'bg-white border-slate-300' : 'bg-slate-800 border-slate-700 text-white'}`}
/>
</div>
</div>

<div>
<label className={`text-[10px] font-bold block mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Text Color</label>
<div className="flex items-center gap-1.5">
<input
type="color"
value={element.formSubmitTextColor || '#ffffff'}
onChange={(e) => onUpdateElement({ ...element, formSubmitTextColor: e.target.value })}
className="w-7 h-7 rounded border bg-transparent cursor-pointer shrink-0"
/>
<input
type="text"
value={element.formSubmitTextColor || '#ffffff'}
onChange={(e) => onUpdateElement({ ...element, formSubmitTextColor: e.target.value })}
className={`w-full text-[10px] px-1.5 py-1 rounded border ${isLight ? 'bg-white border-slate-300' : 'bg-slate-800 border-slate-700 text-white'}`}
/>
</div>
</div>
</div>
</div>
)}
</>);
};
const activeStyleTag = (element.tag || (element.type === 'heading' ? 'h2' : 'p')).toLowerCase();
const activeStyleOption = TEXT_STYLE_OPTIONS.find((opt) => opt.tag.toLowerCase() === activeStyleTag);
const activeStyleLabel = activeStyleOption ? activeStyleOption.label : 'Style';

const elementType = (element.type || 'text') as string;
const isImage = elementType === 'image';
const isButton = elementType === 'button';
const isIcon = elementType === 'icon';
const isMedia = elementType === 'video' || elementType === 'map' || elementType === 'embed';
const isContainer = elementType === 'card' || elementType === 'container' || elementType === 'grid' || elementType === 'section' || elementType === 'flex' || elementType === 'box';
const isFormBox = elementType === 'form';
const isFormField = elementType.startsWith('form-') && elementType !== 'form';
const isForm = isFormBox || isFormField || elementType === 'input' || elementType === 'textarea' || elementType === 'select' || elementType === 'checkbox';
const isNavBox = elementType === 'nav-links' || elementType === 'nav-container';
const isNavLink = elementType === 'nav-link';
const isTextLike = !isImage && !isButton && !isIcon && !isMedia && !isContainer && !isForm && !isNavBox && !isNavLink;

return (
<div className="toolbar-container relative w-full select-none z-[85]" data-toolbar-root="true">
<div
ref={toolbarRef}
className={`w-full flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 border-t overflow-x-auto no-scrollbar shadow-xs transition-colors ${
isLight
? 'bg-slate-50/95 border-slate-200 text-slate-700'
: 'bg-slate-900/95 border-slate-800 text-slate-200'
}`}
>
{(elementType === 'inline' || elementType === 'container' || (element?.children && element.children.length > 0)) && (
<GroupToolbar
element={element}
activeTool={activeTool}
toggleTool={toggleTool}
isLight={isLight}
onUpdateSection={onUpdateSection}
currentSection={currentSection}
onClose={onClose}
/>
)}

{isNavBox && (
<NavContainerToolbar
element={element}
onUpdateElement={onUpdateElement}
activeTool={activeTool}
toggleTool={toggleTool}
isLight={isLight}
showNavInsertMenu={showNavInsertMenu}
setShowNavInsertMenu={setShowNavInsertMenu}
newLinkText={newLinkText}
setNewLinkText={setNewLinkText}
newLinkUrl={newLinkUrl}
setNewLinkUrl={setNewLinkUrl}
getNavChildrenList={getNavChildrenList}
handleAddNavQuickLink={handleAddNavQuickLink}
updateNavLinkProp={updateNavLinkProp}
deleteNavLinkItem={deleteNavLinkItem}
/>
)}

{isNavLink && (
<NavLinkToolbar
element={element}
onUpdateElement={onUpdateElement}
isLight={isLight}
/>
)}

{isImage && (
<ImageToolbar
element={element}
activeTool={activeTool}
toggleTool={toggleTool}
isLight={isLight}
/>
)}

{isButton && (
<ButtonToolbar
element={element}
activeTool={activeTool}
toggleTool={toggleTool}
isLight={isLight}
/>
)}

{isIcon && (
<IconToolbar
element={element}
activeTool={activeTool}
toggleTool={toggleTool}
isLight={isLight}
/>
)}

{isMedia && (
<MediaToolbar
element={element}
activeTool={activeTool}
toggleTool={toggleTool}
isLight={isLight}
/>
)}

{isContainer && (
<ContainerToolbar
element={element}
activeTool={activeTool}
toggleTool={toggleTool}
isLight={isLight}
/>
)}

{isFormBox && (
<FormToolbar
element={element}
activeTool={activeTool}
toggleTool={toggleTool}
isLight={isLight}
/>
)}

{(isFormField || elementType === 'input' || elementType === 'textarea' || elementType === 'select' || elementType === 'checkbox') && (
<FormFieldToolbar
element={element}
activeTool={activeTool}
toggleTool={toggleTool}
isLight={isLight}
/>
)}

{isTextLike && (
<TypographyToolbar
element={element}
activeTool={activeTool}
toggleTool={toggleTool}
isLight={isLight}
stripQuotes={stripQuotes}
detectedFontFamily={detectedFontFamily}
activeStyleLabel={activeStyleLabel}
currentFontSizePx={`${currentFontSizePx}px`}
handleToggleBold={handleToggleBold}
handleToggleItalic={handleToggleItalic}
handleUnderlineButtonClick={handleUnderlineButtonClick}
handleOverlineButtonClick={handleOverlineButtonClick}
handleStrikethroughButtonClick={handleStrikethroughButtonClick}
handleToggleSuperscript={handleToggleSuperscript}
handleToggleSubscript={handleToggleSubscript}
applyFormatCommand={applyFormatCommand}
isBoldActive={isBoldActive}
isItalicActive={isItalicActive}
isUnderlineActive={isUnderlineActive}
isOverlineActive={isOverlineActive}
isStrikethroughActive={isStrikethroughActive}
isSuperscriptActive={isSuperscriptActive}
isSubscriptActive={isSubscriptActive}
underlineConfig={underlineConfig}
overlineConfig={overlineConfig}
strikethroughConfig={strikethroughConfig}
activeFormats={activeFormats}
detectedLinkHref={detectedLinkHref}
updateStyle={updateStyle}
/>
)}

<div className={`h-5 w-[1px] shrink-0 mx-1 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`}/>

<div className="flex items-center gap-1 shrink-0">
{(['left', 'center', 'right', 'justify'] as const).map((align) => {
const isAligned = isImage
? (s.alignment || (s.marginAuto === 'center' || s.marginAuto === true ? 'center' : s.marginAuto === 'right' ? 'right' : 'left')) === align
: (s.textAlign || 'left') === align;

return (
<button
key={align}
type="button"
onClick={() => {
if (isImage) {
updateStyles({ alignment: align, marginAuto: align });
} else {
updateStyle('textAlign', align);
}
}}
className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
isAligned
? isLight ? 'bg-slate-200/80 text-indigo-600' : 'bg-slate-800 text-indigo-400'
: isLight ? 'hover:bg-slate-200/80 text-slate-700' : 'hover:bg-slate-800 text-slate-200'
}`}
title={align === 'justify' ? 'Justify' : `Align ${align.charAt(0).toUpperCase() + align.slice(1)}`}
>
{align === 'left' && <AlignLeft className="w-4 h-4" />}
{align === 'center' && <AlignCenter className="w-4 h-4" />}
{align === 'right' && <AlignRight className="w-4 h-4" />}
{align === 'justify' && <AlignJustify className="w-4 h-4" />}
</button>
);
})}
</div>

{!isImage && (
<>
<div className={`h-5 w-[1px] shrink-0 mx-1 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`}/>

<div className="flex items-center gap-1 shrink-0">
<button
type="button"
onClick={() => toggleTool('spacing')}
className={`px-2.5 py-1 text-xs font-semibold flex items-center transition-colors cursor-pointer shrink-0 ${
activeTool === 'spacing'
? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
: isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
}`}
title="Space Before / After (Margins)"
aria-label="Margin Spacing"
>
<span>Margins</span>
</button>

<div className={`h-4 w-[1px] shrink-0 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />

<button
type="button"
onClick={() => toggleTool('lineHeight')}
className={`px-2.5 py-1 text-xs font-semibold flex items-center transition-colors cursor-pointer shrink-0 ${
activeTool === 'lineHeight'
? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
: isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
}`}
title="Line Height"
aria-label="Line Height"
>
<span>Line Height</span>
</button>

<div className={`h-4 w-[1px] shrink-0 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />

<button
type="button"
onClick={() => toggleTool('letterSpacing')}
className={`px-2.5 py-1 text-xs font-semibold flex items-center transition-colors cursor-pointer shrink-0 ${
activeTool === 'letterSpacing'
? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
: isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
}`}
title="Letter Spacing"
aria-label="Letter Spacing"
>
<span>Letter Spacing</span>
</button>

<div className={`h-4 w-[1px] shrink-0 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />

<button
type="button"
onClick={() => toggleTool('wordSpacing')}
className={`px-2.5 py-1 text-xs font-semibold flex items-center transition-colors cursor-pointer shrink-0 ${
activeTool === 'wordSpacing'
? isLight ? 'text-indigo-600 font-bold' : 'text-indigo-400 font-bold'
: isLight ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-indigo-400'
}`}
title="Word Spacing"
aria-label="Word Spacing"
>
<span>Word Spacing</span>
</button>
</div>
</>
)}
</div>

<Popover
isOpen={activeTool !== null}
onClose={() => setActiveTool(null)}
uiTheme={uiTheme}
widthClassName={
isImage
? 'w-[360px] sm:w-[410px]'
: ['lineHeight', 'letterSpacing', 'wordSpacing', 'spacing', 'fontSize'].includes(activeTool || '')
? 'w-[230px] sm:w-[250px]'
: 'w-[280px] sm:w-[310px]'
}
>
{renderToolContent()}
</Popover>
</div>
);
};

export const TextToolbar = Toolbar;
