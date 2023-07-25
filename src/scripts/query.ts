import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import { Place } from './place'
import Point from '@arcgis/core/geometry/Point'
import {
  Category,
  FeatureLayerUrls,
  allCategories,
  getCategoryOptions,
} from './category'
import { serverUrl } from './url'
import {
  Alert,
  AlertRequest,
  FeatureQuery,
  NowcastData,
  ObservedEvent,
} from './alert'
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
  const changed = !(
    queriesPrev.every((a) =>
      queries.some((b) => JSON.stringify(a) == JSON.stringify(b))
    ) &&
    queries.every((a) =>
      queriesPrev.some((b) => JSON.stringify(a) == JSON.stringify(b))
    )
  )
  if (changed) {
    console.log(
      place.nickname,
      category,
      JSON.parse(JSON.stringify(queriesPrev)),
      JSON.parse(JSON.stringify(queries))
    )
  }
  return changed ? category : false
}

export const fetchQueries = async (place: Place, positionChanged = false) => {
  const promises: Promise<Category | false>[] = []
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
  return (await Promise.all(promises)).filter(
    (category) => !!category
  ) as Category[]
}

export const fetchEvents = async (place: Place) => {
  if (!place.address.position?.latitude || !place.address.position?.longitude)
    return []
  const response = await fetch(
    `${serverUrl}/events?lat=${place.address.position?.latitude}&lon=${place.address.position?.longitude}`,
    { headers: { 'Content-Type': 'application/json' } }
  )
  const events = JSON.parse(await response.json()) as ObservedEvent[]
  const changedCategories = [
    ...events.filter(
      (a) => !place.events.some((b) => a.timeCreated == b.timeCreated)
    ),
    ...place.events.filter(
      (a) => !events.some((b) => a.timeCreated == b.timeCreated)
    ),
  ].map((e) => e.category)
  place.events = events
  usePlaceStore().saveToLocalStorage()
  return [...new Set(changedCategories)]
}

export const fetchAlerts = async (place: Place, categories: Category[]) => {
  const alertRequest: AlertRequest = JSON.parse(
    JSON.stringify({
      user: useUserStore().$state satisfies UserData,
      place,
    })
  )
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
      place.alerts = place.alerts.filter((alert) => alert.category != category)
      if (!response.ok) return
      const alert = JSON.parse(await response.json()) as Alert
      if (!alert) return
      place.alerts = [...place.alerts, alert]
      console.log('Alert', place.nickname, category)
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
  console.log('Summary', place.nickname)
  usePlaceStore().saveToLocalStorage()
}

export const fetchNowcast = async (place: Place) => {
  const position = place.address.position
  if (!position.latitude || !position.longitude) {
    return []
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
  const changedCategories: Category[] = []
  if (!place.nowcast) {
    return allCategories
  }
  if (
    Math.round(place.nowcast.airTemperature) !=
    Math.round(nowcast.airTemperature)
  ) {
    changedCategories.push('temperature')
  }
  if (
    Math.round(place.nowcast.gustSpeed) != Math.round(nowcast.gustSpeed) ||
    Math.round(place.nowcast.windSpeed) != Math.round(nowcast.windSpeed) ||
    Math.round(place.nowcast.windDirection) != Math.round(nowcast.windDirection)
  ) {
    changedCategories.push('katabaticWind')
  }
  if (
    Math.round(place.nowcast.precipitationRate) !=
    Math.round(nowcast.precipitationRate)
  ) {
    changedCategories.push('flood')
    changedCategories.push('rainFlood')
    changedCategories.push('quickClay')
  }
  place.nowcast = nowcast
  return [...new Set(changedCategories)]
}
