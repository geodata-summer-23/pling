<template>
  <div
    class="slide-up-pane animated"
    :class="{
      'almost-hidden': !open && hideMode == 'show-top',
      'completely-hidden': !open && hideMode == 'hidden',
    }"
    :style="{
      'z-index': zIndex,
    }"
  >
    <div class="row center clickable" @click="emit('toggle')">
      <h3 v-if="title" style="margin: 0.5em 1em">{{ title }}</h3>
      <span class="btn-icon" style="padding: 0.5em">
        <fa-icon size="xl" :icon="open ? 'angle-down' : 'angle-up'" />
      </span>
    </div>
    <div class="slide-up-pane-margins">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title?: string
  open: boolean
  hideMode: 'show-top' | 'hidden'
  zIndex?: number
}>()

const emit = defineEmits<{
  (e: 'toggle'): void
}>()
</script>

<style scoped>
.slide-up-pane {
  position: absolute;
  border-radius: 2em 2em 0 0;
  width: 100%;
  bottom: 0;
  background-color: var(--c-white);
  box-shadow: 0 2em 4em var(--c-text);
}

.toggle-button {
  width: 90px;
  margin: 0.5em;
}

.slide-up-pane-margins {
  padding: 0em 2em 2em 2em;
  max-height: 500px;
  overflow: auto;
}

.almost-hidden {
  transform: translateY(calc(100% - 3em));
}

.completely-hidden {
  transform: translateY(100%);
  box-shadow: none;
}
</style>
