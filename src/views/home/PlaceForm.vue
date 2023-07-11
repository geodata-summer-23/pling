<template>
  <label for="nickname">{{ $t().name }}</label>
  <input type="text" id="nickname" v-model="place.nickname" />
  <br />
  <label>{{ $t().city }}</label>
  <div class="row" style="gap: 1em">
    <input
      type="number"
      id="postal-code"
      :disabled="edit"
      :value="place.address.postalCode"
      @input="(event) => {
        place.address.postalCode = (
          event.target as HTMLInputElement
          ).valueAsNumber
        search()
      }"
      style="flex: 1"
    />
    <input
      type="text"
      id="city"
      :disabled="edit"
      :value="place.address.city"
      @input="(event) => {
        place.address.city = (event.target as HTMLInputElement).value; 
        search()
      }"
      style="flex: 2"
    />
  </div>
  <br />
  <label>{{ $t().street }}</label>
  <input
    type="text"
    id="street-address"
    :disabled="edit"
    :value="place.address.street"
    @input="(event) => {
      place.address.street = (event.target as HTMLInputElement).value;
      search()
    }"
    style="flex: 4"
  />
  <div>
    <div v-if="results.length > 0" class="result-container col">
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
import { Place, selectResult, searchAddress } from '@/stores/placeStore'
import { ref, watch } from 'vue'
import { $t } from '@/translation'

const props = defineProps<{ place: Place; edit: boolean }>()
const emit = defineEmits<{
  (e: 'toggleSubmit', enabled: boolean): void
}>()

const results = ref<Record<string, any>[]>([])

const tryToggleSubmit = (enabled: boolean = false) => {
  if (!props.place.nickname) {
    emit('toggleSubmit', false)
    return
  }
  if (props.edit) {
    emit('toggleSubmit', true)
    return
  }
  emit('toggleSubmit', enabled)
}

watch(
  () => props.place.nickname,
  () => {
    tryToggleSubmit(true)
  },
  { immediate: true }
)

const search = () => {
  emit('toggleSubmit', false)
  searchAddress(props.place.address, (r) => (results.value = r))
}

const selectResultAndClear = (result: Record<string, any>) => {
  props.place.address = Object.assign(
    props.place.address ?? {},
    selectResult(result).address
  )
  results.value = []
  tryToggleSubmit(true)
}
</script>

<style scoped>
input {
  min-width: 20px;
}
</style>
