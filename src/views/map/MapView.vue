<template>
  <Map v-if="userStore.apiKey.length > 0" :api-key="userStore.apiKey"></Map>
  <p v-else>API key is not defined! Go to settings to add an API key</p>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import Map from './Map.vue'

const userStore = useUserStore()
</script>
