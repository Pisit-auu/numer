'use client';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { findet } from '../../components/matrix';
import LinearMethodPage from '../../components/LinearMethodPage';

function solve({ A, B }) {
  const dets = findet(A, B);
  const detA = dets[0];

  if (detA === 0) {
    return { error: 'det(A) เป็นศูนย์ ระบบนี้ไม่มีคำตอบเดียว วิธี Cramer ใช้ไม่ได้' };
  }

  const x = dets.slice(1).map((det) => det / detA);

  return {
    x,
    steps: (
      <div className="grid gap-3 overflow-x-auto">
        <BlockMath math={`x_i = \\frac{\\det(A_i)}{\\det(A)}`} />
        <BlockMath math={`\\det(A) = ${detA}`} />
        {x.map((value, i) => (
          <BlockMath
            key={i}
            math={`x_{${i + 1}} = \\frac{\\det(A_{${i + 1}})}{\\det(A)} = \\frac{${dets[i + 1]}}{${detA}} = ${Number(value.toFixed(6))}`}
          />
        ))}
      </div>
    ),
  };
}

export default function Cramer() {
  return (
    <LinearMethodPage
      method="cramer"
      problem="Cramer"
      solve={solve}
      stepsDescription="แทนคอลัมน์ที่ i ของ [A] ด้วย {B} แล้วหาอัตราส่วนดีเทอร์มิแนนต์"
    />
  );
}
