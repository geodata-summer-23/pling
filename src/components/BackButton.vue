<template>
  <button class="btn-icon transparent" @click="emit('click')">
    <fa-icon size="2xl" icon="angle-left" />
  </button>
</template>

<script lang="ts" setup>
const emit = defineEmits<{ (e: 'click'): void }>()
</script>
