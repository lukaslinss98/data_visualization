import Plotly from "plotly.js-dist";
import {getSelectedCounty, getYear, subscribeToState} from "./sharedState.ts";
import {yearPriceBins} from "./data.ts";

function buildData(currYear: number, currCounty: string | null) {
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

  const countyFilter = currCounty == null ?
      row => row :
      row => row.county === currCounty

  return [
    {
      type: "bar",
      name: 'Second Hand',
      x: binLabels,
      y: yearPriceBins
      .filter(({year}) => year == currYear)
      .filter(countyFilter)
      .map(({priceBinsSecondHand}) => priceBinsSecondHand)
      .reduce((acc, bins) => acc.map((val, i) => val + bins[i]), [0, 0, 0, 0, 0, 0, 0, 0]),
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
      y: yearPriceBins
      .filter(({year}) => year == currYear)
      .filter(countyFilter)
      .map(({priceBinsNew}) => priceBinsNew)
      .reduce((acc, bins) => acc.map((val, i) => val + bins[i]), [0, 0, 0, 0, 0, 0, 0, 0]),
      marker: {
        color: "#10b981",
        opacity: 1,
        line: {color: "#1e3a8a", width: 0}
      },
      hovertemplate: "%{x}<br>Sales: %{y}<extra></extra>",
    }
  ];

}

function buildLayout(year: number, county: string | null) {
  const scope = county != null ? county : 'National'
  return {
    barmode: "overlay",
    bargap: 0,
    title: {
      text: `<b>${scope} Price Distribution ${year}</b>`,
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
        font: {
          color: "#ffffff",
          size: 14
        },
      },
      tickfont: {color: "#ffffff"},
      autorange: true,
      gridcolor: "rgba(255, 255, 255, 0.4)",
    },
    legend: {
      font: {
        color: "#ffffff",
        size: 14
      },
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    margin: {t: 50},
  };
}

subscribeToState(({year, selectedCounty}) => {
  const data = buildData(year, selectedCounty);
  const layout = buildLayout(year, selectedCounty);

  Plotly.animate(
      'chart4',
      {
        data: data,
        layout: layout
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
  ).then(() => {
    Plotly.relayout('chart4', {'yaxis.autorange': true});
  });

})

Plotly.newPlot(
    "chart4",
    buildData(getYear(), getSelectedCounty()),
    buildLayout(getYear(), getSelectedCounty()),
    {
      response: true,
      displayModeBar: false,
    }
);
