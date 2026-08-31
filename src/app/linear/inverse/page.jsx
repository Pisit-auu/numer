'use client';
import 'katex/dist/katex.min.css';
import LinearMethodPage from '../../components/LinearMethodPage';
import MatrixSteps, { Matrix } from '../../components/ui/MatrixSteps';

function solve({ A, B }) {
  const n = A.length;

  /* Augment with the identity: [A | I] reduces to [I | A⁻¹]. */
  const M = A.map((row, i) => [...row, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  const width = 2 * n;
  const steps = [M.map((row) => [...row])];

  for (let i = 0; i < n; i += 1) {
    if (M[i][i] === 0) {
      const swap = M.findIndex((row, r) => r > i && row[i] !== 0);
      if (swap === -1) return { error: 'เมทริกซ์นี้เป็นเอกฐาน หาอินเวอร์สไม่ได้' };
      [M[i], M[swap]] = [M[swap], M[i]];
      steps.push(M.map((row) => [...row]));
    }
    for (let j = i + 1; j < n; j += 1) {
      const factor = M[j][i] / M[i][i];
      for (let k = i; k < width; k += 1) M[j][k] -= factor * M[i][k];
      steps.push(M.map((row) => [...row]));
    }
  }

  for (let i = n - 1; i > 0; i -= 1) {
    for (let j = i - 1; j >= 0; j -= 1) {
      const factor = M[j][i] / M[i][i];
      for (let k = i; k < width; k += 1) M[j][k] -= factor * M[i][k];
      steps.push(M.map((row) => [...row]));
    }
  }

  for (let i = 0; i < n; i += 1) {
    const pivot = M[i][i];
    if (pivot === 0) return { error: 'เมทริกซ์นี้เป็นเอกฐาน หาอินเวอร์สไม่ได้' };
    for (let j = 0; j < width; j += 1) M[i][j] /= pivot;
  }
  steps.push(M.map((row) => [...row]));

  const inverse = M.map((row) => row.slice(n));
  const x = inverse.map((row) => row.reduce((sum, value, j) => sum + value * B[j], 0));

  return {
    x,
    steps: (
      <div className="grid gap-6">
        <div className="grid gap-1">
          <p className="field__hint">เมทริกซ์ผกผัน [A]⁻¹</p>
          <div className="overflow-x-auto">
            <Matrix value={inverse} />
          </div>
        </div>
        <div className="grid gap-1">
          <p className="field__hint">การลดรูป [A | I] ทีละขั้น</p>
          <MatrixSteps steps={steps} />
        </div>
      </div>
    ),
  };
}

export default function MatrixInverse() {
  return (
    <LinearMethodPage
      method="inverse"
      problem="Inverse"
      solve={solve}
      stepsTitle="อินเวอร์สและขั้นตอนการลดรูป"
      stepsDescription="เสริมเมทริกซ์เอกลักษณ์เข้าไปแล้วลดรูปจนได้ [I | A⁻¹] จากนั้น {x} = [A]⁻¹{B}"
    />
  );
}
