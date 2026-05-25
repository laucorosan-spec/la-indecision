"use client";
import { useState } from 'react';

export default function RegistroPlanes() {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [categoria, setCategoria] = useState('hoy');

  const guardarPlan = (e) => {
    e.preventDefault();
    const nuevosPlanes = JSON.parse(localStorage.getItem('planes') || '[]');
    nuevosPlanes.push({ 
      id: Date.now(), 
      nombre, 
      ubicacion, 
      categoria, 
      hecho: false 
    });
    localStorage.setItem('planes', JSON.stringify(nuevosPlanes));
    setNombre(''); setUbicacion('');
    alert("¡Plan guardado!");
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
        <button type="submit" className="btn-primary mt-4">Guardar Plan</button>
      </form>
    </div>
  );
}
