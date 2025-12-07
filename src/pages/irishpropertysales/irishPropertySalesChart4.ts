import Plotly from "plotly.js-dist";
import {getYear, subscribeToState} from "./sharedState.ts";
import {maxBinCount, yearPriceBins} from "./data.ts";

function buildData(year: number) {
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

  return [
    {
      type: "bar",
      name: 'Second Hand',
      x: binLabels,
      y: yearPriceBins.find(yearBin => yearBin.year == year).priceBinsSecondHand,
      marker: {
        color: "#3b82f6",
        opacity: 1,
        line: {color: "#1e3a8a", width: 0}
      },
      hovertemplate: "%{x}<br>Sales: %{y}<extra></extra>",
    },
    {
      type: "bar",
      name: 'New',
      x: binLabels,
      y: yearPriceBins.find(yearBin => yearBin.year == year).priceBinsNew,
      marker: {
        color: "#10b981",
        opacity: 1,
        line: {color: "#1e3a8a", width: 0}
      },
      hovertemplate: "%{x}<br>Sales: %{y}<extra></extra>",
    }
  ];

}

function buildLayout(year: number) {
  return {
    barmode: "overlay",
    bargap: 0,
    title: {
      text: `<b>Price Distribution ${year}</b>`,
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
        text: "Number of ales",
        font: {
          color: "#ffffff",
        },
      },
      tickfont: {color: "#ffffff"},
      range: [0, maxBinCount],
    },
    legend: {
      font: {
        color: "#ffffff",
        size: 14
      },
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    margin: {t: 40},
  };
}

subscribeToState(({year}) => {
  Plotly.animate(
      'chart4',
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
    "chart4",
    buildData(getYear()),
    buildLayout(getYear()),
    {
      response: true,
      displayModeBar: false,
    }
);
