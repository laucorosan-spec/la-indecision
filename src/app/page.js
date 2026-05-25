"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Moon, 
  Sun, 
  Heart, 
  Award, 
  Calendar, 
  Star, 
  CheckCircle 
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
    if (posibles.length === 0) return alert("No hay planes");
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
        <div className="flex items-center gap-4">
          <Moon size={20} /> <Sun size={20} /> <Heart size={20} /> <Award size={20} /> <Calendar size={20} />
        </div>
        <h1 className="text-3xl font-bold text-[#e57373]">La Indecisión</h1>
        
        {!mostrarReseña ? (
          <>
            <div className="flex gap-4 bg-white p-2 rounded-2xl w-full">
              <button onClick={() => setFiltro('hoy')} className={`flex-1 py-3 rounded-xl ${filtro === 'hoy' ? 'bg-[#e57373] text-white' : 'text-gray-400'}`}>Hoy</button>
              <button onClick={() => setFiltro('futuro')} className={`flex-1 py-3 rounded-xl ${filtro === 'futuro' ? 'bg-[#e57373] text-white' : 'text-gray-400'}`}>Futuro</button>
            </div>
            <motion.div animate={girando ? { rotate: 3600 } : { rotate: 0 }} className="w-64 h-64 rounded-full border-8 border-[#e57373] flex items-center justify-center bg-white text-8xl">
              {emojiActual}
            </motion.div>
            <button onClick={girarRuleta} className="w-full py-4 rounded-2xl text-white bg-[#e57373] font-bold">Girar Ruleta</button>
            {seleccionado && !girando && (
              <div className="w-full bg-white p-6 rounded-3xl border-2 border-[#e57373] text-center">
                <h2 className="text-2xl font-bold mb-4">{seleccionado.titulo}</h2>
                <button onClick={() => setMostrarReseña(true)} className="w-full bg-green-500 text-white py-3 rounded-xl">¡Hecho!</button>
              </div>
            )}
          </>
        ) : (
          <div className="w-full bg-white p-6 rounded-3xl">
            <h2 className="text-xl font-bold mb-4">¿Qué tal estuvo?</h2>
            <textarea className="w-full p-4 border rounded-xl mb-4" onChange={(e) => setReseña({...reseña, comentario: e.target.value})} />
            <button onClick={guardarReseña} className="w-full bg-[#e57373] text-white py-4 rounded-2xl">Guardar</button>
          </div>
        )}
      </div>
    </div>
  );
}
