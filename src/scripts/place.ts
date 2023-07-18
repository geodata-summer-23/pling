import { $t } from '@/translation'
import { AlertData, EventData } from './alert'

export type Place = {
  nickname: string
  icon: string
  address: Address
  events: EventData[]
  alerts: AlertData[]
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

export const defaultMyLocation = (): Place => ({
  nickname: $t().myLocation,
  icon: 'location-crosshairs',
  address: { position: {} },
  events: [],
  alerts: [],
})

export const defaultPlace = (): Place => ({
  nickname: '',
  icon: 'location-dot',
  address: { position: {} },
  events: [],
  alerts: [],
})
