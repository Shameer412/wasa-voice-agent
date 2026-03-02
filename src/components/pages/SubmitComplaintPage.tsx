import React, { useState, useEffect } from 'react';
import {
  User, Phone, MapPin, Tag, FileText, Users, CheckCircle,
  Droplets, AlertTriangle, Zap, Copy, ArrowLeft
} from 'lucide-react';
import { Category, ComplaintSubmission } from '../../types';
import { lahoreAreas } from '../../data/mockData';

interface SubmitComplaintPageProps {
  onSubmit: (complaint: ComplaintSubmission) => string;
  onBack: () => void;
}

const categories: { value: Category; label: string; icon: string; desc: string }[] = [
  { value: 'no-water', label: 'No Water Supply', icon: '🚱', desc: 'Complete outage or severe shortage' },
  { value: 'dirty-water', label: 'Dirty / Contaminated', icon: '🤢', desc: 'Brown, cloudy, or smelly water' },
  { value: 'pipe-burst', label: 'Pipe Burst', icon: '💥', desc: 'Leaking or burst underground pipe' },
  { value: 'sewerage', label: 'Sewerage Issue', icon: '🚧', desc: 'Overflow, blockage, or bad smell' },
  { value: 'billing', label: 'Billing Issue', icon: '📄', desc: 'Wrong bill or payment dispute' },
  { value: 'other', label: 'Other', icon: '❓', desc: 'Any other water-related issue' },
];

const calcAIScore = (form: Partial<ComplaintSubmission>): number => {
  let score = 10;
  if (form.category === 'pipe-burst') score += 40;
  else if (form.category === 'no-water') score += 30;
  else if (form.category === 'dirty-water') score += 35;
  else if (form.category === 'sewerage') score += 20;
  else if (form.category === 'billing') score += 5;

  const desc = (form.description || '').toLowerCase();
  if (desc.includes('hospital') || desc.includes('school')) score += 20;
  if (desc.includes('children') || desc.includes('elderly')) score += 15;
  if (desc.includes('electric') || desc.includes('wire')) score += 20;
  if (desc.includes('flood') || desc.includes('road')) score += 10;

  const hh = form.householdsAffected || 0;
  if (hh > 20) score += 15;
  else if (hh > 10) score += 10;
  else if (hh > 5) score += 5;

  return Math.min(score, 99);
};

