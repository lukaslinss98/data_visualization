import Plotly from "plotly.js-dist";
import {propertyDescCounts} from "./data.ts";
import {getYear, subscribeToState} from "./sharedState.ts";

function buildData(year: number) {
  return [{
    type: "pie",
    labels: ["New", "Second Hand"],
    values: propertyDescCounts.filter(row => row.year === year).map(row => [row.new, row.secondHand]).pop(),
    hole: 0.5,
    marker: {
      colors: ["#10b981", "#3b82f6"],
    },
    textinfo: "percent",
    textposition: "inside",
    hoverinfo: "label+value+percent",
  }];
}

function buildLayout(year: number) {
  return {
    title: {
      text: `<b>New vs. Second Hand Sales ${year}</b>`,
      font: {
        family: "Inter, sans-serif",
        size: 18,
        color: "#ffffff",
      },
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    showlegend: true,
    legend: {
      font: {
        color: "#ffffff",
        size: 14
      },
    },
    margin: {t: 40, b: 40, l: 20, r: 20},
  };
}

subscribeToState(({year}) => {
  Plotly.react(
      'chart3',
      buildData(year),
      buildLayout(year),
      {responsive: true}
  )
})

Plotly.newPlot(
    'chart3',
    buildData(getYear()),
    buildLayout(getYear()),
    {
      response: true,
      displayModeBar: false,
    }
)
