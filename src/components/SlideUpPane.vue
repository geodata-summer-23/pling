<template>
  <div
    class="slide-up-pane"
    :class="{
      'almost-hidden': !open && hideMode == 'show-top',
      'completely-hidden': !open && hideMode == 'hidden',
    }"
  >
    <div class="col center">
      <span class="btn-icon" style="padding: 0.5em 4em" @click="emit('toggle')">
        <fa-icon size="2xl" :icon="open ? 'angle-down' : 'angle-up'" />
      </span>
    </div>
    <div class="slide-up-pane-margins">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ open: boolean; hideMode: 'show-top' | 'hidden' }>()

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
  transition: all 400ms;
  background-color: white;
  box-shadow: 0px 0px 20px var(--c-dark-gray);
}

.toggle-button {
  width: 90px;
  margin: 0.5em;
}

.slide-up-pane-margins {
  padding: 0em 2em 2em 2em;
  max-height: 400px;
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
