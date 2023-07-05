import { acceptHMRUpdate, defineStore } from 'pinia'
import { AddressPoint } from './placeStore'

export const useGeolocationStore = defineStore('geolocation', {
  state: () => ({
    position: null as null | AddressPoint,
    mapCenter: null as null | AddressPoint,
  }),

  actions: {
    init() {
      navigator.geolocation.watchPosition((position) => {
        if (
          position.coords.latitude != this.position?.latitude ||
          position.coords.longitude != this.position.longitude
        ) {
          this.position = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
        }
      })
    },
  },

  getters: {
    getMapCenter: (state) => {
      return state.mapCenter ?? state.position
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGeolocationStore, import.meta.hot))
}
