<template>
  <div class="row center" style="gap: 1em">
    <div
      v-for="(_, i) in Array(number)"
      class="item"
      :class="{ selected: index == i }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ number: number; index: number }>()
</script>

<style>
.item {
  width: 2em;
  height: 0.25em;
  background-color: var(--c-medium-gray);
}

.selected {
  background-color: var(--c-dark-gray);
}
</style>
