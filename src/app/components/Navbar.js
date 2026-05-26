"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, Image, Settings } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', icon: Home },
    { href: '/planes', icon: PlusCircle },
    { href: '/album', icon: Image },
    { href: '/ajustes', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 glass px-6 py-4 flex gap-10 z-[100] shadow-2xl">
      {links.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link key={item.href} href={item.href}>
            <Icon 
              size={24} 
              className={`transition-all ${active ? 'text-[#e57373] scale-125' : 'text-gray-400 hover:text-gray-600'}`} 
              fill={active ? "currentColor" : "none"}
            />
          </Link>
        );
      })}
    </nav>
  );
}
