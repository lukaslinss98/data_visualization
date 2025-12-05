import Plotly from 'plotly.js-dist';
import {colorscale, countyAverages, maxAveragePrice, minAveragePrice} from "./data.ts";
import {getYear, subscribeToState} from "./sharedState.ts";

function buildData(year: number) {
  const countyAveragesForYear = countyAverages
  .map(countyAverage => ({
    county: countyAverage.county,
    averagePrice: countyAverage.averagePrice.find(averagePrice => averagePrice.year === year).average
  }))
  .sort((a, b) => b.averagePrice - a.averagePrice)
  .slice(0, 10)

  const sortedCounties = countyAveragesForYear.map(ca => ca.county)
  const sortedPrices = countyAveragesForYear.map(ca => ca.averagePrice)

  return [{
    x: sortedPrices,
    y: sortedCounties,
    type: 'bar',
    orientation: 'h',
    marker: {
      color: "#3b82f6",
      cmin: minAveragePrice,
      cmax: maxAveragePrice,
    },
    text: sortedPrices.map(price => `€${price.toLocaleString()}`),
    textposition: "auto",
    textfont: {color: "#222222"},
  }];
}

function buildLayout(year: number) {
  return {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    xaxis: {
      range: [minAveragePrice, maxAveragePrice],
      title: {
        text: "Average Price (€)",
        font: { color: "#ffffff" },
      },
      tickfont: {color: "#ffffff"},
    },
    yaxis: {
      categoryorder: "array",
      autorange: 'reversed',
      tickfont: {color: "#ffffff"},
    },
    title: {
      text: `<b>Top 10 Counties ${year}</b>`,
      font: {
        family: "system-ui, Avenir, Helvetica, Arial, sans-serif",
        size: 18,
        color: '#ffffff'
      },
    },
  }
}


subscribeToState(({year}) => {
  Plotly.react(
      'chart2',
      buildData(year),
      buildLayout(year),
      {responsive: true}
  )
})

Plotly.newPlot(
    'chart2',
    buildData(getYear()),
    buildLayout(getYear()),
    {responsive: true}
)

