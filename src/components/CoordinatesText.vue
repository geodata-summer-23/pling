<template>
  <div>
    <span
      v-if="
        place.address?.coordinates?.latitude &&
        place.address?.coordinates?.longitude
      "
    >
      {{ place.address.coordinates.latitude.toFixed(2) }} °N
      {{ place.address.coordinates.longitude.toFixed(2) }} °E
    </span>
    <span
      v-else-if="place.address.coordinates?.x && place.address.coordinates?.y"
    >
      x: {{ place.address.coordinates.x.toFixed(2) }} y:
      {{ place.address.coordinates.y.toFixed(2) }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { Place } from '@/stores/place'

defineProps<{
  place: Place
}>()
</script>
