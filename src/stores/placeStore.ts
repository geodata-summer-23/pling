import { acceptHMRUpdate, defineStore } from 'pinia'
import proj4 from 'proj4'
import {
  Place,
  Position,
  getDefaultMyLocation,
  getDefaultPlace,
} from '../scripts/place'
import { AddressResult } from '@/scripts/search'
import {
  fetchAlerts,
  fetchEvents,
  fetchNowcast,
  fetchQueries,
} from '@/scripts/query'
import throttle from 'lodash.throttle'

export const usePlaceStore = defineStore('place', {
  state: () => ({
    places: [] as Place[],
    currentPlace: null as null | Place,
    history: [] as AddressResult[],
  }),

  actions: {
    addPlace(place: Place) {
      Object.assign(place.address.position, getLatLng(place.address.position))
      this.places.push(place)
      updatePlace(place, true)
      this.saveToLocalStorage()
    },
    removePlace(place: Place) {
      const index = this.places.indexOf(place)
      // cannot delete place 0
      if (index > 0) {
        this.places.splice(index, 1)
        this.saveToLocalStorage()
      }
    },
    loadFromLocalStorage() {
      this.places = JSON.parse(localStorage.getItem('places') ?? '[]')
      if (this.places.length == 0) {
        this.places.push(getDefaultMyLocation())
      } else {
        Object.assign(this.places[0], getDefaultMyLocation())
      }
      const defaultPlace = getDefaultPlace()
      this.places.forEach((place) => {
        if (!place.icon) {
          place.icon = defaultPlace.icon
        }
        Object.keys(defaultPlace).forEach((key) => {
          if (!(key in place)) {
            place[key as keyof Place] = JSON.parse(
              JSON.stringify(defaultPlace[key as keyof Place])
            )
          }
        })
        updatePlace(place)
      })
      this.currentPlace = this.places[0]
      navigator.geolocation.getCurrentPosition(async (position) => {
        this.places[0].address.position = {
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

export const updatePlace = throttle(
  async (place: Place, positionChanged = false) => {
    const promises: Promise<boolean>[] = []
    promises.push(fetchEvents(place))
    promises.push(fetchNowcast(place))
    promises.push(fetchQueries(place, positionChanged))
    const anyChanged = (await Promise.all(promises)).some((change) => !!change)
    if (anyChanged) {
      await fetchAlerts(place)
    }
  },
  10000
  // { trailing: false }
)

const getLatLng = (position: Position) => {
  if (!position.x || !position.y) return
  const fromProj =
    '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
  const toProj = '+proj=longlat +datum=WGS84 +no_defs +type=crs'

  const { y: latitude, x: longitude } = proj4(fromProj, toProj).forward({
    x: position.x,
    y: position.y,
  })
  return { latitude, longitude }
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePlaceStore, import.meta.hot))
}
