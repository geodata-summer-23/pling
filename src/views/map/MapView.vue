<template>
  <Map
    v-if="userStore.apiKey.length > 0 && userStore.signedIn"
    :api-key="userStore.apiKey"
  ></Map>
  <p v-else>API key is not defined! Go to settings to add an API key</p>
  <div></div>
  <p v-if="!userStore.signedIn">You are not signed in. Go to settings.</p>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import Map from './Map.vue'
import { onMounted } from 'vue'

const userStore = useUserStore()

onMounted(() => {})
</script>
