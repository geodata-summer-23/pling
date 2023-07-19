<template>
  <div class="display-container col">
    <div class="view-container">
      <RouterView v-slot="{ Component }">
        <KeepAlive :include="['MapView', 'HomeView']">
          <component :is="Component" :key="$route.fullPath"></component>
        </KeepAlive>
      </RouterView>
    </div>
    <BottomNavBar></BottomNavBar>
    <ModalView></ModalView>
    <NotificationView></NotificationView>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { RouterView } from 'vue-router'
import { usePlaceStore } from '@/stores/placeStore'
import { useUserStore } from '@/stores/userStore'
import { useGeolocationStore } from '@/stores/geolocationStore'
import { router } from '@/router'
import { useNotificationStore } from './stores/notificationStore'
import BottomNavBar from './components/BottomNavBar.vue'
import ModalView from './components/ModalView.vue'
import NotificationView from './components/NotificationView.vue'

const userStore = useUserStore()

onBeforeMount(() => {
  userStore.loadFromLocalStorage()
  usePlaceStore().loadFromLocalStorage()
  useGeolocationStore().init()
  useNotificationStore().init()

  if (!userStore.guid && router.currentRoute.value.name != 'onboarding') {
    router.push({ name: 'onboarding' })
  }
})
</script>
