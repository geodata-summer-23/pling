<template>
  <h3 style="text-align: center">
    <AddressPosition
      :address="place.address"
      font-size="medium"
    ></AddressPosition>
  </h3>
  <div v-if="metAlertsEvent.length > 0" class="row center" style="gap: 1em">
    <img :src="getCategoryIconSrc(metAlertsEvent as Category)" alt="" />
    <span style="text-align: center">
      {{ $t().dangerOf }} {{ $text(metAlertsEvent) }}
    </span>
  </div>
  <p>
    {{ description }}
  </p>
  <div
    v-if="(place.address.street?.length ?? 0) > 0"
    class="row center"
    style="gap: 1em"
  >
    <button class="btn" @click="analyzePlace">
      <fa-icon icon="magnifying-glass"></fa-icon>
      {{ $t().analyze }}
    </button>
    <button class="btn" @click="addPlace">
      <fa-icon icon="plus"></fa-icon>
      {{ $t().add }}
    </button>
  </div>
  <p v-else style="text-align: center">
    {{ $t().couldNotFindAddress }}
  </p>
</template>

<script lang="ts" setup>
import AddressPosition from './AddressPosition.vue'
import { Category, getCategoryIconSrc } from '@/scripts/category'
import { $t, $text } from '@/translation'
import { Place, Position, getDefaultPlace } from '@/scripts/place'
import { onMounted, ref } from 'vue'
import { positionToAddress } from '@/scripts/search'
import { updatePlace, usePlaceStore } from '@/stores/placeStore'
import { useModalStore } from '@/stores/modalStore'
import { router } from '@/router'

const props = defineProps<{
  metAlertsEvent: string
  description: string
  position: Position
}>()

const placeStore = usePlaceStore()
const modalStore = useModalStore()

const place = ref<Place>({
  ...getDefaultPlace(),
  address: {
    position: props.position,
  },
})

onMounted(async () => {
  await positionToAddress(props.position, place.value.address)
  place.value.nickname = place.value.address.street ?? $t().place
})

const analyzePlace = () => {
  placeStore.currentPlace = place.value
  updatePlace(place.value, { force: true })
  modalStore.pop()
}

const addPlace = () => {
  placeStore.addPlace(place.value)
  placeStore.currentPlace = place.value
  modalStore.pop()
  router.push({ name: 'edit-place' })
}
</script>
