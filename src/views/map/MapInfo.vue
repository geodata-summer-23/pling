<template>
  <h3 style="text-align: center">
    {{ selectedCategory.displayTitle }}
  </h3>
  <p>
    {{ selectedCategory.description }}
  </p>
  <div>
    <div id="legendDiv"></div>
  </div>
</template>

<script lang="ts" setup>
import { CategoryOption, mapObjects } from './map'
import { onMounted } from 'vue'
import Legend from '@arcgis/core/widgets/Legend'

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
./map
