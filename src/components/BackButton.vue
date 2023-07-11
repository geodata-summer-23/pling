<template>
  <button class="btn-icon transparent" @click="emit('click')">
    <fa-icon size="2xl" :icon="icon" />
  </button>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ icon: string }>(), { icon: 'angle-left' })
const emit = defineEmits<{ (e: 'click'): void }>()
</script>
