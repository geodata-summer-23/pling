<template>
  <div class="view col">
    <BackButton @click="router.push({ name: 'home' })"></BackButton>
    <h2>{{ $t().addPlace }}</h2>
    <label for="nickname">{{ $t().name }}</label>
    <input type="text" id="nickname" v-model="place.nickname" />
    <br />
    <label>{{ $t().city }}</label>
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
    <br />
    <label>{{ $t().street }}</label>
    <input
      type="text"
      id="street-address"
      :value="place.address.street"
      @input="(event) => {
        place.address.street = (event.target as HTMLInputElement).value;
        selectedResult = null
      }"
      style="flex: 4"
    />
    <div
      v-if="!selectedResult && results.length > 0"
      class="result-container col"
    >
      <div
        v-for="result in results"
        class="result"
        @click="selectResultAndClear(result)"
      >
        {{ result.address }}
      </div>
    </div>
    <br />
  </div>
  <div class="view-bottom col">
    <button
      class="btn"
      :disabled="!place.nickname || !selectedResult"
      @click="submit"
    >
      {{ $t().add }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import BackButton from '@/components/BackButton.vue'
import {
  Place,
  selectResult,
  usePlaceStore,
  searchAddress,
} from '@/stores/placeStore'
import { ref, watch } from 'vue'
import { router } from '@/router'
import { $t } from '@/translation'

const placeStore = usePlaceStore()
const selectedResult = ref<Record<string, any> | null>(null)
const results = ref<Record<string, any>[]>([])
const place = ref<Place>({ nickname: '', address: {}, excludeDangers: [] })

watch(
  () => [
    place.value.address.city,
    place.value.address.street,
    place.value.address.postalCode,
  ],
  () => {
    searchAddress(place.value.address, (r) => (results.value = r))
  },
  { immediate: true }
)

const selectResultAndClear = (result: Record<string, any>) => {
  selectedResult.value = result
  place.value.address.point = Object.assign(
    place.value.address.point ?? {},
    selectResult(result).address.point
  )
  results.value = []
}

const submit = () => {
  placeStore.addPlace(place.value)
  router.push({ name: 'home' })
}
</script>

<style scoped>
input {
  min-width: 20px;
}
</style>
