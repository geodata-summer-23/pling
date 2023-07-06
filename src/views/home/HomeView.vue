<template>
  <div class="view">
    <div class="col">
      <div class="row spaced">
        <span>{{ userStore.name }}</span>
        <fa-icon
          size="3x"
          icon="circle-user"
          class="clickable"
          @click="router.push({ name: 'user' })"
        />
      </div>
      <label style="font-weight: bold">My Places</label>
      <div class="col" style="gap: 0.5em">
        <div
          v-for="place in placeStore.places"
          class="address-item row spaced clickable"
          @click="clickPlace(place)"
        >
          <div class="col">
            <span style="font-weight: bold">{{ place.nickname }}</span>
            <span v-if="place.address.street || place.address.city">
              {{ place.address.street ?? '' }}, {{ place.address.city }}
            </span>
            <span
              v-else-if="
                place.address?.point?.latitude &&
                place.address?.point?.longitude
              "
            >
              {{ place.address.point.latitude.toFixed(2) ?? 'unknown' }} °N
              {{ place.address.point.longitude.toFixed(2) ?? 'unknown' }} °E
            </span>
            <span v-else-if="place.address.point?.x && place.address.point?.y">
              x: {{ place.address.point?.x?.toFixed(2) ?? 'unknown' }} y:
              {{ place.address.point?.y?.toFixed(2) ?? 'unknown' }}
            </span>
          </div>
          <WeatherNowcast
            :lat="place.address.point?.latitude"
            :lon="place.address.point?.longitude"
          ></WeatherNowcast>
        </div>
        <button @click="router.push({ name: 'add-place' })">+ Add</button>
      </div>
    </div>
    <div>
      {{ userStore.name }}, du er i følgende faresoner: (sjekk konsoll)
    </div>
  </div>
</template>

<script lang="ts" setup>
import WeatherNowcast from './WeatherNowcast.vue'
import { router } from '@/router'
import { usePlaceStore, Place } from '@/stores/placeStore'
import { useUserStore } from '@/stores/userStore'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import Point from "@arcgis/core/geometry/Point.js";

const userStore = useUserStore()
const placeStore = usePlaceStore()

const clickPlace = (place: Place) => {
  if (place.address.point) {
    placeStore.currentPlace = place
  }
  router.push({ name: 'map' })
}

// Reference query layer
const metAlertsLayer = new FeatureLayer({
  url: "https://utility.arcgis.com/usrsvcs/servers/f7978b8123424646bb5960e25d83c606/rest/services/MetAlerts/FeatureServer/0",
});

// Point to query
const point = new Point({
  latitude: placeStore.places[0].address.point.latitude.toFixed(3),
  longitude: placeStore.places[0].address.point.longitude.toFixed(3),
});

// Description of the alert
const description = ""

function queryFeaturelayer(geometry) {

  const alertQuery = {
  spatialRelationship: "intersects", // Relationship operation to apply
  geometry: point,
  outFields: ["description"], // Attributes to return
  returnGeometry: false
  };

  metAlertsLayer.queryFeatures(alertQuery)
  .then((results) => {

    console.log("Feature count: " + results.features.length)
    console.log(results.features[0].attributes.description)

  }).catch((error) => {
    console.log(error);
  });
}
queryFeaturelayer();
</script>

<style>
.address-item {
  border: 2px solid lightgray;
  border-radius: 1em;
  padding: 1em;
}
</style>
