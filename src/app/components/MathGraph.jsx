import Plot from 'react-plotly.js';

const MathGraph = ({ dataPoints }) => {
  let xstart, xend, ystart, yend;

  if (dataPoints && dataPoints.length > 0) {
    xstart = dataPoints[0].x - 0.5;
    xend = dataPoints[dataPoints.length - 1].x + 1;
    ystart = dataPoints[0].y - 1;
    yend = dataPoints[dataPoints.length - 1].y + 10;
  } else {
    xstart = 0;
    xend = 7;
    ystart = 0;
    yend = 7;
  }

  const xData = dataPoints.map(point => point.x);
  const yData = dataPoints.map(point => point.y);

  return (
    <div className="w-full h-96 md:h-[600px] "> {/* Responsive container */}
      <Plot
        data={[
          {
            x: xData,
            y: yData,
            mode: 'lines+markers',
            type: 'scatter',
            marker: { color: 'red', size: 6 },
            line: { color: 'blue', width: 1, shape: 'spline' },
          }
        ]}
        layout={{
          title: 'Graph of Function',
          height: 600, // ความสูงของกราฟ
          width: '100%', // ทำให้กว้างเต็มที่
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
    </div>
  );
};

export default MathGraph;
