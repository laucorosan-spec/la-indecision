"use client";
import { useState, useEffect } from 'react';
import { Trash2, Edit2, Sparkles, Plus, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase'; // Importamos el puente

export default function RegistroPlanes() {
  const [planes, setPlanes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [categoria, setCategoria] = useState('hoy');
  const [editandoId, setEditandoId] = useState(null);
  const [pensando, setPensando] = useState(false);
  const [sugerencia, setSugerencia] = useState(null);

  // Función para cargar planes desde Supabase
  const cargarPlanes = async () => {
    const { data, error } = await supabase
      .from('planes')
      .select('*')
      .eq('hecho', false) // Solo los que no están hechos
      .order('created_at', { ascending: false });
    
    if (data) setPlanes(data);
  };

  useEffect(() => {
    cargarPlanes();
  }, []);

  const guardarPlan = async (e) => {
    e.preventDefault();
    if (editandoId) {
      await supabase.from('planes').update({ nombre, ubicacion, categoria }).eq('id', editandoId);
      setEditandoId(null);
    } else {
      await supabase.from('planes').insert([{ nombre, ubicacion, categoria, hecho: false }]);
    }
    setNombre(''); setUbicacion('');
    cargarPlanes();
  };

  const eliminarPlan = async (id) => {
    if (confirm("¿Borrar este plan?")) {
      await supabase.from('planes').delete().eq('id', id);
      cargarPlanes();
    }
  };

  // ... (Aquí van las funciones de sugerenciasIA que ya tenías, son iguales)
  const sugerenciasIA = [
    { nombre: "Cata de vinos a ciegas en casa", ubicacion: "Salón", categoria: "hoy" },
    { nombre: "Pícnic nocturno para ver las estrellas", ubicacion: "Parque cercano", categoria: "futuro" },
    { nombre: "Noche de cocina: solo ingredientes rojos", ubicacion: "Cocina", categoria: "hoy" }
  ];

  const generarSugerencia = () => {
    setPensando(true); setSugerencia(null);
    setTimeout(() => {
      setSugerencia(sugerenciasIA[Math.floor(Math.random() * sugerenciasIA.length)]);
      setPensando(false);
    }, 1500);
  };

  const añadirSugerencia = async () => {
    await supabase.from('planes').insert([{ ...sugerencia, hecho: false }]);
    setSugerencia(null);
    cargarPlanes();
  };

  return (
    <div className="flex flex-col gap-8 pb-20">
      <h1 className="text-3xl font-bold text-[#e57373]">Planes Compartidos</h1>
      
      {/* Sección IA */}
      <div className="glass p-6 border-2 border-purple-200">
        <button onClick={generarSugerencia} className="w-full py-3 bg-purple-50 text-purple-600 rounded-xl font-bold flex items-center justify-center gap-2">
          <Lightbulb size={16} /> Inspiración IA
        </button>
        {sugerencia && (
          <div className="mt-4 p-4 bg-white/60 rounded-xl border border-purple-200">
            <p className="font-bold">{sugerencia.nombre}</p>
            <button onClick={añadirSugerencia} className="mt-2 w-full py-2 bg-purple-500 text-white rounded-lg text-xs font-bold">Añadir a la lista común</button>
          </div>
        )}
      </div>

      {/* Formulario */}
      <form onSubmit={guardarPlan} className="glass p-6 flex flex-col gap-4">
        <input placeholder="¿Qué vamos a hacer?" className="p-3 rounded-xl bg-white/50 outline-none" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <input placeholder="¿Dónde?" className="p-3 rounded-xl bg-white/50 outline-none" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
        <select className="p-3 rounded-xl bg-white/50 outline-none" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="hoy">Hoy</option>
          <option value="futuro">Futuro</option>
        </select>
        <button type="submit" className="btn-primary">{editandoId ? "Actualizar" : "Guardar para los dos"}</button>
      </form>

      {/* Lista */}
      <div className="flex flex-col gap-3">
        {planes.map(plan => (
          <div key={plan.id} className="glass p-4 flex justify-between items-center group">
            <div>
              <p className="font-bold text-gray-800">{plan.nombre}</p>
              <p className="text-[10px] text-gray-400 uppercase font-bold">{plan.categoria} • {plan.ubicacion}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => {setNombre(plan.nombre); setUbicacion(plan.ubicacion); setCategoria(plan.categoria); setEditandoId(plan.id);}} className="text-blue-400"><Edit2 size={16}/></button>
              <button onClick={() => eliminarPlan(plan.id)} className="text-red-300"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
