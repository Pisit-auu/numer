'use client';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import IntegrationMethodPage from '../../components/IntegrationMethodPage';

const round = (value) => Number(Number(value).toFixed(6));

function solve({ a, b, f }) {
  const h = b - a;
  const fa = f(a);
  const fb = f(b);
  const value = (h / 2) * (fa + fb);

  return {
    value,
    steps: (
      <>
        <BlockMath math={`I = \\frac{h}{2}\\left(f(x_0) + f(x_1)\\right), \\quad h = x_1 - x_0`} />
        <BlockMath math={`h = ${round(b)} - ${round(a)} = ${round(h)}`} />
        <BlockMath math={`f(x_0) = f(${round(a)}) = ${round(fa)}`} />
        <BlockMath math={`f(x_1) = f(${round(b)}) = ${round(fb)}`} />
        <BlockMath math={`I = \\frac{${round(h)}}{2}\\left(${round(fa)} + ${round(fb)}\\right) = ${round(value)}`} />
      </>
    ),
  };
}

export default function Trapezoidal() {
  return (
    <IntegrationMethodPage
      method="trapezoidal"
      problem="Trapezoidal"
      solve={solve}
      stepsDescription="ใช้สี่เหลี่ยมคางหมูรูปเดียวคลุมทั้งช่วง"
    />
  );
}
