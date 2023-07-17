<template>
  <div class="grid spaced" :style="{ 'grid-template-columns': gridTemplate }">
    <div
      v-for="option in options"
      :class="{ selected: option.value == value }"
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
  gridTemplate: string
}>()

const emit = defineEmits<{
  (e: 'change', value: string): void
}>()
</script>

<style scoped>
.grid {
  display: grid;
  column-gap: 0.5em;
  row-gap: 1em;
  box-shadow: 0 0.4em 0.6em var(--c-medium-gray);
  padding: 1em 1em;
  border-radius: 2em;
  margin: 0.5em 0em;
}

span {
  padding: 0.5em 2em;
}

.selected > span {
  background-color: var(--c-blue);
  border-radius: 3em;
  color: var(--c-white);
}

svg {
  color: var(--c-dark-gray);
}

.selected > svg {
  color: var(--c-blue);
}
</style>
