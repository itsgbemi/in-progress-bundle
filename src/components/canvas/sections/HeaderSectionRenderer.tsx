import React from 'react';
import { WebsiteSection, WebsiteElement, SelectedElementContext, EditorMode, ViewportMode } from '../../../types';
import { CanvasElement } from '../../CanvasElement';
import { Plus, ChevronDown } from 'lucide-react';
import {
renderCloseButtonElement,
renderCloseIconContent,
renderHamburgerIcon,
} from './HeaderMobileHelpers';

interface HeaderSectionRendererProps {
section: WebsiteSection;
sectionStyle: React.CSSProperties;
maxWidthClass: string;
containerStyle?: React.CSSProperties;
isSticky: boolean;
editorMode: EditorMode;
viewportMode?: ViewportMode;
isRotated?: boolean;
uiTheme: 'dark' | 'light';
isSectionSelected: boolean;
isSectionHovered?: boolean;
selectedContext?: SelectedElementContext | null;
isMobileMenuOpen: boolean;
setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
mobileExpandedNavIds: Record<string, boolean>;
setMobileExpandedNavIds: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
onSelectElement: (context: SelectedElementContext) => void;
onUpdateElement: (updatedElement: WebsiteElement) => void;
onUpdateSection?: (updatedSection: WebsiteSection) => void;
onSelectSection?: (section: WebsiteSection) => void;
onOpenSectionEditBox?: (section: WebsiteSection) => void;
onAddElementToSection?: (sectionId: string) => void;
onDeleteSection?: (sectionId: string) => void;
onDeleteElement?: (elementId: string) => void;
onMoveElement?: (sectionId: string, elementId: string, direction: 'up' | 'down') => void;
onDuplicateElement?: (sectionId: string, elementId: string) => void;
handleSectionClick: (e: React.MouseEvent) => void;
handleSectionMouseEnter: () => void;
handleSectionMouseLeave: () => void;
handleAddHeaderNavLink: (targetGroup?: 'nav1' | 'nav2') => void;
handleAddHeaderCtaButton: () => void;
handleAddHeaderCtaIcon: () => void;
}

