import { Sparkles } from 'lucide-react';
import { HamburgerSettings, MobileMenuSettings } from '../../../types';
export function renderCloseIconContent(closeIconStyle?: string, size: number = 20, thickness: number = 2) {
const s = size;
const strokeW = typeof thickness === 'number' ? thickness : 2;
switch (closeIconStyle) {
case 'circle':
return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeW} strokeLinecap="round">
<circle cx="12" cy="12" r="9"/>
<line x1="9" y1="9" x2="15" y2="15"/>
<line x1="15" y1="9" x2="9" y2="15"/>
</svg>);
case 'minimal':
case 'thin':
return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={Math.max(1, strokeW * 0.7)} strokeLinecap="round">
<line x1="5" y1="5" x2="19" y2="19"/>
<line x1="19" y1="5" x2="5" y2="19"/>
</svg>);
case 'bold':
case 'thick':
return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={Math.max(3, strokeW * 1.5)} strokeLinecap="round">
<line x1="6" y1="6" x2="18" y2="18"/>
<line x1="18" y1="6" x2="6" y2="18"/>
</svg>);
case 'rounded':
return (<div className="rounded-full p-1 border border-current flex items-center justify-center">
<svg width={s * 0.75} height={s * 0.75} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeW} strokeLinecap="round">
<line x1="6" y1="6" x2="18" y2="18"/>
<line x1="18" y1="6" x2="6" y2="18"/>
</svg>
</div>);
case 'arrow':
return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
<line x1="19" y1="12" x2="5" y2="12"/>
<polyline points="12 19 5 12 12 5"/>
</svg>);
case 'chevron':
return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
<polyline points="15 18 9 12 15 6"/>
</svg>);
case 'sidebar':
return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
<rect width="18" height="18" x="3" y="3" rx="2"/>
<path d="M9 3v18"/>
</svg>);
case 'square':
return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeW} strokeLinecap="round">
<rect x="4" y="4" width="16" height="16" rx="3"/>
<line x1="9" y1="9" x2="15" y2="15"/>
<line x1="15" y1="9" x2="9" y2="15"/>
</svg>);
case 'standard':
default:
return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeW} strokeLinecap="round">
<line x1="6" y1="6" x2="18" y2="18"/>
<line x1="18" y1="6" x2="6" y2="18"/>
</svg>);
}
}
export function renderHamburgerIcon(iconStyle?: string, h: HamburgerSettings = {}) {
const size = h.iconSize || 20;
const strokeW = h.lineThickness !== undefined
? h.lineThickness
: h.iconThickness === 'thick'
? 3.5
: h.iconThickness === 'thin'
? 1.5
: 2;
const gap = h.lineGap !== undefined ? h.lineGap : 5;
const lineCap: 'round' | 'square' = h.lineCap === 'square' ? 'square' : 'round';
const g = Math.min(10, Math.max(2, gap));
const topY3 = Math.max(3, 12 - g);
const midY3 = 12;
const botY3 = Math.min(21, 12 + g);
const g2 = Math.max(3, Math.round(g * 0.85));
const topY2 = Math.max(4, 12 - g2);
const botY2 = Math.min(20, 12 + g2);
const styleId = iconStyle || h.iconStyle || 'three-equal';
switch (styleId) {
case 'three-asc-left':
return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeW} strokeLinecap={lineCap}>
<line x1="4" y1={topY3} x2="11" y2={topY3}/>
<line x1="4" y1={midY3} x2="16" y2={midY3}/>
<line x1="4" y1={botY3} x2="20" y2={botY3}/>
</svg>);
case 'three-asc-center':
return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeW} strokeLinecap={lineCap}>
<line x1="8.5" y1={topY3} x2="15.5" y2={topY3}/>
<line x1="6" y1={midY3} x2="18" y2={midY3}/>
<line x1="4" y1={botY3} x2="20" y2={botY3}/>
</svg>);
case 'three-asc-right':
return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeW} strokeLinecap={lineCap}>
<line x1="13" y1={topY3} x2="20" y2={topY3}/>
<line x1="8" y1={midY3} x2="20" y2={midY3}/>
<line x1="4" y1={botY3} x2="20" y2={botY3}/>
</svg>);
case 'three-desc-left':
case 'staggered':
case 'lines-left':
case 'left-aligned':
return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeW} strokeLinecap={lineCap}>
<line x1="4" y1={topY3} x2="20" y2={topY3}/>
<line x1="4" y1={midY3} x2="16" y2={midY3}/>
<line x1="4" y1={botY3} x2="11" y2={botY3}/>
</svg>);
case 'three-desc-center':
case 'staggered-center':
return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeW} strokeLinecap={lineCap}>
<line x1="4" y1={topY3} x2="20" y2={topY3}/>
<line x1="6" y1={midY3} x2="18" y2={midY3}/>
<line x1="8.5" y1={botY3} x2="15.5" y2={botY3}/>
</svg>);
case 'three-desc-right':
case 'lines-right':
case 'right-aligned':
return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeW} strokeLinecap={lineCap}>
<line x1="4" y1={topY3} x2="20" y2={topY3}/>
<line x1="8" y1={midY3} x2="20" y2={midY3}/>
<line x1="13" y1={botY3} x2="20" y2={botY3}/>
</svg>);
case 'two-equal':
case 'minimal':
case 'two-lines':
return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeW} strokeLinecap={lineCap}>
<line x1="4" y1={topY2} x2="20" y2={topY2}/>
<line x1="4" y1={botY2} x2="20" y2={botY2}/>
</svg>);
case 'two-asc-left':
return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeW} strokeLinecap={lineCap}>
<line x1="4" y1={topY2} x2="12" y2={topY2}/>
<line x1="4" y1={botY2} x2="20" y2={botY2}/>
</svg>);
case 'two-asc-center':
return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeW} strokeLinecap={lineCap}>
<line x1="7" y1={topY2} x2="17" y2={topY2}/>
<line x1="4" y1={botY2} x2="20" y2={botY2}/>
</svg>);
case 'two-asc-right':
return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeW} strokeLinecap={lineCap}>
<line x1="12" y1={topY2} x2="20" y2={topY2}/>
<line x1="4" y1={botY2} x2="20" y2={botY2}/>
</svg>);
case 'two-desc-left':
return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeW} strokeLinecap={lineCap}>
<line x1="4" y1={topY2} x2="20" y2={topY2}/>
<line x1="4" y1={botY2} x2="12" y2={botY2}/>
</svg>);
case 'two-desc-center':
return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeW} strokeLinecap={lineCap}>
<line x1="4" y1={topY2} x2="20" y2={topY2}/>
<line x1="7" y1={botY2} x2="17" y2={botY2}/>
</svg>);
case 'two-desc-right':
return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeW} strokeLinecap={lineCap}>
<line x1="4" y1={topY2} x2="20" y2={topY2}/>
<line x1="12" y1={botY2} x2="20" y2={botY2}/>
</svg>);
case 'dots':
case 'kebab': {
const dotR = Math.max(1.8, Math.min(3.2, strokeW * 0.9));
return (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
<circle cx="12" cy={topY3} r={dotR}/>
<circle cx="12" cy={midY3} r={dotR}/>
<circle cx="12" cy={botY3} r={dotR}/>
</svg>);
}
case 'grid': {
const gDotR = Math.max(1.4, Math.min(2.4, strokeW * 0.7));
return (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
<circle cx="6" cy="6" r={gDotR}/>
<circle cx="12" cy="6" r={gDotR}/>
<circle cx="18" cy="6" r={gDotR}/>
<circle cx="6" cy="12" r={gDotR}/>
<circle cx="12" cy="12" r={gDotR}/>
<circle cx="18" cy="12" r={gDotR}/>
<circle cx="6" cy="18" r={gDotR}/>
<circle cx="12" cy="18" r={gDotR}/>
<circle cx="18" cy="18" r={gDotR}/>
</svg>);
}
case 'sidebar':
return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeW} strokeLinecap={lineCap} strokeLinejoin="round">
<rect width="18" height="18" x="3" y="3" rx="2"/>
<path d="M9 3v18"/>
</svg>);
case 'plus':
return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeW} strokeLinecap={lineCap}>
<line x1="12" y1="5" x2="12" y2="19"/>
<line x1="5" y1="12" x2="19" y2="12"/>
</svg>);
case 'arrow':
return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeW} strokeLinecap={lineCap} strokeLinejoin="round">
<line x1="4" y1="12" x2="20" y2="12"/>
<polyline points="13 5 20 12 13 19"/>
</svg>);
case 'diamond':
return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeW} strokeLinecap={lineCap} strokeLinejoin="round">
<polygon points="12,3 21,12 12,21 3,12"/>
<line x1="8" y1="12" x2="16" y2="12"/>
</svg>);
case 'sparkle':
return <Sparkles style={{ width: `${size}px`, height: `${size}px`, strokeWidth: strokeW }}/>;
case 'three-equal':
case 'stacked-lines':
case 'bars':
case 'thick':
case 'standard':
default:
return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeW} strokeLinecap={lineCap}>
<line x1="4" y1={topY3} x2="20" y2={topY3}/>
<line x1="4" y1={midY3} x2="20" y2={midY3}/>
<line x1="4" y1={botY3} x2="20" y2={botY3}/>
</svg>);
}
}
export function renderCloseButtonElement(m: MobileMenuSettings, onClose: () => void, isLight: boolean) {
const closeSize = (m as any).closeButtonSize || (m as any).closeIconSize || 22;
const closeColor = (m as any).closeButtonColor || (m as any).closeIconColor || (isLight ? '#334155' : '#e2e8f0');
const thickness = (m as any).closeIconThickness || 2;
return (<button type="button" onClick={onClose} style={{ color: closeColor }} className={`p-2 rounded-xl transition-all cursor-pointer ${isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'}`} aria-label="Close mobile menu">
{renderCloseIconContent(m.closeIconStyle, closeSize, thickness)}
</button>);
}
