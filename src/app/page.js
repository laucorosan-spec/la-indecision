"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Star, 
  CheckCircle, 
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
    const { data } = await supabase.from('planes').select('*').eq('hecho', false);
    if (data) setPlanes(data);
  };

  useEffect(() => { 
    cargarPlanes(); 
  }, []);

  const girarRuleta = () => {
    const posibles = planes.filter(p => p.categoria === filtro);
    if (posibles.length === 0) return alert("No hay planes pendientes");
    setGirando(true);
    setSeleccionado(null);
    setTimeout(() => {
      setSeleccionado(posibles[Math.floor(Math.random() * posibles.length)]);
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
      alert("¡Guardado!");
      setSeleccionado(null);
      setMostrarReseña(false);
      cargarPlanes();
    }
  };

  return (
    <div className="min-h-screen bg-[#fff5f5] p-4">
      <div className="max-w-md mx-auto flex flex-col items-center gap-8 pt-8">
        <div className="flex items-center gap-2">
          <Heart className="text-[#e57373]" fill="#e57373" />
          <h1 className="text-3xl font-bold text-[#e57373]">La Indecisión</h1>
        </div>
        
        {!mostrarReseña ? (
          <>
            <div className="flex gap-4 bg-white p-2 rounded-2xl w-full shadow-sm">
              <button onClick={() => setFiltro('hoy')} className={`flex-1 py-3 rounded-xl font-bold ${filtro === 'hoy' ? 'bg-[#e57373] text-white' : 'text-gray-400'}`}>Hoy</button>
              <button onClick={() => setFiltro('futuro')} className={`flex-1 py-3 rounded-xl font-bold ${filtro === 'futuro' ? 'bg-[#e57373] text-white' : 'text-gray-400'}`}>Futuro</button>
            </div>

            <motion.div animate={girando ? { rotate: 3600 } : { rotate: 0 }} transition={{ duration: 2 }} className="w-64 h-64 rounded-full border-8 border-[#e57373] flex items-center justify-center bg-white text-8xl shadow-2xl">
              {emojiActual}
            </motion.div>

            <button onClick={girarRuleta} disabled={girando} className="w-full py-4 rounded-2xl text-white font-bold text-xl bg-[#e57373] shadow-lg">
              {girando ? "Decidiendo..." : "Girar Ruleta"}
            </button>

            {seleccionado && !girando && (
              <div className="w-full bg-white p-6 rounded-3xl border-2 border-[#e57373] text-center shadow-xl">
                <h2 className="text-2xl font-bold mb-4">{seleccionado.titulo}</h2>
                <button onClick={() => setMostrarReseña(true)} className="w-full bg-green-500 text-white py-3 rounded-xl font-bold">¡Lo hemos hecho!</button>
              </div>
            )}
          </>
        ) : (
          <div className="w-full bg-white p-6 rounded-3xl shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-center">¿Qué tal estuvo?</h2>
            <textarea className="w-full p-4 rounded-xl border mb-4 h-32" onChange={(e) => setReseña({...reseña, comentario: e.target.value})} />
            <button onClick={guardarReseña} className="w-full bg-[#e57373] text-white py-4 rounded-2xl font-bold">Guardar Recuerdo</button>
          </div>
        )}
      </div>
    </div>
  );
}
