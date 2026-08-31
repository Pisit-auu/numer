'use client';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import PointsMethodPage from '../../components/PointsMethodPage';

const round = (value) => Number(Number(value).toFixed(6));

/** Gaussian elimination with partial pivoting, for the quadratic spline system. */
function solveSystem(M) {
  const n = M.length;
  for (let i = 0; i < n; i += 1) {
    let pivot = i;
    for (let r = i + 1; r < n; r += 1) if (Math.abs(M[r][i]) > Math.abs(M[pivot][i])) pivot = r;
    if (Math.abs(M[pivot][i]) < 1e-12) return null;
    [M[i], M[pivot]] = [M[pivot], M[i]];
    for (let r = i + 1; r < n; r += 1) {
      const factor = M[r][i] / M[i][i];
      for (let c = i; c <= n; c += 1) M[r][c] -= factor * M[i][c];
    }
  }
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i -= 1) {
    x[i] = M[i][n];
    for (let j = i + 1; j < n; j += 1) x[i] -= M[i][j] * x[j];
    x[i] /= M[i][i];
  }
  return x;
}

function findInterval(X, x0) {
  for (let i = 0; i < X.length - 1; i += 1) {
    if (x0 >= X[i] && x0 <= X[i + 1]) return i;
  }
  return -1;
}

function linearSpline(X, Y, x0, k) {
  const slopes = X.slice(0, -1).map((_, i) => (Y[i + 1] - Y[i]) / (X[i + 1] - X[i]));
  const value = Y[k] + slopes[k] * (x0 - X[k]);

  return {
    value,
    steps: (
      <div className="grid gap-2 overflow-x-auto">
        {slopes.map((m, i) => (
          <BlockMath
            key={i}
            math={`f_{${i + 1}}(x) = ${round(Y[i])} + (${round(m)})(x - ${round(X[i])}), \\quad ${round(X[i])} \\le x \\le ${round(X[i + 1])}`}
          />
        ))}
        <BlockMath
          math={`f(${x0}) = ${round(Y[k])} + (${round(slopes[k])})(${x0} - ${round(X[k])}) = ${round(value)}`}
        />
      </div>
    ),
    iterations: slopes.map((m, i) => ({ i, m, from: X[i], to: X[i + 1] })),
    tableTitle: 'ความชันของแต่ละช่วง',
    columns: [
      { key: 'i', label: 'ช่วง', render: (row) => `${row.i + 1}` },
      { key: 'from', label: 'จาก x', render: (row) => round(row.from) },
      { key: 'to', label: 'ถึง x', render: (row) => round(row.to) },
      { key: 'm', label: 'ความชัน m', render: (row) => row.m.toFixed(6) },
    ],
  };
}

function quadraticSpline(X, Y, x0, k, n) {
  /* Three unknowns (a, b, c) per interval, closed by a₁ = 0. */
  const pieces = n - 1;
  const size = 3 * pieces;
  const M = Array.from({ length: size }, () => new Array(size + 1).fill(0));
  let row = 0;

  for (let i = 0; i < pieces; i += 1) {
    for (const [x, y] of [
      [X[i], Y[i]],
      [X[i + 1], Y[i + 1]],
    ]) {
      M[row][3 * i] = x * x;
      M[row][3 * i + 1] = x;
      M[row][3 * i + 2] = 1;
      M[row][size] = y;
      row += 1;
    }
  }

  for (let i = 0; i < pieces - 1; i += 1) {
    const x = X[i + 1];
    M[row][3 * i] = 2 * x;
    M[row][3 * i + 1] = 1;
    M[row][3 * (i + 1)] = -2 * x;
    M[row][3 * (i + 1) + 1] = -1;
    row += 1;
  }

  M[row][0] = 1;

  const coefficients = solveSystem(M);
  if (!coefficients) return { error: 'ระบบสมการของ spline นี้แก้ไม่ได้ ลองตรวจว่าค่า X ไม่ซ้ำกัน' };

  const rows = Array.from({ length: pieces }, (_, i) => ({
    i,
    a: coefficients[3 * i],
    b: coefficients[3 * i + 1],
    c: coefficients[3 * i + 2],
  }));
  const { a, b, c } = rows[k];
  const value = a * x0 * x0 + b * x0 + c;

  return {
    value,
    steps: (
      <div className="grid gap-2 overflow-x-auto">
        {rows.map((piece) => (
          <BlockMath
            key={piece.i}
            math={`f_{${piece.i + 1}}(x) = ${round(piece.a)}x^2 + ${round(piece.b)}x + ${round(piece.c)}, \\quad ${round(X[piece.i])} \\le x \\le ${round(X[piece.i + 1])}`}
          />
        ))}
        <BlockMath math={`f(${x0}) = ${round(value)}`} />
      </div>
    ),
    iterations: rows,
    tableTitle: 'สัมประสิทธิ์ของแต่ละช่วง',
    columns: [
      { key: 'i', label: 'ช่วง', render: (r) => r.i + 1 },
      { key: 'a', label: 'a', render: (r) => r.a.toFixed(6) },
      { key: 'b', label: 'b', render: (r) => r.b.toFixed(6) },
      { key: 'c', label: 'c', render: (r) => r.c.toFixed(6) },
    ],
  };
}

