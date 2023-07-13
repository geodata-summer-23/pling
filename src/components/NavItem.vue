<template>
  <div
    class="nav-item col center"
    :class="{ active: router.currentRoute.value.name == route }"
  >
    <slot class="icon"></slot>
    <span v-if="text">{{ text }}</span>
  </div>
</template>

<script lang="ts" setup>
import { router } from '@/router'

defineProps<{
  route: string
  text?: string
}>()
</script>

<style scoped>
.nav-item {
  padding: 0.5em;
  width: 100px;
  min-height: 2.8em;
  color: var(--c-dark-gray);
  border-top: 4px solid var(--c-light-gray);
}

.active {
  color: var(--c-blue);
  border-top: 4px solid var(--c-blue);
}
</style>
