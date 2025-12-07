import Plotly from 'plotly.js-dist';
import {getYear, subscribeToState} from "./sharedState.ts";
import {colorscale, counties, countyAverages, maxAveragePrice, minAveragePrice} from "./data.ts";

const response = await fetch('https://gist.githubusercontent.com/vool/969e3be0cfac519560755cce0b91e097/raw/a6059b80a9199e5021ea4d5de9654d64e99d4ac1/ireland.geojson')
const geoJson = await response.json()

function buildMapData(year: number) {
  return [{
    type: 'choropleth',
    geojson: geoJson,
    locations: counties,
    z: countyAverages
    .flatMap(e => e.averagePrice)
    .filter(e => e.year === year)
    .map(e => e.average),
    featureidkey: 'properties.NAME_1',
    showscale: true,
    colorscale: colorscale,
    colorbar: {
      title: {
        text: "Average price (€)",
        side: "right",
        font: {color: "#ffffff"},
      },
      tickfont: {color: "#ffffff"},
      x: 1.02,
      xanchor: "center",
      y: 0.5,
      yanchor: "middle",
      thickness: 10,
      len: 0.7,
    },
    zmin: minAveragePrice,
    zmax: maxAveragePrice,
    hovertemplate: '<b>%{location}</b><br>Avg Price: €%{z:,.0f}<extra></extra>',
    marker: {
      line: {
        width: 1.4,
        color: '#171717'
      }
    }
  }]
}

function buildLayout(year: number) {
  return {
    title: {
      text: `<b>Average Property Price by County ${year}</b>`,
      font: {
        size: 18,
        color: '#ffffff'
      },
    },
    geo: {
      fitbounds: 'locations',
      projection: {type: 'mercator'},
      visibility: false,
      showcoastlines: false,
      showcountries: false,
      showland: false,
      showframe: false,
      showsubunits: false,
      bgcolor: 'rgba(0,0,0,0)',
    },
    // width: 650,
    // height: 650,
    paper_bgcolor: 'rgba(0,0,0,0)',
    margin: {t: 40},
  }
}

subscribeToState(({year}) => {
  Plotly.react(
      'map',
      buildMapData(year),
      buildLayout(year)
  )
})

Plotly.newPlot(
    'map',
    buildMapData(getYear()),
    buildLayout(getYear()),
    {
      response: true,
      displayModeBar: false,
    }
)