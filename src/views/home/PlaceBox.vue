<template>
  <div
    class="address-item shadow row spaced clickable"
    @click="clickPlace(place)"
  >
    <div class="alert-icon-container">
      <img
        v-for="icon in alertIcons"
        class="alert-icon"
        :src="icon"
        width="40"
      />
    </div>
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
</template>

<script lang="ts" setup>
import WeatherNowcast from './WeatherNowcast.vue'
import Coordinates from '@/components/Coordinates.vue'
import { usePlaceStore, Place } from '@/stores/placeStore'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import Point from '@arcgis/core/geometry/Point.js'
import { onMounted, ref } from 'vue'
import { router } from '@/router'

const placeStore = usePlaceStore()
const props = defineProps<{ place: Place }>()

const alertIcons = ref<string[]>([])
const alertMessages = ref<string[]>([])

const clickPlace = (place: Place) => {
  if (place.address.point) {
    placeStore.currentPlace = place
  }
  router.push({ name: 'map' })
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
        console.log(color)
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

.address-item {
  position: relative;
  border: 1px solid var(--c-medium-gray);
  border-radius: 1em;
  padding: 1em;
  box-shadow: 0 0.4em 0.6em var(--c-medium-gray);
}
</style>
