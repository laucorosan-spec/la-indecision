"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [planes, setPlanes] = useState([]);
  const [filtro, setFiltro] = useState('hoy'); 
  const [seleccionado, setSeleccionado] = useState(null);
  const [girando, setGirando] = useState(false);

  // Cargar planes desde Supabase
  const cargarPlanes = async () => {
    const { data, error } = await supabase
      .from('planes')
      .select('*')
      .eq('hecho', false); // Solo traer los que no están hechos
    
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
    
    setTimeout(() => {
      const elegido = posibles[Math.floor(Math.random() * posibles.length)];
      setSeleccionado(elegido);
      setGirando(false);
      confetti();
    }, 2000);
  };

  const marcarComoHecho = async (id) => {
    const { error } = await supabase
      .from('planes')
      .update({ hecho: true })
      .eq('id', id);

    if (!error) {
      setSeleccionado(null);
      cargarPlanes(); // Recargar la lista
      alert("¡Al álbum! ❤️");
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold text-[#e57373]">La Indecisión</h1>
      
      <div className="flex gap-4 glass p-2">
        <button onClick={() => setFiltro('hoy')} className={`px-4 py-2 rounded-xl ${filtro === 'hoy' ? 'bg-[#e57373] text-white' : ''}`}>Hoy</button>
        <button onClick={() => setFiltro('futuro')} className={`px-4 py-2 rounded-xl ${filtro === 'futuro' ? 'bg-[#e57373] text-white' : ''}`}>Más adelante</button>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        <motion.div
          animate={girando ? { rotate: 3600 } : { rotate: 0 }}
          transition={{ duration: 2, ease: "circOut" }}
          className="w-full h-full rounded-full border-8 border-[#e57373] border-dashed flex items-center justify-center bg-white shadow-xl"
        >
          <span className="text-4xl">🎡</span>
        </motion.div>
      </div>

      <button onClick={girarRuleta} disabled={girando} className="btn-primary w-full">
        {girando ? "Decidiendo..." : "Girar Ruleta"}
      </button>

      <AnimatePresence>
        {seleccionado && !girando && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-6 w-full text-center">
            <h2 className="text-xl font-bold mb-2">¡Plan elegido!</h2>
            <p className="text-2xl text-[#e57373] mb-4">{seleccionado.nombre}</p>
            <div className="flex gap-2">
              <button onClick={() => setSeleccionado(null)} className="flex-1 p-2 border rounded-xl">Rechazar</button>
              <button onClick={() => marcarComoHecho(seleccionado.id)} className="flex-1 p-2 bg-green-500 text-white rounded-xl">¡Aceptar!</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
