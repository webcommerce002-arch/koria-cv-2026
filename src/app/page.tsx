"use client";

import React, { useState } from 'react';
import {
  Brain, CheckCircle2, BarChart3, Rocket, ShieldCheck,
  Mail, Phone, Target, Zap, Award, Presentation,
  Clock, ArrowUpRight, ChevronDown, Sparkles, TrendingUp,
  Wand2, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CVGenerator from '@/components/CVGenerator';

// ─────────────────────────────────────────────
// QUESTIONNAIRE — PRÉSERVÉ EXACTEMENT
// ─────────────────────────────────────────────
const QUESTIONS = [
  { id: "p1", axis: "periph", label: "Mobilité", q: "As-tu une solution fiable pour te déplacer vers un emploi ou une formation ?", choices: [{ v: 0, t: "Oui, totalement" }, { v: 1, t: "Plutôt oui" }, { v: 2, t: "Plutôt non" }, { v: 3, t: "Non, c'est un vrai frein" }] },
  { id: "p2", axis: "periph", label: "Logement", q: "Ta situation de logement est-elle stable pour te projeter sur 3 mois ?", choices: [{ v: 0, t: "Oui, stable" }, { v: 1, t: "Assez stable" }, { v: 2, t: "Instable" }, { v: 3, t: "Très instable / urgence" }] },
  { id: "p3", axis: "periph", label: "Garde / contraintes", q: "As-tu des contraintes familiales ou de garde qui limitent tes horaires ?", choices: [{ v: 0, t: "Non" }, { v: 1, t: "Peu" }, { v: 2, t: "Oui, parfois" }, { v: 3, t: "Oui, fortement" }] },
  { id: "m1", axis: "market", label: "Ciblage", q: "Ton objectif métier est-il clair et réaliste sur ton territoire ?", choices: [{ v: 0, t: "Oui, clair et réaliste" }, { v: 1, t: "Plutôt clair" }, { v: 2, t: "Assez flou" }, { v: 3, t: "Pas clair / pas réaliste" }] },
  { id: "m2", axis: "market", label: "Offres & accès", q: "Sais-tu identifier des offres pertinentes et candidater facilement ?", choices: [{ v: 0, t: "Oui, sans difficulté" }, { v: 1, t: "Plutôt oui" }, { v: 2, t: "Difficile" }, { v: 3, t: "Très difficile" }] },
  { id: "m3", axis: "market", label: "Niveau attendu", q: "Ton niveau (diplôme/expérience) correspond-il aux attentes des recruteurs du secteur visé ?", choices: [{ v: 0, t: "Oui" }, { v: 1, t: "Presque" }, { v: 2, t: "Pas vraiment" }, { v: 3, t: "Non, gros écart" }] },
  { id: "s1", axis: "skills", label: "Organisation", q: "Je sais m'organiser : prioriser, respecter des délais, tenir un planning.", choices: [{ v: 0, t: "Pas du tout" }, { v: 1, t: "Un peu" }, { v: 2, t: "Souvent" }, { v: 3, t: "Oui, fortement" }] },
  { id: "s2", axis: "skills", label: "Relationnel", q: "Je suis à l'aise pour communiquer, expliquer, écouter, gérer un échange.", choices: [{ v: 0, t: "Pas du tout" }, { v: 1, t: "Un peu" }, { v: 2, t: "Souvent" }, { v: 3, t: "Oui, fortement" }] },
  { id: "s3", axis: "skills", label: "Adaptation", q: "Je m'adapte vite : nouveaux outils, nouvelles consignes, nouveaux contextes.", choices: [{ v: 0, t: "Pas du tout" }, { v: 1, t: "Un peu" }, { v: 2, t: "Souvent" }, { v: 3, t: "Oui, fortement" }] },
  { id: "ai1", axis: "skills", label: "Outils IA", q: "Utilises-tu déjà ChatGPT ou une IA pour tes recherches d'emploi ?", choices: [{ v: 0, t: "Jamais" }, { v: 1, t: "Rarement" }, { v: 2, t: "Régulièrement" }, { v: 3, t: "Expert" }] },
  { id: "ai2", axis: "skills", label: "CV Optimisation", q: "Ton CV est-il optimisé pour passer les filtres automatiques (ATS) ?", choices: [{ v: 0, t: "C'est quoi un ATS ?" }, { v: 1, t: "Pas sûr" }, { v: 2, t: "Oui, en partie" }, { v: 3, t: "Totalement" }] },
  { id: "ai3", axis: "skills", label: "LinkedIn", q: "As-tu un profil LinkedIn actif et optimisé ?", choices: [{ v: 0, t: "Non" }, { v: 1, t: "En cours" }, { v: 2, t: "Oui" }, { v: 3, t: "Très actif" }] },
  { id: "ai4", axis: "market", label: "Entretien Vidéo", q: "Es-tu à l'aise avec les entretiens de recrutement en visioconférence ?", choices: [{ v: 0, t: "Pas du tout" }, { v: 1, t: "Stressant" }, { v: 2, t: "Plutôt oui" }, { v: 3, t: "Très à l'aise" }] },
  { id: "ai5", axis: "skills", label: "Veille Digitale", q: "Sais-tu utiliser les plateformes pro (Indeed, France Travail) ?", choices: [{ v: 0, t: "Difficilement" }, { v: 1, t: "Un peu" }, { v: 2, t: "Oui" }, { v: 3, t: "Expert" }] },
  { id: "ai6", axis: "skills", label: "Soft Skills IA", q: "Sais-tu expliquer comment l'IA booste ta productivité à un recruteur ?", choices: [{ v: 0, t: "Non" }, { v: 1, t: "Vaguement" }, { v: 2, t: "Oui" }, { v: 3, t: "Argumenté" }] },
];

const AI_PARTNERS = [
  { name: "ChatGPT", logo: "/koria/logo-chatgpt.svg" },
  { name: "DeepSeek", logo: "/koria/logo-deepseek.svg" },
  { name: "Grok", logo: "/koria/logo-grok.svg" },
  { name: "Mistral AI", logo: "/koria/logo-mistral.svg" },
  { name: "Copilot", logo: "/koria/logo-copilot.svg" },
];

const MODULES = [
  {
    id: "01", title: "Découverte de l'IA", hours: "7h",
    points: ["Introduction à l'IA", "Risques et réglementation", "Les limites et le potentiel"],
  },
  {
    id: "02", title: "Explorer (CV & Candidatures)", hours: "8h",
    points: ["Optimisation CV & lettre de motivation avec l'IA", "Création de prompts", "Identifier les outils pertinents"],
  },
  {
    id: "03", title: "On passe à l'action", hours: "8h",
    points: ["Simulations d'entretien avec IA", "Techniques de communication", "Gestion du stress"],
  },
  {
    id: "04", title: "Stratégie de Recherche GPS", hours: "7h",
    points: ["Ciblage des opportunités", "Création d'un agent", "Suivi et relances"],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }),
};

