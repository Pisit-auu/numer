'use client';
import dynamic from 'next/dynamic';
import { InlineMath } from 'react-katex';
import { findx } from '../../components/function';
import RootMethodPage from '../../components/RootMethodPage';

const MathGraph = dynamic(() => import('../../components/MathGraph'), { ssr: false });

const MAX_ITERATIONS = 200;

function solve({ fx, values: { xl, xr }, tolerance }) {
  if (xl >= xr) return { error: 'xl ต้องน้อยกว่า xr' };
  if (findx(fx, xl) * findx(fx, xr) > 0) {
    return { error: 'ช่วงนี้ไม่คร่อมราก — f(xl) × f(xr) ต้องน้อยกว่าศูนย์ ลองเปลี่ยนช่วง' };
  }

  const rows = [];
  let left = xl;
  let right = xr;
  let residual = 1;
  let i = 0;

  while (residual > tolerance && i < MAX_ITERATIONS) {
    const fLeft = findx(fx, left);
    const fRight = findx(fx, right);
    const xm = (fRight * left - fLeft * right) / (fRight - fLeft);
    const fMid = findx(fx, xm);
    if (fMid * fRight > 0) right = xm;
    else if (fMid * fRight < 0) left = xm;
    residual = Math.abs(fMid);
    rows.push({ xk: xm, result: fMid, error: residual * 100 });
    i += 1;
  }

  return {
    rows,
    graph: [...rows].sort((a, b) => a.xk - b.xk).map((row) => ({ x: row.xk, y: row.result })),
    warning:
      i >= MAX_ITERATIONS
        ? `หยุดที่ ${MAX_ITERATIONS} รอบเพราะยังไม่ลู่เข้าถึง tolerance ที่ตั้งไว้ ลองเพิ่มค่า tolerance หรือแคบช่วง [xl, xr] ลง`
        : '',
  };
}

export default function FalsePosition() {
  return (
    <RootMethodPage
      method="falseposition"
      problem="falseposition"
      solve={solve}
      Graph={MathGraph}
      answerLabel="ราก (xm)"
      graphDescription="ค่า xm ของแต่ละรอบเทียบกับ f(xm)"
      fields={[
        { key: 'xl', apiKey: 'xl', label: <InlineMath math="x_l" />, plain: 'xl', placeholder: '0' },
        { key: 'xr', apiKey: 'xr', label: <InlineMath math="x_r" />, plain: 'xr', placeholder: '2' },
      ]}
    />
  );
}
