<template>
  <div id="mapViewDiv"></div>
</template>

<script lang="ts" setup>
import ArcgisMap from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView.js'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import arcgisConfig from '@arcgis/core/config'
import { onMounted } from 'vue'

const props = defineProps<{ apiKey: string }>()

onMounted(() => {
  arcgisConfig.apiKey = props.apiKey

  const map = new ArcgisMap({
    basemap: 'streets-vector',
  })

  const view = new MapView({
    map: map,
    container: 'mapViewDiv',
    center: [11, 60],
    zoom: 12,
  })

  const featureLayer = new FeatureLayer({
    url: 'https://services.geodataonline.no/arcgis/rest/services/Geomap_UTM33_EUREF89/GeomapFlom/FeatureServer/0',
  })

  map.add(featureLayer)

  view.when(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      view.goTo({
        center: [position.coords.longitude, position.coords.latitude],
        zoom: 12,
      })
      console.log(position)

      // TODO: weather
      // weather.value = await
      // (
      //   await fetch(
      //     `https://api.met.no/weatherapi/locationforecast/2.0/compact?altitude=${position.coords.altitude}&lat=${position.coords.latitude}&lon=${position.coords.longitude}`,
      //     { mode: 'no-cors' }
      //   )
      // ).json()
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
