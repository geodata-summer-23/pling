import { acceptHMRUpdate, defineStore } from 'pinia'

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
  latitude?: number
  longitude?: number
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
      this.saveToLocalStorage()
    },
    removePlace(place: Place) {
      const index = this.places.indexOf(place)
      if (index != -1) {
        this.places.splice(index, 1)
      }
      this.saveToLocalStorage()
    },
    loadFromLocalStorage() {
      this.places = JSON.parse(localStorage.getItem('places') ?? '[]')
      if (this.places.length == 0) {
        this.places.push({
          name: 'My Location',
          address: {},
          excludeDangers: [],
        })
      }
      navigator.geolocation.getCurrentPosition(async (position) => {
        this.places[0].address.latitude = position.coords.latitude
        this.places[0].address.longitude = position.coords.longitude
      })
    },
    saveToLocalStorage() {
      localStorage.setItem('places', JSON.stringify(this.places))
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePlaceStore, import.meta.hot))
}
