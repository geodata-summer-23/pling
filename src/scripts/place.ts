import { $t } from '@/translation'
import { Alert, FeatureQuery, NowcastData, ObservedEvent } from './alert'

export type Place = {
  nickname: string
  icon: string
  address: Address
  events: ObservedEvent[]
  queries: FeatureQuery[]
  nowcast?: NowcastData
  alerts: Alert[]
  alertSummary: string
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
  nickname: $t().myLocation,
  icon: 'location-crosshairs',
  address: { position: {} },
  events: [],
  queries: [],
  alertSummary: '',
  alerts: [],
})

export const getDefaultPlace = (): Place => ({
  nickname: '',
  icon: 'location-dot',
  address: { position: {} },
  events: [],
  queries: [],
  alertSummary: '',
  alerts: [],
})
