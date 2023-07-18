<template>
  <div class="row event-box">
    <div class="col">
      <div class="row center" style="gap: 0.5em">
        <h3 style="margin: 0">{{ translate(props.event.category) }}</h3>
        <div class="row location-box">
          <fa-icon icon="location-dot"></fa-icon>
          <span v-if="props.event.distance <= 1000">
            {{ props.event.distance }}m unna
          </span>
          <span v-else>>1000m unna</span>
        </div>
      </div>
      <p>{{ props.event.message }}</p>
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
import { EventData } from '@/scripts/alert'
import { translate } from '@/translation'

const props = defineProps<{ event: EventData }>()
</script>

<style scoped>
.event-box {
  overflow: hidden;
  margin: 2em;
}

.location-box {
  background: #f6f6f6;
  border-radius: 5px;
  align-items: center;
  gap: 1em;
  width: min-content;
  white-space: nowrap;
  padding: 0.5em 1em;
  flex-shrink: 0;
  font-size: x-small;
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
