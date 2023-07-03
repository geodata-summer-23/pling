<template>
  <div class="view">
    <div class="col">
      <label style="font-weight: bold">My Places</label>
      <br />
      <SearchBar placeholder="+ Add place" @search="search"></SearchBar>
      <br />
      <div class="col" style="gap: 0.5em">
        <div
          v-for="(place, i) in placeStore.places"
          class="address-item row spaced"
        >
          <div class="col">
            {{ place.name }}
            <span
              >{{ place.address.latitude?.toFixed(2) ?? 'unknown' }} °N
              {{ place.address.longitude?.toFixed(2) ?? 'unknown' }} °E</span
            >
            {{ place.address.street ?? place.address.city }}
          </div>
          <button v-if="i > 0" @click="placeStore.removePlace(place)">X</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SearchBar from '@/components/SearchBar.vue'
import { usePlaceStore } from '@/stores/placeStore'

const placeStore = usePlaceStore()

const search = (newSearchString: string) => {
  placeStore.addPlace(newSearchString)
}
</script>

<style>
.address-item {
  border: 2px solid lightgray;
  border-radius: 1em;
  padding: 1em;
}
</style>
