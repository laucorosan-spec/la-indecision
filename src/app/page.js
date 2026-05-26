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
  const [enviando, setEnviando] = useState(false);

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
    const { count: terminados } = await supabase.from('planes').select('*', { count: 'exact', head: true }).eq('hecho', true);

    setStats({ dias: diasJuntos > 0 ? diasJuntos : 0, creados: total || 0, hechos: terminados || 0 });
  };

  useEffect(() => { cargarDatos(); }, []);

  const girarRuleta = () => {
    const posibles = planes.filter(p => p.categoria === filtro);
    if (posibles.length === 0) return alert("No hay planes aquí aún. ¡Añade uno!");
    
    setGirando(true);
    setSeleccionado(null);
    setPaso('ruleta');
    
    setTimeout(() => {
      const elegido = posibles[Math.floor(Math.random() * posibles.length)];
      setSeleccionado(elegido);
      setGirando(false);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#ff5252', '#ffffff'] });
    }, 2000);
  };

  const guardarExperiencia = async () => {
    setEnviando(true);
    const { error } = await supabase.from('planes').update({ hecho: true, rating, comentario }).eq('id', seleccionado.id);
    if (!error) {
      setSeleccionado(null);
      setPaso('ruleta');
      setComentario('');
      cargarDatos();
    }
    setEnviando(false);
  };

  return (
    <div className="flex flex-col items-center gap-8 py-4 px-2 max-w-md mx-auto">
      {/* Header Dashboard */}
      <div className="flex w-full gap-3">
        {[
          { label: 'Días', val: stats.dias, icon: <Calendar size={14} />, col: 'text-blue-400' },
          { label: 'Ideas', val: stats.creados, icon: <Heart size={14} />, col: 'text-red-400' },
          { label: 'Hechos', val: stats.hechos, icon: <Trophy size={14} />, col: 'text-yellow-400' }
        ].map((item, i) => (
          <div key={i} className="glass flex-1 p-3 flex flex-col items-center">
            <span className={item.col}>{item.icon}</span>
            <span className="text-xl font-black mt-1">{item.val}</span>
            <span className="text-[9px] uppercase tracking-tighter opacity-50 font-bold">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-black tracking-tight text-[#e57373]">LA INDECISIÓN</h1>
        <p className="text-xs opacity-50 font-medium mt-1 uppercase tracking-[0.2em]">¿Qué aventura toca hoy?</p>
      </div>
      
      {/* Filtros Estéticos */}
      <div className="flex gap-2 glass p-1.5 w-full max-w-[280px]">
        {['hoy', 'futuro'].map((f) => (
          <button 
            key={f}
            onClick={() => setFiltro(f)}
            className={`flex-1 py-2 rounded-2xl text-xs font-bold transition-all ${filtro === f ? 'bg-[#e57373] text-white shadow-md' : 'opacity-50'}`}
          >
            {f === 'hoy' ? 'PARA HOY' : 'MÁS ADELANTE'}
          </button>
        ))}
      </div>

      {/* Ruleta Rediseñada */}
      <div className="relative group">
        <div className="absolute -inset-4 bg-[#e57373]/20 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
        <motion.div
          animate={girando ? { rotate: 3600 } : { rotate: 0 }}
          transition={{ duration: 2, ease: [0.45, 0.05, 0.55, 0.95] }}
          className="relative w-72 h-72 rounded-full border-[12px] border-white dark:border-zinc-800 shadow-2xl flex items-center justify-center bg-white dark:bg-zinc-900"
        >
          <div className="absolute inset-0 rounded-full border-[2px] border-dashed border-[#e57373]/30 m-2"></div>
          <span className="text-7xl drop-shadow-lg">{girando ? "✨" : "🎡"}</span>
        </motion.div>
      </div>

      <button onClick={girarRuleta} disabled={girando || paso === 'reseña'} className="btn-primary text-lg tracking-wide uppercase">
        {girando ? <RefreshCw className="animate-spin mr-2" /> : null}
        {girando ? "Decidiendo..." : "Girar Ruleta"}
      </button>

      {/* Pop-up de Resultado Estético */}
      <AnimatePresence>
        {seleccionado && !girando && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed inset-x-4 bottom-24 z-[100]">
            <div className="glass p-8 text-center max-w-sm mx-auto border-t-4 border-[#e57373]">
              {paso === 'ruleta' ? (
                <>
                  <p className="text-[#e57373] text-xs font-black uppercase tracking-widest mb-2">¡Ha salido!</p>
                  <h2 className="text-3xl font-bold mb-6">{seleccionado.nombre}</h2>
                  <div className="flex gap-3">
                    <button onClick={() => setSeleccionado(null)} className="flex-1 py-4 px-2 rounded-3xl bg-zinc-100 dark:bg-zinc-800 font-bold text-xs uppercase opacity-70">Pasar</button>
                    <button onClick={() => setPaso('reseña')} className="flex-[2] py-4 px-2 rounded-3xl bg-green-500 text-white font-bold text-xs uppercase shadow-lg shadow-green-500/30">¡Aceptamos!</button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-5">
                  <h2 className="text-xl font-bold">¿Cómo fue la cita?</h2>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => setRating(s)} className="transform active:scale-125 transition">
                        <Star size={32} fill={s <= rating ? "#fbbf24" : "none"} stroke={s <= rating ? "#fbbf24" : "#d1d5db"} />
                      </button>
                    ))}
                  </div>
                  <textarea 
                    placeholder="Cuéntame un detalle bonito..." 
                    className="w-full p-4 rounded-2xl bg-zinc-100 dark:bg-black/40 border-none outline-none h-24 text-sm"
                    value={comentario} onChange={(e) => setComentario(e.target.value)}
                  />
                  <button onClick={guardarExperiencia} disabled={enviando} className="btn-primary">
                    {enviando ? "Guardando..." : "Cerrar Recuerdo ❤️"}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
