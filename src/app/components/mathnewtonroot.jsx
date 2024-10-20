import Plot from 'react-plotly.js';

const Mathnewtonroot = ({ dataPoints }) => {
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
      marker: { color: 'red', size: 6 },
      line: { color: 'blue', width: 1, shape: 'spline' },
      name: 'g(x)', 
    },
  ];

  for (let i = 0; i < Xi.length; i++) {
    plotData.push({
      x: Xi[i], 
      y: Yi[i],
      mode: 'lines+markers',
      type: 'scatter',
      marker: { color: 'black', size: 6 },
      line: { color: 'green', width: 1 },
      name: `f'(x${i})`, 
    });
  }

  return (
    <Plot
      data={plotData}
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

export default Mathnewtonroot;
