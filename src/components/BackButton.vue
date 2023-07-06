<template>
  <span class="btn-icon" @click="emit('click')">
    <fa-icon size="2xl" icon="angle-left" />
  </span>
</template>

<script lang="ts" setup>
const emit = defineEmits<{ (e: 'click'): void }>()
</script>
