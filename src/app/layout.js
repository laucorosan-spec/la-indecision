import './globals.css';
import Navbar from '@/components/Navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-[#fdfbf7]">
        {/* Este 'max-w-md mx-auto' hace que parezca una App móvil en PC */}
        <main className="max-w-md mx-auto min-h-screen px-6 pb-32 pt-8 relative">
          {children}
        </main>
        <Navbar />
      </body>
    </html>
  );
}
