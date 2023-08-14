<template>
  <h3>{{ $t().overview }}</h3>
  <EventBox :event="observationEvent" :active="false"></EventBox>
</template>

<script lang="ts" setup>
import { $t } from '@/translation'
import EventBox from './EventBox.vue'
import { Observation, ObservedEvent } from '@/scripts/alert'
import { computed } from 'vue'

const props = defineProps<{ event: Observation }>()

const observationEvent = computed(
  () =>
    ({
      ...props.event,
      timeCreated: Date.now(),
      summary: props.event.message,
      images: props.event.image ? [props.event.image] : [],
      distance: 0,
    } satisfies ObservedEvent)
)
</script>
