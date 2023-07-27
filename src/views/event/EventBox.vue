<template>
  <div class="row event-box">
    <div class="col" style="flex: 3; padding: 0.5em 1em">
      <div class="row" style="gap: 0.5em">
        <h4 style="margin: 0">{{ $text(props.event.category) }}</h4>
        <DistanceIndicator :distance="event.distance"></DistanceIndicator>
      </div>
      <p>{{ props.event.summary }}</p>
    </div>
    <div style="flex: 2">
      <img
        :src="getCategoryIconSrc(event.category, Severity.Critical)"
        style="position: absolute; right: 0.5em; top: 0.5em"
      />
      <img
        v-if="props.event.images.length > 0"
        :src="props.event.images[0]"
        class="cover-img"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import DistanceIndicator from '@/components/DistanceIndicator.vue'
import { ObservedEvent } from '@/scripts/alert'
import { Severity, getCategoryIconSrc } from '@/scripts/category'
import { $text } from '@/translation'

const props = defineProps<{ event: ObservedEvent }>()
</script>

<style scoped>
.event-box {
  position: relative;
  overflow: hidden;
  border-radius: 1em;
  box-shadow: 0 0.4em 0.6em var(--c-medium-gray);
  border: 1px solid var(--c-medium-gray);
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

p {
  margin: 0;
  font-size: 10pt;
}
</style>
