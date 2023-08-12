<template>
  <h3>{{ $t().whatKindEvent }}</h3>
  <div class="col">
    <div v-for="option in options" class="row spaced center">
      <label :for="option.category">{{ $text(option.category) }}</label>
      <input
        type="radio"
        :id="option.category"
        :name="option.category"
        :value="option.category"
        :checked="category == option.category"
        @click="emit('category', option.category)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Category, getCategoryOptions } from '@/scripts/category'
import { $t, $text } from '@/translation'

const options = [
  ...getCategoryOptions(),
  { title: $t().other, category: 'other' as Category },
]

defineProps<{
  category: Category
}>()

const emit = defineEmits<{
  (e: 'category', cat: Category): void
}>()
</script>

<style scoped>
label {
  padding: 0.6em 1em 0.6em 0em;
  width: 100%;
}
</style>
