import { defineStore } from 'pinia'

export enum Danger {
  Flood,
  Fire,
  ForestFire,
  Stormwater,
  Wind,
}

export type Place = {
  name: string
  address: Address
  excludeDangers: Danger[]
}

export type Address = {
  city?: string
  postalCode?: number
  street?: string
  streetNumber?: string
}

export const usePlaceStore = defineStore('place', {
  state: () => ({
    places: [] as Place[],
  }),

  actions: {
    addPlace(name: string) {
      this.places.push({
        name,
        address: {}, // TODO
        excludeDangers: [],
      })
    },
  },
})
