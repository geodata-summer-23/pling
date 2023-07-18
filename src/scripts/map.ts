import Point from '@arcgis/core/geometry/Point'
import MapView from '@arcgis/core/views/MapView'

export const mapObjects = {
  mapView: null as MapView | null,
}

export type ViewClickEvent = {
  mapPoint: Point
  x: number
  y: number
  button: number
  buttons: number
}
