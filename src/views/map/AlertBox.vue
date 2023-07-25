<template>
  <div class="row alert-box">
    <div class="col">
      <p>{{ alert.message }}</p>
      <h4>{{ $t().advices }}</h4>
      <ul>
        <li v-for="advice in alert.advices">{{ advice }}</li>
      </ul>
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
import { Alert } from '@/scripts/alert'
import { $t } from '@/translation'

defineProps<{ alert: Alert }>()
</script>

<style scoped>
.alert-box {
  overflow: hidden;
  margin: 0 2em;
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
