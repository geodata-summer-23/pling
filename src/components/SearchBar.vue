<template>
  <input
    type="text"
    placeholder="Search.."
    v-model="searchString"
    @change="emit('change', searchString)"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const searchString = ref('')

const emit = defineEmits<{
  (e: 'change', searchString: string): void
}>()
</script>

<style scoped>
input {
  border-radius: 2em;
  border-color: white;
}
</style>
