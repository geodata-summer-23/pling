<template>
  <div class="view col">
    <BackButton @click="back"></BackButton>
    <h2>User Information</h2>
    <div class="row spaced">
      <label for="signIn">
        {{
          userStore.signedInToArcGis
            ? 'You are signed in with ArcGIS.'
            : 'You are not signed in.'
        }}
      </label>
      <button v-if="!userStore.signedInToArcGis" id="signIn" @click="signIn">
        Sign In
      </button>
    </div>
  </div>
  <div class="view-bottom col">
    <button class="btn" @click="router.push({ name: 'onboarding' })">
      Edit information
    </button>
    <button class="btn" @click="reset">Clear all data</button>
  </div>
</template>

<script lang="ts" setup>
import BackButton from '@/components/BackButton.vue'
import { router } from '@/router'
import { useGeolocationStore } from '@/stores/geolocationStore'
import { usePlaceStore } from '@/stores/placeStore'
import { useUserStore, signIn } from '@/stores/userStore'

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
