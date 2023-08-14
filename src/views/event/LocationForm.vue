<template>
  <h3>{{ $t().whereEvent }}</h3>
  <div class="col" style="margin: 0 1em">
    <div v-for="place in places" class="row spaced center">
      <label :for="place.title">{{ place.title }}</label>
      <input
        type="radio"
        :id="place.title"
        :name="place.title"
        :value="place.title"
        :checked="location == place.location"
        @click="emit('location', place.location)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Position } from '@/scripts/place'
import { $t } from '@/translation'
import { computed } from 'vue'
import { usePlaceStore } from '@/stores/placeStore'

defineProps<{ location: Position }>()

const emit = defineEmits<{
  (e: 'location', lac: Position): void
}>()

const placeStore = usePlaceStore()

const places = computed(() =>
  placeStore.places.map((p) => ({
    title: p.nickname,
    location: p.address.position,
  }))
)
</script>

<style scoped>
label {
  padding: 0.6em 1em 0.6em 0em;
  width: 100%;
}
</style>
