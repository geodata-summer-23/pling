<template>
  <Map v-if="userStore.signedIn"></Map>
  <p v-if="!userStore.signedIn">You are not signed in. Go to settings.</p>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import Map from './Map.vue'
import { onMounted } from 'vue'

const userStore = useUserStore()

onMounted(() => {})
</script>
