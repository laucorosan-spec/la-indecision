"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Camera, Star, Trash2, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [planes, setPlanes] = useState([]);
  const [filtro, setFiltro] = useState('hoy');
  const [seleccionado, setSeleccionado] = useState(null);
  const [girando, setGirando] = useState(false);
  const [mostrarReseña, setMostrarReseña] = useState(false);
  const [reseña, setReseña] = useState({ rating: 5, comentario: '', fecha: '', foto: '' });

  // --- LÓGICA DE EMOJIS ---
  const emojis = ["🎡", "🍕", "🎬", "🍷", "🍦", "🎨", "🎭", "🎳", "🍱", "🍿", "🧗", "🥐"];
  const [emojiActual, setEmojiActual] = useState("🎡");

  useEffect(() => {
    let intervalo;
    if (girando) {
      intervalo = setInterval(() => {
        setEmojiActual(emojis[Math.floor(Math.random() * emojis.length)]);
      }, 100); 
    } else {
      setEmojiActual("🎡");
    }
    return () => clearInterval(intervalo);
  }, [girando]);

  // --- CARGAR DATOS ---
  const cargarPlanes = async () => {
    const { data, error } = await supabase.from('planes').select('*').eq('hecho', false);
    if (data) setPlanes(data);
  };

  useEffect(() => { 
    cargarPlanes(); 
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // --- ACCIONES ---
  const girarRuleta = () => {
    const posibles = planes.filter(p => p.categoria === filtro);
    if (posibles.length === 0) return alert("No hay planes pendientes en esta categoría");
    
    setGirando(true);
    setSeleccionado(null);
    
    setTimeout(() => {
      const elegido = posibles[Math.floor(Math.random() * posibles.length)];
      setSeleccionado(elegido);
      setGirando(false);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 2000);
  };

  const completarPlan = async () => {
    setMostrarReseña(true);
  };

  const guardarReseña = async () => {
    // Aquí actualizamos el plan en Supabase como "hecho"
    const { error } = await supabase
      .from('planes')
      .update({ hecho: true, reseña: reseña.comentario, rating: reseña.rating })
      .eq('id', seleccionado.id);

    if (!error) {
      alert("¡Plan guardado en el historial! ✨");
      setSeleccionado(null);
      setMostrarReseña(false);
      cargarPlanes();
    }
  };

  return (
    <div className="min-h-screen bg-[#fff5f5] dark:bg-[#121212] p-4 font-sans transition-colors duration-300">
      <div className="max-w-md mx-auto flex flex-col items-center gap-8 pt-8">
        
        <h1 className="text-4xl font-extrabold text-[#e57373] tracking-tight">La Indecisión</h1>
        
        {!mostrarReseña ? (
          <>
            {/* Filtros */}
            <div className="flex gap-4 bg-white dark:bg-[#1e1e1e] p-2 rounded-2xl shadow-sm w-full">
              <button 
                onClick={() => setFiltro('hoy')} 
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${filtro === 'hoy' ? 'bg-[#e57373] text-white shadow-md' : 'text-gray-400'}`}
              >
                Hoy
              </button>
              <button 
                onClick={() => setFiltro('futuro')} 
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${filtro === 'futuro' ? 'bg-[#e57373] text-white shadow-md' : 'text-gray-400'}`}
              >
                Futuro
              </button>
            </div>

            {/* Ruleta / Emoji */}
            <motion.div 
              animate={girando ? { rotate: 3600, scale: 1.05 } : { rotate: 0, scale: 1 }} 
              transition={{ duration: 2, ease: "circOut" }} 
              className="w-64 h-64 rounded-full border-8 border-[#e57373] border-dashed flex items-center justify-center bg-white dark:bg-[#1e1e1e] shadow-2xl text-8xl"
            >
              {emojiActual}
            </motion.div>

            {/* Botón Girar */}
            <button 
              onClick={girarRuleta} 
              disabled={girando} 
              className={`w-full py-4 rounded-2xl text-white font-bold text-xl transition-all active:scale-95 shadow-lg ${girando ? 'bg-gray-400' : 'bg-[#e57373] hover:bg-[#d65f5f]'}`}
            >
              {girando ? "Decidiendo..." : "Girar Ruleta"}
            </button>

            {/* Resultado */}
            <AnimatePresence>
              {seleccionado && !girando && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="w-full bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl shadow-xl border-2 border-[#e57373] text-center"
                >
                  <p className="text-gray-500 dark:text-gray-400 uppercase text-xs font-bold tracking-widest mb-2">Plan elegido:</p>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{seleccionado.titulo}</h2>
                  <button 
                    onClick={completarPlan}
                    className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition-colors"
                  >
                    <CheckCircle size={20} /> Lo hemos hecho
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* Vista de Reseña */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-center dark:text-white">¿Qué tal estuvo el plan?</h2>
            <div className="flex justify-center gap-2 mb-6">
              {[1,2,3,4,5].map(num => (
                <Star 
                  key={num} 
                  size={32} 
                  onClick={() => setReseña({...reseña, rating: num})}
                  className={`cursor-pointer transition ${reseña.rating >= num ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <textarea 
              placeholder="Cuéntame un poco..."
              className="w-full p-4 rounded-xl border dark:bg-[#2d2d2d] dark:border-gray-700 dark:text-white mb-4 h-32"
              onChange={(e) => setReseña({...reseña, comentario: e.target.value})}
            />
            <button 
              onClick={guardarReseña}
              className="w-full bg-[#e57373] text-white py-4 rounded-2xl font-bold shadow-lg"
            >
              Guardar en Recuerdos
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
