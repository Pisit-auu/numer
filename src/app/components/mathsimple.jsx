import Plot from 'react-plotly.js';
import { stationPlotColors, stationPlotLayout } from './plotTheme';

const Mathsimple = ({ dataPoints,ytrue, xtrue }) => {
  const points = Array.isArray(dataPoints) ? dataPoints : [];
  let xstart, xend, ystart, yend;
  if (points.length > 0) {
    xstart = xtrue - 0.5;
    xend = points[points.length - 1].x + 1;
    ystart = ytrue - 1;
    yend = points[points.length - 1].y + 10;
  } else {
    xstart = 0;
    xend = 7;
    ystart = 0;
    yend = 7;
  }

  const xData = points.map(point => point.x);
  const yData = points.map(point => point.y);

  const xTrueData = Array.isArray(xtrue) ? xtrue : [xtrue];
  const yTrueData = Array.isArray(ytrue) ? ytrue : [ytrue];
  return (
    <div className="w-full h-96 md:h-[600px] "> 
      <Plot
        data={[
            {
                x: xData,
                y: yData,
                mode: 'markers',
                type: 'scatter',
                marker: { color: stationPlotColors.amber, size: 10 },
                name: 'point', 
              }, {
                x: xTrueData,
                y: yTrueData,
                mode: 'markers',
                type: 'scatter',
                marker: { color: stationPlotColors.blue, size: 10 },
                name: 'result', 
              },{
                x: xData,
                y: yData,
                mode: 'lines',
                type: 'scatter',
                marker: { color: stationPlotColors.green, size: 10 },
                line: { color: stationPlotColors.green, width: 2 },
                name: 'regression', 
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
    </div>
  );
};

export default Mathsimple;
