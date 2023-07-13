<template>
  <div class="modal col" ref="modalRef">
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
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'

const modalStore = useModalStore()
const modalRef = ref<HTMLDivElement | null>(null)

onClickOutside(modalRef, () => {
  modalStore.pop()
})

defineProps<{
  component: DynamicComponent
}>()
</script>
