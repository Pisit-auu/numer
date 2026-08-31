'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { roundToSignificantDecimals } from './function';
import MethodShell from './MethodShell';
import Select from './ui/Select';
import Field from './ui/Field';
import Alert from './ui/Alert';
import ResultCard from './ui/ResultCard';
import Readout from './ui/Readout';
import IterationTable from './ui/IterationTable';
import EmptyState from './ui/EmptyState';
import { Play, Curve } from './ui/Icons';

/**
 * Every root-finding method shares the same shape: an f(x), one or two starting
 * values, a tolerance, then a convergence graph over an iteration table. This
 * holds that shape so the six pages differ only in their `solve`.
 *
 * `solve` receives { fx, values, tolerance } and returns
 * { rows, graph, error?, warning? } — rows being [{ xk, result, error }].
 */
export default function RootMethodPage({
  method,
  problem,
  fields,
  solve,
  Graph,
  graphTitle = 'กราฟการลู่เข้า',
  graphDescription = 'ค่าที่ได้ในแต่ละรอบเทียบกับ f(x)',
  answerLabel = 'ราก',
  functionLabel = <InlineMath math="f(x)" />,
  functionHint = 'ใช้รูปแบบ mathjs เช่น x^3 - x - 2',
  functionPlaceholder = 'x^3 - x - 2',
  defaults = {},
}) {
  const [fx, setFx] = useState(defaults.fx ?? '');
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((field) => [field.key, defaults[field.key] ?? '']))
  );
  const [toleranceInput, setTolerance] = useState(defaults.tolerance ?? '0.000001');
  const [iterations, setIterations] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [saved, setSaved] = useState([]);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [runId, setRunId] = useState(0);

  const setValue = (key, value) => setValues((current) => ({ ...current, [key]: value }));

  const fetchSaved = async () => {
    try {
      const response = await axios.get('/api/root');
      setSaved(response.data.map((row) => ({ value: row.id, label: row.name })));
    } catch {
      /* The history picker is a convenience; the page works without it. */
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const loadSaved = async (id) => {
    try {
      const { data } = await axios.get(`/api/root/${id}`);
      setFx(data.name);
      setValues(
        Object.fromEntries(fields.map((field) => [field.key, String(data[field.apiKey] ?? '')]))
      );
      setError('');
    } catch {
      setError('โหลดสมการที่บันทึกไว้ไม่สำเร็จ');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setWarning('');

    if (!fx.trim()) {
      setError('กรอกฟังก์ชัน f(x) ก่อน เช่น x^3 - x - 2');
      return;
    }

    const tolerance = parseFloat(toleranceInput);
    if (!(tolerance > 0)) {
      setError('ค่า tolerance ต้องมากกว่าศูนย์');
      return;
    }

    const numbers = {};
    for (const field of fields) {
      const parsed = parseFloat(values[field.key]);
      if (Number.isNaN(parsed)) {
        setError(`กรอก ${field.plain} ให้เป็นตัวเลข`);
        return;
      }
      numbers[field.key] = parsed;
    }

    let outcome;
    try {
      outcome = solve({ fx, values: numbers, tolerance });
    } catch {
      setError('อ่านฟังก์ชันไม่ออก ใช้รูปแบบของ mathjs เช่น x^3 - x - 2 หรือ sin(x) + 1');
      return;
    }

    if (outcome?.error) {
      setError(outcome.error);
      setIterations([]);
      setGraphData([]);
      return;
    }

    setIterations(outcome.rows);
    setGraphData(outcome.graph ?? outcome.rows.map((row) => ({ x: row.xk, y: row.result })));
    setWarning(outcome.warning || '');
    setRunId((id) => id + 1);

    try {
      await axios.post('/api/root', {
        name: fx,
        proublem: problem,
        xl: numbers[fields.find((f) => f.apiKey === 'xl')?.key] ?? 0,
        xr: numbers[fields.find((f) => f.apiKey === 'xr')?.key] ?? 0,
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

  const last = iterations[iterations.length - 1];

  return (
    <MethodShell
      family="root"
      method={method}
      aside={
        <>
          <ResultCard title="พารามิเตอร์">
            <form onSubmit={handleSubmit} className="form-grid">
              <Field label={functionLabel} hint={functionHint}>
                {(props) => (
                  <input
                    {...props}
                    type="text"
                    className="input input--mono"
                    value={fx}
                    onChange={(e) => setFx(e.target.value)}
                    placeholder={functionPlaceholder}
                    autoComplete="off"
                    spellCheck={false}
                  />
                )}
              </Field>

              <div className={fields.length > 1 ? 'form-grid form-grid--2' : 'form-grid'}>
                {fields.map((field) => (
                  <Field key={field.key} label={field.label} hint={field.hint}>
                    {(props) => (
                      <input
                        {...props}
                        type="number"
                        step="any"
                        className="input input--mono"
                        value={values[field.key]}
                        onChange={(e) => setValue(field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    )}
                  </Field>
                ))}
              </div>

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

              {error && <Alert variant="error">{error}</Alert>}

              <div className="form-actions">
                <button type="submit" className="btn btn--primary">
                  <Play size={14} />
                  คำนวณ
                </button>
              </div>
            </form>
          </ResultCard>

          <div className="method-grid__secondary">
          <ResultCard
            title="โหลดจากบันทึก"
            description="สมการที่เคยคำนวณไว้ เลือกแล้วค่าจะเติมลงฟอร์มให้"
            meta={<span className="badge badge--muted">{saved.length}</span>}
          >
            {saved.length === 0 ? (
              <p className="field__hint">ยังไม่มีสมการที่บันทึกไว้</p>
            ) : (
              <Select placeholder="เลือกสมการ…" onChange={loadSaved} options={saved} />
            )}
          </ResultCard>
          </div>
        </>
      }
    >
      {iterations.length === 0 ? (
        <section className="card">
          <EmptyState
            icon={Curve}
            title="ยังไม่มีผลลัพธ์"
            description="กรอกฟังก์ชันและค่าเริ่มต้นในการ์ดพารามิเตอร์ แล้วกดคำนวณ ตารางการวนซ้ำและกราฟจะขึ้นตรงนี้"
          />
        </section>
      ) : (
        <div className="stack results-enter" key={runId}>
          {warning && <Alert variant="info">{warning}</Alert>}
          <Readout
            description={`วนซ้ำทั้งหมด ${iterations.length} รอบ`}
            items={[
              { label: answerLabel, value: last.xk.toFixed(6) },
              { label: 'f(x)', value: roundToSignificantDecimals(last.result).toFixed(6) },
              { label: 'ค่าความคลาดเคลื่อน', value: `${last.error.toFixed(6)} %` },
            ]}
          />

          {Graph && (
            <ResultCard title={graphTitle} description={graphDescription}>
              <Graph dataPoints={graphData} />
            </ResultCard>
          )}

          <IterationTable
            columns={[
              { key: 'i', label: 'รอบ', render: (_, i) => i },
              { key: 'xk', label: 'x', render: (row) => row.xk.toFixed(6) },
              {
                key: 'result',
                label: 'f(x)',
                render: (row) => roundToSignificantDecimals(row.result).toFixed(6),
              },
              { key: 'error', label: 'error (%)', render: (row) => row.error.toFixed(6) },
            ]}
            rows={iterations}
          />
        </div>
      )}
    </MethodShell>
  );
}
