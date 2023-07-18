<template>
  <h3 style="text-align: center">
    {{ selectedCategory.title }}
  </h3>
  <p>
    {{ selectedCategory.description }}
  </p>
  <div v-show="selectedCategory.category != 'falling-wind'">
    <div id="legendDiv"></div>
  </div>
  <div class="row center">
    <img
      v-if="selectedCategory.category == 'falling-wind'"
      :src="compassSvgSrc"
      alt="compass"
      width="140"
    />
  </div>
</template>

<script lang="ts" setup>
import { CategoryOption, mapObjects } from './map'
import { onMounted } from 'vue'
import Legend from '@arcgis/core/widgets/Legend'
import compassSvgSrc from '@/assets/compass.svg'

const props = defineProps<{
  selectedCategory: CategoryOption
}>()

onMounted(() => {
  if (!mapObjects.mapView) return
  new Legend({
    view: mapObjects.mapView,
    container: 'legendDiv',
    layerInfos: [
      {
        layer: mapObjects.mapView.map.layers.find(
          (m) => m.id == props.selectedCategory.layerId
        ),
      },
    ],
  })
})
</script>
