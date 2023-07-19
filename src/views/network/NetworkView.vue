<template>
  <div class="view col">
    <div class="report-box">
      <h3 style="margin-top: 0.5em; text-align: center">
        {{ $t().wishToReport }}
      </h3>
      <div class="row" style="gap: 1em">
        <button
          class="btn"
          style="width: 100%; font-size: medium"
          @click="router.push({ name: 'event' })"
        >
          <fa-icon icon="triangle-exclamation"></fa-icon>
          <span> {{ $t().notify }}</span>
          <fa-icon icon="angle-right"></fa-icon>
        </button>
        <button
          class="btn"
          style="width: 100%; font-size: medium"
          @click="router.push({ name: 'help' })"
        >
          <fa-icon icon="triangle-exclamation"></fa-icon>
          <span> {{ $t().requestHelp }}</span>
          <fa-icon icon="angle-right"></fa-icon>
        </button>
      </div>
    </div>
    <h3 style="margin-bottom: 0; text-align: center">
      {{ $t().network }}
    </h3>
    <GridSelect
      :value="pane"
      :options="[
        { text: $t().events, value: 'events' },
        { text: $t().requests, value: 'help-requests' },
      ]"
      grid-template="1fr 1fr"
      @change="pane = $event as Pane"
    ></GridSelect>
    <EventList
      v-if="pane == 'events'"
      :place="usePlaceStore().places[0]"
    ></EventList>
    <HelpRequestList v-if="pane == 'help-requests'"></HelpRequestList>
  </div>
</template>

<script lang="ts" setup>
import EventList from '../event/EventList.vue'
import GridSelect from '@/components/GridSelect.vue'
import HelpRequestList from '../help/HelpRequestList.vue'
import { router } from '@/router'
import { $t } from '@/translation'
import { usePlaceStore } from '@/stores/placeStore'
import { ref } from 'vue'

type Pane = 'events' | 'help-requests'
const pane = ref<Pane>('events')
</script>

<style>
.report-box {
  box-shadow: 0 0.4em 0.6em var(--c-medium-gray);
  padding: 1em 1em;
  border-radius: 2em;
  border: 1px solid var(--c-medium-gray);
}
</style>
