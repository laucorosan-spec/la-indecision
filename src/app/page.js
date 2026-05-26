"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';
import { Star, Trophy, Calendar, Heart } from 'lucide-react';

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
    if (posibles.length === 0) return alert("¡Añade algún plan primero! ✨");
    setGirando(true);
    setSeleccionado(null);
    setPaso('ruleta');
    setTimeout(() => {
      const elegido = posibles[Math.floor(Math.random() * posibles.length)];
      setSeleccionado(elegido);
      setGirando(false);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }, 2000);
  };

  const guardarReseña = async () => {
    const { error } = await supabase.from('planes').update({ hecho: true, rating, comentario }).eq('id', seleccionado.id);
    if (!error) {
      setSeleccionado(null);
      cargarDatos();
      alert("¡Recuerdo guardado! ❤️");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-6 pb-24 max-w-md mx-auto">
      
      {/* Dashboard de Stats - Estilo Grupal */}
      <div className="glass w-full py-4 px-6 flex justify-between items-center mb-8">
        <div className="flex flex-col items-center">
          <Calendar size={16} className="text-blue-400 mb-1" />
          <span className="text-sm font-bold">{stats.dias}d</span>
          <span className="text-[10px] opacity-50 uppercase">Juntos</span>
        </div>
        <div className="w-[1px] h-8 bg-gray-200 dark:bg-gray-700"></div>
        <div className="flex flex-col items-center">
          <Heart size={16} className="text-red-400 mb-1" />
          <span className="text-sm font-bold">{stats.creados}</span>
          <span className="text-[10px] opacity-50 uppercase">Planes</span>
        </div>
        <div className="w-[1px] h-8 bg-gray-200 dark:bg-gray-700"></div>
        <div className="flex flex-col items-center">
          <Trophy size={16} className="text-yellow-400 mb-1" />
          <span className="text-sm font-bold">{stats.hechos}</span>
          <span className="text-[10px] opacity-50 uppercase">Hechos</span>
        </div>
      </div>

      <h1 className="text-4xl font-black text-[#e57373] mb-8 tracking-tighter text-center">
        LA INDECISIÓN
      </h1>
      
      {/* Selector de categoría pill-style */}
      <div className="glass p-1 w-full flex mb-10">
        <button onClick={() => setFiltro('hoy')} className={`flex-1 py-3 rounded-2xl text-xs font-black transition ${filtro === 'hoy' ? 'bg-[#e57373] text-white shadow-lg' : 'opacity-40'}`}>
          PARA HOY
        </button>
        <button onClick={() => setFiltro('futuro')} className={`flex-1 py-3 rounded-2xl text-xs font-black transition ${filtro === 'futuro' ? 'bg-[#e57373] text-white shadow-lg' : 'opacity-40'}`}>
          MÁS ADELANTE
        </button>
      </div>

      {/* LA RULETA - Grande y circular */}
      <div className="relative mb-12">
        <div className="absolute -inset-4 bg-red-400/10 rounded-full blur-2xl"></div>
        <motion.div
          animate={girando ? { rotate: 3600 } : { rotate: 0 }}
          transition={{ duration: 2, ease: "circOut" }}
          className="w-72 h-72 rounded-full border-[10px] border-white dark:border-zinc-800 border-dashed flex items-center justify-center bg-white dark:bg-zinc-900 shadow-2xl relative z-10"
        >
          <div className="text-7xl">{girando ? "💫" : "🎡"}</div>
        </motion.div>
      </div>

      <button onClick={girarRuleta} disabled={girando} className="btn-primary">
        {girando ? "Decidiendo..." : "Girar Ruleta"}
      </button>

      {/* Pop-up de Resultado */}
      <AnimatePresence>
        {seleccionado && !girando && (
          <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} className="fixed inset-x-4 bottom-24 z-50">
            <div className="glass p-8 text-center shadow-2xl border-t-4 border-[#e57373]">
              {paso === 'ruleta' ? (
                <>
                  <p className="text-xs font-bold text-[#e57373] mb-2 uppercase tracking-widest">Plan Elegido</p>
                  <h2 className="text-3xl font-black mb-8">{seleccionado.nombre}</h2>
                  <div className="flex gap-3">
                    <button onClick={() => setSeleccionado(null)} className="flex-1 py-4 bg-gray-100 dark:bg-zinc-800 rounded-2xl font-bold text-xs">PASAR</button>
                    <button onClick={() => setPaso('reseña')} className="flex-[2] py-4 bg-green-500 text-white rounded-2xl font-bold text-xs shadow-lg shadow-green-200">¡LO HEMOS HECHO!</button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-5">
                  <h2 className="text-xl font-black">¿Qué tal estuvo?</h2>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => setRating(s)} className="p-1 transform active:scale-125 transition">
                        <Star size={32} fill={s <= rating ? "#fbbf24" : "none"} stroke={s <= rating ? "#fbbf24" : "#ccc"} />
                      </button>
                    ))}
                  </div>
                  <textarea 
                    className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-black/20 border-none outline-none text-sm h-28"
                    placeholder="Escribe un recuerdo corto de este día..."
                    value={comentario} onChange={(e) => setComentario(e.target.value)}
                  />
                  <button onClick={guardarReseña} className="btn-primary w-full">Guardar en el Álbum ❤️</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
