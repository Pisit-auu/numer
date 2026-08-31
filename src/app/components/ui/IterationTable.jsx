import ResultCard from './ResultCard';

/**
 * The iteration table — the thing users actually come for. Numbers are
 * tabular-lining so decimal points line up column to column, and the
 * converged row is marked so the answer is findable without counting rows.
 */
export default function IterationTable({
  title = 'ตารางการวนซ้ำ',
  description,
  columns,
  rows,
  markLast = true,
}) {
  if (!rows || rows.length === 0) return null;

  return (
    <ResultCard
      title={title}
      description={description}
      meta={<span className="badge badge--muted">{rows.length} รอบ</span>}
      flush
    >
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} data-final={markLast && i === rows.length - 1 ? 'true' : undefined}>
                {columns.map((column, j) => (
                  <td key={column.key} data-index={j === 0 ? '' : undefined}>
                    {column.render ? column.render(row, i) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ResultCard>
  );
}
