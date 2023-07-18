import { acceptHMRUpdate, defineStore } from 'pinia'
import { usePlaceStore } from './placeStore'
import * as locator from '@arcgis/core/rest/locator'
import Point from '@arcgis/core/geometry/Point'
import { useHelpRequestStore } from './helpRequestStore'
import { Coordinates } from './place'

const geoData =
  'https://services.geodataonline.no/arcgis/rest/services/Geosok/GeosokLokasjon2/GeocodeServer'

export const useGeolocationStore = defineStore('geolocation', {
  state: () => ({
    position: null as null | Coordinates,
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
      return usePlaceStore().currentPlace?.address.coordinates ?? state.position
    },
  },
})

const updatePosition = (position: GeolocationPosition) => {
  const addressPosition = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  }
  useGeolocationStore().position = addressPosition
  useHelpRequestStore().updateRequests(addressPosition)
  locator
    .locationToAddress(geoData, {
      location: new Point(addressPosition),
    })
    .then((candidate) => {
      const address = usePlaceStore().places[0].address
      address.street = candidate.attributes.Adresse
      address.postalCode = candidate.attributes.Postnummer
      address.city = candidate.attributes.Poststed
    })
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGeolocationStore, import.meta.hot))
}
