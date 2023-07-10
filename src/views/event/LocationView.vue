<template>
    <h3> {{$t().whereEvent}} </h3>




</template>

<script lang="ts" setup>
  import { useGeolocationStore } from '@/stores/geolocationStore';
  import { AddressPoint } from '@/stores/placeStore';
  import { $t } from '@/translation'
  import { onUnmounted } from 'vue';

  const emit = defineEmits<{
    (e: 'location', lac: AddressPoint): void
  }>()

  onUnmounted(() => {
    console.log('loc')
    emit('location', {latitude: useGeolocationStore().position?.latitude, longitude: useGeolocationStore().position?.longitude})
  })
</script>