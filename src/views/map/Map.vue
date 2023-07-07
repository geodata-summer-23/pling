<template>
  <div id="mapViewDiv"></div>
  <div class="overlay col" style="gap: 1em; top: 5em; right: 1em">
    <div class="row" style="justify-content: end">
      <button
        class="btn btn-icon shadow"
        @click="
          () => {
            layersOpen = !layersOpen
            infoOpen = false
          }
        "
      >
        <fa-icon size="xl" icon="layer-group"></fa-icon>
      </button>
    </div>
    <div class="row" style="justify-content: end">
      <button
        class="btn btn-icon shadow"
        @click="
          () => {
            infoOpen = !infoOpen
            layersOpen = false
          }
        "
      >
        <fa-icon size="xl" icon="info"></fa-icon>
      </button>
    </div>
  </div>
  <SlideUpPane
    :open="layersOpen"
    hide-mode="hidden"
    @toggle="layersOpen = !layersOpen"
  >
    <div>
      <div id="layerListDiv"></div>
    </div>
  </SlideUpPane>
  <SlideUpPane
    :open="infoOpen"
    hide-mode="hidden"
    @toggle="infoOpen = !infoOpen"
  >
    <div>
      <div id="legendDiv"></div>
    </div>
  </SlideUpPane>
</template>

<script lang="ts" setup>
import WebMap from '@arcgis/core/WebMap'
import MapView from '@arcgis/core/views/MapView'
import Graphic from '@arcgis/core/Graphic'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import Point from '@arcgis/core/geometry/Point'
import Search from '@arcgis/core/widgets/Search'
import LayerList from '@arcgis/core/widgets/LayerList'
import SlideUpPane from '@/components/SlideUpPane.vue'
import Legend from '@arcgis/core/widgets/Legend'
import { onMounted, onUnmounted, ref } from 'vue'
import { AddressPoint } from '@/stores/placeStore'

const props = defineProps<{
  center: AddressPoint | null
}>()

const graphicsLayer = new GraphicsLayer()
const layersOpen = ref(false)
const infoOpen = ref(false)
const mapView = ref<MapView | null>(null)
let userLocationPoint: Graphic | null = null
let watchPositionReference: number | null = null

const createPointGraphic = (point: AddressPoint) => {
  const simpleMarkerSymbol = {
    type: 'simple-marker',
    color: [226, 119, 40], // Orange
    outline: {
      color: [255, 255, 255], // White
      width: 1,
    },
  }
  const pointGraphic = new Graphic({
    geometry: new Point(point),
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
    zoom: 16,
  })
  mapView.value = view

  const search = new Search({
    view: view,
    goToOverride: console.log,
  })
  view.ui.add(search, 'top-right')

  view.when(() => {
    new LayerList({
      view: view,
      container: 'layerListDiv',
    })

    new Legend({
      view: view,
      container: 'legendDiv',
      layerInfos: [
        {
          layer: view.map.layers.find((m) => m.title == 'Utsatte bygninger'),
        },
      ],
    })
  })

  view.when(() => {
    if (props.center) {
      view.goTo({
        center: new Point(props.center),
        zoom: 16,
      })
      const newPoint = createPointGraphic(props.center)
      graphicsLayer.add(newPoint)
      userLocationPoint = newPoint
    }
  })

  watchPositionReference = navigator.geolocation.watchPosition(
    async (position) => {
      view.when(() => {
        if (userLocationPoint) {
          userLocationPoint.geometry = new Point({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          console.log(
            `Moved to ${position.coords.latitude}, ${position.coords.longitude}`
          )
        } else {
          const newPoint = createPointGraphic(position.coords)
          graphicsLayer.add(newPoint)
          userLocationPoint = newPoint
        }
      })
    }
  )
})

onUnmounted(() => {
  if (watchPositionReference) {
    navigator.geolocation.clearWatch(watchPositionReference)
  }
})
</script>

<style>
#mapViewDiv {
  height: 100%;
  margin: 0;
}

.overlay {
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 100%;
}

.overlay > * {
  pointer-events: all;
}
</style>
