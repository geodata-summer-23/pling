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
  </div>
</template>

<script lang="ts" setup>
import { useUserStore, signIn } from '@/stores/userStore'

const userStore = useUserStore()
</script>
