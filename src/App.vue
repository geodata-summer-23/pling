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
    <div
      class="overlay clickthrough"
      :class="{ 'modal-wrapper-background': modalStore.components.length > 0 }"
      style="transition: all 200ms; height: 100%"
    ></div>
    <div
      v-for="component in modalStore.components"
      class="overlay modal-wrapper col center"
      style="height: 100%"
    >
      <Modal :component="component"></Modal>
    </div>
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
import { useModalStore } from './stores/modalStore'
import Modal from './components/Modal.vue'

const userStore = useUserStore()
const modalStore = useModalStore()

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
