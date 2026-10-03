import React from 'react';
import * as LucideIcons from 'lucide-react';

export const formatMapEmbedUrl = (raw?: string, locationFallback?: string): string => {
const input = (raw || '').trim();
if (!input) {
const query = encodeURIComponent(locationFallback || 'New York, NY');
return `https://maps.google.com/maps?q=${query}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
}
const iframeSrcMatch = input.match(/src=["']([^"']+)["']/i);
if (iframeSrcMatch && iframeSrcMatch[1]) {
return iframeSrcMatch[1];
}
if (input.startsWith('http://') || input.startsWith('https://')) {
return input;
}
const query = encodeURIComponent(input);
return `https://maps.google.com/maps?q=${query}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
};

export const renderLucideIconByName = (name?: string, className: string = 'w-6 h-6'): React.ReactNode => {
if (!name) return null;
const IconComponent = (LucideIcons as any)[name] || (LucideIcons as any).Sparkles;
if (!IconComponent) return null;
return React.createElement(IconComponent, { className });
};

export const formatVideoUrl = (rawUrl?: string): { isEmbed: boolean; embedUrl: string; isDirectVideo: boolean } => {
if (!rawUrl) return { isEmbed: false, embedUrl: '', isDirectVideo: false };
const trimmed = rawUrl.trim();
if (!trimmed) return { isEmbed: false, embedUrl: '', isDirectVideo: false };

const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
if (ytMatch && ytMatch[1]) {
return { isEmbed: true, embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`, isDirectVideo: false };
}

const vimeoMatch = trimmed.match(/(?:vimeo\.com\/)(\d+)/i);
if (vimeoMatch && vimeoMatch[1]) {
return { isEmbed: true, embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`, isDirectVideo: false };
}

const isDirect =
trimmed.endsWith('.mp4') ||
trimmed.endsWith('.webm') ||
trimmed.endsWith('.ogg') ||
trimmed.includes('blob:') ||
trimmed.startsWith('data:video');

return {
isEmbed: !isDirect,
embedUrl: trimmed,
isDirectVideo: isDirect,
};
};
