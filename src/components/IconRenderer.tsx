import React from 'react';
import * as LucideIcons from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
faStar,
faHeart,
faBolt,
faShieldHalved,
faFire,
faEnvelope,
faPhone,
faCartShopping,
faLocationDot,
faPaperPlane,
faCheck,
faArrowRight,
faPlay,
faDownload,
faUpload,
faCalendarDays,
faFileLines,
faGlobe,
faHashtag,
faSliders,
faAward,
faCompass,
faLayerGroup,
faTableCells,
faMicrochip,
faArrowTrendUp,
faRocket,
faHeartPulse,
faFeatherPointed,
faBell,
faTag,
faBookmark,
faCommentDots,
faMagnifyingGlass,
faCamera,
faVideo,
faMusic,
faCode,
faTerminal,
faMugHot,
faClock,
faEye,
faLock,
faKey,
faGift,
faFaceSmile,
faSun,
faMoon,
faUser,
faGear,
faGem,
faThumbsUp,
faWandMagicSparkles,
faCircleCheck,
faCrown,
faBullhorn,
faPaperclip,
faFolder,
faLaptop,
faMobileScreen,
faPalette,
faShareNodes,
faLightbulb,
} from '@fortawesome/free-solid-svg-icons';
import {
faGithub,
faTwitter,
faXTwitter,
faFacebook,
faInstagram,
faLinkedin,
faYoutube,
faGoogle,
faDiscord,
faTiktok,
faSpotify,
faApple,
} from '@fortawesome/free-brands-svg-icons';

export interface IconDefinitionItem {
id: string;
name: string;
category:
| 'Popular'
| 'Unicode & Symbols'
| 'Emojis'
| 'Action & Arrows'
| 'Social & Brands'
| 'Tech & Media'
| 'Commerce & Business'
| 'Objects & UI';
library: 'lucide' | 'fontawesome' | 'unicode' | 'emoji';
keywords?: string[];
char?: string;
}

export const FA_ICON_MAP: Record<string, any> = {
'fa-wand-magic-sparkles': faWandMagicSparkles,
'fa-star': faStar,
'fa-heart': faHeart,
'fa-bolt': faBolt,
'fa-shield': faShieldHalved,
'fa-fire': faFire,
'fa-envelope': faEnvelope,
'fa-phone': faPhone,
'fa-cart-shopping': faCartShopping,
'fa-location-dot': faLocationDot,
'fa-paper-plane': faPaperPlane,
'fa-check': faCheck,
'fa-arrow-right': faArrowRight,
'fa-play': faPlay,
'fa-download': faDownload,
'fa-upload': faUpload,
'fa-calendar': faCalendarDays,
'fa-file-lines': faFileLines,
'fa-globe': faGlobe,
'fa-hashtag': faHashtag,
'fa-sliders': faSliders,
'fa-award': faAward,
'fa-compass': faCompass,
'fa-layer-group': faLayerGroup,
'fa-table-cells': faTableCells,
'fa-microchip': faMicrochip,
'fa-arrow-trend-up': faArrowTrendUp,
'fa-rocket': faRocket,
'fa-heart-pulse': faHeartPulse,
'fa-feather': faFeatherPointed,
'fa-bell': faBell,
'fa-tag': faTag,
'fa-bookmark': faBookmark,
'fa-comment-dots': faCommentDots,
'fa-magnifying-glass': faMagnifyingGlass,
'fa-camera': faCamera,
'fa-video': faVideo,
'fa-music': faMusic,
'fa-code': faCode,
'fa-terminal': faTerminal,
'fa-mug-hot': faMugHot,
'fa-clock': faClock,
'fa-eye': faEye,
'fa-lock': faLock,
'fa-key': faKey,
'fa-gift': faGift,
'fa-face-smile': faFaceSmile,
'fa-sun': faSun,
'fa-moon': faMoon,
'fa-user': faUser,
'fa-gear': faGear,
'fa-gem': faGem,
'fa-thumbs-up': faThumbsUp,
'fa-circle-check': faCircleCheck,
'fa-crown': faCrown,
'fa-bullhorn': faBullhorn,
'fa-paperclip': faPaperclip,
'fa-folder': faFolder,
'fa-laptop': faLaptop,
'fa-mobile': faMobileScreen,
'fa-palette': faPalette,
'fa-share-nodes': faShareNodes,
'fa-lightbulb': faLightbulb,
'fa-github': faGithub,
'fa-twitter': faTwitter,
'fa-x-twitter': faXTwitter,
'fa-facebook': faFacebook,
'fa-instagram': faInstagram,
'fa-linkedin': faLinkedin,
'fa-youtube': faYoutube,
'fa-google': faGoogle,
'fa-discord': faDiscord,
'fa-tiktok': faTiktok,
'fa-spotify': faSpotify,
'fa-apple': faApple,
};

