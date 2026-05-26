"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import confetti from 'canvas-confetti';

export default function Home() {
  const [planes, setPlanes] = useState([]);
  const [filtro, setFiltro] = useState('hoy');
  const [girando, setGirando] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      const { data } = await supabase.from('planes').select('*').eq('hecho', false);
      if (data) setPlanes(data);
    };
    cargar();
  }, []);

  const girar = () => {
    const posibles = planes.filter(p => p.categoria === filtro);
    if (posibles.length === 0) return alert("¡Añade planes primero! ✨");
    setGirando(true);
    setSeleccionado(null);
    setTimeout(() => {
      const elegido = posibles[Math.floor(Math.random() * posibles.length)];
      setSeleccionado(elegido);
      setGirando(false);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-12">
      <h1 className="text-3xl font-bold text-[#e57373] tracking-tight">La Indecisión</h1>
      
      {/* Filtros Pill-Style */}
      <div className="bg-white/50 p-1 rounded-full flex w-56 shadow-inner border border-white/20">
        {['hoy', 'futuro'].map((f) => (
          <button 
            key={f}
            onClick={() => setFiltro(f)}
            className={`flex-1 py-2 rounded-full text-[10px] font-bold transition-all ${filtro === f ? 'bg-[#e57373] text-white shadow-md' : 'text-gray-400'}`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Ruleta Grande con proporciones de tu CSS */}
      <div className="relative">
        <div className="absolute -inset-4 bg-[#e57373]/5 rounded-full blur-2xl"></div>
        <motion.div
          animate={girando ? { rotate: 3600 } : { rotate: 0 }}
          transition={{ duration: 2, ease: "circOut" }}
          className="w-72 h-72 rounded-full border-[8px] border-[#e57373] border-dashed flex items-center justify-center bg-white shadow-xl relative z-10"
        >
          <span className="text-7xl">{girando ? "💫" : "🎡"}</span>
        </motion.div>
      </div>

      <button onClick={girar} disabled={girando} className="btn-primary">
        {girando ? "Decidiendo..." : "Girar Ruleta"}
      </button>

      <AnimatePresence>
        {seleccionado && !girando && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass p-8 w-full text-center">
            <p className="text-[10px] font-bold text-[#e57373] uppercase tracking-widest mb-1">Ha salido...</p>
            <h2 className="text-2xl font-bold text-[#2d2d2d] leading-tight">{seleccionado.nombre}</h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
