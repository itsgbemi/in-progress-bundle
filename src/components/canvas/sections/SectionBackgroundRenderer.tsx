import React from 'react';
import { WebsiteSection } from '../../../types';
import { formatVideoUrl } from '../MediaHelpers';

interface SectionBackgroundRendererProps {
section: WebsiteSection;
slideshowIndex: number;
}

export const SectionBackgroundRenderer: React.FC<SectionBackgroundRendererProps> = ({
section,
slideshowIndex,
}) => {
const s: any = { ...(section.style || {}), ...(section.styles || {}) };
const bgType = s.backgroundType || (s.backgroundImage ? 'image' : s.backgroundGradient ? 'gradient' : undefined);

if (bgType === 'video' && s.backgroundVideoUrl) {
const { isEmbed, embedUrl } = formatVideoUrl(s.backgroundVideoUrl);

return (
<div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
{isEmbed ? (
<iframe
src={embedUrl}
title="Background Video"
className="w-full h-full object-cover scale-150 pointer-events-none opacity-40"
allow="autoplay; fullscreen"
/>
) : (
<video
src={embedUrl}
autoPlay
loop
muted
playsInline
className="w-full h-full object-cover opacity-40 pointer-events-none"
/>
)}
<div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" />
</div>
);
}

if (bgType === 'slideshow' && s.slideshowImages && s.slideshowImages.length > 0) {
const currentSlideImg = s.slideshowImages[slideshowIndex % s.slideshowImages.length];

return (
<div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
<div
key={`slide-${slideshowIndex}`}
style={{
backgroundImage: `url('${currentSlideImg}')`,
backgroundSize: 'cover',
backgroundPosition: 'center',
}}
className="absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out scale-105 animate-pulse"
/>
<div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs" />
</div>
);
}

if (s.backgroundPattern && s.backgroundPattern !== 'none') {
return (
<div
className={`absolute inset-0 z-0 pointer-events-none opacity-20 ${
s.backgroundPattern === 'dots'
? 'bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]'
: s.backgroundPattern === 'grid'
? 'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]'
: ''
}`}
/>
);
}

return null;
};
