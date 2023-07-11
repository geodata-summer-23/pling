<template>
  <div class="view col">
    <label style="font-weight: bold">Messages</label>
    <br />
    <div class="report-box">
      <h3>{{ $t().wishToReport }}</h3>
      <p>{{ $t().reportInfo }}</p>
      <div class="row center">
        <button class="btn" style="color: red" @click="router.push({ name: 'event' })">Varsle <fa-icon icon="angle-right"></fa-icon> </button>
      </div>

    </div>
    <h3>{{ $t().events }}</h3>
    <p>{{ $t().eventsDescription }}</p>
    <div class="col" style="gap: 0.5em">
      <EventBox 
        v-for="a in alerts" 
        :event="a"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useGeolocationStore } from '@/stores/geolocationStore'
import { router } from '@/router'
import EventBox from '../event/EventBox.vue'
import { AlertData } from '../event/EventView.vue';
import { $t } from '@/translation'

const alerts = ref<AlertData[]>([])


onMounted(() => {
  getAlerts()
})

const getAlerts = async () => {
  const pos = useGeolocationStore().position
  if (!pos?.latitude || !pos?.longitude) {
    console.log(pos)
    console.error('Invalid position')
    return
  }
  try {
    const response = await fetch(
      `http://localhost:8000/alerts?lat=${pos.latitude}&lon=${pos.longitude}`,
      { headers: { 'Content-Type': 'application/json' } }
    )
    alerts.value = JSON.parse(await response.json())
    console.log('got alerts')
  } catch {
    console.log('failed to get alerts')
  }
}
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
