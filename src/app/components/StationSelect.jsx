'use client';
import { useState, useRef, useEffect } from 'react';

export default function StationSelect({
  placeholder = 'Select…',
  value,
  defaultValue,
  onChange,
  options = [],
  disabled = false,
  style,
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultValue ?? '');
  const ref = useRef(null);

  const selected = value ?? internal;

  const handleSelect = (opt) => {
    if (value === undefined) setInternal(opt.value);
    setOpen(false);
    onChange?.(opt.value);
  };

  const label = options.find((o) => o.value === selected)?.label;

  /* close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div
      ref={ref}
      className={`station-select-wrap ${disabled ? 'is-disabled' : ''} ${className}`}
      style={style}
    >
      <button
        type="button"
        className="station-select-trigger"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
      >
        <span className={label ? '' : 'is-placeholder'}>
          {label ?? placeholder}
        </span>
        <svg
          className={`station-select-arrow ${open ? 'is-open' : ''}`}
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && options.length > 0 && (
        <ul className="station-select-dropdown">
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`station-select-option ${opt.value === selected ? 'is-selected' : ''}`}
              onMouseDown={() => handleSelect(opt)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
