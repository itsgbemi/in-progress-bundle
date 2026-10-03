import React from 'react';
import { WebsiteElement, EditorMode } from '../../../types';
import { ChevronDown } from 'lucide-react';

interface NavLinksElementRendererProps {
element: WebsiteElement;
editorMode: EditorMode;
uiTheme?: 'dark' | 'light';
styleObj: React.CSSProperties;
renderChildElement?: (child: WebsiteElement, childIdx?: number, totalChildren?: number) => React.ReactNode;
}

export const NavLinksElementRenderer: React.FC<NavLinksElementRendererProps> = ({
element,
editorMode,
uiTheme = 'dark',
styleObj,
renderChildElement,
}) => {
const s = element.styles || {};

const childrenList: WebsiteElement[] =
element.children && element.children.length > 0
? element.children
: element.links && element.links.length > 0
? element.links.map((l, idx) => ({
id: l.id || `nav_link_${element.id}_${idx}`,
type: 'nav-link' as const,
label: l.label,
content: l.label,
href: l.href || '#',
target: (l.target as '_self' | '_blank') || '_self',
styles: {
typeface: s.typeface,
fontSize: s.fontSize || 14,
fontWeight: s.fontWeight || '600',
textColor: s.textColor,
},
}))
: (element.content || 'Home, About, Services, Contact')
.split(',')
.map((item, idx) => {
const trimmed = item.trim();
return {
id: `nav_link_${element.id}_${idx}`,
type: 'nav-link' as const,
label: trimmed,
content: trimmed,
href: `#${trimmed.toLowerCase().replace(/\s+/g, '-')}`,
target: '_self' as const,
styles: {
typeface: s.typeface,
fontSize: s.fontSize || 14,
fontWeight: s.fontWeight || '600',
textColor: s.textColor,
},
};
})
.filter((c) => c.content);

const gapVal = s.gap !== undefined ? s.gap : 24;

if (element.type === 'nav-links' || element.type === 'nav-container') {
return (
<nav
className="relative flex flex-wrap rounded-lg p-1 transition-all"
style={{
gap: `${gapVal}px`,
flexDirection: (s.flexDirection as any) || 'row',
justifyContent: s.justifyContent || 'flex-start',
alignItems: s.alignItems || 'center',
}}
aria-label={element.label || 'Navigation'}
>
{childrenList.map((child, idx) =>
renderChildElement ? (
renderChildElement(child, idx, childrenList.length)
) : (
<a
key={child.id || idx}
href={child.href || '#'}
target={child.target || '_self'}
onClick={(e) => editorMode === 'edit' && e.preventDefault()}
style={styleObj}
className="transition-colors hover:text-indigo-400 cursor-pointer text-xs sm:text-sm font-semibold inline-flex items-center gap-1"
>
{child.content || child.label}
</a>
)
)}
</nav>
);
}

const subItems =
element.submenu && element.submenu.length > 0
? element.submenu
: element.sublinks && element.sublinks.length > 0
? element.sublinks
: [];
const hasSubmenu = subItems.length > 0;
const isInMobileDrawer = Boolean((element as any).inMobileDrawer);

if (hasSubmenu && !isInMobileDrawer) {
return (
<div className="relative group/navdrop inline-flex items-center">
<a
href={element.href || '#'}
target={element.target || '_self'}
onClick={(e) => editorMode === 'edit' && e.preventDefault()}
style={styleObj}
className="transition-colors hover:text-indigo-400 cursor-pointer inline-flex items-center gap-1.5 font-semibold"
>
<span dangerouslySetInnerHTML={{ __html: element.content || element.label || 'Nav Link' }} />
<ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover/navdrop:rotate-180 transition-transform duration-200" />
</a>
<div className="absolute top-full left-0 pt-2 opacity-0 pointer-events-none group-hover/navdrop:opacity-100 group-hover/navdrop:pointer-events-auto transition-all duration-200 z-50 min-w-[200px]">
<div
className={`rounded-xl border shadow-xl p-1.5 backdrop-blur-xl ${
uiTheme === 'light'
? 'bg-white/95 border-slate-200 text-slate-800 ring-1 ring-slate-900/5'
: 'bg-slate-900/95 border-slate-700 text-slate-200 ring-1 ring-white/10'
}`}
>
{subItems.map((sub: any, sIdx: number) => (
<a
key={sub.id || sIdx}
href={sub.href || '#'}
target={sub.target || '_self'}
onClick={(e) => editorMode === 'edit' && e.preventDefault()}
className={`block px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
uiTheme === 'light'
? 'hover:bg-indigo-50 hover:text-indigo-600 text-slate-700'
: 'hover:bg-slate-800/80 hover:text-indigo-400 text-slate-300'
}`}
>
<div className="font-semibold">{sub.label || sub.title || `Sub-item ${sIdx + 1}`}</div>
{sub.description && <div className="text-[10px] opacity-70 mt-0.5">{sub.description}</div>}
</a>
))}
</div>
</div>
</div>
);
}

return (
<a
href={element.href || '#'}
target={element.target || '_self'}
onClick={(e) => editorMode === 'edit' && e.preventDefault()}
style={styleObj}
className="transition-colors hover:text-indigo-400 cursor-pointer inline-flex items-center"
dangerouslySetInnerHTML={{ __html: element.content || element.label || 'Nav Link' }}
/>
);
};
