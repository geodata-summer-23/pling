import { $t } from '@/translation'
import { Alert, FeatureQuery, NowcastData, ObservedEvent } from './alert'

export type Place = {
  nickname: string
  icon: string
  address: Address
  events: ObservedEvent[]
  queries: FeatureQuery[]
  nowcast: NowcastData
  alerts: Alert[]
  alertSummary: string
  status: 'loading' | 'failed' | 'success' | 'unknown'
}

export type Address = {
  city?: string
  postalCode?: number
  street?: string
  position: Position
}

export type Position = {
  x?: number
  y?: number
  latitude?: number
  longitude?: number
}

export const getDefaultMyLocation = (): Place => ({
  ...getDefaultPlace(),
  nickname: $t().myLocation,
  icon: 'location-crosshairs',
})

export const getDefaultPlace = (): Place => ({
  nickname: '',
  icon: 'location-dot',
  address: {
    position: {
      latitude: 0,
      longitude: 0,
    },
  },
  events: [],
  queries: [],
  alertSummary: '',
  alerts: [],
  nowcast: {
    airTemperature: 0,
    gustSpeed: 0,
    precipitationRate: 0,
    symbol: '',
    windDirection: 0,
    windSpeed: 0,
  },
  status: 'unknown',
})
