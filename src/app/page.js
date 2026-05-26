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
    if (posibles.length === 0) return alert("No hay planes en esta categoría");
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
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-sm mx-auto pt-2">
      
      {/* Mini Stats arriba - Muy discretas */}
      <div className="flex w-full justify-around opacity-60 scale-90">
        <div className="flex items-center gap-1"><Calendar size={12}/> <span className="text-xs font-bold">{stats.dias}d</span></div>
        <div className="flex items-center gap-1"><Heart size={12}/> <span className="text-xs font-bold">{stats.creados}</span></div>
        <div className="flex items-center gap-1"><Trophy size={12}/> <span className="text-xs font-bold">{stats.hechos}</span></div>
      </div>

      <h1 className="text-3xl font-bold text-[#e57373] tracking-tight">La Indecisión</h1>
      
      {/* Filtros simples */}
      <div className="flex gap-2 glass p-1 w-full">
        {['hoy', 'futuro'].map((f) => (
          <button 
            key={f}
            onClick={() => setFiltro(f)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${filtro === f ? 'bg-[#e57373] text-white' : 'opacity-50'}`}
          >
            {f === 'hoy' ? 'HOY' : 'PRÓXIMAMENTE'}
          </button>
        ))}
      </div>

      {/* Ruleta - Tamaño original recuperado */}
      <div className="relative py-4">
        <motion.div
          animate={girando ? { rotate: 3600 } : { rotate: 0 }}
          transition={{ duration: 2, ease: "circOut" }}
          className="w-64 h-64 rounded-full border-8 border-[#e57373] border-dashed flex items-center justify-center bg-white dark:bg-zinc-900 shadow-xl"
        >
          <span className="text-5xl">{girando ? "💫" : "🎡"}</span>
        </motion.div>
      </div>

      <button onClick={girarRuleta} disabled={girando} className="btn-primary text-lg">
        {girando ? "Decidiendo..." : "Girar Ruleta"}
      </button>

      {/* Resultado */}
      <AnimatePresence>
        {seleccionado && !girando && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 w-full text-center">
            {paso === 'ruleta' ? (
              <>
                <h2 className="text-lg opacity-60 mb-1">¡Plan elegido!</h2>
                <p className="text-2xl font-bold text-[#e57373] mb-6">{seleccionado.nombre}</p>
                <div className="flex gap-2">
                  <button onClick={() => setSeleccionado(null)} className="flex-1 p-3 bg-gray-200 dark:bg-zinc-800 rounded-xl text-sm font-bold">Pasar</button>
                  <button onClick={() => setPaso('reseña')} className="flex-1 p-3 bg-green-500 text-white rounded-xl text-sm font-bold">¡Hecho!</button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <h2 className="font-bold">¿Qué tal estuvo?</h2>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setRating(s)}>
                      <Star size={24} fill={s <= rating ? "#fbbf24" : "none"} stroke={s <= rating ? "#fbbf24" : "#ccc"} />
                    </button>
                  ))}
                </div>
                <textarea 
                  className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border-none outline-none text-sm h-20"
                  placeholder="Escribe un recuerdo..."
                  value={comentario} onChange={(e) => setComentario(e.target.value)}
                />
                <button onClick={guardarReseña} className="btn-primary">Guardar recuerdo ❤️</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
