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
    <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50">
      <nav className="bg-white/90 backdrop-blur-md px-8 py-4 flex gap-10 rounded-full shadow-2xl border border-white/50">
        {links.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="relative transition-transform active:scale-90">
              <Icon size={24} className={active ? 'text-[#e57373]' : 'text-gray-300'} />
              {active && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#e57373] rounded-full" />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
