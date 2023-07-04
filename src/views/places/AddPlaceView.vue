<template>
  <div class="view">
    <div class="col">
      <label style="font-weight: bold">Add Place</label>
      <br />
      <label for="nickname">Nickname</label>
      <input type="nickname" v-model="place.name" />
      <br />
      <label>Address Search</label>
      <SearchBar
        placeholder="+ Add place"
        :results="searchResults"
        @input="search"
        @select="select"
      ></SearchBar>
      <label>Address: {{ place.address }}</label>
      <br />
    </div>
    <div class="row spaced">
      <button @click="router.back()">Back</button>
      <button @click="submit">Submit</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SearchBar, { SearchResult } from '@/components/SearchBar.vue'
import * as locator from '@arcgis/core/rest/locator'
import { Place, usePlaceStore } from '@/stores/placeStore'
import { ref } from 'vue'
import { router } from '@/router'

const placeStore = usePlaceStore()
const searchResults = ref<SearchResult[]>([])
const place = ref<Place>({ name: '', address: {}, excludeDangers: [] })

const search = (searchString: string) => {
  const geoData =
    'https://services.geodataonline.no/arcgis/rest/services/Geosok/GeosokLokasjon2/GeocodeServer'

  const params = {
    address: { Adresse: searchString },
    maxLocations: 10,
  }
  locator.addressToLocations(geoData, params).then((results) => {
    searchResults.value = results
      .sort((a, b) => a.score - b.score)
      .map((r) => ({
        title: r.address,
        data: {
          point: r.location.toJSON(),
        },
      }))
  })
}

const select = (result: SearchResult) => {
  place.value.address.street = result.title
  place.value.address = Object.assign(
    place.value.address ?? {},
    result.data ?? {}
  )
  console.log(place.value.address)
  searchResults.value = []
}

const submit = () => {
  placeStore.addPlace(place.value)
  router.back()
}
</script>
