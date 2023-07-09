<template>
  <div v-if="!responseCode">
    <p>{{ $t().serverError }}</p>
  </div>
  <div v-if="responseCode" class="row center" style="width: 6em; gap: 0.5em">
    <span>{{ temp }}°</span>
    <img v-if="symbol" :src="`weatherSymbols/${symbol}.svg`" />
    <!-- <span>{{ units ? units.air_temperature : '' }}</span> -->
  </div>
</template>

<script lang="ts" setup>
import { $t } from '@/translation'
import { onMounted, ref } from 'vue'

const props = defineProps<{ lat?: number; lon?: number }>()

const temp = ref(0)
const precipitation = ref(0)
const units = ref(null as any)
const responseCode = ref(false)
const symbol = ref(null)

onMounted(async () => {
  try {
    const response = await fetch(
      `http://localhost:8000/met/nowcast?lat=${props.lat}&lon=${props.lon}`
    )
    if (response.ok) {
      responseCode.value = true
      const resJson = await response.json()
      temp.value =
        resJson.properties.timeseries[0].data.instant.details.air_temperature
      precipitation.value =
        resJson.properties.timeseries[0].data.next_1_hours.details.precipitation_amount
      units.value = resJson.properties.meta.units
      symbol.value =
        resJson.properties.timeseries[0].data.next_1_hours.summary.symbol_code
      console.log(symbol.value)
    }
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
