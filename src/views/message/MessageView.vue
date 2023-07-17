<template>
  <div class="view col">
    <br />
    <div class="report-box">
      <h3>{{ $t().wishToReport }}</h3>
      <p>{{ $t().reportInfo }}</p>
      <div class="row center">
        <button
          class="btn btn-red"
          style="padding-inline: 2em"
          @click="router.push({ name: 'event' })"
        >
          <fa-icon icon="triangle-exclamation"></fa-icon>
          <span> {{ $t().notify }}</span>
          <fa-icon icon="angle-right"></fa-icon>
        </button>
      </div>
    </div>
    <h3>{{ $t().events }}</h3>
    <p>{{ $t().eventsDescription }}</p>
    <EventList :place="usePlaceStore().places[0]"></EventList>
  </div>
</template>

<script lang="ts" setup>
import { router } from '@/router'
import EventList from '../event/EventList.vue'
import { $t } from '@/translation'
import { usePlaceStore } from '@/stores/placeStore'
</script>
