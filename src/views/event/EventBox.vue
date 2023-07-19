<template>
  <div class="row event-box">
    <div class="col">
      <div class="row center" style="gap: 0.5em">
        <h3 style="margin: 0">{{ translate(props.event.category) }}</h3>
        <DistanceIndicator :distance="event.distance"></DistanceIndicator>
      </div>
      <p>{{ props.event.summary }}</p>
    </div>
    <div>
      <img
        v-if="props.event.images.length > 0"
        :src="props.event.images[0]"
        alt=""
        style="height: auto"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import DistanceIndicator from '@/components/DistanceIndicator.vue'
import { ObservedEvent } from '@/scripts/alert'
import { translate } from '@/translation'

const props = defineProps<{ event: ObservedEvent }>()
</script>

<style scoped>
.event-box {
  overflow: hidden;
  margin: 2em;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

p {
  margin: 0;
}
</style>