export const UNICODE_SYMBOL_ITEMS: IconDefinitionItem[] = [
{ id: 'unicode:★', name: 'Black Star', char: '★', category: 'Unicode & Symbols', library: 'unicode', keywords: ['star', 'solid', 'rating', 'favorite'] },
{ id: 'unicode:☆', name: 'White Star', char: '☆', category: 'Unicode & Symbols', library: 'unicode', keywords: ['star', 'outline', 'rating'] },
{ id: 'unicode:✦', name: 'Four Point Star', char: '✦', category: 'Unicode & Symbols', library: 'unicode', keywords: ['sparkle', 'diamond', 'star', 'shine'] },
{ id: 'unicode:✧', name: 'White Four Point Star', char: '✧', category: 'Unicode & Symbols', library: 'unicode', keywords: ['sparkle', 'outline', 'star'] },
{ id: 'unicode:✪', name: 'Circled White Star', char: '✪', category: 'Unicode & Symbols', library: 'unicode', keywords: ['badge', 'award', 'star', 'emblem'] },
{ id: 'unicode:✫', name: 'Open Centre Star', char: '✫', category: 'Unicode & Symbols', library: 'unicode', keywords: ['star', 'decoration'] },
{ id: 'unicode:✬', name: 'Black Centre Star', char: '✬', category: 'Unicode & Symbols', library: 'unicode', keywords: ['star', 'accent'] },
{ id: 'unicode:✭', name: 'Heavy Star', char: '✭', category: 'Unicode & Symbols', library: 'unicode', keywords: ['star', 'bold'] },
{ id: 'unicode:✮', name: 'Heavy Outline Star', char: '✮', category: 'Unicode & Symbols', library: 'unicode', keywords: ['star', 'badge'] },
{ id: 'unicode:✯', name: 'Pinwheel Star', char: '✯', category: 'Unicode & Symbols', library: 'unicode', keywords: ['star', 'award'] },
{ id: 'unicode:✰', name: 'Shadowed White Star', char: '✰', category: 'Unicode & Symbols', library: 'unicode', keywords: ['star', 'favorite'] },
{ id: 'unicode:✴', name: 'Eight Pointed Star', char: '✴', category: 'Unicode & Symbols', library: 'unicode', keywords: ['star', 'burst', 'sun'] },
{ id: 'unicode:✵', name: 'Eight Pointed Pinwheel', char: '✵', category: 'Unicode & Symbols', library: 'unicode', keywords: ['sparkle', 'burst'] },
{ id: 'unicode:✶', name: 'Six Pointed Star', char: '✶', category: 'Unicode & Symbols', library: 'unicode', keywords: ['star', 'classic'] },
{ id: 'unicode:✹', name: 'Twelve Pointed Star', char: '✹', category: 'Unicode & Symbols', library: 'unicode', keywords: ['sunburst', 'seal'] },
{ id: 'unicode:✺', name: 'Sixteen Pointed Star', char: '✺', category: 'Unicode & Symbols', library: 'unicode', keywords: ['burst', 'seal', 'stamp'] },
{ id: 'unicode:❂', name: 'Circled Open Star', char: '❂', category: 'Unicode & Symbols', library: 'unicode', keywords: ['badge', 'seal'] },

{ id: 'unicode:✔', name: 'Heavy Check Mark', char: '✔', category: 'Unicode & Symbols', library: 'unicode', keywords: ['check', 'tick', 'done', 'yes', 'verified'] },
{ id: 'unicode:✓', name: 'Check Mark', char: '✓', category: 'Unicode & Symbols', library: 'unicode', keywords: ['check', 'tick', 'success'] },
{ id: 'unicode:✕', name: 'Multiplication X', char: '✕', category: 'Unicode & Symbols', library: 'unicode', keywords: ['cross', 'x', 'close', 'delete', 'no'] },
{ id: 'unicode:✖', name: 'Heavy Multiplication X', char: '✖', category: 'Unicode & Symbols', library: 'unicode', keywords: ['x', 'close', 'cancel'] },
{ id: 'unicode:✗', name: 'Ballot X', char: '✗', category: 'Unicode & Symbols', library: 'unicode', keywords: ['no', 'false', 'cross'] },
{ id: 'unicode:✘', name: 'Heavy Ballot X', char: '✘', category: 'Unicode & Symbols', library: 'unicode', keywords: ['no', 'reject', 'cross'] },
{ id: 'unicode:✚', name: 'Heavy Plus Sign', char: '✚', category: 'Unicode & Symbols', library: 'unicode', keywords: ['plus', 'add', 'medical', 'cross'] },
{ id: 'unicode:✛', name: 'Open Centre Cross', char: '✛', category: 'Unicode & Symbols', library: 'unicode', keywords: ['cross', 'plus'] },
{ id: 'unicode:✜', name: 'Heavy Open Centre Cross', char: '✜', category: 'Unicode & Symbols', library: 'unicode', keywords: ['cross', 'emblem'] },
{ id: 'unicode:✠', name: 'Maltese Cross', char: '✠', category: 'Unicode & Symbols', library: 'unicode', keywords: ['cross', 'crest'] },

{ id: 'unicode:◆', name: 'Black Diamond', char: '◆', category: 'Unicode & Symbols', library: 'unicode', keywords: ['diamond', 'rhombus', 'shape', 'bullet'] },
{ id: 'unicode:◇', name: 'White Diamond', char: '◇', category: 'Unicode & Symbols', library: 'unicode', keywords: ['diamond', 'outline'] },
{ id: 'unicode:◈', name: 'White Diamond In Diamond', char: '◈', category: 'Unicode & Symbols', library: 'unicode', keywords: ['diamond', 'badge'] },
{ id: 'unicode:◊', name: 'Lozenge', char: '◊', category: 'Unicode & Symbols', library: 'unicode', keywords: ['diamond', 'lozenge'] },
{ id: 'unicode:▲', name: 'Black Up-Pointing Triangle', char: '▲', category: 'Unicode & Symbols', library: 'unicode', keywords: ['triangle', 'up', 'arrow', 'trend'] },
{ id: 'unicode:▼', name: 'Black Down-Pointing Triangle', char: '▼', category: 'Unicode & Symbols', library: 'unicode', keywords: ['triangle', 'down', 'dropdown'] },
{ id: 'unicode:◀', name: 'Black Left-Pointing Triangle', char: '◀', category: 'Unicode & Symbols', library: 'unicode', keywords: ['triangle', 'left', 'back'] },
{ id: 'unicode:▶', name: 'Black Right-Pointing Triangle', char: '▶', category: 'Unicode & Symbols', library: 'unicode', keywords: ['triangle', 'right', 'play', 'forward'] },
{ id: 'unicode:◼', name: 'Black Medium Square', char: '◼', category: 'Unicode & Symbols', library: 'unicode', keywords: ['square', 'stop', 'box'] },
{ id: 'unicode:◻', name: 'White Medium Square', char: '◻', category: 'Unicode & Symbols', library: 'unicode', keywords: ['square', 'checkbox', 'outline'] },
{ id: 'unicode:⬤', name: 'Black Large Circle', char: '⬤', category: 'Unicode & Symbols', library: 'unicode', keywords: ['circle', 'dot', 'record', 'bullet'] },
{ id: 'unicode:○', name: 'White Circle', char: '○', category: 'Unicode & Symbols', library: 'unicode', keywords: ['circle', 'ring', 'outline'] },
{ id: 'unicode:◎', name: 'Bullseye Circle', char: '◎', category: 'Unicode & Symbols', library: 'unicode', keywords: ['bullseye', 'target', 'circle'] },
{ id: 'unicode:⬡', name: 'White Hexagon', char: '⬡', category: 'Unicode & Symbols', library: 'unicode', keywords: ['hexagon', 'tech', 'polygon'] },
{ id: 'unicode:⬢', name: 'Black Hexagon', char: '⬢', category: 'Unicode & Symbols', library: 'unicode', keywords: ['hexagon', 'tech', 'solid'] },
{ id: 'unicode:⬣', name: 'Horizontal Black Hexagon', char: '⬣', category: 'Unicode & Symbols', library: 'unicode', keywords: ['hexagon', 'badge'] },

{ id: 'unicode:➔', name: 'Heavy Arrow Right', char: '➔', category: 'Unicode & Symbols', library: 'unicode', keywords: ['arrow', 'right', 'next', 'forward'] },
{ id: 'unicode:➜', name: 'Round Heavy Arrow Right', char: '➜', category: 'Unicode & Symbols', library: 'unicode', keywords: ['arrow', 'pointer'] },
{ id: 'unicode:➝', name: 'Triangle Arrow Right', char: '➝', category: 'Unicode & Symbols', library: 'unicode', keywords: ['arrow', 'right'] },
{ id: 'unicode:➞', name: 'Heavy Concave Arrow Right', char: '➞', category: 'Unicode & Symbols', library: 'unicode', keywords: ['arrow', 'pointer'] },
{ id: 'unicode:➡', name: 'Black Rightwards Arrow', char: '➡', category: 'Unicode & Symbols', library: 'unicode', keywords: ['arrow', 'button'] },
{ id: 'unicode:➤', name: 'Black Rightwards Arrowhead', char: '➤', category: 'Unicode & Symbols', library: 'unicode', keywords: ['arrow', 'pointer', 'navigation'] },
{ id: 'unicode:➥', name: 'Heavy Curved Arrow Down Right', char: '➥', category: 'Unicode & Symbols', library: 'unicode', keywords: ['curved arrow', 'reply'] },
{ id: 'unicode:➦', name: 'Heavy Curved Arrow Up Right', char: '➦', category: 'Unicode & Symbols', library: 'unicode', keywords: ['share', 'arrow'] },
{ id: 'unicode:↺', name: 'Anticlockwise Open Circle Arrow', char: '↺', category: 'Unicode & Symbols', library: 'unicode', keywords: ['reload', 'refresh', 'undo'] },
{ id: 'unicode:↻', name: 'Clockwise Open Circle Arrow', char: '↻', category: 'Unicode & Symbols', library: 'unicode', keywords: ['refresh', 'redo', 'sync'] },
{ id: 'unicode:⇄', name: 'Left Right Arrows', char: '⇄', category: 'Unicode & Symbols', library: 'unicode', keywords: ['swap', 'exchange', 'transfer'] },
{ id: 'unicode:⇅', name: 'Up Down Arrows', char: '⇅', category: 'Unicode & Symbols', library: 'unicode', keywords: ['sort', 'reorder'] },
{ id: 'unicode:⇐', name: 'Leftwards Double Arrow', char: '⇐', category: 'Unicode & Symbols', library: 'unicode', keywords: ['back', 'double arrow'] },
{ id: 'unicode:⇒', name: 'Rightwards Double Arrow', char: '⇒', category: 'Unicode & Symbols', library: 'unicode', keywords: ['forward', 'double arrow', 'leads to'] },
{ id: 'unicode:⇑', name: 'Upwards Double Arrow', char: '⇑', category: 'Unicode & Symbols', library: 'unicode', keywords: ['top', 'double arrow'] },
{ id: 'unicode:⇓', name: 'Downwards Double Arrow', char: '⇓', category: 'Unicode & Symbols', library: 'unicode', keywords: ['down', 'double arrow'] },
{ id: 'unicode:⇔', name: 'Left Right Double Arrow', char: '⇔', category: 'Unicode & Symbols', library: 'unicode', keywords: ['equivalent', 'both'] },

{ id: 'unicode:✿', name: 'Black Floret', char: '✿', category: 'Unicode & Symbols', library: 'unicode', keywords: ['flower', 'nature', 'floral'] },
{ id: 'unicode:❀', name: 'White Floret', char: '❀', category: 'Unicode & Symbols', library: 'unicode', keywords: ['flower', 'blossom', 'garden'] },
{ id: 'unicode:❁', name: 'Eight Petalled Flower', char: '❁', category: 'Unicode & Symbols', library: 'unicode', keywords: ['flower', 'decor'] },
{ id: 'unicode:❂', name: 'Open Sunburst', char: '❂', category: 'Unicode & Symbols', library: 'unicode', keywords: ['sun', 'burst'] },
{ id: 'unicode:❄', name: 'Snowflake', char: '❄', category: 'Unicode & Symbols', library: 'unicode', keywords: ['snow', 'winter', 'cold', 'ice'] },
{ id: 'unicode:❅', name: 'Tight Snowflake', char: '❅', category: 'Unicode & Symbols', library: 'unicode', keywords: ['snow', 'freeze'] },
{ id: 'unicode:❆', name: 'Heavy Chevron Snowflake', char: '❆', category: 'Unicode & Symbols', library: 'unicode', keywords: ['snowflake', 'ice'] },
{ id: 'unicode:❇', name: 'Sparkle Dingbat', char: '❇', category: 'Unicode & Symbols', library: 'unicode', keywords: ['sparkle', 'shine'] },
{ id: 'unicode:❈', name: 'Heavy Sparkle Dingbat', char: '❈', category: 'Unicode & Symbols', library: 'unicode', keywords: ['sparkle', 'star'] },
{ id: 'unicode:❉', name: 'Balloon-Spoked Asterisk', char: '❉', category: 'Unicode & Symbols', library: 'unicode', keywords: ['burst', 'decor'] },
{ id: 'unicode:❊', name: 'Eight Teardrop Spoked Propeller', char: '❊', category: 'Unicode & Symbols', library: 'unicode', keywords: ['flower', 'pinwheel'] },
{ id: 'unicode:❋', name: 'Heavy Eight Teardrop Spoked', char: '❋', category: 'Unicode & Symbols', library: 'unicode', keywords: ['asterisk', 'floret'] },
{ id: 'unicode:❦', name: 'Floral Heart Bullet', char: '❦', category: 'Unicode & Symbols', library: 'unicode', keywords: ['heart', 'ivy', 'leaf'] },
{ id: 'unicode:❧', name: 'Rotated Floral Heart', char: '❧', category: 'Unicode & Symbols', library: 'unicode', keywords: ['leaf', 'decor'] },
{ id: 'unicode:♥', name: 'Black Heart Suit', char: '♥', category: 'Unicode & Symbols', library: 'unicode', keywords: ['heart', 'love', 'like'] },
{ id: 'unicode:♡', name: 'White Heart Suit', char: '♡', category: 'Unicode & Symbols', library: 'unicode', keywords: ['heart', 'outline', 'love'] },
{ id: 'unicode:♦', name: 'Black Diamond Suit', char: '♦', category: 'Unicode & Symbols', library: 'unicode', keywords: ['diamond', 'cards'] },
{ id: 'unicode:♠', name: 'Black Spade Suit', char: '♠', category: 'Unicode & Symbols', library: 'unicode', keywords: ['spade', 'cards'] },
{ id: 'unicode:♣', name: 'Black Club Suit', char: '♣', category: 'Unicode & Symbols', library: 'unicode', keywords: ['club', 'cards', 'clover'] },

{ id: 'unicode:✈', name: 'Airplane', char: '✈', category: 'Unicode & Symbols', library: 'unicode', keywords: ['plane', 'travel', 'flight'] },
{ id: 'unicode:✉', name: 'Envelope', char: '✉', category: 'Unicode & Symbols', library: 'unicode', keywords: ['mail', 'message', 'contact'] },
{ id: 'unicode:✌', name: 'Victory Hand', char: '✌', category: 'Unicode & Symbols', library: 'unicode', keywords: ['peace', 'victory', 'two'] },
{ id: 'unicode:✍', name: 'Writing Hand', char: '✍', category: 'Unicode & Symbols', library: 'unicode', keywords: ['write', 'edit', 'sign'] },
{ id: 'unicode:✎', name: 'Lower Right Pencil', char: '✎', category: 'Unicode & Symbols', library: 'unicode', keywords: ['pencil', 'write', 'edit'] },
{ id: 'unicode:✏', name: 'Pencil', char: '✏', category: 'Unicode & Symbols', library: 'unicode', keywords: ['pencil', 'pen', 'draw'] },
{ id: 'unicode:✐', name: 'Upper Right Pencil', char: '✐', category: 'Unicode & Symbols', library: 'unicode', keywords: ['edit', 'write'] },
{ id: 'unicode:✑', name: 'White Nib', char: '✑', category: 'Unicode & Symbols', library: 'unicode', keywords: ['fountain pen', 'ink'] },
{ id: 'unicode:✒', name: 'Black Nib', char: '✒', category: 'Unicode & Symbols', library: 'unicode', keywords: ['pen', 'author', 'ink'] },
{ id: 'unicode:✂', name: 'Black Scissors', char: '✂', category: 'Unicode & Symbols', library: 'unicode', keywords: ['scissors', 'cut', 'snip'] },
{ id: 'unicode:✆', name: 'Telephone Location', char: '✆', category: 'Unicode & Symbols', library: 'unicode', keywords: ['phone', 'call', 'contact'] },
{ id: 'unicode:☕', name: 'Hot Beverage', char: '☕', category: 'Unicode & Symbols', library: 'unicode', keywords: ['coffee', 'tea', 'cafe', 'drink'] },
{ id: 'unicode:⚡', name: 'High Voltage Bolt', char: '⚡', category: 'Unicode & Symbols', library: 'unicode', keywords: ['lightning', 'energy', 'power', 'fast'] },
{ id: 'unicode:⚓', name: 'Anchor', char: '⚓', category: 'Unicode & Symbols', library: 'unicode', keywords: ['marine', 'sea', 'secure'] },
{ id: 'unicode:⚔', name: 'Crossed Swords', char: '⚔', category: 'Unicode & Symbols', library: 'unicode', keywords: ['battle', 'swords', 'game'] },
{ id: 'unicode:⚖', name: 'Scales of Justice', char: '⚖', category: 'Unicode & Symbols', library: 'unicode', keywords: ['law', 'balance', 'justice'] },
{ id: 'unicode:⚙', name: 'Gear', char: '⚙', category: 'Unicode & Symbols', library: 'unicode', keywords: ['settings', 'config', 'cog', 'engine'] },
{ id: 'unicode:⚛', name: 'Atom Symbol', char: '⚛', category: 'Unicode & Symbols', library: 'unicode', keywords: ['science', 'atom', 'physics', 'react'] },
{ id: 'unicode:⚜', name: 'Fleur-de-lis', char: '⚜', category: 'Unicode & Symbols', library: 'unicode', keywords: ['french', 'emblem', 'luxury'] },
{ id: 'unicode:⚠', name: 'Warning Sign', char: '⚠', category: 'Unicode & Symbols', library: 'unicode', keywords: ['warning', 'alert', 'caution'] },

{ id: 'unicode:∞', name: 'Infinity', char: '∞', category: 'Unicode & Symbols', library: 'unicode', keywords: ['infinity', 'endless', 'unlimited', 'loop'] },
{ id: 'unicode:≈', name: 'Almost Equal', char: '≈', category: 'Unicode & Symbols', library: 'unicode', keywords: ['approximate', 'math'] },
{ id: 'unicode:≠', name: 'Not Equal', char: '≠', category: 'Unicode & Symbols', library: 'unicode', keywords: ['difference', 'math'] },
{ id: 'unicode:≤', name: 'Less-Than Or Equal', char: '≤', category: 'Unicode & Symbols', library: 'unicode', keywords: ['math', 'comparison'] },
{ id: 'unicode:≥', name: 'Greater-Than Or Equal', char: '≥', category: 'Unicode & Symbols', library: 'unicode', keywords: ['math', 'comparison'] },
{ id: 'unicode:±', name: 'Plus-Minus', char: '±', category: 'Unicode & Symbols', library: 'unicode', keywords: ['math', 'tolerance'] },
{ id: 'unicode:√', name: 'Square Root', char: '√', category: 'Unicode & Symbols', library: 'unicode', keywords: ['radical', 'math'] },
{ id: 'unicode:∫', name: 'Integral', char: '∫', category: 'Unicode & Symbols', library: 'unicode', keywords: ['calculus', 'math'] },
{ id: 'unicode:∑', name: 'N-Ary Summation', char: '∑', category: 'Unicode & Symbols', library: 'unicode', keywords: ['sum', 'sigma', 'total'] },
{ id: 'unicode:∏', name: 'N-Ary Product', char: '∏', category: 'Unicode & Symbols', library: 'unicode', keywords: ['product', 'pi'] },
{ id: 'unicode:∆', name: 'Increment / Delta', char: '∆', category: 'Unicode & Symbols', library: 'unicode', keywords: ['delta', 'change', 'triangle'] },
{ id: 'unicode:§', name: 'Section Sign', char: '§', category: 'Unicode & Symbols', library: 'unicode', keywords: ['legal', 'clause', 'paragraph'] },
{ id: 'unicode:¶', name: 'Pilcrow / Paragraph', char: '¶', category: 'Unicode & Symbols', library: 'unicode', keywords: ['text', 'paragraph'] },
{ id: 'unicode:©', name: 'Copyright', char: '©', category: 'Unicode & Symbols', library: 'unicode', keywords: ['rights', 'legal'] },
{ id: 'unicode:®', name: 'Registered Trademark', char: '®', category: 'Unicode & Symbols', library: 'unicode', keywords: ['trademark', 'brand'] },
{ id: 'unicode:™', name: 'Trade Mark Sign', char: '™', category: 'Unicode & Symbols', library: 'unicode', keywords: ['tm', 'brand'] },
{ id: 'unicode:$', name: 'Dollar Sign', char: '$', category: 'Unicode & Symbols', library: 'unicode', keywords: ['money', 'usd', 'cash'] },
{ id: 'unicode:€', name: 'Euro Sign', char: '€', category: 'Unicode & Symbols', library: 'unicode', keywords: ['euro', 'money', 'eur'] },
{ id: 'unicode:£', name: 'Pound Sign', char: '£', category: 'Unicode & Symbols', library: 'unicode', keywords: ['gbp', 'pound', 'money'] },
{ id: 'unicode:¥', name: 'Yen / Yuan Sign', char: '¥', category: 'Unicode & Symbols', library: 'unicode', keywords: ['yen', 'jpy', 'cny', 'money'] },
{ id: 'unicode:₩', name: 'Won Sign', char: '₩', category: 'Unicode & Symbols', library: 'unicode', keywords: ['krw', 'korean won', 'money'] },
{ id: 'unicode:₹', name: 'Indian Rupee', char: '₹', category: 'Unicode & Symbols', library: 'unicode', keywords: ['inr', 'rupee', 'money'] },
{ id: 'unicode:₿', name: 'Bitcoin Symbol', char: '₿', category: 'Unicode & Symbols', library: 'unicode', keywords: ['crypto', 'btc', 'bitcoin'] },
];

