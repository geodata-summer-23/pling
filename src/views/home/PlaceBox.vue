<template>
  <div
    class="address-item shadow row spaced clickable"
    @click="clickPlace(place)"
  >
    <div class="alert-icon-container">
      <img
        v-for="icon in alertIcons"
        :class="{ 'vertical-shake': !edit }"
        :src="icon"
        width="40"
      />
    </div>
    <div v-if="edit && !isMyLocation" class="edit-icon-container">
      <fa-icon icon="pencil" size="lg" class="vertical-shake"></fa-icon>
    </div>
    <div class="col">
      <span style="font-weight: bold">
        <fa-icon
          :icon="place.icon"
          style="padding-right: 0.3em; color: var(--c-dark-gray)"
        ></fa-icon>
        {{ maxChars(place.nickname, 20) }}</span
      >
      <span v-if="place.address.street || place.address.city">
        <span style="font-size: small">
          {{ place.address.street ?? '' }}, {{ place.address.city }}
        </span>
      </span>
      <Coordinates v-else :place="place"></Coordinates>
    </div>
    <WeatherNowcast
      :lat="place.address.point?.latitude"
      :lon="place.address.point?.longitude"
    ></WeatherNowcast>
  </div>
</template>

<script lang="ts" setup>
import WeatherNowcast from './WeatherNowcast.vue'
import Coordinates from '@/components/Coordinates.vue'
import { usePlaceStore, Place } from '@/stores/placeStore'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import Point from '@arcgis/core/geometry/Point.js'
import { onMounted, ref } from 'vue'
import { router } from '@/router'
import { maxChars } from '@/utils'
import { useLoadingStore } from '@/stores/loadingStore'

const placeStore = usePlaceStore()
const props = defineProps<{
  place: Place
  edit: boolean
  isMyLocation: boolean
}>()

const alertIcons = ref<string[]>([])
const alertMessages = ref<string[]>([])

const clickPlace = (place: Place) => {
  if (place.address.point && placeStore.currentPlace != place) {
    useLoadingStore().mapIsLoading = true
    placeStore.currentPlace = place
  }
  if (props.edit) {
    if (!props.isMyLocation) {
      router.push({ name: 'edit-place' })
    }
  } else {
    router.push({ name: 'map' })
  }
}
const getDangers = (place: Place) => {
  const metAlertsLayer = new FeatureLayer({
    url: 'https://utility.arcgis.com/usrsvcs/servers/f7978b8123424646bb5960e25d83c606/rest/services/MetAlerts/FeatureServer/0',
  })
  const latitude = place.address.point?.latitude
  const longitude = place.address.point?.longitude
  if (!latitude || !longitude) {
    console.error('invalid point for place' + place.nickname)
    return
  }

  const query = {
    spatialRelationship: 'intersects', // Relationship operation to apply
    geometry: new Point({ latitude, longitude }),
    outFields: ['*'], // Attributes to return
    returnGeometry: false,
  }

  metAlertsLayer
    // @ts-ignore
    .queryFeatures(query)
    .then((results) => {
      alertMessages.value = results.features.map(
        (f) => f.attributes.eventAwarenessName
      )
      alertIcons.value = results.features.map((f) => {
        const color = f.attributes.awarenessLevel.split(';')[1].trim()
        return `./warningIcons/icon-warning-${f.attributes.event.toLowerCase()}-${color}.svg`
      })
    })
    .catch((error) => {
      console.error(error)
    })
}
onMounted(() => {
  getDangers(props.place)
})
</script>

<style scoped>
.alert-icon-container {
  position: absolute;
  width: 90%;
  top: -0.7em;
  display: flex;
  flex-direction: row;
  justify-content: end;
}

.edit-icon-container {
  position: absolute;
  width: 90%;
  top: -0.2em;
  left: -0.2em;
  display: flex;
  flex-direction: row;
  justify-content: start;
}

.address-item {
  position: relative;
  border: 1px solid var(--c-medium-gray);
  border-radius: 1em;
  padding: 1em;
  box-shadow: 0 0.4em 0.6em var(--c-medium-gray);
}
</style>
