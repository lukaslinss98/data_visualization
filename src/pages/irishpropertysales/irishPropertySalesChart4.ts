import Plotly from "plotly.js-dist";
import {getYear, subscribeToState} from "./sharedState.ts";
import {maxBinCount, yearPriceBins} from "./data.ts";

function buildData(year: number) {
  // Bin labels (adjust to match your Python bins)
  const binLabels = [
    "0-100k",
    "100-200k",
    "200-300k",
    "300-400k",
    "400-500k",
    "500-750k",
    "750k-1M",
    "1M+"
  ];

  return [{
    type: "bar",
    x: binLabels,
    y: yearPriceBins.find(yearBin => yearBin.year == year).priceBins,
    marker: {
      color: "#3b82f6",
      line: {color: "#1e3a8a", width: 1}
    },
    hovertemplate: "%{x}<br>Sales: %{y}<extra></extra>",
  }];
}

const layout = {
  title: {
    text: "<b>Price Distribution</b>",
    font: {
      family: "Inter, sans-serif",
      size: 18,
      color: "#ffffff",
    },
  },
  xaxis: {
    title: {
      text: "Price Range (€)",
      font: {color: "#ffffff"},
    },
    tickfont: {color: "#ffffff"},
  },
  yaxis: {
    title: {
      text: "Number of Sales",
      font: {color: "#ffffff"},
    },
    tickfont: {color: "#ffffff"},
    range: [0, maxBinCount],
  },
  paper_bgcolor: "rgba(0,0,0,0)",
  plot_bgcolor: "rgba(0,0,0,0)",
  margin: {t: 60, b: 60, l: 60, r: 40},
};

subscribeToState(({year}) => {
  const newData = buildData(year);
  Plotly.react("chart4", newData, layout);
});

Plotly.newPlot(
    "chart4",
    buildData(getYear()),
    layout,
    {responsive: true}
);
