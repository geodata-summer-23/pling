<template>
  <div class="view">
    <div class="col">
      <label style="font-weight: bold">My Places</label>
      <br />
      <SearchBar
        placeholder="+ Add place"
        :results="searchResults"
        @input="search"
        @select="select"
      ></SearchBar>
      <br />
      <div class="col" style="gap: 0.5em">
        <div
          v-for="(place, i) in placeStore.places"
          class="address-item row spaced clickable"
          @click="clickPlace(place)"
        >
          <div class="col">
            {{ place.name }}
            <span>
              {{ place.address.latitude?.toFixed(2) ?? 'unknown' }} °N
              {{ place.address.longitude?.toFixed(2) ?? 'unknown' }} °E
            </span>
            {{ place.address.street ?? place.address.city }}
          </div>
          <button v-if="i > 0" @click="placeStore.removePlace(place)">X</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SearchBar, { SearchResult } from '@/components/SearchBar.vue'
import * as locator from '@arcgis/core/rest/locator'
import { router } from '@/router'
import { usePlaceStore, Place } from '@/stores/placeStore'
import { ref } from 'vue'

const placeStore = usePlaceStore()
const searchResults = ref<SearchResult[]>([])

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
      }))
  })
}

const select = (result: SearchResult) => {
  placeStore.addPlace(result.title)
  searchResults.value = []
}

const clickPlace = (place: Place) => {
  if (place.address.latitude && place.address.longitude) {
    router.push({
      name: 'map',
      query: {
        latitude: place.address.latitude,
        longitude: place.address.longitude,
      },
    })
  }
}
</script>

<style>
.address-item {
  border: 2px solid lightgray;
  border-radius: 1em;
  padding: 1em;
}
</style>
