import { acceptHMRUpdate, defineStore } from 'pinia'

export const useGeolocationStore = defineStore('geolocation', {
  state: () => ({
    position: null as null | GeolocationPosition,
  }),

  actions: {
    withPosition(f: (pos: GeolocationPosition) => void) {
      if (this.position) {
        f(this.position)
      }
      navigator.geolocation.getCurrentPosition((position) => {
        if (position != this.position) {
          this.position = position
          f(this.position)
        }
      })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGeolocationStore, import.meta.hot))
}