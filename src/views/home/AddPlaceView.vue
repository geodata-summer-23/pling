<template>
  <div class="view col">
    <IconButton @click="router.push({ name: 'home' })"></IconButton>
    <h2>{{ $t().addPlace }}</h2>
    <PlaceForm
      :place="place"
      :edit="false"
      @toggleSubmit="canSubmit = $event"
    ></PlaceForm>
  </div>
  <div class="view-bottom col">
    <button class="btn" :disabled="!canSubmit" @click="submit">
      {{ $t().add }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import IconButton from '@/components/IconButton.vue'
import { Place, usePlaceStore } from '@/stores/placeStore'
import { ref } from 'vue'
import { router } from '@/router'
import { $t } from '@/translation'
import PlaceForm from './PlaceForm.vue'

const placeStore = usePlaceStore()
const getMyLocation = () => {
  const copy: Place = JSON.parse(JSON.stringify(placeStore.places[0]))
  copy.nickname = ''
  return copy
}
const place = ref<Place>(getMyLocation())
const canSubmit = ref(false)

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
