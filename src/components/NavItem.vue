<template>
  <div class="col center">
    <slot class="icon"></slot>
    <span>{{ text }}</span>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  text: string
}>()
</script>
