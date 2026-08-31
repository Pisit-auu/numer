'use client';
import dynamic from 'next/dynamic';
import { InlineMath } from 'react-katex';
import { findx } from '../../components/function';
import RootMethodPage from '../../components/RootMethodPage';

const MathGraph = dynamic(() => import('../../components/MathGraph'), { ssr: false });

/* Without a cap a non-converging f(x) would spin the tab forever. */
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
    const mid = (left + right) / 2;
    const fMid = findx(fx, mid);
    if (fMid * findx(fx, right) > 0) right = mid;
    else if (fMid * findx(fx, right) < 0) left = mid;
    residual = Math.abs(fMid);
    rows.push({ xk: mid, result: fMid, error: residual * 100 });
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

export default function Bisection() {
  return (
    <RootMethodPage
      method="bisection"
      problem="bisection"
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
