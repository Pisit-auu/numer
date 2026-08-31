'use client';
import { useEffect, useId, useState } from 'react';
import axios from 'axios';
import 'katex/dist/katex.min.css';
import MethodShell from './MethodShell';
import Select from './ui/Select';
import Field from './ui/Field';
import Alert from './ui/Alert';
import ResultCard from './ui/ResultCard';
import Readout from './ui/Readout';
import IterationTable from './ui/IterationTable';
import EmptyState from './ui/EmptyState';
import MatrixInput from './ui/MatrixInput';
import { Play, Grid } from './ui/Icons';

const MAX_SIZE = 8;

/**
 * Shared frame for the nine linear-system methods: pick n, fill [A] and {B},
 * solve, read {x} above the working. Pages supply only `solve`.
 *
 * `solve` receives { A, B, x0, size, tolerance } and returns
 * { x, steps?, iterations?, columns?, warning? } or { error }.
 */
export default function LinearMethodPage({
  method,
  problem,
  solve,
  needsX0 = false,
  needsTolerance = false,
  stepsTitle = 'ขั้นตอนการคำนวณ',
  stepsDescription,
  iterationTitle = 'ตารางการวนซ้ำ',
}) {
  const [size, setSize] = useState('');
  const [A, setA] = useState([]);
  const [B, setB] = useState([]);
  const [x0, setX0] = useState([]);
  const [toleranceInput, setTolerance] = useState('0.000001');
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState([]);
  const [error, setError] = useState('');
  const [runId, setRunId] = useState(0);
  const formId = useId();

  const n = parseInt(size, 10);

  useEffect(() => {
    if (!Number.isInteger(n) || n < 1) {
      setA([]);
      setB([]);
      setX0([]);
      return;
    }
    setA(Array.from({ length: n }, () => Array.from({ length: n }, () => 0)));
    setB(Array.from({ length: n }, () => 0));
    setX0(Array.from({ length: n }, () => 0));
    setResult(null);
  }, [n]);

  const fetchSaved = async () => {
    try {
      const { data } = await axios.get('/api/linear');
      setSaved(
        data.map((row) => ({
          value: row.id,
          label: `${row.size}×${row.size} · ${row.proublem || 'linear'}${row.Date ? ` · ${row.Date}` : ''}`,
        }))
      );
    } catch {
      /* The history picker is a convenience; the page works without it. */
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const loadSaved = async (id) => {
    try {
      const { data } = await axios.get(`/api/linear/${id}`);
      setSize(String(data.size));
      /* The size effect resets the grids, so fill them on the next tick. */
      setTimeout(() => {
        setA(data.A);
        setB(data.B);
        if (Array.isArray(data.x0) && data.x0.length === data.size) setX0(data.x0);
        setResult(null);
      }, 0);
      setError('');
    } catch {
      setError('โหลดเมทริกซ์ที่บันทึกไว้ไม่สำเร็จ');
    }
  };

  const number = (value) => {
    const parsed = parseFloat(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const changeA = (i, j, value) =>
    setA((current) => current.map((row, ri) => (ri === i ? row.map((cell, ci) => (ci === j ? number(value) : cell)) : row)));
  const changeB = (i, value) => setB((current) => current.map((cell, ci) => (ci === i ? number(value) : cell)));
  const changeX0 = (i, value) => setX0((current) => current.map((cell, ci) => (ci === i ? number(value) : cell)));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!Number.isInteger(n) || n < 2) {
      setError('กรอกขนาดเมทริกซ์ตั้งแต่ 2 ขึ้นไป');
      return;
    }
    if (n > MAX_SIZE) {
      setError(`รองรับสูงสุด ${MAX_SIZE}×${MAX_SIZE}`);
      return;
    }

    const tolerance = parseFloat(toleranceInput);
    if (needsTolerance && !(tolerance > 0)) {
      setError('ค่า tolerance ต้องมากกว่าศูนย์');
      return;
    }

    let outcome;
    try {
      outcome = solve({
        A: A.map((row) => [...row]),
        B: [...B],
        x0: [...x0],
        size: n,
        tolerance,
      });
    } catch (thrown) {
      setError(thrown?.message || 'คำนวณไม่สำเร็จ ตรวจค่าในเมทริกซ์อีกครั้ง');
      setResult(null);
      return;
    }

    if (!outcome || outcome.error) {
      setError(outcome?.error || 'คำนวณไม่สำเร็จ ตรวจค่าในเมทริกซ์อีกครั้ง');
      setResult(null);
      return;
    }

    setResult(outcome);
    setRunId((id) => id + 1);

    try {
      await axios.post('/api/linear', {
        proublem: problem,
        size: n,
        A,
        B,
        x0,
        Date: new Date().toLocaleString('th-TH', {
          timeZone: 'Asia/Bangkok',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      });
      fetchSaved();
    } catch {
      /* Saving is best-effort; the result on screen is what matters. */
    }
  };

  return (
    <MethodShell
      family="linear"
      method={method}
      aside={
        <>
          <ResultCard title="ขนาดระบบสมการ">
            <form id={formId} onSubmit={handleSubmit} className="form-grid">
              <Field label="ขนาดเมทริกซ์ (n × n)" hint={`ตั้งแต่ 2 ถึง ${MAX_SIZE}`}>
                {(props) => (
                  <input
                    {...props}
                    type="number"
                    min="2"
                    max={MAX_SIZE}
                    className="input input--mono"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="3"
                  />
                )}
              </Field>

              {needsTolerance && (
                <Field label="Tolerance" hint="เกณฑ์หยุดการวนซ้ำ">
                  {(props) => (
                    <input
                      {...props}
                      type="number"
                      step="any"
                      className="input input--mono"
                      value={toleranceInput}
                      onChange={(e) => setTolerance(e.target.value)}
                    />
                  )}
                </Field>
              )}

            </form>
          </ResultCard>

          <div className="method-grid__secondary">
          <ResultCard
            title="โหลดจากบันทึก"
            description="ระบบสมการที่เคยคำนวณไว้"
            meta={<span className="badge badge--muted">{saved.length}</span>}
          >
            {saved.length === 0 ? (
              <p className="field__hint">ยังไม่มีระบบสมการที่บันทึกไว้</p>
            ) : (
              <Select placeholder="เลือกระบบสมการ…" onChange={loadSaved} options={saved} />
            )}
          </ResultCard>
          </div>
        </>
      }
    >
      {A.length === 0 ? (
        <section className="card">
          <EmptyState
            icon={Grid}
            title="เริ่มจากกำหนดขนาดเมทริกซ์"
            description="กรอกค่า n ในการ์ดขนาดระบบสมการ ตารางสำหรับกรอก [A] และ {B} จะขึ้นตรงนี้"
          />
        </section>
      ) : (
        <section className="card">
          <header className="card__header">
            <div>
              <h2 className="card__title">กรอกค่าเมทริกซ์</h2>
              <p className="card__desc">{`ระบบสมการ ${n} ตัวแปร — [A]{x} = {B}`}</p>
            </div>
          </header>
          <div className="card__body">
            <MatrixInput
              size={n}
              A={A}
              B={B}
              x0={x0}
              showX0={needsX0}
              onChangeA={changeA}
              onChangeB={changeB}
              onChangeX0={changeX0}
            />
          </div>
          <div className="card__actions">
            <button type="submit" form={formId} className="btn btn--primary">
              <Play size={14} />
              คำนวณ
            </button>
            {error && <Alert variant="error">{error}</Alert>}
          </div>
        </section>
      )}

      {A.length === 0 && error && <Alert variant="error">{error}</Alert>}

      {result && (
        <div className="stack results-enter" key={runId}>
          {result.warning && <Alert variant="info">{result.warning}</Alert>}

          {result.x && (
            <Readout
              items={result.x.map((value, i) => ({
                label: `x${i + 1}`,
                value: Number(value).toFixed(6),
              }))}
            />
          )}

          {result.steps && (
            <ResultCard title={stepsTitle} description={stepsDescription}>
              {result.steps}
            </ResultCard>
          )}

          {result.iterations?.length > 0 && result.columns && (
            <IterationTable
              title={iterationTitle}
              columns={result.columns}
              rows={result.iterations}
            />
          )}
        </div>
      )}
    </MethodShell>
  );
}
