import React, { useState, useRef, useEffect } from 'react';
import { WebsiteElement, SelectedElementContext, EditorMode, ViewportMode } from '../types';
import { Sparkles, ArrowRight, Send, Play, Download, Check, ExternalLink, Mail, Phone, ShoppingCart, Star, Heart, Flame, Shield, Zap } from 'lucide-react';
import { CanvasImage } from './canvas/CanvasImage';
import { EditableTextElement } from './canvas/EditableTextElement';
import { formatMapEmbedUrl, formatVideoUrl, renderLucideIconByName } from './canvas/MediaHelpers';
import { ElementFormRenderer } from './canvas/ElementFormRenderer';
import { ElementAccordionRenderer, ElementTableRenderer } from './canvas/ElementAccordionRenderer';
import { computeElementStyles } from './canvas/elements/StyleComputationHelper';
import { ElementToolbar } from './canvas/elements/ElementToolbar';
import { ListElementRenderer } from './canvas/elements/ListElementRenderer';
import { NavLinksElementRenderer } from './canvas/elements/NavLinksElementRenderer';
import { MixedMediaElementRenderer } from './canvas/elements/MixedMediaElementRenderer';
import { ModalElementRenderer } from './canvas/elements/ModalElementRenderer';
import { MediaEmbedRenderer } from './canvas/elements/MediaEmbedRenderer';
import { FormFieldElementRenderer } from './canvas/elements/FormFieldElementRenderer';
import { GridElementRenderer } from './canvas/elements/GridElementRenderer';
import { InlineElementRenderer } from './canvas/elements/InlineElementRenderer';
import { CardElementRenderer } from './canvas/elements/CardElementRenderer';
import { IconElementRenderer } from './canvas/elements/IconElementRenderer';
export { formatMapEmbedUrl, formatVideoUrl, renderLucideIconByName };
interface CanvasElementProps {
element: WebsiteElement;
sectionId: string;
isSelected: boolean;
selectedElementId?: string | null;
selectedContext?: SelectedElementContext | null;
editorMode: EditorMode;
onSelect: (context: SelectedElementContext) => void;
onOpenEditBox?: (context: SelectedElementContext) => void;
onUpdate: (updatedElement: WebsiteElement) => void;
onMoveElement?: (sectionId: string, elementId: string, direction: 'up' | 'down') => void;
onDuplicateElement?: (sectionId: string, elementId: string) => void;
onDeleteElement?: (elementId: string) => void;
onAddElementToColumn?: (sectionId: string, parentId: string) => void;
uiTheme?: 'dark' | 'light';
viewportMode?: ViewportMode;
isRotated?: boolean;
hideToolbar?: boolean;
isHeaderOrFooter?: boolean;
canMoveUp?: boolean;
canMoveDown?: boolean;
}
export const CanvasElement: React.FC<CanvasElementProps> = ({ element, sectionId, isSelected, selectedElementId, selectedContext, editorMode, viewportMode, isRotated = false, onSelect, onOpenEditBox, onUpdate, onMoveElement, onDuplicateElement, onDeleteElement, onAddElementToColumn, uiTheme = 'dark', hideToolbar = false, isHeaderOrFooter = false, canMoveUp = false, canMoveDown = false, }) => {
const isToolbarDisabled = hideToolbar || isHeaderOrFooter || sectionId === 'header' || sectionId.includes('header');
const [isHovered, setIsHovered] = useState<boolean>(false);
const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
const [manipulationMode, setManipulationMode] = useState<'none' | 'resize' | 'crop'>('none');
const [isFlashing, setIsFlashing] = useState(false);
const prevElementRef = useRef(element);

useEffect(() => {
if (prevElementRef.current !== element) {
setIsFlashing(true);
const timer = setTimeout(() => setIsFlashing(false), 1000);
prevElementRef.current = element;
return () => clearTimeout(timer);
}
}, [element]);

const elementRef = useRef<HTMLDivElement>(null);
const isTextElement = element.type === 'heading' || element.type === 'text';
const isCanMoveUp = Boolean(onMoveElement && canMoveUp);
const isCanMoveDown = Boolean(onMoveElement && canMoveDown);
const handleMouseEnter = (e: React.MouseEvent) => {
if (editorMode !== 'edit')
return;
e.stopPropagation();
if (hoverTimeoutRef.current) {
clearTimeout(hoverTimeoutRef.current);
hoverTimeoutRef.current = null;
}
setIsHovered(true);
};
const handleMouseLeave = (e: React.MouseEvent) => {
if (editorMode !== 'edit')
return;
e.stopPropagation();
if (hoverTimeoutRef.current) {
clearTimeout(hoverTimeoutRef.current);
}
hoverTimeoutRef.current = setTimeout(() => {
setIsHovered(false);
}, 450);
};
useEffect(() => {
return () => {
if (hoverTimeoutRef.current)
clearTimeout(hoverTimeoutRef.current);
};
}, []);
const handleClick = (e: React.MouseEvent) => {
if (editorMode !== 'edit')
return;
e.stopPropagation();
if (elementRef.current) {
const rect = elementRef.current.getBoundingClientRect();
onSelect({
element,
sectionId,
rect: {
top: rect.top,
left: rect.left,
width: rect.width,
height: rect.height,
bottom: rect.bottom,
right: rect.right,
},
domElement: elementRef.current,
});
}
};
const handleContextMenu = (e: React.MouseEvent) => {
return;
};
const s = element.styles || {};
const isLight = uiTheme === 'light';
const { styleObj, shadowClass, hoverClass, maxWidthClass, marginAutoClass, buttonSizeClass, outlineClass, } = computeElementStyles(element, editorMode, isSelected, isHovered);
const renderButtonIcon = (iconName?: string, isLeft: boolean = false) => {
if (!iconName)
return null;
const spacingClass = isLeft ? 'mr-1.5 inline-block shrink-0' : 'ml-1.5 inline-block shrink-0';
const slideClass = s.hoverEffect === 'slide-icon' ? 'group-hover/btn:translate-x-1 transition-transform' : '';
const iconProps = { className: `w-4 h-4 ${spacingClass} ${slideClass}` };
switch (iconName) {
case 'Sparkles':
return <Sparkles {...iconProps}/>;
case 'ArrowRight':
return <ArrowRight {...iconProps}/>;
case 'Send':
return <Send {...iconProps}/>;
case 'Play':
return <Play {...iconProps}/>;
case 'Download':
return <Download {...iconProps}/>;
case 'Check':
return <Check {...iconProps}/>;
case 'ExternalLink':
return <ExternalLink {...iconProps}/>;
case 'Mail':
return <Mail {...iconProps}/>;
case 'Phone':
return <Phone {...iconProps}/>;
case 'ShoppingCart':
return <ShoppingCart {...iconProps}/>;
case 'Star':
return <Star {...iconProps}/>;
case 'Heart':
return <Heart {...iconProps}/>;
case 'Flame':
return <Flame {...iconProps}/>;
case 'Shield':
return <Shield {...iconProps}/>;
case 'Zap':
return <Zap {...iconProps}/>;
default:
return null;
}
};
const renderChildElement = (child: WebsiteElement, childIdx?: number, totalChildren?: number) => (<CanvasElement key={child.id} element={child} sectionId={sectionId} isSelected={selectedElementId === child.id} selectedElementId={selectedElementId} selectedContext={selectedContext} editorMode={editorMode} viewportMode={viewportMode} isRotated={isRotated} onSelect={onSelect} onOpenEditBox={onOpenEditBox} onUpdate={onUpdate} onMoveElement={onMoveElement} onDuplicateElement={onDuplicateElement} onDeleteElement={onDeleteElement} onAddElementToColumn={onAddElementToColumn} uiTheme={uiTheme} canMoveUp={childIdx !== undefined ? childIdx > 0 : false} canMoveDown={childIdx !== undefined && totalChildren !== undefined ? childIdx < totalChildren - 1 : false}/>);
const renderInlineChildrenWrapper = (baseNode: React.ReactNode) => {
if (element.children && element.children.length > 0) {
const floatedChildren = element.children.filter((c) => c.styles?.float === 'left' || c.styles?.float === 'right');
const regularChildren = element.children.filter((c) => c.styles?.float !== 'left' && c.styles?.float !== 'right');
return (<div style={{ display: 'contents' }}>
{floatedChildren.map((child, idx) => renderChildElement(child, idx, floatedChildren.length))}
{baseNode}
{regularChildren.map((child, idx) => renderChildElement(child, idx, regularChildren.length))}
</div>);
}
return baseNode;
};
const renderInnerContent = () => {
switch (element.type) {
case 'logo': {
const isImg = element.logoType === 'image';
if (isImg) {
return (<div className="flex items-center gap-2">
<img src={element.src || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'} alt={element.alt || 'Logo'} title={element.title || 'Brand Logo'} style={styleObj} className="h-10 w-auto object-contain transition-all"/>
</div>);
}
return (<span style={styleObj} title={element.title || 'Logo'} className="text-xl font-bold tracking-tight inline-block">
{element.content || 'BRAND'}
</span>);
}
case 'heading': {
const textAlignClass = s.textAlign === 'center'
? 'text-center'
: s.textAlign === 'right'
? 'text-right'
: s.textAlign === 'left'
? 'text-left'
: '';
return renderInlineChildrenWrapper(<EditableTextElement elementId={element.id} tag={element.tag || 'h2'} style={styleObj} isEditable={editorMode === 'edit'} content={element.content || ''} placeholder="Heading Text" onUpdateContent={(html) => {
onUpdate({ ...element, content: html });
}} className={`transition-all outline-none w-full break-words [overflow-wrap:anywhere] ${editorMode === 'edit' && isSelected ? 'ring-1 ring-indigo-400/40 rounded-sm' : ''} ${textAlignClass}`}/>);
}
case 'text': {
const isSpan = element.tag === 'span';
const textAlignClass = s.textAlign === 'center'
? 'text-center'
: s.textAlign === 'right'
? 'text-right'
: s.textAlign === 'left'
? 'text-left'
: '';
const widthClass = isSpan ? 'inline-block max-w-max' : 'w-full';
return renderInlineChildrenWrapper(<EditableTextElement elementId={element.id} tag={element.tag || 'p'} style={styleObj} isEditable={editorMode === 'edit'} content={element.content || ''} placeholder={isSpan ? 'Span text...' : 'Paragraph text...'} onUpdateContent={(html) => {
onUpdate({ ...element, content: html });
}} className={`transition-all outline-none ${widthClass} break-words [overflow-wrap:anywhere] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 ${editorMode === 'edit' && isSelected ? 'ring-1 ring-indigo-400/40 rounded-sm' : ''} ${textAlignClass}`}/>);
}
case 'badge': {
return (<span style={styleObj} className="inline-block transition-all outline-none" dangerouslySetInnerHTML={{ __html: element.content || 'Badge Text' }}/>);
}
case 'button': {
const dMode = element.buttonDisplayMode || 'icon-text';
const showIcon = dMode === 'icon' || dMode === 'icon-text';
const showText = dMode === 'text' || dMode === 'icon-text';
const isIconLeft = (element.buttonIconPosition || element.iconPosition) !== 'right';
const iconName = element.buttonIcon || element.icon || 'arrow-right';
return (<a href={element.href || '#'} target={element.target || '_self'} rel={element.target === '_blank' ? 'noopener noreferrer' : undefined} onClick={(e) => editorMode === 'edit' && e.preventDefault()} style={styleObj} className={`inline-flex items-center justify-center font-semibold transition-all cursor-pointer select-none ${buttonSizeClass} ${shadowClass} ${hoverClass}`}>
{showIcon && isIconLeft && renderButtonIcon(iconName, showText)}
{showText && (<span className="outline-none inline-block whitespace-nowrap" dangerouslySetInnerHTML={{ __html: element.content || 'Button' }}/>)}
{showIcon && !isIconLeft && renderButtonIcon(iconName, false)}
</a>);
}
case 'nav-container':
case 'nav-links':
case 'nav-link': {
return (<NavLinksElementRenderer element={element} editorMode={editorMode} uiTheme={uiTheme} styleObj={styleObj} renderChildElement={renderChildElement}/>);
}
case 'image': {
const imageMarkup = (<CanvasImage element={element} editorMode={editorMode} onUpdate={onUpdate} shadowClass={shadowClass} hoverClass={hoverClass} manipulationMode={manipulationMode} setManipulationMode={setManipulationMode}/>);
if (element.linkAction === 'url' && element.href) {
return renderInlineChildrenWrapper(<a href={element.href} target={element.target || '_self'} rel={element.target === '_blank' ? 'noopener noreferrer' : undefined} onClick={(e) => editorMode === 'edit' && e.preventDefault()} className="inline-block cursor-pointer max-w-full">
{imageMarkup}
</a>);
}
return renderInlineChildrenWrapper(imageMarkup);
}
case 'video':
case 'map': {
return (<MediaEmbedRenderer element={element} sectionId={sectionId} editorMode={editorMode} isLight={isLight} styleObj={styleObj} shadowClass={shadowClass} elementRef={elementRef} onOpenEditBox={onOpenEditBox}/>);
}
case 'list': {
return (<ListElementRenderer element={element} editorMode={editorMode} isSelected={isSelected} isLight={isLight} styleObj={styleObj} maxWidthClass={maxWidthClass} marginAutoClass={marginAutoClass} shadowClass={shadowClass} onUpdate={onUpdate}/>);
}
case 'accordion': {
return (<ElementAccordionRenderer element={element} sectionId={sectionId} editorMode={editorMode} isSelected={isSelected} selectedContext={selectedContext || null} onSelect={onSelect} onOpenEditBox={onOpenEditBox} onUpdate={onUpdate} isLight={isLight} maxWidthClass={maxWidthClass} marginAutoClass={marginAutoClass} shadowClass={shadowClass} styleObj={styleObj}/>);
}
case 'table': {
return (<ElementTableRenderer element={element} sectionId={sectionId} selectedElementId={selectedElementId} selectedContext={selectedContext || null} editorMode={editorMode} uiTheme={uiTheme} shadowClass={shadowClass} styleObj={styleObj} onSelect={onSelect} onOpenEditBox={onOpenEditBox} onUpdate={onUpdate}/>);
}
case 'divider': {
const dStyle = (element as any).dividerStyle || 'solid';
const dColor = s.borderColor || (isLight ? '#cbd5e1' : '#334155');
const dThickness = s.borderWidth !== undefined ? s.borderWidth : 1;
return (<div style={styleObj} className="w-full flex items-center justify-center py-2">
<div style={{
width: '100%',
borderTopWidth: `${dThickness}px`,
borderTopStyle: dStyle === 'gradient' ? 'solid' : dStyle,
borderTopColor: dStyle === 'gradient' ? 'transparent' : dColor,
backgroundImage: dStyle === 'gradient'
? `linear-gradient(to right, transparent, ${dColor}, transparent)`
: undefined,
}}/>
</div>);
}
case 'grid': {
return (<GridElementRenderer element={element} sectionId={sectionId} selectedElementId={selectedElementId} selectedContext={selectedContext} editorMode={editorMode} viewportMode={viewportMode} isRotated={isRotated} isSelected={isSelected} isHovered={isHovered} uiTheme={uiTheme} styleObj={styleObj} elementRef={elementRef} onSelect={onSelect} onOpenEditBox={onOpenEditBox} onUpdate={onUpdate} onMoveElement={onMoveElement} onDuplicateElement={onDuplicateElement} onDeleteElement={onDeleteElement} onAddElementToColumn={onAddElementToColumn} renderChildElement={renderChildElement}/>);
}
case 'inline': {
return (<InlineElementRenderer element={element} sectionId={sectionId} selectedElementId={selectedElementId} selectedContext={selectedContext} editorMode={editorMode} uiTheme={uiTheme} styleObj={styleObj} hoverClass={hoverClass} elementRef={elementRef} onSelect={onSelect} onOpenEditBox={onOpenEditBox} onUpdate={onUpdate} onMoveElement={onMoveElement} onDuplicateElement={onDuplicateElement} onDeleteElement={onDeleteElement} onAddElementToColumn={onAddElementToColumn} renderChildElement={renderChildElement}/>);
}
case 'card': {
return (<CardElementRenderer element={element} sectionId={sectionId} editorMode={editorMode} isLight={isLight} styleObj={styleObj} shadowClass={shadowClass} hoverClass={hoverClass} onAddElementToColumn={onAddElementToColumn} renderChildElement={renderChildElement}/>);
}
case 'icon': {
return renderInlineChildrenWrapper(<IconElementRenderer element={element} editorMode={editorMode} isLight={isLight} styleObj={styleObj} shadowClass={shadowClass} hoverClass={hoverClass}/>);
}
case 'mixed-media': {
return (<MixedMediaElementRenderer element={element} editorMode={editorMode} isLight={isLight} styleObj={styleObj} shadowClass={shadowClass} hoverClass={hoverClass} onUpdate={onUpdate}/>);
}
case 'modal': {
return (<ModalElementRenderer element={element} sectionId={sectionId} editorMode={editorMode} isLight={isLight} styleObj={styleObj} onOpenEditBox={onOpenEditBox} onAddElementToColumn={onAddElementToColumn}/>);
}
case 'form': {
return (<ElementFormRenderer element={element} sectionId={sectionId} editorMode={editorMode} isSelected={isSelected} selectedContext={selectedContext || null} selectedFormFieldId={null} setSelectedFormFieldId={() => { }} onSelect={onSelect} onOpenEditBox={onOpenEditBox} onUpdate={onUpdate} isLight={isLight} shadowClass={shadowClass} hoverClass={hoverClass} styleObj={styleObj} renderChildElement={renderChildElement} onAddElementToColumn={onAddElementToColumn}/>);
}
case 'form-input-text':
case 'form-textarea':
case 'form-input-email':
case 'form-input-password':
case 'form-input-number':
case 'form-select':
case 'form-checkbox':
case 'form-radio':
case 'form-date':
case 'form-file':
case 'form-submit': {
return (<FormFieldElementRenderer element={element} editorMode={editorMode} isLight={isLight}/>);
}
default:
return (<div style={styleObj} dangerouslySetInnerHTML={{ __html: element.content || '' }}/>);
}
};
const isToolbarActive = isSelected || isHovered;
const isSpan = element.tag === 'span';
const isBlock = element.type === 'heading' || (element.type === 'text' && !isSpan) || element.type === 'grid' || element.type === 'card' || element.type === 'container' || element.type === 'form' || element.type === 'mixed-media' || element.type === 'modal';
const elementWidthClass = !s.width && isBlock ? 'w-full' : (isSpan ? 'inline-block max-w-max' : '');
const wrapperStyle: React.CSSProperties = {
width: styleObj.width,
maxWidth: styleObj.maxWidth,
};
return (<div ref={elementRef} style={wrapperStyle} onClick={handleClick} onContextMenu={handleContextMenu} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={`relative transition-all duration-150 ${elementWidthClass} ${outlineClass} ${maxWidthClass} ${marginAutoClass} ${isToolbarActive ? 'z-50' : 'z-0'} ${isFlashing ? 'animate-flash' : ''}`}>
{editorMode === 'edit' && !isToolbarDisabled && (<ElementToolbar element={element} sectionId={sectionId} isToolbarActive={isToolbarActive} isToolbarDisabled={isToolbarDisabled} uiTheme={uiTheme} elementRef={elementRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onOpenEditBox={onOpenEditBox} onUpdate={onUpdate} onMoveElement={onMoveElement} onDuplicateElement={onDuplicateElement} onDeleteElement={onDeleteElement} onAddElementToColumn={onAddElementToColumn} setManipulationMode={setManipulationMode}/>)}

{renderInnerContent()}
</div>);
};
