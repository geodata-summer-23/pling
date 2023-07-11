import { defineStore } from "pinia"
import { AddressPoint } from "./placeStore"
import { useGeolocationStore } from "./geolocationStore"


export type CategoryState = 'flood' | 'torrentialRain' | 'fire' | 'wind' | 'avalanche' | 'other'
export type AlertData = {
  message: string,
  position: AddressPoint,
  timestamp: number,
  category: CategoryState,
  dist: number
}


export const useEventStore = defineStore('event', {
  state: () => ({
    events: [] as AlertData[],
  }),

  actions: {
    init() {
      if (!useGeolocationStore().position?.latitude || !useGeolocationStore().position?.longitude) {
        console.error('Invalid position')
        return
      }
      this.updateEvents(useGeolocationStore().position?.latitude, useGeolocationStore().position?.longitude)
    },
    async updateEvents(lat: number | undefined, lon:number | undefined) {
      if (!lat || !lon) {
        console.error('Invalid position')
        return
      }
      try {
        const response = await fetch(
          `http://localhost:8000/alerts?lat=${lat}&lon=${lon}`,
          { headers: { 'Content-Type': 'application/json' } }
        )
        this.events = JSON.parse(await response.json())
        console.log('got alerts')
      } catch {
        console.log('failed to get alerts')
      }
    }
  }
})
