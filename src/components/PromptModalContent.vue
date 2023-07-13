<template>
  <div class="col center spaced" style="height: 100%">
    <div style="text-align: center">
      <h3>{{ title }}</h3>
      <p>{{ text }}</p>
    </div>
    <div class="row" style="gap: 1em">
      <button
        v-for="button in buttons"
        class="btn"
        :class="button.class"
        @click="button.click"
      >
        {{ button.text }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
  text: string
  buttons: { text: string; click: () => void; class: string }[]
}>()
</script>

<style scoped>
.btn {
  width: 6em;
}

.blue {
  background-color: var(--c-light-blue);
  color: var(--c-white);
}
</style>
