<template>
  <div class="view col">
    <!-- <IconButton @click="router.push({ name: 'home' })"></IconButton> -->
    <h2 style="margin-top: 2em">{{ $t().edit }}</h2>
    <PlaceForm
      :place="place"
      :edit="true"
      @toggleSubmit="canSubmit = $event"
    ></PlaceForm>
  </div>
  <div class="view-bottom col">
    <button class="btn btn-red" @click="onDelete">
      {{ $t().delete }}
    </button>
    <button class="btn" :disabled="!canSubmit" @click="onSubmit">
      {{ $t().save }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { usePlaceStore } from '@/stores/placeStore'
import { ref } from 'vue'
import { router } from '@/router'
import { $t } from '@/translation'
import PlaceForm from './PlaceForm.vue'
import { Place } from '@/scripts/place'

const placeStore = usePlaceStore()
const place = ref<Place>(JSON.parse(JSON.stringify(placeStore.currentPlace)))
const canSubmit = ref(false)

const onSubmit = () => {
  placeStore.currentPlace = Object.assign(
    placeStore.currentPlace ?? {},
    place.value
  )
  usePlaceStore().saveToLocalStorage()
  router.back()
}

const onDelete = () => {
  if (placeStore.currentPlace) {
    placeStore.removePlace(placeStore.currentPlace)
    placeStore.currentPlace = placeStore.places[0]
  }
  router.back()
}
</script>

<style scoped>
input {
  min-width: 20px;
}
</style>
