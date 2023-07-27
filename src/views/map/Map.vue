<template>
  <div id="mapViewDiv"></div>
  <div
    v-if="useLoadingStore().mapIsLoading"
    class="overlay col center"
    style="height: 100%; background-color: #ffffffaa"
  >
    <LoadingSpinner></LoadingSpinner>
  </div>
  <div class="places-card overlay col clickthrough">
    <div class="row" style="padding: 1em; gap: 1em; overflow: auto">
      <button
        v-for="place in places"
        class="place-button btn-shadow"
        :class="{ 'place-selected': place == currentPlace }"
        @click="selectPlace(place)"
      >
        <div class="col">
          <fa-icon
            size="lg"
            :icon="place.icon"
            style="margin-bottom: 0.1em"
          ></fa-icon>
          {{ maxChars(place.nickname, 8) }}
        </div>
      </button>
    </div>
    <div class="col clickthrough" style="margin: 0 1em; gap: 0.6em">
      <div
        class="row clickthrough"
        :style="{
          'justify-content':
            currentPlace && !places.includes(currentPlace)
              ? 'space-between'
              : 'end',
        }"
      >
        <button
          v-if="currentPlace && !places.includes(currentPlace)"
          class="btn btn-shadow"
          style="background-color: var(--c-white); font-size: medium"
          @click="addCurrentPlace"
        >
          <fa-icon icon="plus"></fa-icon>
          <span>
            {{ $t().add }}
            {{ maxChars(currentPlace?.nickname ?? '', 14) }}
          </span>
        </button>
        <IconButton
          :icon="zoomPrev > 10 ? 'earth-americas' : 'location-dot'"
          class="btn-shadow"
          @click="
            () => {
              if (zoomPrev > 10) {
                zoomTo()
              } else {
                goToAndDrawCenter()
              }
            }
          "
        ></IconButton>
      </div>
      <div class="row clickthrough" style="justify-content: end">
        <IconButton
          icon="magnifying-glass"
          class="btn-shadow"
          @click="onSearch"
        ></IconButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import WebMap from '@arcgis/core/WebMap'
import MapView from '@arcgis/core/views/MapView'
import Graphic from '@arcgis/core/Graphic'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import Point from '@arcgis/core/geometry/Point'
import SearchModalContent from '@/components/SearchModalContent.vue'
import IconButton from '@/components/IconButton.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import MapClickInfo from '@/components/MapClickInfo.vue'
import { onMounted, ref, watch } from 'vue'
import { usePlaceStore } from '@/stores/placeStore'
import { Position, Place } from '@/scripts/place'
import { maxChars } from '@/scripts/string'
import { useModalStore } from '@/stores/modalStore'
import { $t } from '@/translation'
import { router } from '@/router'
import { useLoadingStore } from '@/stores/loadingStore'
import { AddressResult } from '@/scripts/search'
import { Category, Severity, getCategoryIconSrc } from '@/scripts/category'
import { ViewClickEvent, mapObjects } from '@/scripts/map'
import * as projection from '@arcgis/core/geometry/projection.js'

const props = defineProps<{
  center: Position | null
  searchResults: AddressResult[]
  places: Place[]
  currentPlace: Place | null
}>()

const emit = defineEmits<{
  (e: 'select-result', result: AddressResult): void
  (e: 'select-place', place: Place): void
  (e: 'search', searchString: string): void
  (e: 'search-blur'): void
  (e: 'click', event: ViewClickEvent): void
}>()

const graphicsLayer = new GraphicsLayer()
const zoomPrev = ref(15)
let mapCenterPoint: Graphic | null = null
let goToTimeout: NodeJS.Timeout | undefined = undefined

onMounted(() => {
  useLoadingStore().mapIsLoading = true

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
    constraints: {
      rotationEnabled: false,
    },
  })

  mapObjects.mapView.on('click', (event) => {
    event.stopPropagation() // Disable default click handler
    useLoadingStore().mapIsLoading = false
    mapObjects.mapView?.hitTest({ x: event.x, y: event.y }).then((response) => {
      if (!props.center) return
      const projectedMapPoint = projection.project(
        event.mapPoint,
        new Point(props.center).spatialReference
      ) as Point
      const modalProps = {
        metAlertsEvent: '',
        description: '',
        position: {
          latitude: projectedMapPoint.y,
          longitude: projectedMapPoint.x,
        },
      }
      useModalStore().push(MapClickInfo, modalProps, {})
      if (response.results.length) {
        var result = response.results.find((result) =>
          result.layer.title.includes('MetAlerts')
        )
        // @ts-ignore
        const event = result?.graphic?.attributes?.event
        if (event) {
          modalProps.metAlertsEvent = event
        }
      }
    })
    emit('click', event)
  })

  mapObjects.mapView.when(() => {
    if (!mapObjects.mapView) return
    // console.log(JSON.parse(JSON.stringify(map.layers)))
    drawGraphics()
    goToAndDrawCenter()
  })

  mapObjects.mapView.watch('updating', (isLoading) => {
    if (!isLoading) {
      useLoadingStore().mapIsLoading = false
    }
  })
  setTimeout(() => {
    useLoadingStore().mapIsLoading = false
  }, 5000) // max loading (because sometimes it doesn't stop?)
})

const addCurrentPlace = () => {
  if (!props.currentPlace) return
  usePlaceStore().addPlace(props.currentPlace)
  router.push({ name: 'edit-place' })
}

const onSearch = () => {
  useModalStore().push(
    SearchModalContent,
    {},
    {
      select: (place: Place) => {
        usePlaceStore().currentPlace = place
        useModalStore().pop()
      },
    }
  )
}

watch(
  () => props.center,
  () => {
    goToAndDrawCenter()
  }
)

watch(
  () => [props.places, props.currentPlace?.events],
  () => {
    drawGraphics()
  }
)

const animationDuration = 1000
const selectPlace = (place: Place) => {
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

const zoomTo = (zoom: number = 3) => {
  zoomPrev.value = zoom
  mapObjects.mapView?.goTo(
    {
      zoom: zoom,
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
  zoomPrev.value = 15
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
    if (!place.address.position || place.address.position == props.center)
      return
    const newPoint = createPointGraphic(place.address.position, '#1fe063')
    graphicsLayer.add(newPoint)
  })
  props.currentPlace?.events.forEach((event) => {
    const newPoint = createEventGraphic(event.position, event.category)
    graphicsLayer.add(newPoint)
  })
}

const createPointGraphic = (point: Position, color = '#2b95d6') => {
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

const createEventGraphic = (point: Position, category: Category) => {
  return new Graphic({
    geometry: new Point(point),
    symbol: {
      // @ts-ignore
      type: 'picture-marker',
      url: getCategoryIconSrc(category, Severity.Critical),
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

.places-card {
  pointer-events: none;
  touch-action: none;
  height: min-content;
  /* background-color: var(--c-white); */
  /* box-shadow: 0 0 2em #1f214456; */
  /* border-radius: 0 0 0.5em 0.5em; */
}

#street-address {
  border-radius: 2em;
  padding-left: 2em;
}

.place-button {
  white-space: nowrap;
  border: none;
  background-color: var(--c-white);
  color: var(--c-dark-gray);
  min-width: 7em;
  /* padding: 0.5em 0; */
}

.place-selected {
  color: var(--c-blue);
  /* background-color: var(--c-medium-gray); */
  /* outline: 2px solid var(--c-dark-gray); */
  /* transform: translateY(0.3em); */
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
