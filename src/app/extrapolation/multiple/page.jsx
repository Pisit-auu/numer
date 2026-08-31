'use client';
import { useEffect, useId, useState } from 'react';
import axios from 'axios';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import MethodShell from '../../components/MethodShell';
import Select from '../../components/ui/Select';
import Field from '../../components/ui/Field';
import Alert from '../../components/ui/Alert';
import ResultCard from '../../components/ui/ResultCard';
import Readout from '../../components/ui/Readout';
import IterationTable from '../../components/ui/IterationTable';
import EmptyState from '../../components/ui/EmptyState';
import { Play, Slope } from '../../components/ui/Icons';

const MAX_POINTS = 20;
const MAX_VARIABLES = 6;
const round = (value) => Number(Number(value).toFixed(6));

function solveSystem(M) {
  const n = M.length;
  for (let i = 0; i < n; i += 1) {
    let pivot = i;
    for (let r = i + 1; r < n; r += 1) if (Math.abs(M[r][i]) > Math.abs(M[pivot][i])) pivot = r;
    if (Math.abs(M[pivot][i]) < 1e-12) return null;
    [M[i], M[pivot]] = [M[pivot], M[i]];
    for (let r = i + 1; r < n; r += 1) {
      const factor = M[r][i] / M[i][i];
      for (let c = i; c <= n; c += 1) M[r][c] -= factor * M[i][c];
    }
  }
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i -= 1) {
    x[i] = M[i][n];
    for (let j = i + 1; j < n; j += 1) x[i] -= M[i][j] * x[j];
    x[i] /= M[i][i];
  }
  return x;
}

