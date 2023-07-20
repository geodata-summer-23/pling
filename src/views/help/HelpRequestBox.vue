<template>
  <div class="row help-request-box">
    <div class="col">
      <div class="row center" style="gap: 0.5em">
        <h3 style="margin: 0">{{ $text(helpRequest.category) }}</h3>
        <DistanceIndicator :distance="helpRequest.distance"></DistanceIndicator>
      </div>
      <p>{{ helpRequest.message }}</p>
      <button @click="onAccept">{{ $t().acceptRequest }}</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DistanceIndicator from '@/components/DistanceIndicator.vue'
import { HelpRequest } from '@/stores/helpRequestStore'
import { useModalStore } from '@/stores/modalStore'
import { $t, $text } from '@/translation'
import ContactInfo from '@/components/ContactInfo.vue'

const props = defineProps<{ helpRequest: HelpRequest }>()

const onAccept = () => {
  useModalStore().push(
    ContactInfo,
    {
      email: props.helpRequest.email,
      phoneNumber: props.helpRequest.phoneNumber,
    },
    {}
  )
}
</script>

<style scoped>
.help-request-box {
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
