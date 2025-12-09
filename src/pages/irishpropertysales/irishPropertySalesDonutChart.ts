import Plotly from "plotly.js-dist";
import {propertyDescCounts} from "./data.ts";
import {getSelectedCounty, getYear, subscribeToState} from "./sharedState.ts";

function buildData(year: number, county: string | null) {
  const countyFilter = county == null ?
          row => row :
          row => row.county === county

  const values = propertyDescCounts
  .filter(row => row.year === year)
  .filter(countyFilter)
  .map(row => [row.new, row.secondHand])
  .pop()

  return [{
    type: "pie",
    labels: ["New", "Second Hand"],
    values: values,
    hole: 0.4,
    marker: {
      colors: ["#10b981", "#3b82f6"],
    },
    textinfo: "percent",
    textposition: "inside",
    hoverinfo: "label+value+percent",
  }];
}

function buildLayout(year: number, county: string | null) {
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
    margin: {t: 50, b: 40},
    annotations: [
      {
        text: county != null ? county : 'National',
        x: 0.5,
        y: 0.5,
        xref: 'paper',
        yref: 'paper',
        xanchor: 'center',
        yanchor: 'middle',
        showarrow: false,
        font: {
          size: 16,
          color: '#ffffff'
        }
      }
    ]
  };
}

subscribeToState(({year, selectedCounty}) => {
  Plotly.react(
      'chart3',
      buildData(year, selectedCounty),
      buildLayout(year, selectedCounty),
      {responsive: true}
  )
})

Plotly.newPlot(
    'chart3',
    buildData(getYear(), getSelectedCounty()),
    buildLayout(getYear(), getSelectedCounty()),
    {
      response: true,
      displayModeBar: false,
    }
)
