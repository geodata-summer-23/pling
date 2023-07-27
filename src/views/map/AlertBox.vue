<template>
  <div style="margin: 0 2em">
    <div class="col">
      <span v-if="alert.observationCount" style="margin: 0"
        >Dette varselet er basert på {{ alert.observationCount }}
        {{ alert.observationCount > 1 ? 'observasjoner' : 'observasjon' }} fra
        personer i nærheten.</span
      >
      <p style="margin: 0">{{ alert.message }}</p>
      <h4 style="margin-bottom: 0">{{ $t().advices }}</h4>
      <ul style="margin-top: 0">
        <li v-for="advice in alert.advices">{{ advice }}</li>
      </ul>
    </div>
  </div>
  <div v-if="alert.images.length > 0" style="margin-bottom: 2em">
    <h4 style="margin-inline: 2em">Observasjoner</h4>
    <div class="row" style="width: 100%; overflow: auto">
      <img
        v-for="image in alert.images"
        :src="image"
        alt=""
        style="height: auto"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Alert } from '@/scripts/alert'
import { $t } from '@/translation'

defineProps<{ alert: Alert }>()
</script>

<style scoped>
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
