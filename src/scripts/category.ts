import { $t } from '@/translation'

export type Category =
  | 'flood'
  | 'rainflood'
  | 'heatwave'
  | 'falling-wind'
  | 'quick-clay'
  | 'storm-surge'
  | 'sea-rise'
  | 'other'

export const getCategoryIconSrc = (category: Category) => {
  switch (category) {
    case 'falling-wind':
      return `./warningIcons/icon-warning-wind-red.svg`
    case 'other':
      return './warningIcons/icon-warning-extreme.svg'
    default:
      return `./warningIcons/icon-warning-${category}-red.svg`
  }
}

export type CategoryOption = {
  title: string
  layerId: string
  description: string
  category: Category
  faIcon: string
}

export const getCategoryOptions = (): CategoryOption[] => [
  {
    title: $t().rainflood,
    layerId: '1894a0de007-layer-22',
    description:
      'Veien vannet tar når det er styrtregn. Styrtregn er intense regnbyger som kan skape lokal oversvømmelse i lavtliggende steder.',
    category: 'rainflood',
    faIcon: 'cloud-showers-heavy',
  },
  {
    title: $t().flood,
    layerId: '1894e6f75c8-layer-27',
    description: 'Områder som kan bli under vann hvis vannivået i elver øker.',
    category: 'flood',
    faIcon: 'water',
  },
  {
    title: $t().temperatureMap,
    layerId: '1894e6d0fc3-layer-26',
    description: 'Variasjonen i temperatur på en sommerdag med sol.',
    category: 'heatwave',
    faIcon: 'temperature-high',
  },
  {
    title: $t().fallingWind,
    layerId: '1894ed8aeb4-layer-32',
    description:
      'Fallvind er en kraftig vindstrøm som beveger seg nedover fra høyere luftlag mot bakken.',
    category: 'falling-wind',
    faIcon: 'wind',
  },
  {
    title: $t().quickClay,
    layerId: '1894e91ecbb-layer-30',
    description: 'Områder utsatt for kvikkleireskred.',
    category: 'quick-clay',
    faIcon: 'hill-rockslide',
  },
  {
    title: $t().stormSurge,
    layerId: '189639a4259-layer-40',
    description:
      'Bygg som kan få vanninntrenging fra sjøen i 2090 ved stormfulle værforhold.',
    category: 'storm-surge',
    faIcon: 'house-flood-water',
  },
  {
    title: $t().seaRise,
    layerId: '1894a08e10a-layer-21',
    description: 'Bygg som vil ligge under havnivå i 2090.',
    category: 'sea-rise',
    faIcon: 'arrow-up-from-ground-water',
  },
]
