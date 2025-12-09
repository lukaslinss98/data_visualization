import Plotly from 'plotly.js-dist';
import geoJson from '../../data/ie.json'
import {getYear, setCounty, subscribeToState} from "./sharedState.ts";
import {colorscale, counties, countyAverages, maxAveragePrice, minAveragePrice} from "./data.ts";

function buildTrace(year: number) {
  return [{
    type: 'choropleth',
    geojson: geoJson,
    locations: counties,
    z: countyAverages
    .flatMap(({averagePrice}) => averagePrice)
    .filter(e => e.year === year)
    .map(({average}) => average),
    featureidkey: 'properties.name',
    showscale: true,
    colorscale: colorscale,
    colorbar: {
      title: {
        text: "Mean price (€)",
        side: "left",
        font: {color: "#ffffff"},
      },
      tickfont: {color: "#ffffff"},
      x: -0.1,
      xanchor: "right",
      y: 0.5,
      yanchor: "middle",
      thickness: 10,
      len: 0.7,
    },
    zmin: minAveragePrice,
    zmax: maxAveragePrice,
    hovertemplate: '<b>%{location}</b><br>Mean Price: €%{z:,.0f}<extra></extra>',
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
      projection: {
        type: 'mercator',
        scale: 55
      },
      center: {lat: 53.4, lon: -8.0},
      visibility: false,
      showcoastlines: false,
      showcountries: false,
      showland: false,
      showframe: false,
      showsubunits: false,
      bgcolor: 'rgba(0,0,0,0)',
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    margin: {t: 50},
  }
}

subscribeToState(({year}) => {
  Plotly.react(
      'map',
      buildTrace(year),
      buildLayout(year)
  )
})


Plotly.newPlot(
    'map',
    buildTrace(getYear()),
    buildLayout(getYear()),
    {
      response: true,
      displayModeBar: false,
    }
)
let hoverTimeout: number | null = null

const mapElement = document.getElementById('map') as any

mapElement.on('plotly_hover', (data) => {
  if (hoverTimeout != null) {
    clearTimeout(hoverTimeout)
    hoverTimeout = null
  }
  const point = data.points[0];
  const county = point.location;
  setCounty(county);
});

mapElement.on('plotly_unhover', () => {
  hoverTimeout = window.setTimeout(() => {
    setCounty(null);
    hoverTimeout = null
  }, 200)
});
