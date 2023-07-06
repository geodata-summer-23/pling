<template>
  <div class="view col">
    <div class="row center" style="gap: 1em; justify-content: end">
      <span>{{ userStore.firstName }}</span>
      <fa-icon
        size="3x"
        icon="circle-user"
        class="clickable"
        style="color: var(--c-dark-gray)"
        @click="router.push({ name: 'user' })"
      />
    </div>
    <h2 style="margin-top: 0">My Places</h2>
    <div class="col" style="gap: 0.5em">
      <div
        v-for="place in placeStore.places"
        class="address-item shadow row spaced clickable"
        @click="clickPlace(place)"
      >
        <div class="col">
          <span style="font-weight: bold">{{ place.nickname }}</span>
          <span v-if="place.address.street || place.address.city">
            {{ place.address.street ?? '' }}, {{ place.address.city }}
          </span>
          <Coordinates v-else :place="place"></Coordinates>
        </div>
        <WeatherNowcast
          :lat="place.address.point?.latitude"
          :lon="place.address.point?.longitude"
        ></WeatherNowcast>
      </div>
    </div>
    <br />
    <div>
      {{ userStore.firstName ?? 'Hei' }}, du er i følgende faresoner:
      {{ dangers }}
    </div>
  </div>
  <div class="view-bottom col">
    <div
      class="row animated"
      :class="{ 'hidden-right': !actionsOpen }"
      style="justify-content: end"
    >
      <button class="btn btn-shadow" @click="router.push({ name: 'message' })">
        <fa-icon icon="triangle-exclamation" />
        <span style="margin: 0 0.5em">Request Help</span>
      </button>
    </div>
    <div
      class="row animated"
      :class="{ 'hidden-right': !actionsOpen }"
      style="justify-content: end"
    >
      <button
        class="btn btn-shadow"
        @click="router.push({ name: 'add-place' })"
      >
        <fa-icon icon="house" />
        <span style="margin: 0 0.5em">Add Place</span>
      </button>
    </div>
    <div class="row" style="justify-content: end">
      <button
        class="btn btn-icon btn-shadow"
        style="
          background-color: var(--c-light-blue);
          color: var(--c-medium-gray);
        "
        @click="actionsOpen = !actionsOpen"
      >
        <fa-icon
          size="lg"
          :icon="actionsOpen ? 'xmark' : 'ellipsis-vertical'"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import WeatherNowcast from './WeatherNowcast.vue'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import Point from '@arcgis/core/geometry/Point.js'
import Coordinates from '@/components/Coordinates.vue'
import { router } from '@/router'
import { usePlaceStore, Place } from '@/stores/placeStore'
import { useUserStore } from '@/stores/userStore'
import { onMounted, ref } from 'vue'
import { useGeolocationStore } from '@/stores/geolocationStore'

const userStore = useUserStore()
const placeStore = usePlaceStore()

const dangers = ref<string[]>([])
const actionsOpen = ref(false)

const clickPlace = (place: Place) => {
  if (place.address.point) {
    placeStore.currentPlace = place
  }
  router.push({ name: 'map' })
}

onMounted(() => {
  const metAlertsLayer = new FeatureLayer({
    url: 'https://utility.arcgis.com/usrsvcs/servers/f7978b8123424646bb5960e25d83c606/rest/services/MetAlerts/FeatureServer/0',
  })
  const position = useGeolocationStore().position
  if (!position) {
    console.error('invalid position')
    return
  }

  const alertQuery = {
    spatialRelationship: 'intersects', // Relationship operation to apply
    geometry: new Point(position),
    outFields: ['description'], // Attributes to return
    returnGeometry: false,
  }

  metAlertsLayer
    // @ts-ignore
    .queryFeatures(alertQuery)
    .then((results) => {
      dangers.value = results.features.map((f) => f.attributes.description)
    })
    .catch((error) => {
      console.error(error)
    })
})
</script>

<style>
.address-item {
  border: 1px solid var(--c-medium-gray);
  border-radius: 1em;
  padding: 1em;
  box-shadow: 0 0.4em 0.6em var(--c-medium-gray);
}

.hidden-right {
  transform: translateX(100%);
}
</style>
