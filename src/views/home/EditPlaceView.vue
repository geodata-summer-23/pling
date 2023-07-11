<template>
  <div class="view col">
    <BackButton @click="router.push({ name: 'home' })"></BackButton>
    <h2>{{ $t().editPlace }}</h2>
    <PlaceForm
      :place="place"
      :edit="true"
      @toggleSubmit="canSubmit = $event"
    ></PlaceForm>
  </div>
  <div class="view-bottom col">
    <button
      class="btn"
      style="background-color: var(--c-red); color: var(--c-white)"
      @click="onDelete"
    >
      {{ $t().delete }}
    </button>
    <button class="btn" :disabled="!canSubmit" @click="onSubmit">
      {{ $t().save }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import BackButton from '@/components/BackButton.vue'
import { Place, usePlaceStore } from '@/stores/placeStore'
import { ref } from 'vue'
import { router } from '@/router'
import { $t } from '@/translation'
import PlaceForm from './PlaceForm.vue'

const placeStore = usePlaceStore()
const place = ref<Place>(JSON.parse(JSON.stringify(placeStore.currentPlace)))
const canSubmit = ref(false)

const onSubmit = () => {
  placeStore.currentPlace = Object.assign(
    placeStore.currentPlace ?? {},
    place.value
  )
  router.push({ name: 'home' })
}

const onDelete = () => {
  if (placeStore.currentPlace) {
    placeStore.removePlace(placeStore.currentPlace)
    placeStore.currentPlace = placeStore.places[0]
  }
  router.push({ name: 'home' })
}
</script>

<style scoped>
input {
  min-width: 20px;
}
</style>
