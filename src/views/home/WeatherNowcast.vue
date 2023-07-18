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
import { serverUrl } from '@/constants'
import { Coordinates } from '@/stores/place'
import { $t } from '@/translation'
import { onMounted, ref } from 'vue'

const props = defineProps<{ coordinates?: Coordinates }>()

const temp = ref(0)
const precipitation = ref(0)
const units = ref(null as any)
const responseCode = ref<boolean | null>(null)
const symbol = ref(null)

export type NowCastData = {
  temp: number
  precipitation: number
  units: string
  symbol: string
}

const getNowCastData = async (coordinates: Coordinates) => {
  const response = await fetch(
    `${serverUrl}/met/nowcast?lat=${coordinates.latitude}&lon=${coordinates.longitude}`
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
  }
}

onMounted(async () => {
  try {
    if (!props.coordinates) return
    const nowCastData = await getNowCastData(props.coordinates)
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
