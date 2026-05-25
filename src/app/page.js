"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Star, 
  CheckCircle, 
  Heart, 
  Award, 
  Calendar, 
  Moon, 
  Sun, 
  Trash2, 
  Camera 
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [planes, setPlanes] = useState([]);
  const [filtro, setFiltro] = useState('hoy');
  const [seleccionado, setSeleccionado] = useState(null);
  const [girando, setGirando] = useState(false);
  const [mostrarReseña, setMostrarReseña] = useState(false);
  const [reseña, setReseña] = useState({ rating: 5, comentario: '' });
  const [emojiActual, setEmojiActual] = useState("🎡");

  const emojis = ["🎡", "🍕", "🎬", "🍷", "🍦", "🎨", "🎭", "🎳", "🍱", "🍿", "🧗", "🥐"];

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

  const cargarPlanes = async () => {
    try {
      const { data } = await supabase.from('planes').select('*').eq('hecho', false);
      if (data) setPlanes(data);
    } catch (e) {
      console.log("Error cargando planes");
    }
  };

  useEffect(() => { 
    cargarPlanes(); 
  }, []);

  const girarRuleta = () => {
    const posibles = planes.filter(p => p.categoria === filtro);
    if (posibles.length === 0) return alert("No hay planes pendientes en esta categoría");
    setGirando(true);
    setSeleccionado(null);
    setTimeout(() => {
      const elegido = posibles[Math.floor(Math.random() * posibles.length)];
      setSeleccionado(elegido);
      setGirando(false);
      confetti();
    }, 2000);
  };

  const guardarReseña = async () => {
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
    <div className="min-h-screen bg-[#fff5f5] p-4 font-sans">
      <div className="max-w-md mx-auto flex flex-col items-center gap-8 pt-8">
        
        <div className="flex items-center gap-2">
          <Heart className="text-[#e57373]" fill="#e57373" />
          <h1 className="text-3xl font-bold text-[#e57373]">La Indecisión</h1>
          <Award className="text-[#e57373]" />
        </div>
        
        {!mostrarReseña ? (
          <>
            <div className="flex gap-4 bg-white p-2 rounded-2xl w-full shadow-md">
              <button onClick={() => setFiltro('hoy')} className={`flex-1 py-3 rounded-xl font-bold transition ${filtro === 'hoy' ? 'bg-[#e57373] text-white' : 'text-gray-400'}`}>
                <div className="flex items-center justify-center gap-2"><Calendar size={18}/> Hoy</div>
              </button>
              <button onClick={() => setFiltro('futuro')} className={`flex-1 py-3 rounded-xl font-bold transition ${filtro === 'futuro' ? 'bg-[#e57373] text-white' : 'text-gray-400'}`}>
                Futuro
              </button>
            </div>

            <motion.div 
              animate={girando ? { rotate: 3600, scale: 1.1 } : { rotate: 0, scale: 1 }} 
              transition={{ duration: 2, ease: "circOut" }} 
              className="w-64 h-64 rounded-full border-8 border-[#e57373] border-dashed flex items-center justify-center bg-white text-8xl shadow-2xl"
            >
              {emojiActual}
            </motion.div>

            <button 
              onClick={girarRuleta} 
              disabled={girando} 
              className={`w-full py-4 rounded-2xl text-white font-bold text-xl shadow-lg transition active:scale-95 ${girando ? 'bg-gray-400' : 'bg-[#e57373]'}`}
            >
              {girando ? "Decidiendo..." : "Girar Ruleta"}
            </button>

            <AnimatePresence>
              {seleccionado && !girando && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-white p-6 rounded-3xl border-2 border-[#e57373] text-center shadow-xl">
                  <p className="text-gray-400 text-xs font-bold mb-1 uppercase">Plan elegido</p>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">{seleccionado.titulo}</h2>
                  <button onClick={() => setMostrarReseña(true)} className="w-full bg-green-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                    <CheckCircle size={20} /> ¡Lo hemos hecho!
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-white p-6 rounded-3xl shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-center">¿Qué tal estuvo el plan?</h2>
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
              placeholder="Escribe un recuerdo..."
              className="w-full p-4 rounded-xl border mb-4 h-32 focus:ring-2 focus:ring-[#e57373] outline-none text-black" 
              onChange={(e) => setReseña({...reseña, comentario: e.target.value})} 
            />
            <button onClick={guardarReseña} className="w-full bg-[#e57373] text-white py-4 rounded-2xl font-bold shadow-lg">
              Guardar en Recuerdos
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
