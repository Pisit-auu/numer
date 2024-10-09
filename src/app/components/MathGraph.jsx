import Plot from 'react-plotly.js';

const MathGraph = ({ dataPoints }) => {
  let xstart
  let xend
  let ystart
  let yend
  if(dataPoints&& dataPoints.length>0){
    xstart = dataPoints[0].x-0.5
    xend = dataPoints[dataPoints.length - 1].x +1;
    ystart = dataPoints[0].y-1
    yend = dataPoints[dataPoints.length - 1].y + 10;

  }else{
    xstart = 0;
    xend= 7;
    ystart=0
    yend=7;

  }
  const xData = dataPoints.map(point => point.x);
  const yData = dataPoints.map(point => point.y);

  return (
    <Plot
      data={[
        {
          x: xData,
          y: yData,
          mode: 'lines+markers',
          type: 'scatter',
          marker: { color: 'red' },
          line: { color: 'blue', width: 2, shape: 'spline' },
        },
      ]}
      layout={{
        title: 'Graph of Function',
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
        showlegend: false,
        plot_bgcolor: 'rgba(255, 255, 255, 0.8)',
        margin: { t: 80, b: 80, l: 80, r: 80 },
      }}
      config={{
        scrollZoom: true,
      }}
    />
  );
};

export default MathGraph;
