import * as locator from '@arcgis/core/rest/locator'
import { Address, Position, getDefaultPlace } from './place'
import { usePlaceStore } from '../stores/placeStore'
import { geoData } from '@/stores/geolocationStore'
import Point from '@arcgis/core/geometry/Point'
import proj4 from 'proj4'

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

  const place = getDefaultPlace()
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

export const positionToAddress = async (
  position: Position,
  address: Address
) => {
  address.position = position
  try {
    const candidate = await locator.locationToAddress(geoData, {
      location: new Point(position),
    })
    address.street = candidate.attributes.Adresse
    address.postalCode = candidate.attributes.Postnummer
    address.city = candidate.attributes.Poststed
  } catch {
    console.warn('Could not find address', position)
  }
}

export const getLatLng = (position: Position) => {
  if (!position.x || !position.y) {
    return position
  }
  const fromProj =
    '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
  const toProj = '+proj=longlat +datum=WGS84 +no_defs +type=crs'

  const { y: latitude, x: longitude } = proj4(fromProj, toProj).forward({
    x: position.x,
    y: position.y,
  })
  return { ...position, latitude, longitude }
}
