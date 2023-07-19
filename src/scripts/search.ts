import * as locator from '@arcgis/core/rest/locator'
import { Address, Position, defaultPlace } from './place'
import { usePlaceStore } from '../stores/placeStore'
import { geoData } from '@/stores/geolocationStore'

export type AddressResult = {
  address: string
  location: Position
}

export const selectResult = (result: AddressResult) => {
  const placeStore = usePlaceStore()
  placeStore.history = placeStore.history.filter(
    (r) => r.address != result.address
  )
  placeStore.history.push(result)

  const place = defaultPlace()
  place.address.position = result.location
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
