<template>
  <input
    id="bday"
    type="date"
    :value="userStore.birthday?.toISOString().split('T')[0]"
    @blur="
      userStore.setBirthday(($event.target as HTMLInputElement).valueAsDate)
    "
  />
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
</script>
