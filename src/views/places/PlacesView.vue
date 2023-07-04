<template>
  <div class="view">
    <div class="col">
      <label style="font-weight: bold">My Places</label>
      <div class="col" style="gap: 0.5em">
        <div
          v-for="(place, i) in placeStore.places"
          class="address-item row spaced clickable"
          @click.prevent="clickPlace(place)"
        >
          <div class="col">
            <span style="font-weight: bold">{{ place.name }}</span>
            <span>
              {{ place.address.latitude?.toFixed(2) ?? 'unknown' }} °N
              {{ place.address.longitude?.toFixed(2) ?? 'unknown' }} °E
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
import { usePlaceStore, Place } from '@/stores/placeStore'

const placeStore = usePlaceStore()

const clickPlace = (place: Place) => {
  if (place.address.latitude && place.address.longitude) {
    router.push({
      name: 'map',
      query: {
        latitude: place.address.latitude,
        longitude: place.address.longitude,
      },
    })
  }
}
</script>

<style>
.address-item {
  border: 2px solid lightgray;
  border-radius: 1em;
  padding: 1em;
}
</style>
