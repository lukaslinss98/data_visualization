import * as d3 from 'd3';
import {type GapMinderRecord, records} from "./gapminderData.ts";

const config = {
    width: 1000,
    height: 700,
    marginleft: 50,
    marginRight: 200,
    marginTop: 100,
    marginBottom: 50,
}

const years = Array.from(new Set(records.map(r => r.year))).sort((a, b) => a - b);
let currentYearIndex = 0;

const tooltip = d3.select('#container')
    .append('div')
    .style('opacity', 0)
    .attr('class', 'tooltip')
    .style('background-color', 'white')
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "black")
    .style("position", "absolute")

const showTooltip = (event, record: GapMinderRecord) => {
    tooltip
        .transition()
        .duration(200)
    tooltip.style('opacity', 1)
    tooltip.html(`${record.country}<br/>GDP: ${record.gdpPerCapita.toFixed(0)}<br/>Life Exp: ${record.lifeExptancy.toFixed(1)}<br/>Pop: ${(record.population / 1000000).toFixed(1)}M`)
    tooltip.style('left', `${event.x + 10}px`)
    tooltip.style('top', `${event.y + 10}px`)
}

const moveTooltip = (event) => {
    tooltip.style('left', `${event.x + 10}px`)
    tooltip.style('top', `${event.y + 10}px`)
}
const hideTooltip = (_: unknown) => {
    tooltip.transition()
        .duration(200)
        .style('opacity', 0)
}

const svg = d3.select('#container')
    .append('svg')
    .attr('width', config.width + config.marginleft + config.marginRight)
    .attr('height', config.height + config.marginTop + config.marginBottom)
    .append('g')
    .attr('transform', `translate(${config.marginleft}, ${config.marginTop})`)

svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", config.width / 2)
    .attr("y", -config.marginTop + 25)
    .text("Gapminder: GDP vs Life Expectancy")
    .style("font-size", "30px")
    .style("fill", "white");

const yearText = svg.append("text")
    .attr("class", "year-label")
    .attr("text-anchor", "end")
    .attr("x", (config.width + config.marginleft + config.marginRight) / 2)
    .attr("y", config.height / 2)
    .text(years[0])
    .style("font-size", "120px")
    .style("fill", "white")
    .style("opacity", 0.2)
    .style("font-weight", "bold");

const xScale = d3.scaleLog()
    .base(2)
    .domain(d3.extent(records.map(r => r.gdpPerCapita)))
    .range([0, config.width])
    .nice()

svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", config.width / 2)
    .attr("y", config.height + config.marginBottom - 10)
    .text("GDP per Capita")
    .style("font-size", "16px")
    .style("fill", "white");

const yScale = d3.scaleLinear()
    .domain([0, d3.max(records.map(r => r.lifeExptancy))])
    .range([config.height, 0])
    .nice()

svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", -config.height / 2)
    .attr("y", -config.marginleft + 15)
    .attr("transform", "rotate(-90)")
    .text("Life Expectancy")
    .style("font-size", "16px")
    .style("fill", "white");

const populationScale = d3.scaleLinear()
    .domain([0, d3.max(records.map(r => r.population))])
    .range([5, 80])

svg.append('g')
    .attr('transform', `translate(0,${config.height})`)
    .attr('class', 'x-axis')
    .call(d3.axisBottom(xScale)
        .tickValues([500, 1000, 2000, 4000, 8000, 16000, 32000, 64000])
        .tickFormat(d3.format("~s"))
    )

svg.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(yScale))

svg.selectAll('.y-axis .tick line')
    .attr('x2', config.width - 5)
    .attr('stroke', 'white')
    .style('opacity', 0.2)

svg.selectAll('.x-axis .tick line')
    .attr('y2', -config.height)
    .attr('stroke', 'white')
    .style('opacity', 0.2)

const continentColor = d3.scaleOrdinal<string>()
    .domain(d3.union(records.map(r => r.continent)))
    .range(d3.schemeSet2)

const bubbles = svg.append('g').attr('class', 'bubbles');

const legendData = Array.from(d3.union(records.map(r => r.continent)));
legendData.push("Ireland")
const legend = svg.append('g').attr('class', 'legend');

legend.selectAll('circle')
    .data(legendData)
    .join('circle')
    .attr('cx', config.width + 30)
    .attr('cy', (_, i) => 50 + (30 * i))
    .attr('r', 8)
    .attr('fill', d => d === 'Ireland' ? 'red' : continentColor(d))
    .style('opacity', '0.7')

legend.selectAll('text')
    .data(legendData)
    .join('text')
    .text(d => d)
    .attr('x', config.width + 45)
    .attr('y', (_, i) => 50 + (30 * i))
    .style("fill", 'white')
    .style("font-size", 14)
    .attr('dominant-baseline', 'middle')

const updateGraph = (year: number) => {
    const recordsForYear = records.filter(r => r.year === year);

    yearText.text(year);

    const currentCircles = bubbles
        .selectAll('circle')
        .data(recordsForYear, (d: GapMinderRecord) => d.country);

    const newCircles = currentCircles
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.gdpPerCapita))
        .attr('cy', d => yScale(d.lifeExptancy))
        .attr('r', 0)  // Start small
        .style("fill", d => d.country === 'Ireland' ? 'red' : continentColor(d.continent))
        .style('opacity', d => d.country === 'Ireland' ? 1 : 0.7)
        .attr('stroke', d => d.country === 'Ireland' ? 'red' : 'black')
        .on('mouseover', showTooltip)
        .on('mousemove', moveTooltip)
        .on('mouseleave', hideTooltip);

    newCircles.merge(currentCircles as d3.Selection<SVGCircleElement, {
            country: string;
            continent: string;
            year: number;
            lifeExptancy: number;
            population: number;
            gdpPerCapita: number;
        }, SVGGElement, unknown>)
        .transition()
        .duration(400)
        .attr('cx', d => xScale(d.gdpPerCapita))
        .attr('cy', d => yScale(d.lifeExptancy))
        .attr('r', d => populationScale(d.population));

    currentCircles
        .exit()
        .transition()
        .duration(200)
        .attr('r', 0)
        .remove();
}

const sliderContainer = d3.select('#container')
    .insert('div', ':after')
    .style('margin-bottom', '20px')
    .style('text-align', 'center');

const startButton = sliderContainer.append('button')
    .text('Start')
    .style('padding', '10px 40px')
    .style('font-size', '16px')
    .style('margin-right', '20px')
    .style('cursor', 'pointer');

const slider = sliderContainer.append('input')
    .attr('type', 'range')
    .attr('min', 0)
    .attr('max', years.length - 1)
    .attr('value', 0)
    .style('width', '500px')
    .style('vertical-align', 'middle')
    .style('margin-right', '10px');

let isPlaying = false;
let intervals;

startButton.on('click', () => {
    if (isPlaying) {
        clearInterval(intervals);
        startButton.text('Start');
        isPlaying = false;
    } else {
        startButton.text('Pause');
        isPlaying = true;
        intervals = setInterval(() => {
            currentYearIndex = (currentYearIndex + 1) % years.length;
            slider.property('value', currentYearIndex);
            updateGraph(years[currentYearIndex]);
        }, 600);
    }
});

slider.on('input', event => {
    currentYearIndex = +event.target.value;
    updateGraph(years[currentYearIndex]);
    if (isPlaying) {
        clearInterval(intervals);
        startButton.text('Play');
        isPlaying = false;
    }
});

updateGraph(years[0]);