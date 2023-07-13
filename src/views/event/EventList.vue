<template>
  <div class="col">
    <div class="row" style="gap: 0.5em">
      <div
        v-for="event in useEventStore().events"
        class="event-tab"
        :class="{ selected: selectedEvent == event }"
        @click="selectedEvent = event"
      >
        {{ event.message }}
      </div>
    </div>
    <EventBox v-if="selectedEvent" :event="selectedEvent" />
  </div>
</template>

<script lang="ts" setup>
import EventBox from './EventBox.vue'
import { usePlaceStore } from '@/stores/placeStore'
import { useEventStore, AlertData } from '@/stores/eventStore'
import { ref, watch } from 'vue'

const selectedEvent = ref<AlertData | null>(null)
const eventStore = useEventStore()

watch(
  () => usePlaceStore().currentPlace,
  () => {
    eventStore.updateEvents(
      usePlaceStore().currentPlace?.address.point?.latitude,
      usePlaceStore().currentPlace?.address.point?.longitude
    )
  },
  { immediate: true }
)

watch(
  () => eventStore.events,
  () => {
    if (eventStore.events.length > 0) {
      selectedEvent.value = eventStore.events[0]
    }
  }
)
</script>

<style scoped>
.event-tab {
  padding: 0.5em 1em;
  background-color: var(--c-white);
  color: var(--c-dark-gray);
  border-radius: 1em 1em 0em 0em;
  border: 1px solid var(--c-medium-gray);
  border-bottom: none;
}

.event-tab.selected {
  background-color: var(--c-white);
  color: var(--c-text);
  transform: translateY(1px);
}
</style>
