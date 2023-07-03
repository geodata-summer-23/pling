<template>
  <Map
    v-if="userStore.signedIn"
    :latitude="latitude"
    :longitude="longitude"
  ></Map>
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
import { router } from '@/router'
import { computed } from 'vue'

const userStore = useUserStore()

const latitude = computed(
  () => router.currentRoute.value.query.latitude as string | undefined
)
const longitude = computed(
  () => router.currentRoute.value.query.longitude as string | undefined
)
</script>

<style scoped>
.message-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
