<template>
  <div v-if="!responseCode">
    <p> Can't connect to the server </p>
  </div>
  <div v-if="responseCode">
    <p>Temp:  {{ temp }} {{ units ? units.air_temperature : "" }}</p>
    <p>Precipitation {{ precipitation }} {{ units ? units.precipitation_amount : "" }}</p>
    <img v-if="symbol" :src="`weatherSymbols/${symbol}.svg`"/>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';



  const temp = ref(0)
  const precipitation = ref(0)
  const units = ref(null as any)
  const responseCode = ref(false)
  const symbol = ref(null)


  onMounted( () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/met/nowcast?lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
        console.log(response.ok)
        if (response.ok) {
          responseCode.value = true
          const resJson = await response.json()
          console.log(JSON.stringify(resJson))
          temp.value = resJson.properties.timeseries[0].data.instant.details.air_temperature
          precipitation.value = resJson.properties.timeseries[0].data.next_1_hours.details.precipitation_amount
          units.value = resJson.properties.meta.units
          symbol.value = resJson.properties.timeseries[0].data.next_1_hours.summary.symbol_code
          console.log(symbol.value)
        }
      } catch (error) {
        console.log("Error: ", error)
        responseCode.value = false
      }


    })
  })


</script>
