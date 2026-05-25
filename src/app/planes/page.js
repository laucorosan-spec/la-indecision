"use client";
import { useState, useEffect } from 'react';
import { Trash2, Edit2, Check } from 'lucide-react';

export default function RegistroPlanes() {
  const [planes, setPlanes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [categoria, setCategoria] = useState('hoy');
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('planes') || '[]');
    setPlanes(guardados);
  }, []);

  const guardarPlan = (e) => {
    e.preventDefault();
    let nuevosPlanes;

    if (editandoId) {
      nuevosPlanes = planes.map(p => 
        p.id === editandoId ? { ...p, nombre, ubicacion, categoria } : p
      );
      setEditandoId(null);
    } else {
      const nuevo = { id: Date.now(), nombre, ubicacion, categoria, hecho: false };
      nuevosPlanes = [...planes, nuevo];
    }

    localStorage.setItem('planes', JSON.stringify(nuevosPlanes));
    setPlanes(nuevosPlanes);
    setNombre(''); setUbicacion('');
  };

  const eliminarPlan = (id) => {
    if (confirm("¿Seguro que quieres borrar este plan?")) {
      const filtrados = planes.filter(p => p.id !== id);
      localStorage.setItem('planes', JSON.stringify(filtrados));
      setPlanes(filtrados);
    }
  };

  const prepararEdicion = (plan) => {
    setNombre(plan.nombre);
    setUbicacion(plan.ubicacion);
    setCategoria(plan.categoria);
    setEditandoId(plan.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">{editandoId ? "Editar Plan" : "Nuevo Plan"}</h1>
        <form onSubmit={guardarPlan} className="glass p-6 flex flex-col gap-4 border-2 border-[#e57373]/20">
          <input placeholder="¿Qué plan es?" className="p-3 rounded-xl bg-white/50 outline-none" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <input placeholder="¿Dónde es?" className="p-3 rounded-xl bg-white/50 outline-none" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
          <select className="p-3 rounded-xl bg-white/50 outline-none" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="hoy">Para hoy</option>
            <option value="futuro">Más adelante</option>
          </select>
          <button type="submit" className="btn-primary">
            {editandoId ? "Actualizar Plan" : "Guardar Plan"}
          </button>
          {editandoId && <button onClick={() => setEditandoId(null)} className="text-sm text-gray-500">Cancelar</button>}
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Vuestra Lista</h2>
        <div className="flex flex-col gap-3">
          {planes.filter(p => !p.hecho).map(plan => (
            <div key={plan.id} className="glass p-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-800">{plan.nombre}</p>
                <p className="text-xs text-gray-500">{plan.categoria === 'hoy' ? '📍 Hoy' : '📅 Futuro'} • {plan.ubicacion}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => prepararEdicion(plan)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={18} /></button>
                <button onClick={() => eliminarPlan(plan.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
          {planes.filter(p => !p.hecho).length === 0 && <p className="text-center text-gray-400 text-sm">No hay planes pendientes. ¡Añade uno!</p>}
        </div>
      </div>
    </div>
  );
}
