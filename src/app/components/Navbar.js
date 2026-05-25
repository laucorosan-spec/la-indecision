import Link from 'next/link';
import { Home, PlusCircle, Image as ImageIcon, Settings } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 glass px-6 py-4 flex gap-8 z-50">
      <Link href="/"><Home className="text-gray-600 hover:text-[#e57373]" /></Link>
      <Link href="/planes"><PlusCircle className="text-gray-600 hover:text-[#e57373]" /></Link>
      <Link href="/album"><ImageIcon className="text-gray-600 hover:text-[#e57373]" /></Link>
      <Link href="/ajustes"><Settings className="text-gray-600 hover:text-[#e57373]" /></Link>
    </nav>
  );
}