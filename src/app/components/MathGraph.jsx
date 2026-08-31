'use client';
import Plot from 'react-plotly.js';
import { usePlotTheme, plotLayout, PLOT_CONFIG } from './plotTheme';

const MathGraph = ({ dataPoints, xTitle = 'x', yTitle = 'f(x)' }) => {
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
            name: yTitle,
            marker: { color: theme.series, size: 6 },
            line: { color: theme.series, width: 2, shape: 'spline' },
            hovertemplate: `${xTitle} = %{x}<br>${yTitle} = %{y}<extra></extra>`,
          },
        ]}
        layout={plotLayout(theme, {
          xaxis: { title: xTitle, range: pad(xData, [0, 7]) },
          yaxis: { title: yTitle, range: pad(yData, [0, 7]) },
        })}
        config={PLOT_CONFIG}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler
      />
    </div>
  );
};

export default MathGraph;
