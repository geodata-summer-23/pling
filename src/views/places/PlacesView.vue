<template>
  <div class="view">
    <div class="col">
      <label style="font-weight: bold">My Places</label>
      <div class="col" style="gap: 0.5em">
        <div
          v-for="(place, i) in placeStore.places"
          class="address-item row spaced clickable"
          @click.stop="clickPlace(place)"
        >
          <div class="col">
            <span style="font-weight: bold">{{ place.name }}</span>
            <span
              v-if="
                place.address?.point?.latitude &&
                place.address?.point?.longitude
              "
            >
              {{ place.address.point.latitude.toFixed(2) ?? 'unknown' }} °N
              {{ place.address.point.longitude.toFixed(2) ?? 'unknown' }} °E
            </span>
            <span v-if="place.address.point?.x && place.address.point?.y">
              x: {{ place.address.point?.x?.toFixed(2) ?? 'unknown' }} y:
              {{ place.address.point?.y?.toFixed(2) ?? 'unknown' }}
            </span>
            {{ place.address.street ?? place.address.city }}
          </div>
          <button v-if="i > 0" @click="placeStore.removePlace(place)">X</button>
        </div>
        <button @click="router.push({ name: 'add-place' })">+ Add</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { router } from '@/router'
import { useGeolocationStore } from '@/stores/geolocationStore'
import { usePlaceStore, Place } from '@/stores/placeStore'

const placeStore = usePlaceStore()
const geolocationStore = useGeolocationStore()

const clickPlace = (place: Place) => {
  if (place.address.point) {
    geolocationStore.mapCenter = place.address.point
  }
  router.push({ name: 'map' })
}
</script>

<style>
.address-item {
  border: 2px solid lightgray;
  border-radius: 1em;
  padding: 1em;
}
</style>
