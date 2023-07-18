import { Category } from '@/stores/place'
import { $t } from '@/translation'
import Point from '@arcgis/core/geometry/Point'
import MapView from '@arcgis/core/views/MapView'

export const mapObjects = {
  mapView: null as MapView | null,
}

export type ViewClickEvent = {
  mapPoint: Point
  x: number
  y: number
  button: number
  buttons: number
}

export type CategoryOption = {
  title: string
  layerId: string
  description: string
  category: Category
}

export const getCategoryOptions = (): CategoryOption[] => [
  {
    title: $t().torrentialRain,
    layerId: '1894a0de007-layer-22',
    description:
      'Veien vannet tar når det er styrtregn. Styrtregn er intense regnbyger som kan skape lokal oversvømmelse i lavtliggende steder.',
    category: 'rainflood',
  },
  {
    title: $t().fallingWind,
    layerId: '1894ed8aeb4-layer-32',
    description:
      'Fallvind er en kraftig vindstrøm som beveger seg nedover fra høyere luftlag mot bakken.',
    category: 'falling-wind',
  },
  {
    title: $t().heatWave,
    layerId: '1894e6d0fc3-layer-26',
    description: 'Variasjonen i temperatur på en sommerdag med sol.',
    category: 'heatwave',
  },
  {
    title: $t().flood,
    layerId: '1894e6f75c8-layer-27',
    description: 'Områder som kan bli under vann hvis vannivået i elver øker.',
    category: 'flood',
  },
  {
    title: $t().stormSurge,
    layerId: '189639a4259-layer-40',
    description:
      'Bygg som kan få vanninntrenging fra sjøen i 2090 ved stormfulle værforhold.',
    category: 'storm-surge',
  },
  {
    title: $t().quickClay,
    layerId: '1894e91ecbb-layer-30',
    description: 'Områder utsatt for kvikkleireskred.',
    category: 'quick-clay',
  },
  {
    title: $t().seaRise,
    layerId: '1894a08e10a-layer-21',
    description: 'Bygg som vil ligge under havnivå i 2090.',
    category: 'sea-rise',
  },
]
