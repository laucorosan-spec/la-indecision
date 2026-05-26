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
  
  // Estados para estadísticas y reseña
  const [stats, setStats] = useState({ dias: 0, creados: 0, hechos: 0 });
  const [paso, setPaso] = useState('ruleta'); 
  const [rating, setRating] = useState(5);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cargarDatos = async () => {
    // 1. Cargar planes para la ruleta
    const { data } = await supabase.from('planes').select('*').eq('hecho', false);
    if (data) setPlanes(data);

    // 2. Calcular días juntos
    const aniversario = localStorage.getItem('aniversario');
    let diasJuntos = 0;
    if (aniversario) {
      const inicio = new Date(aniversario);
      const hoy = new Date();
      const diff = hoy - inicio;
      diasJuntos = Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    // 3. Contar planes totales y hechos desde Supabase
    const { count: total } = await supabase.from('planes').select('*', { count: 'exact', head: true });
    const { count: terminados } = await supabase.from('planes').select('*', { count: 'exact', head: true }).eq('hecho', true);

    setStats({
      dias: diasJuntos > 0 ? diasJuntos : 0,
      creados: total || 0,
      hechos: terminados || 0
    });
  };

  useEffect(() => {
    cargarDatos();
  }, []);

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
      confetti();
    }, 2000);
  };

  const guardarExperiencia = async () => {
    setEnviando(true);
    const { error } = await supabase
      .from('planes')
      .update({ hecho: true, rating, comentario })
      .eq('id', seleccionado.id);

    if (!error) {
      alert("¡Recuerdo guardado! ❤️");
      setSeleccionado(null);
      setPaso('ruleta');
      setComentario('');
      cargarDatos(); // Recarga estadísticas
    }
    setEnviando(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 pb-24">
      {/* Dashboard de Estadísticas */}
      <div className="grid grid-cols-3 gap-3 w-full mt-4">
        <div className="glass p-3 text-center flex flex-col items-center gap-1">
          <Calendar size={14} className="text-blue-400" />
          <p className="text-[10px] uppercase text-gray-400 font-bold">Días</p>
          <p className="text-xl font-bold">{stats.dias}</p>
        </div>
        <div className="glass p-3 text-center flex flex-col items-center gap-1">
          <Heart size={14} className="text-red-400" />
          <p className="text-[10px] uppercase text-gray-400 font-bold">Planes</p>
          <p className="text-xl font-bold">{stats.creados}</p>
        </div>
        <div className="glass p-3 text-center flex flex-col items-center gap-1">
          <Trophy size={14} className="text-yellow-400" />
          <p className="text-[10px] uppercase text-gray-400 font-bold">Hechos</p>
          <p className="text-xl font-bold">{stats.hechos}</p>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-[#e57373]">La Indecisión</h1>
      
      {/* Filtros */}
      <div className="flex gap-4 glass p-2">
        <button onClick={() => setFiltro('hoy')} className={`px-4 py-2 rounded-xl transition ${filtro === 'hoy' ? 'bg-[#e57373] text-white' : ''}`}>Hoy</button>
        <button onClick={() => setFiltro('futuro')} className={`px-4 py-2 rounded-xl transition ${filtro === 'futuro' ? 'bg-[#e57373] text-white' : ''}`}>Más tarde</button>
      </div>

      {/* Ruleta */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        <motion.div
          animate={girando ? { rotate: 3600 } : { rotate: 0 }}
          transition={{ duration: 2, ease: "circOut" }}
          className="w-full h-full rounded-full border-8 border-[#e57373] border-dashed flex items-center justify-center bg-white dark:bg-zinc-900 shadow-2xl"
        >
          <span className="text-6xl">{girando ? "💫" : "🎡"}</span>
        </motion.div>
      </div>

      <button onClick={girarRuleta} disabled={girando || paso === 'reseña'} className="btn-primary w-full max-w-xs">
        {girando ? "Decidiendo..." : "Girar Ruleta"}
      </button>

      {/* Cartel de Resultado */}
      <AnimatePresence>
        {seleccionado && !girando && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass p-6 w-full text-center">
            {paso === 'ruleta' ? (
              <>
                <h2 className="text-xl font-bold mb-2">¡Plan elegido!</h2>
                <p className="text-3xl font-bold text-[#e57373] mb-4">{seleccionado.nombre}</p>
                <div className="flex gap-3">
                  <button onClick={() => setSeleccionado(null)} className="flex-1 p-3 bg-gray-500/10 rounded-2xl">Rechazar</button>
                  <button onClick={() => setPaso('reseña')} className="flex-1 p-3 bg-green-500 text-white rounded-2xl font-bold">¡Aceptar!</button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold">¿Qué tal estuvo?</h2>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)}>
                      <Star size={32} fill={star <= rating ? "#fbbf24" : "none"} stroke={star <= rating ? "#fbbf24" : "#d1d5db"} />
                    </button>
                  ))}
                </div>
                <textarea 
                  placeholder="Escribe algo sobre este día..." 
                  className="w-full p-3 rounded-xl bg-white/5 dark:bg-black/20 border border-white/10 outline-none h-24"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                />
                <button onClick={guardarExperiencia} disabled={enviando} className="btn-primary w-full">
                  {enviando ? "Guardando..." : "Guardar en el Álbum ❤️"}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
