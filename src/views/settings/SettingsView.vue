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
import { useUserStore } from '@/stores/userStore'
import OAuthInfo from '@arcgis/core/identity/OAuthInfo'
import esriId from '@arcgis/core/identity/IdentityManager'
const oAuthInfo = new OAuthInfo({
  appId: 'A0NwPKkEBxfkEBvQ',
})

const userStore = useUserStore()

const signIn = () => {
  esriId.registerOAuthInfos([oAuthInfo])

  esriId.getCredential(oAuthInfo.portalUrl + '/sharing')

  esriId
    .checkSignInStatus(oAuthInfo.portalUrl + '/sharing')
    .then(() => {
      userStore.signedIn = true
    })
    .catch((e: Error) => {
      console.log(e)
      userStore.signedIn = false
    })
}
</script>
