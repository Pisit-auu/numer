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
import PointsInput from './ui/PointsInput';
import { Play, Scatter } from './ui/Icons';

const MAX_POINTS = 20;

/**
 * Shared frame for methods that take a set of (X, Y) samples plus a target x —
 * interpolation and regression. Pages supply `solve` and any extra controls.
 *
 * `solve` receives { X, Y, x0, n, extra } and returns
 * { value, valueLabel?, steps?, iterations?, columns?, graph?, warning? } or { error }.
 */
export default function PointsMethodPage({
  family,
  method,
  problem,
  resource,
  solve,
  extraFields = [],
  targetLabel = 'ค่า x ที่ต้องการประมาณ',
  targetHint,
  targetKey = 'x0',
  Graph,
  graphTitle = 'กราฟจุดข้อมูล',
  graphDescription,
  stepsTitle = 'ขั้นตอนการคำนวณ',
  stepsDescription,
  buildPayload,
}) {
  const [count, setCount] = useState('');
  const [X, setX] = useState([]);
  const [Y, setY] = useState([]);
  const [target, setTarget] = useState('');
  const [extra, setExtra] = useState(() =>
    Object.fromEntries(extraFields.map((field) => [field.key, field.default ?? '']))
  );
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState([]);
  const [error, setError] = useState('');
  const [runId, setRunId] = useState(0);
  const formId = useId();

  const n = parseInt(count, 10);

  useEffect(() => {
    if (!Number.isInteger(n) || n < 1) {
      setX([]);
      setY([]);
      return;
    }
    setX(Array.from({ length: n }, () => 0));
    setY(Array.from({ length: n }, () => 0));
    setResult(null);
  }, [n]);

  const fetchSaved = async () => {
    try {
      const { data } = await axios.get(`/api/${resource}`);
      setSaved(
        data.map((row) => ({
          value: row.id,
          label: `${row.point} จุด · ${row.proublem || resource}${row.Date ? ` · ${row.Date}` : ''}`,
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
      const { data } = await axios.get(`/api/${resource}/${id}`);
      setCount(String(data.point));
      setTimeout(() => {
        setX(data.X);
        setY(data.Y);
        if (data[targetKey] !== undefined && data[targetKey] !== null) setTarget(String(data[targetKey]));
        setResult(null);
      }, 0);
      setError('');
    } catch {
      setError('โหลดชุดข้อมูลที่บันทึกไว้ไม่สำเร็จ');
    }
  };

  const number = (value) => {
    const parsed = parseFloat(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const changeX = (i, value) => setX((current) => current.map((v, ci) => (ci === i ? number(value) : v)));
  const changeY = (i, value) => setY((current) => current.map((v, ci) => (ci === i ? number(value) : v)));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!Number.isInteger(n) || n < 2) {
      setError('ต้องมีจุดข้อมูลอย่างน้อย 2 จุด');
      return;
    }
    if (n > MAX_POINTS) {
      setError(`รองรับสูงสุด ${MAX_POINTS} จุด`);
      return;
    }

    const x0 = parseFloat(target);
    if (Number.isNaN(x0)) {
      setError(`กรอก${targetLabel}ให้เป็นตัวเลข`);
      return;
    }

    let outcome;
    try {
      outcome = solve({ X: [...X], Y: [...Y], x0, n, extra });
    } catch (thrown) {
      setError(thrown?.message || 'คำนวณไม่สำเร็จ ตรวจค่าที่กรอกอีกครั้ง');
      setResult(null);
      return;
    }

    if (!outcome || outcome.error) {
      setError(outcome?.error || 'คำนวณไม่สำเร็จ ตรวจค่าที่กรอกอีกครั้ง');
      setResult(null);
      return;
    }

    setResult(outcome);
    setRunId((id) => id + 1);

    try {
      await axios.post(`/api/${resource}`, {
        proublem: problem,
        point: n,
        X,
        Y,
        ...(buildPayload ? buildPayload({ x0, extra, X, Y, n }) : { x0 }),
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
      family={family}
      method={method}
      aside={
        <>
          <ResultCard title="พารามิเตอร์">
            <form id={formId} onSubmit={handleSubmit} className="form-grid">
              <Field label="จำนวนจุดข้อมูล" hint={`ตั้งแต่ 2 ถึง ${MAX_POINTS}`}>
                {(props) => (
                  <input
                    {...props}
                    type="number"
                    min="2"
                    max={MAX_POINTS}
                    className="input input--mono"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    placeholder="4"
                  />
                )}
              </Field>

              <Field label={targetLabel} hint={targetHint}>
                {(props) => (
                  <input
                    {...props}
                    type="number"
                    step="any"
                    className="input input--mono"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="2.5"
                  />
                )}
              </Field>

              {extraFields.map((field) => (
                <Field key={field.key} label={field.label} hint={field.hint}>
                  {(props) =>
                    field.choices ? (
                      <Select
                        {...props}
                        value={extra[field.key]}
                        onChange={(value) => setExtra((c) => ({ ...c, [field.key]: value }))}
                        options={field.choices}
                      />
                    ) : (
                      <input
                        {...props}
                        type="number"
                        step="any"
                        className="input input--mono"
                        value={extra[field.key]}
                        onChange={(e) => setExtra((c) => ({ ...c, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                      />
                    )
                  }
                </Field>
              ))}

            </form>
          </ResultCard>

          <div className="method-grid__secondary">
          <ResultCard
            title="โหลดจากบันทึก"
            description="ชุดข้อมูลที่เคยคำนวณไว้"
            meta={<span className="badge badge--muted">{saved.length}</span>}
          >
            {saved.length === 0 ? (
              <p className="field__hint">ยังไม่มีชุดข้อมูลที่บันทึกไว้</p>
            ) : (
              <Select placeholder="เลือกชุดข้อมูล…" onChange={loadSaved} options={saved} />
            )}
          </ResultCard>
          </div>
        </>
      }
    >
      {X.length === 0 ? (
        <section className="card">
          <EmptyState
            icon={Scatter}
            title="เริ่มจากกำหนดจำนวนจุด"
            description="กรอกจำนวนจุดข้อมูลในการ์ดพารามิเตอร์ ตารางสำหรับกรอกค่า X และ Y จะขึ้นตรงนี้"
          />
        </section>
      ) : (
        <section className="card">
          <header className="card__header">
            <div>
              <h2 className="card__title">จุดข้อมูล</h2>
              <p className="card__desc">{`${n} จุด`}</p>
            </div>
          </header>
          <PointsInput X={X} Y={Y} onChangeX={changeX} onChangeY={changeY} />
          <div className="card__actions">
            <button type="submit" form={formId} className="btn btn--primary">
              <Play size={14} />
              คำนวณ
            </button>
            {error && <Alert variant="error">{error}</Alert>}
          </div>
        </section>
      )}

      {X.length === 0 && error && <Alert variant="error">{error}</Alert>}

      {result && (
        <div className="stack results-enter" key={runId}>
          {result.warning && <Alert variant="info">{result.warning}</Alert>}

          {result.value !== undefined && (
            <Readout
              items={[
                {
                  label: result.valueLabel || `f(${target})`,
                  value: Number(result.value).toFixed(6),
                },
              ]}
            />
          )}

          {Graph && result.graph && (
            <ResultCard title={graphTitle} description={graphDescription}>
              <Graph {...result.graph} />
            </ResultCard>
          )}

          {result.steps && (
            <ResultCard title={stepsTitle} description={stepsDescription}>
              {result.steps}
            </ResultCard>
          )}

          {result.iterations?.length > 0 && result.columns && (
            <IterationTable
              title={result.tableTitle || 'ตารางการคำนวณ'}
              columns={result.columns}
              rows={result.iterations}
              markLast={false}
            />
          )}
        </div>
      )}
    </MethodShell>
  );
}
