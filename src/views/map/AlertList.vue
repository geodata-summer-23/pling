<template>
  <div class="col">
    <h3 style="margin: 0em 2em">{{ $t().category }}</h3>
    <div class="row" style="gap: 0.5em; overflow: auto; padding-inline: 2em">
      <div
        v-for="alert in place.alertResponse.alerts"
        class="row center alert-tab"
        :class="{ selected: selectedAlert == alert }"
        style="gap: 0.5em"
        @click="() => selectAlert(alert)"
      >
        <img :src="getCategoryIconSrc(alert.category)" alt="" width="30" />
        {{ $text(alert.category) }}
      </div>
    </div>

    <AlertBox v-if="selectedAlert" :alert="selectedAlert" />
  </div>
</template>

<script lang="ts" setup>
import AlertBox from './AlertBox.vue'
import { ref } from 'vue'
import { $t, $text } from '@/translation'
import { Place } from '@/scripts/place'
import { Alert } from '@/scripts/alert'
import { Category, getCategoryIconSrc } from '@/scripts/category'

defineProps<{ place: Place }>()

const emit = defineEmits<{
  (e: 'select-category', category: Category): void
}>()

const selectedAlert = ref<Alert | null>(null)

const selectAlert = (event: Alert) => {
  selectedAlert.value = event
  emit('select-category', event.category)
}
</script>

<style scoped>
.alert-tab {
  padding: 0.5em 1em;
  background-color: var(--c-white);
  color: var(--c-dark-gray);
  border-radius: 0.5em;
  border: 1px solid var(--c-medium-gray);
  height: 3em;
}

.alert-tab.selected {
  background-color: var(--c-white);
  color: var(--c-text);
}
</style>
