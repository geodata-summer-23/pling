import { UserData } from '@/stores/userStore'
import { Category, Place, Position } from './place'

export type NowcastData = {
  temp: number
  precipitation: number
  units: string
  symbol: string
}

export type EventData = {
  message: string
  position: Position
  timestamp: number
  category: Category
  dist: number
  imageSrc: string[]
}

export type AlertData = {
  message: string
  position: Position
  timestamp: number
  category: Category
  dist: number
  imageSrc: string[]
}

type Intersection = {
  category: Category
}

export type AlertRequest = {
  place: Place
  user: UserData
  nowcast: NowcastData
  intersections: Intersection[]
}

export type AlertResponse = {}
