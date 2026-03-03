"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Briefcase, Star, Download, Sparkles, Wand2, 
  CheckCircle2, ArrowRight, ArrowLeft, Mail, Phone, MapPin, Globe, 
  Cpu, Camera, Trash2, Send, RotateCcw, Eye, X, Layout as LayoutIcon
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// ─────────────────────────────────────────────
// TYPES & INITIAL STATE
// ─────────────────────────────────────────────

interface CVData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  birthDate: string;
  profileImage: string | null;
  summary: string;
  experience: { company: string; role: string; period: string; desc: string }[];
  skills: string[];
  languages: string[];
  template: 'modern-pink' | 'creative-blue' | 'classic-light';
}

const INITIAL_STATE: CVData = {
  fullName: '', jobTitle: '', email: '', phone: '', location: '', birthDate: '',
  profileImage: null, summary: '',
  experience: [{ company: '', role: '', period: '', desc: '' }],
  skills: [], languages: [],
  template: 'modern-pink',
};

const STEPS = [
  { id: 'template', title: 'Modèle', icon: LayoutIcon },
  { id: 'identity', title: 'Identité', icon: User },
  { id: 'objective', title: 'Profil', icon: Sparkles },
  { id: 'experience', title: 'Parcours', icon: Briefcase },
  { id: 'extra', title: 'Skills', icon: Star },
  { id: 'preview', title: 'Envoi', icon: Download },
];

