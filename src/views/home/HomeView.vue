<template>
  <div class="view col">
    <div class="row spaced">
      <span>{{ userStore.name }}</span>
      <fa-icon
        size="3x"
        icon="circle-user"
        class="clickable"
        @click="router.push({ name: 'user' })"
      />
    </div>
    <h2>My Places</h2>
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
              place.address?.point?.latitude && place.address?.point?.longitude
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
    </div>
    <div class="view-bottom col">
      <button class="btn" @click="router.push({ name: 'add-place' })">
        Add Place
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import WeatherNowcast from './WeatherNowcast.vue'
import { router } from '@/router'
import { usePlaceStore, Place } from '@/stores/placeStore'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const placeStore = usePlaceStore()

const clickPlace = (place: Place) => {
  if (place.address.point) {
    placeStore.currentPlace = place
  }
  router.push({ name: 'map' })
}
</script>

<style>
.address-item {
  border: 1px solid var(--c-medium-gray);
  border-radius: 1em;
  padding: 1em;
  box-shadow: 0 0.4em 0.6em var(--c-medium-gray);
}
</style>
