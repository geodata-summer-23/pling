import { acceptHMRUpdate, defineStore } from 'pinia'
import { updatePlace, usePlaceStore } from './placeStore'
import { useHelpRequestStore } from './helpRequestStore'
import { Place, Position } from '../scripts/place'
import throttle from 'lodash.throttle'
import { positionToAddress } from '@/scripts/search'

export const geoData =
  'https://services.geodataonline.no/arcgis/rest/services/Geosok/GeosokLokasjon2/GeocodeServer'

export const useGeolocationStore = defineStore('geolocation', {
  state: () => ({
    position: {
      latitude: 59.91037848488237,
      longitude: 10.762804804817256,
    } as Position,
  }),

  actions: {
    init() {
      navigator.geolocation.getCurrentPosition((position) => {
        updatePosition(position)
      })
      navigator.geolocation.watchPosition((position) => {
        if (
          position.coords.latitude != this.position?.latitude ||
          position.coords.longitude != this.position?.longitude
        ) {
          updatePosition(position)
        }
      })
    },
  },

  getters: {
    getMapCenter: (state) => {
      return usePlaceStore().currentPlace?.address.position ?? state.position
    },
  },
})

const throttledUpdatePlace = throttle(
  (place: Place) => updatePlace(place, { positionChanged: true }),
  3 * 60_000
)

const updatePosition = (geoPosition: GeolocationPosition) => {
  const position = {
    latitude: geoPosition.coords.latitude,
    longitude: geoPosition.coords.longitude,
  }
  const myLocation = usePlaceStore().places[0]
  if (myLocation) {
    throttledUpdatePlace(myLocation)
  }
  useGeolocationStore().position = position
  useHelpRequestStore().updateRequests(position)
  positionToAddress(position, usePlaceStore().places[0].address)
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGeolocationStore, import.meta.hot))
}
