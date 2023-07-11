<template>
  <div class="display-container col">
    <div class="view-container">
      <RouterView v-slot="{ Component }">
        <KeepAlive :include="['MapView', 'HomeView']">
          <component :is="Component" :key="$route.fullPath"></component>
        </KeepAlive>
      </RouterView>
    </div>
    <nav
      v-if="['home', 'map', 'message'].includes(router.currentRoute.value.name as string)"
      class="nav-bottom"
    >
      <RouterLink :to="{ name: 'home' }">
        <NavItem route="home"><fa-icon size="xl" icon="house" /></NavItem>
      </RouterLink>
      <RouterLink :to="{ name: 'map' }">
        <NavItem route="map"
          ><fa-icon size="xl" icon="earth-americas"
        /></NavItem>
      </RouterLink>
      <RouterLink :to="{ name: 'message' }">
        <NavItem route="message"><fa-icon size="xl" icon="bell" /></NavItem>
      </RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import NavItem from '@/components/NavItem.vue'
import { onBeforeMount } from 'vue'
import { RouterView } from 'vue-router'
import { usePlaceStore } from '@/stores/placeStore'
import { useUserStore } from '@/stores/userStore'
import { useGeolocationStore } from '@/stores/geolocationStore'
import { router } from './router'

const userStore = useUserStore()

onBeforeMount(() => {
  userStore.loadFromLocalStorage()
  usePlaceStore().loadFromLocalStorage()
  useGeolocationStore().init()

  if (!userStore.guid && router.currentRoute.value.name != 'onboarding') {
    router.push({ name: 'onboarding' })
  }
})
</script>

<style scoped></style>
