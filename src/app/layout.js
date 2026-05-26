import './globals.css';
import Navbar from '@/components/Navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-[#fdfbf7] antialiased">
        {/* Contenedor principal que centra la app en PC */}
        <div className="max-w-md mx-auto min-h-screen relative shadow-sm bg-[#fdfbf7]">
          <main className="px-6 pt-8 pb-32">
            {children}
          </main>
          {/* El Navbar va AQUÍ adentro para que se mueva con la App */}
          <Navbar />
        </div>
      </body>
    </html>
  );
}
