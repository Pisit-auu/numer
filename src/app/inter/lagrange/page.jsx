'use client';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import PointsMethodPage from '../../components/PointsMethodPage';

function solve({ X, Y, x0, n }) {
  if (new Set(X).size !== X.length) {
    return { error: 'ค่า X ต้องไม่ซ้ำกัน — ตัวส่วนของ L(x) จะเป็นศูนย์' };
  }

  /* Each basis polynomial Lᵢ is 1 at xᵢ and 0 at every other sample. */
  const rows = Array.from({ length: n }, (_, i) => {
    let numerator = 1;
    let denominator = 1;
    for (let j = 0; j < n; j += 1) {
      if (i !== j) {
        numerator *= X[j] - x0;
        denominator *= X[j] - X[i];
      }
    }
    const L = numerator / denominator;
    return { i, L, y: Y[i], term: L * Y[i] };
  });

  const value = rows.reduce((sum, row) => sum + row.term, 0);

  return {
    value,
    steps: (
      <div className="overflow-x-auto">
        <BlockMath
          math={`f(${x0}) = ${rows.map((row) => `L_{${row.i}}(${x0})\\,f(x_{${row.i}})`).join(' + ')}`}
        />
        <BlockMath
          math={`f(${x0}) = ${rows.map((row) => `(${Number(row.L.toFixed(6))})(${Number(row.y)})`).join(' + ')} = ${Number(value.toFixed(6))}`}
        />
      </div>
    ),
    iterations: rows,
    tableTitle: 'พหุนามฐาน Lᵢ',
    columns: [
      { key: 'i', label: 'i', render: (row) => row.i },
      { key: 'L', label: 'Lᵢ(x)', render: (row) => row.L.toFixed(6) },
      { key: 'y', label: 'f(xᵢ)', render: (row) => Number(row.y) },
      { key: 'term', label: 'Lᵢ · f(xᵢ)', render: (row) => row.term.toFixed(6) },
    ],
  };
}

export default function Lagrange() {
  return (
    <PointsMethodPage
      family="inter"
      method="lagrange"
      problem="Lagrange"
      resource="inter"
      solve={solve}
      stepsDescription="ถ่วงน้ำหนักทุกจุดข้อมูลด้วยพหุนามฐานของตัวเอง"
    />
  );
}
