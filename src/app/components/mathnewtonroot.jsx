import Plot from 'react-plotly.js';
import { stationPlotColors, stationPlotLayout } from './plotTheme';

const Mathnewtonroot = ({ dataPoints }) => {
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
  const X = [...xData].sort((a, b) => a - b);
  const Y = [...yData].sort((a, b) => a - b);

  let Xi = [];
  let Yi = [];
  
  for (let i = 0; i < X.length - 1; i++) {
    Xi.push([xData[i], xData[i + 1]]); 
    Yi.push([yData[i], 0]);
  }

  const plotData = [
    {
      x: X,
      y: Y,
      mode: 'lines+markers',
      type: 'scatter',
      marker: { color: stationPlotColors.amber, size: 7 },
      line: { color: stationPlotColors.blue, width: 2, shape: 'spline' },
      name: 'g(x)', 
    },
  ];

  for (let i = 0; i < Xi.length; i++) {
    plotData.push({
      x: Xi[i], 
      y: Yi[i],
      mode: 'lines+markers',
      type: 'scatter',
      marker: { color: stationPlotColors.metal, size: 6 },
      line: { color: stationPlotColors.green, width: 1.5 },
      name: `f'(x${i})`, 
    });
  }

  return (
    <Plot
      data={plotData}
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

export default Mathnewtonroot;
