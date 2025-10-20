import * as d3 from 'd3';
import {
    cities,
    countriesGeoData,
    divisions,
    maxSurvivors,
    minSurvivors,
    temperatureData,
    type TemperaturePosition,
    type TroopPosition
} from "./minardData.ts";

const width = 1350;
const height = 900;

const svg = d3.create('svg')
    .attr('width', width)
    .attr('height', height)
    .style("border", "2px solid white");


const projection = d3.geoMercator()
    .center([27, 55.5])
    .scale(3500)
    .translate([450, 300])

const colorScale = d3.scaleOrdinal([
    "#9db477",
    "#a7c4a0",
    "#97b28e",
    "#7f9d74",
    "#688b5a",
    "#577c48"
]);


svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "#1385c5");

svg.selectAll("path.country")
    .data(countriesGeoData)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("d", d3.geoPath().projection(projection))
    .attr("fill", country => colorScale(country.properties.name))
    .attr("stroke", "#211f1f")
    .attr("stroke-width", 0.5);

const renderTroopSegments = (svg: d3.Selection<SVGSVGElement, undefined, null, undefined>, segments: TroopPosition[][], segmentNumber: number) => {
    const troopPositionLine = d3.line<TroopPosition>()
        .x(position => projection([position.lon, position.lat])[0])
        .y(position => projection([position.lon, position.lat])[1])
        .curve(d3.curveLinearClosed);

    const strokeWidthScale = d3.scaleLinear()
        .domain([minSurvivors, maxSurvivors])
        .range([2, 70]);

    svg.selectAll(`.segment-group-${segmentNumber}`)
        .data([segments])
        .enter()
        .append("g")
        .attr("class", "segment-group")
        .selectAll(".segment")
        .data(segment => segment)
        .enter()
        .append("path")
        .attr("class", "segment")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "butt")
        .attr("opacity", 1)
        .attr("d", troopPositionLine)
        .attr("stroke", (segment: TroopPosition[]) => {
            return segment[0].isRetreating
                ? 'black'
                : 'tan';
        })
        .attr("stroke-width", segment => strokeWidthScale(segment[0].survivors))

}

renderTroopSegments(svg, divisions.divisionOne, 1)
renderTroopSegments(svg, divisions.divisionTwo, 2)
renderTroopSegments(svg, divisions.divisionThree, 3)

const tempGroup = svg.append("g").attr("class", "temperature-area");

tempGroup.append("rect")
    .attr("x", 0)
    .attr("y", height - 180)
    .attr("width", width)
    .attr("height", height - (height - 180))
    .attr("fill", "#FFF8E7");

const {temperaturePositions, maxTemp, minTemp} = temperatureData;

const yTemp = d3.scaleLinear()
    .domain([minTemp, maxTemp])
    .range([height - 50, height - 150]); // below the map

svg.append("line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", height - 180)
    .attr("y2", height - 180)
    .attr("stroke", "#1A1A1A")
    .attr("stroke-width", 1);

const tempLine = d3.line<TemperaturePosition>()
    .x(d => projection([d.lon, 55])[0])
    .y(d => yTemp(d.temperature))
    .curve(d3.curveLinear);

svg.append("path")
    .datum(temperaturePositions)
    .attr("d", tempLine)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 2);

svg.selectAll(".temp-label")
    .data(temperaturePositions)
    .enter()
    .append("text")
    .attr("x", d => projection([d.lon, 10])[0])
    .attr("y", d => yTemp(d.temperature) - 7)
    .text(d => `${d.temperature}°`)
    .attr("fill", "black")
    .attr("font-size", "12px")
    .attr("text-anchor", "middle");

svg.selectAll(".temp-date")
    .data(temperaturePositions)
    .enter()
    .append("text")
    .attr("x", d => projection([d.lon, 10])[0])
    .attr("y", d => yTemp(d.temperature) + 20)
    .text(d => d.date)
    .attr("fill", "black")
    .attr("font-size", "10px")
    .attr("text-anchor", "middle");

const tempTicks = d3.range(0, -50, -10);
svg.selectAll("line.temp-grid")
    .data(tempTicks)
    .enter()
    .append("line")
    .attr("class", "temp-grid")
    .attr("x1", projection([temperatureData.minLon - 1.8, 55])[0])
    .attr("x2", projection([temperatureData.maxLon, 55])[0])
    .attr("y1", d => yTemp(d))
    .attr("y2", d => yTemp(d))
    .attr("stroke", "rgba(0,0,0,1)")
    .attr("stroke-width", 0.5)
    .attr("stroke-dasharray", "2,2");

svg.selectAll("text.temp-label")
    .data(tempTicks)
    .enter()
    .append("text")
    .attr("class", "temp-label")
    .attr("x", projection([temperatureData.maxLon, 55])[0] + 35)
    .attr("y", tick => yTemp(tick))
    .attr("text-anchor", "end")
    .attr("alignment-baseline", "middle")
    .attr("fill", "black")
    .attr("font-size", "10px")
    .text(tick => `${tick}°`);

svg.selectAll('circle.city')
    .data(cities)
    .enter()
    .append('circle')
    .attr('class', 'city')
    // @ts-ignore
    .attr('cx', city => projection([city.lon, city.lat])[0])
    // @ts-ignore
    .attr('cy', city => projection([city.lon, city.lat])[1])
    .attr('r', 3)
    .attr('fill', '#1A1A1A')

svg.selectAll("text.city-label")
    .data(cities)
    .enter()
    .append("text")
    // @ts-ignore
    .attr("x", d => projection([d.lon, d.lat])[0] + 17)
    // @ts-ignore
    .attr("y", d => projection([d.lon, d.lat])[1])
    .text(city => city.name)
    .attr('fill', '#1A1A1A')
    .attr('font-size', '12px')
    .attr('dominant-baseline', 'middle');

const legendData = [
    {label: "Advance", color: 'tan'},
    {label: "Retreat", color: 'black'}
];

const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width - 130}, 40)`); // position near top-right

legend.selectAll("rect")
    .data(legendData)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", (_, i) => i * 25)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", d => d.color)
    .attr("stroke", "#333")
    .attr("stroke-width", 0.5);

legend.selectAll("text")
    .data(legendData)
    .enter()
    .append("text")
    .attr("x", 30)
    .attr("y", (_, i) => i * 25 + 10)
    .attr("dominant-baseline", "middle")
    .attr("fill", "black")
    .attr("font-size", "12px")
    .text(d => d.label);

d3.select('#container').append(() => svg.node())
