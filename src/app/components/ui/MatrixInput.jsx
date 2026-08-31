'use client';

/**
 * The [A]{x} = {B} entry grid. Column heads are set once above the grid so the
 * relationship reads as an equation rather than three unlabeled boxes, and the
 * whole thing scrolls sideways instead of squeezing cells at 5x5 and up.
 */
export default function MatrixInput({
  size,
  A,
  B,
  x0,
  onChangeA,
  onChangeB,
  onChangeX0,
  xLabel = 'x',
  bLabel = 'B',
  showX0 = false,
}) {
  if (!size || !A || A.length === 0) return null;

  const cell = (key, props) => (
    <input key={key} type="number" className="input input--sm input--mono matrix__cell" {...props} />
  );

  return (
    <div className="matrix-scroll">
      <div className="flex items-start gap-3">
        <fieldset>
          <legend className="field__label mb-1.5">[A]</legend>
          <div
            className="matrix"
            style={{ gridTemplateColumns: `repeat(${size}, min-content)` }}
          >
            {A.map((row, i) =>
              row.map((value, j) =>
                cell(`a-${i}-${j}`, {
                  value,
                  'aria-label': `A แถว ${i + 1} คอลัมน์ ${j + 1}`,
                  onChange: (e) => onChangeA(i, j, e.target.value),
                })
              )
            )}
          </div>
        </fieldset>

        <div className="pt-7 self-stretch flex items-center text-muted-foreground text-sm">×</div>

        <fieldset>
          <legend className="field__label mb-1.5">{`{${xLabel}}`}</legend>
          <div className="matrix" style={{ gridTemplateColumns: 'min-content' }}>
            {A.map((_, i) => (
              <input
                key={`x-${i}`}
                type="text"
                readOnly
                tabIndex={-1}
                value={`${xLabel}${i + 1}`}
                aria-label={`ตัวแปรที่ ${i + 1}`}
                className="input input--sm input--mono matrix__cell !bg-muted !text-muted-foreground"
              />
            ))}
          </div>
        </fieldset>

        <div className="pt-7 self-stretch flex items-center text-muted-foreground text-sm">=</div>

        <fieldset>
          <legend className="field__label mb-1.5">{`{${bLabel}}`}</legend>
          <div className="matrix" style={{ gridTemplateColumns: 'min-content' }}>
            {B.map((value, i) =>
              cell(`b-${i}`, {
                value,
                'aria-label': `${bLabel} แถว ${i + 1}`,
                onChange: (e) => onChangeB(i, e.target.value),
              })
            )}
          </div>
        </fieldset>

        {showX0 && x0 && (
          <fieldset className="ml-2 border-l pl-4">
            <legend className="field__label mb-1.5">{`{${xLabel}₀}`}</legend>
            <div className="matrix" style={{ gridTemplateColumns: 'min-content' }}>
              {x0.map((value, i) =>
                cell(`x0-${i}`, {
                  value,
                  'aria-label': `ค่าเริ่มต้นตัวแปรที่ ${i + 1}`,
                  onChange: (e) => onChangeX0(i, e.target.value),
                })
              )}
            </div>
          </fieldset>
        )}
      </div>
    </div>
  );
}
