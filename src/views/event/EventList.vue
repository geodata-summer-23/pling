<template>
  <div class="col">
    <EventBox v-for="event in place.events" :event="event" />
  </div>
</template>

<script lang="ts" setup>
import EventBox from './EventBox.vue'
import { onMounted } from 'vue'
import { updatePlace } from '@/stores/placeStore'
import { Place } from '@/scripts/place'

const props = defineProps<{ place: Place }>()

onMounted(() => {
  updatePlace(props.place)
})
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
