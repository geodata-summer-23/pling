<template>
  <Map
    v-if="userStore.signedInToArcGis"
    :center="geoLocationStore.getMapCenter"
    :search-results="results"
    :places="placeStore.places"
    :current-place="placeStore.currentPlace"
    @select-place="selectPlace"
    @select-result="selectResultAndClear"
    @search="search"
    @search-blur="searchBlur"
    @click="paneOpen = false"
  ></Map>
  <div v-else class="message-container">
    <br />
    <p>{{ $t().notSignedIn }}</p>
    <br />
    <button class="btn" @click="signIn">{{ $t().signIn }}</button>
  </div>
  <SlideUpPane
    v-if="placeStore.currentPlace"
    title="Varsler"
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
            selectedCategory.title
          }}</span>
          <fa-icon icon="layer-group"></fa-icon>
        </button>
        <IconButton
          icon="info"
          class="btn-shadow"
          @click="onInfoModal"
        ></IconButton>
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
      <p style="margin: 0em 2em">
        Oppsummering av varsler... alksjd a slødkjaslkdj als dalks jdlkasjdlkajs
        d asløkdjlask jd
      </p>
      <EventList
        :place="placeStore.currentPlace"
        @select-category="
          (category) => {
            const option = getCategoryOptions().find(
              (option) => option.category == category
            )
            if (option) {
              selectCategoryOption(option)
            }
          }
        "
      ></EventList>
    </div>
  </SlideUpPane>
</template>

<script lang="ts" setup>
import Map from './Map.vue'
import SlideUpPane from '@/components/SlideUpPane.vue'
import EventList from '../event/EventList.vue'
import { signIn, useUserStore } from '@/stores/userStore'
import { useGeolocationStore } from '@/stores/geolocationStore'
import { Place } from '@/scripts/place'
import { AddressResult, searchAddress, selectResult } from '@/scripts/search'
import { computed, onActivated, onMounted, ref } from 'vue'
import { $t } from '@/translation'
import { useModalStore } from '@/stores/modalStore'
import CategoriesSelect from './CategoriesSelect.vue'
import MapInfo from './MapInfo.vue'
import IconButton from '@/components/IconButton.vue'
import { usePlaceStore } from '@/stores/placeStore'
import {
  CategoryOption,
  getCategoryIconSrc,
  getCategoryOptions,
} from '@/scripts/category'
import { mapObjects } from '@/scripts/map'

const paneOpen = ref(true)
const userStore = useUserStore()
const placeStore = usePlaceStore()
const geoLocationStore = useGeolocationStore()
const results = ref<AddressResult[]>([])

const warningIcons = computed(() =>
  placeStore.currentPlace?.events.map((e) => getCategoryIconSrc(e.category))
)

onActivated(() => {
  paneOpen.value = true
})

const selectPlace = (place: Place) => {
  placeStore.currentPlace = place
  // Trigger watch
  placeStore.currentPlace.address.position = {
    ...placeStore.currentPlace.address.position,
  }
}

const selectResultAndClear = (result: AddressResult) => {
  const currentPlace = usePlaceStore().currentPlace
  if (!currentPlace) return
  usePlaceStore().currentPlace = selectResult(result)
  results.value = []
}

const search = (searchString: string) => {
  searchAddress({ street: searchString, position: {} }, (r) => {
    if (r.length > 0) {
      results.value = r
    }
  })
}

const searchBlur = () => {
  setTimeout(() => (results.value = []), 100)
}

const onCategoryModal = () => {
  useModalStore().push(
    CategoriesSelect,
    { selectedCategory: selectedCategory.value },
    {
      'select-category': (categoryOption: CategoryOption) => {
        selectCategoryOption(categoryOption)
        paneOpen.value = false
      },
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
