<template>
  <div
    ref="bottomSheet"
    class="slide-up-pane animated"
    :class="hideMode"
    :style="{
      'z-index': zIndex,
    }"
  >
    <div
      class="col center clickable"
      style="min-height: 3em"
      @mousedown="dragStart"
      @touchstart="dragStart"
    >
      <div class="handle"></div>
      <h3 v-if="title" style="margin: 0.5em 1em">{{ title }}</h3>
    </div>
    <div ref="sheetContent" class="content content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps<{
  show: boolean
  hideMode: 'show-top' | 'hidden'
  title?: string
  zIndex?: number
}>()

const bottomSheet = ref<HTMLDivElement>()
const sheetContent = ref<HTMLDivElement>()

const updateSheetHeight = (height: number) => {
  if (!bottomSheet.value || !sheetContent.value) return
  bottomSheet.value.classList.add('show')
  sheetContent.value.style.height = `${height}svh`
}

const hideBottomSheet = () => {
  if (!bottomSheet.value || !sheetContent.value) return
  bottomSheet.value.classList.remove('show')
}

const dragStart = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  if (!bottomSheet.value || !sheetContent.value) return
  let isDragging = true
  let startY = e instanceof MouseEvent ? e.pageY : e.touches?.[0].pageY
  let startHeight = parseInt(sheetContent.value.style.height)
  let newY = startY
  bottomSheet.value.classList.add('dragging')

  const dragging = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return
    newY = e instanceof MouseEvent ? e.pageY : e.touches?.[0].pageY
    const delta = startY - newY
    const newHeight = startHeight + (delta / window.innerHeight) * 100
    updateSheetHeight(newHeight)
  }

  const dragStop = () => {
    if (!bottomSheet.value || !sheetContent.value) return
    isDragging = false
    bottomSheet.value.classList.remove('dragging')
    const sheetHeight = parseInt(sheetContent.value.style.height)
    const isUp = newY - startY < 0
    console.log(isUp)
    if (sheetHeight < 25) {
      if (isUp) {
        updateSheetHeight(25)
      } else {
        hideBottomSheet()
      }
    } else {
      if (isUp) {
        updateSheetHeight(80)
      } else {
        updateSheetHeight(25)
      }
    }

    document.removeEventListener('mousemove', dragging)
    document.removeEventListener('mouseup', dragStop)
    document.removeEventListener('touchmove', dragging)
    document.removeEventListener('touchend', dragStop)
  }

  document.addEventListener('mousemove', dragging)
  document.addEventListener('mouseup', dragStop)
  document.addEventListener('touchmove', dragging)
  document.addEventListener('touchend', dragStop)
}

// sheetOverlay.addEventListener('click', hideBottomSheet)
// showModalBtn.addEventListener('click', showBottomSheet)

const showBottomSheet = () => {
  if (!bottomSheet.value) return
  if (props.show) {
    bottomSheet.value.classList.add('show')
    updateSheetHeight(50)
  }
}

watch(
  () => props.show,
  () => {
    showBottomSheet()
  },
  { immediate: true }
)
</script>

<style scoped>
.toggle-button {
  width: 90px;
  margin: 0.5em;
}

.content {
  padding: 0em 2em 2em 2em;
  max-height: 80svh;
  overflow: auto;
}

.slide-up-pane {
  position: absolute;
  border-radius: 2em 2em 0 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--c-white);
  box-shadow: 0 2em 4em var(--c-text);
  transition: all 0.1s linear;
  /* opacity: 0; */
}

.hidden {
  top: 100svh;
}

.show-top {
  top: 85svh;
}

.slide-up-pane.show {
  /* opacity: 1; */
  top: unset;
}

.handle {
  width: 5em;
  height: 0.3em;
  background-color: var(--c-dark-gray);
  border-radius: 1em;
  margin-top: 1em;
}
</style>
