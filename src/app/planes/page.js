"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Sparkles } from 'lucide-react';

export default function NuevoPlan() {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [cat, setCat] = useState('hoy');

  const guardar = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('planes').insert([{ nombre, ubicacion, categoria: cat, hecho: false }]);
    if (!error) { alert("¡Plan guardado!"); setNombre(''); setUbicacion(''); }
  };

  return (
    <div className="flex flex-col gap-6 px-6 pt-10 max-w-md mx-auto text-center">
      <h1 className="text-3xl font-bold text-[#e57373]">Planes Compartidos</h1>
      
      <button className="bg-[#f5f0ff] text-[#9b51e0] py-4 rounded-[25px] flex items-center justify-center gap-2 font-bold text-sm shadow-sm">
        <Sparkles size={16} /> Inspiración IA
      </button>

      <form onSubmit={guardar} className="glass-card p-8 flex flex-col gap-6 mt-4">
        <input placeholder="¿Qué vamos a hacer?" className="w-full p-2 bg-transparent border-b border-gray-100 outline-none" value={nombre} onChange={e => setNombre(e.target.value)} required />
        <input placeholder="¿Dónde?" className="w-full p-2 bg-transparent border-b border-gray-100 outline-none" value={ubicacion} onChange={e => setUbicacion(e.target.value)} />
        <select className="w-full p-2 bg-transparent border-b border-gray-100 outline-none" value={cat} onChange={e => setCat(e.target.value)}>
          <option value="hoy">Hoy</option>
          <option value="futuro">Más adelante</option>
        </select>
        <button type="submit" className="btn-coral w-full mt-4">Guardar para los dos</button>
      </form>
    </div>
  );
}
