<template>
  <div class="display-container col">
    <div class="view-container">
      <RouterView v-slot="{ Component }">
        <!-- <KeepAlive> -->
        <component :is="Component" :key="$route.fullPath"></component>
        <!-- </KeepAlive> -->
      </RouterView>
    </div>
    <nav class="nav-bottom">
      <RouterLink :to="{ name: 'places' }">
        <NavItem text="Places"><WarningIcon /></NavItem>
      </RouterLink>
      <RouterLink :to="{ name: 'map' }">
        <NavItem text="Map"><GlobeIcon /></NavItem>
      </RouterLink>
      <RouterLink :to="{ name: 'user' }">
        <NavItem text="User"><UserIcon /></NavItem>
      </RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import NavItem from '@/components/NavItem.vue'
import GlobeIcon from '@/components/icons/GlobeIcon.vue'
import UserIcon from '@/components/icons/UserIcon.vue'
import WarningIcon from '@/components/icons/WarningIcon.vue'
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { usePlaceStore } from '@/stores/placeStore'
import { useUserStore } from '@/stores/userStore'
import { useGeolocationStore } from './stores/geolocationStore'

onMounted(() => {
  usePlaceStore().loadFromLocalStorage()
  useUserStore().loadFromLocalStorage()
  useGeolocationStore().init()
})
</script>

<style scoped>
.display-container {
  position: relative;
  max-width: 500px;
  height: 100svh;
  margin: auto;
  overflow: hidden;
}

.view-container {
  position: relative;
  background-color: white;
  overflow: hidden;
  flex-grow: 1;
}

.nav-bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  bottom: 0;
  background-color: snow;
}
</style>
