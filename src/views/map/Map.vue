<template>
  <div id="mapViewDiv"></div>
  <div class="overlay col clickthrough">
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
    <div
      class="row clickthrough"
      style="margin-left: 1em; gap: 1em; overflow: auto"
    >
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
    <div
      class="row clickthrough"
      style="margin-right: 1em; justify-content: end"
    >
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
    <div
      class="row clickthrough"
      style="margin-right: 1em; justify-content: end"
    >
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
    :z-index="100"
    @toggle="layersOpen = !layersOpen"
  >
    <div>
      <div id="layerListDiv"></div>
    </div>
  </SlideUpPane>
  <SlideUpPane
    :open="infoOpen"
    hide-mode="hidden"
    :z-index="100"
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
import LayerList from '@arcgis/core/widgets/LayerList'
import SlideUpPane from '@/components/SlideUpPane.vue'
import Legend from '@arcgis/core/widgets/Legend'
import { onMounted, ref, watch } from 'vue'
import { AddressPoint, Place } from '@/stores/placeStore'
import { $t } from '@/translation'
import { maxChars } from '@/utils'
import { AlertData } from '@/stores/eventStore'

const props = defineProps<{
  center: AddressPoint | null
  searchResults: Record<string, any>[]
  places: Place[]
  events: AlertData[]
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

onMounted(() => {
  const map = new WebMap({
    // basemap: 'osm-light-gray',
    portalItem: {
      id: 'b139409c28884967a1a603695e0b478d', // https://arcg.is/1mTnbH
    },
  })
  map.add(graphicsLayer)

  mapView = new MapView({
    map: map,
    container: 'mapViewDiv',
    center: [11, 60],
    zoom: 15,
  })

  mapView.when(() => {
    if (!mapView) return
    drawGraphics()
    goToAndDrawCenter()

    new LayerList({
      view: mapView,
      container: 'layerListDiv',
    })

    new Legend({
      view: mapView,
      container: 'legendDiv',
      layerInfos: [
        {
          layer: mapView.map.layers.find((m) => m.title == 'Utsatte bygninger'),
        },
      ],
    })
  })
})

watch(
  () => props.center,
  () => {
    goToAndDrawCenter()
  }
)

watch(
  () => [props.places, props.events],
  () => {
    drawGraphics()
  }
)

const goToAndDrawCenter = () => {
  if (!props.center || !mapView) return
  mapView.goTo({
    center: new Point(props.center),
    zoom: 15,
  })
  if (mapCenterPoint) {
    mapCenterPoint.geometry = new Point(props.center)
  } else {
    const newPoint = createPointGraphic(props.center)
    graphicsLayer.add(newPoint)
    mapCenterPoint = newPoint
  }
}

const drawGraphics = () => {
  graphicsLayer.removeAll()
  if (mapCenterPoint) {
    graphicsLayer.add(mapCenterPoint)
  }
  props.places.forEach((place) => {
    if (!place.address.point || place.address.point == props.center) return
    const newPoint = createPointGraphic(place.address.point, '#1fe063')
    graphicsLayer.add(newPoint)
  })
  props.events.forEach((event) => {
    const newPoint = createEventGraphic(event.position)
    graphicsLayer.add(newPoint)
  })
}

const createPointGraphic = (point: AddressPoint, color = '#2b95d6') => {
  return new Graphic({
    geometry: new Point(point),
    symbol: {
      // @ts-ignore
      type: 'simple-marker',
      color,
      outline: {
        color: '#ffffff',
        width: 1,
      },
    },
  })
}

const createEventGraphic = (point: AddressPoint) => {
  return new Graphic({
    geometry: new Point(point),
    symbol: {
      // @ts-ignore
      type: 'picture-marker',
      url: './warningIcons/icon-warning-extreme.svg',
      width: '64px',
      height: '64px',
    },
  })
}
</script>

<style scoped>
#mapViewDiv {
  height: 100%;
  margin: 0;
}

.overlay {
  position: absolute;
  pointer-events: none;
  touch-action: none;
  width: 100%;
  height: min-content;
  gap: 0.6em;
  background: linear-gradient(
    rgba(15, 15, 50, 0.3) 0%,
    rgba(15, 15, 50, 0.2) 40%,
    rgba(255, 255, 255, 0) 80%
  );
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
</style>

<style>
.esri-zoom {
  display: none;
}

.esri-view .esri-view-surface--touch-none:focus::after {
  outline: none !important;
}
</style>
