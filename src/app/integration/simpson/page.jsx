'use client';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import IntegrationMethodPage from '../../components/IntegrationMethodPage';

const round = (value) => Number(Number(value).toFixed(6));

function solve({ a, b, f }) {
  const h = (b - a) / 2;
  const mid = a + h;
  const f0 = f(a);
  const f1 = f(mid);
  const f2 = f(b);
  const value = (h / 3) * (f0 + 4 * f1 + f2);

  return {
    value,
    steps: (
      <>
        <BlockMath math={`I = \\frac{h}{3}\\left(f(x_0) + 4f(x_1) + f(x_2)\\right), \\quad h = \\frac{b - a}{2}`} />
        <BlockMath math={`h = \\frac{${round(b)} - ${round(a)}}{2} = ${round(h)}`} />
        <BlockMath math={`f(x_0) = f(${round(a)}) = ${round(f0)}`} />
        <BlockMath math={`f(x_1) = f(${round(mid)}) = ${round(f1)}`} />
        <BlockMath math={`f(x_2) = f(${round(b)}) = ${round(f2)}`} />
        <BlockMath math={`I = \\frac{${round(h)}}{3}\\left(${round(f0)} + 4(${round(f1)}) + ${round(f2)}\\right) = ${round(value)}`} />
      </>
    ),
  };
}

export default function Simpson() {
  return (
    <IntegrationMethodPage
      method="simpson"
      problem="Simpson"
      solve={solve}
      stepsDescription="ใช้พาราโบลาเส้นเดียวผ่านสามจุดคลุมทั้งช่วง"
    />
  );
}
