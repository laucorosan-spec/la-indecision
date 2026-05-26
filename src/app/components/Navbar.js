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
    <div className="fixed bottom-8 left-0 right-0 flex justify-center z-[100] px-4">
      <nav className="glass px-8 py-4 flex gap-10 shadow-2xl items-center">
        {links.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Icon 
                size={26} 
                className={`transition-all duration-300 ${active ? 'text-[#e57373] scale-125' : 'text-gray-400 hover:text-gray-600'}`} 
                strokeWidth={active ? 2.5 : 2}
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
