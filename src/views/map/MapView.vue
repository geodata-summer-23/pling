<template>
  <Map
    v-if="userStore.signedInToArcGis"
    :center="geoLocationStore.getMapCenter"
    :search-results="results"
    :places="placeStore.places"
    :events="useEventStore().events"
    @select-place="selectPlace"
    @select-result="selectResultAndClear"
    @search="search"
    @search-blur="searchBlur"
  ></Map>
  <div v-else class="message-container">
    <br />
    <p>{{ $t().notSignedIn }}</p>
    <br />
    <button class="btn" @click="signIn">{{ $t().signIn }}</button>
  </div>
  <SlideUpPane
    v-if="placeStore.currentPlace"
    :title="placeStore.currentPlace.nickname"
    hide-mode="show-top"
    :show="paneOpen"
    @show="paneOpen = true"
    @hide="paneOpen = false"
  >
    <template v-slot:top-left>
      <img
        v-for="icon in warningIcons"
        :src="icon"
        alt=""
        width="40"
        style="margin-left: -1.5em"
      />
    </template>
    <div class="col" style="gap: 1em">
      <p>
        Oppsummering av varsler... alksjd a slødkjaslkdj als dalks jdlkasjdlkajs
        d asløkdjlask jd
      </p>
      <EventList :point="placeStore.currentPlace.address?.point"></EventList>
      <div
        v-if="placeStore.places.includes(placeStore.currentPlace)"
        class="row center"
      >
        <button
          v-if="placeStore.currentPlace != placeStore.places[0]"
          class="btn"
          @click="editCurrentPlace"
        >
          <fa-icon icon="pencil"></fa-icon>
          <span> {{ $t().edit }} {{ $t().thisPlace }}</span>
        </button>
      </div>
      <div v-else class="row center">
        <button class="btn" @click="addCurrentPlace">
          <fa-icon icon="house"></fa-icon>
          <span>{{ $t().add }} {{ $t().thisPlace }}</span>
        </button>
      </div>
    </div>
  </SlideUpPane>
</template>

<script lang="ts" setup>
import Map from './Map.vue'
import SlideUpPane from '@/components/SlideUpPane.vue'
import EventList from '../event/EventList.vue'
import { signIn, useUserStore } from '@/stores/userStore'
import { useGeolocationStore } from '@/stores/geolocationStore'
import {
  Place,
  searchAddress,
  selectResult,
  usePlaceStore,
} from '@/stores/placeStore'
import { computed, onActivated, ref } from 'vue'
import { $t } from '@/translation'
import { router } from '@/router'
import { useEventStore } from '@/stores/eventStore'
import { getCategoryIconSrc } from '@/stores/eventStore'

const paneOpen = ref(true)
const userStore = useUserStore()
const placeStore = usePlaceStore()
const eventStore = useEventStore()
const geoLocationStore = useGeolocationStore()
const results = ref<Record<string, any>[]>([])

const warningIcons = computed(() =>
  eventStore.events.map((e) => getCategoryIconSrc(e.category))
)

onActivated(() => {
  paneOpen.value = true
})

const selectPlace = (place: Place) => {
  placeStore.currentPlace = place
  // Trigger watch
  placeStore.currentPlace.address.point = {
    ...placeStore.currentPlace.address.point,
  }
}

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

const editCurrentPlace = () => {
  if (!placeStore.currentPlace) return
  router.push({ name: 'edit-place' })
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
