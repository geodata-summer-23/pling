import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import { Place } from './place'
import Point from '@arcgis/core/geometry/Point'
import { Category, getCategoryOptions } from './category'
import { useNotificationStore } from '@/stores/notificationStore'

export const metAlertsUrl =
  'https://utility.arcgis.com/usrsvcs/servers/f7978b8123424646bb5960e25d83c606/rest/services/MetAlerts/FeatureServer/0'

export const queryFeatureLayer = async (
  place: Place,
  category: Category,
  url: string,
  withFeatures: (feature: Record<string, any>[]) => void
) => {
  const metAlertsLayer = new FeatureLayer({ url })
  const latitude = place.address.position?.latitude
  const longitude = place.address.position?.longitude
  if (!latitude || !longitude) {
    console.error(`Invalid position for place ${place.nickname}`)
    return
  }

  const results = await metAlertsLayer.queryFeatures({
    spatialRelationship: 'intersects', // Relationship operation to apply
    geometry: new Point({ latitude, longitude }),
    outFields: ['*'], // Attributes to return
    returnGeometry: false,
    distance: 50,
  })

  const features = results.features.map((f) => f.toJSON().attributes)
  if (features.length > 0) {
    useNotificationStore().push({
      title: category,
      body: place.nickname + ' ' + JSON.stringify(features),
      category: category,
      timestamp: Date.now(),
      click: () => undefined,
    })
  }
  withFeatures(features)
}

export const queryAllLayers = async (place: Place) => {
  queryFeatureLayer(place, 'met-alerts', metAlertsUrl, (features) => {
    place.queries['met-alerts'] = features
  })
  getCategoryOptions().forEach((option) => {
    place.queries[option.category] = []
    option.featureLayers.forEach((url) => {
      queryFeatureLayer(place, option.category, url, (features) => {
        const prev =
          option.category in place.queries
            ? place.queries[option.category] ?? []
            : []
        place.queries[option.category] = [...prev, ...features]
      })
    })
  })
}
