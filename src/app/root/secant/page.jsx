'use client';
import dynamic from 'next/dynamic';
import { InlineMath } from 'react-katex';
import { findx } from '../../components/function';
import RootMethodPage from '../../components/RootMethodPage';

const Mathsecant = dynamic(() => import('../../components/mathsecant'), { ssr: false });

const MAX_ITERATIONS = 200;

function solve({ fx, values: { x0, x1 }, tolerance }) {
  const rows = [];
  let previous = x0;
  let current = x1;
  let residual = 1;
  let i = 0;

  while (residual > tolerance && i < MAX_ITERATIONS) {
    const fPrevious = findx(fx, previous);
    const fCurrent = findx(fx, current);
    if (fCurrent - fPrevious === 0) {
      return { error: 'f(x₁) − f(x₀) เป็นศูนย์ เส้นตัดขนานแกน x ลองเปลี่ยนค่าเริ่มต้นทั้งสอง' };
    }
    const next = current - (fCurrent * (current - previous)) / (fCurrent - fPrevious);
    const fNext = findx(fx, next);
    residual = Math.abs(fNext);
    rows.push({ xk: next, result: fNext, error: residual * 100 });
    previous = current;
    current = next;
    i += 1;
  }

  return {
    rows,
    warning:
      i >= MAX_ITERATIONS
        ? `หยุดที่ ${MAX_ITERATIONS} รอบเพราะยังไม่ลู่เข้า ลองเปลี่ยนค่า x₀ และ x₁ ให้ใกล้รากมากขึ้น`
        : '',
  };
}

export default function Secant() {
  return (
    <RootMethodPage
      method="secant"
      problem="Secant"
      solve={solve}
      Graph={Mathsecant}
      answerLabel="ราก"
      graphDescription="เส้นตัดที่แต่ละรอบลากผ่านสองจุดล่าสุด"
      fields={[
        {
          key: 'x0',
          apiKey: 'xl',
          label: <InlineMath math="x_0" />,
          plain: 'x₀',
          placeholder: '1',
        },
        {
          key: 'x1',
          apiKey: 'xr',
          label: <InlineMath math="x_1" />,
          plain: 'x₁',
          placeholder: '3',
        },
      ]}
    />
  );
}
