"use client";
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Star } from 'lucide-react';

export default function Album() {
  const [planes, setPlanes] = useState([]);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('planes') || '[]');
    setPlanes(guardados.filter(p => p.hecho === true));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-[#e57373]">Nuestro Álbum</h1>
        <p className="text-gray-500 text-sm">Momentos guardados para siempre</p>
      </header>

      {planes.length === 0 ? (
        <div className="glass p-10 text-center flex flex-col gap-4">
          <span className="text-5xl">📸</span>
          <p className="text-gray-500">Aún no hay recuerdos aquí. ¡Id a vivir vuestro primer plan!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {planes.map(plan => (
            <div key={plan.id} className="bg-white p-4 shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-300" style={{ borderRadius: '2px' }}>
              {/* Contenedor de la Imagen (Estilo Polaroid) */}
              <div className="relative w-full aspect-square bg-gray-100 mb-4 overflow-hidden rounded-sm">
                <img 
                  src={plan.foto} 
                  alt={plan.nombre} 
                  className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all"
                />
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold">{plan.rating}</span>
                </div>
              </div>

              {/* Texto del Recuerdo */}
              <div className="flex flex-col gap-2 px-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-xl text-gray-800 leading-tight">{plan.nombre}</h3>
                </div>
                
                <div className="flex flex-col gap-1 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{plan.ubicacion}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{plan.fecha}</span>
                  </div>
                </div>

                <div className="mt-2 p-3 bg-gray-50 rounded-lg italic text-gray-700 border-l-4 border-[#e57373]">
                  "{plan.comentario || 'Un día increíble juntos...'}"
                </div>
              </div>
              
              {/* Adorno de cinta adhesiva opcional */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-8 bg-white/40 backdrop-blur-sm rotate-2 shadow-sm border border-white/20"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
