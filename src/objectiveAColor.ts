import * as d3 from 'd3';
import {type GapMinderRecord, ireland, latestGapminderRecord} from "./gapminderData.ts";

const config = {
    width: 1000,
    height: 700,
    marginleft: 50,
    marginRight: 200,
    marginTop: 100,
    marginBottom: 50,
}

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
    tooltip.html(record.country)
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
    .text("Encoding Channel: Color")
    .style("font-size", "32px")
    .style("fill", "white");

const xScale = d3.scaleLog()
    .base(2)
    .domain(d3.extent(latestGapminderRecord.map(r => r.gdpPerCapita)))
    .range([0, config.width])
    .nice()

svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", config.width / 2)
    .attr("y", config.height + config.marginBottom - 10)
    .text("GDP per Capita")
    .style("font-size", "20px")
    .style("fill", "white");

const yScale = d3.scaleLinear()
    .domain([0, d3.max(latestGapminderRecord.map(r => r.lifeExptancy))])
    .range([config.height, 0])
    .nice()

svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", -config.height / 2)
    .attr("y", -config.marginleft + 15)
    .attr("transform", "rotate(-90)")
    .text("Life Expectancy")
    .style("font-size", "20px")
    .style("fill", "white");

const populationBreakpoints = [1000000, 10000000, 50000000, 100000000];
const populationScale = d3.scaleThreshold<number, string>()
    .domain(populationBreakpoints)
    .range(d3.schemeCategory10.slice(0, 5));

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

svg.append('g')
    .selectAll('bubble')
    .data(latestGapminderRecord)
    .join('circle')
    .attr('cx', d => xScale(d.gdpPerCapita))
    .attr('cy', d => yScale(d.lifeExptancy))
    .attr('r', 6)
    .attr("fill", d => populationScale(d.population))
    .style('opacity', '0.9')
    .attr('stroke', 'black')
    .on('mouseover', showTooltip)
    .on('mousemove', moveTooltip)
    .on('mouseleave', hideTooltip)

svg.append('g')
    .selectAll('bubble')
    .data(ireland)
    .join('circle')
    .attr('class', 'ireland')
    .attr('cx', d => xScale(d.gdpPerCapita))
    .attr('cy', d => yScale(d.lifeExptancy))
    .attr('r', 6)
    .style("fill", 'white')
    .style('opacity', '1')
    .attr('stroke', 'black')
    .on('mouseover', showTooltip)
    .on('mousemove', moveTooltip)
    .on('mouseleave', hideTooltip)

svg.append('g')
    .selectAll('legend')
    .data(ireland)
    .join('circle')
    .attr('class', 'legend-ireland')
    .attr('cx', config.width + config.marginRight - 150)
    .attr('cy', d => yScale(d.lifeExptancy))
    .attr('r', 6)
    .style("fill", 'white')

svg.append('g')
    .selectAll('legend')
    .data(ireland)
    .join('text')
    .text(d => d.country)
    .attr('x', config.width + config.marginRight - 130)
    .attr('y', d => yScale(d.lifeExptancy))
    .style("fill", 'white')
    .style("font-size", 12)
    .attr('dominant-baseline', 'middle')

svg.append('g')
    .selectAll('legend')
    .data(populationBreakpoints)
    .join('circle')
    .attr('cx', config.width + config.marginRight - 150)
    .attr('cy', (_, i) => yScale(ireland[0].lifeExptancy) + 30 + (30 * i))
    .attr('r', 6)
    .style("fill", d => populationScale(d))

svg.append('g')
    .selectAll('legend')
    .data(populationBreakpoints)
    .join('text')
    .text(d => `< ${d}`)
    .attr('x', config.width + config.marginRight - 130)
    .attr('y', (_, i) => yScale(ireland[0].lifeExptancy) + 30 + (30 * i))
    .style("fill", 'white')
    .style("font-size", 12)
    .attr('dominant-baseline', 'middle')
