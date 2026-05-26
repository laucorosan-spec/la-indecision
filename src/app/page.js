"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    if (posibles.length === 0) return alert("No hay planes guardados aún ✨");
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
    <div className="flex flex-col items-center gap-8">
      <h1 className="text-4xl font-bold text-[#e57373] mt-2 italic">La Indecisión</h1>
      
      {/* Selector de Categoría pill-style */}
      <div className="bg-white/80 backdrop-blur-sm p-1 rounded-full flex w-full max-w-[240px] shadow-sm border border-gray-100">
        <button 
          onClick={() => setFiltro('hoy')} 
          className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${filtro === 'hoy' ? 'bg-[#e57373] text-white shadow-md' : 'text-gray-400'}`}
        >HOY</button>
        <button 
          onClick={() => setFiltro('futuro')} 
          className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${filtro === 'futuro' ? 'bg-[#e57373] text-white shadow-md' : 'text-gray-400'}`}
        >FUTURO</button>
      </div>

      {/* LA RULETA - Tamaño Grande (320px) */}
      <div className="relative my-6">
        <div className="absolute -inset-4 bg-[#e57373]/10 rounded-full blur-2xl"></div>
        <motion.div
          animate={girando ? { rotate: 3600 } : { rotate: 0 }}
          transition={{ duration: 2, ease: "circOut" }}
          className="w-72 h-72 sm:w-80 sm:h-80 rounded-full border-[10px] border-[#e57373] border-dashed flex items-center justify-center bg-white shadow-2xl relative z-10"
        >
          <span className="text-8xl drop-shadow-lg">{girando ? "💫" : "🎡"}</span>
        </motion.div>
      </div>

      <button onClick={girar} disabled={girando} className="btn-coral w-full text-lg uppercase tracking-widest font-black py-5">
        {girando ? "Decidiendo..." : "Girar Ruleta"}
      </button>

      {seleccionado && !girando && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card p-8 w-full text-center mt-4 border-t-4 border-[#e57373]">
          <p className="text-[10px] uppercase font-black text-[#e57373] mb-2 tracking-[3px]">¡Plan Elegido!</p>
          <h2 className="text-3xl font-bold text-[#2d2d2d] leading-tight">{seleccionado.nombre}</h2>
        </motion.div>
      )}
    </div>
  );
}
