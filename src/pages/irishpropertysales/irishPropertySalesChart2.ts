import Plotly from 'plotly.js-dist';
import {countyAverages, maxAveragePrice, minAveragePrice} from "./data.ts";
import {getYear, subscribeToState} from "./sharedState.ts";

function buildData(year: number) {
  const countyAveragesForYear = countyAverages
  .map(countyAverage => ({
    county: countyAverage.county,
    averagePrice: countyAverage.averagePrice.find(averagePrice => averagePrice.year === year).average
  }))
  .sort((a, b) => b.averagePrice - a.averagePrice)
  .slice(0, 10)

  const sortedCounties = countyAveragesForYear.map(({county}, i) => `${i + 1}. ${county}`)
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
    text: sortedPrices.map(price => `€${Math.round(price / 1000).toLocaleString()}k`),
    // textposition: "out",
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
        font: {color: "#ffffff"},
      },
      tickfont: {color: "#ffffff"},
    },
    yaxis: {
      title: {
        text: "Counties",
        font: {color: "#ffffff"},
        standoff: 30,
      },
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
    margin: {l: 120, t: 40},
  }
}

subscribeToState(({year}) => {
  Plotly.animate(
      'chart2',
      {
        data: buildData(year),
        layout: buildLayout(year)
      },
      {
        transition: {
          duration: 500,
          easing: 'cubic-in-out'
        },
        frame: {
          duration: 500,
          redraw: true
        }
      }
  )
})

Plotly.newPlot(
    'chart2',
    buildData(getYear()),
    buildLayout(getYear()),
    {
      response: true,
      displayModeBar: false,
    }
)

