<template>
  <h3>{{ $t().overview }}</h3>
  <EventBox :event="event"></EventBox>
</template>

<script lang="ts" setup>
import { $t } from '@/translation'
import EventBox from './EventBox.vue'
import { EventData } from '@/scripts/alert'

defineProps<{ event: EventData }>()
</script>
