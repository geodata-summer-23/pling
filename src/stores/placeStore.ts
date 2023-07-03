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
    removePlace(place: Place) {
      const index = this.places.indexOf(place)
      if (index != -1) {
        this.places.splice(index, 1)
      }
    },
    loadFromLocalStorage() {
      this.places = JSON.parse(localStorage.getItem('places') ?? '[]')
    },

    saveToLocalStorage() {
      localStorage.setItem('places', JSON.stringify(this.places))
    },
  },
})
