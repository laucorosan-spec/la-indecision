"use client";
import { useState, useEffect } from 'react';
import { Trash2, Edit2, Sparkles, Plus, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegistroPlanes() {
  const [planes, setPlanes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [categoria, setCategoria] = useState('hoy');
  const [editandoId, setEditandoId] = useState(null);
  
  // Estados para la IA
  const [sugerencia, setSugerencia] = useState(null);
  const [pensando, setPensando] = useState(false);

  const sugerenciasIA = [
    { nombre: "Cata de vinos a ciegas en casa", ubicacion: "Salón", categoria: "hoy" },
    { nombre: "Pícnic nocturno para ver las estrellas", ubicacion: "Parque cercano", categoria: "futuro" },
    { nombre: "Sesión de fotos estilo 'Old Money' en el centro", ubicacion: "Centro ciudad", categoria: "futuro" },
    { nombre: "Noche de cocina: solo ingredientes rojos", ubicacion: "Cocina", categoria: "hoy" },
    { nombre: "Pintar un cuadro conjunto (uno cada mitad)", ubicacion: "Casa", categoria: "hoy" },
    { nombre: "Ruta por las cafeterías más aesthetic", ubicacion: "Ciudad", categoria: "futuro" },
    { nombre: "Maratón de pelis de vuestra infancia", ubicacion: "Sofá", categoria: "hoy" },
    { nombre: "Ir a un anticuario y comprar algo raro", ubicacion: "Barrio antiguo", categoria: "futuro" },
    { nombre: "Hacer vuestra propia pizza desde cero", ubicacion: "Cocina", categoria: "hoy" },
    { nombre: "Visitar un pueblo en el que nunca hayáis estado", ubicacion: "Alrededores", categoria: "futuro" }
  ];

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('planes') || '[]');
    setPlanes(guardados);
  }, []);

  const generarSugerencia = () => {
    setPensando(true);
    setSugerencia(null);
    setTimeout(() => {
      const random = sugerenciasIA[Math.floor(Math.random() * sugerenciasIA.length)];
      setSugerencia(random);
      setPensando(false);
    }, 1500);
  };

  const añadirSugerencia = () => {
    const nuevo = { id: Date.now(), ...sugerencia, hecho: false };
    const nuevosPlanes = [...planes, nuevo];
    localStorage.setItem('planes', JSON.stringify(nuevosPlanes));
    setPlanes(nuevosPlanes);
    setSugerencia(null);
    alert("¡Sugerencia añadida a vuestra lista! ✨");
  };

  const guardarPlan = (e) => {
    e.preventDefault();
    let nuevosPlanes;
    if (editandoId) {
      nuevosPlanes = planes.map(p => p.id === editandoId ? { ...p, nombre, ubicacion, categoria } : p);
      setEditandoId(null);
    } else {
      const nuevo = { id: Date.now(), nombre, ubicacion, categoria, hecho: false };
      nuevosPlanes = [...planes, nuevo];
    }
    localStorage.setItem('planes', JSON.stringify(nuevosPlanes));
    setPlanes(nuevosPlanes);
    setNombre(''); setUbicacion('');
  };

  const eliminarPlan = (id) => {
    if (confirm("¿Borrar este plan?")) {
      const filtrados = planes.filter(p => p.id !== id);
      localStorage.setItem('planes', JSON.stringify(filtrados));
      setPlanes(filtrados);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-20">
      <h1 className="text-3xl font-bold text-[#e57373]">Planes</h1>

      {/* SECCIÓN DE IA */}
      <div className="relative overflow-hidden glass p-6 border-2 border-purple-200">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-purple-500" size={20} />
          <h2 className="font-bold text-gray-700">Inspiración IA</h2>
        </div>

        {!sugerencia && !pensando && (
          <button 
            onClick={generarSugerencia}
            className="w-full py-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100 text-purple-600 font-bold text-sm flex items-center justify-center gap-2 hover:shadow-md transition"
          >
            <Lightbulb size={16} /> Generar idea mágica
          </button>
        )}

        {pensando && (
          <div className="py-4 text-center">
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }} 
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-purple-400 font-medium text-sm"
            >
              Consultando a las estrellas... ✨
            </motion.div>
          </div>
        )}

        <AnimatePresence>
          {sugerencia && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/60 p-4 rounded-2xl border border-purple-200"
            >
              <p className="text-xs font-bold text-purple-400 uppercase mb-1">Sugerencia para vosotros:</p>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{sugerencia.nombre}</h3>
              <p className="text-xs text-gray-500 mb-4 italic">📍 {sugerencia.ubicacion}</p>
              <div className="flex gap-2">
                <button onClick={añadirSugerencia} className="flex-1 py-2 bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1">
                  <Plus size={14} /> Añadir a mi lista
                </button>
                <button onClick={() => setSugerencia(null)} className="px-4 py-2 text-gray-400 text-xs">Descartar</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FORMULARIO MANUAL */}
      <div>
        <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            {editandoId ? "Editar Plan" : "Añadir manualmente"}
        </h2>
        <form onSubmit={guardarPlan} className="glass p-6 flex flex-col gap-4">
          <input placeholder="¿Qué vamos a hacer?" className="p-3 rounded-xl bg-white/50 outline-none" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <input placeholder="¿Dónde? (opcional)" className="p-3 rounded-xl bg-white/50 outline-none" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
          <select className="p-3 rounded-xl bg-white/50 outline-none" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="hoy">Para hoy</option>
            <option value="futuro">Más adelante</option>
          </select>
          <button type="submit" className="btn-primary">
            {editandoId ? "Actualizar" : "Guardar Plan"}
          </button>
        </form>
      </div>

      {/* LISTA EDITABLE */}
      <div className="flex flex-col gap-3">
        <h2 className="font-bold text-gray-700">Planes Pendientes</h2>
        {planes.filter(p => !p.hecho).map(plan => (
          <div key={plan.id} className="glass p-4 flex justify-between items-center group">
            <div className="flex-1">
              <p className="font-bold text-gray-800 leading-tight">{plan.nombre}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                {plan.categoria === 'hoy' ? '🔥 Hoy' : '🗓️ Futuro'} • {plan.ubicacion}
              </p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setNombre(plan.nombre); setUbicacion(plan.ubicacion); setCategoria(plan.categoria); setEditandoId(plan.id); window.scrollTo(0,0); }} className="p-2 text-blue-400"><Edit2 size={16} /></button>
              <button onClick={() => eliminarPlan(plan.id)} className="p-2 text-red-300"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
