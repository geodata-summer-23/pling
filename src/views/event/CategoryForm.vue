<template>
  <h3>{{ $t().whatKindEvent }}</h3>
  <div class="col select">
    <select
      class="category-select"
      name="Kategori"
      id="category"
      @change="
        emit('category', ($event.target as HTMLSelectElement).value as Category)
      "
    >
      <option v-for="option in options" :value="option.category">
        {{ option.title }}
      </option>
    </select>
  </div>
</template>

<script lang="ts" setup>
import { Category } from '@/stores/placeStore'
import { $t } from '@/translation'
import { getCategoryOptions } from '../map/map'

const options = [
  ...getCategoryOptions(),
  { title: $t().other, category: 'other' },
]

const emit = defineEmits<{
  (e: 'category', cat: Category): void
}>()
</script>

<style>
.category-select {
  padding: 1em;
  appearance: initial;
  flex-shrink: 0;
}
</style>
@/stores/events
