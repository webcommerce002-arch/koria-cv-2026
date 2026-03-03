"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Briefcase, GraduationCap, Star, 
  Download, Sparkles, Wand2, 
  CheckCircle2, ArrowRight, ArrowLeft,
  Mail, Phone, MapPin, Globe, 
  Cpu, Heart, Languages, Layout, Camera, Trash2, Send, RotateCcw
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// ─────────────────────────────────────────────
// TYPES
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
  education: { school: string; degree: string; year: string }[];
  skills: string[];
  languages: string[];
  hobbies: string[];
  template: 'modern-pink' | 'creative-blue' | 'classic-light';
}

const INITIAL_STATE: CVData = {
  fullName: '',
  jobTitle: '',
  email: '',
  phone: '',
  location: '',
  birthDate: '',
  profileImage: null,
  summary: '',
  experience: [{ company: '', role: '', period: '', desc: '' }],
  education: [{ school: '', degree: '', year: '' }],
  skills: [],
  languages: [],
  hobbies: [],
  template: 'modern-pink',
};

const STEPS = [
  { id: 'template', title: 'Modèle', icon: Layout },
  { id: 'identity', title: 'Identité', icon: User },
  { id: 'objective', title: 'Objectif', icon: Sparkles },
  { id: 'experience', title: 'Parcours', icon: Briefcase },
  { id: 'extra', title: 'Expertises', icon: Star },
  { id: 'preview', title: 'Finalisation', icon: Download },
];

