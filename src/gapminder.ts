import * as z from 'zod/v4';
import * as d3 from 'd3';

export const gapMinderRecordSchema = z.object({
    country: z.string(),
    continent: z.string(),
    year: z.string().transform(s => parseInt(s)),
    lifeExp: z.string().transform(s => parseInt(s)),
    pop: z.string().transform(s => parseInt(s)),
    gdpPercap: z.string().transform(s => parseInt(s)),
}).transform(data => ({
    country: data.country,
    continent: data.continent,
    year: data.year,
    lifeExptancy: data.lifeExp,
    population: data.pop,
    gdpPerCapita: data.gdpPercap,
}))

export type GapMinderRecord = z.infer<typeof gapMinderRecordSchema>
const csvData = await d3.csv('/src/data/gapminder.csv')
export const records: GapMinderRecord[] = csvData.map(row => gapMinderRecordSchema.parse(row))
export const latestGapminderRecord = records.filter(r => r.year == 2007);
export const ireland = latestGapminderRecord.filter(r => r.country === 'Ireland')
