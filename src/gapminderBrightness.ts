import * as d3 from 'd3';
import * as z from 'zod';
import {type GapMinderRecord, ireland, latestGapminderRecord} from "./gapminder.ts";

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
    .text("Encoding Channel: Brightness")
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

const populationScale = d3.scaleSequentialLog()
    .domain(d3.extent(latestGapminderRecord.map(r => r.population)))
    .interpolator(d3.interpolateBlues)

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
    .style("fill", 'red')
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
    .style("fill", 'red')

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

const colorbarWidth = 200;
const colorbarHeight = 20;

const defs = svg.append("defs");

const gradient = defs.append("linearGradient")
    .attr("id", "colorbar-gradient")
    .attr("x1", "0%")
    .attr("x2", "100%")
    .attr("y1", "0%")
    .attr("y2", "0%");

const steps = 10;
const [minPop, maxPop] = populationScale.domain();
const logMin = Math.log10(minPop);
const logMax = Math.log10(maxPop);

for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const popValue = Math.pow(10, logMin + t * (logMax - logMin));
    gradient.append("stop")
        .attr("offset", `${t * 100}%`)
        .attr("stop-color", populationScale(popValue));
}

svg.append("rect")
    .attr("x", - 350)
    .attr("y", config.width + 45)
    .attr("width", colorbarWidth)
    .attr("height", colorbarHeight)
    .attr('transform', 'rotate(-90)')
    .style("fill", "url(#colorbar-gradient)")
    .style("stroke", "#ccc");

const colorScaleAxis = d3.scaleLog()
    .domain([maxPop, minPop])
    .range([0, colorbarWidth]);

const colorbarAxis = d3.axisRight(colorScaleAxis)
    .ticks(5, "~s");

svg.append("g")
    .attr("transform", `translate(${config.width+66.5}, ${149.5})`)
    .call(colorbarAxis)
    .selectAll("text")
    .style("font-size", "12px");
