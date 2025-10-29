import * as d3 from "d3";
import {z} from "zod";
import * as topojson from 'topojson-client';
import type {Topology, GeometryCollection} from "topojson-specification";

const worldData: Topology = await d3.json("https://cdn.jsdelivr.net/npm/visionscarto-world-atlas@0.1.0/world/110m.json")
const countries = worldData.objects.countries
export const countriesGeoData = topojson.feature(worldData, countries as GeometryCollection).features

const minardRecordSchema = z.object({
    LONC: z.string().transform(v => parseFloat(v)),
    LATC: z.string().transform(v => parseFloat(v)),
    CITY: z.string(),
    LONT: z.string().transform(v => parseFloat(v)),
    TEMP: z.string().transform(v => parseInt(v)),
    DAYS: z.string().transform(v => parseInt(v)),
    MON: z.string(),
    DAY: z.string().transform(v => parseInt(v)),
    LONP: z.string().transform(v => parseFloat(v)),
    LATP: z.string().transform(v => parseFloat(v)),
    SURV: z.string().transform(v => parseInt(v)),
    DIR: z.string(),
    DIV: z.string().transform(v => parseInt(v)),
}).transform(obj => ({
    longitudeCity: obj.LONC,
    latitudeCity: obj.LATC,
    city: obj.CITY,
    longitudeTemp: obj.LONT,
    temperature: obj.TEMP,
    days: obj.DAYS,
    month: obj.MON,
    day: obj.DAY,
    longitudePeople: obj.LONP,
    latitudePeople: obj.LATP,
    numberOfSurvivors: obj.SURV,
    direction: obj.DIR,
    division: obj.DIV,
}));

type MinardRecord = z.infer<typeof minardRecordSchema>

export type City = {
    name: string,
    lon: number,
    lat: number
}

export type TroopPosition = {
    lon: number,
    lat: number,
    survivors: number,
    division: number,
    isRetreating: boolean
}

export type TemperaturePosition = {
    temperature: number,
    lon: number,
    date: string,
}

export type TemperatureData = {
    minLon: number,
    maxLon: number,
    minTemp: number,
    maxTemp: number,
    temperaturePositions: TemperaturePosition[]
}

const csvData = await d3.csv('/src/data/minard-data.csv');

export const minardRecords: MinardRecord[] = csvData.map(row => minardRecordSchema.parse(row))

export const cities: City[] = minardRecords
    .filter(record => record.city !== '')
    .map(record => ({
        name: record.city,
        lon: record.longitudeCity,
        lat: record.latitudeCity
    }))

const createSegments = (troopPositions: TroopPosition[]): TroopPosition[][] => {
    const segments = []
    for (let i = 0; i < troopPositions.length - 1; i++) {
        segments.push([
            troopPositions[i],
            troopPositions[i + 1]
        ])
    }
    return segments;
}

const troopPositions: TroopPosition[] = minardRecords
    .map(record => ({
        lon: record.longitudePeople,
        lat: record.latitudePeople,
        survivors: record.numberOfSurvivors,
        division: record.division,
        isRetreating: record.direction === 'R'
    }))

export const divisions = {
    divisionOne: createSegments(troopPositions.filter(position => position.division === 1)),
    divisionTwo: createSegments(troopPositions.filter(position => position.division === 2)),
    divisionThree: createSegments(troopPositions.filter(position => position.division === 3)),
}

export const [minSurvivors, maxSurvivors] = d3.extent(minardRecords.map(record => record.numberOfSurvivors))

export const temperaturePositions: TemperaturePosition[] = minardRecords
    .filter(record => !Number.isNaN(record.temperature))
    .map(record => ({
        temperature: record.temperature,
        lon: record.longitudeTemp,
        date: Number.isNaN(record.day) ? '' : `${record.day}, ${record.month}`,
    }))

const [minLon, maxLon] = d3.extent(temperaturePositions, p => p.lon);
const [minTemp, maxTemp] = d3.extent(temperaturePositions, p => p.temperature);

export const temperatureData: TemperatureData = {
    minTemp: minTemp!,
    maxTemp: maxTemp!,
    minLon: minLon!,
    maxLon: maxLon!,
    temperaturePositions: temperaturePositions
}

console.log(temperaturePositions);