const getPriority = (score: number) => {
  if (score >= 80) return { label: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30' };
  if (score >= 60) return { label: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-500/15 border-orange-500/30' };
  if (score >= 40) return { label: 'MEDIUM', color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/30' };
  return { label: 'LOW', color: 'text-zinc-400', bg: 'bg-zinc-500/15 border-zinc-500/30' };
};

export const SubmitComplaintPage: React.FC<SubmitComplaintPageProps> = ({ onSubmit, onBack }) => {
  const [form, setForm] = useState<Partial<ComplaintSubmission>>({
    householdsAffected: 1,
  });
  const [aiScore, setAiScore] = useState(10);
  const [submitted, setSubmitted] = useState(false);
  const [ticketNo, setTicketNo] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setAiScore(calcAIScore(form));
  }, [form]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.callerName?.trim()) e.callerName = 'Name is required';
    if (!form.phone?.trim()) e.phone = 'Phone number is required';
    if (!form.area) e.area = 'Area is required';
    if (!form.category) e.category = 'Category is required';
    if (!form.description?.trim() || form.description.length < 20) e.description = 'Please describe the issue (min 20 characters)';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    const no = onSubmit(form as ComplaintSubmission);
    setTicketNo(no);
    setSubmitted(true);
    setSubmitting(false);
  };

  const priority = getPriority(aiScore);

  if (submitted) {
    return (
      <div className="flex-1 overflow-y-auto custom-scrollbar flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center animate-fadeScaleIn">
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 animate-float">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Complaint Registered!</h2>
          <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
            آپ کی شکایت کامیابی سے درج ہو گئی ہے۔ ہمارا AI سسٹم نے اسے تجزیہ کیا ہے۔
          </p>

          <div className="glass-panel rounded-2xl p-6 mb-6 text-left space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Ticket Number</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-cyan-400 text-lg">{ticketNo}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(ticketNo)}
                  className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">AI Priority</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${priority.bg} ${priority.color}`}>
                {priority.label}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">AI Score</span>
              <span className="text-white font-semibold">{aiScore}/100</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Status</span>
              <span className="text-emerald-400 text-sm font-medium">Queued for Assignment</span>
            </div>
          </div>

          <p className="text-xs text-zinc-500 mb-6">
            آپ کو SMS کے ذریعے اپڈیٹس ملتے رہیں گے۔ WASA helpline: <span className="text-cyan-400">1334</span>
          </p>

          <button
            onClick={onBack}
            className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/25 transition-all font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8 animate-slideInUp">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Submit a Water Complaint</h1>
              <p className="text-sm text-zinc-400">پانی کی شکایت درج کریں — شکایت درج کرنے کے بعد ٹکٹ نمبر ملے گا</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-5">

              {/* Personal Info */}
              <div className="glass-panel rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-400" /> Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Full Name / نام <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        value={form.callerName || ''}
                        onChange={e => { setForm(f => ({...f, callerName: e.target.value})); setErrors(er => ({...er, callerName: ''})); }}
                        placeholder="Muhammad Ali"
                        className={`w-full bg-white/5 border rounded-lg pl-9 pr-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-cyan-500/60 focus:bg-white/8 transition-all ${errors.callerName ? 'border-red-500/50' : 'border-white/8'}`}
                      />
                    </div>
                    {errors.callerName && <p className="text-red-400 text-xs mt-1">{errors.callerName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Phone / فون <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="tel"
                        value={form.phone || ''}
                        onChange={e => { setForm(f => ({...f, phone: e.target.value})); setErrors(er => ({...er, phone: ''})); }}
                        placeholder="0300-1234567"
                        className={`w-full bg-white/5 border rounded-lg pl-9 pr-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-cyan-500/60 focus:bg-white/8 transition-all ${errors.phone ? 'border-red-500/50' : 'border-white/8'}`}
                      />
                    </div>
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="glass-panel rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" /> Location / علاقہ
                </h3>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                  <select
                    value={form.area || ''}
                    onChange={e => { setForm(f => ({...f, area: e.target.value})); setErrors(er => ({...er, area: ''})); }}
                    className={`w-full bg-white/5 border rounded-lg pl-9 pr-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500/60 transition-all appearance-none ${errors.area ? 'border-red-500/50' : 'border-white/8'}`}
                  >
                    <option value="" className="bg-zinc-900">Select your area in Lahore...</option>
                    {lahoreAreas.map(a => (
                      <option key={a} value={a} className="bg-zinc-900">{a}</option>
                    ))}
                  </select>
                </div>
                {errors.area && <p className="text-red-400 text-xs mt-1">{errors.area}</p>}
              </div>

              {/* Category */}
              <div className="glass-panel rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-cyan-400" /> Complaint Type / شکایت کی نوعیت <span className="text-red-400">*</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map(cat => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => { setForm(f => ({...f, category: cat.value})); setErrors(er => ({...er, category: ''})); }}
                      className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all text-center ${
                        form.category === cat.value
                          ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300'
                          : 'bg-white/3 border-white/8 text-zinc-400 hover:border-white/15 hover:text-zinc-300'
                      }`}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-xs font-semibold leading-tight">{cat.label}</span>
                      <span className="text-[10px] text-zinc-500 leading-tight">{cat.desc}</span>
                      {form.category === cat.value && (
                        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-cyan-500 flex items-center justify-center">
                          <CheckCircle className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {errors.category && <p className="text-red-400 text-xs mt-2">{errors.category}</p>}
              </div>

              {/* Description */}
              <div className="glass-panel rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" /> Description / تفصیل <span className="text-red-400">*</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Households Affected / متاثرہ گھر</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="number"
                        min="1"
                        max="500"
                        value={form.householdsAffected || 1}
                        onChange={e => setForm(f => ({...f, householdsAffected: parseInt(e.target.value) || 1}))}
                        className="w-full bg-white/5 border border-white/8 rounded-lg pl-9 pr-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500/60 transition-all"
                      />
                    </div>
                  </div>
                </div>
                <textarea
                  value={form.description || ''}
                  onChange={e => { setForm(f => ({...f, description: e.target.value})); setErrors(er => ({...er, description: ''})); }}
                  placeholder="Describe the issue in detail / مسئلے کی تفصیل بتائیں — آپ اردو یا انگریزی میں لکھ سکتے ہیں..."
                  rows={5}
                  className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-cyan-500/60 focus:bg-white/8 transition-all resize-none custom-scrollbar ${errors.description ? 'border-red-500/50' : 'border-white/8'}`}
                />
                {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
                <div className="flex justify-end mt-1">
                  <span className="text-[10px] text-zinc-600 font-mono">{(form.description || '').length} chars</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Registering Complaint...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" /> Submit Complaint / شکایت درج کریں
                  </>
                )}
              </button>
            </div>

            {/* Right: AI Score Panel */}
            <div className="space-y-4">
              <div className="glass-panel rounded-2xl p-5 sticky top-4">
                <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" /> AI Analysis
                </h3>

                {/* Score ring */}
                <div className="flex flex-col items-center mb-5">
                  <div className="relative w-24 h-24 mb-3">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                      <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" />
                      <circle
                        cx="48" cy="48" r="40"
                        stroke={aiScore >= 80 ? '#ef4444' : aiScore >= 60 ? '#f97316' : aiScore >= 40 ? '#eab308' : '#71717a'}
                        strokeWidth="8" fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - aiScore / 100)}`}
                        style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-white">{aiScore}</span>
                      <span className="text-[9px] text-zinc-500 font-mono">AI Score</span>
                    </div>
                  </div>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full border ${priority.bg} ${priority.color}`}>
                    {priority.label} PRIORITY
                  </span>
                </div>

                {/* Score factors */}
                <div className="space-y-2.5">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Scoring Factors</p>
                  {[
                    { label: 'Category Risk', val: form.category ? 'Set' : 'Pending', done: !!form.category },
                    { label: 'Location', val: form.area || 'Pending', done: !!form.area },
                    { label: 'Households', val: form.householdsAffected ? `${form.householdsAffected} homes` : '1 home', done: true },
                    { label: 'Description', val: form.description ? `${form.description.length} chars` : 'Empty', done: (form.description?.length || 0) >= 20 },
                  ].map(factor => (
                    <div key={factor.label} className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">{factor.label}</span>
                      <span className={factor.done ? 'text-emerald-400' : 'text-zinc-600'}>{factor.val}</span>
                    </div>
                  ))}
                </div>

                {aiScore >= 80 && (
                  <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-300 leading-relaxed">
                      High-severity complaint — ERT team will be notified immediately upon submission.
                    </p>
                  </div>
                )}
              </div>

              <div className="glass-panel rounded-2xl p-4 text-center">
                <p className="text-xs text-zinc-500 leading-relaxed">
                  You can also call WASA 24/7 helpline at <span className="text-cyan-400 font-bold">1334</span>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
