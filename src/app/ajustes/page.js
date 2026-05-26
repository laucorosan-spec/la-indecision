"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Ajustes() {
  const [fecha, setFecha] = useState('');
  const [stats, setStats] = useState({ dias: '--', hechos: 0, pendientes: 0 });

  useEffect(() => {
    const cargar = async () => {
      const f = localStorage.getItem('aniversario') || '';
      setFecha(f);
      if (f) {
        const d = Math.floor((new Date() - new Date(f)) / (1000 * 60 * 60 * 24));
        setStats(s => ({ ...s, dias: d }));
      }
      const { count: h } = await supabase.from('planes').select('*', { count: 'exact', head: true }).eq('hecho', true);
      const { count: p } = await supabase.from('planes').select('*', { count: 'exact', head: true }).eq('hecho', false);
      setStats(s => ({ ...s, hechos: h || 0, pendientes: p || 0 }));
    };
    cargar();
  }, []);

  return (
    <div className="flex flex-col gap-6 px-6 pt-10 pb-32 max-w-md mx-auto text-center">
      <h1 className="text-3xl font-bold text-[#e57373]">Nuestro Rincón</h1>
      
      <div className="glass-card p-8 flex flex-col items-center gap-2">
        <span className="text-4xl">❤️</span>
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Llevamos juntos</p>
        <p className="text-5xl font-black text-[#1a2b3c]">{stats.dias} días</p>
        <input type="date" value={fecha} onChange={(e) => {setFecha(e.target.value); localStorage.setItem('aniversario', e.target.value)}} className="mt-4 text-xs bg-transparent border-none outline-none opacity-40" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-6">
          <span className="text-2xl text-yellow-500">🏅</span>
          <p className="text-2xl font-bold">{stats.hechos}</p>
          <p className="text-[8px] uppercase font-bold opacity-40">Planes hechos</p>
        </div>
        <div className="glass-card p-6">
          <span className="text-2xl text-blue-400">📅</span>
          <p className="text-2xl font-bold">{stats.pendientes}</p>
          <p className="text-[8px] uppercase font-bold opacity-40">Planes pendientes</p>
        </div>
      </div>

      <div className="glass-card p-6 mt-4">
        <p className="text-sm font-bold mb-4 text-left">Personalizar Nombres</p>
        <div className="flex items-center gap-4 justify-center">
          <input placeholder="Él" className="w-24 p-2 bg-transparent border-b border-gray-200 text-center outline-none" />
          <span className="text-[#e57373] font-bold">&</span>
          <input placeholder="Ella" className="w-24 p-2 bg-transparent border-b border-gray-200 text-center outline-none" />
        </div>
        <button className="btn-coral w-full mt-6 text-sm">Actualizar Nombres</button>
      </div>
    </div>
  );
}
