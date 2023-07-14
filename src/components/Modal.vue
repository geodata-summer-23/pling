<template>
  <div class="modal col">
    <div style="position: absolute; right: 0.5em; top: 0.5em">
      <IconButton size="lg" icon="xmark" @click="modalStore.pop"></IconButton>
    </div>
    <component
      :is="component.component"
      v-bind="component.props"
      v-on="component.emits"
    ></component>
  </div>
</template>

<script lang="ts" setup>
import IconButton from './IconButton.vue'
import { useModalStore, DynamicComponent } from '@/stores/modalStore'

const modalStore = useModalStore()

defineProps<{
  component: DynamicComponent
}>()
</script>
