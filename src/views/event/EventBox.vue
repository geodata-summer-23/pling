<template>
  <div class="col alert-box" style="gap: 0.5em">
      <p>{{ props.event.category }}</p>
      <div class="row padding" style="background: #F6F6F6; align-items: center; gap: 1em;">
        <fa-icon icon="location-dot"></fa-icon>
        <p>{{ props.event.dist }}m unna</p>
      </div>
      <p>{{ props.event.message }}</p>
  </div>
</template>

<script lang="ts" setup>
import { AlertData } from './EventView.vue';

  const props = defineProps<{ event: AlertData }>()
</script>

<style>
.alert-box {
  border: 1px solid var(--c-medium-gray);
  border-radius: 1em;
  padding: 1em;
  box-shadow: 0 0.4em 0.6em var(--c-medium-gray);
}
</style>