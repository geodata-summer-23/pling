<template>
  <div class="row alert-box">
    <div class="col" style="gap: 0.5em; padding: 1em">
      <h3>{{ translate(props.event.category) }}</h3>
      <div class="row location-box">
        <fa-icon icon="location-dot"></fa-icon>
        <p v-if="props.event.dist <= 100000">{{ props.event.dist }}m unna</p>
        <p v-if="props.event.dist > 1000">>1000m unna</p>
      </div>
      <p>{{ props.event.message }}</p>
    </div>
    <div>
      <img v-if="props.event.imageSrc.length > 0" :src="props.event.imageSrc[0]" alt="" style="height: auto;" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AlertData } from '@/stores/eventStore'
import { translate } from '@/translation'

const props = defineProps<{ event: AlertData }>()
</script>

<style scoped>
.alert-box {
  border: 1px solid var(--c-medium-gray);
  border-radius: 1em;
  box-shadow: 0 0.4em 0.6em var(--c-medium-gray);
  overflow: hidden;
}

.location-box {
  background: #f6f6f6;
  border-radius: 5px;
  align-items: center;
  gap: 1em;
  width: min-content;
  white-space: nowrap;
  padding: 0em 1em;
  flex-shrink: 0;
  font-size: x-small;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
