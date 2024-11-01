import Plot from 'react-plotly.js';

const Mathsimple = ({ dataPoints,ytrue, xtrue }) => {
  let xstart, xend, ystart, yend;
  if (dataPoints && dataPoints.length > 0) {
    xstart = xtrue - 0.5;
    xend = dataPoints[dataPoints.length - 1].x + 1;
    ystart = ytrue - 1;
    yend = dataPoints[dataPoints.length - 1].y + 10;
  } else {
    xstart = 0;
    xend = 7;
    ystart = 0;
    yend = 7;
  }

  const xData = Array.isArray(dataPoints) ? dataPoints.map(point => point.x) : [];
  const yData = Array.isArray(dataPoints) ? dataPoints.map(point => point.y) : [];

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
                marker: { color: 'red', size: 10 },
                name: 'point', 
              }, {
                x: xTrueData,
                y: yTrueData,
                mode: 'markers',
                type: 'scatter',
                marker: { color: 'blue', size: 10 },
                name: 'result', 
              },{
                x: xData,
                y: yData,
                mode: 'lines',
                type: 'scatter',
                marker: { color: 'black', size: 10 },
                name: 'regression', 
              },
        ]}
        layout={{
          title: 'Graph of Function',
          height: 600, 
          width: '100%', 
          xaxis: {
            range: [xstart, xend],
            zeroline: true,
            zerolinecolor: 'black',
          },
          yaxis: {
            range: [ystart, yend],
            zeroline: true,
            zerolinecolor: 'black',
          },
          showlegend: true,
          plot_bgcolor: 'rgba(255, 255, 255, 0.8)',
          margin: { t: 80, b: 80, l: 80, r: 80 },
        }}
        config={{
          scrollZoom: true,
        }}
      />
    </div>
  );
};

export default Mathsimple;
