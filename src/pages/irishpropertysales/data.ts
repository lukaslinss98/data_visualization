import rawData from "../../data/meanPriceCounties.json";

export type AvgYearPrice = {
    year: number
    average: number
}
export type CountyYearAvgPrice = {
    county: string
    averagePrice: AvgYearPrice[]
}

export const countyAverages: CountyYearAvgPrice[] = rawData

const averages = countyAverages.flatMap(averages => averages.averagePrice.map(p => p.average));
export const minAveragePrice = averages.reduce((min, el) => el < min ? el : min, Number.POSITIVE_INFINITY) * 0.85
export const maxAveragePrice = averages.reduce((max, el) => el > max ? el : max, Number.NEGATIVE_INFINITY) * 1.15
export const counties = countyAverages.map(e => e.county)
