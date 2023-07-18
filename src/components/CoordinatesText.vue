<template>
  <div>
    <span
      v-if="
        place.address?.position?.latitude && place.address?.position?.longitude
      "
    >
      {{ place.address.position.latitude.toFixed(2) }} °N
      {{ place.address.position.longitude.toFixed(2) }} °E
    </span>
    <span v-else-if="place.address.position?.x && place.address.position?.y">
      x: {{ place.address.position.x.toFixed(2) }} y:
      {{ place.address.position.y.toFixed(2) }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { Place } from '@/scripts/place'

defineProps<{
  place: Place
}>()
</script>
