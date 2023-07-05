<template>
  <Map v-if="userStore.signedIn" :center="geoLocationStore.getMapCenter"></Map>
  <div v-else class="message-container">
    <br />
    <p>You are not signed in.</p>
    <br />
    <button @click="signIn">Sign In</button>
  </div>
  <SlideUpPane
    v-if="placeStore.currentPlace"
    :open="paneOpen"
    hide-mode="show-top"
    @toggle="paneOpen = !paneOpen"
  >
    <div>
      <h3>{{ placeStore.currentPlace.nickname }}</h3>
      {{ placeStore.currentPlace }}
    </div>
  </SlideUpPane>
</template>

<script lang="ts" setup>
import Map from './Map.vue'
import { signIn, useUserStore } from '@/stores/userStore'
import { useGeolocationStore } from '@/stores/geolocationStore'
import { usePlaceStore } from '@/stores/placeStore'
import { ref } from 'vue'
import SlideUpPane from '@/components/SlideUpPane.vue'

const paneOpen = ref(true)
const userStore = useUserStore()
const placeStore = usePlaceStore()
const geoLocationStore = useGeolocationStore()
</script>

<style scoped>
.message-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
