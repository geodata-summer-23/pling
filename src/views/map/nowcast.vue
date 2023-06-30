<template>
  <button @click="weatherFunction" id="weatherButton">Temp:</button>
</template>

<script lang="ts" setup>

  async function weatherFunction() {
    const response = await fetch('http://127.0.0.1:8000/met/nowcast?lat=59.9333&lon=10.7166')
    const resJson = await response.json()
    console.log(resJson)
  }


</script>