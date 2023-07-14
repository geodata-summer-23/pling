<template>
  <div class="modal col">
    <div style="position: absolute; transform: translate(-1em, -1em)">
      <IconButton icon="xmark" @click="modalStore.pop"></IconButton>
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
