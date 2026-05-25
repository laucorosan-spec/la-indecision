"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Camera } from 'lucide-react';

export default function Home() {
  const [planes, setPlanes] = useState([]);
  const [filtro, setFiltro] = useState('hoy');
  const [seleccionado, setSeleccionado] = useState(null);
  const [girando, setGirando] = useState(false);
  const [mostrarReseña, setMostrarReseña] = useState(false);
  const [reseña, setReseña] = useState({ rating: 5, comentario: '', fecha: '', foto: '' });

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('planes') || '[]');
    setPlanes(guardados);
  }, []);

  const girarRuleta = () => {
    const posibles = planes.filter(p => p.categoria === filtro && !p.hecho);
    if (posibles.length === 0) return alert("No hay planes pendientes en esta categoría");
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

  // Función para convertir imagen a texto para guardar en el móvil
  const manejarFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setReseña({ ...reseña, foto: reader.result });
      reader.readAsDataURL(file);
    }
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
          foto: reseña.foto // Aquí se guarda la foto que subiste
        };
      }
      return p;
    });
    
    localStorage.setItem('planes', JSON.stringify(nuevosPlanes));
    setPlanes(nuevosPlanes);
    setSeleccionado(null);
    setMostrarReseña(false);
    alert("¡Plan completado! Ha desaparecido de la ruleta y está en vuestro álbum. ❤️");
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

          <motion.div 
            animate={girando ? { rotate: 3600, scale: 1.1 } : { rotate: 0, scale: 1 }} 
            transition={{ duration: 2, ease: "circOut" }} 
            className="w-64 h-64 rounded-full border-8 border-[#e57373] border-dashed flex items-center justify-center bg-white shadow-xl text-6xl"
          >
            {girando ? "✨" : "🎡"}
          </motion.div>

          <button onClick={girarRuleta} disabled={girando} className="btn-primary w-full">
            {girando ? "Decidiendo..." : "Girar Ruleta"}
          </button>

          <AnimatePresence>
            {seleccionado && !girando && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 w-full text-center shadow-2xl">
                <h2 className="text-xl font-bold mb-2">¡Plan elegido!</h2>
                <p className="text-2xl text-[#e57373] font-bold mb-4">{seleccionado.nombre}</p>
                <div className="flex gap-2">
                  <button onClick={() => setSeleccionado(null)} className="flex-1 p-3 border border-gray-300 rounded-xl">Rechazar</button>
                  <button onClick={() => setMostrarReseña(true)} className="flex-1 p-3 bg-green-500 text-white rounded-xl font-bold">¡Aceptar!</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-6 w-full flex flex-col gap-4">
          <h2 className="text-xl font-bold text-center">Cuéntanos el plan ✨</h2>
          
          {/* Input de Foto */}
          <div className="flex flex-col items-center gap-2">
            <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 overflow-hidden">
              {reseña.foto ? (
                <img src={reseña.foto} className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera className="text-gray-400" />
                  <span className="text-xs text-gray-400 font-bold mt-1">AÑADIR FOTO</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={manejarFoto} />
            </label>
          </div>

          <input type="date" className="p-3 rounded-xl bg-white/50 outline-none" onChange={(e) => setReseña({...reseña, fecha: e.target.value})} />
          <textarea placeholder="¿Qué tal estuvo?" className="p-3 rounded-xl bg-white/50 outline-none min-h-[80px]" onChange={(e) => setReseña({...reseña, comentario: e.target.value})} />
          
          <button onClick={guardarPlanCompletado} className="btn-primary w-full">Guardar Recuerdo ❤️</button>
        </motion.div>
      )}
    </div>
  );
}
