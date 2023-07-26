<template>
  <div class="col center spaced" style="height: 100%">
    <h3 style="text-align: center; margin: 0">{{ title }}</h3>
    <p v-html="text"></p>
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

p {
  font-size: 10pt;
}
</style>
