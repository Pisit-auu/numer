'use client';
import 'katex/dist/katex.min.css';
import { insertB } from '../../components/matrix';
import LinearMethodPage from '../../components/LinearMethodPage';
import MatrixSteps from '../../components/ui/MatrixSteps';

function backSubstitute(M) {
  const n = M.length;
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i -= 1) {
    if (M[i][i] === 0) return null;
    x[i] = M[i][n];
    for (let k = i + 1; k < n; k += 1) x[i] -= M[i][k] * x[k];
    x[i] /= M[i][i];
  }
  return x;
}

function solve({ A, B }) {
  const M = insertB(A, B);
  const n = M.length;
  const steps = [M.map((row) => [...row])];

  for (let i = 0; i < n; i += 1) {
    if (M[i][i] === 0) {
      const swap = M.findIndex((row, r) => r > i && row[i] !== 0);
      if (swap > -1) {
        [M[i], M[swap]] = [M[swap], M[i]];
        steps.push(M.map((row) => [...row]));
      }
    }
    for (let j = i + 1; j < n; j += 1) {
      if (M[i][i] !== 0) {
        const factor = M[j][i] / M[i][i];
        for (let k = i; k < n + 1; k += 1) M[j][k] -= factor * M[i][k];
        steps.push(M.map((row) => [...row]));
      }
    }
  }

  const x = backSubstitute(M);
  if (!x) {
    return { error: 'เกิดการหารด้วยศูนย์ระหว่างแทนค่าย้อนกลับ — เมทริกซ์นี้เป็นเอกฐาน' };
  }

  return { x, steps: <MatrixSteps steps={steps} /> };
}

export default function GaussElimination() {
  return (
    <LinearMethodPage
      method="eliminate"
      problem="Gauss Elimination"
      solve={solve}
      stepsTitle="ขั้นตอนการกำจัดตัวแปร"
      stepsDescription="เมทริกซ์เสริม [A|B] หลังทุกครั้งที่ลดรูปแถว จนได้สามเหลี่ยมบน"
    />
  );
}
