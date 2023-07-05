<template>
  <div
    class="slide-up-pane"
    :class="{
      'almost-hidden': !open && hideMode == 'show-top',
      'completely-hidden': !open && hideMode == 'hidden',
    }"
  >
    <div class="col center">
      <button class="toggle-button" @click="emit('toggle')">
        <fa-icon :icon="open ? 'angle-down' : 'angle-up'" />
      </button>
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
  background-color: #f3f3f3;
  box-shadow: 0px 0px 20px gray;
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
}
</style>
