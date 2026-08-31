'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { evaluate, derivative } from 'mathjs';
import MethodShell from '../../components/MethodShell';
import Select from '../../components/ui/Select';
import Field from '../../components/ui/Field';
import Alert from '../../components/ui/Alert';
import ResultCard from '../../components/ui/ResultCard';
import Readout from '../../components/ui/Readout';
import IterationTable from '../../components/ui/IterationTable';
import EmptyState from '../../components/ui/EmptyState';
import { Play, Function as FunctionIcon } from '../../components/ui/Icons';

const round = (value) => Number(Number(value).toFixed(6));

/**
 * Finite-difference coefficient tables, keyed direction → accuracy → order.
 * Each entry lists the sample offsets (in units of h from x), their weights,
 * and the divisor that multiplies hⁿ.
 */
const FORMULAS = {
  forward: {
    1: {
      1: { offsets: [0, 1], weights: [-1, 1], divisor: 1 },
      2: { offsets: [0, 1, 2], weights: [1, -2, 1], divisor: 1 },
      3: { offsets: [0, 1, 2, 3], weights: [-1, 3, -3, 1], divisor: 1 },
      4: { offsets: [0, 1, 2, 3, 4], weights: [1, -4, 6, -4, 1], divisor: 1 },
    },
    2: {
      1: { offsets: [0, 1, 2], weights: [-3, 4, -1], divisor: 2 },
      2: { offsets: [0, 1, 2, 3], weights: [2, -5, 4, -1], divisor: 1 },
      3: { offsets: [0, 1, 2, 3, 4], weights: [-5, 18, -24, 14, -3], divisor: 2 },
      4: { offsets: [0, 1, 2, 3, 4, 5], weights: [3, -14, 26, -24, 11, -2], divisor: 1 },
    },
  },
  backward: {
    1: {
      1: { offsets: [0, -1], weights: [1, -1], divisor: 1 },
      2: { offsets: [0, -1, -2], weights: [1, -2, 1], divisor: 1 },
      3: { offsets: [0, -1, -2, -3], weights: [1, -3, 3, -1], divisor: 1 },
      4: { offsets: [0, -1, -2, -3, -4], weights: [1, -4, 6, -4, 1], divisor: 1 },
    },
    2: {
      1: { offsets: [0, -1, -2], weights: [3, -4, 1], divisor: 2 },
      2: { offsets: [0, -1, -2, -3], weights: [2, -5, 4, -1], divisor: 1 },
      3: { offsets: [0, -1, -2, -3, -4], weights: [5, -18, 24, -14, 3], divisor: 2 },
      4: { offsets: [0, -1, -2, -3, -4, -5], weights: [3, -14, 26, -24, 11, -2], divisor: 1 },
    },
  },
  centered: {
    2: {
      1: { offsets: [1, -1], weights: [1, -1], divisor: 2 },
      2: { offsets: [1, 0, -1], weights: [1, -2, 1], divisor: 1 },
      3: { offsets: [2, 1, -1, -2], weights: [1, -2, 2, -1], divisor: 2 },
      4: { offsets: [2, 1, 0, -1, -2], weights: [1, -4, 6, -4, 1], divisor: 1 },
    },
    4: {
      1: { offsets: [2, 1, -1, -2], weights: [-1, 8, -8, 1], divisor: 12 },
      2: { offsets: [2, 1, 0, -1, -2], weights: [-1, 16, -30, 16, -1], divisor: 12 },
      3: { offsets: [3, 2, 1, -1, -2, -3], weights: [-1, 8, -13, 13, -8, 1], divisor: 8 },
      4: { offsets: [3, 2, 1, 0, -1, -2, -3], weights: [-1, 12, -39, 56, -39, 12, -1], divisor: 6 },
    },
  },
};

const DIRECTIONS = [
  { value: 'forward', label: 'Forward — ใช้จุดข้างหน้า' },
  { value: 'backward', label: 'Backward — ใช้จุดข้างหลัง' },
  { value: 'centered', label: 'Centered — ใช้จุดทั้งสองข้าง' },
];

const ORDERS = [
  { value: '1', label: "อนุพันธ์อันดับ 1 — f'(x)" },
  { value: '2', label: "อนุพันธ์อันดับ 2 — f''(x)" },
  { value: '3', label: "อนุพันธ์อันดับ 3 — f'''(x)" },
  { value: '4', label: 'อนุพันธ์อันดับ 4 — f⁗(x)' },
];

