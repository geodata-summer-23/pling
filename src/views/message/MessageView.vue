<template>
  <div class="view col">
    <label style="font-weight: bold">Messages</label>
    <br />
    <button @click="postAlert">I am in danger</button>
    <p v-if="requestState == 'fail'">Failed!</p>
    <p v-if="requestState == 'success'">Success!</p>
    <button @click="getAlerts">Get alerts</button>
    <button @click="router.push({ name: 'event' })">Varsle</button>
    <h3>Hendelser</h3>
    <p>Dette er hendelser som kan påvirke deg</p>
    <div class="col" style="gap: 0.5em">
      <EventBox 
        v-for="a in alerts" 
        :event="a"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useGeolocationStore } from '@/stores/geolocationStore'
import { router } from '@/router'
import EventBox from '../event/EventBox.vue'
import { AlertData } from '../event/EventView.vue';

type RequestState = 'not-sent' | 'fail' | 'success'
const requestState = ref<RequestState>('not-sent')
const alerts = ref<AlertData[]>([])

const postAlert = async () => {
  const pos = useGeolocationStore().position
  if (!pos?.latitude || !pos.longitude) {
    console.error('Invalid position')
    return
  }
  const data = {
    message: 'Help!',
    position: { latitude: pos.latitude, longitude: pos.longitude },
    timestamp: Date.now(),
    category: 'Flood',
  }
  try {
    const response = await fetch(`http://localhost:8000/alert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    requestState.value = response.ok ? 'success' : 'fail'
  } catch {
    requestState.value = 'fail'
  }
}

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
</style>
