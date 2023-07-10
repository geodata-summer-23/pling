<template>
  <div id="mapViewDiv"></div>
  <div class="overlay col">
    <input
      type="text"
      id="street-address"
      :placeholder="$t().searchAddress"
      style="margin: 1em 1em 0 1em"
      @input="(event) => {
        emit('search', (event.target as HTMLInputElement).value)
      }"
      @blur="emit('search-blur')"
    />
    <div>
      <div v-if="searchResults.length > 0" class="result-container col">
        <div
          v-for="result in searchResults"
          class="result"
          @click="emit('select-result', result)"
        >
          {{ result.address }}
        </div>
      </div>
    </div>
    <div class="places-row row" style="gap: 1em; overflow: auto">
      <button
        v-for="place in places"
        class="place-button"
        @click="emit('select-place', place)"
      >
        <div class="col">
          <fa-icon icon="house"></fa-icon>
          {{ maxChars(place.nickname, 8) }}
        </div>
      </button>
    </div>
    <div class="row" style="margin-right: 1em; justify-content: end">
      <button
        class="btn btn-icon btn-shadow"
        @click="
          () => {
            layersOpen = !layersOpen
            infoOpen = false
          }
        "
      >
        <fa-icon icon="layer-group"></fa-icon>
      </button>
    </div>
    <div class="row" style="margin-right: 1em; justify-content: end">
      <button
        class="btn btn-icon btn-shadow"
        @click="
          () => {
            infoOpen = !infoOpen
            layersOpen = false
          }
        "
      >
        <fa-icon icon="info"></fa-icon>
      </button>
    </div>
  </div>
  <SlideUpPane
    :open="layersOpen"
    hide-mode="hidden"
    @toggle="layersOpen = !layersOpen"
  >
    <div>
      <div id="layerListDiv"></div>
    </div>
  </SlideUpPane>
  <SlideUpPane
    :open="infoOpen"
    hide-mode="hidden"
    @toggle="infoOpen = !infoOpen"
  >
    <div>
      <div id="legendDiv"></div>
    </div>
  </SlideUpPane>
</template>

<script lang="ts" setup>
import WebMap from '@arcgis/core/WebMap'
import MapView from '@arcgis/core/views/MapView'
import Graphic from '@arcgis/core/Graphic'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import Point from '@arcgis/core/geometry/Point'
// import Search from '@arcgis/core/widgets/Search'
import LayerList from '@arcgis/core/widgets/LayerList'
import SlideUpPane from '@/components/SlideUpPane.vue'
import Legend from '@arcgis/core/widgets/Legend'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { AddressPoint, Place } from '@/stores/placeStore'
import { $t } from '@/translation'

const props = defineProps<{
  center: AddressPoint | null
  searchResults: Record<string, any>[]
  places: Place[]
}>()

const emit = defineEmits<{
  (e: 'select-result', result: Record<string, any>): void
  (e: 'select-place', place: Place): void
  (e: 'search', searchString: string): void
  (e: 'search-blur'): void
}>()

const graphicsLayer = new GraphicsLayer()
const layersOpen = ref(false)
const infoOpen = ref(false)
let mapView: MapView | null = null
let mapCenterPoint: Graphic | null = null
let watchPositionReference: number | null = null

const maxChars = (text: string, n: number) => {
  return text.length > n + 2 ? text.slice(0, n) + '..' : text
}

const createPointGraphic = (point: AddressPoint, color = '#2b95d6') => {
  const simpleMarkerSymbol = {
    type: 'simple-marker',
    color, // Orange
    outline: {
      color: [255, 255, 255], // White
      width: 1,
    },
  }
  const pointGraphic = new Graphic({
    geometry: new Point(point),
    symbol: simpleMarkerSymbol,
  })
  return pointGraphic
}

onMounted(() => {
  const map = new WebMap({
    portalItem: {
      id: 'b139409c28884967a1a603695e0b478d', // https://arcg.is/1mTnbH
    },
  })
  map.add(graphicsLayer)

  const view = new MapView({
    map: map,
    container: 'mapViewDiv',
    center: [11, 60],
    zoom: 16,
  })
  mapView = view

  // const search = new Search({
  //   view: view,
  // })
  // view.ui.add(search, 'top-right')

  view.when(() => {
    new LayerList({
      view: view,
      container: 'layerListDiv',
    })

    new Legend({
      view: view,
      container: 'legendDiv',
      layerInfos: [
        {
          layer: view.map.layers.find((m) => m.title == 'Utsatte bygninger'),
        },
      ],
    })
  })

  view.when(() => {
    props.places.forEach((place) => {
      if (!place.address.point || place.address.point == props.center) return
      const newPoint = createPointGraphic(place.address.point, '#1fe063')
      graphicsLayer.add(newPoint)
    })
    if (props.center) {
      view.goTo({
        center: new Point(props.center),
        zoom: 16,
      })
      const newPoint = createPointGraphic(props.center)
      graphicsLayer.add(newPoint)
      mapCenterPoint = newPoint
    }
  })
})

onUnmounted(() => {
  if (watchPositionReference) {
    navigator.geolocation.clearWatch(watchPositionReference)
  }
})

watch(
  () => props.center,
  () => {
    if (!props.center || !mapView) return
    mapView.when(() => {
      if (!props.center || !mapView) return
      mapView.goTo({
        center: new Point(props.center),
        zoom: 16,
      })
    })
    if (mapCenterPoint) {
      mapCenterPoint.geometry = new Point(props.center)
    } else {
      const newPoint = createPointGraphic(props.center)
      graphicsLayer.add(newPoint)
      mapCenterPoint = newPoint
    }
  }
)
</script>

<style>
#mapViewDiv {
  height: 100%;
  margin: 0;
}

.overlay {
  position: absolute;
  pointer-events: none;
  touch-action: none;
  width: 100%;
  height: 100%;
  gap: 0.6em;
}

.overlay > * {
  pointer-events: all;
  touch-action: all;
}

.esri-zoom {
  display: none;
}

#street-address {
  border-radius: 2em;
  padding-left: 2em;
}

.place-button {
  white-space: nowrap;
  border: none;
  background-color: var(--c-light-gray);
}

.places-row {
  /* -webkit-mask-image: linear-gradient(to right, black 90%, transparent 100%); */
  /* mask-image: linear-gradient(to right, black 90%, transparent 100%); */
}
</style>
