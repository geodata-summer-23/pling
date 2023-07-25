<template>
  <div
    class="address-item shadow row spaced clickable"
    @click="clickPlace(place)"
  >
    <div class="alert-icon-container">
      <img
        v-for="icon in warningIcons"
        :src="icon"
        width="40"
        style="margin-left: -1.5em"
      />
    </div>
    <div v-if="edit && !isMyLocation" class="edit-icon-container">
      <fa-icon icon="pencil" size="lg" class="vertical-shake"></fa-icon>
    </div>
    <div class="col">
      <span style="font-weight: bold">
        <fa-icon
          :icon="place.icon"
          style="padding-right: 0.3em; color: var(--c-dark-gray)"
        ></fa-icon>
        {{ maxChars(place.nickname, 20) }}</span
      >
      <AddressPosition
        :address="place.address"
        font-size="small"
      ></AddressPosition>
    </div>
    <WeatherNowcast
      v-if="place.nowcast"
      :nowcast-data="place.nowcast"
    ></WeatherNowcast>
  </div>
</template>

<script lang="ts" setup>
import WeatherNowcast from './WeatherNowcast.vue'
import AddressPosition from '@/components/AddressPosition.vue'
import { updatePlace, usePlaceStore } from '@/stores/placeStore'
import { computed } from 'vue'
import { router } from '@/router'
import { maxChars } from '@/scripts/string'
import { useLoadingStore } from '@/stores/loadingStore'
import { Place } from '@/scripts/place'
import { getCategoryIconSrc } from '@/scripts/category'

const placeStore = usePlaceStore()
const props = defineProps<{
  place: Place
  edit: boolean
  isMyLocation: boolean
}>()

const warningIcons = computed(() =>
  props.place.alerts.map((alert) => getCategoryIconSrc(alert.category))
)

const clickPlace = (place: Place) => {
  if (place.address.position && placeStore.currentPlace != place) {
    useLoadingStore().mapIsLoading = true
    placeStore.currentPlace = place
    updatePlace(placeStore.currentPlace, {})
  }
  if (props.edit) {
    if (!props.isMyLocation) {
      router.push({ name: 'edit-place' })
    }
  } else {
    router.push({ name: 'map' })
  }
}
</script>

<style scoped>
.alert-icon-container {
  position: absolute;
  width: 90%;
  top: -0.7em;
  display: flex;
  flex-direction: row;
  justify-content: end;
}

.edit-icon-container {
  position: absolute;
  width: 90%;
  top: -0.2em;
  left: -0.2em;
  display: flex;
  flex-direction: row;
  justify-content: start;
}

.address-item {
  position: relative;
  border: 1px solid var(--c-medium-gray);
  border-radius: 1em;
  padding: 1em;
  box-shadow: 0 0.4em 0.6em var(--c-medium-gray);
}
</style>
