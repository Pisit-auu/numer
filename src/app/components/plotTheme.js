'use client';
import { useEffect, useState } from 'react';

/**
 * Plotly cannot read CSS custom properties, so the chart theme is resolved from
 * the live token values and recomputed whenever the theme class flips. Charts
 * then match the page in both light and dark instead of shipping Plotly's own
 * palette.
 */

const FALLBACK = {
  foreground: '#09090b',
  muted: '#71717a',
  grid: 'rgba(9, 9, 11, 0.10)',
  line: 'rgba(9, 9, 11, 0.22)',
  zero: 'rgba(9, 9, 11, 0.45)',
  surface: 'rgba(0,0,0,0)',
  series: '#2563eb',
  accent: '#e11d48',
  point: '#16a34a',
};

function readTheme() {
  if (typeof window === 'undefined') return FALLBACK;
  const styles = getComputedStyle(document.documentElement);
  const token = (name, alpha) => {
    const raw = styles.getPropertyValue(name).trim();
    if (!raw) return null;
    return alpha === undefined ? `hsl(${raw})` : `hsl(${raw} / ${alpha})`;
  };

  return {
    foreground: token('--foreground') || FALLBACK.foreground,
    muted: token('--muted-foreground') || FALLBACK.muted,
    grid: token('--border', 0.85) || FALLBACK.grid,
    line: token('--border') || FALLBACK.line,
    zero: token('--muted-foreground', 0.55) || FALLBACK.zero,
    surface: 'rgba(0,0,0,0)',
    series: token('--brand') || FALLBACK.series,
    accent: token('--destructive') || FALLBACK.accent,
    point: token('--success') || FALLBACK.point,
  };
}

export function usePlotTheme() {
  const [theme, setTheme] = useState(FALLBACK);

  useEffect(() => {
    const sync = () => setTheme(readTheme());
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return theme;
}

export function plotLayout(theme, overrides = {}) {
  const axis = {
    gridcolor: theme.grid,
    linecolor: theme.line,
    zeroline: true,
    zerolinecolor: theme.zero,
    zerolinewidth: 1,
    tickfont: { color: theme.muted, size: 11 },
    titlefont: { color: theme.muted, size: 12 },
    automargin: true,
  };

  return {
    paper_bgcolor: theme.surface,
    plot_bgcolor: theme.surface,
    font: {
      color: theme.foreground,
      family: 'var(--font-sans), ui-sans-serif, system-ui, sans-serif',
      size: 12,
    },
    autosize: true,
    showlegend: false,
    margin: { t: 16, b: 44, l: 52, r: 16 },
    hoverlabel: {
      bgcolor: theme.surface,
      bordercolor: theme.line,
      font: { color: theme.foreground, size: 12 },
    },
    legend: {
      bgcolor: 'rgba(0,0,0,0)',
      font: { color: theme.muted, size: 11 },
      orientation: 'h',
      y: -0.18,
    },
    ...overrides,
    xaxis: { ...axis, ...(overrides.xaxis || {}) },
    yaxis: { ...axis, ...(overrides.yaxis || {}) },
  };
}

export const PLOT_CONFIG = {
  displaylogo: false,
  responsive: true,
  scrollZoom: true,
  modeBarButtonsToRemove: ['select2d', 'lasso2d', 'autoScale2d', 'toggleSpikelines'],
};
