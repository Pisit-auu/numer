'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { evaluate } from 'mathjs';
import MethodShell from './MethodShell';
import Select from './ui/Select';
import Field from './ui/Field';
import Alert from './ui/Alert';
import ResultCard from './ui/ResultCard';
import Readout from './ui/Readout';
import IterationTable from './ui/IterationTable';
import EmptyState from './ui/EmptyState';
import { Play, Area } from './ui/Icons';

/**
 * Shared frame for the four integration rules: f(x) over [a, b], optionally cut
 * into n strips. `solve` receives { fx, a, b, n, f } and returns
 * { value, steps?, iterations?, columns? } or { error }.
 */
export default function IntegrationMethodPage({
  method,
  problem,
  solve,
  needsN = false,
  nHint,
  stepsTitle = 'ขั้นตอนการคำนวณ',
  stepsDescription,
}) {
  const [fx, setFx] = useState('');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [nInput, setN] = useState('4');
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState([]);
  const [error, setError] = useState('');
  const [runId, setRunId] = useState(0);

  const fetchSaved = async () => {
    try {
      const { data } = await axios.get('/api/integrate');
      setSaved(data.map((row) => ({ value: row.id, label: row.fx })));
    } catch {
      /* The history picker is a convenience; the page works without it. */
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const loadSaved = async (id) => {
    try {
      const { data } = await axios.get(`/api/integrate/${id}`);
      setFx(data.fx);
      setA(String(data.a));
      setB(String(data.b));
      if (data.n) setN(String(data.n));
      setError('');
    } catch {
      setError('โหลดสมการที่บันทึกไว้ไม่สำเร็จ');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!fx.trim()) {
      setError('กรอกฟังก์ชัน f(x) ก่อน เช่น 5x - 1');
      return;
    }

    const lower = parseFloat(a);
    const upper = parseFloat(b);
    const n = parseInt(nInput, 10);

    if (Number.isNaN(lower) || Number.isNaN(upper)) {
      setError('กรอกขอบเขต a และ b ให้เป็นตัวเลขทั้งคู่');
      return;
    }
    if (lower >= upper) {
      setError('ขอบเขตล่าง a ต้องน้อยกว่าขอบเขตบน b');
      return;
    }
    if (needsN && (!Number.isInteger(n) || n < 1)) {
      setError('จำนวนช่วง n ต้องเป็นจำนวนเต็มบวก');
      return;
    }

    const f = (x) => evaluate(fx, { x });

    let outcome;
    try {
      outcome = solve({ fx, a: lower, b: upper, n, f });
    } catch {
      setError('อ่านฟังก์ชันไม่ออก ใช้รูปแบบของ mathjs เช่น 5x - 1 หรือ x^2 + sin(x)');
      setResult(null);
      return;
    }

    if (!outcome || outcome.error) {
      setError(outcome?.error || 'คำนวณไม่สำเร็จ');
      setResult(null);
      return;
    }

    setResult(outcome);
    setRunId((id) => id + 1);

    try {
      await axios.post('/api/integrate', {
        proublem: problem,
        fx,
        a: lower,
        b: upper,
        n: needsN ? n : 0,
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
      family="integration"
      method={method}
      aside={
        <>
          <ResultCard title="พารามิเตอร์">
            <form onSubmit={handleSubmit} className="form-grid">
              <Field label={<InlineMath math="f(x)" />} hint="ใช้รูปแบบ mathjs เช่น 5x - 1">
                {(props) => (
                  <input
                    {...props}
                    type="text"
                    className="input input--mono"
                    value={fx}
                    onChange={(e) => setFx(e.target.value)}
                    placeholder="5x - 1"
                    autoComplete="off"
                    spellCheck={false}
                  />
                )}
              </Field>

              <div className="form-grid form-grid--2">
                <Field label={<InlineMath math="a" />}>
                  {(props) => (
                    <input
                      {...props}
                      type="number"
                      step="any"
                      className="input input--mono"
                      value={a}
                      onChange={(e) => setA(e.target.value)}
                      placeholder="0"
                    />
                  )}
                </Field>
                <Field label={<InlineMath math="b" />}>
                  {(props) => (
                    <input
                      {...props}
                      type="number"
                      step="any"
                      className="input input--mono"
                      value={b}
                      onChange={(e) => setB(e.target.value)}
                      placeholder="6"
                    />
                  )}
                </Field>
              </div>

              {needsN && (
                <Field label={<InlineMath math="n" />} hint={nHint || 'จำนวนช่วงย่อย'}>
                  {(props) => (
                    <input
                      {...props}
                      type="number"
                      min="1"
                      className="input input--mono"
                      value={nInput}
                      onChange={(e) => setN(e.target.value)}
                    />
                  )}
                </Field>
              )}

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
            description="สมการที่เคยคำนวณไว้"
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
      <ResultCard title="ปริพันธ์ที่กำลังหา">
        <div className="equation">
          <InlineMath math={`\\int_{${a || 'a'}}^{${b || 'b'}} ${fx || 'f(x)'} \\,dx`} />
        </div>
      </ResultCard>

      {!result ? (
        <section className="card">
          <EmptyState
            icon={Area}
            title="ยังไม่มีผลลัพธ์"
            description="กรอกฟังก์ชันและขอบเขตในการ์ดพารามิเตอร์ แล้วกดคำนวณ ขั้นตอนการแทนค่าจะขึ้นตรงนี้"
          />
        </section>
      ) : (
        <div className="stack results-enter" key={runId}>
          <Readout items={[{ label: 'ค่าปริพันธ์ I', value: Number(result.value).toFixed(6) }]} />

          {result.steps && (
            <ResultCard title={stepsTitle} description={stepsDescription}>
              <div className="overflow-x-auto">{result.steps}</div>
            </ResultCard>
          )}

          {result.iterations?.length > 0 && result.columns && (
            <IterationTable
              title="ค่าฟังก์ชันที่แต่ละจุดแบ่ง"
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
