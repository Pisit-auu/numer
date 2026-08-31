'use client';
import Plot from 'react-plotly.js';
import { usePlotTheme, plotLayout, PLOT_CONFIG } from './plotTheme';

/** f(x) with the secant chords each step draws between its two latest points. */
const Mathsecant = ({ dataPoints }) => {
  const theme = usePlotTheme();
  const points = Array.isArray(dataPoints) ? dataPoints : [];

  const xData = points.map((point) => point.x);
  const yData = points.map((point) => point.y);
  const sortedX = [...xData].sort((a, b) => a - b);
  const sortedY = [...yData].sort((a, b) => a - b);

  const pad = (values, fallback) => {
    if (values.length === 0) return fallback;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const margin = (max - min || Math.abs(max) || 1) * 0.12;
    return [min - margin, max + margin];
  };

  const segments = [];
  if (xData.length > 0) segments.push([[xData[0], xData[0]], [0, yData[0]]]);
  for (let i = 0; i < xData.length - 1; i += 1) {
    segments.push([[xData[i], xData[i + 1]], [yData[i], 0]]);
  }

  const traces = [
    {
      x: sortedX,
      y: sortedY,
      mode: 'lines+markers',
      type: 'scatter',
      marker: { color: theme.series, size: 6 },
      line: { color: theme.series, width: 2, shape: 'spline' },
      name: 'f(x)',
      hovertemplate: 'x = %{x}<br>f(x) = %{y}<extra></extra>',
    },
    ...segments.map(([x, y], i) => ({
      x,
      y,
      mode: 'lines',
      type: 'scatter',
      line: { color: theme.accent, width: 1.25, dash: 'dot' },
      name: 'เส้นตัด',
      legendgroup: 'secant',
      showlegend: i === 0,
      hoverinfo: 'skip',
    })),
  ];

  return (
    <div className="h-80 w-full md:h-[26rem]">
      <Plot
        data={traces}
        layout={plotLayout(theme, {
          xaxis: { title: 'x', range: pad(xData, [0, 7]) },
          yaxis: { title: 'f(x)', range: pad(yData, [0, 7]) },
          showlegend: true,
          margin: { t: 16, b: 60, l: 52, r: 16 },
        })}
        config={PLOT_CONFIG}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler
      />
    </div>
  );
};

export default Mathsecant;
