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
    :title="$t().alerts"
    hide-mode="show-top"
    :show="paneOpen"
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
          :class="{ 'vertical-shake': isShakingInfoButton, 'btn-shadow': true }"
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
        style="margin-left: -1em"
      />
      <LoadingSpinner
        v-if="placeStore.currentPlace.status == 'loading'"
        :scale="0.5"
      ></LoadingSpinner>
    </template>
    <div
      v-if="placeStore.currentPlace.alertSummary.length > 0"
      style="margin: 1em 2em"
    >
      <p style="font-size: 11pt">
        {{ placeStore.currentPlace.alertSummary }}
      </p>
    </div>
    <hr style="border: 1px solid var(--c-medium-gray); margin: 1em 0" />
    <AlertList
      :place="placeStore.currentPlace"
      @select-category="
        (category) => {
          const option = getCategoryOptions().find(
            (option) => option.category == category
          )
          if (option) {
            selectCategoryOption(option)
            shakeInfoButton()
          }
        }
      "
    ></AlertList>
    <div v-if="placeStore.currentPlace.status == 'failed'" class="row center">
      <button
        class="btn"
        @click="
          () => {
            if (!placeStore.currentPlace) return
            placeStore.currentPlace.alertSummary = ''
            placeStore.currentPlace.alerts = []
            updatePlace(placeStore.currentPlace, { force: true })
          }
        "
      >
        {{ $t().tryAgain }}
      </button>
    </div>
  </SlideUpPane>
</template>

<script lang="ts" setup>
import Map from './Map.vue'
import SlideUpPane from '@/components/SlideUpPane.vue'
import { signIn, useUserStore } from '@/stores/userStore'
import { useGeolocationStore } from '@/stores/geolocationStore'
import { Place } from '@/scripts/place'
import { AddressResult, searchAddress, selectResult } from '@/scripts/search'
import { computed, onActivated, onMounted, ref, watch } from 'vue'
import { $t } from '@/translation'
import { useModalStore } from '@/stores/modalStore'
import CategorySelect from './CategorySelect.vue'
import MapInfo from './MapInfo.vue'
import IconButton from '@/components/IconButton.vue'
import { usePlaceStore, updatePlace } from '@/stores/placeStore'
import {
  CategoryOption,
  getCategoryIconSrc,
  getCategoryOptions,
} from '@/scripts/category'
import { mapObjects } from '@/scripts/map'
import AlertList from './AlertList.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const paneOpen = ref(true)
const userStore = useUserStore()
const placeStore = usePlaceStore()
const geoLocationStore = useGeolocationStore()
const results = ref<AddressResult[]>([])
const isShakingInfoButton = ref(false)
let infoButtonTimeout: NodeJS.Timeout | undefined = undefined

const shakeInfoButton = () => {
  isShakingInfoButton.value = true
  if (infoButtonTimeout) {
    clearInterval(infoButtonTimeout)
    infoButtonTimeout = undefined
  }
  infoButtonTimeout = setTimeout(() => {
    isShakingInfoButton.value = false
  }, 2000)
}

const warningIcons = computed(() =>
  placeStore.currentPlace?.alerts.map((alert) =>
    getCategoryIconSrc(alert.category, alert.severity)
  )
)

onActivated(() => {
  paneOpen.value = true
})

onMounted(() => {
  mapObjects.mapView?.when(() => {
    selectCategoryOption(getCategoryOptions()[0])
  })
})

const selectPlace = (place: Place) => {
  placeStore.currentPlace = place
  // Trigger watch
  placeStore.currentPlace.address.position = {
    ...placeStore.currentPlace.address.position,
  }
  updatePlace(place, {})
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
    CategorySelect,
    { selectedCategory: selectedCategory.value },
    {
      'select-category': (categoryOption: CategoryOption) => {
        selectCategoryOption(categoryOption)
        shakeInfoButton()
        paneOpen.value = false
      },
    }
  )
}

const onInfoModal = () => {
  useModalStore().push(MapInfo, { category: selectedCategory.value }, {})
}

const selectedCategory = ref(getCategoryOptions()[0])

const selectCategoryOption = (categoryOption: CategoryOption) => {
  selectedCategory.value = categoryOption
  if (!mapObjects.mapView) return

  const metAlertsId = '18925333e9d-layer-14'
  const metAlertsLayer = mapObjects.mapView.map.findLayerById(metAlertsId)
  if (metAlertsLayer) {
    metAlertsLayer.visible = true
  }
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

watch(
  () => placeStore.currentPlace?.status,
  (status) => {
    if (status && status != 'unknown') {
      paneOpen.value = true
    }
  }
)
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
