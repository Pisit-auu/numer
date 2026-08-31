'use client';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import IntegrationMethodPage from '../../components/IntegrationMethodPage';

const round = (value) => Number(Number(value).toFixed(6));

function solve({ a, b, n, f }) {
  const h = (b - a) / n;
  const points = Array.from({ length: n + 1 }, (_, i) => {
    const x = a + i * h;
    const weight = i === 0 || i === n ? 1 : 2;
    const y = f(x);
    return { i, x, y, weight, contribution: weight * y };
  });

  const total = points.reduce((sum, point) => sum + point.contribution, 0);
  const value = (h / 2) * total;

  return {
    value,
    steps: (
      <>
        <BlockMath math={`I = \\frac{h}{2}\\left(f(x_0) + 2\\sum_{i=1}^{n-1} f(x_i) + f(x_n)\\right)`} />
        <BlockMath math={`h = \\frac{${round(b)} - ${round(a)}}{${n}} = ${round(h)}`} />
        <BlockMath math={`I = \\frac{${round(h)}}{2}\\left(${round(total)}\\right) = ${round(value)}`} />
      </>
    ),
    iterations: points,
    columns: [
      { key: 'i', label: 'i', render: (row) => row.i },
      { key: 'x', label: 'xᵢ', render: (row) => round(row.x) },
      { key: 'y', label: 'f(xᵢ)', render: (row) => row.y.toFixed(6) },
      { key: 'weight', label: 'น้ำหนัก', render: (row) => row.weight },
      { key: 'contribution', label: 'น้ำหนัก · f(xᵢ)', render: (row) => row.contribution.toFixed(6) },
    ],
  };
}

export default function CompositeTrapezoidal() {
  return (
    <IntegrationMethodPage
      method="composite"
      problem="Composite Trapezoidal"
      solve={solve}
      needsN
      nHint="ยิ่ง n มาก ยิ่งแม่นยำ"
      stepsDescription="ซอยช่วงเป็น n ส่วนเท่ากันแล้วรวมพื้นที่คางหมูทุกชิ้น"
    />
  );
}