export const HeaderSectionRenderer: React.FC<HeaderSectionRendererProps> = ({
section,
sectionStyle,
maxWidthClass,
containerStyle,
isSticky,
editorMode,
viewportMode = 'desktop',
isRotated = false,
uiTheme,
isSectionSelected,
selectedContext,
isMobileMenuOpen,
setIsMobileMenuOpen,
mobileExpandedNavIds,
setMobileExpandedNavIds,
onSelectElement,
onUpdateElement,
handleSectionClick,
handleSectionMouseEnter,
handleSectionMouseLeave,
handleAddHeaderNavLink,
handleAddHeaderCtaButton,
handleAddHeaderCtaIcon,
isSectionHovered,
onUpdateSection,
onSelectSection,
onOpenSectionEditBox,
onAddElementToSection,
onDeleteSection,
onDeleteElement,
onMoveElement,
onDuplicateElement,
}) => {
const isLight = uiTheme === 'light';
const layout = section.headerLayout || 'standard';
const s = section.styles || {};

const [isMobileScreen, setIsMobileScreen] = React.useState<boolean>(() => {
if (typeof window !== 'undefined') {
return window.innerWidth < 768;
}
return false;
});

React.useEffect(() => {
const handleResize = () => {
setIsMobileScreen(window.innerWidth < 768);
};
window.addEventListener('resize', handleResize);
return () => window.removeEventListener('resize', handleResize);
}, []);

const isMobileView = viewportMode === 'mobile' || (isMobileScreen && viewportMode !== 'tablet');
const isTabletView = viewportMode === 'tablet' && !isMobileScreen;

const dist = s.layoutDistribution || (layout === 'centered' ? 'center' : 'space-between');
const justifyClass =
dist === 'space-around'
? 'justify-around'
: dist === 'space-evenly'
? 'justify-evenly'
: dist === 'center'
? 'justify-center'
: dist === 'flex-start'
? 'justify-start'
: dist === 'flex-end'
? 'justify-end'
: 'justify-between';

const alignItemClass =
s.alignItems === 'flex-start'
? 'items-start'
: s.alignItems === 'flex-end'
? 'items-end'
: s.alignItems === 'stretch'
? 'items-stretch'
: 'items-center';

const headerGap = s.gap !== undefined ? `${s.gap}px` : '1rem';

const isCentered = layout === 'centered';
const isStacked = layout === 'stacked';

return (
<>
<header
style={sectionStyle}
onClick={handleSectionClick}
onMouseEnter={handleSectionMouseEnter}
onMouseLeave={handleSectionMouseLeave}
className={`relative group transition-all w-full ${
isSticky ? 'sticky top-0 z-40 backdrop-blur-md' : 'relative z-20'
} ${editorMode === 'edit' ? 'cursor-pointer' : ''} ${
isSectionSelected ? 'outline-dotted outline-2 outline-indigo-500 outline-offset-2 shadow-lg' : ''
}`}
>
{isStacked && (
<div className="w-full border-b border-slate-800/80 pb-2 mb-3 text-xs flex items-center justify-between opacity-80">
<span className="font-medium text-indigo-400">✨ Next-Gen Experience Platform</span>
<div className="flex items-center gap-4">
<span>Support 24/7</span>
<span>English (US)</span>
</div>
</div>
)}

{section.elements.length === 0 ? (
<div
className={`${maxWidthClass} w-full py-5 flex items-center justify-center`}
style={{
maxWidth: containerStyle?.maxWidth,
width: '100%',
marginLeft: containerStyle?.marginLeft,
marginRight: containerStyle?.marginRight,
}}
>
<button
type="button"
onClick={(e) => {
e.stopPropagation();
if (onAddElementToSection) {
onAddElementToSection(section.id);
}
}}
className="px-6 py-2.5 rounded-xl border border-slate-400/50 hover:border-indigo-500 bg-transparent hover:bg-indigo-500/5 text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 group text-inherit"
>
<Plus className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
<span>Add to header</span>
</button>
</div>
) : (
<div
className={`${maxWidthClass} flex ${alignItemClass} ${
isCentered ? 'flex-col justify-center gap-3 text-center' : `${justifyClass} gap-4`
} w-full`}
style={{
gap: headerGap,
maxWidth: containerStyle?.maxWidth,
width: '100%',
marginLeft: containerStyle?.marginLeft,
marginRight: containerStyle?.marginRight,
}}
>
{section.elements
.filter((element) => {
if (element.hidden) return false;
if (isMobileView && (element.hideOnMobile || element.styles?.hideOnMobile)) {
return false;
}
if (isTabletView && (element.hideOnTablet || element.styles?.hideOnTablet)) {
return false;
}
if (!isMobileView && !isTabletView && (element.hideOnDesktop || element.styles?.hideOnDesktop)) {
return false;
}
return true;
})
.map((element) => (
<CanvasElement
key={element.id}
element={element}
sectionId={section.id}
isSelected={selectedContext?.element?.id === element.id}
selectedElementId={selectedContext?.element?.id}
selectedContext={selectedContext}
editorMode={editorMode}
onSelect={onSelectElement}
onUpdate={onUpdateElement}
onDeleteElement={onDeleteElement}
onMoveElement={onMoveElement}
onDuplicateElement={onDuplicateElement}
uiTheme={uiTheme}
viewportMode={viewportMode}
isRotated={isRotated}
/>
))}

{(() => {
const h = section.hamburgerSettings || {};
const isHamburgerHidden =
isMobileView
? Boolean(h.hideOnMobile)
: isTabletView
? Boolean(h.hideOnTablet ?? true)
: Boolean(h.hideOnDesktop ?? true);

if (isHamburgerHidden) return null;

return (
<div
className="flex items-center gap-2 ml-auto"
>
{(() => {
const isHamburgerSelected =
selectedContext?.element?.type === 'hamburger-button' &&
selectedContext?.sectionId === section.id;

const hBg =
h.backgroundColor !== 'transparent'
? h.backgroundColor || 'rgba(30, 41, 59, 0.8)'
: 'transparent';
const hColor = h.iconColor || '#e2e8f0';
const hRad = h.borderRadius !== undefined ? `${h.borderRadius}px` : '0.75rem';
const hBw = h.borderWidth !== undefined ? `${h.borderWidth}px` : '1px';
const hBc = h.borderColor || 'rgba(51, 65, 85, 1)';
const hBs = h.borderStyle || 'solid';
const hPx = h.paddingX !== undefined ? `${h.paddingX}px` : '0.5rem';
const hPy = h.paddingY !== undefined ? `${h.paddingY}px` : '0.5rem';

const shadowMap: Record<string, string> = {
sm: '0 1px 2px rgba(0,0,0,0.1)',
md: '0 4px 6px -1px rgba(0,0,0,0.2)',
lg: '0 10px 15px -3px rgba(0,0,0,0.3)',
xl: '0 20px 25px -5px rgba(0,0,0,0.4)',
'2xl': '0 25px 50px -12px rgba(0,0,0,0.5)',
};
const hShadow = h.shadow ? shadowMap[h.shadow] || 'none' : 'none';

return (
<button
type="button"
onClick={(e) => {
e.stopPropagation();
if (editorMode === 'edit') {
onSelectElement({
element: {
id: `hamburger-${section.id}`,
type: 'hamburger-button',
label: 'Hamburger Button',
content: '',
styles: {},
},
sectionId: section.id,
});
} else {
setIsMobileMenuOpen((prev) => !prev);
}
}}
style={{
backgroundColor: hBg,
color: hColor,
borderRadius: hRad,
borderWidth: hBw,
borderColor: hBc,
borderStyle: hBs as any,
paddingLeft: hPx,
paddingRight: hPx,
paddingTop: hPy,
paddingBottom: hPy,
boxShadow: hShadow,
}}
className={`inline-flex items-center justify-center gap-2 transition-all cursor-pointer focus:outline-none ${
isHamburgerSelected
? 'outline-dotted outline-2 outline-indigo-500 outline-offset-2'
: 'hover:opacity-85'
}`}
title={
editorMode === 'edit'
? 'Select Hamburger Button to Customize'
: 'Toggle navigation menu'
}
aria-label="Toggle navigation menu"
>
{(() => {
const dMode = h.displayMode || (h.showLabel ? 'icon-text' : 'icon');
const showIcon = dMode === 'icon' || dMode === 'icon-text';
const showText = dMode === 'text' || dMode === 'icon-text';
const txt = h.textLabel || h.labelText || 'Menu';
const textElement = showText ? (
<span
style={{
color: h.textColor || hColor,
fontSize: h.textFontSize ? `${h.textFontSize}px` : '13px',
fontWeight: (h.textFontWeight as any) || '600',
fontFamily: h.textTypeface ? `"${h.textTypeface}", sans-serif` : undefined,
}}
className="whitespace-nowrap select-none"
>
{txt}
</span>
) : null;

return (
<>
{showText && h.labelPosition === 'left' && textElement}
{showIcon &&
(editorMode !== 'edit' && isMobileMenuOpen
? renderCloseIconContent(section.mobileMenuSettings?.closeIconStyle, h.iconSize || 20)
: renderHamburgerIcon(h.iconStyle, h))}
{showText && h.labelPosition !== 'left' && textElement}
</>
);
})()}
</button>
);
})()}
</div>
);
})()}
</div>
)}
</header>

{isMobileMenuOpen &&
(() => {
const m = section.mobileMenuSettings || {};
const openDir = m.openDirection || 'right';
const drawerBg =
m.backgroundColor && m.backgroundColor !== 'transparent'
? m.backgroundColor
: isLight
? '#ffffff'
: '#0f172a';
const linkColor = m.linkTextColor || (isLight ? '#0f172a' : '#f8fafc');
const linkAlign = m.textAlign || (openDir === 'fullscreen' ? 'center' : 'left');
const linkSizePx =
m.linkFontSize !== undefined
? m.linkFontSize <= 5
? `${Math.round(m.linkFontSize * 16)}px`
: `${m.linkFontSize}px`
: m.linkFontSizeRem !== undefined
? `${Math.round(m.linkFontSizeRem * 16)}px`
: '18px';
const navLinks = section.elements.filter((el) => el.type === 'nav-link' || el.type === 'nav-links');
const ctaButtons = section.elements.filter((el) => el.type === 'button');
const showCta = m.showCta !== false && ctaButtons.length > 0;
const drawerWVw =
typeof m.drawerWidth === 'number'
? m.drawerWidth <= 100
? `${m.drawerWidth}vw`
: `${m.drawerWidth}px`
: typeof m.drawerWidth === 'string'
? m.drawerWidth
: '80vw';

let backdropClass = 'bg-black/60 backdrop-blur-sm';
let backdropCustomStyle: React.CSSProperties = {};
if (m.backdropDim === 'none') {
backdropClass = 'bg-transparent';
} else if (m.backdropDim === 'light') {
backdropClass = 'bg-black/30 backdrop-blur-xs';
} else if (m.backdropDim === 'heavy') {
backdropClass = 'bg-black/80 backdrop-blur-md';
} else if (m.backdropDim === 'custom') {
backdropClass = '';
const customHex = m.backdropCustomColor || '#000000';
const customOpacity =
(m.backdropCustomOpacity !== undefined ? m.backdropCustomOpacity : 50) / 100;
const r = parseInt(customHex.slice(1, 3) || '0', 16) || 0;
const g = parseInt(customHex.slice(3, 5) || '0', 16) || 0;
const b = parseInt(customHex.slice(5, 7) || '0', 16) || 0;
const blurPx = m.backdropCustomBlur !== undefined ? m.backdropCustomBlur : 6;
backdropCustomStyle = {
backgroundColor: `rgba(${r}, ${g}, ${b}, ${customOpacity})`,
backdropFilter: blurPx > 0 ? `blur(${blurPx}px)` : 'none',
WebkitBackdropFilter: blurPx > 0 ? `blur(${blurPx}px)` : 'none',
};
}

const renderDrawerContent = () => (
<>
<div
className={`flex items-center ${
openDir === 'left' ? 'justify-end' : 'justify-between'
} mb-6 shrink-0`}
>
{openDir !== 'left' && (
<span className="text-xs font-bold uppercase tracking-wider opacity-60">
Navigation
</span>
)}
{renderCloseButtonElement(m, () => setIsMobileMenuOpen(false), isLight)}
</div>

<nav
className={`flex flex-col gap-3.5 flex-1 my-auto ${
linkAlign === 'center'
? 'items-center text-center'
: linkAlign === 'right'
? 'items-end text-right'
: 'items-start text-left'
}`}
>
{navLinks.map((element) => {
const subItems =
element.submenu && element.submenu.length > 0
? element.submenu
: element.sublinks && element.sublinks.length > 0
? element.sublinks
: [];
const hasSubmenu = subItems.length > 0;
const isExpanded = Boolean(mobileExpandedNavIds[element.id]);

return (
<div key={`preview-drawer-${element.id}`} className="w-full py-1">
<div className="flex items-center justify-between w-full">
<div
className="flex-1 cursor-pointer transition-opacity hover:opacity-80"
onClick={() => {
if (editorMode === 'preview' && !hasSubmenu) {
setIsMobileMenuOpen(false);
}
}}
>
<CanvasElement
element={{
...element,
inMobileDrawer: true,
styles: {
...element.styles,
fontSize: linkSizePx as any,
textColor: linkColor,
textAlign: linkAlign,
},
}}
sectionId={section.id}
isSelected={selectedContext?.element?.id === element.id}
editorMode={editorMode}
onSelect={onSelectElement}
onUpdate={onUpdateElement}
uiTheme={uiTheme}
/>
</div>

{hasSubmenu && (
<button
type="button"
onClick={(e) => {
e.stopPropagation();
setMobileExpandedNavIds((prev) => ({
...prev,
[element.id]: !prev[element.id],
}));
}}
className={`p-1.5 rounded-lg transition-colors cursor-pointer ml-2 ${
isLight
? 'hover:bg-slate-200 text-slate-700'
: 'hover:bg-slate-800 text-slate-300'
}`}
aria-label="Toggle submenu"
>
<ChevronDown
className={`w-4 h-4 transition-transform duration-200 ${
isExpanded ? 'rotate-180 text-indigo-400' : 'opacity-70'
}`}
/>
</button>
)}
</div>

{hasSubmenu && isExpanded && (
<div
className={`mt-2 pl-3 border-l-2 space-y-1.5 py-1 ${
isLight
? 'border-slate-200 bg-slate-50/50 rounded-r-lg'
: 'border-slate-800 bg-slate-900/40 rounded-r-lg'
}`}
>
{subItems.map((sub: any, sIdx: number) => (
<a
key={sub.id || sIdx}
href={sub.href || '#'}
target={sub.target || '_self'}
onClick={() => {
if (editorMode === 'preview') {
setIsMobileMenuOpen(false);
}
}}
className={`block py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-colors ${
isLight
? 'hover:bg-indigo-50 hover:text-indigo-600 text-slate-700'
: 'hover:bg-slate-800 hover:text-indigo-400 text-slate-300'
}`}
>
<div>{sub.label || sub.title || `Sub-item ${sIdx + 1}`}</div>
{sub.description && (
<div className="text-[10px] opacity-70 mt-0.5">{sub.description}</div>
)}
</a>
))}
</div>
)}
</div>
);
})}
</nav>

{showCta && (
<div
className={`flex flex-col gap-3 mt-6 pt-5 border-t border-slate-700/40 shrink-0 w-full ${
linkAlign === 'center'
? 'items-center'
: linkAlign === 'right'
? 'items-end'
: 'items-stretch'
}`}
>
{ctaButtons.map((element) => (
<div
key={`preview-drawer-btn-${element.id}`}
className="w-full"
onClick={() => {
if (editorMode === 'preview') {
setIsMobileMenuOpen(false);
}
}}
>
<CanvasElement
element={{
...element,
styles: {
...element.styles,
width: '100%',
},
}}
sectionId={section.id}
isSelected={selectedContext?.element?.id === element.id}
editorMode={editorMode}
onSelect={onSelectElement}
onUpdate={onUpdateElement}
uiTheme={uiTheme}
/>
</div>
))}
</div>
)}
</>
);

const drawerZIndex = editorMode === 'edit' ? 'z-[45]' : 'z-[99999]';
const backdropZIndex = editorMode === 'edit' ? 'z-[44]' : 'z-[99998]';

return (
<div className={`fixed inset-0 ${drawerZIndex} flex`} aria-modal="true" role="dialog">
<div
className={`fixed inset-0 ${backdropZIndex} transition-opacity ${backdropClass}`}
style={backdropCustomStyle}
onClick={() => setIsMobileMenuOpen(false)}
/>

{openDir === 'fullscreen' ? (
<div
className={`fixed inset-0 ${drawerZIndex} flex flex-col p-6 sm:p-10 overflow-y-auto animate-in fade-in zoom-in-95 duration-200 shadow-2xl`}
style={{
backgroundColor: drawerBg,
color: linkColor,
}}
>
{renderDrawerContent()}
</div>
) : (openDir as string) === 'top' ? (
<div
className={`fixed top-0 inset-x-0 ${drawerZIndex} max-h-[85vh] flex flex-col p-6 overflow-y-auto animate-in slide-in-from-top duration-200 shadow-2xl border-b ${
isLight ? 'border-slate-200' : 'border-slate-800'
}`}
style={{
backgroundColor: drawerBg,
color: linkColor,
}}
>
{renderDrawerContent()}
</div>
) : (openDir as string) === 'bottom' ? (
<div
className={`fixed bottom-0 inset-x-0 ${drawerZIndex} max-h-[85vh] flex flex-col p-6 overflow-y-auto animate-in slide-in-from-bottom duration-200 shadow-2xl border-t ${
isLight ? 'border-slate-200' : 'border-slate-800'
}`}
style={{
backgroundColor: drawerBg,
color: linkColor,
}}
>
{renderDrawerContent()}
</div>
) : (openDir as string) === 'left' ? (
<div
className={`fixed top-0 bottom-0 left-0 ${drawerZIndex} flex flex-col p-6 overflow-y-auto animate-in slide-in-from-left duration-200 shadow-2xl border-r ${
isLight ? 'border-slate-200' : 'border-slate-800'
}`}
style={{
backgroundColor: drawerBg,
color: linkColor,
width: drawerWVw,
maxWidth: '100vw',
}}
>
{renderDrawerContent()}
</div>
) : (
<div
className={`fixed top-0 bottom-0 right-0 ${drawerZIndex} flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-200 shadow-2xl border-l ${
isLight ? 'border-slate-200' : 'border-slate-800'
}`}
style={{
backgroundColor: drawerBg,
color: linkColor,
width: drawerWVw,
maxWidth: '100vw',
}}
>
{renderDrawerContent()}
</div>
)}
</div>
);
})()}
</>
);
};
