<template>
  <div class="row alert-box">
    <div class="col">
      <div class="row center" style="gap: 0.5em">
        <h3 style="margin: 0">{{ translate(helpRequest.category) }}</h3>
        <div class="row location-box">
          <fa-icon icon="location-dot"></fa-icon>
          <span v-if="helpRequest.dist <= 100000">
            {{ helpRequest.dist }}m unna
          </span>
          <span v-if="helpRequest.dist > 1000">>1000m unna</span>
        </div>
      </div>
      <p>{{ helpRequest.message }}</p>
    </div>
    <div>
      <!-- <img
        v-if="event.imageSrc.length > 0"
        :src="event.imageSrc[0]"
        alt=""
        style="height: auto"
      /> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { HelpRequest } from '@/stores/helpRequestStore'
import { translate } from '@/translation'

defineProps<{ helpRequest: HelpRequest }>()
</script>

<style scoped>
.alert-box {
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
