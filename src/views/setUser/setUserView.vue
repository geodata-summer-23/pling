<template>
  <div>
    <label for="name">Name:</label>
    <input id="name" type="text" v-model="name" />
    <label for="age">Age:</label>
    <input id="age" type="number" v-model.number="age" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onUnmounted } from 'vue'

const name = ref(localStorage.getItem('name') ?? '')
const age = ref(localStorage.getItem('age') ?? '')

onUnmounted(() => {
  if (name.value) {
    localStorage.setItem('name', name.value)
  }
  if (age.value) {
    localStorage.setItem('age', age.value)
  }
})
</script>
