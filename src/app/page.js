"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';
import { Star, Moon, Heart, Trophy, Calendar } from 'lucide-react'; // Asegúrate de que lucide-react esté instalado

export default function Home() {
  const [planes, setPlanes] = useState([]);
  const [filtro, setFiltro] = useState('hoy'); 
  const [seleccionado, setSeleccionado] = useState(null);
  const [girando, setGirando] = useState(false);
  
  const [paso, setPaso] = useState('ruleta'); // 'ruleta' o 'reseña'
  const [rating, setRating] = useState(5);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cargarPlanes = async () => {
    const { data, error } = await supabase
      .from('planes')
      .select('*')
      .eq('hecho', false);
    if (!error) setPlanes(data);
  };

  useEffect(() => {
    cargarPlanes();
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

  // Función final para guardar todo en Supabase
  const guardarExperiencia = async () => {
    setEnviando(true);
    const { error } = await supabase
      .from('planes')
      .update({ 
        hecho: true, 
        rating: rating, 
        comentario: comentario 
      })
      .eq('id', seleccionado.id);

    if (!error) {
      alert("¡Recuerdo guardado con éxito! ❤️");
      setSeleccionado(null);
      setPaso('ruleta');
      setComentario('');
      setRating(5);
      cargarPlanes();
    } else {
      alert("Error al guardar: " + error.message);
    }
    setEnviando(false);
  };

  return (
    <div className="flex flex-col items-center gap-8 pb-10">
      <h1 className="text-3xl font-bold text-[#e57373] mt-4">La Indecisión</h1>
      
      {/* Filtros */}
      <div className="flex gap-4 glass p-2">
        <button onClick={() => setFiltro('hoy')} className={`px-4 py-2 rounded-xl transition ${filtro === 'hoy' ? 'bg-[#e57373] text-white' : ''}`}>Hoy</button>
        <button onClick={() => setFiltro('futuro')} className={`px-4 py-2 rounded-xl transition ${filtro === 'futuro' ? 'bg-[#e57373] text-white' : ''}`}>Más adelante</button>
      </div>

      {/* Ruleta Animada */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        <motion.div
          animate={girando ? { rotate: 3600 } : { rotate: 0 }}
          transition={{ duration: 2, ease: "circOut" }}
          className="w-full h-full rounded-full border-8 border-[#e57373] border-dashed flex items-center justify-center bg-white shadow-2xl"
        >
          <span className="text-6xl">{girando ? "💫" : "🎡"}</span>
        </motion.div>
      </div>

      <button onClick={girarRuleta} disabled={girando || paso === 'reseña'} className="btn-primary w-full max-w-xs text-lg">
        {girando ? "Decidiendo..." : "Girar Ruleta"}
      </button>

      {/* Interfaz de Resultado y Reseña */}
      <AnimatePresence>
        {seleccionado && !girando && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-6 w-full text-center shadow-2xl border-2 border-[#e57373]/20"
          >
            {paso === 'ruleta' ? (
              <>
                <h2 className="text-xl font-bold mb-2">¡Plan elegido!</h2>
                <p className="text-3xl font-bold text-[#e57373] mb-2">{seleccionado.nombre}</p>
                <p className="text-gray-500 mb-6">📍 {seleccionado.ubicacion || 'Sin ubicación'}</p>
                
                <div className="flex gap-3">
                  <button onClick={() => setSeleccionado(null)} className="flex-1 p-3 bg-gray-100 rounded-2xl font-medium">Rechazar</button>
                  <button onClick={() => setPaso('reseña')} className="flex-1 p-3 bg-green-500 text-white rounded-2xl font-bold shadow-lg shadow-green-200">¡Aceptar!</button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold">¿Qué tal estuvo?</h2>
                
                {/* Selector de estrellas */}
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)}>
                      <Star 
                        size={32} 
                        fill={star <= rating ? "#fbbf24" : "none"} 
                        stroke={star <= rating ? "#fbbf24" : "#d1d5db"} 
                      />
                    </button>
                  ))}
                </div>

                <textarea 
                  placeholder="Escribe un recuerdo corto..." 
                  className="w-full p-3 rounded-xl bg-white/50 border-none outline-none resize-none h-24 text-sm"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                />

                <button 
                  onClick={guardarExperiencia} 
                  disabled={enviando}
                  className="w-full p-4 bg-[#e57373] text-white rounded-2xl font-bold shadow-lg"
                >
                  {enviando ? "Guardando..." : "Guardar en el Álbum ❤️"}
                </button>
                <button onClick={() => setPaso('ruleta')} className="text-sm text-gray-400">Volver atrás</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
