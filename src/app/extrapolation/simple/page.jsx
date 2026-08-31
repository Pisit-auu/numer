'use client';
import dynamic from 'next/dynamic';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import PointsMethodPage from '../../components/PointsMethodPage';

const Mathsimple = dynamic(() => import('../../components/mathsimple'), { ssr: false });

const round = (value) => Number(Number(value).toFixed(6));

/** Gaussian elimination with partial pivoting on an augmented matrix. */
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

function solve({ X, Y, x0, n, extra }) {
  const m = parseInt(extra.m, 10);
  if (!Number.isInteger(m) || m < 1) return { error: 'ดีกรีของพหุนาม m ต้องเป็นจำนวนเต็มตั้งแต่ 1' };
  if (m >= n) return { error: `ดีกรี ${m} ต้องใช้จุดข้อมูลอย่างน้อย ${m + 1} จุด` };

  /* Normal equations: Σxⁱ⁺ʲ · aⱼ = Σxⁱ·y, for i = 0…m. */
  const sumX = (power) => X.reduce((sum, x) => sum + x ** power, 0);
  const sumXY = (power) => X.reduce((sum, x, i) => sum + x ** power * Y[i], 0);

  const system = Array.from({ length: m + 1 }, (_, i) => [
    ...Array.from({ length: m + 1 }, (_, j) => sumX(i + j)),
    sumXY(i),
  ]);

  const a = solveSystem(system);
  if (!a) return { error: 'ระบบสมการปกติแก้ไม่ได้ — ลองลดดีกรี m หรือเพิ่มจุดข้อมูลที่หลากหลายกว่านี้' };

  const evaluateAt = (x) => a.reduce((sum, coefficient, i) => sum + coefficient * x ** i, 0);
  const value = evaluateAt(x0);

  const equation = a
    .map((coefficient, i) => {
      if (i === 0) return `${round(coefficient)}`;
      if (i === 1) return `${round(coefficient)}x`;
      return `${round(coefficient)}x^{${i}}`;
    })
    .join(' + ');

  /* Sample the fitted curve densely so the graph shows a curve, not a polyline. */
  const min = Math.min(...X);
  const max = Math.max(...X);
  const curve = Array.from({ length: 60 }, (_, i) => {
    const x = min + ((max - min) * i) / 59;
    return { x, y: evaluateAt(x) };
  });

  return {
    value,
    valueLabel: `ค่าที่ทำนายที่ x = ${x0}`,
    graph: { dataPoints: curve, xtrue: x0, ytrue: value },
    steps: (
      <div className="overflow-x-auto">
        <BlockMath math={`f(x) = ${equation}`} />
        <BlockMath math={`f(${x0}) = ${round(value)}`} />
      </div>
    ),
    iterations: a.map((coefficient, i) => ({ i, coefficient })),
    tableTitle: 'สัมประสิทธิ์ของพหุนาม',
    columns: [
      { key: 'i', label: 'พจน์', render: (row) => `a${row.i}` },
      { key: 'coefficient', label: 'ค่า', render: (row) => row.coefficient.toFixed(6) },
    ],
  };
}

export default function SimpleRegression() {
  return (
    <PointsMethodPage
      family="extrapolation"
      method="simple"
      problem="Simple Regression"
      resource="simple"
      solve={solve}
      Graph={Mathsimple}
      targetLabel="ค่า x ที่ต้องการทำนาย"
      targetKey="xvalue"
      graphTitle="เส้นถดถอยและจุดข้อมูล"
      graphDescription="เส้นที่พอดีที่สุดกับจุดข้อมูล พร้อมค่าที่ทำนายไว้"
      extraFields={[
        {
          key: 'm',
          label: 'ดีกรีของพหุนาม (m)',
          default: '1',
          hint: 'm = 1 คือเส้นตรง, m = 2 คือพาราโบลา',
          placeholder: '1',
        },
      ]}
      buildPayload={({ x0, extra }) => ({
        xvalue: Math.round(x0),
        m: parseInt(extra.m, 10) || 1,
      })}
      stepsDescription="พหุนามที่ได้จากการแก้ระบบสมการปกติ"
    />
  );
}
