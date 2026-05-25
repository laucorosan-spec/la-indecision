"use client";
import { useState, useEffect } from 'react';
import { Heart, Download, Upload, Trash2, Calendar, Award } from 'lucide-react';

export default function Ajustes() {
  const [nombre1, setNombre1] = useState('Él');
  const [nombre2, setNombre2] = useState('Ella');
  const [fechaAniversario, setFechaAniversario] = useState('');
  const [stats, setStats] = useState({ total: 0, completados: 0 });

  useEffect(() => {
    // Cargar nombres y fecha
    setNombre1(localStorage.getItem('pareja-n1') || 'Él');
    setNombre2(localStorage.getItem('pareja-n2') || 'Ella');
    setFechaAniversario(localStorage.getItem('pareja-fecha') || '');

    // Calcular estadísticas
    const planes = JSON.parse(localStorage.getItem('planes') || '[]');
    setStats({
      total: planes.length,
      completados: planes.filter(p => p.hecho).length
    });
  }, []);

  const guardarPerfil = () => {
    localStorage.setItem('pareja-n1', nombre1);
    localStorage.setItem('pareja-n2', nombre2);
    localStorage.setItem('pareja-fecha', fechaAniversario);
    alert("¡Perfil actualizado con éxito! ❤️");
  };

  // Función para no perder vuestros recuerdos (Copia de seguridad)
  const exportarDatos = () => {
    const datos = localStorage.getItem('planes');
    const blob = new Blob([datos], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nuestros-recuerdos.json';
    link.click();
  };

  const importarDatos = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      localStorage.setItem('planes', event.target.result);
      window.location.reload(); // Recargar para ver los cambios
    };
    reader.readAsText(file);
  };

  // Calcular días juntos
  const calcularDias = () => {
    if (!fechaAniversario) return "---";
    const inicio = new Date(fechaAniversario);
    const hoy = new Date();
    const dif = hoy - inicio;
    return Math.floor(dif / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      <h1 className="text-3xl font-bold text-[#e57373] text-center">Nuestro Rincón</h1>

      {/* Tarjeta de Aniversario */}
      <div className="glass p-6 text-center flex flex-col items-center gap-2 border-2 border-[#e57373]/20">
        <Heart className="text-[#e57373] fill-[#e57373] animate-pulse" size={40} />
        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Llevamos juntos</p>
        <h2 className="text-4xl font-black text-gray-800">{calcularDias()} días</h2>
        <input 
          type="date" 
          value={fechaAniversario} 
          onChange={(e) => setFechaAniversario(e.target.value)}
          className="mt-2 text-xs bg-transparent border-none text-gray-400 outline-none text-center"
        />
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-4 text-center">
          <Award className="mx-auto mb-1 text-yellow-500" />
          <p className="text-2xl font-bold">{stats.completados}</p>
          <p className="text-[10px] text-gray-400 uppercase">Planes Hechos</p>
        </div>
        <div className="glass p-4 text-center">
          <Calendar className="mx-auto mb-1 text-blue-500" />
          <p className="text-2xl font-bold">{stats.total - stats.completados}</p>
          <p className="text-[10px] text-gray-400 uppercase">Planes Pendientes</p>
        </div>
      </div>

      {/* Formulario Nombres */}
      <div className="glass p-6 flex flex-col gap-4">
        <h3 className="font-bold text-gray-700 mb-2 border-b border-gray-100 pb-2">Personalizar Nombres</h3>
        <div className="flex items-center gap-4">
          <input 
            value={nombre1} 
            onChange={(e) => setNombre1(e.target.value)}
            className="flex-1 p-3 rounded-xl bg-white/50 outline-none border border-transparent focus:border-[#e57373]"
            placeholder="Nombre 1"
          />
          <span className="text-[#e57373] font-bold">&</span>
          <input 
            value={nombre2} 
            onChange={(e) => setNombre2(e.target.value)}
            className="flex-1 p-3 rounded-xl bg-white/50 outline-none border border-transparent focus:border-[#e57373]"
            placeholder="Nombre 2"
          />
        </div>
        <button onClick={guardarPerfil} className="btn-primary text-sm py-2">Actualizar Nombres</button>
      </div>

      {/* Gestión de Datos */}
      <div className="glass p-6 flex flex-col gap-4">
        <h3 className="font-bold text-gray-700 mb-2">Seguridad y Datos</h3>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={exportarDatos}
            className="flex items-center justify-center gap-2 p-3 bg-gray-800 text-white rounded-xl text-xs hover:bg-black transition"
          >
            <Download size={14} /> Exportar Backup
          </button>
          
          <label className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 text-gray-800 rounded-xl text-xs cursor-pointer hover:bg-gray-50 transition">
            <Upload size={14} /> Importar Backup
            <input type="file" className="hidden" onChange={importarDatos} accept=".json" />
          </label>
        </div>
        
        <button 
          onClick={() => {
            if(confirm("¿Estás seguro? Se borrarán todos los planes y recuerdos para siempre.")) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="flex items-center justify-center gap-2 p-3 text-red-500 text-xs border border-red-100 rounded-xl hover:bg-red-50"
        >
          <Trash2 size={14} /> Borrar todo
        </button>
      </div>

      <p className="text-center text-[10px] text-gray-300 mt-4 italic">
        "La Indecisión" v1.2 — Hecho con amor ❤️
      </p>
    </div>
  );
}
"use client";
import { useState, useEffect } from 'react';
import { Moon, Sun, Heart, Award, Calendar } from 'lucide-react';
// ... otros imports

export default function Ajustes() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Ver si el modo oscuro ya estaba activado
    if (document.documentElement.classList.contains('dark')) {
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-[#e57373] text-center">Nuestro Rincón</h1>

      {/* Botón de Modo Oscuro */}
      <div className="glass p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {darkMode ? <Moon className="text-purple-400" /> : <Sun className="text-yellow-500" />}
          <span className="font-bold">Modo Oscuro</span>
        </div>
        <button 
          onClick={toggleDarkMode}
          className={`w-14 h-8 rounded-full transition-colors relative ${darkMode ? 'bg-purple-600' : 'bg-gray-300'}`}
        >
          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${darkMode ? 'left-7' : 'left-1'}`}></div>
        </button>
      </div>

      {/* ... Resto de tu código de Ajustes (Estadísticas, nombres, etc.) ... */}
    </div>
  );
}
