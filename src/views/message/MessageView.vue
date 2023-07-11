<template>
  <div class="view col">
    <br />
    <div class="report-box">
      <h3>{{ $t().wishToReport }}</h3>
      <p>{{ $t().reportInfo }}</p>
      <div class="row center">
        <button
          class="btn"
          style="color: var(--c-red)"
          @click="router.push({ name: 'event' })"
        >
          Varsle <fa-icon icon="angle-right"></fa-icon>
        </button>
      </div>
    </div>
    <h3>{{ $t().events }}</h3>
    <p>{{ $t().eventsDescription }}</p>
    <EventList :point="usePlaceStore().places[0].address.point"></EventList>
  </div>
</template>

<script lang="ts" setup>
import { router } from '@/router'
import EventList from '../event/EventList.vue'
import { $t } from '@/translation'
import { usePlaceStore } from '@/stores/placeStore'
</script>

<style>
.alert-box {
  border: 1px solid var(--c-medium-gray);
  border-radius: 1em;
  padding: 1em;
  box-shadow: 0 0.4em 0.6em var(--c-medium-gray);
}

.report-box {
  border: 1px solid var(--c-medium-gray);
  border-radius: 1em;
  padding: 1em;
  box-shadow: 0 0.4em 0.6em var(--c-medium-gray);
}
</style>
