'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { families, allMethods } from '../lib/methods';
import { Search, Book, familyIcons } from './ui/Icons';

const STATIC_ENTRIES = [
  { id: 'page:home', name: 'หน้าแรก', meta: 'ไดเรกทอรีเมธอด', href: '/', group: 'หน้า' },
  { id: 'page:api', name: 'API Docs', meta: 'Swagger', href: '/api-doc', group: 'หน้า' },
];

const ENTRIES = [
  ...allMethods.map((m) => ({
    id: `m:${m.familySlug}/${m.slug}`,
    name: m.name,
    meta: m.familyName,
    href: m.href,
    group: m.familyNameTh,
    familySlug: m.familySlug,
    haystack: `${m.name} ${m.slug} ${m.familyName} ${m.familyNameTh} ${m.desc}`.toLowerCase(),
  })),
  ...STATIC_ENTRIES.map((e) => ({ ...e, haystack: `${e.name} ${e.meta}`.toLowerCase() })),
];

const GROUP_ORDER = [...families.map((f) => f.nameTh), 'หน้า'];

export default function CommandPalette({ open, onOpenChange }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ENTRIES;
    const terms = q.split(/\s+/);
    return ENTRIES.filter((e) => terms.every((t) => e.haystack.includes(t)));
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map();
    results.forEach((entry) => {
      if (!map.has(entry.group)) map.set(entry.group, []);
      map.get(entry.group).push(entry);
    });
    return GROUP_ORDER.filter((g) => map.has(g)).map((g) => [g, map.get(g)]);
  }, [results]);

  const flat = useMemo(() => grouped.flatMap(([, items]) => items), [grouped]);

  const close = useCallback(() => {
    onOpenChange(false);
    setQuery('');
    setActive(0);
  }, [onOpenChange]);

  const go = useCallback(
    (entry) => {
      close();
      router.push(entry.href);
    },
    [close, router]
  );

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (flat.length ? (i + 1) % flat.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flat[active]) go(flat[active]);
    }
  };

  let cursor = -1;

  return (
    <div
      className="cmdk-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div
        className="cmdk"
        role="dialog"
        aria-modal="true"
        aria-label="ค้นหาเมธอด"
        onKeyDown={onKeyDown}
      >
        <div className="cmdk__search">
          <Search size={16} />
          <input
            ref={inputRef}
            className="cmdk__input"
            placeholder="ค้นหาเมธอด เช่น bisection, เมทริกซ์, ปริพันธ์…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="ค้นหาเมธอด"
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="cmdk__list" ref={listRef} role="listbox" aria-label="ผลการค้นหา">
          {flat.length === 0 && (
            <p className="cmdk__group-label">ไม่พบเมธอดที่ตรงกับ “{query}”</p>
          )}
          {grouped.map(([group, items]) => (
            <div key={group}>
              <p className="cmdk__group-label">{group}</p>
              {items.map((entry) => {
                cursor += 1;
                const index = cursor;
                const FamilyIcon = familyIcons[entry.familySlug] || Book;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    role="option"
                    aria-selected={index === active}
                    data-active={index === active}
                    className="cmdk__item"
                    onMouseMove={() => setActive(index)}
                    onClick={() => go(entry)}
                  >
                    <FamilyIcon size={15} />
                    <span>{entry.name}</span>
                    <span className="cmdk__item-meta">{entry.meta}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="cmdk__footer">
          <span>
            <kbd className="kbd">↑</kbd> <kbd className="kbd">↓</kbd> เลื่อน
          </span>
          <span>
            <kbd className="kbd">↵</kbd> เปิด
          </span>
          <span>
            <kbd className="kbd">esc</kbd> ปิด
          </span>
        </div>
      </div>
    </div>
  );
}
