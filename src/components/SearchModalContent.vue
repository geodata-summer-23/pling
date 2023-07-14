<template>
  <div class="col" style="height: 100svh">
    <h3 style="text-align: center">{{ $t().searchAddress }}</h3>
    <input
      type="text"
      id="street-address"
      :placeholder="place.address.street"
      @input="(event) => {
        place.address.street = (event.target as HTMLInputElement).value;
        search()
      }"
    />
    <div class="col" style="gap: 2px; background-color: var(--c-medium-gray)">
      <div
        v-for="result in results"
        class="result"
        @click="selectResultAndClear(result)"
      >
        {{ result.address }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  Place,
  searchAddress,
  selectResult,
  defaultPlace,
} from '@/stores/placeStore'
import { $t } from '@/translation'
import { ref } from 'vue'

const props = defineProps<{ place?: Place }>()
const place = ref<Place>(props.place ?? defaultPlace())

const emit = defineEmits<{
  (e: 'select', place: Place): void
}>()

const results = ref<Record<string, any>[]>([])

const search = () => {
  searchAddress(place.value.address, (r) => (results.value = r))
}

const selectResultAndClear = (result: Record<string, any>) => {
  const placeResult = selectResult(result)
  place.value.address = Object.assign(
    place.value.address ?? {},
    placeResult.address
  )
  if (!place.value.nickname) {
    place.value.nickname = placeResult.nickname
  }
  results.value = []
  emit('select', place.value)
}
</script>

<style scoped>
.result {
  padding: 0.5em 1em;
  cursor: pointer;
  background-color: var(--c-white);
}

.result:hover {
  background-color: var(--c-dark-gray);
  cursor: pointer;
}
</style>
