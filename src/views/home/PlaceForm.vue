<template>
  <label for="icon">{{ $t().icon }}</label>
  <GridSelect
    :value="place.icon"
    :options="iconOptions"
    grid-template="1fr 1fr 1fr 1fr 1fr 1fr"
    @change="place.icon = $event"
  ></GridSelect>
  <label for="nickname">{{ $t().name }}</label>
  <input
    type="text"
    id="nickname"
    placeholder="Min lokasjon"
    v-model="place.nickname"
  />
  <br />
  <label>{{ $t().address }}</label>
  <div class="row spaced">
    <input
      type="text"
      disabled="true"
      placeholder="Schweigaards gate 28"
      v-model="place.address.street"
    />
    <div>
      <IconButton
        icon="search"
        class="btn-shadow"
        color="var(--c-white)"
        @click="onSearch"
      ></IconButton>
    </div>
  </div>
  <br />
  <label>{{ $t().city }}</label>
  <div class="row spaced" style="gap: 1em">
    <input
      type="text"
      disabled="true"
      placeholder="0191"
      v-model="place.address.postalCode"
    />
    <input
      type="text"
      disabled="true"
      placeholder="Oslo"
      v-model="place.address.city"
    />
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { $t } from '@/translation'
import IconButton from '@/components/IconButton.vue'
import { useModalStore } from '@/stores/modalStore'
import SearchModalContent from '@/components/SearchModalContent.vue'
import GridSelect from '@/components/GridSelect.vue'
import { Place } from '@/stores/place'

const props = defineProps<{ place: Place; edit: boolean }>()
const emit = defineEmits<{
  (e: 'toggleSubmit', enabled: boolean): void
}>()

const iconOptions = [
  { icon: 'location-dot', value: 'location-dot' },
  { icon: 'house', value: 'house' },
  { icon: 'house-chimney-window', value: 'house-chimney-window' },
  { icon: 'building', value: 'building' },
  { icon: 'school', value: 'school' },
  { icon: 'city', value: 'city' },
  { icon: 'campground', value: 'campground' },
  { icon: 'car-side', value: 'car-side' },
  { icon: 'dog', value: 'dog' },
  { icon: 'plane', value: 'plane' },
  { icon: 'briefcase', value: 'briefcase' },
  { icon: 'cart-shopping', value: 'cart-shopping' },
]

const onSearch = () => {
  useModalStore().push(
    SearchModalContent,
    { place: props.place },
    {
      select: () => {
        useModalStore().pop()
      },
    }
  )
}

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
</script>

<style scoped>
input {
  min-width: 20px;
}
</style>
