'use client';
import Link from 'next/link';
import MethodNav from './MethodNav';
import { findFamily, findMethod } from '../lib/methods';

/**
 * The frame every one of the 25 method pages shares: sidebar, breadcrumb,
 * title, and the aside/results split. Pages supply only their own controls and
 * results, so the 25 stay one template rather than 25 layouts.
 */
export default function MethodShell({ family: familySlug, method: methodSlug, aside, children }) {
  const family = findFamily(familySlug);
  const method = findMethod(familySlug, methodSlug);

  return (
    <div className="app-shell app-shell--sidebar">
      <aside className="sidebar">
        <MethodNav />
      </aside>

      <div className="page page--wide">
        <nav className="breadcrumb" aria-label="เส้นทาง">
          <Link href="/">เมธอด</Link>
          <span className="breadcrumb__sep" aria-hidden="true">
            /
          </span>
          <span>{family?.nameTh}</span>
          <span className="breadcrumb__sep" aria-hidden="true">
            /
          </span>
          <span style={{ color: 'hsl(var(--foreground))' }}>{method?.name}</span>
        </nav>

        <div className="mt-3 mb-7">
          <h1 className="page-title">{method?.name}</h1>
          {method?.desc && <p className="page-lead">{method.desc}</p>}
        </div>

        <div className="method-grid">
          <div className="method-grid__aside">{aside}</div>
          <div className="stack">{children}</div>
        </div>
      </div>
    </div>
  );
}
