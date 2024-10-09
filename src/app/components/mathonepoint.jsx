import Plot from 'react-plotly.js';

const MathGraphmanypoint = ({ dataPoints }) => {
  let xstart;
  let xend;
  let ystart;
  let yend;

  if (dataPoints && dataPoints.length > 0) {
    xstart = Math.min(...dataPoints.map(point => point.x)) - 0.5; // ค่าต่ำสุด - 0.5
    xend = Math.max(...dataPoints.map(point => point.x)) + 1; // ค่าสูงสุด + 1
    ystart = Math.min(...dataPoints.map(point => point.y)) - 1; // ค่าต่ำสุด - 1
    yend = Math.max(...dataPoints.map(point => point.y)) + 10; // ค่าสูงสุด + 10
  } else {
    xstart = 0;
    xend = 7;
    ystart = 0;
    yend = 7;
  }

  const xData = dataPoints.map(point => point.x);
  const yData = dataPoints.map(point => point.y);

  // คำนวณค่าใหม่สำหรับ One Point Iteration
  const onePointXData = [];
  const onePointYData = [];
  let currentX = xData[0]; // เริ่มต้นจากค่าต้น

  for (let i = 0; i < 10; i++) { // จำนวนรอบการทำ One Point Iteration
    onePointXData.push(currentX);
    const newY = currentX; // สมมติว่า g(x) = x (ต้องแก้ไขตามฟังก์ชันที่ใช้งานจริง)
    onePointYData.push(newY);
    currentX = newY; // อัปเดตค่า X
  }

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
          name: 'g(x)', // ชื่อแสดงใน legend
        },
        {
          x: onePointXData,
          y: onePointYData,
          mode: 'lines+markers',
          type: 'scatter',
          marker: { color: 'purple', size: 6 },
          line: { color: 'orange', width: 2 },
          name: 'One Point Iteration',
        },
        {
          x: [xstart, xend],
          y: [xstart, xend],
          mode: 'lines',
          type: 'scatter',
          line: { color: 'green', width: 2 },
          name: 'y = x',
        },
      ]}
      layout={{
        title: 'Graph of Function',
        height: 600,
        width: 1200,
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
        showlegend: true, // แสดง legend
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
