"use client";
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Album() {
  const [planes, setPlanes] = useState([]);

  const cargarRecuerdos = async () => {
    const { data } = await supabase
      .from('planes')
      .select('*')
      .eq('hecho', true)
      .order('fecha', { ascending: false });
    
    if (data) setPlanes(data);
  };

  useEffect(() => { cargarRecuerdos(); }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-[#e57373] text-center">Nuestro Álbum</h1>
      <div className="grid grid-cols-1 gap-8">
        {planes.map(plan => (
          <div key={plan.id} className="bg-white p-4 shadow-xl transform rotate-1 hover:rotate-0 transition-all">
            <div className="relative w-full aspect-square bg-gray-100 mb-4 overflow-hidden rounded-sm">
              <img src={plan.foto || 'https://via.placeholder.com/400'} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-bold">{plan.rating}</span>
              </div>
            </div>
            <h3 className="font-bold text-xl">{plan.nombre}</h3>
            <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12}/> {plan.ubicacion} • <Calendar size={12}/> {plan.fecha}</p>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg italic text-sm text-gray-700 border-l-4 border-[#e57373]">
              "{plan.comentario || 'Un día increíble...'}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
