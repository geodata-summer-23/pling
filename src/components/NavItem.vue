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
  width: 120px;
  min-height: 3em;
  color: var(--c-dark-gray);
}

.active {
  color: var(--c-blue);
  border-top: 4px solid var(--c-blue);
}
</style>
