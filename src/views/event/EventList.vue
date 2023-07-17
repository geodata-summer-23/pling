<template>
  <div class="col">
    <div class="row" style="gap: 0.5em">
      <div
        v-for="event in place.events"
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
import { ref } from 'vue'
import { translate } from '@/translation'
import {
  AlertData,
  getCategoryIconSrc,
  Category,
  Place,
} from '@/stores/placeStore'

defineProps<{ place: Place }>()

const emit = defineEmits<{
  (e: 'select-category', category: Category): void
}>()

const selectedEvent = ref<AlertData | null>(null)

const selectEvent = (event: AlertData) => {
  selectedEvent.value = event
  emit('select-category', event.category)
}
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
@/stores/events@/stores/events
