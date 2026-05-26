"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';
import { Star, Trophy, Calendar, Heart, RefreshCw } from 'lucide-react';

export default function Home() {
  const [planes, setPlanes] = useState([]);
  const [filtro, setFiltro] = useState('hoy'); 
  const [seleccionado, setSeleccionado] = useState(null);
  const [girando, setGirando] = useState(false);
  const [stats, setStats] = useState({ dias: 0, creados: 0, hechos: 0 });
  const [paso, setPaso] = useState('ruleta'); 
  const [rating, setRating] = useState(5);
  const [comentario, setComentario] = useState('');

  const cargarDatos = async () => {
    const { data } = await supabase.from('planes').select('*').eq('hecho', false);
    if (data) setPlanes(data);

    const aniversario = localStorage.getItem('aniversario');
    let diasJuntos = 0;
    if (aniversario) {
      const diff = new Date() - new Date(aniversario);
      diasJuntos = Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    const { count: total } = await supabase.from('planes').select('*', { count: 'exact', head: true });
    const { count: hechos } = await supabase.from('planes').select('*', { count: 'exact', head: true }).eq('hecho', true);
    setStats({ dias: diasJuntos > 0 ? diasJuntos : 0, creados: total || 0, hechos: hechos || 0 });
  };

  useEffect(() => { cargarDatos(); }, []);

  const girarRuleta = () => {
    const posibles = planes.filter(p => p.categoria === filtro);
    if (posibles.length === 0) return alert("¡Añade algún plan en la pestaña +!");
    setGirando(true);
    setSeleccionado(null);
    setPaso('ruleta');
    setTimeout(() => {
      const elegido = posibles[Math.floor(Math.random() * posibles.length)];
      setSeleccionado(elegido);
      setGirando(false);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.7 } });
    }, 2000);
  };

  const guardarReseña = async () => {
    const { error } = await supabase.from('planes').update({ hecho: true, rating, comentario }).eq('id', seleccionado.id);
    if (!error) {
      setSeleccionado(null);
      cargarDatos();
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 px-6 pt-8 pb-32 max-w-md mx-auto min-h-screen">
      
      {/* Dashboard de Stats - Tarjeta Unificada */}
      <div className="glass w-full grid grid-cols-3 py-5 px-2 text-center relative overflow-hidden">
        <div className="flex flex-col items-center border-r border-gray-200 dark:border-gray-700">
          <Calendar size={18} className="text-blue-400 mb-1" />
          <span className="text-xl font-black">{stats.dias}</span>
          <span className="text-[10px] uppercase font-bold opacity-40">Días</span>
        </div>
        <div className="flex flex-col items-center border-r border-gray-200 dark:border-gray-700">
          <Heart size={18} className="text-red-400 mb-1" />
          <span className="text-xl font-black">{stats.creados}</span>
          <span className="text-[10px] uppercase font-bold opacity-40">Ideas</span>
        </div>
        <div className="flex flex-col items-center">
          <Trophy size={18} className="text-yellow-500 mb-1" />
          <span className="text-xl font-black">{stats.hechos}</span>
          <span className="text-[10px] uppercase font-bold opacity-40">Hechos</span>
        </div>
      </div>

      <h1 className="text-4xl font-black text-[#e57373] tracking-tighter text-center italic">
        LA INDECISIÓN
      </h1>
      
      {/* Filtros Pill-style */}
      <div className="glass p-1.5 w-full flex gap-1">
        <button onClick={() => setFiltro('hoy')} className={`flex-1 py-3 rounded-[20px] text-xs font-black transition-all duration-300 ${filtro === 'hoy' ? 'bg-[#e57373] text-white shadow-lg' : 'opacity-40 hover:opacity-60'}`}>
          PARA HOY
        </button>
        <button onClick={() => setFiltro('futuro')} className={`flex-1 py-3 rounded-[20px] text-xs font-black transition-all duration-300 ${filtro === 'futuro' ? 'bg-[#e57373] text-white shadow-lg' : 'opacity-40'}`}>
          MÁS TARDE
        </button>
      </div>

      {/* LA RULETA - GRANDE Y ESTÉTICA */}
      <div className="relative py-6">
        <div className="absolute inset-0 bg-red-400/5 rounded-full blur-3xl transform scale-110"></div>
        <motion.div
          animate={girando ? { rotate: 3600 } : { rotate: 0 }}
          transition={{ duration: 2, ease: "circOut" }}
          className="w-72 h-72 rounded-full border-[12px] border-white dark:border-zinc-800 border-dashed flex items-center justify-center bg-white dark:bg-zinc-900 shadow-2xl relative z-10"
        >
          <div className="absolute inset-2 border-2 border-[#e57373]/10 rounded-full"></div>
          <span className="text-7xl drop-shadow-2xl">{girando ? "💫" : "🎡"}</span>
        </motion.div>
      </div>

      <button onClick={girarRuleta} disabled={girando} className="btn-primary">
        {girando ? <RefreshCw className="animate-spin inline mr-2" /> : null}
        {girando ? "Decidiendo..." : "Girar Ruleta"}
      </button>

      {/* Resultado Animado */}
      <AnimatePresence>
        {seleccionado && !girando && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed inset-x-6 bottom-32 z-50">
            <div className="glass p-8 text-center shadow-2xl border-t-[6px] border-[#e57373]">
              {paso === 'ruleta' ? (
                <>
                  <p className="text-[10px] font-black text-[#e57373] mb-2 uppercase tracking-[3px]">Plan Seleccionado</p>
                  <h2 className="text-3xl font-black mb-10 tracking-tight leading-tight">{seleccionado.nombre}</h2>
                  <div className="flex gap-4">
                    <button onClick={() => setSeleccionado(null)} className="flex-1 py-4 bg-gray-100 dark:bg-zinc-800 rounded-2xl font-black text-[10px] uppercase tracking-widest">Rechazar</button>
                    <button onClick={() => setPaso('reseña')} className="flex-[2] py-4 bg-green-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-500/30">¡Aceptar!</button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-6">
                  <h2 className="text-xl font-black uppercase tracking-tighter italic">¿Cómo fue la experiencia?</h2>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => setRating(s)} className="transform active:scale-150 transition-transform">
                        <Star size={34} fill={s <= rating ? "#fbbf24" : "none"} stroke={s <= rating ? "#fbbf24" : "#d1d5db"} />
                      </button>
                    ))}
                  </div>
                  <textarea 
                    className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-black/20 border-none outline-none text-sm h-28 resize-none shadow-inner"
                    placeholder="Cuéntame un detalle para recordar..."
                    value={comentario} onChange={(e) => setComentario(e.target.value)}
                  />
                  <button onClick={guardarReseña} className="btn-primary w-full shadow-xl">Guardar Recuerdo ❤️</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
