'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { families, allMethods, totalMethods } from './lib/methods';
import Select from './components/ui/Select';
import Alert from './components/ui/Alert';
import EmptyState from './components/ui/EmptyState';
import { Search, ChevronRight, History, Trash, familyIcons } from './components/ui/Icons';

/* Which API resources hold each family's saved equations. */
const RESOURCES = {
  root: ['root'],
  linear: ['linear'],
  inter: ['inter'],
  extrapolation: ['simple', 'multiple'],
  integration: ['integrate'],
  differentiation: ['diff'],
};

const RESOURCE_LABELS = {
  root: 'Root',
  linear: 'Linear',
  inter: 'Interpolation',
  simple: 'Simple Regression',
  multiple: 'Multiple Regression',
  integrate: 'Integration',
  diff: 'Differentiation',
};

const toRows = (value) => (Array.isArray(value) ? value : []);
const vector = (value) => toRows(value).join(' \\\\ ');
const matrix = (value) =>
  toRows(value)
    .map((row) => (Array.isArray(row) ? row.join(' & ') : row))
    .join(' \\\\ ');

/* Each resource renders its own saved parameters, in the notation of its method. */
function RecordDetails({ resource, row }) {
  if (resource === 'root') {
    return (
      <>
        <InlineMath math={`f(x)=${row.name}`} />
        <span className="mono text-[0.8125rem] muted">
          x<sub>l</sub> = {row.xl} · x<sub>r</sub> = {row.xr}
        </span>
      </>
    );
  }
  if (resource === 'linear') {
    return (
      <>
        <InlineMath math={`[A]=\\begin{bmatrix} ${matrix(row.A)} \\end{bmatrix}`} />
        <InlineMath math={`\\{B\\}=\\begin{Bmatrix} ${vector(row.B)} \\end{Bmatrix}`} />
      </>
    );
  }
  if (resource === 'inter') {
    return (
      <>
        <InlineMath math={`X=\\begin{Bmatrix} ${vector(row.X)} \\end{Bmatrix}`} />
        <InlineMath math={`Y=\\begin{Bmatrix} ${vector(row.Y)} \\end{Bmatrix}`} />
        <InlineMath math={`x_0=${row.x0}`} />
      </>
    );
  }
  if (resource === 'simple' || resource === 'multiple') {
    return (
      <>
        <InlineMath math={`X=\\begin{Bmatrix} ${vector(row.X)} \\end{Bmatrix}`} />
        <InlineMath math={`Y=\\begin{Bmatrix} ${vector(row.Y)} \\end{Bmatrix}`} />
        {resource === 'simple' ? (
          <InlineMath math={`m=${row.m}`} />
        ) : (
          <InlineMath math={`x_i=${vector(row.xi) || row.xi}`} />
        )}
      </>
    );
  }
  if (resource === 'integrate') {
    return (
      <>
        <InlineMath math={`f(x)=${row.fx}`} />
        <span className="mono text-[0.8125rem] muted">
          a = {row.a} · b = {row.b} · n = {row.n}
        </span>
      </>
    );
  }
  return (
    <>
      <InlineMath math={`f(x)=${row.fx}`} />
      <span className="mono text-[0.8125rem] muted">
        x = {row.x} · h = {row.h}
      </span>
    </>
  );
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [familySlug, setFamilySlug] = useState('root');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmingId, setConfirmingId] = useState(null);

  const fetchRecords = async (slug) => {
    setLoading(true);
    setError('');
    try {
      const responses = await Promise.all(
        (RESOURCES[slug] || []).map((resource) =>
          axios.get(`/api/${resource}`).then((res) => ({ resource, rows: res.data }))
        )
      );
      setRecords(
        responses.flatMap(({ resource, rows }) =>
          (Array.isArray(rows) ? rows : []).slice(-5).reverse().map((row) => ({ resource, row }))
        )
      );
    } catch {
      setError('โหลดรายการที่บันทึกไว้ไม่สำเร็จ ลองรีเฟรชหน้าอีกครั้ง');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setConfirmingId(null);
    setNotice('');
    fetchRecords(familySlug);
  }, [familySlug]);

  const removeRecord = async (resource, id) => {
    setConfirmingId(null);
    setError('');
    try {
      await axios.delete(`/api/${resource}/${id}`);
      setNotice('ลบรายการแล้ว');
      fetchRecords(familySlug);
    } catch {
      setError('ลบรายการไม่สำเร็จ ลองใหม่อีกครั้ง');
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const terms = q.split(/\s+/);
    return allMethods.filter((method) =>
      terms.every((term) =>
        `${method.name} ${method.slug} ${method.desc} ${method.familyName} ${method.familyNameTh}`
          .toLowerCase()
          .includes(term)
      )
    );
  }, [query]);

  const familyOptions = families.map((family) => ({
    value: family.slug,
    label: family.nameTh,
  }));

  return (
    <main className="page page--wide">
      <header className="mb-7">
        <h1 className="page-title">เมธอดเชิงตัวเลข</h1>
        <p className="page-lead">
          เลือกเมธอด กรอกพารามิเตอร์ แล้วอ่านตารางการวนซ้ำทีละรอบพร้อมกราฟ — ทั้งหมด {totalMethods}{' '}
          เมธอดใน {families.length} กลุ่มปัญหา
        </p>
      </header>

      <div className="relative mb-6 max-w-md">
        <Search
          size={16}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="search"
          className="input pl-8"
          placeholder="กรองเมธอด เช่น newton, เมทริกซ์, ปริพันธ์…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="กรองรายชื่อเมธอด"
        />
      </div>

      <div className="grid gap-6 items-start xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="directory">
          {filtered ? (
            <section className="card directory__full">
              <header className="card__header">
                <h2 className="card__title">ผลการกรอง</h2>
                <span className="badge badge--muted">{filtered.length} เมธอด</span>
              </header>
              {filtered.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title={`ไม่พบเมธอดที่ตรงกับ “${query}”`}
                  description="ลองพิมพ์ชื่อเมธอดเป็นภาษาอังกฤษ เช่น bisection หรือชื่อกลุ่มปัญหาเป็นภาษาไทย"
                />
              ) : (
                <div className="index-list">
                  {filtered.map((method) => (
                    <Link key={method.href} href={method.href} className="index-row">
                      <div className="min-w-0">
                        <p className="index-row__name">{method.name}</p>
                        <p className="index-row__desc">{method.desc}</p>
                      </div>
                      <span className="badge badge--muted">{method.familyName}</span>
                      <ChevronRight size={15} className="index-row__chevron" />
                    </Link>
                  ))}
                </div>
              )}
            </section>
          ) : (
            families.map((family) => {
              const Icon = familyIcons[family.slug];
              return (
                <section key={family.slug} className="card">
                  <header className="card__header">
                    <div className="flex items-center gap-2.5">
                      <span className="empty__icon !mb-0 !h-7 !w-7">
                        <Icon size={15} />
                      </span>
                      <div>
                        <h2 className="card__title">{family.nameTh}</h2>
                        <p className="card__desc">
                          {family.name} · {family.desc}
                        </p>
                      </div>
                    </div>
                    <span className="badge badge--muted">{family.methods.length} เมธอด</span>
                  </header>
                  <div className="index-list">
                    {family.methods.map((method) => (
                      <Link
                        key={method.slug}
                        href={`/${family.slug}/${method.slug}`}
                        className="index-row"
                      >
                        <div className="min-w-0">
                          <p className="index-row__name">{method.name}</p>
                          <p className="index-row__desc">{method.desc}</p>
                        </div>
                        <ChevronRight size={15} className="index-row__chevron" />
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </div>

        <aside className="card xl:sticky xl:top-[calc(var(--header-h)+1.5rem)] xl:max-h-[calc(100dvh-var(--header-h)-3rem)] xl:overflow-y-auto">
          <header className="card__header">
            <div>
              <h2 className="card__title">บันทึกล่าสุด</h2>
              <p className="card__desc">สมการที่เคยคำนวณไว้ หยิบกลับมาใช้ได้จากหน้าเมธอด</p>
            </div>
          </header>

          <div className="card__body !pb-3">
            <Select
              value={familySlug}
              onChange={setFamilySlug}
              options={familyOptions}
              aria-label="เลือกกลุ่มปัญหาที่จะดูบันทึก"
            />
          </div>

          {(error || notice) && (
            <div className="px-5 pb-3">
              {error && <Alert variant="error">{error}</Alert>}
              {!error && notice && <Alert variant="success">{notice}</Alert>}
            </div>
          )}

          {loading ? (
            <div className="grid gap-2 px-5 pb-5">
              <div className="skeleton h-12" />
              <div className="skeleton h-12" />
              <div className="skeleton h-12" />
            </div>
          ) : error ? null : records.length === 0 ? (
            <EmptyState
              icon={History}
              title="ยังไม่มีบันทึกในกลุ่มนี้"
              description="ทุกครั้งที่กดคำนวณ พารามิเตอร์จะถูกบันทึกไว้ให้เรียกกลับมาใช้ซ้ำ"
            />
          ) : (
            <div>
              {records.map(({ resource, row }) => {
                const key = `${resource}-${row.id}`;
                return (
                  <article key={key} className="record">
                    <div className="min-w-0">
                      <div className="record__meta">
                        <span className="badge badge--muted">
                          {row.proublem || RESOURCE_LABELS[resource]}
                        </span>
                        {row.Date && <time>{row.Date}</time>}
                      </div>
                      <div className="record__data">
                        <RecordDetails resource={resource} row={row} />
                      </div>
                      {confirmingId === key && (
                        <div className="mt-2.5 flex items-center gap-2">
                          <span className="text-[0.75rem] muted">ลบรายการนี้ถาวร?</span>
                          <button
                            type="button"
                            className="btn btn--destructive btn--sm"
                            onClick={() => removeRecord(resource, row.id)}
                          >
                            ลบ
                          </button>
                          <button
                            type="button"
                            className="btn btn--ghost btn--sm"
                            onClick={() => setConfirmingId(null)}
                          >
                            ยกเลิก
                          </button>
                        </div>
                      )}
                    </div>
                    {confirmingId !== key && (
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm btn--icon"
                        onClick={() => setConfirmingId(key)}
                        aria-label="ลบรายการนี้"
                      >
                        <Trash size={15} />
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
