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
    if (posibles.length === 0) return alert("¡Añade un plan primero!");
    setGirando(true);
    setSeleccionado(null);
    setPaso('ruleta');
    setTimeout(() => {
      const elegido = posibles[Math.floor(Math.random() * posibles.length)];
      setSeleccionado(elegido);
      setGirando(false);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }, 2000);
  };

  const guardarReseña = async () => {
    const { error } = await supabase.from('planes').update({ hecho: true, rating, comentario }).eq('id', seleccionado.id);
    if (!error) {
      setSeleccionado(null);
      cargarDatos();
      alert("¡Plan completado! ❤️");
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 px-6 pt-10 pb-32 max-w-md mx-auto">
      
      {/* Dashboard Stats - Pequeño y elegante */}
      <div className="glass w-full flex justify-around py-4">
        <div className="flex flex-col items-center">
          <Calendar size={16} className="text-blue-400 opacity-70 mb-1" />
          <span className="text-lg font-bold">{stats.dias}</span>
          <span className="text-[10px] uppercase opacity-40 font-black">Días</span>
        </div>
        <div className="flex flex-col items-center">
          <Heart size={16} className="text-red-400 opacity-70 mb-1" />
          <span className="text-lg font-bold">{stats.creados}</span>
          <span className="text-[10px] uppercase opacity-40 font-black">Planes</span>
        </div>
        <div className="flex flex-col items-center">
          <Trophy size={16} className="text-yellow-400 opacity-70 mb-1" />
          <span className="text-lg font-bold">{stats.hechos}</span>
          <span className="text-[10px] uppercase opacity-40 font-black">Hechos</span>
        </div>
      </div>

      <h1 className="text-4xl font-black text-[#e57373] tracking-tighter">La Indecisión</h1>
      
      {/* Filtros */}
      <div className="glass p-1 w-full flex">
        <button onClick={() => setFiltro('hoy')} className={`flex-1 py-3 rounded-2xl text-[10px] font-black transition ${filtro === 'hoy' ? 'bg-[#e57373] text-white shadow-lg' : 'opacity-40'}`}>
          PARA HOY
        </button>
        <button onClick={() => setFiltro('futuro')} className={`flex-1 py-3 rounded-2xl text-[10px] font-black transition ${filtro === 'futuro' ? 'bg-[#e57373] text-white shadow-lg' : 'opacity-40'}`}>
          MÁS ADELANTE
        </button>
      </div>

      {/* LA RULETA - Tamaño Grande y Profesional */}
      <div className="relative py-4">
        <motion.div
          animate={girando ? { rotate: 3600 } : { rotate: 0 }}
          transition={{ duration: 2, ease: "circOut" }}
          className="w-64 h-64 rounded-full border-[6px] border-[#e57373] border-dashed flex items-center justify-center bg-white dark:bg-zinc-900 shadow-2xl relative"
        >
          <div className="absolute inset-2 border border-[#e57373]/20 rounded-full"></div>
          <span className="text-6xl drop-shadow-md">{girando ? "💫" : "🎡"}</span>
        </motion.div>
      </div>

      <button onClick={girarRuleta} disabled={girando} className="btn-primary">
        {girando ? "Decidiendo..." : "Girar Ruleta"}
      </button>

      {/* Resultado Flotante */}
      <AnimatePresence>
        {seleccionado && !girando && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed inset-x-6 bottom-32 z-50">
            <div className="glass p-8 text-center shadow-2xl border-t-4 border-[#e57373]">
              {paso === 'ruleta' ? (
                <>
                  <p className="text-[10px] font-black text-[#e57373] mb-1 uppercase tracking-widest">El destino dice...</p>
                  <h2 className="text-3xl font-bold mb-8 tracking-tight">{seleccionado.nombre}</h2>
                  <div className="flex gap-3">
                    <button onClick={() => setSeleccionado(null)} className="flex-1 py-4 bg-gray-100 dark:bg-zinc-800 rounded-2xl font-bold text-xs uppercase">Pasar</button>
                    <button onClick={() => setPaso('reseña')} className="flex-1 py-4 bg-green-500 text-white rounded-2xl font-bold text-xs uppercase shadow-lg">¡Aceptar!</button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-5">
                  <h2 className="text-xl font-bold italic">¿Qué tal estuvo?</h2>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => setRating(s)} className="p-1 transform active:scale-125 transition">
                        <Star size={30} fill={s <= rating ? "#fbbf24" : "none"} stroke={s <= rating ? "#fbbf24" : "#ccc"} />
                      </button>
                    ))}
                  </div>
                  <textarea 
                    className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-black/20 border-none outline-none text-sm h-24"
                    placeholder="Escribe un recuerdo..."
                    value={comentario} onChange={(e) => setComentario(e.target.value)}
                  />
                  <button onClick={guardarReseña} className="btn-primary w-full">Guardar Recuerdo ❤️</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
