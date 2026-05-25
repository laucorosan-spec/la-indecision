"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Camera } from 'lucide-react';
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
      }, 100); // Cambia cada 100ms
    } else {
      setEmojiActual("🎡");
    }
    return () => clearInterval(intervalo);
  }, [girando]);
  // ------------------------

  const cargarPlanes = async () => {
    const { data } = await supabase.from('planes').select('*').eq('hecho', false);
    if (data) setPlanes(data);
  };

  useEffect(() => { 
    cargarPlanes(); 
    // Aplicar modo oscuro al cargar si estaba guardado
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
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

  // ... (Resto de funciones manejarFoto y guardarPlanCompletado igual que antes)

  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold text-[#e57373]">La Indecisión</h1>
      
      {!mostrarReseña ? (
        <>
          <div className="flex gap-4 glass p-2">
            <button onClick={() => setFiltro('hoy')} className={`px-4 py-2 rounded-xl transition ${filtro === 'hoy' ? 'bg-[#e57373] text-white' : 'text-gray-400'}`}>Hoy</button>
            <button onClick={() => setFiltro('futuro')} className={`px-4 py-2 rounded-xl transition ${filtro === 'futuro' ? 'bg-[#e57373] text-white' : 'text-gray-400'}`}>Futuro</button>
          </div>

          <motion.div 
            animate={girando ? { rotate: 3600, scale: 1.1 } : { rotate: 0, scale: 1 }} 
            transition={{ duration: 2, ease: "circOut" }} 
            className="w-64 h-64 rounded-full border-8 border-[#e57373] border-dashed flex items-center justify-center bg-white dark:bg-[#1a1a1a] shadow-xl text-6xl"
          >
            {emojiActual}
          </motion.div>

          <button onClick={girarRuleta} disabled={girando} className="btn-primary w-full">
            {girando ? "Decidiendo..." : "Girar Ruleta"}
          </button>

          {/* ... resto del código igual ... */}
        </>
      ) : (
        /* ... código de reseña igual ... */
      )}
    </div>
  );
}
