import { $t } from '@/translation'

export type Category =
  | 'flood'
  | 'rainFlood'
  | 'temperature'
  | 'fallingWind'
  | 'quickClay'
  | 'stormSurge'
  | 'seaRise'
  | 'metAlerts'
  | 'other'

export const categories: Category[] = [
  'flood',
  'rainFlood',
  'temperature',
  'fallingWind',
  'quickClay',
  'stormSurge',
  'seaRise',
]

export const getCategoryIconSrc = (category: Category) => {
  switch (category) {
    case 'fallingWind':
      return `./warningIcons/icon-warning-wind-red.svg`
    case 'other':
      return './warningIcons/icon-warning-extreme.svg'
    default:
      return `./warningIcons/icon-warning-${category.toLowerCase()}-red.svg`
  }
}
export type FeatureLayerUrls = Record<string, { url: string; radius: number }>
export type CategoryOption = {
  title: string
  layerId: string
  description: string
  category: Category
  faIcon: string
  featureLayers: FeatureLayerUrls
}

export const getCategoryOptions = (): CategoryOption[] => [
  {
    title: $t().rainFlood,
    layerId: '1894a0de007-layer-22',
    description:
      'Veien vannet tar når det er styrtregn. Styrtregn er intense regnbyger som kan skape lokal oversvømmelse i lavtliggende steder.',
    category: 'rainFlood',
    faIcon: 'cloud-showers-heavy',
    featureLayers: {
      buildings: {
        url: 'https://utility.arcgis.com/usrsvcs/servers/5ba98478f7bd4abf9ffb28797f391d26/rest/services/Geomap_UTM33_EUREF89/GeomapGRIP/MapServer/1',
        radius: 0,
      },
    },
  },
  {
    title: $t().flood,
    layerId: '1894e6f75c8-layer-27',
    description: 'Områder som kan bli under vann hvis vannivået i elver øker.',
    category: 'flood',
    faIcon: 'water',
    featureLayers: {
      // 'https://utility.arcgis.com/usrsvcs/servers/811c02c15905411d89f2a6e3bcda6399/rest/services/Geomap_UTM33_EUREF89/GeomapFlom/MapServer/1',
    },
  },
  {
    title: $t().temperatureMap,
    layerId: '18963742ade-layer-39',
    description: 'Variasjonen i temperatur på en sommerdag med sol.',
    category: 'temperature',
    faIcon: 'temperature-high',
    featureLayers: {
      temperature: {
        url: 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/Temperatur_Hele/FeatureServer',
        radius: 50,
      },
    },
  },
  {
    title: $t().fallingWind,
    layerId: '1894ed8aeb4-layer-32',
    description:
      'Fallvind er en kraftig vindstrøm som beveger seg nedover fra høyere luftlag mot bakken.',
    category: 'fallingWind',
    faIcon: 'wind',
    featureLayers: {
      buildings: {
        url: 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/Usatte%20Bygg%20Alle/FeatureServer',
        radius: 0,
      },
      south: {
        url: 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/Sordavind_Polygon/FeatureServer',
        radius: 50,
      },
      north: {
        url: 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/Nordavind_Polygon/FeatureServer',
        radius: 50,
      },
      east: {
        url: 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/Vest_minus_ost/FeatureServer',
        radius: 50,
      },
      west: {
        url: 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/Ost_minus_vest/FeatureServer',
        radius: 50,
      },
    },
  },
  {
    title: $t().quickClay,
    layerId: '1894e91ecbb-layer-30',
    description: 'Områder utsatt for kvikkleireskred.',
    category: 'quickClay',
    faIcon: 'hill-rockslide',
    featureLayers: {
      // 'https://utility.arcgis.com/usrsvcs/servers/ec96f664795c4ff4843ee086069bb7ab/rest/services/Geomap_UTM33_EUREF89/GeomapSkred/MapServer/21',
    },
  },
  {
    title: $t().stormSurge,
    layerId: '189639a4259-layer-40',
    description:
      'Bygg som kan få vanninntrenging fra sjøen i 2090 ved stormfulle værforhold.',
    category: 'stormSurge',
    faIcon: 'house-flood-water',
    featureLayers: {
      stormSurge: {
        url: 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/Stormflo_ny/FeatureServer',
        radius: 50,
      },
    },
  },
  {
    title: $t().seaRise,
    layerId: '18963f12bf3-layer-42',
    description: 'Bygg som vil ligge under havnivå i 2090.',
    category: 'seaRise',
    faIcon: 'arrow-up-from-ground-water',
    featureLayers: {},
  },
]
