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
    <template v-slot:above>
      <div
        class="row clickthrough"
        style="margin: 0em 1em 1em 0em; justify-content: end; gap: 0.5em"
      >
        <button
          class="btn btn-icon btn-shadow"
          style="background-color: var(--c-white)"
          @click="onCategoryModal"
        >
          <span style="font-size: medium; padding-right: 0.2em">{{
            selectedCategory.displayTitle
          }}</span>
          <fa-icon icon="layer-group"></fa-icon>
        </button>
        <button
          class="btn btn-icon btn-shadow"
          style="background-color: var(--c-white)"
          @click="onInfoModal"
        >
          <fa-icon icon="info"></fa-icon>
        </button>
      </div>
    </template>
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
import { computed, onActivated, onMounted, ref } from 'vue'
import { $t } from '@/translation'
import { router } from '@/router'
import { useEventStore } from '@/stores/eventStore'
import { getCategoryIconSrc } from '@/stores/eventStore'
import { useModalStore } from '@/stores/modalStore'
import CategoriesSelect from './CategoriesSelect.vue'
import MapInfo from './MapInfo.vue'
import { CategoryOption, getCategoryOptions, mapObjects } from './map'

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

const onCategoryModal = () => {
  useModalStore().push(
    CategoriesSelect,
    { selectedCategory: selectedCategory.value },
    {
      'select-category': selectCategoryOption,
    }
  )
}

const onInfoModal = () => {
  useModalStore().push(
    MapInfo,
    { selectedCategory: selectedCategory.value },
    {}
  )
}

const selectedCategory = ref(getCategoryOptions()[0])

const selectCategoryOption = (categoryOption: CategoryOption) => {
  selectedCategory.value = categoryOption
  if (!mapObjects.mapView) return
  getCategoryOptions().forEach((option) => {
    if (!mapObjects.mapView) return
    const layer = mapObjects.mapView.map.findLayerById(option.layerId)
    if (layer) {
      layer.visible = false
    }
  })
  const layer = mapObjects.mapView.map.findLayerById(
    selectedCategory.value.layerId
  )
  if (layer) {
    layer.visible = true
  }
}

onMounted(() => {
  mapObjects.mapView?.when(() => {
    selectCategoryOption(getCategoryOptions()[0])
  })
})
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