export const EMOJI_ITEMS: IconDefinitionItem[] = [
{ id: 'emoji:😀', name: 'Grinning Face', char: '😀', category: 'Emojis', library: 'emoji', keywords: ['happy', 'smile', 'joy'] },
{ id: 'emoji:😃', name: 'Grinning Face Big Eyes', char: '😃', category: 'Emojis', library: 'emoji', keywords: ['smile', 'happy'] },
{ id: 'emoji:😄', name: 'Grinning Face Smiling Eyes', char: '😄', category: 'Emojis', library: 'emoji', keywords: ['laugh', 'happy'] },
{ id: 'emoji:😁', name: 'Beaming Face', char: '😁', category: 'Emojis', library: 'emoji', keywords: ['grin', 'cheerful'] },
{ id: 'emoji:😆', name: 'Grinning Squinting Face', char: '😆', category: 'Emojis', library: 'emoji', keywords: ['laugh', 'lol'] },
{ id: 'emoji:😅', name: 'Sweat Smile', char: '😅', category: 'Emojis', library: 'emoji', keywords: ['relief', 'whew'] },
{ id: 'emoji:😂', name: 'Tears of Joy', char: '😂', category: 'Emojis', library: 'emoji', keywords: ['laugh', 'crying', 'funny', 'lol'] },
{ id: 'emoji:🤣', name: 'Rolling on the Floor Laughing', char: '🤣', category: 'Emojis', library: 'emoji', keywords: ['rofl', 'funny'] },
{ id: 'emoji:😊', name: 'Smiling Face with Smiling Eyes', char: '😊', category: 'Emojis', library: 'emoji', keywords: ['blush', 'kind'] },
{ id: 'emoji:😇', name: 'Smiling Face with Halo', char: '😇', category: 'Emojis', library: 'emoji', keywords: ['angel', 'innocent'] },
{ id: 'emoji:🙂', name: 'Slightly Smiling Face', char: '🙂', category: 'Emojis', library: 'emoji', keywords: ['pleasant', 'calm'] },
{ id: 'emoji:😉', name: 'Winking Face', char: '😉', category: 'Emojis', library: 'emoji', keywords: ['wink', 'flirt'] },
{ id: 'emoji:😍', name: 'Heart Eyes', char: '😍', category: 'Emojis', library: 'emoji', keywords: ['love', 'crush', 'adore'] },
{ id: 'emoji:🥰', name: 'Smiling Face with Hearts', char: '🥰', category: 'Emojis', library: 'emoji', keywords: ['love', 'affection'] },
{ id: 'emoji:😘', name: 'Face Blowing a Kiss', char: '😘', category: 'Emojis', library: 'emoji', keywords: ['kiss', 'love'] },
{ id: 'emoji:😋', name: 'Face Savoring Food', char: '😋', category: 'Emojis', library: 'emoji', keywords: ['yum', 'delicious'] },
{ id: 'emoji:😜', name: 'Winking Face with Tongue', char: '😜', category: 'Emojis', library: 'emoji', keywords: ['playful', 'crazy'] },
{ id: 'emoji:🤪', name: 'Zany Face', char: '🤪', category: 'Emojis', library: 'emoji', keywords: ['wild', 'silly'] },
{ id: 'emoji:😎', name: 'Sunglasses Face', char: '😎', category: 'Emojis', library: 'emoji', keywords: ['cool', 'chill', 'boss'] },
{ id: 'emoji:🤓', name: 'Nerd Face', char: '🤓', category: 'Emojis', library: 'emoji', keywords: ['geek', 'smart', 'glasses'] },
{ id: 'emoji:🧐', name: 'Face with Monocle', char: '🧐', category: 'Emojis', library: 'emoji', keywords: ['inspect', 'curious'] },
{ id: 'emoji:🤩', name: 'Star-Struck', char: '🤩', category: 'Emojis', library: 'emoji', keywords: ['excited', 'amazing', 'wow'] },
{ id: 'emoji:🥳', name: 'Partying Face', char: '🥳', category: 'Emojis', library: 'emoji', keywords: ['celebrate', 'birthday'] },
{ id: 'emoji:😏', name: 'Smirking Face', char: '😏', category: 'Emojis', library: 'emoji', keywords: ['smirk', 'cheeky'] },
{ id: 'emoji:🤔', name: 'Thinking Face', char: '🤔', category: 'Emojis', library: 'emoji', keywords: ['hmm', 'ponder', 'idea'] },
{ id: 'emoji:🤫', name: 'Shushing Face', char: '🤫', category: 'Emojis', library: 'emoji', keywords: ['quiet', 'secret'] },
{ id: 'emoji:🫡', name: 'Saluting Face', char: '🫡', category: 'Emojis', library: 'emoji', keywords: ['respect', 'yes sir'] },
{ id: 'emoji:🤗', name: 'Hugging Face', char: '🤗', category: 'Emojis', library: 'emoji', keywords: ['hug', 'warm'] },
{ id: 'emoji:🥺', name: 'Pleading Face', char: '🥺', category: 'Emojis', library: 'emoji', keywords: ['puppy eyes', 'begging'] },
{ id: 'emoji:🤯', name: 'Exploding Head', char: '🤯', category: 'Emojis', library: 'emoji', keywords: ['mind blown', 'shock'] },
{ id: 'emoji:😱', name: 'Face Screaming in Fear', char: '😱', category: 'Emojis', library: 'emoji', keywords: ['omg', 'surprise'] },
{ id: 'emoji:🔥', name: 'Fire', char: '🔥', category: 'Emojis', library: 'emoji', keywords: ['hot', 'trend', 'lit', 'flame'] },
{ id: 'emoji:✨', name: 'Sparkles', char: '✨', category: 'Emojis', library: 'emoji', keywords: ['magic', 'new', 'clean', 'ai', 'special'] },
{ id: 'emoji:⭐', name: 'Star', char: '⭐', category: 'Emojis', library: 'emoji', keywords: ['favorite', 'rating', 'star'] },
{ id: 'emoji:🌟', name: 'Glowing Star', char: '🌟', category: 'Emojis', library: 'emoji', keywords: ['bright', 'shine'] },
{ id: 'emoji:🎉', name: 'Party Popper', char: '🎉', category: 'Emojis', library: 'emoji', keywords: ['celebration', 'tada', 'congrats'] },
{ id: 'emoji:🎊', name: 'Confetti Ball', char: '🎊', category: 'Emojis', library: 'emoji', keywords: ['party', 'festival'] },
{ id: 'emoji:🏆', name: 'Trophy', char: '🏆', category: 'Emojis', library: 'emoji', keywords: ['winner', 'champion', 'first'] },
{ id: 'emoji:🥇', name: '1st Place Medal', char: '🥇', category: 'Emojis', library: 'emoji', keywords: ['gold', 'first', 'award'] },
{ id: 'emoji:💎', name: 'Gem Stone', char: '💎', category: 'Emojis', library: 'emoji', keywords: ['diamond', 'luxury', 'precious'] },
{ id: 'emoji:👑', name: 'Crown', char: '👑', category: 'Emojis', library: 'emoji', keywords: ['king', 'queen', 'vip', 'leader'] },
{ id: 'emoji:🚀', name: 'Rocket', char: '🚀', category: 'Emojis', library: 'emoji', keywords: ['launch', 'fast', 'startup', 'growth'] },
{ id: 'emoji:💡', name: 'Light Bulb', char: '💡', category: 'Emojis', library: 'emoji', keywords: ['idea', 'tip', 'solution'] },
{ id: 'emoji:🎯', name: 'Direct Hit', char: '🎯', category: 'Emojis', library: 'emoji', keywords: ['target', 'goal', 'bullseye'] },
{ id: 'emoji:⚡', name: 'High Voltage', char: '⚡', category: 'Emojis', library: 'emoji', keywords: ['lightning', 'power', 'fast'] },
{ id: 'emoji:💻', name: 'Laptop', char: '💻', category: 'Emojis', library: 'emoji', keywords: ['tech', 'computer', 'work'] },
{ id: 'emoji:📱', name: 'Mobile Phone', char: '📱', category: 'Emojis', library: 'emoji', keywords: ['smartphone', 'app', 'call'] },
{ id: 'emoji:🛠️', name: 'Hammer and Wrench', char: '🛠️', category: 'Emojis', library: 'emoji', keywords: ['tools', 'build', 'settings'] },
{ id: 'emoji:📈', name: 'Chart Increasing', char: '📈', category: 'Emojis', library: 'emoji', keywords: ['growth', 'analytics', 'success'] },
{ id: 'emoji:💰', name: 'Money Bag', char: '💰', category: 'Emojis', library: 'emoji', keywords: ['wealth', 'dollar', 'finance'] },
{ id: 'emoji:💳', name: 'Credit Card', char: '💳', category: 'Emojis', library: 'emoji', keywords: ['payment', 'buy', 'shop'] },
{ id: 'emoji:🔒', name: 'Locked', char: '🔒', category: 'Emojis', library: 'emoji', keywords: ['security', 'safe', 'privacy'] },
{ id: 'emoji:🔑', name: 'Key', char: '🔑', category: 'Emojis', library: 'emoji', keywords: ['access', 'password', 'login'] },
{ id: 'emoji:🌍', name: 'Globe Europe-Africa', char: '🌍', category: 'Emojis', library: 'emoji', keywords: ['world', 'earth', 'global'] },
{ id: 'emoji:❤️', name: 'Red Heart', char: '❤️', category: 'Emojis', library: 'emoji', keywords: ['love', 'like', 'heart'] },
{ id: 'emoji:💙', name: 'Blue Heart', char: '💙', category: 'Emojis', library: 'emoji', keywords: ['trust', 'brand', 'heart'] },
{ id: 'emoji:💚', name: 'Green Heart', char: '💚', category: 'Emojis', library: 'emoji', keywords: ['eco', 'health'] },
{ id: 'emoji:💜', name: 'Purple Heart', char: '💜', category: 'Emojis', library: 'emoji', keywords: ['luxury', 'magic'] },
{ id: 'emoji:👍', name: 'Thumbs Up', char: '👍', category: 'Emojis', library: 'emoji', keywords: ['like', 'approve', 'yes', 'good'] },
{ id: 'emoji:👏', name: 'Clapping Hands', char: '👏', category: 'Emojis', library: 'emoji', keywords: ['applause', 'praise'] },
{ id: 'emoji:🙌', name: 'Raising Hands', char: '🙌', category: 'Emojis', library: 'emoji', keywords: ['celebrate', 'hooray'] },
{ id: 'emoji:🤝', name: 'Handshake', char: '🤝', category: 'Emojis', library: 'emoji', keywords: ['deal', 'partnership', 'agreement'] },
{ id: 'emoji:✌️', name: 'Victory Hand', char: '✌️', category: 'Emojis', library: 'emoji', keywords: ['peace', 'two'] },
{ id: 'emoji:🤙', name: 'Call Me Hand', char: '🤙', category: 'Emojis', library: 'emoji', keywords: ['hang loose', 'call'] },
{ id: 'emoji:👋', name: 'Waving Hand', char: '👋', category: 'Emojis', library: 'emoji', keywords: ['hello', 'bye', 'welcome'] },
{ id: 'emoji:🎨', name: 'Artist Palette', char: '🎨', category: 'Emojis', library: 'emoji', keywords: ['design', 'art', 'color'] },
{ id: 'emoji:☕', name: 'Coffee Cup', char: '☕', category: 'Emojis', library: 'emoji', keywords: ['coffee', 'drink', 'morning'] },
{ id: 'emoji:🍕', name: 'Pizza', char: '🍕', category: 'Emojis', library: 'emoji', keywords: ['food', 'delicious'] },
{ id: 'emoji:🍔', name: 'Burger', char: '🍔', category: 'Emojis', library: 'emoji', keywords: ['food', 'meal'] },
{ id: 'emoji:🍦', name: 'Ice Cream', char: '🍦', category: 'Emojis', library: 'emoji', keywords: ['sweet', 'dessert'] },
{ id: 'emoji:🚗', name: 'Automobile', char: '🚗', category: 'Emojis', library: 'emoji', keywords: ['car', 'travel'] },
{ id: 'emoji:✈️', name: 'Airplane', char: '✈️', category: 'Emojis', library: 'emoji', keywords: ['travel', 'flight'] },
{ id: 'emoji:🏖️', name: 'Beach with Umbrella', char: '🏖️', category: 'Emojis', library: 'emoji', keywords: ['vacation', 'summer'] },
{ id: 'emoji:🏠', name: 'House', char: '🏠', category: 'Emojis', library: 'emoji', keywords: ['home', 'real estate'] },
{ id: 'emoji:🏢', name: 'Office Building', char: '🏢', category: 'Emojis', library: 'emoji', keywords: ['business', 'company', 'work'] },
{ id: 'emoji:📍', name: 'Round Pushpin', char: '📍', category: 'Emojis', library: 'emoji', keywords: ['location', 'pin', 'map'] },
{ id: 'emoji:⏰', name: 'Alarm Clock', char: '⏰', category: 'Emojis', library: 'emoji', keywords: ['time', 'wake', 'deadline'] },
{ id: 'emoji:📅', name: 'Calendar', char: '📅', category: 'Emojis', library: 'emoji', keywords: ['schedule', 'date', 'event'] },
{ id: 'emoji:📌', name: 'Pushpin', char: '📌', category: 'Emojis', library: 'emoji', keywords: ['pin', 'note', 'notice'] },
{ id: 'emoji:🔔', name: 'Bell', char: '🔔', category: 'Emojis', library: 'emoji', keywords: ['notification', 'alert', 'ring'] },
{ id: 'emoji:🎁', name: 'Wrapped Gift', char: '🎁', category: 'Emojis', library: 'emoji', keywords: ['present', 'bonus', 'offer'] },
{ id: 'emoji:📦', name: 'Package', char: '📦', category: 'Emojis', library: 'emoji', keywords: ['delivery', 'shipping', 'box'] },
{ id: 'emoji:🛒', name: 'Shopping Cart', char: '🛒', category: 'Emojis', library: 'emoji', keywords: ['shop', 'ecommerce', 'cart'] },
{ id: 'emoji:🏷️', name: 'Label', char: '🏷️', category: 'Emojis', library: 'emoji', keywords: ['tag', 'price', 'discount'] },
{ id: 'emoji:📢', name: 'Loudspeaker', char: '📢', category: 'Emojis', library: 'emoji', keywords: ['announcement', 'marketing'] },
];

