<template>
  <div class="view col">
    <input
      id="bday"
      type="date"
      :value="userStore.birthday?.toISOString().split('T')[0]"
      @blur="
        userStore.setBirthday(($event.target as HTMLInputElement).valueAsDate)
      "
    />
  </div>

  <button @click="router.push({ name: 'user' })">Done</button>
</template>

<script lang="ts" setup>
import { router } from '@/router'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
</script>
