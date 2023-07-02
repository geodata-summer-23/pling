<template>
  <div class="slide-up-pane" :class="{ 'hidden-below': !open }">
    <div class="col">
      <button class="toggle-button" @click="emit('close')">Close</button>
    </div>
    <div class="slide-up-pane-margins">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: 'close'): void
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
  padding: 2em;
  max-height: 400px;
  overflow: auto;
}

.hidden-below {
  transform: translateY(150%);
}
</style>
