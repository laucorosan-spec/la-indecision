"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Sparkles, MapPin, Send, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NuevoPlan() {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [categoria, setCategoria] = useState('hoy');
  const [cargando, setCargando] = useState(false);
  const [sugerencia, setSugerencia] = useState(null);

  // --- BANCO DE IDEAS (INSPIRACIÓN IA) ---
  const ideasIA = [
    { n: "Cata de vinos a ciegas en casa", u: "Salón" },
    { n: "Piknic nocturno para ver las estrellas", u: "Mirador o parque" },
    { n: "Ruta por las cafeterías más aesthetic de la ciudad", u: "Centro ciudad" },
    { n: "Sesión de fotos analógicas", u: "Barrio antiguo" },
    { n: "Noche de cocina: Reto Masterchef con 3 ingredientes", u: "Nuestra cocina" },
    { n: "Ir a una librería y elegir un libro para el otro", u: "Librería de barrio" },
    { n: "Paseo en bicicleta al atardecer", u: "Carril bici o playa" },
    { n: "Visitar un mercado de antigüedades", u: "Mercadillo local" },
    { n: "Noche de SPA casero con mascarillas y música chill", u: "Casa" },
    { n: "Hacer un puzzle de 1000 piezas juntos", u: "Mesa del comedor" },
    { n: "Ir a un salón recreativo (Arcade)", u: "Centro comercial" },
    { n: "Pintar un cuadro juntos con vino", u: "Terraza o salón" }
  ];

  const generarInspiracion = () => {
    setCargando(true);
    setSugerencia(null);
    
    // Simulamos que la IA está "pensando" para que sea más pro
    setTimeout(() => {
      const ideaAleatoria = ideasIA[Math.floor(Math.random() * ideasIA.length)];
      setSugerencia(ideaAleatoria);
      setCargando(false);
    }, 1500);
  };

  const usarSugerencia = () => {
    setNombre(sugerencia.n);
    setUbicacion(sugerencia.u);
    setSugerencia(null);
  };

  const guardarPlan = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('planes')
      .insert([{ nombre, ubicacion, categoria, hecho: false }]);
    
    if (!error) {
      alert("¡Plan guardado para los dos! ❤️");
      setNombre('');
      setUbicacion('');
    }
  };

  return (
    <div className="flex flex-col gap-6 text-center">
      <h1 className="text-3xl font-bold text-[#e57373] tracking-tight mt-4">Nuevos Planes</h1>

      {/* BOTÓN INSPIRACIÓN IA */}
      <div className="relative">
        <button 
          onClick={generarInspiracion}
          disabled={cargando}
          className="w-full bg-[#f5f0ff] text-[#9b51e0] py-5 rounded-[25px] flex items-center justify-center gap-3 font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95 border border-[#9b51e0]/10"
        >
          {cargando ? (
            <Wand2 className="animate-spin" size={18} />
          ) : (
            <Sparkles size={18} className="animate-pulse" />
          )}
          {cargando ? "LA IA ESTÁ PENSANDO..." : "INSPIRACIÓN IA"}
        </button>

        {/* CARTA DE LA SUGERENCIA */}
        <AnimatePresence>
          {sugerencia && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 10 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-full left-0 right-0 z-20 bg-white p-6 rounded-[30px] shadow-2xl border-2 border-[#9b51e0]/20"
            >
              <p className="text-[10px] font-black text-[#9b51e0] uppercase tracking-widest mb-2">Sugerencia Mágica</p>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{sugerencia.n}</h3>
              <p className="text-xs text-gray-400 mb-6 flex items-center justify-center gap-1">
                <MapPin size={12}/> {sugerencia.u}
              </p>
              <div className="flex gap-2">
                <button onClick={() => setSugerencia(null)} className="flex-1 py-2 text-xs font-bold text-gray-400">Descartar</button>
                <button onClick={usarSugerencia} className="flex-[2] py-3 bg-[#9b51e0] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#9b51e0]/30">USAR ESTA IDEA</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FORMULARIO ESTILIZADO */}
      <form onSubmit={guardarPlan} className="glass p-8 flex flex-col gap-8 mt-4 text-left relative z-10">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">¿Qué vamos a hacer?</label>
          <input 
            placeholder="Escribe vuestra idea..." 
            className="w-full p-2 bg-transparent border-b-2 border-gray-100 outline-none focus:border-[#e57373] transition-colors text-lg"
            value={nombre} onChange={e => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">¿Dónde será?</label>
          <div className="flex items-center gap-2 border-b-2 border-gray-100 focus-within:border-[#e57373] transition-colors pb-1">
            <MapPin size={16} className="text-gray-300" />
            <input 
              placeholder="Ubicación (opcional)" 
              className="w-full p-2 bg-transparent outline-none"
              value={ubicacion} onChange={e => setUbicacion(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">¿Para cuándo?</label>
          <select 
            className="w-full p-3 bg-gray-50 rounded-xl outline-none text-sm font-bold appearance-none"
            value={categoria} onChange={e => setCategoria(e.target.value)}
          >
            <option value="hoy">Para hoy mismo</option>
            <option value="futuro">Para más adelante</option>
          </select>
        </div>

        <button type="submit" className="btn-primary flex items-center justify-center gap-3 py-5 mt-4 shadow-xl shadow-red-200">
          <Send size={18} />
          GUARDAR PARA LOS DOS
        </button>
      </form>
    </div>
  );
}
