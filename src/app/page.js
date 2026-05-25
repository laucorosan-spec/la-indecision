"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Camera, 
  Star, 
  Trash2, 
  CheckCircle, 
  Moon, 
  Sun, 
  Heart, 
  Award, 
  Calendar 
} from 'lucide-react';
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
    const { data } = await supabase.from('planes').select('*').eq('hecho', false);
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

  const guardarReseña = async () => {
    const { error } = await supabase
      .from('planes')
      .update({ hecho: true, reseña: reseña.comentario, rating: reseña.rating })
      .eq('id', seleccionado.id);

    if (!error) {
      alert("¡Plan guardado! ✨");
      setSeleccionado(null);
      setMostrarReseña(false);
      cargarPlanes();
    }
  };

  return (
    <div className="min-h-screen bg-[#fff5f5] dark:bg-[#121212] p-4 transition-colors duration-300">
      <div className="max-w-md mx-auto flex flex-col items-center gap-8 pt-8">
        
        {/* Cabecera con Iconos que mencionaba tu error */}
        <div className="flex items-center gap-2">
          <Heart className="text-[#e57373]" fill="#e57373" />
          <h1 className="text-3xl font-bold text-[#e57373]">La Indecisión</h1>
          <Award className="text-[#e57373]" />
        </div>
        
        {!mostrarReseña ? (
          <>
            {/* Filtros con Calendario */}
            <div className="flex gap-4 bg-white dark:bg-[#1e1e1e] p-2 rounded-2xl shadow-sm w-full">
              <button 
                onClick={() => setFiltro('hoy')} 
                className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${filtro === 'hoy' ? 'bg-[#e57373] text-white shadow-md' : 'text-gray-400'}`}
              >
                <Calendar size={18} /> Hoy
              </button>
              <button 
                onClick={() => setFiltro('futuro')} 
                className={`flex-1 py-3 rounded-xl font-bold ${filtro === 'futuro' ? 'bg-[#e57373] text-white shadow-md' : 'text-gray-400'}`}
              >
                Futuro
              </button>
            </div>

            {/* Ruleta */}
            <motion.div 
              animate={girando ? { rotate: 3600, scale: 1.05 } : { rotate: 0, scale: 1 }} 
              transition={{ duration: 2, ease: "circOut" }} 
              className="w-64 h-64 rounded-full border-8 border-[#e57373] border-dashed flex items-center justify-center bg-white dark:bg-[#1e1e1e] shadow-2xl text-8xl"
            >
              {emojiActual}
            </motion.div>

            <button 
              onClick={girarRuleta} 
              disabled={girando} 
              className={`w-full py-4 rounded-2xl text-white font-bold text-xl shadow-lg ${girando ? 'bg-gray-400' : 'bg-[#e57373]'}`}
            >
              {girando ? "Decidiendo..." : "Girar Ruleta"}
            </button>

            {/* Resultado */}
            <AnimatePresence>
              {seleccionado && !girando && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl shadow-xl border-2 border-[#e57373] text-center">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{seleccionado.titulo}</h2>
                  <button onClick={() => setMostrarReseña(true)} className="w-full bg-green-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                    <CheckCircle size={20} /> ¡Hecho!
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* Formulario de Reseña */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-center dark:text-white">¿Qué tal estuvo?</h2>
            <div className="flex justify-center gap-2 mb-6">
              {[1,2,3,4,5].map(num => (
                <Star 
                  key={num} 
                  size={32} 
                  onClick={() => setReseña({...reseña, rating: num})}
                  className={`cursor-pointer ${reseña.rating >= num ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <textarea 
              placeholder="Cuéntame..."
              className="w-full p-4 rounded-xl border dark:bg-[#2d2d2d] dark:text-white mb-4 h-32"
              onChange={(e) => setReseña({...reseña, comentario: e.target.value})}
            />
            <button onClick={guardarReseña} className="w-full bg-[#e57373] text-white py-4 rounded-2xl font-bold">
              Guardar Recuerdo
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
