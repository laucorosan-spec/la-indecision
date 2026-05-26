"use client";

import { useState, useEffect } from 'react';
import { Moon, Sun, Heart, Award, Calendar, User, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Ajustes() {
  const [nombre, setNombre] = useState('Pareja Indecisa');
  const [cargando, setCargando] = useState(false);

  // Cargamos el nombre guardado al abrir la página
  useEffect(() => {
    const guardado = localStorage.getItem('usuario-nombre');
    if (guardado) setNombre(guardado);
  }, []);

  const guardarPerfil = () => {
    setCargando(true);
    localStorage.setItem('usuario-nombre', nombre);
    
    // Simulamos una carga pequeña para feedback visual
    setTimeout(() => {
      setCargando(false);
      alert("¡Perfil actualizado con éxito! ❤️");
    }, 500);
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Award className="text-[#e57373]" /> Ajustes del Perfil
      </h1>

      <div className="glass p-6 flex flex-col items-center gap-6">
        {/* Avatar con icono de Corazón */}
        <div className="relative">
          <div className="w-24 h-24 bg-[#e57373]/20 rounded-full flex items-center justify-center text-[#e57373]">
            <Heart size={48} fill="#e57373" />
          </div>
          <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm">
            <Sun size={16} className="text-yellow-500" />
          </div>
        </div>

        {/* Formulario */}
        <div className="w-full flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-400 uppercase ml-1 flex items-center gap-1">
            <User size={12} /> Vuestro Nombre
          </label>
          <input 
            className="w-full p-3 rounded-2xl bg-white/50 border border-gray-100 outline-none focus:border-[#e57373] transition-all"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Alba y Carlos"
          />
        </div>

        <button 
          onClick={guardarPerfil} 
          disabled={cargando}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Save size={18} />
          {cargando ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>

      {/* Información extra */}
      <div className="flex flex-col gap-4">
        <div className="glass p-4 flex items-center gap-4 text-sm">
          <Calendar className="text-blue-400" />
          <span>Versión de la App: 1.0.0</span>
        </div>
        <div className="glass p-4 flex items-center gap-4 text-sm">
          <Moon className="text-purple-400" />
          <span>Modo Noche: Próximamente</span>
        </div>
      </div>

      <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest">
        Hecho con amor para personas indecisas
      </p>
    </div>
  );
}
