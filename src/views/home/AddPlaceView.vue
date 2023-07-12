<template>
  <div class="view col">
    <BackButton @click="router.push({ name: 'home' })"></BackButton>
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
import BackButton from '@/components/BackButton.vue'
import { Place, usePlaceStore } from '@/stores/placeStore'
import { ref } from 'vue'
import { router } from '@/router'
import { $t } from '@/translation'
import PlaceForm from './PlaceForm.vue'

const placeStore = usePlaceStore()
const place = ref<Place>({
  nickname: '',
  icon: 'house',
  address: {},
  excludeDangers: [],
})
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
