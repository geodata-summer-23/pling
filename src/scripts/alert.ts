import { UserData } from '@/stores/userStore'
import { Place, Position } from './place'
import { Category } from './category'

export type NowcastData = {
  temperature: number
  precipitation: number
  unit: string
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

export type AlertData = {
  message: string
  position: Position
  timestamp: number
  category: Category
  distance: number
  images: string[]
}

export type FeatureQuery = Record<string, any>[]

export type Queries = Partial<Record<Category, FeatureQuery>>

export type AlertRequest = {
  place: Place
  user: UserData
  nowcast: NowcastData
  queries: Queries
}

export type AlertResponse = {}
