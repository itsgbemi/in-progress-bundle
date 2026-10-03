import { PresetImageSample, PresetLogoSample } from '../types';
import { ALL_FONTS, TYPEFACE_OPTIONS, INTERFACE_FONTS } from './fonts';
export { ALL_FONTS, TYPEFACE_OPTIONS, INTERFACE_FONTS };
export type { FontItem, TypefaceItem, InterfaceFontOption } from './fonts';
export const PRESET_LOGOS: PresetLogoSample[] = [
{
name: 'Aura Minimal',
url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
},
{
name: 'Nexus Tech',
url: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=200&q=80',
},
{
name: 'Vortex Studio',
url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=200&q=80',
},
{
name: 'Lumina Globe',
url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=200&q=80',
},
{
name: 'Zenith Mark',
url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=200&q=80',
},
];
export const PRESET_IMAGES: PresetImageSample[] = [
{
name: 'Abstract Gradient Wave',
url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
category: 'Abstract',
},
{
name: 'Modern Workspace Laptop',
url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
category: 'Tech',
},
{
name: 'Creative Studio Office',
url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
category: 'Architecture',
},
{
name: 'Neon Cyber City',
url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
category: 'Urban',
},
{
name: 'Serene Mountain Fog',
url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
category: 'Nature',
},
{
name: 'Product Showcase Glass',
url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
category: 'Product',
},
];
export const PRESET_GRADIENTS = [
{
name: 'Warm Sunlight',
gradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)',
from: '#fffbeb',
to: '#fde68a',
},
{
name: 'Sunset Radiant',
gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
from: '#f43f5e',
to: '#fb923c',
},
{
name: 'Emerald Forest',
gradient: 'linear-gradient(135deg, #065f46 0%, #0d9488 50%, #10b981 100%)',
from: '#065f46',
to: '#10b981',
},
{
name: 'Deep Ocean',
gradient: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #38bdf8 100%)',
from: '#0c4a6e',
to: '#38bdf8',
},
{
name: 'Indigo Cyan',
gradient: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
from: '#4f46e5',
to: '#06b6d4',
},
{
name: 'Royal Amethyst',
gradient: 'linear-gradient(135deg, #581c87 0%, #9333ea 50%, #c084fc 100%)',
from: '#581c87',
to: '#c084fc',
},
{
name: 'Twilight Horizon',
gradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
from: '#0f172a',
to: '#312e81',
},
{
name: 'Midnight Nebula',
gradient: 'linear-gradient(135deg, #020617 0%, #1e293b 50%, #0f172a 100%)',
from: '#020617',
to: '#0f172a',
},
{
name: 'Frosted Minimal',
gradient: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
from: '#f8fafc',
to: '#e2e8f0',
},
];
export const PRESET_COLORS = [

'#ffffff',
'#f8fafc',
'#e2e8f0',
'#94a3b8',
'#64748b',
'#334155',
'#1e293b',
'#0f172a',
'#000000',

'#dc2626',
'#ef4444',
'#be123c',
'#f43f5e',
'#ea580c',
'#f97316',
'#d97706',
'#f59e0b',
'#ca8a04',
'#eab308',
'#65a30d',
'#84cc16',
'#16a34a',
'#22c55e',
'#059669',
'#10b981',
'#0d9488',
'#14b8a6',
'#0891b2',
'#06b6d4',
'#0284c7',
'#0ea5e9',
'#2563eb',
'#3b82f6',
'#4338ca',
'#4f46e5',
'#6366f1',
'#7c3aed',
'#8b5cf6',
'#9333ea',
'#a855f7',
'#c026d3',
'#d946ef',
'#db2777',
'#ec4899',
];
export const PRESET_VIDEOS = [
{
name: 'Tech Innovation Promo (YouTube)',
url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
type: 'youtube',
category: 'Showcase',
},
{
name: 'Scenic Nature Drone (Direct MP4)',
url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
poster: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
type: 'mp4',
category: 'Nature',
},
{
name: 'Abstract Fluid Motion (Direct MP4)',
url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
type: 'mp4',
category: 'Abstract',
},
{
name: 'Minimalist Architecture (Vimeo)',
url: 'https://player.vimeo.com/video/76979871',
type: 'vimeo',
category: 'Architecture',
},
];

export default {
PRESET_LOGOS,
PRESET_IMAGES,
PRESET_GRADIENTS,
PRESET_COLORS,
PRESET_VIDEOS,
ALL_FONTS,
TYPEFACE_OPTIONS,
INTERFACE_FONTS,
};
