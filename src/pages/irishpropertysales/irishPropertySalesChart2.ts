import Plotly from 'plotly.js-dist';
import {countyAverages, maxAveragePrice, minAveragePrice} from "./data.ts";
import {getMetric, getYear, type Metric, subscribeToState} from "./sharedState.ts";

function buildData(year: number) {
    const countyAveragesForYear = countyAverages
        .map(countyAverage => ({
            county: countyAverage.county,
            averagePrice: countyAverage.averagePrice.find(averagePrice => averagePrice.year === year).average
        }))
        .sort((a, b) => b.averagePrice - a.averagePrice)
        .slice(0, 10)

    const sortedCounties = countyAveragesForYear.map(ca => ca.county)
    const sortedPrices = countyAveragesForYear.map(ca => ca.averagePrice)

    return [{
        x: sortedPrices,
        y: sortedCounties,
        type: 'bar',
        orientation: 'h',
        marker: {
            color: sortedPrices,
            colorscale: "Greens",
            cmin: minAveragePrice,
            cmax: maxAveragePrice,
        },
        text: sortedPrices.map(price => `€${price.toLocaleString()}`),
        textposition: "auto",
        textfont: {color: "#222222"},
    }];
}

function buildLayout(metric: Metric) {
    return {
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        xaxis: {
            range: [minAveragePrice, maxAveragePrice],
            tickfont: {color: "#ffffff"},
        },
        yaxis: {
            categoryorder: "array",
            autorange: 'reversed',
            tickfont: {color: "#ffffff"},
        },
        title: {
            text: `<b>${metric} Top 10 Counties</b>`,
            font: {
                family: "system-ui, Avenir, Helvetica, Arial, sans-serif",
                size: 18,
                color: '#ffffff'
            },
        },
    }
}


subscribeToState(({year, metric}) => {
    Plotly.react(
        'chart2',
        buildData(year),
        buildLayout(metric)
    )
})

Plotly.newPlot(
    'chart2',
    buildData(getYear()),
    buildLayout(getMetric()),
    {responsive: true}
)

