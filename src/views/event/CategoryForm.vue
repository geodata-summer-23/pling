<template>
  <h3>{{ $t().whatKindEvent }}</h3>
  <div class="col select">
    <select
      class="category-select"
      name="Kategori"
      id="category"
      @change="
        emit(
          'category',
          ($event.target as HTMLSelectElement).value as CategoryState
        )
      "
    >
      <option v-for="option in options" :value="option.value">
        {{ option.title }}
      </option>
    </select>
  </div>
</template>

<script lang="ts" setup>
import { CategoryState } from '@/stores/eventStore'
import { $t } from '@/translation'

type CategoryOption = { title: string; value: CategoryState }

const options: CategoryOption[] = [
  { title: $t().flood, value: 'flood' },
  { title: $t().torrentialRain, value: 'rainflood' },
  { title: $t().fire, value: 'forestfire' },
  { title: $t().windDamage, value: 'wind' },
  { title: $t().avalanche, value: 'avalanches' },
  { title: $t().other, value: 'other' },
]

const emit = defineEmits<{
  (e: 'category', cat: CategoryState): void
}>()
</script>

<style>
.category-select {
  padding: 1em;
  appearance: initial;
  flex-shrink: 0;
}
</style>
