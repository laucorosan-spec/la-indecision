"use client";
import { useState, useEffect } from 'react';
import { Heart, Calendar, Moon, Sun, Save, User } from 'lucide-react';

export default function Ajustes() {
  const [nombre, setNombre] = useState('Pareja Indecisa');
  const [fechaInicio, setFechaInicio] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Cargar datos guardados
    setNombre(localStorage.getItem('usuario-nombre') || 'Pareja Indecisa');
    setFechaInicio(localStorage.getItem('aniversario') || '');
    
    // Comprobar si el modo oscuro ya estaba activo
    if (document.documentElement.classList.contains('dark')) {
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const guardarTodo = () => {
    localStorage.setItem('usuario-nombre', nombre);
    localStorage.setItem('aniversario', fechaInicio);
    alert("¡Configuración guardada! ❤️");
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      <h1 className="text-2xl font-bold mt-4">Ajustes</h1>

      <div className="glass p-6 flex flex-col gap-6">
        {/* Switch de Modo Oscuro */}
        <div className="flex justify-between items-center p-2">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="text-purple-400" /> : <Sun className="text-yellow-500" />}
            <span className="font-medium text-lg">Modo Noche</span>
          </div>
          <button 
            onClick={toggleDarkMode}
            className={`w-14 h-7 rounded-full transition-colors ${darkMode ? 'bg-red-500' : 'bg-gray-300'} relative`}
          >
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${darkMode ? 'left-8' : 'left-1'}`} />
          </button>
        </div>

        <hr className="border-white/10" />

        {/* Campo Nombre */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-400 font-bold uppercase ml-1 flex items-center gap-1">
            <User size={14} /> Vuestro Nombre
          </label>
          <input 
            className="p-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-red-400 transition-colors"
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        {/* Campo Aniversario */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-400 font-bold uppercase ml-1 flex items-center gap-1">
            <Calendar size={14} /> Fecha de Aniversario
          </label>
          <input 
            type="date"
            className="p-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-red-400 transition-colors"
            value={fechaInicio} 
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>

        <button onClick={guardarTodo} className="btn-primary w-full flex items-center justify-center gap-2 mt-4">
          <Save size={18} /> Guardar Cambios
        </button>
      </div>

      <div className="text-center">
        <Heart className="mx-auto text-red-500 animate-pulse" fill="currentColor" />
        <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">Creado para vuestros momentos</p>
      </div>
    </div>
  );
}
