import React, { useState } from 'react';
import {
  Type, Sliders, Trash2, Plus, Globe, Sparkles, Ban, ChevronDown, ChevronUp,
  CheckSquare, SlidersHorizontal, Mail, Phone, Upload, Calendar, Hash, FileText,
  Radio, Shield, Link2, Send, Check, AlertCircle, ArrowRight, CornerDownRight,
  Settings, Layers, Bell, CheckCircle2, Lock, Eye, EyeOff
} from 'lucide-react';
import { WebsiteElement, FormFieldType } from '../../types';
import { TYPEFACE_OPTIONS } from '../../data/presetSamples';
import { ElementInspectorProps, getInspectorStyles, TypographyControls } from './PropertiesCommon';
import { BackgroundController } from '../BackgroundController';

export const FormProperties: React.FC<ElementInspectorProps> = ({
  selectedContext,
  onUpdateElement,
  onSelectContext,
  onDeleteElement,
  page,
  selectedSection,
  onUpdateSection,
  uiTheme = 'dark',
  viewportMode = 'desktop',
}) => {
    const [activeTab, setActiveTab] = useState<'content' | 'style' | 'layout' | 'responsive'>('content');
    const [contentSubTab, setContentSubTab] = useState<'general' | 'fields' | 'submit' | 'notifications'>('general');
    const [selectedFormFieldIndex, setSelectedFormFieldIndex] = useState<number>(0);
    const [showAddFieldMenu, setShowAddFieldMenu] = useState<boolean>(false);
    const [showFieldAdvStyling, setShowFieldAdvStyling] = useState<boolean>(false);

    const isLight = uiTheme === 'light';
    const { inputClass, selectClass, labelClass, boxGroupClass } = getInspectorStyles(isLight);

    if (!selectedContext) return null;
    const { element } = selectedContext;
    const s = element.styles || {};
    const formFields = element.formFields || [];

    const updateProp = (key: string, val: any) => {
        if (!selectedContext) return;
        onUpdateElement({
            ...selectedContext.element,
            [key]: val,
        });
    };

    const updateStyle = (key: string, value: any) => {
        if (!selectedContext) return;
        const updatedElement: WebsiteElement = {
            ...selectedContext.element,
            styles: {
                ...(selectedContext.element.styles || {}),
                [key]: value,
            },
        };
        onUpdateElement(updatedElement);
    };

    const handleAddField = (fieldType: FormFieldType = 'text') => {
        const typeLabels: Record<string, string> = {
            text: 'Full Name', email: 'Email Address', tel: 'Phone Number', url: 'Website URL',
            date: 'Select Date', textarea: 'Your Message', radio: 'Preferred Option', checkbox: 'Select Preferences',
            file: 'Upload Document', select: 'Select Option', number: 'Quantity', password: 'Password',
        };
        const typePlaceholders: Record<string, string> = {
            text: 'e.g. Jane Doe', email: 'jane@example.com', tel: '+1 (555) 000-0000', url: 'https://',
            date: 'YYYY-MM-DD', textarea: 'Write your message here...', radio: '', checkbox: '',
            file: 'Choose file to upload...', select: 'Please choose one...', number: '0', password: '••••••••',
        };

        const newField: any = {
            id: `f-${Date.now()}`,
            name: `${fieldType}_${formFields.length + 1}`,
            label: typeLabels[fieldType] || `Field ${formFields.length + 1}`,
            type: fieldType,
            placeholder: typePlaceholders[fieldType] ?? 'Enter details...',
            required: fieldType === 'email' || fieldType === 'text',
            showLabel: true,
            showPlaceholder: true,
            width: 'full',
            options: (fieldType === 'radio' || fieldType === 'checkbox' || fieldType === 'select') ? ['Option 1', 'Option 2', 'Option 3'] : undefined
        };

        const updatedFields = [...formFields, newField];
        updateProp('formFields', updatedFields);
        setSelectedFormFieldIndex(updatedFields.length - 1);
        setShowAddFieldMenu(false);
    };

    const updateCurrentField = (key: string, val: any) => {
        const newFields = [...formFields];
        if (!newFields[selectedFormFieldIndex]) return;
        newFields[selectedFormFieldIndex] = { ...newFields[selectedFormFieldIndex], [key]: val };
        updateProp('formFields', newFields);
    };

    const moveField = (idx: number, direction: 'up' | 'down') => {
        if (direction === 'up' && idx <= 0) return;
        if (direction === 'down' && idx >= formFields.length - 1) return;
        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        const updated = [...formFields];
        const [moved] = updated.splice(idx, 1);
        updated.splice(targetIdx, 0, moved);
        updateProp('formFields', updated);
        setSelectedFormFieldIndex(targetIdx);
    };

    const removeField = (idx: number) => {
        const updated = formFields.filter((_, i) => i !== idx);
        updateProp('formFields', updated);
        setSelectedFormFieldIndex(Math.max(0, idx - 1));
    };

    const getFieldTypeIcon = (type: FormFieldType) => {
        switch (type) {
            case 'email': return <Mail className="w-3.5 h-3.5" />;
            case 'tel': return <Phone className="w-3.5 h-3.5" />;
            case 'textarea': return <FileText className="w-3.5 h-3.5" />;
            case 'number': return <Hash className="w-3.5 h-3.5" />;
            case 'date': return <Calendar className="w-3.5 h-3.5" />;
            case 'file': return <Upload className="w-3.5 h-3.5" />;
            case 'select': return <ChevronDown className="w-3.5 h-3.5" />;
            case 'radio': return <Radio className="w-3.5 h-3.5" />;
            case 'checkbox': return <CheckSquare className="w-3.5 h-3.5" />;
            case 'password': return <Lock className="w-3.5 h-3.5" />;
            case 'url': return <Globe className="w-3.5 h-3.5" />;
            default: return <Type className="w-3.5 h-3.5" />;
        }
    };

    const renderGeneralContent = () => {
        const showTitle = element.showFormTitle !== false;
        const showSubtitle = !!element.showFormSubtitle;
        const honeypotEnabled = !!element.formHoneypotEnabled;
        const autoReset = element.formAutoReset !== false;
        const endpointMode = element.formEndpointMode || 'vercel';

        return (
            <div className="space-y-4">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-500/5 space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="font-bold text-xs block text-slate-900 dark:text-slate-100">Form Header Title</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">Display heading above fields</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => updateProp('showFormTitle', !showTitle)}
                            className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${showTitle ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                            title={showTitle ? 'Hide header' : 'Show header'}
                        >
                            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${showTitle ? 'left-4.5' : 'left-0.5'}`}/>
                        </button>
                    </div>

                    {showTitle && (
                        <div className="space-y-2 pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
                            <div>
                                <label className={labelClass}>Heading Text</label>
                                <input
                                    type="text"
                                    value={element.content || element.formTitle || ''}
                                    onChange={(e) => {
                                        updateProp('content', e.target.value);
                                        updateProp('formTitle', e.target.value);
                                    }}
                                    placeholder="e.g. Contact Us, Request a Quote"
                                    className={inputClass}
                                />
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">Show Subtitle / Description</span>
                                <button
                                    type="button"
                                    onClick={() => updateProp('showFormSubtitle', !showSubtitle)}
                                    className={`w-8 h-4.5 rounded-full transition-colors relative cursor-pointer ${showSubtitle ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                                >
                                    <span className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${showSubtitle ? 'left-4' : 'left-0.5'}`}/>
                                </button>
                            </div>

                            {showSubtitle && (
                                <div>
                                    <textarea
                                        value={element.formSubtitle || ''}
                                        onChange={(e) => updateProp('formSubtitle', e.target.value)}
                                        placeholder="e.g. Fill out the form below and our team will get back to you within 24 hours."
                                        rows={2}
                                        className={inputClass}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-500/5 space-y-3">
                    <div>
                        <span className="font-bold text-xs block text-slate-900 dark:text-slate-100">Submission Endpoint</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">Where form entries are transmitted</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                updateProp('formEndpointMode', 'vercel');
                                updateProp('formActionUrl', '/api/submit-form');
                            }}
                            className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${endpointMode === 'vercel'
                                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 font-semibold'
                                : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'}`}
                        >
                            <div className="flex items-center gap-1.5 font-bold text-xs">
                                <span>⚡ Native API</span>
                            </div>
                            <p className="text-[9px] opacity-75 mt-0.5">Automated serverless handler</p>
                        </button>

                        <button
                            type="button"
                            onClick={() => updateProp('formEndpointMode', 'custom')}
                            className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${endpointMode === 'custom'
                                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 font-semibold'
                                : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'}`}
                        >
                            <div className="flex items-center gap-1.5 font-bold text-xs">
                                <Globe className="w-3.5 h-3.5" />
                                <span>Custom URL</span>
                            </div>
                            <p className="text-[9px] opacity-75 mt-0.5">Webhook or external API</p>
                        </button>
                    </div>

                    {endpointMode === 'custom' && (
                        <div className="space-y-2 pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
                            <div>
                                <label className={labelClass}>Action URL</label>
                                <input
                                    type="text"
                                    value={element.formActionUrl || ''}
                                    onChange={(e) => updateProp('formActionUrl', e.target.value)}
                                    placeholder="https://formspree.io/f/... or /api/custom"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>HTTP Method</label>
                                <select
                                    value={element.formMethod || 'POST'}
                                    onChange={(e) => updateProp('formMethod', e.target.value)}
                                    className={selectClass}
                                >
                                    <option value="POST">POST (Recommended)</option>
                                    <option value="GET">GET</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-500/5 space-y-3">
                    <div>
                        <span className="font-bold text-xs block text-slate-900 dark:text-slate-100">Anti-Spam & Behavior</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">Protection and post-submit actions</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60">
                        <div className="flex items-center gap-2">
                            <Shield className={`w-4 h-4 shrink-0 ${honeypotEnabled ? 'text-emerald-500' : 'text-slate-400'}`} />
                            <div>
                                <div className="font-semibold text-[11px] text-slate-900 dark:text-slate-200">Invisible Honeypot Trap</div>
                                <div className="text-[9px] text-slate-500 dark:text-slate-400">Silently blocks spam bots without captchas</div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => updateProp('formHoneypotEnabled', !honeypotEnabled)}
                            className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${honeypotEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                            title={honeypotEnabled ? 'Disable Honeypot' : 'Enable Honeypot'}
                        >
                            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${honeypotEnabled ? 'left-4.5' : 'left-0.5'}`}/>
                        </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60">
                        <div>
                            <div className="font-semibold text-[11px] text-slate-900 dark:text-slate-200">Clear Fields on Success</div>
                            <div className="text-[9px] text-slate-500 dark:text-slate-400">Reset input fields after sending</div>
                        </div>
                        <button
                            type="button"
                            onClick={() => updateProp('formAutoReset', !autoReset)}
                            className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${autoReset ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                        >
                            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${autoReset ? 'left-4.5' : 'left-0.5'}`}/>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderFieldsContent = () => {
        const activeIdx = selectedFormFieldIndex;
        const activeField = formFields[activeIdx];

        const allFieldTypes: { type: FormFieldType; label: string; icon: any }[] = [
            { type: 'text', label: 'Single-line Text', icon: <Type className="w-3.5 h-3.5" /> },
            { type: 'email', label: 'Email Address', icon: <Mail className="w-3.5 h-3.5" /> },
            { type: 'tel', label: 'Phone Number', icon: <Phone className="w-3.5 h-3.5" /> },
            { type: 'textarea', label: 'Paragraph / Message', icon: <FileText className="w-3.5 h-3.5" /> },
            { type: 'select', label: 'Dropdown Selection', icon: <ChevronDown className="w-3.5 h-3.5" /> },
            { type: 'radio', label: 'Radio Choices', icon: <Radio className="w-3.5 h-3.5" /> },
            { type: 'checkbox', label: 'Checkboxes', icon: <CheckSquare className="w-3.5 h-3.5" /> },
            { type: 'number', label: 'Number / Quantity', icon: <Hash className="w-3.5 h-3.5" /> },
            { type: 'date', label: 'Date Picker', icon: <Calendar className="w-3.5 h-3.5" /> },
            { type: 'file', label: 'File Upload', icon: <Upload className="w-3.5 h-3.5" /> },
            { type: 'password', label: 'Password', icon: <Lock className="w-3.5 h-3.5" /> },
            { type: 'url', label: 'Website URL', icon: <Globe className="w-3.5 h-3.5" /> },
        ];

        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                            Fields ({formFields.length})
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                            Reorder, edit, or add inputs
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowAddFieldMenu(!showAddFieldMenu)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-sm"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Field</span>
                    </button>
                </div>

                {showAddFieldMenu && (
                    <div className="p-3 rounded-xl border border-indigo-500/40 bg-indigo-500/5 dark:bg-indigo-950/20 space-y-2.5 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] text-indigo-400">Select Field Type</span>
                            <button
                                type="button"
                                onClick={() => setShowAddFieldMenu(false)}
                                className="text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
                            {allFieldTypes.map(({ type, label, icon }) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => handleAddField(type)}
                                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 hover:bg-indigo-500/10 text-left transition-all cursor-pointer text-xs"
                                >
                                    <span className="text-indigo-400">{icon}</span>
                                    <span className="truncate font-medium">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
                    <span className="text-slate-400 shrink-0 font-medium">Quick add:</span>
                    <button type="button" onClick={() => handleAddField('text')} className="px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 cursor-pointer font-medium">+ Name</button>
                    <button type="button" onClick={() => handleAddField('email')} className="px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 cursor-pointer font-medium">+ Email</button>
                    <button type="button" onClick={() => handleAddField('tel')} className="px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 cursor-pointer font-medium">+ Phone</button>
                    <button type="button" onClick={() => handleAddField('textarea')} className="px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 cursor-pointer font-medium">+ Message</button>
                    <button type="button" onClick={() => handleAddField('select')} className="px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 cursor-pointer font-medium">+ Dropdown</button>
                </div>

                {formFields.length === 0 ? (
                    <div className="p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2">
                        <FileText className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
                        <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">No fields created yet</div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">
                            Click "+ Add Field" above to start building your form inputs.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-1.5">
                        {formFields.map((field, idx) => {
                            const isSelected = idx === activeIdx;
                            return (
                                <div
                                    key={field.id || idx}
                                    onClick={() => setSelectedFormFieldIndex(idx)}
                                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${isSelected
                                        ? 'border-indigo-500 bg-indigo-500/10 shadow-sm'
                                        : 'border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700'}`}
                                >
                                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                                            {getFieldTypeIcon(field.type)}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-semibold text-xs truncate text-slate-900 dark:text-slate-100">
                                                    {field.label || 'Unnamed Field'}
                                                </span>
                                                {field.required && (
                                                    <span className="text-rose-500 text-xs font-bold leading-none">*</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 text-[9px] text-slate-400">
                                                <span className="uppercase font-mono tracking-wider">{field.type}</span>
                                                <span>•</span>
                                                <span>{field.width === '1/2' ? '50% width' : field.width === '1/3' ? '33% width' : field.width === '1/4' ? '25% width' : 'Full width'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            type="button"
                                            disabled={idx === 0}
                                            onClick={() => moveField(idx, 'up')}
                                            className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${idx === 0 ? 'opacity-30 cursor-not-allowed' : 'text-slate-400 hover:text-slate-200 cursor-pointer'}`}
                                            title="Move Up"
                                        >
                                            <ChevronUp className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            disabled={idx === formFields.length - 1}
                                            onClick={() => moveField(idx, 'down')}
                                            className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${idx === formFields.length - 1 ? 'opacity-30 cursor-not-allowed' : 'text-slate-400 hover:text-slate-200 cursor-pointer'}`}
                                            title="Move Down"
                                        >
                                            <ChevronDown className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeField(idx)}
                                            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-colors"
                                            title="Delete Field"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {activeField && (
                    <div className="p-3.5 rounded-xl border border-indigo-500/30 bg-slate-500/5 space-y-3 pt-3">
                        <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
                            <span className="font-bold text-xs text-indigo-400 flex items-center gap-1.5">
                                {getFieldTypeIcon(activeField.type)}
                                <span>Configure "{activeField.label || 'Field'}"</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                                #{activeIdx + 1}
                            </span>
                        </div>

                        <div>
                            <label className={labelClass}>Field Type</label>
                            <select
                                value={activeField.type}
                                onChange={(e) => updateCurrentField('type', e.target.value)}
                                className={selectClass}
                            >
                                {allFieldTypes.map(({ type, label }) => (
                                    <option key={type} value={type}>{label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className={labelClass}>Field Label</label>
                                <button
                                    type="button"
                                    onClick={() => updateCurrentField('showLabel', activeField.showLabel === false ? true : false)}
                                    className="text-[10px] text-indigo-400 hover:underline cursor-pointer"
                                >
                                    {activeField.showLabel === false ? 'Label Hidden' : 'Label Visible'}
                                </button>
                            </div>
                            <input
                                type="text"
                                value={activeField.label || ''}
                                onChange={(e) => updateCurrentField('label', e.target.value)}
                                placeholder="Field Label"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>
                                Field Name (Form Data Key)
                            </label>
                            <input
                                type="text"
                                value={activeField.name || ''}
                                onChange={(e) => updateCurrentField('name', e.target.value)}
                                placeholder={activeField.label ? activeField.label.toLowerCase().replace(/[^a-z0-9_]/g, '_') : 'field_name'}
                                className={inputClass}
                            />
                            <p className="text-[9px] text-slate-400 mt-0.5">Key used when saving to database and notification emails.</p>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className={labelClass}>Placeholder Text</label>
                                <button
                                    type="button"
                                    onClick={() => updateCurrentField('showPlaceholder', activeField.showPlaceholder === false ? true : false)}
                                    className="text-[10px] text-indigo-400 hover:underline cursor-pointer"
                                >
                                    {activeField.showPlaceholder === false ? 'Hidden' : 'Shown'}
                                </button>
                            </div>
                            <input
                                type="text"
                                value={activeField.placeholder || ''}
                                onChange={(e) => updateCurrentField('placeholder', e.target.value)}
                                placeholder="e.g. Enter your name..."
                                className={inputClass}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>Field Width</label>
                                <select
                                    value={activeField.width || 'full'}
                                    onChange={(e) => updateCurrentField('width', e.target.value)}
                                    className={selectClass}
                                >
                                    <option value="full">Full Width (100%)</option>
                                    <option value="1/2">Half Width (50%)</option>
                                    <option value="1/3">One Third (33%)</option>
                                    <option value="1/4">One Fourth (25%)</option>
                                </select>
                            </div>

                            <div className="flex flex-col justify-end">
                                <label className={labelClass}>Mandatory Field</label>
                                <div className="flex items-center justify-between h-9 px-2 rounded-lg bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Required</span>
                                    <button
                                        type="button"
                                        onClick={() => updateCurrentField('required', !activeField.required)}
                                        className={`w-8 h-4.5 rounded-full transition-colors relative cursor-pointer ${activeField.required ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                                    >
                                        <span className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${activeField.required ? 'left-4' : 'left-0.5'}`}/>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Helper / Subtext (Optional)</label>
                            <input
                                type="text"
                                value={activeField.helperText || ''}
                                onChange={(e) => updateCurrentField('helperText', e.target.value)}
                                placeholder="e.g. We will never share your details."
                                className={inputClass}
                            />
                        </div>

                        {activeField.type === 'textarea' && (
                            <div>
                                <label className={labelClass}>Textarea Rows</label>
                                <input
                                    type="number"
                                    min={2}
                                    max={12}
                                    value={activeField.rows || 4}
                                    onChange={(e) => updateCurrentField('rows', Number(e.target.value))}
                                    className={inputClass}
                                />
                            </div>
                        )}

                        {activeField.type === 'number' && (
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className={labelClass}>Min</label>
                                    <input type="number" value={activeField.min ?? ''} onChange={(e) => updateCurrentField('min', e.target.value ? Number(e.target.value) : undefined)} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Max</label>
                                    <input type="number" value={activeField.max ?? ''} onChange={(e) => updateCurrentField('max', e.target.value ? Number(e.target.value) : undefined)} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Step</label>
                                    <input type="number" value={activeField.step ?? 1} onChange={(e) => updateCurrentField('step', Number(e.target.value))} className={inputClass} />
                                </div>
                            </div>
                        )}

                        {(activeField.type === 'radio' || activeField.type === 'checkbox' || activeField.type === 'select') && (
                            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-[11px] text-slate-900 dark:text-slate-100">Choice Options</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const currOpts = activeField.options || [];
                                            updateCurrentField('options', [...currOpts, `Option ${currOpts.length + 1}`]);
                                        }}
                                        className="text-[10px] font-bold text-indigo-500 hover:text-indigo-400 cursor-pointer"
                                    >
                                        + Add Option
                                    </button>
                                </div>
                                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                                    {(activeField.options || []).map((opt: string, optIdx: number) => (
                                        <div key={optIdx} className="flex items-center gap-1.5">
                                            <input
                                                type="text"
                                                value={opt}
                                                onChange={(e) => {
                                                    const newOpts = [...(activeField.options || [])];
                                                    newOpts[optIdx] = e.target.value;
                                                    updateCurrentField('options', newOpts);
                                                }}
                                                className={`${inputClass} py-1 text-xs`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newOpts = (activeField.options || []).filter((_: any, i: number) => i !== optIdx);
                                                    updateCurrentField('options', newOpts);
                                                }}
                                                className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                            <button
                                type="button"
                                onClick={() => setShowFieldAdvStyling(!showFieldAdvStyling)}
                                className="w-full flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-400 cursor-pointer py-1"
                            >
                                <span>Advanced Field Styling</span>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFieldAdvStyling ? 'rotate-180' : ''}`} />
                            </button>

                             {showFieldAdvStyling && (
                                <div className="space-y-3 pt-2 text-xs">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className={labelClass}>Label Font Size</label>
                                            <input type="number" value={activeField.labelFontSize || 14} onChange={(e) => updateCurrentField('labelFontSize', Number(e.target.value))} className={inputClass} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Label Color</label>
                                            <input type="color" value={activeField.labelColor || (isLight ? '#334155' : '#e2e8f0')} onChange={(e) => updateCurrentField('labelColor', e.target.value)} className="w-full h-8 rounded border-none cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className={labelClass}>Label Weight</label>
                                            <select value={activeField.labelFontWeight || ''} onChange={(e) => updateCurrentField('labelFontWeight', e.target.value || undefined)} className={selectClass}>
                                                <option value="">Default (Global)</option>
                                                <option value="400">Regular (400)</option>
                                                <option value="500">Medium (500)</option>
                                                <option value="600">SemiBold (600)</option>
                                                <option value="700">Bold (700)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Label Position</label>
                                            <select value={activeField.labelPosition || ''} onChange={(e) => updateCurrentField('labelPosition', e.target.value || undefined)} className={selectClass}>
                                                <option value="">Default (Global)</option>
                                                <option value="top">Top</option>
                                                <option value="left">Left (Inline)</option>
                                                <option value="bottom">Bottom</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className={labelClass}>Placeholder Color</label>
                                            <input type="color" value={activeField.placeholderColor || (isLight ? '#94a3b8' : '#64748b')} onChange={(e) => updateCurrentField('placeholderColor', e.target.value)} className="w-full h-8 rounded border-none cursor-pointer" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Subtext Color</label>
                                            <input type="color" value={activeField.helperTextColor || (isLight ? '#64748b' : '#94a3b8')} onChange={(e) => updateCurrentField('helperTextColor', e.target.value)} className="w-full h-8 rounded border-none cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className={labelClass}>Field Background</label>
                                            <input type="color" value={activeField.backgroundColor || (isLight ? '#ffffff' : '#0f172a')} onChange={(e) => updateCurrentField('backgroundColor', e.target.value)} className="w-full h-8 rounded border-none cursor-pointer" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Field Text Color</label>
                                            <input type="color" value={activeField.textColor || (isLight ? '#0f172a' : '#f8fafc')} onChange={(e) => updateCurrentField('textColor', e.target.value)} className="w-full h-8 rounded border-none cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className={labelClass}>Border Color</label>
                                            <input type="color" value={activeField.borderColor || (isLight ? '#cbd5e1' : '#334155')} onChange={(e) => updateCurrentField('borderColor', e.target.value)} className="w-full h-8 rounded border-none cursor-pointer" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Corner Radius</label>
                                            <input type="number" value={activeField.borderRadius ?? 8} onChange={(e) => updateCurrentField('borderRadius', Number(e.target.value))} className={inputClass} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderSubmitContent = () => {
        const successAction = element.formSuccessAction || 'inline';

        return (
            <div className="space-y-4">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-500/5 space-y-3">
                    <div>
                        <span className="font-bold text-xs block text-slate-900 dark:text-slate-100">Submit Button Text</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">Labels for normal and submitting states</span>
                    </div>

                    <div>
                        <label className={labelClass}>Button Text</label>
                        <input
                            type="text"
                            value={element.formSubmitText || 'Send Message'}
                            onChange={(e) => updateProp('formSubmitText', e.target.value)}
                            placeholder="e.g. Send Message, Submit Application"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Submitting / Loading Text</label>
                        <input
                            type="text"
                            value={element.formSubmittingText || 'Sending...'}
                            onChange={(e) => updateProp('formSubmittingText', e.target.value)}
                            placeholder="e.g. Sending..., Processing..."
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Button Alignment</label>
                        <select
                            value={element.formSubmitAlign || 'full'}
                            onChange={(e) => updateProp('formSubmitAlign', e.target.value)}
                            className={selectClass}
                        >
                            <option value="full">Full Width</option>
                            <option value="left">Left Aligned</option>
                            <option value="center">Centered</option>
                            <option value="right">Right Aligned</option>
                        </select>
                    </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-500/5 space-y-3">
                    <div>
                        <span className="font-bold text-xs block text-slate-900 dark:text-slate-100">Post-Submission Action</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">What happens after a visitor submits</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => updateProp('formSuccessAction', 'inline')}
                            className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${successAction === 'inline'
                                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 font-semibold'
                                : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400'}`}
                        >
                            <div className="flex items-center gap-1.5 font-bold text-xs">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Inline Notice</span>
                            </div>
                            <p className="text-[9px] opacity-75 mt-0.5">Show message banner</p>
                        </button>

                        <button
                            type="button"
                            onClick={() => updateProp('formSuccessAction', 'redirect')}
                            className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${successAction === 'redirect'
                                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 font-semibold'
                                : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400'}`}
                        >
                            <div className="flex items-center gap-1.5 font-bold text-xs">
                                <ArrowRight className="w-3.5 h-3.5" />
                                <span>Redirect URL</span>
                            </div>
                            <p className="text-[9px] opacity-75 mt-0.5">Navigate to thank you page</p>
                        </button>
                    </div>

                    {successAction === 'redirect' ? (
                        <div className="space-y-1.5 pt-1">
                            <label className={labelClass}>Destination Redirect URL</label>
                            <input
                                type="text"
                                value={element.formRedirectUrl || ''}
                                onChange={(e) => updateProp('formRedirectUrl', e.target.value)}
                                placeholder="/thank-you or https://example.com/thanks"
                                className={inputClass}
                            />
                        </div>
                    ) : (
                        <div className="space-y-2.5 pt-1">
                            <div>
                                <label className={labelClass}>Success Message</label>
                                <textarea
                                    value={element.formSuccessMessage || 'Thank you! Your message has been sent successfully.'}
                                    onChange={(e) => updateProp('formSuccessMessage', e.target.value)}
                                    rows={2}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Error Message</label>
                                <textarea
                                    value={element.formErrorMessage || 'Something went wrong. Please check your details and try again.'}
                                    onChange={(e) => updateProp('formErrorMessage', e.target.value)}
                                    rows={2}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderNotificationsContent = () => {
        const gmailEnabled = !!element.formNotificationGmailEnabled;
        const telegramEnabled = !!element.formNotificationTelegramEnabled;

        return (
            <div className="space-y-4">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed px-0.5">
                    Toggle preferred notifications on or off. Submissions will automatically use the environment variables configured in your hosting environment with no canvas credential entry needed.
                </div>

                <div className={`p-3.5 rounded-xl border transition-all ${gmailEnabled
                    ? 'border-indigo-500/40 bg-indigo-500/5 dark:bg-indigo-950/20'
                    : 'border-slate-200 dark:border-slate-800/80 bg-slate-500/5'}`}>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${gmailEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                                <Mail className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">Gmail Notification</span>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${gmailEnabled ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                                        {gmailEnabled ? 'ON' : 'OFF'}
                                    </span>
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                                    Uses <code className="font-mono text-[9px] text-indigo-400">GMAIL_USER</code> &amp; <code className="font-mono text-[9px] text-indigo-400">GMAIL_APP_PASSWORD</code>
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => updateProp('formNotificationGmailEnabled', !gmailEnabled)}
                            className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${gmailEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                            title={gmailEnabled ? 'Disable Gmail notifications' : 'Enable Gmail notifications'}
                        >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${gmailEnabled ? 'left-5' : 'left-1'}`}/>
                        </button>
                    </div>
                    {gmailEnabled && (
                        <div className="mt-2.5 pt-2.5 border-t border-indigo-500/15 text-[10px] text-indigo-400/90 leading-relaxed">
                            ✓ When visitors submit this form, a full summary email will be sent to your <code className="font-mono">GMAIL_USER</code> address automatically.
                        </div>
                    )}
                </div>

                <div className={`p-3.5 rounded-xl border transition-all ${telegramEnabled
                    ? 'border-sky-500/40 bg-sky-500/5 dark:bg-sky-950/20'
                    : 'border-slate-200 dark:border-slate-800/80 bg-slate-500/5'}`}>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${telegramEnabled ? 'bg-sky-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                                <Globe className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">Telegram Notification</span>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${telegramEnabled ? 'bg-sky-500/20 text-sky-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                                        {telegramEnabled ? 'ON' : 'OFF'}
                                    </span>
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                                    Uses <code className="font-mono text-[9px] text-sky-400">TELEGRAM_BOT_TOKEN</code> &amp; <code className="font-mono text-[9px] text-sky-400">TELEGRAM_CHAT_ID</code>
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => updateProp('formNotificationTelegramEnabled', !telegramEnabled)}
                            className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${telegramEnabled ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                            title={telegramEnabled ? 'Disable Telegram notifications' : 'Enable Telegram notifications'}
                        >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${telegramEnabled ? 'left-5' : 'left-1'}`}/>
                        </button>
                    </div>
                    {telegramEnabled && (
                        <div className="mt-2.5 pt-2.5 border-t border-sky-500/15 text-[10px] text-sky-400/90 leading-relaxed">
                            ✓ Instant notification alerts will be sent directly to your Telegram chat upon each submission.
                        </div>
                    )}
                </div>

                <div className="p-3 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-[10px] text-emerald-500 dark:text-emerald-400">
                        <span>●</span>
                        <span>Secure Environment Variables Connected</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        The toggle switch on/off enables the notifications in your published code. Credentials stay safely in your hosting provider configuration and are never exposed in public HTML.
                    </p>
                </div>
            </div>
        );
    };

    const renderStyleTab = () => {
        return (
            <div className="space-y-4">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <span className="font-bold text-[11px] block text-slate-900 dark:text-slate-100">Global Field Design</span>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className={labelClass}>Field Background</label>
                            <div className="flex gap-2">
                                <input type="color" value={s.fieldBackgroundColor || (isLight ? '#ffffff' : '#0f172a')} onChange={(e) => updateStyle('fieldBackgroundColor', e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer" />
                                <input type="text" value={s.fieldBackgroundColor || ''} onChange={(e) => updateStyle('fieldBackgroundColor', e.target.value)} placeholder="Hex" className={inputClass} />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Text Color</label>
                            <div className="flex gap-2">
                                <input type="color" value={s.fieldTextColor || (isLight ? '#0f172a' : '#f8fafc')} onChange={(e) => updateStyle('fieldTextColor', e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer" />
                                <input type="text" value={s.fieldTextColor || ''} onChange={(e) => updateStyle('fieldTextColor', e.target.value)} placeholder="Hex" className={inputClass} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className={labelClass}>Border Color</label>
                            <input type="color" value={s.fieldBorderColor || (isLight ? '#cbd5e1' : '#334155')} onChange={(e) => updateStyle('fieldBorderColor', e.target.value)} className="w-full h-8 rounded border-none cursor-pointer" />
                        </div>
                        <div>
                            <label className={labelClass}>Border Radius</label>
                            <input type="number" value={s.fieldBorderRadius ?? 8} onChange={(e) => updateStyle('fieldBorderRadius', Number(e.target.value))} className={inputClass} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className={labelClass}>Border Width</label>
                            <input type="number" value={s.fieldBorderWidth ?? 1} onChange={(e) => updateStyle('fieldBorderWidth', Number(e.target.value))} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Font Size</label>
                            <input type="number" value={s.fieldFontSize ?? 14} onChange={(e) => updateStyle('fieldFontSize', Number(e.target.value))} className={inputClass} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className={labelClass}>Padding X</label>
                            <input type="number" value={s.fieldPaddingX ?? 14} onChange={(e) => updateStyle('fieldPaddingX', Number(e.target.value))} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Padding Y</label>
                            <input type="number" value={s.fieldPaddingY ?? 10} onChange={(e) => updateStyle('fieldPaddingY', Number(e.target.value))} className={inputClass} />
                        </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2">
                        <span className="text-[10px] font-bold text-indigo-400 block">Global Label Styling</span>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className={labelClass}>Label Color</label>
                                <div className="flex gap-2">
                                    <input type="color" value={s.labelColor || (isLight ? '#334155' : '#e2e8f0')} onChange={(e) => updateStyle('labelColor', e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer" />
                                    <input type="text" value={s.labelColor || ''} onChange={(e) => updateStyle('labelColor', e.target.value)} placeholder="Hex" className={inputClass} />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Label Font Size</label>
                                <input type="number" value={s.labelFontSize ?? 13} onChange={(e) => updateStyle('labelFontSize', Number(e.target.value))} className={inputClass} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className={labelClass}>Label Weight</label>
                                <select value={s.labelFontWeight || '600'} onChange={(e) => updateStyle('labelFontWeight', e.target.value)} className={selectClass}>
                                    <option value="400">Regular (400)</option>
                                    <option value="500">Medium (500)</option>
                                    <option value="600">SemiBold (600)</option>
                                    <option value="700">Bold (700)</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Label Position</label>
                                <select value={s.labelPosition || 'top'} onChange={(e) => updateStyle('labelPosition', e.target.value)} className={selectClass}>
                                    <option value="top">Top</option>
                                    <option value="left">Left (Inline)</option>
                                    <option value="bottom">Bottom</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2">
                        <span className="text-[10px] font-bold text-indigo-400 block">Global Placeholder Styling</span>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className={labelClass}>Placeholder Color</label>
                                <div className="flex gap-2">
                                    <input type="color" value={s.placeholderColor || (isLight ? '#94a3b8' : '#64748b')} onChange={(e) => updateStyle('placeholderColor', e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer" />
                                    <input type="text" value={s.placeholderColor || ''} onChange={(e) => updateStyle('placeholderColor', e.target.value)} placeholder="Hex" className={inputClass} />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Font Size</label>
                                <input type="number" value={s.placeholderFontSize ?? 13} onChange={(e) => updateStyle('placeholderFontSize', Number(e.target.value))} className={inputClass} />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2">
                        <span className="text-[10px] font-bold text-indigo-400 block">Global Subtext / Helper Styling</span>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className={labelClass}>Subtext Color</label>
                                <div className="flex gap-2">
                                    <input type="color" value={s.helperTextColor || (isLight ? '#64748b' : '#94a3b8')} onChange={(e) => updateStyle('helperTextColor', e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer" />
                                    <input type="text" value={s.helperTextColor || ''} onChange={(e) => updateStyle('helperTextColor', e.target.value)} placeholder="Hex" className={inputClass} />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Font Size</label>
                                <input type="number" value={s.helperTextFontSize ?? 11} onChange={(e) => updateStyle('helperTextFontSize', Number(e.target.value))} className={inputClass} />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                        <span className="text-[10px] font-bold text-indigo-400 block mb-2">Focus &amp; Hover States</span>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className={labelClass}>Focus Border</label>
                                <input type="color" value={s.focusBorderColor || '#6366f1'} onChange={(e) => updateStyle('focusBorderColor', e.target.value)} className="w-full h-8 rounded border-none cursor-pointer" />
                            </div>
                            <div>
                                <label className={labelClass}>Focus Ring</label>
                                <input type="color" value={s.focusRingColor || 'rgba(99, 102, 241, 0.4)'} onChange={(e) => updateStyle('focusRingColor', e.target.value)} className="w-full h-8 rounded border-none cursor-pointer" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                                <label className={labelClass}>Hover Border</label>
                                <input type="color" value={s.fieldHoverBorderColor || ''} onChange={(e) => updateStyle('fieldHoverBorderColor', e.target.value)} className="w-full h-8 rounded border-none cursor-pointer" />
                            </div>
                            <div>
                                <label className={labelClass}>Hover BG</label>
                                <input type="color" value={s.fieldHoverBackgroundColor || ''} onChange={(e) => updateStyle('fieldHoverBackgroundColor', e.target.value)} className="w-full h-8 rounded border-none cursor-pointer" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <span className="font-bold text-[11px] block text-slate-900 dark:text-slate-100">Submit Button Design</span>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className={labelClass}>Button BG</label>
                            <input type="color" value={element.formSubmitBgColor || '#4f46e5'} onChange={(e) => updateProp('formSubmitBgColor', e.target.value)} className="w-full h-8 rounded border-none cursor-pointer" />
                        </div>
                        <div>
                            <label className={labelClass}>Button Text</label>
                            <input type="color" value={element.formSubmitTextColor || '#ffffff'} onChange={(e) => updateProp('formSubmitTextColor', e.target.value)} className="w-full h-8 rounded border-none cursor-pointer" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className={labelClass}>Corner Radius</label>
                            <input type="number" value={element.formSubmitBorderRadius ?? 8} onChange={(e) => updateProp('formSubmitBorderRadius', Number(e.target.value))} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Font Size</label>
                            <input type="number" value={element.formSubmitFontSize || 14} onChange={(e) => updateProp('formSubmitFontSize', Number(e.target.value))} className={inputClass} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className={labelClass}>Font Weight</label>
                            <select value={element.formSubmitFontWeight || '600'} onChange={(e) => updateProp('formSubmitFontWeight', e.target.value)} className={selectClass}>
                                <option value="400">Regular</option>
                                <option value="500">Medium</option>
                                <option value="600">SemiBold</option>
                                <option value="700">Bold</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Border Width</label>
                            <input type="number" value={element.formSubmitBorderWidth ?? 0} onChange={(e) => updateProp('formSubmitBorderWidth', Number(e.target.value))} className={inputClass} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className={labelClass}>Padding X</label>
                            <input type="number" value={element.formSubmitPaddingX ?? 24} onChange={(e) => updateProp('formSubmitPaddingX', Number(e.target.value))} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Padding Y</label>
                            <input type="number" value={element.formSubmitPaddingY ?? 12} onChange={(e) => updateProp('formSubmitPaddingY', Number(e.target.value))} className={inputClass} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className={labelClass}>Hover BG</label>
                            <input type="color" value={element.formSubmitHoverBgColor || '#4338ca'} onChange={(e) => updateProp('formSubmitHoverBgColor', e.target.value)} className="w-full h-8 rounded border-none cursor-pointer" />
                        </div>
                        <div>
                            <label className={labelClass}>Hover Text</label>
                            <input type="color" value={element.formSubmitHoverTextColor || '#ffffff'} onChange={(e) => updateProp('formSubmitHoverTextColor', e.target.value)} className="w-full h-8 rounded border-none cursor-pointer" />
                        </div>
                    </div>
                </div>

                <BackgroundController styles={s} onChange={(bgUpdates) => updateProp('styles', { ...s, ...bgUpdates })} uiTheme={uiTheme}/>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={labelClass}>Container Radius</label>
                        <input type="number" value={s.borderRadius ?? 16} onChange={(e) => updateStyle('borderRadius', Number(e.target.value))} className={inputClass}/>
                    </div>
                    <div>
                        <label className={labelClass}>Border Width</label>
                        <input type="number" value={s.borderWidth ?? 1} onChange={(e) => updateStyle('borderWidth', Number(e.target.value))} className={inputClass}/>
                    </div>
                </div>
            </div>
        );
    };

    const renderLayoutTab = () => {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={labelClass}>Gap Between Fields (px)</label>
                        <input type="number" value={s.gap ?? 16} onChange={(e) => updateStyle('gap', Number(e.target.value))} className={inputClass}/>
                    </div>
                    <div>
                        <label className={labelClass}>Container Padding (px)</label>
                        <input type="number" value={s.padding ?? 24} onChange={(e) => updateStyle('padding', Number(e.target.value))} className={inputClass}/>
                    </div>
                </div>
            </div>
        );
    };

    return (
      <div className={`space-y-4 p-4 text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
        <div className={`flex border-b pb-2 gap-2 overflow-x-auto ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          {[
            { id: 'content', label: 'Content' },
            { id: 'style', label: 'Style' },
            { id: 'layout', label: 'Layout' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'content' && (
          <div className={`flex items-center gap-1 p-1 rounded-xl mb-3 ${boxGroupClass}`}>
            <button
              type="button"
              onClick={() => setContentSubTab('general')}
              className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${contentSubTab === 'general'
                ? 'bg-indigo-600 text-white shadow-sm'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              General
            </button>
            <button
              type="button"
              onClick={() => setContentSubTab('fields')}
              className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${contentSubTab === 'fields'
                ? 'bg-indigo-600 text-white shadow-sm'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              Fields
            </button>
            <button
              type="button"
              onClick={() => setContentSubTab('submit')}
              className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${contentSubTab === 'submit'
                ? 'bg-indigo-600 text-white shadow-sm'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              Submit &amp; Actions
            </button>
            <button
              type="button"
              onClick={() => setContentSubTab('notifications')}
              className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${contentSubTab === 'notifications'
                ? 'bg-indigo-600 text-white shadow-sm'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              Notifications
            </button>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-4">
            {contentSubTab === 'general' && renderGeneralContent()}
            {contentSubTab === 'fields' && renderFieldsContent()}
            {contentSubTab === 'submit' && renderSubmitContent()}
            {contentSubTab === 'notifications' && renderNotificationsContent()}
          </div>
        )}

        {activeTab === 'style' && renderStyleTab()}
        {activeTab === 'layout' && renderLayoutTab()}
      </div>
    );
};
