<template>
  <div class="row spaced" style="margin: 1em">
    <div
      v-for="option in options"
      :style="{
        color: option.value == value ? 'var(--c-blue)' : 'var(--c-dark-gray)',
      }"
      @click="emit('change', option.value)"
    >
      <span v-if="option.text">{{ option.text }}</span>
      <fa-icon size="2xl" v-if="option.icon" :icon="option.icon"></fa-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  value: string
  options: { text?: string; icon?: string; value: string }[]
}>()

const emit = defineEmits<{
  (e: 'change', value: string): void
}>()
</script>
