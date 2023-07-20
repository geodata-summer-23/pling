<template>
  <div class="row alert-box">
    <div class="col">
      <div class="row center" style="gap: 0.5em">
        <h3 style="margin: 0">{{ translate(alert.category) }}</h3>
        <DistanceIndicator :distance="alert.distance"></DistanceIndicator>
      </div>
      <p>{{ alert.message }}</p>
    </div>
    <div>
      <img
        v-if="alert.images.length > 0"
        :src="alert.images[0]"
        alt=""
        style="height: auto"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import DistanceIndicator from '@/components/DistanceIndicator.vue'
import { Alert } from '@/scripts/alert'
import { translate } from '@/translation'

defineProps<{ alert: Alert }>()
</script>

<style scoped>
.alert-box {
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
