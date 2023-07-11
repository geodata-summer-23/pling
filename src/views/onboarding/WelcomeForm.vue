<template>
  <h1>{{ $t().welcomeTo }}</h1>
  <h1 style="text-align: right">{{ $t().appName }}</h1>
</template>

<script lang="ts" setup>
import { $t } from '@/translation'
import { onMounted } from 'vue'

const emit = defineEmits<{
  (e: 'update-valid', valid: boolean): void
}>()

onMounted(() => {
  emit('update-valid', true)
})
</script>
