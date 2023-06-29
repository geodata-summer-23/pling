<template>
  <p class="min-tekst">Hei</p>
  <button @click="click">Count: {{ count }}</button>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const count = ref(0);

function click() {
  count.value += 1;
  console.log(props.text);
  emit('countUpdate', count.value);
}

const props = defineProps<{ text: string }>();

const emit = defineEmits<{
  (e: 'countUpdate', count: number): void;
}>();
</script>
