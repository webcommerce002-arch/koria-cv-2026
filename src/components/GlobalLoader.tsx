"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain } from 'lucide-react';

export default function GlobalLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simule un temps de chargement initial ou attend que le DOM soit prêt
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // 2.5 secondes pour l'effet visuel premium

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0b1220]"
        >
          <div className="relative flex flex-col items-center">
            {/* Background Glow */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0.2 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              className="absolute inset-0 bg-indigo-500 blur-[100px] rounded-full"
            />
            
            {/* Logo Animation */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative mb-8"
            >
              <div className="bg-gradient-to-br from-indigo-500 to-emerald-500 p-4 rounded-2xl shadow-2xl shadow-indigo-500/20">
                <Brain className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            {/* Text & Progress Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <h2 className="text-2xl font-black tracking-tighter uppercase text-white mb-4">
                Koria <span className="text-indigo-400">Intelligence</span>
              </h2>
              
              <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-emerald-500"
                />
              </div>
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
                Initialisation de la Dream Team...
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
