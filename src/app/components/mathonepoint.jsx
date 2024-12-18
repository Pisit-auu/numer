import Plot from 'react-plotly.js';

const MathGraphmanypoint = ({ dataPoints }) => {
  let xstart;
  let xend;
  let ystart;
  let yend;

  if (dataPoints && dataPoints.length > 0) {
    xstart = Math.min(...dataPoints.map(point => point.x)) - 0.5; 
    xend = Math.max(...dataPoints.map(point => point.x)) + 1;
    ystart = Math.min(...dataPoints.map(point => point.y)) - 1; 
    yend = Math.max(...dataPoints.map(point => point.y)) + 10; 
  } else {
    xstart = 0;
    xend = 7;
    ystart = 0;
    yend = 7;
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
          marker: { color: 'red', size: 6 },
          line: { color: 'blue', width: 1, shape: 'spline' },
          name: 'g(x)', 
        },
        {
          x: xData,
          y: xData,
          mode: 'lines+markers',
          type: 'scatter',
          marker: { color: 'red', size: 6 },
          line: { color: 'green', width: 1 },
          name: 'x=x', 
        },
        {
          x: xData,
          y: xData,
          mode: 'lines+markers',
          type: 'scatter',
          marker: { color: 'red', size: 6 },
          line: { color: 'red', width: 1, shape: 'hv' },
          name: 'f(x)', 
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
  );
};

export default MathGraphmanypoint;
