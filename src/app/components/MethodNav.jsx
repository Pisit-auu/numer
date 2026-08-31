'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { families } from '../lib/methods';
import { familyIcons } from './ui/Icons';

/** The method tree. Shared by the desktop sidebar and the mobile drawer. */
export default function MethodNav({ onNavigate }) {
  const pathname = usePathname();

  return (
    <nav aria-label="เมธอดทั้งหมด">
      {families.map((family) => {
        const Icon = familyIcons[family.slug];
        return (
          <div key={family.slug} className="sidebar__group">
            <p className="sidebar__label">
              <span className="inline-flex items-center gap-1.5">
                <Icon size={13} />
                {family.nameTh}
              </span>
            </p>
            <ul>
              {family.methods.map((method) => {
                const href = `/${family.slug}/${method.slug}`;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className="sidebar__link"
                      aria-current={pathname === href ? 'page' : undefined}
                      onClick={onNavigate}
                    >
                      {method.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
