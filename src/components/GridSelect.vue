<template>
  <div
    class="grid"
    :style="{
      'grid-template-columns': gridTemplate,
      padding: options.some((o) => !!o.icon) ? '1em' : '0.5em',
    }"
  >
    <div
      v-for="option in options"
      :class="{ selected: option.value == value, 'has-text': !!option.text }"
      class="row center"
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
  border-radius: 2em;
  margin: 0.5em 0em;
  white-space: nowrap;
  align-items: center;
  justify-content: space-between;
}

span {
  padding: 0.5em 1em;
  cursor: pointer;
}

.selected.has-text {
  background-color: var(--c-blue);
  border-radius: 3em;
  color: var(--c-white);
}

svg {
  color: var(--c-dark-gray);
  cursor: pointer;
}

.selected > svg {
  color: var(--c-blue);
}
</style>
