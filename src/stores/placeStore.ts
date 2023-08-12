import { acceptHMRUpdate, defineStore } from 'pinia'
import { Place, getDefaultMyLocation, getDefaultPlace } from '../scripts/place'
import { AddressResult, getLatLng } from '@/scripts/search'
import {
  fetchAlertSummary,
  fetchAlerts,
  fetchEvents,
  fetchNowcast,
  fetchQueries,
} from '@/scripts/query'
import { Category, allCategories } from '@/scripts/category'
import { $t } from '@/translation'

export const usePlaceStore = defineStore('place', {
  state: () => ({
    places: [] as Place[],
    currentPlace: null as null | Place,
    history: [] as AddressResult[],
  }),

  actions: {
    async addPlace(place: Place) {
      Object.assign(place.address.position, getLatLng(place.address.position))
      this.places.push(place)
      await updatePlace(place, { force: true })
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
      }
      const defaultPlace = getDefaultPlace()
      this.places.forEach((place) => {
        if (!place.icon) {
          place.icon = defaultPlace.icon
        }
        Object.assign(place.address.position, getLatLng(place.address.position))
        Object.keys(defaultPlace).forEach((key) => {
          if (!(key in place)) {
            // @ts-ignore
            place[key as keyof Place] = JSON.parse(
              JSON.stringify(defaultPlace[key as keyof Place])
            )
          }
        })
        updatePlace(place, {
          positionChanged: true,
          force: place == this.places[0],
        })
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

export const updatePlace = async (
  place: Place,
  { positionChanged = false, force = false }
) => {
  place.status = 'loading'
  if (!place.alertSummary) {
    place.alertSummary = $t().generatingSummary
  }
  if (!place.address.position.latitude || !place.address.position.latitude) {
    console.error(`Invalid position of ${place.nickname}`)
    place.status = 'failed'
    place.alertSummary = $t().summaryFailed
    return
  }
  try {
    const promises: Promise<Category[]>[] = []
    promises.push(fetchEvents(place))
    promises.push(fetchNowcast(place))
    promises.push(fetchQueries(place, positionChanged || force))
    const changedCategories = [...new Set((await Promise.all(promises)).flat())]
    const categories = force ? allCategories : changedCategories
    console.log('updatePlace', place.nickname, categories)
    if (categories.length > 0) {
      const changed = await fetchAlerts(place, categories)
      if (changed) {
        place.alertSummary = $t().generatingSummary
        await fetchAlertSummary(place)
        console.log('updateSummary', place.nickname)
      }
    }
    if (place.alertSummary == $t().generatingSummary) {
      place.alertSummary = $t().noDangers
    }
    if (place.status == 'loading') place.status = 'success'
  } catch {
    place.status = 'failed'
    place.alertSummary = $t().summaryFailed
    place.alerts = []
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePlaceStore, import.meta.hot))
}
