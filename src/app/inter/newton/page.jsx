'use client';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import PointsMethodPage from '../../components/PointsMethodPage';

/** Divided difference c[i][j] over the sample range x[i]…x[j]. */
function dividedDifference(X, Y, i, j) {
  if (i === j) return Y[i];
  return (dividedDifference(X, Y, i + 1, j) - dividedDifference(X, Y, i, j - 1)) / (X[j] - X[i]);
}

function solve({ X, Y, x0, n }) {
  if (new Set(X).size !== X.length) {
    return { error: 'ค่า X ต้องไม่ซ้ำกัน — ผลต่างส่วนจะหารด้วยศูนย์' };
  }

  const c = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i += 1) c[i][0] = Y[i];
  for (let i = 1; i < n; i += 1) {
    for (let j = 0; j < n - i; j += 1) c[j][i] = dividedDifference(X, Y, j, j + i);
  }

  /* Each term multiplies one more (x − x_k) than the term before it. */
  const products = new Array(n).fill(1);
  for (let i = 1; i < n; i += 1) {
    let product = 1;
    for (let k = 0; k < i; k += 1) product *= x0 - X[k];
    products[i] = product;
  }

  const terms = Array.from({ length: n }, (_, i) => ({
    i,
    c: c[0][i],
    product: products[i],
    term: c[0][i] * products[i],
  }));

  const value = terms.reduce((sum, term) => sum + term.term, 0);

  const polynomial = terms
    .map((term, i) => {
      const factors = X.slice(0, i)
        .map((x) => `(x - ${Number(x)})`)
        .join('');
      return `${Number(term.c.toFixed(6))}${factors}`;
    })
    .join(' + ');

  return {
    value,
    steps: (
      <div className="overflow-x-auto">
        <BlockMath math={`f(x) = ${polynomial}`} />
        <BlockMath math={`f(${x0}) = ${Number(value.toFixed(6))}`} />
      </div>
    ),
    iterations: terms,
    tableTitle: 'สัมประสิทธิ์ผลต่างส่วน',
    columns: [
      { key: 'i', label: 'i', render: (row) => row.i },
      { key: 'c', label: 'cᵢ', render: (row) => row.c.toFixed(6) },
      { key: 'product', label: '∏(x − xₖ)', render: (row) => row.product.toFixed(6) },
      { key: 'term', label: 'พจน์ที่ i', render: (row) => row.term.toFixed(6) },
    ],
  };
}

export default function NewtonInterpolation() {
  return (
    <PointsMethodPage
      family="inter"
      method="newton"
      problem="Newton"
      resource="inter"
      solve={solve}
      stepsDescription="พหุนามที่สร้างจากตารางผลต่างส่วน และค่าที่แทนลงไป"
    />
  );
}
