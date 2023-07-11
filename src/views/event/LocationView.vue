<template>
    <h3> {{$t().whereEvent}} </h3>

    <div class="col select">
		<select class="location-select" name="LocationSelect" id="locationSelect">
			<option value="myLocation"> {{ $t().myLocation }} </option>
      <option value="locationOnMap"> {{ $t().selectInMap }}</option>
		</select>
	</div>




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
    emit('location', {latitude: useGeolocationStore().position?.latitude, longitude: useGeolocationStore().position?.longitude})
  })
</script>

<style>
.location-select {
  padding: 1em;
  appearance: initial;
  flex-shrink: 0;
}
</style>