export default function CVGenerator() {
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [targetEmail, setTargetEmail] = useState('');
  const [data, setData] = useState<CVData>(INITIAL_STATE);

  const cvRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (field: keyof CVData, value: any) => setData(prev => ({ ...prev, [field]: value }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setData(prev => ({ ...prev, profileImage: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const resetAll = () => {
    setData(INITIAL_STATE);
    setStep(0);
    setShowEmailInput(false);
    setTargetEmail('');
  };

  const generatePDFBlob = async () => {
    if (!cvRef.current) return null;
    const element = cvRef.current;
    await new Promise(resolve => setTimeout(resolve, 1000));
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,
      height: 1123,
    });
    return canvas.toDataURL('image/jpeg', 0.95);
  };

  const downloadPDF = async () => {
    setIsGenerating(true);
    try {
      const imgData = await generatePDFBlob();
      if (!imgData) throw new Error("Capture échouée");
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      pdf.save(`CV_KORIA_${data.fullName.replace(/\s+/g, '_') || '2026'}.pdf`);
      setTimeout(resetAll, 3000);
    } catch (e) { 
      alert("Erreur PDF. Réessayez avec une photo moins lourde."); 
    }
    setIsGenerating(false);
  };

  const sendEmail = async () => {
    if (!targetEmail) return alert("Veuillez entrer un email.");
    setIsSending(true);
    try {
      const imgData = await generatePDFBlob();
      if (!imgData) throw new Error("Erreur capture");
      const response = await fetch('/api/send-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, fullName: data.fullName, pdfBase64: imgData }),
      });
      if (response.ok) {
        alert("CV envoyé avec succès !");
        resetAll();
      } else {
        throw new Error("Erreur serveur");
      }
    } catch (e) {
      alert("Erreur d'envoi. Vérifiez votre configuration SMTP sur Vercel.");
    }
    setIsSending(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 relative text-left">
      <button onClick={() => setShowMobilePreview(true)} className="lg:hidden fixed bottom-6 right-6 z-50 bg-indigo-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 font-black text-xs uppercase tracking-widest"><Eye className="w-5 h-5" /> Aperçu</button>

      <div className="flex justify-between mb-10 relative overflow-x-auto pb-4 scrollbar-hide">
        <div className="absolute top-4 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 hidden md:block" />
        {STEPS.map((s, i) => (
          <div key={s.id} className="relative z-10 flex flex-col items-center gap-2 min-w-[70px]">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${i <= step ? 'bg-indigo-600 text-white shadow-lg' : 'bg-[#1a2333] text-gray-600'}`}><s.icon className="w-4 h-4" /></div>
            <span className={`text-[8px] font-black uppercase tracking-tighter ${i <= step ? 'text-indigo-400' : 'text-gray-600'}`}>{s.title}</span>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div className="bg-[#111b2e] border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h3 className="text-2xl font-black text-white">Style du CV</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[{ id: 'modern-pink', label: 'Pink', color: 'bg-pink-500' }, { id: 'creative-blue', label: 'Blue', color: 'bg-teal-500' }, { id: 'classic-light', label: 'Light', color: 'bg-indigo-400' }].map((t) => (
                    <button key={t.id} onClick={() => handleInputChange('template', t.id)} className={`p-2 rounded-xl border-2 transition-all ${data.template === t.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-white/5'}`}>
                      <div className={`aspect-[3/4] ${t.color} rounded-lg mb-2 opacity-30`} /><span className="text-[10px] font-black uppercase text-white">{t.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="relative w-16 h-16 rounded-xl bg-[#1a2333] border border-white/20 flex items-center justify-center overflow-hidden shrink-0">
                    {data.profileImage ? <img src={data.profileImage} alt="P" className="w-full h-full object-cover" /> : <Camera className="w-6 h-6 text-gray-600" />}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  <div><label className="text-[10px] font-black uppercase text-white tracking-widest block">Votre Photo</label><p className="text-[9px] text-gray-500">Cliquez pour charger</p></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                  <Input label="Nom Complet" value={data.fullName} onChange={v => handleInputChange('fullName', v)} />
                  <Input label="Métier" value={data.jobTitle} onChange={v => handleInputChange('jobTitle', v)} />
                  <Input label="Email" value={data.email} onChange={v => handleInputChange('email', v)} />
                  <Input label="Téléphone" value={data.phone} onChange={v => handleInputChange('phone', v)} />
                </div>
              </motion.div>
            )}

            {step === 2 && (<motion.div key="step2" className="space-y-4"><h3 className="text-xl font-black">Résumé</h3><Input label="Votre force en 2 lignes" value={data.summary} onChange={v => handleInputChange('summary', v)} isTextArea /></motion.div>)}
            {step === 3 && (<motion.div key="step3" className="space-y-4"><h3 className="text-xl font-black">Dernière Expérience</h3><div className="p-4 border border-white/5 rounded-xl space-y-3 bg-white/[0.02]"><Input label="Entreprise" value={data.experience[0].company} onChange={v => { const n = [...data.experience]; n[0].company = v; setData(p => ({...p, experience: n})); }} /><Input label="Poste" value={data.experience[0].role} onChange={v => { const n = [...data.experience]; n[0].role = v; setData(p => ({...p, experience: n})); }} /></div></motion.div>)}
            {step === 4 && (<motion.div key="step4" className="space-y-6"><h3 className="text-xl font-black">Compétences</h3><div className="flex flex-wrap gap-2">{['Autonomie', 'Rigueur', 'IA Tools', 'Management'].map(s => (<button key={s} onClick={() => { const newList = data.skills.includes(s) ? data.skills.filter(x => x !== s) : [...data.skills, s]; setData(p => ({...p, skills: newList})); }} className={`px-4 py-2 rounded-full text-[10px] font-bold border ${data.skills.includes(s) ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-500'}`}>{s}</button>))}</div></motion.div>)}

            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 py-6">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 className="w-10 h-10 text-emerald-400" /></div>
                <h3 className="text-3xl font-black text-white uppercase">Terminé !</h3>
                {!showEmailInput ? (
                  <div className="grid gap-3">
                    <button onClick={downloadPDF} disabled={isGenerating} className="w-full py-4 bg-white text-black rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-gray-100 disabled:opacity-50">{isGenerating ? <div className="animate-spin w-5 h-5 border-4 border-black/20 border-t-black rounded-full" /> : <><Download className="w-5 h-5" /> TÉLÉCHARGER PDF</>}</button>
                    <button onClick={() => setShowEmailInput(true)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3"><Mail className="w-5 h-5" /> ENVOYER PAR MAIL</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input type="email" placeholder="votre@email.com" value={targetEmail} onChange={e => setTargetEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none" />
                    <div className="flex gap-2">
                      <button onClick={() => setShowEmailInput(false)} className="flex-1 py-3 bg-white/5 text-gray-400 rounded-xl font-bold text-xs uppercase">Retour</button>
                      <button onClick={sendEmail} disabled={isSending} className="flex-[2] py-3 bg-emerald-600 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 uppercase">{isSending ? <div className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full" /> : <><Send className="w-4 h-4" /> Envoyer</>}</button>
                    </div>
                  </div>
                )}
                <button onClick={resetAll} className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2 mx-auto"><RotateCcw className="w-3 h-3" /> Recommencer</button>
              </motion.div>
            )}
          </AnimatePresence>

          {step < 5 && (
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/5">
              <button onClick={() => setStep(s => Math.max(0, s-1))} disabled={step === 0} className="text-gray-500 font-black text-[10px] uppercase">Retour</button>
              <button onClick={() => setStep(s => Math.min(5, s+1))} className="bg-indigo-600 px-8 py-3 rounded-xl font-black text-white text-xs uppercase">Continuer</button>
            </div>
          )}
        </div>

        <div className={`lg:block ${showMobilePreview ? 'fixed inset-0 z-[100] bg-[#0b1220] p-4 flex flex-col' : 'hidden'}`}>
          {showMobilePreview && <button onClick={() => setShowMobilePreview(false)} className="absolute top-6 right-6 z-[110] bg-white text-black p-2 rounded-full shadow-2xl"><X className="w-6 h-6" /></button>}
          <div className="mb-4 flex items-center justify-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /><span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Rendu Professionnel</span></div>
          <div className="w-full relative flex justify-center flex-1 overflow-auto">
            <div ref={cvRef} className="bg-white text-[#0b1220] shadow-2xl" style={{ width: '210mm', height: '297mm', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%) scale(0.4)', transformOrigin: 'top center', zIndex: 5 }}>
              {data.template === 'modern-pink' && (
                <div className="h-full flex flex-col p-[15mm] font-sans text-left">
                  <div className="flex gap-10 mb-10 items-center">
                    <div className="w-40 h-48 bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">{data.profileImage ? <img src={data.profileImage} alt="P" className="w-full h-full object-cover" /> : <User className="w-16 h-16 text-gray-300" />}</div>
                    <div><h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-2">{data.fullName || 'NOM PRÉNOM'}</h1><p className="text-xl font-bold text-pink-500 uppercase tracking-widest">{data.jobTitle || 'MÉTIER'}</p><div className="mt-6"><h6 className="text-[10px] font-black uppercase text-pink-600 mb-1">PROFIL</h6><p className="text-[10px] text-gray-600 leading-relaxed max-w-sm">{data.summary}</p></div></div>
                  </div>
                  <div className="grid grid-cols-12 gap-10 flex-1">
                    <div className="col-span-8"><h2 className="text-xs font-black uppercase text-pink-600 border-b-2 border-pink-100 pb-1 mb-4 text-left">Expériences</h2>{data.experience.map((exp, i) => (<div key={i} className="flex gap-4 mb-6 text-left"><div className="w-14 h-14 bg-pink-600 text-white p-2 text-[10px] font-black flex items-center justify-center shrink-0">2026</div><div className="text-left"><h3 className="font-black uppercase text-[11px] leading-tight">{exp.role}</h3><p className="text-pink-600 font-bold text-[9px]">{exp.company}</p></div></div>))}</div>
                    <div className="col-span-4 bg-gray-50 p-6 space-y-8 text-left border-l border-gray-100"><section><h2 className="text-[10px] font-black uppercase mb-4 tracking-wider">CONTACT</h2><div className="space-y-2 text-[9px] font-bold text-gray-700"><p>{data.phone}</p><p className="break-all">{data.email}</p><p>{data.location}</p></div></section><section><h2 className="text-[10px] font-black uppercase mb-4 tracking-wider">COMPÉTENCES</h2><ul className="space-y-1 text-[9px] font-bold text-gray-600">{data.skills.map(s => <li key={s}>• {s}</li>)}</ul></section></div>
                  </div>
                </div>
              )}
              {data.template === 'creative-blue' && (
                <div className="h-full flex flex-col font-sans text-left">
                  <div className="h-48 bg-[#00a8b5] relative overflow-hidden flex items-end px-[15mm]"><div className="absolute top-0 right-0 w-1/3 h-full bg-[#1a1a1a] -skew-x-12 translate-x-20 shadow-2xl" /><div className="relative z-10 flex gap-10 items-end mb-8 w-full"><div className="w-40 h-40 bg-white p-1 shadow-2xl border border-gray-100 shrink-0">{data.profileImage ? <img src={data.profileImage} alt="P" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100 flex items-center justify-center"><User className="w-16 h-16 text-gray-300" /></div>}</div><div className="pb-2 flex-1 text-left text-white"><h1 className="text-5xl font-black leading-tight uppercase">{data.fullName || 'NOM PRÉNOM'}</h1><p className="text-xl font-bold uppercase tracking-widest mt-1 opacity-80">{data.jobTitle || 'MÉTIER'}</p></div></div></div>
                  <div className="flex-1 grid grid-cols-12 text-left"><div className="col-span-4 bg-[#f4f7f6] p-10 space-y-10 text-left"><section><h2 className="font-black uppercase flex items-center gap-3 mb-4 text-xs tracking-widest text-[#00a8b5]">PROFIL</h2><p className="text-[10px] text-gray-600 leading-relaxed font-medium">{data.summary}</p></section><section><h2 className="font-black uppercase flex items-center gap-3 mb-4 text-xs tracking-widest text-[#00a8b5]">CONTACT</h2><div className="space-y-3 text-[9px] font-bold text-gray-700"><p>{data.phone}</p><p>{data.email}</p></div></section></div><div className="col-span-8 p-10 space-y-10 text-left"><section><h2 className="font-black text-[#00a8b5] uppercase border-b border-gray-100 pb-2 mb-6 text-sm tracking-widest">EXPÉRIENCES</h2>{data.experience.map((exp, i) => (<div key={i} className="text-left mb-8"><div className="flex justify-between font-black uppercase text-[11px] mb-1"><span>{exp.role}</span><span className="text-gray-400">2026</span></div><p className="text-[#00a8b5] font-black text-[10px] mb-2">{exp.company}</p></div>))} </section></div></div>
                </div>
              )}
              {data.template === 'classic-light' && (
                <div className="h-full flex font-sans text-left bg-white">
                  <div className="w-[75mm] bg-[#f8fafc] h-full p-10 flex flex-col gap-10 text-slate-800 border-r border-slate-100 shrink-0"><div className="w-40 h-40 rounded-3xl overflow-hidden mx-auto border-4 border-white shadow-xl bg-slate-200 flex items-center justify-center shrink-0">{data.profileImage ? <img src={data.profileImage} alt="P" className="w-full h-full object-cover" /> : <User className="w-16 h-16 text-slate-400" />}</div><section><h2 className="font-black border-b-2 border-indigo-500 pb-1 mb-6 text-[10px] text-indigo-600 uppercase tracking-widest">COORDONNÉES</h2><div className="space-y-4 text-[10px] text-left font-bold text-slate-600"><p>{data.phone}</p><p>{data.email}</p><p>{data.location}</p></div></section><section><h2 className="font-black border-b-2 border-indigo-500 pb-1 mb-6 text-[10px] text-indigo-600 uppercase tracking-widest">COMPÉTENCES</h2><div className="space-y-2 text-[9px] font-bold text-slate-600">{data.skills.map(s => <div key={s}>• {s}</div>)}</div></section></div>
                  <div className="flex-1 p-12 text-left"><header className="mb-12 border-b-2 border-slate-100 pb-8"><h1 className="text-5xl font-black uppercase tracking-tight text-slate-900 leading-none">{data.fullName || 'NOM'}</h1><p className="text-2xl font-bold text-indigo-600 mt-3 uppercase tracking-widest">{data.jobTitle}</p></header><section><h2 className="font-black text-slate-900 mb-8 text-sm uppercase border-l-4 border-indigo-500 pl-4 tracking-widest">Expériences</h2>{data.experience.map((exp, i) => (<div key={i} className="relative pl-8 border-l-2 border-slate-100 mb-10 text-left"><div className="absolute top-0 -left-[6px] w-2.5 h-2.5 rounded-full bg-indigo-500" /><div className="flex justify-between items-start mb-2"><h3 className="font-black text-sm uppercase text-slate-800 leading-none">{exp.role}</h3><span className="text-[10px] text-slate-400 font-bold">2026</span></div><p className="text-[11px] font-black text-indigo-600 mb-2 uppercase">{exp.company}</p></div>))} </section></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, isTextArea }: { label: string, value: string, onChange: (v: string) => void, isTextArea?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-black uppercase text-gray-500 ml-1">{label}</label>
      {isTextArea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500/50 min-h-[100px] text-sm" />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500/50 text-sm" />
      )}
    </div>
  );
}
