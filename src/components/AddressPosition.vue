<template>
  <div :style="{ 'font-size': fontSize }">
    <span v-if="address.street || address.city">
      {{ address.street ?? '' }}, {{ address.city }}
    </span>
    <span
      v-else-if="address?.position?.latitude && address?.position?.longitude"
    >
      {{ address.position.latitude.toFixed(2) }} °N
      {{ address.position.longitude.toFixed(2) }} °E
    </span>
    <span v-else-if="address.position?.x && address.position?.y">
      x: {{ address.position.x.toFixed(2) }} y:
      {{ address.position.y.toFixed(2) }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { Address } from '@/scripts/place'

defineProps<{
  address: Address
  fontSize: string
}>()
</script>
