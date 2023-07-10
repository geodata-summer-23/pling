import { $t } from '@/translation'
import { acceptHMRUpdate, defineStore } from 'pinia'
import proj4 from 'proj4'
import * as locator from '@arcgis/core/rest/locator'

export enum Danger {
  Flood,
  Fire,
  ForestFire,
  Stormwater,
  Wind,
}

export type Place = {
  nickname: string
  address: Address
  excludeDangers: Danger[]
}

export type Address = {
  city?: string
  postalCode?: number
  street?: string
  point?: AddressPoint
}

export type AddressPoint = {
  x?: number
  y?: number
  latitude?: number
  longitude?: number
}

export const usePlaceStore = defineStore('place', {
  state: () => ({
    places: [] as Place[],
    currentPlace: null as null | Place,
  }),

  actions: {
    addPlace(place: Place) {
      if (place.address?.point?.x && place.address?.point?.y) {
        const fromProj =
          '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
        const toProj = '+proj=longlat +datum=WGS84 +no_defs +type=crs'

        const latLon = proj4(fromProj, toProj).forward({
          x: place.address?.point?.x,
          y: place.address?.point?.y,
        })
        place.address.point.latitude = latLon.y
        place.address.point.longitude = latLon.x
      }
      this.places.push(place)
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
        this.places.push({
          nickname: $t().myLocation,
          address: {},
          excludeDangers: [],
        })
      } else {
        this.places[0].nickname = $t().myLocation
      }
      this.currentPlace = this.places[0]
      navigator.geolocation.getCurrentPosition(async (position) => {
        this.places[0].address.point = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
      })
    },
    saveToLocalStorage() {},
  },
})

export const selectResult = (result: Record<string, any>) => {
  const place: Place = {
    nickname: 'Search result',
    address: {
      point: result.location,
    },
    excludeDangers: [],
  }
  if (!result.address.includes(',')) {
    const [postalCode, city] = result.address.trim().split(' ')
    place.address.postalCode = parseInt(postalCode)
    place.address.city = city
    place.address.street = ''
    place.nickname = `${postalCode} ${city}`
    return place
  }
  const [streetAddress, postalCodeAndCity] = result.address.split(',')
  place.address.street = streetAddress
  place.nickname = streetAddress
  if (postalCodeAndCity) {
    const [postalCode, city] = postalCodeAndCity.trim().split(' ')
    place.address.postalCode = parseInt(postalCode)
    place.address.city = city
    place.nickname += `, ${postalCode} ${city}`
  }
  return place
}

const geoData =
  'https://services.geodataonline.no/arcgis/rest/services/Geosok/GeosokLokasjon2/GeocodeServer'

export const searchAddress = async (
  address: Address,
  withResults: (results: Record<string, any>[]) => void
) => {
  let results: Record<string, any>[] = []
  locator
    .addressToLocations(geoData, {
      address: {
        Adresse: address.street ?? '',
        Postnummer: address.postalCode ?? '',
        Poststed: address.city ?? '',
      },
      maxLocations: 5,
    })
    .then((candidates) => {
      results = candidates.map((r) => r.toJSON())
      withResults(results)

      locator
        .addressToLocations(geoData, {
          address: {
            Adresse: address.street ?? '',
          },
          maxLocations: 5,
        })
        .then((candidates) => {
          results = results.concat(
            candidates
              .map((r) => r.toJSON())
              .filter((a) => !results.some((b) => a.address == b.address))
          )
          withResults(results)
        })
    })
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePlaceStore, import.meta.hot))
}
