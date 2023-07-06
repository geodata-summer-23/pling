<template>
  <Map
    v-if="userStore.signedInToArcGis"
    :center="geoLocationStore.getMapCenter"
  ></Map>
  <div v-else class="message-container">
    <br />
    <p>You are not signed in.</p>
    <br />
    <button @click="signIn">Sign In</button>
  </div>
  <SlideUpPane
    v-if="placeStore.currentPlace"
    :open="paneOpen"
    :title="placeStore.currentPlace.nickname"
    hide-mode="show-top"
    @toggle="paneOpen = !paneOpen"
  >
    <div>
      {{ placeStore.currentPlace.address.street }}
      <Coordinates :place="placeStore.currentPlace"></Coordinates>
      <button
        v-if="placeStore.currentPlace != placeStore.places[0]"
        @click="deleteCurrentPlace"
      >
        Delete
      </button>
    </div>
  </SlideUpPane>
</template>

<script lang="ts" setup>
import Map from './Map.vue'
import SlideUpPane from '@/components/SlideUpPane.vue'
import { signIn, useUserStore } from '@/stores/userStore'
import { useGeolocationStore } from '@/stores/geolocationStore'
import { usePlaceStore } from '@/stores/placeStore'
import { ref } from 'vue'
import { router } from '@/router'
import Coordinates from '@/components/Coordinates.vue'

const paneOpen = ref(true)
const userStore = useUserStore()
const placeStore = usePlaceStore()
const geoLocationStore = useGeolocationStore()

const deleteCurrentPlace = () => {
  if (!placeStore.currentPlace) return
  placeStore.removePlace(placeStore.currentPlace)
  router.push({ name: 'places' })
}
</script>

<style scoped>
.message-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
