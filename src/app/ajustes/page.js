"use client";
import { useState, useEffect } from 'react';
import { Heart, Moon, Sun, Save } from 'lucide-react';

export default function Ajustes() {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setNombre(localStorage.getItem('usuario-nombre') || 'Pareja Indecisa');
    setFecha(localStorage.getItem('aniversario') || '');
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
    <div className="flex flex-col gap-6 pt-4">
      <h1 className="text-2xl font-bold">Ajustes</h1>
      <div className="glass p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <span className="font-bold flex items-center gap-2">{dark ? <Moon size={18}/> : <Sun size={18}/>} Modo Noche</span>
          <button onClick={toggleDark} className={`w-12 h-6 rounded-full transition ${dark ? 'bg-red-500' : 'bg-gray-300'} relative`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${dark ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black opacity-40 uppercase ml-1">Vuestro Nombre</label>
          <input className="p-3 rounded-xl bg-black/5 dark:bg-white/5 outline-none" value={nombre} onChange={e => setNombre(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black opacity-40 uppercase ml-1">Fecha Aniversario</label>
          <input type="date" className="p-3 rounded-xl bg-black/5 dark:bg-white/5 outline-none" value={fecha} onChange={e => setFecha(e.target.value)} />
        </div>
        <button onClick={guardar} className="btn-primary flex items-center justify-center gap-2"><Save size={18}/> Guardar Todo</button>
      </div>
      <div className="text-center opacity-30 mt-10"><Heart className="mx-auto" size={16}/></div>
    </div>
  );
}
