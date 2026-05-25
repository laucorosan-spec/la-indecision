import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'La Indecisión',
  description: '¿Qué hacemos hoy?',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="pb-24">
        <main className="max-w-md mx-auto p-4 pt-8">
          {children}
        </main>
        <Navbar />
      </body>
    </html>
  );
}
