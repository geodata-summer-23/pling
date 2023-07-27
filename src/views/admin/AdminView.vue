<template>
  <div class="view col">
    <IconButton @click="back"></IconButton>
    <h2>admin</h2>
  </div>
  <div class="view-bottom col">
    <button class="btn" @click="resetAlerts">Reset all alerts</button>
  </div>
</template>

<script lang="ts" setup>
import IconButton from '@/components/IconButton.vue'
import { router } from '@/router'
import { updatePlace, usePlaceStore } from '@/stores/placeStore'

const back = () => {
  router.back()
}

const resetAlerts = () => {
  usePlaceStore().places.forEach((place) => {
    updatePlace(place, { force: true })
  })
}
</script>
