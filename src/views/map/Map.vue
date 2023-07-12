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
            zoomOut()
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
    :title="$t().category"
    hide-mode="hidden"
    :z-index="100"
    :middleSvh="50"
    :show="layersOpen"
    @show="layersOpen = true"
    @hide="layersOpen = false"
  >
    <div>
      <!-- <div id="layerListDiv"></div> -->
      <div class="layer-grid">
        <div
          v-for="layerOption in layerOptions"
          class="layer-item row center clickable"
          :class="{
            selected:
              selectedLayerOption.displayTitle == layerOption.displayTitle,
            disabled: layerOption.layerId == 'NotImplementedError',
          }"
          @click="() => selectLayerOption(layerOption)"
        >
          {{ layerOption.displayTitle }}
        </div>
      </div>
    </div>
  </SlideUpPane>
  <SlideUpPane
    :title="$t().mapInfo"
    hide-mode="hidden"
    :z-index="100"
    :middleSvh="50"
    :show="infoOpen"
    @show="infoOpen = true"
    @hide="infoOpen = false"
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

type LayerOption = {
  displayTitle: string
  layerId: string
}

const layerOptions: LayerOption[] = [
  {
    displayTitle: $t().torrentialRain,
    layerId: '1894a0de007-layer-22',
  },
  {
    displayTitle: $t().windSouth,
    layerId: '1894a266058-layer-27',
  },
  {
    displayTitle: $t().heatWave,
    layerId: 'NotImplementedError',
  },
  {
    displayTitle: $t().flood,
    layerId: '1894a08e10a-layer-21',
  },
  { displayTitle: $t().fire, layerId: 'NotImplementedError' },
  {
    displayTitle: $t().avalanche,
    layerId: 'NotImplementedError',
  },
]

const selectedLayerOption = ref(layerOptions[0])

const graphicsLayer = new GraphicsLayer()
const layersOpen = ref(false)
const infoOpen = ref(false)
const searchInputRef = ref<HTMLInputElement>()
const lastClicked = ref(
  props.places.findIndex((place) => place.address.point == props.center)
)
let mapView: MapView | null = null
let mapCenterPoint: Graphic | null = null
let goToTimeout: NodeJS.Timeout | undefined = undefined
let legend: Legend | null = null

onMounted(() => {
  const map = new WebMap({
    // basemap: 'osm-light-gray',
    portalItem: {
      // id: 'f02309ca204245dcb32ac3fbf652f248', // https://arcg.is/5SaqW
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

  mapView.on('click', (event) => {
    event.stopPropagation() // Disable default click handler
  })

  mapView.when(() => {
    if (!mapView) return
    // console.log(JSON.parse(JSON.stringify(map.layers)))
    drawGraphics()
    goToAndDrawCenter()
    selectLayerOption(layerOptions[0])

    new LayerList({
      view: mapView,
      container: 'layerListDiv',
    })

    legend = new Legend({
      view: mapView,
      container: 'legendDiv',
      layerInfos: [
        {
          layer: mapView.map.layers.find(
            (m) => m.id == selectedLayerOption.value.layerId
          ),
        },
      ],
    })
  })
})

const selectLayerOption = (layerOption: LayerOption) => {
  selectedLayerOption.value = layerOption
  if (!mapView) return
  layerOptions.forEach((option) => {
    if (!mapView) return
    const layer = mapView.map.findLayerById(option.layerId)
    if (layer) {
      layer.visible = false
    }
  })
  const layer = mapView.map.findLayerById(selectedLayerOption.value.layerId)
  if (layer) {
    layer.visible = true
  }
  if (legend) {
    legend.layerInfos = [{ layer }]
  }
}

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
  if ((mapView?.zoom ?? 0) < 10) {
    emit('select-place', place)
  } else {
    zoomOut()
    goToTimeout = setTimeout(
      () => emit('select-place', place),
      animationDuration
    )
  }
}

const zoomOut = () => {
  mapView?.goTo(
    {
      zoom: 2,
    },
    {
      animate: true,
      duration: animationDuration,
      easing: 'ease-in-out',
    }
  )
}

const goToAndDrawCenter = () => {
  if (!props.center || !mapView) return
  mapView.goTo(
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

const createEventGraphic = (point: AddressPoint, category: string) => {
  var warningIcon: string = './warningIcons/icon-warning-extrem-red.svg'
  if (category == 'flood') {
    warningIcon = './warningIcons/icon-warning-flood-red.svg'
  } else if (category == 'fire') {
    warningIcon = './warningIcons/icon-warning-forestfire-red.svg'
  } else if (category == 'torrentialRain') {
    warningIcon = './warningIcons/icon-warning-rainflood-red.svg'
  } else if (category == 'wind') {
    warningIcon = './warningIcons/icon-warning-wind-red.svg'
  } else if (category == 'avalanche') {
    warningIcon = './warningIcons/icon-warning-avalanches-red.svg'
  }

  return new Graphic({
    geometry: new Point(point),
    symbol: {
      // @ts-ignore
      type: 'picture-marker',
      url: warningIcon,
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

.place-selected {
  background-color: var(--c-dark-gray);
}

.layer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 1em;
  column-gap: 1em;
}

.layer-item {
  background-color: var(--c-light-gray);
  padding: 1em;
  border-radius: 0.5em;
  white-space: nowrap;
}
.layer-item.selected {
  background-color: var(--c-dark-gray);
}

div.disabled {
  color: var(--c-dark-gray);
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
