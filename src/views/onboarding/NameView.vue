<template>
  <input
    id="given-name"
    type="text"
    placeholder="First name"
    :value="userStore.firstName"
    @change="userStore.setFirstName(($event.target as HTMLInputElement).value)"
  />
  <input
    id="middleName"
    type="text"
    placeholder="Middle name"
    :value="userStore.middleName"
    @change="userStore.setMiddleName(($event.target as HTMLInputElement).value)"
  />
  <input
    id="family-name"
    type="text"
    placeholder="Last name"
    :value="userStore.lastName"
    @change="userStore.setLastName(($event.target as HTMLInputElement).value)"
  />
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
</script>
