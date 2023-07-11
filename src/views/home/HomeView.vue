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
    <h2 style="margin-top: 0">{{ $t().myPlaces }}</h2>
    <div class="col" style="gap: 0.5em">
      <PlaceBox
        v-for="(place, i) in placeStore.places"
        :place="place"
        :edit="edit"
        :isMyLocation="i == 0"
      />
    </div>
    <br />
    <!-- <div>
      {{ userStore.firstName ?? 'Hei' }}, du er i følgende faresoner:
      {{ dangers }}
    </div> -->
  </div>
  <div class="view-bottom col">
    <div
      class="row animated"
      :class="{ 'hidden-right': !actionsOpen }"
      style="justify-content: end"
    >
      <button class="btn btn-shadow" @click="router.push({ name: 'message' })">
        <fa-icon icon="triangle-exclamation" />
        <span style="margin: 0 0.5em">{{ $t().reportAnEvent }}</span>
      </button>
    </div>
    <div
      class="row animated"
      :class="{ 'hidden-right': !actionsOpen }"
      style="justify-content: end"
    >
      <button
        class="btn btn-shadow"
        @click="
          () => {
            edit = true
            actionsOpen = false
          }
        "
      >
        <fa-icon icon="pencil" />
        <span style="margin: 0 0.5em">{{ $t().editPlace }}</span>
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
        <span style="margin: 0 0.5em">{{ $t().addPlace }}</span>
      </button>
    </div>
    <div class="row" style="justify-content: end">
      <button
        class="btn btn-icon btn-shadow"
        style="
          background-color: var(--c-light-blue);
          color: var(--c-medium-gray);
        "
        @click="
          () => {
            if (edit) {
              edit = false
            } else {
              actionsOpen = !actionsOpen
            }
          }
        "
      >
        <span v-if="edit">
          <fa-icon size="lg" icon="xmark" />
          {{ $t().cancelEdit }}</span
        >
        <fa-icon
          v-else
          size="lg"
          :icon="actionsOpen ? 'xmark' : 'ellipsis-vertical'"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import Point from '@arcgis/core/geometry/Point.js'
import { router } from '@/router'
import { usePlaceStore } from '@/stores/placeStore'
import { useUserStore } from '@/stores/userStore'
import { onMounted, ref } from 'vue'
import { useGeolocationStore } from '@/stores/geolocationStore'
import { $t } from '@/translation'
import PlaceBox from './PlaceBox.vue'

const userStore = useUserStore()
const placeStore = usePlaceStore()

const edit = ref(false)
const dangers = ref<string[]>([])
const actionsOpen = ref(false)

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
    geometry: new Point({
      latitude: position.latitude,
      longitude: position.longitude,
    }),
    outFields: ['description', 'eventAwarenessName'], // Attributes to return
    returnGeometry: false,
  }

  metAlertsLayer
    // @ts-ignore
    .queryFeatures(alertQuery)
    .then((results) => {
      dangers.value = results.features.map(
        (f) => f.attributes.eventAwarenessName
      )
    })
    .catch((error) => {
      console.error(error)
    })
})
</script>

<style scoped>
.hidden-right {
  transform: translateX(100%);
}
</style>
