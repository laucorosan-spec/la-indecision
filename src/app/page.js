"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Camera } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Ajustamos la ruta

export default function Home() {
  const [planes, setPlanes] = useState([]);
  const [filtro, setFiltro] = useState('hoy');
  const [seleccionado, setSeleccionado] = useState(null);
  const [girando, setGirando] = useState(false);
  const [mostrarReseña, setMostrarReseña] = useState(false);
  const [reseña, setReseña] = useState({ rating: 5, comentario: '', fecha: '', foto: '' });

  const cargarPlanes = async () => {
    const { data } = await supabase.from('planes').select('*').eq('hecho', false);
    if (data) setPlanes(data);
  };

  useEffect(() => { cargarPlanes(); }, []);

  const girarRuleta = () => {
    const posibles = planes.filter(p => p.categoria === filtro);
    if (posibles.length === 0) return alert("No hay planes pendientes");
    setGirando(true);
    setTimeout(() => {
      setSeleccionado(posibles[Math.floor(Math.random() * posibles.length)]);
      setGirando(false);
      confetti();
    }, 2000);
  };

  const manejarFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setReseña({ ...reseña, foto: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const guardarPlanCompletado = async () => {
    await supabase.from('planes').update({ 
      hecho: true, 
      rating: reseña.rating, 
      comentario: reseña.comentario, 
      fecha: reseña.fecha || new Date().toLocaleDateString(),
      foto: reseña.foto 
    }).eq('id', seleccionado.id);
    
    setSeleccionado(null);
    setMostrarReseña(false);
    cargarPlanes();
    alert("¡Recuerdo guardado para los dos! ❤️");
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold text-[#e57373]">La Indecisión</h1>
      {!mostrarReseña ? (
        <>
          <div className="flex gap-4 glass p-2">
            <button onClick={() => setFiltro('hoy')} className={`px-4 py-2 rounded-xl ${filtro === 'hoy' ? 'bg-[#e57373] text-white' : ''}`}>Hoy</button>
            <button onClick={() => setFiltro('futuro')} className={`px-4 py-2 rounded-xl ${filtro === 'futuro' ? 'bg-[#e57373] text-white' : ''}`}>Futuro</button>
          </div>
          <motion.div animate={girando ? { rotate: 3600 } : { rotate: 0 }} className="w-64 h-64 rounded-full border-8 border-[#e57373] border-dashed flex items-center justify-center bg-white shadow-xl text-6xl">
            {girando ? "✨" : "🎡"}
          </motion.div>
          <button onClick={girarRuleta} disabled={girando} className="btn-primary w-full">{girando ? "Decidiendo..." : "Girar Ruleta"}</button>
          {seleccionado && !girando && (
            <div className="glass p-6 w-full text-center shadow-xl">
              <h2 className="text-xl font-bold text-[#e57373]">{seleccionado.nombre}</h2>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setSeleccionado(null)} className="flex-1 p-2 border rounded-xl text-sm">Rechazar</button>
                <button onClick={() => setMostrarReseña(true)} className="flex-1 p-2 bg-green-500 text-white rounded-xl font-bold">¡Aceptar!</button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="glass p-6 w-full flex flex-col gap-4">
          <label className="w-full h-32 border-2 border-dashed rounded-2xl flex items-center justify-center overflow-hidden">
            {reseña.foto ? <img src={reseña.foto} className="w-full h-full object-cover" /> : <Camera className="text-gray-400" />}
            <input type="file" accept="image/*" className="hidden" onChange={manejarFoto} />
          </label>
          <input type="date" className="p-3 rounded-xl bg-white/50" onChange={(e) => setReseña({...reseña, fecha: e.target.value})} />
          <textarea placeholder="¿Qué tal estuvo?" className="p-3 rounded-xl bg-white/50 min-h-[80px]" onChange={(e) => setReseña({...reseña, comentario: e.target.value})} />
          <button onClick={guardarPlanCompletado} className="btn-primary w-full">Guardar Recuerdo ❤️</button>
        </div>
      )}
    </div>
  );
}
