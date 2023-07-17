<template>
  <div class="view col">
    <div class="report-box">
      <h3>{{ $t().wishToReport }}</h3>
      <!-- <p>{{ $t().reportInfo }}</p> -->
      <div class="col" style="gap: 1em">
        <div class="row center">
          <button
            class="btn btn-red"
            style="width: 100%; font-size: medium"
            @click="router.push({ name: 'event' })"
          >
            <fa-icon icon="triangle-exclamation"></fa-icon>
            <span> {{ $t().notify }}</span>
            <fa-icon icon="angle-right"></fa-icon>
          </button>
        </div>
        <div class="row center">
          <button
            class="btn btn-red"
            style="width: 100%; font-size: medium"
            @click="router.push({ name: 'event' })"
          >
            <fa-icon icon="triangle-exclamation"></fa-icon>
            <span> {{ $t().requestHelp }}</span>
            <fa-icon icon="angle-right"></fa-icon>
          </button>
        </div>
      </div>
    </div>
    <GridSelect
      :value="pane"
      :options="[
        { text: $t().events, value: 'events' },
        { text: $t().requests, value: 'requests' },
      ]"
      grid-template="1fr 1fr"
      @change="pane = $event"
    ></GridSelect>
    <EventList
      v-if="pane == 'events'"
      :place="usePlaceStore().places[0]"
    ></EventList>
  </div>
</template>

<script lang="ts" setup>
import { router } from '@/router'
import EventList from '../event/EventList.vue'
import { $t } from '@/translation'
import { usePlaceStore } from '@/stores/placeStore'
import GridSelect from '@/components/GridSelect.vue'
import { ref } from 'vue'

const pane = ref('events')
</script>

<style>
.report-box {
  box-shadow: 0 0.4em 0.6em var(--c-medium-gray);
  padding: 1em 1em;
  border-radius: 2em;
}
</style>
