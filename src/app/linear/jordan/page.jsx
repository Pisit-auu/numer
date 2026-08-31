'use client';
import 'katex/dist/katex.min.css';
import { insertB } from '../../components/matrix';
import LinearMethodPage from '../../components/LinearMethodPage';
import MatrixSteps from '../../components/ui/MatrixSteps';

function solve({ A, B }) {
  const M = insertB(A, B);
  const n = M.length;
  const steps = [M.map((row) => [...row])];

  /* Forward: down to an upper triangle. */
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (M[i][i] !== 0) {
        const factor = M[j][i] / M[i][i];
        for (let k = i; k < n + 1; k += 1) M[j][k] -= factor * M[i][k];
        steps.push(M.map((row) => [...row]));
      }
    }
  }

  /* Backward: clear above the diagonal too. */
  for (let i = n - 1; i > 0; i -= 1) {
    if (M[i][i] === 0) {
      return { error: 'เกิดการหารด้วยศูนย์บนแนวทแยง — เมทริกซ์นี้เป็นเอกฐาน' };
    }
    for (let j = i - 1; j >= 0; j -= 1) {
      const factor = M[j][i] / M[i][i];
      for (let k = i; k < n + 1; k += 1) M[j][k] -= factor * M[i][k];
      steps.push(M.map((row) => [...row]));
    }
  }

  /* Normalise the diagonal to 1 so {x} can be read straight off. */
  for (let i = 0; i < n; i += 1) {
    const pivot = M[i][i];
    if (pivot === 0) {
      return { error: 'เกิดการหารด้วยศูนย์บนแนวทแยง — เมทริกซ์นี้เป็นเอกฐาน' };
    }
    for (let j = 0; j < n + 1; j += 1) M[i][j] /= pivot;
  }
  steps.push(M.map((row) => [...row]));

  return { x: M.map((row) => row[n]), steps: <MatrixSteps steps={steps} /> };
}

export default function GaussJordan() {
  return (
    <LinearMethodPage
      method="jordan"
      problem="Jordan"
      solve={solve}
      stepsTitle="ขั้นตอนการกำจัดตัวแปร"
      stepsDescription="เมทริกซ์เสริม [A|B] จนกลายเป็นเมทริกซ์เอกลักษณ์ คอลัมน์สุดท้ายคือคำตอบ"
    />
  );
}
