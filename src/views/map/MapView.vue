<template>
  <Map
    v-if="userStore.signedInToArcGis"
    :center="geoLocationStore.getMapCenter"
    :search-results="results"
    :places="placeStore.places"
    @select-place="placeStore.currentPlace = $event"
    @select-result="selectResultAndClear"
    @search="search"
    @search-blur="searchBlur"
  ></Map>
  <div v-else class="message-container">
    <br />
    <p>{{ $t().notSignedIn }}</p>
    <br />
    <button @click="signIn">{{ $t().signIn }}</button>
  </div>
  <SlideUpPane
    v-if="placeStore.currentPlace"
    :open="paneOpen"
    :title="placeStore.currentPlace.nickname"
    hide-mode="show-top"
    @toggle="paneOpen = !paneOpen"
  >
    <div class="col" style="gap: 1em">
      <EventList :point="placeStore.currentPlace.address?.point"></EventList>
    </div>
    <div v-if="placeStore.places.includes(placeStore.currentPlace)">
      <button
        v-if="placeStore.currentPlace != placeStore.places[0]"
        class="btn btn-icon"
        @click="deleteCurrentPlace"
      >
        <fa-icon icon="pencil"></fa-icon>
      </button>
    </div>
    <div v-else>
      <button @click="addCurrentPlace">
        {{ $t().add }}
      </button>
    </div>
  </SlideUpPane>
</template>

<script lang="ts" setup>
import Map from './Map.vue'
import SlideUpPane from '@/components/SlideUpPane.vue'
import { signIn, useUserStore } from '@/stores/userStore'
import { useGeolocationStore } from '@/stores/geolocationStore'
import { searchAddress, selectResult, usePlaceStore } from '@/stores/placeStore'
import { ref } from 'vue'
import { $t } from '@/translation'
import EventList from '../event/EventList.vue'

const paneOpen = ref(true)
const userStore = useUserStore()
const placeStore = usePlaceStore()
const geoLocationStore = useGeolocationStore()
const results = ref<Record<string, any>[]>([])

const selectResultAndClear = (result: Record<string, any>) => {
  const currentPlace = usePlaceStore().currentPlace
  if (!currentPlace) return
  usePlaceStore().currentPlace = selectResult(result)
  results.value = []
}

const search = (searchString: string) => {
  searchAddress({ street: searchString }, (r) => {
    if (r.length > 0) {
      results.value = r
    }
  })
}

const deleteCurrentPlace = () => {
  if (!placeStore.currentPlace) return
  placeStore.removePlace(placeStore.currentPlace)
}

const addCurrentPlace = () => {
  if (!placeStore.currentPlace) return
  placeStore.addPlace(placeStore.currentPlace)
}

const searchBlur = () => {
  setTimeout(() => (results.value = []), 100)
}
</script>

<style scoped>
.message-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.box {
  border: 1px solid var(--c-text);
  padding: 0em 1em;
  border-radius: 1em;
}
</style>
