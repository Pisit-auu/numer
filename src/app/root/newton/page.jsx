'use client';
import dynamic from 'next/dynamic';
import { derivative } from 'mathjs';
import { InlineMath } from 'react-katex';
import { findx } from '../../components/function';
import RootMethodPage from '../../components/RootMethodPage';

const Mathnewtonroot = dynamic(() => import('../../components/mathnewtonroot'), { ssr: false });

const MAX_ITERATIONS = 200;

function solve({ fx, values: { x0 }, tolerance }) {
  const dfx = derivative(fx, 'x').toString();

  const rows = [];
  let x = x0;
  let residual = 1;
  let i = 0;

  while (residual > tolerance && i < MAX_ITERATIONS) {
    const slope = findx(dfx, x);
    if (slope === 0) {
      return { error: "อนุพันธ์ f'(x) เป็นศูนย์ที่จุดนี้ วิธีนี้ไปต่อไม่ได้ ลองเปลี่ยนค่า x₀" };
    }
    const fValue = findx(fx, x);
    residual = Math.abs(fValue);
    rows.push({ xk: x, result: fValue, error: residual * 100 });
    x -= fValue / slope;
    i += 1;
  }

  return {
    rows,
    warning:
      i >= MAX_ITERATIONS
        ? `หยุดที่ ${MAX_ITERATIONS} รอบเพราะยังไม่ลู่เข้า ลองเปลี่ยนค่า x₀ ให้ใกล้รากมากขึ้น`
        : `อนุพันธ์ที่หาให้อัตโนมัติ: f'(x) = ${dfx}`,
  };
}

export default function Newton() {
  return (
    <RootMethodPage
      method="newton"
      problem="Newton"
      solve={solve}
      Graph={Mathnewtonroot}
      answerLabel="ราก"
      graphDescription="เส้นสัมผัสที่แต่ละรอบลากลงมาตัดแกน x"
      fields={[
        {
          key: 'x0',
          apiKey: 'xl',
          label: <InlineMath math="x_0" />,
          plain: 'x₀',
          hint: 'ค่าเริ่มต้น ยิ่งใกล้รากยิ่งลู่เข้าเร็ว',
          placeholder: '1',
        },
      ]}
    />
  );
}
