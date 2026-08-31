'use client';
import 'katex/dist/katex.min.css';
import {
  findr,
  findd0,
  findlamda,
  findxconju,
  finderror,
  finda0,
  findd,
} from '../../components/matrix';
import LinearMethodPage from '../../components/LinearMethodPage';

const MAX_ITERATIONS = 500;

function solve({ A, B, x0, tolerance }) {
  const n = A.length;
  const symmetric = A.every((row, i) => row.every((value, j) => value === A[j][i]));
  if (!symmetric) {
    return { error: 'Conjugate Gradient ต้องใช้กับเมทริกซ์สมมาตรเท่านั้น' };
  }

  let x = [...x0];
  let r = findr(A, B, x);
  let d = findd0(r);
  let residual = finderror(r);
  const rows = [];
  let iteration = 0;

  while (residual > tolerance && iteration < MAX_ITERATIONS) {
    const lambda = findlamda(d, r, A);
    if (!Number.isFinite(lambda)) {
      return { error: 'คำนวณ λ ไม่ได้ — ทิศทางค้นหาเป็นศูนย์ ลองเปลี่ยนค่าเริ่มต้น {x₀}' };
    }
    x = findxconju(x, lambda, d);
    r = findr(A, B, x);
    residual = finderror(r);
    rows.push({ lambda, x: [...x], r: [...r], error: residual });
    d = findd(r, finda0(r, A, d), d);
    iteration += 1;
  }

  const columns = [
    { key: 'i', label: 'รอบ', render: (_, i) => i + 1 },
    { key: 'lambda', label: 'λ', render: (row) => row.lambda.toFixed(6) },
    ...Array.from({ length: n }, (_, i) => ({
      key: `x${i}`,
      label: `x${i + 1}`,
      render: (row) => row.x[i].toFixed(6),
    })),
    { key: 'error', label: '‖r‖', render: (row) => row.error.toExponential(3) },
  ];

  return {
    x,
    iterations: rows,
    columns,
    warning:
      iteration >= MAX_ITERATIONS
        ? `หยุดที่ ${MAX_ITERATIONS} รอบเพราะยังไม่ลู่เข้า — ตรวจว่าเมทริกซ์เป็น positive definite`
        : '',
  };
}

export default function ConjugateGradient() {
  return (
    <LinearMethodPage
      method="conjugate"
      problem="Conjugate"
      solve={solve}
      needsX0
      needsTolerance
      iterationTitle="ค่าตัวแปรและขนาดเศษเหลือในแต่ละรอบ"
    />
  );
}
