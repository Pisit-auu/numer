'use client';
import 'katex/dist/katex.min.css';
import LinearMethodPage from '../../components/LinearMethodPage';

const MAX_ITERATIONS = 500;

function solve({ A, B, x0, tolerance }) {
  const n = A.length;
  if (A.some((row, i) => row[i] === 0)) {
    return { error: 'มีค่าศูนย์บนแนวทแยงของ [A] — Jacobi หารด้วยค่านั้นไม่ได้ ลองสลับแถว' };
  }

  let X = [...x0];
  const rows = [{ x: [...x0], error: new Array(n).fill(0) }];
  let converged = false;
  let iteration = 0;

  while (!converged && iteration < MAX_ITERATIONS) {
    const next = new Array(n).fill(0);
    const errors = new Array(n).fill(0);
    converged = true;

    /* Jacobi uses only last round's values, so the whole vector updates at once. */
    for (let i = 0; i < n; i += 1) {
      next[i] = B[i];
      for (let j = 0; j < n; j += 1) if (i !== j) next[i] -= A[i][j] * X[j];
      next[i] /= A[i][i];
      errors[i] = Math.abs((next[i] - X[i]) / (next[i] || 1)) * 100;
      if (errors[i] > tolerance * 100) converged = false;
    }

    rows.push({ x: next, error: errors });
    X = next;
    iteration += 1;
  }

  const columns = [
    { key: 'i', label: 'รอบ', render: (_, i) => i },
    ...Array.from({ length: n }, (_, i) => ({
      key: `x${i}`,
      label: `x${i + 1}`,
      render: (row) => row.x[i].toFixed(6),
    })),
    {
      key: 'error',
      label: 'error สูงสุด (%)',
      render: (row) => Math.max(...row.error).toFixed(6),
    },
  ];

  return {
    x: X,
    iterations: rows,
    columns,
    warning:
      iteration >= MAX_ITERATIONS
        ? `หยุดที่ ${MAX_ITERATIONS} รอบเพราะยังไม่ลู่เข้า — Jacobi ต้องการเมทริกซ์ที่มีแนวทแยงเด่น`
        : '',
  };
}

export default function Jacobi() {
  return (
    <LinearMethodPage
      method="jacobi"
      problem="jacobi"
      solve={solve}
      needsX0
      needsTolerance
      iterationTitle="ค่าตัวแปรในแต่ละรอบ"
    />
  );
}
