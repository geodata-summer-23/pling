<template>
  <div>
    <span
      v-if="place.address?.point?.latitude && place.address?.point?.longitude"
    >
      {{ place.address.point.latitude.toFixed(2) }} °N
      {{ place.address.point.longitude.toFixed(2) }} °E
    </span>
    <span v-else-if="place.address.point?.x && place.address.point?.y">
      x: {{ place.address.point.x.toFixed(2) }} y:
      {{ place.address.point.y.toFixed(2) }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { Place } from '@/stores/placeStore'

defineProps<{
  place: Place
}>()
</script>
