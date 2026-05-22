import Plot from 'react-plotly.js';
import { stationPlotColors, stationPlotLayout } from './plotTheme';

const MathGraphmanypoint = ({ dataPoints }) => {
  const points = Array.isArray(dataPoints) ? dataPoints : [];
  let xstart;
  let xend;
  let ystart;
  let yend;

  if (points.length > 0) {
    xstart = Math.min(...points.map(point => point.x)) - 0.5; 
    xend = Math.max(...points.map(point => point.x)) + 1;
    ystart = Math.min(...points.map(point => point.y)) - 1; 
    yend = Math.max(...points.map(point => point.y)) + 10; 
  } else {
    xstart = 0;
    xend = 7;
    ystart = 0;
    yend = 7;
  }

  const xData = points.map(point => point.x);
  const yData = points.map(point => point.y);

  return (
    <Plot
      data={[
        {
          x: xData,
          y: yData,
          mode: 'lines+markers',
          type: 'scatter',
          marker: { color: stationPlotColors.amber, size: 7 },
          line: { color: stationPlotColors.blue, width: 2, shape: 'spline' },
          name: 'g(x)', 
        },
        {
          x: xData,
          y: xData,
          mode: 'lines+markers',
          type: 'scatter',
          marker: { color: stationPlotColors.green, size: 7 },
          line: { color: stationPlotColors.green, width: 1.5 },
          name: 'x=x', 
        },
        {
          x: xData,
          y: xData,
          mode: 'lines+markers',
          type: 'scatter',
          marker: { color: stationPlotColors.red, size: 7 },
          line: { color: stationPlotColors.red, width: 1.5, shape: 'hv' },
          name: 'f(x)', 
        },

      ]}
      layout={stationPlotLayout({
        xaxis: {
          range: [xstart, xend],
        },
        yaxis: {
          range: [ystart, yend],
        },
        showlegend: true, 
      })}
      config={{
        scrollZoom: true,
      }}
    />
  );
};

export default MathGraphmanypoint;
