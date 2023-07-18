<template>
  <div class="col">
    <HelpRequestBox
      v-for="helpRequest in helpRequestStore.requests"
      :help-request="helpRequest"
    />
  </div>
</template>

<script lang="ts" setup>
import HelpRequestBox from './HelpRequestBox.vue'
import { useHelpRequestStore } from '@/stores/helpRequestStore'
import { useGeolocationStore } from '@/stores/geolocationStore'
import { onMounted } from 'vue'

const helpRequestStore = useHelpRequestStore()

onMounted(() => {
  const position = useGeolocationStore().position
  if (position) {
    helpRequestStore.updateRequests(position)
  }
})
</script>