export default function CVGenerator() {
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [targetEmail, setTargetEmail] = useState('');
  const [data, setData] = useState<CVData>(INITIAL_STATE);

  const cvRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────

  const handleInputChange = (field: keyof CVData, value: any) => setData(prev => ({ ...prev, [field]: value }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setData(prev => ({ ...prev, profileImage: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleListChange = (index: number, listField: 'experience' | 'education', field: string, value: string) => {
    const newList = [...data[listField]] as any[];
    newList[index] = { ...newList[index], [field]: value };
    setData(prev => ({ ...prev, [listField]: newList }));
  };

  const addItem = (field: 'experience' | 'education') => {
    const newItem = field === 'experience' ? { company: '', role: '', period: '', desc: '' } : { school: '', degree: '', year: '' };
    setData(prev => ({ ...prev, [field]: [...prev[field], newItem] }));
  };

  const toggleItem = (list: 'skills' | 'languages' | 'hobbies', value: string) => {
    const newList = data[list].includes(value) ? data[list].filter(v => v !== value) : [...data[list], value];
    setData(prev => ({ ...prev, [list]: newList }));
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
    
    // Attendre que le rendu soit stable
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 794, // 210mm à 96dpi
      height: 1123, // 297mm à 96dpi
    });
    
    return canvas.toDataURL('image/jpeg', 0.95);
  };

  const downloadPDF = async () => {
    setIsGenerating(true);
    try {
      const imgData = await generatePDFBlob();
      if (!imgData) throw new Error("Capture failed");
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      pdf.save(`CV_KORIA_${data.fullName.replace(/\s+/g, '_') || '2026'}.pdf`);
      
      setTimeout(resetAll, 3000);
    } catch (e) { 
      console.error(e);
      alert("Erreur lors du téléchargement. Essayez une image plus légère."); 
    }
    setIsGenerating(false);
  };

  const sendEmail = async () => {
    if (!targetEmail) return alert("Veuillez entrer un email.");
    setIsSending(true);
    try {
      const imgData = await generatePDFBlob();
      if (!imgData) throw new Error("Capture failed");

      const response = await fetch('/api/send-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          fullName: data.fullName || 'Candidat Koria',
          pdfBase64: imgData
        }),
      });

      if (response.ok) {
        alert(`CV envoyé avec succès à ${targetEmail} !`);
        resetAll();
      } else {
        const err = await response.json();
        throw new Error(err.error || "Erreur serveur");
      }
    } catch (e: any) {
      alert(`Erreur d'envoi : ${e.message}. Vérifiez la config SMTP.`);
    }
    setIsSending(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4">
      {/* Step Indicator */}
      <div className="flex justify-between mb-16 relative overflow-x-auto pb-4 scrollbar-hide">
        <div className="absolute top-5 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 z-0 hidden md:block" />
        {STEPS.map((s, i) => (
          <div key={s.id} className="relative z-10 flex flex-col items-center gap-3 min-w-[80px]">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${i <= step ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'bg-[#1a2333] text-gray-500 border border-white/5'}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-tighter ${i <= step ? 'text-indigo-400' : 'text-gray-600'}`}>{s.title}</span>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start text-left">
        {/* Form Area */}
        <div className="bg-[#111b2e] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            
            {/* STEP 0: TEMPLATE CHOICE */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <h3 className="text-3xl font-black mb-6">Choisissez votre style</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'modern-pink', label: 'Moderne Rose', color: 'bg-pink-400' },
                    { id: 'creative-blue', label: 'Créatif Bleu', color: 'bg-teal-400' },
                    { id: 'classic-light', label: 'Classique Clair', color: 'bg-indigo-400' }
                  ].map((t) => (
                    <button key={t.id} onClick={() => handleInputChange('template', t.id)} className={`p-4 rounded-2xl border-2 transition-all ${data.template === t.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}>
                      <div className={`aspect-[3/4] ${t.color} rounded-lg mb-3 opacity-40`} />
                      <span className="text-xs font-black uppercase text-white">{t.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 1: IDENTITY */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h3 className="text-3xl font-black mb-6">Vos informations</h3>
                <div className="flex items-center gap-6 mb-8 p-6 bg-white/5 rounded-3xl border border-white/10">
                  <div className="relative w-24 h-24 rounded-2xl bg-[#1a2333] border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-500/50">
                    {data.profileImage ? <img src={data.profileImage} alt="P" className="w-full h-full object-cover" /> : <Camera className="w-8 h-8 text-gray-600" />}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-black uppercase text-white tracking-widest block mb-1">Votre Photo</label>
                    <p className="text-[10px] text-gray-500">Cliquez sur le carré pour charger votre photo.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Prénom & Nom" value={data.fullName} onChange={v => handleInputChange('fullName', v)} />
                  <Input label="Métier" value={data.jobTitle} onChange={v => handleInputChange('jobTitle', v)} />
                  <Input label="Email" value={data.email} onChange={v => handleInputChange('email', v)} />
                  <Input label="Téléphone" value={data.phone} onChange={v => handleInputChange('phone', v)} />
                  <Input label="Ville" value={data.location} onChange={v => handleInputChange('location', v)} />
                  <Input label="Naissance" value={data.birthDate} onChange={v => handleInputChange('birthDate', v)} />
                </div>
              </motion.div>
            )}

            {/* STEP 2: OBJECTIVE */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h3 className="text-3xl font-black mb-6">Profil 2026</h3>
                <Input label="Résumé professionnel" value={data.summary} onChange={v => handleInputChange('summary', v)} isTextArea />
              </motion.div>
            )}

            {/* STEP 3: EXPERIENCE */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <h3 className="text-3xl font-black mb-6">Parcours</h3>
                {data.experience.map((exp, i) => (
                  <div key={i} className="p-5 border border-white/5 rounded-2xl space-y-3 bg-white/[0.02]">
                    <div className="grid grid-cols-2 gap-3"><Input label="Entreprise" value={exp.company} onChange={v => handleListChange(i, 'experience', 'company', v)} /><Input label="Période" value={exp.period} onChange={v => handleListChange(i, 'experience', 'period', v)} /></div>
                    <Input label="Poste" value={exp.role} onChange={v => handleListChange(i, 'experience', 'role', v)} />
                    <Input label="Missions" value={exp.desc} onChange={v => handleListChange(i, 'experience', 'desc', v)} isTextArea />
                  </div>
                ))}
                <button onClick={() => addItem('experience')} className="w-full py-3 border-2 border-dashed border-white/10 rounded-2xl text-[10px] font-black uppercase text-indigo-400 hover:bg-white/5">+ Ajouter une expérience</button>
              </motion.div>
            )}

            {/* STEP 4: EXTRA */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <h3 className="text-3xl font-black mb-6">Expertises</h3>
                <div className="flex flex-wrap gap-2">
                  {['Rigueur', 'Autonomie', 'Communication', 'Esprit d\'analyse', 'Pack Office', 'Management', 'Agilité'].map(s => (
                    <button key={s} onClick={() => toggleItem('skills', s)} className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${data.skills.includes(s) ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/5 text-gray-400 border-white/10'}`}>{s}</button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 5: PREVIEW & ACTIONS */}
            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8 py-10">
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-2xl"><CheckCircle2 className="w-12 h-12 text-emerald-400" /></div>
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Prêt pour 2026 !</h3>
                
                {!showEmailInput ? (
                  <div className="space-y-4">
                    <button onClick={downloadPDF} disabled={isGenerating} className="w-full py-5 bg-white text-black rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 hover:bg-gray-100 disabled:opacity-50 transition-all">
                      {isGenerating ? <div className="animate-spin w-6 h-6 border-4 border-black/20 border-t-black rounded-full" /> : <><Download className="w-6 h-6" /> TÉLÉCHARGER LE PDF</>}
                    </button>
                    <button onClick={() => setShowEmailInput(true)} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 hover:bg-indigo-500 transition-all">
                      <Mail className="w-6 h-6" /> ENVOYER PAR EMAIL
                    </button>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-left">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Email de réception</label>
                    <input type="email" placeholder="votre@email.com" value={targetEmail} onChange={e => setTargetEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-indigo-500" />
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setShowEmailInput(false)} className="py-4 bg-white/5 text-gray-400 rounded-2xl font-bold uppercase text-xs">Annuler</button>
                      <button onClick={sendEmail} disabled={isSending} className="py-4 bg-emerald-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 uppercase text-xs">
                        {isSending ? <div className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full" /> : <><Send className="w-4 h-4" /> Envoyer</>}
                      </button>
                    </div>
                  </motion.div>
                )}

                <button onClick={resetAll} className="flex items-center gap-2 mx-auto text-[10px] font-black text-gray-500 hover:text-white transition-colors uppercase tracking-[0.2em] pt-4"><RotateCcw className="w-3 h-3" /> Recommencer</button>
              </motion.div>
            )}
          </AnimatePresence>

          {step < 5 && (
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/5">
              <button onClick={() => setStep(s => Math.max(0, s-1))} disabled={step === 0} className="text-gray-500 hover:text-white uppercase text-[10px] font-black tracking-widest">Précédent</button>
              <button onClick={() => setStep(s => Math.min(5, s+1))} className="bg-indigo-600 px-10 py-4 rounded-2xl font-black text-white uppercase text-xs shadow-lg shadow-indigo-600/20">Suivant</button>
            </div>
          )}
        </div>

        {/* PREVIEW */}
        <div className="lg:sticky lg:top-32 flex flex-col items-center">
          <div className="mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /><span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Aperçu en temps réel</span></div>
          <div className="w-full relative flex justify-center">
            <div ref={cvRef} className="bg-white text-[#0b1220] shadow-2xl overflow-hidden" style={{ width: '210mm', height: '297mm', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%) scale(0.42)', transformOrigin: 'top center', zIndex: 5 }}>
              
              {data.template === 'modern-pink' && (
                <div className="h-full flex flex-col p-[15mm] font-sans text-left">
                  <div className="flex gap-10 mb-10 items-center">
                    <div className="w-40 h-48 bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                      {data.profileImage ? <img src={data.profileImage} alt="P" className="w-full h-full object-cover" /> : <User className="w-16 h-16 text-gray-300" />}
                    </div>
                    <div>
                      <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-2">{data.fullName || 'NOM PRÉNOM'}</h1>
                      <p className="text-xl font-bold text-pink-500 uppercase tracking-widest">{data.jobTitle || 'MÉTIER'}</p>
                      <div className="mt-6"><h6 className="text-[10px] font-black uppercase text-pink-600 mb-1">PROFIL</h6><p className="text-[10px] text-gray-600 leading-relaxed max-w-sm">{data.summary}</p></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-10 flex-1">
                    <div className="col-span-8">
                      <section className="text-left">
                        <h2 className="text-xs font-black uppercase text-pink-600 border-b-2 border-pink-100 pb-1 mb-4 text-left">Expériences</h2>
                        {data.experience.map((exp, i) => (
                          <div key={i} className="flex gap-4 mb-6 text-left">
                            <div className="w-14 h-14 bg-pink-600 text-white p-2 text-[10px] font-black flex items-center justify-center shrink-0 rounded-sm">{exp.period || '2026'}</div>
                            <div className="text-left"><h3 className="font-black uppercase text-[11px] leading-tight">{exp.role} | <span className="text-pink-600">{exp.company}</span></h3><p className="text-[9px] text-gray-500 mt-1 leading-snug">{exp.desc}</p></div>
                          </div>
                        ))}
                      </section>
                    </div>
                    <div className="col-span-4 bg-gray-50 p-6 space-y-8 text-left border-l border-gray-100">
                      <section><h2 className="text-[10px] font-black uppercase mb-4 tracking-wider">CONTACT</h2><div className="space-y-2 text-[9px] font-bold text-gray-700"><p>{data.phone}</p><p>{data.email}</p><p>{data.location}</p></div></section>
                      <section><h2 className="text-[10px] font-black uppercase mb-4 tracking-wider">COMPÉTENCES</h2><ul className="space-y-1 text-[9px] font-bold text-gray-600">{data.skills.map(s => <li key={s}>• {s}</li>)}</ul></section>
                    </div>
                  </div>
                </div>
              )}

              {data.template === 'creative-blue' && (
                <div className="h-full flex flex-col font-sans text-left">
                  <div className="h-48 bg-[#00a8b5] relative overflow-hidden flex items-end px-[15mm]">
                     <div className="absolute top-0 right-0 w-1/3 h-full bg-[#1a1a1a] -skew-x-12 translate-x-20 shadow-2xl" />
                     <div className="relative z-10 flex gap-10 items-end mb-8 w-full">
                        <div className="w-40 h-40 bg-white p-1 shadow-2xl border border-gray-100 shrink-0">
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center overflow-hidden">
                            {data.profileImage ? <img src={data.profileImage} alt="P" className="w-full h-full object-cover" /> : <User className="w-16 h-16 text-gray-300" />}
                          </div>
                        </div>
                        <div className="pb-2 flex-1 text-left text-white"><h1 className="text-5xl font-black leading-tight uppercase">{data.fullName || 'NOM PRÉNOM'}</h1><p className="text-xl font-bold uppercase tracking-widest mt-1 opacity-80">{data.jobTitle || 'MÉTIER'}</p></div>
                     </div>
                  </div>
                  <div className="flex-1 grid grid-cols-12 text-left">
                     <div className="col-span-4 bg-[#f4f7f6] p-10 space-y-10 text-left">
                        <section><h2 className="font-black uppercase flex items-center gap-3 mb-4 text-xs tracking-widest text-[#00a8b5]">PROFIL</h2><p className="text-[10px] text-gray-600 leading-relaxed font-medium">{data.summary}</p></section>
                        <section><h2 className="font-black uppercase flex items-center gap-3 mb-4 text-xs tracking-widest text-[#00a8b5]">CONTACT</h2><div className="space-y-3 text-[9px] font-bold text-gray-700"><p>{data.phone}</p><p className="break-all">{data.email}</p><p>{data.location}</p></div></section>
                     </div>
                     <div className="col-span-8 p-10 space-y-10 text-left">
                        <section><h2 className="font-black text-[#00a8b5] uppercase border-b border-gray-100 pb-2 mb-6 text-sm">EXPÉRIENCES PROFESSIONNELLES</h2>
                          {data.experience.map((exp, i) => (
                            <div key={i} className="text-left mb-8"><div className="flex justify-between font-black uppercase text-[11px] mb-1"><span>{exp.role}</span><span className="text-gray-400">{exp.period}</span></div><p className="text-[#00a8b5] font-black text-[10px] mb-2">{exp.company}</p><p className="text-[10px] text-gray-600 leading-relaxed font-medium">{exp.desc}</p></div>
                          ))}
                        </section>
                     </div>
                  </div>
                </div>
              )}

              {data.template === 'classic-light' && (
                <div className="h-full flex font-sans text-left bg-white">
                  <div className="w-[75mm] bg-[#f8fafc] h-full p-10 flex flex-col gap-10 text-slate-800 text-left shrink-0 border-r border-slate-100">
                    <div className="w-40 h-40 rounded-3xl overflow-hidden mx-auto border-4 border-white shadow-xl bg-slate-200 flex items-center justify-center shrink-0">
                      {data.profileImage ? <img src={data.profileImage} alt="P" className="w-full h-full object-cover" /> : <User className="w-16 h-16 text-slate-400" />}
                    </div>
                    <section className="text-left"><h2 className="font-black border-b-2 border-indigo-500 pb-1 mb-6 text-xs text-indigo-600 uppercase tracking-widest text-left">PROFIL</h2><p className="text-[10px] leading-relaxed opacity-80 text-left font-medium">{data.summary}</p></section>
                    <section className="text-left"><h2 className="font-black border-b-2 border-indigo-500 pb-1 mb-6 text-xs text-indigo-600 uppercase tracking-widest text-left">COORDONNÉES</h2><div className="space-y-4 text-[10px] text-left font-bold text-slate-600"><p className="flex items-center gap-2"><Phone className="w-3 h-3" /> {data.phone}</p><p className="flex items-center gap-2"><Mail className="w-3 h-3" /> {data.email}</p><p className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {data.location}</p></div></section>
                    <section className="text-left"><h2 className="font-black border-b-2 border-indigo-500 pb-1 mb-6 text-xs text-indigo-600 uppercase tracking-widest text-left">COMPÉTENCES</h2><div className="space-y-2 text-[10px] text-left font-bold text-slate-600">{data.skills.map(s => <div key={s} className="flex items-center gap-2 text-left">• {s}</div>)}</div></section>
                  </div>
                  <div className="flex-1 p-12 text-left">
                    <header className="mb-12 border-b-2 border-slate-100 pb-8 text-left"><h1 className="text-5xl font-black uppercase tracking-tight text-slate-900 leading-none">{data.fullName || 'NOM'}</h1><p className="text-2xl font-bold text-indigo-600 mt-3 uppercase tracking-widest">{data.jobTitle}</p></header>
                    <section className="text-left"><h2 className="font-black text-slate-900 mb-8 text-sm uppercase border-l-4 border-indigo-500 pl-4 tracking-widest">Parcours Professionnel</h2>
                      {data.experience.map((exp, i) => (
                        <div key={i} className="relative pl-8 border-l-2 border-slate-100 mb-10 text-left"><div className="absolute top-0 -left-[6px] w-2.5 h-2.5 rounded-full bg-indigo-500" /><div className="flex justify-between items-start mb-2 text-left"><h3 className="font-black text-sm uppercase text-slate-800 leading-none">{exp.role}</h3><span className="text-[10px] text-slate-400 font-bold">{exp.period}</span></div><p className="text-[11px] font-black text-indigo-600 mb-3 uppercase">{exp.company}</p><p className="text-[10px] text-slate-500 leading-relaxed font-medium text-left">{exp.desc}</p></div>
                      ))}
                    </section>
                  </div>
                </div>
              )}
            </div>
            <div className="w-full aspect-[1/1.414] bg-[#1a2333] rounded-3xl border border-white/5 flex items-center justify-center pointer-events-none"><p className="text-indigo-400 font-black text-xs uppercase animate-pulse">Génération de l'aperçu...</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, isTextArea }: { label: string, value: string, onChange: (v: string) => void, isTextArea?: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{label}</label>
      {isTextArea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500/50 min-h-[120px] resize-none text-sm" />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500/50 text-sm" />
      )}
    </div>
  );
}
