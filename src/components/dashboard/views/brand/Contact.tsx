import React from 'react';
import { Mail, Phone, Plus, Trash2, Globe } from 'lucide-react';
import { BrandInfo } from '../../../../services/brandInfoService';
import { Input } from '../../../common';

interface ContactProps {
  brandInfo: BrandInfo;
  onChange: (field: keyof BrandInfo, value: any) => void;
  isLight: boolean;
}

export const Contact: React.FC<ContactProps> = ({
  brandInfo,
  onChange,
  isLight,
}) => {
  const emailsList = brandInfo.emails || (brandInfo.email ? [{ id: '1', label: 'Primary', email: brandInfo.email }] : []);
  const phonesList = brandInfo.phones || (brandInfo.phone ? [{ id: '1', label: 'Main', phone: brandInfo.phone }] : []);

  const handleAddEmail = () => {
    const updated = [...emailsList, { id: `email_${Date.now()}`, label: 'Support', email: '' }];
    onChange('emails', updated);
  };

  const handleUpdateEmail = (id: string, field: 'label' | 'email', value: string) => {
    const updated = emailsList.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    onChange('emails', updated);
    if (updated[0]?.email) onChange('email', updated[0].email);
  };

  const handleRemoveEmail = (id: string) => {
    const updated = emailsList.filter((item) => item.id !== id);
    onChange('emails', updated);
    onChange('email', updated[0]?.email || '');
  };

  const handleAddPhone = () => {
    const updated = [...phonesList, { id: `phone_${Date.now()}`, label: 'Office', phone: '' }];
    onChange('phones', updated);
  };

  const handleUpdatePhone = (id: string, field: 'label' | 'phone', value: string) => {
    const updated = phonesList.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    onChange('phones', updated);
    if (updated[0]?.phone) onChange('phone', updated[0].phone);
  };

  const handleRemovePhone = (id: string) => {
    const updated = phonesList.filter((item) => item.id !== id);
    onChange('phones', updated);
    onChange('phone', updated[0]?.phone || '');
  };

  return (
    <div className="space-y-6">
      {/* Emails */}
      <div
        className={`p-5 sm:p-6 rounded-2xl border space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-500" />
              <span>Contact Emails</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Public contact and customer support email addresses.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddEmail}
            className="px-3 py-1.5 rounded-lg border text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Email</span>
          </button>
        </div>

        <div className="space-y-3">
          {emailsList.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <input
                type="text"
                value={item.label}
                onChange={(e) => handleUpdateEmail(item.id, 'label', e.target.value)}
                placeholder="Label (e.g. Sales)"
                className={`w-28 px-3 py-2 rounded-xl border text-xs outline-none ${
                  isLight ? 'border-slate-200 bg-white' : 'border-slate-700 bg-slate-950 text-slate-100'
                }`}
              />
              <input
                type="email"
                value={item.email}
                onChange={(e) => handleUpdateEmail(item.id, 'email', e.target.value)}
                placeholder="support@example.com"
                className={`flex-1 px-3 py-2 rounded-xl border text-xs outline-none ${
                  isLight ? 'border-slate-200 bg-white' : 'border-slate-700 bg-slate-950 text-slate-100'
                }`}
              />
              <button
                type="button"
                onClick={() => handleRemoveEmail(item.id)}
                className="p-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                title="Remove email"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Phones */}
      <div
        className={`p-5 sm:p-6 rounded-2xl border space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Phone className="w-4 h-4 text-indigo-500" />
              <span>Telephone Numbers</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Office lines, direct telephone numbers, or toll-free hotlines.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddPhone}
            className="px-3 py-1.5 rounded-lg border text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Phone</span>
          </button>
        </div>

        <div className="space-y-3">
          {phonesList.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <input
                type="text"
                value={item.label}
                onChange={(e) => handleUpdatePhone(item.id, 'label', e.target.value)}
                placeholder="Label (e.g. Office)"
                className={`w-28 px-3 py-2 rounded-xl border text-xs outline-none ${
                  isLight ? 'border-slate-200 bg-white' : 'border-slate-700 bg-slate-950 text-slate-100'
                }`}
              />
              <input
                type="tel"
                value={item.phone}
                onChange={(e) => handleUpdatePhone(item.id, 'phone', e.target.value)}
                placeholder="+1 (555) 000-0000"
                className={`flex-1 px-3 py-2 rounded-xl border text-xs outline-none ${
                  isLight ? 'border-slate-200 bg-white' : 'border-slate-700 bg-slate-950 text-slate-100'
                }`}
              />
              <button
                type="button"
                onClick={() => handleRemovePhone(item.id)}
                className="p-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                title="Remove phone"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Address & Website */}
      <div
        className={`p-5 sm:p-6 rounded-2xl border space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div className="border-b pb-3 border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            <span>Physical Location & Website</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Official Website URL"
            type="url"
            value={brandInfo.website || ''}
            onChange={(e) => onChange('website', e.target.value)}
            placeholder="https://example.com"
            variant="pill"
            isLight={isLight}
          />

          <Input
            label="Headquarters Location / Address"
            type="text"
            value={brandInfo.address || ''}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder="e.g. 100 Main St, San Francisco, CA"
            variant="pill"
            isLight={isLight}
          />
        </div>
      </div>
    </div>
  );
};
