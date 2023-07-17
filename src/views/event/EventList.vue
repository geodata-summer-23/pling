<template>
  <div class="col">
    <div class="row" style="gap: 0.5em">
      <div
        v-for="event in useEventStore().events"
        class="row center event-tab"
        :class="{ selected: selectedEvent == event }"
        style="gap: 0.5em"
        @click="() => selectEvent(event)"
      >
        <img :src="getCategoryIconSrc(event.category)" alt="" width="30" />
        {{ translate(event.category) }}
      </div>
    </div>

    <EventBox v-if="selectedEvent" :event="selectedEvent" />
  </div>
</template>

<script lang="ts" setup>
import EventBox from './EventBox.vue'
import { usePlaceStore } from '@/stores/placeStore'
import {
  useEventStore,
  AlertData,
  getCategoryIconSrc,
} from '@/stores/eventStore'
import { ref, watch } from 'vue'
import { translate } from '@/translation'
import { CategoryState } from '@/stores/eventStore'

const emit = defineEmits<{
  (e: 'select-category', category: CategoryState): void
}>()

const selectedEvent = ref<AlertData | null>(null)
const eventStore = useEventStore()

const selectEvent = (event: AlertData) => {
  selectedEvent.value = event
  emit('select-category', event.category)
}

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
  border-radius: 0.5em;
  border: 1px solid var(--c-medium-gray);
  border-bottom: none;
}

.event-tab.selected {
  background-color: var(--c-white);
  color: var(--c-text);
}
</style>
