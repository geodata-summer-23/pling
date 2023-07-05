<template>
  <div class="view col">
    <input
      id="given-name"
      type="text"
      placeholder="First name"
      :value="userStore.firstName"
      @change="
        userStore.setFirstName(($event.target as HTMLInputElement).value)
      "
    />
    <input
      id="middleName"
      type="text"
      placeholder="Middle name"
      :value="userStore.middleName"
      @change="
        userStore.setMiddleName(($event.target as HTMLInputElement).value)
      "
    />
    <input
      id="family-name"
      type="text"
      placeholder="Last name"
      :value="userStore.lastName"
      @change="userStore.setLastName(($event.target as HTMLInputElement).value)"
    />
  </div>

  <button @click="router.push({ name: 'birthdayReg' })">Next</button>
</template>

<script lang="ts" setup>
import { router } from '@/router'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
</script>
