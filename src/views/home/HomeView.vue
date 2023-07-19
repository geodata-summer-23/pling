<template>
  <div class="view col">
    <div
      class="row center"
      style="gap: 1em; justify-content: end"
      @click="router.push({ name: 'user' })"
    >
      <span>{{ userStore.firstName }}</span>
      <fa-icon
        size="3x"
        icon="circle-user"
        class="clickable"
        style="color: var(--c-dark-gray)"
      />
    </div>
    <h2 style="margin-top: 0">{{ $t().myPlaces }}</h2>
    <div class="col" style="gap: 0.5em">
      <PlaceBox
        v-for="(place, i) in placeStore.places"
        :place="place"
        :edit="edit"
        :isMyLocation="i == 0"
      />
    </div>
    <br />
  </div>
  <div class="view-bottom col">
    <div
      class="row animated"
      :class="{ 'hidden-right': !actionsOpen }"
      style="justify-content: end"
    >
      <button class="btn btn-shadow" @click="router.push({ name: 'network' })">
        <fa-icon icon="triangle-exclamation" />
        <span style="margin: 0 0.5em">{{ $t().reportAnEvent }}</span>
      </button>
    </div>
    <div
      class="row animated"
      :class="{ 'hidden-right': !actionsOpen }"
      style="justify-content: end"
    >
      <button
        v-if="placeStore.places.length > 1"
        class="btn btn-shadow"
        @click="
          () => {
            edit = true
            actionsOpen = false
          }
        "
      >
        <fa-icon icon="pencil" />
        <span style="margin: 0 0.5em">{{ $t().editPlace }}</span>
      </button>
    </div>
    <div
      class="row animated"
      :class="{ 'hidden-right': !actionsOpen }"
      style="justify-content: end"
    >
      <button
        class="btn btn-shadow"
        @click="router.push({ name: 'add-place' })"
      >
        <fa-icon icon="plus" />
        <span style="margin: 0 0.5em">{{ $t().addPlace }}</span>
      </button>
    </div>
    <div class="row clickthrough" style="justify-content: end">
      <button
        class="btn btn-icon btn-shadow"
        style="
          background-color: var(--c-light-blue);
          color: var(--c-medium-gray);
        "
        @click="onActionButton"
      >
        <span v-if="edit">
          <fa-icon size="lg" icon="xmark" />
          {{ $t().cancelEdit }}</span
        >
        <fa-icon
          v-else
          size="lg"
          :icon="actionsOpen ? 'xmark' : 'ellipsis-vertical'"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { router } from '@/router'
import { usePlaceStore } from '@/stores/placeStore'
import { useUserStore } from '@/stores/userStore'
import { onDeactivated, ref } from 'vue'
import { $t } from '@/translation'
import PlaceBox from './PlaceBox.vue'
import { useNotificationStore } from '@/stores/notificationStore'

const userStore = useUserStore()
const placeStore = usePlaceStore()

const edit = ref(false)
const actionsOpen = ref(false)

onDeactivated(() => {
  actionsOpen.value = false
  edit.value = false
})

const onActionButton = () => {
  useNotificationStore().push({
    title: 'Forest fire',
    body: 'Located at Geodata headquarters',
    category: 'heatwave',
    timestamp: Date.now(),
    click: () => router.push({ name: 'map' }),
  })
  if (edit.value) {
    edit.value = false
  } else {
    actionsOpen.value = !actionsOpen.value
  }
}
</script>

<style scoped></style>
