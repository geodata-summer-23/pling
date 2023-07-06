<template>
  <div class="view col">
    <BackButton @click="router.push({ name: 'home' })"></BackButton>
    <h2>Add Place</h2>
    <label for="nickname">Nickname</label>
    <input type="text" id="nickname" v-model="place.nickname" />
    <br />
    <label>Street</label>
    <input
      type="text"
      id="street-address"
      :value="place.address.street"
      @input="place.address.street = ($event.target as HTMLInputElement).value"
      style="flex: 4"
    />
    <div
      v-if="!selectedResult && results.length > 0"
      class="result-container col"
    >
      <div
        v-for="result in results"
        class="result"
        @click="selectResult(result)"
      >
        {{ result.address }}
      </div>
    </div>
    <br />
    <label>City</label>
    <div class="row" style="gap: 1em">
      <input
        type="number"
        id="postal-code"
        :value="place.address.postalCode"
        @input="
          place.address.postalCode = (
            $event.target as HTMLInputElement
          ).valueAsNumber
        "
        style="flex: 1"
      />
      <input
        type="text"
        id="city"
        :value="place.address.city"
        @input="place.address.city = ($event.target as HTMLInputElement).value"
        style="flex: 2"
      />
    </div>

    <div class="view-bottom col">
      <button
        class="btn"
        :disabled="!place.nickname || !selectedResult"
        @click="submit"
      >
        Submit
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BackButton from '@/components/BackButton.vue'
import * as locator from '@arcgis/core/rest/locator'
import { Place, usePlaceStore } from '@/stores/placeStore'
import { ref, watch } from 'vue'
import { router } from '@/router'

const placeStore = usePlaceStore()
const selectedResult = ref<Record<string, any> | null>(null)
const results = ref<Record<string, any>[]>([])
const place = ref<Place>({ nickname: '', address: {}, excludeDangers: [] })

const search = () => {
  const geoData =
    'https://services.geodataonline.no/arcgis/rest/services/Geosok/GeosokLokasjon2/GeocodeServer'

  const params = {
    address: {
      Adresse: place.value.address.street,
      // Stedsnavn: '',
      Postnummer: place.value.address.postalCode,
      Poststed: place.value.address.city,
      // Kommune: '',
    },
    maxLocations: 10,
  }
  locator.addressToLocations(geoData, params).then((candidates) => {
    results.value = candidates
      .sort((a, b) => b.score - a.score)
      .map((r) => r.toJSON())
  })
}

watch(
  () => [
    place.value.address.city,
    place.value.address.street,
    place.value.address.postalCode,
  ],
  () => {
    search()
  },
  { immediate: true }
)

const selectResult = (result: Record<string, any>) => {
  selectedResult.value = result
  const [streetAddress, postalCodeAndCity] = result.address.split(',')
  place.value.address.street = streetAddress
  if (postalCodeAndCity) {
    const [postalCode, city] = postalCodeAndCity.trim().split(' ')
    place.value.address.postalCode = parseInt(postalCode)
    place.value.address.city = city
  }
  results.value = []
}

const submit = () => {
  place.value.address.point = Object.assign(
    place.value.address.point ?? {},
    selectedResult.value?.location
  )
  placeStore.addPlace(place.value)
  router.push({ name: 'home' })
}
</script>

<style scoped>
input {
  min-width: 20px;
}

.result-container {
  background-color: #f3f3f3;
}

.result {
  padding: 0.5em 1.5em;
  cursor: pointer;
}

.result:hover {
  background-color: lightblue;
  cursor: pointer;
}
</style>
