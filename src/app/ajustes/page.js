"use client";
import { useState, useEffect } from 'react';
import { Heart, Calendar, Moon, Sun, Save } from 'lucide-react';

export default function Ajustes() {
  const [nombre, setNombre] = useState('Pareja Indecisa');
  const [fechaInicio, setFechaInicio] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setNombre(localStorage.getItem('usuario-nombre') || 'Pareja Indecisa');
    setFechaInicio(localStorage.getItem('aniversario') || '');
    // Comprobar si ya estaba el modo oscuro activo
    if (document.documentElement.classList.contains('dark')) setDarkMode(true);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const guardarTodo = () => {
    localStorage.setItem('usuario-nombre', nombre);
    localStorage.setItem('aniversario', fechaInicio);
    alert("¡Configuración guardada! ❤️");
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      <h1 className="text-2xl font-bold">Nuestros Ajustes</h1>

      <div className="glass p-6 flex flex-col gap-6">
        {/* Toggle Modo Oscuro */}
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2 font-medium">
            {darkMode ? <Moon size={20} /> : <Sun size={20} />} Modo Noche
          </span>
          <button 
            onClick={toggleDarkMode}
            className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-red-500' : 'bg-gray-300'} relative`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${darkMode ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        {/* Nombre */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-400 font-bold uppercase ml-1">Vuestro Nombre</label>
          <input 
            className="p-3 rounded-xl bg-white/10 border border-white/20 outline-none"
            value={nombre} onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        {/* Fecha Aniversario */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-400 font-bold uppercase ml-1">Fecha de Aniversario</label>
          <input 
            type="date"
            className="p-3 rounded-xl bg-white/10 border border-white/20 outline-none"
            value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>

        <button onClick={guardarTodo} className="btn-primary w-full flex items-center justify-center gap-2">
          <Save size={18} /> Guardar Cambios
        </button>
      </div>
    </div>
  );
}
