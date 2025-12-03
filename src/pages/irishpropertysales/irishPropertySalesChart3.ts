import Plotly from 'plotly.js-dist';

const trace1 = {
  x: [1, 2, 3, 4],
  y: [10, 15, 13, 17],
  type: 'scatter'
};

const trace2 = {
  x: [1, 2, 3, 4],
  y: [16, 5, 11, 9],
  type: 'scatter'
};

const data = [trace1, trace2];

const layout = {
  title: {
    text: "Line Chart",
    font: {
      size: 18,
      color: '#000000'
    },
  },
}

Plotly.newPlot(
  'chart3',
  data,
  layout,
  { responsive: true }
)
