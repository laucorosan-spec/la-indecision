"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Heart, Calendar, Trophy, Moon, Sun, Save } from 'lucide-react';

export default function Ajustes() {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [stats, setStats] = useState({ dias: 0, creados: 0, hechos: 0 });
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      const n = localStorage.getItem('usuario-nombre') || 'Pareja Indecisa';
      const f = localStorage.getItem('aniversario') || '';
      setNombre(n); setFecha(f);

      if (f) {
        const d = Math.floor((new Date() - new Date(f)) / (1000 * 60 * 60 * 24));
        setStats(s => ({ ...s, dias: d > 0 ? d : 0 }));
      }

      const { count: total } = await supabase.from('planes').select('*', { count: 'exact', head: true });
      const { count: hechos } = await supabase.from('planes').select('*', { count: 'exact', head: true }).eq('hecho', true);
      setStats(s => ({ ...s, creados: total || 0, hechos: hechos || 0 }));
    };
    cargar();
    if (document.documentElement.classList.contains('dark')) setDark(true);
  }, []);

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle('dark');
  };

  const guardar = () => {
    localStorage.setItem('usuario-nombre', nombre);
    localStorage.setItem('aniversario', fecha);
    alert("¡Guardado! ❤️");
  };

  return (
    <div className="flex flex-col gap-6 px-6 pt-10 pb-32 max-w-md mx-auto">
      <h1 className="text-2xl font-bold italic text-[#e57373]">Nuestra Historia</h1>
      
      {/* Dashboard Stats */}
      <div className="glass p-6 grid grid-cols-3 gap-2 text-center">
        <div className="flex flex-col items-center">
          <Calendar size={18} className="text-blue-400 mb-1" />
          <span className="text-xl font-black">{stats.dias}</span>
          <span className="text-[10px] uppercase opacity-40 font-bold tracking-tighter">Días</span>
        </div>
        <div className="flex flex-col items-center border-x border-black/5 dark:border-white/10">
          <Heart size={18} className="text-red-400 mb-1" />
          <span className="text-xl font-black">{stats.creados}</span>
          <span className="text-[10px] uppercase opacity-40 font-bold tracking-tighter">Planes</span>
        </div>
        <div className="flex flex-col items-center">
          <Trophy size={18} className="text-yellow-500 mb-1" />
          <span className="text-xl font-black">{stats.hechos}</span>
          <span className="text-[10px] uppercase opacity-40 font-bold tracking-tighter">Hechos</span>
        </div>
      </div>

      <div className="glass p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <span className="font-bold flex items-center gap-2">{dark ? <Moon size={18}/> : <Sun size={18}/>} Modo Noche</span>
          <button onClick={toggleDark} className={`w-12 h-6 rounded-full transition ${dark ? 'bg-red-500' : 'bg-gray-300'} relative`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${dark ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black opacity-30 uppercase ml-1">Vuestro Nombre</label>
          <input className="p-3 rounded-xl bg-black/5 dark:bg-white/5 outline-none" value={nombre} onChange={e => setNombre(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black opacity-30 uppercase ml-1">Aniversario</label>
          <input type="date" className="p-3 rounded-xl bg-black/5 dark:bg-white/5 outline-none" value={fecha} onChange={e => setFecha(e.target.value)} />
        </div>
        <button onClick={guardar} className="btn-primary w-full flex items-center justify-center gap-2"><Save size={18}/> Guardar Todo</button>
      </div>
    </div>
  );
}
