/** Card with a titled header — the one container the results stack uses. */
export default function ResultCard({ title, description, meta, flush = false, children }) {
  return (
    <section className="card">
      {(title || meta) && (
        <header className="card__header">
          <div>
            {title && <h2 className="card__title">{title}</h2>}
            {description && <p className="card__desc">{description}</p>}
          </div>
          {meta}
        </header>
      )}
      <div className={flush ? 'card__body card__body--flush' : 'card__body'}>{children}</div>
    </section>
  );
}
