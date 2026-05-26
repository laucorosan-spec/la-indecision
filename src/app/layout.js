import './globals.css';
import Navbar from '@/components/Navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {/* max-w-md centra la app y le da forma de móvil en el PC */}
        <div className="max-w-md mx-auto min-h-screen relative bg-[#fdfbf7] shadow-2xl">
          <main className="px-6 pt-10 pb-32">
            {children}
          </main>
          <Navbar />
        </div>
      </body>
    </html>
  );
}
