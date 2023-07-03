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
import MapView from '@arcgis/core/views/MapView.js'
import Graphic from '@arcgis/core/Graphic'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import Search from '@arcgis/core/widgets/Search'
import LayerList from '@arcgis/core/widgets/LayerList'
import SlideUpPane from '@/components/SlideUpPane.vue'
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  latitude?: number | string
  longitude?: number | string
}>()

const graphicsLayer = new GraphicsLayer()
const paneOpen = ref(false)
const mapView = ref<MapView | null>(null)

watch(
  () => [props.latitude, props.longitude],
  () => {
    if (!props.longitude || !props.latitude) return
    mapView.value?.when(() => {
      mapView.value?.goTo({
        center: [props.longitude, props.latitude],
        zoom: 12,
      })
    })
  },
  { immediate: true }
)

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

const initPoint = (position: GeolocationPosition) => {
  const point = {
    type: 'point',
    longitude: position.coords.longitude,
    latitude: position.coords.latitude,
  }
  const simpleMarkerSymbol = {
    type: 'simple-marker',
    color: [226, 119, 40], // Orange
    outline: {
      color: [255, 255, 255], // White
      width: 1,
    },
  }
  const pointGraphic = new Graphic({
    // @ts-ignore
    geometry: point,
    symbol: simpleMarkerSymbol,
  })
  graphicsLayer.add(pointGraphic)
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

  const search = new Search({
    view: view,
    goToOverride: console.log,
  })
  view.ui.add(search, 'top-right')

  initLayerList(view)

  view.when(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      view?.goTo({
        center: [position.coords.longitude, position.coords.latitude],
        zoom: 12,
      })
      initPoint(position)
    })
  })

  mapView.value = view
})
</script>

<style>
#mapViewDiv {
  height: 100%;
  margin: 0;
}
</style>
