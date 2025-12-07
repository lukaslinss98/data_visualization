import Plotly from 'plotly.js-dist';
import {
  countyAverages,
  countyYearVolumn,
  maxAveragePrice, maxVolumn,
  minAveragePrice,
  minVolumn
} from "./data.ts";
import {getYear, subscribeToState} from "./sharedState.ts";

function buildData(year: number) {
  const countyAveragesForYear = countyAverages
  .map(countyAverage => ({
    county: countyAverage.county,
    averagePrice: countyAverage.averagePrice.find(averagePrice => averagePrice.year === year).average,
    volumn: countyYearVolumn.find(({county}) => county == countyAverage.county).volumnPerYear.find(volumn => volumn.year === year).volumn
  }))
  .sort((a, b) => b.averagePrice - a.averagePrice)
  .slice(0, 15)

  const sortedCounties = countyAveragesForYear.map(({county}, i) => `${i + 1}. ${county}`)
  const sortedPrices = countyAveragesForYear.map(ca => ca.averagePrice)
  const sortedVolumns = countyAveragesForYear.map(ca => ca.volumn)

  return [
    {
      x: sortedPrices,
      y: sortedCounties,
      xaxis: 'x1',
      yaxis: 'y1',
      type: 'bar',
      orientation: 'h',
      marker: {
        color: "#3b82f6",
        cmin: minAveragePrice,
        cmax: maxAveragePrice,
      },
      text: sortedPrices.map(price => `${Math.round(price / 1000).toLocaleString()}k`),
      textfont: {color: "#222222"},
      name: 'Mean Price'
    },
    {
      x: sortedVolumns,
      y: sortedCounties,
      xaxis: 'x2',
      yaxis: 'y1',
      mode: 'lines+markers+text',
      text: sortedVolumns.map(vol => `${(vol/1000).toFixed(1)}k`),
      textposition: 'bottom right',
      textfont: {
        color: '#ffffff',
        size: 11
      },
      line: {
        color: '#10b981',
      },
      name: 'Volumn'
    }
  ];
}

function buildLayout(year: number) {
  return {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    xaxis1: {
      range: [minAveragePrice, maxAveragePrice],
      domain: [0, 0.65],
      showline: true,
      gridcolor: "rgba(255, 255, 255, 0.4)",
      title: {
        text: "Mean Price (€)",
        font: {color: "#ffffff"},
      },
      tickfont: {color: "#ffffff"},
    },
    xaxis2: {
      range: [minVolumn, maxVolumn * 1.2],
      domain: [0.7, 1],
      showgrid: true,
      gridcolor: "rgba(255, 255, 255, 0.4)",
      showline: true,
      side: 'bottom',
      title: {
        text: "Sales Volumn",
        font: {color: "#ffffff"},
      },
      tickfont: {color: "#ffffff"},
      showticklabels: true,
    },
    yaxis1: {
      title: {
        text: "Counties",
        font: {color: "#ffffff"},
        standoff: 30,
      },
      categoryorder: "array",
      autorange: 'reversed',
      tickfont: {color: "#ffffff"},
    },
    legend: {
      font: {
        color: "#ffffff",
        size: 14,
      },
    },
    title: {
      text: `<b>Top 15 Counties ${year}</b>`,
      font: {
        family: "system-ui, Avenir, Helvetica, Arial, sans-serif",
        size: 18,
        color: '#ffffff'
      },
    },
    margin: {l: 120, t: 50},
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

