<template>
  <div class="view">
    <form class="col">
      <label style="font-weight: bold">Add Place</label>
      <br />
      <label for="nickname">Nickname</label>
      <input type="text" id="nickname" v-model="place.nickname" />
      <br />
      <label>Street</label>
      <div class="row" style="gap: 1em">
        <input
          type="text"
          id="street-address"
          v-model="place.address.street"
          style="flex: 4"
        />
      </div>
      <br />
      <label>City</label>
      <div class="row" style="gap: 1em">
        <input
          type="number"
          id="postal-code"
          v-model="place.address.postalCode"
          style="flex: 1"
        />
        <input
          type="text"
          id="city"
          v-model="place.address.city"
          style="flex: 2"
        />
      </div>
    </form>
    <br />
    <br />
    <div class="row spaced">
      <button @click="router.back()">Back</button>
      <button @click="submit" :disabled="!place.nickname || !result">
        Submit
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as locator from '@arcgis/core/rest/locator'
import { Place, usePlaceStore } from '@/stores/placeStore'
import { ref, watch } from 'vue'
import { router } from '@/router'

const placeStore = usePlaceStore()
const result = ref<Record<string, any> | null>(null)
const place = ref<Place>({ nickname: '', address: {}, excludeDangers: [] })

watch(
  () => [
    place.value.address.city,
    place.value.address.street,
    place.value.address.postalCode,
  ],
  () => {
    search()
  }
)

const search = () => {
  const geoData =
    'https://services.geodataonline.no/arcgis/rest/services/Geosok/GeosokLokasjon2/GeocodeServer'

  const params = {
    address: {
      Adresse: place.value.address.street,
      Stedsnavn: '',
      Postnummer: place.value.address.postalCode,
      Poststed: place.value.address.city,
      Kommune: '',
    },
    maxLocations: 10,
  }
  locator.addressToLocations(geoData, params).then((results) => {
    result.value = results.find((r) => r.score == 100)?.toJSON().location
  })
}

const submit = () => {
  place.value.address.point = Object.assign(
    place.value.address.point ?? {},
    result.value
  )
  placeStore.addPlace(place.value)
  router.back()
}
</script>

<style>
input {
  min-width: 20px;
}
</style>
