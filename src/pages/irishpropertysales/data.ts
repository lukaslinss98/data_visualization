import meanPriceCounties from '../../data/meanPriceCounties.json'
import propertyDescriptionCountsPerYear from '../../data/numberOfPropertyTypesPerCountyYear.json'
import priceBinsPerYear from '../../data/priceBinsPerCountyYear.json'
import salesVolumnPerCounties from '../../data/salesVolumnPerCounties.json'

export type AvgYearPrice = {
  year: number
  average: number
}

export type CountyYearAvgPrice = {
  county: string
  averagePrice: AvgYearPrice[]
}

export type YearVolumn = {
  year: number
  volumn: number
}

export type CountyYearVolumn = {
  county: string
  volumnPerYear: YearVolumn[]
}

export type PropertyDescCounts = {
  year: number,
  county: string,
  new: number,
  secondHand: number
}

export type YearCountyPriceBins = {
  year: number,
  county: string,
  priceBinsNew: number[]
  priceBinsSecondHand: number[]
}

export const countyAverages: CountyYearAvgPrice[] = meanPriceCounties
export const countyYearVolumn: CountyYearVolumn[] = salesVolumnPerCounties
export const propertyDescCounts: PropertyDescCounts[] = propertyDescriptionCountsPerYear
export const yearPriceBins: YearCountyPriceBins[] = priceBinsPerYear

const averages = countyAverages.flatMap(averages => averages.averagePrice.map(p => p.average));
export const minAveragePrice = averages.reduce((min, el) => el < min ? el : min, Number.POSITIVE_INFINITY) * 0.85
export const maxAveragePrice = averages.reduce((max, el) => el > max ? el : max, Number.NEGATIVE_INFINITY) * 1.0

const volumns = countyYearVolumn.flatMap(({volumnPerYear}) => volumnPerYear).map(({volumn}) => volumn)
export const minVolumn = volumns.reduce((min, el) => el < min ? el : min, Number.POSITIVE_INFINITY) * 0.85
export const maxVolumn = volumns.reduce((max, el) => el > max ? el : max, Number.NEGATIVE_INFINITY) * 1.15

export const counties = countyAverages.map(e => e.county)
export const colorscale = [
  [0.0, "#f0f9ff"],
  [0.25, "#bfdbfe"],
  [0.5, "#3b82f6"],
  [1.0, "#1e3a8a"],
]