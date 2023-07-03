<template>
  <div class="view col">
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
    <label style="font-weight: bold">Weather test</label>
    <WeatherNowcast></WeatherNowcast>
  </div>
</template>

<script lang="ts" setup>
import WeatherNowcast from '../map/WeatherNowcast.vue'
import { useUserStore, signIn } from '@/stores/userStore'

const userStore = useUserStore()
</script>
