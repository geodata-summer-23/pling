<template>
  <h1>Welcome to</h1>
  <h1 style="text-align: right">Varslingstjenesten</h1>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'

const emit = defineEmits<{
  (e: 'update-valid', valid: boolean): void
}>()

onMounted(() => {
  emit('update-valid', true)
})
</script>
