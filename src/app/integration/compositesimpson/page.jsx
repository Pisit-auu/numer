'use client';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import IntegrationMethodPage from '../../components/IntegrationMethodPage';

const round = (value) => Number(Number(value).toFixed(6));

function solve({ a, b, n, f }) {
  if (n % 2 !== 0) {
    return { error: 'Composite Simpson ต้องใช้จำนวนช่วง n ที่เป็นเลขคู่' };
  }

  const h = (b - a) / n;
  const points = Array.from({ length: n + 1 }, (_, i) => {
    const x = a + i * h;
    let weight = 2;
    if (i === 0 || i === n) weight = 1;
    else if (i % 2 === 1) weight = 4;
    const y = f(x);
    return { i, x, y, weight, contribution: weight * y };
  });

  const total = points.reduce((sum, point) => sum + point.contribution, 0);
  const value = (h / 3) * total;

  return {
    value,
    steps: (
      <>
        <BlockMath math={`I = \\frac{h}{3}\\left(f(x_0) + 4\\sum_{i\\ \\text{odd}} f(x_i) + 2\\sum_{i\\ \\text{even}} f(x_i) + f(x_n)\\right)`} />
        <BlockMath math={`h = \\frac{${round(b)} - ${round(a)}}{${n}} = ${round(h)}`} />
        <BlockMath math={`I = \\frac{${round(h)}}{3}\\left(${round(total)}\\right) = ${round(value)}`} />
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

export default function CompositeSimpson() {
  return (
    <IntegrationMethodPage
      method="compositesimpson"
      problem="Composite Simpson"
      solve={solve}
      needsN
      nHint="ต้องเป็นเลขคู่ เพราะจับคู่ช่วงละพาราโบลา"
      stepsDescription="ซอยช่วงเป็นคู่ ๆ แล้วรวมพาราโบลาทุกคู่ช่วง"
    />
  );
}
