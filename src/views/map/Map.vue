<template>
  <div id="mapViewDiv">
    <button
      class="esri-ui-top-right esri-ui-corner"
      style="margin-top: 5em; margin-right: 1em"
      @click="paneOpen = !paneOpen"
    >
      Layers
    </button>
  </div>
  <SlideUpPane :open="paneOpen" @close="paneOpen = false">
    <div class="layerListPane">
      <div id="layerList"></div>
    </div>
  </SlideUpPane>
</template>

<script lang="ts" setup>
import WebMap from '@arcgis/core/WebMap'
import MapView from '@arcgis/core/views/MapView'
import Graphic from '@arcgis/core/Graphic'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
// import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
// import FeatureLayerView from '@arcgis/core/views/layers/FeatureLayerView'
import Point from '@arcgis/core/geometry/Point'
import Search from '@arcgis/core/widgets/Search'
import LayerList from '@arcgis/core/widgets/LayerList'
import SlideUpPane from '@/components/SlideUpPane.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { useGeolocationStore } from '@/stores/geolocationStore'

const props = defineProps<{
  latitude?: number
  longitude?: number
}>()

const graphicsLayer = new GraphicsLayer()
const paneOpen = ref(false)
const mapView = ref<MapView | null>(null)
let point: Graphic | null = null
let watchPositionReference: number | null = null

const initLayerList = (view: MapView) => {
  view.map.layers.map((layer) => {
    layer.watch(
      'visible',
      (visible) => {
        if (visible) {
          view.map.layers.map((layer) => {
            if (layer.title !== layer.title) {
              layer.visible = false
            }
          })
        }
      },
      !!layer.title
    )
  })
  new LayerList({
    view: view,
    container: 'layerList',
  })
}

const createPointGraphic = (latitude: number, longitude: number) => {
  const simpleMarkerSymbol = {
    type: 'simple-marker',
    color: [226, 119, 40], // Orange
    outline: {
      color: [255, 255, 255], // White
      width: 1,
    },
  }
  const pointGraphic = new Graphic({
    geometry: new Point({ latitude, longitude }),
    symbol: simpleMarkerSymbol,
  })
  return pointGraphic
}

onMounted(() => {
  const map = new WebMap({
    // basemap: 'streets-vector',
    portalItem: {
      id: 'b139409c28884967a1a603695e0b478d', // https://arcg.is/1mTnbH
    },
  })
  map.add(graphicsLayer)

  const view = new MapView({
    map: map,
    container: 'mapViewDiv',
    center: [11, 60],
    zoom: 12,
  })
  mapView.value = view

  const search = new Search({
    view: view,
    goToOverride: console.log,
  })
  view.ui.add(search, 'top-right')

  initLayerList(view)

  view.when(() => {
    if (props.latitude && props.longitude) {
      view.goTo({
        center: [props.longitude, props.latitude],
        zoom: 12,
      })
    } else {
      useGeolocationStore().withPosition((position) => {
        view.goTo({
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 12,
        })
      })
    }
  })

  watchPositionReference = navigator.geolocation.watchPosition(
    async (position) => {
      view.when(() => {
        if (point) {
          point.geometry = new Point({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          console.log(
            `Moved to ${position.coords.latitude}, ${position.coords.longitude}`
          )
        } else {
          const newPoint = createPointGraphic(
            position.coords.latitude,
            position.coords.longitude
          )
          graphicsLayer.add(newPoint)
          point = newPoint
        }
      })
    }
  )

  // view.when(() => {
  //   navigator.geolocation.getCurrentPosition(async (position) => {
  //     // Try to query

  //     console.log(view.map.allLayers)
  //     const featureLayer = view.map.allLayers.find(
  //       (m) => m.type == 'feature' // no matches :(
  //     ) as FeatureLayer | null

  //     if (!featureLayer) {
  //       console.error('Could not find any FeatureLayer')
  //       return
  //     }
  //     view.whenLayerView(featureLayer).then(function (layerView) {
  //       layerView.watch('updating', function (updating) {
  //         if (!updating) {
  //           queryFeatureLayer(layerView, featureLayer, position)
  //         }
  //       })
  //     })
  //   })
  // })
})

onUnmounted(() => {
  if (watchPositionReference) {
    navigator.geolocation.clearWatch(watchPositionReference)
  }
})

// const queryFeatureLayer = (
//   layerView: FeatureLayerView,
//   featureLayer: FeatureLayer,
//   position: GeolocationPosition
// ) => {
//   const query = featureLayer.createQuery()
//   query.geometry = new Point({
//     latitude: position.coords.latitude,
//     longitude: position.coords.longitude,
//   })
//   query.distance = 100
//   query.units = 'miles'
//   query.spatialRelationship = 'intersects' // this is the default
//   query.returnGeometry = true
//   query.outFields = ['*']

//   layerView.queryFeatures(query).then((res: any) => {
//     console.log(res)
//   })
// }
</script>

<style>
#mapViewDiv {
  height: 100%;
  margin: 0;
}
</style>
@/stores/geoLocationStore @/stores/geolocationStore
