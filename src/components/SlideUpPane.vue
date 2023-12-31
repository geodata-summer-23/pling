<template>
  <div
    ref="paneDivRef"
    class="slide-up-pane clickthrough"
    :class="hideMode"
    :style="{
      'z-index': zIndex,
    }"
  >
    <div class="clickthrough" :class="{ 'hidden-right': state == State.Up }">
      <slot name="above"></slot>
    </div>
    <div class="card">
      <div
        class="row"
        style="justify-content: space-evenly; align-items: center"
      >
        <div style="width: 3em; display: flex; justify-content: center">
          <slot name="top-left"></slot>
        </div>
        <div
          class="col center clickable"
          style="min-height: 3em; max-width: 12em"
          @mousedown.stop="clickMiddle"
          @touchstart.stop="clickMiddle"
        >
          <!-- <div class="handle"></div> -->
          <h3 v-if="title" style="margin: 0.5em 1em">{{ title }}</h3>
        </div>
        <div style="width: 3em; display: flex; justify-content: center">
          <IconButton
            :icon="state != State.Down ? 'angle-down' : 'angle-up'"
            @click="clickRight"
          ></IconButton>
        </div>
      </div>
      <div
        ref="contentDivRef"
        class="content"
        style="height: calc(0svh - 12em)"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconButton from './IconButton.vue'
import { onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    show: boolean
    hideMode: 'show-top' | 'hidden'
    title?: string
    zIndex?: number
    middleSvh?: number
  }>(),
  { middleSvh: 55 }
)

const paneDivRef = ref<HTMLDivElement>()
const contentDivRef = ref<HTMLDivElement>()

enum State {
  Down,
  Middle,
  Up,
}

const state = ref(State.Down)

const clickRight = () => {
  switch (state.value) {
    case State.Down:
      state.value = State.Up
      break
    case State.Middle:
      state.value = State.Down
      break
    case State.Up:
      state.value = State.Down
      break
  }
}

const clickMiddle = () => {
  switch (state.value) {
    case State.Down:
      state.value = State.Middle
      break
    case State.Middle:
      state.value = State.Up
      break
    case State.Up:
      state.value = State.Middle
      break
  }
}

const hidePane = () => {
  state.value = State.Down
  if (!paneDivRef.value || !contentDivRef.value) return
  paneDivRef.value.classList.remove('show')
  contentDivRef.value.classList.remove('show')
  contentDivRef.value.style.height = `calc(0svh - 12em)`
}

const updateSheetHeight = (height: number) => {
  if (!paneDivRef.value || !contentDivRef.value) return
  paneDivRef.value.classList.add('show')
  contentDivRef.value.classList.add('show')
  contentDivRef.value.style.height = `calc(${height}svh - 12em)`
}

onMounted(() => {
  if (props.show) {
    state.value = State.Middle
  } else {
    state.value = State.Down
  }
})

watch(
  () => props.show,
  () => {
    if (props.show) {
      state.value = State.Middle
    } else {
      state.value = State.Down
    }
  }
)

watch(
  () => state.value,
  () => {
    contentDivRef.value?.scrollTo(0, 0)
    switch (state.value) {
      case State.Down:
        hidePane()
        break
      case State.Middle:
        updateSheetHeight(props.middleSvh)
        break
      case State.Up:
        updateSheetHeight(100)
        break
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
  padding-bottom: 2em;
  overflow: auto;
  max-height: 0;
}

.content.show {
  max-height: calc(100svh - 12em);
}

.slide-up-pane {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translateY(100svh);
}

.slide-up-pane .card {
  border-radius: 2em 2em 0 0;
  background-color: var(--c-white);
  box-shadow: 0 2em 4em #1f2144;
}

.slide-up-pane.show {
  transform: translateY(2em);
}

.slide-up-pane.show-top {
  transform: translateY(2em);
}

* {
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
