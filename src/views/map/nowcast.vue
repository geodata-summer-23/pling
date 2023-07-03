<template>
  <div>
    <p>Temp:  {{ temp }} {{ units ? units.air_temperature : "" }}</p>
    <p v-if="units">Precipitation {{ precipitation }} {{ units.precipitation_amount }}</p>

  </div>
  <button @click="weatherFunction" id="weatherButton">Get weather</button>
</template>

<script lang="ts" setup>
import { ref } from 'vue';



  const temp = ref(0)
  const precipitation = ref(0)
  const units = ref(null as any)

  async function weatherFunction() {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const response = await fetch(`http://127.0.0.1:8000/met/nowcast?lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
      const resJson = await response.json()
      console.log(JSON.stringify(resJson))
      temp.value = resJson.properties.timeseries[0].data.instant.details.air_temperature
      precipitation.value = resJson.properties.timeseries[0].data.next_1_hours.details.precipitation_amount
      units.value = resJson.properties.meta.units

      console.log(temp)
    })
    
  }


</script>
