'use client';
import dynamic from 'next/dynamic';
import { InlineMath } from 'react-katex';
import { findx } from '../../components/function';
import RootMethodPage from '../../components/RootMethodPage';

const MathGraphmanypoint = dynamic(() => import('../../components/mathonepoint'), { ssr: false });

const MAX_ITERATIONS = 100;

/* The function entered here is g(x) from x = g(x), not f(x) = 0. */
function solve({ fx, values: { x0 }, tolerance }) {
  const rows = [];
  let x = x0;
  let residual = 1;
  let i = 0;

  while (residual > tolerance && i < MAX_ITERATIONS) {
    const next = findx(fx, x);
    if (!Number.isFinite(next)) {
      return { error: 'ค่าลู่ออก — g(x) พาค่าไปหาอนันต์ ลองจัดรูป g(x) ใหม่หรือเปลี่ยนค่า x₀' };
    }
    residual = Math.abs((next - x) / (next || 1));
    rows.push({ xk: x, result: next, error: residual * 100 });
    x = next;
    i += 1;
  }

  return {
    rows,
    graph: [...rows].sort((a, b) => a.xk - b.xk).map((row) => ({ x: row.xk, y: row.result })),
    warning:
      i >= MAX_ITERATIONS
        ? `หยุดที่ ${MAX_ITERATIONS} รอบ — g(x) รูปนี้อาจไม่ลู่เข้า ลองจัดรูป x = g(x) แบบอื่น`
        : '',
  };
}

export default function OnePoint() {
  return (
    <RootMethodPage
      method="onepoint"
      problem="onepoint"
      solve={solve}
      Graph={MathGraphmanypoint}
      answerLabel="ราก"
      functionLabel={<InlineMath math="g(x)" />}
      functionHint="จัดสมการเป็น x = g(x) ก่อน แล้วกรอกเฉพาะฝั่ง g(x)"
      functionPlaceholder="sqrt(x + 2)"
      graphTitle="กราฟ g(x) เทียบกับ y = x"
      graphDescription="จุดที่เส้นทั้งสองตัดกันคือจุดตรึงของ g(x)"
      fields={[
        {
          key: 'x0',
          apiKey: 'xl',
          label: <InlineMath math="x_0" />,
          plain: 'x₀',
          hint: 'ค่าเริ่มต้นของการวนซ้ำ',
          placeholder: '1',
        },
      ]}
    />
  );
}
