<template>
  <div id="mapViewDiv"></div>
</template>

<script lang="ts" setup>
import WebMap from '@arcgis/core/WebMap'
import MapView from '@arcgis/core/views/MapView.js'
import Graphic from '@arcgis/core/Graphic'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import { onMounted } from 'vue'

const graphicsLayer = new GraphicsLayer()

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

  view.when(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      view.goTo({
        center: [position.coords.longitude, position.coords.latitude],
        zoom: 12,
      })
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
    })
  })
})
</script>

<style>
#mapViewDiv {
  height: 100%;
  margin: 0;
}
</style>
