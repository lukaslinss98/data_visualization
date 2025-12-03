from datetime import datetime
import pandas as pd 
import json

df = pd.read_csv('./irish-property-sales.csv', encoding="latin1")

column_names = [
    'date_of_sale',
    'address',
    'county',
    'eircode',
    'price',
    'not_full_market_price',
    'vat_exclusive',
    'property_description',
    'propterty_size_description'
]

def get_county_province_mapping(county: str):
    county = county.lower().strip()
    county_to_province = {
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
    
    return county_to_province[county]

def clean_price_column(price: str):
    cleaned = price[2:-1].replace(',', '')
    return float(cleaned)

def clean_property_description(desc: str):
    if desc == 'Second-Hand Dwelling house /Apartment':
        return 'second-hand'
    return 'new'

def map_property_size(property_size_desc: str):
    if property_size_desc in ["less than 38 sq metres","n?os l? n? 38 m?adar cearnach"]:
        return "small"
    if property_size_desc in ["greater than or equal to 38 sq metres and less than 125 sq metres", "níos mó ná nó cothrom le 38 méadar cearnach agus níos lú ná 125 méadar cearnach"]:
        return "medium"
    if property_size_desc in ["greater than 125 sq metres", "greater than or equal to 125 sq metres"]:
        return "large"

    return ""

def convert_to_iso_date(date: str):
    for fmt in ("%d/%m/%y", "%d/%m/%Y"):
        try:
            return datetime.strptime(date, fmt)
        except ValueError:
            continue
    raise ValueError(f'Unknown date format: {date}')

def map_address(full_address: str):
    return full_address.replace(' ', '_').strip().lower()

def map_county(county:str):
  return 'Laoighis' if county == 'Laois' else county

df.columns = column_names

df['date_of_sale'] = df['date_of_sale'].map(convert_to_iso_date)
df['year'] = df['date_of_sale'].map(lambda date: date.year)
df['address'] = df['address'].map(map_address)
df['price'] = df['price'].map(clean_price_column)
df['province'] = df['county'].map(get_county_province_mapping)
df['county'] = df['county'].map(map_county)
df['not_full_market_price'] = df['not_full_market_price'].map(lambda s: s.lower()) 
df['vat_exclusive'] = df['vat_exclusive'].map(lambda s: True if s == 'Yes' else False)
df['property_size'] = df['propterty_size_description'].map(map_property_size)
df['property_description'] = df['property_description'].map(clean_property_description)

mean_price_per_county_per_year = df.groupby(["county", "year"])["price"].mean().reset_index()

result = []

for county, sub in mean_price_per_county_per_year.groupby("county"):
    avg_list = [
        {
            "year": int(row["year"]),
            "average": float(row["price"]),
        }
        for _, row in sub.iterrows()
    ]

    result.append({
        "county": str(county),
        "averagePrice": avg_list,
    })

with open("meanPriceCounties.json", "w") as f:
    json.dump(result, f, indent=2)

sales_volumn_by_province = df.groupby(['province', 'year'])['price'].sum().reset_index()


result = {}
for _, row in sales_volumn_by_province.iterrows():
    county = row["province"]
    year = int(row["year"])
    volumn = float(row["price"])

    result.setdefault(county, {})[str(year)] = volumn

with open("salesVolumnProvinces.json", "w") as f:
    json.dump(result, f, indent=2)

