"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function RegistroPlanes() {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [categoria, setCategoria] = useState('hoy');
  const [fecha, setFecha] = useState(''); // Nuevo estado para fecha
  const [cargando, setCargando] = useState(false);

  const guardarPlan = async (e) => {
    e.preventDefault();
    setCargando(true);

    const { error } = await supabase
      .from('planes')
      .insert([{ 
        nombre, 
        ubicacion, 
        categoria, 
        fecha: fecha || null, // Guardamos la fecha si existe
        hecho: false,
        rating: 0,        // Inicializamos a 0
        comentario: '',   // Vacío al principio
        foto: ''          // Vacío al principio
      }]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("¡Plan guardado!");
      setNombre(''); setUbicacion(''); setFecha('');
    }
    setCargando(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Nuevo Plan</h1>
      <form onSubmit={guardarPlan} className="glass p-6 flex flex-col gap-4">
        <input 
          placeholder="¿Qué vamos a hacer?" 
          className="p-3 rounded-xl bg-white/50 outline-none"
          value={nombre} onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input 
          placeholder="¿Dónde?" 
          className="p-3 rounded-xl bg-white/50 outline-none"
          value={ubicacion} onChange={(e) => setUbicacion(e.target.value)}
        />
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 ml-2">¿Cuándo? (Opcional)</label>
          <input 
            type="date"
            className="p-3 rounded-xl bg-white/50 outline-none"
            value={fecha} onChange={(e) => setFecha(e.target.value)}
          />
        </div>
        <select 
          className="p-3 rounded-xl bg-white/50 outline-none"
          value={categoria} onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="hoy">Para hoy</option>
          <option value="futuro">Para más adelante</option>
        </select>
        <button type="submit" disabled={cargando} className="btn-primary mt-4">
          {cargando ? "Guardando..." : "Guardar Plan"}
        </button>
      </form>
    </div>
  );
}