const accuracyOptions = (direction) =>
  direction === 'centered'
    ? [
        { value: '2', label: 'O(h²)' },
        { value: '4', label: 'O(h⁴)' },
      ]
    : [
        { value: '1', label: 'O(h)' },
        { value: '2', label: 'O(h²)' },
      ];

export default function DividedDifference() {
  const [fx, setFx] = useState('');
  const [x, setX] = useState('');
  const [h, setH] = useState('0.1');
  const [direction, setDirection] = useState('forward');
  const [accuracy, setAccuracy] = useState('1');
  const [order, setOrder] = useState('1');
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState([]);
  const [error, setError] = useState('');
  const [runId, setRunId] = useState(0);

  const fetchSaved = async () => {
    try {
      const { data } = await axios.get('/api/diff');
      setSaved(data.map((row) => ({ value: row.id, label: row.fx })));
    } catch {
      /* The history picker is a convenience; the page works without it. */
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  /* Centered formulas only exist at O(h²) and O(h⁴). */
  useEffect(() => {
    const allowed = accuracyOptions(direction).map((option) => option.value);
    if (!allowed.includes(accuracy)) setAccuracy(allowed[0]);
  }, [direction, accuracy]);

  const loadSaved = async (id) => {
    try {
      const { data } = await axios.get(`/api/diff/${id}`);
      setFx(data.fx);
      setX(String(data.x));
      setH(String(data.h));
      setError('');
    } catch {
      setError('โหลดสมการที่บันทึกไว้ไม่สำเร็จ');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!fx.trim()) {
      setError('กรอกฟังก์ชัน f(x) ก่อน เช่น x^3 - 2x');
      return;
    }

    const xValue = parseFloat(x);
    const hValue = parseFloat(h);
    const n = parseInt(order, 10);

    if (Number.isNaN(xValue)) {
      setError('กรอกค่า x ให้เป็นตัวเลข');
      return;
    }
    if (!(hValue > 0)) {
      setError('ขนาดช่วง h ต้องมากกว่าศูนย์');
      return;
    }

    const formula = FORMULAS[direction]?.[accuracy]?.[n];
    if (!formula) {
      setError('ไม่มีสูตรสำหรับชุดตัวเลือกนี้ ลองเปลี่ยนความแม่นยำหรืออันดับอนุพันธ์');
      return;
    }

    try {
      const samples = formula.offsets.map((offset, i) => {
        const sampleX = xValue + offset * hValue;
        const value = evaluate(fx, { x: sampleX });
        return {
          offset,
          x: sampleX,
          value,
          weight: formula.weights[i],
          contribution: formula.weights[i] * value,
        };
      });

      const numerator = samples.reduce((sum, sample) => sum + sample.contribution, 0);
      const approximate = numerator / (formula.divisor * hValue ** n);

      /* The exact derivative is what makes the error column meaningful. */
      let exact = null;
      try {
        let expression = fx;
        for (let i = 0; i < n; i += 1) expression = derivative(expression, 'x').toString();
        exact = evaluate(expression, { x: xValue });
      } catch {
        exact = null;
      }

      setRunId((id) => id + 1);
      setResult({
        approximate,
        exact,
        samples,
        numerator,
        formula,
        n,
        h: hValue,
        error:
          exact !== null && exact !== 0 ? Math.abs((exact - approximate) / exact) * 100 : null,
      });
    } catch {
      setError('อ่านฟังก์ชันไม่ออก ใช้รูปแบบของ mathjs เช่น x^3 - 2x หรือ e^x');
      setResult(null);
      return;
    }

    try {
      await axios.post('/api/diff', {
        proublem: `${direction} O(h^${accuracy}) order ${order}`,
        fx,
        x: xValue,
        h: hValue,
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

  const denominator =
    result &&
    `${result.formula.divisor === 1 ? '' : result.formula.divisor}h^{${result.n}}`.replace('^{1}', '');

  return (
    <MethodShell
      family="differentiation"
      method="divided"
      aside={
        <>
          <ResultCard title="พารามิเตอร์">
            <form onSubmit={handleSubmit} className="form-grid">
              <Field label={<InlineMath math="f(x)" />} hint="ใช้รูปแบบ mathjs เช่น x^3 - 2x">
                {(props) => (
                  <input
                    {...props}
                    type="text"
                    className="input input--mono"
                    value={fx}
                    onChange={(e) => setFx(e.target.value)}
                    placeholder="x^3 - 2x"
                    autoComplete="off"
                    spellCheck={false}
                  />
                )}
              </Field>

              <div className="form-grid form-grid--2">
                <Field label={<InlineMath math="x" />} hint="จุดที่ต้องการหาอนุพันธ์">
                  {(props) => (
                    <input
                      {...props}
                      type="number"
                      step="any"
                      className="input input--mono"
                      value={x}
                      onChange={(e) => setX(e.target.value)}
                      placeholder="2"
                    />
                  )}
                </Field>
                <Field label={<InlineMath math="h" />} hint="ขนาดช่วง">
                  {(props) => (
                    <input
                      {...props}
                      type="number"
                      step="any"
                      className="input input--mono"
                      value={h}
                      onChange={(e) => setH(e.target.value)}
                    />
                  )}
                </Field>
              </div>

              <Field label="อันดับอนุพันธ์">
                {(props) => (
                  <Select {...props} value={order} onChange={setOrder} options={ORDERS} />
                )}
              </Field>

              <Field label="ทิศทางของผลต่าง">
                {(props) => (
                  <Select {...props} value={direction} onChange={setDirection} options={DIRECTIONS} />
                )}
              </Field>

              <Field label="ความแม่นยำ" hint="อันดับของพจน์ความคลาดเคลื่อนที่ตัดทิ้ง">
                {(props) => (
                  <Select
                    {...props}
                    value={accuracy}
                    onChange={setAccuracy}
                    options={accuracyOptions(direction)}
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
      {!result ? (
        <section className="card">
          <EmptyState
            icon={FunctionIcon}
            title="ยังไม่มีผลลัพธ์"
            description="เลือกอันดับอนุพันธ์ ทิศทาง และความแม่นยำ แล้วกดคำนวณ ค่าประมาณจะถูกเทียบกับค่าจริงให้ทันที"
          />
        </section>
      ) : (
        <div className="stack results-enter" key={runId}>
          <Readout
            description="ค่าประมาณจากผลต่างจำกัด เทียบกับอนุพันธ์จริงที่หาด้วยพีชคณิต"
            items={[
              { label: 'ค่าประมาณ', value: round(result.approximate) },
              result.exact !== null ? { label: 'ค่าจริง', value: round(result.exact) } : null,
              result.error !== null
                ? { label: 'ค่าความคลาดเคลื่อน', value: `${result.error.toFixed(6)} %` }
                : null,
            ].filter(Boolean)}
          />

          <ResultCard title="สูตรและการแทนค่า">
            <div className="overflow-x-auto">
              <BlockMath
                math={`f^{(${result.n})}(x) \\approx \\frac{${result.samples
                  .map((sample) => {
                    const sign = sample.weight >= 0 ? '+' : '-';
                    const magnitude = Math.abs(sample.weight) === 1 ? '' : Math.abs(sample.weight);
                    const shift =
                      sample.offset === 0
                        ? 'x'
                        : `x ${sample.offset > 0 ? '+' : '-'} ${Math.abs(sample.offset) === 1 ? '' : Math.abs(sample.offset)}h`;
                    return `${sign} ${magnitude}f(${shift})`;
                  })
                  .join(' ')
                  .replace(/^\+\s*/, '')}}{${denominator}}`}
              />
              <BlockMath
                math={`= \\frac{${round(result.numerator)}}{${result.formula.divisor === 1 ? '' : `${result.formula.divisor} \\cdot `}${round(result.h ** result.n)}} = ${round(result.approximate)}`}
              />
            </div>
          </ResultCard>

          <IterationTable
            title="ค่าฟังก์ชันที่แต่ละจุดตัวอย่าง"
            columns={[
              {
                key: 'offset',
                label: 'จุด',
                render: (row) =>
                  row.offset === 0 ? 'x' : `x ${row.offset > 0 ? '+' : '−'} ${Math.abs(row.offset)}h`,
              },
              { key: 'x', label: 'ค่า x', render: (row) => round(row.x) },
              { key: 'value', label: 'f(x)', render: (row) => row.value.toFixed(6) },
              { key: 'weight', label: 'น้ำหนัก', render: (row) => row.weight },
              {
                key: 'contribution',
                label: 'น้ำหนัก · f(x)',
                render: (row) => row.contribution.toFixed(6),
              },
            ]}
            rows={result.samples}
            markLast={false}
          />
        </div>
      )}
    </MethodShell>
  );
}
