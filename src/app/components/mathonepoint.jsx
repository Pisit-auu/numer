'use client';
import Plot from 'react-plotly.js';
import { usePlotTheme, plotLayout, PLOT_CONFIG } from './plotTheme';

/** g(x) against the line y = x — the cobweb picture of one-point iteration. */
const MathGraphmanypoint = ({ dataPoints }) => {
  const theme = usePlotTheme();
  const points = Array.isArray(dataPoints) ? dataPoints : [];

  const xData = points.map((point) => point.x);
  const yData = points.map((point) => point.y);

  const pad = (values, fallback) => {
    if (values.length === 0) return fallback;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const margin = (max - min || Math.abs(max) || 1) * 0.12;
    return [min - margin, max + margin];
  };

  return (
    <div className="h-80 w-full md:h-[26rem]">
      <Plot
        data={[
          {
            x: xData,
            y: yData,
            mode: 'lines+markers',
            type: 'scatter',
            marker: { color: theme.series, size: 6 },
            line: { color: theme.series, width: 2, shape: 'spline' },
            name: 'g(x)',
            hovertemplate: 'x = %{x}<br>g(x) = %{y}<extra></extra>',
          },
          {
            x: xData,
            y: xData,
            mode: 'lines',
            type: 'scatter',
            line: { color: theme.muted, width: 1.25, dash: 'dash' },
            name: 'y = x',
            hoverinfo: 'skip',
          },
          {
            x: xData,
            y: xData,
            mode: 'lines',
            type: 'scatter',
            line: { color: theme.accent, width: 1.25, shape: 'hv' },
            name: 'เส้นทางการวนซ้ำ',
            hoverinfo: 'skip',
          },
        ]}
        layout={plotLayout(theme, {
          xaxis: { title: 'x', range: pad(xData, [0, 7]) },
          yaxis: { title: 'g(x)', range: pad([...yData, ...xData], [0, 7]) },
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

export default MathGraphmanypoint;
