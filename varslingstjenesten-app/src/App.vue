<template>
  <div class="display-container">
    <div class="view-container">
      <RouterView></RouterView>
    </div>
    <nav class="nav-bottom">
      <RouterLink :to="{ name: 'map' }">Map</RouterLink>
      <RouterLink :to="{ name: 'settings' }">Settings</RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style scoped>
.display-container {
  max-width: 450px;
  height: 90vh;
  margin: auto;
}

.view-container {
  height: calc(100% - 3em);
  background-color: white;
}

.nav-bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  bottom: 0;
  height: 3em;
  background-color: white;
}
</style>
