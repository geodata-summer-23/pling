<template>
  <div class="map-container">
    <MapView></MapView>
  </div>
</template>

<script setup lang="ts">
import MapView from './components/MapView.vue';
</script>

<style scoped>
.map-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
