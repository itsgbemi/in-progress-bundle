import React from 'react';
import { WebsiteElement, EditorMode, SelectedElementContext } from '../../../types';
import { Play, MapPin } from 'lucide-react';
import { formatMapEmbedUrl, formatVideoUrl } from '../MediaHelpers';

interface MediaEmbedRendererProps {
element: WebsiteElement;
sectionId: string;
editorMode: EditorMode;
isLight: boolean;
styleObj: React.CSSProperties;
shadowClass: string;
elementRef: React.RefObject<HTMLDivElement>;
onOpenEditBox?: (context: SelectedElementContext) => void;
}

export const MediaEmbedRenderer: React.FC<MediaEmbedRendererProps> = ({
element,
sectionId,
editorMode,
isLight,
styleObj,
shadowClass,
elementRef,
onOpenEditBox,
}) => {
const s = element.styles || {};

if (element.type === 'video') {
const videoUrl = element.videoUrl || element.src || '';
const embedInfo = formatVideoUrl(videoUrl);

return (
<div
style={styleObj}
className={`w-full relative overflow-hidden rounded-2xl border transition-all ${shadowClass} ${
!styleObj.borderColor ? (isLight ? 'border-slate-300' : 'border-slate-800') : ''
}`}
>
{embedInfo.isEmbed && embedInfo.embedUrl ? (
<div className="relative w-full aspect-video">
<iframe
src={embedInfo.embedUrl}
title={element.alt || 'Video player'}
className="absolute inset-0 w-full h-full rounded-2xl"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
allowFullScreen
/>
</div>
) : videoUrl ? (
<video
src={videoUrl}
controls={element.videoControls !== false}
autoPlay={element.videoAutoplay}
loop={element.videoLoop}
muted={element.videoMuted}
poster={element.videoPoster}
className="w-full h-auto rounded-2xl object-cover"
/>
) : (
<div className={`w-full aspect-video flex flex-col items-center justify-center gap-3 p-6 text-center ${
isLight ? 'bg-slate-100 text-slate-500' : 'bg-slate-900/60 text-slate-400'
}`}>
<div className="p-4 rounded-full bg-indigo-500/10 text-indigo-400">
<Play className="w-8 h-8 fill-current" />
</div>
<div>
<p className="text-sm font-semibold">Video Placeholder</p>
<p className="text-xs opacity-70">Add a YouTube, Vimeo, or direct MP4 URL in Settings</p>
</div>
</div>
)}
</div>
);
}

if (element.type === 'map') {
const embedSrc = formatMapEmbedUrl(element.mapEmbedCode, element.mapLocation);
const mapHeight = s.height ? (typeof s.height === 'number' ? `${s.height}px` : s.height) : '380px';
const hasCustomEmbed = Boolean(element.mapEmbedCode || element.mapLocation);

return (
<div
style={styleObj}
className={`w-full relative overflow-hidden rounded-2xl border transition-all ${shadowClass} ${
!styleObj.borderColor ? (isLight ? 'border-slate-300' : 'border-slate-800') : ''
}`}
>
<iframe
src={embedSrc}
title={element.mapLocation || 'Google Maps Location'}
width="100%"
height={mapHeight}
style={{
border: 0,
minHeight: '260px',
display: 'block',
}}
loading="lazy"
referrerPolicy="no-referrer-when-downgrade"
className="w-full rounded-2xl"
/>

{editorMode === 'edit' && !hasCustomEmbed && (
<div
onClick={(e) => {
e.stopPropagation();
if (elementRef.current) {
const rect = elementRef.current.getBoundingClientRect();
onOpenEditBox?.({
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
}}
className="absolute top-3 right-3 bg-slate-900/90 hover:bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700 shadow-lg backdrop-blur-md flex items-center gap-1.5 cursor-pointer transition-all"
>
<MapPin className="w-3.5 h-3.5 text-indigo-400" />
<span>Customize Map Location</span>
</div>
)}
</div>
);
}

return null;
};
