'use client';
import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from './ui/Icons';

const ORDER = ['system', 'light', 'dark'];
const META = {
  system: { Icon: Monitor, label: 'ตามระบบ' },
  light: { Icon: Sun, label: 'สว่าง' },
  dark: { Icon: Moon, label: 'มืด' },
};

export function applyTheme(theme) {
  const dark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'system');
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return undefined;
    localStorage.setItem('theme', theme);
    applyTheme(theme);
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => theme === 'system' && applyTheme('system');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [theme, mounted]);

  const { Icon, label } = META[theme];
  const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];

  return (
    <button
      type="button"
      className="btn btn--ghost btn--sm btn--icon"
      onClick={() => setTheme(next)}
      title={`ธีม: ${label} — คลิกเพื่อเปลี่ยนเป็น ${META[next].label}`}
      aria-label={`ธีมปัจจุบัน ${label} เปลี่ยนเป็น ${META[next].label}`}
    >
      {/* Before hydration the stored theme is unknown; render the neutral icon. */}
      {mounted ? <Icon size={16} /> : <Monitor size={16} />}
    </button>
  );
}
