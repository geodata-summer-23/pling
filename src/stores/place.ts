import { $t } from '@/translation'
import { UserData } from './userStore'

export enum Danger {
  Flood,
  Fire,
  ForestFire,
  Stormwater,
  Wind,
}

export type EventData = {
  message: string
  position: Coordinates
  timestamp: number
  category: Category
  dist: number
  imageSrc: string[]
}

export type AlertData = {
  message: string
  position: Coordinates
  timestamp: number
  category: Category
  dist: number
  imageSrc: string[]
}

export type AlertRequest = {
  place: Place
  user: UserData
}

export type AlertResponse = {}

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
  coordinates?: Coordinates
}

export type Coordinates = {
  x?: number
  y?: number
  latitude?: number
  longitude?: number
}

export type AddressResult = {
  address: string
  location: Coordinates
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
  address: {},
  events: [],
  alerts: [],
})

export const defaultPlace = (): Place => ({
  nickname: '',
  icon: 'location-dot',
  address: {},
  events: [],
  alerts: [],
})
