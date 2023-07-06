<template>
  <h2>What's your birthdate?</h2>
  <div class="col">
    <input
      id="bday"
      type="date"
      :value="userStore.birthday?.toISOString().split('T')[0]"
      @blur="
        userStore.setBirthday(($event.target as HTMLInputElement).valueAsDate)
      "
    />
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
</script>
