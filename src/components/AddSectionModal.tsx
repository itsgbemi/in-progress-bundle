import React, { useState } from 'react';
import { Search, Plus, LayoutTemplate } from 'lucide-react';
import { WebsiteSection } from '../types';
import { getSectionPresets, SectionPreset } from '../data/sectionPresets';
import { Modal, ModalHeader, ModalBody, Tabs, TextInput } from './common';

export type { SectionPreset };
export { getSectionPresets };

interface AddSectionModalProps {
isOpen: boolean;
onClose: () => void;
onAddSection: (section: WebsiteSection) => void;
uiTheme?: 'dark' | 'light';
}

const CATEGORIES = [
{ id: 'all', label: 'All' },
{ id: 'content', label: 'Content' },
{ id: 'marketing', label: 'Marketing' },
{ id: 'media', label: 'Media' },
{ id: 'layout', label: 'Layout' },
];

export const AddSectionModal: React.FC<AddSectionModalProps> = ({
isOpen,
onClose,
onAddSection,
uiTheme = 'dark',
}) => {
const [searchQuery, setSearchQuery] = useState('');
const [selectedCategory, setSelectedCategory] = useState<string>('all');

const isLight = uiTheme === 'light';
const sectionPresets = getSectionPresets(isLight);

const filteredPresets = sectionPresets.filter((p) => {
const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
return matchesSearch && matchesCat;
});

return (
<Modal
isOpen={isOpen}
onClose={onClose}
isLight={isLight}
size="2xl"
aria-labelledby="add-section-modal-title"
>
<ModalHeader
title="Add Section to Website"
description="Choose a pre-built section layout to add to your page"
icon={<LayoutTemplate className="w-5 h-5" />}
onClose={onClose}
isLight={isLight}
titleId="add-section-modal-title"
/>

<div
className={`p-3.5 border-b flex flex-col sm:flex-row items-center gap-2.5 ${
isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
}`}
>
<div className="w-full sm:flex-1">
<TextInput
placeholder="Search section presets..."
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
isLight={isLight}
leftIcon={<Search className="w-4 h-4" />}
/>
</div>

<div className="w-full sm:w-auto">
<Tabs
tabs={CATEGORIES}
activeTab={selectedCategory}
onChange={setSelectedCategory}
variant="pills"
isLight={isLight}
/>
</div>
</div>

<ModalBody isLight={isLight} className="max-h-[60vh]">
<div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
{filteredPresets.map((preset) => (
<button
key={preset.type}
type="button"
onClick={() => {
onAddSection(preset.getSection());
onClose();
}}
className={`group flex flex-col text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
isLight
? 'bg-slate-50/80 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 hover:shadow-md'
: 'bg-slate-950/80 border-slate-800 hover:border-indigo-500 hover:bg-slate-800/60 hover:shadow-md'
}`}
>
<div className="w-full mb-2 overflow-hidden rounded-lg">
{preset.renderVisual()}
</div>

<div className="flex items-center justify-between w-full px-0.5 mt-0.5">
<span
className={`text-xs font-bold transition-colors truncate ${
isLight
? 'text-slate-900 group-hover:text-indigo-600'
: 'text-slate-100 group-hover:text-indigo-400'
}`}
>
{preset.title}
</span>
<Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors shrink-0" />
</div>
</button>
))}
</div>

{filteredPresets.length === 0 && (
<div className="text-center py-12 text-xs text-slate-400">
No section found matching &ldquo;{searchQuery}&rdquo;.
</div>
)}
</ModalBody>
</Modal>
);
};