export const ALL_ICON_ITEMS: IconDefinitionItem[] = [
{ id: 'Sparkles', name: 'Sparkles', category: 'Popular', library: 'lucide', keywords: ['ai', 'magic', 'shine', 'special'] },
{ id: 'fa-wand-magic-sparkles', name: 'Magic Wand', category: 'Popular', library: 'fontawesome', keywords: ['magic', 'sparkle', 'wizard'] },
{ id: 'Star', name: 'Star', category: 'Popular', library: 'lucide', keywords: ['rate', 'favorite', 'badge', 'rating'] },
{ id: 'fa-star', name: 'Star Solid', category: 'Popular', library: 'fontawesome', keywords: ['favorite', 'gold', 'review'] },
{ id: 'Heart', name: 'Heart', category: 'Popular', library: 'lucide', keywords: ['love', 'like', 'health', 'favorite'] },
{ id: 'fa-heart', name: 'Heart Solid', category: 'Popular', library: 'fontawesome', keywords: ['love', 'romance'] },
{ id: 'Flame', name: 'Flame', category: 'Popular', library: 'lucide', keywords: ['fire', 'hot', 'trend', 'popular'] },
{ id: 'fa-fire', name: 'Fire Solid', category: 'Popular', library: 'fontawesome', keywords: ['hot', 'trend', 'flame'] },
{ id: 'Shield', name: 'Shield', category: 'Popular', library: 'lucide', keywords: ['security', 'protection', 'safe', 'secure'] },
{ id: 'fa-shield', name: 'Shield Halved', category: 'Popular', library: 'fontawesome', keywords: ['security', 'armor'] },
{ id: 'Zap', name: 'Lightning Zap', category: 'Popular', library: 'lucide', keywords: ['power', 'fast', 'energy', 'speed'] },
{ id: 'fa-bolt', name: 'Lightning Bolt', category: 'Popular', library: 'fontawesome', keywords: ['electricity', 'thunder'] },
{ id: 'Crown', name: 'Crown', category: 'Popular', library: 'lucide', keywords: ['vip', 'premium', 'king', 'leader'] },
{ id: 'fa-crown', name: 'Crown Solid', category: 'Popular', library: 'fontawesome', keywords: ['luxury', 'royal'] },
{ id: 'Rocket', name: 'Rocket', category: 'Popular', library: 'lucide', keywords: ['startup', 'launch', 'fast', 'growth'] },
{ id: 'fa-rocket', name: 'Rocket Solid', category: 'Popular', library: 'fontawesome', keywords: ['launch', 'space'] },

{ id: 'ArrowRight', name: 'Arrow Right', category: 'Action & Arrows', library: 'lucide', keywords: ['next', 'forward', 'pointer'] },
{ id: 'fa-arrow-right', name: 'FA Arrow Right', category: 'Action & Arrows', library: 'fontawesome', keywords: ['next', 'go'] },
{ id: 'ArrowLeft', name: 'Arrow Left', category: 'Action & Arrows', library: 'lucide', keywords: ['back', 'previous'] },
{ id: 'ArrowUpRight', name: 'Arrow Up Right', category: 'Action & Arrows', library: 'lucide', keywords: ['external', 'link', 'out'] },
{ id: 'ChevronRight', name: 'Chevron Right', category: 'Action & Arrows', library: 'lucide', keywords: ['menu', 'accordion', 'more'] },
{ id: 'ChevronDown', name: 'Chevron Down', category: 'Action & Arrows', library: 'lucide', keywords: ['dropdown', 'open'] },
{ id: 'Check', name: 'Check', category: 'Action & Arrows', library: 'lucide', keywords: ['done', 'ok', 'verified'] },
{ id: 'fa-check', name: 'FA Check', category: 'Action & Arrows', library: 'fontawesome', keywords: ['success', 'done'] },
{ id: 'CheckCircle2', name: 'Check Circle', category: 'Action & Arrows', library: 'lucide', keywords: ['completed', 'success'] },
{ id: 'fa-circle-check', name: 'FA Check Circle', category: 'Action & Arrows', library: 'fontawesome', keywords: ['verified', 'ok'] },
{ id: 'Send', name: 'Send Paper Plane', category: 'Action & Arrows', library: 'lucide', keywords: ['mail', 'message', 'share'] },
{ id: 'fa-paper-plane', name: 'FA Paper Plane', category: 'Action & Arrows', library: 'fontawesome', keywords: ['send', 'telegram'] },
{ id: 'Download', name: 'Download', category: 'Action & Arrows', library: 'lucide', keywords: ['save', 'get', 'export'] },
{ id: 'fa-download', name: 'FA Download', category: 'Action & Arrows', library: 'fontawesome', keywords: ['save', 'disk'] },
{ id: 'Upload', name: 'Upload', category: 'Action & Arrows', library: 'lucide', keywords: ['cloud', 'put', 'import'] },
{ id: 'fa-upload', name: 'FA Upload', category: 'Action & Arrows', library: 'fontawesome', keywords: ['publish', 'cloud'] },
{ id: 'Play', name: 'Play', category: 'Action & Arrows', library: 'lucide', keywords: ['video', 'media', 'start'] },
{ id: 'fa-play', name: 'FA Play', category: 'Action & Arrows', library: 'fontawesome', keywords: ['video', 'watch'] },
{ id: 'Search', name: 'Search', category: 'Action & Arrows', library: 'lucide', keywords: ['find', 'lookup', 'glass'] },
{ id: 'fa-magnifying-glass', name: 'FA Search', category: 'Action & Arrows', library: 'fontawesome', keywords: ['find', 'search'] },

{ id: 'Laptop', name: 'Laptop Computer', category: 'Tech & Media', library: 'lucide', keywords: ['pc', 'macbook', 'work'] },
{ id: 'fa-laptop', name: 'FA Laptop', category: 'Tech & Media', library: 'fontawesome', keywords: ['screen', 'computer'] },
{ id: 'Smartphone', name: 'Smartphone', category: 'Tech & Media', library: 'lucide', keywords: ['mobile', 'phone', 'ios'] },
{ id: 'fa-mobile', name: 'FA Mobile', category: 'Tech & Media', library: 'fontawesome', keywords: ['phone', 'touch'] },
{ id: 'Code', name: 'Code Brackets', category: 'Tech & Media', library: 'lucide', keywords: ['dev', 'html', 'programming'] },
{ id: 'fa-code', name: 'FA Code', category: 'Tech & Media', library: 'fontawesome', keywords: ['development', 'syntax'] },
{ id: 'Terminal', name: 'Terminal Shell', category: 'Tech & Media', library: 'lucide', keywords: ['cli', 'bash', 'console'] },
{ id: 'fa-terminal', name: 'FA Terminal', category: 'Tech & Media', library: 'fontawesome', keywords: ['command', 'console'] },
{ id: 'Cpu', name: 'CPU Microchip', category: 'Tech & Media', library: 'lucide', keywords: ['processor', 'hardware', 'core'] },
{ id: 'fa-microchip', name: 'FA Microchip', category: 'Tech & Media', library: 'fontawesome', keywords: ['chip', 'ai'] },
{ id: 'Camera', name: 'Camera', category: 'Tech & Media', library: 'lucide', keywords: ['photo', 'picture', 'media'] },
{ id: 'fa-camera', name: 'FA Camera', category: 'Tech & Media', library: 'fontawesome', keywords: ['photo', 'snapshot'] },
{ id: 'Video', name: 'Video Camera', category: 'Tech & Media', library: 'lucide', keywords: ['stream', 'movie', 'record'] },
{ id: 'fa-video', name: 'FA Video', category: 'Tech & Media', library: 'fontawesome', keywords: ['film', 'stream'] },
{ id: 'Music', name: 'Music Note', category: 'Tech & Media', library: 'lucide', keywords: ['audio', 'sound', 'song'] },
{ id: 'fa-music', name: 'FA Music', category: 'Tech & Media', library: 'fontawesome', keywords: ['melody', 'tune'] },

{ id: 'ShoppingCart', name: 'Shopping Cart', category: 'Commerce & Business', library: 'lucide', keywords: ['cart', 'buy', 'ecommerce', 'checkout'] },
{ id: 'fa-cart-shopping', name: 'FA Cart', category: 'Commerce & Business', library: 'fontawesome', keywords: ['store', 'shop'] },
{ id: 'CreditCard', name: 'Credit Card', category: 'Commerce & Business', library: 'lucide', keywords: ['pay', 'visa', 'mastercard'] },
{ id: 'TrendingUp', name: 'Trending Up', category: 'Commerce & Business', library: 'lucide', keywords: ['chart', 'analytics', 'growth', 'sales'] },
{ id: 'fa-arrow-trend-up', name: 'FA Trend Up', category: 'Commerce & Business', library: 'fontawesome', keywords: ['growth', 'profit'] },
{ id: 'Award', name: 'Award Ribbon', category: 'Commerce & Business', library: 'lucide', keywords: ['badge', 'medal', 'quality'] },
{ id: 'fa-award', name: 'FA Award', category: 'Commerce & Business', library: 'fontawesome', keywords: ['trophy', 'prize'] },
{ id: 'Gift', name: 'Gift Box', category: 'Commerce & Business', library: 'lucide', keywords: ['present', 'offer', 'bonus'] },
{ id: 'fa-gift', name: 'FA Gift', category: 'Commerce & Business', library: 'fontawesome', keywords: ['reward', 'holiday'] },
{ id: 'Tag', name: 'Price Tag', category: 'Commerce & Business', library: 'lucide', keywords: ['price', 'discount', 'label'] },
{ id: 'fa-tag', name: 'FA Tag', category: 'Commerce & Business', library: 'fontawesome', keywords: ['sale', 'discount'] },
{ id: 'Gem', name: 'Gem Diamond', category: 'Commerce & Business', library: 'lucide', keywords: ['luxury', 'jewel', 'precious'] },
{ id: 'fa-gem', name: 'FA Gem', category: 'Commerce & Business', library: 'fontawesome', keywords: ['crystal', 'valuable'] },

{ id: 'fa-github', name: 'GitHub', category: 'Social & Brands', library: 'fontawesome', keywords: ['git', 'code', 'repo', 'social'] },
{ id: 'fa-twitter', name: 'Twitter Bird', category: 'Social & Brands', library: 'fontawesome', keywords: ['tweet', 'social'] },
{ id: 'fa-x-twitter', name: 'X (Twitter)', category: 'Social & Brands', library: 'fontawesome', keywords: ['x', 'twitter', 'social'] },
{ id: 'fa-linkedin', name: 'LinkedIn', category: 'Social & Brands', library: 'fontawesome', keywords: ['career', 'network', 'business'] },
{ id: 'fa-instagram', name: 'Instagram', category: 'Social & Brands', library: 'fontawesome', keywords: ['photo', 'stories', 'social'] },
{ id: 'fa-youtube', name: 'YouTube', category: 'Social & Brands', library: 'fontawesome', keywords: ['video', 'channel', 'watch'] },
{ id: 'fa-facebook', name: 'Facebook', category: 'Social & Brands', library: 'fontawesome', keywords: ['meta', 'social'] },
{ id: 'fa-discord', name: 'Discord', category: 'Social & Brands', library: 'fontawesome', keywords: ['chat', 'community', 'gaming'] },
{ id: 'fa-spotify', name: 'Spotify', category: 'Social & Brands', library: 'fontawesome', keywords: ['music', 'podcast'] },
{ id: 'fa-tiktok', name: 'TikTok', category: 'Social & Brands', library: 'fontawesome', keywords: ['video', 'shorts'] },
{ id: 'fa-google', name: 'Google', category: 'Social & Brands', library: 'fontawesome', keywords: ['search', 'cloud'] },
{ id: 'fa-apple', name: 'Apple', category: 'Social & Brands', library: 'fontawesome', keywords: ['ios', 'mac', 'brand'] },

{ id: 'Mail', name: 'Mail Envelope', category: 'Objects & UI', library: 'lucide', keywords: ['email', 'contact', 'letter'] },
{ id: 'fa-envelope', name: 'FA Envelope', category: 'Objects & UI', library: 'fontawesome', keywords: ['message', 'post'] },
{ id: 'Phone', name: 'Phone', category: 'Objects & UI', library: 'lucide', keywords: ['call', 'contact', 'telecom'] },
{ id: 'fa-phone', name: 'FA Phone', category: 'Objects & UI', library: 'fontawesome', keywords: ['talk', 'support'] },
{ id: 'MapPin', name: 'Map Pin Location', category: 'Objects & UI', library: 'lucide', keywords: ['address', 'place', 'geo'] },
{ id: 'fa-location-dot', name: 'FA Location Dot', category: 'Objects & UI', library: 'fontawesome', keywords: ['gps', 'map'] },
{ id: 'Globe', name: 'Globe', category: 'Objects & UI', library: 'lucide', keywords: ['web', 'world', 'language', 'international'] },
{ id: 'fa-globe', name: 'FA Globe', category: 'Objects & UI', library: 'fontawesome', keywords: ['earth', 'internet'] },
{ id: 'Calendar', name: 'Calendar', category: 'Objects & UI', library: 'lucide', keywords: ['date', 'time', 'event', 'schedule'] },
{ id: 'fa-calendar', name: 'FA Calendar', category: 'Objects & UI', library: 'fontawesome', keywords: ['schedule', 'agenda'] },
{ id: 'Clock', name: 'Clock', category: 'Objects & UI', library: 'lucide', keywords: ['time', 'hour', 'timer'] },
{ id: 'fa-clock', name: 'FA Clock', category: 'Objects & UI', library: 'fontawesome', keywords: ['watch', 'time'] },
{ id: 'Bell', name: 'Bell Notification', category: 'Objects & UI', library: 'lucide', keywords: ['alert', 'alarm', 'ring'] },
{ id: 'fa-bell', name: 'FA Bell', category: 'Objects & UI', library: 'fontawesome', keywords: ['ring', 'notice'] },
{ id: 'Sliders', name: 'Sliders Filter', category: 'Objects & UI', library: 'lucide', keywords: ['settings', 'controls', 'adjust'] },
{ id: 'fa-sliders', name: 'FA Sliders', category: 'Objects & UI', library: 'fontawesome', keywords: ['equalizer', 'tune'] },
{ id: 'Settings', name: 'Gear Settings', category: 'Objects & UI', library: 'lucide', keywords: ['config', 'setup', 'tools'] },
{ id: 'fa-gear', name: 'FA Gear', category: 'Objects & UI', library: 'fontawesome', keywords: ['preferences', 'cog'] },
{ id: 'User', name: 'User Profile', category: 'Objects & UI', library: 'lucide', keywords: ['person', 'account', 'member'] },
{ id: 'fa-user', name: 'FA User', category: 'Objects & UI', library: 'fontawesome', keywords: ['avatar', 'profile'] },
{ id: 'Lock', name: 'Padlock', category: 'Objects & UI', library: 'lucide', keywords: ['private', 'secure', 'protect'] },
{ id: 'fa-lock', name: 'FA Lock', category: 'Objects & UI', library: 'fontawesome', keywords: ['password', 'safe'] },
{ id: 'Key', name: 'Key', category: 'Objects & UI', library: 'lucide', keywords: ['access', 'unlock', 'token'] },
{ id: 'fa-key', name: 'FA Key', category: 'Objects & UI', library: 'fontawesome', keywords: ['open', 'security'] },
{ id: 'Eye', name: 'Eye View', category: 'Objects & UI', library: 'lucide', keywords: ['see', 'preview', 'watch'] },
{ id: 'fa-eye', name: 'FA Eye', category: 'Objects & UI', library: 'fontawesome', keywords: ['view', 'look'] },
{ id: 'Palette', name: 'Color Palette', category: 'Objects & UI', library: 'lucide', keywords: ['art', 'theme', 'paint'] },
{ id: 'fa-palette', name: 'FA Palette', category: 'Objects & UI', library: 'fontawesome', keywords: ['color', 'design'] },
{ id: 'Lightbulb', name: 'Lightbulb', category: 'Objects & UI', library: 'lucide', keywords: ['idea', 'tip', 'solution'] },
{ id: 'fa-lightbulb', name: 'FA Lightbulb', category: 'Objects & UI', library: 'fontawesome', keywords: ['bright', 'concept'] },
{ id: 'ThumbsUp', name: 'Thumbs Up', category: 'Objects & UI', library: 'lucide', keywords: ['like', 'agree', 'good'] },
{ id: 'fa-thumbs-up', name: 'FA Thumbs Up', category: 'Objects & UI', library: 'fontawesome', keywords: ['vote', 'positive'] },
{ id: 'Compass', name: 'Compass', category: 'Objects & UI', library: 'lucide', keywords: ['navigation', 'explore', 'direction'] },
{ id: 'fa-compass', name: 'FA Compass', category: 'Objects & UI', library: 'fontawesome', keywords: ['direction', 'safari'] },
{ id: 'Layers', name: 'Layer Group', category: 'Objects & UI', library: 'lucide', keywords: ['stack', 'layout', 'cards'] },
{ id: 'fa-layer-group', name: 'FA Layer Group', category: 'Objects & UI', library: 'fontawesome', keywords: ['stack', 'tier'] },
{ id: 'Folder', name: 'Folder Directory', category: 'Objects & UI', library: 'lucide', keywords: ['files', 'directory', 'storage'] },
{ id: 'fa-folder', name: 'FA Folder', category: 'Objects & UI', library: 'fontawesome', keywords: ['archive', 'document'] },
{ id: 'FileText', name: 'File Document', category: 'Objects & UI', library: 'lucide', keywords: ['doc', 'pdf', 'text', 'paper'] },
{ id: 'fa-file-lines', name: 'FA File Lines', category: 'Objects & UI', library: 'fontawesome', keywords: ['document', 'article'] },
{ id: 'Paperclip', name: 'Paperclip Attachment', category: 'Objects & UI', library: 'lucide', keywords: ['attach', 'file', 'link'] },
{ id: 'fa-paperclip', name: 'FA Paperclip', category: 'Objects & UI', library: 'fontawesome', keywords: ['attachment', 'clip'] },
{ id: 'Bullhorn', name: 'Bullhorn Megaphone', category: 'Objects & UI', library: 'lucide', keywords: ['promote', 'broadcast', 'announce'] },
{ id: 'fa-bullhorn', name: 'FA Bullhorn', category: 'Objects & UI', library: 'fontawesome', keywords: ['loudspeaker', 'marketing'] },
{ id: 'Sun', name: 'Sun Light', category: 'Objects & UI', library: 'lucide', keywords: ['day', 'warm', 'mode'] },
{ id: 'fa-sun', name: 'FA Sun', category: 'Objects & UI', library: 'fontawesome', keywords: ['daylight', 'brightness'] },
{ id: 'Moon', name: 'Moon Dark', category: 'Objects & UI', library: 'lucide', keywords: ['night', 'dark', 'mode'] },
{ id: 'fa-moon', name: 'FA Moon', category: 'Objects & UI', library: 'fontawesome', keywords: ['night', 'crescent'] },
];