export default function MultipleRegression() {
  const [pointCount, setPointCount] = useState('');
  const [variableCount, setVariableCount] = useState('2');
  const [X, setX] = useState([]);
  const [Y, setY] = useState([]);
  const [query, setQuery] = useState([]);
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState([]);
  const [error, setError] = useState('');
  const [runId, setRunId] = useState(0);
  const formId = useId();

  const points = parseInt(pointCount, 10);
  const variables = parseInt(variableCount, 10);

  useEffect(() => {
    if (!Number.isInteger(points) || points < 1 || !Number.isInteger(variables) || variables < 1) {
      setX([]);
      setY([]);
      setQuery([]);
      return;
    }
    setX(Array.from({ length: points }, () => Array.from({ length: variables }, () => 0)));
    setY(Array.from({ length: points }, () => 0));
    setQuery(Array.from({ length: variables }, () => 0));
    setResult(null);
  }, [points, variables]);

  const fetchSaved = async () => {
    try {
      const { data } = await axios.get('/api/multiple');
      setSaved(
        data.map((row) => ({
          value: row.id,
          label: `${row.point} จุด${row.Date ? ` · ${row.Date}` : ''}`,
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
      const { data } = await axios.get(`/api/multiple/${id}`);
      const rows = Array.isArray(data.X) ? data.X : [];
      const width = Array.isArray(rows[0]) ? rows[0].length : 1;
      setPointCount(String(data.point));
      setVariableCount(String(width));
      setTimeout(() => {
        setX(rows);
        setY(data.Y);
        if (Array.isArray(data.xi)) setQuery(data.xi);
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

  const changeX = (i, j, value) =>
    setX((current) =>
      current.map((row, ri) => (ri === i ? row.map((cell, ci) => (ci === j ? number(value) : cell)) : row))
    );
  const changeY = (i, value) => setY((current) => current.map((v, ci) => (ci === i ? number(value) : v)));
  const changeQuery = (j, value) =>
    setQuery((current) => current.map((v, ci) => (ci === j ? number(value) : v)));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!Number.isInteger(points) || points < 2) {
      setError('ต้องมีจุดข้อมูลอย่างน้อย 2 จุด');
      return;
    }
    if (points > MAX_POINTS) {
      setError(`รองรับสูงสุด ${MAX_POINTS} จุด`);
      return;
    }
    if (!Number.isInteger(variables) || variables < 1 || variables > MAX_VARIABLES) {
      setError(`จำนวนตัวแปรต้นต้องอยู่ระหว่าง 1 ถึง ${MAX_VARIABLES}`);
      return;
    }
    if (points < variables + 1) {
      setError(`ตัวแปรต้น ${variables} ตัว ต้องใช้จุดข้อมูลอย่างน้อย ${variables + 1} จุด`);
      return;
    }

    /* Normal equations for y = a₀ + a₁x₁ + … + aₖxₖ, with a leading 1 column. */
    const design = X.map((row) => [1, ...row]);
    const width = variables + 1;
    const system = Array.from({ length: width }, (_, i) => [
      ...Array.from({ length: width }, (_, j) =>
        design.reduce((sum, row) => sum + row[i] * row[j], 0)
      ),
      design.reduce((sum, row, r) => sum + row[i] * Y[r], 0),
    ]);

    const a = solveSystem(system);
    if (!a) {
      setError('ระบบสมการปกติแก้ไม่ได้ — ตัวแปรต้นอาจสัมพันธ์เชิงเส้นกันเอง ลองเพิ่มข้อมูลที่หลากหลายกว่านี้');
      setResult(null);
      return;
    }

    const predicted = a[0] + query.reduce((sum, value, j) => sum + a[j + 1] * value, 0);

    setRunId((id) => id + 1);
    setResult({
      coefficients: a,
      predicted,
      residuals: Y.map((y, i) => {
        const fitted = a[0] + X[i].reduce((sum, value, j) => sum + a[j + 1] * value, 0);
        return { i, y, fitted, residual: y - fitted };
      }),
    });

    try {
      await axios.post('/api/multiple', {
        proublem: 'Multiple Regression',
        point: points,
        xvalue: variables,
        X,
        Y,
        xi: query,
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

  const equation =
    result &&
    `y = ${round(result.coefficients[0])}${result.coefficients
      .slice(1)
      .map((coefficient, j) => ` ${coefficient >= 0 ? '+' : '-'} ${Math.abs(round(coefficient))}x_{${j + 1}}`)
      .join('')}`;

  return (
    <MethodShell
      family="extrapolation"
      method="multiple"
      aside={
        <>
          <ResultCard title="พารามิเตอร์">
            <form id={formId} onSubmit={handleSubmit} className="form-grid">
              <div className="form-grid form-grid--2">
                <Field label="จำนวนจุดข้อมูล" hint={`สูงสุด ${MAX_POINTS}`}>
                  {(props) => (
                    <input
                      {...props}
                      type="number"
                      min="2"
                      max={MAX_POINTS}
                      className="input input--mono"
                      value={pointCount}
                      onChange={(e) => setPointCount(e.target.value)}
                      placeholder="5"
                    />
                  )}
                </Field>
                <Field label="ตัวแปรต้น (k)" hint={`สูงสุด ${MAX_VARIABLES}`}>
                  {(props) => (
                    <input
                      {...props}
                      type="number"
                      min="1"
                      max={MAX_VARIABLES}
                      className="input input--mono"
                      value={variableCount}
                      onChange={(e) => setVariableCount(e.target.value)}
                    />
                  )}
                </Field>
              </div>

              {query.length > 0 && (
                <fieldset className="field">
                  <legend className="field__label">ค่าที่ต้องการทำนาย</legend>
                  <div className="form-grid form-grid--2">
                    {query.map((value, j) => (
                      <label key={j} className="field">
                        <span className="field__hint">{`x${j + 1}`}</span>
                        <input
                          type="number"
                          step="any"
                          className="input input--sm input--mono"
                          value={value}
                          onChange={(e) => changeQuery(j, e.target.value)}
                        />
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

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
            icon={Slope}
            title="เริ่มจากกำหนดขนาดข้อมูล"
            description="กรอกจำนวนจุดและจำนวนตัวแปรต้นในการ์ดพารามิเตอร์ ตารางกรอกข้อมูลจะขึ้นตรงนี้"
          />
        </section>
      ) : (
        <section className="card">
          <header className="card__header">
            <div>
              <h2 className="card__title">จุดข้อมูล</h2>
              <p className="card__desc">{`${points} จุด · ตัวแปรต้น ${variables} ตัว`}</p>
            </div>
          </header>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  {Array.from({ length: variables }, (_, j) => (
                    <th key={j} scope="col">{`x${j + 1}`}</th>
                  ))}
                  <th scope="col">y</th>
                </tr>
              </thead>
              <tbody>
                {X.map((row, i) => (
                  <tr key={i}>
                    <td data-index="">{i + 1}</td>
                    {row.map((value, j) => (
                      <td key={j}>
                        <input
                          type="number"
                          step="any"
                          className="input input--sm input--mono !h-8 w-24"
                          value={value}
                          aria-label={`x${j + 1} จุดที่ ${i + 1}`}
                          onChange={(e) => changeX(i, j, e.target.value)}
                        />
                      </td>
                    ))}
                    <td>
                      <input
                        type="number"
                        step="any"
                        className="input input--sm input--mono !h-8 w-24"
                        value={Y[i]}
                        aria-label={`y จุดที่ ${i + 1}`}
                        onChange={(e) => changeY(i, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

      {X.length === 0 && error && <Alert variant="error">{error}</Alert>}

      {result && (
        <div className="stack results-enter" key={runId}>
          <Readout
            description={`ทำนายที่ (${query.map((value) => round(value)).join(', ')})`}
            items={[{ label: 'ค่าที่ทำนาย ŷ', value: round(result.predicted) }]}
          />

          <ResultCard
            title="สมการถดถอย"
            description="สัมประสิทธิ์ที่ได้จากการแก้ระบบสมการปกติ"
          >
            <div className="overflow-x-auto">
              <BlockMath math={equation} />
            </div>
          </ResultCard>

          <IterationTable
            title="ค่าที่ฟิตได้เทียบกับค่าจริง"
            columns={[
              { key: 'i', label: '#', render: (row) => row.i + 1 },
              { key: 'y', label: 'y จริง', render: (row) => round(row.y) },
              { key: 'fitted', label: 'ŷ ที่ฟิตได้', render: (row) => row.fitted.toFixed(6) },
              { key: 'residual', label: 'เศษเหลือ', render: (row) => row.residual.toFixed(6) },
            ]}
            rows={result.residuals}
            markLast={false}
          />
        </div>
      )}
    </MethodShell>
  );
}
