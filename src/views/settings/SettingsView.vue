<template>
  <div class="col" style="padding: 2em">
    <label for="apiKey">API Key</label>
    <input id="apiKey" v-model="userStore.apiKey" />
    <label for="name">Name</label>
    <input id="name" />
  </div>
  <div>
    <p>
      FETTE BRA MED BONUS
    </p>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
</script>