<template>
  <div
    ref="bottomSheet"
    class="slide-up-pane"
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
    <div ref="sheetContent" class="content" style="height: calc(0svh - 12em)">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    show: boolean
    hideMode: 'show-top' | 'hidden'
    title?: string
    zIndex?: number
    middleSvh?: number
  }>(),
  { middleSvh: 50 }
)

const emit = defineEmits<{
  (e: 'show'): void
  (e: 'hide'): void
}>()

const bottomSheet = ref<HTMLDivElement>()
const sheetContent = ref<HTMLDivElement>()

const showBottomSheet = () => {
  if (!bottomSheet.value || !sheetContent.value) return
  updateSheetHeight(props.middleSvh)
}

const hideBottomSheet = () => {
  if (!bottomSheet.value || !sheetContent.value) return
  bottomSheet.value.classList.remove('show')
  sheetContent.value.classList.remove('show')
  sheetContent.value.style.height = `calc(0svh - 12em)`
}

const updateSheetHeight = (height: number) => {
  if (!bottomSheet.value || !sheetContent.value) return
  bottomSheet.value.classList.add('show')
  sheetContent.value.classList.add('show')
  sheetContent.value.style.height = `calc(${height}svh - 12em)`
}

const dragStart = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  if (!bottomSheet.value || !sheetContent.value) return
  let isDragging = true
  let startY = e instanceof MouseEvent ? e.pageY : e.touches?.[0].pageY

  const styleHeight = sheetContent.value.style.height
  const startHeight = parseInt(
    styleHeight.substring(
      styleHeight.indexOf('(') + 1,
      styleHeight.indexOf('svh')
    )
  )
  let newY = startY
  sheetContent.value.classList.add('dragging')

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
    sheetContent.value.classList.remove('dragging')
    const styleHeight = sheetContent.value.style.height
    const sheetHeight = parseInt(
      styleHeight.substring(
        styleHeight.indexOf('(') + 1,
        styleHeight.indexOf('svh')
      )
    )

    if (sheetHeight < props.middleSvh) {
      if (newY > startY) {
        emit('hide')
      } else {
        emit('show')
      }
    } else if (sheetHeight == props.middleSvh) {
      if (newY > startY) {
        emit('hide')
      } else {
        updateSheetHeight(100)
      }
    } else if (sheetHeight > props.middleSvh) {
      if (newY >= startY) {
        updateSheetHeight(props.middleSvh)
      } else {
        updateSheetHeight(100)
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

onMounted(() => {
  if (props.show) {
    showBottomSheet()
  } else {
    hideBottomSheet()
  }
})

watch(
  () => props.show,
  () => {
    if (props.show) {
      showBottomSheet()
    } else {
      hideBottomSheet()
    }
  }
)
</script>

<style scoped>
.toggle-button {
  width: 90px;
  margin: 0.5em;
}

.content {
  padding: 0em 2em 2em 2em;
  overflow: auto;
  max-height: 0;
}

.content.show {
  max-height: calc(100svh - 12em);
}

.slide-up-pane {
  position: absolute;
  border-radius: 2em 2em 0 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--c-white);
  box-shadow: 0 2em 4em var(--c-text);
  transition: all 300ms;
  transform: translateY(100svh);
}

.slide-up-pane.show {
  transform: translateY(0);
}

.slide-up-pane.show-top {
  transform: translateY(0);
}

.slide-up-pane > * {
  transition: all 300ms;
}

.dragging {
  transition: none !important;
}

.handle {
  width: 5em;
  height: 0.3em;
  background-color: var(--c-dark-gray);
  border-radius: 1em;
  margin-top: 1em;
}
</style>