export const renderIconVisual = (iconId: string | undefined, className = 'w-5 h-5'): React.ReactNode => {
if (!iconId) {
return <LucideIcons.Sparkles className={className} />;
}

if (iconId.startsWith('unicode:')) {
const rawChar = iconId.replace(/^unicode:/, '');
return (
<span
className={`${className} inline-flex items-center justify-center select-none font-sans leading-none`}
style={{ fontSize: 'inherit' }}
>
{rawChar}
</span>
);
}

if (iconId.startsWith('emoji:')) {
const rawEmoji = iconId.replace(/^emoji:/, '');
return (
<span
className={`${className} inline-flex items-center justify-center select-none leading-none`}
style={{
fontFamily: `'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif`,
fontSize: 'inherit',
}}
>
{rawEmoji}
</span>
);
}

if (iconId.trim().startsWith('<svg')) {
return (
<span
className={`${className} inline-flex items-center justify-center`}
dangerouslySetInnerHTML={{ __html: iconId }}
/>
);
}

if (iconId.startsWith('http://') || iconId.startsWith('https://') || iconId.startsWith('data:image/')) {
return (
<img
src={iconId}
alt="custom-icon"
className={`${className} object-contain`}
referrerPolicy="no-referrer"
/>
);
}

if (iconId.length <= 6 && !/^[a-zA-Z0-9_-]+$/.test(iconId)) {
return (
<span
className={`${className} inline-flex items-center justify-center select-none leading-none`}
style={{
fontFamily: `'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif`,
fontSize: 'inherit',
}}
>
{iconId}
</span>
);
}

if (iconId.startsWith('fa-') || iconId.startsWith('fa:') || iconId.startsWith('fa-brands ') || iconId.startsWith('fa-solid ')) {
const cleanId = iconId.replace(/^fa:/, 'fa-').replace(/^fa-brands\s+/, '').replace(/^fa-solid\s+/, '');
const faIcon = FA_ICON_MAP[cleanId] || FA_ICON_MAP[`fa-${cleanId}`];
if (faIcon) {
return <FontAwesomeIcon icon={faIcon} className={className} />;
}
}

const cleanLucide = iconId.replace(/^lucide:/, '');
const kebabToPascal = cleanLucide
.split(/[-_]/)
.map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
.join('');
const pascalCase = cleanLucide.charAt(0).toUpperCase() + cleanLucide.slice(1);
const LucideComp =
(LucideIcons as any)[kebabToPascal] ||
(LucideIcons as any)[pascalCase] ||
(LucideIcons as any)[cleanLucide];

if (LucideComp) {
return <LucideComp className={className} />;
}

const lower = cleanLucide.toLowerCase();
switch (lower) {
case 'star':
return <LucideIcons.Star className={className} />;
case 'heart':
return <LucideIcons.Heart className={className} />;
case 'flame':
case 'fire':
return <LucideIcons.Flame className={className} />;
case 'shield':
return <LucideIcons.Shield className={className} />;
case 'zap':
case 'lightning':
case 'bolt':
return <LucideIcons.Zap className={className} />;
case 'mail':
case 'email':
return <LucideIcons.Mail className={className} />;
case 'phone':
return <LucideIcons.Phone className={className} />;
case 'shopping-cart':
case 'cart':
return <LucideIcons.ShoppingCart className={className} />;
case 'map-pin':
case 'location':
return <LucideIcons.MapPin className={className} />;
case 'send':
return <LucideIcons.Send className={className} />;
case 'check':
return <LucideIcons.Check className={className} />;
case 'arrow-right':
case 'arrow':
return <LucideIcons.ArrowRight className={className} />;
case 'play':
return <LucideIcons.Play className={className} />;
case 'download':
return <LucideIcons.Download className={className} />;
case 'upload':
return <LucideIcons.Upload className={className} />;
case 'calendar':
return <LucideIcons.Calendar className={className} />;
case 'radio':
return <LucideIcons.Radio className={className} />;
case 'file-text':
case 'file':
return <LucideIcons.FileText className={className} />;
case 'check-square':
return <LucideIcons.CheckSquare className={className} />;
case 'globe':
return <LucideIcons.Globe className={className} />;
case 'hash':
return <LucideIcons.Hash className={className} />;
case 'sliders':
return <LucideIcons.Sliders className={className} />;
case 'user':
return <LucideIcons.User className={className} />;
case 'gear':
case 'settings':
return <LucideIcons.Settings className={className} />;
case 'crown':
return <LucideIcons.Crown className={className} />;
case 'sparkles':
default:
return <LucideIcons.Sparkles className={className} />;
}
};
