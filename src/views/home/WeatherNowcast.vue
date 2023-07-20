<template>
  <div v-if="!nowcastData">
    <p>{{ $t().serverError }}</p>
  </div>
  <!-- <div v-if="!nowcastData">
    <LoadingSpinner :scale="0.5"></LoadingSpinner>
  </div> -->
  <div v-if="nowcastData" class="row center" style="width: 6em; gap: 0.5em">
    <span>{{ nowcastData.airTemperature }}°</span>
    <img
      v-if="nowcastData.symbol"
      :src="`./weatherIcons/${nowcastData.symbol}.svg`"
    />
    <!-- <span>{{ units ? units.air_temperature : '' }}</span> -->
  </div>
</template>

<script lang="ts" setup>
// import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { $t } from '@/translation'
import { NowcastData } from '@/scripts/alert'

defineProps<{ nowcastData?: NowcastData }>()
</script>

<style scoped>
img {
  max-width: 4em;
}
</style>
