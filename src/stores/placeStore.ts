import { $t } from '@/translation'
import { acceptHMRUpdate, defineStore } from 'pinia'
import proj4 from 'proj4'
import * as locator from '@arcgis/core/rest/locator'
import { serverUrl } from '@/main'

export enum Danger {
  Flood,
  Fire,
  ForestFire,
  Stormwater,
  Wind,
}

export type Place = {
  nickname: string
  icon: string
  address: Address
  excludeDangers: Danger[]
  events: AlertData[]
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

export type AddressResult = {
  address: string
  location: AddressPoint
}

export type Category =
  | 'flood'
  | 'rainflood'
  | 'heatwave'
  | 'falling-wind'
  | 'quick-clay'
  | 'storm-surge'
  | 'sea-rise'
  | 'other'

export const getCategoryIconSrc = (category: Category) => {
  return category == 'other'
    ? './warningIcons/icon-warning-extreme-red.svg'
    : `./warningIcons/icon-warning-${category}-red.svg`
}

export type AlertData = {
  message: string
  position: AddressPoint
  timestamp: number
  category: Category
  dist: number
  imageSrc: string[]
}

export const defaultMyLocation = (): Place => ({
  nickname: $t().myLocation,
  icon: 'location-crosshairs',
  address: {},
  excludeDangers: [],
  events: [],
})

export const defaultPlace = (): Place => ({
  nickname: '',
  icon: 'location-dot',
  address: {},
  excludeDangers: [],
  events: [],
})

export const usePlaceStore = defineStore('place', {
  state: () => ({
    places: [] as Place[],
    currentPlace: null as null | Place,
    history: [] as AddressResult[],
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
      this.places.forEach((place) => {
        if (!place.icon) {
          place.icon = defaultPlace().icon
        }
        updateEvents(place)
      })
      if (this.places.length == 0) {
        this.places.push(defaultMyLocation())
      } else {
        Object.assign(this.places[0], defaultMyLocation())
      }
      this.currentPlace = this.places[0]
      navigator.geolocation.getCurrentPosition(async (position) => {
        this.places[0].address.point = {
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

export const selectResult = (result: AddressResult) => {
  const placeStore = usePlaceStore()
  placeStore.history = placeStore.history.filter(
    (r) => r.address != result.address
  )
  placeStore.history.push(result)

  const place = defaultPlace()
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
  withResults: (results: AddressResult[]) => void
) => {
  let results = usePlaceStore()
    .history.reverse()
    .filter((r) =>
      r.address.toLowerCase().includes(address.street?.toLowerCase() ?? '')
    )
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
      results = results.concat(candidates.map((r) => r.toJSON()))
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

export const updateEvents = async (place: Place) => {
  if (!place.address.point?.latitude || !place.address.point?.longitude) return
  const response = await fetch(
    `${serverUrl}/alerts?lat=${place.address.point?.latitude}&lon=${place.address.point?.longitude}`,
    { headers: { 'Content-Type': 'application/json' } }
  )
  place.events = JSON.parse(await response.json())
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePlaceStore, import.meta.hot))
}
