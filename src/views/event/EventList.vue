<template>
  <div class="col" style="gap: 0.5em">
    <EventBox v-for="a in useEventStore().events" :event="a" />
  </div>
</template>

<script lang="ts" setup>
import EventBox from './EventBox.vue'
import { usePlaceStore } from '@/stores/placeStore'
import { useEventStore } from '@/stores/eventStore'
import { watch } from 'vue'

watch(
  () => usePlaceStore().currentPlace,
  () => {
    useEventStore().updateEvents(
      usePlaceStore().currentPlace?.address.point?.latitude,
      usePlaceStore().currentPlace?.address.point?.longitude
    )
  },
  { immediate: true }
)
</script>
