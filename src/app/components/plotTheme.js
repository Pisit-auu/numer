const axisStyle = {
  gridcolor: 'rgba(77, 184, 255, 0.14)',
  linecolor: 'rgba(77, 184, 255, 0.35)',
  tickfont: { color: '#c9d6df' },
  titlefont: { color: '#e8eef2' },
  zeroline: true,
  zerolinecolor: 'rgba(255, 184, 77, 0.75)',
};

export const stationPlotColors = {
  blue: '#4db8ff',
  amber: '#ffb84d',
  green: '#00ff88',
  red: '#ff637d',
  metal: '#e8eef2',
};

export function stationPlotLayout(overrides = {}) {
  return {
    paper_bgcolor: 'rgba(8, 11, 15, 0)',
    plot_bgcolor: 'rgba(8, 11, 15, 0.88)',
    font: {
      color: stationPlotColors.metal,
      family: 'Arial, Helvetica, sans-serif',
    },
    title: {
      text: 'Graph of Function',
      font: { color: stationPlotColors.metal },
    },
    height: 600,
    autosize: true,
    showlegend: false,
    margin: { t: 70, b: 70, l: 70, r: 45 },
    legend: {
      bgcolor: 'rgba(8, 11, 15, 0.75)',
      bordercolor: 'rgba(77, 184, 255, 0.25)',
      borderwidth: 1,
      font: { color: stationPlotColors.metal },
    },
    ...overrides,
    xaxis: {
      ...axisStyle,
      ...(overrides.xaxis || {}),
    },
    yaxis: {
      ...axisStyle,
      ...(overrides.yaxis || {}),
    },
  };
}
