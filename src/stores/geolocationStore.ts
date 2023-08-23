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
    watchId: null as null | number,
  }),

  actions: {
    init() {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        this.watchPosition(result)
        result.addEventListener('change', () => {
          this.watchPosition(result)
        })
      })
    },
    watchPosition(result: PermissionStatus) {
      if (result.state !== 'granted') {
        updatePosition(this.position)
        return
      }
      if (this.watchId != null) navigator.geolocation.clearWatch(this.watchId)
      navigator.geolocation.getCurrentPosition((position) => {
        updatePosition(position.coords)
      })
      this.watchId = navigator.geolocation.watchPosition((position) => {
        if (
          position.coords.latitude != this.position?.latitude ||
          position.coords.longitude != this.position?.longitude
        ) {
          updatePosition(position.coords)
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

const updatePosition = (position: Position) => {
  const myLocation = usePlaceStore().places[0]
  myLocation.address.position = position
  throttledUpdatePlace(myLocation)
  useGeolocationStore().position = position
  useHelpRequestStore().updateRequests(position)
  positionToAddress(position, myLocation.address)
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGeolocationStore, import.meta.hot))
}
