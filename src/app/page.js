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
    if (posibles.length === 0) return alert("No hay planes en esta categoría");
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
    <div className="flex flex-col items-center gap-10">
      <h1 className="text-3xl font-bold text-[#e57373] mt-4">La Indecisión</h1>
      
      {/* Selector de Categoría pill-style */}
      <div className="bg-white shadow-sm p-1 rounded-full flex w-48 justify-center">
        <button 
          onClick={() => setFiltro('hoy')} 
          className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${filtro === 'hoy' ? 'bg-[#e57373] text-white shadow-md' : 'text-gray-400'}`}
        >Hoy</button>
        <button 
          onClick={() => setFiltro('futuro')} 
          className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${filtro === 'futuro' ? 'bg-[#e57373] text-white shadow-md' : 'text-gray-400'}`}
        >Futuro</button>
      </div>

      {/* Círculo Punteado Grande */}
      <div className="relative my-4">
        <motion.div
          animate={girando ? { rotate: 3600 } : { rotate: 0 }}
          transition={{ duration: 2, ease: "circOut" }}
          className="w-64 h-64 rounded-full border-4 border-[#e57373] border-dashed flex items-center justify-center bg-white shadow-2xl"
        >
          <span className="text-7xl">🎡</span>
        </motion.div>
      </div>

      <button onClick={girar} disabled={girando} className="btn-coral w-full max-w-[320px] text-lg font-bold">
        {girando ? "Decidiendo..." : "Girar Ruleta"}
      </button>

      {seleccionado && !girando && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-6 w-full text-center mt-4">
          <p className="text-[10px] uppercase font-black text-[#e57373] mb-1 tracking-widest">Resultado</p>
          <h2 className="text-2xl font-bold text-[#2d2d2d]">{seleccionado.nombre}</h2>
        </motion.div>
      )}
    </div>
  );
}