function cubicSpline(X, Y, x0, k, n) {
  /* Natural cubic spline: second derivatives are zero at both ends. */
  const h = X.slice(0, -1).map((_, i) => X[i + 1] - X[i]);
  const M = new Array(n).fill(0);

  if (n > 2) {
    const size = n - 2;
    const system = Array.from({ length: size }, () => new Array(size + 1).fill(0));
    for (let i = 0; i < size; i += 1) {
      const idx = i + 1;
      if (i > 0) system[i][i - 1] = h[idx - 1];
      system[i][i] = 2 * (h[idx - 1] + h[idx]);
      if (i < size - 1) system[i][i + 1] = h[idx];
      system[i][size] =
        6 * ((Y[idx + 1] - Y[idx]) / h[idx] - (Y[idx] - Y[idx - 1]) / h[idx - 1]);
    }
    const inner = solveSystem(system);
    if (!inner) return { error: 'ระบบสมการของ spline นี้แก้ไม่ได้ ลองตรวจว่าค่า X เรียงจากน้อยไปมาก' };
    inner.forEach((value, i) => {
      M[i + 1] = value;
    });
  }

  const evaluate = (i, x) => {
    const hi = h[i];
    return (
      (M[i] * (X[i + 1] - x) ** 3) / (6 * hi) +
      (M[i + 1] * (x - X[i]) ** 3) / (6 * hi) +
      (Y[i] / hi - (M[i] * hi) / 6) * (X[i + 1] - x) +
      (Y[i + 1] / hi - (M[i + 1] * hi) / 6) * (x - X[i])
    );
  };

  const value = evaluate(k, x0);

  return {
    value,
    steps: (
      <div className="grid gap-2 overflow-x-auto">
        <BlockMath math={`S_i(x) = \\frac{M_i(x_{i+1}-x)^3 + M_{i+1}(x-x_i)^3}{6h_i} + \\left(\\frac{y_i}{h_i} - \\frac{M_i h_i}{6}\\right)(x_{i+1}-x) + \\left(\\frac{y_{i+1}}{h_i} - \\frac{M_{i+1} h_i}{6}\\right)(x-x_i)`} />
        <BlockMath math={`f(${x0}) = ${round(value)} \\quad \\text{(ช่วงที่ } ${k + 1}\\text{)}`} />
      </div>
    ),
    iterations: X.map((x, i) => ({ i, x, y: Y[i], M: M[i] })),
    tableTitle: 'อนุพันธ์อันดับสองที่แต่ละจุด',
    columns: [
      { key: 'i', label: 'i', render: (r) => r.i },
      { key: 'x', label: 'xᵢ', render: (r) => round(r.x) },
      { key: 'y', label: 'yᵢ', render: (r) => round(r.y) },
      { key: 'M', label: 'Mᵢ', render: (r) => r.M.toFixed(6) },
    ],
  };
}

function solve({ X, Y, x0, n, extra }) {
  const sorted = X.every((value, i) => i === 0 || value > X[i - 1]);
  if (!sorted) return { error: 'ค่า X ต้องเรียงจากน้อยไปมากและไม่ซ้ำกัน' };

  const k = findInterval(X, x0);
  if (k === -1) {
    return { error: `ค่า x = ${x0} อยู่นอกช่วงข้อมูล [${X[0]}, ${X[n - 1]}] — spline ใช้ประมาณค่าในช่วงเท่านั้น` };
  }

  if (extra.kind === 'quadratic') return quadraticSpline(X, Y, x0, k, n);
  if (extra.kind === 'cubic') return cubicSpline(X, Y, x0, k, n);
  return linearSpline(X, Y, x0, k);
}

export default function Spline() {
  return (
    <PointsMethodPage
      family="inter"
      method="spline"
      problem="Spline"
      resource="inter"
      solve={solve}
      targetHint="ต้องอยู่ในช่วงของข้อมูล"
      extraFields={[
        {
          key: 'kind',
          label: 'ชนิดของ spline',
          default: 'linear',
          hint: 'ยิ่งดีกรีสูงยิ่งเรียบต่อเนื่อง แต่ต้องใช้จุดมากขึ้น',
          choices: [
            { value: 'linear', label: 'Linear — ต่อด้วยเส้นตรง' },
            { value: 'quadratic', label: 'Quadratic — ต่อด้วยพาราโบลา' },
            { value: 'cubic', label: 'Cubic (natural) — เรียบที่สุด' },
          ],
        },
      ]}
      stepsTitle="สมการของแต่ละช่วง"
      stepsDescription="พหุนามที่ใช้ในแต่ละช่วงย่อย และค่าที่แทนลงไป"
    />
  );
}
