import { acceptHMRUpdate, defineStore } from 'pinia'
import { AddressPoint, usePlaceStore } from './placeStore'
import * as locator from '@arcgis/core/rest/locator'
import Point from '@arcgis/core/geometry/Point'

const geoData =
  'https://services.geodataonline.no/arcgis/rest/services/Geosok/GeosokLokasjon2/GeocodeServer'

export const useGeolocationStore = defineStore('geolocation', {
  state: () => ({
    position: null as null | AddressPoint,
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
          locator
            .locationToAddress(geoData, {
              location: new Point(this.position),
            })
            .then((candidate) => {
              const address = usePlaceStore().places[0].address
              address.street = candidate.attributes.Adresse
              address.postalCode = candidate.attributes.Postnummer
              address.city = candidate.attributes.Poststed
            })
        }
      })
    },
  },

  getters: {
    getMapCenter: (state) => {
      return usePlaceStore().currentPlace?.address.point ?? state.position
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGeolocationStore, import.meta.hot))
}
