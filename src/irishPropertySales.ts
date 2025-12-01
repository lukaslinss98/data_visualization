import Plotly from 'plotly.js-dist';
import { irishPropertySales } from "./irishPropertySalesData";
import { feature } from 'topojson-client';

const propertySalesByCounty = irishPropertySales.getPropertySalesByCounty()

const response = await fetch('https://gist.githubusercontent.com/vool/969e3be0cfac519560755cce0b91e097/raw/a6059b80a9199e5021ea4d5de9654d64e99d4ac1/ireland.geojson')
const geoJson = await response.json()
const locations = Array.from(propertySalesByCounty.keys())

const data = [{
  type: 'choropleth',
  geojson: geoJson,
  locations: irishPropertySales.getCounties(),
  z: locations.map(() => 10),
  featureidkey: 'properties.NAME_1',
  showscale: false,
  marker: {
    line: { width: 0.5, color: 'black' }
  }
}]

const layout = {
  geo: {
    fitbounds: 'locations',
    projection: { type: 'mercator' },
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
  // plot_bgcolor: 'rgba(0,0,0,0)',  
  margin: { r: 0, t: 0, l: 0, b: 0 },
}


Plotly.newPlot(
  'container',
  data,
  layout
)
