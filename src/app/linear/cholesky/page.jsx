'use client';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { findLL, findLT, pushB, findY, findX } from '../../components/matrix';
import LinearMethodPage from '../../components/LinearMethodPage';
import { Matrix } from '../../components/ui/MatrixSteps';

function solve({ A, B }) {
  const symmetric = A.every((row, i) => row.every((value, j) => value === A[j][i]));
  if (!symmetric) {
    return { error: 'Cholesky ต้องใช้กับเมทริกซ์สมมาตรเท่านั้น — ตรวจว่า A[i][j] เท่ากับ A[j][i]' };
  }

  let L;
  try {
    L = findLL(A);
  } catch {
    return { error: 'เมทริกซ์นี้ไม่ใช่ positive definite จึงแยกแบบ Cholesky ไม่ได้' };
  }

  const LT = findLT(L);
  const Y = findY(pushB(L, B));
  const X = findX(pushB(LT, Y));

  return {
    x: X,
    steps: (
      <div className="grid gap-6">
        <div className="grid gap-1">
          <p className="field__hint">แยก [A] = [L][L]ᵀ</p>
          <div className="flex flex-wrap gap-8 overflow-x-auto">
            <Matrix value={L} label="[L]" />
            <Matrix value={LT} label="[L]^T" />
          </div>
        </div>
        <div className="grid gap-1">
          <p className="field__hint">ขั้นที่ 1 — แก้ [L]{'{y}'} = {'{B}'} ไปข้างหน้า</p>
          <div className="overflow-x-auto">
            <Matrix value={Y.map((value) => [value])} wrapper="Bmatrix" label="\{y\}" />
          </div>
        </div>
        <div className="grid gap-1">
          <p className="field__hint">ขั้นที่ 2 — แก้ [L]ᵀ{'{x}'} = {'{y}'} ย้อนกลับ</p>
          <div className="overflow-x-auto">
            <BlockMath math={`\\{x\\} = \\begin{Bmatrix} ${X.map((v) => Number(v.toFixed(6))).join(' \\\\ ')} \\end{Bmatrix}`} />
          </div>
        </div>
      </div>
    ),
  };
}

export default function Cholesky() {
  return (
    <LinearMethodPage
      method="cholesky"
      problem="Cholesky"
      solve={solve}
      stepsTitle="การแยกเมทริกซ์และการแทนค่า"
      stepsDescription="ใช้ได้กับเมทริกซ์สมมาตรและ positive definite เท่านั้น"
    />
  );
}
