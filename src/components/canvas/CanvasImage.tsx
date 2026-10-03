import React from 'react';
import { WebsiteElement, EditorMode } from '../../types';

interface CanvasImageProps {
element: WebsiteElement;
editorMode: EditorMode;
onUpdate: (updatedElement: WebsiteElement) => void;
shadowClass: string;
hoverClass: string;
manipulationMode: 'none' | 'resize' | 'crop';
setManipulationMode: (mode: 'none' | 'resize' | 'crop') => void;
}

export const CanvasImage: React.FC<CanvasImageProps> = ({ element, editorMode, onUpdate, shadowClass, hoverClass, manipulationMode, setManipulationMode }) => {
const s = element.styles || {};

const rotation = s.rotation || 0;
const flipH = s.flipHorizontal ? -1 : 1;
const flipV = s.flipVertical ? -1 : 1;
const cropZoom = s.cropZoom || 100;
const cropPanX = s.cropPanX || 0;
const cropPanY = s.cropPanY || 0;
const objectPosition = s.objectPosition || 'center center';

const transformParts = [
rotation !== 0 ? `rotate(${rotation}deg)` : '',
flipH !== 1 ? `scaleX(${flipH})` : '',
flipV !== 1 ? `scaleY(${flipV})` : '',
(cropZoom !== 100 || cropPanX !== 0 || cropPanY !== 0) ? `scale(${cropZoom / 100}) translate(${cropPanX}px, ${cropPanY}px)` : '',
].filter(Boolean).join(' ');

const widthVal = s.width ? (typeof s.width === 'number' ? `${s.width}px` : s.width) : '100%';
const heightVal = s.height ? (typeof s.height === 'number' ? `${s.height}px` : s.height) : undefined;

let computedMaxHeight: string | undefined = undefined;
let computedHeight: string | undefined = undefined;

if (heightVal && heightVal !== 'auto') {
if (typeof heightVal === 'string' && heightVal.endsWith('%')) {
const pct = parseFloat(heightVal);
computedMaxHeight = `${pct * 6}px`;
computedHeight = heightVal;
} else {
computedHeight = heightVal;
computedMaxHeight = heightVal;
}
}

const containerStyle: React.CSSProperties = {
width: widthVal,
height: heightVal && heightVal !== 'auto' ? heightVal : undefined,
maxWidth: '100%',
display: s.float && s.float !== 'none' ? 'block' : 'inline-block',
float: (s.float && s.float !== 'none' ? s.float : undefined) as any,
shapeOutside: s.shapeOutside && s.shapeOutside !== 'none' ? s.shapeOutside : undefined,
};

const imgStyle: React.CSSProperties = {
objectPosition,
transform: transformParts || undefined,
transformOrigin: 'center center',
transition: 'transform 0.15s ease-out, width 0.15s ease-out, height 0.15s ease-out',
objectFit: (s.objectFit || 'cover') as any,
width: '100%',
height: computedHeight || 'auto',
maxHeight: computedMaxHeight,
aspectRatio: s.aspectRatio && s.aspectRatio !== 'auto' ? s.aspectRatio : undefined,
};

const handleMouseDown = (e: React.MouseEvent, handle: string) => {
e.stopPropagation();
const startX = e.clientX;
const startY = e.clientY;
const startWidth = parseFloat(String(s.width || 100));
const startHeight = parseFloat(String(s.height || 100));

const onMouseMove = (moveEvent: MouseEvent) => {
const deltaX = moveEvent.clientX - startX;
const deltaY = moveEvent.clientY - startY;

let newWidth = startWidth;
let newHeight = startHeight;

if (handle.includes('right')) newWidth = Math.max(10, startWidth + (deltaX / 5));
if (handle.includes('bottom')) newHeight = Math.max(10, startHeight + (deltaY / 5));

onUpdate({
...element,
styles: { ...s, width: `${Math.round(newWidth)}%`, height: `${Math.round(newHeight)}%` },
});
};

const onMouseUp = () => {
document.removeEventListener('mousemove', onMouseMove);
document.removeEventListener('mouseup', onMouseUp);
};

document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mouseup', onMouseUp);
};

const renderHandles = () => {
if (manipulationMode === 'none') return null;
return (
<div className={`absolute inset-0 border-2 ${manipulationMode === 'crop' ? 'border-amber-500' : 'border-indigo-500'} pointer-events-none`}>
<div className={`absolute -top-2 -left-2 w-4 h-4 ${manipulationMode === 'crop' ? 'bg-amber-500' : 'bg-indigo-500'} rounded-full pointer-events-auto`} onMouseDown={(e) => handleMouseDown(e, 'top-left')} />
<div className={`absolute -bottom-2 -right-2 w-4 h-4 ${manipulationMode === 'crop' ? 'bg-amber-500' : 'bg-indigo-500'} rounded-full pointer-events-auto`} onMouseDown={(e) => handleMouseDown(e, 'bottom-right')} />
<div className={`absolute -top-2 -right-2 w-4 h-4 ${manipulationMode === 'crop' ? 'bg-amber-500' : 'bg-indigo-500'} rounded-full pointer-events-auto`} onMouseDown={(e) => handleMouseDown(e, 'top-right')} />
<div className={`absolute -bottom-2 -left-2 w-4 h-4 ${manipulationMode === 'crop' ? 'bg-amber-500' : 'bg-indigo-500'} rounded-full pointer-events-auto`} onMouseDown={(e) => handleMouseDown(e, 'bottom-left')} />
</div>
);
};

return (
<div className="relative inline-block max-w-full" style={containerStyle}>
<img
src={element.src || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'}
alt={element.alt || 'Image'}
style={imgStyle}
className={`max-w-full transition-all ${shadowClass} ${hoverClass}`}
/>
{renderHandles()}
</div>
);
};
