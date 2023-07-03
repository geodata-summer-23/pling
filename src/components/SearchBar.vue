<template>
  <input
    type="text"
    :placeholder="placeholder"
    v-model="searchString"
    @change=""
    @keydown.enter="(event) => {
      emit('search', searchString);
      (event.target as HTMLInputElement).blur();
      searchString = '';
    }"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const searchString = ref('')

withDefaults(
  defineProps<{
    placeholder: string
  }>(),
  { placeholder: 'Search..' }
)

const emit = defineEmits<{
  (e: 'search', searchString: string): void
}>()
</script>

<style scoped>
input {
  border-radius: 2em;
}
</style>
