"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, Image as ImageIcon, Settings } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const links = [
    { href: '/', icon: Home },
    { href: '/planes', icon: PlusCircle },
    { href: '/album', icon: ImageIcon },
    { href: '/ajustes', icon: Settings },
  ];

  return (
    <div className="fixed bottom-8 left-0 right-0 flex justify-center z-[100] px-6">
      <nav className="glass px-8 py-4 flex gap-10 shadow-2xl">
        {links.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Icon size={24} className={`transition-all ${active ? 'text-[#e57373] scale-125' : 'text-gray-400'}`} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
