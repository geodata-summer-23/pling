<template>
  <div class="col">
    <HelpRequestBox
      v-for="helpRequest in helpRequestStore.requests"
      :help-request="helpRequest"
    />
  </div>
</template>

<script lang="ts" setup>
import { useHelpRequestStore } from '@/stores/helpRequestStore'
import HelpRequestBox from './HelpRequestBox.vue'

const helpRequestStore = useHelpRequestStore()
</script>
