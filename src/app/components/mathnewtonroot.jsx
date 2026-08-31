'use client';
import Plot from 'react-plotly.js';
import { usePlotTheme, plotLayout, PLOT_CONFIG } from './plotTheme';

/** f(x) with the tangent drops that each Newton step takes down to the axis. */
const Mathnewtonroot = ({ dataPoints }) => {
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
  ];

  /* Every construction line shares one legend entry, so the legend stays a
     legend instead of listing one row per iteration. */
  for (let i = 0; i < xData.length - 1; i += 1) {
    traces.push({
      x: [xData[i], xData[i + 1]],
      y: [yData[i], 0],
      mode: 'lines',
      type: 'scatter',
      line: { color: theme.accent, width: 1.25, dash: 'dot' },
      name: 'เส้นสัมผัส',
      legendgroup: 'tangent',
      showlegend: i === 0,
      hoverinfo: 'skip',
    });
  }

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

export default Mathnewtonroot;
