import { $t } from '@/translation'
import { AlertResponse, NowcastData, ObservedEvent, Queries } from './alert'

export type Place = {
  nickname: string
  icon: string
  address: Address
  events: ObservedEvent[]
  queries: Queries
  nowcast?: NowcastData
  alertResponse: AlertResponse
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
  alertResponse: {
    alertSummary: '',
    alerts: [],
  },
})

export const getDefaultPlace = (): Place => ({
  nickname: '',
  icon: 'location-dot',
  address: { position: {} },
  events: [],
  queries: [],
  alertResponse: {
    alertSummary: '',
    alerts: [],
  },
})
