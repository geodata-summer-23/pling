<template>
  <Map v-if="userStore.signedIn" :center="geoLocationStore.getMapCenter"></Map>
  <div v-else class="message-container">
    <br />
    <p>You are not signed in.</p>
    <br />
    <button @click="signIn">Sign In</button>
  </div>
</template>

<script lang="ts" setup>
import Map from './Map.vue'
import { signIn, useUserStore } from '@/stores/userStore'
import { useGeolocationStore } from '@/stores/geolocationStore'

const userStore = useUserStore()
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
