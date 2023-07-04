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
import { LocationQueryValue } from 'vue-router'

const userStore = useUserStore()

const toFloatOrUndefined = (x: LocationQueryValue | LocationQueryValue[]) => {
  if (!x) return undefined
  if (Array.isArray(x)) return undefined
  return parseFloat(x)
}

const latitude = computed(() =>
  toFloatOrUndefined(router.currentRoute.value.query.latitude)
)
const longitude = computed(() =>
  toFloatOrUndefined(router.currentRoute.value.query.longitude)
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
