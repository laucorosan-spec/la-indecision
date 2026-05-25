"use client";
import { useState, useEffect } from 'react';

export default function Album() {
  const [planes, setPlanes] = useState([]);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('planes') || '[]');
    // Solo mostramos los que están marcados como "hecho"
    setPlanes(guardados.filter(p => p.hecho === true));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[#e57373]">Nuestro Álbum</h1>
      {planes.length === 0 ? (
        <p className="text-gray-500">Aún no habéis completado ningún plan. ¡A girar la ruleta!</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {planes.map(plan => (
            <div key={plan.id} className="glass p-4">
              <h3 className="font-bold">{plan.nombre}</h3>
              <p className="text-sm text-gray-500">{plan.ubicacion}</p>
              <div className="mt-2 text-xs bg-[#e57373]/20 text-[#e57373] inline-block px-2 py-1 rounded">
                Completado ✅
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
