<template>
  <div class="overlay clickthrough col" style="height: 100%">
    <transition-group name="list" tag="div">
      <NotificationBox
        v-for="notification in notificationStore.notifications"
        :notification="notification"
        :key="notification.timestamp"
        @click="
          () => {
            notification.click()
            notificationStore.delete(notification)
          }
        "
        @delete="() => notificationStore.delete(notification)"
      ></NotificationBox>
    </transition-group>
  </div>
</template>

<script lang="ts" setup>
import { useNotificationStore } from '@/stores/notificationStore'
import NotificationBox from './NotificationBox.vue'

const notificationStore = useNotificationStore()
</script>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
