import Plotly from 'plotly.js-dist';
import {
  countyAverages,
  countyYearVolume,
  maxAveragePrice,
  maxVolume,
  minAveragePrice,
} from "./data.ts";
import {getSelectedCounty, getYear, subscribeToState} from "./sharedState.ts";

function buildData(year: number, selectedCounty: string | null) {
  const countyAveragesForYear = countyAverages
  .map(countyAverage => ({
    county: countyAverage.county,
    averagePrice: countyAverage.averagePrice.find(averagePrice => averagePrice.year === year).average,
    volume: countyYearVolume.find(({county}) => county == countyAverage.county).volumnPerYear.find(volumn => volumn.year === year).volumn
  }))

  const prices = countyAveragesForYear.map(({averagePrice}) => averagePrice)
  const counties = countyAveragesForYear.map(({county}) => county)
  const volumes = countyAveragesForYear.map(({volume}) => volume)

  const barColor = countyAveragesForYear.map(({county}) => {
    return selectedCounty == null || selectedCounty == county ? '#3b82f6' : '#3b82f6' + '40';
  })

  const lineColor = countyAveragesForYear.map(({county}) => {
    return selectedCounty == null || selectedCounty == county ? '#10b981' : '#10b981' + '40';
  })

  return [
    {
      x: prices,
      y: counties,
      xaxis: 'x1',
      yaxis: 'y1',
      type: 'bar',
      orientation: 'h',
      marker: {
        color: barColor,
        cmin: minAveragePrice,
        cmax: maxAveragePrice,
      },
      text: prices.map(price => `${Math.round(price / 1000).toLocaleString()}k`),
      textfont: {
        size: 14,
        color: "#222222"
      },
      name: 'Mean Price'
    },
    {
      x: volumes,
      y: counties,
      xaxis: 'x2',
      yaxis: 'y1',
      mode: 'lines+markers+text',
      text: volumes.map(vol => `${(vol / 1000).toFixed(1)}k`),
      textposition: 'bottom right',
      textfont: {
        color: '#ffffff',
        size: 11
      },
      line: {
        color: '#10b981',
        width: 2.2
      },
      marker: {
        color: lineColor,
        size: 12,
      },
      name: 'Volume'
    }
  ];
}

function buildLayout(year: number) {
  return {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    xaxis1: {
      range: [-1000, maxAveragePrice],
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
      range: [-1000, maxVolume * 1.2],
      domain: [0.7, 1],
      showgrid: true,
      gridcolor: "rgba(255, 255, 255, 0.4)",
      showline: true,
      side: 'bottom',
      title: {
        text: "Sales Volume",
        font: {color: "#ffffff"},
      },
      tickfont: {color: "#ffffff"},
      showticklabels: true,
    },
    yaxis1: {
      title: {
        text: "Counties",
        font: {
          color: "#ffffff",
          size: 16
        },
        standoff: 30,
      },
      categoryorder: "array",
      autorange: 'reversed',
      tickfont: {
        size: 14,
        color: "#ffffff"
      },
    },
    showlegend: false,
    title: {
      text: `<b>Average Prices and Sales Volumes ${year}</b>`,
      font: {
        family: "system-ui, Avenir, Helvetica, Arial, sans-serif",
        size: 18,
        color: '#ffffff'
      },
    },
    margin: {l: 150, t: 50},
  }
}

subscribeToState(({year, selectedCounty}) => {
  Plotly.animate(
      'chart2',
      {
        data: buildData(year, selectedCounty),
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
    buildData(getYear(), getSelectedCounty()),
    buildLayout(getYear()),
    {
      response: true,
      displayModeBar: false,
    }
)

