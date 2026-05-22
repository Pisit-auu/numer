import Plot from 'react-plotly.js';
import { stationPlotColors, stationPlotLayout } from './plotTheme';

const MathGraph = ({ dataPoints }) => {
  const points = Array.isArray(dataPoints) ? dataPoints : [];
  let xstart, xend, ystart, yend;

  if (points.length > 0) {
    xstart = points[0].x - 0.5;
    xend = points[points.length - 1].x + 1;
    ystart = points[0].y - 1;
    yend = points[points.length - 1].y + 10;
  } else {
    xstart = 0;
    xend = 7;
    ystart = 0;
    yend = 7;
  }

  const xData = points.map(point => point.x);
  const yData = points.map(point => point.y);

  return (
    <div className="w-full h-96 md:h-[600px] "> 
      <Plot
        data={[
          {
            x: xData,
            y: yData,
            mode: 'lines+markers',
            type: 'scatter',
            marker: { color: stationPlotColors.amber, size: 7 },
            line: { color: stationPlotColors.blue, width: 2, shape: 'spline' },
          }
        ]}
        layout={stationPlotLayout({
          xaxis: {
            range: [xstart, xend],
          },
          yaxis: {
            range: [ystart, yend],
          },
        })}
        config={{
          scrollZoom: true,
        }}
      />
    </div>
  );
};

export default MathGraph;
