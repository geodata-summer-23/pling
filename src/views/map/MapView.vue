<template>
  <Map v-if="userStore.signedIn"></Map>
  <div v-if="!userStore.signedIn" class="message-container">
    <p>You are not signed in.</p>
    <RouterLink to="/settings">Go to settings.</RouterLink>
  </div>
</template>

<script lang="ts" setup>
import Map from './Map.vue'
import { useUserStore } from '@/stores/userStore'
import { RouterLink } from 'vue-router'

const userStore = useUserStore()
</script>

<style scoped>
.message-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
