'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CommandPalette from './CommandPalette';
import MethodNav from './MethodNav';
import ThemeToggle from './ThemeToggle';
import { Search, Sigma, Menu, X } from './ui/Icons';

const links = [
  { href: '/', label: 'เมธอด' },
  { href: '/api-doc', label: 'API' },
];

export default function AppHeader() {
  const pathname = usePathname();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    const onKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => setNavOpen(false), [pathname]);

  return (
    <>
      <header className="app-header">
        <div className="app-header__inner">
          <button
            type="button"
            className="btn btn--ghost btn--sm btn--icon lg:hidden"
            onClick={() => setNavOpen((o) => !o)}
            aria-expanded={navOpen}
            aria-label={navOpen ? 'ปิดเมนูเมธอด' : 'เปิดเมนูเมธอด'}
          >
            {navOpen ? <X size={17} /> : <Menu size={17} />}
          </button>

          <Link href="/" className="brand">
            <span className="brand__mark">
              <Sigma size={14} />
            </span>
            <span className="hidden sm:inline">Numerical Methods</span>
            <span className="sm:hidden">Numerical</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 ml-2" aria-label="เมนูหลัก">
            {links.map((link) => {
              const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="btn btn--ghost btn--sm"
                  style={active ? { color: 'hsl(var(--foreground))' } : undefined}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          <button
            type="button"
            className="search-trigger hidden sm:flex"
            onClick={() => setPaletteOpen(true)}
          >
            <Search size={14} />
            <span className="flex-1 text-left">ค้นหาเมธอด…</span>
            <kbd className="kbd">{isMac ? '⌘' : 'Ctrl'} K</kbd>
          </button>

          <button
            type="button"
            className="btn btn--ghost btn--sm btn--icon sm:hidden"
            onClick={() => setPaletteOpen(true)}
            aria-label="ค้นหาเมธอด"
          >
            <Search size={16} />
          </button>

          <ThemeToggle />
        </div>

        {navOpen && (
          <div
            id="mobile-nav"
            className="lg:hidden border-b bg-background max-h-[70dvh] overflow-y-auto px-3 py-4 shadow-md"
          >
            <MethodNav onNavigate={() => setNavOpen(false)} />
          </div>
        )}
      </header>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
}
