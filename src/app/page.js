"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';
import { Star } from 'lucide-react';

export default function Home() {
  const [planes, setPlanes] = useState([]);
  const [filtro, setFiltro] = useState('hoy'); 
  const [seleccionado, setSeleccionado] = useState(null);
  const [girando, setGirando] = useState(false);
  const [paso, setPaso] = useState('ruleta'); 
  const [rating, setRating] = useState(5);
  const [comentario, setComentario] = useState('');

  useEffect(() => {
    const cargarPlanes = async () => {
      const { data } = await supabase.from('planes').select('*').eq('hecho', false);
      if (data) setPlanes(data);
    };
    cargarPlanes();
  }, []);

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
      alert("¡Recuerdo guardado! ❤️");
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 px-6 pt-12 pb-32 max-w-md mx-auto">
      <h1 className="text-4xl font-black text-[#e57373] tracking-tighter italic">LA INDECISIÓN</h1>
      
      <div className="glass p-1 w-full flex">
        <button onClick={() => setFiltro('hoy')} className={`flex-1 py-3 rounded-2xl text-[10px] font-black transition ${filtro === 'hoy' ? 'bg-[#e57373] text-white shadow-lg' : 'opacity-40'}`}>
          PARA HOY
        </button>
        <button onClick={() => setFiltro('futuro')} className={`flex-1 py-3 rounded-2xl text-[10px] font-black transition ${filtro === 'futuro' ? 'bg-[#e57373] text-white shadow-lg' : 'opacity-40'}`}>
          MÁS TARDE
        </button>
      </div>

      <div className="relative">
        <motion.div
          animate={girando ? { rotate: 3600 } : { rotate: 0 }}
          transition={{ duration: 2, ease: "circOut" }}
          className="w-72 h-72 rounded-full border-[8px] border-[#e57373] border-dashed flex items-center justify-center bg-white dark:bg-zinc-900 shadow-2xl"
        >
          <span className="text-7xl">{girando ? "💫" : "🎡"}</span>
        </motion.div>
      </div>

      <button onClick={girarRuleta} disabled={girando} className="btn-primary text-lg">
        {girando ? "DECIDIENDO..." : "GIRAR RULETA"}
      </button>

      <AnimatePresence>
        {seleccionado && !girando && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed inset-x-6 bottom-32 z-50">
            <div className="glass p-8 text-center shadow-2xl border-t-4 border-[#e57373]">
              {paso === 'ruleta' ? (
                <>
                  <p className="text-[10px] font-black text-[#e57373] mb-1 uppercase tracking-widest">Salió el plan...</p>
                  <h2 className="text-3xl font-bold mb-8">{seleccionado.nombre}</h2>
                  <div className="flex gap-2">
                    <button onClick={() => setSeleccionado(null)} className="flex-1 py-3 bg-gray-100 dark:bg-zinc-800 rounded-xl font-bold text-xs uppercase opacity-60">Pasar</button>
                    <button onClick={() => setPaso('reseña')} className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold text-xs uppercase shadow-lg">¡Aceptar!</button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-5">
                  <h2 className="text-xl font-bold italic">¿Qué tal estuvo?</h2>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => setRating(s)}>
                        <Star size={32} fill={s <= rating ? "#fbbf24" : "none"} stroke={s <= rating ? "#fbbf24" : "#ccc"} />
                      </button>
                    ))}
                  </div>
                  <textarea 
                    className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border-none outline-none text-sm h-24"
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
