"use client";
import { useState, useEffect } from 'react';

export default function Ajustes() {
  const [nombre, setNombre] = useState('Pareja Indecisa');

  useEffect(() => {
    const guardado = localStorage.getItem('usuario-nombre');
    if (guardado) setNombre(guardado);
  }, []);

  const guardarPerfil = () => {
    localStorage.setItem('usuario-nombre', nombre);
    alert("Perfil actualizado");
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Ajustes</h1>
      <div className="glass p-6 flex flex-col items-center gap-4">
        <div className="w-24 h-24 bg-[#e57373] rounded-full flex items-center justify-center text-white text-3xl">
          ❤️
        </div>
        <input 
          className="p-2 border-b border-gray-300 bg-transparent text-center outline-none"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <button onClick={guardarPerfil} className="btn-primary w-full text-sm">
          Guardar Cambios
        </button>
      </div>
      <p className="text-center text-xs text-gray-400">Hecho con amor para dejar de decir "¿qué quieres hacer?"</p>
    </div>
  );
}