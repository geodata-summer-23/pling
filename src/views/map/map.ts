import { $t } from '@/translation'
import MapView from '@arcgis/core/views/MapView'

export const mapObjects = {
  mapView: null as MapView | null,
}

export type CategoryOption = {
  displayTitle: string
  layerId: string
  description: string
}

export const getCategoryOptions = (): CategoryOption[] => [
  {
    displayTitle: $t().torrentialRain,
    layerId: '1894a0de007-layer-22',
    description:
      'Veien vannet tar når det er styrtregn. Styrtregn er intense regnbyger som kan skape lokal oversvømmelse i lavtliggende steder.',
  },
  {
    displayTitle: $t().fallingWind,
    layerId: '1894ed8aeb4-layer-32',
    description:
      'Fallvind er en kraftig vindstrøm som beveger seg nedover fra høyere luftlag mot bakken.',
  },
  {
    displayTitle: $t().heatWave,
    layerId: '1894e6d0fc3-layer-26',
    description: 'Variasjonen i temperatur på en sommerdag med sol.',
  },
  {
    displayTitle: $t().flood,
    layerId: '1894e6f75c8-layer-27',
    description: 'Områder som kan bli under vann hvis vannivået i elver øker.',
  },
  {
    displayTitle: $t().stormTide,
    layerId: '1894a08e10a-layer-21',
    description:
      'Bygg som kan få vanninntrenging fra sjøen i 2090 ved stormfulle værforhold.',
  },
  {
    displayTitle: $t().quickClay,
    layerId: '1894e91ecbb-layer-30',
    description: 'Områder utsatt for kvikkleireskred.',
  },
]
