<template>
  <div class="col" style="margin-top: 1em; gap: 1em">
    <EventBox v-for="event in place.events" :event="event" :active="true" />
  </div>
</template>

<script lang="ts" setup>
import EventBox from './EventBox.vue'
import { Place } from '@/scripts/place'
import { updatePlace } from '@/stores/placeStore'
import { onMounted } from 'vue'

const props = defineProps<{ place: Place }>()

onMounted(() => {
  updatePlace(props.place, {})
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
