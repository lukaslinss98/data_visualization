import * as d3 from 'd3';
import * as z from 'zod';

const choleraDeathRecordSchema = z.object({
    count: z.string().transform(s => parseInt(s)),
    x_screen: z.string().transform(s => parseInt(s)),
    y_screen: z.string().transform(s => parseInt(s)),
});

type CholeraDeathRecord = z.infer<typeof choleraDeathRecordSchema>

const width = 1000;
const height = 1000;

const svg = d3.create('svg')
    .attr('width', width)
    .attr('height', height);

svg.append('image')
    .attr('xlink:href', '/src/data/mapclean.jpg')


const isWaterPump = (record: CholeraDeathRecord) => record.count === -999

const csvData = await d3.csv('/src/data/snow_pixelcoords.csv');
const records: CholeraDeathRecord[] = csvData.map(row => choleraDeathRecordSchema.parse(row))
const waterPumpRecords = records.filter(record => isWaterPump(record))
const choleraRecords = records.filter(record => !isWaterPump(record))

const tooltip = d3.select('#container')
    .append('div')
    .style('position', 'absolute')
    .style('padding', '6px')
    .style('background', 'white')
    .style('border', '1px solid #ccc')
    .style('border-radius', '4px')
    .style('pointer-events', 'none')
    .style('opacity', 0);

svg.selectAll('circle')
    .data(waterPumpRecords)
    .enter()
    .append('circle')
    .attr('cx', d => d.x_screen)
    .attr('cy', d => d.y_screen)
    .attr('r', 5)
    .attr('fill', 'blue')
    .attr('opacity', 0.7)
    .on('mouseover', event => {
        tooltip.transition().style('opacity', 1);
        tooltip.html('Water pump')
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 20) + 'px')
            .style('color', 'black');
    })
    .on('mouseout', () => {
        tooltip.transition().style('opacity', 0);
    })

svg.selectAll('circle')
    .data(choleraRecords)
    .enter()
    .append('circle')
    .attr('cx', d => d.x_screen)
    .attr('cy', d => d.y_screen)
    .attr('r', d => d.count)
    .attr('fill', 'red')
    .attr('opacity', 0.7)
    .on('mouseover', (event, d) => {
        tooltip.transition().style('opacity', 1);
        tooltip.html(`Deaths: ${d.count}`)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 20) + 'px')
            .style('color', 'black');
    })
    .on('mouseout', () => {
        tooltip.transition().style('opacity', 0);
    })

d3.select('#container').append(() => svg.node())
