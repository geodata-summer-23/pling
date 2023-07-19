import { acceptHMRUpdate, defineStore } from 'pinia'
import { updateEvents, usePlaceStore } from './placeStore'
import * as locator from '@arcgis/core/rest/locator'
import Point from '@arcgis/core/geometry/Point'
import { useHelpRequestStore } from './helpRequestStore'
import { Position } from '../scripts/place'
import { queryAllLayers } from '@/scripts/query'

export const geoData =
  'https://services.geodataonline.no/arcgis/rest/services/Geosok/GeosokLokasjon2/GeocodeServer'

export const useGeolocationStore = defineStore('geolocation', {
  state: () => ({
    position: null as null | Position,
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

const updatePosition = (position: GeolocationPosition) => {
  const addressPosition = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  }
  const currentPlace = usePlaceStore().currentPlace
  if (currentPlace) {
    updateEvents(currentPlace)
    // queryAllLayers(currentPlace) // TODO
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

// fetch('https://services.geodataonline.no/arcgis/tokens/', {
//   method: 'POST',
//   body: JSON.stringify({
//     username: 'sommerstudenter23',
//     password: 'Geodata!23',
//   }),
// })
//   .then((res) => res.text())
//   .then((res) => {
//     locator
//       .locationToAddress(
//         geoData,
//         {
//           location: new Point(addressPosition),
//         },
//         {
//           query: {
//             username: 'sommerstudenter231212',
//             password: 'Geodata!23',
//           },
//         }
//       )
//       .then((candidate) => {
//         const address = usePlaceStore().places[0].address
//         address.street = candidate.attributes.Adresse
//         address.postalCode = candidate.attributes.Postnummer
//         address.city = candidate.attributes.Poststed
//       })
//   })
