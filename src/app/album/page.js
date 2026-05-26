"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Star } from 'lucide-react'; // Necesitas instalar lucide-react o usar un emoji

export default function Album() {
  const [planes, setPlanes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarHistorial = async () => {
      const { data, error } = await supabase
        .from('planes')
        .select('*')
        .eq('hecho', true)
        .order('created_at', { ascending: false });

      if (!error) setPlanes(data);
      setCargando(false);
    };
    cargarHistorial();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[#e57373]">Nuestro Álbum</h1>
      
      {planes.map(plan => (
        <div key={plan.id} className="glass p-5 flex flex-col gap-3">
          {/* Si algún día subes fotos, aquí iría la imagen */}
          {plan.foto && <img src={plan.foto} className="rounded-xl w-full h-48 object-cover" alt="Recuerdo" />}
          
          <div>
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg">{plan.nombre}</h3>
              <div className="flex text-yellow-500">
                {/* Dibujamos tantas estrellas como diga el rating */}
                {[...Array(plan.rating || 0)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
            </div>
            <p className="text-sm text-gray-500">📍 {plan.ubicacion}</p>
          </div>

          {plan.comentario && (
            <p className="text-sm italic text-gray-600 bg-white/30 p-3 rounded-lg">
              "{plan.comentario}"
            </p>
          )}

          <div className="text-[10px] text-gray-400 flex justify-between">
            <span>{plan.fecha ? `Fecha: ${plan.fecha}` : 'Sin fecha'}</span>
            <span>Añadido el {new Date(plan.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
