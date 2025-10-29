import Plotly from 'plotly.js-dist';
import { records, type GapMinderRecord } from './gapminderData.ts';

const markerByContinent = {
  'Europe': 'circle',
  'Asia': 'square',
  'Africa': 'diamond',
  'Americas': 'triangle-up',
  'Oceania': 'star',
  'Ireland': 'hexagon'
}

const years = Array.from(
  records.map(r => r.year)
    .reduce((set: Set<number>, year: number) => {
      set.add(year)
      return set;
    }, new Set())
).sort((a, b) => a - b)

const calculateAvgLifeExp = (predicate: (value: GapMinderRecord) => boolean) => {
  return Array.from(records
    .filter(predicate)
    .map(r => ({
      year: r.year,
      lifeExpectancy: r.lifeExptancy
    }))
    .reduce((map: Map<number, number[]>, curr) => {
      if (map.has(curr.year)) {
        const list = map.get(curr.year)
        list.push(curr.lifeExpectancy)
        map.set(curr.year, list)
      } else {
        map.set(curr.year, [curr.lifeExpectancy]);
      }

      return map;
    }, new Map()).values())
    .map(arr => arr.reduce((acc: number, curr: number) => acc + curr, 0) / arr.length)
}

const continents = Array.from(records.map(r => r.continent)
  .reduce((set: Set<string>, continent: string) => {
    set.add(continent)
    return set;
  }, new Set())
)

const data = continents
  .map(continent => ({
    name: continent,
    avgs: calculateAvgLifeExp(r => r.continent === continent)
  }))
  .map(continent => ({
    x: years,
    y: continent.avgs,
    name: continent.name,
    mode: 'line',
    line: {
      color: '#fff5ee'
    },
    marker: {
      symbol: markerByContinent[continent.name],
      size: 12
    },
    type: 'scatter',
  }))

data.push({
  x: years,
  y: calculateAvgLifeExp(r => r.country === 'Ireland'),
  name: 'Ireland',
  mode: 'line',
  line: {
    color: '#fff5ee',
  },
  marker: {
    symbol: 'square',
    size: 12
  },
  type: 'scatter',
})

const layout = {
  width: 800,
  height: 700,
  responsive: true,
  paper_bgcolor: '#242424',
  plot_bgcolor: '#242424',
  font: {
    color: '#ffffff'
  },
  xaxis: {
    title: {
      text: 'Year',
      font: {
        size: 16,
        color: '#ffffff',
      },
    },
    color: '#ffffff',
    gridcolor: '#444444'
  },
  yaxis: {
    title: {
      text: 'Life Expectancy',
      font: {
        size: 16,
        color: '#ffffff',
      },
    },
    color: '#ffffff',
    gridcolor: '#444444'
  },
  title: {
    text: 'Developement of Life Expectancy by Region',
    font: {
      color: '#ffffff'
    }
  },
  legend: {
    title: {
      text: 'Regions'
    },
    font: {
      color: '#ffffff',
      size: 16
    }
  }
}

Plotly.newPlot(
  'container',
  data,
  layout
)