export default function KoriaLanding() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (qid: string, val: number) => {
    setAnswers({ ...answers, [qid]: val });
    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    }
  };

  const calculateResults = () => {
    const sumByAxis = (axis: string) => {
      const axisQuestions = QUESTIONS.filter(q => q.axis === axis);
      const sum = axisQuestions.reduce((acc, q) => acc + (answers[q.id] || 0), 0);
      return Math.round((sum / (axisQuestions.length * 3)) * 100);
    };
    return { periph: sumByAxis("periph"), market: sumByAxis("market"), skills: sumByAxis("skills") };
  };

  const results = showResult ? calculateResults() : null;

  return (
    <div className="min-h-screen bg-[#0b1220] text-[#e8eefc] font-sans selection:bg-indigo-500/30 overflow-x-hidden">

      {/* ═══════════════════════ NAVBAR ═══════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-[100]">
        <div className="absolute inset-0 bg-[#0b1220]/75 backdrop-blur-xl border-b border-white/[0.06]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-emerald-500 rounded-xl blur-md opacity-60" />
              <div className="relative bg-gradient-to-br from-indigo-600 to-emerald-500 p-2.5 rounded-xl shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">Koria</span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#7b8db3]">
            {[
              { label: "Formation", id: "formation" },
              { label: "Impact CV", id: "cv" },
              { label: "Diagnostic", id: "diagnostic" },
              { label: "Générer mon CV", id: "generator" },
            ].map(({ label, id }) => (
              <button
                key={id}
                onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
                className="hover:text-white transition-colors duration-200 relative group"
              >
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-indigo-400 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => document.getElementById('diagnostic')?.scrollIntoView({ behavior: 'smooth' })}
            className="relative overflow-hidden group bg-white text-[#0b1220] px-5 py-2.5 rounded-full font-black text-sm shadow-xl shadow-white/10 transition-all duration-300 hover:shadow-white/20"
          >
            <span className="relative z-10 flex items-center gap-2">
              Démarrer le diagnostic
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-indigo-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </nav>

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src="/koria/banner.png" alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1220]/70 via-[#0b1220]/50 to-[#0b1220]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.18),transparent)]" />
        </div>

        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/25 px-5 py-2 rounded-full mb-10">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-bold text-indigo-300 tracking-[0.15em] uppercase">Formation certifiée · 30 heures</span>
            </div>

            {/* Headline */}
            <h1 className="text-[clamp(3rem,10vw,7.5rem)] font-black leading-[0.92] tracking-tight mb-8">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/50">
                L&apos;IA comme levier
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-300 to-emerald-400">
                d&apos;insertion
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white/50 via-white/80 to-white">
                professionnelle
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-[#7b8db3] max-w-2xl mx-auto mb-12 leading-relaxed">
              Diagnostic personnalisé + formation intensive pour booster votre retour à l&apos;emploi avec l&apos;intelligence artificielle.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('diagnostic')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-lg transition-colors shadow-2xl shadow-indigo-600/40"
              >
                <Brain className="w-5 h-5" />
                Faire mon diagnostic IA
                <ArrowUpRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-3 bg-white/[0.05] border border-white/10 hover:border-white/20 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-2xl"
              >
                <Wand2 className="w-5 h-5 text-indigo-400" />
                Générer mon CV 2026
              </motion.button>
              <button
                onClick={() => document.getElementById('formation')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-3 border border-white/0 hover:border-white/10 text-white/50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:bg-white/5"
              >
                Voir le programme
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* AI Partners */}
            <div className="space-y-5">
              <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white/20">
                Propulsé par les meilleures IA du marché
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
                {AI_PARTNERS.map((partner, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 0.45, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.12, duration: 0.5 }}
                    whileHover={{ opacity: 1, scale: 1.12 }}
                    className="transition-all duration-300 flex flex-col items-center gap-2"
                  >
                    <img src={partner.logo} alt={partner.name} className="h-8 md:h-10 w-auto object-contain filter invert" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">{partner.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0b1220] to-transparent" />
      </section>

      {/* ═══════════════════════ L'ALLIÉ AU QUOTIDIEN ═══════════════════════ */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1220] via-[#0d1526]/60 to-[#0b1220]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* Image */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-8 bg-indigo-500/8 blur-3xl rounded-full" />
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500/30 to-emerald-500/20 rounded-[2.5rem] blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img
                  src="/koria/business.png"
                  alt="L'IA au quotidien"
                  className="relative w-full rounded-[2.5rem] shadow-2xl border border-white/[0.07] object-cover aspect-square group-hover:scale-[1.01] transition-transform duration-700"
                />
                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -right-6 bg-gradient-to-br from-indigo-600 to-emerald-600 p-5 rounded-3xl shadow-2xl shadow-indigo-600/40"
                >
                  <Zap className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.15}
              className="space-y-10"
            >
              <div className="space-y-5">
                <span className="text-[11px] font-black uppercase tracking-[0.45em] text-indigo-400">Votre allié numérique</span>
                <h2 className="text-5xl md:text-[3.5rem] font-black leading-tight">
                  L&apos;IA : Votre Allié
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                    au Quotidien
                  </span>
                </h2>
              </div>

              <div className="border-l-4 border-emerald-500 pl-8 space-y-4">
                <p className="text-xl text-[#a7b4d6] leading-relaxed">
                  Concrètement, l&apos;IA devient un outil du quotidien : comprendre leur parcours, mieux se présenter, mieux se projeter.
                </p>
                <p className="text-2xl font-black text-white leading-snug">
                  Résultat : plus d&apos;autonomie côté public, plus d&apos;efficacité côté accompagnement.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Autonomie", desc: "Gagnée dès la 1ère semaine", icon: Target },
                  { label: "Efficacité", desc: "Candidatures x3 en qualité", icon: TrendingUp },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/[0.04] border border-white/[0.08] p-6 rounded-2xl hover:bg-white/[0.07] transition-colors group">
                    <stat.icon className="w-6 h-6 text-indigo-400 mb-3 group-hover:text-indigo-300 transition-colors" />
                    <div className="text-xl font-black">{stat.label}</div>
                    <div className="text-sm text-[#7b8db3] mt-1">{stat.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ PROGRAMME ═══════════════════════ */}
      <section id="formation" className="py-32 relative bg-[#070b14] border-y border-white/[0.05] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_20%,rgba(99,102,241,0.07),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-start">

            {/* Left — Content */}
            <div className="space-y-12">
              <motion.div
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="space-y-6"
              >
                <span className="text-[11px] font-black uppercase tracking-[0.45em] text-indigo-400">Parcours intensif</span>
                <h2 className="text-5xl md:text-6xl font-black leading-tight tracking-tight">
                  Programme de
                  <br />
                  <span className="text-indigo-400">Formation</span>
                </h2>
                <div className="inline-flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/25 px-5 py-3 rounded-2xl">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  <span className="font-black text-indigo-300 uppercase tracking-wider text-sm">
                    30 Heures · Un parcours complet en 4 modules
                  </span>
                </div>
              </motion.div>

              <div className="space-y-4">
                {MODULES.map((module, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1}
                    className="group bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] hover:border-indigo-500/30 p-6 rounded-2xl transition-all duration-300 cursor-default"
                  >
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 transition-colors">
                        <span className="text-indigo-400 font-black text-sm">{module.id}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="font-black text-lg leading-tight group-hover:text-indigo-300 transition-colors">
                            Module {module.id} · {module.title}
                          </h3>
                          <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full shrink-0">
                            {module.hours}
                          </span>
                        </div>
                        <ul className="space-y-1.5">
                          {module.points.map((point, j) => (
                            <li key={j} className="flex items-center gap-2 text-sm text-[#7b8db3]">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 shrink-0" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right — Image sticky */}
            <div className="lg:sticky lg:top-32">
              <motion.div
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.2}
                className="relative"
              >
                <div className="absolute -inset-4 bg-indigo-500/5 blur-2xl rounded-[3rem]" />
                <img
                  src="/koria/formation.png"
                  alt="Formation Koria"
                  className="relative w-full rounded-[3rem] shadow-2xl border border-white/[0.07]"
                />
                <div className="absolute top-6 right-6 bg-[#0b1220]/90 backdrop-blur-sm border border-white/10 p-4 rounded-2xl text-center shadow-2xl">
                  <div className="text-3xl font-black text-white">30</div>
                  <div className="text-xs font-black text-[#7b8db3] uppercase tracking-wider">Heures</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ PRIX FORMATION ═══════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 bg-gradient-to-r from-indigo-900/40 to-black/40 border border-indigo-500/30 rounded-[2.5rem] backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl"
        >
          <div className="flex items-center gap-6">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-[0_0_30px_rgba(79,70,229,0.3)]">
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-white uppercase tracking-tight">Formation Accompagnée Koria</h4>
              <p className="text-indigo-300 font-medium">Devenez un expert de l'IA en 30 jours (Accompagnement 1-on-1).</p>
            </div>
          </div>
          <div className="text-center md:text-right bg-white/5 px-8 py-4 rounded-3xl border border-white/5">
            <div className="text-4xl font-black text-white tracking-tighter">1650€ <span className="text-sm opacity-40 font-bold">TTC</span></div>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mt-1">Financement CPF / OPCO Possible</p>
          </div>
        </motion.div>
      </div>

      {/* ═══════════════════════ IMPACT CV ═══════════════════════ */}
      <section id="cv" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(16,185,129,0.04),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-20 space-y-4"
          >
            <span className="text-[11px] font-black uppercase tracking-[0.45em] text-emerald-400">Transformation visible</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight">
              L&apos;Impact de l&apos;IA sur la{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/35">
                Qualité des CV
              </span>
            </h2>
            <p className="text-xl text-[#7b8db3] max-w-xl mx-auto">
              Transformer un CV ordinaire en candidature percutante
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* AVANT */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center gap-3 bg-red-500/10 border border-red-500/20 py-3.5 rounded-2xl">
                <span className="text-red-400 font-black uppercase tracking-widest text-sm">✕ AVANT : CV Peu Efficace</span>
              </div>
              <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 group cursor-pointer">
                <img src="/koria/cv-bad.png" alt="CV Avant" className="w-full group-hover:scale-[1.02] transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>

            {/* APRÈS */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.15}
              className="space-y-4"
            >
              <div className="flex items-center justify-center gap-3 bg-emerald-500/10 border border-emerald-500/20 py-3.5 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.08)]">
                <span className="text-emerald-400 font-black uppercase tracking-widest text-sm">✓ APRÈS : CV Optimisé avec l&apos;IA</span>
              </div>
              <div className="relative overflow-hidden rounded-3xl border border-emerald-500/25 shadow-2xl shadow-emerald-500/10 scale-[1.02] group cursor-pointer">
                <img src="/koria/cv-good.png" alt="CV Après" className="w-full group-hover:scale-[1.02] transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent" />
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-gradient-to-r from-indigo-600/10 to-emerald-600/10 border border-indigo-500/20 p-8 rounded-3xl flex items-start gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/25">
                <Award className="w-7 h-7 text-white" />
              </div>
              <p className="text-xl font-bold italic leading-relaxed text-white/90">
                &quot;L&apos;IA aide à structurer, valoriser et personnaliser chaque candidature pour maximiser l&apos;impact auprès des recruteurs.&quot;
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════ SIMULATION D'ENTRETIEN ═══════════════════════ */}
      <section className="py-32 relative bg-[#070b14] border-y border-white/[0.05] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_0%_100%,rgba(99,102,241,0.07),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="mb-16 space-y-4"
          >
            <span className="text-[11px] font-black uppercase tracking-[0.45em] text-indigo-400">Mise en situation réelle</span>
            <h2 className="text-5xl md:text-6xl font-black">
              Simulation <span className="text-emerald-400">d&apos;entretien</span>
            </h2>
            <p className="text-xl text-[#7b8db3] max-w-xl">
              Mettons-nous en situation pour comprendre les attentes d&apos;un recruteur face à une candidature.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Card 01 — Le Contexte */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="bg-white/[0.04] border border-white/[0.08] rounded-[2rem] overflow-hidden hover:border-indigo-500/20 transition-all duration-300 group"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em]">01</span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>
                <h3 className="text-2xl font-black uppercase">Le Contexte</h3>
                <p className="text-[#a7b4d6] leading-relaxed">
                  Mets-toi dans la peau d&apos;un recruteur chevronné d&apos;une entreprise de bâtiment qui veut recruter un plaquiste.
                </p>
                <img
                  src="/koria/architecte.png"
                  alt="Le Contexte"
                  className="w-full rounded-2xl border border-white/[0.06] aspect-video object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </motion.div>

            {/* Card 02 — Ce que l'IA Analyse */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.15}
              className="bg-white/[0.04] border border-white/[0.08] rounded-[2rem] overflow-hidden hover:border-emerald-500/20 transition-all duration-300"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em]">02</span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>
                <h3 className="text-2xl font-black uppercase">Ce que l&apos;IA Analyse</h3>
                <ul className="space-y-5">
                  {[
                    { label: "Compétences techniques", desc: "Maîtrise des matériaux, précision de pose, qualité des finitions" },
                    { label: "Savoir-être professionnel", desc: "Esprit d'équipe, fiabilité sur chantier, respect des consignes" },
                    { label: "Adaptabilité terrain", desc: "Capacité à travailler dans des environnements variés" },
                    { label: "Motivation & potentiel", desc: "Engagement, envie d'apprendre, capacité d'évolution" },
                  ].map((item, j) => (
                    <li key={j} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span className="font-bold text-white text-sm">{item.label}</span>
                      </div>
                      <p className="text-sm text-[#7b8db3] pl-4">{item.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Card 03 — L'Entretien Commence */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.3}
              className="bg-white/[0.04] border border-white/[0.08] rounded-[2rem] overflow-hidden hover:border-indigo-500/20 transition-all duration-300 group"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em]">03</span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>
                <h3 className="text-2xl font-black uppercase">L&apos;Entretien Commence</h3>
                <img
                  src="/koria/entretien.png"
                  alt="L'Entretien"
                  className="w-full rounded-2xl border border-white/[0.06] aspect-video object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="bg-indigo-500/10 border-l-4 border-indigo-500 p-5 rounded-r-2xl space-y-2">
                  <p className="text-[#a7b4d6] text-sm">Bonjour. Avant de parler technique, j&apos;aimerais comprendre votre parcours.</p>
                  <p className="font-black text-white italic text-sm">&quot;Qu&apos;est-ce qui vous a donné envie de travailler comme plaquiste ?&quot;</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ RÔLE DE L'AGENT IA ═══════════════════════ */}
      <section className="py-32 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Image */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              <div className="absolute -inset-6 bg-emerald-500/5 blur-3xl rounded-full" />
              <img
                src="/koria/victoire.png"
                alt="Rôle de l'agent IA"
                className="relative w-full rounded-[3rem] shadow-2xl border border-white/[0.07] hover:scale-[1.01] transition-transform duration-700"
              />
            </motion.div>

            {/* Content */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.15}
              className="space-y-12 order-1 lg:order-2"
            >
              <div className="space-y-5">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/25">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.45em] text-indigo-400">Intelligence artificielle</span>
                <h2 className="text-5xl md:text-6xl font-black leading-tight">
                  Rôle de<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                    l&apos;agent IA
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { t: "Planifie un programme d'entrainement", icon: Target },
                  { t: "Entrainement en vue d'un entretien", icon: Presentation },
                  { t: "Analyse compétences, savoir-être et potentiel", icon: BarChart3 },
                  { t: "Aide à se préparer, se projeter et gagner en confiance", icon: Zap },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1}
                    className="bg-white/[0.04] border border-white/[0.08] p-6 rounded-2xl hover:bg-white/[0.07] hover:border-indigo-500/30 transition-all duration-300 group"
                  >
                    <item.icon className="w-6 h-6 text-indigo-400 mb-4 group-hover:text-indigo-300 transition-colors" />
                    <p className="text-sm font-bold leading-snug">{item.t}</p>
                  </motion.div>
                ))}
              </div>

              <div className="bg-indigo-500/[0.06] border border-indigo-500/20 p-6 rounded-2xl flex items-center gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <p className="font-bold text-[#a7b4d6]">
                  Apporte un appui complémentaire, rapide et objectivable
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ PLUS-VALUES ═══════════════════════ */}
      <section className="py-32 relative bg-[#070b14] border-y border-white/[0.05] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_50%,rgba(16,185,129,0.05),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* Content */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="space-y-16"
            >
              <div className="space-y-5">
                <span className="text-[11px] font-black uppercase tracking-[0.45em] text-emerald-400">Bénéfices concrets</span>
                <h2 className="text-5xl md:text-6xl font-black leading-tight">
                  Les Multiples
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                    Plus-Values
                  </span>
                  <br />de l&apos;IA
                </h2>
              </div>

              <div className="space-y-6">
                {[
                  {
                    t: "Mise en situation et préparation renforcée",
                    desc: "Des exercices pratiques qui reproduisent les vraies conditions d'entretien.",
                    icon: Presentation,
                  },
                  {
                    t: "Gain de confiance et d'autonomie",
                    desc: "Développez vos compétences à votre rythme, avec un feedback immédiat.",
                    icon: Zap,
                  },
                  {
                    t: "Parcours de réinsertion plus lisibles et sécurisés",
                    desc: "Une feuille de route claire pour chaque étape de votre retour à l'emploi.",
                    icon: ShieldCheck,
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.15}
                    className="flex gap-6 group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 transition-colors mt-1">
                      <item.icon className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-black">{item.t}</h3>
                      <p className="text-[#7b8db3] leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.2}
              className="relative"
            >
              <div className="absolute -inset-6 bg-emerald-500/5 blur-3xl rounded-full" />
              <img
                src="/koria/reussite.png"
                alt="La réussite"
                className="relative w-full rounded-[3rem] shadow-2xl border border-white/[0.07] hover:scale-[1.01] transition-transform duration-700"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ DIAGNOSTIC — QUESTIONNAIRE ═══════════════════════ */}
      <section id="diagnostic" className="py-32 relative bg-[#070b14]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(99,102,241,0.06),transparent)]" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-20 space-y-4"
          >
            <span className="text-[11px] font-black uppercase tracking-[0.45em] text-indigo-400">Évaluation personnalisée</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight">
              Votre Diagnostic <span className="text-indigo-500">IA</span>
            </h2>
            <p className="text-xl text-[#7b8db3]">
              Identifiez vos freins et valorisez vos compétences en 15 questions stratégiques.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="bg-[#111b2e] border border-indigo-500/20 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden"
          >
            {/* Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />

            <AnimatePresence mode="wait">
              {!showResult ? (
                <motion.div
                  key={`question-${currentStep}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-10 relative z-10"
                >
                  {/* Header */}
                  <div className="flex justify-between items-end">
                    <div className="space-y-2">
                      <span className="text-indigo-400 font-black text-xs uppercase tracking-[0.3em]">
                        Question {currentStep + 1} sur 15
                      </span>
                      <h3 className="text-3xl font-black">{QUESTIONS[currentStep].label}</h3>
                    </div>
                    <div className="text-4xl font-mono font-black text-white/10">
                      {Math.round(((currentStep + 1) / 15) * 100)}%
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStep + 1) / 15) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                    />
                  </div>

                  {/* Question */}
                  <div className="space-y-6">
                    <p className="text-2xl font-medium text-white/90 leading-relaxed">
                      {QUESTIONS[currentStep].q}
                    </p>
                    <div className="grid gap-4">
                      {QUESTIONS[currentStep].choices.map((choice, i) => (
                        <button
                          key={i}
                          onClick={() => handleAnswer(QUESTIONS[currentStep].id, choice.v)}
                          className={`w-full p-6 text-left rounded-2xl border-2 transition-all duration-300 flex items-center justify-between group
                            ${answers[QUESTIONS[currentStep].id] === choice.v
                              ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-[0_0_30px_rgba(99,102,241,0.12)] scale-[1.02]'
                              : 'border-white/[0.06] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06] text-[#a7b4d6]'
                            }`}
                        >
                          <span className="text-lg font-bold">{choice.t}</span>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                            ${answers[QUESTIONS[currentStep].id] === choice.v
                              ? 'border-indigo-500 bg-indigo-500'
                              : 'border-white/10 group-hover:border-white/30'
                            }`}>
                            {answers[QUESTIONS[currentStep].id] === choice.v && (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-10 border-t border-white/[0.05]">
                    <button
                      disabled={currentStep === 0}
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="text-[#a7b4d6] hover:text-white font-black uppercase text-xs tracking-widest disabled:opacity-20 transition-opacity"
                    >
                      Précédent
                    </button>
                    {Object.keys(answers).length === QUESTIONS.length ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowResult(true)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-[#0b1220] px-10 py-4 rounded-2xl font-black text-lg transition-colors shadow-xl shadow-emerald-500/25"
                      >
                        Voir mon profil complet
                      </motion.button>
                    ) : (
                      <div className="flex items-center gap-2 text-white/20 italic text-sm">
                        <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                        <span>En attente de réponse...</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center space-y-12 relative z-10"
                >
                  <div className="space-y-4">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20"
                    >
                      <Rocket className="w-12 h-12 text-emerald-400" />
                    </motion.div>
                    <h3 className="text-4xl font-black">Analyse Terminée !</h3>
                    <p className="text-xl text-[#a7b4d6]">Voici votre score d&apos;insertion propulsé par l&apos;IA.</p>
                  </div>

                  <div className="grid gap-5">
                    {results && [
                      { label: "Freins Périphériques", val: results.periph, color: "from-orange-500 to-red-500", icon: ShieldCheck },
                      { label: "Adéquation Marché", val: results.market, color: "from-indigo-500 to-blue-500", icon: BarChart3 },
                      { label: "Compétences IA", val: results.skills, color: "from-emerald-500 to-teal-500", icon: Brain },
                    ].map((res, i) => (
                      <div key={i} className="bg-white/[0.04] p-8 rounded-[2rem] border border-white/[0.06] space-y-4 text-left">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-white/[0.05]">
                              <res.icon className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-black uppercase tracking-widest text-sm">{res.label}</span>
                          </div>
                          <span className="font-mono font-black text-3xl">{res.val}%</span>
                        </div>
                        <div className="w-full h-4 bg-white/[0.05] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${res.val}%` }}
                            transition={{ duration: 1.2, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className={`h-full bg-gradient-to-r ${res.color} shadow-lg`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA block */}
                  <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden text-left">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Brain className="w-48 h-48" />
                    </div>
                    <h4 className="text-3xl font-black relative z-10">Besoin d&apos;un accompagnement sur-mesure ?</h4>
                    <p className="text-indigo-100 text-lg relative z-10 leading-relaxed">
                      Nos experts IA vous aident à lever ces freins en moins de 30 heures de formation.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => document.getElementById('footer-contact')?.scrollIntoView({ behavior: 'smooth' })}
                      className="bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black text-xl relative z-10 shadow-2xl hover:bg-indigo-50 transition-colors"
                    >
                      Réserver mon appel stratégique
                    </motion.button>
                  </div>

                  <button
                    onClick={() => { setShowResult(false); setAnswers({}); setCurrentStep(0); }}
                    className="text-white/25 hover:text-white font-black uppercase text-xs tracking-widest underline underline-offset-8 transition-colors"
                  >
                    Recommencer le diagnostic
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════ GÉNÉRATEUR DE CV ═══════════════════════ */}
      <section id="generator" className="py-32 relative overflow-hidden bg-[#070b14] border-t border-white/[0.05]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(99,102,241,0.04),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
            <span className="text-[11px] font-black uppercase tracking-[0.45em] text-indigo-400">Outil Intelligent</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight">
              Générateur de CV <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Ultra-Moderne</span>
            </h2>
            <p className="text-xl text-[#7b8db3] max-w-2xl mx-auto">
              Laissez l&apos;IA Koria propulser votre profil dans les standards de recrutement de 2026.
            </p>
          </motion.div>
        </div>
        <CVGenerator />
      </section>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer id="footer-contact" className="py-24 relative border-t border-white/[0.05] bg-[#070b14] overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src="/koria/footer.png" alt="" className="w-full h-full object-cover opacity-[0.04] grayscale" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#070b14]" />
        </div>

        {/* KORIA watermark */}
        <div className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none select-none">
          <span className="text-[18vw] font-black text-white/[0.025] tracking-tighter leading-none translate-x-16">
            KORIA
          </span>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-end">

            {/* Left */}
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-emerald-500 rounded-2xl blur-md opacity-60" />
                  <div className="relative bg-gradient-to-br from-indigo-600 to-emerald-500 p-3 rounded-2xl shadow-lg">
                    <Brain className="w-9 h-9 text-white" />
                  </div>
                </div>
                <div>
                  <span className="text-4xl font-black tracking-tighter uppercase">Koria</span>
                  <p className="text-sm text-[#7b8db3] font-medium">L&apos;IA au service de votre carrière</p>
                </div>
              </div>

              <h2 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter">
                Ensemble vers<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                  la Réussite
                </span>
              </h2>
            </div>

            {/* Right */}
            <div className="space-y-10 lg:pl-8">
              <div className="space-y-5">
                <h6 className="font-black uppercase text-[11px] tracking-[0.45em] text-indigo-400">
                  Contactez-nous
                </h6>
                <div className="space-y-3">
                  <a href="tel:0650281092" className="flex items-center gap-5 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all">
                      <Phone className="w-5 h-5 text-[#7b8db3] group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <span className="text-xl font-bold group-hover:text-indigo-400 transition-colors">
                      06.50.28.10.92
                    </span>
                  </a>
                  <a href="mailto:sb.formation.ia@hotmail.com" className="flex items-center gap-5 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all">
                      <Mail className="w-5 h-5 text-[#7b8db3] group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <span className="text-xl font-bold group-hover:text-indigo-400 transition-colors truncate">
                      sb.formation.ia@hotmail.com
                    </span>
                  </a>
                </div>
              </div>

              <div className="pt-8 border-t border-white/[0.05] flex flex-wrap justify-between items-center gap-4">
                <p className="text-[#7b8db3] font-mono text-sm">SIRET : 994 406 650</p>
                <p className="text-xs text-white/20 font-black uppercase tracking-widest">© 2026 Koria</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
