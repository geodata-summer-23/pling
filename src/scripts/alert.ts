import { UserData } from '@/stores/userStore'
import { Place, Position } from './place'
import { Category, Severity } from './category'

export type NowcastData = {
  airTemperature: number
  precipitationRate: number
  windDirection: number
  windSpeed: number
  gustSpeed: number
  symbol: string
}

export type Observation = {
  message: string
  position: Position
  category: Category
  image: string
}

export type ObservedEvent = {
  summary: string
  position: Position
  timeCreated: number
  category: Category
  distance: number
  images: string[]
}

export type Alert = {
  message: string
  position: Position
  timestamp: number
  category: Category
  distance: number
  images: string[]
  advices: string[]
  severity: Severity
  observationCount: number
}

export type FeatureQuery = {
  category: Category
  key: string
  attributes: object
}

export type AlertRequest = {
  place: Place
  user: UserData
  category: Category
}
