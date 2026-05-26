"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase'; // Importamos la conexión

export default function RegistroPlanes() {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [categoria, setCategoria] = useState('hoy');
  const [cargando, setCargando] = useState(false);

  const guardarPlan = async (e) => {
    e.preventDefault();
    setCargando(true);

    // Guardamos en Supabase
    const { error } = await supabase
      .from('planes')
      .insert([{ nombre, ubicacion, categoria, hecho: false }]);

    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      alert("¡Plan guardado en la nube! ☁️");
      setNombre(''); 
      setUbicacion('');
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
          placeholder="¿Dónde? (Ubicación)" 
          className="p-3 rounded-xl bg-white/50 outline-none"
          value={ubicacion} onChange={(e) => setUbicacion(e.target.value)}
        />
        <select 
          className="p-3 rounded-xl bg-white/50 outline-none"
          value={categoria} onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="hoy">Para hoy mismo</option>
          <option value="futuro">Para más adelante</option>
        </select>
        <button type="submit" disabled={cargando} className="btn-primary mt-4">
          {cargando ? "Guardando..." : "Guardar Plan"}
        </button>
      </form>
    </div>
  );
}
