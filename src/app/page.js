"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function Home() {
  const [planes, setPlanes] = useState([]);
  const [filtro, setFiltro] = useState('hoy'); 
  const [seleccionado, setSeleccionado] = useState(null);
  const [girando, setGirando] = useState(false);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('planes') || '[]');
    setPlanes(guardados);
  }, []);

  const girarRuleta = () => {
    const posibles = planes.filter(p => p.categoria === filtro && !p.hecho);
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

  // --- ESTA ES LA FUNCIÓN NUEVA ---
  const marcarComoHecho = (id) => {
    const nuevosPlanes = planes.map(p => {
      if (p.id === id) {
        return { ...p, hecho: true }; // Marcamos el plan como completado
      }
      return p;
    });
    
    setPlanes(nuevosPlanes);
    localStorage.setItem('planes', JSON.stringify(nuevosPlanes));
    setSeleccionado(null); // Cerramos el cartelito
    alert("¡Plan enviado al álbum! ❤️");
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold text-[#e57373]">La Indecisión</h1>
      
      <div className="flex gap-4 glass p-2">
        <button 
          onClick={() => setFiltro('hoy')}
          className={`px-4 py-2 rounded-xl transition ${filtro === 'hoy' ? 'bg-[#e57373] text-white' : ''}`}
        >Hoy</button>
        <button 
          onClick={() => setFiltro('futuro')}
          className={`px-4 py-2 rounded-xl transition ${filtro === 'futuro' ? 'bg-[#e57373] text-white' : ''}`}
        >Más adelante</button>
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 w-full text-center"
          >
            <h2 className="text-xl font-bold mb-2">¡Plan elegido!</h2>
            <p className="text-2xl text-[#e57373] mb-4">{seleccionado.nombre}</p>
            <p className="text-sm text-gray-500 mb-6">📍 {seleccionado.ubicacion}</p>
            <div className="flex gap-2">
              <button onClick={() => setSeleccionado(null)} className="flex-1 p-2 border border-gray-300 rounded-xl">Rechazar</button>
              {/* Aquí usamos la nueva función */}
              <button 
                onClick={() => marcarComoHecho(seleccionado.id)} 
                className="flex-1 p-2 bg-green-500 text-white rounded-xl"
              >
                ¡Aceptar!
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
