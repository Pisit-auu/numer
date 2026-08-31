export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="empty">
      {Icon && (
        <span className="empty__icon">
          <Icon size={17} />
        </span>
      )}
      <p className="empty__title">{title}</p>
      {description && <p className="empty__desc">{description}</p>}
      {action}
    </div>
  );
}
