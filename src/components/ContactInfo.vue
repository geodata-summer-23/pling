<template>
  <div class="col center spaced">
    <h3 style="margin: 0">{{ $t().contact }}</h3>
    <p>{{ $t().whereToContact }}</p>
    <div class="row center" style="gap: 0.5em">
      <div class="btn col center" @click="onCall">
        <fa-icon icon="phone"></fa-icon>
        <span>{{ $t().call }}</span>
      </div>
      <div class="btn col center" @click="onCall">
        <fa-icon icon="message"></fa-icon>
        <span>{{ $t().message }}</span>
      </div>
      <div class="btn col center" @click="onEmail">
        <fa-icon icon="envelope"></fa-icon>
        <span>{{ $t().email }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { $t } from '@/translation'

const props = defineProps<{
  phoneNumber: string
  email: string
}>()

const onEmail = () => {
  if (!props.email) return
  window.open('mailto:' + props.email)
}

const onCall = () => {
  if (!props.phoneNumber) return
  window.open('tel:' + props.phoneNumber)
}
</script>

<style scoped>
.btn {
  width: 3.5em;
  border-radius: 0.5em;
  color: var(--c-blue);
}
</style>
