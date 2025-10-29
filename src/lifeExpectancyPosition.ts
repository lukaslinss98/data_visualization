import Plotly from 'plotly.js-dist';
import { records, type GapMinderRecord } from './gapminder';

const colorByContinent = {
  'Europe': '#1f77b4',
  'Asia': '#ff7f0e',
  'Africa': '#2ca02c',
  'Americas': '#9467bd',
  'Oceania': '#17becf',
  'Ireland': '#d62728'
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
  .flatMap((continent, i) => ([
    {
      x: years,
      y: continent.avgs,
      name: continent.name,
      mode: 'line',
      xaxis: `x${i === 0 ? '' : i + 1}`,
      yaxis: `y${i === 0 ? '' : i + 1}`,
      showlegend: true,
      line: {
        color: colorByContinent[continent.name]
      },
      type: 'scatter',
    },
    {
      x: years,
      y: calculateAvgLifeExp(r => r.country === 'Ireland'),
      name: 'Ireland',
      mode: 'line',
      xaxis: `x${i === 0 ? '' : i + 1}`,
      yaxis: `y${i === 0 ? '' : i + 1}`,
      showlegend: i == 0,
      line: {
        color: colorByContinent['Ireland'],
      },
      type: 'scatter',
    }
  ]))


const layout = {
  width: 1000,
  height: 700,
  grid: {
    rows: 2,
    columns: 3,
    pattern: 'independent',
    roworder: 'top to bottom',
    xgap: 0.4,  
    ygap: 0.3
  },
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
  xaxis2: {
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
  yaxis2: {
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
  xaxis3: {
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
  yaxis3: {
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
  xaxis4: {
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
  yaxis4: {
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
  xaxis5: {
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
  yaxis5: {
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
    text: 'Developement of Life Expectancy: Continents vs. Ireland',
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
