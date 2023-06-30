<template>
  <div id="mapViewDiv"></div>
</template>

<script lang="ts" setup>
import WebMap from '@arcgis/core/WebMap'
import MapView from '@arcgis/core/views/MapView.js'
import { onMounted } from 'vue'

onMounted(() => {
  const map = new WebMap({
    // basemap: 'streets-vector',
    portalItem: {
      id: 'b139409c28884967a1a603695e0b478d', // https://arcg.is/1mTnbH
    },
  })

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
