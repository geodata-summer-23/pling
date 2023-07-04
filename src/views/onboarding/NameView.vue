<template>
  <div>
    <input 
      id="firstName"
      type="text"
      placeholder="First name"
      :value="userStore.firstName"
      @change="userStore.setFirstName(($event.target as HTMLInputElement).value)"
    >
    <input 
      id="middleName"
      type="text"
      placeholder="Middle name"
      :value="userStore.middleName"
      @change="userStore.setMiddleName(($event.target as HTMLInputElement).value)"
    >
    <input 
      id="LastName"
      type="text"
      placeholder="Last name"
      :value="userStore.lastName"
      @change="userStore.setLastName(($event.target as HTMLInputElement).value)"
    >
  </div>
  
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore()

</script>