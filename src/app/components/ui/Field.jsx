'use client';
import { useId } from 'react';
import { AlertCircle } from './Icons';

/**
 * Label + control + hint/error, wired together by id so the label is a real
 * label and the error is announced.
 */
export default function Field({ label, hint, error, children, className = '' }) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ');

  return (
    <div className={`field ${className}`}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {children({
        id,
        'aria-describedby': describedBy || undefined,
        'aria-invalid': error ? 'true' : undefined,
      })}
      {hint && !error && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field__error">
          <AlertCircle size={13} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
