<template>
  <div class="view col">
    <label style="font-weight: bold">Messages</label>
    <br />
    <button @click="postAlert">I am in danger</button>
    <p v-if="requestState == 'fail'">Failed!</p>
    <p v-if="requestState == 'success'">Success!</p>
    <button @click="getAlerts">Get alerts</button>
    <p>Alerts: {{ alerts }}</p>
    <p v-if="alerts.length > 0">Alerts: {{ alerts[0].message }}</p>
    <p>Alerts: {{ typeof alerts }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useGeolocationStore } from '@/stores/geolocationStore'

type RequestState = 'not-sent' | 'fail' | 'success'
const requestState = ref<RequestState>('not-sent')
const alerts = ref<Record<string, any>[]>([])

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
    const response = await fetch(`http://127.0.0.1:8000/alert`, {
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
  if (!pos?.latitude || !pos.longitude) {
    console.error('Invalid position')
    return
  }
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/alerts?lat=${pos.latitude}&lon=${pos.longitude}`,
      { headers: { 'Content-Type': 'application/json' } }
    )
    alerts.value = JSON.parse(await response.json())
    console.log('got alerts')
  } catch {
    console.log('failed to get alerts')
  }
}
</script>
