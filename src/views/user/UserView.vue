<template>
  <div class="view col">
    <div>
      <button @click="router.push({ name: 'home' })">Back</button>
    </div>
    <br />
    <label style="font-weight: bold">User Information</label>
    <br />
    <div class="row spaced">
      <label for="signIn">
        {{
          userStore.signedIn
            ? 'You are signed in with ArcGIS.'
            : 'You are not signed in.'
        }}
      </label>
      <button v-if="!userStore.signedIn" id="signIn" @click="signIn">
        Sign In
      </button>
    </div>
    <br />
    <label for="name">Name:</label>
    <input
      id="name"
      type="text"
      :value="userStore.name"
      @change="userStore.setName(($event.target as HTMLInputElement).value)"
    />
    <label for="age">Age:</label>
    <input
      id="age"
      type="number"
      :value="userStore.age"
      @change="
        userStore.setAge(($event.target as HTMLInputElement).valueAsNumber)
      "
    />
    <br />

    <button @click="router.push({ name: 'nameReg' })">
      Register user data
    </button>
    <br />
    <div>
      <button @click="reset">Clear all data</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { router } from '@/router'
import { useGeolocationStore } from '@/stores/geolocationStore'
import { usePlaceStore } from '@/stores/placeStore'
import { useUserStore, signIn } from '@/stores/userStore'

const userStore = useUserStore()

const reset = () => {
  localStorage.clear()
  userStore.$reset()
  usePlaceStore().$reset()
  useGeolocationStore().$reset()
  location.href = '/'
}
</script>
