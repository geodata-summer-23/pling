import { UserData } from '@/stores/userStore'
import { Place, Position } from './place'
import { Category } from './category'

export type NowcastData = {
  temperature: number
  precipitation: number
  unit: string
  symbol: string
}

export type EventData = {
  message: string
  position: Position
  timestamp: number
  category: Category
  distance: number
  images: string[]
}

export type AlertData = {
  message: string
  position: Position
  timestamp: number
  category: Category
  distance: number
  images: string[]
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
