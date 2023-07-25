import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import { Place } from './place'
import Point from '@arcgis/core/geometry/Point'
import {
  Category,
  FeatureLayerUrls,
  categories,
  getCategoryOptions,
} from './category'
import { serverUrl } from './url'
import { Alert, AlertRequest, FeatureQuery, NowcastData } from './alert'
import { UserData, useUserStore } from '@/stores/userStore'
import { usePlaceStore } from '@/stores/placeStore'

export const metAlertsUrl =
  'https://utility.arcgis.com/usrsvcs/servers/f7978b8123424646bb5960e25d83c606/rest/services/MetAlerts/FeatureServer/0'

const queryFeatureLayer = async (
  place: Place,
  category: Category,
  key: string,
  url: string,
  radius: number
) => {
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
    distance: radius,
  })

  return results.features.map(
    (f) =>
      ({
        attributes: f.toJSON().attributes,
        category,
        key,
      } as FeatureQuery)
  )
}

export const queryFeatureLayers = async (
  place: Place,
  category: Category,
  urls: FeatureLayerUrls
) => {
  if (!Array.isArray(place.queries)) {
    place.queries = []
  }
  if (!place.address.position.latitude || !place.address.position.longitude) {
    return false
  }

  const queriesPrev = place.queries.filter((q) => q.category == category)
  place.queries = place.queries.filter((q) => q.category != category)

  const queries = (
    await Promise.all(
      Object.entries(urls).map(([key, url]) =>
        queryFeatureLayer(place, category, key, url.url, url.radius)
      )
    )
  ).flat()

  place.queries = [...place.queries, ...queries]
  usePlaceStore().saveToLocalStorage()
  const changed =
    queriesPrev.every((a) => queries.some((b) => a.key == b.key)) &&
    queries.every((a) => queriesPrev.some((b) => a.key == b.key))
  return changed
}

export const fetchQueries = async (place: Place, positionChanged = false) => {
  const promises: Promise<boolean>[] = []
  const metAlertsChanged = queryFeatureLayers(place, 'metAlerts', {
    metAlerts: { url: metAlertsUrl, radius: 50 },
  })
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
  place.alerts = []
  await Promise.all(
    categories.map(async (category) => {
      const response = await fetch(`${serverUrl}/alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...alertRequest,
          category,
        }),
      })
      if (!response.ok) return
      const alert = JSON.parse(await response.json()) as Alert
      if (!alert) return
      place.alerts = [...place.alerts, alert]
    })
  )
  usePlaceStore().saveToLocalStorage()
}

export const fetchAlertSummary = async (place: Place) => {
  const alertRequest: AlertRequest = JSON.parse(
    JSON.stringify({
      user: useUserStore().$state satisfies UserData,
      place,
    })
  )

  const response = await fetch(`${serverUrl}/alert-summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alertRequest),
  })
  if (!response.ok) {
    return
  }
  place.alertSummary = await response.text()
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
    airTemperature: details.air_temperature ?? 0,
    precipitationRate: details.precipitation_rate ?? 0,
    windSpeed: details.wind_speed ?? 0,
    windDirection: details.wind_from_direction ?? 0,
    gustSpeed: details.wind_speed_of_gust ?? 0,
    symbol:
      resJson.properties.timeseries[0].data.next_1_hours.summary.symbol_code ??
      '',
  } satisfies NowcastData
  const changed = JSON.stringify(nowcast) != JSON.stringify(place.nowcast)
  place.nowcast = nowcast
  return changed
}
