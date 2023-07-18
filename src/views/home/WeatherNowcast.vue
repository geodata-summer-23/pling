<template>
  <div v-if="responseCode === false">
    <p>{{ $t().serverError }}</p>
  </div>
  <div v-if="responseCode === null">
    <LoadingSpinner :scale="0.5"></LoadingSpinner>
  </div>
  <div v-if="responseCode" class="row center" style="width: 6em; gap: 0.5em">
    <span>{{ temp }}°</span>
    <img v-if="symbol" :src="`./weatherIcons/${symbol}.svg`" />
    <!-- <span>{{ units ? units.air_temperature : '' }}</span> -->
  </div>
</template>

<script lang="ts" setup>
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { serverUrl } from '@/scripts/url'
import { Position } from '@/scripts/place'
import { $t } from '@/translation'
import { onMounted, ref } from 'vue'
import { NowcastData } from '@/scripts/alert'

const props = defineProps<{ position?: Position }>()

const temp = ref(0)
const precipitation = ref(0)
const units = ref(null as any)
const responseCode = ref<boolean | null>(null)
const symbol = ref(null)

const getNowCastData = async (position: Position) => {
  const response = await fetch(
    `${serverUrl}/met/nowcast?lat=${position.latitude}&lon=${position.longitude}`
  )
  const resJson = await response.json()
  return {
    temp: resJson.properties.timeseries[0].data.instant.details.air_temperature,
    precipitation:
      resJson.properties.timeseries[0].data.next_1_hours.details
        .precipitation_amount,
    units: resJson.properties.meta.units,
    symbol:
      resJson.properties.timeseries[0].data.next_1_hours.summary.symbol_code,
  } satisfies NowcastData
}

onMounted(async () => {
  try {
    if (!props.position) return
    const nowCastData = await getNowCastData(props.position)
    temp.value = nowCastData.temp
    precipitation.value = nowCastData.precipitation
    units.value = nowCastData.units
    symbol.value = nowCastData.symbol
    responseCode.value = true
  } catch (error) {
    console.error(error)
    responseCode.value = false
  }
})
</script>

<style scoped>
img {
  max-width: 4em;
}
</style>
