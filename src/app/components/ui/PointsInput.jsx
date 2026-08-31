'use client';

/**
 * The paired X / Y sample table used by interpolation and regression. One row
 * per point so a value and its partner are always read together, with the row
 * index printed alongside.
 */
export default function PointsInput({
  X,
  Y,
  onChangeX,
  onChangeY,
  xLabel = 'X',
  yLabel = 'Y',
  selectable = false,
  selected = [],
  onToggle,
}) {
  if (!X || X.length === 0) return null;

  return (
    <div className="table-wrap">
      <table className="table !min-w-0">
        <thead>
          <tr>
            {selectable && <th scope="col">ใช้</th>}
            <th scope="col">#</th>
            <th scope="col">{xLabel}</th>
            <th scope="col">{yLabel}</th>
          </tr>
        </thead>
        <tbody>
          {X.map((value, i) => (
            <tr key={i}>
              {selectable && (
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(i)}
                    onChange={() => onToggle(i)}
                    aria-label={`ใช้จุดที่ ${i + 1} ในการคำนวณ`}
                  />
                </td>
              )}
              <td data-index="">{i + 1}</td>
              <td>
                <input
                  type="number"
                  className="input input--sm input--mono !h-8 w-24"
                  value={value}
                  aria-label={`${xLabel} จุดที่ ${i + 1}`}
                  onChange={(e) => onChangeX(i, e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  className="input input--sm input--mono !h-8 w-24"
                  value={Y[i]}
                  aria-label={`${yLabel} จุดที่ ${i + 1}`}
                  onChange={(e) => onChangeY(i, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
