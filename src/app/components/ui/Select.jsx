'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, Check } from './Icons';

/**
 * Listbox select. Full keyboard support: Enter/Space/Arrow to open, Arrow to
 * move, Home/End to jump, Enter to commit, Escape to cancel.
 */
export default function Select({
  placeholder = 'เลือก…',
  value,
  defaultValue,
  onChange,
  options = [],
  disabled = false,
  id,
  className = '',
  'aria-describedby': describedBy,
}) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultValue ?? '');
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const listRef = useRef(null);
  const autoId = useId();
  const listId = `${id || autoId}-listbox`;

  const selected = value !== undefined ? value : internal;
  const selectedIndex = options.findIndex((o) => o.value === selected);
  const label = selectedIndex >= 0 ? options[selectedIndex].label : undefined;

  const commit = (option) => {
    if (value === undefined) setInternal(option.value);
    setOpen(false);
    triggerRef.current?.focus();
    onChange?.(option.value);
  };

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  const onKeyDown = (e) => {
    if (disabled) return;
    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (options[activeIndex]) commit(options[activeIndex]);
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  const isEmpty = options.length === 0;

  return (
    <div ref={wrapRef} className={`select ${className}`}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className="select__trigger"
        disabled={disabled || isEmpty}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-describedby={describedBy}
        onClick={() => !disabled && !isEmpty && setOpen((o) => !o)}
        onKeyDown={onKeyDown}
      >
        <span className={`select__value${label ? '' : ' select__value--placeholder'}`}>
          {label ?? placeholder}
        </span>
        <ChevronDown size={15} className="select__chevron" data-open={open} />
      </button>

      {open && !isEmpty && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className="select__menu"
          aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        >
          {options.map((option, i) => {
            const isSelected = option.value === selected;
            return (
              <li
                key={`${option.value}-${i}`}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={isSelected}
                data-active={i === activeIndex}
                className="select__option"
                onMouseEnter={() => setActiveIndex(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  commit(option);
                }}
              >
                <span>{option.label}</span>
                {isSelected && <Check size={14} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
