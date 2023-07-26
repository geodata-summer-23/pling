<template>
  <div class="view col">
    <div class="report-box">
      <h3 style="margin-top: 0.5em; text-align: center">
        {{ $t().wishToReport }}
        <InfoButton
          title="Å dele med nettverket"
          text="<em>Varsle en hendelse</em> og <em>be om hjelp</em> er offentlige innlegg for nettverket. Nettverket er knyttet til din posisjon og du vil bare få opp innlegg innenfor 1 km radius. 
        <br><br>
        <b>Varsle en hendelse</b><br>
        Du kan varsle om en hendelse som er relevante for nettverket å vite om som utdyper om en gitt risiko eller er en risiko som ikke er observert av våre datasett. 
        <br><br>
        <b>Be om hjelp</b><br>
        Forespørsler som blir sendt ut kan godtas av nettverket. Forespørselen beskriver hva du trenger hjelp med i forbindelse med en hendelse ved en av dine lagrede steder."
        ></InfoButton>
      </h3>
      <div class="row" style="gap: 1em">
        <button
          class="btn"
          style="width: 100%; font-size: medium"
          @click="router.push({ name: 'event' })"
        >
          <span> {{ $t().notify }}</span>
          <fa-icon icon="angle-right"></fa-icon>
        </button>
        <button
          class="btn"
          style="width: 100%; font-size: medium"
          @click="router.push({ name: 'help' })"
        >
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
import InfoButton from '@/components/InfoButton.vue'

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
