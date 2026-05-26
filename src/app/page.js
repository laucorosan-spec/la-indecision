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
    if (posibles.length === 0) return alert("No hay planes aquí");
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
    <div className="flex flex-col items-center gap-10 pt-10 px-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-[#e57373]">La Indecisión</h1>
      
      {/* Selector de Categoría */}
      <div className="bg-white/50 p-1 rounded-full flex gap-1 shadow-inner">
        <button onClick={() => setFiltro('hoy')} className={`px-6 py-2 rounded-full text-sm font-medium transition ${filtro === 'hoy' ? 'bg-[#e57373] text-white shadow-md' : 'text-gray-500'}`}>Hoy</button>
        <button onClick={() => setFiltro('futuro')} className={`px-6 py-2 rounded-full text-sm font-medium transition ${filtro === 'futuro' ? 'bg-[#e57373] text-white shadow-md' : 'text-gray-500'}`}>Futuro</button>
      </div>

      {/* Círculo Punteado */}
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={girando ? { rotate: 3600 } : { rotate: 0 }}
          transition={{ duration: 2, ease: "circOut" }}
          className="w-64 h-64 rounded-full border-4 border-[#e57373] border-dashed flex items-center justify-center bg-white shadow-xl"
        >
          <span className="text-6xl">🎡</span>
        </motion.div>
      </div>

      <button onClick={girar} disabled={girando} className="btn-coral w-full text-lg">
        {girando ? "Decidiendo..." : "Girar Ruleta"}
      </button>

      {seleccionado && !girando && (
        <div className="glass-card p-6 w-full text-center mt-4">
          <p className="text-xs uppercase font-bold text-[#e57373] mb-1">Resultado</p>
          <h2 className="text-2xl font-bold">{seleccionado.nombre}</h2>
        </div>
      )}
    </div>
  );
}
