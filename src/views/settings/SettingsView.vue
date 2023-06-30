<template>
  <div class="col" style="padding: 2em">
    <!-- <label for="apiKey">API Key</label> -->
    <!-- <input id="apiKey" v-model="userStore.apiKey" /> -->
    <!-- <br /> -->
    <div>
      <label for="signIn">{{
        userStore.signedIn ? 'You are signed in.' : 'Sign In'
      }}</label
      ><br />
      <button v-if="!userStore.signedIn" id="signIn" @click="signIn">
        Sign In
      </button>
    </div>
    <nowcast></nowcast>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore, signIn } from '@/stores/userStore'
import nowcast from '../map/nowcast.vue'

const userStore = useUserStore()
</script>
