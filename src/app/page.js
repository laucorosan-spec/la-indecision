"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function Home() {
  const [planes, setPlanes] = useState([]);
  const [filtro, setFiltro] = useState('hoy');
  const [seleccionado, setSeleccionado] = useState(null);
  const [girando, setGirando] = useState(false);
  
  // Nuevo estado para el formulario de reseña
  const [mostrarReseña, setMostrarReseña] = useState(false);
  const [reseña, setReseña] = useState({ rating: 5, comentario: '', fecha: '', foto: '' });

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('planes') || '[]');
    setPlanes(guardados);
  }, []);

  const girarRuleta = () => {
    const posibles = planes.filter(p => p.categoria === filtro && !p.hecho);
    if (posibles.length === 0) return alert("No hay planes en esta categoría");
    setGirando(true);
    setSeleccionado(null);
    setMostrarReseña(false);
    
    setTimeout(() => {
      const elegido = posibles[Math.floor(Math.random() * posibles.length)];
      setSeleccionado(elegido);
      setGirando(false);
      confetti();
    }, 2000);
  };

  const guardarPlanCompletado = () => {
    const nuevosPlanes = planes.map(p => {
      if (p.id === seleccionado.id) {
        return { 
          ...p, 
          hecho: true, 
          rating: reseña.rating, 
          comentario: reseña.comentario, 
          fecha: reseña.fecha || new Date().toLocaleDateString(),
          foto: reseña.foto || 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=400' // Foto por defecto
        };
      }
      return p;
    });
    
    localStorage.setItem('planes', JSON.stringify(nuevosPlanes));
    setPlanes(nuevosPlanes);
    setSeleccionado(null);
    setMostrarReseña(false);
    alert("¡Plan guardado en vuestro álbum! ❤️");
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold text-[#e57373]">La Indecisión</h1>
      
      {!mostrarReseña ? (
        <>
          <div className="flex gap-4 glass p-2">
            <button onClick={() => setFiltro('hoy')} className={`px-4 py-2 rounded-xl transition ${filtro === 'hoy' ? 'bg-[#e57373] text-white' : ''}`}>Hoy</button>
            <button onClick={() => setFiltro('futuro')} className={`px-4 py-2 rounded-xl transition ${filtro === 'futuro' ? 'bg-[#e57373] text-white' : ''}`}>Más adelante</button>
          </div>

          <motion.div animate={girando ? { rotate: 3600 } : { rotate: 0 }} transition={{ duration: 2, ease: "circOut" }} className="w-64 h-64 rounded-full border-8 border-[#e57373] border-dashed flex items-center justify-center bg-white shadow-xl text-5xl">🎡</motion.div>

          <button onClick={girarRuleta} disabled={girando} className="btn-primary w-full">{girando ? "Decidiendo..." : "Girar Ruleta"}</button>

          <AnimatePresence>
            {seleccionado && !girando && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 w-full text-center shadow-2xl">
                <h2 className="text-xl font-bold mb-2">¡Plan elegido!</h2>
                <p className="text-2xl text-[#e57373] font-bold mb-4">{seleccionado.nombre}</p>
                <p className="text-sm text-gray-500 mb-6 font-medium">📍 {seleccionado.ubicacion}</p>
                <div className="flex gap-2">
                  <button onClick={() => setSeleccionado(null)} className="flex-1 p-3 border border-gray-300 rounded-xl hover:bg-gray-50">Rechazar</button>
                  <button onClick={() => setMostrarReseña(true)} className="flex-1 p-3 bg-green-500 text-white rounded-xl font-bold shadow-lg hover:bg-green-600">¡Aceptar!</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass p-6 w-full flex flex-col gap-4 shadow-2xl border-2 border-[#e57373]">
          <h2 className="text-xl font-bold text-center">¡Qué bien lo habéis pasado! ✨</h2>
          <p className="text-center text-gray-600 italic">Cuéntanos sobre: {seleccionado.nombre}</p>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase">¿Qué tal estuvo? (1-5)</label>
            <input type="range" min="1" max="5" value={reseña.rating} onChange={(e) => setReseña({...reseña, rating: e.target.value})} className="accent-[#e57373]" />
            <div className="flex justify-between text-lg"><span>⭐</span><span>⭐⭐⭐⭐⭐</span></div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Fecha del recuerdo</label>
            <input type="date" className="p-3 rounded-xl bg-white/50 border-none outline-none" onChange={(e) => setReseña({...reseña, fecha: e.target.value})} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Vuestra reseña</label>
            <textarea placeholder="¿Qué fue lo mejor?" className="p-3 rounded-xl bg-white/50 border-none outline-none min-h-[100px]" onChange={(e) => setReseña({...reseña, comentario: e.target.value})} />
          </div>

          <button onClick={guardarPlanCompletado} className="btn-primary w-full">Guardar en el álbum ❤️</button>
          <button onClick={() => setMostrarReseña(false)} className="text-sm text-gray-500 underline">Volver</button>
        </motion.div>
      )}
    </div>
  );
}
