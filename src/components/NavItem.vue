<template>
  <div
    class="nav-item col center"
    :class="{ active: router.currentRoute.value.name == text.toLowerCase() }"
  >
    <slot class="icon"></slot>
    <span>{{ text }}</span>
  </div>
</template>

<script lang="ts" setup>
import { router } from '@/router'

defineProps<{
  text: string
}>()
</script>

<style scoped>
.nav-item {
  padding: 0.5em;
  width: 80px;
}

.active {
  background-color: #00000010;
}
</style>
