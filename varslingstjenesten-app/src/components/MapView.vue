<template>
  <div id="mapViewDiv"></div>
</template>

<script lang="ts" setup>
import ArcgisMap from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView.js';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import arcgisConfig from '@arcgis/core/config';
import { onMounted } from 'vue';

onMounted(() => {
  arcgisConfig.apiKey = import.meta.env.VUE_APP_ARCGIS_API_KEY as string;

  const map = new ArcgisMap({
    basemap: 'streets-vector',
  });

  const view = new MapView({
    map: map,
    container: 'mapViewDiv',
    center: [11, 60],
    zoom: 12,
  });

  const featureLayer = new FeatureLayer({
    url: 'https://services.geodataonline.no/arcgis/rest/services/Geomap_UTM33_EUREF89/GeomapFlom/FeatureServer/0',
  });

  map.add(featureLayer);

  view.when(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      view.goTo({
        center: [position.coords.longitude, position.coords.latitude],
        zoom: 12,
      });
      console.log(position);
    });
  });
});
</script>

<style>
#mapViewDiv {
  width: 600px;
  height: 850px;
  margin: 0;
}
</style>
