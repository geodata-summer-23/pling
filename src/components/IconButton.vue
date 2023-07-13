<template>
  <button
    class="btn-icon transparent"
    @click="emit('click')"
    @mousedown="emit('mousedown')"
    @touchstart="emit('mousedown')"
  >
    <fa-icon v-if="!hidden" size="2xl" :icon="icon" />
  </button>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ icon?: string; hidden?: boolean }>(), {
  icon: 'angle-left',
})
const emit = defineEmits<{ (e: 'click'): void; (e: 'mousedown'): void }>()
</script>
