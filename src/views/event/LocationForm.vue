<template>
  <h3>{{ $t().whereEvent }}</h3>
  <div class="col select">
    <select
      class="location-select"
      name="LocationSelect"
      id="locationSelect"
      :value="locationOption"
      @change="locationOption = ($event.target as HTMLSelectElement).value"
    >
      <option value="myLocation">{{ $t().myLocation }}</option>
      <option value="locationInMap">{{ $t().selectInMap }}</option>
    </select>
  </div>

  <p v-if="locationOption == 'locationInMap'">{{ $t().notImplemented }}</p>
</template>

<script lang="ts" setup>
import { useGeolocationStore } from '@/stores/geolocationStore'
import { Position } from '@/scripts/place'
import { $t } from '@/translation'
import { onUnmounted, ref } from 'vue'

const locationOption = ref('myLocation')

const emit = defineEmits<{
  (e: 'location', lac: Position): void
}>()

onUnmounted(() => {
  emit('location', {
    latitude: useGeolocationStore().position?.latitude,
    longitude: useGeolocationStore().position?.longitude,
  })
})
</script>

<style>
.location-select {
  padding: 1em;
  appearance: initial;
  flex-shrink: 0;
}
</style>
