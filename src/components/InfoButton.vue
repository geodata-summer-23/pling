<template>
  <IconButton class="icon" icon="info" size="sm" @click="click"></IconButton>
</template>

<script lang="ts" setup>
import { useModalStore } from '@/stores/modalStore'
import IconButton from './IconButton.vue'
import PromptModalContent from './PromptModalContent.vue'

const props = defineProps<{
  title: string
  text: string
}>()

const click = () => {
  useModalStore().push(
    PromptModalContent,
    { title: props.title, text: props.text, buttons: [] },
    {}
  )
}
</script>

<style>
.icon {
  color: var(--c-dark-gray);
  border: 2px solid var(--c-dark-gray);
  padding: 0.1em 0.2em 0.1em 0.3em;
  border-radius: 2em;
  display: inline;
  aspect-ratio: 1;
}
</style>
