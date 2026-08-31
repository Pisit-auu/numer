import { AlertCircle, CheckCircle, Info } from './Icons';

const variants = {
  error: { className: 'alert--error', Icon: AlertCircle, role: 'alert' },
  success: { className: 'alert--success', Icon: CheckCircle, role: 'status' },
  info: { className: 'alert--info', Icon: Info, role: 'status' },
};

export default function Alert({ variant = 'info', title, children, className = '' }) {
  const { className: variantClass, Icon, role } = variants[variant] ?? variants.info;
  return (
    <div className={`alert ${variantClass} ${className}`} role={role}>
      <Icon size={15} />
      <div>
        {title && <p className="alert__title">{title}</p>}
        {children && <div>{children}</div>}
      </div>
    </div>
  );
}
