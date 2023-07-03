<template>
  <div class="display-container">
    <div class="view-container">
      <RouterView v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component" :key="$route.fullPath"></component>
        </KeepAlive>
      </RouterView>
    </div>
    <nav class="nav-bottom">
      <RouterLink :to="{ name: 'places' }">Places</RouterLink>
      <RouterLink :to="{ name: 'map' }">Map</RouterLink>
      <RouterLink :to="{ name: 'user' }">User</RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { usePlaceStore } from './stores/placeStore'
import { useUserStore } from './stores/userStore'

onMounted(() => {
  usePlaceStore().loadFromLocalStorage()
  useUserStore().loadFromLocalStorage()
})
</script>

<style scoped>
.display-container {
  max-width: 450px;
  height: 90vh;
  margin: auto;
}

.view-container {
  position: relative;
  height: calc(100% - 4em);
  background-color: white;
  overflow: hidden;
}

.nav-bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  bottom: 0;
  height: 4em;
  background-color: snow;
}
</style>
