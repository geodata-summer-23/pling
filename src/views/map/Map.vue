<template>
  <div id="mapViewDiv"></div>
  <div class="overlay col clickthrough">
    <input
      type="text"
      ref="searchInputRef"
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
          @click="
            () => {
              emit('select-result', result)
              if (searchInputRef) {
                searchInputRef.value = ''
              }
            }
          "
        >
          {{ result.address }}
        </div>
      </div>
    </div>
    <div class="row" style="margin-left: 1em; gap: 1em; overflow: auto">
      <button
        class="place-button"
        :class="{ 'place-selected': lastClicked == -1 }"
        @click="
          () => {
            lastClicked = -1
            zoomTo()
          }
        "
      >
        <div class="col">
          <fa-icon icon="earth-americas"></fa-icon>
          World
        </div>
      </button>
      <button
        v-for="(place, i) in places"
        class="place-button"
        :class="{ 'place-selected': lastClicked == i }"
        @click="selectPlace(place)"
      >
        <div class="col">
          <fa-icon :icon="place.icon"></fa-icon>
          {{ maxChars(place.nickname, 8) }}
        </div>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import WebMap from '@arcgis/core/WebMap'
import MapView from '@arcgis/core/views/MapView'
import Graphic from '@arcgis/core/Graphic'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import Point from '@arcgis/core/geometry/Point'
import { onMounted, ref, watch } from 'vue'
import { AddressPoint, Place } from '@/stores/placeStore'
import { $t } from '@/translation'
import { maxChars } from '@/utils'
import {
  AlertData,
  CategoryState,
  getCategoryIconSrc,
} from '@/stores/eventStore'
import { mapObjects } from './map'

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
const searchInputRef = ref<HTMLInputElement>()
const lastClicked = ref(
  props.places.findIndex((place) => place.address.point == props.center)
)
let mapCenterPoint: Graphic | null = null
let goToTimeout: NodeJS.Timeout | undefined = undefined

onMounted(() => {
  const map = new WebMap({
    // basemap: 'osm-light-gray',
    portalItem: {
      id: 'b139409c28884967a1a603695e0b478d', // https://arcg.is/1mTnbH
    },
  })
  map.add(graphicsLayer)

  mapObjects.mapView = new MapView({
    map: map,
    container: 'mapViewDiv',
    center: [11, 60],
    zoom: 15,
  })

  mapObjects.mapView.on('click', (event) => {
    event.stopPropagation() // Disable default click handler
  })

  mapObjects.mapView.when(() => {
    if (!mapObjects.mapView) return
    // console.log(JSON.parse(JSON.stringify(map.layers)))
    drawGraphics()
    goToAndDrawCenter()
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

const animationDuration = 1000
const selectPlace = (place: Place) => {
  lastClicked.value = props.places.indexOf(place)
  if (goToTimeout) {
    clearInterval(goToTimeout)
    goToTimeout = undefined
  }
  if ((mapObjects.mapView?.zoom ?? 0) < 10) {
    emit('select-place', place)
  } else {
    zoomTo(5)
    goToTimeout = setTimeout(
      () => emit('select-place', place),
      animationDuration
    )
  }
}

const zoomTo = (zoom: number = 2) => {
  mapObjects.mapView?.goTo(
    {
      zoom,
    },
    {
      animate: true,
      duration: animationDuration,
      easing: 'ease-in-out',
    }
  )
}

const goToAndDrawCenter = () => {
  if (!props.center || !mapObjects.mapView) return
  mapObjects.mapView.goTo(
    {
      center: new Point(props.center),
      zoom: 15,
    },
    {
      animate: true,
      duration: animationDuration,
      easing: 'ease-in-out',
    }
  )
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
    const newPoint = createEventGraphic(event.position, event.category)
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

const createEventGraphic = (point: AddressPoint, category: CategoryState) => {
  return new Graphic({
    geometry: new Point(point),
    symbol: {
      // @ts-ignore
      type: 'picture-marker',
      url: getCategoryIconSrc(category),
      width: '35px',
      height: '35px',
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
  pointer-events: none;
  touch-action: none;
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

.place-selected {
  background-color: var(--c-dark-gray);
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
./map
