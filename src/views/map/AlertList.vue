<template>
  <div class="col">
    <div
      class="row"
      style="gap: 0.5em; overflow: auto; padding: 0em 2em 1em 2em"
    >
      <div
        v-for="alert in place.alerts"
        class="row center alert-tab"
        :class="{ selected: selectedAlert == alert }"
        style="gap: 0.5em"
        @click="() => selectAlert(alert)"
      >
        <img
          :src="getCategoryIconSrc(alert.category, alert.severity)"
          alt=""
          width="30"
        />
        {{ $text(alert.category) }}
      </div>
    </div>

    <AlertBox v-if="selectedAlert" :alert="selectedAlert" />
  </div>
</template>

<script lang="ts" setup>
import AlertBox from './AlertBox.vue'
import { ref, watch } from 'vue'
import { $text } from '@/translation'
import { Place } from '@/scripts/place'
import { Alert } from '@/scripts/alert'
import { Category, getCategoryIconSrc } from '@/scripts/category'

const props = defineProps<{ place: Place }>()

const emit = defineEmits<{
  (e: 'select-category', category: Category): void
}>()

const selectedAlert = ref<Alert | null>(null)

const selectAlert = (event: Alert) => {
  selectedAlert.value = event
  emit('select-category', event.category)
}

watch(
  [() => props.place, () => props.place.alerts],
  ([place, alerts]) => {
    if (alerts.length == 0) {
      selectedAlert.value = null
      return
    }
    if (selectedAlert.value == null || !alerts.includes(selectedAlert.value)) {
      selectAlert(place.alerts[0])
      return
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.alert-tab {
  padding: 0.2em 1em;
  background-color: var(--c-white);
  color: var(--c-dark-gray);
  border-radius: 0.5em;
  border: 1px solid var(--c-medium-gray);
  height: 3em;
}

.alert-tab.selected {
  background-color: var(--c-white);
  color: var(--c-text);
  border-color: var(--c-dark-gray);
  box-shadow: 0 0.2em 0.2em var(--c-dark-gray);
}
</style>
