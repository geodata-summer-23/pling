<template>
  <div class="view col">
    <label style="font-weight: bold">User Information</label>
    <br />
    <div>
      <label for="signIn">
        {{ userStore.signedIn ? 'You are signed in with ArcGIS.' : 'Sign In' }}
      </label>
      <button v-if="!userStore.signedIn" id="signIn" @click="signIn">
        Sign In
      </button>
    </div>
    <br />
    <label for="name">Name:</label>
    <input id="name" type="text" v-model="name" />
    <label for="age">Age:</label>
    <input id="age" type="number" v-model.number="age" />
    <br />
    <label style="font-weight: bold">Weather test</label>
    <Nowcast></Nowcast>
  </div>
</template>

<script lang="ts" setup>
import Nowcast from '../map/Nowcast.vue'
import { useUserStore, signIn } from '@/stores/userStore'
import { ref, onUnmounted } from 'vue'

const userStore = useUserStore()

const name = ref(localStorage.getItem('name') ?? '')
const age = ref(localStorage.getItem('age') ?? '')

onUnmounted(() => {
  if (name.value) {
    localStorage.setItem('name', name.value)
  }
  if (age.value) {
    localStorage.setItem('age', age.value)
  }
})
</script>
