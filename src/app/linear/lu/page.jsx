'use client';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { findLU, findL, findU, pushB, findY, findX } from '../../components/matrix';
import LinearMethodPage from '../../components/LinearMethodPage';
import { Matrix } from '../../components/ui/MatrixSteps';

function solve({ A, B }) {
  const LU = findLU(A);
  const L = findL(LU);
  const U = findU(LU);

  if (L.some((row, i) => !Number.isFinite(row[i]) || row[i] === 0)) {
    return { error: 'แยก [L][U] ไม่ได้ — มีตัวหลักเป็นศูนย์ ลองสลับแถวของ [A] ก่อน' };
  }

  const Y = findY(pushB(L, B));
  const X = findX(pushB(U, Y));

  return {
    x: X,
    steps: (
      <div className="grid gap-6">
        <div className="grid gap-1">
          <p className="field__hint">แยก [A] = [L][U]</p>
          <div className="flex flex-wrap gap-8 overflow-x-auto">
            <Matrix value={L} label="[L]" />
            <Matrix value={U} label="[U]" />
          </div>
        </div>
        <div className="grid gap-1">
          <p className="field__hint">ขั้นที่ 1 — แก้ [L]{'{y}'} = {'{B}'} ไปข้างหน้า</p>
          <div className="overflow-x-auto">
            <Matrix value={Y.map((value) => [value])} wrapper="Bmatrix" label="\{y\}" />
          </div>
        </div>
        <div className="grid gap-1">
          <p className="field__hint">ขั้นที่ 2 — แก้ [U]{'{x}'} = {'{y}'} ย้อนกลับ</p>
          <div className="overflow-x-auto">
            <BlockMath math={`\\{x\\} = \\begin{Bmatrix} ${X.map((v) => Number(v.toFixed(6))).join(' \\\\ ')} \\end{Bmatrix}`} />
          </div>
        </div>
      </div>
    ),
  };
}

export default function LUDecomposition() {
  return (
    <LinearMethodPage
      method="lu"
      problem="LU"
      solve={solve}
      stepsTitle="การแยกเมทริกซ์และการแทนค่า"
      stepsDescription="แยก [A] เป็น [L][U] แล้วแก้สองขั้น ไปข้างหน้าหา {y} ย้อนกลับหา {x}"
    />
  );
}
