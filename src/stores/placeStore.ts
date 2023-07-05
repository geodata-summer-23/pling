import { acceptHMRUpdate, defineStore } from 'pinia'
import proj4 from 'proj4'


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
  point?: AddressPoint
}

export type AddressPoint = {
  x?: number
  y?: number
  latitude?: number
  longitude?: number
}

export const usePlaceStore = defineStore('place', {
  state: () => ({
    places: [] as Place[],
  }),

  actions: {
    addPlace(place: Place) {
      if (place.address?.point?.x && place.address?.point?.y) {
        console.log("hei")
        const fromProj = '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
        const toProj = '+proj=longlat +datum=WGS84 +no_defs +type=crs'

        const latLon = proj4(fromProj, toProj).forward({x: place.address?.point?.x, y: place.address?.point?.y})
        place.address.point.latitude = latLon.y
        place.address.point.longitude = latLon.x
      }
      this.places.push(place)
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
        this.places[0].address.point = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
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
