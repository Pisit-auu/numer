'use client';
import Plot from 'react-plotly.js';
import { usePlotTheme, plotLayout, PLOT_CONFIG } from './plotTheme';

/** Sample points, the fitted curve through them, and the predicted value. */
const Mathsimple = ({ dataPoints, ytrue, xtrue }) => {
  const theme = usePlotTheme();
  const points = Array.isArray(dataPoints) ? dataPoints : [];

  const xData = points.map((point) => point.x);
  const yData = points.map((point) => point.y);
  const xTrueData = Array.isArray(xtrue) ? xtrue : [xtrue];
  const yTrueData = Array.isArray(ytrue) ? ytrue : [ytrue];

  const pad = (values, fallback) => {
    const clean = values.filter((v) => Number.isFinite(v));
    if (clean.length === 0) return fallback;
    const min = Math.min(...clean);
    const max = Math.max(...clean);
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
            mode: 'lines',
            type: 'scatter',
            line: { color: theme.series, width: 2 },
            name: 'เส้นถดถอย',
            hoverinfo: 'skip',
          },
          {
            x: xData,
            y: yData,
            mode: 'markers',
            type: 'scatter',
            marker: { color: theme.muted, size: 7 },
            name: 'จุดข้อมูล',
            hovertemplate: 'x = %{x}<br>y = %{y}<extra></extra>',
          },
          {
            x: xTrueData,
            y: yTrueData,
            mode: 'markers',
            type: 'scatter',
            marker: {
              color: theme.point,
              size: 12,
              symbol: 'diamond',
              line: { color: theme.surface, width: 1 },
            },
            name: 'ค่าที่ทำนาย',
            hovertemplate: 'x = %{x}<br>ŷ = %{y}<extra></extra>',
          },
        ]}
        layout={plotLayout(theme, {
          xaxis: { title: 'x', range: pad([...xData, ...xTrueData], [0, 7]) },
          yaxis: { title: 'y', range: pad([...yData, ...yTrueData], [0, 7]) },
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

export default Mathsimple;
