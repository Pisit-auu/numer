'use client';
import dynamic from 'next/dynamic';
import { InlineMath } from 'react-katex';
import { findx } from '../../components/function';
import RootMethodPage from '../../components/RootMethodPage';

const MathGraph = dynamic(() => import('../../components/MathGraph'), { ssr: false });

const MAX_REFINEMENTS = 12;

/**
 * Sweeps the interval at a coarse step, narrows to the sub-interval where the
 * sign flips, then repeats ten times finer — the way you would read a root off
 * a plotted curve, zooming each time.
 */
function solve({ fx, values: { xl, xr }, tolerance }) {
  if (xl >= xr) return { error: 'xl ต้องน้อยกว่า xr' };

  const rows = [];
  let step = 1;
  let left = xl;
  let right = xr;
  let found = false;
  let refinements = 0;

  while (!found && refinements < MAX_REFINEMENTS) {
    let bracketed = false;
    for (let x = left; x < right; x += step) {
      const fCurrent = findx(fx, x);
      const fNext = findx(fx, x + step);
      rows.push({ xk: x, result: fCurrent, error: Math.abs(fCurrent) * 100 });

      if (Math.abs(fCurrent) < tolerance) {
        found = true;
        break;
      }
      if (fCurrent * fNext < 0) {
        left = x;
        right = x + step;
        bracketed = true;
        break;
      }
    }
    if (found) break;
    if (!bracketed) {
      return {
        error: 'ไม่พบการเปลี่ยนเครื่องหมายในช่วงนี้ ลองขยายช่วง [xl, xr] ให้กว้างขึ้น',
      };
    }
    step *= 0.1;
    refinements += 1;
  }

  if (rows.length === 0) return { error: 'ไม่พบรากในช่วงนี้ ลองเปลี่ยนช่วง [xl, xr]' };

  return {
    rows,
    graph: [...rows].sort((a, b) => a.xk - b.xk).map((row) => ({ x: row.xk, y: row.result })),
    warning: found
      ? ''
      : `ซอยช่วงลง ${MAX_REFINEMENTS} ครั้งแล้วยังไม่ถึง tolerance ที่ตั้งไว้ ค่าที่ได้เป็นค่าประมาณที่ดีที่สุดจากการกวาด`,
  };
}

export default function Graphical() {
  return (
    <RootMethodPage
      method="graphical"
      problem="graphical"
      solve={solve}
      Graph={MathGraph}
      answerLabel="ราก โดยประมาณ"
      graphTitle="กราฟของฟังก์ชัน"
      graphDescription="ค่าที่กวาดได้ในช่วง [xl, xr] — จุดตัดแกน x คือราก"
      fields={[
        { key: 'xl', apiKey: 'xl', label: <InlineMath math="x_l" />, plain: 'xl', placeholder: '0' },
        { key: 'xr', apiKey: 'xr', label: <InlineMath math="x_r" />, plain: 'xr', placeholder: '10' },
      ]}
    />
  );
}
