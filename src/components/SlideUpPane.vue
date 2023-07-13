<template>
  <div
    ref="paneDivRef"
    class="slide-up-pane"
    :class="hideMode"
    :style="{
      'z-index': zIndex,
    }"
  >
    <div><slot name="above"></slot></div>
    <div class="card">
      <div
        class="row"
        style="justify-content: space-evenly; align-items: center"
      >
        <div style="width: 3em; display: flex; justify-content: center">
          <IconButton
            v-if="state != State.Down"
            icon="xmark"
            @click="clickLeft"
          ></IconButton>
          <div v-else>
            <slot name="top-left"></slot>
          </div>
        </div>
        <div
          class="col center clickable"
          style="min-height: 3em; max-width: 12em"
          @mousedown="clickRight"
          @touchstart="clickRight"
        >
          <div class="handle"></div>
          <h3 v-if="title" style="margin: 0.5em 1em">{{ title }}</h3>
        </div>
        <div style="width: 3em; display: flex; justify-content: center">
          <IconButton
            :icon="state == State.Up ? 'angle-down' : 'angle-up'"
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
import throttle from 'lodash.throttle'

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

const paneDivRef = ref<HTMLDivElement>()
const contentDivRef = ref<HTMLDivElement>()

enum State {
  Down,
  Middle,
  Up,
}

const state = ref(State.Down)

const clickRight = throttle(
  () => {
    switch (state.value) {
      case State.Down:
        emit('show')
        break
      case State.Middle:
        state.value = State.Up
        break
      case State.Up:
        state.value = State.Middle
        break
    }
  },
  310,
  { trailing: false }
)

const clickLeft = () => {
  emit('hide')
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
  padding: 0em 2em 2em 2em;
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
  box-shadow: 0 2em 4em var(--c-text);
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
