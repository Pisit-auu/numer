import ResultCard from './ResultCard';

/**
 * The answer, stated once and plainly, above the work that produced it.
 * items: [{ label, value }]
 */
export default function Readout({ title = 'คำตอบ', description, items }) {
  const present = (items || []).filter((item) => item && item.value !== undefined && item.value !== null);
  if (present.length === 0) return null;

  return (
    <ResultCard title={title} description={description}>
      <div className="readout">
        {present.map((item) => (
          <div key={item.label} className="readout__item">
            <p className="readout__label">{item.label}</p>
            <p className="readout__value">{item.value}</p>
          </div>
        ))}
      </div>
    </ResultCard>
  );
}
