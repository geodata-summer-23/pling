<template>
  <div class="col" style="gap: 0.5em">
    <div class="row help-request-box">
      <div class="col">
        <div class="row" style="gap: 0.5em">
          <h4 style="margin: 0">{{ $text(helpRequest.category) }}</h4>
          <DistanceIndicator
            :distance="helpRequest.distance"
          ></DistanceIndicator>
        </div>
        <p>{{ helpRequest.message }}</p>
      </div>
    </div>
    <div class="row" style="justify-content: end">
      <button
        v-if="active"
        class="btn"
        style="font-size: medium"
        @click="onAccept"
      >
        {{ $t().acceptRequest }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DistanceIndicator from '@/components/DistanceIndicator.vue'
import { HelpRequest } from '@/stores/helpRequestStore'
import { useModalStore } from '@/stores/modalStore'
import { $t, $text } from '@/translation'
import ContactInfo from '@/components/ContactInfo.vue'

const props = defineProps<{ helpRequest: HelpRequest; active: boolean }>()

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
  padding: 1em;
  position: relative;
  overflow: hidden;
  border-radius: 1em;
  box-shadow: 0 0.4em 0.6em var(--c-medium-gray);
  border: 1px solid var(--c-medium-gray);
  min-height: 4em;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

p {
  margin: 0;
  font-size: 10pt;
}
</style>
