<template>
  <div
    class="notification-item col spaced clickable"
    @click.stop="emit('click')"
  >
    <div class="row spaced">
      <div
        class="col center"
        style="margin-right: 1em"
        @click.stop="emit('delete')"
      >
        <fa-icon size="lg" icon="xmark"></fa-icon>
      </div>
      <div>
        <div style="font-weight: bold">
          {{ notification.title }}
        </div>
        <div>{{ notification.body }}</div>
      </div>
      <img
        :src="getCategoryIconSrc(notification.category)"
        alt="notification.category"
        style="margin: 0.5"
        width="50"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCategoryIconSrc } from '@/stores/placeStore'
import { NotificationData } from '@/stores/notificationStore'

defineProps<{ notification: NotificationData }>()

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'delete'): void
}>()
</script>

<style>
.notification-item {
  position: relative;
  border: 1px solid var(--c-dark-gray);
  border-radius: 1em;
  padding: 1em;
  box-shadow: 0 0.4em 2em var(--c-dark-gray);
  background-color: var(--c-medium-gray);
  margin: 1em;
}
</style>
@/stores/events
