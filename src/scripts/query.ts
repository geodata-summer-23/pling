import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import { Place } from './place'
import Point from '@arcgis/core/geometry/Point'
import { Category, getCategoryOptions } from './category'
import { serverUrl } from './url'
import { AlertRequest, NowcastData } from './alert'
import { UserData, useUserStore } from '@/stores/userStore'
import { usePlaceStore } from '@/stores/placeStore'

export const metAlertsUrl =
  'https://utility.arcgis.com/usrsvcs/servers/f7978b8123424646bb5960e25d83c606/rest/services/MetAlerts/FeatureServer/0'

const queryFeatureLayer = async (place: Place, url: string) => {
  const featureLayer = new FeatureLayer({ url })
  const latitude = place.address.position?.latitude
  const longitude = place.address.position?.longitude
  if (!latitude || !longitude) {
    throw Error('Invalid position')
  }

  const results = await featureLayer.queryFeatures({
    spatialRelationship: 'intersects', // Relationship operation to apply
    geometry: new Point({ latitude, longitude }),
    outFields: ['*'], // Attributes to return
    returnGeometry: false,
    distance: 50,
  })

  return results.features.map((f) => f.toJSON().attributes)
}

export const queryFeatureLayers = async (
  place: Place,
  category: Category,
  urls: string[]
) => {
  if (!Array.isArray(place.queries)) {
    place.queries = []
  }
  if (!place.address.position.latitude || !place.address.position.longitude) {
    return false
  }

  let query = place.queries.find((q) => q.category == category)
  place.queries = place.queries.filter((q) => q.category != category)
  if (!query) {
    query = {
      category: category,
      data: [],
    }
  }
  place.queries.push(query)

  const features = await Promise.all(
    urls.map((url) => queryFeatureLayer(place, url))
  )

  const changed = features.length != query.data.length
  query.data = features
  usePlaceStore().saveToLocalStorage()
  return changed
}

export const fetchQueries = async (place: Place, positionChanged = false) => {
  const promises: Promise<boolean>[] = []
  const metAlertsChanged = queryFeatureLayers(place, 'metAlerts', [
    metAlertsUrl,
  ])
  promises.push(metAlertsChanged)

  if (positionChanged) {
    getCategoryOptions().forEach((option) => {
      const queryChanged = queryFeatureLayers(
        place,
        option.category,
        option.featureLayers
      )
      promises.push(queryChanged)
    })
  }
  const changed = (await Promise.all(promises)).some((changed) => !!changed)
  return changed
}

export const fetchEvents = async (place: Place) => {
  if (!place.address.position?.latitude || !place.address.position?.longitude)
    return false
  const response = await fetch(
    `${serverUrl}/events?lat=${place.address.position?.latitude}&lon=${place.address.position?.longitude}`,
    { headers: { 'Content-Type': 'application/json' } }
  )
  const events = JSON.parse(await response.json())
  const changed = JSON.stringify(events) != JSON.stringify(place.events)
  place.events = events
  usePlaceStore().saveToLocalStorage()
  return changed
}

export const fetchAlerts = async (place: Place) => {
  const alertRequest: AlertRequest = JSON.parse(
    JSON.stringify({
      user: useUserStore().$state satisfies UserData,
      place,
    })
  )
  alertRequest.place.alertResponse = { alertSummary: '', alerts: [] }
  alertRequest.place.events.forEach((e) => (e.images = []))

  const response = await fetch(`${serverUrl}/alerts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alertRequest),
  })
  const alertResponse = JSON.parse(await response.json())
  if (!('detail' in alertResponse)) {
    console.log(alertResponse)
    place.alertResponse = alertResponse
  }
  usePlaceStore().saveToLocalStorage()
}

export const fetchNowcast = async (place: Place) => {
  const position = place.address.position
  if (!position.latitude || !position.longitude) {
    return false
  }
  const response = await fetch(
    `${serverUrl}/met/nowcast?lat=${position.latitude}&lon=${position.longitude}`
  )
  const resJson = await response.json()
  const details = resJson.properties.timeseries[0].data.instant.details
  const nowcast = {
    airTemperature: details.air_temperature,
    precipitationRate: details.precipitation_rate,
    windSpeed: details.wind_speed,
    windDirection: details.wind_from_direction,
    gustSpeed: details.wind_speed_of_gust,
    symbol:
      resJson.properties.timeseries[0].data.next_1_hours.summary.symbol_code,
  } satisfies NowcastData
  console.log(nowcast)
  const changed = JSON.stringify(nowcast) != JSON.stringify(place.nowcast)
  place.nowcast = nowcast
  return changed
}
