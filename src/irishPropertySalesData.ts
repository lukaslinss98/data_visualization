import * as z from 'zod/v4';
import * as d3 from 'd3';

const createProvince = (county: string): string => {
  const countyToProvinceMapping = {
    "galway": "Connacht",
    "leitrim": "Connacht",
    "mayo": "Connacht",
    "roscommon": "Connacht",
    "sligo": "Connacht",
    "carlow": "Leinster",
    "dublin": "Leinster",
    "kildare": "Leinster",
    "kilkenny": "Leinster",
    "laois": "Leinster",
    "longford": "Leinster",
    "louth": "Leinster",
    "meath": "Leinster",
    "offaly": "Leinster",
    "westmeath": "Leinster",
    "wexford": "Leinster",
    "wicklow": "Leinster",
    "clare": "Munster",
    "cork": "Munster",
    "kerry": "Munster",
    "limerick": "Munster",
    "tipperary": "Munster",
    "waterford": "Munster",
    "antrim": "Ulster",
    "armagh": "Ulster",
    "cavan": "Ulster",
    "donegal": "Ulster",
    "down": "Ulster",
    "fermanagh": "Ulster",
    "londonderry": "Ulster",
    "monaghan": "Ulster",
    "tyrone": "Ulster",
  }
  return countyToProvinceMapping[county.toLocaleLowerCase()]
}

const toDate = (str: string): Date => {
  const [d, m, y] = str.split('/')
  return new Date(2000 + Number(y), Number(m) - 1, Number(d))
}

const toPrice = (price: string): any => {
  const cleanedString = price.substring(1).replace(',', '')
  return Number(cleanedString)
}

type PropertyType = 'new' | 'second hand'

const toType = (propertytype: string): PropertyType => {
  return propertytype === 'New Dwelling house /Apartment' ? 'new' : 'second hand'
}

type PropertySize = 'small' | 'medium' | 'large'

function toPropertySize(description: string): PropertySize | undefined {
  if (description === 'less than 38 sq metres' || description === 'níos mó ná nó cothrom le 38 méadar cearnach agus níos lú ná 125 méadar cearnach') {
    return 'small'
  }
  if (description === 'greater than or equal to 38 sq metres and less than 125 sq metres' || description === 'n?os l? n? 38 m?adar cearnach') {
    return 'medium'
  }
  if (description === 'greater than 125 sq metres' || description === 'greater than or equal to 125 sq metres') {
    return 'large'
  }
  return undefined
}

const toCounty = (county: string): string => {
  return county === 'Laois' ? 'Laoighis' : county
}

export const propertySaleRecordSchema = z.object({
  date_of_sale: z.string(),
  address: z.string(),
  county: z.string(),
  eircode: z.string(),
  price: z.string(),
  full_market_price: z.string(),
  Description_of_Property: z.string(),
  Property_Size_Description: z.string()
}).transform(data => ({
  dateOfSale: toDate(data.date_of_sale),
  address: data.address,
  county: toCounty(data.county),
  province: createProvince(data.county),
  eircode: data.eircode,
  price: toPrice(data.price),
  isFullMarketPrice: data.full_market_price === 'Yes' ? true : false,
  propertytype: toType(data.Description_of_Property),
  propertySize: toPropertySize(data.Property_Size_Description),
}))

export type PropertySaleRecord = z.infer<typeof propertySaleRecordSchema>
let csvData = await d3.csv('/src/data/irish-property-sales.csv')

const propertySalesRecords: PropertySaleRecord[] = csvData.slice(0, 1000).map(row => propertySaleRecordSchema.parse(row))

type IrishPropertySales = {
  propertySales: PropertySaleRecord[]
  getPropertySalesByCounty: () => Map<string, PropertySaleRecord[]>,
  getCounties: () => string[]
}

export const irishPropertySales: IrishPropertySales = {
  propertySales: propertySalesRecords,
  getCounties: () => Array.from(new Set(propertySalesRecords.map(r => r.county))),
  getPropertySalesByCounty: () => propertySalesRecords.reduce((map, record) => {
    if (map.has(record.county)) {
      map.set(record.county, [record, ...map.get(record.county)])
    }
    map.set(record.county, [record])
    return map
  }, new Map<string, PropertySaleRecord[]>())
}

