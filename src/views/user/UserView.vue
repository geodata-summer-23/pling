<template>
  <div class="view col">
    <BackButton @click="back"></BackButton>
    <h2>{{ $t().userInformation }}</h2>
    <div class="row spaced">
      <label for="signIn">
        {{
          userStore.signedInToArcGis ? $t().signedInArcGis : $t().notSignedIn
        }}
      </label>
      <button v-if="!userStore.signedInToArcGis" id="signIn" @click="signIn">
        {{ $t().signIn }}
      </button>
    </div>
  </div>
  <div class="view-bottom col">
    <button class="btn" @click="router.push({ name: 'onboarding' })">
      {{ $t().editInformation }}
    </button>
    <button class="btn" @click="reset">{{ $t().clearAllData }}</button>
  </div>
</template>

<script lang="ts" setup>
import BackButton from '@/components/BackButton.vue'
import { router } from '@/router'
import { useGeolocationStore } from '@/stores/geolocationStore'
import { usePlaceStore } from '@/stores/placeStore'
import { useUserStore, signIn } from '@/stores/userStore'
import { $t } from '@/translation'

const userStore = useUserStore()

const back = () => {
  router.push({ name: 'home' })
}

const reset = () => {
  localStorage.clear()
  userStore.$reset()
  usePlaceStore().$reset()
  useGeolocationStore().$reset()
  location.reload()
}
</script>
