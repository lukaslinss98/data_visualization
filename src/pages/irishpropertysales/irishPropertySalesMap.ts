import Plotly from 'plotly.js-dist';
import {subscribeToState} from "./sharedState.ts";
import {countyAverages, counties, maxAveragePrice, minAveragePrice} from "./data.ts";

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
        colorscale: 'Greens',
        colorbar: {
            title: "Average price (€)",
            side: "left",
            tickfont: {
                color: "#ffffff",
            },
        },
        zmin: minAveragePrice,
        zmax: maxAveragePrice,
        showscale: true,
        marker: {
            line: {width: 0.5, color: 'black'}
        }
    }]
}

const layout = {
    title: {
        text: "Map",
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
    width: 600,
    height: 600,
    paper_bgcolor: 'rgba(0,0,0,0)',
    margin: {r: 0, t: 0, l: 0, b: 0},
}

subscribeToState(({year}) => {
    Plotly.react(
        'map',
        buildMapData(year),
        layout
    )
})

Plotly.newPlot(
    'map',
    buildMapData(2010),
    layout,
    {response: true}
)