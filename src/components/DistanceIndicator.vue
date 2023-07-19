<template>
  <div class="row location-box">
    <fa-icon icon="location-dot"></fa-icon>
    <span v-if="distance <= 100000"> {{ distance }}m unna </span>
    <span v-if="distance > 1000">>1000m unna</span>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  distance: number
}>()
</script>

<style>
.location-box {
  background: #f6f6f6;
  border-radius: 5px;
  align-items: center;
  gap: 1em;
  width: min-content;
  white-space: nowrap;
  padding: 0.5em 1em;
  flex-shrink: 0;
  font-size: x-small;
}
</style>
