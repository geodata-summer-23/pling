<template>
  <div class="col" style="gap: 0.5em">
    <EventBox 
      v-for="a in alerts" 
      :event="a"
    />
  </div>
</template>


<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { AlertData } from './EventView.vue';
import EventBox from './EventBox.vue';
import { AddressPoint } from '@/stores/placeStore';


const alerts = ref<AlertData[]>([])

const props = defineProps<{point: AddressPoint | undefined}>()

onMounted(() => {
  getAlerts()
})

const getAlerts = async () => {
  if (!props?.point?.latitude || !props?.point?.longitude) {
    console.log(props.point)
    console.error('Invalid position')
    return
  }
  try {
    const response = await fetch(
      `http://localhost:8000/alerts?lat=${props.point.latitude}&lon=${props.point.longitude}`,
      { headers: { 'Content-Type': 'application/json' } }
    )
    alerts.value = JSON.parse(await response.json())
    console.log('got alerts')
  } catch {
    console.log('failed to get alerts')
  }
}

</script>