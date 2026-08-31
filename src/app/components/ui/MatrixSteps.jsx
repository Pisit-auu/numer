import { BlockMath } from 'react-katex';

const toLatex = (matrix) =>
  matrix.map((row) => (Array.isArray(row) ? row.map(format).join(' & ') : format(row))).join(' \\\\ ');

function format(value) {
  if (typeof value !== 'number') return value;
  if (Number.isInteger(value)) return String(value);
  return Number(value.toFixed(6)).toString();
}

/** One matrix, rendered as a bracketed block. */
export function Matrix({ value, wrapper = 'bmatrix', label }) {
  const body = `\\begin{${wrapper}} ${toLatex(value)} \\end{${wrapper}}`;
  return <BlockMath math={label ? `${label} = ${body}` : body} />;
}

/**
 * A numbered sequence of matrix snapshots — the row operations, in order.
 * Each step is scrollable on its own so a wide matrix never widens the page.
 */
export default function MatrixSteps({ steps, label = 'ขั้นที่' }) {
  if (!steps || steps.length === 0) return null;
  return (
    <ol className="grid gap-3">
      {steps.map((step, i) => (
        <li key={i} className="grid gap-0.5">
          <p className="field__hint">
            {label} {i + 1}
          </p>
          <div className="overflow-x-auto">
            <Matrix value={step} />
          </div>
        </li>
      ))}
    </ol>
  );
}
